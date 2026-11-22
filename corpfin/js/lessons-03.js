/* 03 · Mergers & Acquisitions */
(function(){const U=ML.U,CF=ML.CF,F=CF.F,C=CF.S,o=C.o,A=CF.ACQ;
const M=v=>F.n(v,1),M0=v=>F.n(v,0),perSh=ML.perSh;
const D=CF.deal(),DS=CF.deal({mix:{stock:1,cash:0,debt:0}}),DD=CF.deal({mix:{stock:0,cash:0,debt:1}}),DM=D;
const prem=D.evPrice-C.ev;
/* synergy case */
const cap=1/(C.W-C.tg),costSyn=[['Bean & milk purchasing',18],['Overlapping head office',12],['Close overlapping stores',6],['IT & systems',4]],costTot=costSyn.reduce((a,b)=>a+b[1],0);
const revSyn=60,revMargin=.30,revEb=revSyn*revMargin,revProb=.5,integ=[50,20],ramp=[.4,.8,1];
const pvCost=costTot*(1-o.tax)*cap,pvRev=revEb*(1-o.tax)*cap*revProb,pvInt=-integ[0]*(1-o.tax)/(1+C.W)-integ[1]*(1-o.tax)/Math.pow(1+C.W,2);
const pvSyn=pvCost+pvRev+pvInt;
const spMax=CF.maxEntry(.20)*C.ebitda[0];

/* ======================================================= strategic */
ML.add({id:'strategic',title:'Strategic Buyers',min:8,lvl:'Beginner',
sub:'Companies that buy other companies to run them: for scale, reach or capabilities.',
keys:'strategic buyer corporate acquirer synergies horizontal vertical integration',
learn:['What makes a buyer “strategic”','Common motives for acquisitions','Why strategics can usually pay more','The winner’s curse'],
cheat:['Strategic = an operating company buying in its own or an adjacent industry, usually to hold for the long term.','Motives: scale, new markets, capabilities, vertical integration, defence.','Can pay up to standalone value + the synergies only it can capture; often pays away much of them.'],
met:[['b','Buyer','brief'],['ev','Offer EV','dollar'],['x','Offer multiple','chart']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.box(200,170,220,80,A.name,'blue',{sub:`$${A.price} × ${A.shares}M shares`,hot:1}),g.box(200,330,220,70,o.name,'green',{sub:'target'}),g.box(640,250,260,100,'Combined company','purple',{sub:'one owner, one strategy',hot:1}));
    s.push(g.A(312,170,508,235),g.A(312,330,508,265));
    s.push(g.T(200,105,'Global drinks group: bottled coffee, grocery, cafés',{a:'middle',cls:'m'}));
  }else if(si===1){
    const m=[['Scale','buy beans & milk cheaper','blue'],['New markets','enter Southeast Asia overnight','green'],['Capabilities','Kopi’s store know-how','purple'],['Vertical integration','own the roasting & retail','orange'],['Defence','keep a rival from buying it','red']];
    m.forEach(([t,d,c],i)=>s.push(g.box(190,80+i*72,200,48,t,c,{hot:1}),g.T(310,84+i*72,d,{cls:'m'})));
  }else if(si===2){
    s.push(g.stack(180,60,140,360,[['Standalone EV (market)',C.ev,'green'],['PV of synergies',pvSyn,'purple']],{title:'What KOPI is worth to BrewCo',total:C.ev+pvSyn+60,hi:1,fmt:v=>F.n(v,0)}));
    s.push(g.stack(560,60,140,360,[['Standalone EV (market)',C.ev,'green'],['Premium paid',prem,'red']],{title:'What BrewCo offers',total:C.ev+pvSyn+60,fmt:v=>F.n(v,0)}));
    s.push(g.T(430,440,`Offer ${F.m(D.evPrice)} = ${F.x(D.evX)} EBITDA. Value kept by BrewCo’s owners ≈ ${F.m(pvSyn-prem)}.`,{a:'middle',cls:'b'}));
  }else{
    s.push(g.panel(80,80,'Winner’s curse',['in an auction the winner is often','the bidder with the MOST optimistic','synergy estimate','','pay away all synergies →','target shareholders win,','buyer shareholders get nothing'],'red',{w:340}));
    s.push(g.panel(470,80,'Discipline',['set a walk-away price before','  bidding','haircut revenue synergies','count integration costs','ask: who else could pay more?'],'green',{w:310}));
  }
  return s.join('');
},
anim(si,t,g){if(si===0){const p=(t%2.4)/2.4;return g.dot(312,170,508,235,p,'blue')+g.dot(312,330,508,265,p,'green')}return ''},
steps:[
 {k:'setup',t:'A company buying a company',short:'Who',m:{b:A.name},
  b:`A <b>strategic buyer</b> is an operating company that buys another to run it as part of its business. Our strategic is <b>${A.name}</b> (fictional), a drinks group worth $${(A.price*A.shares/1000).toFixed(1)}B that wants ${o.name}’s cafés.\n\nStrategics usually plan to own the target forever, not to resell it.`},
 {k:'insight',t:'Why strategics buy',short:'Motives',
  b:'Most deals rest on one of a few logics: get bigger and cheaper (scale), reach new customers or countries, buy a capability instead of building it, control more of the supply chain, or stop a competitor from getting the asset.'},
 {k:'technique',t:'How much can a strategic pay?',short:'Ability to pay',m:{ev:F.m(D.evPrice),x:F.x(D.evX)},
  b:`To ${A.name}, ${o.name} is worth its standalone value <b>plus</b> the synergies only the combination can create: about ${F.m(pvSyn)} in present value (lesson 03.3).\n\nIts offer of ${F.m(D.evPrice)} pays a premium of ${F.m(prem)} over market value: most of the synergies go to ${o.name}’s shareholders.`},
 {k:'tradeoff',t:'The winner’s curse',short:'Curse',
  b:'Studies of M&A repeatedly find that target shareholders capture most of the gains, while acquirers on average earn little. Strategics win auctions because they can pay more, and sometimes because they overestimate what they can achieve.',
  ch:['+ Synergies justify a higher price','- Overconfidence is the main risk','! Set a walk-away price']}
]});

