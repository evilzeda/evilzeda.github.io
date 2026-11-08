/* =========================================================
   evilzeda — retro handheld RPG personal site
   Town, building interiors with residents, dialog, menus,
   partner battles with legendaries, and content panels.
   Needs i18n.js and sprites.js loaded first.
   ========================================================= */
(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
};
const ART = window.EVZ_ART;
const translations = window.EVZ_I18N;

let lang = 'en';
function t(key, vars) {
    let s = (translations[lang] && translations[lang][key]) ?? translations.en[key] ?? key;
    if (vars) for (const [a, b] of Object.entries(vars)) s = s.split('{' + a + '}').join(b);
    return s;
}
const plain = (s) => String(s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------------------------------------------------------
   Sound (tiny square-wave blips)
   --------------------------------------------------------- */
let soundOn = store.get('sound') !== 'off';
let actx = null;
function blip(freq = 660, dur = 0.05, type = 'square', vol = 0.03) {
    if (!soundOn) return;
    try {
        actx = actx || new (window.AudioContext || window.webkitAudioContext)();
        if (actx.state === 'suspended') actx.resume();
        const o = actx.createOscillator(), gn = actx.createGain();
        o.type = type; o.frequency.value = freq;
        gn.gain.setValueAtTime(vol, actx.currentTime);
        gn.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
        o.connect(gn).connect(actx.destination);
        o.start(); o.stop(actx.currentTime + dur + 0.02);
    } catch (e) { /* audio unavailable */ }
}
const jingle = (notes, gap = 110, dur = 0.09) => notes.forEach((f, i) => setTimeout(() => blip(f, dur), i * gap));

/* ---------------------------------------------------------
   People sprites (16x16)
   --------------------------------------------------------- */
const SPR = {
    down: [
        '................',
        '.....kkkkkk.....',
        '....khhhhhhk....',
        '...khhhhhhhhk...',
        '...khhhhhhhhk...',
        '...khsssssshk...',
        '...ksessssesk...',
        '...kssssssssk...',
        '....kssmmssk....',
        '...kbbkkkkbbk...',
        '..kbbbbwwbbbbk..',
        '..ksbbbbbbbbsk..',
        '...kBBBBBBBBk...',
        '....kppkkppk....',
        '....kpk..kpk....',
        '...kook..kook...'
    ],
    up: [
        '................',
        '.....kkkkkk.....',
        '....khhhhhhk....',
        '...khhhhhhhhk...',
        '...khhhhhhhhk...',
        '...khhhhhhhhk...',
        '...khhhhhhhhk...',
        '...kshhhhhhsk...',
        '....kssssssk....',
        '...kbbbbbbbbk...',
        '..kbbBBBBBBbbk..',
        '..ksbbbbbbbbsk..',
        '...kBBBBBBBBk...',
        '....kppkkppk....',
        '....kpk..kpk....',
        '...kook..kook...'
    ],
    right: [
        '................',
        '.....kkkkk......',
        '....khhhhhk.....',
        '...khhhhhhhk....',
        '...khhhhhhhhk...',
        '...khhhhsssk....',
        '...khhhssesk....',
        '...khhsssssk....',
        '....kkssmsk.....',
        '....kbbbbbk.....',
        '...kbbbbbbbk....',
        '...kbbbsbbbk....',
        '...kBBBBBBBk....',
        '....kppppk......',
        '....kpkkpk......',
        '....kokkok......'
    ]
};
SPR.downWalk = SPR.down.slice(0, 14).concat(['...kpk....kpk...', '...kok....kok...']);
SPR.upWalk = SPR.up.slice(0, 14).concat(['...kpk....kpk...', '...kok....kok...']);
SPR.rightWalk = SPR.right.slice(0, 14).concat(['...kpk..kpk.....', '..kook..kook....']);

function styleRows(rows, style) {
    const out = rows.map((r) => r.split(''));
    if (style === 'long') {
        for (let y = 4; y <= 9; y++) { out[y][2] = 'k'; out[y][3] = 'h'; out[y][12] = 'h'; out[y][13] = 'k'; }
    }
    if (style === 'cap') {
        for (let y = 2; y <= 3; y++) out[y] = out[y].map((c) => (c === 'h' ? 'c' : c));
        out[4] = '..kCCCCCCCCCCk..'.split('');
    }
    return out.map((r) => r.join(''));
}

const PAL_PLAYER = { k: '#1b1b2f', h: '#3b2a20', s: '#f2c79b', e: '#1b1b2f', m: '#c9735a', b: '#2bb3a3', B: '#1d7f74', w: '#ffffff', p: '#34405a', o: '#c0392b' };
const PAL_TOWNNPC = Object.assign({}, PAL_PLAYER, { h: '#c96f2d', b: '#8e5cc2', B: '#64408a', o: '#2a2a3a' });

const RESIDENTS = {
    mom:     { style: 'long', pal: { h: '#8a3b2a', b: '#ef8fae', B: '#c96a8a', p: '#6a4a8a', o: '#3a2a3a', m: '#d0586a' } },
    post:    { style: 'cap',  pal: { c: '#3d6fd6', C: '#2a4f9e', h: '#2a1a12', b: '#3d6fd6', B: '#2a4f9e', w: '#ffd447', p: '#2a2f45', o: '#1b1b2f', s: '#d9a77a' } },
    prof:    { style: 'none', pal: { h: '#c9ced6', b: '#f4f6f8', B: '#cfd6de', w: '#7fb6e6', p: '#5a4a3a', o: '#3a2a1a' } },
    leader:  { style: 'cap',  pal: { c: '#e04b3c', C: '#a8322a', h: '#1b1b2f', b: '#23233a', B: '#e04b3c', w: '#ffd447', p: '#23233a', o: '#e04b3c', s: '#c98b5e' } },
    curator: { style: 'long', pal: { h: '#1b1b2f', b: '#8e5cc2', B: '#64408a', w: '#ffffff', p: '#3a3a55', o: '#1b1b2f', s: '#f6d2b0' } }
};
for (const r of Object.values(RESIDENTS)) {
    r.rows = styleRows(SPR.down, r.style);
    r.pal = Object.assign({}, PAL_PLAYER, r.pal);
}

function drawRows(ctx, rows, pal, x, y, flip = false, scale = 1) {
    for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        for (let c = 0; c < row.length; c++) {
            const ch = row[c];
            if (ch === '.' || !pal[ch]) continue;
            ctx.fillStyle = pal[ch];
            const cx = flip ? (row.length - 1 - c) : c;
            ctx.fillRect(x + cx * scale, y + r * scale, scale, scale);
        }
    }
}
function spriteURL(rows, pal, scale = 8) {
    const c = document.createElement('canvas');
    c.width = 16 * scale; c.height = rows.length * scale;
    drawRows(c.getContext('2d'), rows, pal, 0, 0, false, scale);
    return c.toDataURL();
}

/* ---------------------------------------------------------
   Town map
   T tree  . grass  , tall grass  = path  ~ water  * flowers
   --------------------------------------------------------- */
const MAP = [
    'TTTTTTTTTTTTTTTTTTTT',
    'T*..............*..T',
    'T..................T',
    'T..................T',
    'T..................T',
    'T.================.T',
    'T,,,,..=..~~~~...*.T',
    'T,,,,,.=..~~~~..,,,T',
    'T,,,,..=..~~~~..,,,T',
    'T......=...........T',
    'T......=...........T',
    'T......=...........T',
    'T.================.T',
    'T*..,,,,,,,,,,,,..*T',
    'TTTTTTTTTTTTTTTTTTTT'
];
const COLS = 20, ROWS = 15, TS = 16;

const BUILDINGS = [
    { id: 'home',  panel: 'home',      x: 2,  y: 2, w: 4, h: 3, roof: '#d65a5a' },
    { id: 'mail',  panel: 'contact',   x: 8,  y: 2, w: 4, h: 3, roof: '#f2a541' },
    { id: 'lab',   panel: 'about',     x: 14, y: 2, w: 4, h: 3, roof: '#4f7cc2' },
    { id: 'gym',   panel: 'services',  x: 2,  y: 9, w: 5, h: 3, roof: '#2a9d8f' },
    { id: 'works', panel: 'portfolio', x: 13, y: 9, w: 5, h: 3, roof: '#8e5cc2' }
];
BUILDINGS.forEach((b) => { b.door = { x: b.x + 2, y: b.y + b.h - 1 }; });
const BUILDING = Object.fromEntries(BUILDINGS.map((b) => [b.id, b]));

const SIGNS = [
    { x: 9, y: 6, key: 'sign_town' },
    { x: 6, y: 4, key: 'sign_home' },
    { x: 12, y: 4, key: 'sign_mail' },
    { x: 18, y: 4, key: 'sign_lab' },
    { x: 1, y: 11, key: 'sign_gym' },
    { x: 12, y: 11, key: 'sign_works' }
];

const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

const player = { x: 4, y: 5, tx: 4, ty: 5, t: 0, moving: false, dir: 'down', step: 0, emote: false };
const townNpc = { x: 15, y: 7, dir: 'left' };
let scene = 'town';
let stepsSinceBattle = 0;

