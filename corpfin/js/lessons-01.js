/* 01 · Accounting & Financial Statements */
(function(){const U=ML.U,CF=ML.CF,F=CF.F,C=CF.S,o=C.o;
const M=v=>F.n(v,1),M0=v=>F.n(v,0);
const col2=[{t:'$M',w:200,a:'l'},{t:'FY26E',w:90}];

/* ======================================================= three statements */
ML.add({id:'three-statements',title:'The Three Statements',min:12,lvl:'Beginner',
sub:'Income statement, balance sheet and cash flow statement: three views of one company, wired together.',
keys:'income statement balance sheet cash flow statement linking model net income retained earnings',
learn:['What each statement answers','How net income flows into the other two','Why the balance sheet must balance','The classic “depreciation goes up by $10” test'],
cheat:['<b>IS</b>: performance over a period. <b>BS</b>: snapshot at a date. <b>CFS</b>: where cash came from and went.','Net income → top of CFS and → retained earnings on the BS.','Ending cash on the CFS = cash on the BS. Assets = Liabilities + Equity, always.'],
met:[['ni','Net income','trend'],['cash','Change in cash','dollar'],['chk','Balance check','check']],
hero:4,
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.docu(150,230,190,250,'Income Statement','green'),g.docu(430,230,190,250,'Balance Sheet','blue'),g.docu(710,230,190,250,'Cash Flow Stmt','orange'));
    s.push(g.T(150,385,'“Did we make money',{a:'middle',cls:'b'}),g.T(150,400,'over the year?”',{a:'middle',cls:'b'}));
    s.push(g.T(430,385,'“What do we own and',{a:'middle',cls:'b'}),g.T(430,400,'owe on Dec 31?”',{a:'middle',cls:'b'}));
    s.push(g.T(710,385,'“Where did the cash',{a:'middle',cls:'b'}),g.T(710,400,'actually go?”',{a:'middle',cls:'b'}));
    s.push(g.pill(150,80,'a movie: a period','green'),g.pill(430,80,'a photo: one date','blue'),g.pill(710,80,'a movie: a period','orange'));
    s.push(g.T(430,450,`Our company all course: ${o.name}, a coffee chain with ${F.m(o.rev0)} of revenue.`,{a:'middle',cls:'m'}));
  }else if(si===1){
    const r=[['Revenue',C.rev[1]],['Cost of goods sold',-(C.rev[1]-C.gp[1])],['Gross profit',C.gp[1],1],['Operating expenses (SG&A)',-C.opex[1]],['EBITDA',C.ebitda[1],1],['Depreciation & amortisation',-C.da[1]],['EBIT (operating income)',C.ebit[1],1],['Interest expense',-C.interest],['Pre-tax income',C.ebt1,1],[`Taxes @ ${F.p(o.tax,0)}`,-C.tax1],['Net income',C.ni1,2]];
    s.push(g.table(60,40,col2,r.map(([l,v,b])=>({c:[l,M(v)],b:!!b,hi:b===2,sep:b===1}))));
    s.push(g.panel(400,60,'Read it top to bottom',['revenue: what customers paid','  − costs to make the coffee','  − costs to run the company','  − wear on the machines (D&A)','  − lenders (interest)','  − government (tax)',`= what is left for owners: ${F.m(C.ni1,1)}`],'green',{w:330}));
    s.push(g.T(400,290,'Accrual accounting: revenue is recorded when the',{cls:'m'}),g.T(400,306,'coffee is sold, not when the cash arrives. That gap',{cls:'m'}),g.T(400,322,'is why we need a cash flow statement.',{cls:'m'}));
  }else if(si===2){
    const r=[['Net income',C.ni1,0,'green'],['+ D&A (non-cash)',C.da[1]],['− Increase in working capital',-C.dnwc[1]],['Cash from operations',C.cfo,1],['− Capital expenditure',C.cfi],['Cash from investing',C.cfi,1],['− Debt repayment',C.cff],['Cash from financing',C.cff,1],['Net change in cash',C.dcash,2]];
    s.push(g.table(60,50,[{t:'$M',w:230,a:'l'},{t:'FY26E',w:90}],r.map(([l,v,b,t])=>({c:[l,M(v)],b:!!b,hi:b===2,sep:b===1,tone:t}))));
    s.push(g.bars(470,90,320,260,[C.cfo,-C.cfi,-C.cff,C.dcash],{labels:['CFO','capex','debt','Δ cash'],c:['green','red','red','blue'],fmt:v=>F.n(v,0),gap:24,max:C.cfo*1.1}));
    s.push(g.T(470,70,'Three buckets of cash',{cls:'b'}));
  }else if(si===3){
    const b0=C.bs0,b1=C.bs1;const r=[['Cash',b0.cash,b1.cash],['Receivables + inventory',b0.ca,b1.ca],['PP&E (net)',b0.ppe,b1.ppe],['Goodwill',b0.gw,b1.gw],['Total assets',b0.A,b1.A,1],['Accounts payable',b0.ap,b1.ap],['Debt',b0.debt,b1.debt],['Preferred stock',b0.pref,b1.pref],['Minority interest',b0.nci,b1.nci],["Shareholders' equity",b0.eq,b1.eq],['Total liabilities + equity',b0.L,b1.L,1]];
    s.push(g.table(60,30,[{t:'$M',w:230,a:'l'},{t:'FY25A',w:85},{t:'FY26E',w:85}],r.map(([l,a,b,t])=>({c:[l,M(a),M(b)],b:!!t,hi:!!t,tone:t?'blue':null,sep:l==='Accounts payable'}))));
    s.push(g.panel(500,70,'The accounting equation',['Assets = Liabilities + Equity','','what the company owns must','have been paid for by someone:','lenders or owners.',`→ ${M(b1.A)} = ${M(b1.L)} ✓`],'blue',{w:290}));
  }else if(si===4){
    const P={is:[130,110],cf:[430,110],bs:[730,110]};
    s.push(g.box(130,90,190,52,'Income Statement','green'),g.box(430,90,190,52,'Cash Flow Stmt','orange'),g.box(730,90,190,52,'Balance Sheet','blue'));
    const rows=[[130,190,'Net income',M(C.ni1),'green'],[130,250,'D&A',M(C.da[1]),'green'],[430,190,'starts with NI',M(C.ni1),'orange'],[430,250,'+ D&A',M(C.da[1]),'orange'],[430,310,'− ΔNWC, − capex, − debt',M(C.dnwc[1]+C.capex[1]+o.amort),'orange'],[430,370,'= Δ cash',M(C.dcash),'orange'],[730,190,'Retained earnings ↑',M(C.ni1),'blue'],[730,250,'PP&E: + capex − D&A',M(C.capex[1]-C.da[1]),'blue'],[730,310,'NWC & debt change',M(C.dnwc[1])+' / '+M(-o.amort),'blue'],[730,370,'Cash',M(C.bs1.cash),'blue']];
    rows.forEach(([x,y,l,v,c])=>s.push(g.box(x,y,200,40,l,c,{flat:1,sub:v,fs:11})));
    s.push(this.links.map(([a,b,c,cv],i)=>`<g class="lk" data-i="${i}">${g.A(a[0],a[1],b[0],b[1],{c,curve:cv||0,op:.35})}</g>`).join(''));
  }else{
    const cols=[['Income statement','green',['D&A +10','EBIT −10','Tax −2.5 (25%)','Net income −7.5']],['Cash flow statement','orange',['NI −7.5','add back D&A +10','= cash +2.5']],['Balance sheet','blue',['Cash +2.5','PP&E −10','Assets −7.5','Equity −7.5 → balances']]];
    cols.forEach(([t,c,l],i)=>{const x=150+i*280;s.push(g.box(x,110,220,50,t,c,{hot:1}));l.forEach((q,j)=>s.push(g.box(x,180+j*52,220,40,q,c,{flat:1,fs:11})))});
    s.push(g.T(430,440,'Every change must hit at least two statements and leave the balance sheet balanced.',{a:'middle',cls:'b'}));
  }
  return s.join('');
},
links:[[[230,190],[330,190],'green'],[[230,250],[330,250],'green'],[[530,370],[630,370],'orange'],[[230,190],[630,190],'green',-60],[[530,310],[630,310],'orange'],[[530,250],[630,250],'orange']],
anim(si,t,g,ord,k){
  if(si===0){const p=(t%3)/3;return g.dot(245,230,335,230,p,'green')+g.dot(525,230,615,230,p,'orange')}
  if(si===4&&ord>=0){const L=this.links[Math.min(ord,this.links.length-1)];return `<g>${g.A(L[0][0],L[0][1],L[1][0],L[1][1],{c:L[2],curve:L[3]||0,w:3})}${g.dot(L[0][0],L[0][1],L[1][0],L[1][1],k,L[2],{curve:L[3]||0,r:6})}</g>`}
  return '';
},
steps:[
 {k:'setup',t:'Three views of one business',short:'Three views',m:{chk:'—'},
  b:`Every company reports three statements. The <b>income statement</b> covers a period and asks whether we made a profit. The <b>balance sheet</b> is a snapshot on one date: what we own and what we owe. The <b>cash flow statement</b> covers the same period as the income statement and tracks real cash.\n\nThroughout this course we follow one fictional company, <b>${o.name}</b>. Every number on screen comes from the same live model.`},
 {k:'technique',t:'Income statement: did we make money?',short:'Income stmt',m:{ni:F.m(C.ni1,1)},
  b:`Start with revenue of <b>${F.m(C.rev[1],1)}</b> and subtract costs in layers. Each subtotal (gross profit, EBITDA, EBIT) answers a slightly different question, which is why analysts quote all of them.\n\nThe bottom line, <b>net income</b>, is profit that belongs to shareholders.`,
  ch:['+ Subtotals strip out one more layer of cost each','! Profit is not cash: sales on credit count as revenue today']},
 {k:'technique',t:'Cash flow statement: where did the cash go?',short:'Cash flow',m:{cash:F.m(C.dcash,1)},
  b:`Start from net income and undo the non-cash items: add back D&A (no cash left the building), subtract the cash tied up in growing working capital.\n\nThen subtract investments (capex) and financing flows (repaying ${F.m(o.amort)} of debt). What is left is the change in cash: <b>${F.m(C.dcash,1)}</b>.`,
  ch:['+ Operating, investing, financing: three buckets','+ CFO above net income is usually a healthy sign']},
 {k:'technique',t:'Balance sheet: what we own and owe',short:'Balance sheet',m:{chk:'A = L + E ✓'},
  b:`Two snapshots, one year apart. Every asset was paid for by a lender (liabilities) or an owner (equity), so the two sides <b>must</b> be equal.\n\nIn a model, a balance sheet that does not balance means a link is missing. It is the built-in error check.`},
 {k:'insight',t:'How the statements link',short:'The links',
  b:`The model is a web of links. Net income starts the cash flow statement <b>and</b> adds to retained earnings. D&A is added back on the CFS <b>and</b> reduces PP&E. The CFS’s ending cash becomes balance-sheet cash.\n\nIf every link is wired, the balance sheet balances by itself. That is a working <b>three-statement model</b>.`,
  n:['Net income → top of the cash flow statement','D&A → added back on the cash flow statement','Δ cash → cash on the balance sheet','Net income → retained earnings (equity)','Debt repayment & NWC → liabilities and assets','Capex − D&A → net PP&E']},
 {k:'recap',t:'The “D&A goes up by $10” test',short:'$10 test',
  b:'The most common interview question in banking. Raise depreciation by $10 with a 25% tax rate:\n\nNet income falls by $7.50. On the CFS you add back the $10, so cash <b>rises</b> by $2.50 (the tax saving). On the balance sheet PP&E falls $10 and cash rises $2.50 (assets −$7.50), and equity falls $7.50. Balanced.',
  tip:['Rule of thumb','If you can walk any change through all three statements and they still balance, you understand the model.']}
]});

