/* 02 · Core Valuation & Modeling */
(function(){const U=ML.U,CF=ML.CF,F=CF.F,C=CF.S,o=C.o;
const M=v=>F.n(v,1),M0=v=>F.n(v,0);
const netAdj=o.debt+o.pref+o.nci-o.cash,perSh=ev=>(ev-netAdj)/C.dil;
ML.perSh=perSh;

/* ======================================================= enterprise value */
const twin=[{n:'Debt-free Kopi',eq:1925,debt:0,cash:0},{n:'Levered Kopi',eq:1225,debt:800,cash:100}];
ML.add({id:'enterprise-value',title:'Enterprise Value',min:9,lvl:'Beginner',
sub:'What the whole operating business is worth to everyone who funds it, not just shareholders.',
keys:'enterprise value ev equity value market cap takeover value capital structure neutral',
learn:['The house-and-mortgage intuition','Equity value vs enterprise value','Why EV ignores how a company is financed','Which multiples go with EV and which with equity value'],
cheat:['EV = Equity value + Debt + Preferred + Minority interest − Cash.','EV = value of the operating business to all capital providers.','Pair EV with pre-interest metrics (Revenue, EBITDA, EBIT); pair equity value with post-interest ones (net income, book value).'],
met:[['eq','Equity value','pie'],['ev','Enterprise value','brief'],['mx','EV / EBITDA','chart']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.stack(180,90,140,300,[['Mortgage $400k',400,'orange'],['Your equity $100k',100,'green']],{title:'House: $500k',total:500}));
    s.push(g.panel(470,100,'Buying the whole house',['you pay the seller $100k','AND take over the $400k','mortgage','','real price = $500k','= equity + debt'],'yellow',{w:280}));
    s.push(g.T(470,330,'A company is the same: the price of the shares is',{cls:'m'}),g.T(470,346,'only part of what you take on.',{cls:'m'}));
  }else if(si===1){
    s.push(g.stack(230,60,140,360,[['Enterprise value (operations)',C.ev,'blue'],['Cash',o.cash,'gray']],{title:'What the company has',side:'l',total:C.ev+o.cash}));
    s.push(g.stack(500,60,140,360,[['Equity value',C.eqv,'green'],['Debt',o.debt,'orange'],['Preferred',o.pref,'purple'],['Minority interest',o.nci,'pink']],{title:'Who has a claim',total:C.ev+o.cash}));
    s.push(g.T(435,250,'=',{a:'middle',size:34,cls:'b'}));
  }else if(si===2){
    s.push(g.table(60,70,[{t:'',w:190,a:'l'},{t:twin[0].n,w:170},{t:twin[1].n,w:170}],[{c:['EBITDA',M0(200),M0(200)]},{c:['Equity value',M0(twin[0].eq),M0(twin[1].eq)],cc:[null,'green','green']},{c:['+ Debt',M0(twin[0].debt),M0(twin[1].debt)]},{c:['− Cash',M0(twin[0].cash),M0(twin[1].cash)]},{c:['Enterprise value',M0(twin[0].eq+twin[0].debt-twin[0].cash),M0(twin[1].eq+twin[1].debt-twin[1].cash)],b:1,hi:1},{c:['EV / EBITDA','9.6x','9.6x'],b:1},{c:['Equity / EBITDA','9.6x','6.1x'],dim:1}],{rh:32}));
    s.push(g.T(60,350,'Same coffee, same stores, same EBITDA. Different financing.',{cls:'b'}),g.T(60,370,'Equity values differ; enterprise values match.',{cls:'m'}));
  }else if(si===3){
    s.push(g.table(80,70,[{t:'Metric',w:200,a:'l'},{t:'Who it belongs to',w:200,a:'l'},{t:'Pair with',w:200,a:'l'}],[{c:['Revenue','everyone','EV / Revenue'],cc:[null,null,'blue']},{c:['EBITDA','everyone','EV / EBITDA'],cc:[null,null,'blue'],hi:1},{c:['EBIT','everyone','EV / EBIT'],cc:[null,null,'blue']},{c:['Unlevered FCF','everyone','DCF → EV'],cc:[null,null,'blue']},{c:['Net income','shareholders','Price / Earnings'],cc:[null,null,'green'],top:1},{c:['Book equity','shareholders','Price / Book'],cc:[null,null,'green']},{c:['Levered FCF','shareholders','FCF yield'],cc:[null,null,'green']}],{rh:32}));
    s.push(g.T(80,350,'Mismatch = mistake: EV / Net income compares a pie to one slice.',{cls:'b',c:'red'}));
  }else{
    s.push(g.box(200,200,200,90,'Enterprise value','blue',{sub:F.m(C.ev),hot:1}),g.box(430,200,60,40,'÷','gray',{flat:1}),g.box(640,200,200,90,'FY25 EBITDA','green',{sub:F.m(C.ebitda[0]),hot:1}));
    s.push(g.pill(430,320,`EV / EBITDA = ${F.x(C.ev/C.ebitda[0])}`,'yellow',{fs:15}));
    s.push(g.T(430,380,`“${o.name} trades at ${F.x(C.ev/C.ebitda[0])} EBITDA.” The single most used valuation shorthand.`,{a:'middle',cls:'m'}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'The house and the mortgage',short:'Intuition',
  b:'If you buy a $500k house with a $400k mortgage attached, you hand the seller $100k, but you have really paid $500k: you also took on the debt.\n\nBuying a company works the same way. <b>Equity value</b> (share price × shares) is what shareholders get; <b>enterprise value</b> is what the whole business costs.'},
 {k:'technique',t:'Two sides of one company',short:'Both sides',m:{eq:F.m(C.eqv),ev:F.m(C.ev)},
  b:`${o.name}’s shares are worth <b>${F.m(C.eqv)}</b>. But lenders (${F.m(o.debt)} of debt), preferred holders (${F.m(o.pref)}) and minority owners of a subsidiary (${F.m(o.nci)}) also have claims.\n\nOn the other side, the company holds ${F.m(o.cash)} of cash it does not need to run stores. Take it out and the <b>operating business</b> is worth <b>${F.m(C.ev)}</b>.`},
 {k:'insight',t:'EV ignores financing',short:'Neutral',
  b:'Take two identical coffee chains: one has no debt, the other borrowed $800M and paid most of it out to shareholders. The levered one has a lower equity value, yet a buyer of the <b>whole business</b> would pay the same for both.\n\nEV is <b>capital-structure neutral</b>, which makes it ideal for comparing companies.'},
 {k:'technique',t:'Matching numerator and denominator',short:'Pairing',
  b:'A multiple must compare like with like. Metrics before interest (revenue, EBITDA, EBIT, unlevered FCF) belong to all capital providers, so divide <b>EV</b> by them. Metrics after interest (net income, book equity) belong to shareholders, so use <b>equity value</b>.',
  ch:['+ EV/EBITDA, EV/Revenue, EV/EBIT','+ P/E and P/B use equity value','- EV / Net income is a classic error']},
 {k:'recap',t:'EV / EBITDA',short:'Multiple',m:{mx:F.x(C.ev/C.ebitda[0])},
  b:`${F.m(C.ev)} ÷ ${F.m(C.ebitda[0])} = <b>${F.x(C.ev/C.ebitda[0])}</b>. That one number lets you compare ${o.name} with any coffee chain, whatever its debt load. The next lesson walks the bridge between the two values item by item.`}
]});

/* ======================================================= EV bridge */
const bridge=[['Equity\nvalue',C.eqv,'t'],['+ Debt',o.debt],['+ Preferred',o.pref],['+ Minority\ninterest',o.nci],['− Cash',-o.cash],['Enterprise\nvalue',C.ev,'t']];
ML.add({id:'ev-bridge',title:'The EV Bridge',min:10,lvl:'Intermediate',
sub:'Walking from market cap to enterprise value, and back again, one claim at a time.',
keys:'ev bridge equity value enterprise value net debt minority interest preferred cash leases pensions',
learn:['Equity value from diluted shares','Each step of the bridge and why','Other debt-like and cash-like items','Running the bridge backwards to a share price'],
cheat:['Equity value = share price × diluted shares.','Add every claim senior to or alongside common equity (debt, preferred, NCI, leases, pension deficits); subtract non-operating assets (cash, investments).','Reverse it: EV − net debt & claims = equity value ÷ diluted shares = value per share.'],
met:[['eq','Equity value','pie'],['nd','Net claims','scale'],['ev','Enterprise value','brief']],
hero:1,
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.box(120,200,150,70,'Share price','gray',{sub:`$${o.price.toFixed(2)}`}),g.box(240,200,40,40,'×','gray',{flat:1}),g.box(380,200,170,70,'Diluted shares','gray',{sub:`${F.n(C.dil,1)}M (TSM)`}),g.box(525,200,40,40,'=','gray',{flat:1}),g.box(680,200,180,70,'Equity value','green',{sub:F.m(C.eqv),hot:1}));
    s.push(g.T(430,330,'Use diluted shares, not basic: options and RSUs are claims too (lesson 01.5).',{a:'middle',cls:'m'}));
  }else if(si===1){
    s.push(g.wf(60,60,740,320,bridge,{fmt:v=>F.n(v,0),gap:26}));
  }else if(si===2){
    const it=[['+ Debt','orange','lenders get paid before shareholders: a buyer must refinance or assume it'],['+ Preferred','purple','a fixed claim senior to common; usually redeemed in a takeover'],['+ Minority','pink','KOPI owns 80% of a roastery but consolidates 100% of its EBITDA: add the 20% others own'],['− Cash','gray','excess cash is not needed to run the stores; it effectively lowers the price']];
    it.forEach(([t,c,d],i)=>{s.push(g.box(110,100+i*85,150,50,t,c,{hot:1}),g.T(205,105+i*85,d,{cls:'m'}))});
  }else if(si===3){
    s.push(g.panel(70,70,'Add (debt-like)',['lease liabilities (if EBITDA','  is after IFRS 16 / pre-rent)','unfunded pension deficits','earn-outs owed from past deals','big legal settlements payable','declared but unpaid dividends'],'red',{w:330}));
    s.push(g.panel(450,70,'Subtract (cash-like)',['excess cash & short-term','  investments','stakes in associates / JVs','  (their EBITDA is not in ours)','tax losses carried forward','  (at value of tax savings)'],'green',{w:330}));
    s.push(g.T(430,360,'Golden rule: if the EBITDA you divide by excludes it, the bridge must include it.',{a:'middle',cls:'b'}));
  }else{
    s.push(g.wf(60,60,560,320,[['DCF\nEV',C.dcfEV,'t'],['− Debt',-o.debt],['− Preferred',-o.pref],['− Minority',-o.nci],['+ Cash',o.cash],['Equity\nvalue',C.dcfEq,'t']],{fmt:v=>F.n(v,0),gap:20}));
    s.push(g.panel(650,90,'Per share',[`${F.m(C.dcfEq)} ÷ ${F.n(C.dil,1)}M`,`= $${C.dcfPx.toFixed(2)}`,'',`market: $${o.price.toFixed(2)}`,`upside ${F.p(C.dcfPx/o.price-1)}`],'blue',{w:180}));
  }
  return s.join('');
},
anim(si,t,g){if(si===1){const n=bridge.length,i=Math.floor(t/1.1)%n,bw=(740-26*(n-1))/n;return g.R(60+i*(bw+26)-4,48,bw+8,350,{rx:6,stroke:'var(--edge)',dash:'4 4',sw:1.5})}return ''},
steps:[
 {k:'setup',t:'Start from the share price',short:'Equity value',m:{eq:F.m(C.eqv)},
  b:`Equity value (market capitalisation) = share price × <b>diluted</b> shares: $${o.price.toFixed(2)} × ${F.n(C.dil,1)}M = <b>${F.m(C.eqv)}</b>.`},
 {k:'technique',t:'Walk the bridge',short:'The bridge',m:{nd:F.m(netAdj),ev:F.m(C.ev)},
  b:`Add every other claim on the business and subtract the cash it does not need: ${F.m(C.eqv)} + ${F.m(o.debt)} + ${F.m(o.pref)} + ${F.m(o.nci)} − ${F.m(o.cash)} = <b>${F.m(C.ev)}</b>.\n\nNet debt (debt − cash) of ${F.m(o.debt-o.cash)} is the biggest piece for most companies.`,
  n:['Equity value: the shareholders’ slice','+ debt: lenders’ claim','+ preferred stock','+ minority interest','− cash','= enterprise value']},
 {k:'insight',t:'Why each item is there',short:'Why',
  b:'Each item fixes a mismatch between the <b>EBITDA</b> we will divide by and the <b>claims</b> on it. Minority interest is the subtle one: we consolidate 100% of a subsidiary’s EBITDA even though outsiders own part of it, so their share of value must be added.'},
 {k:'tradeoff',t:'The long tail of adjustments',short:'Other items',
  b:'Real bridges include leases, pensions, investments in associates and more. Bankers argue about them because each one moves the price.\n\nThe test is <b>consistency</b>: whatever the EBITDA excludes, the bridge must include, and vice versa.',
  ch:['! Leases: be consistent with whether EBITDA is pre- or post-rent','+ Tax losses can be a cash-like asset']},
 {k:'solution',t:'Run it backwards',short:'Reverse',m:{eq:F.m(C.dcfEq)},
  b:`A DCF produces an <b>enterprise value</b>. To get a share price, walk the bridge in reverse: subtract the claims, add back cash, divide by diluted shares.\n\nOur DCF says ${F.m(C.dcfEV)} of EV → <b>$${C.dcfPx.toFixed(2)}</b> per share versus $${o.price.toFixed(2)} in the market.`}
]});

