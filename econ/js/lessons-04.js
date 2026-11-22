/* 04 · Interest Rates & the Central Bank */
(function(){const U=ML.U,E=ML.EC,F=E.F;

/* ======================================================= policy rate & transmission */
const CH=[['Policy rate','central bank','orange'],['Bank rates','loans, mortgages, deposits','yellow'],['Credit','borrowing & lending','pink'],['Spending','households & firms','blue'],['Jobs & prices','output, inflation','green']];
ML.add({id:'policy-rate',title:'The Policy Rate',min:9,lvl:'Beginner',
sub:'How one interest rate set by the central bank ripples out to loans, spending, jobs and prices, with a lag.',
keys:'policy rate fed funds rate overnight rate transmission mechanism monetary policy lags open market operations',
learn:['What the policy rate is','The transmission chain','Other channels: assets and the currency','Why policy works with long lags'],
cheat:['The <b>policy rate</b> is the overnight rate the central bank targets for lending between banks (e.g. the US fed funds rate).','It steers it with interest on reserves and by buying/selling bonds (open market operations).','Chain: policy rate → bank lending rates → credit → spending → output & inflation.','Lags are long and variable: often 1–2 years for the full effect on inflation.'],
met:[['r','Policy rate','gear'],['lag','Full effect','clock']],
draw(si,g){
  const s=[];
  if(si<=1){CH.forEach(([t,sub,c],i)=>{const x=100+i*165;s.push(g.box(x,200,150,80,t,c,{hot:si===1||i===0,sub}));if(i)s.push(g.A(x-90,200,x-77,200,{c:'edge'}))})}
  else if(si===2){
    s.push(g.box(140,240,180,70,'Policy rate ↓','orange',{hot:1}));
    [['Credit cheaper','more borrowing','pink',110],['Asset prices ↑','bonds, shares, homes','purple',240],['Currency ↓','exports cheaper','blue',370]].forEach(([t,sub,c,y])=>s.push(g.A(235,240,445,y,{c,w:2}),g.box(560,y,230,62,t,c,{hot:1,sub})));
    s.push(g.A(680,240,760,240,{c:'edge'}),g.box(790,240,90,60,'More\nspending','green',{hot:1}));
  }else{
    s.push(g.timeline(100,200,660,[['Rate cut','month 0'],['Loan rates','weeks'],['Borrowing','months'],['Spending & jobs','~1 year'],['Inflation','1–2 years']],{on:4,done:4,c:'orange'}));
  }
  return s.join('');
},
anim(si,t,g){if(si!==1)return '';const k=(t*.35)%1,x=100+k*4*165;return g.C(x,150,8,'yellow')},
steps:[
 {k:'setup',t:'One rate to steer them all',short:'The rate',m:{r:'set by the CB'},
  b:'The Central Bank of Nusa sets a target for the <b>overnight rate</b> at which banks lend to each other. It holds the rate there by paying interest on the reserves banks keep with it and by buying or selling bonds. Every other rate in the economy is priced on top of it.'},
 {k:'technique',t:'The transmission chain',short:'Chain',
  b:'Raise the policy rate and banks raise loan and mortgage rates. Borrowing gets more expensive, so credit grows more slowly. Less credit means less spending, so firms hire and raise prices less. Cutting the rate runs the chain in reverse.',
  n:['Policy rate changes','Banks reprice loans','Credit growth slows or speeds up','Spending follows','Jobs and inflation follow last']},
 {k:'insight',t:'More than one channel',short:'Channels',
  b:'Rates also move <b>asset prices</b> (lower rates make bonds, shares and homes worth more, lesson 4.6, so owners feel richer and spend) and the <b>currency</b> (lower rates tend to weaken it, helping exporters).'},
 {k:'tradeoff',t:'Long and variable lags',short:'Lags',m:{lag:'1–2 years'},
  b:'The full effect on inflation can take a year or two. So central banks must act on forecasts, not on today’s numbers. Act too late and the boom overheats; act too hard and you cause the recession. Try it yourself in the Lab.',
  tip:['Lab','“Be the central bank” uses these lags. Notice how inflation keeps rising for a while after you raise rates.']}
]});

/* ======================================================= real vs nominal */
const RR=[['Nusa, normal',.05,.02],['Boom',.05,.04],['1970s style',.07,.11],['Crisis, rates at 0',0,-.01],['After printing',0,.03]];
ML.add({id:'real-rates',title:'Real vs Nominal Rates',min:8,lvl:'Intermediate',
sub:'The rate that matters is the interest rate minus inflation. That real rate decides whether borrowing pays.',
keys:'real interest rate nominal interest rate fisher equation inflation expectations negative real rates',
learn:['Nominal vs real rates','The Fisher equation','Why negative real rates encourage borrowing','Why rates must rise more than inflation'],
cheat:['<b>Real rate ≈ nominal rate − inflation</b> (Fisher equation; strictly (1+i)/(1+π) − 1).','Borrowers and savers care about the real rate: what the money is worth when repaid.','Negative real rates transfer wealth from savers to borrowers and encourage borrowing.','To cool inflation, the central bank must raise the nominal rate by <b>more</b> than inflation rises.'],
met:[['real','Real rate','scale']],
draw(si,g){
  const s=[];const rows=si===0?RR.slice(0,1):si===1?RR.slice(0,3):RR;
  s.push(g.table(80,60,[{t:'Situation',w:230,a:'l'},{t:'Nominal',w:120},{t:'Inflation',w:120},{t:'Real',w:120}],rows.map(([l,n,p],i)=>({c:[l,F.p(n,0),F.p(p,0),F.p(n-p,0)],cc:[null,null,null,n-p<0?'red':'green'],hi:i===rows.length-1})),{rh:40}));
  if(si===1)s.push(g.panel(80,330,'A rising nominal rate that lags inflation',['the real rate actually falls','→ borrowing gets more attractive','→ even more spending'],'red',{w:360}));
  if(si===2)s.push(g.panel(500,330,'Negative real rates',['debt shrinks in real terms','savers lose, borrowers gain'],'yellow',{w:300}));
  return s.join('');
},
steps:[
 {k:'setup',t:'Two kinds of rate',short:'Nominal vs real',m:{real:'3%'},
  b:'The <b>nominal</b> rate is the number on the loan: 5%. But if prices rise 2% a year, the dollars Sari repays buy less. The <b>real</b> rate subtracts inflation: 5% − 2% = <b>3%</b>.'},
 {k:'insight',t:'Real rates can fall as rates rise',short:'Falling behind',m:{real:'1% → −4%'},
  b:'In a boom, inflation can climb faster than the central bank raises rates. With 5% rates and 4% inflation the real rate is just 1%; with 7% rates and 11% inflation (the 1970s pattern) it is <b>−4%</b>. Borrowing is effectively paid for, so the boom feeds itself.',
  ch:['! Rule: raise the nominal rate by more than inflation rises (the Taylor principle, lesson 4.5)']},
 {k:'insight',t:'Negative real rates in a crisis',short:'Below zero',m:{real:'−3%'},
  b:'After a crash rates may be at 0%. If the central bank can push inflation up to 3%, the real rate is <b>−3%</b>: debts shrink in real terms every year. That is one quiet way debt burdens come down in a deleveraging (lesson 6.7).'}
]});

/* ======================================================= inflation */
ML.add({id:'inflation',title:'Inflation',min:9,lvl:'Beginner',
sub:'Prices rise when spending grows faster than the production of goods and services.',
keys:'inflation CPI consumer price index demand pull cost push 2 percent target wage price spiral',
learn:['Inflation from spending vs output','Demand-pull and cost-push','How it is measured (CPI)','Why central banks target about 2%'],
cheat:['<b>Inflation</b> = a sustained rise in the general price level.','Happens when total spending (money + credit) grows faster than output.','Demand-pull (too much spending) vs cost-push (supply shocks, e.g. oil).','Measured by price indexes (CPI, PCE). Most central banks target ~2%.'],
met:[['sp','Spending growth','dollar'],['q','Output growth','layers'],['pi','Inflation','alert']],
draw(si,g){
  const s=[];
  if(si<=1){
    const sp=si===0?.04:.09,q=.02;
    s.push(g.bars(150,90,360,300,[sp,q,sp-q],{labels:['spending growth','output growth','≈ inflation'],c:['pink','green','red'],fmt:v=>F.p(v,0),gap:50,max:.1}));
    s.push(g.panel(580,110,si===0?'Healthy':'Overheating',si===0?['credit grows a bit','faster than output','inflation ≈ 2%']:['credit boom','spending +9%','output can’t keep up'],si===0?'green':'red',{w:230}));
  }else if(si===2){
    s.push(g.box(230,140,300,80,'Demand-pull','pink',{hot:1,sub:'too much spending chasing goods'}),g.box(630,140,300,80,'Cost-push','orange',{hot:1,sub:'supply shock: oil, drought, war'}));
    s.push(g.panel(90,260,'Fix',['raise rates → less credit','→ less spending'],'pink',{w:280}),g.panel(490,260,'Harder',['raising rates cuts demand','but doesn’t make more oil'],'orange',{w:280}));
  }else{
    s.push(g.T(430,60,'Why central banks aim for ~2%, not 0%',{a:'middle',cls:'b'}));
    s.push(g.panel(80,100,'Too high (10%+)',['erodes savings','prices hard to plan','hurts people on fixed income'],'red',{w:230}),g.panel(320,100,'About 2%',['a little room to cut','real rates below zero','a cushion vs deflation'],'green',{w:230}),g.panel(560,100,'Below 0%',['debts get heavier','people delay spending','rates can’t go lower'],'blue',{w:230}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Spending vs output',short:'Basics',m:{sp:'4%',q:'2%',pi:'≈2%'},
  b:'From lesson 1.2: price = spending ÷ quantity. If total spending on Nusa grows 4% a year and output grows 2%, prices rise about <b>2%</b>. That is <b>inflation</b>.'},
 {k:'problem',t:'A credit boom overheats',short:'Overheat',m:{sp:'9%',pi:'≈7%'},
  b:'In a boom credit pushes spending up 9% a year, but factories and workers can only produce 2% more. Prices rise about 7%. Dalio: inflation comes when spending and incomes grow faster than the production of goods.'},
 {k:'technique',t:'Two kinds',short:'Kinds',
  b:'<b>Demand-pull</b> inflation comes from too much spending; raising rates fixes it. <b>Cost-push</b> inflation comes from a supply shock (an oil spike); raising rates cuts demand but does not create oil, so it is a painful trade-off.'},
 {k:'insight',t:'Why target 2%?',short:'Target',m:{pi:'target 2%'},
  b:'Price indexes like the CPI measure inflation. Most central banks target about 2%: low enough that people do not have to think about it, high enough to leave a buffer against deflation and room to make real rates negative in a slump.'}
]});

/* ======================================================= deflation */
const DL=['spending falls','prices & incomes fall','real debt burden rises','defaults & cutbacks'];
ML.add({id:'deflation',title:'Deflation',min:9,lvl:'Intermediate',
sub:'Prices fall when spending falls. With lots of debt, falling prices make debts heavier, and that can spiral.',
keys:'deflation debt deflation fisher spiral falling prices japan great depression',
learn:['Where deflation comes from','Why falling prices hurt debtors','Irving Fisher’s debt-deflation spiral','Why central banks fear it more than mild inflation'],
cheat:['<b>Deflation</b> = falling general price level; happens when spending falls.','Debts are fixed in dollars: when prices and incomes fall, the real burden of debt rises.','<b>Debt-deflation</b> (Fisher, 1933): debt → cutbacks → lower prices → heavier debt → more cutbacks.','People delay purchases if they expect prices to fall, deepening the slump.'],
met:[['inc','Sari’s income','dollar'],['debt','Her debt','alert'],['ratio','Debt ÷ income','scale']],
draw(si,g){
  const s=[];
  if(si===0){s.push(g.bars(200,90,320,300,[1000,900],{labels:['spending before','spending after'],c:['blue','red'],fmt:v=>F.d(v),gap:80,max:1100}),g.box(670,220,180,80,'prices −10%','red',{hot:1}))}
  else if(si===1){
    const rows=[['income',3000,2700],['debt',10000,10000]];
    s.push(g.table(120,100,[{t:'',w:160,a:'l'},{t:'before',w:150},{t:'prices −10%',w:150},{t:'',w:150}],[{c:['Income / mo','$3,000','$2,700','−10%']},{c:['Debt','$10,000','$10,000','unchanged'],cc:[null,null,'red',null]},{c:['Debt ÷ yearly income','28%','31%','heavier'],b:1,tone:'red'}],{rh:42}));
  }else{
    DL.forEach((t,i)=>{const a=i/4*Math.PI*2-Math.PI/2,x=430+Math.cos(a)*200,y=245+Math.sin(a)*145;s.push(g.box(x,y,200,54,t,['blue','orange','red','purple'][i],{hot:1}));const a2=(i+1)/4*Math.PI*2-Math.PI/2;s.push(g.A(x+Math.cos(a+.6)*55,y+Math.sin(a+.6)*40,430+Math.cos(a2)*200-Math.cos(a2-.6)*55,245+Math.sin(a2)*145-Math.sin(a2-.6)*40,{c:'red',curve:30}))});
    s.push(g.T(430,250,si===2?'debt-deflation spiral':'how do you stop it?',{a:'middle',cls:'b'}));
    if(si===3)s.push(g.panel(560,50,'Answer',['put money back into','spending (lesson 6.5)'],'green',{w:230}));
  }
  return s.join('');
},
anim(si,t,g){if(si<2)return '';const a=(t*.6)%(Math.PI*2)-Math.PI/2;return g.C(430+Math.cos(a)*120,245+Math.sin(a)*85,7,'red')},
steps:[
 {k:'setup',t:'Spending falls, prices fall',short:'Basics',m:{inc:'$3,000'},
  b:'If total spending falls 10% while output stays the same, prices fall about 10%. That is <b>deflation</b>: the mirror image of inflation, and it usually comes from credit contracting.'},
 {k:'problem',t:'Debts don’t deflate',short:'Heavier debt',m:{inc:'$2,700',debt:'$10,000',ratio:'28% → 31%'},
  b:'Cheaper prices sound nice. But Sari’s income falls with prices while her $10,000 debt does not. Her debt burden gets <b>heavier</b> even though she borrowed nothing new.'},
 {k:'insight',t:'The debt-deflation spiral',short:'Spiral',
  b:'Irving Fisher described it after 1929: heavy debts force people to cut spending and sell assets, prices fall, real debt burdens rise, more defaults and cutbacks follow, prices fall further. Expecting lower prices, people also delay purchases.',
  n:['Debtors cut spending','Prices and incomes fall','Real debt rises','More defaults, more cuts']},
 {k:'recap',t:'Why central banks fear it',short:'Fear',
  b:'This is why central banks treat deflation as more dangerous than mild inflation, and why they print money once rates hit zero. Ben Bernanke’s 2002 speech “Deflation: Making Sure ‘It’ Doesn’t Happen Here” lays out the toolkit.'}
]});

/* ======================================================= taylor rule */
const TR=E.cbRun('taylor'),FX=E.cbRun('fixed');
ML.add({id:'taylor-rule',title:'The Taylor Rule',min:11,lvl:'Intermediate',
sub:'A simple recipe for setting rates: start from neutral, then lean against inflation and against the output gap.',
keys:'taylor rule neutral rate output gap inflation target taylor principle phillips curve',
learn:['The Taylor rule formula','The output gap','The Taylor principle','What happens if the rate stays fixed'],
cheat:['<b>i = r* + π + 0.5(π − π*) + 0.5 × gap</b>  (Taylor, 1993).','r* = neutral real rate (~2% in Taylor’s paper), π* = target (2%).','<b>Taylor principle</b>: raise rates more than one-for-one with inflation, so real rates rise.','Phillips curve: when spending runs above capacity (positive gap), inflation tends to rise.'],
met:[['tr','Rule says','gear'],['pi','Inflation','alert']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.T(430,80,'i = r* + π + 0.5 × (π − 2%) + 0.5 × gap',{a:'middle',cls:'b',size:17}));
    const ex=[['neutral real rate r*','2%'],['inflation π','4%'],['0.5 × (4% − 2%)','1%'],['0.5 × gap (+2%)','1%'],['policy rate i','8%']];
    s.push(g.table(220,130,[{t:'Boom on Nusa',w:260,a:'l'},{t:'',w:160}],ex.map((r,i)=>({c:r,b:i===4,top:i===4,tone:i===4?'orange':null})),{rh:38}));
  }else{
    const P1=g.plot({x:80,y:40,w:330,h:340,xr:[0,48],yr:[-.03,.06],nx:4,ny:3,title:'Inflation'}),P2=g.plot({x:480,y:40,w:330,h:340,xr:[0,48],yr:[0,.09],nx:4,ny:3,title:'Policy rate'});
    s.push(P1.svg,P2.svg,P1.line([[0,.02],[48,.02]],'green',{cls:'dash thin'}));
    if(si===1||si===3)s.push(P1.line(FX.map(x=>[x.q,x.pi]),'red',{w:3}),P2.line(FX.map(x=>[x.q,x.rate]),'red',{w:3}),g.T(P1.sx(46),P1.sy(FX[46].pi)-10,'fixed rate',{a:'end',cls:'b',c:'red'}));
    if(si>=2)s.push(P1.line(TR.map(x=>[x.q,x.pi]),'blue',{w:3}),P2.line(TR.map(x=>[x.q,x.rate]),'blue',{w:3}),g.T(P1.sx(46),P1.sy(TR[46].pi)+18,'Taylor rule',{a:'end',cls:'b',c:'blue'}));
    [[P1,-.03,.06],[P2,0,.09]].forEach(([P,a,b])=>{for(let i=0;i<=3;i++){const v=a+(b-a)*i/3;s.push(g.T(P.x-6,P.sy(v)+3,F.p(v,0),{a:'end',cls:'m'}))}});
    [P1,P2].forEach(P=>[0,4,8,12].forEach(y=>s.push(g.T(P.sx(y*4),P.y+P.h+14,'yr '+y,{a:'middle',cls:'m'}))));
    s.push(g.R(P1.sx(6)-1,P1.y,2,P1.h,{fill:'var(--yellow)'}),g.T(P1.sx(6)+4,P1.y+14,'boom',{cls:'m'}),g.R(P1.sx(26)-1,P1.y,2,P1.h,{fill:'var(--yellow)'}),g.T(P1.sx(26)+4,P1.y+14,'crash',{cls:'m'}));
  }
  return s.join('');
},
steps:[
 {k:'math',t:'The recipe',short:'Formula',m:{tr:'8%',pi:'4%'},
  b:'In 1993 John Taylor showed that US policy looked like a simple rule. Start from a <b>neutral</b> real rate, add inflation, then add half of how far inflation is above target and half of the <b>output gap</b> (how far spending is above the economy’s capacity).\n\nIn a Nusa boom with 4% inflation and a +2% gap, the rule says <b>8%</b>.'},
 {k:'problem',t:'If the rate never moves',short:'Fixed rate',m:{tr:'4% (stuck)',pi:F.p(FX[48].pi,1)+' and rising'},
  b:'Run the same model with the rate stuck at 4%. A credit boom lifts inflation; with the rate fixed, the <b>real</b> rate falls, borrowing gets cheaper, and inflation keeps drifting up for years. Even the later crash only dents it.',
  ch:['! A fixed nominal rate is not neutral when inflation moves']},
 {k:'solution',t:'Lean against the wind',short:'Taylor rule',m:{pi:F.p(TR[48].pi,1)},
  b:'With the Taylor rule the bank raises rates in the boom (more than inflation rises, so real rates go up) and cuts them in the crash. Inflation stays close to 2% and the swings in output are smaller. This is the <b>Taylor principle</b>.'},
 {k:'tradeoff',t:'A guide, not a law',short:'Limits',
  b:'Nobody knows the neutral rate or the output gap precisely, and supply shocks blur the signal. Central banks use rules like this as a cross-check, not an autopilot. And the rule fails completely when it asks for a rate below zero (lesson 4.7).',
  tip:['Lab','“Be the central bank” has an Autopilot button that runs exactly this rule.']}
]});

/* ======================================================= rates & asset prices */
ML.add({id:'asset-prices',title:'Rates & Asset Prices',min:9,lvl:'Intermediate',
sub:'An asset is worth its future cash discounted at the interest rate. Lower rates mean higher prices.',
keys:'present value discount rate asset prices wealth effect housing stocks perpetuity capitalization',
learn:['Present value','Why lower rates lift asset prices','The wealth effect','How this feeds bubbles'],
cheat:['Price of an asset ≈ present value of its future cash flows.','Perpetuity: <b>price = cash flow ÷ (r − g)</b>.','Lower rates → higher present values → higher asset prices; higher rates → the reverse.','Rising asset prices raise collateral and make owners feel richer (wealth effect) → more borrowing and spending.'],
met:[['r','Discount rate','scale'],['px','Value of $5/yr forever','dollar']],
draw(si,g){
  const s=[];
  if(si===0){s.push(g.timeline(110,200,640,[['Today','price ?'],['Yr 1','$5'],['Yr 2','$5'],['Yr 3','$5'],['…','$5 forever']],{on:0,c:'blue'}),g.T(430,110,'A small rental shop on Nusa earns $5k a year, forever',{a:'middle',cls:'b'}))}
  else{
    const P=g.plot({x:100,y:50,w:560,h:340,xr:[.02,.1],yr:[0,260],nx:4,ny:4,xl:'interest rate',yl:'value ($k)'});
    s.push(P.svg,P.fn(r=>E.perp(5,r,0),'purple',{w:3,from:.02,to:.1}));
    [.02,.04,.06,.08,.1].forEach(v=>s.push(g.T(P.sx(v),P.y+P.h+14,F.p(v,0),{a:'middle',cls:'m'})));
    [0,65,130,195,260].forEach(v=>s.push(g.T(P.x-6,P.sy(v)+3,'$'+v+'k',{a:'end',cls:'m'})));
    const pts=si===1?[.08,.04]:[.08];pts.forEach(r=>s.push(P.pts([{x:r,y:E.perp(5,r,0),c:'orange'}],7),g.pill(P.sx(r)+50,P.sy(E.perp(5,r,0))-14,`${F.p(r,0)} → $${E.perp(5,r,0).toFixed(1)}k`,'orange')));
    if(si===2)s.push(g.panel(680,80,'Wealth effect',['owners feel richer','collateral is worth more','→ borrow & spend more'],'purple',{w:170}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'What is it worth today?',short:'PV',m:{px:'?'},
  b:'An asset is a claim on future money. A shop that earns $5k a year forever is worth what that stream is worth <b>today</b>. To compare money now with money later we discount it at the interest rate.'},
 {k:'math',t:'Halve the rate, double the price',short:'Rates',m:{r:'8% → 4%',px:'$62.5k → $125k'},
  b:'For a stream that never grows, value = cash ÷ rate. At 8%: $5k ÷ 0.08 = <b>$62.5k</b>. At 4%: <b>$125k</b>. Nothing about the shop changed; only the rate did. That is how rate cuts lift house and share prices.'},
 {k:'insight',t:'The wealth effect',short:'Wealth',
  b:'Higher asset prices make owners feel richer and raise the collateral they can borrow against (lesson 2.5). So they borrow and spend more. In a long boom this is how falling rates feed rising debt and, eventually, bubbles (lesson 5.6).',
  ch:['! It works in reverse: rate hikes deflate asset prices and collateral together']}
]});

/* ======================================================= zero lower bound */
const MZ=E.machine();
ML.add({id:'zero-bound',title:'The Zero Lower Bound',min:9,lvl:'Intermediate',
sub:'Rates can’t go much below zero. When they hit it, the central bank’s main tool stops working.',
keys:'zero lower bound liquidity trap negative rates quantitative easing forward guidance',
learn:['Why rates can’t fall far below zero','The liquidity trap','What central banks do at zero','Why this marks a deleveraging'],
cheat:['People can hold cash at 0%, so deposit rates can’t go far below zero (<b>zero lower bound</b>).','At zero, cutting rates can no longer revive borrowing: a <b>liquidity trap</b>.','Other tools: <b>quantitative easing</b> (printing to buy bonds), forward guidance, mildly negative rates.','In Dalio’s machine, hitting zero is the sign that a recession has turned into a deleveraging.'],
met:[['r','Rate','gear'],['tool','Tool left','tool']],
draw(si,g){
  const s=[];
  if(si===0){s.push(g.box(230,200,280,90,'Bank deposit at −3%','red',{hot:1,sub:'$100 → $97 next year'}),g.box(620,200,280,90,'Cash under the mattress','yellow',{hot:1,sub:'$100 → $100'}),g.T(430,330,'Below a small negative rate, everyone switches to cash.',{a:'middle',cls:'b'}))}
  else{
    const Y=MZ.yrs.filter(y=>y.t<=MZ.peakT+6),P=g.plot({x:80,y:40,w:720,h:350,xr:[0,MZ.peakT+6],yr:[-.01,.12],nx:8,ny:4,yl:'policy rate'});
    s.push(P.svg,P.line([[0,0],[MZ.peakT+6,0]],'red',{w:1.6,cls:'dash'}),P.line(Y.map(y=>[y.t,y.rate]),'orange',{w:2.8}));
    s.push(g.T(P.sx(2),P.sy(0)+16,'zero',{cls:'b',c:'red'}));
    for(let v=0;v<=.12;v+=.04)s.push(g.T(P.x-6,P.sy(v)+3,F.p(v,0),{a:'end',cls:'m'}));
    for(let t=0;t<=MZ.peakT;t+=10)s.push(g.T(P.sx(t),P.y+P.h+14,'yr '+t,{a:'middle',cls:'m'}));
    if(si>=2)s.push(g.pill(P.sx(MZ.peakT),P.sy(.02),'no room to cut','red'));
    if(si===3)s.push(g.panel(470,70,'Tools at zero',['print money to buy bonds (QE)','promise to stay low (guidance)','slightly negative rates'],'yellow',{w:300}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Why there is a floor',short:'The floor',m:{r:'≈0%'},
  b:'If a bank charged savers −3%, they would simply hold cash, which pays 0%. So rates can’t be pushed far below zero. Some central banks went slightly negative (the ECB, Japan, Switzerland), but not by much.'},
 {k:'insight',t:'Each cycle starts lower',short:'Path',
  b:'Here are Nusa’s rates over many short cycles (from the long-cycle model in Module 05). As debts pile up, each rate peak is lower and so is each trough, because a heavily indebted economy can’t bear high rates.'},
 {k:'problem',t:'The liquidity trap',short:'Trap',m:{r:'0%',tool:'none (usual)'},
  b:'Eventually a recession hits when rates are already near zero. The usual cure (cut rates, revive borrowing) is used up. Keynes called this a <b>liquidity trap</b>; Dalio says it is the moment a recession becomes a <b>deleveraging</b>.'},
 {k:'solution',t:'Tools at the floor',short:'Tools',m:{tool:'QE · guidance'},
  b:'At zero, central banks print money to buy bonds and other assets (<b>quantitative easing</b>), promise to keep rates low for a long time, and sometimes go slightly negative. Module 06 shows how these combine with government spending.'}
]});
})();
