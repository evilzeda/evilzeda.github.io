/* Money Machine economy kit:
   1. EC: small, transparent models of one fictional island economy, Nusa, used by every lesson so the numbers agree everywhere.
      - forces(): Dalio's three forces (productivity + short-term debt cycle + long-term debt cycle) added together
      - machine(): the long-term debt cycle built from short cycles, a debt ratchet and a debt-service ceiling
      - cb(): a quarterly short-term cycle you can steer with the policy rate (used by the Lab)
      - delev(): a 12-year deleveraging with four policy levers (used by lessons and the Lab)
      - loan(), bond(), banks(): the small building blocks (interest, prices, money creation)
   2. Extra SVG helpers on ML.g: tables, waterfalls, stacked bars, timelines, multi-line charts.
   Money is in Nusa dollars ($). Rates and growth are annual. */
(function(){'use strict';
const U=ML.U,g=ML.g;

/* ------------------------------------------------------------------ formatting */
const F={
  n(v,dp=0){if(v==null||!isFinite(v))return '—';const neg=v<0,a=Math.abs(v).toFixed(dp).split('.');a[0]=a[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');return (neg?'−':'')+a.join('.')},
  d(v,dp=0){if(v==null||!isFinite(v))return '—';return (v<0?'−':'')+'$'+F.n(Math.abs(v),dp)},
  p(v,dp=1){if(v==null||!isFinite(v))return '—';return (v*100).toFixed(dp)+'%'},
  pp(v,dp=1){return (v>=0?'+':'−')+Math.abs(v*100).toFixed(dp)+'%'},
  x(v,dp=1){return v.toFixed(dp)+'x'},
  s(v,dp=0){return (v>=0?'+':'−')+F.n(Math.abs(v),dp)}
};

/* ------------------------------------------------------------------ the island */
const NUSA={name:'Nusa',bank:'Bank Nusa',cb:'Central Bank of Nusa',gdp:1000,growth:.02,target:.02,neutral:.02};

/* ------------------------------------------------------------------ 1. three forces (Dalio's chart) */
function forces(o){
  o=Object.assign({years:100,g:.02,len:7,amp:.035,peak:72,boom:.24,bust:.34,delev:12},o||{});
  const out=[];
  for(let k=0;k<=o.years*4;k++){const t=k/4;
    const prod=100*Math.exp(o.g*t);
    const short=o.amp*Math.sin(2*Math.PI*t/o.len);
    let long;
    if(t<=o.peak)long=o.boom*Math.pow(t/o.peak,2.2);
    else if(t<=o.peak+3)long=U.lerp(o.boom,-o.bust*.5,(t-o.peak)/3);
    else if(t<=o.peak+o.delev)long=-o.bust*.5*(1-(t-o.peak-3)/(o.delev-3))+(-o.bust*.5)*0;
    else long=0;
    if(t>o.peak&&t<=o.peak+3)long=U.lerp(o.boom,-o.bust*.5,U.ease((t-o.peak)/3));
    const sh=t>o.peak&&t<o.peak+o.delev?short*.25:short;
    out.push({t,prod,short:sh,long,act:prod*(1+sh+long),pl:prod*(1+long)});
  }
  return out;
}

/* ------------------------------------------------------------------ 2. the long-term debt cycle, built from short cycles
   Rules (all on screen in the lessons):
   - each short cycle is `len` years: a boom of `up` years, then a recession
   - in a boom, debt grows faster than income (debt/income +`dUp` a year); in a recession it only falls a little (−`dDn`)
   - borrowers can carry debt service (debt/income × (rate + repayment)) up to `tol` of income.
     The central bank's rate peak in each cycle is the rate that hits that ceiling: tol/d − rep
   - recessions are fixed by cutting the rate `cut` points. When the cut would need to go below 0, rates can no longer fix it:
     that is the long-term debt peak, and a deleveraging starts */
function machine(o){
  o=Object.assign({start:0,d0:1.0,len:7,up:5,dUp:.052,dDn:.04,tol:.105,rep:.005,cut:.035,g:.02,infl:.03,years:120},o||{});
  const yrs=[],cycles=[];let d=o.d0,t=0,n=0,peakIdx=null;
  while(t<o.years){
    const cap=o.tol/d-o.rep; // rate at which debt service hits the ceiling, at today's debt level
    const trough=cap-o.cut;
    cycles.push({n,start:t,d0:d,peakRate:cap,trough:Math.max(0,trough),zlb:trough<=0});
    if(trough<=0&&n>0){peakIdx=n;break}
    for(let q=0;q<o.len*4&&t<o.years;q++){const yy=q/4,boom=yy<o.up;
      const ph=boom?yy/o.up:(yy-o.up)/(o.len-o.up);
      const dEnd=d+o.dUp*o.up;
      const capNow=o.tol/d-o.rep;
      const rate=boom?U.lerp(Math.max(0,cycles[n].trough||capNow-o.cut),capNow,U.ease(ph)):U.lerp(capNow,Math.max(0,o.tol/(d)-o.rep-o.cut),U.ease(Math.min(1,ph*1.6)));
      const gap=boom?.02*Math.sin(Math.PI*ph*.9)+.004:-.025*Math.sin(Math.PI*ph);
      const infl=o.infl+(boom?.012*ph:-.01*Math.sin(Math.PI*ph));
      yrs.push({t:o.start+t,n,phase:boom?'boom':'recession',d,rate,dsr:d*(rate+o.rep),gap,infl});
      d=Math.max(.2,d+(boom?o.dUp:-o.dDn)/4);t+=.25;
    }
    n++;
  }
  /* deleveraging after the peak: debt service jumps (incomes fall, credit is cut), rates stuck at 0 */
  const peakT=t,peakD=d,dl=delev(o.mix||MIX.beautiful,{d0:d});
  dl.rows.forEach((r,i)=>{if(i===0)return;for(let q=0;q<4;q++){const k=(i-1)+q/4,a=dl.rows[i-1],b=r,w=q/4;
    const dd=U.lerp(a.d,b.d,w);yrs.push({t:o.start+t,n:'D',phase:'deleveraging',d:dd,rate:0,dsr:dd*(U.lerp(a.rate,b.rate,w)+o.rep),gap:U.lerp(a.real,b.real,w)-.02,infl:U.lerp(a.infl,b.infl,w)});t+=.25}});
  return {o,yrs,cycles,peakIdx,peakT:o.start+peakT,peakD,dl};
}

/* ------------------------------------------------------------------ 3. the short-term cycle you can steer (quarterly)
   credit growth responds to the real rate; spending responds to credit; inflation responds to spending above capacity */
function cbStep(s,rate,o){
  o=o||{};const p=Object.assign({rs:.02,target:.02,g:.02},o);
  const real=rate-s.pe; // borrowers look at the rate minus the inflation they expect
  const kN=p.g+s.pi;
  const credit=kN+1.4*(p.rs-real)+.6*s.gap+(s.shock||0);
  const gap=.82*s.gap+.16*(credit-kN)+(s.dshock||0);
  const pi=.86*s.pi+.10*s.pe+.04*p.target+.09*gap+(s.sshock||0);
  const pe=.85*s.pe+.15*pi;
  const u=Math.max(.015,.05-.5*gap);
  return {q:s.q+1,gap,pi,pe,credit,rate,u,shock:0,dshock:0,sshock:0};
}
function taylor(s,o){const p=Object.assign({rs:.02,target:.02},o||{});return Math.max(0,p.rs+s.pi+.5*(s.pi-p.target)+.5*s.gap)}
function cbInit(){return {q:0,gap:0,pi:.02,pe:.02,credit:.04,rate:.04,u:.05}}
/* a scripted run for lessons: shocks at given quarters, policy = 'taylor' | 'fixed' | number */
function cbRun(policy,o){
  o=Object.assign({n:48,shocks:{6:{dshock:.012},26:{dshock:-.02}},fixed:.04},o||{});
  let s=cbInit();const out=[s];
  for(let q=1;q<=o.n;q++){const sh=o.shocks[q];if(sh)Object.assign(s,sh);
    const r=policy==='taylor'?taylor(s):policy==='fixed'?o.fixed:typeof policy==='function'?policy(s,q):policy;
    s=cbStep(s,r);out.push(s)}
  return out;
}

/* ------------------------------------------------------------------ 4. deleveraging with four levers (annual, 12 years)
   levers are in % of national income per year:
   cut = austerity (spending cuts), write = debt written down or restructured, transfer = government deficit spending / redistribution,
   print = central bank buying bonds with new money */
const MIX={
  austerity:{cut:4,write:0,transfer:0,print:0,label:'Austerity only'},
  defaults:{cut:1,write:6,transfer:0,print:0,label:'Let it default'},
  printing:{cut:0,write:0,transfer:6,print:16,label:'Print without limit'},
  beautiful:{cut:1.5,write:2,transfer:3,print:5,label:'Balanced (“beautiful”)'},
  nothing:{cut:0,write:0,transfer:0,print:0,label:'Do nothing'}
};
function delev(m,o){
  m=Object.assign({cut:0,write:0,transfer:0,print:0},m||{});o=Object.assign({d0:3.0,g0:.6,years:12,rate:.045},o||{});
  const c=m.cut/100,w=m.write/100,tr=m.transfer/100,pr=m.print/100;
  let d=o.d0,gov=o.g0,credit=-.05;const rows=[{y:0,d,gov,real:0,infl:.02,nom:.04,u:.05,stress:0,rate:o.rate,credit:0}];
  for(let y=1;y<=o.years;y++){
    const fade=Math.exp(-(y-1)/3);
    credit=U.lerp(credit,.0,.22); // private credit contracts at first, then heals
    const over=Math.max(0,pr-.07)+Math.max(0,tr-.05)*.5; // money printed beyond what replaces the lost credit
    const st=.35+.65*fade; // policy pushes hardest while the hole is deepest
    const infl=U.clamp(.02-.045*fade-.45*c*st-.3*w*fade+.2*tr*st+.42*pr*st+Math.pow(over*9,2)*.08,-.08,.6);
    const real=.02-.07*fade-.7*c*st-.4*w*fade+.55*tr*st+.42*pr*st*(1-U.clamp(over*7,0,1))+credit*.3-.25*Math.max(0,infl-.06);
    const nom=real+infl;
    const rate=Math.max(.01,o.rate-1.2*pr+Math.max(0,infl-.04)*.7); // average rate on debt: printing pulls yields down, inflation pushes them up
    d=Math.max(.3,(d*(1+rate)+credit*d-c*.7)/(1+nom)-w*d);
    gov=Math.max(0,(gov*(1+rate)+tr+c*-.2)/(1+nom));
    const u=U.clamp(.05-.6*(real-.02)+.3*c,.03,.35);
    const stress=U.clamp(.35*tr/.06+Math.max(0,u-.06)*6+Math.max(0,infl-.06)*5+c*8,0,1);
    rows.push({y,d,gov,real,infl,nom,u,stress,rate,credit});
  }
  const last=rows[rows.length-1],infls=rows.slice(1).map(r=>r.infl),mx=Math.max(...infls),mn=Math.min(...infls);
  const avgReal=rows.slice(1).reduce((s,r)=>s+r.real,0)/o.years,peakU=Math.max(...rows.map(r=>r.u)),cumReal=rows.slice(1).reduce((s,r)=>s*(1+r.real),1)-1;
  let verdict='beautiful';
  if(mx>.10)verdict='inflationary';
  else if(mn<-.02||cumReal<-.04)verdict='deflationary';
  else if(last.d>o.d0*.85||peakU>.10)verdict='painful';
  return {m,o,rows,last,mx,mn,avgReal,peakU,cumReal,verdict};
}

/* ------------------------------------------------------------------ 5. building blocks */
/* level-payment loan (annual payments) */
function loan(P,r,n){const pay=r?P*r/(1-Math.pow(1+r,-n)):P/n;let bal=P;const rows=[];for(let y=1;y<=n;y++){const i=bal*r,pr=pay-i;bal-=pr;rows.push({y,pay,i,pr,bal:Math.max(0,bal)})}return {P,r,n,pay,rows,totI:pay*n-P}}
/* bond price from yield (annual coupons) */
function bond(face,coupon,yld,n){let p=0;for(let t=1;t<=n;t++)p+=face*coupon/Math.pow(1+yld,t);return p+face/Math.pow(1+yld,n)}
/* bank lending rounds: each deposit is lent out minus the reserve ratio, and the loan comes back as a new deposit */
function banks(base,rr,rounds){const rows=[];let dep=base,tot=0,loans=0;for(let i=0;i<rounds;i++){tot+=dep;const L=dep*(1-rr);loans+=L;rows.push({i,dep,res:dep*rr,loan:L,tot,loans});dep=L}return {rows,mult:1/rr,limit:base/rr}}
/* present value of $1 a year forever growing at g, discounted at r */
const perp=(cf,r,gr)=>cf/(r-gr);

ML.EC={F,NUSA,forces,machine,cbStep,cbInit,cbRun,taylor,delev,MIX,loan,bond,banks,perp};

/* ------------------------------------------------------------------ SVG helpers */
const f1=v=>(+v).toFixed(1),esc=g.esc;
/* table: cols [{t,w,a}], rows [{c:[cells],b,hi,tone,sep,dim,top,cc}] */
g.table=function(x,y,cols,rows,o={}){
  const rh=o.rh||21,W=cols.reduce((s,c)=>s+c.w,0);let s=`<g class="tbl">`;
  if(o.frame!==false)s+=`<rect x="${x}" y="${y}" width="${W}" height="${rh*(rows.length+(o.head===false?0:1))+6}" rx="8" style="fill:var(--bg);stroke:var(--edge);stroke-width:1.4"/>`;
  let yy=y+3;
  if(o.head!==false){let xx=x;s+=`<rect x="${x+1}" y="${y+1}" width="${W-2}" height="${rh}" rx="7" style="fill:var(--${o.hc||'gray'}-bg)"/>`;cols.forEach(c=>{s+=`<text x="${f1(c.a==='l'?xx+9:xx+c.w-9)}" y="${f1(yy+rh/2+3)}" text-anchor="${c.a==='l'?'start':'end'}" style="font:700 10.5px var(--font);fill:var(--ink)">${esc(c.t)}</text>`;xx+=c.w});yy+=rh}
  rows.forEach(r=>{
    if(r.hi||r.tone)s+=`<rect x="${x+3}" y="${f1(yy+1)}" width="${W-6}" height="${rh-2}" rx="5" style="fill:var(--${r.tone||'yellow'}-bg)${r.hi?';stroke:var(--edge);stroke-width:1.3':''}"/>`;
    if(r.sep||r.top)s+=`<line x1="${x+8}" y1="${f1(yy)}" x2="${x+W-8}" y2="${f1(yy)}" style="stroke:var(--${r.top?'edge':'line2'});stroke-width:${r.top?1.2:1}"/>`;
    let xx=x;cols.forEach((c,ci)=>{const v=r.c[ci];if(v!=null&&v!==''){const cc=r.cc&&r.cc[ci];s+=`<text x="${f1(c.a==='l'?xx+9:xx+c.w-9)}" y="${f1(yy+rh/2+3.5)}" text-anchor="${c.a==='l'?'start':'end'}" style="font:${r.b?700:500} 11px var(--font);fill:${cc?`var(--${cc})`:r.dim?'var(--faint)':ci===0&&!r.b?'var(--mute)':'var(--ink)'}">${esc(v)}</text>`}xx+=c.w});
    yy+=rh});
  return s+'</g>';
};
/* waterfall: items [[label,value,kind]] kind 't' = total bar from 0 */
g.wf=function(x,y,w,h,items,o={}){
  const n=items.length,gap=o.gap==null?10:o.gap,bw=(w-gap*(n-1))/n;let run=0;const segs=[];
  items.forEach(([l,v,k])=>{if(k==='t'){segs.push({l,a:0,b:v,k,v});run=v}else{segs.push({l,a:run,b:run+v,k,v});run+=v}});
  const mx=o.max||Math.max(...segs.map(s=>Math.max(s.a,s.b))),mn=o.min!=null?o.min:Math.min(0,...segs.map(s=>Math.min(s.a,s.b)));
  const sy=v=>y+h-U.clamp((v-mn)/(mx-mn),0,1)*h;const fmt=o.fmt||(v=>F.n(v,o.dp||0));
  let s=`<g class="br"><line x1="${x}" y1="${f1(sy(0))}" x2="${x+w}" y2="${f1(sy(0))}" style="stroke:var(--edge);stroke-width:1.3"/>`;
  segs.forEach((sg,i)=>{const bx=x+i*(bw+gap),top=sy(Math.max(sg.a,sg.b)),bh=Math.max(1.5,Math.abs(sy(sg.a)-sy(sg.b)));
    const c=sg.k==='t'?(o.tc||'blue'):sg.v>=0?(o.uc||'green'):(o.dc||'red');const show=o.upto==null||i<=o.upto;
    if(i&&o.conn!==false&&show)s+=`<line x1="${f1(bx-gap)}" y1="${f1(sy(segs[i-1].b))}" x2="${f1(bx)}" y2="${f1(sy(segs[i-1].b))}" style="stroke:var(--faint);stroke-dasharray:3 3"/>`;
    s+=`<rect class="bar${o.hi===i?' hot':''}" x="${f1(bx)}" y="${f1(top)}" width="${f1(bw)}" height="${f1(bh)}" rx="3" style="--c:var(--${c})${show?'':';opacity:.12'}"/>`;
    if(show)s+=`<text class="v" x="${f1(bx+bw/2)}" y="${f1(top-5)}" text-anchor="middle">${sg.k==='t'?fmt(sg.v):(sg.v>=0?'+':'−')+fmt(Math.abs(sg.v))}</text>`;
    String(sg.l).split('\n').forEach((ln,j)=>{s+=`<text x="${f1(bx+bw/2)}" y="${f1(y+h+14+j*12)}" text-anchor="middle"${show?'':' opacity=".4"'}>${esc(ln)}</text>`})});
  return s+'</g>';
};
/* vertical stacked bar: parts [[label,value,colour]] bottom-up */
g.stack=function(x,y,w,h,parts,o={}){
  const tot=o.total||parts.reduce((s,p)=>s+p[1],0);let yy=y+h,s='<g>';
  parts.forEach(([l,v,c],i)=>{const ph=v/tot*h;yy-=ph;const hot=o.hi===i;
    s+=`<rect x="${f1(x)}" y="${f1(yy)}" width="${w}" height="${f1(Math.max(0,ph))}" style="fill:color-mix(in srgb,var(--${c}) ${hot?70:38}%,var(--mixbase));stroke:var(--edge);stroke-width:${hot?2.2:1.3}"/>`;
    if(ph>13&&o.inner!==false)s+=`<text x="${f1(x+w/2)}" y="${f1(yy+ph/2+4)}" text-anchor="middle" style="font:700 11px var(--font);fill:var(--ink)">${esc(o.fmt?o.fmt(v):F.n(v))}</text>`;
    if(o.labels!==false){const lx=o.side==='l'?x-10:x+w+10;s+=`<text x="${f1(lx)}" y="${f1(yy+ph/2+4)}" text-anchor="${o.side==='l'?'end':'start'}" style="font:${hot?700:500} 11px var(--font);fill:var(--${hot?'ink':'mute'})">${esc(l)}</text>`}});
  if(o.title)s+=`<text x="${f1(x+w/2)}" y="${f1(y-10)}" text-anchor="middle" style="font:700 11.5px var(--font);fill:var(--ink)">${esc(o.title)}</text>`;
  return s+'</g>';
};
/* horizontal timeline: items [[label, sub]] */
g.timeline=function(x,y,w,items,o={}){
  const n=items.length,sp=w/(n-1||1);let s=`<g><line x1="${x}" y1="${y}" x2="${x+w}" y2="${y}" style="stroke:var(--line2);stroke-width:3"/>`;
  if(o.done!=null)s+=`<line x1="${x}" y1="${y}" x2="${f1(x+sp*Math.min(n-1,o.done))}" y2="${y}" style="stroke:var(--${o.c||'green'});stroke-width:3"/>`;
  items.forEach(([l,sub],i)=>{const X=x+i*sp,on=o.on===i,dn=o.done!=null&&i<=o.done;
    s+=`<circle cx="${f1(X)}" cy="${y}" r="${on?11:8}" style="fill:${on?'var(--yellow-bg)':dn?`var(--${o.c||'green'}-bg)`:'var(--bg)'};stroke:var(--edge);stroke-width:${on?2.2:1.4}"/>`;
    s+=`<text x="${f1(X)}" y="${y+3.5}" text-anchor="middle" style="font:700 9.5px var(--font);fill:var(--ink)">${i+1}</text>`;
    const ls=String(l).split('\n');ls.forEach((ln,j)=>{s+=`<text x="${f1(X)}" y="${f1(y+28+j*13)}" text-anchor="middle" style="font:${on?800:600} 11px var(--font);fill:var(--ink)">${esc(ln)}</text>`});
    if(sub)s+=`<text x="${f1(X)}" y="${f1(y+28+ls.length*13)}" text-anchor="middle" style="font:500 10px var(--font);fill:var(--mute)">${esc(sub)}</text>`});
  return s+'</g>';
};
/* multi-series line chart in a plot frame: series [{pts:[[x,y]],c,l,w,dash}] */
g.lines=function(P,series){return series.map(sr=>P.line(sr.pts,sr.c||'blue',{w:sr.w||2.6,cls:sr.dash?'dash':''})+(sr.l?g.T(P.sx(sr.pts[sr.pts.length-1][0])+(sr.lx||6),P.sy(sr.pts[sr.pts.length-1][1])+(sr.ly||4),sr.l,{cls:'b',c:sr.c}):'')).join('')};
/* shaded vertical band in a plot */
g.band=function(P,a,b,c,l,o={}){const X1=P.sx(Math.max(P.xr[0],a)),X2=P.sx(Math.min(P.xr[1],b));return g.R(X1,P.y,X2-X1,P.h,{fill:`var(--${c}-bg)`,op:o.op||.8})+(l?g.T((X1+X2)/2,P.y+(o.ly||14),l,{a:'middle',cls:'m'}):'')};
/* a person / actor: little circle head + body, with a label */
g.actor=function(x,y,label,c='blue',o={}){const s=o.s||1;return `<g style="${o.op!=null?'opacity:'+o.op:''}"><circle cx="${f1(x)}" cy="${f1(y-14*s)}" r="${9*s}" style="fill:color-mix(in srgb,var(--${c}) 30%,var(--mixbase));stroke:var(--edge);stroke-width:1.5"/><path d="M${f1(x-15*s)},${f1(y+14*s)} q0,-19 ${f1(15*s)},-19 q${f1(15*s)},0 ${f1(15*s)},19 z" style="fill:color-mix(in srgb,var(--${c}) 30%,var(--mixbase));stroke:var(--edge);stroke-width:1.5"/>${label?g.T(x,y+30*s,label,{a:'middle',cls:'b'}):''}${o.sub?g.T(x,y+30*s+13,o.sub,{a:'middle',cls:'m'}):''}</g>`};
/* coin */
g.coin=function(x,y,t='$',c='yellow',r=11){return `<g><circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" style="fill:color-mix(in srgb,var(--${c}) 45%,var(--mixbase));stroke:var(--edge);stroke-width:1.4"/><text x="${f1(x)}" y="${f1(y+4)}" text-anchor="middle" style="font:800 ${r}px var(--font);fill:var(--ink)">${esc(t)}</text></g>`};
/* gauge: value 0..1 on a semicircle */
g.gauge=function(x,y,r,v,label,c='blue',txt){const a=Math.PI*(1-U.clamp(v,0,1));const ex=x+r*Math.cos(a),ey=y-r*Math.sin(a);
  return `<g><path d="M${x-r},${y} A${r},${r} 0 0 1 ${x+r},${y}" style="fill:none;stroke:var(--line2);stroke-width:12;stroke-linecap:round"/><path d="M${x-r},${y} A${r},${r} 0 0 1 ${f1(ex)},${f1(ey)}" style="fill:none;stroke:var(--${c});stroke-width:12;stroke-linecap:round"/><line x1="${x}" y1="${y}" x2="${f1(x+(r-18)*Math.cos(a))}" y2="${f1(y-(r-18)*Math.sin(a))}" style="stroke:var(--edge);stroke-width:2.5;stroke-linecap:round"/><circle cx="${x}" cy="${y}" r="5" style="fill:var(--edge)"/>${g.T(x,y+22,txt||'',{a:'middle',cls:'b'})}${g.T(x,y+38,label,{a:'middle',cls:'m'})}</g>`};
})();
