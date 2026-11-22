/* 04 · Leveraged Buyouts & Debt */
(function(){const U=ML.U,CF=ML.CF,F=CF.F,C=CF.S,o=C.o;
const M=v=>F.n(v,1),M0=v=>F.n(v,0);
const L=CF.lbo(),R=L.rows,T=L.tr,yrs=['Entry','FY26','FY27','FY28','FY29','FY30'];
const irr=(cfs)=>{let lo=-.9,hi=2;const npv=r=>cfs.reduce((a,c,t)=>a+c/Math.pow(1+r,t),0);for(let i=0;i<80;i++){const m=(lo+hi)/2;if(npv(m)>0)lo=m;else hi=m}return (lo+hi)/2};
const pubLev=o.debt/C.ebitda[0],pubCov=C.ebitda[0]/(o.debt*o.rate),lboLev=L.debt0/L.e0,lboI=T.reduce((a,t)=>a+t.amt*t.r,0),lboCov=L.e0/lboI;

/* ======================================================= capital structure */
ML.add({id:'cap-structure',title:'Capital Structure',min:11,lvl:'Intermediate',
sub:'The layers of debt and equity that fund a company, and who gets paid first when things go wrong.',
keys:'capital structure capital stack senior secured subordinated mezzanine preferred equity priority recovery absolute priority',
learn:['The capital stack from senior debt to common equity','Priority and recovery in a downside','Why riskier layers cost more','A public company vs an LBO'],
cheat:['Top of the stack (paid first): senior secured loans → senior unsecured notes → subordinated / mezzanine → preferred → common equity.','Lower in the stack = more risk = higher required return.','In a default, value flows down the stack (absolute priority) until it runs out.'],
met:[['d','Total debt','bank'],['e','Equity cheque','pie'],['ev','Enterprise value','brief']],
hero:1,
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.stack(330,50,170,380,[['Sponsor equity',L.eq0,'green'],['Senior notes (unsecured)',T[1].amt,'purple'],['Term loan B (senior secured)',T[0].amt,'blue']],{title:'LBO of Kopi Kita (sources)',fmt:v=>F.m(v)}));
    s.push(g.T(200,70,'paid first ↑',{a:'middle',cls:'b',c:'blue'}),g.T(200,420,'paid last ↓',{a:'middle',cls:'b',c:'green'}),g.L([[200,85],[200,400]],'gray',{cls:'dash thin'}));
  }else if(si===1){
    s.push(g.T(430,40,'If the business is sold for less, who gets what?',{a:'middle',cls:'b'}));
  }else if(si===2){
    const rows=[['Senior secured loan',.075,'blue'],['Senior notes',.10,'purple'],['Mezzanine',.13,'orange'],['Preferred equity',.14,'pink'],['Common equity',.22,'green']];
    s.push(g.T(60,60,'Required return by layer (illustrative)',{cls:'b'}),g.hbars(60,90,680,rows.map(r=>[r[0],r[1]]),{lw:200,rh:52,c:rows.map(r=>r[2]),fmt:v=>F.p(v,1)}));
  }else if(si===3){
    s.push(g.panel(80,80,'More debt helps…',['debt is cheaper than equity','interest is tax-deductible','smaller equity cheque →','  higher returns on it','discipline: cash must be used well'],'green',{w:330}));
    s.push(g.panel(460,80,'…until it hurts',['fixed interest must be paid','  even in a bad year','covenants restrict decisions','default can wipe out equity','less room to invest'],'red',{w:320}));
  }else{
    s.push(g.stack(200,60,150,360,[['Debt',o.debt,'blue'],['Equity (market)',C.eqv,'green']],{title:'KOPI today (public)',fmt:v=>F.m(v)}));
    s.push(g.stack(560,60,150,360,[['Debt',L.debt0,'blue'],['Equity',L.eq0,'green']],{title:'KOPI in an LBO',fmt:v=>F.m(v)}));
    s.push(g.T(275,450,`${F.p(o.debt/(o.debt+C.eqv),0)} debt`,{a:'middle',cls:'b'}),g.T(635,450,`${F.p(L.debt0/(L.debt0+L.eq0),0)} debt`,{a:'middle',cls:'b'}));
  }
  return s.join('');
},
anim(si,t,g){
  if(si!==1)return '';
  const ev=U.lerp(L.uses,400,(Math.sin(t*.7)+1)/2);let left=ev,s='';
  const parts=[['Term loan B',T[0].amt,'blue'],['Senior notes',T[1].amt,'purple'],['Equity',L.eq0,'green']];
  s+=g.pill(430,80,`Sale value ${F.m(ev)}`,'yellow',{fs:13});
  parts.forEach(([l,a,c],i)=>{const got=Math.max(0,Math.min(a,left));left-=got;const y=130+i*100,w=520;
    s+=g.T(160,y+28,l,{a:'end',cls:'b'})+g.R(175,y,w,46,{rx:6,stroke:'var(--edge)',sw:1.3,fill:'var(--bg)'})+g.R(175,y,w*got/a,46,{rx:6,fill:`color-mix(in srgb,var(--${c}) 55%,var(--mixbase))`})+g.T(185+w,y+28,`${F.p(got/a,0)} recovered`,{cls:'b'})});
  return s;
},
steps:[
 {k:'setup',t:'The capital stack',short:'The stack',m:{d:F.m(L.debt0),e:F.m(L.eq0),ev:F.m(L.ev0)},
  b:`If a sponsor buys ${o.name} for ${F.m(L.ev0)} (10.0x EBITDA), it funds the price with layers: a <b>term loan</b> secured on the company’s assets, unsecured <b>senior notes</b>, and its own <b>equity</b>.\n\nThe order of the layers is the order in which they get paid.`},
 {k:'insight',t:'Priority in a downside',short:'Priority',
  b:'If the business has to be sold or restructured, value flows down the stack: senior secured lenders are repaid first, then unsecured creditors, and equity gets whatever is left, often nothing.\n\nWatch the animation: as the sale value falls, equity is wiped out first, then the notes.',
  ch:['+ Security (collateral) and seniority both protect lenders','! Equity is the first-loss layer']},
 {k:'technique',t:'Risk sets the price',short:'Cost',
  b:'Because each layer is riskier than the one above it, it demands a higher return: about 7–8% for a secured loan, 9–11% for unsecured notes, low teens for mezzanine, and 20%+ for sponsor equity (illustrative; it moves with markets).'},
 {k:'tradeoff',t:'How much debt?',short:'Trade-off',
  b:'More debt means a smaller, cheaper-to-fund equity cheque and a bigger tax shield, so returns on equity rise. But fixed interest must be paid in bad years too. The right amount depends on how stable the cash flows are.'},
 {k:'recap',t:'Public company vs LBO',short:'Compare',
  b:`As a listed company ${o.name} is about ${F.p(o.debt/(o.debt+C.eqv),0)} debt-funded. In an LBO, debt funds about ${F.p(L.debt0/(L.debt0+L.eq0),0)} of the price. Same business, very different risk for its owners.`}
]});

