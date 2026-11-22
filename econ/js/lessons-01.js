/* 01 · Transactions, Markets & Government */
(function(){const U=ML.U,E=ML.EC,F=E.F;

/* ======================================================= transactions */
ML.add({id:'transactions',title:'Transactions',min:7,lvl:'Beginner',
sub:'The basic building block of the whole economy: a buyer gives money or credit, a seller gives something back.',
keys:'transaction buyer seller exchange goods services financial assets money credit dalio',
learn:['What a transaction is','The three things you can buy','Paying with money or with credit','Why the economy is just transactions, repeated'],
cheat:['Transaction = buyer exchanges <b>money or credit</b> with a seller for <b>goods, services or financial assets</b>.','Every economic number (GDP, prices, debt) is a sum of transactions.','Understand transactions and you understand the machine.'],
met:[['buy','Buyer pays','dollar'],['get','Buyer gets','check'],['n','Transactions','hash']],
hero:3,
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.actor(200,230,'Sari',  'orange',{s:1.6,sub:'buyer (coffee stall)'}),g.actor(660,230,'Budi','green',{s:1.6,sub:'seller (rice farmer)'}));
    s.push(g.A(270,190,590,190,{c:'yellow',w:2.2,l:'$10'}),g.A(590,280,270,280,{c:'green',w:2.2,l:'1 sack of rice'}));
  }else if(si===1){
    [['Goods','rice, phones, cars','green',150],['Services','haircuts, lessons, repairs','blue',430],['Financial assets','shares, bonds, houses','purple',710]].forEach(([t,sub,c,x],i)=>s.push(g.box(x,190,230,90,t,c,{sub,hot:1}),g.icon(['tool','user','chart'][i],x,120,30)));
    s.push(g.T(430,330,'A buyer can exchange money or credit for any of these.',{a:'middle',cls:'b'}));
  }else if(si===2){
    s.push(g.box(250,130,300,64,'Pay with money','yellow',{sub:'settled on the spot',hot:1}),g.box(610,130,300,64,'Pay with credit','pink',{sub:'"I promise to pay later"',hot:1}));
    s.push(g.panel(110,230,'Sari pays cash',['Sari → Budi: $10','done, nobody owes anybody'],'yellow',{w:280}),g.panel(470,230,'Sari pays with a card',['Bank → Budi: $10 now','Sari owes the bank $10','  (+ interest) later'],'pink',{w:280}));
  }else{
    s.push(g.T(430,40,'Nusa’s economy: thousands of transactions, every day',{a:'middle',cls:'b'}));
  }
  return s.join('');
},
anim(si,t,g){
  if(si===0){const k=(t%2.4)/2.4;return g.coin(U.lerp(270,590,U.ease(k)),190,'$')+`<g opacity="${(1-Math.abs(k-.5)*2).toFixed(2)}">${g.icon('layers',U.lerp(590,270,U.ease(k)),280,22)}</g>`}
  if(si!==3)return '';
  const r=U.rng(3);let s='';const cols=['orange','green','blue','purple','pink','yellow'];
  for(let i=0;i<34;i++){const x1=80+r()*700,y1=80+r()*340,x2=80+r()*700,y2=80+r()*340,ph=(t*.5+r())%1;
    s+=g.C(x1,y1,5,cols[i%6],{op:.85})+g.C(x2,y2,5,cols[(i+2)%6],{op:.85})+g.L([[x1,y1],[x2,y2]],'gray',{cls:'thin',op:.25})+g.dot(x1,y1,x2,y2,ph,'yellow',{r:3.5})}
  return s;
},
steps:[
 {k:'setup',t:'One transaction',short:'One deal',m:{buy:'$10',get:'rice',n:'1'},
  b:'Sari runs a coffee stall on the island of Nusa. She buys a sack of rice from Budi the farmer for $10. That is a <b>transaction</b>: a buyer gives money, a seller gives something back.\n\nRay Dalio’s video starts here because everything else in the economy is built out of this one move.',
  n:['Sari hands over $10','Budi hands over the rice','Both are better off, or they would not trade']},
 {k:'technique',t:'Three things to buy',short:'What',
  b:'A buyer can exchange money for <b>goods</b> (things you can touch), <b>services</b> (work someone does for you) or <b>financial assets</b> (claims on future money: shares, bonds, property).',
  ch:['+ Financial assets matter later: their prices move with interest rates']},
 {k:'insight',t:'Money or credit',short:'How',m:{buy:'money or credit'},
  b:'The buyer can pay in two ways: with <b>money</b>, which settles the deal right away, or with <b>credit</b>, a promise to pay later. To Budi both look the same: he got paid.\n\nThis small difference turns out to drive the booms and busts in Module 05.',
  ch:['! Credit spends like money, but it leaves a debt behind']},
 {k:'recap',t:'The economy is transactions, repeated',short:'All of them',m:{n:'millions'},
  b:'Add up every transaction on Nusa, by everyone, for every good, service and asset, and you get the economy. GDP, inflation, debt and unemployment are all just ways of summarising those transactions.\n\nThe rest of this course follows that idea all the way to the long-term debt cycle.'}
]});

