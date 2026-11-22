/* 05 · Capital Markets & Deal Process */
(function(){const U=ML.U,CF=ML.CF,F=CF.F,C=CF.S,o=C.o;
const M=v=>F.n(v,1),M0=v=>F.n(v,0);

/* ======================================================= IPO */
const ipo={prim:20,sec:10,lo:13,hi:15,px:15,open:17.25,spread:.06},ipoSh=ipo.prim+ipo.sec;
const book=[[17,25],[16,48],[15,92],[14,128],[13,155]];
ML.add({id:'ipo',title:'The IPO',min:12,lvl:'Beginner',
sub:'Selling shares to the public for the first time: the process, the pricing and the first-day pop.',
keys:'ipo initial public offering prospectus s-1 roadshow bookbuilding primary secondary lock-up underwriting spread',
learn:['Why companies go public','The IPO timeline','Primary vs secondary shares','Bookbuilding, pricing and the first-day pop'],
cheat:['Primary shares raise new money for the company; secondary shares let existing owners sell.','Process: banks → diligence & prospectus (S-1 in the US) → regulator review → roadshow & bookbuilding → pricing → trading → lock-up (often 180 days).','Underwriters earn a gross spread; IPOs are usually priced at a discount, so they often “pop” on day one.'],
met:[['sz','Deal size','dollar'],['px','IPO price','target'],['ov','Oversubscribed','chart'],['pop','Day-1 pop','trend']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.panel(80,70,'Why go public',['raise money to grow','let founders & investors sell','shares to pay for acquisitions','profile with customers & staff','stock-based pay for employees'],'green',{w:320}));
    s.push(g.panel(460,70,'What it costs',['underwriting fees (gross spread)','legal, audit, listing costs','quarterly reporting & scrutiny','pressure from public investors','priced at a discount'],'red',{w:320}));
  }else if(si===1){
    s.push(g.timeline(70,190,720,[['Pick banks',''],['Diligence','& prospectus'],['Regulator','review'],['Roadshow','bookbuilding'],['Pricing','night before'],['Trading','day one'],['Lock-up','ends ~180d']],{on:3,done:3,c:'purple',alt:1}));
    s.push(g.T(430,330,'Typically several months from kick-off to the first trade.',{a:'middle',cls:'m'}));
  }else if(si===2){
    s.push(g.stack(320,60,160,360,[['Primary: new shares',ipo.prim,'green'],['Secondary: owners sell',ipo.sec,'orange']],{title:`${ipoSh}M shares offered`,fmt:v=>v+'M'}));
    s.push(g.panel(560,110,'Who gets the cash',[`primary ${ipo.prim}M × $${ipo.px} = ${F.m(ipo.prim*ipo.px)}`,'  → to the company',`secondary ${ipo.sec}M × $${ipo.px} = ${F.m(ipo.sec*ipo.px)}`,'  → to selling shareholders'],'purple',{w:280}));
  }else if(si===3){
    const P=g.plot({x:100,y:50,w:500,h:330,xr:[0,170],yr:[12.5,17.5],nx:6,ny:5,xl:'shares demanded (M)',yl:'price ($)'});
    s.push(P.svg,P.line(book.map(([p,q])=>[q,p]),'blue',{w:3}),P.pts(book.map(([p,q])=>({x:q,y:p,c:'blue'})),5));
    s.push(P.line([[ipoSh,12.5],[ipoSh,17.5]],'orange',{w:2.5,cls:'dash'}),g.T(P.sx(ipoSh)+6,P.sy(17.2),'supply 30M',{cls:'b',c:'orange'}));
    s.push(P.line([[0,ipo.lo],[170,ipo.lo]],'gray',{cls:'dot thin'}),P.line([[0,ipo.hi],[170,ipo.hi]],'gray',{cls:'dot thin'}),g.T(P.sx(168),P.sy(ipo.hi)-6,'range $13–15',{a:'end',cls:'m'}));
    [13,14,15,16,17].forEach(v=>s.push(g.T(P.x-8,P.sy(v)+4,'$'+v,{a:'end',cls:'m'})));
    s.push(g.C(P.sx(92),P.sy(15),8,'green',{cls:'big'}),g.T(P.sx(92)+12,P.sy(15)-8,'$15: 3x covered',{cls:'b',c:'green'}));
    s.push(g.panel(630,70,'The book',['orders: “1M shares','up to $15”','','price where demand','≈ 3x supply','→ top of range'],'blue',{w:210}));
  }else if(si===4){
    s.push(g.bars(160,90,360,280,[ipo.px,ipo.open],{labels:['IPO price','first trade'],c:['blue','green'],fmt:v=>'$'+v.toFixed(2),gap:80,max:20}));
    s.push(g.panel(580,100,'Money left on the table',[`(${ipo.open} − ${ipo.px}) × ${ipoSh}M`,`= ${F.m((ipo.open-ipo.px)*ipoSh,1)}`,'','a modest pop rewards','investors and builds','after-market demand'],'yellow',{w:250}));
  }else{
    s.push(g.wf(60,70,540,300,[['Gross\nproceeds',ipoSh*ipo.px,'t'],['Gross\nspread 6%',-ipoSh*ipo.px*ipo.spread],['To selling\nholders',-ipo.sec*ipo.px*(1-ipo.spread)],['Other\ncosts',-6],['Net to\ncompany',ipo.prim*ipo.px*(1-ipo.spread)-6,'t']],{fmt:v=>F.n(v,1),gap:24}));
    s.push(g.panel(640,90,'Spread',['US mid-size IPOs often','~5–7% of proceeds;','larger deals less'],'purple',{w:200}));
  }
  return s.join('');
},
anim(si,t,g){if(si===4){const k=(t%3)/3,v=U.lerp(ipo.px,ipo.open,U.ease(Math.min(1,k*1.5)));return g.pill(340,60,`ticker: $${v.toFixed(2)}`,'green',{fs:13})}return ''},
steps:[
 {k:'setup',t:'Why go public?',short:'Why',
  b:`An <b>initial public offering</b> sells shares to public investors and lists them on an exchange. Our scenario: ${o.name} floats ${ipoSh}M shares at an indicated range of $${ipo.lo}–$${ipo.hi}.\n\nIt raises growth capital, gives early owners a way to sell, and creates a share currency, at the cost of fees, disclosure and public scrutiny.`},
 {k:'technique',t:'The IPO timeline',short:'Timeline',
  b:'Pick underwriters, run due diligence, write the prospectus (an S-1 in the US), answer regulator comments, then market the deal on a <b>roadshow</b> while bankers collect orders. Price the night before trading starts. Insiders are usually locked up for around 180 days.'},
 {k:'technique',t:'Primary vs secondary',short:'Shares',m:{sz:F.m(ipoSh*ipo.px)},
  b:`<b>Primary</b> shares are newly issued: cash goes to the company (${F.m(ipo.prim*ipo.px)}). <b>Secondary</b> shares are sold by existing owners such as founders or a PE fund: cash goes to them (${F.m(ipo.sec*ipo.px)}). Investors watch the mix: a mostly-secondary IPO can look like insiders cashing out.`},
 {k:'insight',t:'Bookbuilding and pricing',short:'Book',m:{px:'$'+ipo.px,ov:'≈3x'},
  b:'During the roadshow investors place orders at different prices. Underwriters read the <b>book</b>: here demand at $15 is about three times the shares on offer, so the deal prices at the top of the range. They allocate shares to investors they expect to hold, not flip.'},
 {k:'tradeoff',t:'The first-day pop',short:'Pop',m:{pop:F.p(ipo.open/ipo.px-1,0)},
  b:`IPOs are deliberately priced a little below where they are expected to trade. Opening at $${ipo.open} is a ${F.p(ipo.open/ipo.px-1,0)} pop: good headlines and happy investors, but ${F.m((ipo.open-ipo.px)*ipoSh,1)} the sellers did not receive.`},
 {k:'recap',t:'Where the money goes',short:'Proceeds',
  b:`Of ${F.m(ipoSh*ipo.px)} raised, underwriters keep their spread, selling holders take their share, and the company nets about ${F.m(ipo.prim*ipo.px*(1-ipo.spread)-6,1)} after other costs.`}
]});

