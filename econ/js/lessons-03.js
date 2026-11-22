/* 03 · Money, Banks & Money Supply */
(function(){const U=ML.U,E=ML.EC,F=E.F;

/* ======================================================= what is money */
ML.add({id:'what-is-money',title:'What Is Money?',min:8,lvl:'Beginner',
sub:'Money is whatever people accept to settle a deal. Today it is mostly numbers in bank accounts, backed by trust.',
keys:'money medium of exchange store of value unit of account fiat commodity money gold deposits central bank reserves',
learn:['The three jobs of money','From commodity money to fiat money','Central bank money vs bank deposits','Why trust is the real backing'],
cheat:['Money does three jobs: <b>medium of exchange</b>, <b>store of value</b>, <b>unit of account</b>.','Commodity money (gold) → paper backed by gold → <b>fiat money</b> (backed by law and trust).','Two layers today: <b>central bank money</b> (cash + bank reserves) and <b>bank deposits</b> (what banks owe you).'],
met:[['job','Job','check'],['kind','Kind','layers']],
draw(si,g){
  const s=[];
  if(si===0){[['Medium of exchange','pay for things','yellow','dollar'],['Store of value','keep it for later','blue','lock'],['Unit of account','price things in it','green','scale']].forEach(([t,sub,c,ic],i)=>{const x=160+i*270;s.push(g.icon(ic,x,120,36),g.box(x,210,230,80,t,c,{hot:1,sub}))})}
  else if(si===1){s.push(g.timeline(110,200,640,[['Barter','swap goods'],['Commodity','gold, silver'],['Gold-backed','paper for gold'],['Fiat','law + trust'],['Digital','bank balances']],{on:3,done:3,c:'orange'}))}
  else{
    s.push(g.box(250,140,300,80,'Central bank money','orange',{hot:1,sub:'cash + reserves banks hold at the CB'}));
    s.push(g.box(610,140,300,80,'Bank deposits','blue',{hot:1,sub:'what Bank Nusa owes you'}));
    s.push(g.stack(330,250,200,190,[['central bank money',1,'orange'],['bank deposits',9,'blue']],{fmt:v=>v*10+'%',labels:false}));
    s.push(g.T(560,340,'most money people use is',{cls:'m'}),g.T(560,358,'bank deposits',{cls:'b'}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Three jobs',short:'Jobs',m:{job:'exchange · store · measure'},
  b:'Money is anything people accept to settle a transaction. To be useful it must do three jobs: let you <b>pay</b> for things, <b>keep</b> value until later, and <b>measure</b> prices in a common unit.'},
 {k:'history',t:'From gold to trust',short:'History',m:{kind:'fiat'},
  b:'Money began as useful commodities (gold, silver), then paper you could swap for gold. Since the US ended gold convertibility in 1971, major currencies are <b>fiat</b>: money because the law and everyone’s trust say so. That matters: a central bank can now create as much as it wants.',
  ch:['! Fiat money is flexible in a crisis, and dangerous if abused (lesson 6.5)']},
 {k:'technique',t:'Two layers of money',short:'Layers',m:{kind:'CB money + deposits'},
  b:'Today there are two layers. <b>Central bank money</b>: notes and coins, plus the reserves banks keep at the central bank. <b>Bank deposits</b>: the balance in your account, which is really a promise from your bank. Most of the money people use day to day is the second kind, as the next lesson shows.'}
]});

/* ======================================================= banks create money */
const BK=E.banks(100,.1,8);
ML.add({id:'bank-money',title:'How Banks Create Money',min:10,lvl:'Intermediate',
sub:'When a bank makes a loan it creates a new deposit. Lending creates money; repaying destroys it.',
keys:'money creation loans create deposits fractional reserve banking money multiplier bank of england reserves',
learn:['Loans create deposits','Repayment destroys money','The textbook money multiplier','What really limits bank lending'],
cheat:['A bank loan creates a matching new <b>deposit</b>: new money (Bank of England, 2014).','Repaying a loan deletes the deposit: money is destroyed.','Textbook multiplier: deposits can grow up to base ÷ reserve ratio (10% → 10×).','In practice banks are limited by profitable borrowers, capital rules and the interest rate, not by reserves.'],
met:[['dep','Deposits created','dollar'],['mult','Multiplier','hash']],
draw(si,g){
  const s=[];
  if(si<=1){
    const loan=si===0?1000:0;
    s.push(g.R(170,90,520,200,{rx:10,fill:'var(--bg)',stroke:'var(--edge)',sw:1.5}),g.T(430,115,'Bank Nusa',{a:'middle',cls:'b'}),g.L([[180,128],[680,128]],'ink'),g.L([[430,128],[430,280]],'ink'));
    s.push(g.T(300,150,'Assets',{a:'middle',cls:'m'}),g.T(560,150,'Liabilities',{a:'middle',cls:'m'}));
    s.push(g.T(190,185,`Loan to Sari  ${F.d(loan)}`,{cls:'b',c:'blue'}),g.T(450,185,`Sari’s deposit ${F.d(loan)}`,{cls:'b',c:'green'}));
    s.push(g.T(430,330,si===0?'Two keystrokes: a loan and a deposit. New money exists.':'Sari repays from her deposit: both lines vanish. Money destroyed.',{a:'middle',cls:'b'}));
  }else if(si===2){
    s.push(g.T(60,50,'Textbook: $100 deposit, 10% reserve ratio, lent out round after round',{cls:'b'}));
    s.push(g.bars(80,90,700,300,BK.rows.map(r=>r.dep),{labels:BK.rows.map(r=>'round '+(r.i+1)),c:'blue',fmt:v=>'$'+v.toFixed(0),max:100}));
    s.push(g.panel(600,90,'Total deposits',[`after 8 rounds  ${F.d(BK.rows[7].tot)}`,`limit (÷10%)    ${F.d(BK.limit)}`],'blue',{w:220}));
  }else{
    s.push(g.panel(80,80,'Textbook view',['central bank adds reserves','banks lend a multiple of them','reserves limit lending'],'gray',{w:320}),g.panel(470,80,'How it actually works',['banks lend if borrowers are good','loans create deposits first','reserves are found afterwards','limits: rate, capital rules,','  willing borrowers'],'green',{w:320}));
    s.push(g.T(430,330,'Either way: when credit expands, the money supply expands with it.',{a:'middle',cls:'b'}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'A loan creates a deposit',short:'Create',m:{dep:'$1,000'},
  b:'When Bank Nusa lends Sari $1,000, it does not hand over someone else’s savings. It types a $1,000 loan into its assets and a $1,000 deposit into Sari’s account. A brand new $1,000 of money now exists.\n\nThe Bank of England’s 2014 explainer “Money creation in the modern economy” lays this out clearly.'},
 {k:'insight',t:'Repaying destroys money',short:'Destroy',m:{dep:'$0'},
  b:'When Sari repays, the deposit and the loan both disappear. So the money supply grows when banks lend more than is being repaid, and <b>shrinks</b> when borrowers repay faster than new loans are made, which is exactly what happens in a deleveraging.'},
 {k:'math',t:'The textbook multiplier',short:'Multiplier',m:{dep:F.d(BK.rows[7].tot),mult:'10×'},
  b:'The classic textbook story: a bank keeps 10% of a $100 deposit and lends $90; that becomes a deposit at another bank, which lends $81, and so on. Total deposits approach $100 ÷ 10% = <b>$1,000</b>.'},
 {k:'tradeoff',t:'What really limits lending',short:'Reality',
  b:'In modern systems the order is reversed: banks lend first when they find creditworthy borrowers at a profitable rate, and arrange reserves afterwards. The real brakes are the <b>interest rate</b>, <b>capital requirements</b> and how many good borrowers want loans. That is why the central bank steers credit with the rate.',
  ch:['+ The multiplier is a useful picture, not a mechanical rule']}
]});

/* ======================================================= money supply */
const MS=[['M0 · base money','cash + bank reserves',300,'orange'],['M1','+ current account deposits',2200,'yellow'],['M2','+ savings & small time deposits',5500,'blue']];
ML.add({id:'money-supply',title:'Money Supply: M0, M1, M2',min:9,lvl:'Intermediate',
sub:'The layers of money the central bank and banks measure, and which ones the central bank controls directly.',
keys:'money supply M0 M1 M2 monetary base broad money narrow money quantitative easing reserves',
learn:['Base money (M0)','Narrow money (M1) and broad money (M2)','Who controls which layer','Why QE grew base money much more than broad money'],
cheat:['<b>M0 / monetary base</b>: cash + reserves at the central bank. The central bank controls it directly.','<b>M1</b>: cash + checking deposits. <b>M2</b>: M1 + savings and small time deposits.','Banks create most of M1/M2 by lending. The central bank influences them through rates.','After 2008, QE multiplied the base, but M2 grew far less because credit was shrinking.'],
met:[['m0','M0','orange'],['m2','M2','blue']],
draw(si,g){
  const s=[];
  if(si<=1){
    const n=si===0?1:3,parts=[['M0',300,'orange'],['M1 adds',1900,'yellow'],['M2 adds',3300,'blue']].slice(0,n);
    s.push(g.stack(200,60,170,370,parts,{total:5500,fmt:v=>'$'+F.n(v)+'B',title:si===0?'Base money':'Nusa’s money supply'}));
    MS.slice(0,n).forEach(([l,sub,v,c],i)=>s.push(g.panel(590,90+i*100,l,[sub,`Nusa: ${F.d(v)}B`],c,{w:250})));
  }else if(si===2){
    s.push(g.box(220,130,260,70,'Central bank','orange',{hot:1,sub:'sets M0 directly'}),g.box(220,330,260,70,'Commercial banks','blue',{hot:1,sub:'create most of M1/M2 by lending'}));
    s.push(g.A(220,168,220,292,{c:'orange',l:'interest rate'}),g.panel(450,180,'Control',['M0: direct (print / drain reserves)','M1, M2: indirect (rates change','  how much people borrow)'],'yellow',{w:360}));
  }else{
    const P=g.plot({x:90,y:50,w:620,h:330,xr:[2006,2016],yr:[0,4],nx:5,ny:4,yl:'index, 2007 = 1'});
    const yrs=U.range(11).map(i=>2006+i),base=[.95,1,1.05,2.1,2.4,3,3.1,3.9,4,3.8,3.7].map(v=>v*.95),m2=[.95,1,1.08,1.15,1.2,1.3,1.42,1.5,1.58,1.67,1.78];
    s.push(P.svg,P.line(yrs.map((y,i)=>[y,base[i]]),'orange',{w:3}),P.line(yrs.map((y,i)=>[y,m2[i]]),'blue',{w:3}),g.T(P.sx(2015.5),P.sy(base[10]*.95)-12,'base money',{a:'end',cls:'b',c:'orange'}),g.T(P.sx(2015.5),P.sy(m2[10])+20,'broad money (M2)',{a:'end',cls:'b',c:'blue'}));
    [2006,2008,2010,2012,2014,2016].forEach(v=>s.push(g.T(P.sx(v),P.y+P.h+14,v,{a:'middle',cls:'m'})));
    s.push(g.T(430,450,'stylised shape of the US after 2008 (see FRED: BOGMBASE vs M2SL)',{a:'middle',cls:'m'}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Base money',short:'M0',m:{m0:'$300B'},
  b:'The innermost layer is <b>base money</b> (M0): banknotes and coins plus the reserves commercial banks keep at the central bank. Only the central bank can create it.'},
 {k:'technique',t:'Broader layers',short:'M1, M2',m:{m2:'$5,500B'},
  b:'Add checking (current account) deposits and you get <b>M1</b>. Add savings accounts and small time deposits and you get <b>M2</b>, the measure most often quoted as “the money supply”. Most of M2 was created by banks making loans.'},
 {k:'insight',t:'Who controls what',short:'Control',
  b:'The central bank controls base money directly. It only <b>influences</b> M1 and M2, by moving the interest rate and so changing how much people want to borrow and banks want to lend.'},
 {k:'history',t:'QE: base up, M2 not so much',short:'After 2008',
  b:'After 2008 the Federal Reserve bought huge amounts of bonds, roughly quadrupling base money. M2 grew far more slowly, because households and banks were repaying debt (destroying deposits) at the same time. Printing replaced lost credit rather than adding a flood of spending (lesson 6.5).',
  tip:['Check the data','On FRED compare BOGMBASE (monetary base) with M2SL (M2).']}
]});
function f(v){return (+v).toFixed(1)}

/* ======================================================= quantity theory */
const QT={M:500,V:2,Q:100};
ML.add({id:'quantity-theory',title:'MV = PQ',min:9,lvl:'Intermediate',
sub:'Money × how often it is spent = prices × output. A simple identity that ties money to spending and prices.',
keys:'quantity theory of money equation of exchange MV PQ velocity inflation fisher friedman',
learn:['The equation of exchange','Velocity: how often money changes hands','More money → more spending, if velocity holds','When velocity collapses'],
cheat:['<b>M × V = P × Q</b>: money × velocity = price level × real output = nominal spending.','It is Dalio’s “total spending ÷ quantity = price” for the whole economy.','If M rises and V and Q are steady, P rises (inflation).','In a deleveraging V falls (people hoard), so printing money does not automatically cause inflation.'],
met:[['mv','M × V (spending)','dollar'],['p','Price level P','scale']],
draw(si,g){
  const s=[];const cs=[[QT.M,QT.V,QT.Q],[QT.M*1.2,QT.V,QT.Q],[QT.M*1.2,QT.V*.75,QT.Q],[QT.M*1.2,QT.V,QT.Q*1.2]][si];
  const [M,V,Q]=cs,P=M*V/Q;
  const blk=(x,l,v,c,sub)=>g.box(x,180,140,86,l+' = '+v,c,{hot:1,sub});
  s.push(blk(110,'M',M,'yellow','money'),g.T(195,186,'×',{a:'middle',size:28,cls:'b'}),blk(280,'V',V,'pink','times spent / yr'),g.T(430,186,'=',{a:'middle',size:28,cls:'b'}),blk(580,'P',P.toFixed(1),'orange','price level'),g.T(665,186,'×',{a:'middle',size:28,cls:'b'}),blk(750,'Q',Q,'green','real output'));
  s.push(g.T(430,300,`Nominal spending: ${F.d(M*V)}`,{a:'middle',cls:'b',size:15}));
  const note=['Start: $500 of money spent twice a year buys 100 units at a price of 10.','+20% money, same velocity and output → prices +20%.','+20% money, but people hoard (velocity −25%) → prices fall.','+20% money matched by +20% output → prices unchanged.'][si];
  s.push(g.T(430,340,note,{a:'middle',cls:'m'}));
  return s.join('');
},
steps:[
 {k:'setup',t:'The equation of exchange',short:'Identity',m:{mv:'$1,000',p:'10'},
  b:'Nusa has $500 of money. On average each dollar is spent twice a year (<b>velocity</b> V = 2), so total spending is $1,000. Real output is 100 units, so the price level is $1,000 ÷ 100 = 10.\n\nThis is just Dalio’s rule from lesson 1.2, applied to the whole economy.'},
 {k:'insight',t:'More money, higher prices',short:'More M',m:{mv:'$1,200',p:'12'},
  b:'Raise money by 20% and keep V and Q the same: spending and prices both rise 20%. This is the core idea behind Milton Friedman’s line that inflation is “always and everywhere a monetary phenomenon”.'},
 {k:'problem',t:'When velocity collapses',short:'Hoarding',m:{mv:'$900',p:'9'},
  b:'But V is not fixed. In a crisis people and banks hoard money instead of spending it, and V falls. Here M is up 20% but V is down 25%, so spending and prices <b>fall</b>. That is why huge money printing after 2008 did not create high inflation at first.',
  ch:['! Money only causes spending when it is spent']},
 {k:'recap',t:'Growth absorbs money',short:'More Q',m:{mv:'$1,200',p:'10'},
  b:'If output grows as fast as money, prices stay put. Healthy economies need some money growth to match real growth. Inflation comes from spending growing faster than output.'}
]});

/* ======================================================= bonds & yields */
const BD=[.03,.04,.05,.06,.07,.08].map(y=>({y,p:E.bond(100,.05,y,10)}));
ML.add({id:'bonds-yields',title:'Bonds & Yields',min:10,lvl:'Intermediate',
sub:'A bond is a tradable loan. When interest rates rise, existing bonds fall in price, and the reverse.',
keys:'bond coupon yield price inverse relationship duration government bonds treasury',
learn:['What a bond is','Coupon vs yield','Why price and yield move in opposite directions','Why bond prices matter for the whole economy'],
cheat:['A <b>bond</b> is an IOU: the issuer pays a fixed <b>coupon</b> and repays the <b>face value</b> at maturity.','<b>Yield</b> = the return you earn if you buy at today’s price and hold to maturity.','Price and yield move <b>inversely</b>: rates up → bond prices down.','Longer bonds move more (duration). Government bond yields are the base for most other rates.'],
met:[['px','Bond price','dollar'],['yl','Yield','scale']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.timeline(110,200,640,[['Buy','pay $100'],['Yr 1','+$5'],['Yr 2','+$5'],['…','+$5 each yr'],['Yr 10','+$5 +$100']],{on:0,c:'blue'}));
    s.push(g.T(430,110,'Government of Nusa 10-year bond: face $100, coupon 5%',{a:'middle',cls:'b'}));
  }else{
    const P=g.plot({x:100,y:50,w:560,h:340,xr:[.03,.08],yr:[70,130],nx:5,ny:6,xl:'yield (market interest rate)',yl:'price of the 5% bond'});
    s.push(P.svg,P.fn(y=>E.bond(100,.05,y,10),'blue',{w:3}),P.pts(BD.map(b=>({x:b.y,y:b.p,c:b.y===.05?'orange':'blue'})),6));
    BD.forEach(b=>s.push(g.T(P.sx(b.y),P.y+P.h+14,F.p(b.y,0),{a:'middle',cls:'m'})));
    [70,85,100,115,130].forEach(v=>s.push(g.T(P.x-6,P.sy(v)+3,'$'+v,{a:'end',cls:'m'})));
    if(si>=1){const hi=si===1?BD[3]:BD[1];s.push(g.pill(P.sx(hi.y),P.sy(hi.p)-18,`${F.p(hi.y,0)} → $${hi.p.toFixed(2)}`,si===1?'red':'green'))}
    if(si===3)s.push(g.panel(690,80,'Why it matters',['mortgage, company and','loan rates all price','off government yields'],'yellow',{w:160}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'A tradable loan',short:'Bond',m:{px:'$100',yl:'5%'},
  b:'When the Government of Nusa borrows, it sells <b>bonds</b>. This one costs $100, pays a $5 <b>coupon</b> every year, and repays the $100 after 10 years. Bonds can be resold to anyone, so they have a market price.'},
 {k:'insight',t:'Rates up, prices down',short:'Rates up',m:{px:'$'+BD[3].p.toFixed(2),yl:'6%'},
  b:`If new bonds start paying 6%, nobody will pay $100 for an old one paying 5%. Its price falls until its <b>yield</b> matches the market: about <b>$${BD[3].p.toFixed(2)}</b>.`},
 {k:'insight',t:'Rates down, prices up',short:'Rates down',m:{px:'$'+BD[1].p.toFixed(2),yl:'4%'},
  b:`If market rates fall to 4%, the old 5% bond is attractive and its price rises to about <b>$${BD[1].p.toFixed(2)}</b>. Bond holders win when rates fall. This is why the central bank’s rate moves wealth around, not just borrowing costs.`},
 {k:'recap',t:'The anchor rate',short:'Anchor',
  b:'Government bond yields are the base that mortgages, company loans and other bonds are priced from. When a central bank buys bonds with new money (QE), it pushes their prices up and yields down, lowering borrowing costs across the economy.'}
]});

/* ======================================================= yield curve */
const CUR={normal:[[0.25,4],[1,4.3],[2,4.6],[5,5],[10,5.4],[30,5.7]],flat:[[0.25,5.2],[1,5.25],[2,5.3],[5,5.3],[10,5.35],[30,5.4]],inv:[[0.25,6],[1,5.8],[2,5.4],[5,5],[10,4.8],[30,4.7]]};
ML.add({id:'yield-curve',title:'The Yield Curve',min:9,lvl:'Intermediate',
sub:'Yields on short and long loans side by side. When short rates rise above long rates, a recession often follows.',
keys:'yield curve term structure inversion recession signal 10 year 2 year spread',
learn:['What the yield curve shows','Why it normally slopes up','What an inverted curve means','How tight money squeezes banks'],
cheat:['<b>Yield curve</b>: yields on government bonds of different maturities, short to long.','Normally upward-sloping: lenders want more to lend for longer.','<b>Inverted</b> (short > long) when the central bank holds short rates high and markets expect cuts later.','In the US, a 10y–2y or 10y–3m inversion has preceded most recessions since the 1960s (with variable lags).'],
met:[['sp','10y − 3m spread','scale'],['sig','Signal','alert']],
draw(si,g){
  const s=[];const P=g.plot({x:90,y:50,w:620,h:330,xr:[0,30],yr:[3,7],nx:6,ny:4,xl:'years to maturity',yl:'yield %'});
  s.push(P.svg);
  const show=si===0?['normal']:si===1?['normal','flat']:['normal','flat','inv'];
  const col={normal:'green',flat:'yellow',inv:'red'},lab={normal:'normal',flat:'flat',inv:'inverted'};
  show.forEach(k=>{s.push(P.line(CUR[k],col[k],{w:k===show[show.length-1]?3.2:2,op:k===show[show.length-1]?1:.5}),P.pts(CUR[k].map(([x,y])=>({x,y,c:col[k],r:4})),4),g.T(P.sx(30)+6,P.sy(CUR[k][5][1])+4,lab[k],{cls:'b',c:col[k]}))});
  [0,5,10,15,20,25,30].forEach(v=>s.push(g.T(P.sx(v),P.y+P.h+14,v,{a:'middle',cls:'m'})));
  [3,4,5,6,7].forEach(v=>s.push(g.T(P.x-6,P.sy(v)+3,v+'%',{a:'end',cls:'m'})));
  if(si===3)s.push(g.panel(470,70,'Bank squeeze',['banks borrow short (deposits)','and lend long (loans)','inverted → lending pays less','→ banks lend less'],'red',{w:280}));
  return s.join('');
},
steps:[
 {k:'setup',t:'Short to long',short:'Normal',m:{sp:'+1.4 pts',sig:'normal'},
  b:'Plot the yield on Nusa’s government bonds from 3 months to 30 years and you get the <b>yield curve</b>. Normally it slopes up: tying money up for longer carries more risk, so lenders ask for more.'},
 {k:'insight',t:'The central bank tightens',short:'Flattens',m:{sp:'+0.15 pts',sig:'watch'},
  b:'When the central bank raises its short-term rate to cool a boom, the short end of the curve rises. Long yields rise less, because markets expect the boom (and high rates) to end. The curve <b>flattens</b>.'},
 {k:'problem',t:'Inversion',short:'Inverted',m:{sp:'−1.3 pts',sig:'recession risk'},
  b:'Push short rates high enough and they rise above long rates: the curve <b>inverts</b>. Markets are saying “rates are too high to last; cuts are coming because the economy will weaken”. In the US an inverted curve has come before most recessions since the 1960s, though the lag varies a lot.',
  tip:['Real data','FRED series T10Y2Y and T10Y3M track the US spread.']},
 {k:'insight',t:'Why it bites',short:'Banks',
  b:'Banks fund themselves short and lend long. When the curve inverts, new lending earns less than funding costs, so banks pull back. Less credit means less spending: exactly the mechanism of the short-term debt cycle in Module 05.'}
]});
})();