/* ======================================================= free cash flow */
const ys=C.yrs.slice(1),lf=ys.map((_,i)=>C.ufcf[i+1]-o.debt*o.rate*(1-o.tax)-o.amort);
ML.add({id:'free-cash-flow',title:'Free Cash Flow',min:10,lvl:'Beginner',
sub:'The cash a business throws off after paying to run and maintain itself: the thing a DCF actually values.',
keys:'free cash flow unlevered levered fcf nopat capex working capital fcff fcfe',
learn:['The build: EBIT → NOPAT → UFCF','Projecting FCF for five years','Unlevered vs levered free cash flow','Which discount rate goes with which'],
cheat:['UFCF = EBIT × (1 − t) + D&A − Capex − ΔNWC.','Levered FCF = UFCF − after-tax interest − debt repayments (+ new borrowing).','UFCF → discount at WACC → EV. Levered FCF → discount at cost of equity → equity value.'],
met:[['u','UFCF FY26','dollar'],['c','FCF / EBITDA','pie'],['l','Levered FCF','user']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.wf(50,60,760,320,[['EBIT',C.ebit[1],'t'],['− Tax on\nEBIT',-C.taxU[1]],['NOPAT',C.nopat[1],'t'],['+ D&A',C.da[1]],['− Capex',-C.capex[1]],['− ΔNWC',-C.dnwc[1]],['Unlevered\nFCF',C.ufcf[1],'t']],{fmt:v=>F.n(v,1),gap:22}));
  }else if(si===1){
    const cols=[{t:'$M',w:170,a:'l'},...ys.map(y=>({t:y,w:110}))];
    const r=(l,a,o2={})=>({c:[l,...a.slice(1).map(M)],...o2});
    s.push(g.table(40,60,cols,[r('Revenue',C.rev),r('EBITDA',C.ebitda),r('− D&A',C.da.map(v=>-v)),r('EBIT',C.ebit,{b:1,sep:1}),r('− Taxes @ 25%',C.taxU.map(v=>-v)),r('NOPAT',C.nopat,{b:1,sep:1}),r('+ D&A',C.da),r('− Capex',C.capex.map(v=>-v)),r('− ΔNWC',C.dnwc.map(v=>-v)),r('Unlevered FCF',C.ufcf,{b:1,hi:1,top:1})],{rh:28}));
  }else if(si===2){
    s.push(g.T(60,60,'Unlevered vs levered FCF, $M',{cls:'b'}));
    const n=5,x0=80,w=600,bw=40;const mx=Math.max(...C.ufcf)*1.15,h=280,y0=90;
    ys.forEach((y,i)=>{const x=x0+i*(w/n);const u=C.ufcf[i+1],l=lf[i];
      s.push(g.R(x,y0+h-u/mx*h,bw,u/mx*h,{fill:'color-mix(in srgb,var(--blue) 55%,var(--mixbase))',stroke:'var(--edge)',sw:1.2}),g.R(x+bw+6,y0+h-l/mx*h,bw,l/mx*h,{fill:'color-mix(in srgb,var(--green) 55%,var(--mixbase))',stroke:'var(--edge)',sw:1.2}));
      s.push(g.T(x+bw/2,y0+h-u/mx*h-5,M0(u),{a:'middle',cls:'b'}),g.T(x+bw*1.5+6,y0+h-l/mx*h-5,M0(l),{a:'middle',cls:'b'}),g.T(x+bw+3,y0+h+16,y,{a:'middle',cls:'m'}))});
    s.push(g.R(560,40,12,12,{fill:'var(--blue)'}),g.T(578,50,'unlevered (all investors)',{cls:'m'}),g.R(560,60,12,12,{fill:'var(--green)'}),g.T(578,70,'levered (shareholders)',{cls:'m'}));
    s.push(g.T(80,420,`Levered = unlevered − after-tax interest (${M(o.debt*o.rate*(1-o.tax))}) − debt repayment (${M(o.amort)}), held flat for simplicity.`,{cls:'m'}));
  }else if(si===3){
    s.push(g.box(150,140,190,56,'Unlevered FCF','blue',{hot:1}),g.box(430,140,170,56,'discount at WACC','blue',{flat:1}),g.box(710,140,190,56,'Enterprise value','blue',{hot:1}));
    s.push(g.box(150,300,190,56,'Levered FCF','green',{hot:1}),g.box(430,300,170,56,'discount at Ke','green',{flat:1}),g.box(710,300,190,56,'Equity value','green',{hot:1}));
    s.push(g.A(245,140,345,140),g.A(515,140,615,140),g.A(245,300,345,300),g.A(515,300,615,300));
    s.push(g.T(430,420,'Cash to everyone ↔ everyone’s required return. Cash to owners ↔ owners’ required return.',{a:'middle',cls:'b'}));
  }else{
    const cv=C.ufcf.slice(1).map((u,i)=>u/C.ebitda[i+1]);
    s.push(g.T(60,60,'FCF conversion: UFCF ÷ EBITDA',{cls:'b'}),g.bars(60,90,460,290,cv,{labels:ys,c:'green',fmt:v=>F.p(v,0),max:1,gap:20}));
    s.push(g.panel(560,100,'What drives conversion',['tax rate','capex intensity','working-capital needs','','asset-light software: 70%+','coffee chain: ~50%','airlines, telecom: lower'],'green',{w:250}));
  }
  return s.join('');
},
anim(si,t,g){if(si===3){const p=(t%2)/2;return g.dot(245,140,345,140,p,'blue')+g.dot(515,140,615,140,p,'blue')+g.dot(245,300,345,300,p,'green')+g.dot(515,300,615,300,p,'green')}return ''},
steps:[
 {k:'setup',t:'Building free cash flow',short:'The build',m:{u:F.m(C.ufcf[1],1)},
  b:`Start from operating profit (EBIT) and tax it as if the company had no debt: that is <b>NOPAT</b>. Add back non-cash D&A, then subtract the cash really reinvested: <b>capex</b> and the increase in <b>working capital</b>.\n\nWhat is left, <b>${F.m(C.ufcf[1],1)}</b> in FY26, is cash that could be paid to lenders and owners without hurting the business.`},
 {k:'technique',t:'Project five years',short:'Projection',
  b:'A DCF needs a forecast. Revenue growth, margins, capex and working capital assumptions drive each line. Every row here is linked to the operating model, so changing one assumption flows through the whole build.',
  ch:['+ 5 to 10 explicit years, until the business reaches a steady state','! Forecasts should be defensible against history and peers']},
 {k:'insight',t:'Unlevered vs levered',short:'U vs L',m:{l:F.m(lf[0],1)},
  b:'<b>Unlevered</b> FCF is before any payment to lenders: cash available to <b>all</b> investors. <b>Levered</b> FCF subtracts interest (after the tax saving) and debt repayments: cash available to <b>shareholders</b> only.\n\nBanker DCFs almost always use unlevered FCF, so the valuation does not depend on today’s debt.'},
 {k:'technique',t:'Match cash flows to discount rates',short:'Matching',
  b:'Unlevered FCF is discounted at the <b>WACC</b>, the blended return lenders and shareholders require, and produces enterprise value. Levered FCF is discounted at the <b>cost of equity</b> and gives equity value directly.\n\nMixing them (levered FCF at WACC) counts the debt twice.'},
 {k:'recap',t:'FCF conversion',short:'Conversion',m:{c:F.p(C.ufcf[1]/C.ebitda[1],0)},
  b:'Comparing FCF with EBITDA shows how much profit turns into cash. Higher conversion means more value per dollar of EBITDA, which is one reason asset-light businesses trade at higher multiples.'}
]});

