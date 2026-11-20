/* System Design, step by step: course engine + isometric renderer.
   Lessons register themselves with SD.add({...}) from js/lessons-XX.js. */
(function(){
'use strict';

/* ------------------------------------------------------------------ catalog */
const MODULES = [
  {id:'foundations',num:'01',title:'Foundations',c:'brown',lessons:['request-lifecycle','latency-throughput','napkin-math']},
  {id:'scaling',num:'02',title:'Scaling',c:'green',lessons:['vertical-horizontal','load-balancing','stateless','caching','cdn']},
  {id:'data',num:'03',title:'Data & Storage',c:'purple',lessons:['sql-nosql','indexes','storage-engines','replication','sharding','consistent-hashing','unique-ids','cap','consensus','transactions','files']},
  {id:'communication',num:'04',title:'Communication',c:'orange',lessons:['apis','queues','pubsub','realtime']},
  {id:'reliability',num:'05',title:'Reliability',c:'blue',lessons:['redundancy','rate-limiting','timeouts-retries','observability']},
  {id:'architecture',num:'06',title:'Architecture',c:'yellow',lessons:['microservices','service-discovery','sagas','batch-stream']},
  {id:'security',num:'07',title:'Security',c:'red',lessons:['authentication','authorization','encryption']},
  {id:'shipping',num:'08',title:'Shipping',c:'pink',lessons:['testing','cicd']},
  {id:'design',num:'09',title:'Whole Systems',c:'gray',lessons:['hld-lld','design-url-shortener','design-news-feed','design-chat']}
];
const KINDS = {setup:['Setup','gray'],problem:['Problem','red'],solution:['Solution','green'],technique:['Technique','blue'],tradeoff:['Trade-off','yellow'],insight:['Insight','purple'],recap:['Recap','brown']};
const LESSONS = {};
const ORDER = [];
MODULES.forEach(m=>m.lessons.forEach((id,i)=>ORDER.push({id,mod:m,index:i+1,of:m.lessons.length})));

/* ------------------------------------------------------------------ icons (24x24, stroke) */
const IC = {
  server:'<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01M11 7.5h6M11 16.5h6"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  db:'<ellipse cx="12" cy="5.5" rx="8" ry="2.8"/><path d="M4 5.5v13c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8v-13M4 12c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8"/>',
  balancer:'<path d="M12 3v18M7 21h10M4 7h16M6 7l-3 6a3 3 0 0 0 6 0zM18 7l-3 6a3 3 0 0 0 6 0z"/>',
  bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 13.5a6.5 6.5 0 0 1 3.5 6.5"/>',
  lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M15 8l2 2"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  cloud:'<path d="M7 19h10a4.5 4.5 0 0 0 .6-8.96A6 6 0 0 0 6.1 9.6 4.7 4.7 0 0 0 7 19z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  file:'<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/>',
  chart:'<path d="M3 21h18M6 17v-5M11 17V7M16 17v-8M21 17V4"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  hash:'<path d="M5 9h15M4 15h15M10 3 8 21M16 3l-2 18"/>',
  box:'<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  code:'<path d="m8 7-5 5 5 5M16 7l5 5-5 5"/>',
  check:'<path d="m5 12 5 5 9-10"/>',
  alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  cpu:'<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  pin:'<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  git:'<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="8" r="2"/><path d="M6 7v10M18 10c0 4-6 3-12 7"/>',
  phone:'<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18h2"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  ring:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="4" r="1.6"/><circle cx="19" cy="15" r="1.6"/><circle cx="6" cy="17" r="1.6"/>',
  id:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16a3 3 0 0 1 6 0M15 10h3M15 14h3"/>',
  timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M10 2h4"/>',
  play:'<path d="M7 4v16l13-8z"/>',
  crown:'<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
  vote:'<path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="2"/>',
  filter:'<path d="M3 4h18l-7 9v6l-4 2v-8z"/>',
  stream:'<path d="M3 7c3 0 3 3 6 3s3-3 6-3 3 3 6 3M3 14c3 0 3 3 6 3s3-3 6-3 3 3 6 3"/>',
  test:'<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/>',
  rocket:'<path d="M5 19c0-3 1-5 3-6l3 3c-1 2-3 3-6 3z"/><path d="M9 13c2-6 6-10 12-10 0 6-4 10-10 12z"/><circle cx="15" cy="9" r="1.5"/>',
  msg:'<path d="M4 5h16v11H9l-5 4z"/>',
  feed:'<path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1.5"/>',
  img:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5-9 8"/>',
  scale:'<path d="M4 20 20 4M14 4h6v6M10 20H4v-6"/>',
  repeat:'<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>',
  wifi:'<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01"/>',
  dollar:'<path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l3 12h11l2-8H6"/>',
  doc:'<path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7M9 8h3"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  book:'<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3"/><path d="M20 4v14h-7"/>',
  home:'<path d="M3 11 12 3l9 8M5 10v10h14V10"/>'
};
const icon=(n,s=16,cls='')=>`<svg class="i ${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||IC.box}</svg>`;
const gIcon=(n,x,y,s=20,color='var(--ink)')=>`<g transform="translate(${x-s/2} ${y-s/2}) scale(${s/24})" fill="none" stroke="${color}" stroke-width="${1.9*24/s}" stroke-linecap="round" stroke-linejoin="round">${IC[n]||IC.box}</g>`;

/* ------------------------------------------------------------------ helpers */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const U=21, C30=0.866;
const P=(x,y,z=0)=>[(x-y)*U*C30,(x+y)*U*0.5-z*U];
const pts=a=>a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
const CH=0.62; // mono char width ratio
const TONE={req:'orange',res:'green',both:'gray',sync:'purple',fail:'red',off:'faint',data:'blue',warn:'yellow',pink:'pink'};

/* ------------------------------------------------------------------ public authoring helpers */
const H = {
  B:(x,y,c,g,l,o={})=>({t:'block',x,y,c,g,l,...o}),
  D:(x,y,l='you',o={})=>({t:'device',x,y,l,...o}),
  DB:(x,y,l='database',o={})=>({t:'db',x,y,l,c:'brown',...o}),
  CR:(x,y,n,l,o={})=>({t:'crowd',x,y,n,l,...o}),
  Q:(x,y,n,l,o={})=>({t:'queue',x,y,n,l,c:'purple',...o}),
  Z:(x,y,w,d,l,c='gray',o={})=>({t:'zone',x,y,w,d,l,c,...o}),
  G:(x,y,l,o={})=>({t:'ghost',x,y,l,...o}),
  E:(a,b,f='req',l,o={})=>({a,b,f,l,...o})
};

/* ------------------------------------------------------------------ geometry per node */
function nodeGeom(n){
  const w=n.w||(n.t==='device'?3.4:n.t==='db'?2.9:n.t==='ghost'?3:3), h=n.h!=null?n.h:(n.t==='db'?2.6:n.t==='device'?0.4:n.t==='zone'?0:2.6);
  return {w,h};
}
function nodeBox(n,st){
  // screen-space bbox of node (incl. labels/tags) for camera
  const {w,h}=nodeGeom(n);let hw=w/2,hd=(n.d||w)/2;
  if(n.t==='crowd'){hw=(n.w||5)/2;hd=(n.d||3.6)/2}
  if(n.t==='zone'){hw=n.w/2;hd=n.d/2}
  if(n.t==='queue'){const L=(Math.max(n.n,1))*1.1;hw=n.dir==='y'?.6:L/2;hd=n.dir==='y'?L/2:.6}
  const top=(n.z||0)+(n.t==='device'?2.6:n.t==='crowd'?1.6:n.t==='queue'?1:h)+((st&&st.tags&&st.tags.length)?1.6*st.tags.length+0.6:0)+((st&&st.cpu!=null&&st.cpu>=0)?1.6:0);
  const c=[P(n.x-hw,n.y-hd,top),P(n.x+hw,n.y-hd,top),P(n.x-hw,n.y+hd,0),P(n.x+hw,n.y+hd,0),P(n.x-hw,n.y+hd,top),P(n.x+hw,n.y-hd,0)];
  let x0=Math.min(...c.map(p=>p[0])),x1=Math.max(...c.map(p=>p[0])),y0=Math.min(...c.map(p=>p[1])),y1=Math.max(...c.map(p=>p[1]));
  if(n.t!=='block'&&n.t!=='ghost'&&n.t!=='zone')y1+=30; // label pill below
  return [x0-12,y0-14,x1+12,y1+10];
}
function anchorR(n){
  if(n.t==='crowd')return Math.max(n.w||5,n.d||3.6)*U*0.5;
  if(n.t==='queue')return 26;
  if(n.t==='db')return 34;
  if(n.t==='device')return 40;
  if(n.t==='zone')return 0;
  return (n.w||3)*U*0.62;
}

/* ------------------------------------------------------------------ node drawing */
function faceVars(c){return `--c:var(--${c||'gray'})`}
function cube(x,y,w,d,h,cls='',z=0){
  const hw=w/2,hd=d/2;
  const t=[P(x-hw,y-hd,z+h),P(x+hw,y-hd,z+h),P(x+hw,y+hd,z+h),P(x-hw,y+hd,z+h)];
  const l=[P(x-hw,y+hd,z),P(x+hw,y+hd,z),P(x+hw,y+hd,z+h),P(x-hw,y+hd,z+h)];
  const r=[P(x+hw,y-hd,z),P(x+hw,y+hd,z),P(x+hw,y+hd,z+h),P(x+hw,y-hd,z+h)];
  return `<polygon class="fl ${cls}" points="${pts(l)}"/><polygon class="fr ${cls}" points="${pts(r)}"/><polygon class="ft ${cls}" points="${pts(t)}"/>`;
}
function pill(x,y,text,tone='ink',ic){
  const fs=11,tw=String(text).length*fs*CH,iw=ic?15:0,w=tw+iw+16,h=20;
  return `<g class="pill p-${tone}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="6"/>${ic?gIcon(ic,-w/2+8+6,0,12,'currentColor'):''}<text x="${-w/2+8+iw+tw/2}" y="4" text-anchor="middle">${esc(text)}</text></g>`;
}
function meter(x,y,v){
  const w=86,h=20,pct=Math.round(v*100),tone=v<.7?'green':v<.9?'orange':'red';
  return `<g class="pill p-ink" transform="translate(${x} ${y})"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="6"/>${gIcon('cpu',-w/2+11,0,12,'var(--mute)')}<rect x="${-w/2+20}" y="-3" width="30" height="6" rx="3" class="mtrack"/><rect x="${-w/2+20}" y="-3" width="${Math.max(2,30*Math.min(1,v))}" height="6" rx="3" style="fill:var(--${tone})"/><text x="${w/2-8}" y="4" text-anchor="end">${pct}%</text></g>`;
}
function labelLines(l){return Array.isArray(l)?l:(l?String(l).split('\n'):[])}

function drawNode(n,st){
  st=st||{};
  const c=st.dead?'gray':(st.c||n.c||'gray');
  const L=st.l!=null?st.l:n.l;
  let s=`<g class="node${st.dead?' dead':''}${st.hot?' hot':''}${st.dim?' dim':''}" style="${faceVars(c)}">`;
  const {w,h}=nodeGeom(n);
  let topY;
  if(n.t==='block'||n.t==='ghost'){
    const d=n.d||w;
    if(n.t==='ghost'){
      const hw=w/2,hd=d/2;
      const t=[P(n.x-hw,n.y-hd,h),P(n.x+hw,n.y-hd,h),P(n.x+hw,n.y+hd,h),P(n.x-hw,n.y+hd,h)];
      const out=[P(n.x-hw,n.y-hd,h),P(n.x+hw,n.y-hd,h),P(n.x+hw,n.y-hd,0),P(n.x+hw,n.y+hd,0),P(n.x-hw,n.y+hd,0),P(n.x-hw,n.y+hd,h)];
      s+=`<polygon class="ghost" points="${pts(out)}"/><polyline class="ghost" points="${pts([t[3],t[2],t[1]])}"/><line class="ghost" x1="${t[2][0]}" y1="${t[2][1]}" x2="${P(n.x+hw,n.y+hd,0)[0]}" y2="${P(n.x+hw,n.y+hd,0)[1]}"/>`;
      const p=P(n.x+hw,n.y+hd,h*0.5);s+=`<text class="nl ghost-t" x="${p[0]}" y="${p[1]+4}" text-anchor="middle">${esc(L||'+')}</text>`;
    }else{
      const z0=n.z||0;
      s+=cube(n.x,n.y,w,d,h,'',z0);
      const lines=labelLines(L);
      const f=P(n.x+w/2,n.y+d/2,z0);
      const gy=P(n.x+w/2,n.y+d/2,z0+h)[1];
      const fh=f[1]-gy;
      const g=st.g||n.g;
      const big=w>=2.6;
      if(g){const tc=P(n.x,n.y,z0+h);s+=gIcon(g,tc[0],tc[1],big?22:16,'var(--edge)')}
      const ly=gy+Math.min(fh*0.42,24)-(lines.length-1)*5-(n.s&&big?4:0)+(lines.length===1?4:0);
      lines.forEach((t,i)=>{s+=`<text class="nl${big?'':' sm'}" x="${f[0]}" y="${ly+i*14+4}" text-anchor="middle">${esc(t)}</text>`});
      if(n.s&&big)s+=`<text class="ns" x="${f[0]}" y="${ly+lines.length*14+3}" text-anchor="middle">${esc(n.s)}</text>`;
      if(st.dead){const p=P(n.x,n.y,z0+h);s+=gIcon('x',p[0],p[1],22,'var(--red)')}
    }
    topY=P(n.x,n.y,(n.z||0)+h)[1]-(w*U*0.5)/1.0+6;
  }
  else if(n.t==='db'){
    const r=w/2,rx=r*U*1.2247,ry=r*U*0.7071,[cx,by]=P(n.x,n.y,0),ty=P(n.x,n.y,h)[1];
    s+=`<path class="fr" d="M${cx-rx},${ty} L${cx-rx},${by} A${rx},${ry} 0 0 0 ${cx+rx},${by} L${cx+rx},${ty} Z"/>`;
    s+=`<path class="fl" d="M${cx-rx},${ty} L${cx-rx},${by} A${rx},${ry} 0 0 0 ${cx},${by+ry} L${cx},${ty+ry} A${rx},${ry} 0 0 1 ${cx-rx},${ty} Z"/>`;
    [0.36,0.68].forEach(k=>{const yy=by-(by-ty)*k;s+=`<path class="band" d="M${cx-rx},${yy} A${rx},${ry} 0 0 0 ${cx+rx},${yy}"/>`});
    s+=`<ellipse class="ft" cx="${cx}" cy="${ty}" rx="${rx}" ry="${ry}"/>`;
    s+=gIcon(st.g||n.g||'db',cx,ty,16,'var(--edge)');
    if(st.dead)s+=gIcon('x',cx,ty+(by-ty)/2,22,'var(--red)');
    s+=pill(cx,by+ry+16,L||'database','ink',null);
    topY=ty-ry-4;
  }
  else if(n.t==='device'){
    const x=n.x,y=n.y;
    s+=cube(x,y,3.4,2.6,0.38,'dev');
    const sc=[P(x-1.5,y-1.05,0.38),P(x+1.5,y-1.05,0.38),P(x+1.5,y-1.55,2.5),P(x-1.5,y-1.55,2.5)];
    s+=`<polygon class="scr" points="${pts(sc)}"/>`;
    const inner=[P(x-1.25,y-1.1,0.65),P(x+1.25,y-1.1,0.65),P(x+1.25,y-1.48,2.25),P(x-1.25,y-1.48,2.25)];
    s+=`<polygon class="scr-in" points="${pts(inner)}"/>`;
    const bar=(z1,z2,a,b)=>[P(x+a,y-1.1-(z1-.65)*0.24,z1),P(x+b,y-1.1-(z1-.65)*0.24,z1),P(x+b,y-1.1-(z2-.65)*0.24,z2),P(x+a,y-1.1-(z2-.65)*0.24,z2)];
    s+=`<polygon class="scr-bar" points="${pts(bar(1.75,2.05,-1.0,1.0))}"/><polygon class="scr-bar2" points="${pts(bar(1.2,1.45,-1.0,0.3))}"/>`;
    const p=P(x+1.7,y+1.3,0);s+=pill(P(x,y,0)[0],p[1]+18,L||'you','ink','user');
    topY=P(x,y-1.5,2.5)[1]-6;
  }
  else if(n.t==='crowd'){
    const W=n.w||5,D=n.d||3.6;s+=cube(n.x,n.y,W,D,0.3,'plat');
    const cnt=Math.min(n.n||6,24),cols=Math.ceil(Math.sqrt(cnt*W/D)),rows=Math.ceil(cnt/cols);
    const pal=['blue','green','orange','purple','pink','yellow','red','brown'];
    const people=[];
    for(let i=0;i<cnt;i++){const cx=n.x-W/2+W*(i%cols+0.5)/cols,cy=n.y-D/2+D*(Math.floor(i/cols)+0.5)/rows;people.push([cx,cy,pal[(i*5+3)%pal.length]])}
    people.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1])).forEach(([cx,cy,col])=>{const [px,py]=P(cx,cy,0.3);
      s+=`<rect x="${px-5}" y="${py-17}" width="10" height="15" rx="5" style="fill:var(--${col})" class="pp"/><circle cx="${px}" cy="${py-21}" r="4.2" class="ph"/>`});
    const p=P(n.x+W/2,n.y+D/2,0);s+=pill(P(n.x,n.y,0)[0],p[1]+16,L||'users','ink','users');
    topY=P(n.x,n.y,1.6)[1]-(D*U*0.25);
  }
  else if(n.t==='queue'){
    const k=Math.max(0,st.n!=null?st.n:n.n),dir=n.dir||'x',cap=n.cap||k;
    const len=Math.max(cap,k,1)*1.1;
    // tray
    const tw=dir==='y'?1.3:len+0.3,td=dir==='y'?len+0.3:1.3;
    s+=cube(n.x,n.y,tw,td,0.15,'plat');
    const items=[];
    for(let i=0;i<Math.min(k,30);i++){const off=-len/2+0.55+i*1.1;items.push(dir==='y'?[n.x,n.y+off]:[n.x+off,n.y])}
    items.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1])).forEach(([qx,qy])=>{s+=`<g style="--c:var(--${st.c||n.c||'purple'})">${cube(qx,qy,0.85,0.85,0.85,'',0.15)}</g>`});
    const p=P(n.x,n.y,0),pb=P(n.x+tw/2,n.y+td/2,0);
    s+=pill(p[0],pb[1]+16,(L||'queue')+(n.count!==false&&k?` · ${st.nl||k}`:''),'ink','list');
    topY=P(n.x,n.y,1.2)[1]-10;
  }
  else if(n.t==='zone'){
    const hw=n.w/2,hd=n.d/2,c4=[P(n.x-hw,n.y-hd),P(n.x+hw,n.y-hd),P(n.x+hw,n.y+hd),P(n.x-hw,n.y+hd)];
    s=`<g class="zone" style="${faceVars(n.c)}">`;
    if(n.round){const [cx,cy]=P(n.x,n.y);s+=`<ellipse class="ring" cx="${cx}" cy="${cy}" rx="${hw*U*1.2247}" ry="${hw*U*0.7071}"/>`;s+=`<text x="${cx}" y="${cy+4}" text-anchor="middle" class="zt">${esc(L||'')}</text></g>`;return s}
    s+=`<polygon points="${pts(c4)}"/>`;
    const lp=P(n.x-hw,n.y+hd);s+=`<text x="${lp[0]+8}" y="${lp[1]-8}" class="zt">${esc(L||'')}</text>`;
    return s+'</g>';
  }
  // tags/meters above
  let yy=topY-14;
  const [ax]=P(n.x,n.y,0);
  if(st.cpu!=null&&st.cpu>=0){s+=meter(ax,yy,st.cpu);yy-=24}
  (st.tags||[]).forEach(tg=>{const [t,tone,ic]=Array.isArray(tg)?tg:[tg,'ink'];s+=pill(ax,yy,t,tone||'ink',ic);yy-=24});
  return s+'</g>';
}

