/* =========================================================
   evilzeda — pixel art engine + original creature designs
   Shapes are rasterised on a small grid, then shaded, given
   inner edges and a coloured outline, Pokémon-style.
   ========================================================= */
(function () {
'use strict';

function rgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function hex(r, g, b) { return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1); }
function shade(h, amt) {
    const [r, g, b] = rgb(h);
    const f = (v) => Math.max(0, Math.min(255, Math.round(v + (amt > 0 ? (255 - v) * amt : v * amt))));
    return hex(f(r), f(g), f(b));
}
function mix(a, b, t) {
    const A = rgb(a), B = rgb(b);
    return hex(...A.map((v, i) => Math.round(v + (B[i] - v) * t)));
}

/* ---------------- raster canvas ---------------- */
class Pix {
    constructor(W, H) {
        this.W = W; this.H = H;
        this.col = new Array(W * H).fill(null);
        this.base = new Array(W * H).fill(null);
        this.id = new Int32Array(W * H).fill(-1);
        this.shapes = [];
    }
    shape(o) { this.shapes.push(Object.assign({ edge: true, rim: false, outline: true }, o || {})); return this.shapes.length - 1; }
    put(x, y, c, b, id) {
        x |= 0; y |= 0;
        if (x < 0 || y < 0 || x >= this.W || y >= this.H) return;
        const i = y * this.W + x;
        this.col[i] = c; this.base[i] = b; this.id[i] = id;
    }
    get(x, y) { return (x < 0 || y < 0 || x >= this.W || y >= this.H) ? -1 : this.id[y * this.W + x]; }

    /* ellipse with optional rotation, bands and spherical shading */
    ell(cx, cy, rx, ry, c, o = {}) {
        const id = this.shape({ edge: o.edge !== false, outline: o.outline !== false });
        const rot = (o.rot || 0) * Math.PI / 180, cs = Math.cos(rot), sn = Math.sin(rot);
        const R = Math.max(rx, ry) + 1;
        for (let y = Math.floor(cy - R); y <= Math.ceil(cy + R); y++) {
            for (let x = Math.floor(cx - R); x <= Math.ceil(cx + R); x++) {
                const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
                const ux = dx * cs + dy * sn, uy = -dx * sn + dy * cs;
                const d2 = (ux / rx) ** 2 + (uy / ry) ** 2;
                if (d2 > 1) continue;
                const e = Math.sqrt(d2);
                let b = c;
                if (o.bands) b = o.bands[Math.min(o.bands.length - 1, Math.floor(e * o.bands.length))];
                if (o.grad) b = mix(o.grad[0], o.grad[1], Math.max(0, Math.min(1, (dy / (ry || 1) + 1) / 2)));
                let out = b;
                if (o.shade !== false) {
                    const L = Math.hypot(dx, dy) || 1;
                    const dir = (dx / L) * 0.55 + (dy / L) * 0.83;
                    if (e > 0.58 && dir > 0.15) out = shade(b, e > 0.86 && dir > 0.55 ? -0.36 : -0.22);
                    else if (o.hl !== false && e > 0.3 && e < 0.72 && dir < -0.78) out = shade(b, 0.38);
                }
                this.put(x, y, out, b, id);
            }
        }
        return id;
    }
    /* polygon fill, rim shading */
    poly(pts, c, o = {}) {
        const id = this.shape({ edge: o.edge !== false, rim: o.rim !== false, outline: o.outline !== false });
        let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
        pts.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
        for (let y = Math.floor(y0); y <= Math.ceil(y1); y++) {
            for (let x = Math.floor(x0); x <= Math.ceil(x1); x++) {
                const px = x + 0.5, py = y + 0.5;
                let inside = false;
                for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
                    const [xi, yi] = pts[i], [xj, yj] = pts[j];
                    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside;
                }
                if (!inside) continue;
                const b = o.grad ? mix(o.grad[0], o.grad[1], (py - y0) / Math.max(1, y1 - y0)) : c;
                this.put(x, y, b, b, id);
            }
        }
        return id;
    }
    rect(x, y, w, h, c, o = {}) { return this.poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], c, o); }
    /* thick stroke along a path, radius interpolated */
    tube(pts, r0, r1, c, o = {}) {
        const id = this.shape({ edge: o.edge !== false, rim: o.rim !== false, outline: o.outline !== false });
        let total = 0; const seg = [];
        for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); total += l; }
        let acc = 0;
        for (let i = 1; i < pts.length; i++) {
            const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
            const n = Math.max(1, Math.ceil(seg[i - 1] * 2));
            for (let k = 0; k <= n; k++) {
                const t = k / n, d = (acc + seg[i - 1] * t) / (total || 1);
                const cx = ax + (bx - ax) * t, cy = ay + (by - ay) * t, r = r0 + (r1 - r0) * d;
                const b = Array.isArray(c) ? c[Math.min(c.length - 1, Math.floor(d * c.length))] : c;
                for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
                    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
                        if ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r) this.put(x, y, b, b, id);
            }
            acc += seg[i - 1];
        }
        return id;
    }
    line(x0, y0, x1, y1, c, o = {}) {
        const id = this.shape({ edge: false, outline: !!o.outline });
        x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
        const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
        let err = dx + dy;
        for (;;) {
            this.put(x0, y0, c, c, id);
            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * err;
            if (e2 >= dy) { err += dy; x0 += sx; }
            if (e2 <= dx) { err += dx; y0 += sy; }
        }
        return id;
    }
    dot(x, y, c, o = {}) { const id = this.shape({ edge: false, outline: !!o.outline }); this.put(x, y, c, c, id); return id; }
    /* pie chart disc */
    pie(cx, cy, r, cols, start = -90) {
        const id = this.shape({ edge: true });
        for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
            for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
                const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
                if (dx * dx + dy * dy > r * r) continue;
                let a = (Math.atan2(dy, dx) * 180 / Math.PI - start + 720) % 360;
                let acc = 0, b = cols[0][1];
                for (const [pct, col] of cols) { acc += pct * 3.6; if (a < acc) { b = col; break; } }
                const e = Math.hypot(dx, dy) / r;
                const out = e > 0.7 && dx + dy > 0 ? shade(b, -0.22) : b;
                this.put(x, y, out, b, id);
            }
        return id;
    }
    /* cartoon eye */
    eye(cx, cy, r, iris, o = {}) {
        const [lx, ly] = o.look || [0, 0];
        if (o.sleepy) {
            this.ell(cx, cy, r, r * 0.9, '#ffffff', { shade: false, edge: false });
            this.ell(cx + lx, cy + r * 0.4, r * 0.55, r * 0.45, iris, { shade: false, edge: false, outline: false });
            this.ell(cx, cy - r * 0.5, r + 0.3, r * 0.75, o.lid || '#000000', { shade: false, edge: false, outline: false });
            this.line(cx - r + 0.5, cy + 0.2, cx + r - 0.5, cy + 0.2, '#1a1426');
            return;
        }
        this.ell(cx, cy, r, r * (o.tall || 1.2), o.sclera || '#ffffff', { shade: false, edge: false });
        this.ell(cx + lx, cy + ly, r * 0.62, r * 0.85 * (o.tall || 1.2) / 1.2, iris, { shade: false, edge: false, outline: false });
        if (r >= 2.5) this.ell(cx + lx, cy + ly + 0.3, r * 0.3, r * 0.45, '#140f22', { shade: false, edge: false, outline: false });
        this.dot(Math.round(cx + lx - r * 0.35), Math.round(cy + ly - r * 0.5), '#ffffff');
        if (o.angry) this.line(cx - r - 1 + (o.flip ? 2 * r + 1 : 0), cy - r * 1.5, cx + (o.flip ? -1 : 1), cy - r * 0.6, '#140f22');
    }

    finish() {
        const { W, H, col, base, id, shapes } = this;
        const out = col.slice();
        const N = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
            const i = y * W + x, s = id[i];
            if (s < 0) continue;
            const sh = shapes[s];
            if (sh.rim) {
                const r = this.get(x + 1, y), d = this.get(x, y + 1), l = this.get(x - 1, y), u = this.get(x, y - 1);
                if (r !== s || d !== s) out[i] = shade(base[i], (r !== s && d !== s) ? -0.34 : -0.22);
                else if (l !== s || u !== s) out[i] = shade(base[i], 0.22);
            }
            if (sh.edge) {
                for (const [dx, dy] of N) {
                    const j = this.get(x + dx, y + dy);
                    if (j >= 0 && j < s && shapes[j].edge !== false) { out[i] = shade(base[i], -0.52); break; }
                }
            }
        }
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
            const i = y * W + x;
            if (id[i] >= 0) continue;
            let best = null;
            for (const [dx, dy] of N) {
                const j = this.get(x + dx, y + dy);
                if (j >= 0 && shapes[j].outline) { best = base[(y + dy) * W + x + dx]; break; }
            }
            if (best) out[i] = shade(best, -0.66);
        }
        const c = document.createElement('canvas'); c.width = W; c.height = H;
        const g = c.getContext('2d');
        for (let i = 0; i < out.length; i++) if (out[i]) { g.fillStyle = out[i]; g.fillRect(i % W, (i / W) | 0, 1, 1); }
        return c;
    }
}