const buildingAt = (x, y) => BUILDINGS.find((b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h);
const signAt = (x, y) => SIGNS.find((s) => s.x === x && s.y === y);
const tileAt = (x, y) => (MAP[y] && MAP[y][x]) || 'T';

/* ---------------------------------------------------------
   Interiors — one resident per building
   Floor is x 3..16, y 3..13. Mat at (9,13)/(10,13).
   --------------------------------------------------------- */
const ROOM = { x0: 3, x1: 16, y0: 3, y1: 13 };
const MAT = [[9, 13], [10, 13]];
const INTERIORS = {
    home: {
        who: 'mom', name: 'name_mom', npc: { x: 12, y: 8 }, lines: ['mom_1', 'mom_2', 'mom_3'], heal: true,
        floor: 'wood', wall: '#f6dfc4', trim: '#d65a5a',
        rug: { x: 6, y: 7, w: 5, h: 4, c: '#d65a5a' },
        deco: [['window', 5], ['frame', 9], ['window', 12]],
        props: [
            { k: 'bed', x: 3, y: 3, w: 2, h: 2, say: 'obj_bed' },
            { k: 'shelf', x: 6, y: 3, w: 2, h: 1, say: 'obj_shelf' },
            { k: 'tv', x: 13, y: 3, w: 2, h: 1, say: 'obj_tv' },
            { k: 'table', x: 7, y: 8, w: 3, h: 1 },
            { k: 'plant', x: 16, y: 3, w: 1, h: 1 },
            { k: 'plant', x: 3, y: 12, w: 1, h: 1 }
        ]
    },
    mail: {
        who: 'post', name: 'name_post', npc: { x: 9, y: 5 }, lines: ['post_1', 'post_2'],
        floor: 'tile', wall: '#fbe6b4', trim: '#f2a541',
        deco: [['window', 4], ['clock', 9], ['window', 14]],
        props: [
            { k: 'cubby', x: 4, y: 3, w: 4, h: 1, say: 'obj_cubby' },
            { k: 'cubby', x: 12, y: 3, w: 4, h: 1, say: 'obj_cubby' },
            { k: 'counter', x: 5, y: 6, w: 10, h: 1 },
            { k: 'bags', x: 14, y: 10, w: 2, h: 1 },
            { k: 'plant', x: 3, y: 12, w: 1, h: 1 },
            { k: 'plant', x: 16, y: 12, w: 1, h: 1 }
        ]
    },
    lab: {
        who: 'prof', name: 'name_prof', npc: { x: 9, y: 6 }, lines: ['prof_1', 'prof_2'],
        floor: 'lab', wall: '#e4ecf7', trim: '#4f7cc2',
        deco: [['board', 4], ['window', 14]],
        props: [
            { k: 'shelf', x: 3, y: 3, w: 3, h: 1, say: 'obj_shelf' },
            { k: 'machine', x: 8, y: 3, w: 4, h: 2, say: 'obj_machine' },
            { k: 'shelf', x: 14, y: 3, w: 3, h: 1, say: 'obj_shelf' },
            { k: 'desk', x: 12, y: 8, w: 3, h: 1, say: 'obj_pc' },
            { k: 'plant', x: 3, y: 12, w: 1, h: 1 },
            { k: 'plant', x: 16, y: 12, w: 1, h: 1 }
        ]
    },
    gym: {
        who: 'leader', name: 'name_leader', npc: { x: 9, y: 5 }, lines: ['leader_1', 'leader_2'],
        floor: 'gym', wall: '#d7f0ea', trim: '#2a9d8f',
        rug: { x: 6, y: 4, w: 8, h: 6, c: '#2a9d8f', arena: true },
        deco: [['banner', 5], ['banner', 9], ['banner', 13]],
        props: [
            { k: 'trophy', x: 3, y: 3, w: 2, h: 1, say: 'obj_trophy' },
            { k: 'trophy', x: 15, y: 3, w: 2, h: 1, say: 'obj_trophy' },
            { k: 'statue', x: 7, y: 11, w: 1, h: 1, say: 'obj_statue' },
            { k: 'statue', x: 12, y: 11, w: 1, h: 1, say: 'obj_statue' }
        ]
    },
    works: {
        who: 'curator', name: 'name_curator', npc: { x: 13, y: 9 }, lines: ['curator_1', 'curator_2'],
        floor: 'gallery', wall: '#efe6fa', trim: '#8e5cc2',
        rug: { x: 7, y: 8, w: 6, h: 4, c: '#8e5cc2' },
        deco: [['art', 4], ['art', 7], ['art', 10], ['art', 13]],
        props: [
            { k: 'pedestal', x: 5, y: 5, w: 1, h: 1, c: '#2bb3a3', say: 'obj_pedestal' },
            { k: 'pedestal', x: 8, y: 5, w: 1, h: 1, c: '#e0688a', say: 'obj_pedestal' },
            { k: 'pedestal', x: 11, y: 5, w: 1, h: 1, c: '#4f7cc2', say: 'obj_pedestal' },
            { k: 'pedestal', x: 14, y: 5, w: 1, h: 1, c: '#ffd447', say: 'obj_pedestal' },
            { k: 'bench', x: 8, y: 9, w: 4, h: 1 },
            { k: 'plant', x: 3, y: 3, w: 1, h: 1 },
            { k: 'plant', x: 16, y: 3, w: 1, h: 1 }
        ]
    }
};

function propAt(room, x, y) { return room.props.find((p) => x >= p.x && x < p.x + p.w && y >= p.y && y < p.y + p.h); }
const isMat = (x, y) => MAT.some(([mx, my]) => mx === x && my === y);

function isSolid(x, y) {
    if (scene === 'town') {
        if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return true;
        const c = tileAt(x, y);
        if (c === 'T' || c === '~') return true;
        if (buildingAt(x, y) || signAt(x, y)) return true;
        return townNpc.x === x && townNpc.y === y;
    }
    const room = INTERIORS[scene];
    if (x < ROOM.x0 || x > ROOM.x1 || y < ROOM.y0 || y > ROOM.y1) return true;
    if (room.npc.x === x && room.npc.y === y) return true;
    return !!propAt(room, x, y);
}

/* ---------------------------------------------------------
   Painting helpers
   --------------------------------------------------------- */
function hash(x, y, n) {
    let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(n, 1442695041)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const shade = ART.shade;

function paintTile(g, ch, tx, ty, f) {
    const X = tx * TS, Y = ty * TS;
    const P = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(X + x, Y + y, w, h); };
    const grass = () => {
        P(0, 0, 16, 16, '#7ccf6a');
        for (let i = 0; i < 6; i++) P(Math.floor(hash(tx, ty, i) * 15), Math.floor(hash(tx, ty, i + 9) * 14), 1, 2, '#5db55a');
        for (let i = 0; i < 3; i++) P(Math.floor(hash(tx, ty, i + 20) * 15), Math.floor(hash(tx, ty, i + 30) * 15), 1, 1, '#a5e28f');
    };
    switch (ch) {
        case '.': grass(); break;
        case '=': {
            P(0, 0, 16, 16, '#e9d7a3');
            for (let i = 0; i < 7; i++) P(Math.floor(hash(tx, ty, i + 40) * 15), Math.floor(hash(tx, ty, i + 50) * 15), 1, 1, i % 2 ? '#d6c08a' : '#f6e9c4');
            if (tileAt(tx, ty - 1) !== '=') P(0, 0, 16, 1, '#c9b27a');
            if (tileAt(tx, ty + 1) !== '=') P(0, 15, 16, 1, '#c9b27a');
            if (tileAt(tx - 1, ty) !== '=') P(0, 0, 1, 16, '#c9b27a');
            if (tileAt(tx + 1, ty) !== '=') P(15, 0, 1, 16, '#c9b27a');
            break;
        }
        case ',': {
            P(0, 0, 16, 16, '#4fa556');
            [[1, 2], [9, 1], [4, 9], [11, 9]].forEach(([ax, ay], i) => {
                const sw = (f + i) % 2;
                P(ax, ay + 3, 1, 4, '#2f7d3e');
                P(ax + 1, ay + 1, 1, 6, '#3b9148');
                P(ax + 2, ay + 2, 1, 5, '#2f7d3e');
                P(ax + 3, ay + 1, 1, 6, '#3b9148');
                P(ax + 4, ay + 3, 1, 4, '#2f7d3e');
                P(ax + 1 + sw, ay, 1, 1, '#8fdc78');
                P(ax + 3 + sw, ay, 1, 1, '#8fdc78');
            });
            break;
        }
        case '~': {
            P(0, 0, 16, 16, '#4aa3df');
            for (const r of [4, 10]) {
                for (let x = 0; x < 16; x++) if (((x + f * 3 + r) % 8) < 3) P(x, r + (x % 8 < 2 ? 0 : 1), 1, 1, '#a6dcf6');
            }
            if (tileAt(tx, ty - 1) !== '~') P(0, 0, 16, 2, '#c8eefc');
            if (tileAt(tx, ty + 1) !== '~') P(0, 14, 16, 2, '#3586bd');
            if (tileAt(tx - 1, ty) !== '~') P(0, 0, 2, 16, '#c8eefc');
            if (tileAt(tx + 1, ty) !== '~') P(14, 0, 2, 16, '#3586bd');
            break;
        }
        case '*': {
            grass();
            const cols = ['#ff6b6b', '#ffd93d', '#ffffff', '#ff9ad5'];
            [[4, 5], [11, 10], [10, 3]].forEach(([cx, cy], i) => {
                const c = cols[Math.floor(hash(tx, ty, i + 60) * cols.length)];
                const yy = cy + ((f + i) % 2);
                P(cx - 1, yy, 3, 1, c); P(cx, yy - 1, 1, 3, c);
                P(cx, yy, 1, 1, c === '#ffd93d' ? '#ff8c00' : '#ffd93d');
                P(cx, yy + 2, 1, 2, '#3b9148');
            });
            break;
        }
        case 'T': {
            grass();
            const rows = [[4, 11], [2, 13], [1, 14], [1, 14], [0, 15], [0, 15], [0, 15], [1, 14], [1, 14], [2, 13], [4, 11]];
            P(6, 10, 4, 6, '#7a4a2a'); P(6, 10, 1, 6, '#5a3418');
            rows.forEach(([a, b], r) => {
                P(a, r, b - a + 1, 1, r > 7 ? '#26744a' : '#2e8b57');
                P(a, r, 1, 1, '#1d5a39'); P(b, r, 1, 1, '#1d5a39');
            });
            P(4, 0, 8, 1, '#1d5a39'); P(4, 10, 8, 1, '#1d5a39');
            P(3, 2, 3, 1, '#56b47e'); P(2, 3, 2, 2, '#56b47e'); P(9, 4, 2, 1, '#3fa06a'); P(5, 6, 2, 1, '#3fa06a');
            break;
        }
        default: grass();
    }
}

function paintBuilding(g, b) {
    const X = b.x * TS, Y = b.y * TS, W = b.w * TS, H = b.h * TS;
    const ink = '#2a2a3a', roofH = 22;
    g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(X + 3, Y + H - 2, W - 2, 3);
    g.fillStyle = ink; g.fillRect(X + 1, Y + roofH - 2, W - 2, H - roofH + 2);
    g.fillStyle = '#f4ead5'; g.fillRect(X + 2, Y + roofH - 1, W - 4, H - roofH);
    g.fillStyle = '#e2d3b2'; g.fillRect(X + 2, Y + H - 4, W - 4, 3);
    // roof with shingles and a chimney
    g.fillStyle = ink; g.fillRect(X + W - 14, Y - 3, 8, 8);
    g.fillStyle = shade(b.roof, -0.3); g.fillRect(X + W - 13, Y - 2, 6, 6);
    g.fillStyle = ink; g.fillRect(X, Y + 1, W, roofH);
    g.fillStyle = b.roof; g.fillRect(X + 1, Y + 2, W - 2, roofH - 2);
    g.fillStyle = shade(b.roof, -0.22);
    for (let yy = Y + 6, row = 0; yy < Y + roofH; yy += 5, row++) {
        g.fillRect(X + 1, yy, W - 2, 1);
        for (let xx = X + 3 + (row % 2) * 4; xx < X + W - 2; xx += 8) g.fillRect(xx, yy - 4, 1, 4);
    }
    g.fillStyle = shade(b.roof, 0.3); g.fillRect(X + 1, Y + 2, W - 2, 1);
    g.fillStyle = shade(b.roof, -0.4); g.fillRect(X + 1, Y + roofH - 1, W - 2, 1);
    const wy = Y + roofH + 3;
    [X + 6, X + W - 18].forEach((wx) => {
        g.fillStyle = ink; g.fillRect(wx - 1, wy - 1, 14, 11);
        g.fillStyle = '#9fd3f0'; g.fillRect(wx, wy, 12, 9);
        g.fillStyle = '#d9f1fc'; g.fillRect(wx + 1, wy + 1, 3, 2);
        g.fillStyle = ink; g.fillRect(wx + 6, wy, 1, 9); g.fillRect(wx, wy + 4, 12, 1);
    });
    const dx = b.door.x * TS + 3, dy = Y + H - 15;
    g.fillStyle = ink; g.fillRect(dx - 1, dy - 1, 12, 15);
    g.fillStyle = '#8a5a3a'; g.fillRect(dx, dy, 10, 14);
    g.fillStyle = '#6b4229'; g.fillRect(dx + 1, dy + 2, 3, 4); g.fillRect(dx + 6, dy + 2, 3, 4);
    g.fillStyle = '#ffd166'; g.fillRect(dx + 7, dy + 8, 1, 2);
}

function paintSign(g, s) {
    const X = s.x * TS, Y = s.y * TS;
    g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(X + 4, Y + 14, 9, 2);
    g.fillStyle = '#5a3418'; g.fillRect(X + 7, Y + 9, 2, 6);
    g.fillStyle = '#2a2a3a'; g.fillRect(X + 1, Y + 2, 14, 9);
    g.fillStyle = '#c89458'; g.fillRect(X + 2, Y + 3, 12, 7);
    g.fillStyle = '#a87438'; g.fillRect(X + 4, Y + 5, 8, 1); g.fillRect(X + 4, Y + 7, 6, 1);
}

/* --- interior painting --- */
function paintFloor(P, kind, tx, ty) {
    const X = tx * TS, Y = ty * TS;
    switch (kind) {
        case 'wood':
            P(X, Y, 16, 16, '#d39a5f');
            for (let r = 0; r < 4; r++) {
                P(X, Y + r * 4 + 3, 16, 1, '#b7804a');
                P(X + Math.floor(hash(tx, ty + r, 3) * 14), Y + r * 4, 1, 3, '#b7804a');
            }
            break;
        case 'tile':
            P(X, Y, 16, 16, (tx + ty) % 2 ? '#efe8d6' : '#e2d8c0');
            P(X, Y + 15, 16, 1, '#cfc3a6'); P(X + 15, Y, 1, 16, '#cfc3a6');
            break;
        case 'lab':
            P(X, Y, 16, 16, '#eef3f9');
            P(X, Y + 15, 16, 1, '#cad6e6'); P(X + 15, Y, 1, 16, '#cad6e6');
            P(X + 1, Y + 1, 3, 1, '#ffffff');
            break;
        case 'gym':
            P(X, Y, 16, 16, (tx + ty) % 2 ? '#c9d6d2' : '#bdcbc7');
            P(X, Y + 15, 16, 1, '#a9b9b4');
            break;
        default: // gallery
            P(X, Y, 16, 16, '#a8744a');
            for (let i = 0; i < 4; i++) P(X + i * 4 + ((ty % 2) * 2), Y, 1, 16, '#8f603a');
            P(X, Y + 15, 16, 1, '#8f603a');
    }
}

const PROP = {
    bed(P, X, Y) {
        P(X, Y - 2, 32, 34, '#2a2a3a'); P(X + 1, Y - 1, 30, 32, '#8a5a3a');
        P(X + 3, Y + 1, 26, 28, '#ffffff'); P(X + 4, Y + 2, 24, 7, '#f1f1f8');
        P(X + 3, Y + 11, 26, 18, '#4f7cc2'); P(X + 3, Y + 11, 26, 2, '#6f98dc');
        for (let i = 0; i < 4; i++) P(X + 6 + i * 6, Y + 16, 3, 3, '#3d64a8');
    },
    shelf(P, X, Y, w) {
        P(X, Y - 16, w * 16, 30, '#2a2a3a'); P(X + 1, Y - 15, w * 16 - 2, 28, '#9a6a42');
        const cols = ['#e0688a', '#4f7cc2', '#2bb3a3', '#ffd447', '#8e5cc2', '#f2a541'];
        [Y - 13, Y - 2].forEach((yy, r) => {
            P(X + 2, yy + 9, w * 16 - 4, 2, '#6b4229');
            for (let x = X + 3, i = r; x < X + w * 16 - 4; x += 4, i++) P(x, yy + 1 + (i % 3), 3, 8 - (i % 3), cols[i % cols.length]);
        });
    },
    tv(P, X, Y) {
        P(X + 2, Y + 4, 28, 10, '#2a2a3a'); P(X + 3, Y + 5, 26, 8, '#8a5a3a');
        P(X + 4, Y - 12, 24, 17, '#2a2a3a'); P(X + 6, Y - 10, 20, 12, '#5ad0ff');
        P(X + 7, Y - 9, 6, 2, '#c9f1ff'); P(X + 10, Y - 4, 12, 4, '#2bb3a3');
        P(X + 20, Y + 7, 6, 3, '#e04b3c');
    },
    table(P, X, Y, w) {
        P(X, Y - 2, w * 16, 14, '#2a2a3a'); P(X + 1, Y - 1, w * 16 - 2, 9, '#c98b52');
        P(X + 1, Y + 8, w * 16 - 2, 3, '#8a5a3a');
        P(X + 18, Y + 1, 6, 4, '#ffffff'); P(X + 19, Y + 2, 4, 2, '#e0688a');
    },
    plant(P, X, Y) {
        P(X + 4, Y + 8, 8, 7, '#2a2a3a'); P(X + 5, Y + 9, 6, 5, '#c96f2d');
        P(X + 2, Y - 2, 12, 11, '#2a2a3a');
        P(X + 3, Y - 1, 10, 9, '#3fa06a'); P(X + 5, Y - 4, 6, 4, '#3fa06a');
        P(X + 4, Y, 3, 2, '#7ccf6a'); P(X + 7, Y - 3, 2, 2, '#7ccf6a');
    },
    counter(P, X, Y, w) {
        P(X, Y - 1, w * 16, 17, '#2a2a3a');
        P(X + 1, Y, w * 16 - 2, 5, '#f6c26a'); P(X + 1, Y + 5, w * 16 - 2, 10, '#c9772a');
        for (let x = X + 8; x < X + w * 16 - 8; x += 24) P(x, Y + 7, 10, 6, '#a95f1c');
        P(X + 20, Y - 3, 8, 4, '#ffffff'); P(X + 21, Y - 2, 6, 1, '#e04b3c');
        P(X + w * 16 - 34, Y - 4, 10, 5, '#f4ead5'); P(X + w * 16 - 33, Y - 3, 8, 1, '#4f7cc2');
    },
    cubby(P, X, Y, w) {
        P(X, Y - 16, w * 16, 30, '#2a2a3a'); P(X + 1, Y - 15, w * 16 - 2, 28, '#b37a46');
        for (let r = 0; r < 3; r++) for (let c = 0; c < w * 2; c++) {
            const cx = X + 2 + c * 8, cy = Y - 14 + r * 9;
            P(cx, cy, 7, 8, '#6b4229');
            if (hash(c, r, w + X) > 0.35) P(cx + 1, cy + 3, 5, 4, hash(c, r, 9) > 0.5 ? '#ffffff' : '#ffe9b0');
        }
    },
    bags(P, X, Y) {
        [[X + 2, '#b9935a'], [X + 15, '#a37f48']].forEach(([x, c]) => {
            P(x, Y - 2, 14, 16, '#2a2a3a'); P(x + 1, Y - 1, 12, 14, c);
            P(x + 4, Y - 4, 6, 3, '#2a2a3a'); P(x + 3, Y + 4, 8, 3, '#4f7cc2');
        });
    },
    machine(P, X, Y, w, h) {
        P(X, Y - 16, w * 16, h * 16 + 14, '#2a2a3a'); P(X + 1, Y - 15, w * 16 - 2, h * 16 + 12, '#9aa7b8');
        P(X + 4, Y - 12, w * 16 - 8, 14, '#2a2a3a'); P(X + 5, Y - 11, w * 16 - 10, 12, '#1f3b4f');
        for (let i = 0; i < 6; i++) P(X + 8 + i * 8, Y - 8 + (i % 3) * 2, 5, 4 - (i % 3), ['#4dff9a', '#5ad0ff', '#ffd447'][i % 3]);
        for (let i = 0; i < 8; i++) P(X + 6 + i * 7, Y + 6, 4, 3, i % 3 ? '#ffd447' : '#ff5d73');
        P(X + 4, Y + 14, w * 16 - 8, 10, '#7d8a9c');
        for (let x = X + 8; x < X + w * 16 - 8; x += 6) P(x, Y + 16, 3, 6, '#5f6b7c');
    },
    desk(P, X, Y, w) {
        P(X, Y - 2, w * 16, 15, '#2a2a3a'); P(X + 1, Y - 1, w * 16 - 2, 6, '#e7ecf3'); P(X + 1, Y + 5, w * 16 - 2, 7, '#b9c4d3');
        P(X + 6, Y - 14, 18, 14, '#2a2a3a'); P(X + 7, Y - 13, 16, 10, '#2bb3a3');
        P(X + 9, Y - 10, 2, 6, '#ffd447'); P(X + 13, Y - 8, 2, 4, '#e0688a'); P(X + 17, Y - 11, 2, 7, '#ffffff');
        P(X + 30, Y - 4, 10, 4, '#4f7cc2');
    },
    trophy(P, X, Y, w) {
        P(X, Y - 14, w * 16, 28, '#2a2a3a'); P(X + 1, Y - 13, w * 16 - 2, 26, '#5b6b8a');
        P(X + 2, Y - 1, w * 16 - 4, 2, '#3a465e');
        for (let i = 0; i < w * 2; i++) {
            const x = X + 3 + i * 7;
            P(x, Y - 10, 5, 4, '#ffd447'); P(x + 2, Y - 6, 1, 3, '#d9a520'); P(x + 1, Y - 3, 3, 2, '#d9a520');
            P(x, Y + 4, 5, 6, i % 2 ? '#c9ced6' : '#e08a3c');
        }
    },
    statue(P, X, Y) {
        P(X + 1, Y + 6, 14, 10, '#2a2a3a'); P(X + 2, Y + 7, 12, 8, '#9aa7b8');
        P(X + 2, Y - 14, 12, 21, '#2a2a3a'); P(X + 3, Y - 13, 10, 19, '#c9d1dc');
        P(X + 4, Y - 18, 3, 6, '#2a2a3a'); P(X + 9, Y - 18, 3, 6, '#2a2a3a');
        P(X + 5, Y - 9, 2, 2, '#5a6b8c'); P(X + 9, Y - 9, 2, 2, '#5a6b8c');
        P(X + 4, Y - 12, 3, 2, '#ffffff');
    },
    pedestal(P, X, Y, w, h, c) {
        P(X + 2, Y - 2, 12, 18, '#2a2a3a'); P(X + 3, Y - 1, 10, 16, '#f4f0fa'); P(X + 3, Y + 11, 10, 4, '#d9d0e8');
        P(X + 3, Y - 12, 10, 10, '#2a2a3a'); P(X + 4, Y - 11, 8, 8, c);
        P(X + 5, Y - 10, 3, 2, '#ffffff');
    },
    bench(P, X, Y, w) {
        P(X, Y, w * 16, 10, '#2a2a3a'); P(X + 1, Y + 1, w * 16 - 2, 5, '#6b4229');
        P(X + 4, Y + 6, 3, 6, '#2a2a3a'); P(X + w * 16 - 7, Y + 6, 3, 6, '#2a2a3a');
    }
};

function paintDeco(P, kind, tx, room) {
    const X = tx * TS, Y = 16;
    switch (kind) {
        case 'window':
            P(X, Y + 4, 30, 22, '#2a2a3a'); P(X + 2, Y + 6, 26, 18, '#9fd3f0');
            P(X + 3, Y + 7, 8, 4, '#d9f1fc'); P(X + 14, Y + 6, 2, 18, '#2a2a3a'); P(X + 2, Y + 14, 26, 2, '#2a2a3a');
            P(X - 2, Y + 24, 34, 3, room.trim);
            break;
        case 'frame':
            P(X, Y + 5, 28, 20, '#2a2a3a'); P(X + 2, Y + 7, 24, 16, '#f2c14e');
            P(X + 4, Y + 9, 20, 12, '#7ccf6a'); P(X + 4, Y + 9, 20, 5, '#9fd3f0'); P(X + 16, Y + 10, 4, 4, '#ffd447');
            break;
        case 'clock':
            P(X + 4, Y + 4, 22, 22, '#2a2a3a'); P(X + 6, Y + 6, 18, 18, '#ffffff');
            P(X + 14, Y + 9, 2, 7, '#2a2a3a'); P(X + 14, Y + 14, 6, 2, '#2a2a3a');
            break;
        case 'board':
            P(X, Y + 3, 60, 25, '#8a5a3a'); P(X + 2, Y + 5, 56, 21, '#2f5a4a');
            P(X + 5, Y + 9, 18, 1, '#ffffff'); P(X + 5, Y + 13, 26, 1, '#ffffff'); P(X + 5, Y + 17, 14, 1, '#ffffff');
            P(X + 38, Y + 8, 2, 14, '#ffffff'); P(X + 38, Y + 21, 16, 1, '#ffffff'); P(X + 40, Y + 18, 4, 3, '#ffd447'); P(X + 46, Y + 13, 4, 8, '#e0688a');
            break;
        case 'banner':
            P(X + 6, Y + 2, 20, 26, '#2a2a3a'); P(X + 7, Y + 3, 18, 22, room.trim);
            P(X + 12, Y + 8, 8, 8, '#ffd447'); P(X + 14, Y + 10, 4, 4, '#ffffff');
            P(X + 7, Y + 25, 6, 3, room.trim); P(X + 19, Y + 25, 6, 3, room.trim);
            break;
        case 'art': {
            const cols = [['#2bb3a3', '#ffd447'], ['#e0688a', '#4f7cc2'], ['#8e5cc2', '#ffd447'], ['#4f7cc2', '#e0688a']][(tx / 3 | 0) % 4];
            P(X + 2, Y + 3, 28, 24, '#2a2a3a'); P(X + 4, Y + 5, 24, 20, '#f2c14e');
            P(X + 6, Y + 7, 20, 16, cols[0]); P(X + 9, Y + 12, 8, 8, cols[1]); P(X + 18, Y + 9, 5, 12, '#ffffff');
            break;
        }
    }
}

function bakeRoom(id) {
    const room = INTERIORS[id];
    const c = document.createElement('canvas'); c.width = 320; c.height = 240;
    const g = c.getContext('2d');
    const P = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), w, h); };
    P(0, 0, 320, 240, '#0d0d1a');
    const L = ROOM.x0 * TS, R = (ROOM.x1 + 1) * TS, B = (ROOM.y1 + 1) * TS;
    // walls
    P(L, 16, R - L, 32, room.wall);
    for (let x = L; x < R; x += 8) P(x, 18, 1, 26, shade(room.wall, -0.06));
    P(L, 16, R - L, 3, shade(room.wall, -0.2));
    P(L, 44, R - L, 4, shade(room.wall, -0.4));
    // floor
    for (let ty = ROOM.y0; ty <= ROOM.y1; ty++) for (let tx = ROOM.x0; tx <= ROOM.x1; tx++) paintFloor(P, room.floor, tx, ty);
    P(L, 48, R - L, 3, 'rgba(0,0,0,.18)');
    // rug
    if (room.rug) {
        const r = room.rug, x = r.x * TS, y = r.y * TS, w = r.w * TS, h = r.h * TS;
        P(x, y, w, h, shade(r.c, -0.35)); P(x + 2, y + 2, w - 4, h - 4, r.c);
        P(x + 5, y + 5, w - 10, h - 10, shade(r.c, 0.25)); P(x + 7, y + 7, w - 14, h - 14, r.c);
        if (r.arena) {
            P(x + 2, y + h / 2 - 1, w - 4, 2, '#ffffff');
            const cx = x + w / 2, cy = y + h / 2;
            for (let a = 0; a < 40; a++) { const an = a / 40 * Math.PI * 2; P(cx + Math.cos(an) * 14 - 1, cy + Math.sin(an) * 14 - 1, 2, 2, '#ffffff'); }
        }
    }
    // wall decorations
    room.deco.forEach(([k, tx]) => paintDeco(P, k, tx, room));
    // props
    room.props.forEach((p) => PROP[p.k](P, p.x * TS, p.y * TS, p.w, p.h, p.c));
    // mat
    P(9 * TS + 2, 13 * TS + 4, 28, 10, '#2a2a3a'); P(9 * TS + 3, 13 * TS + 5, 26, 8, '#d65a5a');
    for (let x = 9 * TS + 5; x < 9 * TS + 28; x += 4) P(x, 13 * TS + 6, 2, 6, '#ef8a8a');
    // room border
    P(L - 4, 12, R - L + 8, 4, '#2a2a3a'); P(L - 4, 12, 4, B - 12 + 4, '#2a2a3a'); P(R, 12, 4, B - 12 + 4, '#2a2a3a');
    P(L - 4, B, 9 * TS - L + 4, 4, '#2a2a3a'); P(11 * TS, B, R - 11 * TS + 4, 4, '#2a2a3a');
    return c;
}

