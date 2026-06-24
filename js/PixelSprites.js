'use strict';

/* ════════════════════════════════════════════════════════════
   PIXEL SPRITES  —  16×16 indie-style pixel art pets
   Color index legend:
     0 = transparent
     1 = main body
     2 = light body accent / belly
     3 = special accent (horns, wings, crest, beak ring)
     4 = white / bright highlight
     5 = dark / pupils / outlines
     6 = pink (inner ears, cheeks, nose blush)
     7 = eye iris / special color
     8 = dark body shadow / underbelly
     9 = orange / beak / fire accent
════════════════════════════════════════════════════════════ */

const PixelSprites = (() => {

  /* ─────────────────────────────────────────────────────────
     IDLE GRIDS  — chunky sitting pose, front-facing
     ───────────────────────────────────────────────────────── */
  const GRIDS = {

    /* DOG — 32×32 floppy-eared sitting pup (matching reference sprite) */
    dog: [
      [0,0,0,0,0,0,0,0,0,0,5,5,0,0,0,0,0,0,0,5,5,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,5,1,1,5,0,0,0,0,0,5,1,1,5,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,5,1,1,1,5,0,0,0,0,5,1,1,1,5,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,5,1,1,1,1,1,5,5,5,5,1,1,1,1,1,5,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,5,1,5,4,4,5,1,1,1,1,1,1,5,4,4,5,1,5,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,5,1,5,4,5,5,5,1,1,1,1,5,5,5,4,5,1,5,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,5,1,5,4,4,5,1,1,1,1,1,1,5,4,4,5,1,5,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,5,1,1,1,1,1,2,2,5,5,2,2,1,1,1,1,1,5,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,5,1,1,1,1,2,2,2,5,5,2,2,2,1,1,1,1,5,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,5,1,1,2,2,2,5,5,5,5,2,2,2,1,1,5,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,5,5,2,2,2,2,2,2,2,2,2,2,2,2,5,5,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,5,1,5,2,2,2,2,2,2,2,2,2,2,2,2,5,1,5,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,5,1,1,1,5,5,5,2,2,2,2,2,2,5,5,5,1,1,1,5,0,0,0,0,0,0,0],
      [0,0,0,0,0,5,1,1,1,1,1,5,2,2,2,2,2,2,5,1,1,1,1,1,5,0,0,0,0,0,0,0],
      [0,0,0,0,0,5,1,1,1,1,1,5,2,2,2,2,2,2,5,1,1,1,1,1,5,0,0,0,0,0,0,0],
      [0,0,0,0,0,5,1,1,1,1,5,2,2,2,2,2,2,2,2,5,1,1,1,1,5,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,5,1,1,5,2,2,2,2,2,2,2,2,2,2,5,1,1,5,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,5,1,5,2,2,2,2,2,2,2,2,2,2,2,2,5,1,5,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,5,1,5,2,2,2,2,2,2,2,2,2,2,2,2,5,1,5,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,5,5,1,1,5,5,0,0,0,0,5,5,1,1,5,5,5,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,5,1,1,1,1,5,0,0,0,0,5,1,1,1,1,5,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,5,2,2,2,2,5,0,0,0,0,5,2,2,2,2,5,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,5,5,5,5,5,5,0,0,0,0,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],

    /* CAT — 32×32 pointy-eared sitting cat, vertical slit pupils */
    cat: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
      [0,0,0,0,1,6,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,6,1,0,0,0,0,0],
      [0,0,0,1,1,6,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,6,1,1,0,0,0,0],
      [0,0,0,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,1,1,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,1,1,1,1,1,4,4,4,4,4,1,1,1,1,1,1,4,4,4,4,4,1,1,1,1,1,1,0,0],
      [0,0,1,1,1,1,1,1,4,7,5,7,4,1,1,1,1,1,1,4,7,5,7,4,1,1,1,1,1,1,0,0],
      [0,0,1,1,1,1,1,1,4,7,5,7,4,1,1,1,1,1,1,4,7,5,7,4,1,1,1,1,1,1,0,0],
      [0,0,1,1,1,1,1,1,4,7,5,7,4,1,1,1,1,1,1,4,7,5,7,4,1,1,1,1,1,1,0,0],
      [0,0,1,1,1,1,1,6,4,4,4,4,4,1,1,1,1,1,1,4,4,4,4,4,6,1,1,1,1,1,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,6,6,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,2,2,2,2,4,4,4,4,4,2,2,2,2,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,1,1,1,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0,0],
      [0,0,0,0,2,2,1,1,2,2,0,0,0,0,0,2,2,1,1,2,2,0,0,0,1,1,0,0,0,0,0,0],
      [0,0,0,0,8,8,8,8,8,8,0,0,0,0,0,8,8,8,8,8,8,0,0,0,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],

    /* RABBIT — tall ears with pink inside, round face, fluffy body */
    rabbit: [
      [0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0],
      [0,0,0,1,6,1,0,0,1,6,1,0,0,0,0,0],
      [0,0,0,1,6,1,0,0,1,6,1,0,0,0,0,0],
      [0,0,0,1,6,1,0,0,1,6,1,0,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,1,1,4,4,1,1,1,4,4,1,0,0,0,0],
      [0,0,1,1,4,5,1,6,1,5,4,1,0,0,0,0],
      [0,0,1,1,4,4,1,1,1,4,4,1,0,0,0,0],
      [0,0,0,1,1,1,6,6,6,1,1,0,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,1,1,1,2,2,2,2,2,1,1,0,0,0,0],
      [0,0,1,1,2,2,4,4,4,2,2,1,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0],
      [0,0,0,8,8,0,0,0,0,8,8,0,0,0,0,0],
    ],

    /* BIRD — round plump body, crest feather, tiny beak, wing nubs */
    bird: [
      [0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,3,1,3,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0],
      [0,0,0,1,1,4,4,4,1,1,0,0,0,0,0,0],
      [0,0,1,1,1,4,5,5,4,1,1,1,0,0,0,0],
      [0,0,1,1,1,4,7,7,4,1,1,1,0,0,0,0],
      [0,0,1,1,1,1,9,9,1,1,1,1,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,0],
      [1,1,2,2,1,1,1,1,1,1,2,2,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,2,2,2,2,2,1,1,0,0,0,0],
      [0,0,1,1,2,2,4,4,4,2,2,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,9,9,0,0,9,9,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
  };

  /* ─────────────────────────────────────────────────────────
     EAT GRIDS  — mouth open, eyes bright, leaning forward
     ───────────────────────────────────────────────────────── */
  const GRIDS_EAT = {
    dog: (() => {
      const g = GRIDS.dog.map(r => [...r]);
      // open mouth — tongue (6) visible, jaw gap
      g[11] = [0,0,0,0,0,0,0,5,1,1,2,6,6,6,6,6,6,6,6,2,1,1,5,0,0,0,0,0,0,0,0,0];
      g[12] = [0,0,0,0,0,0,0,5,5,2,5,0,0,0,0,0,0,0,5,2,5,5,5,0,0,0,0,0,0,0,0,0];
      return g;
    })(),
    cat: (() => {
      const g = GRIDS.cat.map(r => [...r]);
      // open small mouth below nose
      g[12] = [0,0,0,1,1,1,1,1,1,1,1,1,1,1,5,6,5,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0];
      g[13] = [0,0,0,1,1,1,1,1,1,1,1,1,1,1,5,0,5,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0];
      return g;
    })(),
    rabbit: (() => {
      const g = GRIDS.rabbit.map(r => [...r]);
      g[7]  = [0,0,1,1,4,5,5,6,5,5,4,1,0,0,0,0];
      g[9]  = [0,0,0,1,1,5,0,0,0,5,1,0,0,0,0,0];
      g[6]  = [0,0,1,1,4,4,4,1,4,4,4,1,0,0,0,0];
      return g;
    })(),
    bird: (() => {
      const g = GRIDS.bird.map(r => [...r]);
      // beak open
      g[6]  = [0,0,1,1,1,1,9,0,1,1,1,1,0,0,0,0];
      g[5]  = [0,0,1,1,1,4,5,4,5,4,1,1,0,0,0,0];
      return g;
    })(),
  };

  /* ─────────────────────────────────────────────────────────
     SLEEP GRIDS  — eyes shut (–– lines), relaxed posture
     ───────────────────────────────────────────────────────── */
  const GRIDS_SLEEP = {
    dog: (() => {
      const g = GRIDS.dog.map(r => [...r]);
      // closed eyes — horizontal dark lines replacing eye area
      g[6]  = [0,0,0,0,0,0,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,0,0,0,0,0,0,0,0];
      g[7]  = [0,0,0,0,0,0,5,1,1,5,5,5,5,1,1,1,1,5,5,5,5,1,1,5,0,0,0,0,0,0,0,0];
      g[8]  = [0,0,0,0,0,0,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,0,0,0,0,0,0,0,0];
      return g;
    })(),
    cat: (() => {
      const g = GRIDS.cat.map(r => [...r]);
      // closed eyes — replace 5×5 eye area with thin closed lines
      g[7]  = [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0];
      g[8]  = [0,0,1,1,1,1,1,1,5,5,5,5,5,1,1,1,1,1,1,5,5,5,5,5,1,1,1,1,1,1,0,0];
      g[9]  = [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0];
      g[10] = [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0];
      g[11] = [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0];
      return g;
    })(),
    rabbit: (() => {
      const g = GRIDS.rabbit.map(r => [...r]);
      g[6]  = [0,0,1,1,4,4,1,1,1,4,4,1,0,0,0,0];
      g[7]  = [0,0,1,1,5,5,5,1,5,5,5,1,0,0,0,0];
      g[8]  = [0,0,1,1,4,4,1,1,1,4,4,1,0,0,0,0];
      return g;
    })(),
    bird: (() => {
      const g = GRIDS.bird.map(r => [...r]);
      g[4]  = [0,0,1,1,1,4,4,4,4,4,1,1,0,0,0,0];
      g[5]  = [0,0,1,1,1,5,5,5,5,5,1,1,0,0,0,0];
      g[6]  = [0,0,1,1,1,1,9,9,1,1,1,1,0,0,0,0];
      return g;
    })(),
  };

  /* ── Default palettes per pet type ───────────────────── */
  const DEFAULT_PALETTES = {
    dog:    ['','#c8834a','#ffffff','#a06030','#ffffff','#111111','#ffb5b5','#44aaff','#7a4520','#ff8800'],
    cat:    ['','#8899bb','#c4d4ee','#556680','#ffffff','#1a1a2e','#ffaacc','#55cc88','#445566','#ff8800'],
    rabbit: ['','#ede8e0','#ffffff','#c8c0b8','#ffffff','#bb2244','#ffaabb','#bb2244','#aaaaaa','#ff8800'],
    bird:   ['','#4488ee','#88aaff','#ffdd00','#ffffff','#1a1a2e','#ff99bb','#33bbff','#2255cc','#ff7700'],
  };

  /* ── Color tinting ─────────────────────────────────────── */
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return [r,g,b];
  }
  function rgbToHex(r,g,b) {
    return '#' + [r,g,b].map(v => Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
  }
  function blendColor(base, tint, amount=0.5) {
    const [br,bg,bb] = hexToRgb(base);
    const [tr,tg,tb] = hexToRgb(tint);
    return rgbToHex(br*(1-amount)+tr*amount, bg*(1-amount)+tg*amount, bb*(1-amount)+tb*amount);
  }

  const PET_COLOR_HEXES = {
    golden:   '#f59e0b',
    brown:    '#92400e',
    white:    '#e5e7eb',
    midnight: '#1e3a5f',
    lavender: '#a78bfa',
    coral:    '#f87171',
  };

  function buildPalette(petType, colorId) {
    const base = [...DEFAULT_PALETTES[petType] || DEFAULT_PALETTES.dog];
    const tintHex = PET_COLOR_HEXES[colorId];
    if (tintHex) {
      base[1] = blendColor(base[1], tintHex, 0.55);
      base[2] = blendColor(base[2], tintHex, 0.45);
      base[8] = blendColor(base[8], tintHex, 0.55);
    }
    return base;
  }

  /* ── SVG generation from grid ─────────────────────────── */
  function gridToSVGString(grid, palette, cellSize) {
    const dim = grid.length * cellSize;
    let rects = '';
    grid.forEach((row, y) => {
      row.forEach((idx, x) => {
        if (!idx || !palette[idx]) return;
        rects += `<rect x="${x*cellSize}" y="${y*cellSize}" width="${cellSize}" height="${cellSize}" fill="${palette[idx]}"/>`;
      });
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${dim}" height="${dim}" viewBox="0 0 ${dim} ${dim}" style="image-rendering:pixelated;image-rendering:crisp-edges">${rects}</svg>`;
  }

  /* ── Public API ───────────────────────────────────────── */

  let _currentType  = 'dog';
  let _currentColor = 'golden';

  function setCurrentPet(type, colorId) {
    _currentType  = type  || 'dog';
    _currentColor = colorId || 'golden';
  }

  function petSVG(typeId, colorId, size) {
    const grid    = GRIDS[typeId] || GRIDS.dog;
    const palette = buildPalette(typeId, colorId || _currentColor);
    const cell    = Math.max(1, Math.floor(size / grid.length));
    return gridToSVGString(grid, palette, cell);
  }

  function petEatSVG(typeId, colorId, size) {
    const grid    = GRIDS_EAT[typeId] || GRIDS_EAT.dog;
    const palette = buildPalette(typeId, colorId || _currentColor);
    const cell    = Math.max(1, Math.floor(size / grid.length));
    return gridToSVGString(grid, palette, cell);
  }

  function petSleepSVG(typeId, colorId, size) {
    const grid    = GRIDS_SLEEP[typeId] || GRIDS_SLEEP.dog;
    const palette = buildPalette(typeId, colorId || _currentColor);
    const cell    = Math.max(1, Math.floor(size / grid.length));
    return gridToSVGString(grid, palette, cell);
  }

  /* ── Setup screen card icon ─────────────────────────────── */
  function setupIconHTML(typeId, size) {
    const displaySize = size || 52;
    if (SHEET_CFG[typeId]) {
      const cfg = SHEET_CFG[typeId];
      const sc  = cfg.states.idle;
      const W   = cfg.cols * displaySize;   // scaled total image width
      const H   = cfg.rows * displaySize;   // scaled total image height
      const top = -(sc.row * displaySize);  // shift image up to reveal correct row
      // overflow:hidden clips to one frame; img is scaled so each cell = displaySize px
      return `<div style="width:${displaySize}px;height:${displaySize}px;overflow:hidden;position:relative;flex-shrink:0">` +
             `<img src="${cfg.src}" style="position:absolute;width:${W}px;height:${H}px;left:0;top:${top}px;image-rendering:pixelated;image-rendering:crisp-edges"></div>`;
    }
    const svgStr = petSVG(typeId, _currentColor, displaySize * 2);
    return `<span class="pixel-pet-wrap" style="display:inline-flex;align-items:center;justify-content:center;width:${displaySize}px;height:${displaySize}px;overflow:hidden">${svgStr}</span>`;
  }

  /* ── Patch Icons.petSvg ─────────────────────────────── */
  function patchIcons() {
    if (typeof Icons === 'undefined') return;
    Icons.petSvg = function(typeId, size, cls) {
      const displaySize = size || 64;
      const svgStr = petSVG(typeId, _currentColor, displaySize * 2);
      return `<span class="pixel-pet-wrap" style="display:inline-flex;align-items:center;justify-content:center;width:${displaySize}px;height:${displaySize}px;overflow:hidden">${svgStr}</span>`;
    };
  }

  /* ── Sprite sheet config ────────────────────────────── */
  const SHEET_CFG = {
    dog: {
      src:  'assets/dog_sprite.png',
      cols: 4,
      rows: 9,
      states: {
        idle:     { row: 8, frames: 3, fps: 3 },   // casual lying/resting
        eating:   { row: 6, frames: 4, fps: 6 },   // sitting up attentively
        happy:    { row: 5, frames: 4, fps: 8 },   // excited front poses
        sleeping: { row: 7, frames: 3, fps: 1 },   // lying down
      }
    },
    rabbit: {
      src:  'assets/rabbit_sprite.png',
      cols: 8,
      rows: 4,
      states: {
        idle: {
          row: 0, frames: 4, fps: 2,        // front-facing calm
          wanderRows: [
            { row: 2, frames: 8, fps: 7 },  // run right
            { row: 3, frames: 8, fps: 6 },  // hop right
          ]
        },
        eating:   { row: 0, frames: 8, fps: 8 },  // excited full front cycle
        happy:    { row: 2, frames: 8, fps: 9 },  // full sprint
        sleeping: { row: 1, frames: 8, fps: 1 },  // dark hunched resting
      }
    },
    bird: {
      src:  'assets/bird_sprite.png',
      cols: 3,
      rows: 8,
      states: {
        idle: {
          row: 6, frames: 3, fps: 2,       // calm standing
          wanderRows: [
            { row: 0, frames: 3, fps: 8 }, // full wing spread
            { row: 1, frames: 3, fps: 8 }, // mid-flap
            { row: 2, frames: 3, fps: 7 }, // wing tuck
            { row: 3, frames: 3, fps: 6 }, // gliding/landing
            { row: 4, frames: 3, fps: 5 }, // ground hop
          ]
        },
        eating:   { row: 5, frames: 3, fps: 6 },  // alert pecking
        happy:    { row: 0, frames: 3, fps: 9 },  // full flap flight
        sleeping: { row: 7, frames: 3, fps: 1 },  // puffed resting
      }
    },
    cat: {
      src:  'assets/cat_sprite.png',
      cols: 12,
      rows: 8,
      states: {
        // Base idle: loafing; wanderRows used for occasional pacing (uses all walk rows)
        idle: {
          row: 6, frames: 3, fps: 3,
          wanderRows: [
            { row: 0, frames: 4, fps: 6 },   // walk away
            { row: 1, frames: 4, fps: 6 },   // walk right
            { row: 2, frames: 4, fps: 6 },   // walk left
            { row: 3, frames: 4, fps: 6 },   // walk toward viewer
          ]
        },
        eating:   { row: 5, frames: 4, fps: 6 },   // sitting up attentively
        happy:    { row: 4, frames: 4, fps: 8 },   // playful / energetic poses
        sleeping: { row: 7, frames: 2, fps: 1 },   // curled up asleep
      }
    },
  };

  const _sheetImages = {};

  function _loadSheet(type) {
    if (_sheetImages[type]) return _sheetImages[type];
    const cfg = SHEET_CFG[type];
    if (!cfg) return null;
    const img = new Image();
    img.src = cfg.src;
    _sheetImages[type] = img;
    return img;
  }

  function _drawSheetFrame(ctx, img, cfg, row, col, displaySize, tintHex) {
    const fw = img.naturalWidth  / cfg.cols;
    const fh = img.naturalHeight / cfg.rows;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, displaySize, displaySize);
    ctx.drawImage(img, col * fw, row * fh, fw, fh, 0, 0, displaySize, displaySize);
    if (tintHex) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-atop';
      ctx.globalAlpha = 0.38;
      ctx.fillStyle = tintHex;
      ctx.fillRect(0, 0, displaySize, displaySize);
      ctx.restore();
    }
  }

  /* ── Animated main pet display ──────────────────────── */
  let _eatInterval = null;
  let _stopAnim    = null;   // cleanup fn for sprite-sheet timers

  function updateMainDisplay(state) {
    const el = document.getElementById('petEmojiDisplay');
    if (!el) return;

    clearInterval(_eatInterval);
    _eatInterval = null;
    if (_stopAnim) { _stopAnim(); _stopAnim = null; }

    // Sprite sheet path
    if (SHEET_CFG[_currentType]) {
      const cfg      = SHEET_CFG[_currentType];
      const stateKey = cfg.states[state] ? state : 'idle';
      const sc       = cfg.states[stateKey];
      const img      = _loadSheet(_currentType);
      const SIZE     = 96;

      const canvas         = document.createElement('canvas');
      canvas.width         = SIZE;
      canvas.height        = SIZE;
      canvas.style.cssText = 'image-rendering:pixelated;image-rendering:crisp-edges;display:block';
      canvas.dataset.petType = _currentType;   // lets _refreshAll skip overwriting this canvas
      el.innerHTML         = '';
      el.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      const tint = PET_COLOR_HEXES[_currentColor] || null;

      function drawF(col) {
        if (!img.complete || !img.naturalWidth) return;
        _drawSheetFrame(ctx, img, cfg, sc.row, col, SIZE, tint);
      }
      if (!img.complete) img.addEventListener('load', () => drawF(0), { once: true });

      if (stateKey === 'idle') {
        // Hold a pose, then occasionally shift frames or wander (if wanderRows defined)
        let currentFrame = 0;
        let _timerId = null;
        let _animId  = null;
        drawF(currentFrame);

        function drawAny(row, col) {
          if (!img.complete || !img.naturalWidth) return;
          _drawSheetFrame(ctx, img, cfg, row, col, SIZE, tint);
        }

        function scheduleShift() {
          const holdMs = 3500 + Math.random() * 4000; // 3.5–7.5 s of stillness
          _timerId = setTimeout(() => {
            const wanders = sc.wanderRows;

            if (wanders && Math.random() < 0.35) {
              // Pick a random wander row and play 1–2 cycles of it, then return to base
              const w = wanders[Math.floor(Math.random() * wanders.length)];
              const cycles = 1 + Math.floor(Math.random() * 2);
              const total  = w.frames * cycles;
              let f = 0;
              _animId = setInterval(() => {
                drawAny(w.row, f % w.frames);
                if (++f >= total) {
                  clearInterval(_animId);
                  _animId = null;
                  currentFrame = 0;
                  drawF(currentFrame);
                  scheduleShift();
                }
              }, 1000 / w.fps);

            } else {
              // Normal base-row frame shift (2–4 frames, unhurried)
              const steps = 2 + Math.floor(Math.random() * 3);
              let done = 0;
              _animId = setInterval(() => {
                currentFrame = (currentFrame + 1) % sc.frames;
                drawF(currentFrame);
                if (++done >= steps) {
                  clearInterval(_animId);
                  _animId = null;
                  scheduleShift();
                }
              }, 220);
            }
          }, holdMs);
        }

        scheduleShift();
        _stopAnim = () => { clearTimeout(_timerId); clearInterval(_animId); };

      } else {
        // Action states: loop continuously at configured fps
        let f = 0;
        drawF(0);
        const animId = setInterval(() => {
          f = (f + 1) % sc.frames;
          drawF(f);
        }, 1000 / sc.fps);
        _stopAnim = () => clearInterval(animId);
      }

      return;
    }

    // SVG fallback for pet types without a sprite sheet
    if (state === 'eating') {
      let f = 0;
      _eatInterval = setInterval(() => {
        f = 1 - f;
        const svg = f ? petEatSVG(_currentType, _currentColor, 128)
                      : petSVG(_currentType, _currentColor, 128);
        el.innerHTML = `<span class="pixel-pet-wrap" style="display:inline-flex;image-rendering:pixelated">${svg}</span>`;
      }, 150);
    } else if (state === 'sleeping') {
      el.innerHTML = `<span class="pixel-pet-wrap" style="display:inline-flex;image-rendering:pixelated">${petSleepSVG(_currentType, _currentColor, 128)}</span>`;
    } else {
      el.innerHTML = `<span class="pixel-pet-wrap" style="display:inline-flex;image-rendering:pixelated">${petSVG(_currentType, _currentColor, 128)}</span>`;
    }
  }

  /* ── Floating particle effects ──────────────────────── */
  function spawnParticle(container, type) {
    if (!container) return;
    const particle = document.createElement('div');
    particle.className = `pixel-particle pixel-particle-${type}`;
    const x = Math.random() * 80 - 40;
    particle.style.setProperty('--px', `${x}px`);
    particle.textContent = type === 'heart' ? '♥' : type === 'star' ? '★' : type === 'zzz' ? 'Z' : '✦';
    container.appendChild(particle);
    setTimeout(() => particle.remove(), 1200);
  }

  function burstParticles(container, type, count) {
    if (!container) return;
    for (let i = 0; i < count; i++) {
      setTimeout(() => spawnParticle(container, type), i * 80);
    }
  }

  /* ── Init ────────────────────────────────────────────── */
  function init() {
    patchIcons();
    // Preload sprite sheet images so they're ready on first render
    Object.keys(SHEET_CFG).forEach(type => _loadSheet(type));

    const observer = new MutationObserver(() => {
      const petEl = document.getElementById('petEmojiDisplay');
      if (!petEl) return;
      // Sprite-sheet pets: refresh when content changes but canvas isn't showing yet
      if (SHEET_CFG[_currentType] && !petEl.querySelector('canvas')) {
        updateMainDisplay('idle');
        return;
      }
      // SVG pets: legacy trigger
      if (petEl.querySelector('.pet-svg') && !petEl.querySelector('.pixel-pet-wrap')) {
        updateMainDisplay('idle');
      }
    });
    observer.observe(document.body, { subtree: true, childList: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }

  return {
    setCurrentPet,
    petSVG,
    petEatSVG,
    petSleepSVG,
    updateMainDisplay,
    burstParticles,
    buildPalette,
    setupIconHTML,
  };
})();
