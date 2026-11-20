/* 02 · Supervised learning */
(function(){const U=ML.U;

/* ======================================================= linear regression */
ML.add({id:'linear-regression',title:'Linear Regression',min:9,lvl:'Beginner',
sub:'Fit the straight line that best predicts a number, and see what "best" means.',
keys:'least squares ols mse residual slope intercept normal equation',
learn:['The model ŷ = w·x + b','Residuals and mean squared error','Fitting by gradient descent and by formula','Many features at once'],
cheat:['ŷ = w·x + b; with many features ŷ = w·x + b (a dot product).','Least squares minimises the sum of squared residuals.','Closed form: w = (XᵀX)⁻¹Xᵀy; or gradient descent for big data.','Check residual plots: patterns mean the line is the wrong shape.'],
met:[['w','Slope w','scale'],['b','Intercept b','hash'],['mse','MSE','chart']],
hero:3,
setup(){const r=U.rng(4);this.d=U.range(18).map(()=>{const x=0.6+r()*8.8;return {x,y:12+2.9*x+U.gauss(r)*3.4,c:'blue'}});
  const n=this.d.length,mx=this.d.reduce((s,p)=>s+p.x,0)/n,my=this.d.reduce((s,p)=>s+p.y,0)/n;
  const w=this.d.reduce((s,p)=>s+(p.x-mx)*(p.y-my),0)/this.d.reduce((s,p)=>s+(p.x-mx)**2,0);this.fit=[w,my-w*mx];
  this.mse=(w,b)=>this.d.reduce((s,p)=>s+(w*p.x+b-p.y)**2,0)/n;
  // GD path (feature-centred for stable steps, reported in original units)
  let W=0,B=my-0*mx;const path=[[W,B]];for(let i=0;i<40;i++){let gw=0,gb=0;this.d.forEach(p=>{const e=W*p.x+B-p.y;gw+=2*e*p.x/n;gb+=2*e/n});W-=0.012*gw;B-=0.05*gb;path.push([W,B])}this.path=path;
  const [fw,fb]=this.fit;this.steps[1].m={w:'1.0',b:'25.0',mse:this.mse(1,25).toFixed(1)};this.steps[3].m={w:fw.toFixed(2),b:fb.toFixed(2),mse:this.mse(fw,fb).toFixed(1)};this.steps[4].m=this.steps[3].m;
},
draw(si,g){
  const s=[];const P=g.plot({x:60,y:30,w:470,h:390,xr:[0,10],yr:[0,50],xl:'house size (100 m²)',yl:'price ($10k)',ticks:1,nx:5,ny:5});this.P=P;
  if(si<=4){s.push(P.svg);
    const [w,b]=si===1||si===2?[1,25]:this.fit;
    if(si>=1&&si!==3){s.push(P.line([[0,b],[10,w*10+b]],si===1||si===2?'red':'green'));const sq=[];
      this.d.forEach(p=>{const yh=w*p.x+b;if(si===2){const side=Math.abs(P.sy(yh)-P.sy(p.y));sq.push(g.R(P.sx(p.x),Math.min(P.sy(yh),P.sy(p.y)),side,side,{fill:'var(--red)',op:.12,stroke:'var(--red)',sw:.8}))}else s.push(`<line x1="${P.sx(p.x)}" y1="${P.sy(p.y)}" x2="${P.sx(p.x)}" y2="${P.sy(yh)}" style="stroke:var(--${si===1?'red':'green'});stroke-width:1.4;stroke-dasharray:3 3"/>`)});s.push(P.clip(sq.join('')))}
    s.push(P.pts(this.d));
    if(si===0)s.push(g.panel(570,50,'Predict a number',['each dot = one house','x = size, y = price','','model: ŷ = w·x + b','w = slope, b = intercept'],'blue'));
    if(si===1)s.push(g.panel(570,50,'A first guess',['w = 1, b = 25','dashed = residual','  residual = y − ŷ','some above, some below'],'red'));
    if(si===2)s.push(g.panel(570,50,'Mean squared error',['square each residual','(the red squares)','average them:','MSE = (1/n) Σ (ŷᵢ − yᵢ)²',`= ${this.mse(1,25).toFixed(1)}`],'red'));
    if(si===3)s.push(g.panel(570,50,'Gradient descent',['∂MSE/∂w = (2/n) Σ eᵢ·xᵢ','∂MSE/∂b = (2/n) Σ eᵢ','nudge w and b downhill','the line swings into place'],'green'));
    if(si===4)s.push(g.panel(570,50,'Closed form (OLS)',['w = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)²','b = ȳ − w·x̄','',`→ w = ${this.fit[0].toFixed(2)}, b = ${this.fit[1].toFixed(2)}`,'same answer, no iterations'],'green'));
  }else{
    s.push(g.T(60,60,'Many features: still a weighted sum',{cls:'h'}));
    const f=[['size','3.1'],['bedrooms','1.8'],['age','−0.6'],['distance','−2.2']];
    f.forEach(([n,w],i)=>{s.push(g.box(140,130+i*70,120,46,n,'blue'),g.pill(300,130+i*70,'× '+w,w[0]==='−'?'red':'green'),g.A(200,130+i*70,520,235,{c:'gray',head:false,op:.6}))});
    s.push(g.box(560,235,90,90,'Σ + b','orange',{fs:15}),g.A(605,235,700,235),g.box(750,235,90,56,'ŷ','green',{fs:15}));
    s.push(g.T(60,440,'ŷ = w₁x₁ + w₂x₂ + … + b  =  w · x + b   ← the same dot product sits inside every neuron and every LLM layer',{cls:'m'}));
  }
  return s.join('');
},
anim(si,t,g){if(si!==3)return '';const P=this.P,n=this.path.length-1,i=Math.min(n,Math.floor((t*8)%(n+12)));const [w,b]=this.path[i];
  return g.L([[P.sx(0),P.sy(b)],[P.sx(10),P.sy(w*10+b)]],'orange')+g.pill(P.x+P.w-90,P.y+20,`iter ${i} · MSE ${this.mse(w,b).toFixed(1)}`,'orange')},
steps:[
 {k:'setup',t:'Predicting a number',short:'Data',
  b:'We have house sizes and prices. Bigger houses tend to cost more, roughly along a line. <b>Linear regression</b> finds that line so we can price a house we have not seen.\n\nThe model has just two parameters: slope <b>w</b> and intercept <b>b</b>.'},
 {k:'problem',t:'A first guess and its residuals',short:'Residuals',m:{},
  b:'Start with any line. For each house, the vertical gap between the true price and the line’s prediction is the <b>residual</b>.\n\nSome residuals are positive, some negative. We need a single score that says how bad the whole line is.'},
 {k:'math',t:'Mean squared error',short:'MSE',
  b:'Square each residual (so signs don’t cancel and big misses count extra) and average them. That is the <b>mean squared error</b>, the loss for regression.\n\nGeometrically: the total area of the red squares. Least squares = make that area as small as possible.'},
 {k:'solution',t:'Fit by gradient descent',short:'Fit (GD)',
  b:'Using the gradients of MSE with respect to w and b, gradient descent swings and lifts the line until the squares are as small as they can get.\n\nThis is exactly the loop from lesson 1.3, now with two weights.',
  n:['Predict with current w, b','Compute residuals','Step w and b against the gradient','Repeat until MSE stops falling']},
 {k:'technique',t:'Or solve it directly',short:'Closed form',
  b:'Linear regression is special: the minimum has a formula, the <b>normal equation</b> <code>w = (XᵀX)⁻¹Xᵀy</code>. One matrix solve, no learning rate.\n\nWith millions of rows or features, gradient descent is still preferred because the matrix inverse gets expensive.'},
 {k:'insight',t:'Many features',short:'Many features',m:{w:'vector',b:'1 number'},
  b:'Real problems have many inputs. The model becomes a <b>weighted sum</b> of all features plus a bias: a dot product <code>w · x + b</code>.\n\nEach weight says how much its feature pushes the prediction up or down. This weighted sum is the basic building block of neural networks and of every layer inside an LLM.',
  tip:['Before training','Scale features to similar ranges (standardise) so one big-number feature does not dominate the gradient.']}
]});

/* ======================================================= logistic regression */
ML.add({id:'logistic-regression',title:'Logistic Regression',min:10,lvl:'Beginner',
sub:'Turn a weighted sum into a probability with the sigmoid, and learn it with cross-entropy.',
keys:'sigmoid logit cross-entropy log loss classification softmax decision boundary',
learn:['Why a line is wrong for yes/no answers','The sigmoid squashes scores into probabilities','Cross-entropy loss','Decision boundaries and softmax for many classes'],
cheat:['p = σ(w·x + b), σ(z) = 1/(1+e⁻ᶻ).','Loss = cross-entropy: −[y log p + (1−y) log(1−p)].','Decision boundary w·x + b = 0 is a straight line (hyperplane).','Softmax generalises the sigmoid to K classes: exactly what an LLM’s last layer does.'],
met:[['z','Score z','hash'],['p','P(pass)','target'],['loss','Loss','chart']],
hero:3,
setup(){const r=U.rng(8);this.d1=U.range(26).map(()=>{const x=r()*10;return {x,y:r()<U.sigmoid(1.3*(x-5))?1:0}});
  this.d2=[...U.blob(r,30,3.2,6.6,1.2,1.2,'blue'),...U.blob(r,30,6.8,3.4,1.2,1.2,'orange')];},
draw(si,g){
  const s=[];
  if(si<=1){const P=g.plot({x:60,y:40,w:480,h:360,xr:[0,10],yr:[-0.3,1.3],xl:'hours studied',yl:'passed? (0 / 1)',ny:4});this.P=P;s.push(P.svg,P.line([[0,0],[10,0]],'gray',{cls:'thin dot'}),P.line([[0,1],[10,1]],'gray',{cls:'thin dot'}));
    s.push(P.pts(this.d1.map(p=>({x:p.x,y:p.y,c:p.y?'green':'red'}))));
    if(si===0){s.push(P.fn(x=>-.15+.13*x,'red',{cls:'dash'}),g.panel(580,60,'A line is wrong here',['predicts −0.15 or 1.15','not a probability','and outliers drag it around'],'red'))}
    else{s.push(P.fn(x=>U.sigmoid(1.3*(x-5)),'blue',{n:200}),g.panel(580,60,'Sigmoid',['z = w·x + b   (any number)','p = σ(z) = 1 / (1 + e⁻ᶻ)','','always between 0 and 1','p ≥ 0.5 → predict "pass"'],'blue'))}
  }else if(si===2){
    const P=g.plot({x:60,y:40,w:440,h:360,xr:[0.01,1],yr:[0,5],xl:'predicted probability for the TRUE class',yl:'loss',ticks:1,nx:4,ny:5});s.push(P.svg,P.fn(p=>-Math.log(p),'orange',{n:200,from:.01}));
    s.push(g.C(P.sx(.9),P.sy(-Math.log(.9)),6,'green'),g.T(P.sx(.9),P.sy(-Math.log(.9))-12,'0.9 → 0.11',{a:'middle',cls:'b'}),g.C(P.sx(.1),P.sy(-Math.log(.1)),6,'red'),g.T(P.sx(.1)+10,P.sy(-Math.log(.1)),'0.1 → 2.30',{cls:'b'}));
    s.push(g.panel(560,60,'Cross-entropy (log loss)',['loss = −log p(true class)','','confident & right → ~0','confident & wrong → huge','','same loss trains LLMs on','"what is the next token?"'],'orange'));
  }else if(si===3){
    const P=g.plot({x:60,y:40,w:400,h:390,xr:[0,10],yr:[0,10],xl:'x₁',yl:'x₂'});s.push(P.svg,P.clip(P.field((x,y)=>{const p=U.sigmoid(1.2*(x-y));return p>.5?'orange':'blue'},40,.12)+P.line([[0,0],[10,10]],'ink',{cls:'dash'})),P.pts(this.d2));
    s.push(g.panel(500,60,'Two features',['z = w₁x₁ + w₂x₂ + b','boundary: z = 0','→ a straight line','','far from the line → confident','near the line → p ≈ 0.5'],'purple'));
  }else{
    const z=[2.1,0.4,-0.6,1.2],p=U.softmax(z),lab=['cat','dog','car','fox'];
    s.push(g.T(60,60,'More than two classes: softmax',{cls:'h'}));
    s.push(g.T(80,110,'scores (logits) z',{cls:'b m'}),g.bars(80,130,300,200,z.map(v=>v+1),{labels:lab,fmt:v=>(v-1).toFixed(1),c:'gray'}));
    s.push(g.A(410,230,480,230,{l:'softmax',lt:'purple',ly:-18}));
    s.push(g.T(510,110,'probabilities (sum = 1)',{cls:'b m'}),g.bars(510,130,300,200,p,{labels:lab,fmt:v=>(v*100).toFixed(0)+'%',c:'purple',hi:0}));
    s.push(g.T(80,420,'softmax(z)ᵢ = e^zᵢ / Σⱼ e^zⱼ   ·   an LLM does this over ~100,000 tokens at every step',{cls:'m'}));
  }
  return s.join('');
},
anim(si,t,g){if(si!==1||!this.P)return '';const P=this.P,x=5+4.5*Math.sin(t*.8),p=U.sigmoid(1.3*(x-5));return `<line x1="${P.sx(x)}" y1="${P.y}" x2="${P.sx(x)}" y2="${P.y+P.h}" style="stroke:var(--faint);stroke-dasharray:3 4"/>`+g.C(P.sx(x),P.sy(p),7,'orange')+g.pill(P.sx(x),P.sy(p)-22,`p = ${p.toFixed(2)}`,'orange')},
steps:[
 {k:'problem',t:'Yes/no answers',short:'The problem',m:{z:'—',p:'—'},
  b:'Now the target is a <b>class</b>: did the student pass (1) or fail (0)? Fitting a straight line gives predictions below 0 and above 1, which make no sense as probabilities.'},
 {k:'solution',t:'The sigmoid',short:'Sigmoid',m:{z:'w·x + b',p:'σ(z)'},
  b:'Keep the weighted sum <code>z = w·x + b</code>, but pass it through the <b>sigmoid</b> σ, an S-curve that squashes any number into (0, 1).\n\nNow the output is a probability. Predict “pass” when it’s above 0.5 (or another threshold, lesson 1.4).'},
 {k:'math',t:'Cross-entropy loss',short:'Log loss',m:{loss:'−log p'},
  b:'MSE behaves badly with probabilities, so we use <b>cross-entropy</b>: the negative log of the probability given to the correct answer.\n\nIt barely punishes confident right answers and punishes confident wrong answers enormously. Minimise it with gradient descent. This is the same loss used to train every LLM.'},
 {k:'insight',t:'Decision boundaries',short:'Boundary',
  b:'With two features the model draws a <b>straight line</b> where z = 0 (p = 0.5). One side is blue, the other orange.\n\nThat is the limitation too: logistic regression can only separate classes with a straight boundary, unless you engineer extra features.'},
 {k:'technique',t:'Softmax for many classes',short:'Softmax',m:{p:'softmax(z)'},
  b:'For K classes, compute one score per class and apply <b>softmax</b>: exponentiate and normalise so they sum to 1.\n\nRemember this: an LLM’s final layer is a giant multinomial logistic regression. It scores every token in its vocabulary and softmaxes them into next-token probabilities.'}
]});

/* ======================================================= regularization */
ML.add({id:'regularization',title:'Regularisation (L1 & L2)',min:9,lvl:'Intermediate',
sub:'Penalise big weights to stop overfitting: ridge, lasso, and why lasso zeroes features out.',
keys:'ridge lasso l1 l2 weight decay elastic net penalty lambda sparsity',
learn:['Why big weights signal overfitting','L2 (ridge) shrinks all weights','L1 (lasso) sets some exactly to zero','How λ trades fit for simplicity'],
cheat:['Loss = data loss + λ·penalty.','L2: λΣw² (ridge, “weight decay” in deep learning). Smooth shrinkage.','L1: λΣ|w| (lasso). Sparse: many weights become exactly 0.','Pick λ with cross-validation.'],
met:[['lam','λ (strength)','gear'],['norm','Σ w²','scale'],['te','Test error','target']],
hero:2,
setup(){const r=U.rng(9);const f=x=>Math.sin(x*2.6)*0.9+0.3*x;this.tr=U.range(10).map(i=>{const x=-0.95+1.9*i/9+U.gauss(r)*.05;return {x,y:f(x)+U.gauss(r)*.3,c:'blue'}});
  const te=U.range(16).map(i=>{const x=-0.97+1.94*(i+.5)/16;return {x,y:f(x)+U.gauss(r)*.3}});
  this.fits=[1e-12,1e-3,0.05,3].map(l=>{const m=ML.polyfit(this.tr.map(p=>p.x),this.tr.map(p=>p.y),9,l);return {l,m,te:te.reduce((s,p)=>s+(m(p.x)-p.y)**2,0)/te.length}});
  this.fits.forEach((F,i)=>{this.steps[i].m={lam:i?String(F.l):'0',te:F.te.toFixed(3)}});},
draw(si,g){
  const s=[];
  if(si<=3){const F=this.fits[si];const P=g.plot({x:60,y:40,w:460,h:380,xr:[-1.05,1.05],yr:[-2.2,2.2],xl:'x',yl:'y'});
    s.push(P.svg,P.clip(P.fn(F.m,si===0?'purple':si===3?'red':'green',{n:300})),P.pts(this.tr,5.5));
    s.push(g.panel(560,50,`degree 9, λ = ${si?F.l:0}`,[`test error  ${F.te.toFixed(3)}`,'',['no penalty: wild swings','small penalty: calmer','good λ: smooth fit','too strong: flattened'][si]],si===0?'purple':si===3?'red':'green'));
    s.push(g.T(560,230,'loss = MSE + λ · Σ wⱼ²',{cls:'b'}));
    const wts=[1,.55,.3,.08][si];s.push(g.T(560,275,'weight sizes',{cls:'m'}),g.bars(560,290,250,110,[.9,.7,1,.6,.8,.5,.95,.4,.75].map((v,i)=>v*wts*(si===0?1:1-i*.07)),{c:'blue',fmt:false,max:1,gap:5}));
  }else{
    s.push(g.T(60,50,'Why L1 gives exact zeros',{cls:'h'}));
    [[230,'L2 (ridge): circle','blue'],[620,'L1 (lasso): diamond','orange']].forEach(([cx,t,c],i)=>{const cy=270,R=80;
      s.push(`<line x1="${cx-150}" y1="${cy}" x2="${cx+150}" y2="${cy}" style="stroke:var(--line2)"/><line x1="${cx}" y1="${cy-170}" x2="${cx}" y2="${cy+150}" style="stroke:var(--line2)"/>`);
      s.push(i?g.poly([[cx,cy-R],[cx+R,cy],[cx,cy+R],[cx-R,cy]],c,.25,{stroke:1}):`<circle cx="${cx}" cy="${cy}" r="${R}" style="fill:color-mix(in srgb,var(--${c}) 25%,transparent);stroke:var(--${c});stroke-width:1.5"/>`);
      const ex=cx+120,ey=cy-150;[30,58,86,114].forEach(rr=>s.push(`<ellipse cx="${ex}" cy="${ey}" rx="${rr*1.3}" ry="${rr*.7}" transform="rotate(-25 ${ex} ${ey})" style="fill:none;stroke:var(--red);opacity:.55"/>`));
      const hit=i?[cx,cy-R]:[cx+43,cy-68];s.push(g.C(hit[0],hit[1],7,'green',{cls:'big'}),g.T(cx,cy+112,t,{a:'middle',cls:'b'}),g.T(hit[0]+12,hit[1]-8,i?'w₁ = 0 exactly':'both ≠ 0',{cls:'b',c:'green'}))});
    s.push(g.T(60,460,'red ellipses = data loss contours · the solution is where they first touch the penalty shape',{cls:'m'}));
  }
  return s.join('');
},
steps:[
 {k:'problem',t:'Overfitting shows up as huge weights',short:'Big weights',
  b:'Back to the degree-9 polynomial that memorised its points. To swing through every point it needs <b>enormous</b> weights that cancel each other out.\n\nIdea: keep the flexible model, but make big weights expensive.'},
 {k:'solution',t:'Add a penalty',short:'Penalty',
  b:'Add <code>λ · Σ w²</code> to the loss. Now gradient descent must balance fitting the data against keeping weights small.\n\nEven a tiny λ tames the swings. In deep learning the same trick is called <b>weight decay</b>.'},
 {k:'solution',t:'A good λ',short:'Good λ',
  b:'With a well-chosen λ the high-degree model behaves like a sensible smooth curve, and test error drops to near the best we saw in lesson 1.2.\n\nλ is a <b>hyperparameter</b>: choose it on validation data, not training data.'},
 {k:'tradeoff',t:'Too much',short:'Too strong',
  b:'Crank λ up and the penalty wins: weights shrink towards zero and the curve flattens out. We have pushed the model back into <b>underfitting</b>.\n\nRegularisation is a dial between variance (left) and bias (right).'},
 {k:'insight',t:'L1 vs L2',short:'L1 vs L2',m:{lam:'—',norm:'—',te:'—'},
  b:'<b>L2 / ridge</b> penalises Σw², a circle. It shrinks all weights smoothly but rarely to exactly zero.\n\n<b>L1 / lasso</b> penalises Σ|w|, a diamond with corners on the axes. The loss contours tend to touch it at a corner, making some weights <b>exactly zero</b>: automatic feature selection. <b>Elastic net</b> mixes both.'}
]});

/* ======================================================= naive bayes */
ML.add({id:'naive-bayes',title:'Naive Bayes',min:8,lvl:'Beginner',
sub:'Classify text by counting words and applying Bayes’ rule, with one bold simplification.',
keys:'bayes theorem prior likelihood posterior spam text classification laplace smoothing',
learn:['Bayes’ rule: prior × likelihood','The “naive” independence assumption','Scoring an email word by word','Laplace smoothing for unseen words'],
cheat:['P(class | words) ∝ P(class) · Π P(word | class).','“Naive” = words treated as independent given the class.','Use log-probabilities to avoid underflow.','Add-one (Laplace) smoothing so an unseen word doesn’t zero everything.'],
met:[['prior','P(spam)','dice'],['ratio','Spam : ham odds','scale'],['pred','Prediction','target']],
hero:2,
setup(){this.w=[['free',.30,.02],['winner',.18,.01],['meeting',.02,.20],['click',.25,.04],['report',.03,.15]];},
draw(si,g){
  const s=[];const W=this.w;
  if(si===0){s.push(g.T(60,60,'Bayes’ rule',{cls:'h'}),g.box(430,150,640,70,'P(spam | email) = P(email | spam) · P(spam) / P(email)','purple',{fs:14}));
    [[200,'posterior','what we want'],[420,'likelihood','from word counts'],[600,'prior','base rate'],[740,'evidence','same for all classes']].forEach(([x,a,b],i)=>s.push(g.T(x,230,a,{a:'middle',cls:'b'}),g.T(x,248,b,{a:'middle',cls:'m'})));
    s.push(g.panel(120,300,'Training = counting',['1,000 emails: 400 spam, 600 ham','P(spam) = 0.4','"free" in 120 of 400 spam → 0.30','"free" in 12 of 600 ham   → 0.02'],'yellow'));}
  else if(si===1){s.push(g.T(60,50,'Word likelihoods learned from counts',{cls:'h'}));
    s.push(g.T(110,90,'P(word | spam)',{cls:'b',c:'red'}),g.hbars(60,100,360,W.map(r=>[r[0],r[1]]),{c:'red',max:.32,lw:80}));
    s.push(g.T(510,90,'P(word | ham)',{cls:'b',c:'green'}),g.hbars(460,100,360,W.map(r=>[r[0],r[2]]),{c:'green',max:.32,lw:80}));
    s.push(g.panel(160,260,'The naive assumption',['P(free, click | spam)','  ≈ P(free|spam) · P(click|spam)','words treated as independent','false, but works surprisingly well'],'yellow'));}
  else if(si===2){const email=['free','click','meeting'];s.push(g.T(60,50,'New email: "free … click … meeting"',{cls:'h'}));
    const c=g.chips(60,80,email.map(t=>({t,c:'blue'})));s.push(c.svg);
    let sp=.4,hm=.6;const rows=[['prior',.4,.6]];email.forEach(wd=>{const r=W.find(x=>x[0]===wd);rows.push([wd,r[1],r[2]]);sp*=r[1];hm*=r[2]});
    rows.forEach((r,i)=>{s.push(g.T(80,160+i*34,r[0],{cls:'b'}),g.T(260,160+i*34,(i?'× ':'')+r[1],{c:'red',cls:'c'}),g.T(420,160+i*34,(i?'× ':'')+r[2],{c:'green',cls:'c'}))});
    s.push(g.T(260,140,'SPAM',{cls:'b m'}),g.T(420,140,'HAM',{cls:'b m'}),`<line x1="70" y1="${160+rows.length*34-20}" x2="520" y2="${160+rows.length*34-20}" style="stroke:var(--edge)"/>`);
    s.push(g.T(80,170+rows.length*34,'product',{cls:'b'}),g.T(260,170+rows.length*34,sp.toExponential(2),{cls:'b',c:'red'}),g.T(420,170+rows.length*34,hm.toExponential(2),{cls:'b',c:'green'}));
    s.push(g.panel(570,150,'Normalise',[`P(spam|email) = ${(sp/(sp+hm)).toFixed(2)}`,`P(ham|email)  = ${(hm/(sp+hm)).toFixed(2)}`,'','→ SPAM'],'red'));}
  else{s.push(g.T(60,50,'The zero-count problem',{cls:'h'}),g.panel(60,90,'Unseen word "crypto" in spam',['P(crypto | spam) = 0 / 400 = 0','one zero wipes out the product','→ email can never be spam'],'red'),
    g.panel(440,90,'Laplace (add-one) smoothing',['P(w | c) = (count + 1) /','          (total + |V|)','every word gets a small chance'],'green'),
    g.panel(60,270,'Log space',['multiply 500 probabilities → underflow','sum logs instead:','log P(c) + Σ log P(wᵢ | c)'],'blue'),
    g.panel(440,270,'Where it shines',['spam filters, topic tagging','tiny data, trains in milliseconds','a strong baseline for text'],'purple'))}
  return s.join('');
},
steps:[
 {k:'math',t:'Bayes’ rule',short:'Bayes',m:{prior:'0.40'},
  b:'We want P(spam | this email). Bayes’ rule flips it into things we can count: how likely these words are in spam (<b>likelihood</b>) times how common spam is (<b>prior</b>).\n\nTraining is literally counting words per class.'},
 {k:'technique',t:'Naive independence',short:'Naive',
  b:'The likelihood of a whole email is hard to count. The <b>naive</b> trick: pretend each word appears independently given the class, so we just multiply per-word probabilities.\n\nIt is clearly false (“click” and “here” travel together) yet classification usually still comes out right.'},
 {k:'solution',t:'Scoring an email',short:'Scoring',m:{ratio:'≈ 10 : 1',pred:'SPAM'},
  b:'Multiply the prior by each word’s likelihood, separately for spam and ham, then normalise. “free” and “click” strongly favour spam; “meeting” favours ham, but not enough.\n\nThe class with the higher score wins.'},
 {k:'tradeoff',t:'Smoothing and logs',short:'Smoothing',
  b:'A word never seen in spam gets probability 0 and vetoes everything, so we add a pseudo-count (<b>Laplace smoothing</b>). And we sum log-probabilities instead of multiplying, to avoid numbers too small for a computer.\n\nNaive Bayes is fast, needs little data, and remains a solid text baseline.'}
]});

/* ======================================================= kNN */
ML.add({id:'knn',title:'k-Nearest Neighbours',min:8,lvl:'Beginner',
sub:'No training at all: label a new point by asking its closest neighbours to vote.',
keys:'knn nearest neighbors distance vote lazy learning curse of dimensionality scaling',
learn:['How a neighbour vote classifies','How k controls smoothness','Why feature scaling matters','The curse of dimensionality'],
cheat:['Store all data; predict by majority vote of the k closest points.','Small k = jagged, overfits; large k = smooth, underfits.','Always scale features: distance is dominated by the largest unit.','Slow at prediction time; use KD-trees or approximate search (also used for vector databases in RAG).'],
met:[['k','k','users'],['vote','Vote','check'],['pred','Prediction','target']],
hero:1,
setup(){const r=U.rng(13);this.d=[...U.blob(r,26,3.5,6,1.4,1.3,'blue'),...U.blob(r,26,6.5,4,1.4,1.3,'orange'),...U.blob(r,6,5,5,1.6,1.6,'orange')];this.q={x:5.1,y:5.2};
  this.pred=(x,y,k)=>{const n=this.d.map(p=>[(p.x-x)**2+(p.y-y)**2,p.c]).sort((a,b)=>a[0]-b[0]).slice(0,k);const o=n.filter(a=>a[1]==='orange').length;return o*2>k?'orange':'blue'};
  const near=k=>this.d.map(p=>({p,d:U.dist(p,this.q)})).sort((a,b)=>a.d-b.d).slice(0,k);this.near=near;
  const v=near(5),o=v.filter(a=>a.p.c==='orange').length;this.steps[1].m={k:'5',vote:`${o} orange · ${5-o} blue`,pred:o>2?'orange':'blue'};},
draw(si,g){
  const s=[];
  if(si<=3){const P=g.plot({x:60,y:30,w:420,h:410,xr:[0,10],yr:[0,10],xl:'x₁',yl:'x₂'});s.push(P.svg);
    const k=[null,5,1,25][si];
    if(si>=2)s.push(P.clip(P.field((x,y)=>this.pred(x,y,k),42,.2)));
    s.push(P.pts(this.d));
    if(si<=1){const q=this.q;if(si===1){const nb=this.near(5);const R=nb[4].d;s.push(`<circle cx="${P.sx(q.x)}" cy="${P.sy(q.y)}" r="${R/10*420}" style="fill:none;stroke:var(--edge);stroke-dasharray:5 5"/>`);nb.forEach(a=>s.push(`<line x1="${P.sx(q.x)}" y1="${P.sy(q.y)}" x2="${P.sx(a.p.x)}" y2="${P.sy(a.p.y)}" style="stroke:var(--edge);stroke-width:1.3"/>`))}
      s.push(g.C(P.sx(q.x),P.sy(q.y),9,'gray',{cls:'hollow'}),g.T(P.sx(q.x)+14,P.sy(q.y)-10,'?',{cls:'h'}))}
    s.push(g.panel(520,50,['A new point','k = 5: ask 5 neighbours','k = 1: jagged','k = 25: smooth'][si],[['no model, no training','just keep the data','','predict = majority vote','of the k closest points'],['draw a circle out to the','5th-nearest point','count the colours','majority wins'],['every point is its own vote','islands around outliers','→ overfits (high variance)'],['votes average over a wide area','boundary is calm','→ may underfit (high bias)']][si],['gray','orange','purple','green'][si]));
  }else{
    s.push(g.T(60,50,'Two practical traps',{cls:'h'}));
    s.push(g.panel(60,90,'1. Units dominate distance',['age in years:    20 … 70','income in $:   20,000 … 200,000','distance ≈ income difference only','','fix: standardise each feature','(z = (x − mean) / std)'],'red'));
    s.push(g.panel(450,90,'2. Curse of dimensionality',['in 1,000 dimensions, all points','are almost equally far apart','"nearest" stops meaning much','','fix: reduce dimensions (PCA),','or learn a good embedding'],'yellow'));
    s.push(g.panel(60,300,'Same idea, modern scale',['semantic search & RAG store text as vectors','and look up the nearest ones with','approximate nearest-neighbour indexes (HNSW)'],'purple'));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Lazy learning',short:'The idea',m:{k:'—'},
  b:'k-NN skips training entirely. It memorises the dataset and, for a new point, looks at the <b>k closest</b> stored points.\n\nIt is the simplest algorithm that really works, and the intuition (“similar things are close together”) underpins embeddings and vector search later.'},
 {k:'solution',t:'Neighbours vote',short:'Vote',
  b:'Measure distance (usually Euclidean) to every stored point, take the k nearest, and let them vote. For regression, average their values instead.\n\nWeighting votes by 1/distance makes close neighbours count more.'},
 {k:'problem',t:'k = 1 overfits',short:'k = 1',m:{k:'1'},
  b:'With k = 1 every training point owns the space around it. The boundary is jagged and a single mislabelled point carves out its own island.\n\nTraining accuracy is 100%, a warning sign we know from lesson 1.2.'},
 {k:'tradeoff',t:'Large k smooths',short:'k = 25',m:{k:'25'},
  b:'With many voters the boundary becomes smooth and robust. Too large and minority regions get outvoted entirely.\n\nPick k on validation data; odd k avoids ties in binary problems.'},
 {k:'tradeoff',t:'Scaling & dimensions',short:'Pitfalls',m:{k:'—',vote:'—',pred:'—'},
  b:'Distances are only meaningful if features share a scale, so standardise first. And in very high dimensions distances concentrate, so neighbours stop being informative.\n\nThe modern answer is to first map data into a learned <b>embedding</b> space where distance means similarity (lesson 7.2).'}
]});

/* ======================================================= SVM */
ML.add({id:'svm',title:'Support Vector Machines',min:11,lvl:'Intermediate',
sub:'Pick the boundary with the widest safety margin, and bend it with the kernel trick.',
keys:'svm margin support vectors hinge loss soft margin c kernel trick rbf',
learn:['Many lines separate the data; which is best?','Maximum margin and support vectors','Soft margins and the C parameter','The kernel trick for curved boundaries'],
cheat:['SVM maximises the margin between classes.','Only the support vectors (points on the margin) define the boundary.','C large = hard margin (fit every point); C small = wider margin, tolerate errors.','Kernels (RBF, polynomial) give non-linear boundaries without computing the features explicitly.'],
met:[['m','Margin width','scale'],['sv','Support vectors','target'],['C','C','gear']],
hero:1,
setup(){const r=U.rng(17);const a=[],b=[];
  // classes separated by line y = x (+/-), margin 1 (in units along normal)
  const push=(arr,c,sgn)=>{for(let i=0;i<22;i++){const u=1+r()*8,off=sgn*(1.2+r()*2.6);const p={x:u+off/Math.SQRT2,y:u-off/Math.SQRT2,c};if(p.x>.3&&p.x<9.7&&p.y>.3&&p.y<9.7)arr.push(p)}};
  push(a,'orange',1);push(b,'blue',-1);
  this.sv=[{x:3+.85,y:3-.85,c:'orange'},{x:7+.85,y:7-.85,c:'orange'},{x:5-.85,y:5+.85,c:'blue'}];
  this.d=[...a,...b,...this.sv];
  this.ring=[...U.range(40).map(()=>{const t=r()*6.28,R=r()*1.6;return {x:5+R*Math.cos(t),y:5+R*Math.sin(t),c:'blue'}}),...U.range(46).map(()=>{const t=r()*6.28,R=2.8+r()*1.6;return {x:5+R*Math.cos(t),y:5+R*Math.sin(t),c:'orange'}})];},
draw(si,g){
  const s=[];
  if(si<=2){const P=g.plot({x:60,y:30,w:420,h:410,xr:[0,10],yr:[0,10],xl:'x₁',yl:'x₂'});s.push(P.svg);
    if(si===0){[[[0,1.3],[10,8.7]],[[0,-0.8],[10,11]],[[1.5,0],[9,10]]].forEach((l,i)=>s.push(P.line(l,['red','purple','yellow'][i],{cls:'dash'})))}
    else{const m=1.2/Math.SQRT2*Math.SQRT2;s.push(P.clip(g.poly([[P.sx(0),P.sy(-1.7)],[P.sx(10),P.sy(8.3)],[P.sx(10),P.sy(11.7)],[P.sx(0),P.sy(1.7)]],'yellow',.18)+P.line([[0,0],[10,10]],'ink')+P.line([[0,-1.7],[10,8.3]],'orange',{cls:'dash thin'})+P.line([[0,1.7],[10,11.7]],'blue',{cls:'dash thin'})));
      if(si===2){s.push(P.pts([{x:5.5,y:6.3,c:'orange'},{x:4.4,y:3.9,c:'blue'}],6))}}
    s.push(P.pts(this.d));
    if(si>=1)this.sv.forEach(p=>s.push(`<circle cx="${P.sx(p.x)}" cy="${P.sy(p.y)}" r="11" style="fill:none;stroke:var(--edge);stroke-width:2"/>`));
    if(si===2)[[5.5,6.3],[4.4,3.9]].forEach(([x,y])=>s.push(`<circle cx="${P.sx(x)}" cy="${P.sy(y)}" r="11" style="fill:none;stroke:var(--red);stroke-width:2;stroke-dasharray:3 3"/>`));
    s.push(g.panel(520,50,['Which line?','Maximum margin','Soft margin'][si],[['all three separate the data','but a new point near red','or yellow is easily misclassified'],['the yellow band = margin','circled = support vectors','only they matter: move any','other point, nothing changes'],['real data overlaps','allow some points inside or','across the margin (dashed red)','C = cost of each violation']][si],['gray','yellow','red'][si]));
    if(si===1)s.push(g.T(530,230,'maximise  2 / ‖w‖',{cls:'b'}),g.T(530,250,'s.t.  yᵢ (w·xᵢ + b) ≥ 1',{cls:'m'}));
    if(si===2)s.push(g.T(530,230,'hinge loss: max(0, 1 − y·(w·x + b))',{cls:'b'}),g.T(530,250,'loss = ½‖w‖² + C · Σ hinge',{cls:'m'}));
  }else{const P=g.plot({x:60,y:30,w:380,h:380,xr:[0,10],yr:[0,10],xl:'x₁',yl:'x₂'});s.push(P.svg);
    if(si===4)s.push(P.clip(P.field((x,y)=>((x-5)**2+(y-5)**2)<2.2**2?'blue':'orange',40,.18)));
    s.push(P.pts(this.ring,4.5));
    if(si===3)s.push(g.panel(480,50,'No straight line works',['blue inside, orange in a ring','any line misclassifies lots','','idea: add a feature','z = (x₁−5)² + (x₂−5)²'],'red'));
    else{s.push(g.T(480,60,'lift to 3D: z = distance²',{cls:'b'}));const bx=480,by=90,w=330,h=250;s.push(g.R(bx,by,w,h,{fill:'var(--bg)',stroke:'var(--edge)',rx:6}));
      this.ring.forEach(p=>{const z=(p.x-5)**2+(p.y-5)**2;s.push(g.C(bx+20+(p.x/10)*w*.85,by+h-15-z/21*(h-30),4,p.c))});
      s.push(`<line x1="${bx+5}" y1="${by+h-15-4.84/21*(h-30)}" x2="${bx+w-5}" y2="${by+h-15-4.84/21*(h-30)}" style="stroke:var(--edge);stroke-width:2;stroke-dasharray:6 4"/>`,g.T(bx+w-8,by+h-22-4.84/21*(h-30),'flat plane',{a:'end',cls:'b'}));
      s.push(g.T(480,370,'a plane in 3D = a circle in 2D',{cls:'b'}),g.T(480,390,'kernel trick: K(a,b) = exp(−γ‖a−b‖²) (RBF)',{cls:'m'}),g.T(480,408,'does this lift implicitly, even to ∞ dims',{cls:'m'}))}
  }
  return s.join('');
},
steps:[
 {k:'problem',t:'Many possible boundaries',short:'Which line?',m:{m:'?',sv:'—',C:'—'},
  b:'Infinitely many lines separate these two classes perfectly. Logistic regression picks one, depending on all the points. Which is safest for new data?\n\nIntuition: the one that stays as far as possible from both classes.'},
 {k:'solution',t:'Maximum margin',short:'Max margin',m:{m:'widest',sv:'3',C:'∞ (hard)'},
  b:'An SVM finds the line with the widest empty band (the <b>margin</b>) between the classes.\n\nThe points touching the margin are the <b>support vectors</b>. They alone determine the boundary; the rest of the data could vanish without changing it.'},
 {k:'tradeoff',t:'Soft margins and C',short:'Soft margin',m:{sv:'5',C:'1'},
  b:'Real data overlaps, so a perfect margin is impossible. A <b>soft-margin</b> SVM lets points violate the margin, paying a penalty (the <b>hinge loss</b>) for each.\n\n<b>C</b> sets the price: large C fits training data tightly (risking overfit), small C accepts errors for a wider, more robust margin.'},
 {k:'problem',t:'Curved data',short:'Non-linear',m:{C:'—'},
  b:'Here one class sits inside a ring of the other. No straight line can separate them.\n\nInstead of a curved model, we can add a new feature that makes the problem linear.'},
 {k:'insight',t:'The kernel trick',short:'Kernels',m:{m:'—',sv:'ring edge'},
  b:'Add z = distance² from the centre. In 3D the inner points sit low and the ring sits high, so a flat plane separates them, which projects back to a <b>circle</b>.\n\nSVMs only need dot products between points, so a <b>kernel</b> function computes those dot products in the lifted space without ever building it. The RBF kernel corresponds to infinitely many features.'}
]});
})();