/* ======================================================= leverage ratios */
ML.add({id:'leverage-ratios',title:'Leverage Ratios',min:9,lvl:'Beginner',
sub:'How many years of earnings it would take to repay the debt, and how easily interest is covered.',
keys:'leverage ratio debt ebitda net debt interest coverage deleveraging credit rating',
learn:['Total and net debt ÷ EBITDA','Interest coverage','How leverage falls in an LBO','How lenders and rating agencies read the numbers'],
cheat:['Total leverage = Total debt ÷ EBITDA. Net leverage = (Debt − cash) ÷ EBITDA.','Interest coverage = EBITDA ÷ interest expense (or (EBITDA − capex) ÷ interest).','LBOs typically start at ~4–7x and delever through EBITDA growth and debt repayment.'],
met:[['tl','Debt / EBITDA','scale'],['nl','Net debt / EBITDA','scale'],['ic','Interest cover','bolt']],
draw(si,g){
  const s=[];
  if(si===0||si===1){
    const rows=si===0?[['KOPI today',pubLev,(o.debt-o.cash)/C.ebitda[0]],['KOPI LBO',lboLev,(L.debt0-L.p.minCash)/L.e0]]:[['KOPI today',pubCov],['KOPI LBO',lboCov]];
    s.push(g.T(60,60,si===0?'Debt ÷ EBITDA: years of EBITDA to repay the debt':'Interest coverage: EBITDA ÷ interest',{cls:'b'}));
    s.push(g.bars(120,100,460,280,rows.map(r=>r[1]),{labels:rows.map(r=>r[0]),c:si===0?['blue','orange']:['green','red'],fmt:v=>F.x(v,1),gap:120,max:si===0?7:10}));
    if(si===1)s.push(g.panel(630,110,'Interest bill',[`today ${F.m(o.debt*o.rate)}`,`LBO   ${F.m(lboI)}`],'yellow',{w:190}));
    else s.push(g.panel(630,110,'Net of cash',[`today ${F.x(rows[0][2])}`,`LBO   ${F.x(rows[1][2])}`],'yellow',{w:190}));
  }else if(si===2||si===3){
    const P=g.plot({x:90,y:50,w:580,h:320,xr:[0,5],yr:[0,7],nx:5,ny:7,ticks:1,xl:'years after the buyout',yl:'x EBITDA'});
    s.push(P.svg);
    if(si===3){[[0,2,'green','≈ BBB/BB+'],[2,4,'yellow','≈ BB'],[4,6,'orange','≈ B'],[6,7,'red','≈ CCC']].forEach(([a,b,c,l])=>s.push(g.R(P.x,P.sy(b),P.w,P.sy(a)-P.sy(b),{fill:`var(--${c}-bg)`,op:.7}),g.T(P.x+P.w+8,(P.sy(a)+P.sy(b))/2+4,l,{cls:'m'})))}
    const tl=[[0,lboLev],...R.map(r=>[r.y,r.lev])],nl=[[0,(L.debt0-L.p.minCash)/L.e0],...R.map(r=>[r.y,r.netLev])];
    s.push(P.line(tl,'blue',{w:3}),P.line(nl,'purple',{w:2.4,cls:'dash'}),P.pts(tl.map(([x,y])=>({x,y,c:'blue'})),5));
    s.push(g.T(P.sx(.15),P.sy(lboLev)-10,`${F.x(lboLev)} at entry`,{cls:'b',c:'blue'}),g.T(P.sx(5)-4,P.sy(R[4].lev)-12,`${F.x(R[4].lev)} at exit`,{a:'end',cls:'b',c:'blue'}),g.T(P.sx(2.5),P.sy(R[2].netLev)+22,'net leverage',{cls:'b',c:'purple'}));
  }else{
    s.push(g.table(60,80,[{t:'Ratio',w:230,a:'l'},{t:'Formula',w:320,a:'l'},{t:'LBO entry',w:130}],[{c:['Total leverage','Debt ÷ EBITDA',F.x(lboLev)]},{c:['Net leverage','(Debt − cash) ÷ EBITDA',F.x((L.debt0-L.p.minCash)/L.e0)]},{c:['Senior secured leverage','Secured debt ÷ EBITDA',F.x(T[0].amt/L.e0)]},{c:['Interest coverage','EBITDA ÷ interest',F.x(lboCov)]},{c:['Fixed-charge coverage','(EBITDA − capex) ÷ interest',F.x((L.e0-C.capex[0])/lboI)]}],{rh:36}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Debt ÷ EBITDA',short:'Leverage',m:{tl:`${F.x(pubLev)} → ${F.x(lboLev)}`,nl:F.x((L.debt0-L.p.minCash)/L.e0)},
  b:`Leverage asks: how many years of EBITDA would repay the debt? ${o.name} today: ${F.m(o.debt)} ÷ ${F.m(C.ebitda[0])} = <b>${F.x(pubLev)}</b>. In the LBO: <b>${F.x(lboLev)}</b>.\n\n<b>Net</b> leverage subtracts cash, since cash could repay debt tomorrow.`},
 {k:'technique',t:'Interest coverage',short:'Coverage',m:{ic:`${F.x(pubCov)} → ${F.x(lboCov)}`},
  b:`Coverage asks: how many times over does EBITDA pay the interest bill? Today <b>${F.x(pubCov)}</b>; after the LBO only <b>${F.x(lboCov)}</b>. A bad year with EBITDA down 30% would leave little room.`},
 {k:'insight',t:'Deleveraging',short:'Path',
  b:`In an LBO leverage falls every year for two reasons: EBITDA grows (the denominator) and free cash flow repays debt (the numerator). ${o.name} goes from ${F.x(lboLev)} to <b>${F.x(R[4].lev)}</b> in five years.`,
  ch:['+ Both levers matter: growth and repayment']},
 {k:'insight',t:'How lenders read it',short:'Ratings',
  b:'Rating agencies and lenders map leverage (alongside size, margins and stability) onto credit quality. The bands shown are a rough rule of thumb only; agencies publish their own sector methodologies.'},
 {k:'recap',t:'The ratio toolkit',short:'Toolkit',
  b:'Leverage and coverage ratios appear in every credit memo, rating report and loan agreement. They are also the basis of the covenants in the next lesson.'}
]});

/* ======================================================= covenants */
const cov=[6.25,5.5,5.0,4.5,4.0],LD=CF.lbo({case:{marg:[.20,.17,.15,.15,.16,.17]}});
ML.add({id:'covenants',title:'Covenants',min:10,lvl:'Intermediate',
sub:'The promises a borrower makes to its lenders, and what happens when it breaks them.',
keys:'covenants maintenance incurrence leverage test headroom cushion breach waiver equity cure covenant lite',
learn:['Maintenance vs incurrence covenants','Testing leverage against a step-down','Headroom in base and downside cases','What happens after a breach'],
cheat:['Maintenance covenants: tested regularly (usually quarterly), e.g. Net debt / EBITDA ≤ 5.0x.','Incurrence covenants: only tested when the company takes an action (borrow more, pay dividends, sell assets).','Headroom (cushion) = how far EBITDA can fall before a breach. Breach → waiver, amendment fee, equity cure, or default.','“Cov-lite” term loans have no maintenance tests (revolvers may have a springing one).'],
met:[['hd','FY26 headroom','scale'],['br','Downside breach','alert']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.box(220,120,300,60,'Maintenance','blue',{sub:'tested every quarter, no matter what',hot:1}),g.box(640,120,280,60,'Incurrence','orange',{sub:'tested only when you act',hot:1}));
    s.push(g.panel(90,210,'e.g.',['Net leverage ≤ 5.0x','Interest cover ≥ 2.0x','Capex ≤ $80M a year'],'blue',{w:260}),g.panel(510,210,'e.g. you may only…',['borrow more if leverage','  stays below 4.5x after','pay dividends from a basket','sell assets if proceeds','  repay debt'],'orange',{w:260}));
  }else if(si===1||si===2){
    const P=g.plot({x:90,y:50,w:590,h:320,xr:[.5,5.5],yr:[2,7],nx:5,ny:5,xl:'year',yl:'net debt / EBITDA'});
    s.push(P.svg,P.line(cov.map((v,i)=>[i+1,v]),'red',{w:3,cls:'dash'}),g.T(P.sx(1.05),P.sy(cov[0])-10,'covenant maximum',{cls:'b',c:'red'}));
    s.push(P.line(R.map(r=>[r.y,r.netLev]),'blue',{w:3}),P.pts(R.map(r=>({x:r.y,y:r.netLev,c:'blue'})),5));
    if(si===2){s.push(P.line(LD.rows.map(r=>[r.y,r.netLev]),'orange',{w:3}),P.pts(LD.rows.map((r,i)=>({x:r.y,y:r.netLev,c:r.netLev>cov[i]?'red':'orange',r:r.netLev>cov[i]?8:5})),5),g.T(P.sx(2.1),P.sy(LD.rows[1].netLev)-14,'downside: breach!',{cls:'b',c:'red'}))}
    s.push(g.T(P.sx(4.5),P.sy(R[3].netLev)+24,'base case',{cls:'b',c:'blue'}));
    [1,2,3,4,5].forEach(y=>s.push(g.T(P.sx(y),P.y+P.h+15,'FY'+(25+y),{a:'middle',cls:'m'})));
    [2,3,4,5,6,7].forEach(v=>s.push(g.T(P.x-8,P.sy(v)+4,v+'x',{a:'end',cls:'m'})));
    s.push(g.panel(695,60,'FY26 headroom',[`base ${F.p(1-R[0].netLev/cov[0],0)}`,`down ${F.p(1-LD.rows[0].netLev/cov[0],0)}`],'blue',{w:150}));
  }else if(si===3){
    s.push(g.table(80,80,[{t:'Typical negative covenants',w:300,a:'l'},{t:'Why lenders want it',w:380,a:'l'}],[{c:['Limit on new debt','keep their claim from being diluted']},{c:['Restricted payments','stop cash leaking to shareholders']},{c:['Limit on liens','keep the collateral for themselves']},{c:['Asset sale sweep','sale proceeds repay debt first']},{c:['Change of control','right to be repaid if company is sold']}],{rh:38}));
  }else{
    s.push(g.timeline(100,170,660,[['Breach','test fails'],['Notice','to lenders'],['Options','waiver / amend / cure'],['If not fixed','event of default'],['Acceleration','loans due now']],{on:2,done:2,c:'red'}));
    s.push(g.panel(150,290,'Common fixes',['waiver or amendment (plus a fee and higher margin)','equity cure: sponsor injects cash that counts as EBITDA','reset the covenant levels'],'yellow',{w:560}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Two kinds of promise',short:'Types',
  b:'Lenders protect themselves with <b>covenants</b>. <b>Maintenance</b> covenants are tested on a schedule, usually quarterly, whatever the company does. <b>Incurrence</b> covenants only bite when the company tries to do something, like borrow more or pay a dividend.'},
 {k:'technique',t:'The leverage test',short:'Base case',m:{hd:F.p(1-R[0].netLev/cov[0],0)},
  b:`The loan says net leverage must stay below a maximum that <b>steps down</b> each year, forcing the company to delever. In the base case ${o.name} passes with room to spare: EBITDA could fall about <b>${F.p(1-R[0].netLev/cov[0],0)}</b> in FY26 before a breach.`},
 {k:'problem',t:'A bad year',short:'Downside',m:{br:'FY27'},
  b:`Now imagine margins drop to 15% (a price war on coffee). EBITDA falls, free cash flow dries up, and leverage <b>rises</b> to ${F.x(LD.rows[1].netLev)} in FY27, above the ${F.x(cov[1])} limit. The company is in breach even though it can still pay its interest.`,
  ch:['! That is the point: maintenance tests are an early warning']},
 {k:'technique',t:'Negative covenants',short:'Negative',
  b:'Most covenants say what the company may <b>not</b> do without permission: take on more debt, pay out cash, pledge assets to someone else. High-yield bonds and “cov-lite” loans rely mostly on these.'},
 {k:'solution',t:'After a breach',short:'Breach',
  b:'A breach does not mean bankruptcy. Usually the company negotiates a waiver or amendment (paying a fee and a higher interest rate), or the sponsor makes an <b>equity cure</b>. If nothing is agreed, lenders can declare a default and demand repayment.'}
]});

/* ======================================================= LBO */
ML.add({id:'lbo',title:'The Leveraged Buyout',min:14,lvl:'Advanced',
sub:'Buy a company mostly with borrowed money, repay the debt from its cash flow, sell it a few years later.',
keys:'lbo leveraged buyout sources uses debt schedule cash sweep exit private equity model',
learn:['The house-with-a-mortgage intuition','Sources and uses','The debt schedule and cash sweep','Exit value and equity returns'],
cheat:['Uses = purchase EV + fees + minimum cash. Sources = debt tranches + sponsor equity.','Each year: EBITDA − interest − taxes − capex − ΔNWC = FCF → repays debt (sweep).','Exit equity = exit multiple × EBITDA − net debt. Returns: MOIC and IRR.','Good targets: stable cash flow, low capex, room for improvement, sellable later.'],
met:[['ev','Purchase EV','brief'],['eq','Equity in','pie'],['dt','Debt at exit','bank'],['out','Equity out','dollar']],
hero:2,
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.stack(170,80,140,320,[['Mortgage $400k',400,'orange'],['Your cash $100k',100,'green']],{title:'Buy a $500k house',total:650,fmt:v=>'$'+v+'k'}));
    s.push(g.stack(580,80,140,320,[['Mortgage left $300k',300,'orange'],['Your equity $350k',350,'green']],{title:'Sell for $650k later',total:650,fmt:v=>'$'+v+'k'}));
    s.push(g.A(330,110,480,110,{l:'rent repays debt',lt:'yellow'}),g.T(430,450,'$100k became $350k: 3.5x your money.',{a:'middle',cls:'b'}));
  }else if(si===1){
    s.push(g.table(40,60,[{t:'Uses',w:200,a:'l'},{t:'$M',w:90}],[{c:['Purchase EV (10.0x)',M0(L.ev0)]},{c:['Fees & expenses',M0(L.fees)]},{c:['Minimum cash',M0(L.p.minCash)]},{c:['Total uses',M0(L.uses)],b:1,hi:1,top:1}],{rh:32}));
    s.push(g.table(380,60,[{t:'Sources',w:240,a:'l'},{t:'$M',w:80},{t:'x EBITDA',w:100}],[...T.map(t=>({c:[t.n+' @ '+F.p(t.r,1),M0(t.amt),F.x(t.x)]})),{c:['Sponsor equity',M0(L.eq0),F.x(L.eq0/L.e0)],cc:[null,'green',null]},{c:['Total sources',M0(L.uses),F.x(L.uses/L.e0)],b:1,hi:1,top:1}],{rh:32}));
    s.push(g.T(40,280,`Equity funds ${F.p(L.eq0/L.uses,0)} of the price; debt the other ${F.p(1-L.eq0/L.uses,0)}.`,{cls:'b'}));
    s.push(g.T(40,300,'Uses must equal sources: every dollar spent is a dollar raised.',{cls:'m'}));
  }else if(si===2){
    const x0=90,bw=82,gp=36,h=320,y0=70,mx=L.debt0*1.08;
    [[L.debt0,T.map(t=>t.amt)],...R.map(r=>[r.debt,r.bal])].forEach(([d,b],i)=>{const x=x0+i*(bw+gp);let y=y0+h;b.forEach((v,j)=>{const ph=v/mx*h;y-=ph;s.push(g.R(x,y,bw,ph,{fill:`color-mix(in srgb,var(--${j?'purple':'blue'}) 50%,var(--mixbase))`,stroke:'var(--edge)',sw:1.2}))});s.push(g.T(x+bw/2,y-6,M0(d),{a:'middle',cls:'b'}),g.T(x+bw/2,y0+h+16,yrs[i],{a:'middle',cls:'m'}))});
    s.push(g.R(640,30,12,12,{fill:'var(--blue)'}),g.T(658,40,'term loan (repaid first)',{cls:'m'}),g.R(640,50,12,12,{fill:'var(--purple)'}),g.T(658,60,'senior notes',{cls:'m'}));
  }else if(si===3){
    const cols=[{t:'$M',w:200,a:'l'},...R.map((_,i)=>({t:yrs[i+1],w:108}))];
    const r=(l,f,o2={})=>({c:[l,...R.map(f)],...o2});
    s.push(g.table(40,50,cols,[r('EBITDA',x=>M(x.ebitda)),r('− Interest',x=>M(-x.I)),r('− Taxes',x=>M(-(C.ebit[x.y]-x.I)*o.tax)),r('− Capex',x=>M(-C.capex[x.y])),r('− ΔNWC',x=>M(-C.dnwc[x.y])),r('Free cash flow',x=>M(x.fcf),{b:1,top:1}),r('Debt repaid',x=>M(x.pay.reduce((a,b)=>a+b,0)),{tone:'green'}),r('Debt outstanding',x=>M(x.debt),{b:1}),r('Debt / EBITDA',x=>F.x(x.lev))],{rh:30}));
  }else if(si===4){
    s.push(g.wf(60,60,540,320,[['Exit EV\n'+F.x(L.p.exitX)+' FY30',L.ev5,'t'],['− Debt',-R[4].debt],['+ Cash',R[4].cash],['Equity\nat exit',L.eq5,'t']],{fmt:v=>F.n(v,0),gap:40}));
    s.push(g.panel(640,80,'Returns',[`in   ${F.m(L.eq0)}`,`out  ${F.m(L.eq5)}`,'',`MOIC ${F.x(L.moic,2)}`,`IRR  ${F.p(L.irr)}`],'green',{w:190}));
  }else{
    s.push(g.panel(80,70,'Good LBO candidates',['steady, predictable cash flow','low capex needs','strong market position','costs that can be improved','clear exit route','assets lenders can secure'],'green',{w:330}));
    s.push(g.panel(460,70,'Bad ones',['cyclical or volatile earnings','heavy capex (airlines, chips)','fast-changing technology','already highly levered','no obvious buyer later'],'red',{w:320}));
  }
  return s.join('');
},
anim(si,t,g,ord){if(si===0)return g.dot(330,110,480,110,(t%2.5)/2.5,'yellow');if(si===2){const i=ord>=0?ord:0;return g.R(90+i*118-5,60,92,350,{rx:6,stroke:'var(--edge)',dash:'4 4',sw:1.5})}return ''},
steps:[
 {k:'setup',t:'A house with a mortgage',short:'Intuition',
  b:'Buy a $500k house with $100k of your own and a $400k mortgage. Rent covers the payments, so the mortgage shrinks. Sell it later for $650k: after repaying the remaining $300k you have $350k, <b>3.5x</b> your money, though the house only rose 30%.\n\nThat is a leveraged buyout.'},
 {k:'technique',t:'Sources and uses',short:'S&U',m:{ev:F.m(L.ev0),eq:F.m(L.eq0)},
  b:`A sponsor buys ${o.name} at ${F.x(L.p.entryX)} FY25 EBITDA = ${F.m(L.ev0)}, plus ${F.m(L.fees)} of fees and some cash to run the business. It borrows ${F.m(L.debt0)} (${F.x(L.debt0/L.e0)} EBITDA) and writes an equity cheque of <b>${F.m(L.eq0)}</b>.`},
 {k:'technique',t:'Repay debt from cash flow',short:'Paydown',m:{dt:F.m(R[4].debt)},
  b:`Every year, free cash flow after interest and tax goes to repay debt, starting with the prepayable term loan (a <b>cash sweep</b>). Debt falls from ${F.m(L.debt0)} to <b>${F.m(R[4].debt)}</b> by FY30.`,
  n:['Entry: debt at its peak','FY26 cash flow repays debt','FY27','FY28','FY29','FY30: much less debt']},
 {k:'math',t:'The debt schedule',short:'Schedule',
  b:'The engine of the model: EBITDA minus interest, taxes, capex and working capital gives the cash available to repay debt. Interest falls as debt falls, so more cash is left the next year: a virtuous circle.'},
 {k:'solution',t:'Exit and returns',short:'Exit',m:{out:F.m(L.eq5)},
  b:`Sell in FY30 at ${F.x(L.p.exitX)} EBITDA: ${F.m(L.ev5)}. Repay the remaining debt and the sponsor keeps <b>${F.m(L.eq5)}</b>: <b>${F.x(L.moic,2)}</b> its money, an IRR of <b>${F.p(L.irr)}</b>. The next two lessons take that apart.`},
 {k:'recap',t:'What makes a good LBO',short:'Candidates',
  b:'Debt needs predictable cash to service it. That is why sponsors love steady businesses with low capex, like a mature coffee chain, and avoid cyclical, capital-hungry ones.'}
]});