/* ======================================================= total spending & price */
const MKT={q:100,money:400,credit:600};
ML.add({id:'total-spending',title:'Total Spending & Price',min:8,lvl:'Beginner',
sub:'Add up all the money and credit spent on something, divide by how much was sold, and you have the price.',
keys:'total spending price quantity money credit demand supply',
learn:['Total spending = money + credit','Price = total spending ÷ quantity','Why more credit can lift prices','Why more output can lower them'],
cheat:['<b>Total spending</b> = money spent + credit spent. It is the driving force of the economy.','<b>Price = total spending ÷ quantity sold.</b>','More spending on the same quantity → higher price. More quantity for the same spending → lower price.'],
met:[['sp','Total spending','dollar'],['q','Quantity','layers'],['p','Price','scale']],
draw(si,g){
  const s=[];const cases=[[MKT.money,MKT.credit,MKT.q],[MKT.money,MKT.credit,MKT.q],[MKT.money,MKT.credit+300,MKT.q],[MKT.money,MKT.credit,MKT.q*1.25]];
  const [mo,cr,q]=cases[Math.min(si,3)],tot=mo+cr,pr=tot/q;
  s.push(g.stack(120,70,130,340,[['Money',mo,'yellow'],['Credit',cr,'pink']],{total:1400,title:'Total spending',fmt:v=>F.d(v)}));
  s.push(g.T(330,250,'÷',{a:'middle',size:40,cls:'b'}));
  const nq=Math.round(q/25);for(let i=0;i<nq;i++)s.push(g.R(380+(i%3)*44,370-Math.floor(i/3)*44,38,38,{rx:6,fill:'var(--green-bg)',stroke:'var(--edge)',sw:1.3}));
  s.push(g.T(445,415,`${q} kg of rice`,{a:'middle',cls:'b'}));
  s.push(g.T(560,250,'=',{a:'middle',size:40,cls:'b'}));
  s.push(g.box(700,250,180,90,`$${pr.toFixed(2)} / kg`,'orange',{hot:1,sub:'price'}));
  if(si>=2)s.push(g.panel(610,330,si===2?'More credit':'More rice',si===2?['spending +$300','same rice','→ price up']:['same spending','25% more rice','→ price down'],si===2?'pink':'green',{w:180}));
  return s.join('');
},
steps:[
 {k:'setup',t:'Add up the spending',short:'Spending',m:{sp:F.d(1000)},
  b:`In one month buyers on Nusa spend <b>$${MKT.money}</b> of money and <b>$${MKT.credit}</b> of credit on rice: $1,000 in total.\n\nDalio’s point: credit is part of spending. You cannot understand demand by looking at money alone.`},
 {k:'math',t:'Divide by quantity',short:'Price',m:{q:'100 kg',p:'$10.00'},
  b:'Farmers sold 100 kg. So the price is simply $1,000 ÷ 100 kg = <b>$10 per kg</b>.\n\nThat is all a price is: total spending divided by quantity sold.'},
 {k:'insight',t:'More credit, higher price',short:'Credit up',m:{sp:F.d(1300),p:'$13.00'},
  b:'Suppose banks lend more and buyers spend $300 more on credit, but farms grow the same 100 kg. Spending rises to $1,300 and the price to <b>$13</b>.\n\nWhen spending grows faster than the stuff being made, you get inflation (lesson 4.3).',
  ch:['! A credit boom can push prices up without anyone being "greedy"']},
 {k:'insight',t:'More output, lower price',short:'Output up',m:{sp:F.d(1000),q:'125 kg',p:'$8.00'},
  b:'If farmers get more productive and sell 125 kg for the same $1,000 of spending, the price falls to <b>$8</b>. Productivity makes things cheaper; that is why living standards rise over time (lesson 5.1).'}
]});