/* ======================================================= WACC */
const bu=o.beta/(1+(1-o.tax)*o.debt/C.eqv);
const waccAt=wd=>{const de=wd/(1-wd),bl=bu*(1+(1-o.tax)*de),ke=o.rf+bl*o.erp,kd=.055+.1*wd*wd;return {ke,kd,w:(1-wd)*ke+wd*kd*(1-o.tax)}};
ML.add({id:'wacc',title:'WACC',min:12,lvl:'Intermediate',
sub:'The weighted average cost of capital: the return every dollar invested in the company must earn.',
keys:'wacc cost of capital capm beta equity risk premium cost of debt tax shield discount rate',
learn:['Capital weights at market value','Cost of equity with CAPM','After-tax cost of debt','Why WACC curves with leverage'],
cheat:['WACC = E/(D+E) × Ke + D/(D+E) × Kd × (1 − t).','CAPM: Ke = Rf + β × ERP.','Use market values and a target capital structure. Unlever / relever beta: βL = βU × [1 + (1 − t) D/E].'],
met:[['we','Equity weight','pie'],['ke','Cost of equity','trend'],['kd','After-tax Kd','bank'],['w','WACC','target']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.stack(200,80,140,320,[['Equity (market value)',C.eqv,'green'],['Debt',o.debt,'orange']],{title:'Capital funding the firm',fmt:v=>F.m(v)}));
    s.push(g.panel(470,100,'Weights (market value)',[`equity  ${F.m(C.eqv)}  ${F.p(C.wE)}`,`debt    ${F.m(o.debt)}   ${F.p(C.wD)}`,'','use market values: they are','what investors could get today'],'blue',{w:300}));
  }else if(si===1){
    const P=g.plot({x:90,y:50,w:540,h:330,xr:[0,2],yr:[0,.16],nx:4,ny:4,ticks:1,xl:'beta (β): risk vs the market',yl:'required return'});
    s.push(P.svg,P.fn(b=>o.rf+b*o.erp,'blue'),P.line([[0,o.rf],[2,o.rf]],'gray',{cls:'dash thin'}));
    s.push(g.C(P.sx(1),P.sy(o.rf+o.erp),6,'gray'),g.T(P.sx(1)+8,P.sy(o.rf+o.erp)+16,'market (β = 1)',{cls:'m'}));
    s.push(g.C(P.sx(o.beta),P.sy(C.ke),8,'green',{cls:'big'}),g.T(P.sx(o.beta)-10,P.sy(C.ke)-14,`KOPI β ${o.beta} → ${F.p(C.ke,2)}`,{cls:'b',a:'end'}));
    s.push(g.T(P.sx(1.4),P.sy(o.rf)+16,`risk-free ${F.p(o.rf)}`,{cls:'m'}));
    s.push(g.panel(655,60,'CAPM',['Ke = Rf + β × ERP',`= ${F.p(o.rf)} + ${o.beta}×${F.p(o.erp)}`,`= ${F.p(C.ke,2)}`],'green',{w:190}));
  }else if(si===2){
    s.push(g.bars(120,100,300,260,[o.kd,o.kd*o.tax,C.kdat],{labels:['pre-tax Kd','tax saving','after-tax Kd'],c:['orange','green','orange'],fmt:v=>F.p(v,2),max:.07,gap:30}));
    s.push(g.panel(490,110,'Why after tax?',['interest is tax-deductible,','so each 1% of interest','costs only 0.75% after tax','',`Kd × (1 − t) = ${F.p(o.kd)} × 0.75`,`= ${F.p(C.kdat,2)}`],'orange',{w:280}));
  }else if(si===3){
    const a=C.wE*C.ke,b=C.wD*C.kdat;
    s.push(g.wf(120,70,480,300,[['equity\npart',a,'t'],['debt\npart',b],['WACC',C.wacc,'t']],{fmt:v=>F.p(v,2),gap:50,tc:'blue'}));
    s.push(g.panel(640,90,'Blend',[`${F.p(C.wE)} × ${F.p(C.ke,2)}`,`+ ${F.p(C.wD)} × ${F.p(C.kdat,2)}`,`= ${F.p(C.wacc,2)}`],'blue',{w:190}));
  }else if(si===4){
    const P=g.plot({x:90,y:50,w:600,h:330,xr:[0,.6],yr:[.04,.16],nx:6,ny:6,ticks:1,xl:'debt / (debt + equity)',yl:'cost of capital'});
    s.push(P.svg,P.fn(w=>waccAt(w).ke,'green'),P.fn(w=>waccAt(w).kd*(1-o.tax),'orange'),P.fn(w=>waccAt(w).w,'blue',{w:3.4}));
    let best=0,bw=1;for(let w=0;w<=.6;w+=.005){const v=waccAt(w).w;if(v<bw){bw=v;best=w}}
    s.push(g.C(P.sx(best),P.sy(bw),7,'blue',{cls:'big'}),g.T(P.sx(best),P.sy(bw)+22,`min ≈ ${F.p(best,0)} debt`,{a:'middle',cls:'b'}));
    s.push(g.T(P.sx(.45),P.sy(waccAt(.45).ke)-10,'cost of equity',{cls:'b',c:'green'}),g.T(P.sx(.45),P.sy(waccAt(.45).kd*(1-o.tax))+18,'after-tax cost of debt',{cls:'b',c:'orange'}),g.T(P.sx(.52),P.sy(waccAt(.52).w)+18,'WACC',{cls:'b',c:'blue'}));
  }else{
    s.push(g.panel(150,110,'WACC',['WACC = E/V × Ke + D/V × Kd × (1 − t)','',`= ${F.p(C.wE)} × ${F.p(C.ke,2)} + ${F.p(C.wD)} × ${F.p(C.kdat,2)}`,`= ${F.p(C.wacc,2)}`,'','next lesson: discount the free cash','flows at this rate'],'blue',{w:560}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Who funds the company',short:'Weights',m:{we:F.p(C.wE)},
  b:`${o.name} is funded by shareholders (${F.m(C.eqv)} at market value) and lenders (${F.m(o.debt)}). Each expects a return. The company’s hurdle rate is the <b>weighted average</b> of those returns.\n\nUse <b>market</b> values for the weights (or a target structure), not book values.`},
 {k:'math',t:'Cost of equity: CAPM',short:'CAPM',m:{ke:F.p(C.ke,2)},
  b:`Shareholders bear more risk than lenders, so they demand more. The <b>Capital Asset Pricing Model</b> says: risk-free rate + beta × equity risk premium.\n\nBeta measures how much the stock moves with the market. ${o.name}’s β of ${o.beta} gives Ke = <b>${F.p(C.ke,2)}</b>.`,
  ch:['+ Rf: long-term government bond yield','+ ERP: extra return investors want from stocks (~4–6%)','! Use peer betas, unlevered and relevered, for private companies']},
 {k:'math',t:'After-tax cost of debt',short:'Kd',m:{kd:F.p(C.kdat,2)},
  b:`Lenders charge ${F.p(o.kd)}. But interest is tax-deductible, so the real cost to the company is ${F.p(o.kd)} × (1 − ${F.p(o.tax,0)}) = <b>${F.p(C.kdat,2)}</b>. That saving is the <b>interest tax shield</b>.`},
 {k:'solution',t:'Blend into WACC',short:'Blend',m:{w:F.p(C.wacc,2)},
  b:`Weight each cost by its share of capital: <b>${F.p(C.wacc,2)}</b>. Every project, and the DCF of the whole company, must clear this rate to create value.`},
 {k:'tradeoff',t:'Why more debt is not free',short:'Leverage',
  b:`Debt is cheaper than equity, so a little debt lowers WACC. But more debt makes equity riskier (beta rises) and lenders charge more as default risk grows. WACC traces a shallow <b>U</b>: the bottom is the efficient capital structure.\n\n(Illustrative: unlevered beta ${bu.toFixed(2)} relevered at each debt level, plus a rising credit spread.)`},
 {k:'recap',t:'The formula',short:'Formula',
  b:'Weights × costs. In practice the hard part is not the arithmetic but defending beta, the equity risk premium and the target capital structure.'}
]});