/* ---------------------------------------------------------
   World baking + render
   --------------------------------------------------------- */
const world = { ready: false, frames: [], lights: null, rooms: {}, night: false, anim: 0 };
const canvas = $('#world');
const g = canvas.getContext('2d');

function bakeFrame(f) {
    const c = document.createElement('canvas'); c.width = 320; c.height = 240;
    const ctx = c.getContext('2d');
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) paintTile(ctx, MAP[y][x], x, y, f);
    BUILDINGS.forEach((b) => paintBuilding(ctx, b));
    SIGNS.forEach((s) => paintSign(ctx, s));
    return c;
}
function bakeLights() {
    const c = document.createElement('canvas'); c.width = 320; c.height = 240;
    const ctx = c.getContext('2d');
    BUILDINGS.forEach((b) => {
        const X = b.x * TS, Y = b.y * TS, W = b.w * TS;
        const wy = Y + 25;
        [X + 6, X + W - 18].forEach((wx) => {
            const grd = ctx.createRadialGradient(wx + 6, wy + 5, 1, wx + 6, wy + 8, 18);
            grd.addColorStop(0, 'rgba(255,214,120,.45)'); grd.addColorStop(1, 'rgba(255,214,120,0)');
            ctx.fillStyle = grd; ctx.fillRect(wx - 14, wy - 12, 40, 36);
            ctx.fillStyle = '#ffd879'; ctx.fillRect(wx, wy, 12, 9);
            ctx.fillStyle = '#2a2a3a'; ctx.fillRect(wx + 6, wy, 1, 9); ctx.fillRect(wx, wy + 4, 12, 1);
        });
    });
    for (let i = 0; i < 26; i++) {
        ctx.fillStyle = i % 3 ? 'rgba(255,255,220,.8)' : 'rgba(180,255,170,.9)';
        ctx.fillRect(Math.floor(hash(i, 7, 3) * 320), Math.floor(hash(i, 9, 5) * 240), 1, 1);
    }
    return c;
}
function bakeWorld() {
    world.frames = [bakeFrame(0), bakeFrame(1)];
    world.lights = bakeLights();
    for (const id of Object.keys(INTERIORS)) world.rooms[id] = bakeRoom(id);
    world.ready = true;
}