/* ======================================================= EBITDA */
const isWF=[['Revenue',C.rev[0],'t'],['COGS',-(C.rev[0]-C.gp[0])],['Gross\nprofit',C.gp[0],'t'],['SG&A',-C.opex[0]],['EBITDA',C.ebitda[0],'t'],['D&A',-C.da[0]],['EBIT',C.ebit[0],'t'],['Interest',-o.debt*o.rate],['Tax',-(C.ebit[0]-o.debt*o.rate)*o.tax],['Net\nincome',C.ni0,'t']];
ML.add({id:'ebitda',title:'EBITDA',min:9,lvl:'Beginner',
sub:'Earnings before interest, taxes, depreciation and amortisation: the most quoted, and most abused, profit number.',
keys:'ebitda margin operating profit proxy cash flow adjusted',
learn:['Where EBITDA sits on the income statement','Why it is capital-structure and tax neutral','EBITDA margin and how it trends','Why EBITDA is not cash'],
cheat:['EBITDA = EBIT + D&A = Revenue − COGS − SG&A.','Neutral to financing (I), tax regime (T) and depreciation policy (DA) → good for comparing companies.','Not cash: ignores capex, working capital and taxes. Watch “Adjusted” EBITDA.'],
met:[['e','EBITDA','chart'],['mg','Margin','pie'],['cv','Cash conversion','dollar']],
draw(si,g){
  const s=[];
  if(si===0||si===1){
    s.push(g.wf(50,60,760,320,isWF,{hi:si===1?4:null,fmt:v=>F.n(v,0)}));
    if(si===1){s.push(g.R(50+5*(760-90)/10+5*10-6,40,(760-90)/10*4+30+12,375,{rx:8,stroke:'var(--red)',dash:'6 5',sw:1.6}));
      s.push(g.pill(560,30,'EBITDA ignores everything in this box','red'))}
  }else if(si===2){
    const mg=C.ebitda.map((e,i)=>e/C.rev[i]);
    s.push(g.T(60,50,'Revenue and EBITDA, $M',{cls:'b'}));
    s.push(g.bars(60,80,380,300,C.rev,{labels:C.yrs,c:'gray',fmt:v=>F.n(v,0),gap:14}));
    s.push(g.bars(60,80,380,300,C.ebitda,{c:'green',fmt:false,gap:14,max:Math.max(...C.rev),base:false}));
    s.push(g.T(500,50,'EBITDA margin',{cls:'b'}));
    s.push(g.bars(500,80,300,300,mg,{labels:C.yrs.map(y=>y.slice(2)),c:'green',fmt:v=>F.p(v,1),gap:10,max:.25}));
  }else if(si===3){
    const e=C.ebitda[1],tx=C.taxU[1];
    s.push(g.wf(60,60,740,300,[['EBITDA',e,'t'],['Taxes on\nEBIT',-tx],['Capex',-C.capex[1]],['Δ working\ncapital',-C.dnwc[1]],['Unlevered\nfree cash',C.ufcf[1],'t']],{fmt:v=>F.n(v,1),gap:40}));
    s.push(g.T(430,430,`Only ${F.p(C.ufcf[1]/e,0)} of FY26E EBITDA turns into free cash flow for investors.`,{a:'middle',cls:'b'}));
  }else{
    s.push(g.panel(60,60,'Use EBITDA for',['comparing operating performance','across companies with different','debt, tax and asset ages','','EV / EBITDA valuation multiples','leverage: Debt / EBITDA','debt covenants'],'green',{w:330}));
    s.push(g.panel(450,60,'Do not mistake it for',['cash flow (capex, NWC, tax)','profit available to shareholders','','beware “Adjusted EBITDA”:','add-backs for “one-off” costs','that recur every year'],'red',{w:340}));
    s.push(g.T(430,380,'“References to EBITDA make us shudder.”  · Warren Buffett, 2000 letter',{a:'middle',cls:'m'}));
  }
  return s.join('');
},
anim(si,t,g){if(si===0){const i=Math.floor(t/0.6)%isWF.length;const bw=(760-90)/10;return g.R(50+i*(bw+10)-3,52,bw+6,345,{rx:6,stroke:'var(--edge)',sw:1.4,dash:'4 4'})}return ''},
steps:[
 {k:'setup',t:'Where EBITDA sits',short:'On the IS',m:{e:F.m(C.ebitda[0]),mg:F.p(C.ebitda[0]/C.rev[0])},
  b:`Walk down ${o.name}’s FY25 income statement. After paying for coffee beans (COGS) and running the stores (SG&A), <b>${F.m(C.ebitda[0])}</b> is left. That is EBITDA.\n\nBelow it come depreciation, interest and tax, which lead to net income of ${F.m(C.ni0,1)}.`},
 {k:'insight',t:'What the four letters remove',short:'Why strip',
  b:'<b>I</b>nterest depends on how the company is financed. <b>T</b>axes depend on the country and tax planning. <b>D</b>epreciation and <b>A</b>mortisation depend on accounting choices and how old the assets are.\n\nStrip all four and you get a number that compares the <b>core business</b> of two companies regardless of those choices.',
  ch:['+ Capital-structure neutral → pairs with Enterprise Value','+ Easy to compute from public filings','- Not defined by GAAP or IFRS; companies define it themselves']},
 {k:'technique',t:'EBITDA margin',short:'Margin',m:{mg:`${F.p(C.ebitda[0]/C.rev[0])} → ${F.p(C.ebitda[5]/C.rev[5])}`},
  b:`<b>EBITDA margin</b> = EBITDA ÷ revenue. Our plan assumes ${o.name} grows margin from ${F.p(o.marg[0],0)} to ${F.p(o.marg[5],0)} as stores mature and buying power improves.\n\nMargins compare efficiency across companies of different size. A 2-point margin gain on ${F.m(C.rev[5],0)} of revenue is ${F.m(C.rev[5]*.02,0)} of extra EBITDA.`},
 {k:'problem',t:'EBITDA is not cash',short:'Not cash',m:{cv:F.p(C.ufcf[1]/C.ebitda[1],0)},
  b:'A coffee chain must keep buying espresso machines and opening stores (capex), fund more inventory as it grows (working capital) and pay tax. None of that shows in EBITDA.\n\nThat is why a DCF uses <b>free cash flow</b>, not EBITDA, and why capital-heavy businesses look better on EBITDA than they really are.',
  ch:['- Capex-heavy businesses flatter on EBITDA','! “Adjusted EBITDA” add-backs need a Quality of Earnings check']},
 {k:'recap',t:'When to use it',short:'Use it well',
  b:'EBITDA is the common language of deals: EV/EBITDA multiples, leverage ratios and covenants are all built on it. Use it to <b>compare</b>; use free cash flow to <b>value</b>.'}
]});