/* ======================================================= DCF */
const grid=(()=>{const W=[C.W-.01,C.W-.005,C.W,C.W+.005,C.W+.01],G=[.015,.02,.025,.03,.035];return {W,G,M:W.map(w=>G.map(gg=>CF.run({wacc:w,tg:gg}).dcfPx))}})();
ML.DCFR={lo:grid.M[3][1],hi:grid.M[1][3],M:grid};
ML.add({id:'dcf',title:'Discounted Cash Flow (DCF)',min:14,lvl:'Intermediate',
sub:'A company is worth the cash it will generate, discounted back to today.',
keys:'dcf discounted cash flow intrinsic value present value discount factor sensitivity',
learn:['Why a dollar later is worth less today','Discounting five years of free cash flow','Adding the terminal value','From EV to a value per share, and sensitivity tables'],
cheat:['PV = CF ÷ (1 + WACC)^t.','EV = Σ PV(UFCF) + PV(terminal value).','Equity value = EV − net debt & other claims; ÷ diluted shares.','Always show a WACC × g (or exit multiple) sensitivity table.'],
met:[['pv','Σ PV of FCF','dollar'],['tv','PV of TV','sparkle'],['ev','DCF EV','brief'],['px','Value / share','target']],
hero:2,
draw(si,g){
  const s=[];const mx=Math.max(...C.ufcf)*1.2;
  if(si===0){
    const P=g.plot({x:90,y:50,w:540,h:320,xr:[0,10],yr:[0,110],nx:10,ny:5,ticks:1,xl:'years from today',yl:'today’s value of $100'});
    s.push(P.svg,P.fn(t=>100/Math.pow(1+C.W,t),'blue',{w:3}));
    s.push(g.C(P.sx(5),P.sy(100/Math.pow(1+C.W,5)),7,'blue',{cls:'big'}),g.T(P.sx(5)+10,P.sy(100/Math.pow(1+C.W,5))-8,`$100 in year 5 = $${(100/Math.pow(1+C.W,5)).toFixed(0)} today`,{cls:'b'}));
    s.push(g.panel(655,70,'Discounting',['PV = CF / (1 + r)^t',`r = WACC = ${F.p(C.W,1)}`],'blue',{w:190}));
  }else if(si===1||si===2){
    const x0=90,h=300,y0=70,bw=80,gap=50;
    ys.forEach((y,i)=>{const x=x0+i*(bw+gap),u=C.ufcf[i+1],pv=C.pv[i+1];
      s.push(g.R(x,y0+h-u/mx*h,bw,u/mx*h,{fill:'color-mix(in srgb,var(--blue) 30%,var(--mixbase))',stroke:'var(--edge)',sw:1.2,dash:si===2?'4 3':null}));
      if(si===2)s.push(g.R(x+10,y0+h-pv/mx*h,bw-20,pv/mx*h,{fill:'color-mix(in srgb,var(--green) 60%,var(--mixbase))',stroke:'var(--edge)',sw:1.3}),g.T(x+bw/2,y0+h-pv/mx*h+16,M0(pv),{a:'middle',cls:'b'}),g.T(x+bw/2,y0+h+32,`× ${C.df[i+1].toFixed(3)}`,{a:'middle',cls:'m'}));
      s.push(g.T(x+bw/2,y0+h-u/mx*h-6,M(u),{a:'middle',cls:'b'}),g.T(x+bw/2,y0+h+16,y,{a:'middle',cls:'m'}))});
    if(si===2)s.push(g.pill(430,445,`Σ PV = ${F.m(C.sumPV,1)}`,'green',{fs:13}));
    s.push(g.T(x0,50,si===1?'Unlevered free cash flow forecast, $M':'Each year’s FCF shrinks by its discount factor (green = present value)',{cls:'b'}));
  }else if(si===3){
    s.push(g.wf(80,70,520,300,[['Σ PV\nFY26–30',C.sumPV,'t'],['PV of\nterminal value',C.pvtv],['Enterprise\nvalue',C.dcfEV,'t']],{fmt:v=>F.n(v,0),gap:50}));
    s.push(g.panel(640,90,'Terminal value',['TV = FCF31 / (WACC − g)',`g = ${F.p(C.tg)}`,`TV = ${F.m(C.tvG)}`,`PV = ${F.m(C.pvtv)}`,'',`${F.p(C.pvtv/C.dcfEV,0)} of EV!`],'purple',{w:200}));
  }else if(si===4){
    s.push(g.wf(60,70,560,300,[['DCF EV',C.dcfEV,'t'],['− net debt\n& claims',-netAdj],['Equity\nvalue',C.dcfEq,'t']],{fmt:v=>F.n(v,0),gap:50}));
    s.push(g.panel(650,90,'Value per share',[`${F.m(C.dcfEq)} ÷ ${F.n(C.dil,1)}M`,`= $${C.dcfPx.toFixed(2)}`,'',`market $${o.price.toFixed(2)}`,`→ ${C.dcfPx>o.price?'undervalued':'overvalued'} by ${F.p(Math.abs(C.dcfPx/o.price-1))}`],'blue',{w:190}));
  }else{
    const v=[].concat(...grid.M);
    s.push(g.T(430,60,'Value per share: WACC (rows) × terminal growth (columns)',{a:'middle',cls:'b'}));
    s.push(g.heat(270,105,grid.M,{cs:64,min:Math.min(...v),max:Math.max(...v),c:'green',fmt:x=>'$'+x.toFixed(2),rows:grid.W.map(w=>F.p(w,1)),cols:grid.G.map(x=>F.p(x,1)),hi:[2,2]}));
    s.push(g.T(430,82,'terminal growth g →',{a:'middle',cls:'m'}),g.T(180,250,'WACC ↓',{a:'middle',cls:'m'}));
  }
  return s.join('');
},
anim(si,t,g,ord){
  if(si===2){const x0=90,bw=80,gap=50,i=ord>=0?ord:0;return g.R(x0+i*(bw+gap)-5,60,bw+10,330,{rx:6,stroke:'var(--edge)',dash:'4 4',sw:1.5})}
  if(si===0){const tt=(t%5)/5*10,v=100/Math.pow(1+C.W,tt);return g.C(90+tt/10*540,50+320-v/110*320,5,'orange')}
  return '';
},
steps:[
 {k:'setup',t:'Money later is worth less',short:'Time value',
  b:`Cash today can be invested, so a promise of cash later is worth less. At ${o.name}’s WACC of ${F.p(C.W)}, $100 received in five years is worth only <b>$${(100/Math.pow(1+C.W,5)).toFixed(0)}</b> today.\n\nA <b>DCF</b> applies that logic to every future dollar a company will generate.`},
 {k:'technique',t:'Forecast free cash flow',short:'Forecast',
  b:'Take the five years of unlevered free cash flow built in the previous lessons. This is cash the business generates for all its investors, before any financing decisions.'},
 {k:'math',t:'Discount each year',short:'Discount',m:{pv:F.m(C.sumPV,1)},
  b:`Multiply each year’s cash flow by its discount factor 1 ÷ (1 + WACC)^t. FY30’s ${F.m(C.ufcf[5],1)} is worth just ${F.m(C.pv[5],1)} today.\n\nAdded up, the five explicit years are worth <b>${F.m(C.sumPV,1)}</b>.`,
  n:['FY26 × discount factor','FY27','FY28','FY29','FY30']},
 {k:'insight',t:'Add the terminal value',short:'TV',m:{tv:F.m(C.pvtv),ev:F.m(C.dcfEV)},
  b:`The business does not stop in 2030. A <b>terminal value</b> captures everything after (next lesson). Discounted back, it is worth ${F.m(C.pvtv)}: <b>${F.p(C.pvtv/C.dcfEV,0)}</b> of the total. That is normal, and it is why terminal assumptions deserve the most scrutiny.\n\nDCF enterprise value: <b>${F.m(C.dcfEV)}</b>.`},
 {k:'solution',t:'From EV to share price',short:'Per share',m:{px:'$'+C.dcfPx.toFixed(2)},
  b:`Run the EV bridge backwards: subtract debt, preferred and minority interest, add cash, divide by diluted shares: <b>$${C.dcfPx.toFixed(2)}</b> per share versus a market price of $${o.price.toFixed(2)}.`},
 {k:'tradeoff',t:'Sensitivity: a range, not a point',short:'Sensitivity',
  b:`Small changes in WACC or terminal growth move the answer a lot: here from $${Math.min(...[].concat(...grid.M)).toFixed(2)} to $${Math.max(...[].concat(...grid.M)).toFixed(2)}. Every DCF is shown with a sensitivity table, and the result goes on the football field as a <b>range</b>.`,
  ch:['- Garbage in, garbage out: the output is only as good as the forecast','+ Forces you to make every assumption explicit']}
]});