/* ======================================================= greenshoe */
const gs={base:30,ovr:4.5,px:15};
const pathDown=t=>15-1.6*Math.sin(Math.min(1,t)*Math.PI/2)+(t>1?0:0),pathUp=t=>15+3*Math.sin(Math.min(1,t)*Math.PI/2);
ML.add({id:'greenshoe',title:'The Greenshoe',min:9,lvl:'Intermediate',
sub:'The over-allotment option that lets underwriters steady a new stock in its first weeks.',
keys:'greenshoe over-allotment option stabilisation short position underwriters ipo 15%',
learn:['Selling 115% of the deal','If the price falls: buy back in the market','If the price rises: exercise the option','Why everyone accepts it'],
cheat:['Underwriters sell up to 15% more shares than the base deal, creating a short position.','They hold an option (typically 30 days) to buy that extra amount from the issuer at the IPO price.','Price falls → cover the short by buying in the market (supports the price). Price rises → exercise the option.'],
met:[['al','Shares allotted','layers'],['sh','Underwriter short','alert'],['out','Outcome','check']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.stack(200,60,150,360,[['Base deal',gs.base,'purple'],['Over-allotment (15%)',gs.ovr,'yellow']],{title:'Shares sold to investors',fmt:v=>v+'M',hi:1}));
    s.push(g.panel(470,90,'The trick',[`investors get ${gs.base+gs.ovr}M shares`,`company issued only ${gs.base}M`,`→ underwriters are SHORT ${gs.ovr}M`,'','but they own an option to buy',`${gs.ovr}M from the company at $${gs.px}`],'yellow',{w:330}));
  }else if(si===1||si===2){
    const P=g.plot({x:90,y:50,w:560,h:320,xr:[0,30],yr:[12,19],nx:6,ny:7,xl:'days after IPO',yl:'share price ($)'});
    s.push(P.svg,P.line([[0,15],[30,15]],'gray',{cls:'dash thin'}),g.T(P.sx(29),P.sy(15)+16,'IPO price $15',{a:'end',cls:'m'}));
    [12,13,14,15,16,17,18,19].forEach(v=>s.push(g.T(P.x-8,P.sy(v)+4,'$'+v,{a:'end',cls:'m'})));
    if(si===1){s.push(P.fn(d=>15-1.8*Math.sin(Math.min(1,d/6)*Math.PI/2)+1.5*Math.max(0,(d-6)/24),'red',{w:3}));s.push(g.panel(665,70,'Price falls',['underwriters BUY','4.5M in the market','to close the short','→ demand props','  the price up','option lapses'],'red',{w:185}))}
    else{s.push(P.fn(d=>15+3*Math.sin(Math.min(1,d/10)*Math.PI/2),'green',{w:3}));s.push(g.panel(665,70,'Price rises',['buying at $18 to','cover would lose','money, so they','EXERCISE the option:','buy 4.5M from the','company at $15'],'green',{w:185}))}
  }else if(si===3){
    s.push(g.table(80,80,[{t:'',w:220,a:'l'},{t:'Price falls',w:220},{t:'Price rises',w:220}],[{c:['Underwriters cover by','buying in market','exercising option'],cc:[null,'red','green']},{c:['Underwriter profit','sold $15, bought lower','≈ break-even (+ spread)']},{c:['Extra shares issued','none',`${gs.ovr}M`]},{c:['Extra money for issuer','none',F.m(gs.ovr*gs.px,1)],b:1},{c:['Effect on price','support','deal upsized']}],{rh:38}));
  }else{
    s.push(g.panel(160,100,'Why it is called a greenshoe',['first used in the 1960s IPO of the','Green Shoe Manufacturing Company','(later Stride Rite)','','legal, disclosed stabilisation that','regulators explicitly permit'],'green',{w:540}));
  }
  return s.join('');
},
anim(si,t,g){
  if(si===1||si===2){const d=(t%5)/5*30,P={x:90,y:50,w:560,h:320};const v=si===1?15-1.8*Math.sin(Math.min(1,d/6)*Math.PI/2)+1.5*Math.max(0,(d-6)/24):15+3*Math.sin(Math.min(1,d/10)*Math.PI/2);return g.C(P.x+d/30*P.w,P.y+P.h-(v-12)/7*P.h,6,si===1?'red':'green')}
  return '';
},
steps:[
 {k:'setup',t:'Sell 115%',short:'Over-allot',m:{al:`${gs.base+gs.ovr}M`,sh:`${gs.ovr}M`},
  b:`The base IPO is ${gs.base}M shares. Underwriters actually sell <b>${gs.base+gs.ovr}M</b> to investors: 15% more. That leaves them short ${gs.ovr}M shares, covered by an option to buy that many from the company at the IPO price for about 30 days.`},
 {k:'technique',t:'If the price falls',short:'Price falls',m:{out:'stabilise'},
  b:'If the stock trades below $15, underwriters buy shares in the market to close their short. That buying supports the price exactly when it is weak, and it is profitable for them (sold at $15, bought for less). The option is never used.'},
 {k:'technique',t:'If the price rises',short:'Price rises',m:{out:'exercise'},
  b:`If the stock trades up, buying in the market would lose money. Instead underwriters exercise the <b>greenshoe</b>: buy ${gs.ovr}M new shares from the company at $15. The company raises an extra ${F.m(gs.ovr*gs.px,1)}.`},
 {k:'insight',t:'Both outcomes',short:'Compare',
  b:'Either way the underwriters are covered and investors get a steadier after-market. The issuer either gets price support or more money. That is why almost every IPO includes one.'},
 {k:'recap',t:'Name and rules',short:'Name',
  b:'The name comes from Green Shoe Manufacturing, the first company to use the structure. Securities regulators allow this kind of stabilisation as long as it is disclosed in the prospectus.'}
]});

