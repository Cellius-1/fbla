'use strict';

const Icons = (() => {
  /* All paths use 24×24 viewBox, 2px stroke, Lucide-inspired */
  const _ui = {
    // Navigation
    home:         `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
    wallet:       `<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>`,
    trending_up:  `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>`,
    star:         `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
    list:         `<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/>`,
    clock:        `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
    message:      `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
    bar_chart:    `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,
    // System controls
    close:        `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
    check:        `<polyline points="20 6 9 17 4 12"/>`,
    search:       `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`,
    chevron_down: `<polyline points="6 9 12 15 18 9"/>`,
    chevron_right:`<polyline points="9 18 15 12 9 6"/>`,
    chevron_up:   `<polyline points="18 15 12 9 6 15"/>`,
    save:         `<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>`,
    reset:        `<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/>`,
    help:         `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
    info:         `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`,
    warn:         `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
    danger:       `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`,
    send:         `<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`,
    download:     `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`,
    trash:        `<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>`,
    // Stats / Actions
    feed:         `<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>`,
    play_circle:  `<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>`,
    moon:         `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`,
    droplets:     `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>`,
    medical_cross:`<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>`,
    heart:        `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`,
    bolt:         `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
    shield:       `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
    // Finance
    coin:         `<circle cx="12" cy="12" r="10"/><path d="M9.5 9h5a1.5 1.5 0 0 1 0 3H12a1.5 1.5 0 0 0 0 3h2.5"/>`,
    arrow_up:     `<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>`,
    arrow_down:   `<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>`,
    // Achievement
    trophy:       `<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="18" width="12" height="4"/>`,
    award:        `<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>`,
    sparkle:      `<path d="M12 3l1.5 6.5H20l-5.25 3.75 1.75 6.25L12 15.75 7.5 19.5l1.75-6.25L4 9.5h6.5z"/>`,
    // Misc
    paw:          `<circle cx="12" cy="13" r="4.5"/><circle cx="5.5" cy="10" r="2.5"/><circle cx="18.5" cy="10" r="2.5"/><circle cx="9" cy="5.5" r="2.5"/><circle cx="15" cy="5.5" r="2.5"/>`,
    bot:          `<rect x="3" y="8" width="18" height="11" rx="2"/><path d="M12 8V4"/><path d="M9 4h6"/><circle cx="8.5" cy="13.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="13.5" r="1.5" fill="currentColor"/>`,
    user:         `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
    chore:        `<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>`,
    level_up:     `<polyline points="17 11 12 6 7 11"/><line x1="12" y1="18" x2="12" y2="6"/>`,
    cpu:          `<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>`,
    dna:          `<path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="m17 6-2.5-2.5"/><path d="m14 8-1-1"/><path d="m7 18 2.5 2.5"/><path d="m3.5 14.5.5.5"/><path d="m20 9 .5.5"/><path d="m6.5 17.5-1-1"/>`,
    calendar:     `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
    lock:         `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
    unlock:       `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>`,
  };

  /* Pet silhouettes: clean line-art, 24×24 */
  const _pets = {
    dog: `
      <circle cx="12" cy="10" r="5.5"/>
      <path d="M7 8C6 5.5 3.5 5.5 3 7.5C2.5 9.5 5 11 6.5 10.5"/>
      <path d="M17 8C18 5.5 20.5 5.5 21 7.5C21.5 9.5 19 11 17.5 10.5"/>
      <ellipse cx="12" cy="12" rx="2" ry="1.5"/>
      <circle cx="10" cy="9" r="1" fill="currentColor"/>
      <circle cx="14" cy="9" r="1" fill="currentColor"/>
      <path d="M8 15C8 18.5 10 20 12 20C14 20 16 18.5 16 15" stroke-width="1.5"/>`,
    cat: `
      <circle cx="12" cy="12" r="5.5"/>
      <path d="M9 8.5L7 4L12 7.5"/>
      <path d="M15 8.5L17 4L12 7.5"/>
      <circle cx="10.5" cy="11.5" r="1.2" fill="currentColor"/>
      <circle cx="13.5" cy="11.5" r="1.2" fill="currentColor"/>
      <path d="M10.5 14C11 14.8 13 14.8 13.5 14"/>
      <path d="M6 12L9.5 12.5M6 14L9.5 13.5" stroke-width="1"/>
      <path d="M18 12L14.5 12.5M18 14L14.5 13.5" stroke-width="1"/>`,
    rabbit: `
      <ellipse cx="9" cy="5.5" rx="2" ry="4.5"/>
      <ellipse cx="15" cy="5.5" rx="2" ry="4.5"/>
      <circle cx="12" cy="14" r="5.5"/>
      <circle cx="10.5" cy="13" r="1" fill="currentColor"/>
      <circle cx="13.5" cy="13" r="1" fill="currentColor"/>
      <ellipse cx="12" cy="15.5" rx="1.5" ry="1" opacity="0.5"/>`,
    bird: `
      <circle cx="12" cy="9" r="4"/>
      <ellipse cx="12" cy="16.5" rx="5.5" ry="4.5"/>
      <path d="M6.5 15.5C4 13 1.5 13.5 2 15.5C2.5 17.5 5.5 17.5 6.5 15.5"/>
      <path d="M17.5 15.5C20 13 22.5 13.5 22 15.5C21.5 17.5 18.5 17.5 17.5 15.5"/>
      <path d="M10 9.5L12 11.5L14 9.5" fill="currentColor" opacity="0.6"/>
      <circle cx="10.5" cy="8" r="0.9" fill="currentColor"/>`,
  };

  /* Emotion face icons: 24×24, open circle with expressive features */
  const _emo = {
    ecstatic: `<circle cx="12" cy="12" r="10"/><path d="M7 14.5C8.5 17.5 15.5 17.5 17 14.5"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/>`,
    happy:    `<circle cx="12" cy="12" r="10"/><path d="M8 14C9.5 16.5 14.5 16.5 16 14"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/>`,
    neutral:  `<circle cx="12" cy="12" r="10"/><line x1="8" y1="14" x2="16" y2="14"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/>`,
    sad:      `<circle cx="12" cy="12" r="10"/><path d="M8 16C9.5 13.5 14.5 13.5 16 16"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/>`,
    hungry:   `<circle cx="12" cy="12" r="10"/><path d="M8 16C9.5 13.5 14.5 13.5 16 16"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/><path d="M10 6.5C10 6.5 12 8.5 14 6.5" stroke-width="1.5"/>`,
    tired:    `<circle cx="12" cy="12" r="10"/><line x1="7" y1="10" x2="11" y2="10"/><line x1="13" y1="10" x2="17" y2="10"/><line x1="8" y1="14.5" x2="16" y2="14.5"/>`,
    sick:     `<circle cx="12" cy="12" r="10"/><line x1="8" y1="8.5" x2="11" y2="11.5"/><line x1="11" y1="8.5" x2="8" y2="11.5"/><line x1="13" y1="8.5" x2="16" y2="11.5"/><line x1="16" y1="8.5" x2="13" y2="11.5"/><path d="M8 15.5C9.5 13.5 14.5 13.5 16 15.5"/>`,
    dirty:    `<circle cx="12" cy="12" r="10"/><path d="M8 14C9.5 15.5 14.5 15.5 16 14"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/><circle cx="8.5" cy="17" r="1.2" fill="currentColor" opacity="0.5"/><circle cx="14.5" cy="17" r="1.2" fill="currentColor" opacity="0.5"/>`,
  };

  /* Personality icons mapping */
  const _pers = {
    friendly:  `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`,
    energetic: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
    shy:       `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`,
    wise:      `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
    funny:     `<circle cx="12" cy="12" r="10"/><path d="M8 14C9.5 16.5 14.5 16.5 16 14"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/>`,
  };

  /* ── Pixel icons — 16×16 rect-based sprites ─────────────── */
  const _px = {
    // Stats
    feed:          `<rect x="3" y="0" width="2" height="2" fill="currentColor"/><rect x="7" y="0" width="2" height="2" fill="currentColor"/><rect x="11" y="0" width="2" height="2" fill="currentColor"/><rect x="0" y="3" width="16" height="2" fill="currentColor"/><rect x="1" y="5" width="14" height="2" fill="currentColor"/><rect x="2" y="7" width="12" height="2" fill="currentColor"/><rect x="3" y="9" width="10" height="2" fill="currentColor"/><rect x="4" y="11" width="8" height="2" fill="currentColor"/><rect x="5" y="13" width="6" height="2" fill="currentColor"/>`,
    heart:         `<rect x="2" y="2" width="4" height="2" fill="currentColor"/><rect x="9" y="2" width="4" height="2" fill="currentColor"/><rect x="0" y="4" width="16" height="2" fill="currentColor"/><rect x="1" y="6" width="13" height="2" fill="currentColor"/><rect x="3" y="8" width="10" height="2" fill="currentColor"/><rect x="5" y="10" width="6" height="2" fill="currentColor"/><rect x="7" y="12" width="2" height="2" fill="currentColor"/>`,
    shield:        `<rect x="4" y="0" width="8" height="2" fill="currentColor"/><rect x="2" y="2" width="12" height="2" fill="currentColor"/><rect x="1" y="4" width="14" height="6" fill="currentColor"/><rect x="2" y="10" width="12" height="2" fill="currentColor"/><rect x="4" y="12" width="8" height="2" fill="currentColor"/><rect x="6" y="14" width="4" height="2" fill="currentColor"/>`,
    bolt:          `<rect x="8" y="0" width="5" height="6" fill="currentColor"/><rect x="3" y="5" width="9" height="2" fill="currentColor"/><rect x="3" y="7" width="7" height="2" fill="currentColor"/><rect x="3" y="9" width="5" height="7" fill="currentColor"/>`,
    droplets:      `<rect x="6" y="1" width="4" height="2" fill="currentColor"/><rect x="4" y="3" width="8" height="2" fill="currentColor"/><rect x="2" y="5" width="12" height="4" fill="currentColor"/><rect x="3" y="9" width="10" height="2" fill="currentColor"/><rect x="5" y="11" width="6" height="2" fill="currentColor"/><rect x="6" y="13" width="4" height="2" fill="currentColor"/>`,
    // Finance
    coin:          `<rect x="5" y="1" width="6" height="2" fill="currentColor"/><rect x="3" y="3" width="10" height="2" fill="currentColor"/><rect x="2" y="5" width="12" height="6" fill="currentColor"/><rect x="3" y="11" width="10" height="2" fill="currentColor"/><rect x="5" y="13" width="6" height="2" fill="currentColor"/>`,
    arrow_up:      `<rect x="7" y="1" width="2" height="2" fill="currentColor"/><rect x="5" y="3" width="6" height="2" fill="currentColor"/><rect x="3" y="5" width="10" height="2" fill="currentColor"/><rect x="6" y="7" width="4" height="7" fill="currentColor"/>`,
    arrow_down:    `<rect x="6" y="2" width="4" height="7" fill="currentColor"/><rect x="3" y="9" width="10" height="2" fill="currentColor"/><rect x="5" y="11" width="6" height="2" fill="currentColor"/><rect x="7" y="13" width="2" height="2" fill="currentColor"/>`,
    // Header / system
    help:          `<rect x="4" y="1" width="8" height="2" fill="currentColor"/><rect x="10" y="3" width="4" height="4" fill="currentColor"/><rect x="6" y="7" width="6" height="2" fill="currentColor"/><rect x="6" y="9" width="4" height="3" fill="currentColor"/><rect x="7" y="13" width="2" height="3" fill="currentColor"/>`,
    save:          `<rect x="6" y="1" width="4" height="8" fill="currentColor"/><rect x="4" y="7" width="8" height="2" fill="currentColor"/><rect x="5" y="9" width="6" height="2" fill="currentColor"/><rect x="7" y="11" width="2" height="2" fill="currentColor"/><rect x="0" y="13" width="16" height="3" fill="currentColor"/>`,
    reset:         `<rect x="5" y="0" width="6" height="2" fill="currentColor"/><rect x="11" y="2" width="4" height="2" fill="currentColor"/><rect x="13" y="4" width="2" height="6" fill="currentColor"/><rect x="10" y="10" width="4" height="2" fill="currentColor"/><rect x="4" y="12" width="8" height="2" fill="currentColor"/><rect x="2" y="10" width="3" height="2" fill="currentColor"/><rect x="1" y="4" width="2" height="6" fill="currentColor"/><rect x="3" y="2" width="4" height="2" fill="currentColor"/><rect x="0" y="2" width="4" height="5" fill="currentColor"/><rect x="2" y="0" width="4" height="2" fill="currentColor"/>`,
    download:      `<rect x="6" y="1" width="4" height="8" fill="currentColor"/><rect x="4" y="7" width="8" height="2" fill="currentColor"/><rect x="5" y="9" width="6" height="2" fill="currentColor"/><rect x="7" y="11" width="2" height="2" fill="currentColor"/><rect x="1" y="13" width="14" height="3" fill="currentColor"/>`,
    send:          `<rect x="0" y="5" width="2" height="6" fill="currentColor"/><rect x="2" y="3" width="2" height="10" fill="currentColor"/><rect x="4" y="2" width="2" height="12" fill="currentColor"/><rect x="6" y="1" width="2" height="14" fill="currentColor"/><rect x="8" y="0" width="2" height="16" fill="currentColor"/><rect x="10" y="2" width="2" height="12" fill="currentColor"/><rect x="12" y="5" width="2" height="6" fill="currentColor"/>`,
    lock:          `<rect x="5" y="1" width="6" height="2" fill="currentColor"/><rect x="3" y="3" width="10" height="2" fill="currentColor"/><rect x="2" y="5" width="2" height="3" fill="currentColor"/><rect x="12" y="5" width="2" height="3" fill="currentColor"/><rect x="0" y="8" width="16" height="8" fill="currentColor"/>`,
    close:         `<rect x="2" y="2" width="3" height="3" fill="currentColor"/><rect x="10" y="2" width="3" height="3" fill="currentColor"/><rect x="5" y="5" width="6" height="6" fill="currentColor"/><rect x="2" y="10" width="3" height="3" fill="currentColor"/><rect x="10" y="10" width="3" height="3" fill="currentColor"/>`,
    search:        `<rect x="5" y="1" width="5" height="2" fill="currentColor"/><rect x="3" y="3" width="9" height="2" fill="currentColor"/><rect x="2" y="5" width="2" height="4" fill="currentColor"/><rect x="11" y="5" width="2" height="4" fill="currentColor"/><rect x="3" y="9" width="9" height="2" fill="currentColor"/><rect x="5" y="11" width="5" height="2" fill="currentColor"/><rect x="10" y="11" width="2" height="2" fill="currentColor"/><rect x="11" y="12" width="2" height="2" fill="currentColor"/><rect x="12" y="13" width="3" height="3" fill="currentColor"/>`,
    // Tab icons
    wallet:        `<rect x="0" y="2" width="14" height="2" fill="currentColor"/><rect x="0" y="4" width="16" height="10" fill="currentColor"/>`,
    trending_up:   `<rect x="0" y="13" width="5" height="3" fill="currentColor"/><rect x="4" y="9" width="5" height="3" fill="currentColor"/><rect x="8" y="5" width="5" height="3" fill="currentColor"/><rect x="12" y="1" width="4" height="3" fill="currentColor"/><rect x="12" y="1" width="2" height="6" fill="currentColor"/><rect x="10" y="1" width="6" height="2" fill="currentColor"/>`,
    chore:         `<rect x="0" y="0" width="12" height="2" fill="currentColor"/><rect x="0" y="0" width="2" height="14" fill="currentColor"/><rect x="10" y="2" width="2" height="12" fill="currentColor"/><rect x="0" y="12" width="12" height="2" fill="currentColor"/><rect x="2" y="8" width="2" height="4" fill="currentColor"/><rect x="4" y="10" width="2" height="2" fill="currentColor"/><rect x="6" y="5" width="2" height="5" fill="currentColor"/><rect x="8" y="3" width="2" height="4" fill="currentColor"/><rect x="13" y="2" width="3" height="2" fill="currentColor"/><rect x="13" y="6" width="3" height="2" fill="currentColor"/><rect x="13" y="10" width="3" height="2" fill="currentColor"/>`,
    clock:         `<rect x="4" y="0" width="8" height="2" fill="currentColor"/><rect x="2" y="2" width="2" height="2" fill="currentColor"/><rect x="12" y="2" width="2" height="2" fill="currentColor"/><rect x="0" y="4" width="2" height="8" fill="currentColor"/><rect x="14" y="4" width="2" height="8" fill="currentColor"/><rect x="2" y="12" width="2" height="2" fill="currentColor"/><rect x="12" y="12" width="2" height="2" fill="currentColor"/><rect x="4" y="14" width="8" height="2" fill="currentColor"/><rect x="7" y="4" width="2" height="5" fill="currentColor"/><rect x="9" y="9" width="3" height="2" fill="currentColor"/>`,
    camera:        `<rect x="0" y="4" width="16" height="11" fill="currentColor"/><rect x="2" y="2" width="5" height="2" fill="currentColor"/><rect x="12" y="5" width="3" height="3" fill="currentColor"/><rect x="4" y="0" width="8" height="2" fill="currentColor"/><rect x="2" y="2" width="12" height="2" fill="currentColor"/><rect x="0" y="4" width="2" height="11" fill="currentColor"/><rect x="14" y="4" width="2" height="11" fill="currentColor"/><rect x="0" y="14" width="16" height="1" fill="currentColor"/><rect x="5" y="7" width="6" height="2" fill="currentColor"/><rect x="3" y="9" width="2" height="4" fill="currentColor"/><rect x="11" y="9" width="2" height="4" fill="currentColor"/><rect x="5" y="13" width="6" height="2" fill="currentColor"/>`,
    message:       `<rect x="0" y="1" width="16" height="10" fill="currentColor"/><rect x="1" y="11" width="5" height="2" fill="currentColor"/><rect x="1" y="13" width="3" height="2" fill="currentColor"/>`,
    bar_chart:     `<rect x="1" y="9" width="3" height="7" fill="currentColor"/><rect x="6" y="5" width="3" height="11" fill="currentColor"/><rect x="11" y="2" width="3" height="14" fill="currentColor"/><rect x="0" y="15" width="16" height="1" fill="currentColor"/>`,
    // Achievement / chore / trick icons
    star:          `<rect x="7" y="0" width="2" height="5" fill="currentColor"/><rect x="0" y="5" width="16" height="3" fill="currentColor"/><rect x="5" y="3" width="6" height="5" fill="currentColor"/><rect x="2" y="8" width="5" height="6" fill="currentColor"/><rect x="9" y="8" width="5" height="6" fill="currentColor"/>`,
    paw:           `<rect x="3" y="1" width="3" height="3" fill="currentColor"/><rect x="10" y="1" width="3" height="3" fill="currentColor"/><rect x="0" y="4" width="3" height="3" fill="currentColor"/><rect x="13" y="4" width="3" height="3" fill="currentColor"/><rect x="2" y="7" width="12" height="8" fill="currentColor"/><rect x="1" y="9" width="14" height="4" fill="currentColor"/>`,
    play_circle:   `<rect x="4" y="0" width="8" height="2" fill="currentColor"/><rect x="2" y="2" width="2" height="2" fill="currentColor"/><rect x="12" y="2" width="2" height="2" fill="currentColor"/><rect x="0" y="4" width="2" height="8" fill="currentColor"/><rect x="14" y="4" width="2" height="8" fill="currentColor"/><rect x="2" y="12" width="2" height="2" fill="currentColor"/><rect x="12" y="12" width="2" height="2" fill="currentColor"/><rect x="4" y="14" width="8" height="2" fill="currentColor"/><rect x="5" y="5" width="2" height="6" fill="currentColor"/><rect x="7" y="6" width="2" height="4" fill="currentColor"/><rect x="9" y="7" width="2" height="2" fill="currentColor"/>`,
    moon:          `<rect x="9" y="1" width="4" height="2" fill="currentColor"/><rect x="11" y="3" width="3" height="2" fill="currentColor"/><rect x="12" y="5" width="2" height="6" fill="currentColor"/><rect x="11" y="11" width="3" height="2" fill="currentColor"/><rect x="9" y="13" width="4" height="2" fill="currentColor"/><rect x="6" y="2" width="5" height="12" fill="currentColor"/><rect x="4" y="4" width="4" height="8" fill="currentColor"/><rect x="3" y="6" width="3" height="4" fill="currentColor"/>`,
    medical_cross: `<rect x="5" y="0" width="6" height="5" fill="currentColor"/><rect x="0" y="5" width="16" height="6" fill="currentColor"/><rect x="5" y="11" width="6" height="5" fill="currentColor"/>`,
    sparkle:       `<rect x="7" y="0" width="2" height="5" fill="currentColor"/><rect x="7" y="11" width="2" height="5" fill="currentColor"/><rect x="0" y="7" width="5" height="2" fill="currentColor"/><rect x="11" y="7" width="5" height="2" fill="currentColor"/><rect x="5" y="5" width="6" height="6" fill="currentColor"/><rect x="4" y="3" width="2" height="2" fill="currentColor"/><rect x="10" y="3" width="2" height="2" fill="currentColor"/><rect x="4" y="11" width="2" height="2" fill="currentColor"/><rect x="10" y="11" width="2" height="2" fill="currentColor"/>`,
    trash:         `<rect x="5" y="0" width="6" height="3" fill="currentColor"/><rect x="1" y="3" width="14" height="2" fill="currentColor"/><rect x="2" y="5" width="12" height="11" fill="currentColor"/>`,
    trophy:        `<rect x="4" y="0" width="8" height="8" fill="currentColor"/><rect x="1" y="1" width="3" height="5" fill="currentColor"/><rect x="12" y="1" width="3" height="5" fill="currentColor"/><rect x="6" y="8" width="4" height="3" fill="currentColor"/><rect x="3" y="11" width="10" height="2" fill="currentColor"/><rect x="2" y="13" width="12" height="3" fill="currentColor"/>`,
    award:         `<rect x="4" y="0" width="3" height="6" fill="currentColor"/><rect x="9" y="0" width="3" height="6" fill="currentColor"/><rect x="3" y="0" width="4" height="2" fill="currentColor"/><rect x="9" y="0" width="4" height="2" fill="currentColor"/><rect x="4" y="5" width="8" height="2" fill="currentColor"/><rect x="3" y="7" width="10" height="2" fill="currentColor"/><rect x="2" y="9" width="12" height="4" fill="currentColor"/><rect x="4" y="13" width="8" height="3" fill="currentColor"/>`,
    check:         `<rect x="2" y="9" width="2" height="3" fill="currentColor"/><rect x="4" y="11" width="2" height="2" fill="currentColor"/><rect x="6" y="7" width="2" height="4" fill="currentColor"/><rect x="8" y="5" width="2" height="4" fill="currentColor"/><rect x="10" y="3" width="3" height="4" fill="currentColor"/>`,
    user:          `<rect x="6" y="1" width="4" height="2" fill="currentColor"/><rect x="5" y="3" width="6" height="3" fill="currentColor"/><rect x="6" y="6" width="4" height="2" fill="currentColor"/><rect x="3" y="9" width="10" height="4" fill="currentColor"/><rect x="1" y="11" width="14" height="5" fill="currentColor"/>`,
    warn:          `<rect x="7" y="0" width="2" height="2" fill="currentColor"/><rect x="6" y="2" width="4" height="2" fill="currentColor"/><rect x="5" y="4" width="6" height="2" fill="currentColor"/><rect x="4" y="6" width="8" height="2" fill="currentColor"/><rect x="3" y="8" width="10" height="2" fill="currentColor"/><rect x="2" y="10" width="12" height="2" fill="currentColor"/><rect x="1" y="12" width="14" height="2" fill="currentColor"/><rect x="0" y="14" width="16" height="2" fill="currentColor"/>`,
    info:          `<rect x="4" y="0" width="8" height="2" fill="currentColor"/><rect x="2" y="2" width="2" height="2" fill="currentColor"/><rect x="12" y="2" width="2" height="2" fill="currentColor"/><rect x="0" y="4" width="2" height="8" fill="currentColor"/><rect x="14" y="4" width="2" height="8" fill="currentColor"/><rect x="2" y="12" width="2" height="2" fill="currentColor"/><rect x="12" y="12" width="2" height="2" fill="currentColor"/><rect x="4" y="14" width="8" height="2" fill="currentColor"/><rect x="7" y="3" width="2" height="2" fill="currentColor"/><rect x="7" y="6" width="2" height="6" fill="currentColor"/>`,
    list:          `<rect x="0" y="2" width="3" height="2" fill="currentColor"/><rect x="4" y="2" width="11" height="2" fill="currentColor"/><rect x="0" y="7" width="3" height="2" fill="currentColor"/><rect x="4" y="7" width="11" height="2" fill="currentColor"/><rect x="0" y="12" width="3" height="2" fill="currentColor"/><rect x="4" y="12" width="11" height="2" fill="currentColor"/>`,
    bot:           `<rect x="7" y="0" width="2" height="3" fill="currentColor"/><rect x="1" y="3" width="14" height="2" fill="currentColor"/><rect x="1" y="5" width="2" height="5" fill="currentColor"/><rect x="13" y="5" width="2" height="5" fill="currentColor"/><rect x="1" y="10" width="14" height="2" fill="currentColor"/><rect x="4" y="6" width="3" height="3" fill="currentColor"/><rect x="9" y="6" width="3" height="3" fill="currentColor"/><rect x="6" y="12" width="4" height="2" fill="currentColor"/><rect x="1" y="14" width="14" height="2" fill="currentColor"/>`,
    dna:           `<rect x="3" y="0" width="2" height="16" fill="currentColor"/><rect x="11" y="0" width="2" height="16" fill="currentColor"/><rect x="5" y="1" width="6" height="2" fill="currentColor"/><rect x="5" y="6" width="6" height="2" fill="currentColor"/><rect x="5" y="11" width="6" height="2" fill="currentColor"/>`,
  };

  function _wrapPx(rects, size, cls) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 16 16" style="image-rendering:pixelated;image-rendering:crisp-edges" class="${cls}" aria-hidden="true">${rects}</svg>`;
  }

  function _wrap(paths, size, cls, stroke, viewBox) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${viewBox} ${viewBox}" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="square" stroke-linejoin="miter" class="${cls}" aria-hidden="true">${paths}</svg>`;
  }

  return {
    svg(name, size = 20, cls = '') {
      const d = _ui[name];
      if (!d) return '';
      return _wrap(d, size, `icon icon-${name}${cls ? ' ' + cls : ''}`, '2', '24');
    },
    pixelSvg(name, size = 16, cls = '') {
      const d = _px[name];
      if (!d) return this.svg(name, size, cls);
      return _wrapPx(d, size, `icon icon-${name}${cls ? ' ' + cls : ''}`);
    },
    petSvg(typeId, size = 72, cls = '') {
      const d = _pets[typeId] || _pets.dog;
      return _wrap(d, size, `pet-svg pet-svg-${typeId}${cls ? ' ' + cls : ''}`, '1.5', '24');
    },
    emotionSvg(key, size = 28, cls = '') {
      const d = _emo[key] || _emo.neutral;
      return _wrap(d, size, `emo-svg emo-${key}${cls ? ' ' + cls : ''}`, '1.75', '24');
    },
    persSvg(key, size = 24, cls = '') {
      const d = _pers[key] || _pers.friendly;
      return _wrap(d, size, `pers-svg${cls ? ' ' + cls : ''}`, '2', '24');
    },
  };
})();