/* ======================================================= markets */
const MK=[['Rice','green'],['Cars','blue'],['Haircuts','pink'],['Shares','purple'],['Bonds','orange'],['Houses','brown']];
ML.add({id:'markets',title:'Markets',min:7,lvl:'Beginner',
sub:'All the buyers and sellers trading the same thing. The economy is all markets added together.',
keys:'market buyers sellers goods services financial assets stock market bond market economy',
learn:['What a market is','Markets for goods, services and assets','The economy as all markets together','Who the biggest buyers are'],
cheat:['<b>Market</b> = all the buyers and all the sellers making transactions for the same thing.','There are markets for goods (wheat, cars), services (haircuts), and financial assets (stocks, bonds).','Economy = all transactions in all markets. Total spending and total quantity sold tell you almost everything.'],
met:[['m','Markets shown','grid'],['big','Biggest buyers','bank']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.box(430,240,170,74,'Rice market','green',{hot:1,sub:'one price emerges'}));
    for(let i=0;i<5;i++){s.push(g.actor(130,90+i*80,'',  'orange',{s:.75}),g.actor(730,90+i*80,'','green',{s:.75}))}
    s.push(g.T(130,460,'buyers',{a:'middle',cls:'b',c:'orange'}),g.T(730,460,'sellers',{a:'middle',cls:'b',c:'green'}));
  }else if(si===1){
    MK.forEach(([l,c],i)=>{const x=150+(i%3)*280,y=150+Math.floor(i/3)*170;s.push(g.box(x,y,220,80,l+' market',c,{hot:1,sub:i<2?'goods':i<3?'services':'financial assets'}))});
  }else if(si===2){
    MK.forEach(([l,c],i)=>{const a=i/MK.length*Math.PI*2-Math.PI/2,x=430+Math.cos(a)*250,y=245+Math.sin(a)*165;s.push(g.A(x,y,430+Math.cos(a)*95,245+Math.sin(a)*70,{c,w:1.8}),g.box(x,y,130,46,l,c))});
    s.push(g.box(430,245,170,80,'THE ECONOMY','yellow',{hot:1,sub:'sum of all markets'}));
  }else{
    s.push(g.box(250,160,280,90,'Government','blue',{hot:1,sub:'collects taxes, spends'}),g.box(610,160,280,90,'Central bank','orange',{hot:1,sub:'controls money & credit'}));
    s.push(g.T(430,300,'Like any buyer, they transact in markets. They are just much bigger.',{a:'middle',cls:'b'}),g.T(430,325,'Next lessons: how they fit into the machine.',{a:'middle',cls:'m'}));
  }
  return s.join('');
},
anim(si,t,g){if(si!==0)return '';let s='';for(let i=0;i<5;i++){const k=((t*.6+i*.2)%1);s+=g.dot(160,90+i*80,345,240,k,'yellow',{r:4})+g.dot(700,90+i*80,515,240,k,'green',{r:4})}return s},
steps:[
 {k:'setup',t:'Buyers meet sellers',short:'A market',m:{m:'1'},
  b:'A <b>market</b> is all the buyers and sellers making transactions for the same thing. Everyone on Nusa who buys rice, and every farmer who sells it, together make the rice market. Their combined spending and selling sets one price.'},
 {k:'technique',t:'Many markets',short:'Many',m:{m:'6'},
  b:'There is a market for each thing: rice and cars (goods), haircuts (a service), and shares, bonds and houses (financial assets). Each has its own buyers, sellers and price.'},
 {k:'insight',t:'The economy = all markets',short:'Economy',
  b:'Put every market together and you get the economy. Dalio’s shortcut: you do not have to study each market. Watch <b>total spending</b> and <b>total quantity sold</b> and you know most of what matters.'},
 {k:'recap',t:'Two giant buyers',short:'Big buyers',m:{big:'govt + central bank'},
  b:'People, businesses, banks and governments all transact. The two biggest players are the <b>government</b> and the <b>central bank</b>. The next two lessons show why they are so important.'}
]});

