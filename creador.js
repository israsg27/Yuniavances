'use strict';

(async function startCreator() {
  const byId = id => document.getElementById(id);
  const studio=byId('estudio');
  const isWardrobe=studio.dataset.catalogo==='vestuario';
  studio.innerHTML=`  <div class="workbench">
    <section class="look" aria-label="Vista del modelo">
      <div class="turntable" id="turntable">
        <canvas id="pet" aria-label="Modelo del Yunipet en 3D. Arrastra para girarlo o usa las flechas del teclado." tabindex="0"></canvas>
      </div>
      <div class="view-tools" aria-label="Controles de vista">
        <button type="button" data-turn="-1" aria-label="Girar a la izquierda">↶</button>
        <button type="button" id="front" title="Volver a la vista frontal">Frente</button>
        <button type="button" data-turn="1" aria-label="Girar a la derecha">↷</button>
        <button type="button" id="portrait-view" aria-pressed="false">Acercar</button>
      </div>
    </section>
    <section class="inspector" aria-labelledby="category-title">
      <label class="catalog-family">Familia de componentes<select id="features"></select></label>
      <h3 id="category-title">Pelaje</h3>
      <div id="color-editor">
        <div class="zone-list" id="zones" role="group" aria-label="Zona del pelaje"></div>
        <p class="zone-note" id="zone-note" hidden></p>
        <button type="button" class="text-button" id="choose-pattern">Cambiar patrón <span aria-hidden="true">→</span></button>
      </div>
      <div id="piece-editor" hidden>
        <div id="subgroups" class="subgroups" role="group" aria-label="Tipo de pieza"></div>
        <div id="ear-editor" hidden>
          <div id="ear-diagram" class="ear-diagram" aria-label="Visibilidad de las orejas">
            <button type="button" data-ear="0"></button><button type="button" data-ear="1"></button>
          </div>
        </div>
        <fieldset id="outfit-editor" class="iris-editor" hidden>
          <legend>Color de la pieza</legend>
          <select id="outfit-piece" aria-label="Pieza que quieres colorear"></select>
          <div class="swatches" id="outfit-palette">
            <label class="custom-color" title="Elegir otro color"><input type="color" id="outfit-color" aria-label="Color de la pieza a medida"><span aria-hidden="true">+</span></label>
          </div>
        </fieldset>
        <div class="eye-collections subgroups" id="eye-collections" role="group" aria-label="Colecciones de ojos" hidden>
          <button type="button" data-eye-set="miradas">Miradas</button><button type="button" data-eye-set="gestos">Gestos</button>
        </div>
        <fieldset class="iris-editor" id="iris-editor" hidden>
          <legend>Color de ojos</legend>
          <div class="swatches" id="iris-palette">
            <label class="custom-color" title="Elegir otro color de ojos"><input type="color" id="iris-color" aria-label="Color de ojos a medida"><span aria-hidden="true">+</span></label>
          </div>
        </fieldset>
        <button type="button" id="edit-colors" class="text-button" hidden>Editar colores <span aria-hidden="true">→</span></button>
      </div>
      <div class="tray">
        <div id="color-tray">
          <div class="tray-title"><h3 id="color-title">Color principal</h3>
            <button type="button" class="text-button" id="restore-colors">Colores del patrón</button></div>
          <div class="swatches" id="palette" role="group" aria-labelledby="color-title">
            <label class="custom-color" title="Elegir cualquier color"><input type="color" id="custom-color" aria-label="Color a medida"><span aria-hidden="true">+</span></label>
          </div>
        </div>
        <div id="piece-tray" hidden>
          <div class="tray-title"><h3 id="tray-category"></h3>
            <span id="choice-count"></span>
          </div>
          <div class="parts-list" role="group" aria-labelledby="tray-category" id="parts-list"></div>
        </div>
      </div>
    </section>
  </div>`;
  const model = YUNIPET;
  const pendingPacks = new Map();
  model.cargarPaquete = ({geos, eyes, coats, fabricGeometry, maps, skin}) => {
    Object.assign(model.geos, geos);
    Object.assign(YUNI_POSES.skin, skin);
    Object.assign(model.eyes, eyes);
    Object.assign(model.coats, coats);
    Object.assign(model.fabricGeometry, fabricGeometry);
    if (maps) for (const fabric of model.fabrics) fabric.map = maps[fabric.id];
  };
  function loadPack(name) {
    if (!pendingPacks.has(name)) {
      const script = document.createElement('script');
      script.src = 'recap-media/creador/paquetes/' + name + '.js';
      pendingPacks.set(name, new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => {
          pendingPacks.delete(name);
          script.remove();
          reject(new Error('No se pudo cargar ' + name));
        };
        document.head.append(script);
      }));
    }
    return pendingPacks.get(name);
  }
  function loadSelection(current) {
    const needed = new Set();
    for (const choice of Object.values(current)) {
      for (const part of choice?.parts || []) {
        const mesh = model.fits[part.g]?.[current.cabeza.shape] || part.g;
        if (!model.geos[mesh]) needed.add(model.geometryPacks[mesh]);
      }
    }
    if (current.manos || current.pies) needed.add('ajustes');
    return Promise.all([...needed].map(loadPack));
  }
  const groups = new Map(model.groups.map(group => [group.id,group]));
  const heads = groups.get('cabeza');
  groups.set('cabeza', {...heads, choices: heads.choices.filter(head => head.id !== 'h11')});
  const eyes=groups.get('ojos');
  const retiredGestures=new Set(['a9-13','a9-16','a9-18']);
  groups.set('ojos',{...eyes,choices:eyes.choices.filter(eye=>!retiredGestures.has(eye.id))});
  const choices = Object.fromEntries([...groups.values()].map(group => [group.id,new Map(group.choices.map(choice => [choice.id,choice]))]));
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
  const clothing=['prenda','sombrero','gafas','espalda','manos','pies'];
  const husky={cabeza:'h0',pelaje:'p010',orejas:'default_dog_ear_pricked_018',ojos:'a7-05',
    hocico:'default_any_snout_default01_008',nariz:'default_any_nose_nose_002',
    frente:'default_any_forehead_forelock_007',cola:'default_dog_tail_long_004'};
  const storageKey = 'yunipets.creador.v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
  if (!saved.piezas?.cabeza) {
    defaults.pelaje='p014';
    defaults.orejas='default_any_ear_pricked_012';
    defaults.prenda='';
  }
  const selected = {};
  for (const group of model.groups) {
    const preferred=isWardrobe && !clothing.includes(group.id) ? (husky[group.id] || '') : saved.piezas?.[group.id];
    selected[group.id] = choices[group.id].has(preferred) || (group.optional && preferred==='') ? preferred :
      (defaults[group.id] || (group.optional?'':group.choices[0].id));
  }
  if(isWardrobe && !clothing.some(id=>saved.piezas?.[id]!==undefined)) selected.prenda='camiseta';
  let palette=!isWardrobe && Object.hasOwn(palettes,saved.color) ? saved.color : 'original';
  const features=[
    {id:'cola',label:'Cola',group:'cola'},
    {id:'orejas',label:'Orejas',group:'orejas'},
    {id:'hocico',label:'Hocico',group:'hocico',types:[['hocico','Hocico'],['nariz','Nariz']]},
    {id:'frente',label:'Cejas y flequillo',group:'frente'},
    {id:'ojos',label:'Ojos',group:'ojos'},
    {id:'rostro',label:'Cabeza',group:'cabeza'},
    {id:'pelaje',label:'Patrones',group:'pelaje'},
    {id:'color',label:'Color'},
    {id:'vestuario',label:'Vestuario',group:'prenda',types:[['sets','Conjuntos'],['prenda','Ropa'],['sombrero','Sombreros'],['gafas','Gafas'],['espalda','Espalda'],['manos','Manos'],['pies','Calzado']]}
  ].filter(feature => (feature.id === 'vestuario') === isWardrobe);
  const wardrobe=['Diario','Invierno','Música','Flores','Kimono','Guardia','Dinosaurio','Corona y capa'];
  const chips=[
    ['cielo','Cielo','#98bef0'],['indigo','Índigo','#525f9f'],['arcilla','Arcilla','#794444'],
    ['carbon','Carbón','#373d46'],['pizarra','Pizarra','#4b5059'],['humo','Humo','#626d7c'],
    ['plata','Plata','#9f9f9f'],['perla','Perla','#afb4bc'],['niebla','Niebla','#d3d9e0'],
    ['nieve','Nieve','#e7edf5'],['crema','Crema','#f5ddb7'],
    ['arena','Arena','#dfc39a'],['miel','Miel','#dfa552'],['canela','Canela','#b77646'],
    ['cobre','Cobre','#b45e42'],['avellana','Avellana','#986948'],['cacao','Cacao','#664938'],
    ['cafe','Café oscuro','#46342d'],['negro','Negro','#24272b'],['durazno','Durazno','#efb39b'],
    ['rosa','Rosa','#db9daf'],['lavanda','Lavanda','#b6a3d3'],['salvia','Salvia','#9bb8a0'],
    ['turquesa','Turquesa','#6ab9b4']
  ];
  const amber='#f0bc5a';
  const irisChips=[['Ámbar',amber],['Avellana','#99613d'],['Jade','#54a47e'],['Azul','#508ac8'],
    ['Turquesa','#4cb5c5'],['Violeta','#9374bd'],['Gris','#83939d']];
  const zoneNames=['Principal','Secundario','Terciario'];
  const validColor=value=>typeof value==='string' && /^#[0-9a-f]{6}$/i.test(value);
  let customTones=[0,1,2].map(i=>validColor(saved.tonos?.[i])?saved.tonos[i].toLowerCase():null);
  if(!saved.piezas?.cabeza) customTones=['#626d7c','#f5ddb7','#373d46'];
  if(isWardrobe)customTones=['#626d7c','#f9efe2','#383e4a'];
  let feature=features[0],activeGroup='color',activeZone=0;
  const lastGroup={vestuario:'prenda'};
  const earVariants=[...choices.orejas.values(),...choices.ensayo.values()];
  const selectedEar=()=>choices.ensayo.get(selected.ensayo) || choices.orejas.get(selected.orejas);
  const outfitColors={};
  for(const [key,hex] of Object.entries(saved.coloresRopa || {})) {
    if(validColor(hex))outfitColors[key]=hex.toLowerCase();
  }
  const defaultClothColor='#7796b8';
  const pieceKey=group=>group+'/'+selected[group];
  const pieceColor=group=>outfitColors[pieceKey(group)] || defaultClothColor;
  const hiddenEars=[0,1].map(i=>!isWardrobe && saved.orejasOcultas?.[i]===true);
  const collectionFor=eye=>eye.atlas===9?'gestos':'miradas';
  let eyeSet=collectionFor(choices.ojos.get(selected.ojos));
  let irisColor=isWardrobe?'#52b8e0':validColor(saved.iris)?saved.iris.toLowerCase():amber;
  const status=byId('status');
  const viewer=new YunipetViewer(byId('pet'),model);
  const canvas=viewer.canvas;
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
    try {
      const stored=JSON.parse(localStorage.getItem(storageKey)) || saved;
      const piezas={...stored.piezas};
      for (const [id,value] of Object.entries(selected)) {
        if (clothing.includes(id) === isWardrobe) piezas[id]=value;
      }
      const changes=isWardrobe ? {coloresRopa:outfitColors} : {color:palette,tonos:customTones,iris:irisColor,orejasOcultas:hiddenEars};
      localStorage.setItem(storageKey,JSON.stringify({...stored,...changes,piezas}));
    } catch {}
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
    for(const group of model.groups) {
      if (isWardrobe || !clothing.includes(group.id)) current[group.id]=choices[group.id].get(selected[group.id]);
    }
    save();
    canvas.setAttribute('aria-busy','true');
    try {
      await Promise.all([loadSelection(current),viewer.loadTexture('eyes',current.ojos.eyeIndex),viewer.loadTexture('coats',current.pelaje?.coatIndex)]);
      if(request!==revision) return;
      if(collectionFor(current.ojos)==='miradas') viewer.paintIris(current.ojos.eyeIndex,irisColor);
      showIris();
      const key=JSON.stringify([selected,hiddenEars]);
      const rgb=tones(),materials={...palettes[palette],fur:pattern()?'#ffffff':rgb[0]};
      if(customTones[0]) materials.ear=materials.tail=materials.forelock=rgb[0];
      if(customTones[1] && pattern()) materials.muzzle=rgb[1];
      if(isWardrobe) for(const group of clothing) materials[group]=pieceColor(group);
      if(key===geometryKey) viewer.updateColors(materials,rgb);
      else {viewer.setModel(current,materials,rgb,{},hiddenEars);geometryKey=key;}
      canvas.setAttribute('aria-busy','false');
      status.textContent='';
    } catch(error) {
      if(request===revision) {canvas.setAttribute('aria-busy','false');status.textContent='No se pudo cargar esta combinación. Vuelve a elegir la pieza.';}
      console.error(error);
    }
  }
  function button(text,cls='') {
    const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=text;return b;
  }
  function picture(src) {
    const img=document.createElement('img');img.loading='lazy';img.decoding='async';img.src=src;img.alt='';return img;
  }
  const familySelect=byId('features');
  for(const entry of features) familySelect.add(new Option(entry.label,entry.id));
  familySelect.closest('label').hidden=isWardrobe;
  function press(b,on) {b.setAttribute('aria-pressed',String(on));}
  const zones=byId('zones'),swatches=byId('palette'),picker=byId('custom-color');
  zoneNames.forEach((label,i)=>{
    const b=button(label,'zone');b.dataset.zone=String(i);zones.append(b);
  });
  function addSwatch(label,hex,container,input) {
    const b=button('','tint');b.dataset.color=hex;b.title=label;b.setAttribute('aria-label',label);
    b.style.setProperty('--chip',hex);container.insertBefore(b,input.parentElement);
  }
  for(const [,label,hex] of chips) addSwatch(label,hex,swatches,picker);
  const irisPicker=byId('iris-color'),irisPalette=byId('iris-palette');
  for(const [label,hex] of irisChips) addSwatch(label,hex,irisPalette,irisPicker);
  function showIris() {
    const eye=choices.ojos.get(selected.ojos);
    const field=byId('iris-editor');
    field.hidden=activeGroup!=='ojos' || eyeSet!=='miradas' || collectionFor(eye)!=='miradas' || !viewer.eyes[eye.eyeIndex]?.irisPixels.length;
    if(field.hidden)return;
    irisPicker.value=irisColor;
    for(const b of irisPalette.querySelectorAll('[data-color]'))press(b,b.dataset.color===irisColor);
    irisPicker.parentElement.classList.toggle('is-picked',!irisChips.some(([,hex])=>hex===irisColor));
    irisPicker.parentElement.style.setProperty('--current',irisColor);
  }
  function setIris(hex) {
    if(!validColor(hex) || hex===irisColor)return;
    irisColor=hex;showIris();draw();
  }
  irisPalette.addEventListener('click',e=>{
    const b=e.target.closest('[data-color]');if(b)setIris(b.dataset.color);
  });
  irisPicker.addEventListener('input',()=>setIris(irisPicker.value));
  irisPicker.addEventListener('change',()=>setIris(irisPicker.value));
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
    if(activeGroup==='orejas')return selectedEar().id;
    return activeGroup==='sets'?sets.find(s=>s.pieces.every((id,i)=>id===selected[clothing[i]]))?.id:selected[activeGroup];
  }
  function available() {
    if(activeGroup==='sets')return sets;
    if(activeGroup==='orejas')return earVariants;
    const group=groups.get(activeGroup);
    if(activeGroup==='ojos')return group.choices.filter(c=>collectionFor(c)===eyeSet);
    if(group.optional)return [{id:'',name:activeGroup==='pelaje'?'Liso':'Ninguno'},...group.choices];
    return group.choices;
  }
  const strip=byId('parts-list');
  const motion=viewer.motionPreference;
  let stripCategory=null;
  function revealVariant(b) {
    if (!b) return;
    const row=b.getBoundingClientRect(), box=strip.getBoundingClientRect();
    if (row.top < box.top || row.bottom > box.bottom) strip.scrollTop += row.top-box.top;
  }
  function showPage(reveal=false) {
    const list=available(),id=currentId();
    const label=activeGroup==='sets'?'Conjuntos':groups.get(activeGroup).label;
    byId('choice-count').textContent=list.length + (list.length === 1 ? ' variante' : ' variantes');
    const selectedItem=activeGroup==='orejas'?selectedEar():activeGroup==='sets'?sets.find(c=>c.id===id):choices[activeGroup].get(id);
    byId('category-title').textContent=selectedItem?.name || (activeGroup==='pelaje'?'Liso':activeGroup==='sets'?'A tu gusto':'Ninguno');
    byId('tray-category').textContent=label;
    const category=activeGroup==='ojos'?activeGroup+eyeSet:activeGroup;
    const changed=category!==stripCategory;
    if(changed) {
      stripCategory=category;
      strip.replaceChildren(...list.map(item=>{
        const b=button('','part-option');b.dataset.option=item.id;b.title=item.name;
        if(item.thumb)b.append(picture(item.thumb));
        else {const mark=document.createElement('span');mark.className='none-thumb';mark.textContent='–';mark.setAttribute('aria-hidden','true');b.append(mark);}
        const caption=document.createElement('span');caption.textContent=item.name;b.append(caption);return b;
      }));
      strip.scrollTop=0;
    }
    list.forEach((item,i)=>{
      const b=strip.children[i];press(b,id===item.id);
    });
    const selectedButton=strip.querySelector('[aria-pressed=true]');
    if(reveal && selectedButton)revealVariant(selectedButton);
    showPieceTools();
    showIris();
  }
  const earPanel=byId('ear-editor'),diagram=byId('ear-diagram');
  function showEars() {
    const specimen=selectedEar();
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
  const outfitEditor=byId('outfit-editor'),outfitPiece=byId('outfit-piece');
  const outfitPicker=byId('outfit-color'),outfitPalette=byId('outfit-palette');
  const outfitChips=[['Azul',defaultClothColor],['Marino','#354664'],['Coral','#dc816e'],['Mostaza','#daac57'],
    ['Salvia','#87a890'],['Lila','#ad99c5'],['Marfil','#efe8da'],['Carbón','#45474c']];
  for(const [label,hex] of outfitChips)addSwatch(label,hex,outfitPalette,outfitPicker);
  function showOutfitColors() {
    const hex=pieceColor(outfitPiece.value);
    outfitPicker.value=hex;
    outfitPicker.parentElement.style.setProperty('--current',hex);
    outfitPicker.parentElement.classList.toggle('is-picked',!outfitChips.some(([,color])=>color===hex));
    for(const b of outfitPalette.querySelectorAll('[data-color]'))press(b,b.dataset.color===hex);
  }
  function showPieceTools() {
    earPanel.hidden=feature.id!=='orejas';
    if(!earPanel.hidden)showEars();
    if(!isWardrobe)return;
    const equipped=(activeGroup==='sets'?clothing:[activeGroup]).filter(id=>selected[id]);
    outfitEditor.hidden=!equipped.length;
    if(outfitEditor.hidden)return;
    const previous=outfitPiece.value;
    outfitPiece.replaceChildren(...equipped.map(id=>new Option(choices[id].get(selected[id]).name,id)));
    if(equipped.includes(previous))outfitPiece.value=previous;
    outfitPiece.hidden=equipped.length===1;
    showOutfitColors();
  }
  function setOutfitColor(hex) {
    const group=outfitPiece.value;
    if(!group || !validColor(hex) || pieceColor(group)===hex)return;
    outfitColors[pieceKey(group)]=hex;showOutfitColors();draw();
  }
  outfitPiece.addEventListener('change',showOutfitColors);
  outfitPalette.addEventListener('click',e=>{
    const b=e.target.closest('[data-color]');if(b)setOutfitColor(b.dataset.color);
  });
  outfitPicker.addEventListener('input',()=>setOutfitColor(outfitPicker.value));
  outfitPicker.addEventListener('change',()=>setOutfitColor(outfitPicker.value));
  function showPanel() {
    const isColor=activeGroup==='color';
    for(const name of ['color-editor','color-tray'])byId(name).hidden=!isColor;
    for(const name of ['piece-editor','piece-tray'])byId(name).hidden=isColor;
    familySelect.value=feature.id;
    if(isColor) {
      byId('category-title').textContent=pattern()?.name || 'Liso';
      showColors();return;
    }
    const sub=byId('subgroups');sub.hidden=!feature.types;
    sub.replaceChildren(...(feature.types || []).map(([id,label])=>{
      const b=button(label);b.dataset.group=id;press(b,id===activeGroup);return b;
    }));
    const bar=byId('eye-collections');bar.hidden=activeGroup!=='ojos';
    for(const b of bar.children)press(b,b.dataset.eyeSet===eyeSet);
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
    const backView = id => ['cola','espalda'].includes(id);
    const angle = backView(activeGroup) !== backView(previous) ? (backView(activeGroup) ? 2.61 : 0) : undefined;
    frameFace(Boolean(viewer.portrait),angle);
    if(previous!==activeGroup){introducePanel(studio.querySelector('.inspector'),5);introducePanel(studio.querySelector('.tray'),3);}
  }
  familySelect.addEventListener('change',()=>navigate(familySelect.value));
  byId('subgroups').addEventListener('click',e=>{
    const b=e.target.closest('[data-group]');if(b){navigate(feature.id,b.dataset.group);byId('subgroups').querySelector('[aria-pressed=true]').focus({preventScroll:true});}
  });
  byId('choose-pattern').addEventListener('click',()=>{navigate('pelaje');familySelect.focus({preventScroll:true});});
  byId('edit-colors').addEventListener('click',()=>{navigate('color');zones.querySelector('[aria-pressed=true]').focus({preventScroll:true});});
  byId('eye-collections').addEventListener('click',e=>{
    const b=e.target.closest('[data-eye-set]');if(b){eyeSet=b.dataset.eyeSet;showPanel();}
  });
  strip.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    const items=[...strip.children];let i=items.indexOf(e.target.closest('[data-option]'));
    if(i<0)return;
    e.preventDefault();i=e.key==='Home'?0:e.key==='End'?items.length-1:Math.max(0,Math.min(items.length-1,i+(e.key==='ArrowLeft'?-1:1)));
    items[i].focus({preventScroll:true});revealVariant(items[i]);
  });
  byId('parts-list').addEventListener('click',e=>{
    const b=e.target.closest('[data-option]');if(!b)return;
    const id=b.dataset.option;
    if(activeGroup==='sets') {
      sets.find(s=>s.id===id).pieces.forEach((piece,i)=>selected[clothing[i]]=piece);
    } else if(activeGroup==='orejas' && choices.ensayo.has(id)) {
      selected.ensayo=id;
    } else {
      selected[activeGroup]=id;
      if(activeGroup==='orejas')selected.ensayo='';
    }
    showPage(true);strip.querySelector('[aria-pressed=true]')?.focus({preventScroll:true});
    if(activeGroup==='prenda')frameFace(Boolean(viewer.portrait));
    status.textContent='';draw();
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
  const entry=new URLSearchParams(location.search).get('categoria');
  navigate(features.some(f=>f.id===entry)?entry:(isWardrobe?'vestuario':'rostro'));await draw();studio.dataset.ready='true';
})().catch(error=>{
  document.getElementById('status').textContent='El modelo no pudo abrirse. Recarga esta página para volver a intentarlo.';
  console.error(error);
});
