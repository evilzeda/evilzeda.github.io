/* Deal Room, corporate finance step by step: course engine + 2D SVG scene kit (forked from ../ml-llm).
   Lessons register themselves with ML.add({...}) from js/lessons-XX.js.
   A lesson provides draw(si,g) -> static SVG for step si, and optionally anim(si,t,g,ord,k) -> SVG overlay redrawn every frame. */
(function(){
'use strict';

/* ------------------------------------------------------------------ catalog */
const MODULES = [
  {id:'accounting',num:'01',title:'Accounting & Statements',c:'brown',lessons:['three-statements','ebitda','depreciation-walk','working-capital','diluted-shares','goodwill']},
  {id:'valuation',num:'02',title:'Core Valuation & Modeling',c:'green',lessons:['enterprise-value','ev-bridge','free-cash-flow','wacc','dcf','terminal-value','trading-comps','precedents']},
  {id:'mna',num:'03',title:'Mergers & Acquisitions',c:'blue',lessons:['strategic','sponsor','synergies','cash-vs-stock','stock-deal','accretion-dilution','earnouts','fairness-opinion','football-field']},
  {id:'lbo',num:'04',title:'Leveraged Buyouts & Debt',c:'orange',lessons:['cap-structure','leverage-ratios','covenants','lbo','return-drivers','moic']},
  {id:'markets',num:'05',title:'Capital Markets & Deal Process',c:'purple',lessons:['ipo','greenshoe','converts','auction','cim','qoe']}
];
const KINDS = {setup:['Setup','gray'],problem:['Problem','red'],solution:['Solution','green'],technique:['Technique','blue'],tradeoff:['Trade-off','yellow'],insight:['Insight','purple'],recap:['Recap','brown'],math:['Math','pink'],deal:['Deal','orange']};
const LESSONS = {};
const ORDER = [];
MODULES.forEach(m=>m.lessons.forEach((id,i)=>ORDER.push({id,mod:m,index:i+1,of:m.lessons.length})));

/* ------------------------------------------------------------------ icons (24x24, stroke) */
const IC = {
  brain:'<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
  chart:'<path d="M3 21h18M6 17v-5M11 17V7M16 17v-8M21 17V4"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  book:'<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3"/><path d="M20 4v14h-7"/>',
  doc:'<path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7M9 8h3"/>',
  home:'<path d="M3 11 12 3l9 8M5 10v10h14V10"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  check:'<path d="m5 12 5 5 9-10"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  play:'<path d="M7 4v16l13-8z"/>',
  repeat:'<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>',
  timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M10 2h4"/>',
  hash:'<path d="M5 9h15M4 15h15M10 3 8 21M16 3l-2 18"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  cpu:'<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
  tree:'<circle cx="12" cy="4" r="2"/><circle cx="6" cy="13" r="2"/><circle cx="18" cy="13" r="2"/><circle cx="3" cy="21" r="1.5"/><circle cx="9" cy="21" r="1.5"/><path d="M11 5.5 7 11.5M13 5.5l4 6M5 15l-1.5 4.5M7 15l1.5 4.5"/>',
  dice:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01"/>',
  msg:'<path d="M4 5h16v11H9l-5 4z"/>',
  scale:'<path d="M4 20 20 4M14 4h6v6M10 20H4v-6"/>',
  filter:'<path d="M3 4h18l-7 9v6l-4 2v-8z"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  db:'<ellipse cx="12" cy="5.5" rx="8" ry="2.8"/><path d="M4 5.5v13c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8v-13M4 12c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  tool:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  img:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5-9 8"/>',
  sparkle:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  dollar:'<path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  brief:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
  bank:'<path d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
  hand:'<path d="M7 11V6a1.5 1.5 0 0 1 3 0v4M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V12M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-3l-2.5-4a1.5 1.5 0 0 1 2.5-1.7L7 14"/>',
  pie:'<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
  trend:'<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'
};
const icon=(n,s=16,cls='')=>`<svg class="i ${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||IC.layers}</svg>`;

/* ------------------------------------------------------------------ helpers */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const f1=v=>(+v).toFixed(1);
const CW=0.62; // mono char width ratio
const VW=860,VH=480; // logical scene size

/* ------------------------------------------------------------------ math utils for lessons */
const U={
  rng(seed=1){let s=seed>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}},
  gauss(r){let u=0,v=0;while(!u)u=r();while(!v)v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)},
  blob(r,n,cx,cy,sx,sy=sx,c='blue',extra={}){const a=[];for(let i=0;i<n;i++)a.push({x:cx+U.gauss(r)*sx,y:cy+U.gauss(r)*sy,c,...extra});return a},
  lerp:(a,b,t)=>a+(b-a)*t,
  clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),
  ease:t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,
  sigmoid:z=>1/(1+Math.exp(-z)),
  softmax(a,T=1){const m=Math.max(...a);const e=a.map(v=>Math.exp((v-m)/T));const s=e.reduce((x,y)=>x+y,0);return e.map(v=>v/s)},
  range:(n)=>[...Array(n).keys()],
  dist:(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)
};