/* ======================================================= spending-as-income loop */
const RING=['Sari','Budi','Ani','Dewi'];
ML.add({id:'income-loop',title:'Spending Is Income',min:8,lvl:'Beginner',
sub:'Every dollar you spend is someone else’s income. Cut spending and you cut someone’s pay.',
keys:'circular flow spending income loop paradox of thrift aggregate demand',
learn:['Spending and income are two sides of one transaction','The circular flow','Why one person cutting back hurts others','How credit adds to the loop'],
cheat:['<b>One person’s spending is another person’s income.</b>','Total spending = total income for the economy as a whole.','If everyone tries to save more at once, incomes fall (paradox of thrift).','Credit lets spending run ahead of income for a while, and that extra spending becomes someone else’s income.'],
met:[['inc','Income in the loop','dollar'],['chg','Change','trend']],
hero:0,
draw(si,g){
  const s=[];const scale=si===1?.8:si===2?1.25:1;
  RING.forEach((n,i)=>{const a=i/4*Math.PI*2-Math.PI/2,x=430+Math.cos(a)*200,y=240+Math.sin(a)*150;s.push(g.actor(x,y,n,['orange','green','blue','purple'][i],{s:1.1,sub:`earns $${Math.round(100*scale)}`}))});
  s.push(g.T(430,245,si===1?'Sari spends 20% less':si===2?'Sari borrows $25 and spends it':'Each spends what they earn',{a:'middle',cls:'b'}));
  if(si===3){s.push(g.panel(560,330,'Paradox of thrift',['one person saving: fine','everyone saving at once:','  incomes fall for all'],'red',{w:250}))}
  return s.join('');
},
anim(si,t,g){
  let s='';const pos=RING.map((_,i)=>{const a=i/4*Math.PI*2-Math.PI/2;return [430+Math.cos(a)*200,240+Math.sin(a)*150]});
  const n=si===1?2:si===2?5:3;
  for(let i=0;i<4;i++){const [x1,y1]=pos[i],[x2,y2]=pos[(i+1)%4];for(let j=0;j<n;j++){const k=(t*.35+j/n)%1;s+=g.dot(x1+(x2-x1)*.15,y1+(y2-y1)*.15,x2-(x2-x1)*.15,y2-(y2-y1)*.15,k,j===n-1&&si===2?'pink':'yellow',{r:5,curve:40})}}
  return s;
},
steps:[
 {k:'setup',t:'Round and round',short:'The loop',m:{inc:'$400',chg:'—'},
  b:'Sari buys rice from Budi. Budi pays Ani to fix his roof. Ani buys clothes from Dewi. Dewi buys coffee from Sari. Each person’s <b>spending</b> becomes the next person’s <b>income</b>.\n\nFor the economy as a whole, total spending and total income are the same number.',
  n:['Sari spends → Budi earns','Budi spends → Ani earns','Ani spends → Dewi earns','Dewi spends → Sari earns']},
 {k:'problem',t:'One person cuts back',short:'Cut back',m:{inc:'$320',chg:'−20%'},
  b:'If Sari decides to spend 20% less, Budi earns 20% less. So Budi spends less, Ani earns less, and so on around the ring. Eventually Sari’s own income falls too.\n\nThis is why recessions spread: cutting spending cuts incomes.',
  ch:['! You cannot cut your way out if everyone cuts at once']},
 {k:'insight',t:'Credit adds to the loop',short:'Credit',m:{inc:'$500',chg:'+25%'},
  b:'Now Sari borrows $25 and spends it on top of her income. That extra spending becomes Budi’s income, so Budi can spend more (and borrow more, since lenders see his higher income). Credit makes the whole loop spin faster, for now.\n\nLater Sari must repay, and her spending will have to drop below her income. Keep that in mind for Module 05.'},
 {k:'recap',t:'The paradox of thrift',short:'Thrift',
  b:'Saving is wise for one family, but if everyone saves more at the same moment, total spending (and so total income) falls. That is the <b>paradox of thrift</b>, and it reappears when we study austerity in a deleveraging (lesson 6.2).'}
]});