function drawPerson(p, fixedRows, pal, x, y, walking) {
    let rows, flip = false;
    if (fixedRows) { rows = fixedRows; }
    else if (p.dir === 'left' || p.dir === 'right') {
        rows = walking ? SPR.rightWalk : SPR.right;
        flip = p.dir === 'left';
    } else {
        const k = p.dir === 'up' ? 'up' : 'down';
        rows = walking ? SPR[k + 'Walk'] : SPR[k];
        flip = walking && p.step % 2 === 1;
    }
    x = Math.round(x); y = Math.round(y);
    g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(x + 3, y + 14, 10, 2);
    drawRows(g, rows, pal, x, y - 3 - (walking ? 1 : 0), flip);
}

function drawEmote(x, y) {
    g.fillStyle = '#2a2a3a'; g.fillRect(x, y, 9, 11);
    g.fillStyle = '#fff'; g.fillRect(x + 1, y + 1, 7, 9);
    g.fillStyle = '#e04b3c'; g.fillRect(x + 4, y + 2, 1, 4); g.fillRect(x + 4, y + 7, 1, 2);
}

let residentEmote = false;
function render() {
    if (!world.ready) return;
    const ppx = (player.x + (player.tx - player.x) * player.t) * TS;
    const ppy = (player.y + (player.ty - player.y) * player.t) * TS;
    const walking = player.moving && player.t > 0.15 && player.t < 0.85;
    const ents = [{ y: ppy, draw: () => drawPerson(player, null, PAL_PLAYER, ppx, ppy, walking) }];
    if (scene === 'town') {
        g.drawImage(world.frames[world.anim], 0, 0);
        ents.push({ y: townNpc.y * TS, draw: () => drawPerson(townNpc, null, PAL_TOWNNPC, townNpc.x * TS, townNpc.y * TS, false) });
    } else {
        g.drawImage(world.rooms[scene], 0, 0);
        const room = INTERIORS[scene], res = RESIDENTS[room.who];
        ents.push({ y: room.npc.y * TS, draw: () => drawPerson(null, res.rows, res.pal, room.npc.x * TS, room.npc.y * TS, false) });
    }
    ents.sort((a, b) => a.y - b.y).forEach((e) => e.draw());
    if (scene === 'town') {
        if (!player.moving && tileAt(player.x, player.y) === ',') {
            g.drawImage(world.frames[world.anim], player.x * TS, player.y * TS + 9, 16, 7, player.x * TS, player.y * TS + 9, 16, 7);
        }
        if (world.night) {
            g.fillStyle = 'rgba(12,16,56,.55)'; g.fillRect(0, 0, 320, 240);
            g.drawImage(world.lights, 0, 0);
        }
    } else if (residentEmote) {
        const n = INTERIORS[scene].npc;
        drawEmote(n.x * TS + 4, n.y * TS - 17);
    }
    if (player.emote) drawEmote(Math.round(ppx) + 4, Math.round(ppy) - 17);
}