/* ---------------- creature designs (all original) ---------------- */
const DESIGNS = {
    /* --- partners --- */
    DATAVIZ(p) { // ART: chart-crested songbird with a pie-chart belly
        const Y = '#ffcf4a';
        p.poly([[34, 30], [46, 20], [45, 27], [47, 31], [36, 36]], '#e0688a');           // tail fan
        p.rect(39, 18, 3, 11, '#4f7cc2'); p.rect(43, 23, 3, 8, '#2bb3a3');
        p.ell(24, 33, 14, 12, Y);                                                   // body
        p.ell(10.5, 32, 4.5, 8, '#f2a93a', { rot: 20 });                            // wings
        p.ell(37.5, 32, 4.5, 8, '#f2a93a', { rot: -20 });
        p.pie(24, 35, 7, [[45, '#e0688a'], [30, '#4f7cc2'], [25, '#2bb3a3']]);       // belly chart
        p.rect(17, 3, 4, 10, '#e0688a'); p.rect(22, 0, 4, 13, '#4f7cc2'); p.rect(27, 5, 4, 8, '#2bb3a3'); // crest bars
        p.ell(24, 18, 11, 9.5, Y);                                                  // head
        p.eye(19.5, 17, 3, '#3b2a6a', { look: [0.5, 0.5] });
        p.eye(28.5, 17, 3, '#3b2a6a', { look: [-0.5, 0.5] });
        p.ell(15.5, 22, 2, 1.3, '#ff9ab0', { shade: false, edge: false, outline: false });
        p.ell(32.5, 22, 2, 1.3, '#ff9ab0', { shade: false, edge: false, outline: false });
        p.poly([[21.5, 21], [26.5, 21], [24, 25.5]], '#ff8c2a');                     // beak
        p.ell(18.5, 45, 3.5, 2, '#ff8c2a'); p.ell(29.5, 45, 3.5, 2, '#ff8c2a');      // feet
    },
    PIPELYNX(p) { // DATA: lynx with a data-pipe tail
        const T = '#37c3b1', D = '#1f8f82';
        p.tube([[33, 40], [40, 38], [43, 31], [42, 24], [38, 20]], 2.6, 2.2, '#9aa7b8'); // pipe tail
        [[40.5, 38], [43, 31], [42, 24]].forEach(([x, y]) => p.ell(x, y, 3.4, 3.4, '#6b7a90'));
        p.ell(39, 19.5, 3, 3, '#ffd447');                                           // data packet
        p.ell(25, 34, 12, 10.5, T);                                                 // body
        p.ell(25, 37, 7, 6.5, '#d9fbf5');                                           // chest
        p.ell(18.5, 43, 4, 3.5, T); p.ell(30.5, 43, 4, 3.5, T);                      // paws
        p.rect(15, 39, 7, 2.5, '#6b7a90'); p.rect(27, 39, 7, 2.5, '#6b7a90');      // pipe cuffs
        p.poly([[10, 18], [12, 2], [21, 12]], T); p.poly([[28, 12], [37, 2], [39, 18]], T); // ears
        p.poly([[12.5, 14], [13.2, 6], [18, 12]], '#ff9ab0', { edge: false });
        p.poly([[31, 12], [35.8, 6], [36.5, 14]], '#ff9ab0', { edge: false });
        p.line(12, 2, 11, -1, '#1a1426'); p.line(37, 2, 38, -1, '#1a1426');
        p.ell(24.5, 19.5, 13, 10, T);                                               // head
        p.ell(13, 24, 4, 3, '#d9fbf5', { rot: -20 }); p.ell(36, 24, 4, 3, '#d9fbf5', { rot: 20 }); // cheek fluff
        p.rect(19, 10, 2, 4, D, { edge: false }); p.rect(24, 9.5, 2, 4.5, D, { edge: false }); p.rect(29, 10, 2, 4, D, { edge: false });
        p.eye(19, 19, 3.2, '#e8b52a', { tall: 1.25 }); p.eye(30, 19, 3.2, '#e8b52a', { tall: 1.25 });
        p.ell(24.5, 24, 1.6, 1.1, '#ff7aa0', { shade: false, edge: false, outline: false });
        p.line(23, 26, 24, 27, '#1a1426'); p.line(25, 27, 26, 26, '#1a1426');
    },
    QUERYOWL(p) { // LOGIC: bespectacled owl
        const B = '#4f7cc2';
        p.ell(24, 29, 15, 16, B);                                                   // body
        p.ell(9.5, 31, 5, 10, '#3d64a8', { rot: 12 }); p.ell(38.5, 31, 5, 10, '#3d64a8', { rot: -12 }); // wings
        p.ell(24, 35, 9.5, 9.5, '#dfe9fa');                                         // belly
        [[20, 32], [24, 34], [28, 32], [22, 38], [26, 38]].forEach(([x, y]) => { p.line(x - 1, y, x, y + 1, '#9fb5dc'); p.line(x, y + 1, x + 1, y, '#9fb5dc'); });
        p.poly([[9, 16], [11, 3], [17, 12]], B); p.poly([[31, 12], [37, 3], [39, 16]], B); // ear tufts
        p.ell(17.5, 20.5, 7, 7, '#20304f', { shade: false });                       // glasses rims
        p.ell(30.5, 20.5, 7, 7, '#20304f', { shade: false });
        p.rect(23, 19, 2, 2, '#20304f', { edge: false, rim: false });
        p.eye(17.5, 20.5, 5.4, '#f2a541', { tall: 1, sclera: '#f4f8ff' });
        p.eye(30.5, 20.5, 5.4, '#f2a541', { tall: 1, sclera: '#f4f8ff' });
        p.poly([[22, 26], [26, 26], [24, 30]], '#ffc23d');                          // beak
        p.ell(18.5, 45, 3.5, 2, '#ffb02e'); p.ell(29.5, 45, 3.5, 2, '#ffb02e');
    },

    /* --- wild --- */
    NULL_VALUE(p) { // hollow sheet ghost
        const W = '#e6e9ff';
        p.ell(41, 12, 3, 3, '#b9a6ff', { edge: false }); p.ell(6, 20, 2, 2, '#b9a6ff', { edge: false });
        p.poly([[9, 24], [39, 24], [41, 41], [36, 37], [31, 43], [26, 38], [21, 44], [16, 38], [11, 42], [7, 40]], W, { grad: [W, '#b8bff0'] });
        p.ell(24, 22, 15, 15, W);
        p.ell(18, 21, 4.2, 5.5, '#1b1530', { shade: false, edge: false });
        p.ell(30, 21, 4.2, 5.5, '#1b1530', { shade: false, edge: false });
        p.line(15, 26, 21, 16, '#b9a6ff'); p.line(27, 26, 33, 16, '#b9a6ff');       // ∅ slashes
        p.ell(24, 31, 3.5, 2.5, '#1b1530', { shade: false, edge: false });
        p.ell(24, 32, 2, 1.1, '#7b5cc9', { shade: false, edge: false, outline: false });
        p.ell(6.5, 30, 3.5, 5, W, { rot: 30 }); p.ell(41.5, 30, 3.5, 5, W, { rot: -30 }); // little arms
    },
    DIRTY_DATA(p) { // corrupted mud slime
        const M = '#9a7346';
        [[5, 10, '#ff4d6d'], [41, 8, '#ffd447'], [44, 18, '#4dd2ff'], [3, 22, '#7dff7a']].forEach(([x, y, c]) => p.rect(x, y, 3, 3, c, { rim: false }));
        p.ell(24, 36, 20, 11, M);
        p.ell(21, 25, 12, 11, M);
        p.ell(31, 18, 5, 6, M, { rot: 25 });
        p.ell(9, 44, 3, 2.5, '#7a5832'); p.ell(39, 45, 4, 2.5, '#7a5832');
        [[13, 33, 3], [33, 38, 2.5], [28, 29, 2], [16, 40, 2]].forEach(([x, y, r]) => p.ell(x, y, r, r * 0.8, '#6e4f2b', { shade: false, edge: false, outline: false }));
        p.eye(17, 25, 4.4, '#d94b3a', { look: [1, 0] });
        p.eye(28.5, 26, 2.6, '#3c7a2a', { look: [-0.5, 0.5] });
        p.ell(23, 34, 7, 3.6, '#2a1608', { shade: false, edge: false });
        p.rect(18, 31, 2, 2, '#fff6d6', { rim: false, edge: false, outline: false }); p.rect(25, 31, 2, 2, '#fff6d6', { rim: false, edge: false, outline: false });
        p.rect(21, 35, 2, 2, '#fff6d6', { rim: false, edge: false, outline: false });
    },
    SLOW_QUERY(p) { // snail with a database-cylinder shell
        p.ell(22, 42, 19, 4.5, '#9fd36b');                                          // foot
        p.tube([[11, 42], [10, 34]], 4.6, 4.2, '#9fd36b');                           // neck
        p.line(7, 24, 5, 14, '#7fb34f'); p.line(12, 24, 15, 13, '#7fb34f');          // stalks
        p.ell(9.5, 28, 6.5, 6.5, '#a9dc74');                                         // head
        p.ell(5, 12, 4, 4, '#a9dc74'); p.ell(15.5, 11, 4, 4, '#a9dc74');
        p.eye(5, 12, 2.8, '#2a2a3a', { sleepy: true, lid: '#a9dc74' });
        p.eye(15.5, 11, 2.8, '#2a2a3a', { sleepy: true, lid: '#a9dc74' });
        p.line(7, 31, 11, 31, '#3c5a20');
        p.ell(5, 29, 1.4, 1, '#ff9ab0', { shade: false, edge: false, outline: false });
        const S = '#7d9fd0';
        p.rect(17, 14, 24, 25, S, { grad: ['#9bb8e3', '#5f7fb4'] });                 // cylinder
        p.ell(29, 39, 12, 4, '#5f7fb4', { shade: false });
        p.ell(29, 14, 12, 4, '#c9dcf7', { shade: false });
        [22, 30].forEach((y) => { p.ell(29, y, 12, 3.2, '#5f7fb4', { shade: false, edge: false, outline: false }); p.ell(29, y - 1.3, 12, 3.1, '#86a6d6', { shade: false, edge: false, outline: false }); });
        p.rect(17, 30.5, 24, 1, '#86a6d6', { rim: false, edge: false, outline: false });
        [[34, 19], [34, 27], [34, 35]].forEach(([x, y]) => p.dot(x, y, '#ffd447'));
        p.ell(29, 14, 6, 1.8, '#e8f1ff', { shade: false, edge: false, outline: false });
        p.rect(42, 4, 4, 1, '#ffffff', { rim: false }); p.rect(44, 1, 3, 1, '#ffffff', { rim: false }); // z z
    },
    MERGE_CONFLICT(p) { // two-headed branching serpent
        p.ell(24, 42, 16, 5, '#8a5cc2');
        p.tube([[24, 41], [17, 34], [14, 26], [13, 18]], 5, 4, '#e2574c');
        p.tube([[24, 41], [31, 34], [34, 26], [35, 18]], 5, 4, '#4f86d6');
        p.ell(12, 13, 8.5, 6.5, '#e2574c'); p.ell(36, 13, 8.5, 6.5, '#4f86d6');
        p.ell(6.5, 16.5, 4.5, 3.2, '#f08a7f'); p.ell(41.5, 16.5, 4.5, 3.2, '#89b3ef');
        p.dot(5, 16, '#5a1a1a'); p.dot(42, 16, '#1a2a5a');
        p.eye(14, 10.5, 2.9, '#ffd447', { angry: true });
        p.eye(34, 10.5, 2.9, '#ffd447', { angry: true, flip: true });
        p.line(4, 18, 1, 20, '#ff3b5c'); p.line(1, 20, 0, 19, '#ff3b5c'); p.line(1, 20, 1, 22, '#ff3b5c');
        p.line(44, 18, 47, 20, '#ff3b5c'); p.line(47, 20, 47, 18, '#ff3b5c');
        [[15, 30], [17, 36], [33, 30], [31, 36]].forEach(([x, y]) => p.dot(x, y, '#ffffff'));
        p.rect(20, 39, 1, 3, '#ffd447', { rim: false, edge: false, outline: false }); p.rect(27, 39, 1, 3, '#ffd447', { rim: false, edge: false, outline: false });
    },
    MEMORY_LEAK(p) { // dripping jellyfish
        const P = '#b48cf0';
        [[12, 30], [18, 32], [24, 33], [30, 32], [36, 30]].forEach(([x, y], i) =>
            p.tube([[x, y], [x + (i % 2 ? 2 : -2), y + 6], [x, y + 11 + (i % 2) * 2]], 2, 1, '#8f68d6'));
        p.ell(9, 46, 1.6, 2, '#d7c2ff'); p.ell(38, 45, 1.4, 1.8, '#d7c2ff'); p.ell(24, 47, 1.2, 1, '#d7c2ff');
        p.ell(24, 20, 17, 13, P);
        p.ell(24, 29, 16, 4, '#9a72e3');
        [[15, 13, 2.5], [31, 11, 2], [35, 19, 1.6], [19, 8, 1.4]].forEach(([x, y, r]) => p.ell(x, y, r, r, '#e2d4ff', { shade: false, edge: false, outline: false }));
        p.eye(18, 21, 3, '#3a1a6a', { sleepy: true, lid: P });
        p.eye(30, 21, 3, '#3a1a6a', { sleepy: true, lid: P });
        p.ell(24, 26, 2, 1.6, '#3a1a6a', { shade: false, edge: false });
        p.rect(4, 4, 6, 4, '#2bb3a3', { rim: false }); p.line(5, 6, 8, 6, '#d9fbf5');  // stray RAM chip
    },

    /* --- legendary (64 x 64) --- */
    PETADRAKE(p) { // DATA legendary: server-scaled dragon
        const T = '#2bb3a3', G = '#f2c14e';
        p.poly([[22, 30], [2, 10], [6, 22], [0, 26], [8, 32], [4, 38], [18, 40]], '#1d6f7a', { grad: ['#2a8f99', '#14505a'] });
        p.poly([[42, 30], [62, 10], [58, 22], [64, 26], [56, 32], [60, 38], [46, 40]], '#1d6f7a', { grad: ['#2a8f99', '#14505a'] });
        p.line(3, 11, 18, 36, '#0f3a40'); p.line(61, 11, 46, 36, '#0f3a40');
        p.tube([[40, 54], [52, 58], [60, 54], [62, 46]], 4.5, 1.5, T);
        p.poly([[62, 46], [64, 40], [59, 43]], G);
        p.ell(32, 46, 14, 14, T);
        p.ell(32, 48, 8.5, 11, '#e7d9a4');
        [42, 46, 50, 54].forEach((y) => p.rect(25, y, 14, 1, '#c8b46e', { rim: false, edge: false, outline: false }));
        [[27, 44], [31, 48], [35, 52]].forEach(([x, y]) => p.dot(x, y, '#4dff9a'));
        p.ell(21, 58, 5, 4, T); p.ell(43, 58, 5, 4, T);
        p.tube([[32, 36], [32, 28], [32, 22]], 6, 5, T);
        p.poly([[22, 12], [17, 0], [27, 9]], G); p.poly([[42, 12], [47, 0], [37, 9]], G);
        p.ell(32, 16, 11, 9, T);
        p.ell(32, 22, 7, 4.5, '#5fd8c8');
        p.dot(29, 22, '#0f3a40'); p.dot(35, 22, '#0f3a40');
        p.eye(26, 14, 2.6, '#ff3b5c', { angry: true }); p.eye(38, 14, 2.6, '#ff3b5c', { angry: true, flip: true });
        p.poly([[29, 3], [32, -1], [35, 3], [32, 7]], G);
        p.dot(32, 3, '#4dff9a');
    },
    SINGULARIX(p) { // LOGIC legendary: black-hole eye with accretion ring
        p.ell(32, 36, 31, 8, '#ff9a5a', { bands: ['#ffe28a', '#ff9a5a', '#e0507a', '#8e5cc2'], shade: false, edge: false });
        [[32, 2], [32, 62], [2, 26], [62, 26]].forEach(([x, y]) => p.poly([[x, y - 5], [x + 3, y], [x, y + 5], [x - 3, y]], '#c9a6ff'));
        p.ell(32, 32, 19, 19, '#2a1650', { bands: ['#120a24', '#120a24', '#1d1040', '#3a1f74'], hl: false });
        p.ell(32, 32, 11, 8, '#f5efff', { shade: false });
        p.ell(32, 32, 6.5, 6.5, '#9b5cff', { bands: ['#ffffff', '#c79bff', '#9b5cff', '#5a2ab0'], shade: false, edge: false });
        p.ell(32, 32, 3, 3, '#0a0614', { shade: false, edge: false, outline: false });
        p.dot(29, 29, '#ffffff'); p.dot(30, 29, '#ffffff');
        p.poly([[1, 37], [63, 37], [61, 42], [44, 44], [32, 44.5], [20, 44], [3, 42]], '#ff9a5a', { grad: ['#ffd27a', '#e0507a'] });
        [[8, 8], [56, 10], [10, 54], [54, 56], [44, 4], [18, 60]].forEach(([x, y]) => p.dot(x, y, '#fff3b0'));
    },
    PRISMORA(p) { // ART legendary: prism-winged moth
        const bands = ['#ffffff', '#ffe066', '#ff9a5a', '#ff5d8f', '#b46bff', '#5aa0ff', '#3fe0c8'];
        p.ell(16, 20, 15, 11, '#ff5d8f', { rot: -35, bands });
        p.ell(48, 20, 15, 11, '#ff5d8f', { rot: 35, bands });
        p.ell(19, 44, 11, 8, '#5aa0ff', { rot: 35, bands: bands.slice().reverse() });
        p.ell(45, 44, 11, 8, '#5aa0ff', { rot: -35, bands: bands.slice().reverse() });
        [[13, 18], [51, 18]].forEach(([x, y]) => { p.ell(x, y, 3.5, 3.5, '#2a1650', { shade: false, edge: false }); p.ell(x, y, 1.6, 1.6, '#3fe0c8', { shade: false, edge: false, outline: false }); });
        p.tube([[32, 26], [32, 40], [32, 52]], 4.5, 2.5, '#3a2a6a');
        [32, 37, 42, 47].forEach((y) => p.rect(28, y, 8, 1, '#5a4a9a', { rim: false, edge: false, outline: false }));
        p.ell(32, 21, 7, 6.5, '#ece4ff');
        p.tube([[29, 15], [26, 8], [21, 5], [19, 8]], 0.8, 0.8, '#ece4ff');
        p.tube([[35, 15], [38, 8], [43, 5], [45, 8]], 0.8, 0.8, '#ece4ff');
        p.ell(19, 8, 1.8, 1.8, '#ffe066'); p.ell(45, 8, 1.8, 1.8, '#ffe066');
        p.eye(29, 21, 2.3, '#b46bff'); p.eye(35, 21, 2.3, '#b46bff');
    }
};

const SIZES = { PETADRAKE: 64, SINGULARIX: 64, PRISMORA: 64 };
const cache = {};
function creature(name) {
    if (cache[name]) return cache[name];
    const N = SIZES[name] || 48;
    const p = new Pix(N, N);
    DESIGNS[name](p);
    const c = p.finish();
    cache[name] = c.toDataURL();
    return cache[name];
}
function flipped(name) {
    const key = name + '_flip';
    if (cache[key]) return cache[key];
    const N = SIZES[name] || 48;
    const c = document.createElement('canvas'); c.width = N; c.height = N;
    const src = new Pix(N, N); DESIGNS[name](src);
    const s = src.finish();
    const g = c.getContext('2d'); g.translate(N, 0); g.scale(-1, 1); g.drawImage(s, 0, 0);
    cache[key] = c.toDataURL();
    return cache[key];
}

window.EVZ_ART = { Pix, shade, mix, creature, flipped, DESIGNS, SIZES };
})();