/* ------------------------------------------------------------------ app state */
const S={home:false,seq:[],lesson:null,si:0,speed:1,paused:false,t0:0,tPause:0,edges:[],vb:null,vbTarget:null,prevVis:new Set()};

/* ------------------------------------------------------------------ layout */
function shell(){
  document.body.innerHTML=`
  <header class="top">
    <button class="tb menu-b" id="menuB" aria-label="Lessons">${icon('list',18)}</button>
    <a class="brand" href="#/"><span class="logo">${icon('layers',18)}</span><span>System <mark>Design</mark></span></a>
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
  setTheme(store.get('sd-theme',matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
}
function setTheme(t){document.documentElement.dataset.theme=t;store.set('sd-theme',t);const b=$('#themeB');if(b)b.innerHTML=t==='dark'?icon('bolt',16):icon('eye',16)}

function doneSet(){return new Set(store.get('sd-done',[]))}
function buildTree(){
  const q=($('#q')?.value||'').trim().toLowerCase();
  const done=doneSet(),cur=S.lesson&&S.lesson.id;
  const open=store.get('sd-open',{});
  let html='';
  MODULES.forEach(m=>{
    const ls=m.lessons.map(id=>LESSONS[id]).filter(Boolean).filter(L=>!q||(L.title+' '+L.sub+' '+(L.keys||'')).toLowerCase().includes(q));
    if(q&&!ls.length)return;
    const has=m.lessons.includes(cur),isOpen=q||has||open[m.id];
    const nd=m.lessons.filter(id=>done.has(id)).length;
    html+=`<div class="mod${isOpen?' open':''}" data-m="${m.id}"><button class="mod-h"><span class="car">›</span><svg class="folder" style="--c:var(--${m.c})" width="18" height="15" viewBox="0 0 20 16"><path d="M1.2 3.2A2 2 0 0 1 3.2 1.2h4.1l2 2.2h7.5a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H3.2a2 2 0 0 1-2-2Z"/><path class="lip" d="M1.2 6.2h17.6"/></svg><span class="mt">${m.num}. ${m.title}</span><small>${nd}/${m.lessons.length}</small></button><div class="mod-l">`;
    ls.forEach(L=>{html+=`<a href="#/${L.id}/1" class="${L.id===cur?'on':''}${done.has(L.id)?' done':''}"><span class="ck">${done.has(L.id)?icon('check',11):''}</span>${esc(L.title)}</a>`});
    html+='</div></div>';
  });
  $('#tree').innerHTML=html||'<p class="empty">No lessons match.</p>';
  $$('.mod-h').forEach(b=>b.onclick=()=>{const m=b.parentElement;m.classList.toggle('open');const o=store.get('sd-open',{});o[m.dataset.m]=m.classList.contains('open');store.set('sd-open',o)});
  $('#progN').textContent=`${done.size} / ${ORDER.length}`;
  $('#progBar').style.width=done.size/ORDER.length*100+'%';
}

/* ------------------------------------------------------------------ shared stage */
function stageSVG(){return `<svg id="scene" preserveAspectRatio="xMidYMid meet"><defs>
  <pattern id="isog" width="${(U*C30*2).toFixed(2)}" height="${U}" patternUnits="userSpaceOnUse"><path d="M0 ${U/2} L${(U*C30).toFixed(2)} 0 L${(U*C30*2).toFixed(2)} ${U/2} L${(U*C30).toFixed(2)} ${U} Z" class="gridp"/></pattern>
  ${['orange','green','gray','purple','red','faint','blue','yellow','pink'].map(t=>`<marker id="ah-${t}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M1 1 9 5 1 9z" class="ah" style="fill:var(--${t==='faint'?'faint':t==='gray'?'edge':t})"/></marker>`).join('')}
  </defs><rect id="gridR" fill="url(#isog)"/><g id="lz"></g><g id="le"></g><g id="ln"></g><g id="lo"></g><g id="lp"></g></svg>`}

/* ------------------------------------------------------------------ sources */
const host=u=>{try{return new URL(u).hostname.replace(/^www\./,'')}catch(e){return ''}};
function sources(L){return [['Original lesson (designed-to-scale)',`https://designed-to-scale.vercel.app/#/${L.id}/1`,'Dilum Sanjaya · interactive'],...((SD.src&&SD.src[L.id])||[])]}
function sourcesHTML(L,compact){return `<ul class="srcs${compact?' compact':''}">${sources(L).map(([t,u,by])=>`<li><a href="${u}" target="_blank" rel="noopener" title="${esc(u)}">${compact?'':icon('link',13)}<span><b>${esc(t)}</b>${compact?'':`<small>${esc(by||host(u))}</small>`}</span>${icon('arrow',12,'ext')}</a></li>`).join('')}</ul>`}

/* ------------------------------------------------------------------ lesson view */
function meta(id){return ORDER.find(o=>o.id===id)}
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
      <div class="st-top"><div class="metrics" id="metrics">${L.met.map(([k,l,ic])=>`<div class="metric${k===L.sum?' tot':''}" data-k="${k}"><div class="ml">${icon(ic||'chart',12)}${esc(l)}</div><div class="mv">—</div></div>`).join('')}</div>
        <div class="st-btn"><button class="sbtn" id="replayB">${icon('repeat',13)}Replay</button><button class="sbtn" id="pauseB">${icon('timer',13)}<span>Pause</span></button><button class="sbtn sp" id="speedB">${S.speed}×</button></div></div>
      <div class="stage" id="stage">${stageSVG()}<div class="seqbox" id="seqbox"></div></div>
      <div class="legend"><span><i class="dot d-orange"></i>request</span><span><i class="dot d-green"></i>response</span><span><i class="dot d-purple"></i>sync / handshake</span><span><i class="dot d-red"></i>failure</span><span><i class="badge">1</i><i class="badge">2</i>order of events</span></div>
    </section>
    <section class="card stepper"><div class="sp-h"><b>IN THIS LESSON</b><span id="spN"></span></div><div class="sp-row" id="spRow"></div></section>`;
  const nx=next(L.id);
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
    <section class="card srccard"><div class="lt">${icon('book',12)} READ MORE · SOURCES</div><p class="srcnote">Want the detailed explanation? These go deeper than this lesson.</p>${sourcesHTML(L)}</section>`;
  $('#spRow').innerHTML=L.steps.map((s,i)=>`<button data-i="${i}" title="${esc(s.t)}"><span class="n">${i+1}</span><span class="t">${esc(s.short||s.t)}</span></button>`).join('');
  $('#spRow').onclick=e=>{const b=e.target.closest('button');if(b)go(L.id,+b.dataset.i)};
  $('#backB').onclick=()=>{if(S.si>0)go(L.id,S.si-1)};
  $('#nextB').onclick=()=>{if(S.si<L.steps.length-1)go(L.id,S.si+1);else if(nx)go(nx.id,0)};
  $('#replayB').onclick=replay;$('#pauseB').onclick=togglePause;
  $('#speedB').onclick=()=>{S.speed=S.speed===1?0.5:S.speed===0.5?2:1;$('#speedB').textContent=S.speed+'×'};
  S.vb=null;S.prevVis=new Set();
}
function next(id){const i=ORDER.findIndex(o=>o.id===id);for(let k=i+1;k<ORDER.length;k++)if(LESSONS[ORDER[k].id])return LESSONS[ORDER[k].id];return null}