/* ======================================================= sponsor */
ML.add({id:'sponsor',title:'Financial Sponsors (Private Equity)',min:10,lvl:'Beginner',
sub:'Investment firms that buy companies with borrowed money, improve them and sell them a few years later.',
keys:'sponsor private equity gp lp fund carried interest management fee hurdle buyout',
learn:['How a private equity fund is structured','2 and 20: how sponsors get paid','The buy, improve, sell playbook','Why sponsors usually bid below strategics'],
cheat:['GP (the PE firm) manages a fund of LP money (pensions, endowments, sovereign funds) with a ~10-year life.','Typical economics: ~2% management fee + ~20% carried interest over an ~8% preferred return.','Price is capped by the target IRR (often 20%+) and how much debt lenders allow.'],
met:[['f','Fund life','clock'],['mx','Max multiple @20% IRR','target'],['ev','Max EV','dollar']],
draw(si,g){
  const s=[];
  if(si===0){
    ['Pension fund','Endowment','Sovereign fund','Family office'].forEach((l,i)=>{s.push(g.box(120,90+i*80,170,46,l,'gray',{flat:1}),g.A(205,90+i*80,360,230,{c:'faint'}))});
    s.push(g.box(450,230,170,80,'PE Fund','orange',{sub:'managed by the GP',hot:1}));
    ['Kopi Kita','Portfolio Co B','Portfolio Co C'].forEach((l,i)=>{s.push(g.box(740,130+i*100,170,46,l,i?'gray':'green',{flat:!!i}),g.A(535,230,655,130+i*100,{c:'faint'}))});
    s.push(g.T(120,50,'LPs (limited partners)',{cls:'b m'}),g.T(740,80,'portfolio companies',{cls:'b m'}));
  }else if(si===1){
    s.push(g.timeline(90,170,680,[['Fundraise','yr 0'],['Invest','yrs 1–5'],['Improve','yrs 2–8'],['Exit','yrs 4–10'],['Wind down','yr 10+']],{on:1,done:1,c:'orange'}));
    s.push(g.panel(90,270,'2 and 20',['~2% a year management fee','~20% of profits (carried interest)','  after LPs get an ~8% hurdle'],'orange',{w:330}),g.panel(460,270,'So the GP needs…',['high IRRs to earn carry','exits within the fund life','to return cash, not just paper'],'yellow',{w:300}));
  }else if(si===2){
    const st=[['Buy','with 50–70% debt','blue'],['Improve','margins, M&A, cash','green'],['Pay down','debt from cash flow','orange'],['Sell','to strategic, sponsor or IPO','purple']];
    st.forEach(([t,d,c],i)=>{s.push(g.box(130+i*200,220,160,80,t,c,{sub:d,hot:1}));if(i<3)s.push(g.A(212+i*200,220,248+i*200,220))});
    s.push(g.T(430,350,'Module 04 builds this LBO with our numbers.',{a:'middle',cls:'m'}));
  }else if(si===3){
    s.push(g.bars(160,80,420,300,[C.ev,spMax,C.ev+pvSyn],{labels:['Market EV','Sponsor max (20% IRR)','Strategic max'],c:['gray','orange','blue'],fmt:v=>F.m(v),gap:60}));
    s.push(g.panel(620,100,'Why the gap',['sponsors have no','synergies, and must','earn their hurdle','with debt they can','raise'],'orange',{w:200}));
  }else{
    s.push(g.table(80,70,[{t:'',w:220,a:'l'},{t:'Strategic',w:230,a:'l'},{t:'Sponsor',w:230,a:'l'}],[{c:['Goal','long-term fit','return in 3–7 yrs']},{c:['Price driver','standalone + synergies','target IRR & leverage']},{c:['Funding','cash, stock, debt','mostly debt + fund equity']},{c:['Management','integrated','incentivised to stay']},{c:['Typical bid','higher','lower, unless debt is cheap']}],{rh:36}));
  }
  return s.join('');
},
anim(si,t,g){if(si===0){const p=(t%2.4)/2.4;return [0,1,2,3].map(i=>g.dot(205,90+i*80,360,230,p,'gray',{r:4})).join('')+g.dot(535,230,655,130,p,'orange')}return ''},
steps:[
 {k:'setup',t:'How a PE firm is set up',short:'Structure',
  b:'A <b>financial sponsor</b> (private equity firm) raises a fund from <b>limited partners</b>: pension funds, endowments, sovereign wealth funds. The firm, as <b>general partner</b>, invests that money in companies it controls.\n\nUnlike a strategic, it does not plan to keep them.'},
 {k:'technique',t:'Fund life and 2 and 20',short:'Economics',m:{f:'~10 years'},
  b:'A fund typically lasts about ten years: invest in the first few, then improve and sell. The GP earns a management fee (around 2%) and <b>carried interest</b> (around 20% of profits above a hurdle).\n\nThe clock and the carry make sponsors focus on <b>IRR</b> and on actually exiting.'},
 {k:'technique',t:'The playbook',short:'Playbook',
  b:'Buy with a lot of debt, improve operations, use cash flow to repay the debt, then sell. Each step is a return driver you will meet in module 04.'},
 {k:'insight',t:'The sponsor’s ceiling',short:'Ability to pay',m:{mx:F.x(CF.maxEntry(.20)),ev:F.m(spMax)},
  b:`A sponsor works backwards from its target return. With our LBO model, a 20% IRR allows at most <b>${F.x(CF.maxEntry(.20))}</b> EBITDA (${F.m(spMax)}), below what ${A.name} can pay with synergies.\n\nWhen debt is cheap and plentiful, that ceiling rises and sponsors win more auctions.`},
 {k:'recap',t:'Strategic vs sponsor',short:'Compare',
  b:'Both buy companies, but for different reasons, with different money and different price limits. Sellers in an auction invite both to keep the tension high (module 05).'}
]});