/* ======================================================= terminal value */
const impX=C.tvG/C.ebitda[5],TVx=CF.run({tvMethod:'exit'}),impG=(TVx.tvX*C.W-C.ufcf[5])/(TVx.tvX+C.ufcf[5]);
ML.add({id:'terminal-value',title:'Terminal Value',min:11,lvl:'Intermediate',
sub:'Everything a business is worth after the forecast ends: usually most of the DCF.',
keys:'terminal value perpetuity growth gordon growth exit multiple implied multiple',
learn:['Why terminal value dominates a DCF','The perpetuity growth (Gordon) method','The exit multiple method','Cross-checking one against the other'],
cheat:['Gordon: TV = FCFₙ × (1 + g) ÷ (WACC − g). g must stay below long-run nominal GDP growth.','Exit multiple: TV = EBITDAₙ × multiple (from comps).','Discount TV by the year-n discount factor. Cross-check implied multiple and implied g.'],
met:[['sh','TV share of EV','pie'],['tg','Gordon TV','sparkle'],['tx','Exit-multiple TV','chart']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.stack(380,70,160,340,[['5 forecast years',C.sumPV,'blue'],['Terminal value (PV)',C.pvtv,'purple']],{title:'DCF enterprise value',hi:1}));
    s.push(g.T(200,250,`${F.p(C.pvtv/C.dcfEV,0)}`,{a:'middle',size:40,cls:'b'}),g.T(200,275,'of value comes',{a:'middle',cls:'m'}),g.T(200,291,'after 2030',{a:'middle',cls:'m'}));
  }else if(si===1){
    const P=g.plot({x:90,y:50,w:540,h:320,xr:[0,.1],yr:[0,8000],nx:5,ny:4,ticks:1,xl:'terminal growth g',yl:'TV ($M)'});
    s.push(P.svg,P.fn(x=>C.ufcf[5]*(1+x)/(C.W-x),'purple',{w:3,to:C.W-.003}),P.line([[C.W,0],[C.W,8000]],'red',{cls:'dash'}));
    s.push(g.C(P.sx(C.tg),P.sy(C.tvG),7,'purple',{cls:'big'}),g.T(P.sx(C.tg)+10,P.sy(C.tvG)+4,`g ${F.p(C.tg)} → ${F.m(C.tvG)}`,{cls:'b'}),g.T(P.sx(C.W)-8,P.sy(7000),'g → WACC: TV explodes',{a:'end',cls:'b',c:'red'}));
    s.push(g.panel(650,60,'Gordon growth',['TV = FCF × (1 + g)','     ÷ (WACC − g)',`= ${M0(C.ufcf[5])} × ${(1+C.tg).toFixed(3)}`,`  ÷ (${F.p(C.W,1)} − ${F.p(C.tg)})`,`= ${F.m(C.tvG)}`],'purple',{w:195}));
  }else if(si===2){
    s.push(g.box(120,180,180,70,'FY30 EBITDA','green',{sub:F.m(C.ebitda[5],1)}),g.box(245,180,36,36,'×','gray',{flat:1}),g.box(390,180,200,70,'Exit multiple','blue',{sub:F.x(o.exitX)+' (from comps)'}),g.box(535,180,36,36,'=','gray',{flat:1}),g.box(680,180,180,70,'Terminal value','purple',{sub:F.m(TVx.tvX),hot:1}));
    s.push(g.T(430,320,`PV = ${F.m(TVx.tvX)} × ${C.df[5].toFixed(3)} = ${F.m(TVx.pvtv)}  →  EV ${F.m(TVx.dcfEV)} ($${TVx.dcfPx.toFixed(2)}/share)`,{a:'middle',cls:'b'}));
    s.push(g.T(430,345,'“What would someone pay for the business in 2030?”',{a:'middle',cls:'m'}));
  }else if(si===3){
    s.push(g.table(80,80,[{t:'',w:220,a:'l'},{t:'Gordon growth',w:160},{t:'Exit multiple',w:160}],[{c:['Assumption',`g = ${F.p(C.tg)}`,`${F.x(o.exitX)} EBITDA`]},{c:['Terminal value',F.m(C.tvG),F.m(TVx.tvX)]},{c:['Implied EV/EBITDA',F.x(impX),F.x(o.exitX)],cc:[null,'purple',null],hi:1},{c:['Implied growth g',F.p(C.tg),F.p(impG)],cc:[null,null,'purple'],hi:1},{c:['DCF value / share','$'+C.dcfPx.toFixed(2),'$'+TVx.dcfPx.toFixed(2)],b:1,top:1}],{rh:34}));
    s.push(g.T(80,330,'If the two methods disagree a lot, one of the assumptions is unrealistic.',{cls:'b'}));
  }else{
    s.push(g.panel(80,80,'Sanity checks',['g ≤ long-run nominal GDP (~2–3%)','terminal margins & capex at a','  steady state (capex ≥ D&A)','implied multiple vs today’s comps','TV share of EV: 60–80% is typical'],'purple',{w:330}));
    s.push(g.panel(460,80,'Common mistakes',['g above WACC (negative TV)','using a boom-year multiple','forgetting to discount TV','different terminal year for','  multiple vs FCF'],'red',{w:320}));
  }
  return s.join('');
},
steps:[
 {k:'problem',t:'Most of the value is after year 5',short:'The problem',m:{sh:F.p(C.pvtv/C.dcfEV,0)},
  b:`In our DCF, <b>${F.p(C.pvtv/C.dcfEV,0)}</b> of enterprise value comes from the terminal value. The careful five-year forecast is the minority.\n\nSo the assumption that matters most is the one about the distant future.`},
 {k:'math',t:'Perpetuity growth (Gordon) method',short:'Gordon',m:{tg:F.m(C.tvG)},
  b:`Assume FCF grows at a constant rate g forever. The value of that perpetuity at the end of FY30 is FCF × (1 + g) ÷ (WACC − g) = <b>${F.m(C.tvG)}</b>.\n\nAs g approaches WACC the denominator shrinks towards zero and the value explodes. Keep g at or below long-run economic growth.`},
 {k:'technique',t:'Exit multiple method',short:'Exit multiple',m:{tx:F.m(TVx.tvX)},
  b:`Alternatively assume the business is sold at the end of FY30 for a multiple of EBITDA, taken from today’s trading comps: ${F.x(o.exitX)} × ${F.m(C.ebitda[5],1)} = <b>${F.m(TVx.tvX)}</b>.\n\nBankers like it because it ties to market evidence; academics dislike that it imports today’s market mood into a long-run value.`},
 {k:'insight',t:'Cross-check the two',short:'Cross-check',
  b:`Our Gordon TV implies <b>${F.x(impX)}</b> EBITDA; the ${F.x(o.exitX)} exit multiple implies perpetual growth of <b>${F.p(impG)}</b>. If these look unreasonable next to peers and the economy, revisit the assumptions.`},
 {k:'recap',t:'Keep it honest',short:'Checks',
  b:'Terminal value is where optimistic models hide. Check growth against the economy, the implied multiple against peers, and the terminal year’s margins and reinvestment against a steady state.'}
]});