/* ---------------------------------------------------------
   Game state & loop
   --------------------------------------------------------- */
let state = 'title'; // title | world | dialog | menu | panel | battle | transition
const screenEl = $('#screen');
const heldDirs = [];
const heldDir = () => heldDirs[heldDirs.length - 1];
function holdDir(d) { releaseDir(d); heldDirs.push(d); }
function releaseDir(d) { const i = heldDirs.indexOf(d); if (i > -1) heldDirs.splice(i, 1); }
function clearHeld() { heldDirs.length = 0; }

const MOVE_TIME = 0.17;
let last = performance.now(), animClock = 0;
function loop(now) {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    animClock += dt;
    if (animClock > 0.55) { animClock = 0; world.anim ^= 1; }
    update(dt);
    render();
    requestAnimationFrame(loop);
}
function update(dt) {
    if (player.moving) {
        player.t += dt / MOVE_TIME;
        if (player.t >= 1) {
            player.x = player.tx; player.y = player.ty;
            player.t = 0; player.moving = false; player.step++;
            onStep();
        }
    }
    if (!player.moving && state === 'world') {
        const d = heldDir();
        if (d) tryMove(d);
    }
}

let lastBump = 0;
function tryMove(d) {
    player.dir = d;
    const [dx, dy] = DIRS[d];
    const nx = player.x + dx, ny = player.y + dy;
    if (scene === 'town') {
        const door = BUILDINGS.find((b) => b.door.x === nx && b.door.y === ny);
        if (door && d === 'up') { enterBuilding(door); return; }
    } else if (d === 'down' && isMat(player.x, player.y)) {
        exitBuilding(); return;
    }
    if (isSolid(nx, ny)) {
        const now = performance.now();
        if (now - lastBump > 280) { blip(110, 0.05, 'square', 0.02); lastBump = now; }
        return;
    }
    player.tx = nx; player.ty = ny; player.t = 0; player.moving = true;
    hideHint();
}
function onStep() {
    stepsSinceBattle++;
    if (scene === 'town' && state === 'world' && tileAt(player.x, player.y) === ',' && stepsSinceBattle > 3 && Math.random() < 0.13) {
        startEncounter();
    }
}

function interact() {
    const [dx, dy] = DIRS[player.dir];
    const fx = player.x + dx, fy = player.y + dy;
    if (scene === 'town') {
        const door = BUILDINGS.find((b) => b.door.x === fx && b.door.y === fy);
        if (door) return enterBuilding(door);
        const s = signAt(fx, fy);
        if (s) return say([t(s.key)]);
        if (townNpc.x === fx && townNpc.y === fy) return talkTownNpc();
        if (tileAt(fx, fy) === '~') return say([t('water_text')]);
        const b = buildingAt(fx, fy);
        if (b) return say([t('sign_' + b.id)]);
        return;
    }
    const room = INTERIORS[scene];
    const n = room.npc;
    if ((n.x === fx && n.y === fy) || (propAt(room, fx, fy) && n.x === fx + dx && n.y === fy + dy)) return talkResident();
    const p = propAt(room, fx, fy);
    if (p && p.say) return say([t(p.say)]);
}
function talkTownNpc() {
    const dx = player.x - townNpc.x, dy = player.y - townNpc.y;
    townNpc.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
    say([t('npc_1'), t('npc_2')], () => { townNpc.dir = 'left'; });
}

function talkResident() {
    if (scene === 'town') return;
    const id = scene, room = INTERIORS[id];
    const name = t(room.name);
    const lines = room.lines.map((k) => ({ name, text: t(k) }));
    state = 'transition';
    residentEmote = true;
    blip(1320, 0.06);
    setTimeout(() => {
        residentEmote = false;
        state = 'world';
        const done = () => openPanel(BUILDING[id].panel, 'world');
        if (room.heal) {
            // heal the team right after the first greeting line
            say(lines.slice(0, 1), () => {
                healParty();
                jingle([523, 659, 784, 659, 1047], 140, 0.12);
                say(lines.slice(1), done);
            });
        } else {
            say(lines, done);
        }
    }, 420);
}

let roomHintShown = false;
function enterBuilding(b) {
    if (state !== 'world') return;
    state = 'transition';
    clearHeld();
    blip(523, 0.06); setTimeout(() => blip(784, 0.08), 70);
    screenEl.classList.add('fade');
    setTimeout(() => {
        scene = b.id;
        Object.assign(player, { x: MAT[0][0], y: MAT[0][1], tx: MAT[0][0], ty: MAT[0][1], t: 0, moving: false, dir: 'up' });
        screenEl.classList.remove('fade');
        state = 'world';
        if (!roomHintShown) { roomHintShown = true; showHint('hint_room', 8000); }
        setTimeout(() => { if (state === 'world' && scene === b.id) talkResident(); }, 320);
    }, 300);
}
function exitBuilding() {
    if (state !== 'world' || scene === 'town') return;
    const from = BUILDING[scene];
    state = 'transition';
    clearHeld();
    blip(784, 0.06); setTimeout(() => blip(523, 0.08), 70);
    screenEl.classList.add('fade');
    setTimeout(() => {
        scene = 'town';
        const x = from.door.x, y = from.door.y + 1;
        Object.assign(player, { x, y, tx: x, ty: y, t: 0, moving: false, dir: 'down' });
        stepsSinceBattle = 0;
        screenEl.classList.remove('fade');
        state = 'world';
    }, 300);
}

/* --- hint --- */
const hintEl = $('#hint');
let hintTimer = null, introHintShown = false;
function showHint(key, ms = 9000) {
    hintEl.dataset.i18n = key;
    hintEl.innerHTML = t(key);
    hintEl.classList.remove('hidden');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(hideHint, ms);
}
function hideHint() { hintEl.classList.add('hidden'); }

/* ---------------------------------------------------------
   Dialog (lines are strings or {name, text})
   --------------------------------------------------------- */
const dlg = { el: $('#dialog'), text: $('#dialog-text'), nameEl: $('#dialog-name'), queue: [], full: '', i: 0, timer: null, typing: false, cb: null, ret: 'world' };
function say(lines, cb) {
    if (state !== 'dialog') dlg.ret = (state === 'transition' || state === 'title') ? 'world' : state;
    state = 'dialog';
    clearHeld();
    dlg.queue = lines.slice();
    dlg.cb = cb || null;
    dlg.el.classList.remove('hidden');
    nextLine();
}
function nextLine() {
    clearInterval(dlg.timer);
    if (!dlg.queue.length) {
        dlg.el.classList.add('hidden');
        state = dlg.ret;
        const cb = dlg.cb; dlg.cb = null;
        if (cb) cb();
        return;
    }
    const line = dlg.queue.shift();
    dlg.full = typeof line === 'string' ? line : line.text;
    const nm = typeof line === 'string' ? '' : (line.name || '');
    dlg.nameEl.textContent = nm;
    dlg.nameEl.hidden = !nm;
    dlg.i = 0; dlg.typing = true;
    dlg.el.classList.remove('done');
    dlg.text.textContent = '';
    dlg.timer = setInterval(() => {
        dlg.i++;
        dlg.text.textContent = dlg.full.slice(0, dlg.i);
        if (dlg.i % 3 === 0) blip(1200, 0.015, 'square', 0.012);
        if (dlg.i >= dlg.full.length) { clearInterval(dlg.timer); dlg.typing = false; dlg.el.classList.add('done'); }
    }, 24);
}
function dialogAdvance() {
    if (dlg.typing) {
        clearInterval(dlg.timer);
        dlg.text.textContent = dlg.full;
        dlg.typing = false;
        dlg.el.classList.add('done');
    } else {
        blip(880, 0.03);
        nextLine();
    }
}
dlg.el.addEventListener('click', () => { if (state === 'dialog') dialogAdvance(); });