/* ======================================================= converts */
const cb={size:300,cpn:.02,str:.065,yrs:5,prem:.30},cpx=o.price*(1+cb.prem),ratio=1000/cpx,newSh=cb.size/cpx;
const floor=(()=>{let pv=0;for(let t=1;t<=cb.yrs;t++)pv+=cb.cpn*100/Math.pow(1+cb.str,t);return pv+100/Math.pow(1+cb.str,cb.yrs)})();
const cvVal=p=>{const conv=ratio*p/10,opt=8*Math.exp(-Math.pow((conv-100)/30,2));return Math.max(floor,conv)+opt*.9};
ML.add({id:'converts',title:'Convertible Bonds',min:11,lvl:'Intermediate',
sub:'Debt that pays a low coupon because the holder can swap it into shares if the stock rises.',
keys:'convertible bond converts conversion price conversion ratio premium bond floor dilution if-converted capped call',
learn:['Conversion price, premium and ratio','The payoff: bond floor plus equity upside','Why issuers like the low coupon','Dilution and who buys converts'],
cheat:['Conversion price = share price × (1 + premium, often 20–40%). Conversion ratio = $1,000 ÷ conversion price.','Value ≥ max(bond floor, conversion value) + time value of the embedded option.','Issuer pays a lower coupon in exchange for potential dilution. Diluted EPS uses the if-converted method.','Big buyers: convertible-arbitrage hedge funds (long bond, short stock).'],
met:[['cp','Conversion price','target'],['cr','Shares / $1,000','hash'],['sv','Interest saved','dollar'],['dl','Potential dilution','layers']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.table(120,80,[{t:'Terms',w:300,a:'l'},{t:'',w:220}],[{c:['Size',F.m(cb.size)]},{c:['Maturity',cb.yrs+' years']},{c:['Coupon',F.p(cb.cpn,1)+'  (vs '+F.p(cb.str,1)+' straight debt)']},{c:['Share price today','$'+o.price.toFixed(2)]},{c:['Conversion premium',F.p(cb.prem,0)]},{c:['Conversion price','$'+cpx.toFixed(2)],b:1,hi:1},{c:['Conversion ratio',F.n(ratio,2)+' shares / $1,000'],b:1}],{rh:34}));
  }else if(si===1){
    const P=g.plot({x:90,y:50,w:560,h:320,xr:[5,35],yr:[60,180],nx:6,ny:6,ticks:1,xl:'KOPI share price ($)',yl:'bond value (per 100)'});
    s.push(P.svg,P.fn(()=>floor,'blue',{cls:'dash'}),P.fn(p=>ratio*p/10,'green',{cls:'dash'}),P.fn(cvVal,'purple',{w:3.4}));
    s.push(g.T(P.sx(6),P.sy(floor)-8,`bond floor ≈ ${floor.toFixed(0)}`,{cls:'b',c:'blue'}),g.T(P.sx(33),P.sy(ratio*33/10)+16,'conversion value',{a:'end',cls:'b',c:'green'}),g.T(P.sx(22),P.sy(cvVal(22))-12,'convertible',{cls:'b',c:'purple'}));
    s.push(P.line([[cpx,60],[cpx,180]],'gray',{cls:'dot thin'}),g.T(P.sx(cpx)+4,P.sy(64),'conv. price',{cls:'m'}));
    s.push(g.panel(665,70,'Shape',['falls: acts like a','  bond (floor)','rises: acts like','  the stock'],'purple',{w:180}));
  }else if(si===2){
    s.push(g.bars(120,90,300,280,[cb.size*cb.str,cb.size*cb.cpn],{labels:['straight debt','convertible'],c:['red','green'],fmt:v=>F.m(v,1)+'/yr',gap:60,max:22}));
    s.push(g.panel(480,110,'The trade',[`saves ${F.m(cb.size*(cb.str-cb.cpn),1)} interest a year`,'','gives up: up to',`${F.n(newSh,1)}M new shares if converted`,`= ${F.p(newSh/C.dil,0)} of today’s diluted count`],'green',{w:320}));
  }else if(si===3){
    s.push(g.wf(120,70,420,290,[['Diluted\nshares',C.dil,'t'],['If-converted\nshares',newSh],['Fully\ndiluted',C.dil+newSh,'t']],{fmt:v=>F.n(v,1)+'M',gap:40,min:60}));
    s.push(g.panel(580,90,'Mitigants',['capped call: issuer buys','  call options that offset','  dilution up to a cap','net share settlement:','  pay principal in cash,','  only excess in shares'],'yellow',{w:250}));
  }else{
    s.push(g.box(170,200,200,60,'Hedge fund','blue',{sub:'convertible arbitrage'}),g.box(470,120,180,50,'long convert','green',{flat:1}),g.box(470,280,180,50,'short stock (delta)','red',{flat:1}));
    s.push(g.A(272,190,378,130),g.A(272,210,378,280));
    s.push(g.T(430,400,'They hedge the equity risk and earn the cheap embedded option + coupon.',{a:'middle',cls:'m'}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'The terms',short:'Terms',m:{cp:'$'+cpx.toFixed(2),cr:F.n(ratio,2)},
  b:`${o.name} issues ${F.m(cb.size)} of five-year convertible bonds at a ${F.p(cb.cpn,0)} coupon. Each $1,000 bond can be swapped for <b>${F.n(ratio,2)}</b> shares, i.e. at a <b>conversion price</b> of $${cpx.toFixed(2)}, a ${F.p(cb.prem,0)} premium to today’s $${o.price.toFixed(2)}.`},
 {k:'insight',t:'Bond floor plus upside',short:'Payoff',
  b:`If the stock falls, holders keep a bond: its value cannot drop much below the <b>bond floor</b> (≈${floor.toFixed(0)} per 100, the coupons and principal discounted at a straight-debt yield). If the stock rises past $${cpx.toFixed(2)}, the bond tracks the shares. Between the two it is worth more than either, because it contains an option.`},
 {k:'solution',t:'Why issuers like it',short:'Issuer',m:{sv:F.m(cb.size*(cb.str-cb.cpn),1)+'/yr',dl:F.n(newSh,1)+'M'},
  b:`Investors pay for the option by accepting a low coupon: ${o.name} saves about <b>${F.m(cb.size*(cb.str-cb.cpn),1)}</b> of interest a year versus straight debt. In return it may have to issue ${F.n(newSh,1)}M shares, but only at a price 30% above today’s.`},
 {k:'math',t:'Dilution and EPS',short:'Dilution',
  b:'For diluted EPS, accountants assume conversion (the <b>if-converted</b> method under US GAAP), adding the shares and removing the after-tax interest. Issuers often buy a <b>capped call</b> to offset dilution, or settle the principal in cash.'},
 {k:'insight',t:'Who buys converts',short:'Buyers',
  b:'Many convertibles go to hedge funds that buy the bond and short the stock, rebalancing as the price moves. They are effectively buying cheap volatility. Long-only convertible funds buy them for equity upside with downside protection.'}
]});