/* ======================================================= depreciation walk */
const ppe=[o.ppe0];for(let i=1;i<6;i++)ppe.push(ppe[i-1]+C.capex[i]-C.da[i]);
ML.add({id:'depreciation-walk',title:'The Depreciation Walk',min:9,lvl:'Beginner',
sub:'Capex buys assets today; depreciation spreads their cost over their useful life. The walk keeps track of both.',
keys:'depreciation amortization capex ppe useful life straight line schedule waterfall vintage',
learn:['Why capex is not expensed immediately','The PP&E roll-forward: begin + capex − D&A = end','Stacking depreciation by vintage','How D&A touches all three statements'],
cheat:['Ending PP&E = Beginning PP&E + Capex − Depreciation.','Straight-line: annual D&A = cost ÷ useful life.','D&A lowers EBIT and tax (tax shield = D&A × t), is added back on the CFS, and reduces PP&E.','Capex ÷ D&A > 1 → the asset base is growing.'],
met:[['cx','FY26 capex','dollar'],['da','FY26 D&A','layers'],['pp','PP&E FY30','db']],
draw(si,g){
  const s=[],cx=C.capex[1];
  if(si===0){
    s.push(g.T(60,60,'Option A: expense it all in year 1',{cls:'b'}),g.bars(60,90,360,250,[cx,...U.range(o.lifeNew-1).map(()=>0)],{labels:U.range(o.lifeNew).map(i=>i%2?'':'Y'+(i+1)),c:'red',fmt:v=>v?F.n(v,1):'',gap:4,max:cx}));
    s.push(g.T(470,60,`Option B: spread over ${o.lifeNew} years`,{cls:'b'}),g.bars(470,90,340,250,U.range(o.lifeNew).map(()=>cx/o.lifeNew),{labels:U.range(o.lifeNew).map(i=>i%2?'':'Y'+(i+1)),c:'green',fmt:false,gap:4,max:cx}),g.T(640,330-250*(1/o.lifeNew),`${F.n(cx/o.lifeNew,1)} a year`,{a:'middle',cls:'b'}));
    s.push(g.T(430,420,'Same total cost, but B matches the cost to the years the machines actually make coffee.',{a:'middle',cls:'m'}));
  }else if(si===1){
    const cols=[{t:'$M',w:170,a:'l'},...C.yrs.slice(1).map(y=>({t:y,w:105}))];
    const rows=[{c:['Beginning PP&E',...ppe.slice(0,5).map(M)]},{c:['+ Capex',...C.capex.slice(1).map(M)],cc:[null,'green','green','green','green','green']},{c:['− Depreciation',...C.da.slice(1).map(v=>M(-v))],cc:[null,'red','red','red','red','red']},{c:['Ending PP&E',...ppe.slice(1).map(M)],b:1,hi:1,top:1}];
    s.push(g.table(40,90,cols,rows,{rh:30}));
    s.push(g.T(40,300,`Capex = ${F.p(o.capex,0)} of revenue. Legacy assets (${F.m(o.ppe0)}) depreciate ${F.m(o.da0)}/yr; each new year of capex over ${o.lifeNew} years.`,{cls:'m'}));
    s.push(g.T(40,320,'Ending balance of one year is the beginning balance of the next: that is the “walk”.',{cls:'m'}));
  }else if(si===2){
    const years=C.yrs.slice(1),x0=90,w=640,h=300,y0=90,mx=Math.max(...C.da)*1.15,bw=w/5-26;
    const cs=['gray','blue','green','orange','purple','pink'];
    years.forEach((yy,j)=>{const t=j+1;let base=y0+h;const parts=[[o.da0,'gray']];for(let i=1;i<=t;i++)parts.push([C.vint[i][t],cs[i]]);
      parts.forEach(([v,c])=>{const ph=v/mx*h;base-=ph;s.push(g.R(x0+j*(bw+26),base,bw,ph,{fill:`color-mix(in srgb,var(--${c}) 45%,var(--mixbase))`,stroke:'var(--edge)',sw:1.2}))});
      s.push(g.T(x0+j*(bw+26)+bw/2,base-6,F.n(C.da[t],1),{a:'middle',cls:'b'}),g.T(x0+j*(bw+26)+bw/2,y0+h+16,yy,{a:'middle',cls:'m'}))});
    s.push(g.T(x0,70,'D&A by vintage: each year’s capex adds a new layer',{cls:'b'}));
    s.push(`<g>${[['legacy','gray'],['FY26 capex','blue'],['FY27','green'],['FY28','orange'],['FY29','purple'],['FY30','pink']].map(([l,c],i)=>g.R(x0+i*110,430,12,12,{fill:`var(--${c})`})+g.T(x0+i*110+18,440,l,{cls:'m'})).join('')}</g>`);
  }else if(si===3){
    s.push(g.box(150,120,200,56,'Income statement','green',{sub:`D&A −${M(C.da[1])}`}),g.box(430,120,200,56,'Cash flow stmt','orange',{sub:`add back +${M(C.da[1])}`}),g.box(710,120,200,56,'Balance sheet','blue',{sub:`PP&E −${M(C.da[1])}`}));
    s.push(g.panel(80,230,'Tax shield',[`D&A ${M(C.da[1])} × tax ${F.p(o.tax,0)}`,`= ${M(C.da[1]*o.tax)} less tax paid`,'','D&A is non-cash, but it','saves real cash in taxes'],'green',{w:240}));
    s.push(g.panel(350,230,'Cash flow statement',['D&A reduced net income','but no cash left, so it is','added back in CFO.','Capex is the real cash out','(in investing).'],'orange',{w:230}));
    s.push(g.panel(610,230,'PP&E roll-forward',[`begin ${M(ppe[0])}`,`+ capex ${M(C.capex[1])}`,`− D&A ${M(C.da[1])}`,`= end ${M(ppe[1])}`],'blue',{w:200}));
  }else{
    s.push(g.T(60,60,'Capex vs D&A, $M',{cls:'b'}));
    const yrs=C.yrs.slice(1),bw=48;
    yrs.forEach((y,i)=>{const x=80+i*145;const mx=90,h=280;s.push(g.R(x,90+h-C.capex[i+1]/mx*h,bw,C.capex[i+1]/mx*h,{fill:'color-mix(in srgb,var(--blue) 55%,var(--mixbase))',stroke:'var(--edge)',sw:1.2}),g.R(x+bw+6,90+h-C.da[i+1]/mx*h,bw,C.da[i+1]/mx*h,{fill:'color-mix(in srgb,var(--orange) 55%,var(--mixbase))',stroke:'var(--edge)',sw:1.2}),g.T(x+bw,90+h+16,y,{a:'middle',cls:'m'}),g.T(x+bw,90+h-Math.max(C.capex[i+1],C.da[i+1])/mx*h-10,F.x(C.capex[i+1]/C.da[i+1],2),{a:'middle',cls:'b'}))});
    s.push(g.R(560,40,12,12,{fill:'var(--blue)'}),g.T(578,50,'capex',{cls:'m'}),g.R(640,40,12,12,{fill:'var(--orange)'}),g.T(658,50,'D&A',{cls:'m'}));
  }
  return s.join('');
},
anim(si,t,g){if(si===0){const n=o.lifeNew,k=Math.floor(t*2)%n,bw=(340-4*(n-1))/n;return g.R(470+k*(bw+4)-2,88,bw+4,254,{rx:4,stroke:'var(--edge)',dash:'3 3',sw:1.4})}return ''},
steps:[
 {k:'problem',t:'Why not expense capex at once?',short:'The problem',m:{cx:F.m(C.capex[1],1)},
  b:`In FY26 ${o.name} spends <b>${F.m(C.capex[1],1)}</b> on new stores, fit-outs and machines that will be used for about ${o.lifeNew} years on average. Expensing it all in year one would make FY26 look terrible and every later year look too good.\n\nAccounting <b>capitalises</b> the purchase as PP&E and spreads the cost over its useful life as <b>depreciation</b> (amortisation for intangibles).`},
 {k:'technique',t:'The PP&E roll-forward',short:'The walk',m:{da:F.m(C.da[1],1),pp:F.m(ppe[5],0)},
  b:'The walk is a simple roll-forward that every model contains: <b>beginning + capex − depreciation = ending</b>. Ending PP&E then becomes next year’s beginning.\n\nIt connects the operating plan (how many stores) to the balance sheet and to D&A on the income statement.'},
 {k:'technique',t:'Layers by vintage',short:'Vintages',
  b:'Real models depreciate each year’s capex separately: a “waterfall” of vintages. Legacy assets run off at a steady rate while each new year adds a fresh layer.\n\nThat is why D&A climbs steadily even when capex grows slowly.',
  ch:['+ Straight-line is most common in models','! Tax depreciation can be faster (accelerated) than book depreciation']},
 {k:'insight',t:'One number, three statements',short:'Links',
  b:`D&A lowers EBIT and therefore taxes: that saving, <b>${F.m(C.da[1]*o.tax,1)}</b> here, is the <b>depreciation tax shield</b>. On the cash flow statement D&A is added back because no cash moved. On the balance sheet it reduces PP&E.`},
 {k:'recap',t:'Reading capex ÷ D&A',short:'Capex/D&A',
  b:'If capex exceeds D&A the company is <b>growing</b> its asset base; roughly equal means it is maintaining it; below 1 for years means it is under-investing.\n\nIn a DCF terminal year, capex should stay a bit above D&A for a growing business, otherwise the model assumes growth for free.'}
]});