/* accumulate state up to step i */
function accum(L,si){
  const vis=new Set(),st={},m={};
  for(let i=0;i<=si;i++){const s=L.steps[i];
    (s.v||'').split(/\s+/).filter(Boolean).forEach(id=>vis.add(id));
    (s.h||'').split(/\s+/).filter(Boolean).forEach(id=>vis.delete(id));
    if(s.s)for(const id in s.s){st[id]=Object.assign(st[id]||{},s.s[id]);if(s.s[id]===null)delete st[id]}
    Object.assign(m,s.m||{});
  }
  return {vis,st,m};
}
const nameOf=(n,st)=>{const l=st&&st.l!=null?st.l:n.l;return labelLines(l).join(' ')||'node'};
function badge(x,y,n){return `<g class="badge-g" data-ord="${n}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="9"/><text y="3.8" text-anchor="middle">${n}</text></g>`}

/* draw nodes, edges, panels, camera for (lesson, step) into the current #stage */
function drawScene(L,si,opt={}){
  const step=L.steps[si];
  const {vis,st,m}=accum(L,si);
  const ids=Object.keys(L.nodes).filter(id=>vis.has(id));
  const zones=ids.filter(id=>L.nodes[id].t==='zone'),solids=ids.filter(id=>L.nodes[id].t!=='zone');
  solids.sort((a,b)=>{const A=L.nodes[a],B=L.nodes[b];return ((A.z||0)-(B.z||0))||((A.x+A.y)-(B.x+B.y))||(A.x-B.x)});
  $('#lz').innerHTML=zones.map(id=>`<g data-id="${id}" class="nwrap${S.prevVis.has(id)?'':' enter'}">${drawNode(L.nodes[id],st[id])}</g>`).join('');
  $('#ln').innerHTML=solids.map(id=>`<g data-id="${id}" class="nwrap${S.prevVis.has(id)?'':' enter'}">${drawNode(L.nodes[id],st[id])}</g>`).join('');
  S.prevVis=vis;
  // ---- edges: classify into ordered sequence vs continuous streams
  const raw=(step.e||[]).map((e,ix)=>({e,ix})).filter(o=>L.nodes[o.e.a]&&L.nodes[o.e.b]);
  const animated=raw.filter(o=>(o.e.f||'req')!=='off');
  const isStream=o=>step.par||(o.e.dots||0)>=3;
  const seqList=animated.filter(o=>!isStream(o));
  const showNums=seqList.length>=2;
  S.edges=[];S.seq=[];let eh='',oh='',bh='';
  raw.forEach(({e,ix})=>{
    const A=L.nodes[e.a],B=L.nodes[e.b];
    let wp=[[A.x,A.y]];
    if(e.via)e.via.forEach(p=>wp.push(p));else if(e.r==='L')wp.push([B.x,A.y]);else if(e.r==='L2')wp.push([A.x,B.y]);
    wp.push([B.x,B.y]);
    let sp=wp.map(p=>P(p[0],p[1],0));
    const sh=(pa,pb,r)=>{const dx=pb[0]-pa[0],dy=pb[1]-pa[1],d=Math.hypot(dx,dy)||1;r=Math.min(r,d*0.45);return [pa[0]+dx/d*r,pa[1]+dy/d*r]};
    sp[0]=sh(sp[0],sp[1],anchorR(A)+(e.ga||0));const n=sp.length;sp[n-1]=sh(sp[n-1],sp[n-2],anchorR(B)+(e.gb||0));
    const f=e.f||'req',tone=e.tone||TONE[f]||'gray';
    const heads=e.heads||(f==='res'?'start':f==='both'||f==='sync'?'both':f==='off'?(e.arrow?'end':'none'):'end');
    const mk=`url(#ah-${tone})`;
    const o=seqList.findIndex(q=>q.ix===ix);
    eh+=`<polyline data-ix="${ix}" class="edge e-${f}${o>=0&&showNums?' seq':''}" style="stroke:var(--${tone==='gray'?'edge':tone})" points="${pts(sp)}" ${heads==='end'||heads==='both'?`marker-end="${mk}"`:''} ${heads==='start'||heads==='both'?`marker-start="${mk}"`:''}/>`;
    let len=0;const segs=[];for(let i=1;i<n;i++){const d=Math.hypot(sp[i][0]-sp[i-1][0],sp[i][1]-sp[i-1][1]);segs.push(d);len+=d}
    const at=k=>{let d=k*len;for(let i=0;i<segs.length;i++){if(d<=segs[i]||i===segs.length-1){const t=segs[i]?d/segs[i]:0;return [sp[i][0]+(sp[i+1][0]-sp[i][0])*t,sp[i][1]+(sp[i+1][1]-sp[i][1])*t]}d-=segs[i]}};
    const lp=at(e.lp!=null?e.lp:0.5),lx=lp[0]+(e.lx||0),ly=lp[1]+(e.ly||0);
    if(e.l)oh+=pill(lx,ly,e.l,e.lt||(f==='off'?'ink':tone==='gray'||tone==='faint'?'ink':tone),e.li);
    if(o>=0&&showNums){const w=e.l?String(e.l).length*11*CH+(e.li?15:0)+16:0;bh+=badge(e.l?lx-w/2-6:lx,e.l?ly-9:ly,o+1)}
    if(f!=='off'){
      const E={at,len,f,tone,ix,dots:e.dots||(f==='both'?1:2),a:e.a,b:e.b};
      if(o>=0){const base=Math.max(1.05,len/165);E.dur=(f==='both'||f==='sync')?base*2:f==='fail'?base*1.1:base;E.ord=o;S.seq.push(E)}else S.edges.push(E);
    }
  });
  $('#le').innerHTML=eh;
  // ---- panels
  (step.p||[]).forEach(p=>{
    let [x,y]=p.at?P(L.nodes[p.at].x,L.nodes[p.at].y,0):P(p.x||0,p.y||0,0);x+=p.dx||0;y+=p.dy||0;
    const lines=p.lines||[],fs=11,w=Math.max((p.title||'').length*11.5*CH,...lines.map(l=>l.length*fs*CH))+26,h=34+lines.length*16;
    oh+=`<g class="panel p-${p.c||'ink'}" transform="translate(${x-w/2} ${y-h/2})"><rect width="${w}" height="${h}" rx="9"/><text x="13" y="20" class="pt">${esc(p.title||'')}</text>${lines.map((l,i)=>`<text x="13" y="${40+i*16}" class="pl${/^\s*(total|=)/i.test(l)?' b':''}">${esc(l)}</text>`).join('')}</g>`;
  });
  $('#lo').innerHTML=oh+bh;$('#lp').innerHTML='';
  S.seqT=S.seq.reduce((a,E)=>a+E.dur,0)+(S.seq.length?0.7:0);S.seqActive=-1;S.clock0=clock;
  // ---- "what's happening" list
  const box=$('#seqbox');
  if(box){
    const lines=[];
    const nm=id=>esc(nameOf(L.nodes[id],st[id]));
    const arrow=f=>f==='both'||f==='sync'?'⇄':'→';
    const flow=(e,f)=>f==='res'?`${nm(e.b)} → ${nm(e.a)}`:`${nm(e.a)} ${arrow(f)} ${nm(e.b)}`;
    seqList.forEach((q,i)=>{const e=q.e,f=e.f||'req';lines.push(`<li data-ord="${i}" class="t-${f}"><i class="n">${showNums?i+1:'•'}</i><span><b>${flow(e,f)}</b>${e.l?`<em>${esc(e.l)}</em>`:''}${f==='fail'?'<em class="x">✕ fails</em>':''}</span></li>`)});
    animated.filter(isStream).forEach(q=>{const e=q.e,f=e.f||'req';lines.push(`<li class="stream t-${f}"><i class="n">${step.par?'∥':'∿'}</i><span><b>${flow(e,f)}</b><em>${e.l?esc(e.l)+' · ':''}${step.par?'at the same time':'continuous traffic'}</em></span></li>`)});
    box.innerHTML=lines.length?`<div class="sb-h">${icon('play',11)} WHAT'S HAPPENING</div><ol>${lines.join('')}</ol>`:'';
    box.hidden=!lines.length;
  }
  // ---- camera
  let bb=[1e9,1e9,-1e9,-1e9];
  const grow=b=>{bb=[Math.min(bb[0],b[0]),Math.min(bb[1],b[1]),Math.max(bb[2],b[2]),Math.max(bb[3],b[3])]};
  ids.forEach(id=>grow(nodeBox(L.nodes[id],st[id])));
  $$('#lo .panel, #lo .pill').forEach(g=>{try{const b=g.getBBox(),mm=g.transform.baseVal.consolidate();const tx=mm?mm.matrix.e:0,ty=mm?mm.matrix.f:0;grow([tx+b.x-6,ty+b.y-6,tx+b.x+b.width+6,ty+b.y+b.height+6])}catch(e){}});
  if(bb[0]>bb[2])bb=[-300,-200,300,200];
  const pad=28;let vb=[bb[0]-pad,bb[1]-pad,bb[2]-bb[0]+pad*2,bb[3]-bb[1]+pad*2];
  // fit into the free region of the stage (insets in px), then expand to the whole stage
  const stg=$('#stage'),W=Math.max(1,stg.clientWidth),Hh=Math.max(1,stg.clientHeight);
  let ins=opt.region?opt.region():{l:0,r:0,t:0,b:0};
  if(box&&!box.hidden&&getComputedStyle(box).position==='absolute'){ins.b=Math.max(ins.b,box.offsetHeight+14)}
  const rw=Math.max(80,W-ins.l-ins.r),rh=Math.max(80,Hh-ins.t-ins.b),ar=rw/rh;
  if(vb[2]/vb[3]<ar){const nw=vb[3]*ar;vb[0]-=(nw-vb[2])/2;vb[2]=nw}else{const nh=vb[2]/ar;vb[1]-=(nh-vb[3])/2;vb[3]=nh}
  const minW=(opt.minW||780)*rw/Math.max(rw,W*0.75);if(vb[2]<minW){const k=minW/vb[2];vb=[vb[0]-(vb[2]*k-vb[2])/2,vb[1]-(vb[3]*k-vb[3])/2,vb[2]*k,vb[3]*k]}
  const sc=vb[2]/rw;vb=[vb[0]-ins.l*sc,vb[1]-ins.t*sc,W*sc,Hh*sc];
  S.vbTarget=vb;if(!S.vb)S.vb=vb.slice();
  return {m,step};
}