/* ======================================================= auction */
const funnel=[['Contacted',60],['Signed NDA',25],['Indications (IOIs)',10],['Second round',4],['Winner',1]];
const iois=[['BrewCo (strategic)',2450],['Java Nation (strategic)',2380],['Atlas Foods (strategic)',2250],['Northgate Capital (PE)',2150],['Harbor Partners (PE)',2050],['Summit Equity (PE)',1980]];
ML.add({id:'auction',title:'The Sell-Side Auction',min:11,lvl:'Intermediate',
sub:'How bankers run a competitive sale to get the best price and terms for a seller.',
keys:'auction sell-side process teaser nda cim ioi loi data room final bids spa broad targeted',
learn:['Why sellers run auctions','The two-round process step by step','Narrowing the buyer list','Judging final bids on more than price'],
cheat:['Steps: prep → teaser → NDA → CIM → first-round IOIs → management meetings & data room → final binding bids with SPA mark-up → sign → close.','Broad auctions maximise tension; targeted ones protect confidentiality.','Final bids are compared on price, certainty (financing, regulatory), conditions and contract terms.'],
met:[['n','Buyers in play','user'],['tb','Top IOI','dollar'],['wk','Duration','clock']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.box(430,240,180,60,'Seller + bank','orange',{hot:1}));
    ['BrewCo','Java Nation','Atlas Foods','Northgate','Harbor'].forEach((n,i)=>{const a=-Math.PI/2+i/5*Math.PI*2;s.push(g.box(430+Math.cos(a)*300,240+Math.sin(a)*170,140,44,n,i<3?'blue':'purple',{flat:1}),g.A(430+Math.cos(a)*230,240+Math.sin(a)*130,430+Math.cos(a)*110,240+Math.sin(a)*50,{c:i<3?'blue':'purple'}))});
  }else if(si===1){
    s.push(g.timeline(60,180,740,[['Prep','model, CIM'],['Teaser','+ NDA'],['CIM out','round 1'],['IOIs','indications'],['Mgmt mtgs','data room'],['Final bids','+ SPA markup'],['Sign','& announce'],['Close','approvals']],{on:3,done:3,c:'orange',alt:1}));
    s.push(g.T(430,330,'Often three to six months from launch to signing.',{a:'middle',cls:'m'}));
  }else if(si===2){
    funnel.forEach(([l,n],i)=>{const w=170+n/60*450;s.push(g.R(430-w/2,70+i*72,w,54,{rx:8,fill:`color-mix(in srgb,var(--orange) ${25+i*12}%,var(--mixbase))`,stroke:'var(--edge)',sw:1.4}),g.T(430,70+i*72+33,`${l}: ${n}`,{a:'middle',cls:'b'}))});
  }else if(si===3){
    s.push(g.T(60,60,'First-round indications of enterprise value ($M)',{cls:'b'}));
    s.push(g.hbars(60,90,700,iois,{lw:230,rh:46,c:iois.map((r,i)=>i<4?(r[0].includes('PE')?'purple':'blue'):'gray'),fmt:v=>F.n(v,0),max:2600}));
    s.push(g.T(60,390,'Top four invited to round two (blue = strategic, purple = sponsor, gray = cut).',{cls:'m'}));
  }else if(si===4){
    s.push(g.table(40,70,[{t:'Final bid',w:200,a:'l'},{t:'EV $M',w:90},{t:'Financing',w:150,a:'l'},{t:'Regulatory',w:140,a:'l'},{t:'Conditions',w:160,a:'l'}],[{c:['BrewCo','2,389','committed','some overlap','few'],tone:'green',b:1},{c:['Java Nation','2,420','needs bond deal','big overlap','antitrust'],cc:[null,null,'red','red','red']},{c:['Atlas Foods','2,300','cash on hand','clean','few']},{c:['Northgate (PE)','2,150','committed','clean','none']}],{rh:38}));
    s.push(g.T(40,300,'Highest headline price is not automatically the winner: certainty is worth money.',{cls:'b'}));
  }else{
    s.push(g.table(80,80,[{t:'Process',w:200,a:'l'},{t:'Buyers',w:150,a:'l'},{t:'Good for',w:330,a:'l'}],[{c:['Broad auction','50–200','max tension and price']},{c:['Targeted auction','5–20','confidentiality, speed']},{c:['Negotiated sale','1–2','one obvious buyer, sensitive']}],{rh:40}));
  }
  return s.join('');
},
anim(si,t,g){if(si===0){const k=(t%2)/2;return [0,1,2,3,4].map(i=>{const a=-Math.PI/2+i/5*Math.PI*2;return g.dot(430+Math.cos(a)*230,240+Math.sin(a)*130,430+Math.cos(a)*110,240+Math.sin(a)*50,k,i<3?'blue':'purple',{r:4})}).join('')}return ''},
steps:[
 {k:'setup',t:'Competition sets the price',short:'Why',m:{n:'60'},
  b:`If ${o.name}’s board decides to sell, it hires a bank to run an <b>auction</b>. Several bidders competing at the same time push price and terms up, and give the board evidence that it got the best deal available.`},
 {k:'technique',t:'Two rounds',short:'Timeline',m:{wk:'3–6 months'},
  b:'The bank prepares materials, sends a short anonymous <b>teaser</b>, signs NDAs with interested parties and sends them the <b>CIM</b>. Non-binding first-round bids (IOIs) narrow the field. Survivors meet management, dig through the data room and submit binding final bids with their mark-up of the purchase agreement.'},
 {k:'insight',t:'The funnel',short:'Funnel',
  b:'Many are called, few are chosen. Each stage costs buyers time and money, so the funnel narrows quickly, and the bank manages the pace to keep every bidder believing it could win.'},
 {k:'technique',t:'First-round bids',short:'IOIs',m:{tb:F.m(2450)},
  b:'Indications of interest are ranges or point values with key assumptions. The bank shortlists on price and on credibility. Strategics sit at the top because of synergies; sponsors are capped by their IRR math.'},
 {k:'tradeoff',t:'Choosing the winner',short:'Final bids',
  b:'Java Nation bids the most, but its financing is uncommitted and the combination faces antitrust risk. BrewCo’s slightly lower bid is fully financed with few conditions. Boards weigh price against the risk the deal never closes.'},
 {k:'recap',t:'Auction variants',short:'Variants',
  b:'Broad auctions maximise tension; targeted auctions keep the sale quiet; a negotiated sale with one buyer is fastest but needs other evidence (like a fairness opinion and a market check) that the price is right.'}
]});