/* ======================================================= working capital */
const AR=50,INV=100,COGS0=C.rev[0]-C.gp[0];const DSO=AR/C.rev[0]*365,DIO=INV/COGS0*365,DPO=o.ap0/COGS0*365,CCC=DIO+DSO-DPO;
ML.add({id:'working-capital',title:'Net Working Capital',min:10,lvl:'Beginner',
sub:'The cash tied up in running the business day to day, and why growth eats it.',
keys:'nwc working capital receivables inventory payables cash conversion cycle dso dio dpo',
learn:['What goes into operating working capital','The cash conversion cycle (DIO + DSO − DPO)','Why growing companies consume cash','Levers that release cash'],
cheat:['NWC = operating current assets (AR, inventory) − operating current liabilities (AP, accruals). Exclude cash and debt.','CCC = DIO + DSO − DPO, in days.','An increase in NWC is a cash outflow on the CFS.'],
met:[['nwc','NWC FY25','db'],['ccc','Cash cycle','clock'],['d','ΔNWC FY26','dollar']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.stack(160,80,110,300,[['Receivables',AR,'blue'],['Inventory (beans, cups)',INV,'blue']],{title:'Operating assets',total:160}));
    s.push(g.stack(520,80,110,300,[['Accounts payable',o.ap0,'orange']],{title:'Operating liabilities',total:160}));
    s.push(g.T(430,240,'−',{a:'middle',size:40,cls:'b'}));
    s.push(g.pill(430,420,`NWC = ${AR+INV} − ${o.ap0} = ${F.m(AR+INV-o.ap0)}  (${F.p((AR+INV-o.ap0)/C.rev[0],0)} of revenue)`,'green',{fs:12}));
    s.push(g.T(700,110,'not included:',{cls:'b m'}),g.T(700,128,'· cash',{cls:'m'}),g.T(700,144,'· debt',{cls:'m'}),g.T(700,160,'(they are financing)',{cls:'m'}));
  }else if(si===1){
    const x0=80,sc=6.5,y=150;
    s.push(g.R(x0,y,DIO*sc,40,{fill:'color-mix(in srgb,var(--orange) 40%,var(--mixbase))',stroke:'var(--edge)',rx:5}),g.T(x0+DIO*sc/2,y+25,`inventory ${DIO.toFixed(0)} days (DIO)`,{a:'middle',cls:'b'}));
    s.push(g.R(x0+DIO*sc,y,DSO*sc,40,{fill:'color-mix(in srgb,var(--blue) 40%,var(--mixbase))',stroke:'var(--edge)',rx:5}),g.T(x0+DIO*sc+DSO*sc/2,y+25,`DSO ${DSO.toFixed(0)}d`,{a:'middle',cls:'b'}));
    s.push(g.R(x0,y+70,DPO*sc,40,{fill:'color-mix(in srgb,var(--green) 40%,var(--mixbase))',stroke:'var(--edge)',rx:5}),g.T(x0+DPO*sc/2,y+95,`supplier credit ${DPO.toFixed(0)}d (DPO)`,{a:'middle',cls:'b'}));
    s.push(g.R(x0+DPO*sc,y+140,CCC*sc,40,{fill:'color-mix(in srgb,var(--red) 35%,var(--mixbase))',stroke:'var(--edge)',rx:5}),g.T(x0+DPO*sc+CCC*sc/2,y+165,`cash gap ${CCC.toFixed(0)} days`,{a:'middle',cls:'b'}));
    [['buy beans',0],['pay supplier',DPO],['sell coffee',DIO],['collect cash',DIO+DSO]].forEach(([l,d])=>s.push(g.L([[x0+d*sc,y-30],[x0+d*sc,y+190]],'gray',{cls:'dot thin'}),g.T(x0+d*sc,y-36,l,{a:'middle',cls:'m'})));
    s.push(g.T(80,420,`CCC = DIO ${DIO.toFixed(0)} + DSO ${DSO.toFixed(0)} − DPO ${DPO.toFixed(0)} = ${CCC.toFixed(0)} days the company finances itself`,{cls:'b'}));
  }else if(si===2){
    s.push(g.T(60,60,'Increase in NWC each year, $M (cash consumed)',{cls:'b'}));
    s.push(g.bars(60,90,420,290,C.dnwc.slice(1),{labels:C.yrs.slice(1),c:'red',fmt:v=>F.n(v,1),gap:18}));
    s.push(g.panel(520,90,'Growth eats cash',[`NWC = ${F.p(o.nwc,0)} × revenue`,'','+$100 of sales needs','+$10 of beans & receivables','before the cash comes back','','faster growth → bigger drain'],'red',{w:280}));
  }else if(si===3){
    const cogs=COGS0,rev=C.rev[0];
    const rows=[['Cut inventory 10 days',cogs*10/365],['Collect 5 days sooner',rev*5/365],['Pay suppliers 7 days later',cogs*7/365]];
    s.push(g.T(60,70,'One-off cash released, $M',{cls:'b'}),g.hbars(60,100,560,rows,{lw:220,rh:44,c:['orange','blue','green'],fmt:v=>F.m(v,1)}));
    s.push(g.T(60,300,`Total ≈ ${F.m(rows.reduce((a,r)=>a+r[1],0),1)}, about ${F.p(rows.reduce((a,r)=>a+r[1],0)/C.ebitda[0],0)} of a year’s EBITDA, without selling one more coffee.`,{cls:'b'}));
    s.push(g.T(60,322,'Stretching suppliers too far hurts relationships: it is a lever, not a free lunch.',{cls:'m'}));
  }else{
    s.push(g.table(80,80,[{t:'Change on the balance sheet',w:300,a:'l'},{t:'Cash effect',w:150}],[{c:['Receivables go up','− cash'],cc:[null,'red']},{c:['Inventory goes up','− cash'],cc:[null,'red']},{c:['Payables go up','+ cash'],cc:[null,'green']},{c:['Accrued expenses go up','+ cash'],cc:[null,'green']},{c:['NWC goes up (net)','− cash (outflow)'],b:1,hi:1,top:1}],{rh:34}));
    s.push(g.T(80,330,'Assets up = cash used. Liabilities up = cash kept. That is the sign rule on the CFS.',{cls:'b'}));
  }
  return s.join('');
},
anim(si,t,g){if(si===1){const x0=80,sc=6.5,d=(t*12)%(DIO+DSO+6);return g.L([[x0+d*sc,115],[x0+d*sc,335]],'red',{w:2})}return ''},
steps:[
 {k:'setup',t:'What working capital is',short:'Definition',m:{nwc:F.m(AR+INV-o.ap0)},
  b:`To sell coffee ${o.name} must first buy beans (inventory) and often waits to be paid by corporate customers (receivables). Suppliers in turn give it time to pay (payables).\n\n<b>Net working capital</b> is the money stuck in that loop: operating current assets minus operating current liabilities. Cash and debt are excluded because they are financing, not operations.`},
 {k:'technique',t:'The cash conversion cycle',short:'Cash cycle',m:{ccc:`${CCC.toFixed(0)} days`},
  b:`Measure each piece in days. Beans sit for <b>${DIO.toFixed(0)} days</b> (DIO), customers pay after <b>${DSO.toFixed(0)}</b> (DSO), and suppliers are paid after <b>${DPO.toFixed(0)}</b> (DPO).\n\nThe gap between paying for beans and collecting the cash is the <b>cash conversion cycle</b>, ${CCC.toFixed(0)} days that the company has to fund itself.`,
  n:['Buy beans: the clock starts','Pay the supplier (DPO)','Sell the coffee (DIO)','Collect from the customer (DSO)']},
 {k:'problem',t:'Growth consumes cash',short:'Growth',m:{d:F.m(C.dnwc[1],1)},
  b:`Because NWC is about ${F.p(o.nwc,0)} of revenue, every year of growth ties up more cash: <b>${F.m(C.dnwc[1],1)}</b> in FY26 alone. A profitable company can run out of cash by growing too fast.\n\nIn a DCF, the <b>increase</b> in NWC is subtracted from free cash flow.`},
 {k:'technique',t:'Levers that release cash',short:'Levers',
  b:'Holding less inventory, collecting faster and paying later all shrink the cycle. Private-equity owners and CFOs often find their first cash here.',
  ch:['+ One-off release, not a recurring gain','- Squeezing suppliers can raise prices or hurt supply']},
 {k:'recap',t:'The sign rule',short:'Signs',
  b:'On the cash flow statement an <b>increase in an operating asset</b> uses cash, and an <b>increase in an operating liability</b> provides cash. Net them and you get the change in NWC.'}
]});

