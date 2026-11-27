/* 07 · Financial Crises Through History
   Price series here are approximate, rounded from the historical sources listed in sources.js; they show shape, not exact quotes. */
(function(){const U=ML.U,E=ML.EC,F=E.F;
const yl=(g,P,vals,fmt)=>vals.map(v=>g.T(P.x-6,P.sy(v)+3,fmt(v),{a:'end',cls:'m'})).join('');

/* ======================================================= 2,000 years of crises */
const TL=[[33,'Rome','credit crunch'],[1637,'Tulips','bubble'],[1720,'South Sea','bubble + debt'],[1825,'Panic of 1825','bank panic'],[1907,'Panic of 1907','bank panic'],[1929,'Great Depression','debt deflation'],[1971,'Nixon shock','currency'],[1982,'Latin America','dollar debt'],[1997,'Asian crisis','dollar debt'],[2000,'Dot-com','bubble'],[2008,'Global crisis','debt + banks'],[2010,'Euro crisis','sovereign debt'],[2020,'COVID','sudden stop'],[2023,'SVB','bank run']];
ML.add({id:'crisis-timeline',title:'2,000 Years of Crises',min:8,lvl:'Beginner',
sub:'Financial crises are not new. The same machine has broken in similar ways for at least two thousand years.',
keys:'history of financial crises timeline this time is different reinhart rogoff kindleberger',
learn:['A map of famous crises','Four kinds of crisis','Why they keep happening','How the rest of this module is organised'],
cheat:['Crises recur in every era and system: Rome, the Dutch Republic, Britain, the US, Asia, Europe.','Main kinds: <b>bubbles</b>, <b>bank panics</b>, <b>debt crises</b> (private or sovereign), <b>currency crises</b>.','Reinhart & Rogoff’s finding: “this time is different” is the most dangerous belief in finance.'],
met:[['n','Crises on the map','hash'],['k','Kind','alert']],
hero:0,
draw(si,g){
  const s=[],era=[[0,2],[3,5],[6,9],[10,13]][Math.min(si,3)],all=si>=4;
  s.push(g.L([[50,240],[810,240]],'gray',{w:3}));
  TL.forEach(([y,l,k],i)=>{const x=60+i*(750/(TL.length-1)),on=all||(i>=era[0]&&i<=era[1]),up=i%2===0,c=k.includes('bubble')?'purple':k.includes('bank')||k.includes('panic')?'blue':k.includes('currency')||k.includes('dollar')?'pink':'red';
    s.push(`<g opacity="${on?1:.25}">`+g.C(x,240,on?9:6,c)+g.L([[x,240],[x,up?195:285]],'gray',{cls:'thin'})+g.T(x,up?185:302,y<100?y+' AD':String(y),{a:'middle',cls:'b',size:11})+g.T(x,up?170:316,l,{a:'middle',size:10.5})+g.T(x,up?156:330,k,{a:'middle',cls:'m',size:9.5})+'</g>')});
  if(all)s.push(g.panel(220,370,'Four kinds of crisis',['bubbles (purple) · bank panics (blue)','debt crises (red) · currency crises (pink)'],'yellow',{w:420}));
  return s.join('');
},
steps:[
 {k:'history',t:'Ancient and early modern',short:'Early',m:{n:'3',k:'credit · bubble'},
  b:'The oldest well-documented crisis is in Rome in 33 AD: a credit crunch and land-price crash (next lesson). Then come the Dutch tulip mania of 1636–37 and the South Sea and Mississippi bubbles of 1720, the first crashes in modern stock markets.'},
 {k:'history',t:'The age of bank panics',short:'1800s–1930s',m:{n:'6',k:'panics'},
  b:'As banking spread, <b>bank panics</b> became the typical crisis: 1825 in London, 1907 in New York, then the 1929–33 collapse that became the Great Depression. Each one pushed governments to build a lender of last resort.'},
 {k:'history',t:'The age of dollar debt',short:'1970s–2000',m:{n:'10',k:'currency · debt'},
  b:'After the dollar left gold in 1971, crises increasingly came from <b>borrowing in a foreign currency</b>: Latin America in 1982 and Asia in 1997, including Indonesia. Module 08 explains why that currency was always the dollar.'},
 {k:'history',t:'The 21st century',short:'2000s',m:{n:'14'},
  b:'The dot-com bust in 2000, the global financial crisis in 2008, the euro crisis from 2010, the COVID shock in 2020 and the run on Silicon Valley Bank in 2023. The tools got faster, but the patterns are the ones you already know from Modules 02–06.'},
 {k:'recap',t:'Same machine, different costumes',short:'Pattern',m:{k:'4 kinds'},
  b:'Most crises fall into four families: bubbles, bank panics, debt crises and currency crises, and big ones are usually several at once. Carmen Reinhart and Kenneth Rogoff collected eight centuries of data and found the same warning sign every time: people convinced that “this time is different”.'}
]});

/* ======================================================= the first financial crisis */
ML.add({id:'first-crisis',title:'The First Financial Crisis',min:10,lvl:'Beginner',
sub:'Rome, 33 AD: a forgotten lending law is suddenly enforced, credit dries up, land prices crash, and the emperor bails out the system.',
keys:'first financial crisis rome 33 AD tiberius tacitus credit crunch bailout interest free loans solon debt',
learn:['Why “first” depends on your definition','What happened in Rome in 33 AD','How Tiberius ended it','Why it looks so modern'],
cheat:['Earlier <b>debt crises</b> exist (e.g. Solon cancelling debts in Athens, 594 BC), but the first well-recorded <b>financial crisis</b> is Rome, 33 AD.','Cause: a lending law that required lenders to hold part of their wealth in Italian land was suddenly enforced → loans were called → land fire-sales → credit crunch and bank failures.','Fix: Tiberius funded 100 million sesterces of interest-free, 3-year loans, secured on land worth twice the loan.','Pattern: credit contraction → asset fire sale → official liquidity injection (a lender of last resort, ~1,800 years early).'],
met:[['d','When','clock'],['fix','Fix','check']],
draw(si,g){
  const s=[];
  if(si===0){s.push(g.table(90,90,[{t:'Candidate',w:230,a:'l'},{t:'When',w:120,a:'l'},{t:'Kind',w:330,a:'l'}],[{c:['Debt cancellations (Mesopotamia, Solon in Athens)','~1800–594 BC','debt crises, ended by forgiving debt']},{c:['Rome under Tiberius','33 AD','first well-recorded credit crunch and bailout'],tone:'yellow',hi:1},{c:['Dutch tulip mania','1636–37','famous early speculative bubble']},{c:['South Sea & Mississippi bubbles','1720','first stock-market crash, across countries']}],{rh:46}))}
  else if(si===1){['rule enforced','loans called','land dumped','prices crash','banks fail'].forEach((t,i)=>{s.push(g.box(110+i*160,230,140,64,t,['orange','pink','purple','red','blue'][i],{hot:1}));if(i)s.push(g.A(110+i*160-82,230,110+i*160-72,230,{c:'edge'}))});s.push(g.T(430,140,'Rome, 33 AD',{a:'middle',cls:'b',size:16}))}
  else if(si===2){s.push(g.actor(200,250,'Tiberius','purple',{s:1.4,sub:'emperor'}),g.A(270,240,560,240,{c:'green',w:2.4,l:'100 million sesterces'}),g.actor(640,250,'landowners','orange',{s:1.4,sub:'0% for 3 years'}),g.panel(240,350,'Terms',['interest-free for three years','secured on land worth 2× the loan','run by a commission of five senators'],'green',{w:380}))}
  else{s.push(g.table(120,100,[{t:'',w:170,a:'l'},{t:'Rome, 33 AD',w:230,a:'l'},{t:'2008',w:230,a:'l'}],[{c:['Trigger','sudden rule change','house prices stop rising']},{c:['Crunch','loans called in','banks stop lending']},{c:['Fire sale','land dumped','mortgage assets dumped']},{c:['Fix','interest-free state loans','central-bank lending, bailouts']}],{rh:44}))}
  return s.join('');
},
steps:[
 {k:'history',t:'“First” depends on the definition',short:'Candidates',
  b:'Debt crises are as old as debt: Mesopotamian kings and Solon of Athens (594 BC) cancelled debts to stop unrest. But if a <b>financial crisis</b> means credit markets, banks and asset prices seizing up together, the first well-documented one is Rome in 33 AD, recorded by Tacitus, Suetonius and Cassius Dio.'},
 {k:'problem',t:'A law nobody obeyed',short:'Cause',m:{d:'33 AD'},
  b:'An old law from Julius Caesar’s time limited moneylending and required lenders to hold part of their wealth in Italian land. It had been ignored for years. When it was suddenly enforced, lenders rushed to call in loans, which shrank the money supply. Debtors dumped land to raise cash, land prices collapsed, banks failed and interest rates shot up.',
  n:['The rule is enforced','Lenders call loans','Debtors sell land','Prices crash','Banks fail']},
 {k:'solution',t:'The emperor’s bailout',short:'Fix',m:{fix:'0% state loans'},
  b:'Tiberius ended it with a liquidity injection: <b>100 million sesterces</b> of interest-free, three-year loans to landowners, secured on land worth twice the loan. Credit and confidence came back.',
  ch:['+ The same move a modern central bank makes: lend freely against good collateral']},
 {k:'insight',t:'It looks very modern',short:'Then & now',
  b:'Strip away the togas and you have the 2008 playbook: a trigger, a credit crunch, fire sales of the main collateral, failing banks, then an official lender pumping in money. The machine you studied in Modules 02–06 is two thousand years old.'}
]});

/* ======================================================= tulip mania */
const TU=[[0,1],[2,1.4],[4,2.2],[5,4],[5.6,8],[6,20],[6.15,3],[6.5,1.2],[8,1]];
ML.add({id:'tulip-mania',title:'Tulip Mania (1636–37)',min:8,lvl:'Beginner',
sub:'The famous Dutch bubble: tulip bulb contracts soared in a few months and collapsed in February 1637. Its real damage is still debated.',
keys:'tulip mania dutch republic 1637 bubble futures contracts speculation goldgar',
learn:['What was traded','How prices exploded','The crash of February 1637','Why historians now think the damage was smaller'],
cheat:['Rare tulip bulbs became luxury goods in the Dutch Republic in the 1630s.','Winter 1636–37: people traded <b>promises</b> to buy bulbs later (futures-like contracts) in taverns; prices multiplied.','Early February 1637: buyers vanished and prices collapsed within days.','Historian Anne Goldgar (2007) found far less economic ruin than legend says: a bubble, but not a debt crisis.'],
met:[['px','Bulb price index','trend']],
draw(si,g){
  const P=g.plot({x:90,y:40,w:620,h:340,xr:[0,8],yr:[0,22],nx:8,ny:4,yl:'bulb price (start = 1, illustrative)'});
  const n=si===0?4:si===1?6:9;let s=P.svg+P.line(TU.slice(0,n),'purple',{w:3});
  ['Aug 36','Sep','Oct','Nov','Dec','Jan 37','Feb','Mar','Apr'].forEach((l,i)=>s+=g.T(P.sx(i),P.y+P.h+14,l,{a:'middle',cls:'m'}));
  s+=yl(g,P,[0,5,10,15,20],v=>v+'×');
  if(si>=2)s+=g.pill(P.sx(6),P.sy(20)-14,'early Feb 1637','red');
  if(si===3)s+=g.panel(470,120,'Bubble, not depression',['few people borrowed to buy','contracts were often settled','  for a small fraction','the wider economy kept growing'],'yellow',{w:270});
  return s;
},
steps:[
 {k:'setup',t:'A luxury in a rich country',short:'Setup',m:{px:'1×'},
  b:'In the 1630s the Dutch Republic was the richest trading nation on earth. Rare, streaked tulips were status symbols, and their bulbs became collectors’ items.'},
 {k:'problem',t:'Trading promises',short:'Boom',m:{px:'≈ 8×'},
  b:'In the winter of 1636–37 people began trading <b>contracts</b> to buy bulbs that were still in the ground, often in taverns and often several times over. Nobody needed the bulb, only someone to buy the contract at a higher price. Prices multiplied in weeks. (The chart is illustrative: exact prices varied wildly by variety.)'},
 {k:'problem',t:'The crash',short:'Crash',m:{px:'back to ≈ 1×'},
  b:'In early February 1637 an auction in Haarlem found no buyers. Within days prices collapsed across the country. Contracts became disputes, and courts and towns eventually let many be settled for a small fraction of their value.'},
 {k:'insight',t:'Smaller than the legend',short:'Reality',
  b:'The story became famous through Charles Mackay’s 1841 book, but historian Anne Goldgar’s archival research found few bankruptcies and little wider damage. That fits the machine: a bubble that is <b>not built on debt</b> pops without wrecking the economy. The dangerous bubbles are the ones financed by credit (lesson 5.6).',
  ch:['+ Bubble without much debt → painful for buyers, mild for the economy']}
]});

/* ======================================================= south sea & mississippi 1720 */
const SS=[[1,128],[2,165],[3,250],[4,300],[5,550],[6,1050],[7,950],[8,850],[9,400],[10,200],[11,150],[12,124]];
ML.add({id:'south-sea',title:'The South Sea & Mississippi Bubbles (1720)',min:11,lvl:'Intermediate',
sub:'Two companies swapped government debt for their own shares, lent money to buy those shares, and crashed together in 1720.',
keys:'south sea bubble 1720 mississippi company john law banque royale debt for equity swap newton bubble act',
learn:['The debt-for-shares scheme','How lending against the shares fed the boom','John Law’s money printing in France','What each country learned'],
cheat:['Britain: the South Sea Company swapped government debt for its own shares; its price rose from about £128 (January 1720) to about £1,000 (summer) and fell back to about £124 by December.','The company lent buyers money against its own shares: a credit-fuelled loop (lesson 5.6).','France: John Law’s Mississippi Company and Banque Royale printed paper money to support the shares → inflation, then collapse.','Results: Britain’s Bubble Act (1720); France distrusted paper money and banks for decades.'],
met:[['px','South Sea share (£)','trend'],['x','From the low','hash']],
draw(si,g){
  if(si===0)return g.box(200,150,260,70,'Government debt','blue',{hot:1,sub:'held by the public'})+g.A(330,150,540,150,{c:'green',w:2.2,l:'swap'})+g.box(660,150,260,70,'South Sea shares','purple',{hot:1,sub:'company gets the bonds'})+g.panel(230,260,'The pitch',['the government pays the company interest','plus a monopoly on South American trade','the higher the share price, the cheaper','  the company buys the debt'],'yellow',{w:400});
  if(si===2)return g.box(200,140,260,70,'Banque Royale','orange',{hot:1,sub:'prints paper money'})+g.A(330,140,540,140,{c:'pink',w:2.2,l:'lends / buys shares'})+g.box(660,140,260,70,'Mississippi Co.','purple',{hot:1,sub:'shares soar'})+g.panel(220,250,'John Law in France',['paper money floods in to prop up the shares','prices rise sharply in Paris','1720: shares and paper money collapse together'],'red',{w:420});
  const P=g.plot({x:90,y:40,w:620,h:340,xr:[1,12],yr:[0,1100],nx:11,ny:4,yl:'South Sea share price (£, approx.)'});
  const n=si===1?6:12;let s=P.svg+P.line(SS.slice(0,n),'purple',{w:3})+P.pts(SS.slice(0,n).map(([x,y])=>({x,y,c:'purple',r:3})),3);
  ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].forEach((l,i)=>s+=g.T(P.sx(i+1),P.y+P.h+14,l,{a:'middle',cls:'m'}));
  s+=yl(g,P,[0,275,550,825,1100],v=>'£'+v);
  if(si===1)s+=g.panel(430,230,'Fuel',['the company lent buyers money','  against its own shares','new share issues on instalments'],'pink',{w:290});
  if(si===3)s+=g.pill(P.sx(6),P.sy(1050)-14,'≈ £1,050 peak','purple')+g.pill(P.sx(12),P.sy(124)-16,'£124','red');
  return s;
},
steps:[
 {k:'setup',t:'Swap debt for shares',short:'Scheme',
  b:'Britain had large war debts. The <b>South Sea Company</b> offered to take government bonds off the public in exchange for its own shares. The higher its share price, the fewer shares it needed to hand over, so the company had every reason to push the price up.'},
 {k:'problem',t:'Credit fuels the boom',short:'Boom',m:{px:'£128 → £1,050',x:'≈ 8×'},
  b:'Shares rose from about £128 in January 1720 to over £1,000 by early summer. The company lent investors money to buy its own shares and sold new ones on instalment, so rising prices created more credit to push prices higher: the bubble loop from lesson 5.6. Hundreds of imitation “bubble companies” appeared.'},
 {k:'problem',t:'Meanwhile in France',short:'Mississippi',
  b:'In France, John Law ran the Mississippi Company and the Banque Royale at the same time. He printed paper money to support the company’s shares. Prices across Paris rose sharply; when confidence cracked in 1720, the shares and the paper money collapsed together. It is an early lesson in printing money without limit (lesson 6.5).'},
 {k:'history',t:'The crash and the aftermath',short:'Crash',m:{px:'£124 (Dec)'},
  b:'From September 1720 the South Sea price collapsed, back to about £124 by December. Thousands were ruined; even Isaac Newton is reported to have lost heavily. Parliament passed the Bubble Act and investigated the directors. France came away distrusting paper money and banking for generations.'}
]});

/* ======================================================= panics & the lender of last resort */
ML.add({id:'bank-panics',title:'Bank Panics & the Lender of Last Resort',min:11,lvl:'Intermediate',
sub:'From London 1825 to New York 1907, bank runs kept recurring until central banks learned to lend freely in a panic.',
keys:'bank panic 1825 overend gurney 1866 bagehot lombard street lender of last resort panic of 1907 jp morgan federal reserve 1913',
learn:['How a bank run works','London 1825 and 1866','Bagehot’s rule','1907 and the birth of the Federal Reserve'],
cheat:['Banks hold long loans but owe short deposits, so a sound bank can fall if everyone withdraws at once.','1825: a Latin American bond and mining bubble burst; dozens of English banks failed; the Bank of England lent heavily.','Bagehot’s rule (<i>Lombard Street</i>, 1873): in a panic, <b>lend freely, at a high rate, against good collateral</b>.','1907: J.P. Morgan organised private rescues in New York; Congress responded by creating the <b>Federal Reserve</b> (1913).'],
met:[['dep','Deposits left','dollar'],['era','Era','clock']],
draw(si,g){
  if(si===0)return g.R(330,110,200,200,{rx:10,fill:'var(--blue-bg)',stroke:'var(--edge)',sw:1.6})+g.T(430,140,'Bank',{a:'middle',cls:'b'})+g.T(430,170,'loans: 10 years',{a:'middle',cls:'m'})+g.T(430,190,'deposits: on demand',{a:'middle',cls:'m'})+g.T(430,350,'If everyone asks at once, the cash isn’t there.',{a:'middle',cls:'b'});
  if(si===1)return g.timeline(120,200,620,[['1825','London panic'],['1866','Overend Gurney'],['1873','Bagehot’s book'],['1907','New York panic'],['1913','Fed created']],{on:1,done:1,c:'blue'});
  if(si===2)return g.T(430,100,'Bagehot’s rule for a panic',{a:'middle',cls:'b',size:16})+[['Lend freely','don’t ration cash','green'],['At a high rate','so only the desperate borrow','orange'],['Against good collateral','sound banks survive, bad ones don’t','blue']].map(([t,sub,c],i)=>g.box(170+i*260,220,230,90,t,c,{hot:1,sub})).join('');
  return g.timeline(120,200,620,[['1825','London panic'],['1866','Overend Gurney'],['1873','Bagehot’s book'],['1907','New York panic'],['1913','Fed created']],{on:4,done:4,c:'blue'})+g.panel(250,300,'1907',['trust companies run','J.P. Morgan organises bankers to lend','→ Congress: never rely on one man again'],'blue',{w:380});
},
anim(si,t,g){if(si!==0)return '';let s='';for(let i=0;i<8;i++){const k=(t*.5+i/8)%1;s+=g.actor(U.lerp(560,780,k),130+i*28,'','gray',{s:.5,op:1-k})}return s},
steps:[
 {k:'setup',t:'Why banks can run',short:'Runs',m:{dep:'on demand'},
  b:'A bank lends for years but owes deposits that can be withdrawn today (lesson 3.2). Normally only a few people withdraw at once. If depositors fear the bank is in trouble, everyone rushes at once, and even a healthy bank can’t turn ten-year loans into cash by tomorrow. Fear makes itself come true.'},
 {k:'history',t:'London, 1825 and 1866',short:'London',m:{era:'1825–66'},
  b:'In 1825 a bubble in Latin American government bonds and mining shares burst; dozens of English country banks failed, and the Bank of England stepped in to lend heavily. In 1866 the giant discount house Overend, Gurney & Co. collapsed and set off another panic in the City of London.'},
 {k:'solution',t:'Bagehot’s rule',short:'The rule',
  b:'Walter Bagehot, editor of <i>The Economist</i>, distilled these panics in <i>Lombard Street</i> (1873): in a panic the central bank should <b>lend freely, at a high rate, against good collateral</b>. Lend enough to stop the run, charge enough that nobody borrows for fun, and only to banks with real assets. Central banks still follow it.'},
 {k:'history',t:'1907 and the Federal Reserve',short:'1907',m:{era:'1907–13'},
  b:'The US had no central bank. In the Panic of 1907, runs hit New York trust companies and J.P. Morgan personally organised bankers to lend. Afterwards Congress decided the system should not depend on one private banker and created the <b>Federal Reserve</b> in 1913. Its first real test would be 1929.'}
]});

/* ======================================================= great depression */
const DJ=[[1928,200],[1929.67,381],[1929.85,199],[1930.3,294],[1930.95,165],[1931.5,150],[1931.95,78],[1932.52,41],[1933.2,55],[1933.6,105],[1934.5,95],[1935.9,145],[1937.2,190]];
ML.add({id:'great-depression',title:'The Great Depression (1929–39)',min:13,lvl:'Intermediate',
sub:'A stock-market bubble on borrowed money, a crash, waves of bank runs and a shrinking money supply, until 1933 changed course.',
keys:'great depression 1929 crash margin bank failures money supply friedman schwartz gold standard new deal fdic 1933',
learn:['The margin-debt boom','The crash and the bank runs','Why the money supply fell by a third','What turned it around in 1933'],
cheat:['1920s: stocks bought on <b>margin</b> (borrowed money). Dow peaked at 381 (Sept 1929), bottomed at 41 (July 1932): −89%.','About 9,000 US banks suspended in 1930–33; with no deposit insurance, savers lost their money.','The money stock fell by more than a third (Friedman & Schwartz): an ugly deflationary deleveraging.','1933: bank holiday, deposit insurance (FDIC), leaving the gold standard and reflation → Dalio’s turn to a “beautiful” deleveraging.'],
met:[['dow','Dow Jones','trend'],['u','Unemployment','user'],['m','Money stock','dollar']],
hero:1,
draw(si,g){
  if(si===2){return g.bars(150,80,560,300,[100,96,85,70,66],{labels:['1929','1930','1931','1932','1933'],c:['blue','blue','blue','red','red'],fmt:v=>v,gap:40,max:110})+g.T(430,60,'US money stock (1929 = 100, approx., Friedman & Schwartz)',{a:'middle',cls:'b'})}
  if(si===3){return g.table(110,90,[{t:'1933 policy',w:260,a:'l'},{t:'Lever (Module 06)',w:220,a:'l'},{t:'Effect',w:200,a:'l'}],[{c:['Bank holiday, reopen sound banks','debt reduction','stops the runs']},{c:['Deposit insurance (FDIC)','confidence','no more runs']},{c:['Leave gold, devalue the dollar','printing money','prices stop falling']},{c:['Public works, relief (New Deal)','redistribution','supports incomes']}],{rh:46})}
  const P=g.plot({x:90,y:40,w:640,h:340,xr:[1928,1937],yr:[0,400],nx:9,ny:4,yl:'Dow Jones (approx.)'});
  let s=P.svg+(si===1?g.band(P,1930.8,1933.2,'red','bank-run waves',{ly:P.h-10}):'')+P.line(DJ.filter(p=>si===0?p[0]<=1929.9:true),'blue',{w:3});
  for(let y=1928;y<=1937;y++)s+=g.T(P.sx(y),P.y+P.h+14,y,{a:'middle',cls:'m'});
  s+=yl(g,P,[0,100,200,300,400],v=>v);
  s+=g.pill(P.sx(1929.67),P.sy(381)-14,'381 · Sep 1929','blue');
  if(si===1)s+=g.pill(P.sx(1932.52)+60,P.sy(41)-18,'41 · Jul 1932 (−89%)','red');
  return s;
},
steps:[
 {k:'setup',t:'A boom on borrowed money',short:'Boom',m:{dow:'381 (peak)'},
  b:'In the 1920s ordinary Americans bought shares on <b>margin</b>: putting down a small deposit and borrowing the rest from brokers. Rising prices raised collateral, which allowed more borrowing: the bubble loop again. The Dow Jones peaked at about 381 in September 1929. In Dalio’s terms, the US had reached its long-term debt peak.'},
 {k:'problem',t:'Crash and bank runs',short:'Crash',m:{dow:'41 (−89%)',u:'≈ 25%'},
  b:'The October 1929 crash forced margin borrowers to sell, pushing prices down further. From 1930 waves of bank runs swept the country; with no deposit insurance, about <b>9,000 banks</b> suspended between 1930 and 1933. The Dow bottomed near 41 in July 1932, and unemployment reached roughly a quarter of the workforce.'},
 {k:'problem',t:'The money supply shrinks',short:'Money',m:{m:'−⅓'},
  b:'Every failed bank destroyed deposits, which are money (lesson 3.2). Milton Friedman and Anna Schwartz showed the US money stock fell by more than a third from 1929 to 1933, while the Federal Reserve, tied to the gold standard, did little. Falling money meant falling prices: Fisher’s debt-deflation spiral (lesson 4.4). This is the ugly deflationary deleveraging of lesson 6.6.',
  ch:['! The Fed later admitted this: Bernanke (2002), “we did it… we’re very sorry”']},
 {k:'solution',t:'1933: the turn',short:'1933',
  b:'In March 1933 Roosevelt declared a bank holiday and reopened only sound banks, created deposit insurance (the FDIC), took the dollar off the old gold price and launched relief and public works. Money printing now balanced the deflationary forces. Dalio marks this as the moment the deleveraging turned “beautiful”. Recovery took until the end of the decade: a lost decade.'}
]});

/* ======================================================= emerging market crises */
const RP=[[1997.5,2450],[1997.67,3000],[1997.83,3600],[1997.97,4650],[1998.06,16000],[1998.2,9000],[1998.38,11000],[1998.47,16000],[1998.6,13000],[1998.8,8000],[1999,8000]];
ML.add({id:'em-crises',title:'Dollar-Debt Crises: Latin America 1982, Asia 1997',min:12,lvl:'Intermediate',
sub:'Borrow in dollars, earn in your own currency, and a falling exchange rate can multiply your debt overnight. Indonesia was hit hardest.',
keys:'latin american debt crisis 1982 volcker asian financial crisis 1997 indonesia rupiah thailand baht imf currency mismatch krismon',
learn:['The currency mismatch','Latin America and the Volcker shock','Asia 1997: from Thailand to Indonesia','Why the rupiah fell 85%'],
cheat:['<b>Currency mismatch</b>: debts in dollars, income in local currency. If the currency falls, the debt burden jumps.','1982: US rates rose sharply under Volcker; Mexico could not service its dollar loans → a decade of crisis in Latin America.','1997: Thailand floated the baht in July; capital fled the region.','Indonesia: rupiah from about Rp 2,400 per $ (mid-1997) to about Rp 16,000 (1998), −85% at worst; GDP fell about 13% in 1998; Suharto resigned in May 1998.'],
met:[['rp','Rupiah per $','dollar'],['debt','$1M loan in rupiah','alert']],
hero:2,
draw(si,g){
  if(si===0){return g.box(200,150,240,70,'Indonesian firm','orange',{hot:1,sub:'earns rupiah'})+g.box(660,150,240,70,'Foreign bank','blue',{hot:1,sub:'lent $1 million'})+g.table(170,250,[{t:'',w:220,a:'l'},{t:'Rp 2,400 per $',w:150},{t:'Rp 16,000 per $',w:150}],[{c:['Debt in dollars','$1,000,000','$1,000,000']},{c:['Debt in rupiah','Rp 2.4 billion','Rp 16 billion'],b:1,tone:'red',cc:[null,null,'red']}],{rh:38})}
  if(si===1){return g.timeline(120,200,620,[['1979','Volcker hikes'],['1982','Mexico can’t pay'],['1980s','“lost decade”'],['1989','Brady plan']],{on:1,done:1,c:'pink'})+g.panel(250,300,'Mechanism',['US rates up → dollar debt costs more','dollar up → harder to repay'],'pink',{w:380})}
  const P=g.plot({x:90,y:40,w:640,h:340,xr:[1997.5,1999],yr:[0,17000],nx:6,ny:4,yl:'rupiah per US dollar (approx.)'});
  let s=P.svg+P.line(RP.slice(0,si===2?5:RP.length),'red',{w:3});
  [1997.5,1997.75,1998,1998.25,1998.5,1998.75,1999].forEach((v,i)=>s+=g.T(P.sx(v),P.y+P.h+14,['Jul 97','Oct','Jan 98','Apr','Jul','Oct','Jan 99'][i],{a:'middle',cls:'m'}));
  s+=yl(g,P,[0,4250,8500,12750,17000],v=>'Rp '+F.n(v));
  s+=g.pill(P.sx(1997.5)+40,P.sy(2450)-16,'≈ Rp 2,400','green');
  if(si===3)s+=g.pill(P.sx(1998.4),P.sy(16000)-16,'May 1998: Suharto resigns','red');
  return s;
},
steps:[
 {k:'setup',t:'The currency mismatch',short:'Mismatch',m:{rp:'2,400 → 16,000',debt:'Rp 2.4B → 16B'},
  b:'An Indonesian firm borrows $1 million because dollar rates are lower than rupiah rates. It earns rupiah. At Rp 2,400 per dollar the debt is Rp 2.4 billion. If the rupiah falls to Rp 16,000, the same debt becomes <b>Rp 16 billion</b>, without borrowing a cent more. That is the trap behind most emerging-market crises.'},
 {k:'history',t:'Latin America, 1982',short:'1982',
  b:'In the 1970s banks lent recycled oil dollars to Latin American governments. Then the Fed under Paul Volcker raised rates sharply to fight inflation. Dollar debt became far more expensive just as the dollar rose. In August 1982 Mexico announced it could not pay; much of the region lost a decade of growth until debts were written down under the 1989 Brady plan (debt reduction, lesson 6.3).'},
 {k:'problem',t:'Asia, 1997',short:'1997',m:{rp:'≈ 16,000 (Jan 98)'},
  b:'Fast-growing Asian economies had pegged currencies and lots of short-term dollar borrowing. In July 1997 Thailand could no longer defend the baht and let it float. Investors pulled money out of the whole region. In Indonesia, firms rushed to buy dollars to repay their debts, pushing the rupiah down further: a currency run.'},
 {k:'history',t:'Krismon in Indonesia',short:'Indonesia',m:{rp:'−85% at worst'},
  b:'From July 1997 to its low in June 1998 the rupiah lost about 85% against the dollar, the worst in the region. Banks failed, inflation spiked, GDP fell about 13% in 1998, and the crisis turned political: Suharto resigned on 21 May 1998 after 32 years. The IMF’s early demand for tight budgets is still widely criticised as making it worse (compare austerity, lesson 6.2).',
  ch:['! Lesson: borrowing in a currency you can’t print is a hidden bet on the exchange rate']}
]});

/* ======================================================= 2008 */
const HP=[[2000,100],[2002,113],[2004,134],[2006,184],[2007,178],[2008,160],[2009,145],[2010,142],[2011,135],[2012,134],[2014,156],[2016,173]];
ML.add({id:'gfc-2008',title:'The 2008 Global Financial Crisis',min:13,lvl:'Intermediate',
sub:'A housing bubble financed by subprime mortgages, packaged into securities and held by highly leveraged banks. Then Lehman fell.',
keys:'2008 global financial crisis subprime mortgages mbs cdo leverage lehman brothers bear stearns tarp quantitative easing svb 2023',
learn:['The housing and mortgage boom','How securitisation spread the risk','Lehman and the panic','The response, and SVB as an echo'],
cheat:['2000s: low rates and loose lending → US house prices up ~80%; subprime borrowers often relied on prices rising (Minsky “Ponzi” finance).','Mortgages were bundled into securities (MBS, CDOs) held by banks and shadow banks with very high leverage.','15 Sept 2008: Lehman Brothers failed → global run on short-term funding.','Response: rates to ~0, QE, bank recapitalisation (TARP), stimulus, Fed dollar swap lines → Dalio’s US “beautiful deleveraging”.'],
met:[['hp','US house prices','trend'],['lev','Bank leverage','scale']],
hero:0,
draw(si,g){
  if(si===1)return ['home buyers','mortgage lenders','Wall Street bundles\n(MBS, CDOs)','investors & banks\nworldwide'].map((t,i)=>g.box(120+i*205,200,180,70,t,['green','orange','purple','blue'][i],{hot:1})+(i?g.A(120+i*205-115,200,120+i*205-92,200,{c:'edge'}):'')).join('')+g.panel(220,290,'Leverage',['some investment banks held ~$30 of assets','  per $1 of capital','a 3–4% fall in asset values wipes them out'],'red',{w:420});
  if(si===2)return g.timeline(110,200,640,[['Mar 08','Bear Stearns'],['Sep 7','Fannie & Freddie'],['Sep 15','Lehman fails'],['Sep 16','AIG rescued'],['Oct 08','TARP']],{on:2,done:2,c:'red'});
  if(si===4)return g.table(120,90,[{t:'',w:170,a:'l'},{t:'2008',w:230,a:'l'},{t:'SVB, March 2023',w:250,a:'l'}],[{c:['Trigger','house prices fall','rates rise fast (2022)']},{c:['Losing asset','mortgage securities','long-term bonds (lesson 3.5)']},{c:['Run','short-term funding','uninsured deposits, via phone apps']},{c:['Fix','QE, bailouts, swap lines','all deposits guaranteed, Fed lending']}],{rh:44});
  const P=g.plot({x:90,y:40,w:640,h:340,xr:[2000,2016],yr:[80,200],nx:8,ny:4,yl:'US house prices (2000 = 100, approx.)'});
  let s=P.svg+(si===3?g.band(P,2008.7,2014,'green','rates ~0%, QE',{ly:P.h-10}):'')+P.line(HP.filter(p=>si===0?p[0]<=2006:true),'purple',{w:3});
  for(let y=2000;y<=2016;y+=2)s+=g.T(P.sx(y),P.y+P.h+14,y,{a:'middle',cls:'m'});
  s+=yl(g,P,[80,110,140,170,200],v=>v);
  s+=g.pill(P.sx(2006),P.sy(184)-14,'2006 peak','purple');
  if(si===3)s+=g.pill(P.sx(2012),P.sy(134)+18,'2012 low (≈ −27%)','red');
  return s;
},
steps:[
 {k:'setup',t:'A housing boom',short:'Boom',m:{hp:'+84% (2000–06)'},
  b:'After 2001, low rates and a belief that house prices never fall nationally fed a US housing boom. Lenders relaxed standards: “subprime” loans with little down payment and teaser rates went to borrowers who could only keep up if prices kept rising and they could refinance. In Minsky’s terms, Ponzi finance (lesson 5.6).'},
 {k:'problem',t:'Packaged and leveraged',short:'Leverage',m:{lev:'≈ 30:1'},
  b:'Mortgages were bundled into securities (MBS) and re-bundled (CDOs), rated AAA and sold worldwide. Banks and “shadow banks” held them with very high leverage, funded with short-term borrowing. When house prices started falling in 2006–07, nobody knew who held the losses, so lenders stopped lending to everyone.'},
 {k:'problem',t:'Lehman and the panic',short:'Lehman',
  b:'Bear Stearns was rescued in March 2008. On 15 September 2008 Lehman Brothers was allowed to fail. Short-term funding markets froze worldwide, money-market funds “broke the buck”, and AIG needed a rescue the next day. This was a modern bank run, on wholesale funding instead of a queue at the door.'},
 {k:'solution',t:'The response',short:'Response',m:{hp:'−27% to 2012'},
  b:'The Fed cut rates to about zero, lent freely (Bagehot), bought bonds with new money (QE) and opened dollar swap lines to foreign central banks; Congress passed TARP to recapitalise banks plus fiscal stimulus. Dalio points to the US from 2009 as a beautiful deleveraging: debt burdens fell without deflation, though recovery took most of a decade.'},
 {k:'history',t:'An echo: SVB, 2023',short:'SVB',
  b:'In 2022 the Fed raised rates fast. Silicon Valley Bank held lots of long-term bonds whose prices fell (lesson 3.5) and many uninsured deposits. In March 2023 depositors pulled tens of billions in a day by phone. Authorities guaranteed all deposits and the Fed created an emergency lending facility: Bagehot’s rule, 150 years on.'}
]});

/* ======================================================= the pattern */
const KS=[['Displacement','something new','green'],['Boom','credit grows','yellow'],['Euphoria','“it’s different”','orange'],['Distress','insiders sell','red'],['Panic','run for cash','purple'],['Policy','lender of last resort, levers','blue']];
ML.add({id:'crisis-pattern',title:'The Pattern Behind Every Crisis',min:9,lvl:'Intermediate',
sub:'Minsky and Kindleberger’s stages: displacement, boom, euphoria, distress, panic. Then policy decides how bad it gets.',
keys:'minsky kindleberger manias panics and crashes stages of a crisis early warning signs this time is different',
learn:['The five stages','Warning signs you can watch','What separates mild from catastrophic','Linking history back to the machine'],
cheat:['Kindleberger (<i>Manias, Panics, and Crashes</i>, after Minsky): displacement → boom → euphoria → distress → panic.','Warning signs: debt growing faster than income, rising asset prices bought with credit, short-term funding of long assets, foreign-currency debt, “new era” stories.','Damage depends on <b>leverage</b> (tulips: little; 1929/2008: lots) and on the <b>policy response</b> (1930–32 vs 1933, 2008).'],
met:[['st','Stage','repeat']],
draw(si,g){
  if(si===0){let s='';KS.slice(0,5).forEach(([t,sub,c],i)=>{const x=110+i*160,y=300-[0,60,120,60,-20][i];s+=g.box(x,y,145,64,t,c,{hot:1,sub});if(i)s+=g.A(x-160+72,300-[0,60,120,60,-20][i-1],x-72,y,{c:'edge'})});return s}
  if(si===1)return g.table(80,70,[{t:'Warning sign',w:330,a:'l'},{t:'Seen in',w:370,a:'l'}],[{c:['Debt rising faster than income','1929, Japan 1990, 2008 (lesson 5.4)']},{c:['Assets bought with borrowed money','1720, 1929, 2008 (lesson 5.6)']},{c:['Short-term funding of long assets','1825, 1907, 2008, SVB 2023']},{c:['Debt in a currency you can’t print','1982, 1997']},{c:['“New era” stories, everyone in','1637, 1720, 2000']}],{rh:46});
  return g.table(100,90,[{t:'Crisis',w:200,a:'l'},{t:'Leverage',w:150,a:'l'},{t:'Policy response',w:200,a:'l'},{t:'Damage',w:130,a:'l'}],[{c:['Tulips 1637','low','none needed','mild'],cc:[null,'green',null,'green']},{c:['US 1930–32','high','slow, tight money','severe'],cc:[null,'red','red','red']},{c:['US 1933–37','high','reflation, FDIC','recovery'],cc:[null,'red','green','yellow']},{c:['Indonesia 1998','high, in $','austerity first','severe'],cc:[null,'red','red','red']},{c:['US 2008–','high','fast, all levers','lost decade, no depression'],cc:[null,'red','green','yellow']}],{rh:44});
},
steps:[
 {k:'insight',t:'Five stages',short:'Stages',m:{st:'5'},
  b:'Charles Kindleberger, building on Hyman Minsky, found the same arc in centuries of crises. A <b>displacement</b> (a new technology, a policy change) creates real opportunity; credit-fuelled <b>boom</b>; <b>euphoria</b> when everyone piles in; <b>distress</b> as insiders quietly sell; then <b>panic</b>.',
  n:['Displacement','Boom','Euphoria','Distress','Panic']},
 {k:'technique',t:'Warning signs',short:'Signs',
  b:'Every warning sign is something you already learned in the machine: debt outpacing income, assets bought on credit, borrowing short to lend long, borrowing in someone else’s currency, and the conviction that old rules no longer apply.'},
 {k:'recap',t:'Leverage and policy decide the damage',short:'Damage',
  b:'Tulips hurt buyers but not the economy, because little debt was involved. 1929 and 2008 had huge leverage; what separated a decade of depression from a painful but shorter slump was how fast policymakers used the levers from Module 06. History is the best evidence that Dalio’s machine is real.'}
]});
})();
