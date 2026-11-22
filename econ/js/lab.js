/* Money Machine Lab: three hands-on simulations built on the same models as the lessons (js/kit.js).
   #/lab/cb     Be the central bank: steer a quarterly economy with the policy rate
   #/lab/delev  Deleveraging mixer: blend austerity, defaults, redistribution and money printing
   #/lab/cycle  Long-cycle builder: change how much people borrow and see when rates hit zero */
(function(){'use strict';
const g=ML.g,U=ML.U,E=ML.EC,F=E.F,icon=ML.icon,esc=ML.esc;
const $=(s,r=document)=>r.querySelector(s);
let timer=null;
ML.labStop=()=>{if(timer){clearInterval(timer);timer=null}};

const TABS=[['cb','bank','Be the central bank'],['delev','scale','Deleveraging mixer'],['cycle','repeat','Long-cycle builder']];
const svg=inner=>`<svg viewBox="0 0 ${g.VW} ${g.VH}" preserveAspectRatio="xMidYMid meet"><defs><pattern id="dotl" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" style="fill:var(--grid)"/></pattern></defs><rect x="0" y="0" width="${g.VW}" height="${g.VH}" fill="url(#dotl)"/><g class="sx">${inner}</g></svg>`;
const slider=(id,label,min,max,step,val,help,fmt)=>`<div class="sl"><label for="${id}">${esc(label)}<b id="${id}V">${fmt?fmt(val):val}</b></label><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}">${help?`<small>${help}</small>`:''}</div>`;

ML.lab=function(el,tab){
  ML.labStop();
  if(!TABS.find(t=>t[0]===tab))tab='cb';
  el.innerHTML=`<section class="card lhead"><div class="crumbs">Lab <span>/</span> hands-on simulations</div><h1>The Machine Lab</h1>
    <p class="sub">The same small models the lessons use, but now you pull the levers. Nothing here is a forecast of a real economy: it is a toy machine that behaves the way the lessons describe, so you can feel the trade-offs.</p>
    <div class="lab-tabs">${TABS.map(([id,ic,l])=>`<a href="#/lab/${id}" class="${id===tab?'on':''}">${icon(ic,14)}${l}</a>`).join('')}</div></section>
    <div class="lab-grid"><section class="card lab-stage" id="labStage"></section><section class="card lab-ctl" id="labCtl"></section></div>`;
  ({cb:cbLab,delev:delevLab,cycle:cycleLab})[tab]($('#labStage'),$('#labCtl'));
};

/* ================================================================== 1. be the central bank */
function cbLab(st,ctl){
  let s,hist,rate,auto,seed,rnd,events,running;
  const N=60;
  function reset(){s=E.cbInit();hist=[s];rate=.04;auto=false;seed=(Date.now()%9973)+1;rnd=U.rng(seed);events=[];running=false;draw();sync()}
  function shockNow(kind){
    const S={boom:{dshock:.014,txt:'Credit boom: lenders get excited'},bust:{dshock:-.022,txt:'Confidence crash: spending freezes'},oil:{sshock:.012,txt:'Oil price shock: prices jump'},house:{shock:.05,txt:'House prices soar, people borrow more'}}[kind];
    const {txt,...sh}=S;Object.assign(s,sh);events.push([s.q+1,txt]);
  }
  function tick(){
    if(s.q>=N){stop();return}
    if(!events.find(e=>e[0]===s.q+1)&&rnd()<.07){const ks=['boom','bust','oil','house'];shockNow(ks[Math.floor(rnd()*ks.length)])}
    if(auto)rate=Math.round(E.taylor(s)*400)/400;
    s=E.cbStep(s,rate);hist.push(s);draw();sync();
    if(s.q>=N)stop();
  }
  function play(){if(running)return;running=true;timer=setInterval(tick,550);sync()}
  function stop(){running=false;ML.labStop();sync()}
  function score(){const h=hist.slice(1);if(!h.length)return null;const pi=h.reduce((a,x)=>a+Math.abs(x.pi-.02),0)/h.length,gp=h.reduce((a,x)=>a+Math.abs(x.gap),0)/h.length;const m=(pi+gp)*100;return {pi,gp,m,grade:m<1?'A':m<1.6?'B':m<2.4?'C':m<3.5?'D':'F'}}
  function draw(){
    const w=360,h=150,xs=[0,N];
    const P1=g.plot({x:70,y:40,w:w,h:h,xr:xs,yr:[-.06,.06],nx:6,ny:4,title:'Output gap (spending vs capacity)'});
    const P2=g.plot({x:70,y:270,w:w,h:h,xr:xs,yr:[-.04,.12],nx:6,ny:4,title:'Inflation vs the 2% target'});
    const P3=g.plot({x:500,y:40,w:300,h:h,xr:xs,yr:[0,.12],nx:6,ny:4,title:'Policy rate (you)'});
    const P4=g.plot({x:500,y:270,w:300,h:h,xr:xs,yr:[0,.16],nx:6,ny:4,title:'Unemployment'});
    const pts=k=>hist.map(x=>[x.q,x[k]]);
    let o=P1.svg+P2.svg+P3.svg+P4.svg;
    o+=P1.line([[0,0],[N,0]],'gray',{cls:'dash thin'})+P1.clip(P1.line(pts('gap'),'blue',{w:2.6}));
    o+=g.R(P2.x,P2.sy(.03),P2.w,P2.sy(.01)-P2.sy(.03),{fill:'var(--green-bg)',op:.9})+P2.line([[0,.02],[N,.02]],'green',{cls:'dash thin'})+P2.clip(P2.line(pts('pi'),'red',{w:2.6}));
    o+=P3.clip(P3.line(pts('rate'),'orange',{w:2.6}))+P4.clip(P4.line(pts('u'),'purple',{w:2.6}));
    [[P1,-.06,.06,v=>F.p(v,0)],[P2,-.04,.12,v=>F.p(v,0)],[P3,0,.12,v=>F.p(v,0)],[P4,0,.16,v=>F.p(v,0)]].forEach(([P,a,b,f])=>{for(let i=0;i<=4;i++){const v=a+(b-a)*i/4;o+=g.T(P.x-6,P.sy(v)+3,f(v),{a:'end',cls:'m',size:9.5})}});
    [0,20,40,60].forEach(q=>{[P2,P4].forEach(P=>o+=g.T(P.sx(q),P.y+P.h+14,'Y'+(q/4),{a:'middle',cls:'m',size:9.5}))});
    events.forEach(([q,t])=>{[P1,P2,P3,P4].forEach(P=>o+=g.R(P.sx(q)-1,P.y,2,P.h,{fill:'var(--yellow)',op:.6}))});
    const L=hist[hist.length-1];
    o+=g.pill(P1.x+P1.w-50,P1.y+16,F.p(L.gap,1),'blue')+g.pill(P2.x+P2.w-50,P2.y+16,F.p(L.pi,1),'red')+g.pill(P3.x+P3.w-46,P3.y+16,F.p(rate,2),'orange')+g.pill(P4.x+P4.w-46,P4.y+16,F.p(L.u,1),'purple');
    o+=g.T(430,462,`Quarter ${s.q} of ${N}`+(s.q>=N?' · finished':''),{a:'middle',cls:'b'});
    st.innerHTML=svg(o);
  }
  function sync(){
    const sc=score();
    $('#rate').value=rate*100;$('#rateV').textContent=F.p(rate,2);$('#rate').disabled=auto;
    $('#playB').innerHTML=running?`${icon('timer',13)}Pause`:`${icon('play',13)}${s.q?'Resume':'Start'}`;
    $('#autoB').classList.toggle('on',auto);
    $('#kpi').innerHTML=`<div><small>Inflation</small><b>${F.p(s.pi,1)}</b></div><div><small>Output gap</small><b>${F.p(s.gap,1)}</b></div><div><small>Real rate (rate − expected inflation)</small><b>${F.p(rate-s.pe,1)}</b></div><div><small>Score so far</small><b>${sc?sc.grade:'—'}</b></div>`;
    $('#log').innerHTML=events.slice().reverse().map(([q,t])=>`<div>Q${q}: ${esc(t)}</div>`).join('')||'<div>No shocks yet. They arrive at random.</div>';
  }
  ctl.innerHTML=`<h3>${icon('bank',15)} You run the Central Bank of Nusa</h3>
    <p>Keep inflation near 2% and spending near capacity for 15 years (60 quarters). Raise the rate to cool a boom, cut it to fight a recession. Shocks hit at random. The economy reacts with a lag, just like the real one.</p>
    ${slider('rate','Policy rate',0,12,.25,4,'Higher rate → borrowing is more expensive → less credit → less spending → lower inflation, a few quarters later.',v=>F.p(v/100,2))}
    <div class="lab-btns"><button class="btn" id="playB"></button><button class="btn" id="stepB">${icon('arrow',13)}1 quarter</button><button class="btn" id="autoB" title="Let a Taylor rule set the rate">${icon('gear',13)}Autopilot</button><button class="btn" id="resetB">${icon('repeat',13)}Reset</button></div>
    <div class="lab-btns"><button class="btn" data-sh="boom">+ Credit boom</button><button class="btn" data-sh="bust">− Confidence crash</button><button class="btn" data-sh="oil">Oil shock</button></div>
    <div class="lab-kpis" id="kpi"></div>
    <div class="lab-log" id="log"></div>
    <p><b>Try:</b> leave the rate fixed at 4% and hit “Credit boom”. Inflation keeps climbing, because rising inflation lowers the <i>real</i> rate and feeds more borrowing. Then switch on Autopilot (the Taylor rule from lesson 4.5) and compare.</p>`;
  $('#rate').oninput=e=>{rate=+e.target.value/100;$('#rateV').textContent=F.p(rate,2)};
  $('#playB').onclick=()=>running?stop():(s.q>=N?(reset(),play()):play());
  $('#stepB').onclick=()=>{stop();tick()};
  $('#autoB').onclick=()=>{auto=!auto;sync()};
  $('#resetB').onclick=()=>{stop();reset()};
  ctl.querySelectorAll('[data-sh]').forEach(b=>b.onclick=()=>{shockNow(b.dataset.sh);sync()});
  reset();
}

/* ================================================================== 2. deleveraging mixer */
function delevLab(st,ctl){
  const m=Object.assign({},E.MIX.nothing);
  function draw(){
    const R=E.delev(m),rows=R.rows,yr=[0,12];
    const P1=g.plot({x:70,y:40,w:350,h:160,xr:yr,yr:[0,6],nx:6,ny:6,title:'Private debt ÷ income'});
    const P2=g.plot({x:500,y:40,w:300,h:160,xr:yr,yr:[-.06,.18],nx:6,ny:4,title:'Inflation'});
    const P3=g.plot({x:70,y:275,w:350,h:150,xr:yr,yr:[-.12,.08],nx:6,ny:4,title:'Real growth'});
    const P4=g.plot({x:500,y:275,w:300,h:150,xr:yr,yr:[0,.2],nx:6,ny:4,title:'Unemployment'});
    let o=P1.svg+P2.svg+P3.svg+P4.svg;
    const ln=(P,k,c)=>P.clip(P.line(rows.map(r=>[r.y,r[k]]),c,{w:2.8}))+P.pts(rows.map(r=>({x:r.y,y:U.clamp(r[k],P.yr[0],P.yr[1]),c})),3);
    o+=P1.line([[0,3],[12,3]],'gray',{cls:'dash thin'})+ln(P1,'d','blue');
    o+=g.R(P2.x,P2.sy(.04),P2.w,P2.sy(0)-P2.sy(.04),{fill:'var(--green-bg)',op:.9})+P2.line([[0,0],[12,0]],'gray',{cls:'dash thin'})+ln(P2,'infl','red');
    o+=P3.line([[0,0],[12,0]],'gray',{cls:'dash thin'})+ln(P3,'real','green')+ln(P4,'u','purple');
    [[P1,0,6,v=>(v*100).toFixed(0)+'%',6],[P2,-.06,.18,v=>F.p(v,0),4],[P3,-.12,.08,v=>F.p(v,0),4],[P4,0,.2,v=>F.p(v,0),4]].forEach(([P,a,b,f,n])=>{for(let i=0;i<=n;i++){const v=a+(b-a)*i/n;o+=g.T(P.x-6,P.sy(v)+3,f(v),{a:'end',cls:'m',size:9.5})}});
    [0,4,8,12].forEach(y=>[P3,P4].forEach(P=>o+=g.T(P.sx(y),P.y+P.h+14,'year '+y,{a:'middle',cls:'m',size:9.5})));
    o+=g.pill(P1.x+P1.w-60,P1.y+18,(R.last.d*100).toFixed(0)+'% at year 12','blue');
    st.innerHTML=svg(o);
    const V={beautiful:['Beautiful deleveraging','Debt burdens fall, inflation stays tame and growth comes back. The deflationary levers and the inflationary levers balance.'],painful:['Better, but painful','Moving in the right direction, but either debt is still too high or unemployment got too high on the way.'],deflationary:['Ugly: deflationary','Too much belt-tightening or default and not enough money. Incomes fall faster than debt, so the burden gets worse (think 1930–32).'],inflationary:['Ugly: inflationary','Too much printing. Debt melts away, but so does the currency (think Weimar Germany 1922–23).']}[R.verdict];
    $('#verdict').className='verdict v-'+R.verdict;$('#verdict').innerHTML=`<b>${V[0]}</b>${V[1]}`;
    $('#kpi').innerHTML=`<div><small>Debt ÷ income</small><b>300% → ${(R.last.d*100).toFixed(0)}%</b></div><div><small>Peak inflation</small><b>${F.p(R.mx,1)}</b></div><div><small>Real income after 12 yrs</small><b>${F.pp(R.cumReal,0)}</b></div><div><small>Peak unemployment</small><b>${F.p(R.peakU,0)}</b></div>`;
  }
  const defs=[['cut','Spending cuts (austerity)',0,6,.5,'% of income a year cut to repay debt. Deflationary.'],['write','Defaults & restructuring',0,8,.5,'% of debt written down each year. Deflationary.'],['transfer','Government spending & redistribution',0,8,.5,'Deficit spending, unemployment aid, stimulus, funded by taxing the rich and borrowing. Supports incomes.'],['print','Money printing (bond buying)',0,20,1,'Central bank buys bonds with new money. Inflationary; replaces disappearing credit.']];
  ctl.innerHTML=`<h3>${icon('scale',15)} Deleveraging mixer</h3><p>Nusa’s private debt is 300% of income, rates are already 0% and credit is shrinking. Choose how to bring the burden down over 12 years.</p>
    ${defs.map(([k,l,a,b,s,h])=>slider('m_'+k,l,a,b,s,m[k],h,v=>v+'%')).join('')}
    <div class="lab-btns">${Object.entries(E.MIX).map(([k,v])=>`<button class="btn" data-mix="${k}">${esc(v.label)}</button>`).join('')}</div>
    <div class="verdict" id="verdict"></div><div class="lab-kpis" id="kpi"></div>`;
  const set=()=>{defs.forEach(([k])=>{$('#m_'+k).value=m[k];$('#m_'+k+'V').textContent=m[k]+'%'});draw()};
  defs.forEach(([k])=>$('#m_'+k).oninput=e=>{m[k]=+e.target.value;$('#m_'+k+'V').textContent=m[k]+'%';draw()});
  ctl.querySelectorAll('[data-mix]').forEach(b=>b.onclick=()=>{Object.assign(m,E.MIX[b.dataset.mix]);set()});
  set();
}

/* ================================================================== 3. long-cycle builder */
function cycleLab(st,ctl){
  const p={dUp:5.2,dDn:4,tol:10.5,cut:3.5};
  function draw(){
    const M=E.machine({dUp:p.dUp/100,dDn:p.dDn/100,tol:p.tol/100,cut:p.cut/100,years:160}),Y=M.yrs,end=Y[Y.length-1].t;
    const xr=[0,Math.max(60,Math.ceil(end/10)*10)];
    const P1=g.plot({x:70,y:40,w:730,h:175,xr,yr:[0,4],nx:xr[1]/10,ny:4,title:'Debt ÷ income: each boom adds more than each recession removes'});
    const P2=g.plot({x:70,y:270,w:730,h:150,xr,yr:[0,.16],nx:xr[1]/10,ny:4,title:'Interest rate: each peak is lower, until there is no room left to cut'});
    let o=P1.svg+P2.svg;
    const dl=Y.find(y=>y.phase==='deleveraging');
    if(dl){o+=g.band(P1,dl.t,end,'red','deleveraging',{ly:P1.h-8})+g.band(P2,dl.t,end,'red','')}
    let segs=[],cur=null;Y.forEach(y=>{if(y.phase==='recession'){if(!cur){cur=[y.t,y.t];segs.push(cur)}cur[1]=y.t+.25}else cur=null});
    segs.forEach(([a,b])=>{o+=g.R(P1.sx(a),P1.y,P1.sx(b)-P1.sx(a),P1.h,{fill:'var(--gray-bg)',op:.9})+g.R(P2.sx(a),P2.y,P2.sx(b)-P2.sx(a),P2.h,{fill:'var(--gray-bg)',op:.9})});
    o+=P1.line(Y.map(y=>[y.t,y.d]),'blue',{w:2.8})+P2.line(Y.map(y=>[y.t,y.rate]),'orange',{w:2.6});
    [0,1,2,3,4].forEach(v=>o+=g.T(P1.x-6,P1.sy(v)+3,v*100+'%',{a:'end',cls:'m',size:9.5}));
    [0,.04,.08,.12,.16].forEach(v=>o+=g.T(P2.x-6,P2.sy(v)+3,F.p(v,0),{a:'end',cls:'m',size:9.5}));
    for(let t=0;t<=xr[1];t+=10)o+=g.T(P2.sx(t),P2.y+P2.h+14,'yr '+t,{a:'middle',cls:'m',size:9.5});
    if(M.peakIdx!=null)o+=g.pill(P1.sx(M.peakT),P1.sy(M.peakD)-16,`debt peak: year ${M.peakT}`,'red');
    st.innerHTML=svg(o);
    $('#kpi').innerHTML=`<div><small>Short cycles before the peak</small><b>${M.peakIdx==null?'none yet':M.peakIdx}</b></div><div><small>Year rates hit 0%</small><b>${M.peakIdx==null?'—':M.peakT}</b></div><div><small>Debt ÷ income at peak</small><b>${(M.peakD*100).toFixed(0)}%</b></div><div><small>First rate peak</small><b>${F.p(Math.max(...M.yrs.filter(y=>y.n===0).map(y=>y.rate)),1)}</b></div>`;
  }
  const defs=[['dUp','Borrowing in each boom',2,9,.2,'How fast debt grows relative to income each boom year.'],['dDn','Paying down in each recession',0,9,.2,'How much of it gets repaid in a recession year.'],['tol','Debt-service ceiling',6,16,.5,'Most of their income people will spend servicing debt. Lenders loosen this when memories fade.'],['cut','Rate cut needed to end a recession',1,6,.25,'How many points the central bank must cut to restart borrowing.']];
  ctl.innerHTML=`<h3>${icon('repeat',15)} Long-cycle builder</h3><p>Each 7-year short cycle is a 5-year boom and a 2-year recession. Change the habits of borrowers, lenders and the central bank and see how long it takes to reach the long-term debt peak.</p>
    ${defs.map(([k,l,a,b,s,h])=>slider('c_'+k,l,a,b,s,p[k],h,v=>v+'%')).join('')}
    <div class="lab-kpis" id="kpi"></div>
    <p><b>Try:</b> set “Paying down” equal to “Borrowing” × 5 ÷ 2 (so a recession undoes a boom). The ratchet disappears and there is no long-term debt cycle. That is Dalio’s first rule of thumb: don’t let debt rise faster than income.</p>`;
  defs.forEach(([k])=>$('#c_'+k).oninput=e=>{p[k]=+e.target.value;$('#c_'+k+'V').textContent=p[k]+'%';draw()});
  draw();
}
})();