/* ======================================================= diluted shares */
const px=o.price;
function tsm(P){let itm=0,pr=0;const rows=o.opts.map(([n,k])=>{const in_=k<P;if(in_){itm+=n;pr+=n*k}return [n,k,in_]});const bb=pr/P;return {rows,itm,pr,bb,net:itm-bb,dil:o.basic+itm-bb+o.rsu}}
const T0=tsm(px),TO=tsm(CF.deal().offerPx);
ML.add({id:'diluted-shares',title:'Diluted Shares & the TSM',min:10,lvl:'Intermediate',
sub:'Options, RSUs and converts can become shares. The treasury stock method counts them properly.',
keys:'diluted shares treasury stock method options rsu in the money fully diluted share count',
learn:['Basic vs fully diluted shares','In-the-money vs out-of-the-money options','The treasury stock method step by step','Why the offer price changes the share count'],
cheat:['Diluted = basic + ITM options − shares repurchased with exercise proceeds + RSUs (+ ITM converts).','TSM: proceeds = Σ n × strike; buyback = proceeds ÷ share price.','Only in-the-money instruments count. Re-run at the offer price in M&A.'],
met:[['b','Basic shares','user'],['n','Net new shares','hash'],['dl','Diluted shares','layers'],['eq','Equity value','dollar']],
draw(si,g){
  const s=[];
  const grid=(x,y,n,c,lab,o2={})=>{let r='';for(let i=0;i<n;i++){const cx=x+(i%10)*17,cy=y+Math.floor(i/10)*17;r+=g.R(cx,cy,14,14,{fill:`color-mix(in srgb,var(--${c}) ${o2.op||45}%,var(--mixbase))`,stroke:'var(--edge)',sw:1,rx:3})}return r+(lab?g.T(x,y-10,lab,{cls:'b'}):'')};
  if(si===0){
    s.push(grid(80,90,100,'blue','Basic shares: 100M (each square = 1M)'));
    s.push(g.panel(370,80,'Claims that can become shares',['stock options: right to BUY','  shares at a fixed strike','RSUs: shares granted to staff','convertible bonds: debt that','  can swap into shares','warrants: options sold to','  investors'],'yellow',{w:300}));
    s.push(g.T(370,330,'If they turn into shares, each existing share owns',{cls:'m'}),g.T(370,346,'a smaller slice: that is dilution.',{cls:'m'}));
  }else if(si===1){
    s.push(g.table(60,70,[{t:'Tranche',w:120,a:'l'},{t:'Options (M)',w:110},{t:'Strike',w:90},{t:`vs $${px}`,w:120}],T0.rows.map(([n,k,i],j)=>({c:[`Tranche ${j+1}`,F.n(n,1),F.d(k),i?'in the money':'out of money'],cc:[null,null,null,i?'green':'red'],tone:i?'green':null})),{rh:36}));
    s.push(g.T(60,260,`Share price $${px}. An option with strike $${o.opts[2][1]} would not be exercised: nobody pays $${o.opts[2][1]} for a $${px} share.`,{cls:'m'}));
    s.push(g.T(60,280,`In the money: ${T0.itm}M options.`,{cls:'b'}));
  }else if(si===2){
    s.push(g.box(140,110,180,60,'Holders exercise','green',{sub:`${T0.itm}M new shares`}));
    s.push(g.box(430,110,190,60,'Company receives','blue',{sub:`${F.m(T0.pr)} cash`}));
    s.push(g.box(720,110,190,60,'Buys back at $'+px,'orange',{sub:`${F.n(T0.bb,1)}M shares`}));
    s.push(g.A(232,110,333,110),g.A(527,110,623,110));
    s.push(g.wf(160,220,520,180,[['ITM options',T0.itm,'t'],['repurchased',-T0.bb],['net new',T0.net,'t']],{fmt:v=>F.n(v,1)+'M',gap:60}));
  }else if(si===3){
    s.push(g.wf(60,70,500,300,[['Basic',o.basic,'t'],['Options\n(net, TSM)',T0.net],['RSUs',o.rsu],['Diluted',T0.dil,'t']],{fmt:v=>F.n(v,1),gap:30,min:90}));
    s.push(g.panel(600,90,'Equity value',[`basic   ${o.basic} × $${px} = ${F.m(o.basic*px)}`,`diluted ${F.n(T0.dil,1)} × $${px} = ${F.m(T0.dil*px)}`,'',`→ +${F.m((T0.dil-o.basic)*px)} hidden in options`],'blue',{w:250}));
  }else{
    const P=[px,CF.deal().offerPx];
    s.push(g.table(60,70,[{t:'',w:220,a:'l'},{t:`at $${P[0].toFixed(2)}`,w:120},{t:`at offer $${P[1].toFixed(2)}`,w:150}],[{c:['ITM options (M)',F.n(T0.itm,1),F.n(TO.itm,1)]},{c:['Exercise proceeds',F.m(T0.pr),F.m(TO.pr)]},{c:['Shares repurchased (M)',F.n(T0.bb,2),F.n(TO.bb,2)]},{c:['Net new shares (M)',F.n(T0.net,2),F.n(TO.net,2)]},{c:['Fully diluted (M)',F.n(T0.dil,2),F.n(TO.dil,2)],b:1,hi:1}],{rh:32}));
    s.push(g.T(60,300,`At the takeover price the $${o.opts[2][1]} tranche comes into the money, so the buyer pays for more shares.`,{cls:'b'}));
    s.push(g.T(60,320,'Many deals also accelerate unvested options at change of control.',{cls:'m'}));
  }
  return s.join('');
},
anim(si,t,g){if(si===2){const p=(t%2.4)/2.4;return g.dot(232,110,333,110,p,'green')+g.dot(527,110,623,110,p,'orange')}return ''},
steps:[
 {k:'setup',t:'Basic shares and the claims on them',short:'Basic',m:{b:`${o.basic}M`},
  b:`${o.name} has <b>${o.basic}M</b> shares outstanding. Employees also hold stock options and RSUs. If those convert, the pie is cut into more slices.\n\nA buyer, or a valuation, must account for every share that <b>could</b> exist: the <b>fully diluted</b> share count.`},
 {k:'technique',t:'Which options count?',short:'ITM or not',
  b:`Only <b>in-the-money</b> options (strike below the share price) would be exercised. At $${px}, ${T0.itm}M options are in the money and ${o.opts[2][0]}M are not.`},
 {k:'math',t:'The treasury stock method',short:'TSM',m:{n:`+${F.n(T0.net,1)}M`},
  b:`Assume ITM options are exercised. Holders pay the strike, so the company receives <b>${F.m(T0.pr)}</b>. The TSM assumes that cash is used to buy back shares at the market price: ${F.m(T0.pr)} ÷ $${px} = <b>${F.n(T0.bb,1)}M</b>.\n\nNet dilution is ${T0.itm} − ${F.n(T0.bb,1)} = <b>${F.n(T0.net,1)}M</b> shares, much less than the headline option count.`,
  n:['Holders exercise in-the-money options','Company receives the strike price in cash','Cash buys back shares at market','Net new shares = exercised − repurchased']},
 {k:'solution',t:'Fully diluted share count',short:'Diluted',m:{dl:`${F.n(T0.dil,1)}M`,eq:F.m(C.eqv)},
  b:`Add RSUs (they convert with no strike) and we get <b>${F.n(T0.dil,1)}M</b> diluted shares. Equity value = ${F.n(T0.dil,1)}M × $${px} = <b>${F.m(C.eqv)}</b>.\n\nThis is the equity value used in the EV bridge in module 02.`},
 {k:'insight',t:'Re-run at the offer price',short:'Offer price',m:{dl:`${F.n(TO.dil,2)}M`},
  b:`In an acquisition, compute dilution at the <b>offer price</b>, not today’s price. At $${CF.deal().offerPx.toFixed(2)} every tranche is in the money and the count rises to <b>${F.n(TO.dil,2)}M</b>.\n\nSince price depends on share count and share count on price, models often solve this with a quick circular reference.`,
  ch:['! Convertible bonds: add the conversion shares if ITM (if-converted method)']}
]});