/* ---------------------------------------------------------
   Start menu
   --------------------------------------------------------- */
const menuEl = $('#start-menu');
function openMenu() {
    state = 'menu';
    clearHeld();
    menuEl.classList.remove('hidden');
    showMenuPage('main');
    blip(784, 0.05);
}
function showMenuPage(p) {
    $('.menu-main', menuEl).hidden = p !== 'main';
    $('.menu-options', menuEl).hidden = p !== 'options';
    menuEl.dataset.page = p;
    const first = $(p === 'main' ? '.menu-main button' : '.menu-options button', menuEl);
    if (first) first.focus({ preventScroll: true });
}
function closeMenu(silent) {
    menuEl.classList.add('hidden');
    if (menuEl.contains(document.activeElement)) document.activeElement.blur();
    if (!silent) { state = 'world'; blip(523, 0.04); }
}
function menuBack() {
    if (menuEl.dataset.page === 'options') showMenuPage('main');
    else closeMenu();
}
menuEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.open) { openPanel(btn.dataset.open, 'world'); return; }
    if (btn.dataset.lang) { setLanguage(btn.dataset.lang); blip(880, 0.04); return; }
    switch (btn.dataset.action) {
        case 'options': blip(880, 0.04); showMenuPage('options'); break;
        case 'back': blip(660, 0.04); showMenuPage('main'); break;
        case 'exit': closeMenu(); break;
        case 'dex': closeMenu(true); state = 'world'; showDex(); break;
        case 'theme': toggleTheme(); break;
        case 'sound':
            soundOn = !soundOn;
            store.set('sound', soundOn ? 'on' : 'off');
            updateSoundLabel();
            blip(880, 0.05);
            break;
    }
});
function updateSoundLabel() { const el = $('#sound-state'); if (el) el.textContent = soundOn ? t('ui_on') : t('ui_off'); }

/* ---------------------------------------------------------
   Content panels
   --------------------------------------------------------- */
