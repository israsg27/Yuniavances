'use strict';

class VisorDeMuebles {
  constructor(container) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.domElement.setAttribute('role','img');
    container.append(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(33,1,.05,30);
    this.center = new THREE.Vector3();
    this.material = new THREE.MeshStandardMaterial({color:0xe5e3dd,roughness:.87,side:THREE.DoubleSide});
    this.scene.add(new THREE.HemisphereLight(0xfff9ec,0xccd7d0,1.75));
    this.key = new THREE.DirectionalLight(0xfff8ed,2.1);
    this.key.castShadow = true;
    this.key.shadow.mapSize.set(512,512);
    this.key.shadow.radius=3;
    Object.assign(this.key.shadow.camera,{left:-2.4,right:2.4,top:2.4,bottom:-2.4,near:.1,far:16});
    this.key.shadow.normalBias=.012; this.key.shadow.bias=-.00025;
    this.scene.add(this.key,this.key.target);
    this.fill = new THREE.DirectionalLight(0xd8e7ff,.65);
    this.scene.add(this.fill,this.fill.target);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.ShadowMaterial({opacity:.12}));
    floor.rotation.x=-Math.PI/2; floor.position.y=-.012; floor.receiveShadow=true; this.scene.add(floor);
    this.observer = new ResizeObserver(()=>this.draw());
    this.observer.observe(container);
    let pointer;
    container.addEventListener('pointerdown',event=>{
      if(pointer || event.button!==0)return;
      pointer={id:event.pointerId,x:event.clientX,y:event.clientY};
      container.setPointerCapture(event.pointerId);
    });
    container.addEventListener('pointermove',event=>{
      if(!pointer || pointer.id!==event.pointerId || !this.mesh)return;
      this.yaw-=(event.clientX-pointer.x)*.012;
      this.pitch=THREE.MathUtils.clamp(this.pitch+(event.clientY-pointer.y)*.009,.04,1.36);
      pointer.x=event.clientX; pointer.y=event.clientY; this.draw();
    });
    container.addEventListener('lostpointercapture',()=>{pointer=null;});
  }

  show(data, view) {
    if(!data)throw Error('Falta la geometría del mueble');
    const bytes=Uint8Array.from(atob(data.base64),v=>v.charCodeAt(0)), size=data.vertices*3;
    const positions=Float32Array.from(new Int16Array(bytes.buffer,0,size),v=>v/12000);
    const normals=new Int8Array(bytes.buffer,size*2,size);
    // Copy the index stream to align 16-bit values after the packed normals.
    const indices=new Uint16Array(bytes.slice(size*3).buffer);
    if(indices.length!==data.indices)throw Error('Índices incompletos');
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    geometry.setAttribute('normal',new THREE.BufferAttribute(normals,3,true));
    geometry.setIndex(new THREE.BufferAttribute(indices,1));
    geometry.computeBoundingSphere();
    this.clear();
    this.mesh=new THREE.Mesh(geometry,this.material); this.mesh.castShadow=true; this.mesh.receiveShadow=true;
    this.scene.add(this.mesh);
    this.center.copy(geometry.boundingSphere.center); this.radius=geometry.boundingSphere.radius;
    this.yaw=THREE.MathUtils.degToRad(view[0]); this.pitch=THREE.MathUtils.degToRad(view[1]);
    this.lightAngle=this.yaw-.9;
    this.renderer.shadowMap.needsUpdate=true;
    this.renderer.domElement.setAttribute('aria-label',document.getElementById('f-piece').textContent+' en 3D');
    this.draw();
  }

  turn(step) {this.yaw+=step*Math.PI/7; this.draw();}

  draw() {
    const {clientWidth:w, clientHeight:h}=this.container;
    if(!this.mesh || !w || !h)return;
    if(this.width!==w || this.height!==h) {
      this.renderer.setSize(w,h,false); this.width=w; this.height=h;
    }
    const camera=this.camera, c=this.center;
    camera.aspect=w/h;
    const halfFov=THREE.MathUtils.degToRad(camera.fov/2);
    const distance=this.radius*1.06/Math.sin(Math.min(halfFov,Math.atan(Math.tan(halfFov)*camera.aspect)));
    camera.position.set(c.x+distance*Math.sin(this.yaw)*Math.cos(this.pitch),c.y+distance*Math.sin(this.pitch),c.z+distance*Math.cos(this.yaw)*Math.cos(this.pitch));
    camera.lookAt(c); camera.updateProjectionMatrix();
    this.key.position.set(c.x+3*Math.sin(this.lightAngle),c.y+6,c.z+3*Math.cos(this.lightAngle)); this.key.target.position.copy(c);
    this.fill.position.set(c.x-3*Math.sin(this.lightAngle),c.y+1.5,c.z-3*Math.cos(this.lightAngle)); this.fill.target.position.copy(c);
    this.renderer.render(this.scene,camera);
  }

  clear() {
    if(!this.mesh)return;
    this.scene.remove(this.mesh); this.mesh.geometry.dispose(); this.mesh=null;
  }
}