/* ======================================================= CIM */
const secs=['Executive summary','Investment highlights','Business overview','Industry & market','Stores, customers & operations','Management & employees','Historical financials','Projections','Appendix'];
ML.add({id:'cim',title:'The CIM',min:7,lvl:'Beginner',
sub:'The Confidential Information Memorandum: the sales document of a sell-side process.',
keys:'cim confidential information memorandum offering memorandum teaser investment highlights data room',
learn:['Where the CIM fits in the process','What goes in it','Writing investment highlights','Teaser → CIM → data room'],
cheat:['Sent after an NDA; typically dozens of pages describing the business, market, management and financials.','Leads with investment highlights; includes historical numbers and management projections.','Information deepens in stages: teaser (anonymous) → CIM → management presentation → data room.'],
met:[['pg','Typical length','doc'],['st','Stage','list']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.timeline(80,200,700,[['Teaser','1–2 pages'],['NDA','signed'],['CIM','sent'],['IOIs','round 1']],{on:2,done:2,c:'purple'}));
  }else if(si===1){
    s.push(g.docu(200,240,230,370,'CIM · Project Bean','purple',{lines:0}));
    secs.forEach((t,i)=>s.push(g.T(100,110+i*30,`${i+1}. ${t}`,{cls:'m'})));
    s.push(g.panel(380,90,'Rules of thumb',['tell a story, then prove it','consistent with the model','no promises: disclaimers','  and “no reliance” language','projections are management’s,','  not the bank’s'],'purple',{w:300}));
  }else if(si===2){
    const hl=[['#1 specialty coffee chain in its home market','blue'],['Recurring visits: loyal app members','green'],[`${F.p(o.marg[0],0)} EBITDA margin, rising to ${F.p(o.marg[5],0)}`,'orange'],['200+ new store sites identified','purple'],['Founder-led team with deep bench','pink']];
    hl.forEach(([t,c],i)=>s.push(g.box(430,80+i*70,560,48,t,c,{hot:i===0})));
  }else{
    s.push(g.table(60,80,[{t:'Document',w:200,a:'l'},{t:'When',w:180,a:'l'},{t:'Detail',w:340,a:'l'}],[{c:['Teaser','first contact','anonymous, 1–2 pages']},{c:['CIM','after NDA','full story + financials'],hi:1},{c:['Management presentation','round 2','meet the team, Q&A']},{c:['Virtual data room','round 2','contracts, leases, tax, HR, legal']},{c:['QoE & vendor reports','round 2','independent diligence']}],{rh:40}));
  }
  return s.join('');
},
anim(si,t,g,ord){if(si===1&&ord>=0)return g.R(92,110+ord*30-16,240,22,{rx:5,stroke:'var(--edge)',sw:1.4,dash:'3 3'});return ''},
steps:[
 {k:'setup',t:'Where the CIM fits',short:'Fit',m:{st:'after NDA'},
  b:'Buyers first see a short anonymous <b>teaser</b>. Those interested sign a non-disclosure agreement and receive the <b>Confidential Information Memorandum</b>, the main document they will use to make a first-round bid.'},
 {k:'technique',t:'What is inside',short:'Contents',m:{pg:'50–100+'},
  b:'A CIM walks through the business from the top: why it is attractive, what it does, the market, operations, the team, the historical numbers and management’s projections.',
  n:secs},
 {k:'technique',t:'Investment highlights',short:'Highlights',
  b:'The most-read pages. Each highlight is a claim a buyer will test in diligence: market position, customer loyalty, margin expansion, growth runway, management. Good bankers make every one provable.'},
 {k:'recap',t:'Information in stages',short:'Stages',
  b:'Information is released in layers as buyers prove their seriousness: teaser, CIM, management presentation, then the data room with the contracts and detail. That protects the seller’s secrets from tyre-kickers and competitors.'}
]});