/* ======================================================= synergies */
ML.add({id:'synergies',title:'Synergies',min:11,lvl:'Intermediate',
sub:'Why two companies can be worth more together than apart, and how much of that to believe.',
keys:'synergies cost synergies revenue synergies integration costs phase in npv',
learn:['Cost vs revenue synergies','Phasing and one-off integration costs','Valuing synergies','Comparing them with the premium paid'],
cheat:['Cost synergies (procurement, overhead, footprint) are more reliable than revenue synergies (cross-selling, pricing).','Phase in over 2–3 years; subtract one-time integration costs.','Value = PV of after-tax run-rate synergies − PV of costs. Premium paid should be below it.'],
met:[['cs','Run-rate cost syn.','dollar'],['rs','Revenue syn. EBITDA','trend'],['pv','PV of synergies','sparkle'],['pr','Premium paid','alert']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.bars(140,90,560,280,[C.ev,A.price*A.shares+1200,C.ev+A.price*A.shares+1200,C.ev+A.price*A.shares+1200+pvSyn],{labels:['KOPI','BrewCo','sum of parts','combined'],c:['green','blue','gray','purple'],fmt:v=>F.m(v),gap:40}));
    s.push(g.T(430,60,'1 + 1 = 3 (if the synergies are real)',{a:'middle',cls:'h'}));
  }else if(si===1){
    s.push(g.T(60,70,'Run-rate cost synergies, $M per year (pre-tax)',{cls:'b'}),g.hbars(60,100,620,costSyn,{lw:230,rh:48,c:['blue','blue','blue','blue'],fmt:v=>F.m(v)}));
    s.push(g.pill(430,330,`Total ${F.m(costTot)} = ${F.p(costTot/(C.rev[0]*.4-C.ebitda[0]+C.rev[0]*.6),1)} of KOPI’s cost base`,'blue',{fs:12}));
  }else if(si===2){
    s.push(g.box(160,150,200,60,'+ $60M revenue','green',{sub:'KOPI pods in BrewCo’s grocery channel'}),g.box(430,150,160,60,'× 30% margin','green',{flat:1}),g.box(690,150,180,60,'= $18M EBITDA','green',{hot:1}));
    s.push(g.A(262,150,348,150),g.A(512,150,598,150));
    s.push(g.panel(170,260,'But: less certain',['depends on customers, not on','management decisions','competitors react','often haircut 50% or excluded','by buyers and lenders'],'red',{w:320}));
  }else if(si===3){
    const yrs=['Y1','Y2','Y3'],sy=ramp.map(r=>r*(costTot+revEb)),net=sy.map((v,i)=>v-(integ[i]||0));
    s.push(g.T(60,60,'Synergies phase in; integration costs come first',{cls:'b'}));
    s.push(g.bars(80,100,300,260,sy,{labels:yrs,c:'green',fmt:v=>F.n(v,0),gap:30,max:70}));
    s.push(g.bars(470,100,300,260,[integ[0],integ[1],0],{labels:yrs,c:'red',fmt:v=>v?'−'+F.n(v,0):'',gap:30,max:70}));
    s.push(g.T(230,90,'synergies realised',{a:'middle',cls:'b',c:'green'}),g.T(620,90,'one-off integration costs',{a:'middle',cls:'b',c:'red'}));
    s.push(g.T(430,420,`Net Y1: ${F.m(net[0])}  ·  Y2: ${F.m(net[1])}  ·  Y3: ${F.m(net[2])}`,{a:'middle',cls:'b'}));
  }else{
    s.push(g.wf(60,60,520,300,[['PV cost\nsynergies',pvCost,'t'],['PV revenue\n(50% prob.)',pvRev],['PV integr.\ncosts',pvInt],['PV of\nsynergies',pvSyn,'t'],['Premium\npaid',-prem],['Value\ncreated',pvSyn-prem,'t']],{fmt:v=>F.n(v,0),gap:16}));
    s.push(g.panel(610,80,'Method',[`after-tax synergies`,`÷ (WACC − g) = ×${cap.toFixed(1)}`,'(simplified: full run-rate','from year 1, perpetual)','','premium = offer EV','  − market EV'],'purple',{w:220}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'1 + 1 = 3',short:'Idea',
  b:`If ${A.name} and ${o.name} together can earn more than they do apart, the combination is worth more than the two separate values. That extra is <b>synergy</b>, and it is the main reason a strategic can pay a premium.`},
 {k:'technique',t:'Cost synergies',short:'Cost',m:{cs:F.m(costTot)},
  b:`Cost synergies come from doing the same work once: buying beans in larger volumes, merging head offices, closing stores that compete across the street, running one IT system. Here: <b>${F.m(costTot)}</b> a year.\n\nThey are mostly in management’s control, so buyers and lenders believe them more.`},
 {k:'tradeoff',t:'Revenue synergies',short:'Revenue',m:{rs:F.m(revEb)},
  b:`Selling ${o.name} coffee pods through ${A.name}’s grocery channel could add $${revSyn}M of revenue, about <b>${F.m(revEb)}</b> of EBITDA. But it depends on customers and competitors, so it is often haircut heavily or ignored in the price.`},
 {k:'problem',t:'Timing and integration costs',short:'Phasing',
  b:'Synergies take two to three years to reach full run-rate, while severance, store closure and IT migration costs arrive upfront. Models that assume day-one synergies overstate value.'},
 {k:'math',t:'Value vs premium',short:'NPV',m:{pv:F.m(pvSyn),pr:F.m(prem)},
  b:`Capitalising after-tax synergies and subtracting integration costs gives about <b>${F.m(pvSyn)}</b>. ${A.name} pays a premium of <b>${F.m(prem)}</b> over market value, so roughly ${F.m(pvSyn-prem)} of value is left for its own shareholders, if every synergy is delivered.`,
  ch:['+ Value created = PV synergies − premium','! Most deals that fail, fail on integration']}
]});