const layer = $('#panel-layer');
const PANELS = ['home', 'about', 'services', 'portfolio', 'contact'];
let panelReturn = 'world';
function openPanel(id, returnTo) {
    const sec = document.getElementById(id);
    if (!sec || !sec.classList.contains('panel')) return;
    if (state !== 'panel') {
        panelReturn = returnTo || state;
        if (['menu', 'transition', 'dialog'].includes(panelReturn)) panelReturn = 'world';
    }
    if (state === 'menu') closeMenu(true);
    $$('.panel').forEach((p) => { p.hidden = p !== sec; });
    $$('.navbar a').forEach((a) => a.classList.toggle('active', a.dataset.panel === id));
    layer.classList.remove('hidden');
    $('#panel-wrap').scrollTop = 0;
    state = 'panel';
    clearHeld();
    $('.panel-close').focus({ preventScroll: true });
    try { history.replaceState(null, '', '#' + id); } catch (e) { /* ignore */ }
    blip(660, 0.05); setTimeout(() => blip(990, 0.06), 60);
}
function closePanel() {
    layer.classList.add('hidden');
    $$('.navbar a').forEach((a) => a.classList.remove('active'));
    if (layer.contains(document.activeElement)) document.activeElement.blur();
    state = panelReturn;
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignore */ }
    blip(440, 0.05);
}
$$('[data-close]', layer).forEach((el) => el.addEventListener('click', closePanel));
$$('.navbar a').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    if (state === 'battle' || state === 'dialog') return; // finish the current scene first
    openPanel(a.dataset.panel);
}));
$('#logo-link').addEventListener('click', (e) => { e.preventDefault(); if (state === 'panel') closePanel(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
$('#to-top').addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

/* ---------------------------------------------------------
   Creatures, partners and the Dex
   --------------------------------------------------------- */
const TYPE_KEY = { data: 'type_data', logic: 'type_logic', art: 'type_art' };
const SKILL_MOVES = [
    { key: 'skill_1_title', type: 'data', power: 40 },
    { key: 'skill_2_title', type: 'logic', power: 40 },
    { key: 'skill_3_title', type: 'art', power: 40 }
];
const PARTNERS = [
    { name: 'DATAVIZ',  art: 'DATAVIZ',  type: 'art',   sig: 'CHART BURST', lv: 12 },
    { name: 'PIPELYNX', art: 'PIPELYNX', type: 'data',  sig: 'ETL POUNCE',  lv: 11 },
    { name: 'QUERYOWL', art: 'QUERYOWL', type: 'logic', sig: 'DEEP JOIN',   lv: 11 }
];
const WILD = [
    { name: 'NULL VALUE',     art: 'NULL_VALUE',     type: 'logic', weak: 'data',  moves: ['VOID', 'BLANK STARE'], desc: 0 },
    { name: 'DIRTY DATA',     art: 'DIRTY_DATA',     type: 'art',   weak: 'data',  moves: ['TYPO STORM', 'DUPLICATE'], desc: 1 },
    { name: 'SLOW QUERY',     art: 'SLOW_QUERY',     type: 'data',  weak: 'logic', moves: ['FULL SCAN', 'TIMEOUT'], desc: 2 },
    { name: 'MERGE CONFLICT', art: 'MERGE_CONFLICT', type: 'data',  weak: 'logic', moves: ['<<<<<<< HEAD', 'REBASE'], desc: 3 },
    { name: 'MEMORY LEAK',    art: 'MEMORY_LEAK',    type: 'logic', weak: 'art',   moves: ['OVERFLOW', 'SLOW DRIP'], desc: 4 }
];
const LEGENDS = [
    { name: 'PETADRAKE',  art: 'PETADRAKE',  type: 'data',  weak: 'logic', moves: ['PETABYTE BREATH', 'COLD STORAGE'], desc: 5, legendary: true },
    { name: 'SINGULARIX', art: 'SINGULARIX', type: 'logic', weak: 'art',   moves: ['EVENT HORIZON', 'INFINITE LOOP'], desc: 6, legendary: true },
    { name: 'PRISMORA',   art: 'PRISMORA',   type: 'art',   weak: 'data',  moves: ['SPECTRUM SCALE', 'GRADIENT DUST'], desc: 7, legendary: true }
];
const ALL_CREATURES = [...WILD, ...LEGENDS];
const LEGEND_CHANCE = 0.07;
const maxHpFor = (lv) => 30 + lv * 3;

const party = PARTNERS.map((p) => Object.assign({}, p, { exp: 0 }));
(() => {
    try {
        const saved = JSON.parse(store.get('evz_party') || 'null');
        if (Array.isArray(saved)) saved.forEach((s, i) => { if (party[i] && s) { party[i].lv = Math.min(100, Math.max(party[i].lv, s.lv | 0)); party[i].exp = Math.max(0, s.exp | 0); } });
    } catch (e) { /* ignore */ }
    party.forEach((p) => { p.maxHp = maxHpFor(p.lv); p.hp = p.maxHp; });
})();
function saveParty() { store.set('evz_party', JSON.stringify(party.map((p) => ({ lv: p.lv, exp: p.exp })))); }
function healParty() { party.forEach((p) => { p.maxHp = maxHpFor(p.lv); p.hp = p.maxHp; }); }

let dex = [];
try { dex = JSON.parse(store.get('evz_dex') || '[]'); if (!Array.isArray(dex)) dex = []; } catch (e) { dex = []; }
function markSeen(name) { if (!dex.includes(name)) { dex.push(name); store.set('evz_dex', JSON.stringify(dex)); } }
function showDex() {
    const legends = LEGENDS.filter((l) => dex.includes(l.name)).map((l) => l.name);
    const seen = ALL_CREATURES.filter((c) => dex.includes(c.name)).length;
    const lines = [t('dex_text', { n: seen, t: ALL_CREATURES.length, l: legends.length })];
    if (legends.length) lines.push(t('dex_legend', { list: legends.join(', ') }));
    say(lines);
}

/* ---------------------------------------------------------
   Battle
   --------------------------------------------------------- */
const battle = { active: false, enemy: null, cur: 0, menu: 'main', resolve: null, skip: null, busy: false, timer: null, auto: null };
const bEl = $('#battle'), bMsg = $('#b-msg'), bMenu = $('#b-menu'), bBottom = $('.b-bottom');
const bEnemy = $('#b-enemy-img'), bPartner = $('#b-player-img'), bTrainer = $('#b-trainer'), bBall = $('#b-ball');
const bHudP = $('.b-hud-player'), bHudE = $('.b-hud-enemy');

function msg(text, opts) {
    const holdForInput = !(opts && opts.wait === false);
    return new Promise((res) => {
        setMenuMode(null);
        clearInterval(battle.timer);
        clearTimeout(battle.auto);
        battle.resolve = null;
        bEl.classList.remove('msg-done');
        let i = 0;
        bMsg.textContent = '';
        const finish = () => {
            clearInterval(battle.timer);
            battle.skip = null;
            bMsg.textContent = text;
            if (!holdForInput) { res(); return; }
            bEl.classList.add('msg-done');
            battle.resolve = () => {
                battle.resolve = null;
                clearTimeout(battle.auto);
                bEl.classList.remove('msg-done');
                res();
            };
            battle.auto = setTimeout(() => { if (battle.resolve) battle.resolve(); }, 2400);
        };
        battle.skip = finish;
        battle.timer = setInterval(() => {
            i++;
            bMsg.textContent = text.slice(0, i);
            if (i % 3 === 0) blip(1100, 0.015, 'square', 0.012);
            if (i >= text.length) finish();
        }, 22);
    });
}
function battleAdvance() {
    if (battle.skip) { battle.skip(); return; }
    if (battle.resolve) { blip(880, 0.03); battle.resolve(); }
}
$('#b-msgbox').addEventListener('click', () => { if (state === 'battle') battleAdvance(); });

function setBar(bar, hp, max) {
    const pct = Math.max(0, Math.round(hp / max * 100));
    bar.style.width = pct + '%';
    bar.classList.toggle('mid', pct <= 50 && pct > 20);
    bar.classList.toggle('low', pct <= 20);
}
function updateHud() {
    const p = party[battle.cur], e = battle.enemy;
    $('#b-player-name').textContent = p.name;
    $('#b-player-lv').textContent = p.lv;
    $('#b-player-hpnum').textContent = Math.max(0, p.hp) + '/' + p.maxHp;
    setBar($('#b-player-hp'), p.hp, p.maxHp);
    if (e) setBar($('#b-enemy-hp'), e.hp, e.maxHp);
}
function anim(el, cls, ms = 600) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    if (ms) setTimeout(() => el.classList.remove(cls), ms);
}

function startEncounter(force) {
    state = 'battle';
    clearHeld();
    hideHint();
    battle.active = true;
    player.emote = true;
    const legendary = force ? !!force.legendary : Math.random() < LEGEND_CHANCE;
    const pool = legendary ? LEGENDS : WILD;
    const base = (force && force.name) ? ALL_CREATURES.find((c) => c.name === force.name) : pool[Math.floor(Math.random() * pool.length)];
    blip(1320, 0.08); setTimeout(() => blip(1568, 0.1), 90);
    setTimeout(() => {
        player.emote = false;
        screenEl.classList.add(base.legendary ? 'encounter-legend' : 'encounter');
        if (base.legendary) jingle([196, 233, 196, 262, 196, 311], 130, 0.12);
        else jingle([880, 660, 880, 660, 440], 120, 0.07);
        setTimeout(() => {
            screenEl.classList.remove('encounter', 'encounter-legend');
            beginBattle(base);
        }, base.legendary ? 1100 : 720);
    }, 500);
}

function beginBattle(base) {
    const lv = base.legendary ? 45 + Math.floor(Math.random() * 11) : 3 + Math.floor(Math.random() * 12);
    const maxHp = base.legendary ? 120 + (lv - 45) * 2 : 16 + lv * 3;
    battle.enemy = Object.assign({}, base, { lv, maxHp, hp: maxHp });
    battle.cur = Math.max(0, party.findIndex((p) => p.hp > 0));
    markSeen(base.name);

    bEnemy.className = 'b-sprite b-enemy' + (base.legendary ? ' legendary' : '');
    bEnemy.src = ART.creature(base.art);
    bEnemy.alt = base.name;
    $('#b-enemy-name').textContent = base.name;
    $('#b-enemy-lv').textContent = lv;
    bHudE.classList.toggle('legend', !!base.legendary);
    bHudE.classList.add('hud-hidden');
    bHudP.classList.add('hud-hidden');
    bPartner.className = 'b-sprite b-player gone';
    bTrainer.className = 'b-sprite b-trainer';
    bBall.className = 'b-ball';
    bMsg.textContent = '';
    setMenuMode(null);
    updateHud();
    bEl.classList.remove('hidden');
    bEl.classList.toggle('legendary', !!base.legendary);
    anim(bEl, 'enter', 800);

    (async () => {
        await wait(700);
        bHudE.classList.remove('hud-hidden');
        if (base.legendary) jingle([392, 466, 523, 622], 150, 0.15);
        await msg(base.legendary ? t('b_legend', { x: base.name }) : t('b_appear', { x: base.name }));
        await sendOut(battle.cur, 'b_go', true);
        mainMenu();
    })();
}

async function sendOut(i, key, trainerOnField) {
    battle.cur = i;
    const p = party[i];
    updateHud();
    bPartner.src = ART.flipped(p.art);
    bPartner.alt = p.name;
    await msg(t(key, { m: p.name }), { wait: false });
    if (trainerOnField) anim(bTrainer, 'leave', 0);
    anim(bBall, 'throw', 0);
    blip(660, 0.05); setTimeout(() => blip(990, 0.05), 120);
    await wait(650);
    bBall.className = 'b-ball';
    bPartner.className = 'b-sprite b-player';
    anim(bPartner, 'popin', 500);
    jingle([784, 1047], 90, 0.08);
    await wait(450);
    bHudP.classList.remove('hud-hidden');
    await wait(500);
}

async function mainMenu() {
    await msg(t('b_what', { p: party[battle.cur].name }), { wait: false });
    renderBattleMenu('main');
}

function setMenuMode(mode) {
    bMenu.dataset.mode = mode || '';
    bMenu.classList.toggle('hidden', !mode);
    bBottom.dataset.mode = mode || '';
}

function renderBattleMenu(m) {
    battle.menu = m;
    bMenu.innerHTML = '';
    setMenuMode(m);
    const add = (html, fn, cls, parent = bMenu) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'b-btn ' + (cls || '');
        b.innerHTML = html;
        b.addEventListener('click', () => { if (battle.busy || state !== 'battle') return; blip(880, 0.04); fn(); });
        parent.appendChild(b);
        return b;
    };
    if (m === 'main') {
        add(t('b_fight'), () => renderBattleMenu('moves'));
        add(t('b_team'), () => renderBattleMenu('team'));
        add(t('b_info'), doInfo);
        add(t('b_run'), doRun);
    } else if (m === 'moves') {
        const p = party[battle.cur];
        const info = document.createElement('div');
        info.className = 'b-moveinfo';
        info.innerHTML = '<span class="mi-type type"></span><span class="mi-pow"></span>';
        const tEl = info.querySelector('.mi-type'), pEl = info.querySelector('.mi-pow');
        movesFor(p).forEach((mv, i) => {
            const b = add('<span>' + mv.label + '</span>', () => useMove(i), 't-' + mv.type);
            const show = () => { tEl.textContent = t(TYPE_KEY[mv.type]); tEl.className = 'mi-type type t-' + mv.type; pEl.textContent = t('b_power') + ' ' + mv.power; };
            b.addEventListener('focus', show); b.addEventListener('mouseenter', show);
        });
        bMenu.appendChild(info);
        add(t('b_back'), () => renderBattleMenu('main'), 'back', info);
    } else if (m === 'team') {
        party.forEach((p, i) => {
            const pct = Math.max(0, Math.round(p.hp / p.maxHp * 100));
            add('<img alt="" src="' + ART.creature(p.art) + '"><span class="tm-name">' + p.name + ' <em>Lv' + p.lv + '</em></span>' +
                '<i class="mini-hp"><i class="' + (pct <= 20 ? 'low' : pct <= 50 ? 'mid' : '') + '" style="width:' + pct + '%"></i></i><small>' + Math.max(0, p.hp) + '/' + p.maxHp + '</small>',
                () => doSwitch(i), 'team' + (i === battle.cur ? ' current' : '') + (p.hp <= 0 ? ' fainted' : ''));
        });
        add(t('b_back'), () => renderBattleMenu('main'), 'back');
    }
    const first = bMenu.querySelector('button');
    if (first) first.focus({ preventScroll: true });
}

function movesFor(p) {
    return SKILL_MOVES.map((m) => ({ label: plain(t(m.key)), type: m.type, power: m.power }))
        .concat([{ label: p.sig, type: p.type, power: 55 }]);
}

async function doInfo() {
    battle.busy = true;
    const e = battle.enemy;
    await msg(e.name + ' · ' + t(TYPE_KEY[e.type]) + ' · ' + t('en_desc_' + e.desc));
    battle.busy = false;
    mainMenu();
}
async function doRun() {
    battle.busy = true;
    jingle([330, 260, 200], 80, 0.06);
    await msg(t('b_run_ok'));
    battle.busy = false;
    endBattle();
}
async function doSwitch(i) {
    const p = party[i];
    battle.busy = true;
    if (i === battle.cur) { await msg(t('b_already', { m: p.name })); battle.busy = false; renderBattleMenu('team'); return; }
    if (p.hp <= 0) { await msg(t('b_cant', { m: p.name })); battle.busy = false; renderBattleMenu('team'); return; }
    await msg(t('b_come_back', { m: party[battle.cur].name }), { wait: false });
    bHudP.classList.add('hud-hidden');
    anim(bPartner, 'recall', 0);
    await wait(500);
    bPartner.className = 'b-sprite b-player gone';
    await sendOut(i, 'b_go_next', false);
    const r = await enemyTurn();
    battle.busy = false;
    if (r === 'continue') mainMenu();
}

async function useMove(i) {
    battle.busy = true;
    const p = party[battle.cur], en = battle.enemy;
    const mv = movesFor(p)[i];
    await msg(t('b_used', { p: p.name, m: mv.label }));
    anim(bPartner, 'lunge', 400);
    await wait(180);
    anim(bEnemy, 'hit');
    blip(220, 0.14, 'sawtooth', 0.04);
    const crit = Math.random() < 0.08;
    const eff = mv.type === en.weak ? 1.6 : mv.type === en.type ? 0.6 : 1;
    const stab = mv.type === p.type ? 1.25 : 1;
    const dmg = Math.max(1, Math.round((mv.power / 40) * (6 + p.lv * 0.9) * stab * eff * (crit ? 1.5 : 1) * rand(0.85, 1)));
    en.hp = Math.max(0, en.hp - dmg);
    updateHud();
    await wait(650);
    if (crit) await msg(t('b_crit'));
    if (eff > 1) await msg(t('b_super'));
    if (eff < 1) await msg(t('b_not_eff'));
    if (en.hp <= 0) {
        anim(bEnemy, 'faint', 0);
        jingle([400, 300, 180], 100, 0.12);
        await wait(600);
        await msg(t('b_win', { x: en.name }));
        jingle([523, 659, 784, 1047], 110, 0.09);
        await gainExp(p, en.lv * 7 * (en.legendary ? 3 : 1));
        battle.busy = false;
        endBattle();
        return;
    }
    const r = await enemyTurn();
    battle.busy = false;
    if (r === 'continue') mainMenu();
}

async function gainExp(p, n) {
    p.exp += n;
    await msg(t('b_exp', { m: p.name, n }));
    while (p.exp >= p.lv * 12 && p.lv < 100) {
        p.exp -= p.lv * 12;
        p.lv++;
        const old = p.maxHp;
        p.maxHp = maxHpFor(p.lv);
        p.hp += p.maxHp - old;
        updateHud();
        jingle([523, 784, 1047, 1319], 100, 0.1);
        await msg(t('b_lvup', { m: p.name, n: p.lv }));
    }
    saveParty();
}

async function enemyTurn() {
    const en = battle.enemy, p = party[battle.cur];
    await msg(t('b_enemy_used', { x: en.name, m: pick(en.moves) }));
    anim(bEnemy, 'lunge-e', 400);
    await wait(180);
    anim(bPartner, 'hit');
    blip(160, 0.14, 'sawtooth', 0.04);
    const dmg = Math.max(1, Math.round((3 + en.lv * 0.45) * rand(0.85, 1)));
    p.hp = Math.max(0, p.hp - dmg);
    updateHud();
    await wait(650);
    if (p.hp > 0) return 'continue';
    anim(bPartner, 'faint', 0);
    jingle([400, 300, 180], 100, 0.12);
    await wait(500);
    bHudP.classList.add('hud-hidden');
    await msg(t('b_fainted', { m: p.name }));
    const next = party.findIndex((q) => q.hp > 0);
    if (next >= 0) {
        bPartner.className = 'b-sprite b-player gone';
        await sendOut(next, 'b_go_next', false);
        return 'continue';
    }
    await msg(t('b_blackout'));
    healParty();
    endBattle(true);
    return 'blackout';
}

function endBattle(blackout) {
    state = 'transition';
    screenEl.classList.add('fade');
    setTimeout(() => {
        bEl.classList.add('hidden');
        setMenuMode(null);
        clearTimeout(battle.auto);
        battle.active = false;
        battle.resolve = null; battle.skip = null;
        if (bEl.contains(document.activeElement)) document.activeElement.blur();
        stepsSinceBattle = 0;
        if (blackout) {
            scene = 'town';
            const d = BUILDING.home.door;
            Object.assign(player, { x: d.x, y: d.y + 1, tx: d.x, ty: d.y + 1, t: 0, moving: false, dir: 'down' });
        }
        screenEl.classList.remove('fade');
        state = 'world';
    }, 320);
}

/* ---------------------------------------------------------
   Title screen
   --------------------------------------------------------- */
const titleEl = $('#title-screen');
function startGame() {
    if (state !== 'title') return;
    state = 'transition';
    blip(659, 0.08); setTimeout(() => blip(988, 0.14), 90);
    titleEl.classList.add('leaving');
    setTimeout(() => {
        titleEl.classList.add('hidden');
        state = 'world';
        say([
            plain(t('home_hello')) + ' ' + plain(t('home_name')) + '!',
            cap(plain(t('home_desc'))),
            t('intro_3'),
            t('intro_4')
        ], () => { if (!introHintShown) { introHintShown = true; showHint('hint_move'); } });
    }, 500);
}
titleEl.addEventListener('click', () => { if (state === 'title') startGame(); });

/* ---------------------------------------------------------
   Input
   --------------------------------------------------------- */
const KEYMAP = {
    ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
    KeyZ: 'a', Space: 'a', KeyX: 'b', Escape: 'b', Backspace: 'b',
    Enter: 'start', NumpadEnter: 'start', ShiftLeft: 'select', ShiftRight: 'select'
};
const isDir = (a) => a === 'up' || a === 'down' || a === 'left' || a === 'right';

function visible(el) { return el.offsetParent !== null; }
function moveFocus(container, dir) {
    const items = $$('button', container).filter(visible);
    if (!items.length) return;
    const cur = items.includes(document.activeElement) ? document.activeElement : null;
    if (!cur) { items[0].focus({ preventScroll: true }); return; }
    const r = cur.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let best = null, bd = Infinity;
    for (const it of items) {
        if (it === cur) continue;
        const q = it.getBoundingClientRect();
        const dx = q.left + q.width / 2 - cx, dy = q.top + q.height / 2 - cy;
        const ok = dir === 'up' ? dy < -4 : dir === 'down' ? dy > 4 : dir === 'left' ? dx < -4 : dx > 4;
        if (!ok) continue;
        const vert = dir === 'up' || dir === 'down';
        const d = (vert ? Math.abs(dy) : Math.abs(dx)) + (vert ? Math.abs(dx) : Math.abs(dy)) * 2;
        if (d < bd) { bd = d; best = it; }
    }
    if (best) { best.focus({ preventScroll: true }); blip(990, 0.025); }
}

function press(act) {
    switch (state) {
        case 'title':
            if (act === 'a' || act === 'start') startGame();
            break;
        case 'world':
            if (act === 'a') interact();
            else if (act === 'start') openMenu();
            else if (act === 'select') toggleTheme();
            break;
        case 'dialog':
            if (act === 'a' || act === 'b' || act === 'start') dialogAdvance();
            break;
        case 'menu':
            if (isDir(act)) moveFocus(menuEl, act);
            else if (act === 'a') { const f = document.activeElement; if (f && menuEl.contains(f)) f.click(); }
            else if (act === 'b') menuBack();
            else if (act === 'start') closeMenu();
            break;
        case 'battle':
            if (battle.skip || battle.resolve) {
                if (act === 'a' || act === 'b' || act === 'start') battleAdvance();
            } else if (!bMenu.classList.contains('hidden')) {
                if (isDir(act)) moveFocus(bMenu, act);
                else if (act === 'a') {
                    const f = document.activeElement;
                    if (f && bMenu.contains(f)) f.click();
                    else { const b0 = bMenu.querySelector('button'); if (b0) b0.focus({ preventScroll: true }); }
                }
                else if (act === 'b' && battle.menu !== 'main' && !battle.busy) renderBattleMenu('main');
            }
            break;
        case 'panel':
            if (act === 'b') closePanel();
            break;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('select, input, textarea')) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const act = KEYMAP[e.code];
    if (!act) return;
    if (state === 'panel') {
        if (act === 'b') { e.preventDefault(); closePanel(); }
        return;
    }
    const ae = document.activeElement;
    const nativeActivate = (e.code === 'Enter' || e.code === 'Space' || e.code === 'NumpadEnter') && ae && (ae.tagName === 'BUTTON' || ae.tagName === 'A');
    if (nativeActivate && (!screenEl.contains(ae) || state === 'menu' || (state === 'battle' && !battle.skip && !battle.resolve))) return;
    const rect = screenEl.getBoundingClientRect();
    if (isDir(act) && (rect.bottom < 0 || rect.top > window.innerHeight)) return;
    e.preventDefault();
    if (isDir(act)) holdDir(act);
    if (!e.repeat) press(act);
});
document.addEventListener('keyup', (e) => { const act = KEYMAP[e.code]; if (act && isDir(act)) releaseDir(act); });
window.addEventListener('blur', clearHeld);