/* ======================================================= return drivers */
const A=L.attr,Lx9=CF.lbo({exitX:9});
const sens=(()=>{const E=[9,9.5,10,10.5,11],X=[9,9.5,10,10.5,11];return {E,X,M:E.map(e=>X.map(x=>CF.lbo({entryX:e,exitX:x}).irr))}})();
ML.add({id:'return-drivers',title:'LBO Return Drivers',min:11,lvl:'Advanced',
sub:'Where private equity returns really come from: EBITDA growth, debt paydown and multiple expansion.',
keys:'return drivers value creation bridge ebitda growth multiple expansion deleveraging debt paydown attribution',
learn:['The equity value bridge from entry to exit','EBITDA growth: the operational driver','Debt paydown: the financial driver','Multiple expansion: the market driver, and its risk'],
cheat:['Equity gain = EBITDA growth × entry multiple + (exit − entry multiple) × exit EBITDA + net debt reduction − fees.','Durable returns come from EBITDA growth and paydown; multiple expansion is largely market timing.','Always sensitise IRR to entry and exit multiples.'],
met:[['gr','EBITDA growth','trend'],['pd','Debt paydown','bank'],['mx','Multiple exp.','chart']],
hero:0,
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.wf(40,60,780,320,[['Equity\nin',L.eq0,'t'],['EBITDA\ngrowth',A.growth],['Multiple\nexpansion',A.multiple],['Debt\npaydown',A.paydown],['Fees',A.fees],['Equity\nout',L.eq5,'t']],{fmt:v=>F.n(v,0),gap:24}));
  }else if(si===1){
    s.push(g.bars(80,80,420,300,C.ebitda,{labels:C.yrs,c:'green',fmt:v=>F.n(v,0),gap:14}));
    s.push(g.panel(540,90,'EBITDA growth',[`${F.m(L.e0)} → ${F.m(L.e5,1)}`,'revenue growth + margin','',`× entry ${F.x(L.p.entryX)}`,`= ${F.m(A.growth)} of value`],'green',{w:270}));
  }else if(si===2){
    const d=[L.nd0,...R.map(r=>r.debt-r.cash)];
    s.push(g.bars(80,80,460,300,d,{labels:yrs,c:'blue',fmt:v=>F.n(v,0),gap:14}));
    s.push(g.panel(580,90,'Debt paydown',['cash flow transfers value','from lenders to owners',`net debt −${F.m(A.paydown)}`],'blue',{w:240}));
  }else if(si===3){
    s.push(g.table(80,80,[{t:'',w:240,a:'l'},{t:`exit ${F.x(L.p.exitX)}`,w:160},{t:'exit 9.0x',w:160}],[{c:['Exit EV',F.m(L.ev5),F.m(Lx9.ev5)]},{c:['Equity out',F.m(L.eq5),F.m(Lx9.eq5)]},{c:['MOIC',F.x(L.moic,2),F.x(Lx9.moic,2)],b:1},{c:['IRR',F.p(L.irr),F.p(Lx9.irr)],b:1,hi:1}],{rh:36}));
    s.push(g.T(80,280,`Buying at ${F.x(L.p.entryX)} and selling at 9.0x (multiple contraction) cuts the IRR by ${F.p(L.irr-Lx9.irr)}.`,{cls:'b',c:'red'}));
  }else{
    const v=[].concat(...sens.M);
    s.push(g.T(430,60,'IRR: entry multiple (rows) × exit multiple (columns)',{a:'middle',cls:'b'}));
    s.push(g.heat(270,105,sens.M,{cs:64,min:Math.min(...v),max:Math.max(...v),cf:x=>x>=.2?'green':x>=.15?'yellow':'red',fmt:x=>F.p(x,0),rows:sens.E.map(e=>F.x(e)),cols:sens.X.map(x=>F.x(x)),hi:[2,3]}));
    s.push(g.T(430,85,'exit multiple →',{a:'middle',cls:'m'}),g.T(190,250,'entry ↓',{a:'middle',cls:'m'}));
  }
  return s.join('');
},
anim(si,t,g){if(si===0){const n=6,i=Math.floor(t/1.1)%n,bw=(780-24*5)/6;return g.R(40+i*(bw+24)-4,48,bw+8,350,{rx:6,stroke:'var(--edge)',dash:'4 4',sw:1.5})}return ''},
steps:[
 {k:'setup',t:'The equity bridge',short:'Bridge',m:{gr:F.m(A.growth),pd:F.m(A.paydown),mx:F.m(A.multiple)},
  b:`The sponsor put in ${F.m(L.eq0)} and takes out ${F.m(L.eq5)}. Where did the ${F.m(L.eq5-L.eq0)} gain come from? Three drivers, minus the fees paid on day one.`,
  n:['Equity invested at entry','+ EBITDA growth','+ multiple expansion','+ debt paydown','− transaction fees','= equity at exit']},
 {k:'technique',t:'EBITDA growth',short:'Growth',
  b:`Grow EBITDA from ${F.m(L.e0)} to ${F.m(L.e5,1)} through new stores and better margins, and at the same multiple the business is worth ${F.m(A.growth)} more. This is the driver sponsors control most and LPs value most.`},
 {k:'technique',t:'Debt paydown',short:'Paydown',
  b:`Free cash flow repays debt, so more of the enterprise value belongs to the owners each year: <b>${F.m(A.paydown)}</b> of the gain. It needs no improvement at all, just steady cash flow, which is why leverage amplifies returns.`},
 {k:'tradeoff',t:'Multiple expansion',short:'Multiple',
  b:`Selling at ${F.x(L.p.exitX)} instead of ${F.x(L.p.entryX)} adds ${F.m(A.multiple)}. But exit multiples depend on markets five years from now. Underwrite flat or lower exit multiples, or the deal only works if markets cooperate.`},
 {k:'insight',t:'Sensitivity',short:'Sensitivity',
  b:'Each turn of entry or exit multiple moves the IRR by several points. Investment committees always see this table; a deal that needs the top-right corner is a deal that needs luck.'}
]});