/* ------------------------------------------------------------------ scene kit: every function returns an SVG string */
const CLS=['blue','orange','green','purple','red','pink','yellow','brown','gray'];
const cv=c=>`--c:var(--${c||'gray'})`;
const g={
  U,esc,VW,VH,CLS,
  T(x,y,t,o={}){return `<text class="tx${o.cls?' '+o.cls:''}${o.c?' c':''}" x="${f1(x)}" y="${f1(y)}" text-anchor="${o.a||'start'}"${o.c?` style="${cv(o.c)}"`:''}${o.size?` font-size="${o.size}"`:''}${o.rot?` transform="rotate(${o.rot} ${f1(x)} ${f1(y)})"`:''}>${esc(t)}</text>`},
  /* multi-line text block */
  TL(x,y,lines,o={}){return lines.map((l,i)=>g.T(x,y+i*(o.lh||15),l,o)).join('')},
  R(x,y,w,h,o={}){return `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0,w))}" height="${f1(Math.max(0,h))}" rx="${o.rx||0}" style="${o.style||''}fill:${o.fill||'none'};stroke:${o.stroke||'none'};stroke-width:${o.sw||1};${o.dash?'stroke-dasharray:'+o.dash+';':''}opacity:${o.op==null?1:o.op}"/>`},
  C(x,y,r,c='blue',o={}){return `<circle class="dt${o.cls?' '+o.cls:''}" cx="${f1(x)}" cy="${f1(y)}" r="${r}" style="${cv(c)}${o.op!=null?';opacity:'+o.op:''}"/>`},
  L(pts,c='ink',o={}){return `<polyline class="ln${o.cls?' '+o.cls:''}" style="${c==='ink'?'--c:var(--edge)':cv(c)}${o.w?';stroke-width:'+o.w:''}${o.op!=null?';opacity:'+o.op:''}" points="${pts.map(p=>f1(p[0])+','+f1(p[1])).join(' ')}"/>`},
  poly(pts,c,op=.2,o={}){return `<polygon class="fd" style="${cv(c)};opacity:${op}${o.stroke?';stroke:var(--'+c+');stroke-width:1.5':''}" points="${pts.map(p=>f1(p[0])+','+f1(p[1])).join(' ')}"/>`},
  /* arrow from a to b; o.curve bends it, o.c colour */
  A(x1,y1,x2,y2,o={}){
    const c=o.c||'edge',col=c==='edge'?'var(--edge)':`var(--${c})`;
    const dx=x2-x1,dy=y2-y1,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d;
    const cb=o.curve||0,mx=(x1+x2)/2-uy*cb,my=(y1+y2)/2+ux*cb;
    let ex=x2,ey=y2,tx=ux,ty=uy;
    if(cb){const ddx=x2-mx,ddy=y2-my,dd=Math.hypot(ddx,ddy)||1;tx=ddx/dd;ty=ddy/dd}
    const hs=o.hs||8;
    const path=cb?`M${f1(x1)},${f1(y1)} Q${f1(mx)},${f1(my)} ${f1(ex-tx*hs*.6)},${f1(ey-ty*hs*.6)}`:`M${f1(x1)},${f1(y1)} L${f1(ex-tx*hs*.6)},${f1(ey-ty*hs*.6)}`;
    const head=o.head===false?'':`<path class="ah" style="fill:${col}" d="M${f1(ex)},${f1(ey)} L${f1(ex-tx*hs-ty*hs*.55)},${f1(ey-ty*hs+tx*hs*.55)} L${f1(ex-tx*hs+ty*hs*.55)},${f1(ey-ty*hs-tx*hs*.55)} Z"/>`;
    return `<g${o.op!=null?` opacity="${o.op}"`:''}><path class="ar${o.dash?' dash':''}" style="stroke:${col}${o.w?';stroke-width:'+o.w:''}" d="${path}"/>${head}${o.l?g.pill((x1+x2)/2-uy*cb*0.5+(o.lx||0),(y1+y2)/2+ux*cb*0.5+(o.ly||0),o.l,o.lt||'ink'):''}</g>`;
  },
  /* moving dot along a straight/curved arrow at phase k∈[0,1] */
  dot(x1,y1,x2,y2,k,c='orange',o={}){
    const cb=o.curve||0;const dx=x2-x1,dy=y2-y1,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d;
    const mx=(x1+x2)/2-uy*cb,my=(y1+y2)/2+ux*cb;k=U.clamp(k,0,1);
    const x=cb?(1-k)*(1-k)*x1+2*(1-k)*k*mx+k*k*x2:x1+dx*k,y=cb?(1-k)*(1-k)*y1+2*(1-k)*k*my+k*k*y2:y1+dy*k;
    return `<circle class="pk" cx="${f1(x)}" cy="${f1(y)}" r="${o.r||5}" style="fill:var(--${c})"/>`;
  },
  pill(x,y,text,tone='ink',o={}){
    const fs=o.fs||11,w=String(text).length*fs*CW+16,h=fs+9;
    const fill=tone==='ink'?'var(--bg)':`color-mix(in srgb,var(--${tone}) 22%,var(--mixbase))`;
    return `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="${f1(-w/2)}" y="${f1(-h/2)}" width="${f1(w)}" height="${h}" rx="6" style="fill:${fill};stroke:var(--edge);stroke-width:1.3"/><text x="0" y="${f1(fs*0.36)}" text-anchor="middle" style="fill:var(--ink);font:600 ${fs}px var(--font)">${esc(text)}</text></g>`;
  },
  /* neo-brutalist box, centred at (x,y) */
  box(x,y,w,h,label,c='blue',o={}){
    const lines=Array.isArray(label)?label:String(label||'').split('\n').filter(Boolean);
    const n=lines.length+(o.sub?1:0);let ty=y-(n-1)*7+4;
    let s=`<g class="bx${o.hot?' hot':''}${o.dim?' dim':''}${o.ghost?' ghost':''}${o.flat?' flat':''}" style="${cv(c)}"><rect class="b" x="${f1(x-w/2)}" y="${f1(y-h/2)}" width="${w}" height="${h}" rx="${o.rx==null?8:o.rx}"/>`;
    lines.forEach(l=>{s+=`<text class="bl" x="${f1(x)}" y="${f1(ty)}" text-anchor="middle"${o.fs?` style="font-size:${o.fs}px"`:''}>${esc(l)}</text>`;ty+=14});
    if(o.sub)s+=`<text class="bs" x="${f1(x)}" y="${f1(ty)}" text-anchor="middle">${esc(o.sub)}</text>`;
    return s+'</g>';
  },
  /* sticky panel with a title and monospaced lines, top-left at (x,y) */
  panel(x,y,title,lines=[],c='yellow',o={}){
    const fs=11,w=o.w||Math.max(String(title).length*11.5*CW,...lines.map(l=>String(l).length*fs*CW))+26,h=34+lines.length*16;
    return `<g class="panel p-${c}" transform="translate(${f1(x)} ${f1(y)})"><rect width="${f1(w)}" height="${h}" rx="9" style="fill:${c==='ink'?'var(--bg)':`var(--${c}-bg)`};stroke:var(--edge);stroke-width:1.5;filter:drop-shadow(3px 3px 0 color-mix(in srgb,var(--edge) 85%,transparent))"/><text x="13" y="20" style="font:700 11.5px var(--font);fill:var(--ink)">${esc(title)}</text>${lines.map((l,i)=>`<text x="13" y="${40+i*16}" style="font:${/^\s*(=|total|→)/i.test(l)?700:500} 11px var(--font);fill:${/^\s*(=|total|→)/i.test(l)?'var(--ink)':'var(--mute)'};white-space:pre">${esc(l)}</text>`).join('')}</g>`;
  },
  /* 2D plot frame. returns {svg, sx, sy, x,y,w,h, inv} */
  plot(o){
    const x=o.x||60,y=o.y||30,w=o.w||420,h=o.h||400,[x0,x1]=o.xr||[0,10],[y0,y1]=o.yr||[0,10];
    const sx=v=>x+(v-x0)/(x1-x0)*w,sy=v=>y+h-(v-y0)/(y1-y0)*h;
    let s=`<g class="ax"><rect class="frame" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>`;
    if(o.grid!==false){const nx=o.nx||5,ny=o.ny||5;for(let i=1;i<nx;i++){const X=x+w*i/nx;s+=`<line x1="${f1(X)}" y1="${y}" x2="${f1(X)}" y2="${y+h}"/>`}for(let i=1;i<ny;i++){const Y=y+h*i/ny;s+=`<line x1="${x}" y1="${f1(Y)}" x2="${x+w}" y2="${f1(Y)}"/>`}}
    if(o.ticks){const nx=o.nx||5,ny=o.ny||5;for(let i=0;i<=nx;i++){const v=x0+(x1-x0)*i/nx;s+=`<text x="${f1(sx(v))}" y="${y+h+14}" text-anchor="middle">${+v.toFixed(2)}</text>`}for(let i=0;i<=ny;i++){const v=y0+(y1-y0)*i/ny;s+=`<text x="${x-6}" y="${f1(sy(v)+3)}" text-anchor="end">${+v.toFixed(2)}</text>`}}
    if(o.xl)s+=`<text class="al" x="${x+w/2}" y="${y+h+(o.ticks?30:18)}" text-anchor="middle">${esc(o.xl)}</text>`;
    if(o.yl)s+=`<text class="al" x="${x-(o.ticks?30:12)}" y="${y+h/2}" text-anchor="middle" transform="rotate(-90 ${x-(o.ticks?30:12)} ${y+h/2})">${esc(o.yl)}</text>`;
    if(o.title)s+=`<text class="al" x="${x}" y="${y-8}">${esc(o.title)}</text>`;
    s+='</g>';
    const P={svg:s,sx,sy,x,y,w,h,xr:[x0,x1],yr:[y0,y1],inv:(px,py)=>[x0+(px-x)/w*(x1-x0),y0+(y+h-py)/h*(y1-y0)]};
    P.pts=(arr,r=5,o2={})=>arr.map(p=>g.C(sx(p.x),sy(p.y),p.r||r,p.c||'blue',{cls:(p.cls||'')+(o2.cls?' '+o2.cls:''),op:p.op})).join('');
    P.fn=(fn,c='ink',o2={})=>{const a=[],N=o2.n||120,lo=o2.from!=null?o2.from:x0,hi=o2.to!=null?o2.to:x1;for(let i=0;i<=N;i++){const v=lo+(hi-lo)*i/N,yy=fn(v);if(isFinite(yy)&&yy>=y0-(y1-y0)*.5&&yy<=y1+(y1-y0)*.5)a.push([sx(v),U.clamp(sy(yy),y-2,y+h+2)])}return g.L(a,c,o2)};
    P.line=(pts,c='ink',o2={})=>g.L(pts.map(p=>[sx(p[0]),sy(p[1])]),c,o2);
    /* decision field: fn(x,y) -> colour name or null */
    P.field=(fn,res=34,op=.22)=>{let s2='';const cw=w/res,chh=h/Math.round(res*h/w),ny=Math.round(res*h/w);for(let i=0;i<res;i++)for(let j=0;j<ny;j++){const [vx,vy]=P.inv(x+(i+.5)*cw,y+(j+.5)*chh);const c=fn(vx,vy);if(c)s2+=`<rect x="${f1(x+i*cw)}" y="${f1(y+j*chh)}" width="${f1(cw+.6)}" height="${f1(chh+.6)}" style="fill:var(--${c});opacity:${op}"/>`}return `<g>${s2}</g>`};
    P.clip=inner=>{const id='cp'+Math.random().toString(36).slice(2,8);return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/></clipPath><g clip-path="url(#${id})">${inner}</g>`};
    return P;
  },
  /* bar chart. vals: numbers; o.labels, o.hi (index or set), o.max, o.fmt, o.c (colour or array) */
  bars(x,y,w,h,vals,o={}){
    const n=vals.length,gap=o.gap==null?8:o.gap,bw=(w-gap*(n-1))/n,mx=o.max||Math.max(...vals.map(Math.abs),1e-9);
    let s=`<g class="br">`;if(o.base!==false)s+=`<line x1="${x}" y1="${y+h}" x2="${x+w}" y2="${y+h}" style="stroke:var(--edge);stroke-width:1.3"/>`;
    vals.forEach((v,i)=>{const bh=Math.max(1,Math.abs(v)/mx*h),bx=x+i*(bw+gap),c=Array.isArray(o.c)?o.c[i]:(o.c||'blue');const hot=o.hi!=null&&(o.hi===i||(o.hi.has&&o.hi.has(i)));
      s+=`<rect class="bar${hot?' hot':''}" x="${f1(bx)}" y="${f1(y+h-bh)}" width="${f1(bw)}" height="${f1(bh)}" rx="3" style="${cv(c)}${o.dim&&!hot?';opacity:.45':''}"/>`;
      if(o.fmt!==false)s+=`<text class="v" x="${f1(bx+bw/2)}" y="${f1(y+h-bh-5)}" text-anchor="middle">${o.fmt?o.fmt(v):+v.toFixed(2)}</text>`;
      if(o.labels)s+=`<text x="${f1(bx+bw/2)}" y="${y+h+14}" text-anchor="middle"${o.rot?` transform="rotate(${o.rot} ${f1(bx+bw/2)} ${y+h+14})"`:''}>${esc(o.labels[i])}</text>`});
    return s+'</g>';
  },
  /* horizontal bars: rows of [label, value] */
  hbars(x,y,w,rows,o={}){
    const rh=o.rh||22,mx=o.max||Math.max(...rows.map(r=>r[1]),1e-9),lw=o.lw||90;let s='<g class="br">';
    rows.forEach(([l,v],i)=>{const yy=y+i*rh,bw=Math.max(2,v/mx*(w-lw-50)),hot=o.hi===i,c=o.c?(Array.isArray(o.c)?o.c[i]:o.c):'blue';
      s+=`<text x="${x+lw-8}" y="${f1(yy+rh/2+4)}" text-anchor="end" style="fill:var(--ink)">${esc(l)}</text><rect class="bar${hot?' hot':''}" x="${x+lw}" y="${f1(yy+3)}" width="${f1(bw)}" height="${rh-6}" rx="3" style="${cv(c)}"/><text class="v" x="${f1(x+lw+bw+6)}" y="${f1(yy+rh/2+4)}">${o.fmt?o.fmt(v):+v.toFixed(2)}</text>`});
    return s+'</g>';
  },
  /* heatmap matrix M (rows x cols) with values 0..1 (or o.max) */
  heat(x,y,M,o={}){
    const cs=o.cs||34,c=o.c||'blue',mx=o.max||1,mn=o.min||0;let s='<g>';
    M.forEach((row,i)=>row.forEach((v,j)=>{if(v==null)return;const k=U.clamp((v-mn)/(mx-mn),0,1);const hot=o.hi&&o.hi[0]===i&&(o.hi[1]==null||o.hi[1]===j);
      s+=`<rect class="cell" x="${f1(x+j*cs)}" y="${f1(y+i*cs)}" width="${cs}" height="${cs}" rx="4" style="fill:color-mix(in srgb,var(--${o.cf?o.cf(v,i,j):c}) ${Math.round(8+k*80)}%,var(--mixbase))${hot?';stroke:var(--edge);stroke-width:2.2':''}${o.dimRow!=null&&o.dimRow!==i?';opacity:.3':''}"/>`;
      if(o.vals!==false)s+=`<text class="cell-t" x="${f1(x+j*cs+cs/2)}" y="${f1(y+i*cs+cs/2+3.5)}" text-anchor="middle"${o.dimRow!=null&&o.dimRow!==i?' opacity=".3"':''}>${o.fmt?o.fmt(v):(+v).toFixed(o.dp==null?2:o.dp).replace(/^0\./,'.')}</text>`}));
    if(o.rows)o.rows.forEach((l,i)=>{s+=`<text class="tx" x="${x-6}" y="${f1(y+i*cs+cs/2+4)}" text-anchor="end"${o.dimRow!=null&&o.dimRow!==i?' opacity=".35"':''}>${esc(l)}</text>`});
    if(o.cols)o.cols.forEach((l,j)=>{const cx=x+j*cs+cs/2,cy=y-6;s+=o.crot?`<text class="tx" x="${f1(cx)}" y="${f1(cy)}" transform="rotate(-45 ${f1(cx)} ${f1(cy)})">${esc(l)}</text>`:`<text class="tx" x="${f1(cx)}" y="${f1(cy)}" text-anchor="middle">${esc(l)}</text>`});
    return s+'</g>';
  },
  /* token chips in a row; toks: strings or {t,c,id,hot,dim}. returns {svg, pos:[{x,y,w}] , w} */
  chips(x,y,toks,o={}){
    const fs=11.5,gap=o.gap==null?6:o.gap,h=o.h||(o.ids?34:24);let cx=x,s='';const pos=[];
    toks.forEach((tk,i)=>{const T=typeof tk==='string'?{t:tk}:tk;const txt=T.t.replace(/ /g,'·');const w=Math.max(o.minw||22,txt.length*fs*CW+14);
      s+=`<g class="chip-g${T.hot?' hot':''}${T.dim?' dim':''}" style="${cv(T.c||o.c||'blue')}"><rect x="${f1(cx)}" y="${f1(y)}" width="${f1(w)}" height="${h}" rx="6"/><text x="${f1(cx+w/2)}" y="${f1(y+(o.ids?14:16))}" text-anchor="middle">${esc(txt)}</text>${o.ids&&T.id!=null?`<text class="id" x="${f1(cx+w/2)}" y="${f1(y+28)}" text-anchor="middle">${esc(T.id)}</text>`:''}</g>`;
      pos.push({x:cx,y,w,h,cx:cx+w/2});cx+=w+gap});
    return {svg:s,pos,w:cx-x-gap};
  },
  /* neural net: layers = [n0,n1,...]; returns {svg,nodes:[[{x,y}]]} */
  net(x,y,w,h,layers,o={}){
    const nodes=layers.map((n,li)=>{const X=x+(layers.length===1?w/2:w*li/(layers.length-1));const sp=Math.min(o.sp||46,h/(n));return U.range(n).map(i=>({x:X,y:y+h/2+(i-(n-1)/2)*sp}))});
    let s='<g class="nn">';
    if(o.edges!==false)for(let li=0;li<nodes.length-1;li++)nodes[li].forEach((a,i)=>nodes[li+1].forEach((b,j)=>{const hot=o.hotE&&o.hotE(li,i,j);s+=`<line class="${hot?'hot':''}" x1="${f1(a.x)}" y1="${f1(a.y)}" x2="${f1(b.x)}" y2="${f1(b.y)}" style="${cv(o.ec||o.c||'blue')}${o.wfn?';stroke-width:'+o.wfn(li,i,j):''}"/>`}));
    nodes.forEach((L,li)=>L.forEach((p,i)=>{const c=o.cfn?o.cfn(li,i):(o.c||'blue');const hot=o.hot&&o.hot(li,i);s+=`<circle class="${hot?'hot':''}" cx="${f1(p.x)}" cy="${f1(p.y)}" r="${o.r||11}" style="${cv(c)}"/>`;if(o.lab){const t=o.lab(li,i);if(t!=null)s+=`<text class="tx" x="${f1(p.x)}" y="${f1(p.y+3.5)}" text-anchor="middle" style="font-size:9.5px;font-weight:700">${esc(t)}</text>`}}));
    if(o.titles)o.titles.forEach((t,li)=>{s+=`<text class="tx m" x="${f1(nodes[li][0].x)}" y="${f1(y+h+18)}" text-anchor="middle">${esc(t)}</text>`});
    return {svg:s+'</g>',nodes};
  },
  /* vector arrow in a plot P from origin */
  vec(P,x0,y0,x1,y1,c,l,o={}){return g.A(P.sx(x0),P.sy(y0),P.sx(x1),P.sy(y1),{c,w:2.4,...o})+(l?g.T(P.sx(x1)+(o.dx==null?6:o.dx),P.sy(y1)+(o.dy==null?-6:o.dy),l,{cls:'b',c}):'')},
  icon(n,x,y,s=20,color='var(--ink)'){return `<g transform="translate(${f1(x-s/2)} ${f1(y-s/2)}) scale(${s/24})" fill="none" stroke="${color}" stroke-width="${1.9*24/s}" stroke-linecap="round" stroke-linejoin="round">${IC[n]||IC.layers}</g>`},
  /* faded-in group */
  fade(s,delay=0){return `<g class="fadein" style="animation-delay:${delay}s">${s}</g>`}
};

/* ------------------------------------------------------------------ app state */
const S={home:false,lesson:null,si:0,speed:1,paused:false,homeId:null};
let clock=0,lastNow=performance.now(),stepClock=0;

/* ------------------------------------------------------------------ layout */
function shell(){
  document.body.innerHTML=`
  <header class="top">
    <button class="tb menu-b" id="menuB" aria-label="Lessons">${icon('list',18)}</button>
    <a class="brand" href="#/"><span class="logo">${icon('brief',18)}</span><span>Deal <mark>Room</mark></span></a>
    <nav class="tabs"><a href="#/" id="tabHome">${icon('home',15)}Home</a><a href="#/" id="tabLearn">${icon('book',15)}Learn</a><a href="#/cheatsheet" id="tabCheat">${icon('doc',15)}Cheatsheet</a></nav>
    <div class="sp"></div>
    <label class="search">${icon('search',15)}<input id="q" placeholder="Search lessons…" autocomplete="off"><kbd>Ctrl K</kbd></label>
    <button class="tb" id="themeB" aria-label="Toggle theme" title="Theme (T)"></button>
    <a class="tb back" href="../" title="Back to evilzeda site">${icon('globe',16)}<span>evilzeda</span></a>
  </header>
  <div class="app">
    <aside class="side" id="side">
      <div class="side-h"><span>${icon('book',15)} Course</span><small>${ORDER.length} lessons</small></div>
      <div class="tree" id="tree"></div>
      <div class="prog"><div><b>PROGRESS</b><span id="progN"></span></div><i><b id="progBar"></b></i></div>
    </aside>
    <main class="center" id="center"></main>
    <aside class="right" id="right"></aside>
  </div>
  <div id="home"></div>`;
  $('#menuB').onclick=()=>document.body.classList.toggle('menu');
  $('#themeB').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
  $('#q').oninput=buildTree;
  setTheme(store.get('cf-theme',matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
}
function setTheme(t){document.documentElement.dataset.theme=t;store.set('cf-theme',t);const b=$('#themeB');if(b)b.innerHTML=t==='dark'?icon('bolt',16):icon('eye',16)}
function doneSet(){return new Set(store.get('cf-done',[]))}
const folderSVG=c=>`<svg class="folder" style="--c:var(--${c})" width="18" height="15" viewBox="0 0 20 16"><path d="M1.2 3.2A2 2 0 0 1 3.2 1.2h4.1l2 2.2h7.5a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H3.2a2 2 0 0 1-2-2Z"/><path class="lip" d="M1.2 6.2h17.6"/></svg>`;
function buildTree(){
  const q=($('#q')?.value||'').trim().toLowerCase();
  const done=doneSet(),cur=S.lesson&&S.lesson.id,open=store.get('cf-open',{});
  let html='';
  MODULES.forEach(m=>{
    const ls=m.lessons.map(id=>LESSONS[id]).filter(Boolean).filter(L=>!q||(L.title+' '+L.sub+' '+(L.keys||'')).toLowerCase().includes(q));
    if(q&&!ls.length)return;
    const isOpen=q||m.lessons.includes(cur)||open[m.id];
    const nd=m.lessons.filter(id=>done.has(id)).length;
    html+=`<div class="mod${isOpen?' open':''}" data-m="${m.id}"><button class="mod-h"><span class="car">›</span>${folderSVG(m.c)}<span class="mt">${m.num}. ${m.title}</span><small>${nd}/${m.lessons.length}</small></button><div class="mod-l">`;
    ls.forEach(L=>{html+=`<a href="#/${L.id}/1" class="${L.id===cur?'on':''}${done.has(L.id)?' done':''}"><span class="ck">${done.has(L.id)?icon('check',11):''}</span>${esc(L.title)}</a>`});
    html+='</div></div>';
  });
  $('#tree').innerHTML=html||'<p class="empty">No lessons match.</p>';
  $$('.mod-h').forEach(b=>b.onclick=()=>{const m=b.parentElement;m.classList.toggle('open');const o=store.get('cf-open',{});o[m.dataset.m]=m.classList.contains('open');store.set('cf-open',o)});
  $('#progN').textContent=`${done.size} / ${ORDER.length}`;
  $('#progBar').style.width=done.size/ORDER.length*100+'%';
}
const stageSVG=()=>`<svg id="scene" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMid meet"><defs><pattern id="dotg" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" style="fill:var(--grid)"/></pattern></defs><rect x="-400" y="-300" width="${VW+800}" height="${VH+600}" fill="url(#dotg)"/><g id="ls"></g><g id="la"></g></svg>`;

/* ------------------------------------------------------------------ sources */
const host=u=>{try{return new URL(u).hostname.replace(/^www\./,'')}catch(e){return ''}};
const sources=L=>(ML.src&&ML.src[L.id])||[];
function sourcesHTML(L,compact){return `<ul class="srcs${compact?' compact':''}">${sources(L).map(([t,u,by])=>`<li><a href="${u}" target="_blank" rel="noopener" title="${esc(u)}">${compact?'':icon(/sec\.gov|ifrs|fasb|nyu\.edu|ssrn|wiley|mckinsey|federalreserve|finra/.test(u)?'doc':'link',13)}<span><b>${esc(t)}</b>${compact?'':`<small>${esc(by||host(u))}</small>`}</span>${icon('arrow',12,'ext')}</a></li>`).join('')}</ul>`}

/* ------------------------------------------------------------------ lesson view */
const meta=id=>ORDER.find(o=>o.id===id);
function next(id){const i=ORDER.findIndex(o=>o.id===id);for(let k=i+1;k<ORDER.length;k++)if(LESSONS[ORDER[k].id])return LESSONS[ORDER[k].id];return null}
function lessonView(L){
  const M=meta(L.id);
  $('#center').innerHTML=`
    <section class="card lhead">
      <div class="crumbs">${M.mod.num}. ${M.mod.title} <span>/</span> Lesson ${M.index} of ${M.of}</div>
      <div class="lh-row"><h1>${esc(L.title)}</h1>
        <div class="chips"><span class="chip c-yellow">${icon('clock',13)}${L.min} min</span><span class="chip c-${L.lvl==='Beginner'?'green':L.lvl==='Advanced'?'red':'blue'}">${icon('chart',13)}${L.lvl}</span><span class="chip c-purple">${icon('list',13)}${L.steps.length} steps</span></div></div>
      <p class="sub">${esc(L.sub)}</p>
    </section>
    <section class="card stagecard">
      <div class="st-top"><div class="metrics" id="metrics">${L.met.map(([k,l,ic])=>`<div class="metric" data-k="${k}"><div class="ml">${icon(ic||'chart',12)}${esc(l)}</div><div class="mv">—</div></div>`).join('')}</div>
        <div class="st-btn"><button class="sbtn" id="replayB">${icon('repeat',13)}Replay</button><button class="sbtn" id="pauseB">${icon('timer',13)}<span>Pause</span></button><button class="sbtn sp" id="speedB">${S.speed}×</button></div></div>
      <div class="stage" id="stage">${stageSVG()}</div>
      <div class="seqbox" id="seqbox" hidden></div>
    </section>
    <section class="card stepper"><div class="sp-h"><b>IN THIS LESSON</b><span id="spN"></span></div><div class="sp-row" id="spRow"></div></section>`;
  $('#right').innerHTML=`
    <section class="card stepcard">
      <div class="sc-h"><span id="scN"></span><span class="kind" id="scK"></span></div>
      <h2 id="scT"></h2>
      <div class="sc-b" id="scB"></div>
      <div id="scTip"></div>
      <div class="sc-ch" id="scCh"></div>
      <div class="sc-nav"><button class="btn" id="backB">← Back</button><button class="btn pri" id="nextB"><span id="nextL"></span><span>→</span></button></div>
      <div class="keys"><kbd>←</kbd><kbd>→</kbd> step · <kbd>R</kbd> replay · <kbd>Space</kbd> pause</div>
    </section>
    <section class="card learn"><div class="lt">YOU'LL LEARN</div><ul id="learn">${L.learn.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></section>
    <section class="card srccard"><div class="lt">${icon('book',12)} READ MORE · PAPERS &amp; SOURCES</div><p class="srcnote">The full story lives here: standards, textbooks, practitioner guides and the best explainers.</p>${sourcesHTML(L)}</section>`;
  $('#spRow').innerHTML=L.steps.map((s,i)=>`<button data-i="${i}" title="${esc(s.t)}"><span class="n">${i+1}</span><span class="t">${esc(s.short||s.t)}</span></button>`).join('');
  $('#spRow').onclick=e=>{const b=e.target.closest('button');if(b)go(L.id,+b.dataset.i)};
  const nx=next(L.id);
  $('#backB').onclick=()=>{if(S.si>0)go(L.id,S.si-1)};
  $('#nextB').onclick=()=>{if(S.si<L.steps.length-1)go(L.id,S.si+1);else if(nx)go(nx.id,0)};
  $('#replayB').onclick=replay;$('#pauseB').onclick=togglePause;
  $('#speedB').onclick=()=>{S.speed=S.speed===1?0.5:S.speed===0.5?2:1;$('#speedB').textContent=S.speed+'×'};
}
function ensureSetup(L){if(!L._ready){L._ready=1;if(L.setup)L.setup.call(L)}}
function drawStatic(L,si){
  ensureSetup(L);
  let s='';try{s=L.draw?L.draw.call(L,si,g):''}catch(e){console.error(L.id,si,e);s=g.T(20,30,'draw error: '+e.message,{c:'red'})}
  $('#ls').innerHTML=`<g class="sx">${s}</g>`;$('#la').innerHTML='';
}
function renderStep(){
  const L=S.lesson,si=S.si,step=L.steps[si];
  drawStatic(L,si);stepClock=0;S.ord=-1;
  // metrics accumulate across steps
  const m={};for(let i=0;i<=si;i++)Object.assign(m,L.steps[i].m||{});
  L.met.forEach(([k])=>{const el=$(`.metric[data-k="${k}"]`);if(!el)return;const v=m[k];const txt=v==null?'—':String(v);const mv=el.querySelector('.mv');mv.title=txt;
    if(mv.textContent!==txt){mv.textContent=txt;if(txt!=='—'){el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash')}}});
  // narration list
  const box=$('#seqbox');const n=step.n||[];
  box.innerHTML=n.length?`<div class="sb-h">${icon('play',11)} WHAT'S HAPPENING</div><ol>${n.map((t,i)=>`<li data-ord="${i}"><i class="n">${i+1}</i><span><b>${t}</b></span></li>`).join('')}</ol>`:'';
  box.hidden=!n.length;
  const K=KINDS[step.k]||KINDS.setup;
  $('#scN').textContent=`STEP ${si+1} / ${L.steps.length}`;
  const kd=$('#scK');kd.textContent=K[0].toUpperCase();kd.className='kind c-'+K[1];
  $('#scT').textContent=step.t;
  $('#scB').innerHTML=(step.b||'').split(/\n\n/).map(p=>`<p>${p}</p>`).join('');
  $('#scTip').innerHTML=step.tip?`<div class="tip">${icon('bolt',14)}<div><b>${esc(step.tip[0])}</b><span>${step.tip[1]}</span></div></div>`:'';
  $('#scCh').innerHTML=step.ch&&step.ch.length?`<div class="lt">KEY POINTS</div><ul>${step.ch.map(c=>{const t=c[0]==='-'?'minus':c[0]==='!'?'warn':'plus';return `<li class="${t}"><span>${t==='minus'?'−':t==='warn'?'!':'+'}</span>${c.replace(/^[-+!]\s*/,'')}</li>`}).join('')}</ul>`:'';
  $('#backB').disabled=si===0;
  const nx=next(L.id);
  $('#nextL').textContent=si<L.steps.length-1?`Next: ${L.steps[si+1].short||L.steps[si+1].t}`:nx?`Next lesson: ${nx.title}`:'Course complete';
  $('#nextB').disabled=si===L.steps.length-1&&!nx;
  $$('#spRow button').forEach((b,i)=>{b.classList.toggle('on',i===si);b.classList.toggle('done',i<si)});
  $('#spN').textContent=`Step ${si+1} of ${L.steps.length}`;
  $('#spRow').style.setProperty('--p',(si/(Math.max(1,L.steps.length-1)))*100+'%');
  const nl=L.learn.length;$$('#learn li').forEach((li,i)=>li.classList.toggle('ok',si>=Math.round((i+1)*L.steps.length/nl)-1));
  if(si===L.steps.length-1){const d=doneSet();if(!d.has(L.id)){d.add(L.id);store.set('cf-done',[...d]);buildTree()}}
}

/* ------------------------------------------------------------------ animation loop */
const ITEM=2.4; // seconds per narration item
function loop(now){
  const dt=Math.min(64,now-lastNow);lastNow=now;
  if(!S.paused){clock+=dt*S.speed;stepClock+=dt*S.speed}
  const L=S.home?LESSONS[S.homeId]:S.lesson,si=S.home?S.homeSi:S.si;
  const la=$('#la');
  if(L&&la&&si!=null){
    const step=L.steps[si],n=(step.n||[]).length,t=stepClock/1000;
    let ord=-1,k=0;
    if(n){const cyc=n*ITEM+1.2,tt=t%cyc;ord=Math.min(n-1,Math.floor(tt/ITEM));k=tt>=n*ITEM?1:(tt-ord*ITEM)/ITEM;
      if(ord!==S.ord){S.ord=ord;$$('#seqbox li[data-ord]').forEach(li=>{const o=+li.dataset.ord;li.classList.toggle('on',o===ord);li.classList.toggle('done',o<ord)})}}
    if(L.anim){try{la.innerHTML=L.anim.call(L,si,t,g,ord,k)||''}catch(e){la.innerHTML='';if(!L._ae){L._ae=1;console.error(L.id,e)}}}
  }
  if(S.home&&!S.paused){S.homeT=(S.homeT||0)+dt;if(S.homeT>7000&&!S.homeHover){S.homeT=0;homeCycle()}}
  requestAnimationFrame(loop);
}
function replay(){stepClock=0;S.ord=-1;if(S.paused)togglePause();if(S.lesson)drawStatic(S.lesson,S.si)}
function togglePause(){S.paused=!S.paused;const b=$('#pauseB span');if(b)b.textContent=S.paused?'Play':'Pause'}

/* ------------------------------------------------------------------ cheatsheet */
function cheatView(){
  $('#right').innerHTML='';
  $('#center').innerHTML=`<section class="card lhead"><div class="crumbs">Reference</div><h1>Cheatsheet</h1><p class="sub">The key ideas and formulas from every lesson on one page, with the books and guides to read next.</p></section>`+
    MODULES.map(m=>`<section class="card cheat"><h3>${folderSVG(m.c)}${m.num}. ${m.title}</h3><div class="cgrid">${m.lessons.map(id=>LESSONS[id]).filter(Boolean).map(L=>`<div class="cl"><a class="clt" href="#/${L.id}/1">${esc(L.title)}</a><ul>${(L.cheat||L.learn).map(t=>`<li>${t}</li>`).join('')}</ul><div class="lt">READ MORE</div>${sourcesHTML(L,true)}</div>`).join('')}</div></section>`).join('');
}

/* ------------------------------------------------------------------ landing page */
function homeView(){
  const done=doneSet(),last=store.get('cf-last',null),first=ORDER[0].id;
  const total=ORDER.reduce((a,o)=>a+(LESSONS[o.id]?LESSONS[o.id].steps.length:0),0);
  const papers=new Set();ORDER.forEach(o=>sources({id:o.id}).forEach(s=>papers.add(s[1])));
  $('#center').innerHTML='';$('#right').innerHTML='';
  $('#home').innerHTML=`
    <div class="h-stage" id="stage">${stageSVG()}</div>
    <div class="h-hero">
      <div class="h-bar">${MODULES.map((m,i)=>`<i style="background:var(--${m.c});animation-delay:${(i*0.07).toFixed(2)}s"></i>`).join('')}</div>
      <div class="h-kick">Corporate finance · ${MODULES.length} modules · ${ORDER.length} lessons · ${total} animated steps · ${papers.size} sources</div>
      <h1 class="h-title">Deal <mark>Room</mark>, corporate finance step by step</h1>
      <p class="h-tag">Follow one fictional company, Kopi Kita Corp, from its three statements to a DCF, an acquisition, a leveraged buyout and an IPO. Every number on screen is computed live from the same model, every concept is drawn and animated, and every lesson links to standards, textbooks and practitioner guides for the full reading.</p>
      <div class="h-btns">
        <button class="btn pri" id="startB">${icon('play',13)}<span>Start from lesson 1</span></button>
        <button class="btn" id="llmB">${icon('trend',13)}<span>Jump to DCF</span></button>
        ${last&&LESSONS[last]&&last!==first?`<button class="btn" id="contB">${icon('repeat',13)}<span>Continue: ${esc(LESSONS[last].title)}</span></button>`:''}
        <a class="btn" href="#/cheatsheet">${icon('doc',13)}<span>Cheatsheet</span></a>
      </div>
      <div class="h-prog"><i><b style="width:${done.size/ORDER.length*100}%"></b></i><span>${done.size} / ${ORDER.length} lessons completed</span></div>
      <div class="h-now"><i></i><span>Previewing</span><b id="nowT"></b><small id="nowM"></small></div>
    </div>
    <aside class="h-list" id="hlist">${MODULES.map(m=>`<div class="hm"><div class="hm-h">${folderSVG(m.c)}<span class="num">${m.num}</span><h3>${m.title}</h3><small>${m.lessons.filter(id=>done.has(id)).length}/${m.lessons.length}</small></div>${m.lessons.map((id,i)=>{const L=LESSONS[id];if(!L)return'';return `<button class="hr${done.has(id)?' done':''}" data-id="${id}" style="--tc:var(--${m.c})"><span class="n">${m.num}.${i+1}</span><span class="tx"><b>${esc(L.title)}</b><small>${esc(L.sub)}</small></span><span class="meta">${done.has(id)?icon('check',13):`${L.min}m`}</span></button>`}).join('')}</div>`).join('')}</aside>`;
  $('#startB').onclick=()=>go(first,0);
  $('#llmB').onclick=()=>go('dcf',0);
  if($('#contB'))$('#contB').onclick=()=>go(last,0);
  const list=$('#hlist');let tmr=null;
  list.addEventListener('mouseover',e=>{const b=e.target.closest('.hr');if(!b)return;S.homeHover=true;clearTimeout(tmr);tmr=setTimeout(()=>preview(b.dataset.id),140)});
  list.addEventListener('mouseleave',()=>{S.homeHover=false;S.homeT=0});
  list.addEventListener('focusin',e=>{const b=e.target.closest('.hr');if(b)preview(b.dataset.id)});
  list.addEventListener('click',e=>{const b=e.target.closest('.hr');if(b)go(b.dataset.id,0)});
  S.home=true;S.homeT=0;S.homeHover=false;
  preview(last&&LESSONS[last]?last:'dcf');
}
function preview(id){
  const L=LESSONS[id];if(!L||!$('#home .h-stage'))return;
  if(S.homeId===id)return;
  const si=L.hero!=null?L.hero:Math.floor((L.steps.length-1)/2);
  S.homeId=id;S.homeSi=si;stepClock=0;
  drawStatic(L,si);
  const M=meta(id);$('#nowT').textContent=L.title;$('#nowM').textContent=`${M.mod.num}.${M.index} · ${L.steps[si].t}`;
  $$('#hlist .hr').forEach(b=>b.classList.toggle('on',b.dataset.id===id));
}
function homeCycle(){const ids=ORDER.map(o=>o.id).filter(id=>LESSONS[id]);const i=ids.indexOf(S.homeId);preview(ids[(i+1)%ids.length]);const b=$(`#hlist .hr[data-id="${S.homeId}"]`);if(b&&!matchMedia('(max-width:900px)').matches)b.scrollIntoView({block:'nearest',behavior:'smooth'})}

/* ------------------------------------------------------------------ router */
function go(id,si){location.hash=`#/${id}/${si+1}`}
function route(){
  document.body.classList.remove('menu');
  const h=location.hash;
  const isHome=!h||h==='#'||h==='#/'||h.startsWith('#/home');
  const isCheat=h.startsWith('#/cheatsheet');
  const last=store.get('cf-last',null);
  $('#tabLearn').href=`#/${last&&LESSONS[last]?last:ORDER[0].id}/1`;
  $('#tabHome').classList.toggle('on',isHome);$('#tabCheat').classList.toggle('on',isCheat);$('#tabLearn').classList.toggle('on',!isHome&&!isCheat);
  document.body.classList.toggle('home',isHome);document.body.classList.toggle('wide',isCheat);
  S.home=isHome;S.homeId=null;
  if(isHome){S.lesson=null;buildTree();homeView();document.title='Deal Room · corporate finance, step by step · evilzeda';window.scrollTo(0,0);return}
  $('#home').innerHTML='';
  if(isCheat){S.lesson=null;buildTree();cheatView();document.title='Cheatsheet · Deal Room';window.scrollTo(0,0);return}
  const m=h.match(/^#\/([\w-]+)\/?(\d+)?/);
  const id=m&&LESSONS[m[1]]?m[1]:ORDER[0].id;
  const L=LESSONS[id];
  const si=m&&m[1]===id?Math.max(0,Math.min(L.steps.length-1,(+m[2]||1)-1)):0;
  if(!m||m[1]!==id)history.replaceState(null,'',`#/${id}/${si+1}`);
  store.set('cf-last',id);
  if(!S.lesson||S.lesson.id!==id){S.lesson=L;lessonView(L);buildTree();window.scrollTo(0,0)}
  S.si=si;document.title=`${L.title} · Deal Room`;
  renderStep();
}

/* ------------------------------------------------------------------ boot */
const ML={g,U,MODULES,LESSONS,add(L){LESSONS[L.id]=L},start(){
  shell();
  window.addEventListener('hashchange',route);
  document.addEventListener('keydown',e=>{
    if(e.ctrlKey&&e.key.toLowerCase()==='k'){e.preventDefault();$('#q').focus();return}
    if(e.target.matches('input,textarea'))return;
    const L=S.lesson;
    if(L&&e.key==='ArrowRight'){if(S.si<L.steps.length-1)go(L.id,S.si+1);else{const n=next(L.id);if(n)go(n.id,0)}}
    else if(L&&e.key==='ArrowLeft'&&S.si>0)go(L.id,S.si-1);
    else if(e.key===' '&&L){e.preventDefault();togglePause()}
    else if(e.key==='r'||e.key==='R')replay();
    else if(e.key==='t'||e.key==='T')$('#themeB').click();
  });
  route();requestAnimationFrame(loop);
}};
window.ML=ML;
})();
