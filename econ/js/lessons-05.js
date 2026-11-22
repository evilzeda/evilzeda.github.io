/* 05 · Core Forces & Cycles */
(function(){const U=ML.U,E=ML.EC,F=E.F;
const M=E.machine(),Y=M.yrs,PK=M.peakT,C=M.cycles;
const PKR=C.map(c=>Math.max(0,...Y.filter(y=>y.n===c.n).map(y=>y.rate)));
const yt=(P,step,lab='yr ')=>{let s='';for(let t=P.xr[0];t<=P.xr[1]+1e-9;t+=step)s+=ML.g.T(P.sx(t),P.y+P.h+14,lab+Math.round(t),{a:'middle',cls:'m'});return s};
const yl=(P,vals,fmt)=>vals.map(v=>ML.g.T(P.x-6,P.sy(v)+3,fmt(v),{a:'end',cls:'m'})).join('');
const recBands=(g,P,from,to)=>{let s='',cur=null;Y.forEach(y=>{if(y.t<from||y.t>to)return;if(y.phase==='recession'){if(!cur){cur=[y.t,y.t];}cur[1]=y.t+.25}else if(cur){s+=g.R(P.sx(cur[0]),P.y,P.sx(cur[1])-P.sx(cur[0]),P.h,{fill:'var(--gray-bg)',op:.95});cur=null}});if(cur)s+=g.R(P.sx(cur[0]),P.y,P.sx(cur[1])-P.sx(cur[0]),P.h,{fill:'var(--gray-bg)',op:.95});return s};

/* ======================================================= productivity */
const PR=[.01,.02,.03].map(r=>({r,v:U.range(51).map(y=>[y,100*Math.pow(1+r,y)])}));
ML.add({id:'productivity',title:'Productivity Growth',min:8,lvl:'Beginner',
sub:'Knowledge and innovation raise output per person. Slow, steady, and the thing that matters most in the long run.',
keys:'productivity growth innovation living standards total factor productivity long run growth',
learn:['What productivity is','Why it grows slowly','How small differences compound','Why it matters most in the long run'],
cheat:['<b>Productivity</b> = output per hour or per worker. It rises with knowledge, skills, tools and better organisation.','It grows slowly (≈1–2% a year in rich countries) but compounds into huge gains.','Dalio: in the long run productivity matters most; in the short run credit matters most.','Credit can borrow from the future; only productivity raises what the future can repay.'],
met:[['g','Growth','trend'],['x50','After 50 years','layers']],
draw(si,g){
  const s=[];
  if(si===0){
    [['knowledge','book'],['tools & machines','cpu'],['skills','user'],['better organisation','grid']].forEach(([t,ic],i)=>{const x=140+i*195;s.push(g.icon(ic,x,150,34),g.box(x,230,170,56,t,'green',{hot:1}))});
    s.push(g.A(430,280,430,340,{c:'green'}),g.box(430,375,300,56,'more output per hour of work','green',{hot:1}));
  }else{
    const P=g.plot({x:90,y:40,w:640,h:350,xr:[0,50],yr:[0,450],nx:5,ny:3,yl:'income per person (today = 100)'});
    s.push(P.svg);(si===1?PR.slice(1,2):PR).forEach((p,i)=>{const c=['blue','green','purple'][si===1?1:i];s.push(P.line(p.v,c,{w:3}),g.T(P.sx(50)+6,P.sy(p.v[50][1])+4,`${F.p(p.r,0)}/yr → ${p.v[50][1].toFixed(0)}`,{cls:'b',c}))});
    s.push(yt(P,10,'yr '),yl(P,[0,150,300,450],v=>v));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Working smarter',short:'What',m:{g:'slow'},
  b:'Over time people learn and invent: better seeds for Budi, a faster machine for Sari, smarter ways to organise work. Each lets an hour of work produce more. That is <b>productivity growth</b>, and it is the main reason living standards rise.'},
 {k:'math',t:'Slow but compounding',short:'Compounding',m:{g:'2% / yr',x50:'2.7×'},
  b:'Productivity rarely jumps. About 2% a year is typical for a rich economy. But compounded over 50 years, 2% a year makes everyone about <b>2.7×</b> richer.'},
 {k:'insight',t:'Small differences, huge gaps',short:'1% vs 3%',m:{x50:'1.6× vs 4.4×'},
  b:'At 1% a year you end up 1.6× richer after 50 years; at 3%, 4.4×. That gap is why productivity is Dalio’s third rule of thumb: <b>do all you can to raise it</b>.\n\nCredit swings the economy around this line; it cannot lift the line itself, unless it funds productive investment (lesson 2.6).',
  ch:['+ Long run: productivity matters most','+ Short run: credit matters most']}
]});

/* ======================================================= short-term debt cycle */
const SC=Y.filter(y=>y.t>=C[2].start&&y.t<=C[2].start+7);
const PH=[['Expansion','credit easy, spending ↑','green'],['Overheating','inflation ↑','orange'],['Tightening','central bank raises rates','red'],['Recession','credit ↓, spending ↓','blue'],['Easing','rates cut','purple']];
ML.add({id:'short-cycle',title:'The Short-Term Debt Cycle',min:11,lvl:'Intermediate',
sub:'A 5–8 year rhythm of easy credit, overheating, tightening, recession and easing, set by the central bank.',
keys:'short term debt cycle business cycle expansion recession interest rates credit 5 to 8 years',
learn:['The phases of the short cycle','How credit drives the upswing','How rates end the boom','How cuts restart it'],
cheat:['Expansion: credit is cheap → spending and incomes rise faster than output.','Inflation rises → the central bank raises rates → borrowing slows → spending falls → recession.','Inflation falls → the central bank cuts rates → borrowing restarts → expansion.','Each cycle lasts ≈5–8 years and is controlled mainly by the central bank.'],
met:[['ph','Phase','repeat'],['r','Rate','gear'],['gap','Spending vs capacity','trend']],
hero:1,
draw(si,g){
  const s=[];
  if(si===0){
    PH.forEach(([t,sub,c],i)=>{const a=i/5*Math.PI*2-Math.PI/2,x=430+Math.cos(a)*215,y=245+Math.sin(a)*160;s.push(g.box(x,y,190,58,t,c,{hot:1,sub}))});
    s.push(g.T(430,250,'≈ 5–8 years',{a:'middle',cls:'b',size:15}));
  }else{
    const P1=g.plot({x:80,y:40,w:720,h:170,xr:[SC[0].t,SC[0].t+7],yr:[-.03,.03],nx:7,ny:2,title:'Spending vs capacity (output gap)'});
    const P2=g.plot({x:80,y:260,w:720,h:150,xr:[SC[0].t,SC[0].t+7],yr:[0,.09],nx:7,ny:3,title:'Interest rate & inflation'});
    s.push(P1.svg,P2.svg,recBands(g,P1,SC[0].t,SC[0].t+7),recBands(g,P2,SC[0].t,SC[0].t+7));
    s.push(P1.line([[SC[0].t,0],[SC[0].t+7,0]],'gray',{cls:'dash thin'}),P1.line(SC.map(y=>[y.t,y.gap]),'blue',{w:3}));
    s.push(P2.line(SC.map(y=>[y.t,y.rate]),'orange',{w:3}),P2.line(SC.map(y=>[y.t,y.infl]),'red',{w:2.4,cls:'dash'}),g.T(P2.sx(SC[0].t+.2),P2.sy(SC[0].rate)-8,'rate',{cls:'b',c:'orange'}),g.T(P2.sx(SC[0].t+3),P2.sy(SC[12].infl)+16,'inflation',{cls:'b',c:'red'}));
    s.push(yl(P1,[-.03,0,.03],v=>F.p(v,0)),yl(P2,[0,.03,.06,.09],v=>F.p(v,0)));
    for(let k=0;k<=7;k++)s.push(g.T(P2.sx(SC[0].t+k),P2.y+P2.h+14,'yr '+k,{a:'middle',cls:'m'}));
    const mark={1:[0,'expansion'],2:[3.8,'tightening'],3:[5.6,'recession'],4:[6.6,'easing']}[si];
    if(mark)s.push(g.R(P1.sx(SC[0].t+mark[0])-1,P1.y,2,P2.y+P2.h-P1.y,{fill:'var(--yellow)'}),g.pill(P1.sx(SC[0].t+mark[0]),P1.y+16,mark[1],'yellow'));
  }
  return s.join('');
},
anim(si,t,g){if(si!==0)return '';const a=(t*.5)%(Math.PI*2)-Math.PI/2;return g.C(430+Math.cos(a)*140,245+Math.sin(a)*100,8,'yellow')},
steps:[
 {k:'setup',t:'The rhythm',short:'Phases',
  b:'Dalio’s short-term debt cycle (most people call it the business cycle) repeats every 5–8 years. It has a simple rhythm driven by credit, and the central bank sets the tempo.',
  n:['Credit is cheap, spending grows','Spending outruns output: inflation','Central bank raises rates','Borrowing and spending fall: recession','Central bank cuts rates, and it starts again']},
 {k:'technique',t:'Expansion',short:'Expansion',m:{ph:'expansion',r:'low → rising',gap:'+'},
  b:'Rates are low after the last recession, so borrowing is cheap. Credit grows, spending grows, and because spending is income, incomes grow too. Spending soon runs above what the economy can produce (the blue line rises above zero).'},
 {k:'problem',t:'Overheating and tightening',short:'Tightening',m:{ph:'tightening',r:'peak'},
  b:'With spending above capacity, inflation creeps up. The central bank raises rates. Debt payments rise, fewer people can afford new loans, and credit growth slows.'},
 {k:'problem',t:'Recession',short:'Recession',m:{ph:'recession',gap:'−'},
  b:'Less credit means less spending, and less spending means lower incomes for others. The economy contracts: a <b>recession</b>. Inflation falls back.'},
 {k:'solution',t:'Easing and restart',short:'Easing',m:{ph:'easing',r:'cut'},
  b:'With inflation down, the central bank cuts rates. Debt payments fall, borrowing becomes attractive again, and a new expansion begins. Then the whole thing repeats.',
  tip:['Lab','“Be the central bank” lets you run this cycle yourself, quarter by quarter.']}
]});

/* ======================================================= recession */
ML.add({id:'recession',title:'Recession',min:8,lvl:'Beginner',
sub:'A period of falling spending, incomes and activity. In a normal cycle, lower interest rates fix it.',
keys:'recession two quarters gdp unemployment nber falling spending rate cuts',
learn:['What a recession is','What happens to jobs and incomes','How rate cuts end it','Recession vs deleveraging'],
cheat:['<b>Recession</b> = a broad fall in spending, income, output and jobs. Rule of thumb: two quarters of falling GDP; the US NBER uses a broader judgment.','In the short-term cycle, recessions come when credit is tightened and end when rates are cut.','A recession that rate cuts can fix is <b>not</b> a deleveraging.'],
met:[['u','Unemployment','user'],['r','Rate','gear']],
draw(si,g){
  const s=[];
  if(si===0){['credit tightens','spending falls','incomes fall','firms cut jobs'].forEach((t,i)=>{s.push(g.box(130+i*200,220,170,62,t,['orange','blue','red','purple'][i],{hot:1}));if(i)s.push(g.A(130+i*200-100,220,130+i*200-86,220,{c:'edge'}))})}
  else if(si===1){const r=E.cbRun('taylor',{shocks:{4:{dshock:-.03}},n:28});const P=g.plot({x:100,y:50,w:620,h:330,xr:[0,28],yr:[0,.1],nx:7,ny:4,title:'Unemployment and the policy rate after a credit crunch'});
    s.push(P.svg,P.line(r.map(x=>[x.q,x.u]),'purple',{w:3}),P.line(r.map(x=>[x.q,x.rate]),'orange',{w:3}),g.T(P.sx(27),P.sy(r[27].u)-10,'unemployment',{a:'end',cls:'b',c:'purple'}),g.T(P.sx(27),P.sy(r[27].rate)+18,'policy rate',{a:'end',cls:'b',c:'orange'}),yl(P,[0,.025,.05,.075,.1],v=>F.p(v,1)));
    for(let q=0;q<=28;q+=4)s.push(g.T(P.sx(q),P.y+P.h+14,'Q'+q,{a:'middle',cls:'m'}))}
  else{s.push(g.table(110,90,[{t:'',w:220,a:'l'},{t:'Recession',w:200,a:'l'},{t:'Deleveraging',w:220,a:'l'}],[{c:['Cause','credit tightened','debt burden too high']},{c:['Rates at start','room to cut','already ≈ 0%']},{c:['Fix','cut rates','four levers (Module 06)']},{c:['Length','months to ~2 years','often ~10 years']},{c:['How often','every 5–8 years','every 75–100 years']}],{rh:40}))}
  return s.join('');
},
steps:[
 {k:'setup',t:'The chain going down',short:'What',m:{u:'rising'},
  b:'A <b>recession</b> is the down-leg of the short-term cycle: credit tightens, spending falls, incomes fall (because spending is income), firms cut jobs, and those people spend even less.'},
 {k:'solution',t:'Rate cuts end it',short:'Fix',m:{r:'cut'},
  b:'In Nusa’s model a credit crunch pushes unemployment up. The central bank cuts rates; within a couple of years borrowing recovers and unemployment comes back down. That is a normal recession: painful but self-correcting with lower rates.'},
 {k:'insight',t:'Not every slump is a recession',short:'vs deleveraging',
  b:'If rates are already near zero when the slump hits, cutting them is no longer possible, and the debt burden itself is the problem. Dalio calls that a <b>deleveraging</b>: rarer, longer and needing different tools.'}
]});

/* ======================================================= long-term debt cycle */
ML.add({id:'long-cycle',title:'The Long-Term Debt Cycle',min:12,lvl:'Intermediate',
sub:'Each short cycle ends with more debt than the last. Over 75–100 years debts rise faster than incomes until they can’t.',
keys:'long term debt cycle leveraging debt to income ratchet supercycle dalio 75 100 years',
learn:['The debt ratchet across short cycles','Why each rate peak is lower','Why people keep borrowing','How it ends'],
cheat:['In each short cycle debt rises more in the boom than it falls in the recession: the <b>ratchet</b>.','Debt grows faster than income for decades; the debt burden rises.','As debt grows, the rate that the economy can bear falls, so each rate peak is lower.','Ends when rates hit ~0% and debt service still can’t fall enough: the long-term debt peak.'],
met:[['d','Debt ÷ income','scale'],['n','Short cycles','repeat'],['r','Rate peak','gear']],
hero:2,
draw(si,g){
  const s=[];const end=si>=3?PK+12:si>=2?PK:21,xr=[0,si>=3?PK+12:si>=2?PK:21];
  const P1=g.plot({x:80,y:40,w:720,h:190,xr,yr:[0,3.2],nx:Math.round(xr[1]/7),ny:4,title:'Debt ÷ income'});
  const P2=g.plot({x:80,y:280,w:720,h:130,xr,yr:[0,.12],nx:Math.round(xr[1]/7),ny:3,title:'Interest rate'});
  s.push(P1.svg,P2.svg,recBands(g,P1,0,end),recBands(g,P2,0,end));
  const yy=Y.filter(y=>y.t<=end);
  const dl=yy.find(y=>y.phase==='deleveraging');if(dl){s.push(g.band(P1,dl.t,end,'red','deleveraging',{ly:P1.h-8}),g.band(P2,dl.t,end,'red',''))}
  s.push(P1.line(yy.map(y=>[y.t,y.d]),'blue',{w:3}),P2.line(yy.map(y=>[y.t,y.rate]),'orange',{w:2.8}));
  if(si>=1)C.filter(c=>c.start<end&&!c.zlb).forEach(c=>{const cy=Y.filter(y=>y.n===c.n);if(!cy.length)return;const pk=cy.reduce((a,b)=>b.rate>a.rate?b:a);s.push(P2.pts([{x:pk.t,y:pk.rate,c:'orange',r:4}],4))});
  s.push(yl(P1,[0,1,2,3],v=>v*100+'%'),yl(P2,[0,.04,.08,.12],v=>F.p(v,0)));
  for(let t=0;t<=xr[1];t+=xr[1]>30?10:7)s.push(g.T(P2.sx(t),P2.y+P2.h+14,'yr '+t,{a:'middle',cls:'m'}));
  if(si===0)s.push(g.pill(P1.sx(5),P1.sy(C[0].d0+.26)-14,'boom: +26%','green'),g.pill(P1.sx(7),P1.sy(C[1].d0)+20,'recession: −8%','red'));
  if(si>=2)s.push(g.pill(P1.sx(PK),P1.sy(M.peakD)-16,`peak ${(M.peakD*100).toFixed(0)}% · yr ${PK}`,'red'));
  return s.join('');
},
anim(si,t,g){if(si!==2)return '';const P=g.plot({x:80,y:40,w:720,h:190,xr:[0,PK],yr:[0,3.2],grid:false});const yy=Y.filter(y=>y.t<=PK),i=Math.floor((t*14)%yy.length);return g.C(P.sx(yy[i].t),P.sy(yy[i].d),7,'yellow')},
steps:[
 {k:'setup',t:'The ratchet',short:'Ratchet',m:{d:'100% → 118%',n:'3'},
  b:'Look at Nusa’s first three short cycles. In each 5-year boom debt grows faster than income (+26 points); in each 2-year recession people pay down only a little (−8 points). Each cycle ends with more debt than it started with.\n\nGrey bands are recessions.'},
 {k:'insight',t:'Lower rate peaks',short:'Rates',m:{r:`${F.p(PKR[0],0)} → ${F.p(PKR[5],0)}`},
  b:`The more debt there is, the less of a rate rise borrowers can bear before their payments become crushing. So each tightening has to stop earlier: rate peaks fall from <b>${F.p(PKR[0],0)}</b> to <b>${F.p(PKR[5],0)}</b> and keep falling. Each recession is fixed by cutting from a lower starting point.`},
 {k:'insight',t:'Decades of leveraging',short:'Decades',m:{d:`${(M.peakD*100).toFixed(0)}%`,n:String(M.peakIdx)},
  b:`After <b>${M.peakIdx}</b> short cycles (${PK} years), debt is <b>${(M.peakD*100).toFixed(0)}%</b> of income. It felt like prosperity the whole time: incomes and asset prices rose, so lenders kept lending. Dalio’s point: debts rose faster than incomes, and that can’t go on forever.`,
  ch:['! Lenders and borrowers forget the last crisis: the ceiling on debt drifts up']},
 {k:'problem',t:'It ends',short:'End',m:{r:'0%'},
  b:'Eventually a recession hits when rates are already at zero (lesson 4.7). The debt burden can’t be reduced by cutting rates any more. The long-term cycle turns: a <b>deleveraging</b> begins (red band). In the US this happened in 1929 and 2008; in Japan in 1989–90.',
  tip:['Lab','The long-cycle builder lets you change the boom and bust habits and see when the peak comes.']}
]});

/* ======================================================= debt burden */
ML.add({id:'debt-burden',title:'The Debt Burden',min:9,lvl:'Intermediate',
sub:'Debt ÷ income tells you how big the pile is; debt service ÷ income tells you how much it hurts.',
keys:'debt burden debt to income debt service ratio leverage household debt gdp',
learn:['Debt-to-income vs debt service','How falling rates hid the rising pile','Rising asset values as a cushion','When the burden becomes crushing'],
cheat:['<b>Debt burden</b> = total debt ÷ income. <b>Debt service ratio</b> = payments due ÷ income.','Falling rates can keep debt service flat even as debt-to-income doubles.','Rising incomes and asset values keep the burden feeling manageable.','When debt service grows faster than income, people must cut spending: the turning point.'],
met:[['d','Debt ÷ income','scale'],['ds','Debt service ÷ income','alert']],
draw(si,g){
  const s=[];const yy=Y.filter(y=>y.t<=PK+4),xr=[0,PK+4];
  const P=g.plot({x:80,y:40,w:720,h:360,xr,yr:[0,si===0?3.2:.14],nx:8,ny:4});
  s.push(P.svg,recBands(g,P,0,PK));
  if(si===0){s.push(P.line(yy.map(y=>[y.t,y.d]),'blue',{w:3}),yl(P,[0,.8,1.6,2.4,3.2],v=>(v*100).toFixed(0)+'%'),g.T(P.x,P.y-8,'Debt ÷ income: the pile',{cls:'b'}))}
  else{s.push(P.clip(P.line(yy.map(y=>[y.t,y.dsr]),'red',{w:2.6})),P.line([[0,.105],[PK+4,.105]],'red',{cls:'dash thin'}),g.T(P.sx(1),P.sy(.105)-8,'ceiling: what borrowers can bear',{cls:'b',c:'red'}),yl(P,[0,.035,.07,.105,.14],v=>F.p(v,1)),g.T(P.x,P.y-8,'Debt service ÷ income: the pain',{cls:'b'}));
    if(si===2)s.push(g.panel(110,280,'Why it held',['rates kept falling','incomes and house prices rose'],'yellow',{w:280}))}
  for(let t=0;t<=xr[1];t+=10)s.push(g.T(P.sx(t),P.y+P.h+14,'yr '+t,{a:'middle',cls:'m'}));
  return s.join('');
},
steps:[
 {k:'setup',t:'The pile',short:'Pile',m:{d:`100% → ${(M.peakD*100).toFixed(0)}%`},
  b:`Over ${PK} years Nusa’s debt rises from 100% to ${(M.peakD*100).toFixed(0)}% of income. Dalio calls debt relative to income the <b>debt burden</b>.`},
 {k:'insight',t:'The pain stays flat',short:'Service',m:{ds:'hits the ceiling each boom'},
  b:'But what people feel is the payment, not the pile. Because rates fell cycle after cycle, the <b>debt-service ratio</b> rises to the same ceiling in each boom and falls back in each recession, even as the pile nearly triples. That is why a dangerous build-up can feel fine for decades.'},
 {k:'insight',t:'Manageable, until it isn’t',short:'Turning',
  b:'While incomes rise and asset values climb, the burden stays manageable. The turning point comes when rates can’t fall any more and payments start growing faster than income. Then people must cut spending, which cuts other people’s income (lesson 1.4), which makes the burden worse.',
  tip:['Real data','FRED: TDSP (US household debt service) and GFDEGDQ188S (federal debt to GDP).']}
]});

/* ======================================================= bubble */
const BB=U.range(41).map(i=>{const t=i/4;const p=t<7?100*Math.exp(.05*t+.012*t*t):100*Math.exp(.05*7+.012*49)*Math.exp(-.35*(t-7));return [t,p]});
ML.add({id:'bubble',title:'Bubbles',min:10,lvl:'Intermediate',
sub:'A boom driven by borrowed money, where people buy because they expect prices and incomes to keep rising.',
keys:'bubble asset bubble speculation leverage minsky reflexivity housing bubble 1929 2008 euphoria',
learn:['How borrowing feeds asset prices','The self-reinforcing loop','Minsky’s three stages of borrowers','Why the bust is so sharp'],
cheat:['<b>Bubble</b> = prices pushed far above what incomes can support, financed by borrowing.','Loop: prices ↑ → collateral ↑ → more lending → more buying → prices ↑.','Minsky: hedge → speculative → <b>Ponzi</b> borrowers (who can only repay if prices keep rising).','When prices stop rising, the loop runs backwards and leverage magnifies the fall.'],
met:[['px','House price index','trend'],['st','Stage','alert']],
draw(si,g){
  const s=[];
  if(si===0){const L=['house prices ↑','collateral worth more','banks lend more','more people buy'];L.forEach((t,i)=>{const a=i/4*Math.PI*2-Math.PI/2,x=430+Math.cos(a)*200,y=245+Math.sin(a)*145;s.push(g.box(x,y,200,54,t,['purple','yellow','pink','green'][i],{hot:1}));const a2=(i+1)/4*Math.PI*2-Math.PI/2;s.push(g.A(x+Math.cos(a+.6)*55,y+Math.sin(a+.6)*40,430+Math.cos(a2)*200-Math.cos(a2-.6)*55,245+Math.sin(a2)*145-Math.sin(a2-.6)*40,{c:'purple',curve:30}))});s.push(g.T(430,250,'the bubble loop',{a:'middle',cls:'b'}))}
  else if(si===1){s.push(g.table(90,90,[{t:'Borrower type (Minsky)',w:240,a:'l'},{t:'Income covers…',w:240,a:'l'},{t:'Share in a boom',w:200,a:'l'}],[{c:['Hedge','interest + principal','shrinking'],cc:[null,null,'green']},{c:['Speculative','interest only','growing'],cc:[null,null,'yellow']},{c:['Ponzi','neither: needs prices to rise','growing fast'],cc:[null,null,'red'],tone:'red'}],{rh:44}))}
  else{const P=g.plot({x:90,y:40,w:640,h:360,xr:[0,10],yr:[50,400],nx:5,ny:7,yl:'house price index'});const n=si===2?29:41;s.push(P.svg,P.line(BB.slice(0,n),'purple',{w:3}),yl(P,[50,150,250,350],v=>v));for(let t=0;t<=10;t+=2)s.push(g.T(P.sx(t),P.y+P.h+14,'yr '+t,{a:'middle',cls:'m'}));
    if(si===3)s.push(g.pill(P.sx(7),P.sy(BB[28][1])-16,'prices stop rising','red'),g.panel(110,60,'Leverage cuts both ways',['house −20% with a 90% loan','→ owner’s equity wiped out x2'],'red',{w:280}))}
  return s.join('');
},
anim(si,t,g){if(si!==0)return '';const a=(t*.8)%(Math.PI*2)-Math.PI/2;return g.C(430+Math.cos(a)*120,245+Math.sin(a)*85,7,'purple')},
steps:[
 {k:'setup',t:'Borrowing to buy assets',short:'The loop',m:{st:'boom'},
  b:'Late in the long cycle, more and more credit goes into assets: houses, shares, land. Rising prices make the assets better collateral, so banks lend more, so more people buy, so prices rise further. Dalio: people buy because they expect prices and incomes to keep rising.'},
 {k:'insight',t:'Who is borrowing?',short:'Minsky',m:{st:'speculative → Ponzi'},
  b:'Hyman Minsky sorted borrowers into three kinds. <b>Hedge</b> borrowers can repay from income. <b>Speculative</b> borrowers can only pay the interest. <b>Ponzi</b> borrowers can’t even pay that: they need prices to keep rising so they can refinance or sell. A long boom shifts the mix towards Ponzi.'},
 {k:'problem',t:'Up and up',short:'Up',m:{px:'×3.3'},
  b:'Prices race ahead of incomes. Each year of gains convinces more people that prices only go up, and the borrowing that drives them grows faster than the incomes that must repay it.'},
 {k:'problem',t:'The loop runs backwards',short:'Bust',m:{px:'−60%',st:'bust'},
  b:'All it takes is for prices to stop rising. Ponzi borrowers default, banks tighten, forced sales push prices down, collateral shrinks, lending shrinks further. Leverage magnifies the fall: with a 90% loan, a 10% price fall wipes out the owner’s stake. This is how a bubble pops into a debt crisis (1929, Japan 1990, 2008).',
  ch:['! A “Minsky moment” is when that switch happens']}
]});

/* ======================================================= long-term debt peak */
ML.add({id:'debt-peak',title:'The Long-Term Debt Peak',min:9,lvl:'Intermediate',
sub:'The turning point: debt payments grow faster than incomes, rates are at zero, and spending has to be cut.',
keys:'long term debt peak minsky moment 1929 2008 japan 1990 zero rates deleveraging begins',
learn:['What triggers the peak','Why rate cuts no longer work','Why everything turns down at once','Historical peaks'],
cheat:['The peak arrives when <b>debt repayments rise faster than incomes</b> and rates can’t be cut further.','Borrowers must cut spending → incomes fall → creditworthiness falls → credit shrinks: the self-reinforcing loop reverses.','Asset prices fall, collateral falls, banks get squeezed, bank runs become possible.','Examples: US 1929, Japan 1989–90, US/Europe 2008.'],
met:[['d','Debt ÷ income','scale'],['r','Rate','gear']],
draw(si,g){
  const s=[];
  if(si<=1){const yy=Y.filter(y=>y.t>=PK-14&&y.t<=PK+6),P=g.plot({x:90,y:40,w:640,h:360,xr:[PK-14,PK+6],yr:[1.8,3.2],nx:5,ny:7,yl:'debt ÷ income'});
    s.push(P.svg,recBands(g,P,PK-14,PK),g.band(P,PK,PK+6,'red','deleveraging',{ly:P.h-8}),P.line(yy.map(y=>[y.t,y.d]),'blue',{w:3}),yl(P,[1.8,2.2,2.6,3],v=>(v*100).toFixed(0)+'%'),g.pill(P.sx(PK),P.sy(M.peakD)-16,'the peak','red'));
    for(let t=PK-14;t<=PK+6;t+=4)s.push(g.T(P.sx(t),P.y+P.h+14,'yr '+t,{a:'middle',cls:'m'}));
    if(si===1)s.push(g.panel(110,60,'At the peak',['rate already ≈ 0%','debt payments > what income allows','→ spending must be cut'],'red',{w:320}))}
  else if(si===2){const L=['spending cut','incomes fall','borrowers less creditworthy','credit shrinks','asset prices fall','collateral falls'];L.forEach((t,i)=>{const a=i/6*Math.PI*2-Math.PI/2,x=430+Math.cos(a)*240,y=245+Math.sin(a)*165;s.push(g.box(x,y,200,48,t,'red',{hot:1}))});s.push(g.T(430,250,'everything turns at once',{a:'middle',cls:'b'}))}
  else{s.push(g.table(110,100,[{t:'Peak',w:180,a:'l'},{t:'What popped',w:260,a:'l'},{t:'Rates at the time',w:200,a:'l'}],[{c:['US 1929','stocks bought on margin','cut to ~0% by early 1930s']},{c:['Japan 1989–90','land & stocks','cut to ~0% by 1999']},{c:['US / Europe 2008','housing, bank leverage','cut to ~0% by end-2008']}],{rh:44}))}
  return s.join('');
},
anim(si,t,g){if(si!==2)return '';const a=(t*.7)%(Math.PI*2)-Math.PI/2;return g.C(430+Math.cos(a)*150,245+Math.sin(a)*100,8,'red')},
steps:[
 {k:'setup',t:'The top of the pile',short:'Peak',m:{d:`${(M.peakD*100).toFixed(0)}%`,r:'≈0%'},
  b:`In year ${PK} Nusa’s debt reaches its peak at ${(M.peakD*100).toFixed(0)}% of income. The next recession starts with rates already at the floor.`},
 {k:'problem',t:'Payments outrun income',short:'Payments',
  b:'Debt repayments now grow faster than incomes. Borrowers have no choice but to cut spending, and lenders stop lending to people who already owe too much. Dalio: at this point the long-term cycle reverses.'},
 {k:'problem',t:'The loop runs in reverse',short:'Reverse',
  b:'The self-reinforcing loop from lesson 2.5 now works backwards: lower spending → lower incomes → less creditworthy → less credit → lower asset prices → less collateral → even less credit. Banks get squeezed; in the worst cases depositors run.',
  n:['Spending is cut','Incomes fall','Borrowers look riskier','Credit shrinks','Asset prices fall','Collateral shrinks']},
 {k:'history',t:'It has happened before',short:'History',
  b:'This was the US in 1929, Japan in 1989–90, and the US and much of Europe in 2008. Each time, rates were cut to about zero and it was not enough. Module 06 is what comes next: the <b>deleveraging</b>.'}
]});
})();