/* ======================================================= government & central bank */
ML.add({id:'government',title:'Government & Central Bank',min:9,lvl:'Beginner',
sub:'The central government taxes and spends. The central bank controls money and credit. They have different tools.',
keys:'central government taxes spending fiscal policy central bank monetary policy interest rates printing money independence',
learn:['What the central government does','What the central bank does','Fiscal vs monetary policy','Why they need each other in a crisis'],
cheat:['<b>Central government</b>: collects taxes, spends on goods, services, support and stimulus (<b>fiscal policy</b>).','<b>Central bank</b>: controls money and credit by setting <b>interest rates</b> and, when needed, <b>printing money</b> (<b>monetary policy</b>).','The government can spend but cannot print. The central bank can print but cannot decide who gets the money.'],
met:[['gov','Government tool','bank'],['cb','Central bank tool','gear']],
draw(si,g){
  const s=[];
  const gov=g.box(220,120,260,70,'Government of Nusa','blue',{hot:si===0||si>=2,sub:'fiscal policy'}),cb=g.box(640,120,260,70,'Central Bank of Nusa','orange',{hot:si>=1,sub:'monetary policy'});
  s.push(gov,cb);
  if(si===0||si>=2){s.push(g.actor(120,330,'households','green',{s:.9}),g.actor(320,330,'businesses','purple',{s:.9}));
    s.push(g.A(150,290,195,160,{c:'blue',l:'taxes',curve:-20}),g.A(250,160,300,290,{c:'green',l:'spending & aid',curve:-20}))}
  if(si>=1){s.push(g.box(640,300,220,60,'Commercial banks','gray',{sub:'lend to everyone'}));
    s.push(g.A(640,158,640,268,{c:'orange',l:'interest rate'}),g.A(760,140,760,300,{c:'pink',l:'new money',curve:-40}))}
  if(si===3){s.push(g.A(510,120,355,120,{c:'pink',l:'buys govt bonds',w:2.2}),g.panel(320,390,'In a deleveraging they must work together',['govt spends (but must borrow)','central bank buys the bonds with new money'],'yellow',{w:400}))}
  return s.join('');
},
steps:[
 {k:'setup',t:'The central government',short:'Government',m:{gov:'tax & spend'},
  b:'The <b>central government</b> collects taxes and spends the money on goods, services, support payments (like unemployment benefits) and stimulus. When it spends more than it collects, it runs a <b>deficit</b> and borrows the difference by selling bonds.'},
 {k:'technique',t:'The central bank',short:'Central bank',m:{cb:'rates & money'},
  b:'The <b>central bank</b> controls the amount of money and credit in the economy. Its everyday tool is the <b>interest rate</b> it charges banks. Its emergency tool is <b>printing new money</b>, usually to buy bonds.\n\nIt does not choose who gets loans; it changes the price of credit for everyone.'},
 {k:'tradeoff',t:'Two different toolkits',short:'Compare',
  b:'The government can direct money to specific people (the unemployed, a region, a project) but cannot create money. The central bank can create money but cannot target who gets it. This split is deliberate: it keeps the money printer away from politics.',
  ch:['+ Fiscal policy: targeted, slower, political','+ Monetary policy: fast, broad, independent']},
 {k:'insight',t:'Working together in a crisis',short:'Together',
  b:'In a deep crisis the two combine: the government runs a big deficit, and the central bank prints money to buy the government’s bonds. Dalio returns to this pairing in lesson 6.5.'}
]});

