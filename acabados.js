'use strict';

(() => {
  const panel = document.querySelector('#acabados');
  const paint = {
    Blanco:'#f8f7f2', Crema:'#f5e5c7', Gris:'#a6abb0', Negro:'#3b4149',
    Rojo:'#d65b51', Amarillo:'#edc44f', Verde:'#77ad86', Azul:'#77a8d5',
    Rosa:'#e5a2b5', Lila:'#b8a5cf'
  };
  const solid = {id:'lisa', name:'Lisa', colors:Object.keys(paint)};
  const catalog = new Map([solid, ...acabadosDelCuarto].map(item => [item.id, item]));
  const floors = ['lisa','p06','p07','p01','p13','p18','p21','p25','p47'];
  // A floor sheet covers several square game tiles. The mint sheet already
  // contains four ceramic squares across, while the wood has much finer grain.
  const floorSheetSpan = {lisa:1, p06:8, p07:8, p01:4, p13:4, p18:4, p21:8, p25:4, p47:6};
  const walls = [solid, ...acabadosDelCuarto.filter(item => item.group !== 'Materiales de piso')];
  const folder = 'recap-media/crear-cuarto/texturas/';
  const grid = panel.querySelector('.finish-options');
  const tones = panel.querySelector('.finish-tones');
  const trimLabel = panel.querySelector('#acabado-zocalo');
  const trim = trimLabel.querySelector('input');
  const sample = panel.querySelector('#muestra-modulo');
  const preview = panel.querySelector('#cuarto-preview');
  const surfaces = {wall: {id:'loops', tone:0, trim:false}, floor: {id:'p06', tone:0, trim:false}};
  const images = new Map();
  let face = 'wall';
  let revision = 0;

  function artwork(id) {
    if (!images.has(id)) {
      const img = new Image();
      img.src = folder + id + '.webp?v=3';
      images.set(id, img.decode().then(() => img).catch(error => { images.delete(id); throw error; }));
    }
    return images.get(id);
  }

  async function buildModule(surface, {id, tone, trim}) {
    const isWall = surface === 'wall';
    if (!isWall && id !== solid.id) return artwork(id);
    const canvas = document.createElement('canvas');
    canvas.width = isWall ? 192 : 96;
    canvas.height = isWall ? 384 : 96;
    const ctx = canvas.getContext('2d');
    if (id === solid.id) {
      ctx.fillStyle = paint[solid.colors[tone]];
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return canvas;
    }
    const img = await artwork(id);
    const width = img.width / catalog.get(id).colors.length;
    if (img.height === width) {
      // Each wall module contains two columns and four rows of square tiles.
      for (let y = 0; y < canvas.height; y += 96) {
        for (let x = 0; x < canvas.width; x += 96) {
          ctx.drawImage(img, tone * width, 0, width, width, x, y, 96, 96);
        }
      }
    } else {
      ctx.drawImage(img, tone * width, 0, width, img.height, 0, 0, canvas.width, canvas.height);
    }
    if (trim) {
      // Use a color from the motif itself to coordinate the painted baseboard.
      const [r,g,b] = ctx.getImageData(14, 15, 1, 1).data;
      ctx.fillStyle = 'rgb(' + [r,g,b].join(',') + ')';
      ctx.fillRect(0, 289, 192, 95);
      ctx.fillStyle = 'rgba(255,250,233,.47)';
      ctx.fillRect(0, 289, 192, 95);
      ctx.fillStyle = 'rgba(59,43,30,.18)';
      for (let x = 0; x < 192; x += 48) ctx.fillRect(x, 306, 23, 78);
      ctx.fillRect(0, 289, 192, 11);
    }
    return canvas;
  }

  function polygon(ctx, points, fill) {
    ctx.beginPath();
    points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function plane(ctx, tile, origin, across, down, columns, rows, shade, pixelsPerTile = 96) {
    ctx.save();
    const w = pixelsPerTile * columns, h = pixelsPerTile * rows;
    ctx.transform(across[0]/w, across[1]/w, down[0]/h, down[1]/h, ...origin);
    ctx.fillStyle = ctx.createPattern(tile, 'repeat');
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  async function draw() {
    const version = ++revision;
    const caption = panel.querySelector('#combinacion');
    const lines = Object.entries(surfaces).map(([key, s]) => {
      const item = catalog.get(s.id);
      return (key === 'wall' ? 'Paredes · ' : 'Piso · ') + item.name +
        (item.colors.length > 1 ? ' · ' + item.colors[s.tone] : '') + (s.trim ? ' · con zócalo' : '');
    });
    caption.replaceChildren(...lines.map(text => Object.assign(document.createElement('span'), {textContent:text})));
    preview.setAttribute('aria-label', lines.join('. '));
    try {
      const [wall, floor] = await Promise.all([buildModule('wall', surfaces.wall), buildModule('floor', surfaces.floor)]);
      if (revision !== version) return;
      sample.height = face === 'wall' ? 192 : 96;
      sample.setAttribute('aria-label', face === 'wall' ? 'Módulo de pared de 2 × 4' : 'Loseta de piso de 1 × 1');
      const floorPixels = floor.width / floorSheetSpan[surfaces.floor.id];
      const sampleCtx = sample.getContext('2d');
      if (face === 'wall') sampleCtx.drawImage(wall, 0, 0, sample.width, sample.height);
      else sampleCtx.drawImage(floor, 0, 0, floorPixels, floorPixels, 0, 0, sample.width, sample.height);
      const ctx = preview.getContext('2d');
      ctx.setTransform(1.5,0,0,1.5,0,0);
      const backdrop = ctx.createLinearGradient(0,0,0,460);
      backdrop.addColorStop(0,'#eaf5f0'); backdrop.addColorStop(1,'#c7dfda');
      ctx.fillStyle = backdrop; ctx.fillRect(0,0,720,460);
      // Orthographic projection, 45° around the room. Both horizontal axes
      // and the vertical axis derive from one world unit and one camera angle.
      const side = 8, height = 4;
      const scale = 54, tilt = Math.PI / 9;
      const run = side * scale / Math.SQRT2;
      const rise = run * Math.sin(tilt);
      const wallHeight = height * scale * Math.cos(tilt);
      const top = 20, back = [360, top + wallHeight];
      const left = [back[0]-run, back[1]+rise];
      const right = [back[0]+run, back[1]+rise];
      const front = [back[0], back[1]+2*rise];
      const edge = 9;
      ctx.save();
      ctx.shadowColor = '#30545555'; ctx.shadowBlur = 21; ctx.shadowOffsetY = 9;
      polygon(ctx,[left,back,right,front],'#90aaa7'); ctx.restore();
      polygon(ctx,[left,front,right,[right[0],right[1]+edge],[front[0],front[1]+edge],[left[0],left[1]+edge]],'#63858a');
      const acrossLeft = [run,-rise], acrossRight = [run,rise], down = [0,wallHeight];
      plane(ctx,wall,[left[0],top+rise],acrossLeft,down,side,height,'rgba(78,55,53,.06)');
      plane(ctx,wall,[back[0],top],acrossRight,down,side,height,'rgba(47,63,77,.18)');
      plane(ctx,floor,left,acrossLeft,acrossRight,side,side,'rgba(255,239,211,.07)',floorPixels);
      ctx.beginPath();ctx.moveTo(...left);ctx.lineTo(...back);ctx.lineTo(...right);
      ctx.strokeStyle='rgba(60,55,48,.23)';ctx.lineWidth=2;ctx.stroke();
    } catch {
      if (revision === version) caption.append(' No se pudo cargar esta textura. Vuelve a elegirla para reintentar.');
    }
  }

  function selection() {
    const s = surfaces[face];
    const item = catalog.get(s.id);
    panel.querySelector('#acabado-nombre').textContent = item.name;
    for (const button of grid.children) button.setAttribute('aria-pressed', String(button.dataset.id === s.id));
    tones.replaceChildren(...item.colors.map((name, i) => {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = name; button.dataset.index = i;
      if (item === solid) button.style.setProperty('--paint', paint[name]);
      button.setAttribute('aria-pressed', String(i === s.tone));
      return button;
    }));
    trimLabel.hidden = face !== 'wall' || item.group !== 'Motivos adaptados';
    trim.checked = s.trim;
    draw();
  }

  function list() {
    const items = face === 'wall' ? walls : floors.map(id => catalog.get(id));
    grid.replaceChildren(...items.map(item => {
      const button = document.createElement('button');
      button.type = 'button'; button.dataset.id = item.id;
      const thumb = document.createElement('i');
      thumb.setAttribute('aria-hidden','true');
      if (item === solid) {
        thumb.style.backgroundColor = paint.Crema;
      } else {
        thumb.style.backgroundImage = 'url(' + folder + item.id + '.webp?v=3)';
        thumb.style.backgroundSize = item.colors.length * 100 + '% auto';
      }
      thumb.style.backgroundPosition = 'left center';
      button.append(thumb, document.createTextNode(item.name));
      return button;
    }));
    selection();
    grid.scrollTop = 0;
    const active = grid.querySelector('[aria-pressed=true]');
    if (active) grid.scrollTop = active.getBoundingClientRect().top - grid.getBoundingClientRect().top - 4;
  }

  function switchFace(key) {
    face = key;
    panel.querySelectorAll('[data-face]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.face === key)));
    list();
  }
  panel.querySelectorAll('[data-face]').forEach(b => b.addEventListener('click', () => switchFace(b.dataset.face)));
  grid.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    surfaces[face] = {id:b.dataset.id, tone:0, trim:false};
    selection();
  });
  tones.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    surfaces[face].tone = Number(b.dataset.index);
    selection();
    tones.children[surfaces[face].tone].focus({preventScroll:true});
  });
  trim.addEventListener('change', () => { surfaces.wall.trim = trim.checked; draw(); });
  switchFace('wall');
})();