/* ======================================================= goodwill */
const D0=CF.deal(),bv=C.bs0.eq,stepPPE=60,intang=200,dtl=(stepPPE+intang)*o.tax,fvNA=bv-o.gw0+stepPPE+intang-dtl,gw=D0.eqPrice-fvNA;
ML.add({id:'goodwill',title:'Goodwill',min:10,lvl:'Intermediate',
sub:'The part of an acquisition price that cannot be pinned to any identifiable asset.',
keys:'goodwill purchase price allocation ppa intangible assets step-up impairment asc 805 ifrs 3',
learn:['How purchase price allocation works','Write-ups of assets and new intangibles','Goodwill as the residual','Impairment testing after the deal'],
cheat:['Goodwill = purchase price − fair value of identifiable net assets.','Old goodwill of the target is written off; assets are stepped up to fair value; new intangibles (brand, customers) are recognised; deferred tax is booked on step-ups.','Not amortised under US GAAP or IFRS for public companies; tested for impairment at least yearly.'],
met:[['pp','Purchase price','dollar'],['na','FV net assets','db'],['gw','Goodwill','sparkle']],
draw(si,g){
  const s=[];const H=330,tot=D0.eqPrice;
  if(si===0){
    s.push(g.stack(180,80,120,H,[['Book equity',bv,'gray']],{title:'Book value',total:tot}));
    s.push(g.stack(520,80,120,H,[['Equity purchase price',tot,'blue']],{title:`${D0.o.name} pays`,total:tot}));
    s.push(g.A(320,300,500,300,{c:'red',dash:1,l:`gap ${F.m(tot-bv)}`,lt:'red'}));
  }else if(si===1){
    s.push(g.wf(60,80,740,280,[['Book\nequity',bv,'t'],['Write off\nold goodwill',-o.gw0],['PP&E\nstep-up',stepPPE],['Brand &\ncustomers',intang],['Deferred\ntax liab.',-dtl],['FV net\nassets',fvNA,'t']],{fmt:v=>F.n(v,0),gap:24}));
  }else if(si===2){
    s.push(g.stack(330,70,150,H,[['FV of identifiable net assets',fvNA,'green'],['Goodwill (residual)',gw,'purple']],{title:'Purchase price allocation',total:tot,hi:1}));
    s.push(g.T(140,250,F.m(tot,1),{a:'middle',cls:'h'}),g.T(140,268,'purchase price',{a:'middle',cls:'m'}));
  }else if(si===3){
    const P=g.plot({x:90,y:60,w:600,h:300,xr:[0,6],yr:[0,gw*1.3],nx:6,ny:4,xl:'years after closing',yl:'$M'});
    s.push(P.svg,P.line([[0,gw],[3,gw],[3,gw*.7],[6,gw*.7]],'purple',{w:3}),P.line([[0,intang],[6,intang-6*intang/10]],'orange',{w:3}));
    s.push(g.T(P.sx(.2),P.sy(gw)-10,'goodwill: not amortised',{cls:'b',c:'purple'}),g.T(P.sx(3.1),P.sy(gw*.7)+18,`impairment −${F.m(gw*.3)} if fair value falls`,{cls:'b',c:'red'}),g.T(P.sx(.2),P.sy(intang)-10,'intangibles: amortised over ~10 yrs',{cls:'b',c:'orange'}));
  }else{
    s.push(g.panel(70,70,'Why buyers pay above net assets',['synergies they expect to earn','assembled workforce & know-how','market position, growth options','control premium','… or simply overpaying'],'purple',{w:330}));
    s.push(g.panel(450,70,'What to watch',['large goodwill vs equity','  = big bet on the deal','impairments = admission the','  deal is worth less than paid','analysts often ignore them','  for cash flow (non-cash)'],'red',{w:330}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Paying more than book value',short:'The gap',m:{pp:F.m(D0.eqPrice,1)},
  b:`${D0.o.name} agrees to buy all of ${o.name}’s equity for <b>${F.m(D0.eqPrice,1)}</b> ($${D0.offerPx.toFixed(2)} × ${F.n(D0.C.dil,0)}M shares, see module 03). The target’s book equity is only ${F.m(bv)}.\n\nAccounting must explain where the difference goes. That is the <b>purchase price allocation</b> (ASC 805 / IFRS 3).`},
 {k:'technique',t:'Revalue what was bought',short:'Fair value',m:{na:F.m(fvNA)},
  b:`Start from book equity. Remove the target’s <b>old goodwill</b> (it came from its own past deals). Step up assets to <b>fair value</b>: PP&E +${F.m(stepPPE)}. Recognise identifiable <b>intangibles</b> the target never booked, like its brand and customer relationships (+${F.m(intang)}).\n\nStep-ups create book/tax differences, so a <b>deferred tax liability</b> of ${F.m(dtl)} is recorded. Result: fair value of identifiable net assets = ${F.m(fvNA)}.`},
 {k:'solution',t:'Goodwill is the residual',short:'Residual',m:{gw:F.m(gw,1)},
  b:`Whatever is left after every identifiable asset is valued is <b>goodwill</b>: ${F.m(D0.eqPrice,1)} − ${F.m(fvNA)} = <b>${F.m(gw,1)}</b>.\n\nIt sits on the acquirer’s balance sheet as an intangible asset.`},
 {k:'insight',t:'After closing: impairment, not amortisation',short:'Impairment',
  b:'Identified intangibles are amortised over their lives. Goodwill is <b>not</b> amortised (for public companies under US GAAP and IFRS). Instead it is tested at least annually: if the business unit is worth less than its carrying amount, goodwill is written down.\n\nAn impairment is non-cash, but it is a public admission that the deal disappointed.',
  ch:['! Private companies under US GAAP may elect to amortise goodwill over up to 10 years']},
 {k:'recap',t:'What goodwill tells you',short:'Recap',
  b:'Goodwill measures how much a buyer paid for things that are not separately identifiable: expected synergies, people, momentum. Large goodwill means the deal’s success rests on those expectations.'}
]});
})();
