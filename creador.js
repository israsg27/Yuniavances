'use strict';

(async function startCreator() {
  const byId = id => document.getElementById(id);
  const model = YUNIPET;
  const groups = new Map(model.groups.map(group => [group.id,group]));
  const choices = Object.fromEntries(model.groups.map(group => [group.id,new Map(group.choices.map(choice => [choice.id,choice]))]));
  const palettes = {
    original:{label:'Original',fur:'#ffffff',ear:'#bb9877',tail:'#b18c6a',muzzle:'#efdfca',forelock:'#ab876c',brow:'#705848'},
    miel:{label:'Miel',fur:'#d7ac79',ear:'#a67457',tail:'#ae7958',muzzle:'#ebd6b7',forelock:'#a37555',brow:'#675045'},
    nube:{label:'Nube',fur:'#e2ddda',ear:'#bfb4b7',tail:'#c6b8b6',muzzle:'#f4eae1',forelock:'#c2b6b6',brow:'#786363'},
    ceniza:{label:'Ceniza',fur:'#9294a0',ear:'#6f7080',tail:'#777886',muzzle:'#e4dace',forelock:'#767787',brow:'#565260'},
    cacao:{label:'Cacao',fur:'#96705c',ear:'#71564f',tail:'#775e53',muzzle:'#ddc3a7',forelock:'#75594e',brow:'#51413f'},
    arena:{label:'Arena',fur:'#e1c8a0',ear:'#b9a087',tail:'#bda081',muzzle:'#f2dfc0',forelock:'#bba386',brow:'#756454'},
    noche:{label:'Noche',fur:'#555469',ear:'#413e53',tail:'#494658',muzzle:'#b5a6ac',forelock:'#464457',brow:'#373546'}
  };
  const defaults = {
    orejas:'default_dog_ear_floppy_001',cabeza:'h0',ojos:'a7-05',hocico:'default_any_snout_default02_009',
    nariz:'default_any_nose_nose_001',cola:'default_dog_tail_curly_001',prenda:'camiseta'
  };
  const storageKey = 'yunipets.creador.v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
  if (!saved.piezas) {
    defaults.pelaje='p014';
    defaults.orejas='default_any_ear_pricked_012';
    defaults.prenda='';
  }
  const selected = {};
  for (const group of model.groups) {
    const preferred=saved.piezas?.[group.id];
    selected[group.id] = choices[group.id].has(preferred) || (group.optional && preferred==='') ? preferred :
      (defaults[group.id] || (group.optional?'':group.choices[0].id));
  }
  let palette=Object.hasOwn(palettes,saved.color) ? saved.color : 'original';
  const features=[
    {id:'cola',label:'Cola',icon:'cola.png',group:'cola'},
    {id:'orejas',label:'Orejas',icon:'orejas.png',group:'orejas',types:[['orejas','Colección'],['ensayo','En estudio']]},
    {id:'hocico',label:'Hocico',icon:'hocico.png',group:'hocico',types:[['hocico','Hocico'],['nariz','Nariz']]},
    {id:'frente',label:'Cejas y flequillo',icon:'ojos.png',group:'frente'},
    {id:'ojos',label:'Ojos',icon:'ojos.png',group:'ojos'},
    {id:'rostro',label:'Cabeza',icon:'color.png',group:'cabeza'},
    {id:'pelaje',label:'Patrones',group:'pelaje',preview:'p012'},
    {id:'color',label:'Color',icon:'color.png'},
    {id:'vestuario',label:'Vestuario',group:'prenda',types:[['sets','Conjuntos'],['prenda','Ropa'],['sombrero','Sombreros'],['gafas','Gafas'],['espalda','Espalda'],['manos','Manos'],['pies','Calzado']]}
  ];
  const wardrobe=['Diario','Invierno','Música','Flores','Kimono','Guardia','Dinosaurio','Corona y capa'];
  const clothing=['prenda','sombrero','gafas','espalda','manos','pies'];
  const chips=[
    ['cielo','Cielo','#98bef0'],['indigo','Índigo','#525f9f'],['arcilla','Arcilla','#794444'],
    ['carbon','Carbón','#373d46'],['pizarra','Pizarra','#4b5059'],['humo','Humo','#626d7c'],
    ['plata','Plata','#9f9f9f'],['perla','Perla','#afb4bc'],['niebla','Niebla','#d3d9e0'],
    ['nieve','Nieve','#e7edf5'],['crema','Crema','#f5ddb7']
  ];
  const zoneNames=['Principal','Secundario','Terciario'];
  const imageDir='recap-media/creador/interfaz/';
  const validColor=value=>typeof value==='string' && /^#[0-9a-f]{6}$/i.test(value);
  let customTones=[0,1,2].map(i=>validColor(saved.tonos?.[i])?saved.tonos[i].toLowerCase():null);
  if(!saved.piezas) customTones=['#626d7c','#f5ddb7','#373d46'];
  let feature=features[0],activeGroup='color',activeZone=0;
  const lastGroup={vestuario:'prenda'};
  if(selected.ensayo)lastGroup.orejas='ensayo';
  const fabrics=new YunipetFabrics(model,saved.telas);
  const hiddenEars=[0,1].map(i=>saved.orejasOcultas?.[i]===true);
  let atlas=choices.ojos.get(selected.ojos).atlas;
  const nameInput=byId('pet-name');
  nameInput.value=typeof saved.nombre==='string'?saved.nombre.slice(0,28):'';
  const status=byId('status');
  const viewer=new YunipetViewer(byId('pet'),model);
  const canvas=viewer.canvas;
  const wave=byId('wave');
  viewer.onWave=playing=>{
    wave.setAttribute('aria-pressed',String(playing));
    wave.textContent=playing?'Volver al reposo':'Saludar';
  };
  wave.addEventListener('click',()=>viewer.wave());
  const studio=byId('estudio');
  const portrait=byId('portrait-view');
  function frameFace(enabled,angle) {
    const garment=activeGroup==='prenda' && Boolean(selected.prenda);
    viewer.setView(enabled,garment,angle);
    byId('turntable').dataset.portrait=String(enabled);
    portrait.setAttribute('aria-pressed',String(enabled));
    portrait.textContent=enabled?'Ver cuerpo':garment?'Acercar prenda':'Ver rostro';
  }
  portrait.addEventListener('click',()=>frameFace(!viewer.portrait));
  function save() {
    try {localStorage.setItem(storageKey,JSON.stringify({nombre:nameInput.value,color:palette,piezas:selected,tonos:customTones,telas:fabrics.picks,orejasOcultas:hiddenEars}));} catch {}
  }
  const pattern=()=>choices.pelaje.get(selected.pelaje);
  function tones() {
    const original=pattern()?.tones || ['#ffffff','#ffffff','#ffffff'];
    const tint=palettes[palette].fur;
    return original.map((hex,i)=>{
      if(customTones[i])return customTones[i];
      if(tint==='#ffffff')return hex;
      const result=[1,3,5].map(j=>Math.round(parseInt(hex.slice(j,j+2),16)*parseInt(tint.slice(j,j+2),16)/255));
      return '#'+result.map(n=>n.toString(16).padStart(2,'0')).join('');
    });
  }
  let revision=0,geometryKey='';
  async function draw() {
    const request=++revision;
    const current={};
    for(const group of model.groups) current[group.id]=choices[group.id].get(selected[group.id]);
    save();
    const download=byId('save-portrait');
    download.disabled=true;
    try {
      const textiles={};
      const loads=['prenda','sombrero'].map(async group=>{
        const mesh=current[group]?.parts[0]?.g;
        if(!mesh || !model.fabricGeometry[mesh])return;
        const asset=await fabrics.resolve(mesh);
        if(asset){await viewer.loadFabric(asset);textiles[mesh]=asset.key;}
      });
      await Promise.all([...loads,viewer.loadTexture('eyes',current.ojos.eyeIndex),viewer.loadTexture('coats',current.pelaje?.coatIndex)]);
      if(request!==revision) return;
      const key=JSON.stringify([selected,hiddenEars,current.prenda && textiles[current.prenda.parts[0].g],current.sombrero && textiles[current.sombrero.parts[0].g]]);
      const rgb=tones(),materials={...palettes[palette],fur:pattern()?'#ffffff':rgb[0]};
      if(customTones[0]) materials.ear=materials.tail=materials.forelock=rgb[0];
      if(customTones[1] && pattern()) materials.muzzle=rgb[1];
      if(key===geometryKey) viewer.updateColors(materials,rgb);
      else {viewer.setModel(current,materials,rgb,textiles,hiddenEars);geometryKey=key;}
      download.disabled=false;
    } catch(error) {
      if(request===revision) status.textContent='No se pudo cargar esta combinación. Vuelve a elegir la pieza.';
      console.error(error);
    }
  }
  function button(text,cls='') {
    const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=text;return b;
  }
  function picture(src) {
    const img=document.createElement('img');img.src=src;img.alt='';return img;
  }
  for(const entry of features) {
    const b=button(entry.label);b.dataset.feature=entry.id;
    const thumb=entry.icon?imageDir+entry.icon:(choices[entry.group].get(entry.preview) || groups.get(entry.group).choices[0]).thumb;
    b.prepend(picture(thumb));
    (entry.id==='vestuario'?byId('features'):byId('feature-rail')).append(b);
  }
  function press(b,on) {b.setAttribute('aria-pressed',String(on));}
  const zones=byId('zones'),swatches=byId('palette'),picker=byId('custom-color');
  zoneNames.forEach((label,i)=>{
    const b=button(label,'zone');b.dataset.zone=String(i);zones.append(b);
  });
  for(const [asset,label,hex] of chips) {
    const b=button('','tint');b.dataset.color=hex;b.title=label;b.setAttribute('aria-label',label);
    b.style.setProperty('--chip','url("'+imageDir+asset+'.svg")');swatches.insertBefore(b,picker.parentElement);
  }
  function showColors() {
    const count=pattern()?.zones || 1;
    if(activeZone>=count)activeZone=0;
    const rgb=tones();
    [...zones.children].forEach((b,i)=>{
      b.disabled=i>=count;b.style.setProperty('--zone',i<count?rgb[i]:'#c7d2d8');
      press(b,i===activeZone);
    });
    const note=byId('zone-note');note.hidden=count===3;
    note.textContent=count===2?'Este patrón tiene dos zonas de color.':count===1?'El pelaje liso usa un solo color.':'';
    byId('color-title').textContent='Color '+zoneNames[activeZone].toLowerCase();
    picker.setAttribute('aria-label','Color '+zoneNames[activeZone].toLowerCase()+' a medida');
    picker.value=rgb[activeZone];
    for(const b of swatches.querySelectorAll('[data-color]'))press(b,b.dataset.color===picker.value);
    picker.parentElement.classList.toggle('is-picked',!chips.some(c=>c[2]===picker.value));
    picker.parentElement.style.setProperty('--current',picker.value);
  }
  function setTone(hex) {
    if(!validColor(hex) || customTones[activeZone]===hex.toLowerCase())return;
    customTones[activeZone]=hex.toLowerCase();showColors();draw();
  }
  zones.addEventListener('click',e=>{
    const b=e.target.closest('[data-zone]');if(!b || b.disabled)return;
    activeZone=Number(b.dataset.zone);showColors();
  });
  swatches.addEventListener('click',e=>{
    const b=e.target.closest('[data-color]');if(b)setTone(b.dataset.color);
  });
  picker.addEventListener('input',()=>setTone(picker.value));
  picker.addEventListener('change',()=>setTone(picker.value));
  byId('restore-colors').addEventListener('click',()=>{
    customTones=[null,null,null];palette='original';showColors();draw();
  });
  const sets=wardrobe.map((name,i)=>{
    const set=i+1;
    const pieces=clothing.map(g=>groups.get(g).choices.find(c=>c.set===set));
    return {id:String(set),name,thumb:pieces.find(Boolean)?.thumb,pieces:pieces.map(p=>p?.id || '')};
  });
  sets.unshift({id:'0',name:'Sin vestuario',pieces:clothing.map(()=>'')});
  function currentId() {
    return activeGroup==='sets'?sets.find(s=>s.pieces.every((id,i)=>id===selected[clothing[i]]))?.id:selected[activeGroup];
  }
  function available() {
    if(activeGroup==='sets')return sets;
    const group=groups.get(activeGroup);
    if(activeGroup==='ojos')return group.choices.filter(c=>c.atlas===atlas);
    if(group.optional)return [{id:'',name:activeGroup==='pelaje'?'Liso':'Ninguno'},...group.choices];
    return group.choices;
  }
  const strip=byId('parts-list');
  const motion=viewer.motionPreference;
  let stripCategory=null;
  function moveStrip(delta) {
    strip.scrollBy({left:delta*Math.max(120,strip.clientWidth*.73),behavior:motion.matches?'instant':'smooth'});
  }
  function revealButton(container,b,horizontal,animate=false) {
    if(!b || !container.clientWidth)return;
    const target=b.getBoundingClientRect(),outer=container.getBoundingClientRect();
    const behavior=animate && !motion.matches?'smooth':'instant';
    if(horizontal)container.scrollBy({left:target.left+target.width/2-outer.left-outer.width/2,behavior});
    else if(target.top<outer.top || target.bottom>outer.bottom)container.scrollBy({top:target.top+target.height/2-outer.top-outer.height/2,behavior});
  }
  function stripRange() {
    if(!strip.clientWidth)return;
    const rect=strip.getBoundingClientRect(),buttons=[...strip.children];
    const visible=buttons.map((b,i)=>{const r=b.getBoundingClientRect();return r.right>rect.left+6 && r.left<rect.right-6?i+1:0;}).filter(Boolean);
    byId('choice-count').textContent=visible.length?visible[0]+'–'+visible.at(-1)+' de '+buttons.length:'';
    byId('prev-page').disabled=strip.scrollLeft<=2;
    byId('next-page').disabled=strip.scrollLeft+strip.clientWidth>=strip.scrollWidth-2;
  }
  let scrollFrame=0;
  strip.addEventListener('scroll',()=>{
    if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;stripRange();});
  },{passive:true});
  const featureRail=byId('feature-rail');
  const layoutWidths=new WeakMap();
  const railObserver=new ResizeObserver(entries=>{
    for(const {target,contentRect} of entries) {
      if(contentRect.width && layoutWidths.get(target)!==contentRect.width) {
        layoutWidths.set(target,contentRect.width);
        const horizontal=target===strip || matchMedia('(max-width:700px)').matches;
        revealButton(target,target.querySelector('[aria-pressed=true]'),horizontal);
      }
      if(target===strip)stripRange();
    }
  });
  railObserver.observe(strip);
  railObserver.observe(featureRail);
  function fabricThumbnail(item) {
    const mesh=item.parts?.[0]?.g;
    return model.fabricThumbs[mesh]?.[fabrics.selected(mesh)] || item.thumb;
  }
  function showPage(reveal=false) {
    const list=available(),id=currentId();
    const label=activeGroup==='sets'?'Conjuntos':groups.get(activeGroup).label;
    byId('section-name').textContent=label;
    byId('category-title').textContent=(activeGroup==='sets'?sets.find(c=>c.id===id):choices[activeGroup].get(id))?.name || (activeGroup==='pelaje'?'Liso':activeGroup==='sets'?'A tu gusto':'Ninguno');
    byId('tray-category').textContent=label;
    const category=activeGroup==='ojos'?activeGroup+atlas:activeGroup;
    const changed=category!==stripCategory;
    if(changed) {
      stripCategory=category;
      strip.replaceChildren(...list.map(item=>{
        const b=button('','part-option');b.dataset.option=item.id;b.title=item.name;
        if(item.thumb)b.append(picture(fabricThumbnail(item)));
        else {const mark=document.createElement('span');mark.className='none-thumb';mark.textContent='–';mark.setAttribute('aria-hidden','true');b.append(mark);}
        const caption=document.createElement('span');caption.textContent=item.name;b.append(caption);return b;
      }));
      strip.scrollTo({left:0,behavior:'instant'});
    }
    list.forEach((item,i)=>{
      const b=strip.children[i];press(b,id===item.id);
      if(!changed && model.fabricThumbs[item.parts?.[0]?.g]){
        const img=b.querySelector('img'),src=fabricThumbnail(item);
        if(img.getAttribute('src')!==src)img.src=src;
      }
    });
    const selectedButton=strip.querySelector('[aria-pressed=true]');
    if(reveal && selectedButton)revealButton(strip,selectedButton,true,!changed);
    stripRange();showPieceTools();
  }
  const earPanel=byId('ear-editor'),diagram=byId('ear-diagram');
  function showEars() {
    const specimen=choices.ensayo.get(selected.ensayo) || choices.orejas.get(selected.orejas);
    diagram.style.backgroundImage='url("'+specimen.diagram+'")';
    diagram.style.backgroundPosition=(hiddenEars[0]?'100%':'0')+' '+(hiddenEars[1]?'100%':'0');
    for(const b of diagram.children) {
      const i=Number(b.dataset.ear);
      b.textContent=hiddenEars[i]?'+':'−';press(b,!hiddenEars[i]);
      b.title=(hiddenEars[i]?'Mostrar':'Ocultar')+' oreja '+(i?'derecha':'izquierda')+' en la vista';
      b.setAttribute('aria-label',b.title);
    }
  }
  diagram.addEventListener('click',e=>{
    const b=e.target.closest('[data-ear]');if(!b)return;
    const i=Number(b.dataset.ear);hiddenEars[i]=!hiddenEars[i];showEars();draw();
  });
  earPanel.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)navigate(b.dataset.go);});
  const fabricPanel=byId('fabric-editor'),fileInput=byId('fabric-file');
  const editingMesh=()=>['prenda','sombrero'].includes(activeGroup)?choices[activeGroup].get(selected[activeGroup])?.parts[0]?.g:null;
  let toolRevision=0;
  async function showPieceTools() {
    const rev=++toolRevision;
    earPanel.hidden=feature.id!=='orejas';
    if(!earPanel.hidden)showEars();
    const mesh=editingMesh();fabricPanel.hidden=!model.fabricGeometry[mesh];
    if(fabricPanel.hidden)return;
    const maskAvailable=['Kimono','Flower Dress'].includes(mesh);
    byId('mask-label').hidden=!maskAvailable;
    if(fabricPanel.dataset.mesh!==mesh){byId('rgb-mask').checked=false;fabricPanel.dataset.mesh=mesh;}
    const current=fabrics.selected(mesh);
    const focusFabric=document.activeElement?.dataset.fabric;
    const list=byId('fabric-list');
    const tiles=[{id:'liso',name:'Lisa'},...model.fabrics];
    function swatch(item) {
      const b=button(item.name,'fabric-option');b.dataset.fabric=item.id;press(b,current===item.id);
      if(item.map)b.style.setProperty('--fabric','url("'+item.map+'")');
      return b;
    }
    list.replaceChildren(...tiles.map(swatch));byId('fabric-file-name').textContent='';
    if(focusFabric===current)list.querySelector('[aria-pressed=true]')?.focus({preventScroll:true});
    try {
      const userMap=await fabrics.original(mesh);
      if(rev!==toolRevision || editingMesh()!==mesh || !userMap)return;
      list.append(swatch({id:'archivo',name:'Mi textura',map:userMap.src}));
      if(current==='archivo')byId('fabric-file-name').textContent=userMap.name;
      if(focusFabric==='archivo' && current==='archivo')list.lastElementChild.focus({preventScroll:true});
    } catch { /* The built-in fabrics also work without browser storage. */ }
  }
  byId('fabric-list').addEventListener('click',e=>{
    const b=e.target.closest('[data-fabric]'),mesh=editingMesh();if(!b||!mesh)return;
    fabrics.picks[mesh]=b.dataset.fabric;showPage();draw();
  });
  fileInput.addEventListener('change',async()=>{
    const mesh=editingMesh(),file=fileInput.files[0];fileInput.value='';
    if(!mesh||!file)return;
    const mask=['Kimono','Flower Dress'].includes(mesh) && (byId('rgb-mask').checked || /basecolor.?rgb/i.test(file.name));
    fileInput.disabled=true;
    try {
      const stored=await fabrics.importMap(mesh,file,mask);
      if(feature.id==='vestuario')showPage();
      await draw();status.textContent=stored?'Textura guardada para esta pieza.':'Textura aplicada durante esta sesión.';
    } catch {status.textContent='No se pudo abrir la textura. Elige un PNG, JPG o WebP válido.';}
    finally {fileInput.disabled=false;}
  });
  function showPanel() {
    const isColor=activeGroup==='color';
    for(const name of ['color-editor','color-tray'])byId(name).hidden=!isColor;
    for(const name of ['piece-editor','piece-tray'])byId(name).hidden=isColor;
    for(const b of byId('features').querySelectorAll('[data-feature]'))press(b,b.dataset.feature===feature.id);
    if(isColor) {
      byId('section-name').textContent='Color del pelaje';byId('category-title').textContent=pattern()?.name || 'Liso';
      showColors();return;
    }
    const sub=byId('subgroups');sub.hidden=!feature.types;
    sub.replaceChildren(...(feature.types || []).map(([id,label])=>{
      const b=button(label);b.dataset.group=id;press(b,id===activeGroup);return b;
    }));
    const bar=byId('eye-collections');bar.hidden=activeGroup!=='ojos';
    for(const b of bar.children)press(b,Number(b.dataset.atlas)===atlas);
    byId('edit-colors').hidden=activeGroup!=='pelaje';showPage(true);
  }
  const entrances=new Map();
  function introducePanel(element,offset) {
    entrances.get(element)?.cancel();
    if(motion.matches || document.hidden || !studio.dataset.ready)return;
    const effect=element.animate([{opacity:.78,transform:'translateY('+offset+'px)'},{opacity:1,transform:'translateY(0)'}],
      {duration:210,easing:'cubic-bezier(.2,.75,.25,1)'});
    entrances.set(element,effect);
  }
  motion.addEventListener('change',()=>{if(motion.matches)for(const effect of entrances.values())effect.cancel();});
  function navigate(featureId,type) {
    const previous=activeGroup;
    feature=features.find(f=>f.id===featureId);
    activeGroup=type || lastGroup[featureId] || feature.group || 'color';
    lastGroup[featureId]=activeGroup;
    showPanel();
    frameFace(['ojos','cabeza','hocico','nariz','frente','gafas','orejas','ensayo'].includes(activeGroup),
      ['cola','espalda'].includes(activeGroup)?2.61:0);
    revealButton(featureRail,featureRail.querySelector('[aria-pressed=true]'),matchMedia('(max-width:700px)').matches,Boolean(studio.dataset.ready));
    if(previous!==activeGroup){introducePanel(studio.querySelector('.inspector'),5);introducePanel(studio.querySelector('.tray'),3);}
  }
  byId('features').addEventListener('click',e=>{
    const b=e.target.closest('[data-feature]');if(b)navigate(b.dataset.feature);
  });
  byId('subgroups').addEventListener('click',e=>{
    const b=e.target.closest('[data-group]');if(b){navigate(feature.id,b.dataset.group);byId('subgroups').querySelector('[aria-pressed=true]').focus({preventScroll:true});}
  });
  byId('choose-pattern').addEventListener('click',()=>{navigate('pelaje');byId('features').querySelector('[data-feature=pelaje]').focus({preventScroll:true});});
  byId('edit-colors').addEventListener('click',()=>{navigate('color');zones.querySelector('[aria-pressed=true]').focus({preventScroll:true});});
  byId('eye-collections').addEventListener('click',e=>{
    const b=e.target.closest('[data-atlas]');if(b){atlas=Number(b.dataset.atlas);showPanel();}
  });
  byId('more-features').addEventListener('click',()=>{
    const rail=byId('feature-rail');
    const end=rail.scrollTop+rail.clientHeight>=rail.scrollHeight-3;
    rail.scrollTo({top:end?0:rail.scrollTop+rail.clientHeight*.78,behavior:motion.matches?'instant':'smooth'});
  });
  byId('feature-rail').addEventListener('scroll',()=>{
    const rail=byId('feature-rail');
    const end=rail.scrollTop+rail.clientHeight>=rail.scrollHeight-3;
    byId('more-features').textContent=end?'Primeros rasgos ↑':'Más rasgos ↓';
    byId('more-features').setAttribute('aria-label',end?'Volver a las primeras categorías':'Ver más categorías');
  },{passive:true});
  byId('prev-page').addEventListener('click',()=>moveStrip(-1));
  byId('next-page').addEventListener('click',()=>moveStrip(1));
  strip.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    const items=[...strip.children];let i=items.indexOf(e.target.closest('[data-option]'));
    if(i<0)return;
    e.preventDefault();i=e.key==='Home'?0:e.key==='End'?items.length-1:Math.max(0,Math.min(items.length-1,i+(e.key==='ArrowLeft'?-1:1)));
    items[i].focus({preventScroll:true});revealButton(strip,items[i],true,true);
  });
  byId('parts-list').addEventListener('click',e=>{
    const b=e.target.closest('[data-option]');if(!b)return;
    const id=b.dataset.option;
    if(activeGroup==='sets') {
      sets.find(s=>s.id===id).pieces.forEach((piece,i)=>selected[clothing[i]]=piece);
    } else {
      selected[activeGroup]=id;
      if(activeGroup==='orejas')selected.ensayo='';
      if(['orejas','ensayo'].includes(activeGroup)&&['guardia','dino'].includes(selected.sombrero))selected.sombrero='';
    }
    showPage(true);strip.querySelector('[aria-pressed=true]')?.focus({preventScroll:true});
    if(activeGroup==='prenda')frameFace(Boolean(selected.prenda) && viewer.portrait);
    status.textContent='';draw();
  });
  function pick(list) {return list[Math.floor(Math.random()*list.length)];}
  byId('shuffle').addEventListener('click',()=>{
    for(const group of model.groups){
      if(group.id==='ensayo'){selected.ensayo='';continue;}
      const omitChance=group.id==='pelaje' ? .10 : .64;
      selected[group.id]=group.optional && Math.random()<omitChance ? '' : pick(group.choices).id;
    }
    customTones=zoneNames.map(()=>pick(chips)[2]);palette='original';
    atlas=choices.ojos.get(selected.ojos).atlas;showPanel();draw();status.textContent='Nueva combinación.';
  });
  for(const b of document.querySelectorAll('[data-turn]'))b.addEventListener('click',()=>viewer.rotate(Number(b.dataset.turn)*Math.PI/6));
  byId('front').addEventListener('click',()=>viewer.face(0));
  canvas.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();viewer.rotate(e.key==='ArrowLeft'?-.19:.19);}
    if(e.key==='Home'){e.preventDefault();viewer.face(0);}
  });
  let pointer=null,lastX=0;
  canvas.addEventListener('pointerdown',e=>{
    if(!e.isPrimary)return;pointer=e.pointerId;lastX=e.clientX;canvas.setPointerCapture(pointer);
  });
  canvas.addEventListener('pointermove',e=>{
    if(pointer!==e.pointerId)return;const dx=e.clientX-lastX;lastX=e.clientX;viewer.rotate(-dx*.014,true);
  });
  for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>{pointer=null;});
  nameInput.addEventListener('input',save);
  byId('save-portrait').addEventListener('click',()=>{
    viewer.preparePortrait();
    const name=nameInput.value.trim()||'Mi Yunipet';
    const image=document.createElement('canvas');image.width=960;image.height=1050;
    const ctx=image.getContext('2d');
    const scale=Math.min(950/canvas.width,830/canvas.height);
    const width=canvas.width*scale,height=canvas.height*scale,x=(960-width)/2,y=34+(830-height)/2;
    ctx.drawImage(canvas,x,y,width,height);
    if(viewer.edgeFade>0) {
      const fade=ctx.createLinearGradient(0,y+height*(1-viewer.edgeFade/100),0,y+height);
      fade.addColorStop(0,'transparent');fade.addColorStop(1,'black');
      ctx.globalCompositeOperation='destination-out';ctx.fillStyle=fade;ctx.fillRect(x,y,width,height);
    }
    ctx.globalCompositeOperation='destination-over';
    const bg=ctx.createLinearGradient(0,0,0,1050);
    bg.addColorStop(0,'#f2f6f7');bg.addColorStop(1,'#dce6eb');
    ctx.fillStyle=bg;ctx.fillRect(0,0,960,1050);
    ctx.globalCompositeOperation='source-over';
    ctx.fillStyle='#273448';ctx.textAlign='center';ctx.font='700 49px Sora, sans-serif';ctx.fillText(name,480,932,885);
    ctx.font='500 23px Sora, sans-serif';ctx.fillText('Yunipets! · Creador de personajes',480,987);
    image.toBlob(blob=>{
      if(!blob){status.textContent='No se pudo generar el retrato. Vuelve a intentarlo.';return;}
      const url=URL.createObjectURL(blob),link=document.createElement('a');
      link.href=url;link.download=(name.replace(/[<>:"/\\|?*\x00-\x1F]/g,'').slice(0,48)||'Yunipet')+'.png';
      link.click();setTimeout(()=>URL.revokeObjectURL(url),30000);status.textContent='Retrato listo para guardar.';
    },'image/png');
  });
  const entry=new URLSearchParams(location.search).get('categoria');
  navigate(features.some(f=>f.id===entry)?entry:'orejas');await draw();studio.dataset.ready='true';
})().catch(error=>{
  document.getElementById('status').textContent='El modelo no pudo abrirse. Recarga esta página para volver a intentarlo.';
  console.error(error);
});