/* ======================================================= cash vs stock */
const ER=D.offerPx/A.price;
ML.add({id:'cash-vs-stock',title:'Cash vs Stock',min:10,lvl:'Intermediate',
sub:'Paying with cash gives sellers certainty; paying with shares makes them partners in the combined company.',
keys:'consideration cash stock exchange ratio fixed price collar ownership dilution tax deferral',
learn:['Fixed cash price vs exchange ratio','Who bears the risk of the buyer’s share price','Ownership after a stock deal','Tax and signalling effects'],
cheat:['Cash: certain value, taxable now, buyer bears all risk and upside.','Stock: exchange ratio × buyer share price; sellers share upside & downside, can defer tax in qualifying deals.','Exchange ratio = offer price per share ÷ buyer share price.','Paying in stock can signal the buyer thinks its shares are fully valued.'],
met:[['er','Exchange ratio','repeat'],['ow','KOPI holders own','pie'],['px','Offer / share','dollar']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.box(220,170,240,80,'All cash','green',{sub:`$${D.offerPx.toFixed(2)} per KOPI share`,hot:1}),g.box(640,170,260,80,'All stock','blue',{sub:`${ER.toFixed(4)} BrewCo shares each`,hot:1}));
    s.push(g.T(640,280,`${ER.toFixed(4)} × $${A.price} = $${D.offerPx.toFixed(2)} today`,{a:'middle',cls:'m'}),g.T(220,280,`${F.m(D.eqPrice,1)} wired at closing`,{a:'middle',cls:'m'}));
  }else if(si===1){
    const P=g.plot({x:90,y:50,w:560,h:320,xr:[18,38],yr:[10,28],nx:5,ny:6,ticks:1,xl:`BrewCo share price at closing ($)`,yl:'value received per KOPI share ($)'});
    s.push(P.svg,P.fn(()=>D.offerPx,'green',{w:3}),P.fn(x=>ER*x,'blue',{w:3}),P.line([[A.price,10],[A.price,28]],'gray',{cls:'dash thin'}));
    s.push(g.T(P.sx(19),P.sy(D.offerPx)-8,'cash: fixed',{cls:'b',c:'green'}),g.T(P.sx(34),P.sy(ER*34)-10,'stock: moves with BrewCo',{cls:'b',c:'blue',a:'end'}),g.T(P.sx(A.price)+6,P.sy(11),'today',{cls:'m'}));
    s.push(g.panel(670,70,'Collars',['limit how far the','stock value can','drift between','signing & closing'],'yellow',{w:170}));
  }else if(si===2){
    const kop=DS.newSh/(A.shares+DS.newSh);
    s.push(g.stack(330,60,150,360,[['BrewCo holders',A.shares,'blue'],['ex-KOPI holders',DS.newSh,'green']],{title:'Combined company (all-stock)',fmt:v=>F.n(v,1)+'M',hi:1}));
    s.push(g.T(160,240,F.p(kop),{a:'middle',size:34,cls:'b'}),g.T(160,262,'owned by former',{a:'middle',cls:'m'}),g.T(160,278,'KOPI shareholders',{a:'middle',cls:'m'}));
  }else if(si===3){
    s.push(g.table(60,70,[{t:'',w:170,a:'l'},{t:'Cash',w:260,a:'l'},{t:'Stock',w:280,a:'l'}],[{c:['Seller certainty','high: fixed dollars','depends on buyer price'],cc:[null,'green','red']},{c:['Seller upside','none after closing','shares combined upside'],cc:[null,'red','green']},{c:['Seller tax','taxable now','often deferred (qualifying)'],cc:[null,'red','green']},{c:['Buyer funding','cash / new debt','issues new shares'],cc:[null,null,null]},{c:['Buyer EPS','often accretive','depends on P/E (03.6)']},{c:['Signal','“we are confident”','“our stock is rich?”']}],{rh:36}));
  }else{
    s.push(g.stack(300,60,150,360,[['Stock',D.stock$,'blue'],['Cash (new debt)',D.debt$,'orange']],{title:'50 / 50 mix',fmt:v=>F.m(v),hi:0}));
    s.push(g.panel(620,110,'Why mix?',['balance seller tax &','  certainty preferences','keep leverage acceptable','  for rating agencies','limit EPS dilution'],'yellow',{w:250}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Two currencies',short:'Options',m:{px:'$'+D.offerPx.toFixed(2),er:ER.toFixed(4)},
  b:`${A.name} offers $${D.offerPx.toFixed(2)} per ${o.name} share (a ${F.p(A.premium,0)} premium). It can pay in <b>cash</b>, or in its own <b>shares</b> at an exchange ratio of $${D.offerPx.toFixed(2)} ÷ $${A.price} = <b>${ER.toFixed(4)}</b> BrewCo shares per KOPI share.`},
 {k:'insight',t:'Who bears the price risk?',short:'Risk',
  b:'With cash, sellers know exactly what they get. With a fixed exchange ratio, their payment rises and falls with the buyer’s share price between signing and closing, and afterwards they own buyer stock.\n\nCollars or fixed-value structures can cap that drift.'},
 {k:'technique',t:'Ownership after a stock deal',short:'Ownership',m:{ow:F.p(DS.newSh/(A.shares+DS.newSh))},
  b:`In an all-stock deal ${A.name} issues ${F.n(DS.newSh,1)}M new shares. Former ${o.name} holders end up owning <b>${F.p(DS.newSh/(A.shares+DS.newSh))}</b> of the combined company: they share both the synergies and the risks.`},
 {k:'tradeoff',t:'Tax and signalling',short:'Trade-offs',
  b:'Sellers usually pay tax immediately on cash, while qualifying stock-for-stock deals can defer it. Buyers that pay in stock may be signalling that they think their own shares are expensive, and markets sometimes read it that way.'},
 {k:'solution',t:'Mixed consideration',short:'Mix',
  b:`Many deals mix the two. A 50/50 split here means ${F.m(D.stock$)} in new shares and ${F.m(D.debt$)} in cash raised with new debt: the structure we use in the accretion/dilution lesson.`}
]});