/* ======================================================= trading comps */
const PEERS=[['BeanHouse',3800,400,17.0,.06],['Daily Grind',1450,160,15.5,.05],['Roastly',2900,270,19.0,.09],['CupCo',950,115,13.5,.03],['Java Nation',5600,560,18.0,.07],['Leaf & Bean',1200,118,18.5,.08]].map(([n,ev,e,pe,gr])=>({n,ev,e,x:ev/e,pe,gr}));
const q=(a,p)=>{const b=[...a].sort((x,y)=>x-y),i=(b.length-1)*p,l=Math.floor(i);return b[l]+(b[Math.ceil(i)]-b[l])*(i-l)};
const xs=PEERS.map(p=>p.x),med=q(xs,.5),p25=q(xs,.25),p75=q(xs,.75);
ML.COMPS={lo:perSh(p25*C.ebitda[0]),hi:perSh(p75*C.ebitda[0]),med:perSh(med*C.ebitda[0])};
ML.add({id:'trading-comps',title:'Trading Comps',min:11,lvl:'Beginner',
sub:'Value a company the way you price a house: look at what similar ones are worth right now.',
keys:'trading comps comparable company analysis multiples peers ev ebitda p/e median percentile',
learn:['Picking a peer group','Computing and spreading multiples','Applying the range to our company','Where comps mislead'],
cheat:['Pick peers by business model, size, growth, margins, geography.','Spread EV/EBITDA, EV/Revenue, P/E on LTM and forward numbers; use 25th–75th percentile and median.','Implied EV = multiple × our metric → bridge to equity → per share. No control premium.'],
met:[['md','Median EV/EBITDA','chart'],['rg','Implied range','scale'],['us','KOPI today','target']],
draw(si,g){
  const s=[];
  if(si===0){
    PEERS.forEach((p,i)=>{const a=i/PEERS.length*Math.PI*2-Math.PI/2;s.push(g.A(430+Math.cos(a)*95,240+Math.sin(a)*45,430+Math.cos(a)*200,240+Math.sin(a)*130,{c:'faint',head:false,dash:1}),g.box(430+Math.cos(a)*280,240+Math.sin(a)*165,150,46,p.n,'gray',{flat:1}))});
    s.push(g.box(430,240,170,60,o.name,'green',{hot:1}));
  }else if(si===1){
    const rows=PEERS.map(p=>({c:[p.n,F.n(p.ev),F.n(p.e),F.x(p.x),F.x(p.pe),F.p(p.gr,0)]}));
    rows.push({c:['25th percentile','','',F.x(p25),F.x(q(PEERS.map(p=>p.pe),.25)),''],top:1,dim:1},{c:['Median','','',F.x(med),F.x(q(PEERS.map(p=>p.pe),.5)),''],b:1,hi:1},{c:['75th percentile','','',F.x(p75),F.x(q(PEERS.map(p=>p.pe),.75)),''],dim:1});
    s.push(g.table(40,50,[{t:'Company',w:160,a:'l'},{t:'EV $M',w:110},{t:'EBITDA',w:110},{t:'EV/EBITDA',w:120},{t:'P/E',w:100},{t:'Growth',w:100}],rows,{rh:30}));
    s.push(g.T(40,400,'Fictional peers, for illustration.',{cls:'m'}));
  }else if(si===2){
    const P=g.plot({x:80,y:100,w:680,h:200,xr:[7,12],yr:[0,1],nx:10,ny:1});
    s.push(P.svg);
    s.push(g.R(P.sx(p25),P.y+20,P.sx(p75)-P.sx(p25),P.h-40,{fill:'var(--green-bg)',stroke:'var(--green)',sw:1.5,rx:6}));
    [...PEERS].sort((a,b)=>a.x-b.x).forEach((p,i)=>s.push(g.C(P.sx(p.x),P.sy(.5),8,'blue'),g.T(P.sx(p.x),P.sy(.5)+[-16,26,-34,44,-16,26][i],p.n,{a:'middle',cls:'m'})));
    s.push(g.L([[P.sx(med),P.y],[P.sx(med),P.y+P.h]],'green',{w:2.5}),g.T(P.sx(med),P.y-8,`median ${F.x(med)}`,{a:'middle',cls:'b',c:'green'}));
    s.push(g.C(P.sx(C.ev/C.ebitda[0]),P.sy(.5),9,'orange',{cls:'big'}),g.T(P.sx(C.ev/C.ebitda[0]),P.y+P.h+20,`KOPI ${F.x(C.ev/C.ebitda[0])}`,{a:'middle',cls:'b',c:'orange'}));
    [7,8,9,10,11,12].forEach(v=>s.push(g.T(P.sx(v),P.y+P.h+38,v+'x',{a:'middle',cls:'m'})));
  }else if(si===3){
    const rows=[['25th pct',p25],['Median',med],['75th pct',p75]].map(([l,x])=>{const ev=x*C.ebitda[0];return {c:[l,F.x(x),F.m(ev),F.m(ev-netAdj),'$'+perSh(ev).toFixed(2)],hi:l==='Median',b:l==='Median'}});
    s.push(g.table(60,80,[{t:'',w:130,a:'l'},{t:'EV/EBITDA',w:120},{t:'× $200M = EV',w:150},{t:'Equity value',w:140},{t:'Per share',w:120}],rows,{rh:36}));
    s.push(g.T(60,260,`Implied range: $${ML.COMPS.lo.toFixed(2)} to $${ML.COMPS.hi.toFixed(2)} per share, vs $${o.price.toFixed(2)} today.`,{cls:'b'}));
    s.push(g.T(60,280,'This is a minority, freely traded value: no control premium.',{cls:'m'}));
  }else{
    s.push(g.panel(80,80,'Comps mislead when…',['peers differ in growth or margin','one-off items distort EBITDA','fiscal years differ (calendarise)','the whole sector is mispriced','few true peers exist'],'red',{w:320}));
    s.push(g.panel(450,80,'Fixes',['regress multiple vs growth','use adjusted, LTM & NTM figures','weight the closest peers','show a range, not a point','pair with DCF & precedents'],'green',{w:320}));
  }
  return s.join('');
},
anim(si,t,g){if(si===0){const k=(t%2)/2;return PEERS.map((p,i)=>{const a=i/PEERS.length*Math.PI*2-Math.PI/2;return g.dot(430+Math.cos(a)*200,240+Math.sin(a)*130,430+Math.cos(a)*95,240+Math.sin(a)*45,k,'blue',{r:4})}).join('')}return ''},
steps:[
 {k:'setup',t:'Value by comparison',short:'Idea',
  b:`To price a house you look at recent sales on the same street. <b>Trading comps</b> do the same for companies: find listed businesses like ${o.name} and see what multiples the market pays for them today.`},
 {k:'technique',t:'Spread the multiples',short:'The table',m:{md:F.x(med)},
  b:'For each peer, compute enterprise value (with the EV bridge) and divide by EBITDA; compute P/E from share price and EPS. Then take the <b>median</b> and the <b>25th–75th percentile</b> range, which are less sensitive to outliers than the average.'},
 {k:'insight',t:'Where does Kopi Kita sit?',short:'Position',m:{us:F.x(C.ev/C.ebitda[0])},
  b:`Peers trade between ${F.x(Math.min(...xs))} and ${F.x(Math.max(...xs))}. ${o.name} at ${F.x(C.ev/C.ebitda[0])} is near the middle. Faster growers (Roastly, Leaf & Bean) earn higher multiples; slow-growing CupCo the lowest.`},
 {k:'solution',t:'Apply the range',short:'Apply',m:{rg:`$${ML.COMPS.lo.toFixed(2)}–$${ML.COMPS.hi.toFixed(2)}`},
  b:`Multiply the multiple range by ${o.name}’s ${F.m(C.ebitda[0])} EBITDA, bridge to equity, divide by diluted shares. Comps say <b>$${ML.COMPS.lo.toFixed(2)} to $${ML.COMPS.hi.toFixed(2)}</b> per share.`},
 {k:'tradeoff',t:'Limits of comps',short:'Limits',
  b:'Comps are quick and market-based, but they assume the peers are truly comparable and correctly priced. If the whole sector is in a bubble, comps will happily confirm the bubble.',
  ch:['+ Reflects current market sentiment','- No control premium: understates a takeover price','- Hard to find true peers for unique businesses']}
]});