$$('.dpad button').forEach((btn) => {
    const d = btn.dataset.dir;
    btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        try { btn.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        btn.classList.add('pressed');
        holdDir(d);
        press(d);
    });
    const up = () => { btn.classList.remove('pressed'); releaseDir(d); };
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => btn.addEventListener(ev, up));
});
$$('[data-btn]').forEach((btn) => {
    btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        btn.classList.add('pressed');
        press(btn.dataset.btn);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, () => btn.classList.remove('pressed')));
});
$('.controls').addEventListener('contextmenu', (e) => e.preventDefault());
titleEl.addEventListener('keydown', (e) => { if ((e.code === 'Enter' || e.code === 'Space') && state === 'title') { e.preventDefault(); e.stopPropagation(); startGame(); } });

// click / tap on the map
function tileFromEvent(e) {
    const r = canvas.getBoundingClientRect();
    return [Math.floor((e.clientX - r.left) / r.width * COLS), Math.floor((e.clientY - r.top) / r.height * ROWS)];
}
function clickTarget(tx, ty) {
    if (scene === 'town') return buildingAt(tx, ty) || signAt(tx, ty) || (townNpc.x === tx && townNpc.y === ty ? townNpc : null);
    const room = INTERIORS[scene];
    if (room.npc.x === tx && room.npc.y === ty) return room.npc;
    if (isMat(tx, ty)) return 'mat';
    const p = propAt(room, tx, ty);
    return p && p.say ? p : null;
}
canvas.addEventListener('click', (e) => {
    if (state !== 'world') return;
    const [tx, ty] = tileFromEvent(e);
    const hit = clickTarget(tx, ty);
    if (!hit) return;
    if (scene === 'town') {
        if (hit === townNpc) return talkTownNpc();
        if (hit.door) return enterBuilding(hit);
        return say([t(hit.key)]);
    }
    if (hit === 'mat') return exitBuilding();
    if (hit === INTERIORS[scene].npc) return talkResident();
    return say([t(hit.say)]);
});
canvas.addEventListener('mousemove', (e) => {
    if (state !== 'world') { canvas.style.cursor = ''; return; }
    const [tx, ty] = tileFromEvent(e);
    canvas.style.cursor = clickTarget(tx, ty) ? 'pointer' : '';
});

/* ---------------------------------------------------------
   Theme & language
   --------------------------------------------------------- */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    store.set('theme', theme);
    const icon = $('#theme-toggle i');
    if (icon) icon.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
    world.night = theme === 'dark';
}
function toggleTheme() {
    setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    blip(523, 0.05); setTimeout(() => blip(659, 0.06), 60);
}
$('#theme-toggle').addEventListener('click', toggleTheme);

const languageSelector = $('#language-selector');
function setLanguage(l) {
    if (!translations[l]) l = 'en';
    lang = l;
    $$('[data-i18n]').forEach((el) => {
        const v = translations[l][el.dataset.i18n] ?? translations.en[el.dataset.i18n];
        if (v != null) el.innerHTML = v; // innerHTML allows the <span> accents in headings
    });
    document.documentElement.lang = l === 'jp' ? 'ja' : l;
    store.set('language', l);
    languageSelector.value = l;
    $$('[data-lang]').forEach((b) => b.classList.toggle('is-on', b.dataset.lang === l));
    updateSoundLabel();
    if (battle.active && !bMenu.classList.contains('hidden') && !battle.busy) renderBattleMenu(battle.menu);
}
languageSelector.addEventListener('change', (e) => setLanguage(e.target.value));

/* ---------------------------------------------------------
   Boot
   --------------------------------------------------------- */
const savedTheme = store.get('theme');
setTheme(savedTheme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
setLanguage(store.get('language') || 'en');

const heroURL = spriteURL(SPR.down, PAL_PLAYER, 8);
$$('img[data-sprite="hero"]').forEach((img) => { img.src = heroURL; });
bTrainer.src = spriteURL(SPR.up, PAL_PLAYER, 8);
$('#title-buddy').src = ART.creature('DATAVIZ');

g.imageSmoothingEnabled = false;
bakeWorld();
requestAnimationFrame(loop);

// deep links (#about, #portfolio ...) open their panel straight away
const hashId = location.hash.slice(1);
if (PANELS.includes(hashId)) openPanel(hashId, 'title');

// small hook for automated checks
window.__evz = { get state() { return state; }, get scene() { return scene; }, player, party, battle, encounter: startEncounter };
})();
