/* 02 · Credit, Loans & Interest */
(function(){const U=ML.U,E=ML.EC,F=E.F;

/* ======================================================= credit */
ML.add({id:'credit',title:'Credit',min:8,lvl:'Beginner',
sub:'A promise to pay later. It spends just like money, and it makes up most of what people call money.',
keys:'credit lender borrower promise buying power creditor debtor money supply',
learn:['What credit is','Lenders and borrowers','Why credit spends like money','Why there is far more credit than money'],
cheat:['<b>Credit</b> = buying power created by a promise to repay in the future.','A <b>lender</b> wants their money to make more money; a <b>borrower</b> wants something they cannot afford yet.','Credit is created the moment both agree; it appears out of thin air.','Dalio (2013): the US had about $3 trillion of money and about $50 trillion of credit.'],
met:[['bp','Sari’s buying power','dollar'],['ow','Sari owes','alert']],
draw(si,g){
  const s=[];
  if(si<=1){
    s.push(g.actor(200,250,'Bank Nusa','blue',{s:1.5,sub:'lender'}),g.actor(660,250,'Sari','orange',{s:1.5,sub:'borrower'}));
    s.push(g.panel(80,60,'Lender wants',['money to make more money','(interest)'],'blue',{w:240}),g.panel(540,60,'Borrower wants',['a $1,000 espresso machine','she can’t pay for yet'],'orange',{w:250}));
    if(si===1)s.push(g.box(430,370,300,60,'"I will pay you back, plus interest"','yellow',{hot:1}));
  }else if(si===2){
    s.push(g.box(200,150,240,70,'Sari’s buying power','orange',{sub:'before: $200 cash',hot:1}),g.box(620,150,260,70,'Sari’s buying power','orange',{sub:'after: $200 + $1,000 credit',hot:1}));
    s.push(g.A(330,150,480,150,{c:'pink',w:2.2,l:'+ credit'}));
    s.push(g.actor(620,330,'Machine seller','green',{s:1.1,sub:'gets $1,000 of income'}));
  }else{
    s.push(g.T(430,60,'What people call “money” is mostly credit (Dalio, US, 2013)',{a:'middle',cls:'b'}));
    s.push(g.stack(330,90,200,330,[['Money ≈ $3T',3,'yellow'],['Credit ≈ $50T',50,'pink']],{fmt:v=>'$'+v+'T'}));
  }
  return s.join('');
},
anim(si,t,g){if(si!==1)return '';const k=(t%3)/3;return g.coin(U.lerp(260,600,U.ease(k)),250,'$')},
steps:[
 {k:'setup',t:'Two sides',short:'Two sides',m:{bp:'$200',ow:'$0'},
  b:'Sari has $200 but wants a $1,000 espresso machine. Bank Nusa has money and wants it to earn more money. They are a natural match: a <b>borrower</b> and a <b>lender</b>.'},
 {k:'technique',t:'A promise appears',short:'Promise',m:{bp:'$1,200',ow:'$1,000 + interest'},
  b:'Sari promises to repay $1,000 plus interest. The bank agrees. In that moment <b>credit</b> is created, out of thin air. Nothing physical moved; two people simply agreed.',
  ch:['+ Credit only exists because the lender trusts the promise']},
 {k:'insight',t:'Credit spends like money',short:'Spends',
  b:'Sari walks into the shop and buys the machine. The seller cannot tell whether her $1,000 was saved or borrowed: it is income either way. That is why credit is so powerful: it adds to total spending immediately.'},
 {k:'insight',t:'Most “money” is credit',short:'How much',
  b:'In his 2013 video Dalio notes that the US had about $3 trillion of actual money and about $50 trillion of credit. When we talk about “money” sloshing around the economy, we are mostly talking about credit.',
  ch:['! Credit can be created fast and destroyed fast; money cannot']}
]});

/* ======================================================= principal & interest */
const LN=E.loan(1000,.10,5),LN5=E.loan(1000,.05,5),LN15=E.loan(1000,.15,5);
ML.add({id:'principal-interest',title:'Principal & Interest',min:9,lvl:'Beginner',
sub:'What you borrow (principal) and what you pay for borrowing it (interest), and how the rate changes the bill.',
keys:'principal interest rate loan amortization payment schedule annuity mortgage',
learn:['Principal vs interest','How a repayment schedule works','How the rate changes the payment','Why high rates discourage borrowing'],
cheat:['<b>Principal</b> = the amount borrowed. <b>Interest</b> = the extra paid for borrowing it.','Level payment = P × r ÷ (1 − (1+r)<sup>−n</sup>).','Early payments are mostly interest; later ones mostly principal.','Higher rates → bigger payments → fewer people borrow. Lower rates → the reverse.'],
met:[['pay','Yearly payment','dollar'],['ti','Total interest','alert'],['r','Rate','scale']],
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.stack(250,70,170,340,[['Principal $1,000',1000,'blue'],['Interest (10% a year, 5 years)',LN.totI,'orange']],{fmt:v=>F.d(v),title:'What Sari repays'}));
  }else if(si===1){
    s.push(g.T(60,50,`5-year loan of $1,000 at 10%: each year Sari pays ${F.d(LN.pay)}`,{cls:'b'}));
    const mx=LN.pay;LN.rows.forEach((r,i)=>{const x=110+i*140,h=300;const ih=r.i/mx*h,ph=r.pr/mx*h;
      s.push(g.R(x,400-ih,80,ih,{fill:'color-mix(in srgb,var(--orange) 45%,var(--mixbase))',stroke:'var(--edge)',sw:1.2}),g.R(x,400-ih-ph,80,ph,{fill:'color-mix(in srgb,var(--blue) 40%,var(--mixbase))',stroke:'var(--edge)',sw:1.2}),g.T(x+40,418,'year '+r.y,{a:'middle',cls:'m'}),g.T(x+40,400-ih/2+4,F.d(r.i),{a:'middle',cls:'b',size:10.5}),g.T(x+40,400-ih-ph/2+4,F.d(r.pr),{a:'middle',cls:'b',size:10.5}))});
    s.push(g.T(760,120,'■ principal',{c:'blue',cls:'b'}),g.T(760,140,'■ interest',{c:'orange',cls:'b'}));
  }else if(si===2){
    const rows=[['5%',LN5.pay],['10%',LN.pay],['15%',LN15.pay]];
    s.push(g.T(60,50,'Same $1,000 for 5 years, different rates: yearly payment',{cls:'b'}),g.bars(160,90,520,300,rows.map(r=>r[1]),{labels:rows.map(r=>'rate '+r[0]),c:['green','yellow','red'],fmt:v=>F.d(v),gap:90,max:350}));
  }else{
    s.push(g.box(200,150,240,70,'Rates up','red',{hot:1,sub:'payments rise'}),g.box(640,150,240,70,'Rates down','green',{hot:1,sub:'payments fall'}));
    s.push(g.panel(80,240,'So people…',['borrow less','spend less','existing variable-rate','  loans cost more'],'red',{w:250}),g.panel(520,240,'So people…',['borrow more','spend more','refinance cheaper'],'green',{w:250}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Two parts of every loan',short:'Parts',m:{pay:F.d(LN.pay),ti:F.d(LN.totI),r:'10%'},
  b:`Sari borrows <b>$1,000</b>: that is the <b>principal</b>. The bank charges <b>10% a year</b>: that is the <b>interest rate</b>. Over five years she pays back the $1,000 plus <b>${F.d(LN.totI)}</b> of interest.`},
 {k:'math',t:'The repayment schedule',short:'Schedule',
  b:`With a level payment she pays <b>${F.d(LN.pay)}</b> every year. Early on most of it is interest, because she still owes a lot. As the balance shrinks, more of each payment goes to principal.\n\nPayment = P × r ÷ (1 − (1 + r)<sup>−n</sup>).`},
 {k:'insight',t:'The rate sets the bill',short:'Rates',m:{pay:`${F.d(LN5.pay)} → ${F.d(LN15.pay)}`},
  b:`At 5% the yearly payment is <b>${F.d(LN5.pay)}</b>; at 15% it is <b>${F.d(LN15.pay)}</b>. Same machine, very different burden.\n\nThis is the lever the central bank pulls: by moving rates it changes what every new loan costs.`},
 {k:'recap',t:'Why rates move the economy',short:'Effect',
  b:'Higher rates make borrowing expensive and raise payments on existing variable-rate debt, so people borrow and spend less. Lower rates do the opposite. Through credit, the interest rate reaches almost every transaction in the economy.'}
]});

/* ======================================================= debt */
ML.add({id:'debt',title:'Debt: Asset & Liability',min:7,lvl:'Beginner',
sub:'Once credit is created it becomes debt: an asset for the lender and a liability for the borrower.',
keys:'debt asset liability balance sheet lender borrower repay creditor debtor',
learn:['Why credit turns into debt','One loan, two balance sheets','What happens when it is repaid','Why one person’s debt is another’s asset'],
cheat:['As soon as credit is created it becomes <b>debt</b>.','For the lender it is an <b>asset</b> (they will be paid). For the borrower it is a <b>liability</b> (they must pay).','When the debt is repaid, both the asset and the liability disappear.','Total debts = total financial assets that are claims on debtors. A default destroys both.'],
met:[['a','Bank asset','check'],['l','Sari liability','alert']],
draw(si,g){
  const s=[];const loan=si===3?0:1000;
  const tacct=(x,title,c,L,R)=>g.R(x,90,320,230,{rx:10,fill:'var(--bg)',stroke:'var(--edge)',sw:1.5})+g.T(x+160,115,title,{a:'middle',cls:'b'})+g.L([[x+10,128],[x+310,128]],'ink')+g.L([[x+160,128],[x+160,310]],'ink')+g.T(x+80,148,'Assets',{a:'middle',cls:'m'})+g.T(x+240,148,'Liabilities',{a:'middle',cls:'m'})+L.map((l,i)=>g.T(x+15,180+i*24,l,{cls:'b',c:i===0&&l.includes('1,000')?c:null})).join('')+R.map((l,i)=>g.T(x+175,180+i*24,l,{cls:'b',c:l.includes('1,000')?'red':null})).join('');
  s.push(tacct(60,'Bank Nusa','blue',[`Loan to Sari ${F.d(loan)}`,'Reserves …'],['Deposits …']));
  s.push(tacct(480,'Sari','orange',[si>=1&&si<3?'Espresso machine $1,000':'Cash $200',si>=1&&si<3?'Cash $200':''],[`Loan from bank ${F.d(loan)}`]));
  if(si===2)s.push(g.panel(250,350,'Same $1,000, seen from both sides',['bank: “someone owes me $1,000” (asset)','Sari: “I owe $1,000” (liability)'],'yellow',{w:380}));
  if(si===3)s.push(g.panel(250,350,'Repaid',['both entries disappear','the credit no longer exists'],'green',{w:300}));
  return s.join('');
},
steps:[
 {k:'setup',t:'Credit becomes debt',short:'Debt',m:{a:'$1,000',l:'$1,000'},
  b:'The moment Bank Nusa grants Sari $1,000 of credit, a <b>debt</b> exists. The bank records a loan it will collect; Sari records a loan she must repay.'},
 {k:'technique',t:'Two balance sheets',short:'Books',
  b:'Sari uses the credit to buy the machine, so her assets now include a $1,000 machine, and her liabilities include a $1,000 loan. The bank’s assets include the $1,000 loan to Sari.'},
 {k:'insight',t:'One debt, two views',short:'Two views',
  b:'The same $1,000 is an <b>asset</b> to the lender and a <b>liability</b> to the borrower. This is why debt problems spread: if Sari cannot pay, the bank’s assets shrink too, and so does what the bank can lend to others.',
  ch:['! Every debt in the economy is somebody else’s asset']},
 {k:'recap',t:'Repayment makes it vanish',short:'Repaid',m:{a:'$0',l:'$0'},
  b:'When Sari repays, the loan disappears from both sides. Credit created out of thin air goes back into thin air. In a credit economy, credit and debt are constantly being created and destroyed.'}
]});

/* ======================================================= money vs credit */
ML.add({id:'money-vs-credit',title:'Money vs Credit',min:7,lvl:'Beginner',
sub:'Money settles a deal right away. Credit settles it later, and leaves a debt in between.',
keys:'money settlement credit obligation future repayment cash card',
learn:['What “settlement” means','Why credit leaves an obligation','How credit creates and destroys spending','Why most of the economy runs on credit'],
cheat:['<b>Money</b> settles a transaction immediately: nobody owes anything afterwards.','<b>Credit</b> creates a future obligation that settles only when repaid.','Spending with credit now means spending less than income later, when repaying.','Most transactions in a modern economy use credit, not money.'],
met:[['st','Settled?','check']],
draw(si,g){
  const s=[];
  const tl=(y,lbl,c,steps)=>g.T(70,y-24,lbl,{cls:'b',c})+g.L([[90,y],[790,y]],'gray',{w:3})+steps.map(([x,t,sub],i)=>g.C(x,y,9,c)+g.T(x,y+26,t,{a:'middle',cls:'b',size:10.5})+(sub?g.T(x,y+40,sub,{a:'middle',cls:'m',size:10}):'')).join('');
  s.push(tl(120,'Pay with money','yellow',[[150,'buy','today'],[230,'settled ✓','today']]));
  if(si>=1)s.push(tl(260,'Pay with credit','pink',[[150,'buy','today'],[400,'still owed','…'],[740,'settled ✓','when repaid']]));
  if(si>=2)s.push(g.R(160,240,570,40,{rx:8,fill:'var(--pink-bg)',op:.5}),g.T(445,330,'an obligation exists the whole time',{a:'middle',cls:'m'}));
  if(si===3)s.push(g.panel(220,370,'In the economy',['credit created → spending above income now','credit repaid → spending below income later'],'yellow',{w:420}));
  return s.join('');
},
steps:[
 {k:'setup',t:'Money settles now',short:'Money',m:{st:'yes, now'},
  b:'When Sari pays Budi in cash, the deal is finished. Nobody owes anyone anything. That is what Dalio means by money <b>settling</b> a transaction.'},
 {k:'technique',t:'Credit settles later',short:'Credit',m:{st:'later'},
  b:'When Sari pays with credit, Budi is paid, but the transaction is not settled until Sari repays the bank. Until then there is a debt.'},
 {k:'insight',t:'The obligation in between',short:'In between',
  b:'That gap between buying and repaying is where cycles come from. Borrowing lets people spend more than their income today; repaying forces them to spend less than their income tomorrow.',
  ch:['+ Borrowing = spending pulled forward from the future']},
 {k:'recap',t:'A credit economy',short:'Credit economy',
  b:'Most spending in a modern economy uses credit: cards, mortgages, business loans, bonds. So the economy’s ups and downs are mostly about credit being created faster or slower than it is being repaid.'}
]});

/* ======================================================= creditworthiness */
const CW=[['Sari, before',3000,600,0],['Sari, a good year',4000,600,1000],['Sari, house rising',4000,600,2000]];
ML.add({id:'creditworthiness',title:'Creditworthiness',min:9,lvl:'Beginner',
sub:'Lenders lend to people who can repay: those with enough income relative to their debt, and collateral to fall back on.',
keys:'creditworthiness credit score debt to income collateral loan to value lending standards reflexive',
learn:['Ability to repay: income vs debt','Collateral: what can be sold','Why rising income brings more credit','The self-reinforcing loop, up and down'],
cheat:['Creditworthy = <b>able to repay</b> (income high relative to debt) + <b>collateral</b> (assets that can be sold if needed).','Debt-to-income (DTI) and debt-service ratios measure ability to repay; loan-to-value (LTV) measures collateral cover.','Rising incomes and asset prices make borrowers more creditworthy → more credit → more spending → higher incomes. The loop also runs in reverse.'],
met:[['dti','Debt service ÷ income','scale'],['col','Collateral','lock'],['can','Can borrow','dollar']],
draw(si,g){
  const s=[];
  if(si===0||si===1){
    const [l,inc,ds]=CW[si];
    s.push(g.gauge(240,260,130,ds/inc/.4,'debt service ÷ income (limit 40%)',ds/inc>.3?'red':'green',F.p(ds/inc,0)));
    s.push(g.panel(470,120,l,[`monthly income  ${F.d(inc)}`,`debt payments   ${F.d(ds)}`,`lender limit    40% of income`,`→ room to borrow ${F.d(inc*.4-ds)} / month`],'blue',{w:330}));
  }else if(si===2){
    s.push(g.stack(180,90,150,300,[['Loan $200k',200,'red'],['Equity $100k',100,'green']],{title:'House worth $300k',fmt:v=>'$'+v+'k'}));
    s.push(g.stack(520,90,150,300,[['Loan $200k',200,'red'],['Equity $200k',200,'green']],{title:'House worth $400k',fmt:v=>'$'+v+'k'}));
    s.push(g.T(255,420,'LTV 67%',{a:'middle',cls:'b'}),g.T(595,420,'LTV 50% → can borrow more',{a:'middle',cls:'b'}));
  }else{
    const L=['more income','more credit','more spending','other people’s income'];
    L.forEach((t,i)=>{const a=i/4*Math.PI*2-Math.PI/2,x=430+Math.cos(a)*190,y=240+Math.sin(a)*140;s.push(g.box(x,y,190,50,t,['green','pink','orange','blue'][i],{hot:1}));const a2=(i+1)/4*Math.PI*2-Math.PI/2;s.push(g.A(x+Math.cos(a+.5)*40,y+Math.sin(a+.5)*30,430+Math.cos(a2)*190-Math.cos(a2-.5)*40,240+Math.sin(a2)*140-Math.sin(a2-.5)*30,{c:'edge',curve:30}))});
    s.push(g.T(430,245,'self-reinforcing',{a:'middle',cls:'b'}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Ability to repay',short:'Income',m:{dti:'20%',can:F.d(600)+'/mo more'},
  b:'Before lending, Bank Nusa asks: can Sari repay? It compares her debt payments ($600 a month) with her income ($3,000). At <b>20%</b> she is well under the bank’s 40% limit, so she can borrow more.'},
 {k:'insight',t:'Income goes up, borrowing power goes up',short:'Good year',m:{dti:'15%',can:F.d(1000)+'/mo more'},
  b:'A good year lifts Sari’s income to $4,000. Her existing payments are now only <b>15%</b> of income, so the bank will lend her even more. Nothing about Sari changed except her income, and that income came from other people’s spending.'},
 {k:'technique',t:'Collateral',short:'Collateral',m:{col:'house'},
  b:'The second test is <b>collateral</b>: something the lender can sell if Sari cannot pay. If her house rises from $300k to $400k with the same $200k loan, the <b>loan-to-value</b> falls from 67% to 50% and she can borrow against the extra equity.',
  ch:['! Collateral values are set by markets, so they fall in a bust exactly when lenders need them']},
 {k:'recap',t:'The loop',short:'The loop',
  b:'Income up → more creditworthy → more credit → more spending → more income for others → they become more creditworthy. Dalio calls this self-reinforcing pattern the engine of the upswing. It runs just as hard in reverse.'}
]});

/* ======================================================= productive vs unproductive credit */
ML.add({id:'productive-credit',title:'Productive vs Unproductive Credit',min:8,lvl:'Beginner',
sub:'Borrowing that raises income can pay for itself. Borrowing for consumption must be repaid out of future spending.',
keys:'productive credit investment consumption return on investment debt bad debt good debt',
learn:['Credit that funds income-generating investment','Credit that funds consumption','Why productive credit pays itself back','Why credit is neither good nor bad by itself'],
cheat:['<b>Productive credit</b> funds something that raises income (a machine, a skill, a factory): the extra income repays the loan.','<b>Unproductive credit</b> funds consumption that does not raise income: it must be repaid by cutting future spending.','Credit is good when it raises productivity and income faster than debt; harmful when it fuels spending that cannot be repaid.'],
met:[['ret','Extra income / yr','trend'],['pay','Loan payment / yr','dollar']],
draw(si,g){
  const s=[];
  const pay=E.loan(1000,.10,5).pay;
  if(si<=1){
    const isM=si===0;s.push(g.icon(isM?'cpu':'img',430,90,48));
    s.push(g.T(430,150,isM?'Sari borrows $1,000 for an espresso machine':'Ani borrows $1,000 for a big TV',{a:'middle',cls:'b'}));
    s.push(g.bars(220,190,420,190,[isM?360:0,pay],{labels:['extra income a year','loan payment a year'],c:[isM?'green':'gray','orange'],fmt:v=>F.d(v),gap:120,max:400}));
    s.push(g.T(430,430,isM?'pays for itself, with $'+Math.round(360-pay)+' to spare':'must come out of future spending',{a:'middle',cls:'b',c:isM?'green':'red'}));
  }else{
    s.push(g.panel(80,90,'Helpful',['funds investment','raises productivity and income','income grows faster than debt'],'green',{w:320}),g.panel(470,90,'Harmful',['funds consumption','no extra income','debt grows faster than income'],'red',{w:320}));
    s.push(g.T(430,300,'Same loan, same rate. The difference is what it is used for.',{a:'middle',cls:'b'}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Productive credit',short:'Productive',m:{ret:'$360',pay:F.d(E.loan(1000,.10,5).pay)},
  b:'Sari’s new machine lets her sell 40 more coffees a week, about $360 a year of extra profit. Her loan costs about $264 a year. The machine <b>pays for itself</b>, and Nusa now produces more coffee.'},
 {k:'problem',t:'Unproductive credit',short:'Consumption',m:{ret:'$0'},
  b:'Ani borrows the same $1,000 for a big TV. She enjoys it, but it earns nothing. Every payment must come out of her future spending, so later she will buy less from everyone else.'},
 {k:'recap',t:'Not good or bad by itself',short:'Judge it',
  b:'Credit is <b>helpful</b> when it funds things that raise income and productivity, and <b>harmful</b> when it funds consumption that cannot be repaid. Dalio’s warning: in a boom, it becomes easy to mistake borrowed spending for real prosperity.',
  ch:['+ Productive: income rises faster than debt','- Unproductive: debt rises faster than income']}
]});

/* ======================================================= compounding */
const CP=U.range(31).map(y=>({y,debt:100*Math.pow(1.07,y),inc:100*Math.pow(1.04,y)}));
ML.add({id:'compounding',title:'Compounding & Debt Service',min:9,lvl:'Intermediate',
sub:'Unpaid interest earns interest. When debt compounds faster than income, the burden grows every year.',
keys:'compound interest rule of 72 debt service ratio debt to income growth rate exponential',
learn:['How compound interest works','The rule of 72','Debt growing faster than income','The debt-service ratio'],
cheat:['Debt that is not repaid grows by (1 + r) every year: <b>compounding</b>.','<b>Rule of 72</b>: years to double ≈ 72 ÷ rate in %.','If debt grows at 7% and income at 4%, debt ÷ income rises every year.','<b>Debt-service ratio</b> = (interest + principal due) ÷ income.'],
met:[['dbl','Doubling time','clock'],['ratio','Debt ÷ income','scale']],
draw(si,g){
  const s=[];const n=si===0?10:30;
  const P=g.plot({x:80,y:40,w:640,h:360,xr:[0,30],yr:[0,800],nx:6,ny:4,yl:'$'});
  s.push(P.svg,P.line(CP.slice(0,n+1).map(p=>[p.y,p.debt]),'red',{w:3}));
  if(si>=1)s.push(P.line(CP.map(p=>[p.y,p.inc]),'green',{w:3}),g.T(P.sx(30)+6,P.sy(CP[30].inc)+4,'income +4%',{cls:'b',c:'green'}));
  s.push(g.T(P.sx(n)+6,P.sy(CP[n].debt)+4,'debt +7%',{cls:'b',c:'red'}));
  if(si===0)s.push(g.L([[P.sx(10.24),P.sy(0)],[P.sx(10.24),P.sy(200)]],'gray',{cls:'dash thin'}),g.pill(P.sx(10.24)+90,P.sy(90),'doubles in ~10 yrs','yellow'));
  [0,10,20,30].forEach(v=>s.push(g.T(P.sx(v),P.y+P.h+14,'year '+v,{a:'middle',cls:'m'})));
  [0,200,400,600,800].forEach(v=>s.push(g.T(P.x-6,P.sy(v)+3,v,{a:'end',cls:'m'})));
  if(si===2){s.push(g.panel(110,80,'Debt ÷ income',['year 0   100%',`year 10  ${F.p(CP[10].debt/CP[10].inc,0)}`,`year 20  ${F.p(CP[20].debt/CP[20].inc,0)}`,`year 30  ${F.p(CP[30].debt/CP[30].inc,0)}`],'red',{w:180}))}
  return s.join('');
},
steps:[
 {k:'setup',t:'Interest on interest',short:'Compounding',m:{dbl:'≈ 10 yrs'},
  b:'If $100 of debt is never repaid at 7%, next year it is $107, then $114.49, and so on: interest is charged on past interest. It <b>doubles in about 10 years</b>.\n\nRule of 72: 72 ÷ 7 ≈ 10.'},
 {k:'problem',t:'Faster than income',short:'Race',m:{ratio:`${F.p(CP[30].debt/CP[30].inc,0)} at yr 30`},
  b:'Now put income next to it. If income grows 4% a year and debt 7%, the gap widens every year. After 30 years the debt is <b>'+F.p(CP[30].debt/CP[30].inc,0)+'</b> of where it started relative to income.'},
 {k:'math',t:'The debt-service ratio',short:'Burden',
  b:'What hurts is not the debt itself but the <b>debt service</b>: the interest and principal due each year, as a share of income. It rises when debt grows faster than income, or when rates go up.\n\nThis ratio is the gauge to watch in the long-term debt cycle (lesson 5.5).',
  tip:['Real data','The Federal Reserve publishes the US household debt-service ratio (FRED series TDSP).']}
]});
})();
