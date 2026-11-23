'use strict';

class YunipetFabrics {
  constructor(model, saved) {
    this.samples=new Map(model.fabrics.map(f=>[f.id,f]));
    this.picks={};
    for(const mesh of Object.keys(model.fabricGeometry)) {
      const value=saved?.[mesh];
      if(value==='liso'||value==='archivo'||this.samples.has(value)) this.picks[mesh]=value;
    }
    this.originals=new Map();
    this.defaults={'T-Shirt':'rayas',Hoodie:'denim',Sweater:'cuadros',Dress:'flores','Flower Dress':'flores',Kimono:'flores',
      'Dino Sweater':'cuadros',Cape:'denim','Royal Guard Dress':'denim',Cap:'cuadros',Beret:'denim','Summer Hat':'rayas'};
  }

  selected(mesh) {return this.picks[mesh] || this.defaults[mesh] || 'liso';}

  database() {
    if(!this.db) this.db=new Promise((resolve,reject)=>{
      const request=indexedDB.open('yunipets-texturas',1);
      request.onupgradeneeded=()=>request.result.createObjectStore('mapas',{keyPath:'mesh'});
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    return this.db;
  }

  async original(mesh) {
    if(this.originals.has(mesh))return this.originals.get(mesh);
    const db=await this.database();
    const record=await new Promise((resolve,reject)=>{
      const request=db.transaction('mapas').objectStore('mapas').get(mesh);
      request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
    });
    if(record)this.originals.set(mesh,record);
    return record;
  }

  async resolve(mesh) {
    let id=this.selected(mesh);
    if(id==='archivo') {
      let record;
      try {record=await this.original(mesh);} catch {}
      if(record)return record;
      delete this.picks[mesh];id=this.selected(mesh);
    }
    const item=this.samples.get(id);
    return item && {key:id,src:item.map};
  }

  // Both RGB masks use sRGB input in the Blender materials.
  bakeMask(image,mesh) {
    const dress=mesh==='Flower Dress';
    const red=dress?[1,.858810,.002334]:[1,.387755,.540810];
    const green=dress?[.438033,1,.233322]:[1,.767948,.797308];
    const lin=Float32Array.from({length:256},(_,i)=>{const x=i/255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;});
    const srgb=Uint8Array.from({length:4097},(_,i)=>{const x=i/4096;return Math.round(255*(x<=.0031308?12.92*x:1.055*x**(1/2.4)-.055));});
    const p=image.data;
    for(let i=0;i<p.length;i+=4) {
      const r=lin[p[i]],g=lin[p[i+1]],b=lin[p[i+2]];
      for(let j=0;j<3;j++) {
        const linear=dress?red[j]*r+green[j]*g+b:red[j]*r*(1-g)+green[j]*g;
        p[i+j]=srgb[Math.round(Math.min(1,linear)*4096)];
      }
    }
  }

  async importMap(mesh,file,mask) {
    if(!file || !/^(image\/(png|jpeg|webp))$/i.test(file.type))throw Error('Elige una imagen PNG, JPG o WebP.');
    const url=URL.createObjectURL(file),img=new Image();
    try {img.src=url;await img.decode();} finally {URL.revokeObjectURL(url);}
    const scale=Math.min(1,2048/Math.max(img.width,img.height));
    const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
    const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);
    if(mask) {const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);this.bakeMask(pixels,mesh);ctx.putImageData(pixels,0,0);}
    const version=crypto.randomUUID?.() || Date.now().toString(36);
    const record={mesh,key:'local/'+mesh+'/'+version,src:canvas.toDataURL('image/webp',.96),name:file.name};
    let persisted=true;
    try {
      const db=await this.database();
      await new Promise((resolve,reject)=>{
        const tx=db.transaction('mapas','readwrite');
        tx.objectStore('mapas').put(record);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
      });
    } catch {persisted=false;}
    this.originals.set(mesh,record);this.picks[mesh]='archivo';
    return persisted;
  }
}
