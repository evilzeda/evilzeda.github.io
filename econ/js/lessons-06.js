/* 06 · Deleveraging & Policy Levers */
(function(){const U=ML.U,E=ML.EC,F=E.F,MIX=E.MIX;
const R={};Object.keys(MIX).forEach(k=>R[k]=E.delev(MIX[k]));
const yl=(g,P,vals,fmt)=>vals.map(v=>g.T(P.x-6,P.sy(v)+3,fmt(v),{a:'end',cls:'m'})).join('');
const yx=(g,P)=>[0,2,4,6,8,10,12].map(y=>g.T(P.sx(y),P.y+P.h+14,'yr '+y,{a:'middle',cls:'m'})).join('');
/* standard 2-panel chart: debt/income (left) and a second metric (right) for a set of mixes */
function two(g,keys,k2,o={}){
  const P1=g.plot({x:70,y:40,w:350,h:350,xr:[0,12],yr:[0,o.dmax||5.5],nx:6,ny:5,title:'Private debt ÷ income'});
  const r2=o.r2||[-.1,.06],P2=g.plot({x:480,y:40,w:330,h:350,xr:[0,12],yr:r2,nx:6,ny:4,title:o.t2||'Real growth'});
  let s=P1.svg+P2.svg+P1.line([[0,3],[12,3]],'gray',{cls:'dash thin'})+P2.line([[0,0],[12,0]],'gray',{cls:'dash thin'});
  if(o.band)s+=g.R(P2.x,P2.sy(o.band[1]),P2.w,P2.sy(o.band[0])-P2.sy(o.band[1]),{fill:'var(--green-bg)',op:.9});
  keys.forEach(([k,c],i)=>{const rows=R[k].rows,last=rows[rows.length-1];
    s+=P1.clip(P1.line(rows.map(r=>[r.y,r.d]),c,{w:3}))+P2.clip(P2.line(rows.map(r=>[r.y,r[k2]]),c,{w:3}));
    s+=g.T(P1.x+P1.w-4,U.clamp(P1.sy(last.d),P1.y+12,P1.y+P1.h-4)+(o.ld?o.ld[i]:0),MIX[k].label,{a:'end',cls:'b',c,size:10.5})});
  s+=yl(g,P1,[0,1,2,3,4,5].filter(v=>v<=(o.dmax||5.5)),v=>v*100+'%')+yl(g,P2,U.range(5).map(i=>r2[0]+(r2[1]-r2[0])*i/4),v=>F.p(v,0))+yx(g,P1)+yx(g,P2);
  return s;
}

/* ======================================================= deleveraging */
ML.add({id:'deleveraging',title:'Deleveraging',min:11,lvl:'Intermediate',
sub:'The painful process of bringing debt burdens down when rates are already at zero. Four ways to do it.',
keys:'deleveraging debt reduction four levers austerity default redistribution printing money balance sheet recession',
learn:['Why a deleveraging is different from a recession','What happens if nobody acts','The four levers','Deflationary vs inflationary levers'],
cheat:['<b>Deleveraging</b> = debt burdens (debt ÷ income) must fall, and rates are already ≈0%, so rate cuts can’t do it.','Doing nothing: incomes fall faster than debt, so the burden can actually <b>rise</b>.','Four levers: 1) cut spending, 2) reduce debt (defaults, restructuring), 3) redistribute wealth, 4) print money.','Levers 1–3 are <b>deflationary</b>; lever 4 is <b>inflationary</b>. The art is the balance.'],
met:[['d','Debt ÷ income (yr 12)','scale'],['g','Real income (12 yrs)','trend']],
draw(si,g){
  const s=[];
  if(si===0){s.push(g.box(250,160,300,80,'Recession','blue',{hot:1,sub:'rates can be cut → fixed'}),g.box(610,160,300,80,'Deleveraging','red',{hot:1,sub:'rates at 0% → can’t'}),g.panel(250,270,'In a deleveraging',['debt burden is too high','people can’t borrow more','lenders won’t lend more','→ debt has to come down'],'red',{w:360}))}
  else if(si===1)s.push(two(g,[['nothing','gray']],'real',{}));
  else{
    [['1. Spending cuts','austerity','blue','deflationary'],['2. Debt reduction','defaults & restructuring','purple','deflationary'],['3. Redistribution','tax the rich, support the rest','yellow','deflationary-ish'],['4. Printing money','central bank buys assets','red','inflationary']].forEach(([t,sub,c,tag],i)=>{const x=125+i*205;s.push(g.box(x,190,185,96,t,c,{hot:1,sub}),g.pill(x,265,tag,tag==='inflationary'?'red':'blue'))});
    if(si===3)s.push(g.T(430,350,'Too much of 1–3: deflationary depression.  Too much of 4: inflationary depression.',{a:'middle',cls:'b'}),g.T(430,375,'The right mix: a “beautiful deleveraging” (lesson 6.6).',{a:'middle',cls:'m'}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Not a normal recession',short:'Different',
  b:'In a recession the central bank cuts rates and borrowing restarts. In a <b>deleveraging</b> rates are already at about zero and people are buried in debt. Nobody can borrow their way out. The debt burden itself has to come down.'},
 {k:'problem',t:'If nobody does anything',short:'Do nothing',m:{d:`${(R.nothing.last.d*100).toFixed(0)}%`,g:F.pp(R.nothing.cumReal,0)},
  b:`Nusa starts with private debt at 300% of income. Credit is shrinking, so spending and incomes fall, prices dip and the average rate on old debt stays at 4.5%. Debt grows faster than shrinking incomes: after 12 years the burden is <b>${(R.nothing.last.d*100).toFixed(0)}%</b>, worse than when it started.`,
  ch:['! A deleveraging does not fix itself; incomes fall as fast as debts']},
 {k:'technique',t:'The four levers',short:'Levers',
  b:'Dalio lists four ways debt burdens come down: <b>cut spending</b> (austerity), <b>reduce debt</b> (defaults and restructurings), <b>redistribute wealth</b> from haves to have-nots, and <b>print money</b>. Every historical deleveraging used some mix of all four.'},
 {k:'insight',t:'Deflationary vs inflationary',short:'Balance',
  b:'The first three push prices and incomes down. Printing money pushes them up. Use only the first three and the economy sinks into deflation; lean only on the printer and the currency collapses. The next lessons take each lever in turn, then put them together.',
  tip:['Lab','The deleveraging mixer has all four levers as sliders.']}
]});

/* ======================================================= austerity */
ML.add({id:'austerity',title:'Spending Cuts (Austerity)',min:9,lvl:'Intermediate',
sub:'Everyone tightens their belt to pay down debt. But one person’s spending is another’s income, so incomes fall too.',
keys:'austerity spending cuts belt tightening paradox of thrift deflationary fiscal consolidation',
learn:['What austerity means for households, firms and governments','Why incomes fall too','Why the debt burden can rise','When cuts do help'],
cheat:['Austerity = households, businesses and governments cut spending to repay debt.','Because spending is income (lesson 1.4), cuts lower incomes, often almost as fast as debts.','Result: deflationary, and debt ÷ income can rise. Unemployment rises, tax revenue falls.','Some cutting is necessary; alone it is a deflationary depression (US 1930–32, Greece 2010–13).'],
met:[['d','Debt ÷ income (yr 12)','scale'],['u','Peak unemployment','user']],
draw(si,g){
  if(si===0){return g.actor(200,250,'Sari','orange',{s:1.4,sub:'spends 10% less'})+g.A(270,250,560,250,{c:'red',w:2.2,l:'less spending'})+g.actor(640,250,'Budi','green',{s:1.4,sub:'earns 10% less'})+g.T(430,380,'Sari repays a bit of debt. Budi now struggles to repay his.',{a:'middle',cls:'b'})}
  return two(g,[['nothing','gray'],['austerity','blue']],si===1?'real':'u',si===1?{}:{r2:[0,.16],t2:'Unemployment'});
},
steps:[
 {k:'setup',t:'Belt-tightening',short:'Idea',
  b:'The obvious response to too much debt: spend less and use the savings to repay. Households cut, businesses cut, the government cuts. But from lesson 1.4: Sari’s spending is Budi’s income.'},
 {k:'problem',t:'Incomes fall with debts',short:'Result',m:{d:`${(R.austerity.last.d*100).toFixed(0)}%`},
  b:`Run Nusa with deep austerity (cuts of 4% of income a year). Real incomes shrink year after year and prices fall. Debts fall a little in dollars but incomes fall faster: after 12 years debt is <b>${(R.austerity.last.d*100).toFixed(0)}%</b> of income. The burden got heavier.`},
 {k:'problem',t:'Jobs and taxes',short:'Unemployment',m:{u:F.p(R.austerity.peakU,0)},
  b:`Unemployment peaks near <b>${F.p(R.austerity.peakU,0)}</b>. Lower incomes mean lower tax revenue and more people needing support, so even the government finds its own deficit hard to close. Dalio: austerity alone is <b>deflationary</b> and painful.`,
  ch:['- Necessary in part','! Alone, it makes the burden worse']}
]});

/* ======================================================= debt reduction */
ML.add({id:'debt-reduction',title:'Defaults & Restructurings',min:10,lvl:'Intermediate',
sub:'Writing debt down, or changing its terms. One person’s debt is another’s asset, so lenders and savers get hurt.',
keys:'default restructuring debt write down haircut bank run deposit insurance deflationary',
learn:['Defaults vs restructurings','Why lenders’ losses spread','Bank runs and deposit insurance','Why it is deflationary'],
cheat:['<b>Default</b>: the borrower can’t pay; lender takes a loss. <b>Restructuring</b>: lower payments, longer terms or lower rates.','Debt is an asset to the lender (lesson 2.3): write-downs shrink lenders’ wealth, so they spend and lend less.','Fear of bank losses can trigger <b>bank runs</b>; deposit insurance and central-bank lending stop them.','Debt reduction is <b>deflationary</b>: it destroys money and credit.'],
met:[['d','Debt ÷ income (yr 12)','scale'],['loss','Lenders lose','alert']],
draw(si,g){
  if(si===0){return g.table(100,90,[{t:'Option',w:220,a:'l'},{t:'What changes',w:300,a:'l'},{t:'Lender loses',w:140,a:'l'}],[{c:['Default','debt is not paid','a lot']},{c:['Write-down (haircut)','part of the principal forgiven','some']},{c:['Restructuring','lower rate, longer term, lower payments','value of the loan']}],{rh:46})}
  if(si===1){return g.stack(160,70,150,330,[['Sari: loan $10,000',10000,'red']],{title:'Borrower: liability −$3k',fmt:v=>F.d(v)})+g.stack(560,70,150,330,[['Bank: asset $10,000',10000,'blue']],{title:'Lender: asset −$3k',fmt:v=>F.d(v)})+g.R(160,70,150,99,{fill:'var(--green-bg)',op:.85,stroke:'var(--edge)'})+g.R(560,70,150,99,{fill:'var(--red-bg)',op:.85,stroke:'var(--edge)'})+g.T(235,125,'forgiven $3k',{a:'middle',cls:'b'})+g.T(635,125,'lost $3k',{a:'middle',cls:'b'})+g.T(430,440,'Same $3,000: relief for one side, loss for the other.',{a:'middle',cls:'b'})}
  if(si===2){return g.box(200,150,240,70,'Bank looks shaky','red',{hot:1})+g.A(320,150,470,150,{c:'red'})+g.box(600,150,240,70,'Depositors rush out','red',{hot:1,sub:'even healthy banks fall'})+g.panel(240,260,'Firewalls',['deposit insurance (e.g. FDIC)','central bank as lender of last resort'],'green',{w:380})}
  return two(g,[['nothing','gray'],['defaults','purple']],'infl',{r2:[-.06,.06],t2:'Inflation'});
},
steps:[
 {k:'setup',t:'Writing debt down',short:'Options',
  b:'The second lever is reducing the debt itself. A <b>default</b> means it simply isn’t paid. A <b>restructuring</b> changes the terms: lower payments, a longer timeline or a lower rate. Either way, the borrower owes less.'},
 {k:'insight',t:'The other side of the ledger',short:'Lenders',m:{loss:'$3k'},
  b:'Remember: every debt is somebody’s asset. If Sari gets $3,000 forgiven, Bank Nusa loses $3,000 of assets, and the savers whose deposits funded it may lose too. Lenders feel poorer and lend less.'},
 {k:'problem',t:'Bank runs',short:'Runs',
  b:'If people fear their bank is losing money on bad loans, they rush to take their deposits out. A run can bring down even a sound bank. That is why governments insure deposits and central banks lend to banks in a panic.',
  ch:['! 1930–33: thousands of US banks failed before deposit insurance existed']},
 {k:'problem',t:'Deflationary',short:'Result',m:{d:`${(R.defaults.last.d*100).toFixed(0)}%`},
  b:`Heavy write-downs bring Nusa’s debt down to about <b>${(R.defaults.last.d*100).toFixed(0)}%</b> of income, but they destroy credit and money too: inflation turns negative and real incomes fall by ${F.pp(R.defaults.cumReal,0)} over 12 years. Like austerity, it is <b>deflationary</b>.`}
]});

/* ======================================================= redistribution */
ML.add({id:'redistribution',title:'Wealth Redistribution',min:9,lvl:'Intermediate',
sub:'Taxing the haves to support the have-nots and fund stimulus. It helps, but it can tear at social and political stability.',
keys:'redistribution taxes deficits unemployment benefits stimulus inequality populism social tension',
learn:['Why government deficits rise in a deleveraging','Taxes on the wealthy','Why it supports spending','Why it creates political tension'],
cheat:['Incomes fall → tax revenue falls; unemployment rises → spending on support rises: the government deficit grows.','To fund it: higher taxes on the wealthy, and borrowing.','Transfers support spending (and so incomes) among people who would otherwise cut back.','Resentment between haves and have-nots can rise sharply; Dalio points to the 1930s rise of populism.'],
met:[['gov','Govt debt ÷ income (yr 12)','bank'],['st','Social tension','alert']],
draw(si,g){
  if(si===0){return g.box(430,110,260,64,'Government','blue',{hot:1,sub:'deficit grows'})+g.actor(180,320,'the haves','purple',{s:1.2,sub:'taxed more'})+g.actor(680,320,'the have-nots','green',{s:1.2,sub:'aid & stimulus'})+g.A(220,280,330,140,{c:'purple',l:'taxes',curve:-20})+g.A(530,140,640,280,{c:'green',l:'support',curve:-20})}
  if(si===1){const keys=[['nothing','gray'],['beautiful','green']];const P=g.plot({x:90,y:40,w:640,h:350,xr:[0,12],yr:[0,1.6],nx:6,ny:4,title:'Government debt ÷ income'});let s=P.svg;keys.forEach(([k,c])=>{s+=P.line(R[k].rows.map(r=>[r.y,r.gov]),c,{w:3})+g.T(P.sx(12)+6,P.sy(R[k].last.gov)+4,k==='beautiful'?'Balanced':MIX[k].label,{cls:'b',c,size:10.5})});return s+yl(g,P,[0,.4,.8,1.2,1.6],v=>(v*100).toFixed(0)+'%')+yx(g,P)}
  return g.gauge(260,280,140,.75,'social & political tension','red','high')+g.panel(470,120,'1930s',['taxes on top incomes raised','populism, left and right','conflict between the haves','  and the have-nots'],'red',{w:300});
},
steps:[
 {k:'setup',t:'The government steps in',short:'Idea',
  b:'As incomes fall, tax revenue falls; as unemployment rises, the government must spend more on support and stimulus. Its deficit grows. Part of the gap is often filled by raising taxes on the wealthy: a <b>redistribution</b> from the haves to the have-nots.'},
 {k:'insight',t:'Government debt rises',short:'Govt debt',m:{gov:`${(R.beautiful.last.gov*100).toFixed(0)}%`},
  b:'Supporting incomes keeps people spending, which supports other people’s incomes. But the money has to come from somewhere: in Nusa’s balanced plan, government debt rises from 60% to about <b>'+(R.beautiful.last.gov*100).toFixed(0)+'%</b> of income. The government borrows so the private sector can deleverage.'},
 {k:'tradeoff',t:'Social tension',short:'Tension',m:{st:'high'},
  b:'Those who are taxed resent it; those who are struggling resent those who still have wealth. Dalio warns this is how deleveragings turn political: in the 1930s it fed populism and conflict. Redistribution helps, but it must be handled carefully.',
  ch:['! Economic stress + inequality → political risk']}
]});

/* ======================================================= printing money */
ML.add({id:'printing',title:'Printing Money',min:11,lvl:'Intermediate',
sub:'The central bank creates money to buy financial assets and government bonds, replacing the credit that is disappearing.',
keys:'printing money quantitative easing QE helicopter money monetisation central bank balance sheet inflationary',
learn:['How printing works at the zero bound','Who benefits from buying assets','Why it works best alongside government spending','Why too much is dangerous'],
cheat:['At 0% rates, the central bank prints money to buy <b>financial assets</b> (QE) and <b>government bonds</b>.','Buying assets lifts their prices: helps people who own them.','Buying government bonds lets the government spend on everyone: stimulus and support.','Printing is <b>inflationary</b> and offsets the deflationary levers. Too much → inflationary depression (Weimar 1923).'],
met:[['infl','Inflation','alert'],['d','Debt ÷ income (yr 12)','scale']],
draw(si,g){
  if(si===0){return g.box(180,120,240,70,'Central bank','orange',{hot:1,sub:'creates new money'})+g.A(300,120,520,120,{c:'pink',l:'buys bonds & assets',w:2.2})+g.box(640,120,240,70,'Investors & banks','purple',{hot:1,sub:'asset prices ↑'})+g.A(180,158,180,290,{c:'pink',l:'buys govt bonds'})+g.box(180,320,240,70,'Government','blue',{hot:1,sub:'spends on everyone'})+g.A(300,320,520,320,{c:'green',l:'stimulus & aid',w:2.2})+g.actor(640,330,'households','green',{s:1})}
  if(si===1){return g.T(430,60,'Who gains from each channel?',{a:'middle',cls:'b'})+g.panel(90,100,'Buying financial assets',['bond & share prices rise','helps those who own assets','  (mostly wealthier people)','weak help for everyone else'],'purple',{w:330})+g.panel(470,100,'Buying government bonds',['funds deficits: aid, stimulus','money reaches people who spend it','this is where the government','  and central bank work together'],'blue',{w:330})}
  return two(g,si===2?[['nothing','gray'],['beautiful','green']]:[['beautiful','green'],['printing','red']],'infl',{r2:[-.04,.12],t2:'Inflation',band:[0,.04]});
},
steps:[
 {k:'setup',t:'How it works',short:'Mechanics',
  b:'With rates at zero, the central bank does the one thing only it can: <b>create money</b>. It uses it to buy financial assets (quantitative easing) and government bonds. The government uses the borrowed money to spend on stimulus and support (lesson 1.5).'},
 {k:'insight',t:'Two channels, different winners',short:'Who gains',
  b:'Buying financial assets pushes their prices up, which helps people who own them. Buying government bonds funds spending that reaches everyone else. Dalio stresses the second: the central bank and the government must cooperate.',
  ch:['! QE alone widens the gap between asset owners and everyone else']},
 {k:'solution',t:'Replacing lost credit',short:'Offsets',m:{infl:`≈${F.p(R.beautiful.rows[6].infl,1)}`},
  b:'Printing offsets the credit that is disappearing. In Nusa’s balanced plan it turns deflation into mild positive inflation, which lifts nominal incomes above the interest rate on debt (lesson 6.7). Compare with doing nothing: the gray line stays below zero for years.'},
 {k:'problem',t:'Too much of a good thing',short:'Too much',m:{infl:F.p(R.printing.mx,0),d:`${(R.printing.last.d*100).toFixed(0)}%`},
  b:`Push the printer too hard and debt melts away, but so does the currency: inflation runs above <b>${F.p(R.printing.mx,0)}</b> a year in this run. In the extreme (Weimar Germany 1923, Zimbabwe 2008) money becomes worthless. Dalio calls that an <b>inflationary depression</b>.`}
]});

/* ======================================================= beautiful deleveraging */
const ORDER=['nothing','austerity','defaults','printing','beautiful'];
ML.add({id:'beautiful',title:'The Beautiful Deleveraging',min:11,lvl:'Advanced',
sub:'Balance the deflationary levers with the inflationary one so debt burdens fall without a collapse or runaway inflation.',
keys:'beautiful deleveraging balance deflationary inflationary ugly deleveraging dalio 2009 united states',
learn:['Ugly deflationary vs ugly inflationary','The balanced mix','Comparing all five strategies','Real examples'],
cheat:['<b>Ugly deflationary</b>: too much austerity/default, not enough printing (US 1930–32).','<b>Ugly inflationary</b>: too much printing (Weimar 1922–23).','<b>Beautiful</b>: enough printing and stimulus to offset the deflationary forces, so debt ÷ income falls while growth returns and inflation stays moderate.','Dalio’s example: the US after early 2009 (and after 1933).'],
met:[['v','Verdict','check'],['d','Debt ÷ income (yr 12)','scale']],
hero:2,
draw(si,g){
  if(si===0){return g.box(200,170,280,90,'Ugly: deflationary','blue',{hot:1,sub:'austerity + defaults'})+g.box(660,170,280,90,'Ugly: inflationary','red',{hot:1,sub:'printing without limit'})+g.box(430,330,320,90,'Beautiful','green',{hot:1,sub:'the levers balance'})+g.A(320,220,380,290,{c:'green'})+g.A(540,220,480,290,{c:'green'})}
  if(si===1)return two(g,[['beautiful','green']],'real',{});
  if(si===2)return two(g,[['austerity','blue'],['printing','red'],['beautiful','green']],'real',{ld:[0,0,-14]});
  const V={beautiful:'green',deflationary:'blue',inflationary:'red',painful:'yellow'};
  return g.table(60,70,[{t:'Strategy',w:230,a:'l'},{t:'Debt ÷ inc. yr 12',w:140},{t:'Peak inflation',w:120},{t:'Real income',w:110},{t:'Verdict',w:140,a:'l'}],ORDER.map(k=>({c:[MIX[k].label,(R[k].last.d*100).toFixed(0)+'%',F.p(R[k].mx,1),F.pp(R[k].cumReal,0),R[k].verdict],cc:[null,null,null,null,V[R[k].verdict]],hi:k==='beautiful'})),{rh:42});
},
steps:[
 {k:'setup',t:'Two ways to get it wrong',short:'Ugly',
  b:'Lean too hard on spending cuts and defaults and you get an <b>ugly deflationary</b> deleveraging: depression, falling prices, defaults. Lean too hard on the printer and you get an <b>ugly inflationary</b> one: the currency collapses.'},
 {k:'solution',t:'The balanced mix',short:'Balance',m:{v:R.beautiful.verdict,d:`${(R.beautiful.last.d*100).toFixed(0)}%`},
  b:`Nusa’s balanced plan: modest spending cuts (1.5% of income a year), steady restructuring (2% of debt a year), government support (3% of income) and money printing (5% of income). After a hard first two years, growth comes back, inflation settles around 2–3%, and debt falls from 300% to <b>${(R.beautiful.last.d*100).toFixed(0)}%</b> of income.`},
 {k:'insight',t:'Side by side',short:'Compare',
  b:'Austerity alone sinks incomes for years. Printing alone gives a quick bounce but with double-digit inflation. The balanced plan starts slower than pure printing but ends healthier. Dalio’s term for it: a <b>beautiful deleveraging</b>.'},
 {k:'recap',t:'Scorecard',short:'Scorecard',
  b:'All five strategies on the same island. The verdicts come from simple tests: inflation above 10% is inflationary; falling prices or shrinking real incomes are deflationary; debt still above 85% of the start, or unemployment above 10%, is painful.',
  tip:['Lab','Try to beat the balanced plan in the deleveraging mixer.']}
]});

/* ======================================================= income growth vs interest rate */
const GR=[[.06,.04,'green','growth > rate'],[.04,.04,'yellow','growth = rate'],[.02,.04,'red','growth < rate']].map(([gr,r,c,l])=>({gr,r,c,l,v:U.range(13).map(y=>[y,3*Math.pow((1+r)/(1+gr),y)])}));
ML.add({id:'growth-vs-rate',title:'Income Growth vs Interest Rate',min:9,lvl:'Advanced',
sub:'The key test of a deleveraging: nominal income must grow faster than the interest rate on the debt.',
keys:'nominal growth interest rate r g debt dynamics debt to income reflation financial repression',
learn:['The debt-dynamics formula','Why nominal growth matters, not just real','How printing tips the balance','Why too much inflation backfires'],
cheat:['With no new borrowing: <b>debt ÷ income next year = today × (1 + r) ÷ (1 + g)</b>.','r = average interest rate on debt; g = <b>nominal</b> income growth (real growth + inflation).','If g > r the burden falls by itself; if g < r it rises even with no new debt.','Printing helps by lowering r and raising g. Too much printing raises r too (lenders demand more), and hurts real growth.'],
met:[['gap','g − r','scale'],['d','Debt ÷ income (yr 12)','scale']],
draw(si,g){
  if(si===0)return g.T(430,140,'d₁ = d₀ × (1 + r) ÷ (1 + g)',{a:'middle',cls:'b',size:22})+g.panel(160,200,'r: interest rate on the debt',['what the debt grows by'],'red',{w:260})+g.panel(470,200,'g: nominal income growth',['real growth + inflation'],'green',{w:260});
  const P=g.plot({x:90,y:40,w:640,h:350,xr:[0,12],yr:[1.5,5],nx:6,ny:7,yl:'debt ÷ income'});let s=P.svg;
  GR.slice(0,si===1?3:3).forEach(x=>{s+=P.line(x.v,x.c,{w:3})+g.T(P.sx(12)+6,P.sy(x.v[12][1])+4,x.l,{cls:'b',c:x.c})});
  if(si===2)s+=P.line(R.beautiful.rows.map(r=>[r.y,r.d]),'blue',{w:3,cls:'dash'})+g.T(P.sx(6),P.sy(R.beautiful.rows[6].d)-12,'Nusa, balanced plan',{a:'middle',cls:'b',c:'blue'});
  return s+yl(g,P,[1.5,2.5,3.5,4.5],v=>(v*100).toFixed(0)+'%')+yx(g,P);
},
steps:[
 {k:'math',t:'The one formula',short:'Formula',
  b:'If nobody borrows more or repays early, debt grows at the interest rate <b>r</b> and income grows at <b>g</b>. So the burden next year is today’s × (1 + r) ÷ (1 + g). Dalio: in a deleveraging, income growth must exceed the interest rate for the burden to fall.'},
 {k:'insight',t:'Three paths from 300%',short:'Paths',m:{gap:'+2 / 0 / −2 pts',d:`${(GR[0].v[12][1]*100).toFixed(0)}% / 300% / ${(GR[2].v[12][1]*100).toFixed(0)}%`},
  b:`Start at 300% with a 4% rate on the debt. Nominal growth of 6% brings the burden down to <b>${(GR[0].v[12][1]*100).toFixed(0)}%</b> in 12 years with no defaults or cuts. At 2% growth it climbs to <b>${(GR[2].v[12][1]*100).toFixed(0)}%</b>.\n\n<b>g</b> is nominal: inflation counts. That is why a little inflation is so valuable in a deleveraging.`},
 {k:'solution',t:'How the balanced plan does it',short:'Nusa',
  b:'Nusa’s balanced plan works mainly through this formula: printing pushes the rate on debt down and nominal growth up, so g gets above r. Restructuring and cuts do the rest. But print too much and lenders demand higher rates and real growth suffers, so g − r stops improving.',
  ch:['+ Lower r: printing, restructuring','+ Higher g: stimulus, mild inflation','- Too much inflation raises r']}
]});

/* ======================================================= lost decade */
const LD=R.beautiful.rows;let lvl=1;const LV=LD.map(r=>{if(r.y)lvl*=1+r.real;return [r.y,lvl]});const TRD=LD.map(r=>[r.y,Math.pow(1.02,r.y)]);
ML.add({id:'lost-decade',title:'The Lost Decade',min:9,lvl:'Intermediate',
sub:'Even a good deleveraging takes about ten years before debt burdens and activity get back to normal.',
keys:'lost decade japan 1990s great depression recovery reflation output gap hysteresis',
learn:['Why deleveragings take so long','The gap that never quite closes','Japan’s lost decades','How the next long cycle begins'],
cheat:['Deleveragings typically take ≈10 years: Dalio calls it a <b>lost decade</b>.','Output falls below its old trend and often never fully catches up.','Japan after 1990 (with slow, timid policy) lost more than a decade; the US took roughly a decade after 1929 and after 2008.','Once debt burdens are back down, a new long-term debt cycle can begin.'],
met:[['gap','Below old trend (yr 10)','trend'],['d','Debt ÷ income (yr 10)','scale']],
draw(si,g){
  const P=g.plot({x:90,y:40,w:640,h:350,xr:[0,12],yr:[.85,1.3],nx:6,ny:3,yl:'real income (start = 1)'});let s=P.svg;
  s+=P.line(TRD,'gray',{w:2,cls:'dash'})+g.T(P.sx(12)+6,P.sy(TRD[12][1])+4,'old trend',{cls:'b',c:'gray'});
  s+=P.line(LV.slice(0,si===0?4:13),'green',{w:3})+g.T(P.sx(si===0?3:12)+6,P.sy(LV[si===0?3:12][1])+4,'Nusa',{cls:'b',c:'green'});
  if(si>=1){s+=g.poly([...TRD.map(([x,y])=>[P.sx(x),P.sy(y)]),...LV.slice().reverse().map(([x,y])=>[P.sx(x),P.sy(y)])],'red',.15)+g.pill(P.sx(6),P.sy((TRD[6][1]+LV[6][1])/2),'lost output','red')}
  return s+yl(g,P,[.85,1,1.15,1.3],v=>v.toFixed(2))+yx(g,P);
},
steps:[
 {k:'setup',t:'The hole',short:'Hole',
  b:'Even in Nusa’s balanced plan, real incomes fall in the first two years and only start growing again in year 4. A deleveraging takes years because debts have to be worked down slowly and confidence returns slowly.'},
 {k:'insight',t:'A lost decade',short:'Decade',m:{gap:F.p(LV[10][1]/TRD[10][1]-1,0),d:`${(LD[10].d*100).toFixed(0)}%`},
  b:`Ten years in, Nusa is still about <b>${F.p(1-LV[10][1]/TRD[10][1],0)}</b> below where its old trend would have put it. The shaded area is output that was never produced. Dalio: it typically takes about a decade for debt burdens to fall and activity to normalise.`},
 {k:'history',t:'Real lost decades',short:'History',
  b:'Japan after its 1990 bubble moved slowly and timidly and lost two decades of growth. The US needed roughly a decade after 1929 and again after 2008. Once debt burdens are low again, lenders and borrowers forget, and a new long-term debt cycle quietly begins.',
  tip:['Real data','Compare FRED GDPC1 (US real GDP) with its pre-2008 trend.']}
]});

/* ======================================================= three rules of thumb */
ML.add({id:'three-rules',title:'Dalio’s Three Rules of Thumb',min:7,lvl:'Beginner',
sub:'Three rules that tie the whole machine together, for policymakers and for anyone running a household or business.',
keys:'three rules of thumb dalio debt income productivity summary recap',
learn:['Don’t let debt rise faster than income','Don’t let income rise faster than productivity','Do all you can to raise productivity','How the whole course fits together'],
cheat:['1. <b>Don’t have debt rise faster than income</b>: debt burdens will eventually crush you.','2. <b>Don’t have income rise faster than productivity</b>: you will become uncompetitive.','3. <b>Do all you can to raise your productivity</b>: in the long run, that is what matters most.'],
met:[['r','Rule','check']],
hero:0,
draw(si,g){
  const rules=[['Debt ≤ income growth','or the burden crushes you','red','scale'],['Income ≤ productivity growth','or you become uncompetitive','orange','trend'],['Raise productivity','what matters most in the long run','green','sparkle']];
  let s='';rules.forEach(([t,sub,c,ic],i)=>{const x=150+i*280;s+=g.icon(ic,x,120,36)+g.box(x,210,240,96,t,c,{hot:si===3||si===i,dim:si<3&&si!==i,sub})+g.T(x,290,'Rule '+(i+1),{a:'middle',cls:'b'})});
  if(si===3)s+=g.T(430,360,'Productivity is the trend. Credit makes the cycles. Policy decides how painful they are.',{a:'middle',cls:'b'});
  return s;
},
steps:[
 {k:'recap',t:'Rule 1',short:'Debt',m:{r:'1'},
  b:'<b>Don’t have debt rise faster than income</b>, because your debt burdens will eventually crush you. This is the long-term debt cycle in one sentence (lessons 2.7, 5.4, 6.7).'},
 {k:'recap',t:'Rule 2',short:'Income',m:{r:'2'},
  b:'<b>Don’t have income rise faster than productivity</b>, because you will eventually become uncompetitive. Wages and spending pumped up by credit, rather than by producing more, don’t last (lessons 1.2, 4.3).'},
 {k:'recap',t:'Rule 3',short:'Productivity',m:{r:'3'},
  b:'<b>Do all that you can to raise your productivity</b>, because in the long run that is what matters most (lesson 5.1).'},
 {k:'recap',t:'The whole machine',short:'All',m:{r:'1 · 2 · 3'},
  b:'Transactions add up to markets; credit lets spending run ahead of income; the central bank steers credit with rates; the short and long debt cycles ride on top of productivity; and when debt peaks, four levers bring it down. Dalio’s hope: understand the machine and you can see what is happening and why.',
  tip:['Keep going','Open the Lab to steer the machine yourself, or the Cheatsheet for every formula on one page.']}
]});
})();