/* ======================================================= stock deal vs asset deal */
const stepUp=D.eqPrice-C.bs0.eq,shield=stepUp/15*o.tax,af=(1-Math.pow(1+C.W,-15))/C.W,pvShield=shield*af;
ML.add({id:'stock-deal',title:'Stock Deal vs Asset Deal',min:10,lvl:'Intermediate',
sub:'Buy the company’s shares and inherit everything, or buy chosen assets and leave the rest behind.',
keys:'stock deal share purchase asset deal liabilities tax step-up 338(h)(10) structure',
learn:['What actually transfers in each structure','Liabilities, contracts and consents','The tax step-up and its value','Which one each side prefers'],
cheat:['Stock (share) deal: buy the shares; the legal entity with ALL assets and liabilities (known and unknown) changes owner.','Asset deal: buy selected assets, assume selected liabilities; contracts may need consent.','Asset deals give the buyer a tax basis step-up (more deductible D&A); sellers often prefer stock deals.'],
met:[['su','Tax basis step-up','layers'],['ts','Annual tax saving','dollar'],['pv','PV of step-up','sparkle']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.box(200,120,200,60,'Stock deal','blue',{sub:'buy the shares',hot:1}),g.box(660,120,200,60,'Asset deal','orange',{sub:'buy the things',hot:1}));
    s.push(g.R(90,220,220,180,{rx:12,stroke:'var(--edge)',sw:1.5,fill:'var(--blue-bg)'}),g.T(200,245,'Kopi Kita Corp (entity)',{a:'middle',cls:'b'}));
    ['stores & machines','brand','contracts','debts','old lawsuits'].forEach((l,i)=>s.push(g.T(200,272+i*24,l,{a:'middle',cls:i>2?'b':'m',c:i>2?'red':null})));
    s.push(g.R(550,220,220,180,{rx:12,stroke:'var(--edge)',sw:1.5,fill:'var(--orange-bg)'}),g.T(660,245,'Assets picked',{a:'middle',cls:'b'}));
    ['stores & machines ✓','brand ✓','key contracts ✓ (consent)','debts ✗ stay behind','old lawsuits ✗ stay behind'].forEach((l,i)=>s.push(g.T(660,272+i*24,l,{a:'middle',cls:i>2?'b':'m',c:i>2?'green':null})));
  }else if(si===1){
    s.push(g.box(160,110,170,50,'Buyer','blue'),g.box(430,110,190,50,'Seller shareholders','gray'),g.box(430,250,190,60,'Target company','green',{sub:'same entity, new owner'}));
    s.push(g.A(245,110,335,110,{l:'$',lt:'blue'}),g.A(430,135,430,220,{c:'gray',l:'shares',lt:'gray'}));
    s.push(g.box(160,380,170,46,'Buyer NewCo','orange'),g.box(430,380,170,46,'Target company','green'),g.box(740,380,190,46,'Seller shareholders','gray'));
    s.push(g.A(245,380,345,380,{l:'$',lt:'orange'}),g.A(515,380,645,380,{c:'gray',dash:1,l:'distributes $',lt:'gray'}),g.T(430,350,'asset deal: the company sells its assets, then pays out',{a:'middle',cls:'m'}),g.T(430,70,'stock deal',{a:'middle',cls:'b'}));
  }else if(si===2){
    s.push(g.table(60,60,[{t:'',w:200,a:'l'},{t:'Stock deal',w:250,a:'l'},{t:'Asset deal',w:250,a:'l'}],[{c:['Liabilities','all, incl. unknown','only those assumed'],cc:[null,'red','green']},{c:['Contracts & permits','stay with entity','may need consents'],cc:[null,'green','red']},{c:['Buyer tax basis','carried over','stepped up to price'],cc:[null,'red','green']},{c:['Seller tax (US C-corp)','taxed once on shares','corporate + shareholder'],cc:[null,'green','red']},{c:['Speed & simplicity','simpler','asset-by-asset transfer']},{c:['Typical use','public targets','carve-outs, distressed']}],{rh:36}));
  }else if(si===3){
    s.push(g.wf(70,70,420,280,[['Purchase\nprice',D.eqPrice,'t'],['Tax basis\nof assets',-C.bs0.eq],['Step-up',stepUp,'t']],{fmt:v=>F.n(v,0),gap:40}));
    s.push(g.panel(540,80,'Value of the step-up',[`${F.m(stepUp)} ÷ 15 yrs`,`× ${F.p(o.tax,0)} tax = ${F.m(shield,1)}/yr`,`PV @ WACC = ${F.m(pvShield)}`,'','illustrative: US-style','15-yr amortisation'],'green',{w:260}));
  }else{
    s.push(g.panel(80,80,'Buyer usually prefers asset deal',['leaves unknown liabilities behind','tax step-up = more deductions','cherry-pick what it wants'],'orange',{w:340}));
    s.push(g.panel(460,80,'Seller usually prefers stock deal',['clean exit: everything goes','often one layer of tax','no consents to chase'],'blue',{w:330}));
    s.push(g.T(430,300,'Public-company takeovers are almost always stock deals (or mergers).',{a:'middle',cls:'b'}),g.T(430,320,'Price adjusts to share the tax value; some US elections (e.g. 338(h)(10)) mix the two.',{a:'middle',cls:'m'}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Two ways to buy a business',short:'Two ways',
  b:'In a <b>stock deal</b> (share purchase) the buyer acquires the target company’s shares: the same legal entity continues, with every asset and every liability inside it. In an <b>asset deal</b> the buyer purchases specific assets and agrees to take on only specific liabilities.'},
 {k:'technique',t:'Who pays whom',short:'Flows',
  b:'In a stock deal, money goes to the selling shareholders and the company changes hands untouched. In an asset deal, money goes to the company for its assets; the shell company then pays its debts and distributes what is left to its owners.'},
 {k:'tradeoff',t:'Side by side',short:'Compare',
  b:'Stock deals are simpler and keep contracts intact, but the buyer inherits everything, including problems nobody has found yet. Asset deals let the buyer choose, at the cost of complexity and consents.',
  ch:['! Due diligence and indemnities matter more in stock deals']},
 {k:'math',t:'The tax step-up',short:'Step-up',m:{su:F.m(stepUp),ts:F.m(shield,1),pv:F.m(pvShield)},
  b:`In an asset deal the buyer’s tax basis resets to the price paid. Here that is ${F.m(stepUp)} above the old basis. Amortised for tax over 15 years, it saves <b>${F.m(shield,1)}</b> of tax a year, worth about <b>${F.m(pvShield)}</b> today.\n\nThat value is why buyers will pay more for an asset deal.`},
 {k:'recap',t:'Who wants what',short:'Recap',
  b:'Buyers lean to asset deals, sellers to stock deals, and the price shifts to compensate. For a listed company like Kopi Kita, BrewCo will buy the shares.'}
]});

