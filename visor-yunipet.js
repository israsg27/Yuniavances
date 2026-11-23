'use strict';

class YunipetViewer {
  constructor(canvas, model) {
    this.canvas = canvas;
    this.model = model;
    // Orbit angle, face framing weight and garment framing weight.
    this.view = new THREE.Vector3(-.16,0,0);
    this.destination = this.view.clone();
    this.motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
    this.cache = new Map();
    this.coatLayouts = new Map();
    this.scene = new THREE.Scene();
    this.subject = new THREE.Group();
    this.scene.add(this.subject);
    this.camera = new THREE.OrthographicCamera();
    this.camera.near = 0.1;
    this.camera.far = 40;
    this.scene.add(new THREE.HemisphereLight(0xfffaf1, 0xe2d8d4, 1.85));
    const key = new THREE.DirectionalLight(0xffefdc, 2.05);
    key.position.set(-3, 5, 4);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xecf6ff, 0.8);
    fill.position.set(3, 2, -3);
    this.scene.add(fill);
    try {
      this.renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true, preserveDrawingBuffer:true});
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    } catch {
      const replacement = canvas.cloneNode(false);
      canvas.replaceWith(replacement);
      this.canvas = replacement;
      this.context = replacement.getContext('2d');
    }
    this.resources = [];
    this.bindings = [];
    this.skinData = new Map();
    this.bones = new Map(YUNI_POSES.bones.map((name,index)=>[name,index]));
    this.idlePose = this.values(YUNI_POSES.idle,Float32Array);
    this.livePose = this.idlePose.slice();
    this.waveFrames = YUNI_POSES.wave.map(frame=>this.values(frame,Float32Array));
    this.materialCache = new Map();
    this.eyes = [];
    this.coats = [];
    this.fabricMaps = new Map();
    this.coatCanvas = document.createElement('canvas');
    this.coatContext = this.coatCanvas.getContext('2d');
    this.srgb = Uint8Array.from({length:4097}, (_,i)=>{
      const x=i/4096;
      return Math.round(255*(x<=.0031308 ? 12.92*x : 1.055*Math.pow(x,1/2.4)-.055));
    });
    this.pendingTextures = new Map();
    this.resizeObserver = new ResizeObserver(() => this.draw());
    this.resizeObserver.observe(this.canvas);
    this.eyeOpening=1;
    this.motionPreference.addEventListener('change',()=>this.syncMotion());
    document.addEventListener('visibilitychange',()=>this.syncMotion());
  }

  values(text, Type) {
    const str = atob(text);
    const bytes = Uint8Array.from(str, ch => ch.charCodeAt(0));
    return new Type(bytes.buffer);
  }

  loadTexture(kind, index) {
    if (index == null || this[kind][index]) return Promise.resolve();
    const key = kind + index;
    if (this.pendingTextures.has(key)) return this.pendingTextures.get(key);
    const load = async () => {
      const img = new Image();
      img.src = this.model[kind][index];
      await img.decode();
      if (this.renderer && kind==='eyes') {
        const texture = new THREE.Texture(img);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        this[kind][index] = {texture};
      } else {
        const sample = document.createElement('canvas');
        sample.width = img.width;
        sample.height = img.height;
        const ctx = sample.getContext('2d');
        ctx.drawImage(img, 0, 0);
        this[kind][index] = {pixels:ctx.getImageData(0, 0, img.width, img.height)};
      }
    };
    const result = load().finally(() => this.pendingTextures.delete(key));
    this.pendingTextures.set(key, result);
    return result;
  }

  async loadFabric(asset) {
    if(!asset || this.fabricMaps.has(asset.key))return;
    const key='fabric/'+asset.key;
    if(this.pendingTextures.has(key))return this.pendingTextures.get(key);
    const load=async()=>{
      const img=new Image();img.src=asset.src;await img.decode();
      if(this.renderer) {
        const texture=new THREE.Texture(img);texture.colorSpace=THREE.SRGBColorSpace;
        if(!asset.key.startsWith('local/')) {
          texture.channel=1;
          texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
        }
        texture.anisotropy=Math.min(4,this.renderer.capabilities.getMaxAnisotropy());texture.needsUpdate=true;
        this.fabricMaps.set(asset.key,{texture});
      } else {
        const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
        const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
        this.fabricMaps.set(asset.key,{pixels:ctx.getImageData(0,0,c.width,c.height)});
      }
    };
    const promise=load().finally(()=>this.pendingTextures.delete(key));
    this.pendingTextures.set(key,promise);return promise;
  }

  paintCoat(index,tones) {
    this.coat=index;
    const key=[index,...tones].join('/');
    if (key===this.paintKey) return;
    this.paintKey=key;
    if (index==null) return;
    const mask=this.coats[index].pixels;
    if (this.coatCanvas.width!==mask.width || this.coatCanvas.height!==mask.height) {
      this.coatCanvas.width=mask.width;
      this.coatCanvas.height=mask.height;
      this.coatPixels=this.coatContext.createImageData(mask.width,mask.height);
    }
    const linear=tones.map(hex=>new THREE.Color(hex).toArray());
    const source=mask.data, target=this.coatPixels.data;
    const contributions=linear[0].map((base,ch)=>({
      base:base*4096,
      red:Float32Array.from({length:256},(_,i)=>i*(linear[1][ch]-base)*4096/255),
      green:Float32Array.from({length:256},(_,i)=>i*(linear[2][ch]-base)*4096/255)
    }));
    for(let i=0;i<source.length;i+=4) {
      const r=source[i],g=source[i+1];
      for(let ch=0;ch<3;ch++) {
        const c=contributions[ch];
        target[i+ch]=this.srgb[Math.max(0,Math.min(4096,Math.round(c.base+c.red[r]+c.green[g])))];
      }
      target[i+3]=255;
    }
    if(this.renderer) {
      this.coatContext.putImageData(this.coatPixels,0,0);
      if(!this.coatTexture) {
        this.coatTexture=new THREE.CanvasTexture(this.coatCanvas);
        this.coatTexture.colorSpace=THREE.SRGBColorSpace;
      }
      this.coatTexture.needsUpdate=true;
    }
  }

  updateColors(palette,tones) {
    this.colors={...this.model.colors,...palette};
    this.paintCoat(this.coat,tones);
    for(const mesh of this.subject.children) {
      const info=mesh.material.userData;
      if(info.role==='eyes'||info.fabric) continue;
      info.color=this.colors[info.role];
      mesh.material.color.set(info.color);
    }
    this.draw();
  }

  coatLayout(name) {
    const textile = this.model.fabricGeometry[name];
    const data = textile || this.model.coatGeometry[name];
    if (!data) return null;
    if (!this.coatLayouts.has(name)) {
      this.coatLayouts.set(name, {
        vertices:this.values(data.vertices, Uint16Array),
        uv:textile ? new THREE.BufferAttribute(this.values(data.uv,Float32Array),2) :
          new THREE.BufferAttribute(this.values(data.uv, Uint16Array), 2, true),
        fabricUV:textile && new THREE.BufferAttribute(this.values(textile.fabricUV,Float32Array),2),
        faces:data.faces
      });
    }
    return this.coatLayouts.get(name);
  }

  geometry(key) {
    if (this.cache.has(key)) return this.cache.get(key);
    const data = this.model.geos[key];
    const original = Float32Array.from(this.values(data.p, Int16Array), n => n / 8192);
    const layout = this.coatLayout(key.split('@')[0]);
    let points = original;
    if (layout) {
      points = new Float32Array(layout.vertices.length * 3);
      layout.vertices.forEach((index, i) => points.set(original.subarray(index*3,index*3+3),i*3));
    }
    const geometries = Object.entries(layout?.faces || data.faces).map(([role, triangles]) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(points, 3));
      if (layout) geo.setAttribute('uv',layout.uv);
      if (layout?.fabricUV) geo.setAttribute('uv1',layout.fabricUV);
      geo.setIndex(new THREE.BufferAttribute(this.values(triangles, Uint16Array), 1));
      this.normals(geo, layout);
      return {geo, role};
    });
    this.cache.set(key, geometries);
    return geometries;
  }

  normals(geo,layout) {
    geo.computeVertexNormals();
    if (!layout) return;
    // UV seams duplicate vertices, but the fur stays smooth across each seam.
    const ns=geo.attributes.normal, sums=new Float32Array(ns.count*3);
    layout.vertices.forEach((v,i)=>{
      sums[v*3]+=ns.getX(i);sums[v*3+1]+=ns.getY(i);sums[v*3+2]+=ns.getZ(i);
    });
    layout.vertices.forEach((v,i)=>ns.setXYZ(i,sums[v*3],sums[v*3+1],sums[v*3+2]));
    geo.normalizeNormals();
  }

  // Subdivide the original eye surface and fit it to the selected head morph.
  eyeSurface(source, head, right) {
    const position = source.getAttribute('position');
    source.computeBoundingBox();
    const {min,max} = source.boundingBox;
    const vertices = [], uvs = [], indices = [];
    const cast = new THREE.Raycaster();
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    const direction = new THREE.Vector3(0,0,-1);
    const index = source.index.array;
    const count = 4;
    for (let i=0; i<index.length; i+=3) {
      a.fromBufferAttribute(position,index[i]);
      b.fromBufferAttribute(position,index[i+1]);
      c.fromBufferAttribute(position,index[i+2]);
      const rows = [];
      for (let j=0; j<=count; j++) {
        const row = [];
        for (let k=0; k<=count-j; k++) {
          const p = a.clone().multiplyScalar(1-(j+k)/count).addScaledVector(b,j/count).addScaledVector(c,k/count);
          cast.set(new THREE.Vector3(p.x,p.y,2),direction);
          const hit = cast.intersectObject(head,false)[0];
          if (hit) p.z = hit.point.z + .009;
          const u = (p.x-min.x)/(max.x-min.x);
          uvs.push(right ? 1-u : u, (p.y-min.y)/(max.y-min.y));
          row.push(vertices.length/3);
          vertices.push(p.x,p.y,p.z);
        }
        rows.push(row);
      }
      for (let j=0;j<count;j++) for (let k=0;k<count-j;k++) {
        indices.push(rows[j][k],rows[j+1][k],rows[j][k+1]);
        if (k<count-j-1) indices.push(rows[j+1][k],rows[j+1][k+1],rows[j][k+1]);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
    geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    this.resources.push(geo);
    return geo;
  }

  material(role, eye, fabric) {
    const color = fabric ? '#ffffff' : this.colors[role] || '#b1a8a2';
    const coat = role==='fur' ? this.coat : undefined;
    const id = fabric ? 'fabric/'+fabric : role === 'eyes' ? role+eye : role+(coat==null?'':'-pattern');
    if (!this.materialCache.has(id)) {
      const mat = role === 'eyes' ? new THREE.MeshBasicMaterial({map:this.eyes[eye]?.texture ?? null,alphaTest:0.38,side:THREE.DoubleSide,toneMapped:false}) :
        new THREE.MeshStandardMaterial({color,map:fabric?this.fabricMaps.get(fabric)?.texture ?? null:coat==null?null:this.coatTexture ?? null,alphaTest:fabric?.startsWith('local/') ? .35 : 0,roughness:0.79,metalness:role==='metal'||role==='gold' ? 0.13 : 0,
          side:THREE.DoubleSide,transparent:role==='glass',opacity:role==='glass'?0.20:1,depthWrite:role!=='glass'});
      mat.userData = {role, color, eye, coat, fabric};
      this.materialCache.set(id,mat);
    }
    const material=this.materialCache.get(id);
    if(role!=='eyes') {
      material.color.set(color);
      material.userData.color=color;
      material.userData.coat=coat;
    }
    return material;
  }

  setModel(choices, palette, tones, fabrics={}, hiddenEars=[false,false]) {
    this.stopWave(false);
    this.subject.clear();
    this.bindings = [];
    this.resources.forEach(g=>g.dispose());
    this.resources = [];
    this.colors = {...this.model.colors,...palette};
    const headChoice = choices.cabeza;
    let head;
    const eye = choices.ojos.eyeIndex;
    this.paintCoat(choices.pelaje?.coatIndex,tones);
    const append = (part, group) => {
      const reference = this.model.fits[part.g]?.[headChoice.shape] || part.g;
      for (const {geo,role} of this.geometry(reference)) {
        let display = geo;
        if (part.g==='Base_Body' && (choices.pies || choices.manos)) {
          // The file provides separate corrections for covering feet and hands.
          const fixes=[];
          if (choices.pies && choices.pies.id!=='tobilleras') fixes.push('Shoes_Fix');
          if (['guantes','cocina','guardia'].includes(choices.manos?.id)) fixes.push('LeftGlove_Fix','RightGlove_Fix');
          if (fixes.length) {
            display = geo.clone();
            const src=geo.attributes.position.array, target=display.attributes.position.array;
            for (const name of fixes) {
              const fix=this.geometry('Base_Body@'+name)[0].geo.attributes.position.array;
              for (let i=0;i<target.length;i++) target[i]+=fix[i]-src[i];
            }
            this.normals(display,this.coatLayout('Base_Body'));
            this.resources.push(display);
          }
        }
        if (role==='eyes') display = this.eyeSurface(geo,head,part.g.endsWith('L'));
        const object = new THREE.Mesh(display,this.material(role,eye,fabrics[part.g]));
        if(['cabeza','orejas','ensayo','frente','sombrero','hocico','nariz','ojos','gafas'].includes(group))object.userData.framing='face';
        if(group==='prenda')object.userData.framing='garment';
        const ear=group==='ensayo'||group==='orejas';
        let left=false;
        if(ear) {
          geo.computeBoundingBox();left=geo.boundingBox.min.x+geo.boundingBox.max.x<0;
          object.visible=!hiddenEars[left?0:1];
        }
        if (group==='nariz') object.position.fromArray(choices.hocico.socket);
        this.subject.add(object);
        this.bindPart(object,part.g,group,false);
        if (group==='cabeza') head=object;
        if (part.mirror) {
          const other = object.clone();
          other.scale.x = -1;
          if(ear)other.visible=!hiddenEars[left?1:0];
          this.subject.add(other);
          this.bindPart(other,part.g,group,true);
        }
      }
    };
    this.model.base.forEach(p=>append(p,'base'));
    headChoice.parts.forEach(p=>append(p,'cabeza'));
    for (const group of this.model.groups) {
      if (group.id==='cabeza' || (group.id==='orejas' && choices.ensayo)) continue;
      if (['orejas','ensayo','frente'].includes(group.id) && ['dino','guardia'].includes(choices.sombrero?.id)) continue;
      choices[group.id]?.parts.forEach(p=>append(p,group.id));
    }
    this.applyPose(this.idlePose);
    const displayedFabrics=new Set(Object.values(fabrics));
    for(const [key,map] of this.fabricMaps) {
      if(!key.startsWith('local/') || displayedFabrics.has(key))continue;
      this.materialCache.get('fabric/'+key)?.dispose();
      this.materialCache.delete('fabric/'+key);
      map.texture?.dispose();
      this.fabricMaps.delete(key);
    }
    this.setEyeOpening(1);
    this.blinkStart=null;
    this.activeEye=eye;
    this.canBlink=choices.ojos.atlas!==9;
    this.scheduleBlink();
    this.draw();
  }

  bindPart(mesh, name, group, mirrored) {
    // Facial pieces share the head socket. Garments retain their own vertex weights.
    const fileName=name.split('@')[0];
    const skin=YUNI_POSES.skin[fileName];
    const rigid={cabeza:'head',ojos:'head',hocico:'head',nariz:'head',frente:'head',cola:'tail',
      orejas:mirrored?'ear_L':'ear_R',ensayo:mirrored?'ear_L':'ear_R'};
    const bone=rigid[group] || skin?.bone || (!skin && ({pies:mirrored?'foot.L':'foot.R',sombrero:'head',gafas:'head',espalda:'spine.002',prenda:'spine.002'}[group] || 'spine'));
    mesh.updateMatrix();
    if(bone) {
      this.bindings.push({mesh,bone:this.bones.get(bone),rest:mesh.matrix.clone()});
      mesh.matrixAutoUpdate=false;
      return;
    }
    if(!this.skinData.has(fileName)) this.skinData.set(fileName,{
      ids:this.values(skin.indices,Uint8Array),weights:this.values(skin.weights,Uint8Array)
    });
    const geo=mesh.geometry.clone();
    this.resources.push(geo);
    mesh.geometry=geo;
    this.bindings.push({mesh,skin:this.skinData.get(fileName),layout:this.coatLayout(fileName),points:geo.attributes.position.array.slice()});
  }

  applyPose(pose) {
    this.framing=null;
    const transform=new THREE.Matrix4();
    for(const binding of this.bindings) {
      const {mesh,skin}=binding;
      if(!skin) {
        const k=binding.bone*12;
        transform.set(pose[k],pose[k+1],pose[k+2],pose[k+3],pose[k+4],pose[k+5],pose[k+6],pose[k+7],pose[k+8],pose[k+9],pose[k+10],pose[k+11],0,0,0,1);
        mesh.matrix.multiplyMatrices(transform,binding.rest);
        mesh.matrixWorldNeedsUpdate=true;
        continue;
      }
      const {points}=binding,attr=mesh.geometry.attributes.position,dest=attr.array;
      for(let i=0;i<attr.count;i++) {
        const j=i*3,x=points[j],y=points[j+1],z=points[j+2];
        let tx=0,ty=0,tz=0;
        for(let b=0;b<4;b++) {
          const id=(binding.layout?.vertices[i] ?? i)*4+b,w=skin.weights[id]/255;
          if(!w)continue;
          const k=skin.ids[id]*12;
          tx+=w*(pose[k]*x+pose[k+1]*y+pose[k+2]*z+pose[k+3]);
          ty+=w*(pose[k+4]*x+pose[k+5]*y+pose[k+6]*z+pose[k+7]);
          tz+=w*(pose[k+8]*x+pose[k+9]*y+pose[k+10]*z+pose[k+11]);
        }
        dest[j]=tx;dest[j+1]=ty;dest[j+2]=tz;
      }
      attr.needsUpdate=true;
      this.normals(mesh.geometry,binding.layout);
      mesh.frustumCulled=false;
    }
  }

  stopWave(reset=true) {
    this.waving=false;
    this.waveRelease=null;
    this.onWave?.(false);
    if(reset){this.applyPose(this.idlePose);this.draw();}
  }

  wave() {
    if(this.waving){
      if(this.motionPreference.matches){this.stopWave();return;}
      this.waveRelease={start:performance.now(),pose:this.livePose.slice()};
      this.waving=false;this.onWave?.(false);this.draw();return;
    }
    this.waving=true;this.onWave?.(true);
    this.waveRelease=null;
    this.waveStart=performance.now();
    if(this.motionPreference.matches){
      this.applyPose(this.waveFrames[Math.floor(this.waveFrames.length*.45)]);
    }
    this.draw();
  }

  sampleWave(now) {
    if(this.motionPreference.matches || (!this.waving && !this.waveRelease))return;
    let a,b,blend,weight;
    if(this.waveRelease){
      a=this.waveRelease.pose;b=this.idlePose;
      blend=THREE.MathUtils.smoothstep(now-this.waveRelease.start,0,175);
      weight=1;
      if(blend===1)this.waveRelease=null;
    }else{
      const duration=YUNI_POSES.duration*1000,elapsed=now-this.waveStart;
      if(elapsed>=duration){this.stopWave(false);this.applyPose(this.idlePose);return;}
      const frame=elapsed/duration*(this.waveFrames.length-1),i=Math.floor(frame);
      a=this.waveFrames[i];b=this.waveFrames[i+1];blend=frame-i;
      weight=THREE.MathUtils.smoothstep(Math.min(elapsed,duration-elapsed),0,140);
    }
    for(let i=0;i<this.livePose.length;i++){
      const target=a[i]+(b[i]-a[i])*blend;
      this.livePose[i]=this.idlePose[i]+(target-this.idlePose[i])*weight;
    }
    this.applyPose(this.livePose);
  }

  setEyeOpening(opening) {
    if(opening===this.eyeOpening)return;
    this.eyeOpening=opening;
    const map=this.eyes[this.activeEye]?.texture;
    if(map){map.repeat.y=1/opening;map.offset.y=(1-map.repeat.y)/2;}
  }

  scheduleBlink() {
    clearTimeout(this.blinkTimer);
    if(!this.canBlink || this.motionPreference.matches || document.hidden)return;
    this.blinkTimer=setTimeout(()=>{this.blinkStart=performance.now();this.draw();},3800+Math.random()*2200);
  }

  sampleBlink(now) {
    if(this.blinkStart==null)return;
    const elapsed=now-this.blinkStart;
    if(elapsed>=190){
      this.blinkStart=null;this.setEyeOpening(1);this.scheduleBlink();return;
    }
    const closed=elapsed<70 ? THREE.MathUtils.smoothstep(elapsed,0,70) :
      1-THREE.MathUtils.smoothstep(elapsed,80,190);
    this.setEyeOpening(1-.94*closed);
  }

  syncMotion() {
    cancelAnimationFrame(this.renderRequest);
    this.renderRequest=0;
    this.move=null;
    this.view.copy(this.destination);
    this.blinkStart=null;
    this.setEyeOpening(1);
    if(this.waving || this.waveRelease){this.stopWave(false);this.applyPose(this.idlePose);}
    this.scheduleBlink();
    if(!document.hidden)this.draw();
  }

  sampleView(now) {
    if(!this.move)return;
    const progress=THREE.MathUtils.smootherstep(now-this.move.start,0,this.move.duration);
    this.view.lerpVectors(this.move.from,this.destination,progress);
    if(progress===1)this.move=null;
  }

  setView(portrait,garment,angle=this.destination.x) {
    this.portrait=portrait;
    this.focusGarment=garment;
    const now=performance.now();
    this.sampleView(now);
    const turn=Math.atan2(Math.sin(angle-this.view.x),Math.cos(angle-this.view.x));
    const target=new THREE.Vector3(this.view.x+turn,Number(portrait&&!garment),Number(portrait&&garment));
    if(this.destination.distanceToSquared(target)<1e-12)return;
    this.destination.copy(target);
    if(this.motionPreference.matches || document.hidden || !this.bindings.length) {
      this.move=null;this.view.copy(target);
    }else{
      this.move={from:this.view.clone(),start:now,duration:Math.min(540,340+Math.abs(turn)*75)};
    }
    this.draw();
  }

  rotate(amount,dragging=false) {
    if(!dragging){this.face(this.destination.x+amount);return;}
    this.view.x+=amount;
    this.destination.x=this.view.x;
    if(this.move)this.move.from.x=this.view.x;
    this.draw();
  }

  face(angle) {this.setView(this.portrait,this.focusGarment,angle);}

  preparePortrait() {
    this.move=null;
    this.view.copy(this.destination);
    this.blinkStart=null;
    this.setEyeOpening(1);
    this.scheduleBlink();
    this.draw();
  }

  // Measure posed vertices in the camera plane, including mirrored and offset pieces.
  measureFraming() {
    const frames={body:new THREE.Box2(),face:new THREE.Box2(),garment:new THREE.Box2()};
    const transform=new THREE.Matrix4(),point=new THREE.Vector2(),extent=new THREE.Box2();
    for(const mesh of this.subject.children) {
      if(!mesh.visible)continue;
      extent.makeEmpty();
      const pos=mesh.geometry.attributes.position, m=transform.multiplyMatrices(this.camera.matrixWorldInverse,mesh.matrixWorld).elements;
      for(let i=0;i<pos.count;i++){
        const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);
        point.set(m[0]*x+m[4]*y+m[8]*z+m[12],m[1]*x+m[5]*y+m[9]*z+m[13]);
        extent.expandByPoint(point);
      }
      frames.body.union(extent);
      if(mesh.userData.framing)frames[mesh.userData.framing].union(extent);
    }
    this.framing=frames;
  }

  frameCamera(aspect) {
    const angle=this.view.x;
    this.camera.position.set(5*Math.sin(angle),.66,5*Math.cos(angle));
    this.camera.lookAt(0,0,0);
    this.camera.updateMatrixWorld();
    if(!this.framing || this.measuredAngle!==angle){
      this.measureFraming();
      this.measuredAngle=angle;
    }
    let cx=0,cy=0,half=0;
    const weights={body:1-this.view.y-this.view.z,face:this.view.y,garment:this.view.z};
    for(const [mode,weight] of Object.entries(weights)){
      if(weight<=0)continue;
      const box=this.framing[mode].isEmpty()?this.framing.body:this.framing[mode];
      if(box.isEmpty())continue;
      const height=box.max.y-box.min.y, width=box.max.x-box.min.x;
      const below=mode==='face'?height*.13:0;
      const margin=mode==='garment'?1.22:1.12;
      let centerY=(box.min.y+box.max.y-below)/2;
      let radius=margin*.5*Math.max(height+below,width/aspect);
      if(mode==='face' && radius>0) {
        // Long ears can put the feet just outside a portrait. Include them when close.
        const missing=Math.max(0,centerY-radius-this.framing.body.min.y+radius*.06);
        const extra=missing*(1-THREE.MathUtils.smoothstep(missing/radius,.30,.52));
        centerY-=extra/2;
        radius+=extra/2;
      }
      cx+=weight*(box.min.x+box.max.x)/2;
      cy+=weight*centerY;
      half+=weight*radius;
    }
    half=half || 1.36;
    this.camera.left=cx-half*aspect;this.camera.right=cx+half*aspect;
    this.camera.bottom=cy-half;this.camera.top=cy+half;
    this.camera.updateProjectionMatrix();
    // Soften the lower edge only when a close-up actually crops the torso.
    const cropped=(this.camera.bottom-this.framing.body.min.y)/(2*half);
    const edge=Math.round(650*THREE.MathUtils.smoothstep(cropped,0,.08))/100;
    if(this.edgeFade!==edge) {
      this.edgeFade=edge;
      this.canvas.style.setProperty('--portrait-edge',edge+'%');
    }
  }

  draw() {
    const now=performance.now();
    this.sampleView(now);
    this.sampleWave(now);
    this.sampleBlink(now);
    const canvas=this.canvas;
    const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);
    const ratio=Math.min(window.devicePixelRatio||1,this.renderer?2:1.25);
    const aspect=w/h;
    this.scene.updateMatrixWorld(true);
    this.frameCamera(aspect);
    if (this.renderer) {
      if(this.lastWidth!==w || this.lastHeight!==h || this.lastRatio!==ratio){
        this.renderer.setPixelRatio(ratio);
        this.renderer.setSize(w,h,false);
        this.lastWidth=w;this.lastHeight=h;this.lastRatio=ratio;
      }
      this.renderer.render(this.scene,this.camera);
    } else {
      if(canvas.width!==Math.round(w*ratio))canvas.width=Math.round(w*ratio);
      if(canvas.height!==Math.round(h*ratio))canvas.height=Math.round(h*ratio);
      this.drawSoftware();
    }
    const moving=this.move || this.waveRelease || (this.waving&&!this.motionPreference.matches) || this.blinkStart!=null;
    if(moving && !this.renderRequest && !document.hidden){
      this.renderRequest=requestAnimationFrame(()=>{this.renderRequest=0;this.draw();});
    }
  }

  // A depth buffer keeps the same meshes usable on devices without WebGL.
  drawSoftware() {
    const ctx=this.context,w=this.canvas.width,h=this.canvas.height;
    const frame=ctx.createImageData(w,h);
    const depth=new Float32Array(w*h).fill(Infinity);
    const screen=new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix,this.camera.matrixWorldInverse);
    const v=new THREE.Vector3();
    const sorted=[...this.subject.children].sort((a,b)=>Number(a.material.transparent)-Number(b.material.transparent));
    for (const mesh of sorted) {
      if(!mesh.visible)continue;
      const geo=mesh.geometry, verts=geo.attributes.position, ns=geo.attributes.normal;
      const mat=mesh.material.userData, eye=mat.role==='eyes';
      const tex=eye?this.eyes[mat.eye]?.pixels:mat.fabric?this.fabricMaps.get(mat.fabric)?.pixels:mat.coat!=null?this.coatPixels:null;
      const hex=parseInt(mat.color.slice(1),16), rgb=[hex>>16,(hex>>8)&255,hex&255];
      const matrix=screen.clone().multiply(mesh.matrixWorld);
      const xs=[],ys=[],zs=[],light=[];
      for (let j=0;j<verts.count;j++) {
        v.fromBufferAttribute(verts,j).applyMatrix4(matrix);
        xs[j]=(v.x*.5+.5)*w;ys[j]=(.5-v.y*.5)*h;zs[j]=v.z;
        light[j]=.77+.26*Math.max(0,-.46*ns.getX(j)*mesh.scale.x+.72*ns.getY(j)+.52*ns.getZ(j));
      }
      const repeat=mat.fabric && !mat.fabric.startsWith('local/');
      const ix=geo.index.array,uv=repeat?geo.attributes.uv1:geo.attributes.uv;
      for(let i=0;i<ix.length;i+=3){
        const a=ix[i],b=ix[i+1],c=ix[i+2];
        const x0=xs[a],x1=xs[b],x2=xs[c],y0=ys[a],y1=ys[b],y2=ys[c];
        const area=(y1-y2)*(x0-x2)+(x2-x1)*(y0-y2);
        if(Math.abs(area)<.0001)continue;
        const lx=Math.max(0,Math.floor(Math.min(x0,x1,x2))),rx=Math.min(w-1,Math.ceil(Math.max(x0,x1,x2)));
        const ty=Math.max(0,Math.floor(Math.min(y0,y1,y2))),by=Math.min(h-1,Math.ceil(Math.max(y0,y1,y2)));
        for(let y=ty;y<=by;y++)for(let x=lx;x<=rx;x++){
          const aa=((y1-y2)*(x+.5-x2)+(x2-x1)*(y+.5-y2))/area;
          const bb=((y2-y0)*(x+.5-x2)+(x0-x2)*(y+.5-y2))/area,cc=1-aa-bb;
          if(aa<0||bb<0||cc<0)continue;
          const p=y*w+x,z=aa*zs[a]+bb*zs[b]+cc*zs[c];
          if(z>=depth[p])continue;
          const dest=p*4;
          if(tex){
            const u0=aa*uv.getX(a)+bb*uv.getX(b)+cc*uv.getX(c);
            const v=aa*uv.getY(a)+bb*uv.getY(b)+cc*uv.getY(c);
            const t0=eye ? .5-(v-.5)/this.eyeOpening : 1-v;
            const u=repeat?u0-Math.floor(u0):Math.max(0,Math.min(1,u0));
            const t=repeat?t0-Math.floor(t0):Math.max(0,Math.min(1,t0));
            const ti=4*(Math.round(t*(tex.height-1))*tex.width+Math.round(u*(tex.width-1)));
            if(tex.data[ti+3]<97)continue;
            const shade=aa*light[a]+bb*light[b]+cc*light[c];
            for(let ch=0;ch<3;ch++)frame.data[dest+ch]=eye?tex.data[ti+ch]:tex.data[ti+ch]*rgb[ch]*shade/255;
          }else{
            const shade=aa*light[a]+bb*light[b]+cc*light[c];
            const mix=mat.role==='glass'&&frame.data[dest+3]?0.18:1;
            for(let ch=0;ch<3;ch++)frame.data[dest+ch]=rgb[ch]*shade*mix+frame.data[dest+ch]*(1-mix);
          }
          depth[p]=z;frame.data[dest+3]=255;
        }
      }
    }
    ctx.putImageData(frame,0,0);
  }
}