/* ======================================================= precedents */
const DEALS=[['2021','Morning Cup','Global Bev',820,11.5,.32,'S'],['2022','Brew Bros','Northgate Capital',640,10.2,.25,'P'],['2023','Café Lumen','BeanHouse',1350,12.0,.38,'S'],['2024','Grounds Co','Atlas Foods',980,10.8,.28,'S'],['2024','Roast Republic','Harbor Partners',540,9.8,.22,'P'],['2025','Urban Espresso','Java Nation',1720,11.2,.30,'S']];
const dx=DEALS.map(d=>d[4]),dmed=q(dx,.5),d25=q(dx,.25),d75=q(dx,.75);
ML.PREC={lo:perSh(d25*C.ebitda[0]),hi:perSh(d75*C.ebitda[0]),med:perSh(dmed*C.ebitda[0])};
ML.add({id:'precedents',title:'Precedent Transactions',min:10,lvl:'Intermediate',
sub:'What buyers actually paid to take control of similar companies.',
keys:'precedent transactions transaction comps control premium m&a multiples deal',
learn:['Building a precedents table','The control premium and why it exists','Applying deal multiples','Limitations of old deals'],
cheat:['Multiples paid in past M&A for comparable targets: EV/EBITDA (LTM at announcement), premium to unaffected price.','Usually above trading comps: they include a control premium (often 20–40%).','Adjust for timing, market conditions, buyer type and deal size.'],
met:[['md','Median deal multiple','chart'],['pr','Median premium','trend'],['rg','Implied range','scale']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.box(220,140,220,60,'Trading comps','blue',{sub:'price of ONE share'}),g.box(620,140,260,60,'Precedent transactions','orange',{sub:'price of the WHOLE company'}));
    s.push(g.panel(110,240,'Minority investor',['buys a few shares','no say over strategy','pays market price'],'blue',{w:220}),g.panel(500,240,'Acquirer',['buys control','sets strategy, cuts costs,','captures synergies','pays a premium'],'orange',{w:240}));
  }else if(si===1){
    s.push(g.table(30,60,[{t:'Year',w:60,a:'l'},{t:'Target',w:150,a:'l'},{t:'Acquirer',w:170,a:'l'},{t:'EV $M',w:90},{t:'EV/EBITDA',w:110},{t:'Premium',w:100},{t:'Type',w:110,a:'l'}],DEALS.map(d=>({c:[d[0],d[1],d[2],F.n(d[3]),F.x(d[4]),F.p(d[5],0),d[6]==='S'?'strategic':'sponsor'],cc:[null,null,null,null,null,null,d[6]==='S'?'blue':'orange']})).concat([{c:['','Median','','',F.x(dmed),F.p(q(DEALS.map(d=>d[5]),.5),0),''],b:1,hi:1,top:1}]),{rh:32}));
    s.push(g.T(30,350,'Fictional deals, for illustration.',{cls:'m'}));
  }else if(si===2){
    s.push(g.T(60,60,'Premium paid over the unaffected share price',{cls:'b'}));
    s.push(g.bars(60,90,560,280,DEALS.map(d=>d[5]),{labels:DEALS.map(d=>d[1]),c:DEALS.map(d=>d[6]==='S'?'blue':'orange'),fmt:v=>F.p(v,0),max:.45,gap:20}));
    s.push(g.panel(645,100,'Pattern',['strategics (blue) pay','more: they can count','synergies','sponsors (orange) are','capped by target IRR'],'yellow',{w:200}));
  }else if(si===3){
    const P=g.plot({x:80,y:70,w:680,h:150,xr:[7,13],yr:[0,1],nx:12,ny:1});
    s.push(P.svg,g.R(P.sx(p25),P.y+10,P.sx(p75)-P.sx(p25),P.h/2-20,{fill:'var(--blue-bg)',stroke:'var(--blue)',sw:1.5,rx:5}),g.T(P.sx(p75)+8,P.y+40,'trading comps',{cls:'b',c:'blue'}));
    s.push(g.R(P.sx(d25),P.y+P.h/2+10,P.sx(d75)-P.sx(d25),P.h/2-20,{fill:'var(--orange-bg)',stroke:'var(--orange)',sw:1.5,rx:5}),g.T(P.sx(d75)+8,P.y+P.h-30,'precedents',{cls:'b',c:'orange'}));
    [7,8,9,10,11,12,13].forEach(v=>s.push(g.T(P.sx(v),P.y+P.h+16,v+'x',{a:'middle',cls:'m'})));
    s.push(g.table(80,270,[{t:'Precedents',w:160,a:'l'},{t:'EV/EBITDA',w:120},{t:'EV',w:120},{t:'Per share',w:120}],[['25th pct',d25],['Median',dmed],['75th pct',d75]].map(([l,x])=>({c:[l,F.x(x),F.m(x*C.ebitda[0]),'$'+perSh(x*C.ebitda[0]).toFixed(2)],hi:l==='Median'})),{rh:28}));
  }else{
    s.push(g.panel(80,80,'Watch out for',['2021 deals priced in a boom','cheap-debt era inflates multiples','synergies specific to one buyer','private targets disclose little','tiny sample sizes'],'red',{w:320}));
    s.push(g.panel(450,80,'Good practice',['last 3–5 years, same sector','note buyer type & deal size','use LTM EBITDA at announcement','show the premium separately','treat as a guide to what is','  possible in a sale'],'green',{w:320}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Paying for control',short:'Idea',
  b:'Trading comps price a single share. When a buyer takes over the whole company, it gains <b>control</b>: it can change strategy, cut costs and combine operations. Sellers make it pay for that privilege.\n\n<b>Precedent transactions</b> look at what buyers paid in past deals for similar companies.'},
 {k:'technique',t:'The precedents table',short:'Table',m:{md:F.x(dmed)},
  b:`Collect deals in the same sector, ideally in the last few years. For each, record the enterprise value paid, the target’s EBITDA at announcement and the premium over the share price before rumours (the <b>unaffected</b> price).\n\nMedian here: <b>${F.x(dmed)}</b> EBITDA, versus ${F.x(med)} for trading comps.`},
 {k:'insight',t:'The control premium',short:'Premium',m:{pr:F.p(q(DEALS.map(d=>d[5]),.5),0)},
  b:'Buyers typically pay 20–40% over the unaffected share price. Strategic buyers can justify more because they expect synergies; financial sponsors are limited by the return their fund must earn (module 04).'},
 {k:'solution',t:'Apply to Kopi Kita',short:'Apply',m:{rg:`$${ML.PREC.lo.toFixed(2)}–$${ML.PREC.hi.toFixed(2)}`},
  b:`Applying the 25th–75th percentile deal multiples to ${o.name}’s EBITDA gives <b>$${ML.PREC.lo.toFixed(2)} to $${ML.PREC.hi.toFixed(2)}</b> per share, clearly above the trading-comps range. The gap is the control premium.`},
 {k:'tradeoff',t:'Old deals, new markets',short:'Limits',
  b:'Each deal happened in its own market. Multiples paid when debt was cheap may not be repeatable; a single buyer’s synergies may not apply to anyone else. Precedents are a guide to what is <b>possible</b> in a sale, not a law.'}
]});
})();