/* ======================================================= accretion / dilution */
const mixes=[['100% stock',DS],['50/50',DM],['100% debt',DD]];
ML.add({id:'accretion-dilution',title:'Accretion / Dilution',min:13,lvl:'Advanced',
sub:'Will the acquirer’s earnings per share go up or down after the deal?',
keys:'accretion dilution eps pro forma earnings yield cost of acquisition breakeven synergies merger model',
learn:['Building pro forma net income','Pro forma share count','Comparing funding structures','The earnings-yield shortcut and breakeven synergies'],
cheat:['PF NI = acquirer NI + target NI + after-tax synergies − after-tax interest on new debt − foregone interest on cash (− new D&A from write-ups).','PF EPS = PF NI ÷ (acquirer shares + new shares issued).','Shortcut: accretive if the target’s earnings yield (incl. synergies) exceeds the weighted cost of the currency used.','Accretion ≠ value creation.'],
met:[['e0','BrewCo EPS','user'],['e1','Pro forma EPS','trend'],['ad','Accretion','chart']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.box(220,200,200,80,'BrewCo today','blue',{sub:`NI ${F.m(A.ni)} ÷ ${A.shares}M`,hot:1}),g.pill(220,280,`EPS $${D.eps0.toFixed(2)}  ·  P/E ${(A.price/D.eps0).toFixed(1)}x`,'blue',{fs:12}));
    s.push(g.box(640,200,220,80,'BrewCo + KOPI','purple',{sub:'EPS = ?',hot:1}),g.A(322,200,528,200));
    s.push(g.T(430,380,'Investors watch EPS closely: a dilutive deal can push the share price down.',{a:'middle',cls:'m'}));
  }else if(si===1){
    s.push(g.wf(50,60,760,300,[['BrewCo\nNI',A.ni,'t'],['KOPI NI\nFY26E',D.tgtNI],['Synergies\n(after tax)',D.synAT],['Interest on\nnew debt',-D.costDebt],['Pro forma\nNI',D.pfNI,'t']],{fmt:v=>F.n(v,1),gap:30,min:300}));
    s.push(g.T(430,440,`50/50 mix: ${F.m(D.debt$,0)} new debt at ${F.p(A.debtRate)} pre-tax. Axis starts at 300.`,{a:'middle',cls:'m'}));
  }else if(si===2){
    s.push(g.wf(120,60,440,300,[['BrewCo\nshares',A.shares,'t'],['New shares\nissued',D.newSh],['Pro forma\nshares',D.pfSh,'t']],{fmt:v=>F.n(v,1)+'M',gap:40,min:150}));
    s.push(g.panel(600,90,'Pro forma EPS',[`${F.m(D.pfNI,1)} ÷ ${F.n(D.pfSh,1)}M`,`= $${D.eps1.toFixed(3)}`,`vs $${D.eps0.toFixed(2)} standalone`,`→ ${D.acc>=0?'accretive':'dilutive'} ${F.p(D.acc)}`],D.acc>=0?'green':'red',{w:220}));
  }else if(si===3){
    s.push(g.T(60,60,'EPS accretion / (dilution) by funding mix',{cls:'b'}));
    const P={x:120,y:90,w:600,h:300},z=P.y+P.h/2,mx=.12;
    s.push(g.L([[P.x,z],[P.x+P.w,z]],'ink',{w:1.3}));
    mixes.forEach(([l,d],i)=>{const x=P.x+60+i*190,h=d.acc/mx*P.h/2;s.push(g.R(x,h>0?z-h:z,110,Math.abs(h),{fill:`color-mix(in srgb,var(--${d.acc>0?'green':'red'}) 55%,var(--mixbase))`,stroke:'var(--edge)',sw:1.3,rx:3}),g.T(x+55,h>0?z-h-8:z-h+16,F.p(d.acc),{a:'middle',cls:'b'}),g.T(x+55,P.y+P.h+16,l,{a:'middle',cls:'m'}))});
  }else if(si===4){
    const ey=(D.tgtNI+D.synAT)/D.eqPrice;
    const rows=[['Cash (foregone interest)',A.cashRate*(1-o.tax)],['New debt (after tax)',A.debtRate*(1-o.tax)],['BrewCo stock (1 ÷ P/E)',1/(A.price/D.eps0)]];
    s.push(g.T(60,60,'Cost of each acquisition currency vs what KOPI earns',{cls:'b'}),g.hbars(60,90,640,rows,{lw:240,rh:50,c:['gray','orange','blue'],fmt:v=>F.p(v,2),max:.09}));
    const x=60+240+ey/.09*(640-240-50);s.push(g.L([[x,80],[x,250]],'green',{w:2.5,cls:'dash'}),g.T(x,272,`KOPI earnings yield incl. synergies ${F.p(ey,2)}`,{a:'middle',cls:'b',c:'green'}));
    s.push(g.T(60,320,'Currency cheaper than the target’s yield → accretive. More expensive → dilutive.',{cls:'b'}));
  }else{
    s.push(g.panel(80,80,'Breakeven synergies',[`100% stock: need ${F.m(DS.synNeed,1)} pre-tax`,`  (plan: ${F.m(A.syn)})`,`50/50: need ${F.m(DM.synNeed,1)}`,`100% debt: ${F.m(DD.synNeed,1)} (already accretive)`],'purple',{w:350}));
    s.push(g.panel(480,80,'Accretion ≠ value',['debt-funded deals look accretive','but add risk (higher Ke)','write-up D&A, fees ignored here','value depends on price vs','  PV of cash flows + synergies'],'red',{w:320}));
  }
  return s.join('');
},
anim(si,t,g){if(si===0){return g.dot(322,200,528,200,(t%2)/2,'purple')}return ''},
steps:[
 {k:'setup',t:'The EPS question',short:'Question',m:{e0:'$'+D.eps0.toFixed(2)},
  b:`${A.name} earns ${F.m(A.ni)} on ${A.shares}M shares: EPS of <b>$${D.eps0.toFixed(2)}</b>. After buying ${o.name}, will EPS be higher (<b>accretive</b>) or lower (<b>dilutive</b>)?\n\nBoards and investors ask this first, so every merger model answers it.`},
 {k:'technique',t:'Pro forma net income',short:'PF NI',
  b:`Add the two companies’ earnings and the after-tax synergies, then subtract the cost of paying: after-tax interest on new debt (and interest no longer earned on cash spent). With a 50/50 stock/debt mix: <b>${F.m(D.pfNI,1)}</b>.\n\nA full model also subtracts extra D&A from asset write-ups and amortisation of new intangibles.`},
 {k:'technique',t:'Pro forma shares and EPS',short:'PF EPS',m:{e1:'$'+D.eps1.toFixed(3),ad:F.p(D.acc)},
  b:`Stock paid to sellers means new shares: ${F.n(D.newSh,1)}M at $${A.price}. Pro forma EPS = ${F.m(D.pfNI,1)} ÷ ${F.n(D.pfSh,1)}M = <b>$${D.eps1.toFixed(3)}</b>, ${D.acc>=0?'accretive':'dilutive'} by ${F.p(Math.abs(D.acc))}.`},
 {k:'insight',t:'Funding changes the answer',short:'Mix',
  b:`Same deal, same price, different currency: all-stock is <b>${F.p(DS.acc)}</b>, all-debt <b>+${F.p(DD.acc)}</b>. Debt is cheap after tax; BrewCo’s stock at ${(A.price/D.eps0).toFixed(0)}x earnings is relatively expensive currency.`},
 {k:'math',t:'The earnings-yield shortcut',short:'Shortcut',
  b:`Compare the cost of each currency with what the target earns per dollar paid. ${o.name} earns ${F.p((D.tgtNI+D.synAT)/D.eqPrice,2)} on the purchase price (with synergies). Debt costs ${F.p(A.debtRate*(1-o.tax),2)} after tax, so it is accretive; BrewCo stock “costs” ${F.p(D.eps0/A.price,2)} (its earnings yield), so it is dilutive.`},
 {k:'tradeoff',t:'Breakeven synergies, and the catch',short:'Breakeven',
  b:`An all-stock deal needs <b>${F.m(DS.synNeed,1)}</b> of pre-tax synergies to break even. Useful, but accretion is not value: piling on debt makes almost any deal accretive while making the company riskier.`}
]});