/* ======================================================= three forces */
const FO=E.forces(),fT=FO.map(p=>p.t);
ML.add({id:'three-forces',title:'The Three Forces',min:10,lvl:'Beginner',
sub:'Productivity growth, the short-term debt cycle and the long-term debt cycle. Add them up and you get the economy.',
keys:'three forces productivity growth short term debt cycle long term debt cycle dalio template',
learn:['Productivity: the slow upward trend','The short-term debt cycle (5–8 years)','The long-term debt cycle (75–100 years)','How the three add up'],
cheat:['Force 1: <b>productivity growth</b>, the long trend line (≈2% a year).','Force 2: the <b>short-term debt cycle</b>, ≈5–8 years, run by the central bank’s interest rate.','Force 3: the <b>long-term debt cycle</b>, ≈75–100 years, as debts rise faster than incomes over many short cycles.','Economy = all three layered on top of each other.'],
met:[['f','Forces on chart','layers'],['len','Cycle length','clock']],
hero:3,
draw(si,g){
  const s=[];const P=g.plot({x:70,y:40,w:740,h:380,xr:[0,100],yr:[60,900],nx:10,ny:5,yl:'economic activity'});
  s.push(P.svg);
  s.push(P.line(FO.map(p=>[p.t,p.prod]),'green',{w:si===0?3:2,cls:si>0?'dash':''}));
  if(si===1)s.push(P.line(FO.map(p=>[p.t,p.prod*(1+p.short*3)]),'blue',{w:2.6}));
  if(si>=2)s.push(P.line(FO.map(p=>[p.t,p.pl]),'purple',{w:2.4,cls:si>2?'dash':''}));
  if(si>=3)s.push(P.line(FO.map(p=>[p.t,p.act]),'blue',{w:3}));
  s.push(g.T(P.sx(98),P.sy(FO[FO.length-1].prod)+18,'productivity',{a:'end',cls:'b',c:'green'}));
  if(si===2)s.push(g.T(P.sx(70),P.sy(FO[280].pl)-14,'long-term debt cycle',{a:'end',cls:'b',c:'purple'}));
  if(si>=3)s.push(g.T(P.sx(30),P.sy(FO[120].act)-40,'what we actually see',{a:'middle',cls:'b',c:'blue'}));
  [0,25,50,75,100].forEach(v=>s.push(g.T(P.sx(v),P.y+P.h+14,'year '+v,{a:'middle',cls:'m'})));
  return s.join('');
},
anim(si,t,g){if(si<3)return '';const P=g.plot({x:70,y:40,w:740,h:380,xr:[0,100],yr:[60,900],grid:false});const i=Math.floor((t*12)%FO.length),p=FO[i];return `<g>${g.C(P.sx(p.t),P.sy(p.act),7,'yellow')}</g>`},
steps:[
 {k:'setup',t:'Force 1: productivity',short:'Productivity',m:{f:'1',len:'decades'},
  b:'Over long periods, what we produce per person rises because people learn, invent and work smarter. That is <b>productivity growth</b>, and it is the main reason we are richer than our great-grandparents. It moves slowly, about 2% a year, so it does not cause the swings we notice.'},
 {k:'insight',t:'Force 2: the short-term debt cycle',short:'Short cycle',m:{f:'2',len:'5–8 yrs'},
  b:'Around the trend, activity swings up and down every 5–8 years. Those swings come from <b>credit</b>: easy credit lets spending run above the trend, then tighter credit pulls it below. The central bank’s interest rate sets the rhythm. (Wiggles drawn 3× bigger here so you can see them.)'},
 {k:'insight',t:'Force 3: the long-term debt cycle',short:'Long cycle',m:{f:'3',len:'75–100 yrs'},
  b:'Each short cycle tends to end with a bit more debt than it started with. Over 75–100 years debts pile up faster than incomes until they cannot rise any more. Then they must come down: a <b>deleveraging</b>. That is the hump and the drop in the purple line.'},
 {k:'recap',t:'Add them up',short:'All three',m:{f:'3',len:'all'},
  b:'The blue line is what we actually live through: productivity, plus a short cycle, plus a long cycle. Dalio’s template says almost all big economic moves are these three forces layered together.\n\nModule 02 starts with the ingredient that drives both cycles: credit.',
  tip:['Try it yourself','The Lab’s long-cycle builder lets you change how people borrow and see when the long cycle peaks.']}
]});
})();
