/* 08 · The Dollar & the World Monetary System
   Shares: IMF COFER (reserves, 2025Q3 ≈ 57%) and BIS Triennial Survey (FX turnover, April 2025: 89%). Historical series approximate. */
(function(){const U=ML.U,E=ML.EC,F=E.F;
const yl=(g,P,vals,fmt)=>vals.map(v=>g.T(P.x-6,P.sy(v)+3,fmt(v),{a:'end',cls:'m'})).join('');

/* ======================================================= what a reserve currency is */
const RC=[['Portuguese real','~1450–1530','green'],['Spanish real','~1530–1640','orange'],['Dutch guilder','~1640–1720','yellow'],['French livre','~1720–1815','blue'],['British pound','~1815–1920','purple'],['US dollar','~1920–today','pink']];
ML.add({id:'reserve-currency',title:'What Is a Reserve Currency?',min:8,lvl:'Beginner',
sub:'The money other countries hold in their savings and use to trade with each other. Every era has had one, and none lasted forever.',
keys:'reserve currency world currency global currency dutch guilder british pound us dollar dalio changing world order',
learn:['What a reserve currency does','Why the world needs one','The succession of reserve currencies','Dalio’s rise-and-decline pattern'],
cheat:['A <b>reserve currency</b> is held by central banks as savings and used to price and settle trade and debt between other countries.','Network effect: everyone uses it because everyone else does.','Succession (approx.): Portuguese → Spanish → Dutch guilder → French livre → British pound → US dollar.','Dalio (<i>The Changing World Order</i>): reserve status follows economic, trade, financial and military power, and outlasts it for a while.'],
met:[['era','Era','clock']],
draw(si,g){
  if(si===0){return g.actor(170,250,'Indonesia','red',{s:1.3,sub:'sells coal'})+g.actor(690,250,'Korea','blue',{s:1.3,sub:'sells phones'})+g.A(240,230,620,230,{c:'green',w:2.2,l:'priced and paid in US dollars'})+g.panel(230,330,'Neither country uses dollars at home',['but both hold dollars to trade','and keep dollars in reserves for emergencies'],'yellow',{w:400})}
  let s='';RC.forEach(([t,yrs,c],i)=>{const x=95+i*134,on=si===2||i>=4;s+=g.box(x,220,124,72,t,c,{hot:on,dim:!on,sub:yrs});if(i)s+=g.A(x-67,220,x-62,220,{c:'edge'})});
  if(si===2)s+=g.T(430,340,'Each lasted roughly a century; each decline followed debt, war and lost competitiveness.',{a:'middle',cls:'b'});
  return s;
},
steps:[
 {k:'setup',t:'Money between countries',short:'Role',
  b:'Indonesia sells coal to Korea. Neither uses dollars at home, yet the deal is usually priced and paid in <b>US dollars</b>. Central banks also keep savings (reserves) in dollars to defend their currency in a crisis. A currency that plays these roles for the whole world is a <b>reserve currency</b>.'},
 {k:'insight',t:'Why one dominates',short:'Network',m:{era:'1815 → today'},
  b:'It is a network effect, like a language: traders price in dollars because buyers have dollars, and banks lend in dollars because borrowers need them. Before the dollar, the British pound played this role through the 1800s, backed by Britain’s empire, navy and the City of London.'},
 {k:'history',t:'Nothing lasts forever',short:'Succession',m:{era:'~6 eras'},
  b:'Historians trace a line of dominant currencies: Portuguese and Spanish coins, the Dutch guilder, the French livre, the British pound, then the US dollar (the earlier dates are rough). In <i>The Changing World Order</i> Dalio argues reserve status follows a country’s economic, trading, financial and military strength, lingers after that strength fades, and ends after too much debt and money printing.'}
]});

/* ======================================================= rise of the dollar */
ML.add({id:'rise-of-dollar',title:'How the Dollar Overtook the Pound',min:9,lvl:'Intermediate',
sub:'The US was the biggest economy by the 1870s, but the dollar only took over after the Fed was created and two world wars drained Britain.',
keys:'rise of the dollar pound sterling federal reserve 1913 world war i trade acceptances eichengreen exorbitant privilege',
learn:['Why size alone wasn’t enough','What the Fed changed in 1914','Two wars and a shift in creditors','By 1945: the dollar on top'],
cheat:['US economy became the world’s largest around the 1870s, but the dollar played almost no global role before 1914.','Missing pieces: a central bank and a market for dollar trade finance. The Fed (1913) supplied both.','WWI: Europe borrowed from the US; the US became a creditor. By the mid-1920s dollar trade credit rivalled sterling (Eichengreen).','WWII: Britain heavily indebted; the US held most of the world’s monetary gold → Bretton Woods (next lesson).'],
met:[['who','Leading currency','dollar']],
draw(si,g){
  const items=[['1870s','US economy #1'],['1913','Fed created'],['1914–18','WWI: US lends'],['1920s','$ rivals £'],['1939–45','WWII'],['1944','Bretton Woods']];
  const on=[0,1,3,5][si];
  let s=g.timeline(90,190,680,items,{on,done:on,c:'pink'});
  if(si===0)s+=g.panel(240,300,'Big economy, small currency',['no central bank, frequent bank panics','US trade financed in London, in pounds'],'gray',{w:380});
  if(si===1)s+=g.panel(240,300,'What the Fed added',['a lender of last resort (lesson 7.5)','a market for dollar trade credit'],'blue',{w:380});
  if(si===2)s+=g.panel(240,300,'A creditor nation',['Europe borrows from America in WWI','by the mid-1920s, dollar trade credit','  rivals sterling'],'pink',{w:380});
  if(si===3)s+=g.panel(240,300,'1945',['Britain deeply in debt','US: largest economy, largest creditor,','  most of the world’s monetary gold'],'green',{w:380});
  return s;
},
steps:[
 {k:'setup',t:'Big economy, small currency',short:'Before 1914',m:{who:'£ pound'},
  b:'By the 1870s the US was the world’s largest economy. Yet before 1914 the dollar had almost no international role: the US had no central bank, suffered frequent bank panics, and even American importers financed their trade in London, in pounds.'},
 {k:'history',t:'The Fed changes the plumbing',short:'1913',
  b:'The Federal Reserve Act of 1913, a response to the Panic of 1907 (lesson 7.5), gave the US a lender of last resort and let American banks deal in dollar trade finance. Economic historian Barry Eichengreen shows that within about a decade, dollar trade credit rivalled sterling’s.'},
 {k:'history',t:'Wars shift the creditors',short:'Wars',m:{who:'£ and $'},
  b:'World War I turned the US from a debtor into the world’s lender, as Europe borrowed to fight. The 1930s were messy, with both currencies devalued. World War II finished the shift: Britain ended the war heavily indebted, while the US was the largest economy, the largest creditor and held most of the world’s monetary gold.'},
 {k:'recap',t:'1945: the dollar on top',short:'1945',m:{who:'$ dollar'},
  b:'So when the Allies designed the post-war money system in 1944, it was built around the dollar. Size mattered, but so did institutions (a central bank, deep markets) and being the world’s creditor.'}
]});

/* ======================================================= bretton woods */
ML.add({id:'bretton-woods',title:'Bretton Woods & the Nixon Shock',min:11,lvl:'Intermediate',
sub:'1944: other currencies pegged to the dollar, the dollar pegged to gold at $35. 1971: the US closed the gold window.',
keys:'bretton woods 1944 gold $35 ounce imf world bank triffin dilemma nixon shock 1971 fiat dollar standard',
learn:['How the Bretton Woods system worked','The Triffin dilemma','Why the gold ran out','The Nixon shock and the fiat dollar'],
cheat:['1944, Bretton Woods, New Hampshire: 44 countries created the IMF and World Bank.','Other currencies fixed (within ±1%) to the dollar; the dollar convertible to gold for foreign governments at <b>$35 an ounce</b>.','<b>Triffin dilemma</b>: the world needs ever more dollars, which requires US deficits, which erode confidence that dollars can be swapped for gold.','15 Aug 1971: Nixon suspended gold convertibility → the dollar became fiat money, but stayed the world’s currency.'],
met:[['gold','Gold per $35','scale'],['yr','Year','clock']],
draw(si,g){
  if(si===0){let s=g.box(430,90,170,60,'Gold','yellow',{hot:1,sub:'$35 an ounce'})+g.A(430,122,430,190,{c:'edge'})+g.box(430,220,190,60,'US dollar','green',{hot:1})+['£','DM','¥','FF','Lira'].map((c,i)=>{const x=150+i*140;return g.A(x,340,430+(x-430)*.25,252,{c:'gray',cls:'thin'})+g.box(x,360,90,46,c,'blue',{hot:1,sub:'±1%'})}).join('');return s}
  if(si===1||si===2){const P=g.plot({x:90,y:40,w:640,h:340,xr:[1950,1972],yr:[0,70],nx:11,ny:7,yl:'$ billions (approx.)'});
    const gold=[[1950,22.8],[1955,21.8],[1958,20.6],[1960,17.8],[1965,13.8],[1968,10.9],[1971,10.2]],liab=[[1950,8],[1955,12],[1960,19],[1964,24],[1968,34],[1971,64]];
    let s=P.svg+P.line(gold,'yellow',{w:3})+g.T(P.sx(1971)+6,P.sy(10.2)+4,'US gold stock',{cls:'b',c:'yellow'});
    if(si===2)s+=P.line(liab,'red',{w:3})+g.T(P.sx(1971)-6,P.sy(64)-8,'dollars held abroad',{a:'end',cls:'b',c:'red'})+g.pill(P.sx(1964),P.sy(30),'1960s: claims exceed the gold','red');
    for(let y=1950;y<=1970;y+=4)s+=g.T(P.sx(y),P.y+P.h+14,y,{a:'middle',cls:'m'});
    return s+yl(g,P,[0,20,40,60],v=>'$'+v+'B')}
  return g.box(430,140,360,80,'15 August 1971','red',{hot:1,sub:'the US stops swapping dollars for gold'})+g.panel(110,250,'Before',['dollar backed by gold','currencies fixed to the dollar'],'yellow',{w:300})+g.panel(450,250,'After',['dollar backed by trust (fiat)','currencies float (from 1973)','still the world’s main currency'],'green',{w:300});
},
steps:[
 {k:'history',t:'The 1944 design',short:'Design',m:{gold:'1 oz',yr:'1944'},
  b:'In July 1944, 730 delegates from 44 countries met at Bretton Woods, New Hampshire. They fixed other currencies to the dollar (within 1%) and fixed the dollar to gold at <b>$35 an ounce</b>, convertible for foreign governments. They also created the IMF and the World Bank. The US, holding about two-thirds of the world’s monetary gold, insisted the dollar be the centre.'},
 {k:'problem',t:'The Triffin dilemma',short:'Triffin',
  b:'Economist Robert Triffin spotted the flaw in 1960. A growing world economy needs ever more dollars, which the US can only supply by running deficits and sending dollars abroad. But the more dollars pile up abroad, the less believable it is that each can be swapped for $35 of US gold.'},
 {k:'problem',t:'More claims than gold',short:'Gold drain',m:{yr:'1960s'},
  b:'That is what happened. Vietnam war spending and growing deficits sent dollars abroad while US gold drained away. By the mid-1960s foreign official dollar claims exceeded the US gold stock (approximate figures shown). France under de Gaulle began converting dollars into gold; Germany and the Netherlands let their currencies float in May 1971.'},
 {k:'history',t:'The Nixon shock',short:'1971',m:{gold:'none',yr:'1971'},
  b:'On 15 August 1971 President Nixon “temporarily” suspended gold convertibility. It was never restored, and by 1973 major currencies floated. The dollar became pure fiat money (lesson 3.1). Surprisingly, its global role did not shrink. The next lesson explains why.'}
]});

/* ======================================================= petrodollar */
ML.add({id:'petrodollar',title:'Oil, Treasuries & the Petrodollar',min:9,lvl:'Intermediate',
sub:'After 1971, oil priced in dollars and oil earnings recycled into US Treasuries gave the dollar a new anchor.',
keys:'petrodollar saudi arabia 1974 oil priced in dollars recycling treasury bonds dollar demand',
learn:['Why oil is priced in dollars','The 1974 US–Saudi arrangement','Petrodollar recycling','How this anchored the fiat dollar'],
cheat:['Oil had long been traded in dollars; after the 1973–74 oil shock this became entrenched.','1974: the US and Saudi Arabia agreed on economic and security cooperation; Saudi oil earnings were invested in US Treasuries.','Every oil importer needs dollars → steady global demand for dollars.','Exporters recycle surplus dollars into US bonds and banks → funds US deficits and the 1970s bank lending to Latin America (lesson 7.7).'],
met:[['flow','Dollar flow','repeat']],
draw(si,g){
  const loop=[['Oil importers','need $ to buy oil','blue',430,90],['Oil exporters','earn $','orange',720,240],['US Treasuries & banks','$ recycled','green',430,390],['US & world borrowers','spend $','purple',140,240]];
  let s='';loop.forEach(([t,sub,c,x,y],i)=>{s+=g.box(x,y,220,64,t,c,{hot:si>=1||i<2,sub});const n=loop[(i+1)%4];if(si>=1||i<1)s+=g.A(x+(n[3]-x)*.35,y+(n[4]-y)*.35,x+(n[3]-x)*.65,y+(n[4]-y)*.65,{c:'edge',curve:20})});
  if(si===2)s+=g.panel(330,200,'Result',['steady global demand for dollars','cheap funding for the US'],'yellow',{w:200});
  return s;
},
anim(si,t,g){if(si<1)return '';const P=[[430,90],[720,240],[430,390],[140,240]];const k=(t*.25)%1,i=Math.floor(k*4),f=k*4-i,a=P[i],b=P[(i+1)%4];return g.coin(U.lerp(a[0],b[0],f),U.lerp(a[1],b[1],f),'$')},
steps:[
 {k:'history',t:'Oil in dollars',short:'Oil',m:{flow:'importers → exporters'},
  b:'Oil was already traded mainly in dollars. After the 1973–74 oil shock quadrupled prices, every country needed far more dollars just to buy energy. In 1974 the US and Saudi Arabia agreed on wide economic and security cooperation, and Saudi oil earnings were invested in US Treasury bonds.'},
 {k:'insight',t:'Petrodollar recycling',short:'Recycling',m:{flow:'full loop'},
  b:'The loop: importers buy dollars to pay for oil; exporters earn more dollars than they can spend at home; they park them in US bonds and banks; banks lend them on to borrowers around the world (including, fatefully, Latin American governments in the 1970s, lesson 7.7).'},
 {k:'recap',t:'A new anchor',short:'Anchor',
  b:'Gold no longer backed the dollar, but oil and deep US bond markets gave the world a reason to keep holding it. Economists still debate how important the petrodollar is today, since the US now exports oil itself; the bigger anchor is the size and safety of US financial markets (next lesson).'}
]});

/* ======================================================= why the dollar dominates today */
const SH=[[1999,71],[2001,72],[2005,67],[2008,64],[2010,62],[2014,65],[2016,65],[2018,62],[2020,59],[2022,58],[2025,57]];
ML.add({id:'why-dollar',title:'Why the Dollar Still Dominates',min:11,lvl:'Intermediate',
sub:'About 57% of central bank reserves and 89% of foreign-exchange trades. The reasons: deep markets, rule of law, open capital, and habit.',
keys:'why is the dollar the global currency reserve share cofer bis triennial survey treasury market rule of law network effects de-dollarization',
learn:['How dominant the dollar is today','The four pillars of dollar dominance','How the share has drifted','What could challenge it'],
cheat:['IMF COFER: the dollar was about <b>57%</b> of global FX reserves in 2025 (down from ~72% around 2001). The euro is about 20%; the renminbi about 2%.','BIS Triennial Survey (April 2025): the dollar was on one side of <b>89%</b> of all FX trades.','Pillars: the deepest, most liquid bond market (Treasuries); rule of law and property rights; open capital markets; network effects and the Fed’s role as global lender of last resort.','Challenges: sanctions push some countries to diversify (gold, renminbi, other currencies), but no rival yet has all four pillars.'],
met:[['res','Share of reserves','bank'],['fx','Share of FX trades','repeat']],
hero:1,
draw(si,g){
  if(si===0){return g.bars(140,80,580,300,[57,20,6,4,2],{labels:['US dollar','euro','yen','pound','renminbi'],c:['green','blue','red','purple','orange'],fmt:v=>v+'%',gap:40,max:80})+g.T(430,60,'Share of global FX reserves, 2025 (approx., IMF COFER)',{a:'middle',cls:'b'})}
  if(si===1){const P=g.plot({x:90,y:40,w:640,h:340,xr:[1999,2025],yr:[50,75],nx:13,ny:5,yl:'dollar share of FX reserves %'});let s=P.svg+P.line(SH,'green',{w:3})+P.pts(SH.map(([x,y])=>({x,y,c:'green',r:3})),3);for(let y=1999;y<=2025;y+=4)s+=g.T(P.sx(y),P.y+P.h+14,y,{a:'middle',cls:'m'});return s+yl(g,P,[50,55,60,65,70,75],v=>v+'%')+g.pill(P.sx(2025),P.sy(57)-16,'≈57%','green')}
  if(si===2){return [['Deep, safe markets','biggest, most liquid bond market','blue'],['Rule of law','courts, property, independent Fed','purple'],['Open capital','money moves in and out freely','orange'],['Network effects','trade, debt, hedging already in $','green']].map(([t,sub,c],i)=>g.box(230+(i%2)*400,150+Math.floor(i/2)*150,360,100,t,c,{hot:1,sub})).join('')}
  return g.panel(90,90,'Pushing away from the dollar',['sanctions (e.g. on Russia, 2022) show reserves','  can be frozen','central banks buying more gold','more trade settled in renminbi'],'red',{w:330})+g.panel(450,90,'Holding it in place',['no rival has all four pillars','euro: no single big safe bond','renminbi: capital controls','in crises, everyone still runs to $'],'green',{w:330});
},
steps:[
 {k:'setup',t:'How dominant?',short:'Today',m:{res:'≈ 57%',fx:'89%'},
  b:'According to the IMF’s COFER data, the dollar made up about 57% of the world’s foreign-exchange reserves in 2025, with the euro a distant second near 20%. The BIS survey of April 2025 found the dollar on one side of <b>89%</b> of all foreign-exchange trades: if you swap rupiah for won, you usually go through dollars.'},
 {k:'history',t:'A slow drift, not a collapse',short:'Trend',m:{res:'72% → 57%'},
  b:'The dollar’s reserve share has drifted down from about 72% around 2001 to the high 50s, mostly toward smaller currencies (Canadian and Australian dollars, the Korean won and others) rather than one big rival. The IMF notes that part of the 2025 dip simply reflected exchange-rate moves, not central banks selling dollars.'},
 {k:'insight',t:'Four pillars',short:'Why',
  b:'Why the dollar? (1) <b>Deep, safe markets</b>: US Treasuries are the largest and most liquid bond market, so you can park huge sums and get them back fast. (2) <b>Rule of law</b>: courts, property rights and an independent central bank. (3) <b>Open capital</b>: money moves in and out freely. (4) <b>Network effects</b>: trade, debt, commodities and hedging are already in dollars, and the Fed lends dollars to other central banks in a crisis.'},
 {k:'tradeoff',t:'Challenges',short:'Future',
  b:'Freezing Russia’s reserves in 2022 reminded some countries that dollar reserves carry political risk; central banks have been buying gold and more trade is settled in renminbi. But the euro lacks a single large safe bond, and the renminbi comes with capital controls. For now, in every crisis money still runs <b>into</b> the dollar. Dalio’s warning is the long-term one: too much US debt and money printing is how reserve currencies have lost their status before.'}
]});

/* ======================================================= exorbitant privilege */
ML.add({id:'exorbitant-privilege',title:'Exorbitant Privilege, Global Burden',min:10,lvl:'Advanced',
sub:'Owning the world’s money lets the US borrow cheaply. It also means the Fed’s decisions shake every other economy.',
keys:'exorbitant privilege giscard d estaing dollar shortage swap lines fed tightening emerging markets global dollar cycle',
learn:['What the US gains','Why Fed hikes hurt other countries','Dollar shortages and swap lines','What this means for a country like Indonesia'],
cheat:['<b>Exorbitant privilege</b> (Valéry Giscard d’Estaing, 1960s): the US borrows in its own currency, cheaply, from a world that wants dollars.','Costs for others: when the Fed raises rates, the dollar usually rises, capital leaves emerging markets, and dollar debts get heavier (lesson 7.7).','In crises the world runs short of dollars; the Fed’s <b>swap lines</b> (2008, 2020) lend dollars to foreign central banks.','For countries like Indonesia: hold reserves, limit short-term foreign-currency debt, let the exchange rate adjust.'],
met:[['us','US gains','check'],['row','Rest of world','alert']],
draw(si,g){
  if(si===0)return g.panel(110,90,'What the US gets',['borrows in its own currency','  (it can always print to repay)','lower interest rates on its debt','profit from issuing cash held abroad','power over the payment system'],'green',{w:320})+g.panel(470,90,'What it costs the US',['strong dollar hurts US exporters','responsibility in global crises'],'yellow',{w:300});
  if(si===1){return ['Fed hikes','dollar rises','money leaves EMs','$ debts heavier','EMs hike too'].map((t,i)=>g.box(110+i*160,230,140,64,t,['orange','green','red','red','blue'][i],{hot:1})+(i?g.A(110+i*160-82,230,110+i*160-72,230,{c:'edge'}):'')).join('')+g.T(430,140,'The global dollar cycle',{a:'middle',cls:'b',size:16})}
  if(si===2)return g.box(220,170,240,70,'Federal Reserve','green',{hot:1,sub:'creates dollars'})+g.A(340,170,520,170,{c:'green',w:2.2,l:'swap line: $ now'})+g.A(520,210,340,210,{c:'blue',w:2.2,l:'their currency back'})+g.box(640,190,240,70,'Foreign central bank','blue',{hot:1,sub:'lends $ to its banks'})+g.panel(240,300,'Used in',['2008 (lesson 7.8) and March 2020'],'yellow',{w:380});
  return g.table(130,100,[{t:'Defence',w:300,a:'l'},{t:'Why',w:320,a:'l'}],[{c:['Build FX reserves','firepower to calm a currency run']},{c:['Limit short-term foreign-currency debt','avoids the 1997 mismatch']},{c:['Let the exchange rate adjust','a peg invites a one-way bet']},{c:['Deep local-currency bond market','borrow in rupiah, not dollars']}],{rh:46});
},
steps:[
 {k:'insight',t:'The privilege',short:'Privilege',m:{us:'cheap borrowing'},
  b:'In the 1960s French finance minister Valéry Giscard d’Estaing called it an <b>exorbitant privilege</b>: because the world wants dollars, the US borrows cheaply and always in its own currency. It can never be in Indonesia’s 1998 position of owing a currency it cannot print.'},
 {k:'problem',t:'The global dollar cycle',short:'Spillover',m:{row:'imports Fed policy'},
  b:'The flip side: when the Fed raises rates to fight US inflation, the dollar usually rises, investors pull money out of emerging markets, and everyone’s dollar debts get heavier. Other central banks often have to raise rates too, even if their own economy is weak. The Fed sets policy for the US, but the world feels it.'},
 {k:'solution',t:'Dollar shortages and swap lines',short:'Swap lines',
  b:'Because so much global debt is in dollars, a crisis creates a scramble for dollars. In 2008 and again in March 2020 the Fed opened <b>swap lines</b>: it lends dollars to foreign central banks in exchange for their currency, and they lend the dollars on to their banks. The Fed has become the world’s lender of last resort (lesson 7.5).'},
 {k:'recap',t:'Living in a dollar world',short:'Defences',
  b:'Since 1998 Indonesia, like much of Asia, has built large reserves, limited risky short-term dollar borrowing and let the rupiah float. These defences don’t stop dollar shocks, but they turn a potential 1998 into a manageable wobble. The machine is global, and the dollar is its main gear.'}
]});
})();