/* ======================================================= earnouts */
const eo={up:D.eqPrice-150,max:150,lo:240,hi:260,base:C.ebitda[2]},eoPay=e=>U.clamp((e-eo.lo)/(eo.hi-eo.lo),0,1)*eo.max;
const sc=[[225,.3],[245,.4],[262,.3]],eoExp=sc.reduce((a,[e,p])=>a+p*eoPay(e),0),eoPV=eoExp/Math.pow(1+C.W,2);
ML.add({id:'earnouts',title:'Earnouts',min:9,lvl:'Intermediate',
sub:'Part of the price is paid later, only if the business hits agreed targets.',
keys:'earnout contingent consideration valuation gap milestones fair value',
learn:['Why earnouts exist: the valuation gap','Designing the payout','Valuing it with probabilities','Accounting treatment and disputes'],
cheat:['Bridges a gap between what the seller believes and what the buyer will pay upfront.','Payout tied to EBITDA, revenue or milestones (e.g. drug approval), often over 1–3 years.','Booked at fair value at closing as contingent consideration; remeasured afterwards. Treat as debt-like.','Disputes over how the metric is measured are common.'],
met:[['up','Upfront','dollar'],['mx','Max earnout','trend'],['ev','Expected PV','target']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.bars(200,90,400,280,[235,260],{labels:['buyer believes','seller believes'],c:['blue','green'],fmt:v=>F.m(v)+' FY27 EBITDA',gap:80,max:280}));
    s.push(g.T(430,60,'Same company, different forecasts',{a:'middle',cls:'h'}));
  }else if(si===1){
    const P=g.plot({x:90,y:50,w:560,h:320,xr:[220,280],yr:[0,180],nx:6,ny:6,ticks:1,xl:'FY27 EBITDA ($M)',yl:'earnout paid ($M)'});
    s.push(P.svg,P.fn(eoPay,'green',{w:3,n:240}),g.T(P.sx(eo.lo),P.sy(10),`starts at ${eo.lo}`,{a:'middle',cls:'m'}),g.T(P.sx(eo.hi)+6,P.sy(eo.max)-8,`max ${F.m(eo.max)} at ${eo.hi}+`,{cls:'b'}));
    s.push(g.panel(670,70,'Deal terms',[`upfront ${F.m(eo.up)}`,`+ up to ${F.m(eo.max)}`,'paid after FY27','linear in between'],'yellow',{w:170}));
  }else if(si===2){
    s.push(g.table(80,70,[{t:'Scenario',w:140,a:'l'},{t:'FY27 EBITDA',w:140},{t:'Probability',w:120},{t:'Payout',w:120},{t:'Weighted',w:120}],sc.map(([e,p],i)=>({c:[['Downside','Base','Upside'][i],F.m(e),F.p(p,0),F.m(eoPay(e),1),F.m(p*eoPay(e),1)]})).concat([{c:['Expected','','','',F.m(eoExp,1)],b:1,top:1},{c:['PV (2 yrs @ WACC)','','','',F.m(eoPV,1)],b:1,hi:1}]),{rh:34}));
    s.push(g.T(80,340,'Real valuations often use Monte Carlo or option pricing for the metric.',{cls:'m'}));
  }else if(si===3){
    s.push(g.timeline(110,180,640,[['Closing','book fair value'],['Each quarter','remeasure'],['FY27 results','calculate'],['Payment','or nothing']],{on:1,done:1,c:'blue'}));
    s.push(g.T(430,330,'Changes in fair value hit the acquirer’s income statement, not goodwill.',{a:'middle',cls:'b'}),g.T(430,350,'In an EV bridge, an expected earnout is a debt-like item.',{a:'middle',cls:'m'}));
  }else{
    s.push(g.panel(80,80,'Why sellers fight about it',['buyer now runs the business','  (it controls the metric)','integration costs: whose?','accounting policy changes','“operate consistently with past','  practice” clauses'],'red',{w:340}));
    s.push(g.panel(470,80,'Where they are common',['private companies','founder-led businesses','life sciences (milestones)','rare in public-company deals'],'green',{w:300}));
  }
  return s.join('');
},
steps:[
 {k:'problem',t:'The valuation gap',short:'Gap',
  b:'The seller of a growing business is confident FY27 EBITDA will reach $260M; the buyer models $235M. At the same multiple, that is a gap of hundreds of millions, enough to kill the deal.'},
 {k:'solution',t:'Pay more only if it happens',short:'Structure',m:{up:F.m(eo.up),mx:F.m(eo.max)},
  b:`An <b>earnout</b> splits the price: ${F.m(eo.up)} at closing plus up to <b>${F.m(eo.max)}</b> more if FY27 EBITDA reaches the seller’s target. If the seller is right, they get paid; if the buyer is right, it does not overpay.`},
 {k:'math',t:'What is it worth?',short:'Value',m:{ev:F.m(eoPV,1)},
  b:`Weight each scenario by its probability and discount: expected payout ${F.m(eoExp,1)}, worth about <b>${F.m(eoPV,1)}</b> today. The buyer’s “real” price is upfront + this value.`},
 {k:'technique',t:'Accounting',short:'Accounting',
  b:'Under ASC 805 and IFRS 3 the earnout is recorded at fair value on day one as part of the purchase price, then remeasured each period through the income statement until it is settled.'},
 {k:'tradeoff',t:'Disputes',short:'Risks',
  b:'Once the deal closes the buyer controls the business, and therefore the metric. Earnouts are a frequent source of litigation, so the definition of “EBITDA” in the contract matters as much as the number.'}
]});