function renderStep(){
  const L=S.lesson,si=S.si;
  const {m,step}=drawScene(L,si);
  // ---- metrics
  let sum=0;
  L.met.forEach(([k,l,ic,unit])=>{
    const el=$(`.metric[data-k="${k}"]`);if(!el)return;let v;
    if(k===L.sum){v=sum?sum:undefined}else{v=m[k];if(typeof v==='number'&&L.sum)sum+=v}
    const txt=v==null?'—':typeof v==='number'?`${v.toLocaleString()} ${unit||L.unit||''}`.trim():String(v);
    const mv=el.querySelector('.mv');mv.title=txt;
    if(mv.textContent!==txt){mv.textContent=txt;if(txt!=='—'){el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash')}}
  });
  // ---- step panel
  const K=KINDS[step.k]||KINDS.setup;
  $('#scN').textContent=`STEP ${si+1} / ${L.steps.length}`;
  const kd=$('#scK');kd.textContent=K[0].toUpperCase();kd.className='kind c-'+K[1];
  $('#scT').textContent=step.t;
  $('#scB').innerHTML=(step.b||'').split(/\n\n/).map(p=>`<p>${p}</p>`).join('');
  $('#scTip').innerHTML=step.tip?`<div class="tip">${icon('bolt',14)}<div><b>${esc(step.tip[0])}</b><span>${step.tip[1]}</span></div></div>`:'';
  $('#scCh').innerHTML=step.ch&&step.ch.length?`<div class="lt">WHAT CHANGED</div><ul>${step.ch.map(c=>{const t=c[0]==='-'?'minus':c[0]==='!'?'warn':'plus';return `<li class="${t}"><span>${t==='minus'?'−':t==='warn'?'!':'+'}</span>${c.replace(/^[-+!]\s*/,'')}</li>`}).join('')}</ul>`:'';
  $('#backB').disabled=si===0;
  const nx=next(L.id);
  $('#nextL').textContent=si<L.steps.length-1?`Next: ${L.steps[si+1].short||L.steps[si+1].t}`:nx?`Next lesson: ${nx.title}`:'Course complete';
  $('#nextB').disabled=si===L.steps.length-1&&!nx;
  $$('#spRow button').forEach((b,i)=>{b.classList.toggle('on',i===si);b.classList.toggle('done',i<si)});
  $('#spN').textContent=`Step ${si+1} of ${L.steps.length}`;
  $('#spRow').style.setProperty('--p',(si/(Math.max(1,L.steps.length-1)))*100+'%');
  const nl=L.learn.length;$$('#learn li').forEach((li,i)=>li.classList.toggle('ok',si>=Math.round((i+1)*L.steps.length/nl)-1));
  if(si===L.steps.length-1){const d=doneSet();if(!d.has(L.id)){d.add(L.id);store.set('sd-done',[...d]);buildTree()}}
}

/* ------------------------------------------------------------------ animation loop */
let lastNow=performance.now(),clock=0;
const dotAt=(E,k,col,r=5)=>{const p=E.at(Math.max(0,Math.min(1,k)));return `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r}" class="pk" style="fill:var(--${col})"/>`};
function flashNode(id){const g=$(`#ln .nwrap[data-id="${id}"]`);if(!g)return;g.classList.remove('ping');void g.getBoundingClientRect();g.classList.add('ping')}
function loop(now){
  const dt=Math.min(64,now-lastNow);lastNow=now;
  if(!S.paused)clock+=dt*S.speed;
  if(S.vb&&S.vbTarget){for(let i=0;i<4;i++)S.vb[i]+=(S.vbTarget[i]-S.vb[i])*Math.min(1,dt/140);
    const sv=$('#scene');if(sv){sv.setAttribute('viewBox',S.vb.map(v=>v.toFixed(1)).join(' '));const g=$('#gridR');g.setAttribute('x',S.vb[0]-200);g.setAttribute('y',S.vb[1]-200);g.setAttribute('width',S.vb[2]+400);g.setAttribute('height',S.vb[3]+400)}}
  const lp=$('#lp');
  if(lp&&S.edges){
    let h='';const T=clock/1000;
    // continuous streams / parallel edges
    S.edges.forEach(E=>{
      const dur=Math.max(1.1,E.len/150),phase=((T+E.ix*0.37)/dur);
      if(E.f==='both'||E.f==='sync'){const c=phase%2,fw=c<1;h+=dotAt(E,fw?c%1:1-(c%1),E.f==='sync'?'purple':fw?'orange':'green')}
      else if(E.f==='fail'){const k=phase%1;if(k<0.6)h+=dotAt(E,k,'red');else{const p=E.at(0.6);h+=`<g opacity="${1-(k-0.6)/0.4}">${gIcon('x',p[0],p[1],16,'var(--red)')}</g>`}}
      else for(let d=0;d<E.dots;d++){let k=(phase+d/E.dots)%1;if(E.f==='res')k=1-k;h+=dotAt(E,k,E.tone==='faint'||E.tone==='gray'?'edge':E.tone,4.6)}
    });
    // ordered sequence: one edge at a time
    if(S.seq&&S.seq.length){
      let t=((clock-(S.clock0||0))/1000)%S.seqT;if(t<0)t+=S.seqT;let act=-1,k=0;
      for(let i=0,acc=0;i<S.seq.length;i++){const E=S.seq[i];if(t<acc+E.dur){act=i;k=(t-acc)/E.dur;break}acc+=E.dur}
      if(act!==S.seqActive){
        const prev=S.seqActive>=0?S.seq[S.seqActive]:null;
        if(prev&&act!==-1||prev&&act===-1){flashNode(prev.f==='res'?prev.a:prev.f==='fail'?null:prev.b)}
        S.seqActive=act;
        const multi=S.seq.length>1;
        S.seq.forEach((E,i)=>{const pl=$(`#le polyline[data-ix="${E.ix}"]`);if(pl){pl.classList.toggle('act',i===act);pl.classList.toggle('idle',multi&&i!==act)}});
        $$('#lo .badge-g').forEach(b=>b.classList.toggle('on',+b.dataset.ord===act+1));
        $$('#seqbox li[data-ord]').forEach(li=>{const o=+li.dataset.ord;li.classList.toggle('on',o===act);li.classList.toggle('done',act===-1||o<act)});
      }
      if(act>=0){const E=S.seq[act];
        if(E.f==='both'||E.f==='sync'){const fw=k<0.5,kk=fw?k*2:1-(k-0.5)*2;if(fw!==E._fw){E._fw=fw;if(!fw)flashNode(E.b)}h+=dotAt(E,kk,E.f==='sync'?'purple':fw?'orange':'green',5.5)}
        else if(E.f==='fail'){const kk=k/0.85;if(kk<0.6)h+=dotAt(E,kk,'red',5.5);else{const p=E.at(0.6);h+=`<g opacity="${Math.max(0,1-(kk-0.6)/0.5)}">${gIcon('x',p[0],p[1],18,'var(--red)')}</g>`}}
        else{h+=dotAt(E,E.f==='res'?1-k:k,E.tone==='faint'||E.tone==='gray'?'edge':E.tone,5.5)}
      }
    }
    lp.innerHTML=h;
  }
  if(S.home&&!S.paused){S.homeT=(S.homeT||0)+dt;if(S.homeT>7000&&!S.homeHover){S.homeT=0;homeCycle()}}
  requestAnimationFrame(loop);
}
function replay(){clock=0;S.clock0=0;S.seqActive=-1;if(S.paused)togglePause();$$('#ln .nwrap').forEach(g=>{g.classList.remove('enter');void g.getBoundingClientRect();g.classList.add('enter')})}
function togglePause(){S.paused=!S.paused;const b=$('#pauseB span');if(b)b.textContent=S.paused?'Play':'Pause'}

/* ------------------------------------------------------------------ cheatsheet */
const folderSVG=c=>`<svg class="folder" style="--c:var(--${c})" width="18" height="15" viewBox="0 0 20 16"><path d="M1.2 3.2A2 2 0 0 1 3.2 1.2h4.1l2 2.2h7.5a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H3.2a2 2 0 0 1-2-2Z"/><path class="lip" d="M1.2 6.2h17.6"/></svg>`;
function cheatView(){
  $('#right').innerHTML='';
  $('#center').innerHTML=`<section class="card lhead"><div class="crumbs">Reference</div><h1>Cheatsheet</h1><p class="sub">The key ideas from every lesson on one page, with links to read further.</p></section>`+
    MODULES.map(m=>`<section class="card cheat"><h3>${folderSVG(m.c)}${m.num}. ${m.title}</h3><div class="cgrid">${m.lessons.map(id=>LESSONS[id]).filter(Boolean).map(L=>`<div class="cl"><a class="clt" href="#/${L.id}/1">${esc(L.title)}</a><ul>${(L.cheat||L.learn).map(t=>`<li>${t}</li>`).join('')}</ul><div class="lt">READ MORE</div>${sourcesHTML(L,true)}</div>`).join('')}</div></section>`).join('');
}

/* ------------------------------------------------------------------ landing page */
function homeView(){
  const done=doneSet(),last=store.get('sd-last',null),first=ORDER[0].id;
  const total=ORDER.reduce((a,o)=>a+(LESSONS[o.id]?LESSONS[o.id].steps.length:0),0);
  $('#center').innerHTML='';$('#right').innerHTML='';
  $('#home').innerHTML=`
    <div class="h-stage" id="stage">${stageSVG()}</div>
    <div class="h-hero">
      <div class="h-bar">${MODULES.map((m,i)=>`<i style="background:var(--${m.c});animation-delay:${(i*0.07).toFixed(2)}s"></i>`).join('')}</div>
      <div class="h-kick">An interactive course · ${MODULES.length} modules · ${ORDER.length} lessons · ${total} animated steps</div>
      <h1 class="h-title">System <mark>Design</mark>, step by step</h1>
      <p class="h-tag">Watch requests travel through real architectures, from one page load to a chat system for millions. Every step is animated and numbered, and every lesson links to the sources that explain it in depth.</p>
      <div class="h-btns">
        <button class="btn pri" id="startB">${icon('play',13)}<span>Start from lesson 1</span></button>
        ${last&&LESSONS[last]&&last!==first?`<button class="btn" id="contB">${icon('repeat',13)}<span>Continue: ${esc(LESSONS[last].title)}</span></button>`:''}
        <a class="btn" href="#/cheatsheet">${icon('doc',13)}<span>Cheatsheet</span></a>
      </div>
      <div class="h-prog"><i><b style="width:${done.size/ORDER.length*100}%"></b></i><span>${done.size} / ${ORDER.length} lessons completed</span></div>
      <div class="h-now"><i></i><span>Previewing</span><b id="nowT"></b><small id="nowM"></small></div>
    </div>
    <aside class="h-list" id="hlist">${MODULES.map(m=>`<div class="hm"><div class="hm-h">${folderSVG(m.c)}<span class="num">${m.num}</span><h3>${m.title}</h3><small>${m.lessons.filter(id=>done.has(id)).length}/${m.lessons.length}</small></div>${m.lessons.map((id,i)=>{const L=LESSONS[id];if(!L)return'';return `<button class="hr${done.has(id)?' done':''}" data-id="${id}" style="--tc:var(--${m.c})"><span class="n">${m.num}.${i+1}</span><span class="tx"><b>${esc(L.title)}</b><small>${esc(L.sub)}</small></span><span class="meta">${done.has(id)?icon('check',13):`${L.min}m`}</span></button>`}).join('')}</div>`).join('')}</aside>`;
  $('#startB').onclick=()=>go(first,0);
  if($('#contB'))$('#contB').onclick=()=>go(last,0);
  const list=$('#hlist');
  let tmr=null;
  list.addEventListener('mouseover',e=>{const b=e.target.closest('.hr');if(!b)return;S.homeHover=true;clearTimeout(tmr);tmr=setTimeout(()=>preview(b.dataset.id),140)});
  list.addEventListener('mouseleave',()=>{S.homeHover=false;S.homeT=0});
  list.addEventListener('focusin',e=>{const b=e.target.closest('.hr');if(b)preview(b.dataset.id)});
  list.addEventListener('click',e=>{const b=e.target.closest('.hr');if(b)go(b.dataset.id,0)});
  S.home=true;S.vb=null;S.homeT=0;S.homeHover=false;
  preview(last&&LESSONS[last]?last:first);
}
function preview(id){
  const L=LESSONS[id];if(!L||!$('#home .h-stage'))return;
  if(S.homeId===id)return;S.homeId=id;
  // show the richest step: the one with the most visible nodes (ties → later step)
  let best=0,bestN=-1;L.steps.forEach((s,i)=>{const n=accum(L,i).vis.size+(s.e||[]).length*0.5;if(n>=bestN){bestN=n;best=i}});
  S.prevVis=new Set();
  drawScene(L,best,{noBox:true,minW:560,region:homeRegion});
  const M=meta(id);$('#nowT').textContent=L.title;$('#nowM').textContent=`${M.mod.num}.${M.index} · ${L.steps[best].t}`;
  $$('#hlist .hr').forEach(b=>b.classList.toggle('on',b.dataset.id===id));
}
function homeRegion(){if(matchMedia('(max-width:1000px)').matches)return{l:0,r:0,t:0,b:0};const h=$('.h-hero'),l=$('#hlist');return{l:h?h.getBoundingClientRect().right+24:0,r:l?l.getBoundingClientRect().width+40:0,t:30,b:30}}
function homeCycle(){const ids=ORDER.map(o=>o.id).filter(id=>LESSONS[id]);const i=ids.indexOf(S.homeId);preview(ids[(i+1)%ids.length]);const b=$(`#hlist .hr[data-id="${S.homeId}"]`);if(b&&!matchMedia('(max-width:900px)').matches)b.scrollIntoView({block:'nearest',behavior:'smooth'})}

/* ------------------------------------------------------------------ router */
function go(id,si){location.hash=`#/${id}/${si+1}`}
function route(){
  document.body.classList.remove('menu');
  const h=location.hash;
  const isHome=!h||h==='#'||h==='#/'||h.startsWith('#/home');
  const isCheat=h.startsWith('#/cheatsheet');
  const last=store.get('sd-last',null);
  $('#tabLearn').href=`#/${last&&LESSONS[last]?last:ORDER[0].id}/1`;
  $('#tabHome').classList.toggle('on',isHome);$('#tabCheat').classList.toggle('on',isCheat);$('#tabLearn').classList.toggle('on',!isHome&&!isCheat);
  document.body.classList.toggle('home',isHome);document.body.classList.toggle('wide',isCheat);
  S.home=isHome;S.homeId=null;
  if(isHome){S.lesson=null;S.edges=[];S.seq=[];buildTree();homeView();document.title='System Design, step by step · evilzeda';window.scrollTo(0,0);return}
  $('#home').innerHTML='';
  if(isCheat){S.lesson=null;S.edges=[];S.seq=[];buildTree();cheatView();document.title='Cheatsheet · System Design';window.scrollTo(0,0);return}
  const m=h.match(/^#\/([\w-]+)\/?(\d+)?/);
  const id=m&&LESSONS[m[1]]?m[1]:ORDER[0].id;
  const L=LESSONS[id];
  const si=m&&m[1]===id?Math.max(0,Math.min(L.steps.length-1,(+m[2]||1)-1)):0;
  if(!m||m[1]!==id)history.replaceState(null,'',`#/${id}/${si+1}`);
  store.set('sd-last',id);
  if(!S.lesson||S.lesson.id!==id){S.lesson=L;lessonView(L);buildTree();window.scrollTo(0,0)}
  S.si=si;document.title=`${L.title} · System Design`;
  renderStep();
}

/* ------------------------------------------------------------------ boot */
const SD={H,add(L){
  // authoring coords are screen-aligned (a = across, b = down); convert to iso world (x,y)
  for(const id in L.nodes){const n=L.nodes[id];const a=n.x,b=n.y;n.x=(a+b)/2;n.y=(b-a)/2}
  L.steps.forEach(s=>(s.e||[]).forEach(e=>{if(e.via)e.via=e.via.map(([a,b])=>[(a+b)/2,(b-a)/2])}));
  (L.steps).forEach(s=>(s.p||[]).forEach(p=>{if(p.x!=null){const a=p.x,b=p.y||0;p.x=(a+b)/2;p.y=(b-a)/2}}));
  LESSONS[L.id]=L;const M=meta(L.id);if(M)L.mod=M.mod},MODULES,LESSONS,start(){
  shell();
  window.addEventListener('hashchange',route);
  window.addEventListener('resize',()=>{if(S.lesson)renderStep();else if(S.home&&S.homeId){const id=S.homeId;S.homeId=null;preview(id)}});
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
window.SD=SD;
})();