/* ======================================================= MOIC & IRR */
const yrsHold=[3,4,5,6,7];
const recap=(()=>{const div=300,cf=[-L.eq0,0,div,0,0,L.eq5-div*Math.pow(1.075,3)];return {cf,moic:(div+cf[5])/L.eq0,irr:irr(cf)}})();
ML.add({id:'moic',title:'MOIC & IRR',min:10,lvl:'Intermediate',
sub:'How many times your money, and how fast: the two numbers every private equity deal is judged by.',
keys:'moic multiple on invested capital irr internal rate of return holding period dividend recap dpi',
learn:['MOIC: total out ÷ total in','IRR: the annualised return','Why time changes everything','Gaming IRR with early distributions'],
cheat:['MOIC = total cash returned ÷ total cash invested (2.5x: $100M → $250M).','IRR = the discount rate that makes NPV of all cash flows zero. For one in, one out: MOIC^(1/years) − 1.','Same MOIC faster → higher IRR. Early dividends (recaps) lift IRR more than MOIC.','LPs track both, plus DPI (cash actually distributed ÷ paid in).'],
met:[['m','MOIC','repeat'],['i','IRR','trend'],['y','Years held','clock']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.bars(220,90,340,300,[L.eq0,L.eq5],{labels:['invested','returned'],c:['gray','green'],fmt:v=>F.m(v),gap:80}));
    s.push(g.pill(390,50,`MOIC = ${F.m(L.eq5)} ÷ ${F.m(L.eq0)} = ${F.x(L.moic,2)}`,'green',{fs:13}));
  }else if(si===1){
    const P=g.plot({x:90,y:50,w:540,h:320,xr:[2,8],yr:[0,.5],nx:6,ny:5,ticks:1,xl:'years held',yl:'IRR'});
    s.push(P.svg,P.fn(y=>Math.pow(L.moic,1/y)-1,'green',{w:3}),P.fn(y=>Math.pow(2,1/y)-1,'gray',{cls:'dash'}),P.fn(y=>Math.pow(3,1/y)-1,'blue',{cls:'dash'}));
    s.push(g.C(P.sx(5),P.sy(L.irr),7,'green',{cls:'big'}),g.T(P.sx(5)+10,P.sy(L.irr)-10,`${F.x(L.moic,2)} in 5 yrs = ${F.p(L.irr)}`,{cls:'b',c:'green'}),g.T(P.sx(7.9),P.sy(Math.pow(3,1/7.9)-1)-8,'3.0x',{a:'end',cls:'b',c:'blue'}),g.T(P.sx(7.9),P.sy(Math.pow(2,1/7.9)-1)+16,'2.0x',{a:'end',cls:'b',c:'gray'}));
    s.push(g.panel(650,70,'One in, one out',['IRR = MOIC^(1/n) − 1'],'green',{w:195}));
  }else if(si===2){
    s.push(g.table(120,80,[{t:'Exit after',w:150,a:'l'},{t:'MOIC',w:150},{t:'IRR',w:150}],yrsHold.map(y=>({c:[y+' years',F.x(L.moic,2),F.p(Math.pow(L.moic,1/y)-1)],hi:y===5})),{rh:36}));
    s.push(g.T(120,330,'Same multiple, very different annual return. Time is the enemy of IRR.',{cls:'b'}));
  }else if(si===3){
    const plain=[-L.eq0,0,0,0,0,L.eq5];
    const bar=(cf,y0,c)=>cf.map((v,i)=>{const x=100+i*105,h=Math.abs(v)/L.eq5*100;return g.R(x,v<0?y0:y0-h,60,h,{fill:`color-mix(in srgb,var(--${v<0?'red':c}) 50%,var(--mixbase))`,stroke:v?'var(--edge)':'none',sw:1.2})+(v?g.T(x+30,v<0?y0+h+14:y0-h-5,F.n(v,0),{a:'middle',cls:'b'}):'')+g.T(x+30,y0+4+(v<0?0:14),'Y'+i,{a:'middle',cls:'m'})}).join('');
    s.push(g.T(60,40,'A: hold and sell',{cls:'b'}),bar(plain,160,'green'),g.T(810,100,`MOIC ${F.x(L.moic,2)}`,{a:'end',cls:'b'}),g.T(810,118,`IRR ${F.p(irr(plain))}`,{a:'end',cls:'b'}));
    s.push(g.T(60,250,'B: dividend recap in year 2',{cls:'b'}),bar(recap.cf,380,'blue'),g.T(810,320,`MOIC ${F.x(recap.moic,2)}`,{a:'end',cls:'b'}),g.T(810,338,`IRR ${F.p(recap.irr)}`,{a:'end',cls:'b'}));
  }else{
    s.push(g.panel(80,80,'MOIC tells you',['how much money was made','not how long it took'],'green',{w:300}),g.panel(450,80,'IRR tells you',['how fast it was made','not how much (a 2-week','  flip can show 100% IRR)'],'blue',{w:300}));
    s.push(g.T(430,280,'Funds report both, plus DPI: cash actually returned to LPs ÷ cash they paid in.',{a:'middle',cls:'b'}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Multiple on invested capital',short:'MOIC',m:{m:F.x(L.moic,2),y:'5'},
  b:`MOIC is the simplest scorecard: cash out ÷ cash in. Our sponsor invested ${F.m(L.eq0)} and received ${F.m(L.eq5)}: <b>${F.x(L.moic,2)}</b>.`},
 {k:'math',t:'Internal rate of return',short:'IRR',m:{i:F.p(L.irr)},
  b:`IRR turns the gain into an annual rate: the discount rate at which the cash flows’ net present value is zero. With one investment and one exit, IRR = MOIC^(1/years) − 1 = <b>${F.p(L.irr)}</b> over five years.`},
 {k:'insight',t:'Time changes everything',short:'Time',
  b:`The same ${F.x(L.moic,2)} is ${F.p(Math.pow(L.moic,1/3)-1)} a year over three years but only ${F.p(Math.pow(L.moic,1/7)-1)} over seven. Sponsors with an IRR target are always racing the clock.`},
 {k:'tradeoff',t:'Gaming IRR',short:'Recaps',m:{i:`${F.p(L.irr)} → ${F.p(recap.irr)}`},
  b:`A <b>dividend recap</b> borrows $300M in year 2 to pay the sponsor early; the extra debt plus interest is repaid at exit. Getting cash sooner lifts IRR to <b>${F.p(recap.irr)}</b> while MOIC <b>falls</b> to ${F.x(recap.moic,2)} (the interest is a real cost). That is why LPs look at both numbers.`},
 {k:'recap',t:'Read them together',short:'Recap',
  b:'MOIC measures size, IRR measures speed. A great deal has both; a quick flip has high IRR and low MOIC; a long hold can have the opposite.'}
]});
})();