/* ======================================================= fairness opinion */
ML.add({id:'fairness-opinion',title:'Fairness Opinion',min:8,lvl:'Intermediate',
sub:'A bank’s letter telling a board that the price is fair, from a financial point of view.',
keys:'fairness opinion board fiduciary duty investment bank valuation letter proxy',
learn:['Why boards ask for one','What analysis sits behind it','What it does and does not say','Conflicts of interest'],
cheat:['Delivered by an investment bank to the board, usually on signing day; summarised in the proxy.','Built on DCF, comps, precedents, premiums: offer compared with the ranges.','Says the price is fair “from a financial point of view”; not that it is the best price, nor a vote recommendation.','Conflicts: success fees → some boards add a second, fixed-fee opinion.'],
met:[['of','Offer / share','dollar'],['in','Inside ranges?','check']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.box(200,150,200,70,'KOPI board','blue',{sub:'fiduciary duties',hot:1}),g.box(640,150,220,70,'Investment bank','orange',{sub:'financial adviser'}),g.box(430,330,240,70,'Shareholders','green',{sub:'vote on the deal'}));
    s.push(g.A(528,150,302,150,{l:'opinion letter',lt:'orange'}),g.A(240,190,360,300,{c:'blue',l:'recommends',lt:'blue'}));
  }else if(si===1){
    const R=[['DCF',ML.DCFR.lo,ML.DCFR.hi,'green'],['Trading comps',ML.COMPS.lo,ML.COMPS.hi,'blue'],['Precedents',ML.PREC.lo,ML.PREC.hi,'orange']];
    s.push(g.ranges(60,90,740,R,{ax:[10,25],step:2.5,fmt:v=>'$'+v.toFixed(1),rh:60,mark:D.offerPx,markL:`offer $${D.offerPx.toFixed(2)}`}));
  }else if(si===2){
    s.push(g.docu(240,230,240,300,'Opinion letter','orange'));
    s.push(g.panel(430,90,'It says',['the consideration is fair,','from a financial point of view,','to the shareholders'],'green',{w:340}));
    s.push(g.panel(430,240,'It does NOT say',['this is the best price available','how to vote','the deal is a good idea','anything about legal fairness'],'red',{w:340}));
  }else{
    s.push(g.timeline(100,170,660,[['Analyses','weeks before'],['Bank committee','reviews'],['Board meeting','oral opinion'],['Signing','written letter'],['Proxy','disclosed']],{on:2,done:2,c:'orange'}));
    s.push(g.panel(200,280,'Conflict check',['fee mostly paid only if the deal closes?','→ disclose it; consider a second bank on a fixed fee'],'yellow',{w:460}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Why boards ask for it',short:'Why',m:{of:'$'+D.offerPx.toFixed(2)},
  b:`${o.name}’s directors must act in shareholders’ interests when deciding whether to recommend BrewCo’s $${D.offerPx.toFixed(2)} offer. A <b>fairness opinion</b> from an investment bank is evidence that they considered the price carefully.`},
 {k:'technique',t:'The analysis behind it',short:'Analysis',m:{in:D.offerPx>=ML.COMPS.hi?'above comps ✓':'within'},
  b:'The bank runs the standard toolkit (DCF, trading comps, precedent transactions, premiums paid analysis) and compares the offer with each range. The summary is a football field (next lesson).'},
 {k:'insight',t:'What it actually says',short:'Scope',
  b:'The letter is narrow on purpose: the price is fair <b>from a financial point of view</b>. It does not say it is the highest price obtainable, and it does not tell shareholders how to vote.'},
 {k:'tradeoff',t:'Timing and conflicts',short:'Conflicts',
  b:'The opinion is given orally at the board meeting that approves the deal and then as a letter, summarised in the proxy statement. Because advisers are often paid mostly on completion, boards sometimes hire a second bank on a fixed fee for an independent view.'}
]});

/* ======================================================= football field */
const lboPx=t=>perSh(CF.maxEntry(t)*C.ebitda[0]);
const FF=[['52-week range','market',12.1,17.4,'gray'],['Analyst targets','broker research',14,19,'gray'],['Trading comps','25th–75th pct',ML.COMPS.lo,ML.COMPS.hi,'blue'],['Precedents','25th–75th pct',ML.PREC.lo,ML.PREC.hi,'orange'],['DCF','WACC ±0.5%, g ±0.5%',ML.DCFR.lo,ML.DCFR.hi,'green'],['LBO','IRR 22% → 18%',lboPx(.22),lboPx(.18),'purple']];
ML.add({id:'football-field',title:'The Football Field',min:8,lvl:'Beginner',
sub:'One chart that puts every valuation method side by side.',
keys:'football field valuation summary range pitchbook bar chart 52-week',
learn:['How the chart is built','Reading overlap and gaps','Where the offer sits','How bankers use it in pitchbooks'],
cheat:['Horizontal bars, one per method, on a common value-per-share (or EV) axis.','Typical rows: 52-week, analyst targets, trading comps, precedents, DCF, LBO.','A vertical line marks the offer or current price. Overlap = conviction.'],
met:[['of','Offer','dollar'],['pr','Premium to today','trend']],
hero:4,
draw(si,g){
  const up=[1,2,3,5,5][si];
  return g.ranges(40,80,780,FF.map(r=>[r[0],r[2],r[3],r[4],r[1]]),{ax:[8,24],step:2,fmt:v=>'$'+v.toFixed(1),rh:56,upto:up,hi:si===4?null:up,mark:si>=4?D.offerPx:o.price,markL:si>=4?`offer $${D.offerPx.toFixed(2)}`:`today $${o.price.toFixed(2)}`});
},
steps:[
 {k:'setup',t:'Market reference points',short:'Market',
  b:`Start with what the market says: the 52-week trading range and analysts’ price targets. The dashed line is today’s price of $${o.price.toFixed(2)}.`},
 {k:'technique',t:'Add trading comps',short:'Comps',
  b:`From module 02: peers’ 25th–75th percentile multiples imply $${ML.COMPS.lo.toFixed(2)}–$${ML.COMPS.hi.toFixed(2)} per share.`},
 {k:'technique',t:'Add precedents',short:'Precedents',
  b:`Deals for similar companies imply $${ML.PREC.lo.toFixed(2)}–$${ML.PREC.hi.toFixed(2)}: higher, because they include a control premium.`},
 {k:'technique',t:'Add DCF and LBO',short:'DCF & LBO',
  b:`The DCF sensitivity gives $${ML.DCFR.lo.toFixed(2)}–$${ML.DCFR.hi.toFixed(2)}. The LBO row shows what a sponsor could pay for an 18–22% IRR: a floor for bidding in a sale process.`},
 {k:'insight',t:'Read the chart',short:'Read it',m:{of:'$'+D.offerPx.toFixed(2),pr:F.p(A.premium,0)},
  b:`BrewCo’s $${D.offerPx.toFixed(2)} offer sits above the trading-comps, DCF and LBO ranges and at the top end of precedents: a strong case for the board to call it fair. Where many bars overlap, the valuation is more convincing; outliers deserve an explanation.`,
  tip:['In pitchbooks','The football field is usually the first valuation page a client sees, and the last one they remember.']}
]});
})();
