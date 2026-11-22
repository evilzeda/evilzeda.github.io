/* Deal Room finance kit:
   1. CF: one live model of a fictional company, Kopi Kita Corp (a coffee chain), used by every lesson so the numbers agree everywhere.
   2. Extra SVG helpers on ML.g: tables, waterfalls, stacked bars, timelines.
   All money is in $ millions unless a lesson says otherwise. */
(function(){'use strict';
const U=ML.U,g=ML.g;

/* ------------------------------------------------------------------ formatting */
const F={
  n(v,dp=0){if(v==null||!isFinite(v))return '—';const neg=v<0,a=Math.abs(v).toFixed(dp).split('.');a[0]=a[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');return (neg?'(':'')+a.join('.')+(neg?')':'')},
  m(v,dp=0){if(v==null||!isFinite(v))return '—';return (v<0?'−':'')+'$'+F.n(Math.abs(v),dp)+'M'},
  d(v,dp=2){return (v<0?'−':'')+'$'+Math.abs(v).toFixed(dp)},
  p(v,dp=1){return (v*100).toFixed(dp)+'%'},
  x(v,dp=1){return v.toFixed(dp)+'x'},
  s(v,dp=0){return (v>=0?'+':'−')+F.n(Math.abs(v),dp)}
};

/* ------------------------------------------------------------------ the company */
const BASE={
  name:'Kopi Kita Corp',tk:'KOPI',
  rev0:1000,gr:[.08,.07,.06,.05,.04],marg:[.20,.205,.21,.215,.22,.22],
  da0:50,lifeOld:12,lifeNew:15,capex:.06,nwc:.10,tax:.25,
  debt:400,rate:.06,amort:50,cash:100,pref:50,nci:30,
  basic:100,price:15,opts:[[3,8],[3,12],[2,18]],rsu:1,
  rf:.045,beta:1.1,erp:.055,kd:.06,tg:.025,exitX:9.5,
  gw0:120,ppe0:600,ca0:150,ap0:50
};
function run(o){
  o=Object.assign({},BASE,o||{});
  const N=6,yrs=['FY25A','FY26E','FY27E','FY28E','FY29E','FY30E'];
  const rev=[o.rev0];for(let i=1;i<N;i++)rev.push(rev[i-1]*(1+o.gr[i-1]));
  const ebitda=rev.map((r,i)=>r*o.marg[i]);
  const capex=rev.map(r=>r*o.capex);
  /* depreciation walk: legacy PP&E straight-line over lifeOld, each year's capex over lifeNew, starting the year it is spent */
  const daOld=rev.map(()=>o.da0),vint=rev.map((_,i)=>rev.map((__,t)=>i>=1&&t>=i?capex[i]/o.lifeNew:0));
  const da=rev.map((_,t)=>t===0?o.da0:o.da0+vint.reduce((s,v)=>s+v[t],0));
  const ebit=ebitda.map((e,i)=>e-da[i]);
  const nwc=rev.map(r=>r*o.nwc),dnwc=nwc.map((v,i)=>i?v-nwc[i-1]:0);
  const taxU=ebit.map(e=>e*o.tax),nopat=ebit.map((e,i)=>e-taxU[i]);
  const ufcf=nopat.map((n,i)=>n+da[i]-capex[i]-dnwc[i]);
  /* diluted shares, treasury stock method */
  let itm=0,proceeds=0;o.opts.forEach(([n,k])=>{if(k<o.price){itm+=n;proceeds+=n*k}});
  const buyback=proceeds/o.price,dil=o.basic+itm-buyback+o.rsu;
  const eqv=dil*o.price,ev=eqv+o.debt+o.pref+o.nci-o.cash;
  /* WACC */
  const ke=o.rf+o.beta*o.erp,kdat=o.kd*(1-o.tax),wE=eqv/(eqv+o.debt),wD=1-wE,wacc=wE*ke+wD*kdat;
  /* DCF, end-of-year discounting of FY26E..FY30E */
  const W=o.wacc!=null?o.wacc:wacc,tg=o.tg;
  const df=rev.map((_,i)=>i?1/Math.pow(1+W,i):1),pv=ufcf.map((c,i)=>i?c*df[i]:0);
  const sumPV=pv.reduce((a,b)=>a+b,0);
  const tvG=ufcf[N-1]*(1+tg)/(W-tg),tvX=ebitda[N-1]*o.exitX;
  const tv=o.tvMethod==='exit'?tvX:tvG,pvtv=tv*df[N-1],dcfEV=sumPV+pvtv;
  const dcfEq=dcfEV-o.debt-o.pref-o.nci+o.cash,dcfPx=dcfEq/dil;
  /* three statements, FY25A -> FY26E */
  const interest=o.debt*o.rate,ebt1=ebit[1]-interest,tax1=ebt1*o.tax,ni1=ebt1-tax1;
  const ni0=(ebit[0]-o.debt*o.rate)*(1-o.tax);
  const cfo=ni1+da[1]-dnwc[1],cfi=-capex[1],cff=-o.amort,dcash=cfo+cfi+cff;
  const eq0=o.ca0+o.ppe0+o.gw0+o.cash-o.ap0-o.debt-o.pref-o.nci;
  const bs0={cash:o.cash,ca:o.ca0,ppe:o.ppe0,gw:o.gw0,ap:o.ap0,debt:o.debt,pref:o.pref,nci:o.nci,eq:eq0};
  const ca1=o.ca0*rev[1]/rev[0],ap1=o.ap0*rev[1]/rev[0];
  const bs1={cash:o.cash+dcash,ca:ca1,ppe:o.ppe0+capex[1]-da[1],gw:o.gw0,ap:ap1,debt:o.debt-o.amort,pref:o.pref,nci:o.nci,eq:eq0+ni1};
  bs0.A=bs0.cash+bs0.ca+bs0.ppe+bs0.gw;bs0.L=bs0.ap+bs0.debt+bs0.pref+bs0.nci+bs0.eq;
  bs1.A=bs1.cash+bs1.ca+bs1.ppe+bs1.gw;bs1.L=bs1.ap+bs1.debt+bs1.pref+bs1.nci+bs1.eq;
  return {o,yrs,N,rev,ebitda,capex,da,daOld,vint,ebit,nwc,dnwc,taxU,nopat,ufcf,itm,proceeds,buyback,dil,eqv,ev,
    ke,kdat,wE,wD,wacc,W,tg,df,pv,sumPV,tvG,tvX,tv,pvtv,dcfEV,dcfEq,dcfPx,
    interest,ebt1,tax1,ni1,ni0,cfo,cfi,cff,dcash,bs0,bs1,
    gp:rev.map(r=>r*.40),opex:rev.map((r,i)=>r*.40-ebitda[i])};
}

/* ------------------------------------------------------------------ an LBO of the same company */
function lbo(p){
  p=Object.assign({entryX:10,exitX:10.5,lev:[[4.0,.075,'Term loan B'],[1.5,.10,'Senior notes']],fees:.02,years:5,minCash:25,sweep:1},p||{});
  const C=run(p.case);const e0=C.ebitda[0],ev0=e0*p.entryX,fees=ev0*p.fees;
  const tr=p.lev.map(([x,r,n])=>({n,r,x,amt:e0*x}));
  const debt0=tr.reduce((s,t)=>s+t.amt,0),uses=ev0+fees+p.minCash,eq0=uses-debt0;
  const rows=[];let bal=tr.map(t=>t.amt),cash=p.minCash;
  for(let y=1;y<=p.years;y++){
    const intr=bal.map((b,i)=>b*tr[i].r),I=intr.reduce((a,b)=>a+b,0);
    const ebt=C.ebit[y]-I,tax=Math.max(0,ebt)*C.o.tax,ni=ebt-tax;
    const fcf=ni+C.da[y]-C.capex[y]-C.dnwc[y];
    let avail=fcf*p.sweep;const pay=bal.map(()=>0);
    for(let i=0;i<bal.length&&avail>0;i++){const k=Math.min(bal[i],avail);bal[i]-=k;pay[i]=k;avail-=k}
    cash+=fcf-pay.reduce((a,b)=>a+b,0);
    const D=bal.reduce((a,b)=>a+b,0);
    rows.push({y,ebitda:C.ebitda[y],I,fcf,pay,bal:[...bal],debt:D,cash,lev:D/C.ebitda[y],netLev:(D-cash)/C.ebitda[y],cov:C.ebitda[y]/I});
  }
  const L=rows[rows.length-1],e5=C.ebitda[p.years],ev5=e5*p.exitX,nd5=L.debt-L.cash,eq5=ev5-nd5;
  const moic=eq5/eq0,irr=Math.pow(moic,1/p.years)-1;
  const nd0=debt0-p.minCash;
  const attr={growth:(e5-e0)*p.entryX,multiple:(p.exitX-p.entryX)*e5,paydown:nd0-nd5,fees:-fees};
  return {p,C,e0,ev0,fees,tr,debt0,uses,eq0,rows,e5,ev5,nd5,eq5,moic,irr,attr,nd0};
}
/* highest entry multiple a sponsor can pay and still hit a target IRR (bisection) */
function maxEntry(target,p){let lo=5,hi=20;for(let i=0;i<40;i++){const m=(lo+hi)/2;const r=lbo(Object.assign({},p,{entryX:m,exitX:(p&&p.exitX)||m}));if(r.irr>target)lo=m;else hi=m}return (lo+hi)/2}

/* ------------------------------------------------------------------ an acquirer for the M&A module */
const ACQ={name:'BrewCo',price:28,shares:200,ni:400,cashRate:.04,debtRate:.065,premium:.30,syn:40};
function deal(o){
  o=Object.assign({},ACQ,o||{});const C=run();const t=C.o.tax;
  const offerPx=C.o.price*(1+o.premium),eqPrice=offerPx*C.dil,evPrice=eqPrice+C.o.debt+C.o.pref+C.o.nci-C.o.cash;
  const mix=o.mix||{stock:.5,cash:0,debt:.5};
  const stock$=eqPrice*mix.stock,cash$=eqPrice*mix.cash,debt$=eqPrice*mix.debt,newSh=stock$/o.price;
  const tgtNI=C.ni1,synAT=o.syn*(1-t)*(o.synPhase==null?1:o.synPhase);
  const costCash=cash$*o.cashRate*(1-t),costDebt=debt$*o.debtRate*(1-t);
  const pfNI=o.ni+tgtNI+synAT-costCash-costDebt,pfSh=o.shares+newSh;
  const eps0=o.ni/o.shares,eps1=pfNI/pfSh,acc=eps1/eps0-1;
  const synNeed=Math.max(0,(eps0*pfSh-(o.ni+tgtNI-costCash-costDebt))/(1-t));
  return {o,C,offerPx,eqPrice,evPrice,stock$,cash$,debt$,newSh,tgtNI,synAT,costCash,costDebt,pfNI,pfSh,eps0,eps1,acc,synNeed,evX:evPrice/C.ebitda[0]};
}

ML.CF={F,BASE,run,lbo,maxEntry,ACQ,deal,S:run()};

/* ------------------------------------------------------------------ SVG helpers */
const f1=v=>(+v).toFixed(1),esc=g.esc;
/* table: cols [{t,w,a}], rows [{c:[cells],b,hi,tone,sep,dim,top}]; returns svg. Row height o.rh */
g.table=function(x,y,cols,rows,o={}){
  const rh=o.rh||21,W=cols.reduce((s,c)=>s+c.w,0);let s=`<g class="tbl">`;
  if(o.frame!==false)s+=`<rect x="${x}" y="${y}" width="${W}" height="${rh*(rows.length+(o.head===false?0:1))+6}" rx="8" style="fill:var(--bg);stroke:var(--edge);stroke-width:1.4"/>`;
  let yy=y+3;
  if(o.head!==false){let xx=x;s+=`<rect x="${x+1}" y="${y+1}" width="${W-2}" height="${rh}" rx="7" style="fill:var(--${o.hc||'gray'}-bg)"/>`;cols.forEach(c=>{s+=`<text x="${f1(c.a==='l'?xx+9:xx+c.w-9)}" y="${f1(yy+rh/2+3)}" text-anchor="${c.a==='l'?'start':'end'}" style="font:700 10.5px var(--font);fill:var(--ink)">${esc(c.t)}</text>`;xx+=c.w});yy+=rh}
  rows.forEach((r,ri)=>{
    if(r.hi||r.tone)s+=`<rect x="${x+3}" y="${f1(yy+1)}" width="${W-6}" height="${rh-2}" rx="5" style="fill:var(--${r.tone||'yellow'}-bg)${r.hi?';stroke:var(--edge);stroke-width:1.3':''}"/>`;
    if(r.sep||r.top)s+=`<line x1="${x+8}" y1="${f1(yy)}" x2="${x+W-8}" y2="${f1(yy)}" style="stroke:var(--${r.top?'edge':'line2'});stroke-width:${r.top?1.2:1}"/>`;
    let xx=x;cols.forEach((c,ci)=>{const v=r.c[ci];if(v!=null&&v!==''){const cc=r.cc&&r.cc[ci];s+=`<text x="${f1(c.a==='l'?xx+9+(ci===0&&r.ind?r.ind*12:0):xx+c.w-9)}" y="${f1(yy+rh/2+3.5)}" text-anchor="${c.a==='l'?'start':'end'}" style="font:${r.b?700:500} 11px var(--font);fill:${cc?`var(--${cc})`:r.dim?'var(--faint)':ci===0&&!r.b?'var(--mute)':'var(--ink)'}">${esc(v)}</text>`}xx+=c.w});
    yy+=rh});
  return s+'</g>';
};
/* waterfall: items [[label,value,kind]] kind: 't' total bar from 0, otherwise a delta. o.max, o.fmt, o.min */
g.wf=function(x,y,w,h,items,o={}){
  const n=items.length,gap=o.gap==null?10:o.gap,bw=(w-gap*(n-1))/n;let run=0;const segs=[];
  items.forEach(([l,v,k])=>{if(k==='t'){segs.push({l,a:0,b:v,k,v});run=v}else{segs.push({l,a:run,b:run+v,k,v});run+=v}});
  const mx=o.max||Math.max(...segs.map(s=>Math.max(s.a,s.b))),mn=o.min!=null?o.min:Math.min(0,...segs.map(s=>Math.min(s.a,s.b)));
  const sy=v=>y+h-U.clamp((v-mn)/(mx-mn),0,1)*h;const fmt=o.fmt||(v=>F.n(v,o.dp||0));
  let s=`<g class="br"><line x1="${x}" y1="${f1(sy(0))}" x2="${x+w}" y2="${f1(sy(0))}" style="stroke:var(--edge);stroke-width:1.3"/>`;
  segs.forEach((sg,i)=>{const bx=x+i*(bw+gap),top=sy(Math.max(sg.a,sg.b)),bh=Math.max(1.5,Math.abs(sy(sg.a)-sy(sg.b)));
    const c=sg.k==='t'?(o.tc||'blue'):sg.v>=0?(o.uc||'green'):(o.dc||'red');const hot=o.hi===i;const show=o.upto==null||i<=o.upto;
    if(i&&o.conn!==false&&show)s+=`<line x1="${f1(bx-gap)}" y1="${f1(sy(segs[i-1].k==='t'?segs[i-1].b:segs[i-1].b))}" x2="${f1(bx)}" y2="${f1(sy(segs[i-1].b))}" style="stroke:var(--faint);stroke-dasharray:3 3"/>`;
    s+=`<rect class="bar${hot?' hot':''}" x="${f1(bx)}" y="${f1(top)}" width="${f1(bw)}" height="${f1(bh)}" rx="3" style="--c:var(--${c})${show?'':';opacity:.12'}"/>`;
    if(show)s+=`<text class="v" x="${f1(bx+bw/2)}" y="${f1(top-5)}" text-anchor="middle">${sg.k==='t'?fmt(sg.v):(sg.v>=0?'+':'−')+fmt(Math.abs(sg.v))}</text>`;
    const lines=String(sg.l).split('\n');lines.forEach((ln,j)=>{s+=`<text x="${f1(bx+bw/2)}" y="${f1(y+h+14+j*12)}" text-anchor="middle"${show?'':' opacity=".4"'}>${esc(ln)}</text>`})});
  return s+'</g>';
};
/* vertical stacked bar: parts [[label,value,colour]] bottom-up; labels to the right (o.side='l' for left) */
g.stack=function(x,y,w,h,parts,o={}){
  const tot=o.total||parts.reduce((s,p)=>s+p[1],0);let yy=y+h,s='<g>';
  parts.forEach(([l,v,c],i)=>{const ph=v/tot*h;yy-=ph;const hot=o.hi===i;
    s+=`<rect x="${f1(x)}" y="${f1(yy)}" width="${w}" height="${f1(Math.max(0,ph))}" style="fill:color-mix(in srgb,var(--${c}) ${hot?70:38}%,var(--mixbase));stroke:var(--edge);stroke-width:${hot?2.2:1.3}"/>`;
    if(ph>13&&o.inner!==false)s+=`<text x="${f1(x+w/2)}" y="${f1(yy+ph/2+4)}" text-anchor="middle" style="font:700 11px var(--font);fill:var(--ink)">${esc(o.fmt?o.fmt(v):F.n(v))}</text>`;
    if(o.labels!==false){const lx=o.side==='l'?x-10:x+w+10;s+=`<text x="${f1(lx)}" y="${f1(yy+ph/2+4)}" text-anchor="${o.side==='l'?'end':'start'}" style="font:${hot?700:500} 11px var(--font);fill:var(--${hot?'ink':'mute'})">${esc(l)}</text>`}});
  if(o.title)s+=`<text x="${f1(x+w/2)}" y="${f1(y-10)}" text-anchor="middle" style="font:700 11.5px var(--font);fill:var(--ink)">${esc(o.title)}</text>`;
  return s+'</g>';
};
/* horizontal timeline: items [[label, sub]]; o.on index highlighted, o.done count */
g.timeline=function(x,y,w,items,o={}){
  const n=items.length,sp=w/(n-1||1);let s=`<g><line x1="${x}" y1="${y}" x2="${x+w}" y2="${y}" style="stroke:var(--line2);stroke-width:3"/>`;
  if(o.done!=null)s+=`<line x1="${x}" y1="${y}" x2="${f1(x+sp*Math.min(n-1,o.done))}" y2="${y}" style="stroke:var(--${o.c||'green'});stroke-width:3"/>`;
  items.forEach(([l,sub],i)=>{const X=x+i*sp,on=o.on===i,dn=o.done!=null&&i<=o.done;
    s+=`<circle cx="${f1(X)}" cy="${y}" r="${on?11:8}" style="fill:${on?'var(--yellow-bg)':dn?`var(--${o.c||'green'}-bg)`:'var(--bg)'};stroke:var(--edge);stroke-width:${on?2.2:1.4}"/>`;
    s+=`<text x="${f1(X)}" y="${y+3.5}" text-anchor="middle" style="font:700 9.5px var(--font);fill:var(--ink)">${i+1}</text>`;
    const up=o.alt&&i%2;String(l).split('\n').forEach((ln,j)=>{s+=`<text x="${f1(X)}" y="${f1(up?y-22-((String(l).split('\n').length-1-j)*13)-(sub?13:0):y+28+j*13)}" text-anchor="middle" style="font:${on?800:600} 11px var(--font);fill:var(--ink)">${esc(ln)}</text>`});
    if(sub){const nl=String(l).split('\n').length;s+=`<text x="${f1(X)}" y="${f1(up?y-22:y+28+nl*13)}" text-anchor="middle" style="font:500 10px var(--font);fill:var(--mute)">${esc(sub)}</text>`}});
  return s+'</g>';
};
/* a small "document" glyph with lines, centred */
g.docu=function(x,y,w,h,title,c='blue',o={}){
  let s=`<g style="${o.op!=null?'opacity:'+o.op:''}"><path d="M${f1(x-w/2)},${f1(y-h/2)} h${f1(w-14)} l14,14 v${f1(h-14)} h${f1(-w)} z" style="fill:color-mix(in srgb,var(--${c}) 16%,var(--mixbase));stroke:var(--edge);stroke-width:1.5;filter:drop-shadow(2.5px 2.5px 0 color-mix(in srgb,var(--edge) 85%,transparent))"/><path d="M${f1(x+w/2-14)},${f1(y-h/2)} v14 h14" style="fill:none;stroke:var(--edge);stroke-width:1.3"/>`;
  s+=`<text x="${f1(x)}" y="${f1(y-h/2+30)}" text-anchor="middle" style="font:700 11px var(--font);fill:var(--ink)">${esc(title)}</text>`;
  const nl=o.lines==null?Math.max(0,Math.floor((h-46)/11)):o.lines;for(let i=0;i<nl;i++){const lw=(w-28)*(i%3===2?.6:.92);s+=`<line x1="${f1(x-w/2+14)}" y1="${f1(y-h/2+44+i*11)}" x2="${f1(x-w/2+14+lw)}" y2="${f1(y-h/2+44+i*11)}" style="stroke:var(--line2);stroke-width:2.5;stroke-linecap:round"/>`}
  return s+'</g>';
};
/* range bar for football fields: rows [[label,lo,hi,colour,sub]], axis [a,b] */
g.ranges=function(x,y,w,rows,o={}){
  const [a,b]=o.ax,lw=o.lw||170,rh=o.rh||40,sx=v=>x+lw+(v-a)/(b-a)*(w-lw);let s='<g>';
  const H=rows.length*rh;
  for(let v=Math.ceil(a/(o.step||5))*(o.step||5);v<=b;v+=o.step||5)s+=`<line x1="${f1(sx(v))}" y1="${y-6}" x2="${f1(sx(v))}" y2="${y+H}" style="stroke:var(--grid)"/><text x="${f1(sx(v))}" y="${y+H+15}" text-anchor="middle" style="font:500 10px var(--font);fill:var(--mute)">${o.fmt?o.fmt(v):v}</text>`;
  rows.forEach(([l,lo,hi,c,sub],i)=>{const yy=y+i*rh,show=o.upto==null||i<=o.upto,hot=o.hi===i;
    s+=`<text x="${x+lw-12}" y="${f1(yy+rh/2+(sub?-1:4))}" text-anchor="end" style="font:${hot?800:600} 11.5px var(--font);fill:var(--ink)${show?'':';opacity:.35'}">${esc(l)}</text>`;
    if(sub)s+=`<text x="${x+lw-12}" y="${f1(yy+rh/2+12)}" text-anchor="end" style="font:500 9.5px var(--font);fill:var(--mute)${show?'':';opacity:.35'}">${esc(sub)}</text>`;
    if(show){s+=`<rect x="${f1(sx(lo))}" y="${f1(yy+8)}" width="${f1(Math.max(2,sx(hi)-sx(lo)))}" height="${rh-16}" rx="5" style="fill:color-mix(in srgb,var(--${c}) ${hot?62:40}%,var(--mixbase));stroke:var(--edge);stroke-width:${hot?2:1.3};filter:drop-shadow(2px 2px 0 color-mix(in srgb,var(--edge) 80%,transparent))"/>`;
      s+=`<text x="${f1(sx(lo)-5)}" y="${f1(yy+rh/2+4)}" text-anchor="end" style="font:600 10px var(--font);fill:var(--mute)">${o.fmt?o.fmt(lo):lo.toFixed(1)}</text><text x="${f1(sx(hi)+5)}" y="${f1(yy+rh/2+4)}" style="font:600 10px var(--font);fill:var(--mute)">${o.fmt?o.fmt(hi):hi.toFixed(1)}</text>`}});
  if(o.mark!=null){const X=sx(o.mark);s+=`<line x1="${f1(X)}" y1="${y-14}" x2="${f1(X)}" y2="${y+H+2}" style="stroke:var(--red);stroke-width:2.2;stroke-dasharray:6 4"/>`+g.pill(X,y-22,o.markL||'',' red'.trim())}
  return s+'</g>';
};
g.money=F.m;
})();