/* ======================================================= QoE */
const adj=[['One-off legal settlement',8],['Gain on sale of a store',-10],['Revenue pulled forward',-6],['Closed-store losses (pro forma)',4],['Under-accrued bonuses',-3]];
const adjE=C.ebitda[0]+adj.reduce((a,b)=>a+b[1],0);
ML.add({id:'qoe',title:'Quality of Earnings',min:9,lvl:'Intermediate',
sub:'Is the EBITDA real and repeatable? The accountants’ report that buyers and lenders rely on.',
keys:'quality of earnings qoe due diligence adjusted ebitda normalised working capital peg debt-like items',
learn:['What a QoE report is for','Normalising EBITDA, item by item','Why each dollar matters to price','Working capital peg and debt-like items'],
cheat:['Prepared by accounting/advisory firms for buyers (buy-side) or sellers (vendor QoE).','Adjusts reported EBITDA for one-offs, non-recurring gains, cut-off errors, pro forma items → normalised run-rate EBITDA.','Every $1 of EBITDA × the multiple = price. Also sets the NWC peg and finds debt-like items.','Not an audit: it tests sustainability, not compliance.'],
met:[['rp','Reported EBITDA','chart'],['ad','Adjusted EBITDA','check'],['pv','Price impact','dollar']],
hero:1,
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.box(200,200,200,80,'Reported EBITDA','gray',{sub:F.m(C.ebitda[0])}),g.box(430,200,170,60,'QoE team','purple',{sub:'4–8 weeks'}),g.box(680,200,200,80,'Adjusted EBITDA','green',{sub:'real & repeatable?',hot:1}));
    s.push(g.A(302,200,343,200),g.A(517,200,578,200));
  }else if(si===1){
    s.push(g.wf(40,60,780,300,[['Reported',C.ebitda[0],'t'],...adj.map(([l,v],i)=>[['Legal\nsettlement','Gain on\nstore sale','Revenue\ncut-off','Closed\nstores','Bonus\naccrual'][i],v]),['Adjusted',adjE,'t']],{fmt:v=>F.n(v,0),gap:16,min:150}));
    s.push(g.T(430,450,'Axis starts at $150M.',{a:'middle',cls:'m'}));
  }else if(si===2){
    s.push(g.box(150,190,180,70,'EBITDA change','red',{sub:F.m(adjE-C.ebitda[0])}),g.box(275,190,40,40,'×','gray',{flat:1}),g.box(410,190,170,70,'Multiple','blue',{sub:'10.0x'}),g.box(535,190,40,40,'=','gray',{flat:1}),g.box(690,190,200,70,'Price impact','red',{sub:F.m((adjE-C.ebitda[0])*10),hot:1}));
    s.push(g.T(430,320,'Sellers push add-backs up; buyers push them down. The QoE is the referee.',{a:'middle',cls:'m'}));
  }else if(si===3){
    s.push(g.panel(80,80,'Working capital peg',['buyer pays for a “normal” level','of NWC delivered at closing','QoE finds the average (seasonal)','shortfall → price reduced'],'blue',{w:330}));
    s.push(g.panel(460,80,'Debt-like items found',['gift-card balances (deferred','  revenue already spent)','unpaid taxes & bonuses','deferred capex on stores','→ deducted in the EV bridge'],'red',{w:330}));
  }else{
    s.push(g.table(80,80,[{t:'',w:200,a:'l'},{t:'Audit',w:240,a:'l'},{t:'QoE',w:240,a:'l'}],[{c:['Question','are statements fairly stated?','is EBITDA sustainable?']},{c:['Standard','auditing standards','agreed scope, no opinion']},{c:['For','shareholders, regulators','buyer, lenders, seller']},{c:['Output','audit opinion','adjusted EBITDA, NWC, debt-like']}],{rh:40}));
  }
  return s.join('');
},
anim(si,t,g){if(si===0){const p=(t%2.4)/2.4;return g.dot(302,200,343,200,p,'gray')+g.dot(517,200,578,200,p,'green')}return ''},
steps:[
 {k:'setup',t:'Is the EBITDA real?',short:'Purpose',m:{rp:F.m(C.ebitda[0])},
  b:`A buyer paying 10x EBITDA cares enormously whether ${F.m(C.ebitda[0])} is the true, repeatable earning power of ${o.name}. A <b>Quality of Earnings</b> report, usually from an accounting firm’s transaction team, answers that question.`},
 {k:'technique',t:'Normalising EBITDA',short:'Adjustments',m:{ad:F.m(adjE)},
  b:'Item by item: add back genuine one-offs (a legal settlement), remove one-off gains (selling a store), fix revenue booked in the wrong period, include the run-rate effect of stores already closed, and record costs that were missed. Result: <b>'+F.m(adjE)+'</b>.',
  n:adj.map(a=>a[0])},
 {k:'insight',t:'Every dollar is worth ten',short:'Impact',m:{pv:F.m((adjE-C.ebitda[0])*10)},
  b:`A ${F.m(adjE-C.ebitda[0])} reduction in EBITDA at a 10x multiple is <b>${F.m((adjE-C.ebitda[0])*10)}</b> off the price. That is why sellers commission their own (vendor) QoE to get ahead of the findings.`},
 {k:'technique',t:'Working capital and debt-like items',short:'NWC & debt',
  b:'QoE work also sets the <b>NWC peg</b> (the normal level of working capital the seller must deliver) and finds liabilities that behave like debt, such as gift-card balances or unpaid bonuses. Both move the final price through the EV bridge.'},
 {k:'recap',t:'QoE is not an audit',short:'vs audit',
  b:'An audit asks whether the statements follow accounting rules. A QoE asks whether the earnings will keep coming. Lenders financing the deal usually rely on it too.'}
]});
})();
