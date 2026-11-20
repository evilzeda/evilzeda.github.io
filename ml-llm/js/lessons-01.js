/* 01 · Foundations */
(function(){const U=ML.U;

/* ---------- shared: polynomial least squares (ridge-stabilised) ---------- */
function solve(A,b){const n=b.length;A=A.map((r,i)=>[...r,b[i]]);for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;[A[c],A[p]]=[A[p],A[c]];for(let r=0;r<n;r++){if(r===c)continue;const f=A[r][c]/A[c][c];for(let k=c;k<=n;k++)A[r][k]-=f*A[c][k]}}return A.map((r,i)=>r[n]/r[i])}
function polyfit(xs,ys,deg,lam=1e-9){const n=deg+1,A=U.range(n).map(()=>Array(n).fill(0)),b=Array(n).fill(0);xs.forEach((x,i)=>{const p=U.range(n).map(k=>Math.pow(x,k));for(let r=0;r<n;r++){b[r]+=p[r]*ys[i];for(let c=0;c<n;c++)A[r][c]+=p[r]*p[c]}});for(let r=0;r<n;r++)A[r][r]+=lam;const w=solve(A,b);return x=>w.reduce((s,c,k)=>s+c*Math.pow(x,k),0)}
ML.polyfit=polyfit;

/* ======================================================= what is ML */
ML.add({id:'what-is-ml',title:'What Is Machine Learning?',min:7,lvl:'Beginner',
sub:'Instead of writing the rules, show the computer examples and let it find the rules.',
keys:'supervised unsupervised reinforcement model training inference',
learn:['How ML differs from ordinary programming','Supervised vs unsupervised vs reinforcement learning','What a model, training and inference are','A map of every algorithm in this course'],
cheat:['Programming: rules + data → answers. ML: data + answers → rules (a <b>model</b>).','Supervised = labelled examples; unsupervised = find structure; RL = learn from reward.','Training fits parameters once (expensive); inference uses them many times (cheap).'],
met:[['para','Paradigm','brain'],['in','Input','db'],['out','Output','target']],
setup(){const r=U.rng(7);this.pts=[...U.blob(r,22,3,7,1,1,'blue'),...U.blob(r,22,7,3,1.1,1,'orange')]},
draw(si,g){
  const s=[];
  if(si===0){
    s.push(g.T(60,70,'Traditional programming',{cls:'h'}));
    s.push(g.box(130,150,130,56,'Rules','gray',{sub:'written by you'}),g.box(130,240,130,56,'Data','gray'),g.box(420,195,150,70,'Program','blue'),g.box(700,195,140,60,'Answers','green'));
    s.push(g.A(197,150,343,185),g.A(197,240,343,205),g.A(497,195,628,195));
    s.push(g.T(60,330,'Machine learning',{cls:'h'}));
    s.push(g.box(130,380,130,44,'Data','gray'),g.box(130,440,130,44,'Answers','green',{sub:'labels'}),g.box(420,410,150,60,'Learning','orange'),g.box(700,410,140,56,'Rules','purple',{sub:'= the model'}));
    s.push(g.A(197,380,343,400),g.A(197,440,343,420),g.A(497,410,628,410));
  }else if(si===1||si===2){
    const P=g.plot({x:70,y:40,w:400,h:390,xr:[0,10],yr:[0,10],xl:'feature 1 (e.g. # of links)',yl:'feature 2 (e.g. # of CAPS words)'});
    s.push(P.svg);
    if(si===1){s.push(P.clip(P.field((x,y)=>y>x?'blue':'orange',30,.13)),P.pts(this.pts),P.line([[0,0],[10,10]],'ink',{cls:'dash'}));
      s.push(g.panel(510,60,'Supervised learning',['each example has a label','  blue   = normal email','  orange = spam','','learn f(features) → label','then label NEW emails'],'blue'));
      s.push(g.C(P.sx(6),P.sy(4.6),8,'gray',{cls:'hollow'}),g.T(P.sx(6)+12,P.sy(4.6)+4,'new email → spam?',{cls:'b'}));}
    else{s.push(P.pts(this.pts.map(p=>({...p,c:'gray'}))));
      s.push(g.panel(510,60,'Unsupervised learning',['no labels at all','find structure on its own:','  · clusters (groups)','  · fewer dimensions','  · anomalies'],'purple'));}
  }else if(si===3){
    s.push(g.box(200,230,170,90,'Agent','orange',{sub:'policy π(action | state)'}),g.box(620,230,190,90,'Environment','green',{sub:'game, robot, market'}));
    s.push(g.A(285,205,525,205,{curve:-40,l:'action',lt:'orange'}),g.A(525,255,285,255,{curve:-40,l:'state + reward',lt:'green'}));
    s.push(g.panel(260,360,'Reinforcement learning',['no labels: only a reward signal','learn actions that maximise','total reward over time'],'orange'));
  }else if(si===4){
    const xs=[110,280,450,620,770];
    s.push(g.T(60,80,'TRAINING (once, expensive)',{cls:'b m'}));
    s.push(g.box(xs[0],140,130,56,'Data','gray',{sub:'examples'}),g.box(xs[1],140,130,56,'Algorithm','orange',{sub:'e.g. regression'}),g.box(xs[2],140,140,56,'Parameters','purple',{sub:'weights w, b'}));
    s.push(g.A(176,140,214,140),g.A(346,140,379,140));
    s.push(g.T(60,270,'INFERENCE (many times, cheap)',{cls:'b m'}));
    s.push(g.box(xs[0],330,130,56,'New input','blue'),g.box(xs[2],330,140,64,'Model','purple',{sub:'f(x; w)'}),g.box(xs[3],330,130,56,'Prediction','green'));
    s.push(g.A(176,330,379,330),g.A(521,330,554,330),g.A(450,170,450,296,{dash:1,c:'purple',l:'load weights',lt:'purple'}));
  }else{
    const cols=[['Supervised','green',['Linear / Logistic','Naive Bayes · kNN · SVM','Trees · Forests · Boosting']],['Unsupervised','purple',['k-means · DBSCAN','GMM · PCA · t-SNE']],['Neural nets','blue',['MLP · CNN · RNN/LSTM','Autoencoders · GANs','Diffusion']],['Learning by reward','orange',['Q-learning · RLHF']],['LLMs','red',['Tokens · Embeddings','Attention · Transformer','RAG · Agents']]];
    cols.forEach(([t,c,l],i)=>{const x=95+i*168;s.push(g.box(x,120,150,50,t,c,{hot:1}));l.forEach((q,j)=>s.push(g.box(x,190+j*58,150,44,q,c,{flat:1,fs:10})))});
    s.push(g.T(430,420,'This course walks left → right.',{a:'middle',cls:'b'}));
  }
  return s.join('');
},
anim(si,t,g,ord,k){
  if(si===0){const p=(t%2.4)/2.4;return g.dot(197,150,343,185,p,'orange')+g.dot(497,195,628,195,p,'green')+g.dot(197,440,343,420,p,'green')+g.dot(497,410,628,410,p,'purple')}
  if(si===3){const p=(t%3)/3;return p<.5?g.dot(285,205,525,205,p*2,'orange',{curve:-40}):g.dot(525,255,285,255,(p-.5)*2,'green',{curve:-40})}
  if(si===4){const p=(t%2)/2;return g.dot(176,330,379,330,p,'blue')+g.dot(521,330,554,330,p,'green')+g.dot(176,140,214,140,p,'gray')}
  return '';
},
steps:[
 {k:'setup',t:'Rules vs examples',short:'The idea',m:{para:'—',in:'data',out:'answers'},
  b:'In normal programming <b>you</b> write the rules: “if the email has more than 5 links and the word FREE, mark it spam”.\n\nMachine learning flips this. You hand over lots of <b>examples with answers</b> and an algorithm finds the rules itself. The rules it finds are called a <b>model</b>.',
  n:['Rules + data go in','A program produces answers','ML: data + answers go in','Learning produces the rules (the model)']},
 {k:'technique',t:'Supervised learning',short:'Supervised',m:{para:'Supervised',in:'features + labels',out:'label for new data'},
  b:'Each example is a list of numbers (<b>features</b>) plus the correct answer (a <b>label</b>). The algorithm learns a function from features to label.\n\nIf the label is a category it is <b>classification</b>; if it is a number (a house price) it is <b>regression</b>. Most of this course is supervised.',
  ch:['+ Classification: predict a category','+ Regression: predict a number']},
 {k:'technique',t:'Unsupervised learning',short:'Unsupervised',m:{para:'Unsupervised',in:'features only',out:'groups / structure'},
  b:'Same points, but nobody told us which is which. Unsupervised learning finds <b>structure</b> on its own: here, two obvious groups.\n\nIt is used for customer segmentation, compressing data, and spotting outliers. Module 04 covers it.'},
 {k:'technique',t:'Reinforcement learning',short:'Reinforcement',m:{para:'Reinforcement',in:'state + reward',out:'next action'},
  b:'An <b>agent</b> acts in an <b>environment</b> and receives a <b>reward</b>. Nobody shows it the right action; it discovers which actions pay off over time.\n\nThis is how game-playing AIs learn, and (as RLHF) how chat models learn to be helpful.',
  n:['Agent picks an action','Environment returns a new state and a reward','Agent updates its policy']},
 {k:'insight',t:'Training vs inference',short:'Train / infer',m:{in:'examples',out:'parameters'},
  b:'<b>Training</b> runs the learning algorithm over the data and produces <b>parameters</b> (numbers such as weights). It is slow and happens once, or occasionally.\n\n<b>Inference</b> plugs a new input into the trained model to get a prediction. It is fast and happens millions of times. An LLM answering you is doing inference.',
  ch:['+ Model = algorithm shape + learned parameters','+ GPT-class models have billions of parameters']},
 {k:'recap',t:'The map of this course',short:'Map',
  b:'We start with the classic algorithms, because every idea in them (loss, gradients, overfitting, probabilities) reappears inside LLMs.\n\nThen we open up neural networks and finish by building a transformer piece by piece: tokens, embeddings, attention, context windows, and how chatbots are trained and used.'}
]});

/* ======================================================= overfitting */
ML.add({id:'overfitting',title:'Overfitting & Bias-Variance',min:10,lvl:'Beginner',
sub:'A model that memorises its training data fails on new data. How to tell, and how to fix it.',
keys:'underfit overfit generalization train test validation cross-validation bias variance',
learn:['Underfitting vs overfitting, visually','Why we hold out a test set','The bias-variance trade-off','Validation sets and k-fold cross-validation'],
cheat:['Underfit = too simple (high bias). Overfit = memorises noise (high variance).','Always judge a model on data it never saw in training.','Train/validation/test: fit / tune / report once.','k-fold CV rotates the validation fold for a more stable estimate.'],
met:[['deg','Model complexity','gear'],['tr','Train error','chart'],['te','Test error','target']],
hero:3,
setup(){const r=U.rng(9);const f=x=>Math.sin(x*2.6)*0.9+0.3*x;this.f=f;
  this.tr=U.range(10).map(i=>{const x=-0.95+1.9*i/9+U.gauss(r)*.05;return {x,y:f(x)+U.gauss(r)*.3,c:'blue'}});
  this.te=U.range(16).map(i=>{const x=-0.97+1.94*(i+.5)/16;return {x,y:f(x)+U.gauss(r)*.3,c:'orange'}});
  const mse=(m,d)=>d.reduce((s,p)=>s+(m(p.x)-p.y)**2,0)/d.length;
  this.curve=U.range(9).map(i=>{const d=i+1,m=ML.polyfit(this.tr.map(p=>p.x),this.tr.map(p=>p.y),d,1e-12);return {d,m,tr:mse(m,this.tr),te:mse(m,this.te)}});
},
draw(si,g){
  const s=[];const P=g.plot({x:60,y:40,w:470,h:380,xr:[-1.05,1.05],yr:[-2.2,2.2],xl:'x',yl:'y'});
  const deg={0:null,1:1,2:4,3:9}[si];
  if(si<=3){s.push(P.svg);
    if(deg){const c=this.curve[deg-1];s.push(P.clip(P.fn(c.m,deg===4?'green':deg===1?'red':'purple',{n:300})));
      s.push(g.panel(570,60,`polynomial, degree ${deg}`,[`train error  ${c.tr.toFixed(3)}`,`test error   ${c.te.toFixed(3)}`,'',deg===1?'too stiff: misses the curve':deg===4?'follows the trend, ignores noise':'threads every training point'],deg===4?'green':deg===1?'red':'purple'))}
    s.push(P.pts(this.tr,5.5));if(si>=1)s.push(P.pts(this.te,5,{cls:'hollow'}));
    if(si===0)s.push(g.panel(570,60,'The data',['blue  = training points','true curve + random noise','','goal: predict y for NEW x'],'blue'));
    s.push(g.T(575,390,'● train   ○ test (held out)',{cls:'m'}));
  }else if(si===4){
    const Q=g.plot({x:70,y:40,w:460,h:360,xr:[1,9],yr:[0,0.6],xl:'model complexity (degree)',yl:'error (MSE)',ticks:1,nx:8,ny:3});
    s.push(Q.svg,Q.line(this.curve.map(c=>[c.d,Math.min(.6,c.tr)]),'blue'),Q.line(this.curve.map(c=>[c.d,Math.min(.6,c.te)]),'orange'));
    this.curve.forEach(c=>{s.push(g.C(Q.sx(c.d),Q.sy(Math.min(.6,c.tr)),4,'blue'),g.C(Q.sx(c.d),Q.sy(Math.min(.6,c.te)),4,'orange'))});
    s.push(g.T(Q.sx(1.4),Q.sy(.55),'← underfit',{cls:'b',c:'red'}),g.T(Q.sx(9.5),Q.sy(.55),'overfit →',{cls:'b',c:'purple'}));
    s.push(g.panel(570,60,'Two curves',['train error keeps falling','test error is U-shaped','','pick the bottom of the U'],'yellow'));
  }else if(si===5){
    s.push(g.T(60,60,'Error = Bias² + Variance + Noise',{cls:'h'}));
    [['low bias · low var',4,.15],['high bias',4,.15,2.2],['high variance',4,1.1],['both high',4,1.1,2]].forEach(([t,_,sp,off],i)=>{const cx=140+i*195,cy=250;
      [70,48,26].forEach((rr,j)=>s.push(`<circle cx="${cx}" cy="${cy}" r="${rr}" style="fill:${j===2?'var(--red-bg)':'var(--bg)'};stroke:var(--edge);stroke-width:1.3"/>`));
      const r=U.rng(5+i);for(let q=0;q<10;q++)s.push(g.C(cx+((off||0)*12)+U.gauss(r)*sp*22,cy-((off||0)*10)+U.gauss(r)*sp*22,4.5,'blue'));
      s.push(g.T(cx,cy+100,t,{a:'middle',cls:'b'}))});
    s.push(g.T(60,420,'Bias: how wrong on average.  Variance: how much it changes with a different training sample.',{cls:'m'}));
  }else{
    s.push(g.T(60,60,'Hold-out split',{cls:'h'}));
    const seg=[['train 70%','blue',.7],['val 15%','yellow',.15],['test 15%','orange',.15]];let x=60;seg.forEach(([l,c,w])=>{s.push(g.box(x+w*700/2,105,w*700-4,40,l,c,{flat:1}));x+=w*700});
    s.push(g.T(60,180,'5-fold cross-validation',{cls:'h'}));
    for(let i=0;i<5;i++){for(let j=0;j<5;j++)s.push(g.box(60+j*112+55,225+i*44,108,34,j===i?'validate':'train',j===i?'yellow':'blue',{flat:1,hot:j===i,fs:10.5}));s.push(g.T(640,230+i*44,`fold ${i+1} → score`,{cls:'m'}))}
    s.push(g.T(640,460,'average of 5 scores',{cls:'b'}));
  }
  return s.join('');
},
steps:[
 {k:'setup',t:'Noisy data',short:'Data',m:{deg:'—'},
  b:'We sample 10 training points from a smooth curve and add random noise. A good model should learn the <b>curve</b>, not the noise, because the noise will be different next time.'},
 {k:'problem',t:'Underfitting',short:'Underfit',m:{deg:'1 (a line)',tr:'0.155',te:'0.160'},
  b:'A straight line cannot bend, so it misses the shape. Both training error and test error are high.\n\nThis is <b>underfitting</b>, or <b>high bias</b>: the model is too simple for the pattern.'},
 {k:'solution',t:'A good fit',short:'Good fit',m:{deg:'4',tr:'0.018',te:'0.060'},
  b:'A degree-4 polynomial has enough flexibility to follow the wave but not enough to chase every wiggle. Test error (the hollow orange points, never used for fitting) is close to training error. That is <b>generalisation</b>.'},
 {k:'problem',t:'Overfitting',short:'Overfit',m:{deg:'9',tr:'0.000',te:'2.54 (×40)'},
  b:'With 10 parameters for 10 points, the curve passes through every training point: training error is almost zero.\n\nBut between the points it swings wildly, so test error explodes. The model <b>memorised the noise</b>. This is <b>overfitting</b>, or <b>high variance</b>.',
  tip:['Rule of thumb','A big gap between training and test error is the signature of overfitting.']},
 {k:'insight',t:'The U-shaped curve',short:'U-curve',
  b:'Plot both errors as complexity grows. Training error always falls. Test error falls, bottoms out, then rises.\n\nThe best model sits at the bottom of the U. Regularisation (lesson 2.3), more data, and early stopping all push that bottom lower.'},
 {k:'math',t:'Bias and variance',short:'Bias-variance',
  b:'Expected test error splits into <b>bias²</b> (systematic error from a too-simple model), <b>variance</b> (sensitivity to the particular training sample) and irreducible <b>noise</b>.\n\nSimple models: high bias, low variance. Flexible models: low bias, high variance. Ensembles (module 03) cut variance; boosting cuts bias.'},
 {k:'recap',t:'Validation & cross-validation',short:'Validation',
  b:'Split data three ways: <b>train</b> to fit, <b>validation</b> to choose settings (degree, k, learning rate), <b>test</b> touched once at the end for an honest score.\n\nWith little data, <b>k-fold cross-validation</b> rotates which fold is held out and averages the scores.',
  ch:['! Tuning on the test set leaks it: the score becomes optimistic','+ Time series: validate on the future, never shuffle']}
]});

/* ======================================================= gradient descent */
ML.add({id:'gradient-descent',title:'Loss & Gradient Descent',min:11,lvl:'Beginner',
sub:'How almost every model learns: measure how wrong it is, then walk downhill.',
keys:'loss function mse gradient learning rate sgd minibatch local minimum',
learn:['What a loss function is','The gradient as "which way is uphill"','How the learning rate changes everything','Stochastic and mini-batch gradient descent'],
cheat:['Loss = one number saying how wrong the model is (MSE, cross-entropy).','Update: w ← w − η · ∂L/∂w.','η too small = slow; too big = oscillates or diverges.','SGD / mini-batches: noisy but cheap steps; the standard for deep learning.'],
met:[['lr','Learning rate','gear'],['w','Weight w','hash'],['loss','Loss','chart']],
hero:2,
setup(){
  const L=w=>0.35*(w-1.2)**2+0.25;this.L=L;const dL=w=>0.7*(w-1.2);
  const path=(lr,n=24,w0=-3.2)=>{const a=[w0];for(let i=0;i<n;i++)a.push(a[a.length-1]-lr*dL(a[a.length-1]));return a};
  this.paths={slow:path(.15),good:path(1.1),big:path(3.0,9)};
  // 2D bowl for SGD
  const r=U.rng(3);const f=(x,y)=>0.5*x*x+2*y*y;this.f2=f;
  const gd=[[-3.6,1.6]],sg=[[-3.6,1.6]];for(let i=0;i<30;i++){const [x,y]=gd[gd.length-1];gd.push([x-.18*x,y-.18*4*y]);const [a,b]=sg[sg.length-1];sg.push([a-.18*(a+U.gauss(r)*1.6),b-.18*(4*b+U.gauss(r)*2.4)])}
  this.gd=gd;this.sg=sg;
},
draw(si,g){
  const s=[];
  if(si<=3){
    const P=g.plot({x:60,y:40,w:480,h:380,xr:[-3.5,5.9],yr:[0,8.5],xl:'weight w',yl:'loss L(w)',ticks:si===0,nx:5,ny:5});
    s.push(P.svg,P.fn(this.L,'blue',{n:200}));
    if(si===0){s.push(g.panel(580,60,'Loss function',['L(w) = how wrong the model is','for weight w','','MSE  = mean (ŷ − y)²','lowest point = best w'],'blue'),g.C(P.sx(1.2),P.sy(.25),6,'green'),g.T(P.sx(1.2),P.sy(.25)+22,'minimum',{a:'middle',cls:'b',c:'green'}))}
    if(si===1){const w=-2.5,y=this.L(w),sl=.7*(w-1.2);s.push(P.line([[w-1.3,y-sl*1.3],[w+1.3,y+sl*1.3]],'red',{cls:'dash'}),g.C(P.sx(w),P.sy(y),7,'orange'));
      s.push(g.A(P.sx(w),P.sy(y)-24,P.sx(w)+60,P.sy(y)-24,{c:'green',l:'step = −η·slope',ly:-14}));
      s.push(g.panel(580,60,'Gradient',['slope at w: dL/dw = '+sl.toFixed(2),'negative slope → go right','positive slope → go left','','w ← w − η · dL/dw'],'red'))}
    if(si>=2){const p=si===2?this.paths.good:null;
      if(si===2)s.push(P.line(p.map(w=>[w,this.L(w)]),'orange',{cls:'thin dash'}));
      if(si===3){[['slow','yellow'],['big','red']].forEach(([k,c])=>s.push(P.line(this.paths[k].map(w=>[w,Math.min(8.5,this.L(w))]),c,{cls:'thin dash'})));
        s.push(g.panel(580,60,'Learning rate η',['η = 0.15  tiny steps, slow','η = 1.1   fast, converges','η = 3.0   overshoots,','          bounces & diverges'],'yellow'))}
      else s.push(g.panel(580,60,'Descent loop',['1. compute loss','2. compute gradient','3. step downhill','4. repeat until flat'],'green'))}
    this.P=P;
  }else if(si===4){
    const P=g.plot({x:60,y:40,w:480,h:380,xr:[-4,4],yr:[-2,2],xl:'w₁',yl:'w₂',grid:false});s.push(P.svg);
    [0.5,1.5,3,5,8].forEach(v=>{const a=Math.sqrt(2*v),b=Math.sqrt(v/2);s.push(`<ellipse cx="${P.sx(0)}" cy="${P.sy(0)}" rx="${a/8*480}" ry="${b/4*380}" style="fill:none;stroke:var(--blue);opacity:.5;stroke-width:1.3"/>`)});
    s.push(P.clip(P.line(this.gd,'green')+P.line(this.sg,'orange',{cls:'thin'})));
    s.push(g.panel(580,60,'Two weights → a bowl',['green  = full-batch GD','   uses every example','orange = SGD / mini-batch','   uses a few examples','   noisy, but far cheaper'],'purple'));this.P=P;
  }else{
    const P=g.plot({x:60,y:40,w:480,h:380,xr:[-4,4],yr:[-1.5,4],xl:'w',yl:'loss'});
    const f=w=>0.08*w**4-0.6*w*w+0.3*w+1.6;s.push(P.svg,P.fn(f,'blue'),g.C(P.sx(-2.08),P.sy(f(-2.08)),6,'green'),g.C(P.sx(1.85),P.sy(f(1.85)),6,'yellow'));
    s.push(g.T(P.sx(-2.08),P.sy(f(-2.08))+22,'global min',{a:'middle',cls:'b',c:'green'}),g.T(P.sx(1.85),P.sy(f(1.85))+22,'local min',{a:'middle',cls:'b',c:'yellow'}));
    s.push(g.panel(580,60,'Real losses are bumpy',['GD can get stuck in a','local minimum or saddle','','helpers: momentum, Adam,','noise from mini-batches,','good initialisation'],'yellow'));
  }
  return s.join('');
},
anim(si,t,g){
  const P=this.P;if(!P)return '';
  const run=(path,c,f)=>{const n=path.length-1,u=(t*6)%(n+5),i=Math.min(n,Math.floor(u)),k=Math.min(1,u-i),a=path[i],b=path[Math.min(n,i+1)],w=a+(b-a)*U.ease(k);return g.C(P.sx(w),P.sy(Math.min(8.5,f(w))),7,c)};
  if(si===2)return run(this.paths.good,'orange',this.L);
  if(si===3)return run(this.paths.slow,'yellow',this.L)+run(this.paths.big,'red',this.L)+run(this.paths.good,'green',this.L);
  if(si===4){const n=30,i=Math.floor((t*5)%(n+6));const j=Math.min(n,i);return g.C(P.sx(this.gd[j][0]),P.sy(this.gd[j][1]),6,'green')+g.C(P.sx(this.sg[j][0]),P.sy(this.sg[j][1]),6,'orange')}
  return '';
},
steps:[
 {k:'setup',t:'The loss function',short:'Loss',m:{lr:'—',w:'?',loss:'?'},
  b:'Training needs a single number that says how bad the current model is: the <b>loss</b>. For regression the classic choice is <b>mean squared error</b>; for classification it is <b>cross-entropy</b>.\n\nPlot loss against a weight and you get a landscape. Learning means finding its lowest point.'},
 {k:'math',t:'The gradient',short:'Gradient',m:{w:'-2.5',loss:'5.04'},
  b:'The <b>gradient</b> is the slope of the loss at the current weight. It points uphill, so we step the <b>opposite</b> way.\n\nThe update rule is <code>w ← w − η · dL/dw</code>, where <b>η</b> (eta) is the <b>learning rate</b>: how big a step to take.'},
 {k:'solution',t:'Walking downhill',short:'Descent',m:{lr:'1.1',w:'→ 1.2',loss:'→ 0.25'},
  b:'Repeat: compute the gradient, take a step. Steps shrink automatically as the slope flattens near the bottom, and the weight settles at the minimum.\n\nWith millions of weights it is the same idea, just in millions of dimensions at once.'},
 {k:'tradeoff',t:'Choosing the learning rate',short:'Learning rate',m:{lr:'0.15 · 1.1 · 3.0'},
  b:'Too small and training crawls (yellow). Too large and each step overshoots the valley, bouncing higher until it <b>diverges</b> (red).\n\nIn practice people use a <b>schedule</b>: warm up, then decay the learning rate over training.',
  tip:['Rule of thumb','If loss turns into NaN or shoots up, lower the learning rate first.']},
 {k:'technique',t:'Stochastic & mini-batch GD',short:'SGD',m:{lr:'0.18'},
  b:'Computing the exact gradient needs a pass over <b>all</b> the data, for every step. <b>Stochastic gradient descent</b> estimates it from one example, and <b>mini-batch</b> GD from, say, 32 to 4,096.\n\nThe path is noisier but each step is thousands of times cheaper, so it wins overall. Every LLM is trained this way.'},
 {k:'tradeoff',t:'Local minima',short:'Bumpy losses',
  b:'Real loss surfaces are not perfect bowls. Gradient descent only sees the local slope, so it can settle in a <b>local minimum</b> or crawl across a flat <b>saddle</b>.\n\nIn very high dimensions true bad local minima turn out to be rare; momentum and adaptive optimisers like <b>Adam</b> (lesson 5.3) handle the rest.'}
]});

/* ======================================================= evaluation */
ML.add({id:'evaluation',title:'Evaluating Models',min:10,lvl:'Beginner',
sub:'Accuracy can lie. Confusion matrices, precision, recall, F1 and the ROC curve.',
keys:'accuracy precision recall f1 roc auc confusion matrix threshold',
learn:['Read a confusion matrix','Precision vs recall and when each matters','How the decision threshold trades one for the other','ROC curves and AUC'],
cheat:['Precision = TP / (TP+FP): of what I flagged, how much was right.','Recall = TP / (TP+FN): of the real positives, how many I caught.','F1 = harmonic mean of precision and recall.','ROC AUC = chance a random positive scores above a random negative.'],
met:[['th','Threshold','filter'],['p','Precision','target'],['r','Recall','search'],['acc','Accuracy','check']],
hero:2,
setup(){const r=U.rng(21);this.neg=U.range(300).map(()=>U.clamp(.32+U.gauss(r)*.15,0,1));this.pos=U.range(100).map(()=>U.clamp(.66+U.gauss(r)*.15,0,1));
  this.cm=th=>{const TP=this.pos.filter(v=>v>=th).length,FN=100-TP,FP=this.neg.filter(v=>v>=th).length,TN=300-FP;return {TP,FN,FP,TN}};
  const met=th=>{const c=this.cm(th);return {th:String(th),p:(c.TP/(c.TP+c.FP)).toFixed(2),r:(c.TP/100).toFixed(2),acc:((c.TP+c.TN)/400).toFixed(2)}};Object.assign(this.steps[1].m,met(.5));Object.assign(this.steps[2].m,met(.5));Object.assign(this.steps[3].m,met(.3));
  this.roc=U.range(51).map(i=>{const c=this.cm(1-i/50);return [c.FP/300,c.TP/100]});
},
draw(si,g){
  const s=[];
  const hist=(x,y,w,h,th)=>{const P=g.plot({x,y,w,h,xr:[0,1],yr:[0,60],xl:'model score (probability of fraud)',grid:false});s.push(P.svg);const b=20;
    [[this.neg,'blue'],[this.pos,'orange']].forEach(([a,c])=>{const cnt=Array(b).fill(0);a.forEach(v=>cnt[Math.min(b-1,Math.floor(v*b))]++);cnt.forEach((n,i)=>{const X=P.sx(i/b);s.push(g.R(X+1,P.sy(n),w/b-2,P.y+h-P.sy(n),{fill:`color-mix(in srgb,var(--${c}) 55%,transparent)`,stroke:'var(--edge)',sw:1,rx:2}))})});
    if(th!=null){s.push(`<line x1="${P.sx(th)}" y1="${y}" x2="${P.sx(th)}" y2="${y+h}" style="stroke:var(--red);stroke-width:2.5;stroke-dasharray:6 4"/>`,g.pill(P.sx(th),y+14,'threshold '+th,'red'))}
    s.push(g.T(x+8,y+20,'■ legit (300)',{c:'blue',cls:'c b'}),g.T(x+8,y+36,'■ fraud (100)',{c:'orange',cls:'c b'}));return P};
  const cm=(x,y,th)=>{const c=this.cm(th);s.push(g.heat(x,y,[[c.TP,c.FN],[c.FP,c.TN]],{cs:72,max:300,fmt:v=>v,cf:(v,i,j)=>i===j?'green':'red',rows:['actual fraud','actual legit'],cols:['pred fraud','pred legit']}));
    s.push(g.T(x+36,y+16,'TP',{a:'middle',cls:'m'}),g.T(x+108,y+16,'FN',{a:'middle',cls:'m'}),g.T(x+36,y+88,'FP',{a:'middle',cls:'m'}),g.T(x+108,y+88,'TN',{a:'middle',cls:'m'}));return c};
  if(si===0){s.push(g.panel(80,70,'A fraud detector that does nothing',['400 transactions, 100 are fraud','model: "always predict legit"','','accuracy = 300 / 400 = 75%','frauds caught = 0'],'red'),g.T(80,260,'High accuracy, useless model.',{cls:'h'}),g.T(80,285,'With imbalanced classes, accuracy hides failure.',{cls:'m'}))}
  else if(si===1){hist(60,60,420,250,.5);cm(640,80,.5)}
  else if(si===2||si===3){const th=si===2?.5:.3;hist(60,60,420,250,th);const c=cm(640,80,th);const P=c.TP/(c.TP+c.FP),R=c.TP/(c.TP+c.FN);
    s.push(g.panel(540,300,'At threshold '+th,[`precision = ${c.TP}/(${c.TP}+${c.FP}) = ${P.toFixed(2)}`,`recall    = ${c.TP}/(${c.TP}+${c.FN}) = ${R.toFixed(2)}`,`F1        = ${(2*P*R/(P+R)).toFixed(2)}`],'yellow'))}
  else{const P=g.plot({x:80,y:40,w:380,h:380,xr:[0,1],yr:[0,1],xl:'false positive rate',yl:'true positive rate (recall)',ticks:1,nx:4,ny:4});
    s.push(P.svg,P.line([[0,0],[1,1]],'gray',{cls:'dash thin'}),P.clip(g.poly([[P.sx(0),P.sy(0)],...this.roc.map(p=>[P.sx(p[0]),P.sy(p[1])]),[P.sx(1),P.sy(0)]],'orange',.15)),P.line(this.roc,'orange'));
    let auc=0;for(let i=1;i<this.roc.length;i++)auc+=(this.roc[i][0]-this.roc[i-1][0])*(this.roc[i][1]+this.roc[i-1][1])/2;
    s.push(g.panel(510,60,'ROC curve',['sweep the threshold 1 → 0','plot TPR vs FPR','','diagonal = random guessing',`AUC = ${auc.toFixed(3)}`,'(1.0 = perfect ranking)'],'orange'));this.P=P}
  return s.join('');
},
anim(si,t,g){if(si!==4||!this.P)return '';const i=Math.floor(t*8)%this.roc.length,p=this.roc[i];return g.C(this.P.sx(p[0]),this.P.sy(p[1]),7,'red')},
steps:[
 {k:'problem',t:'The accuracy trap',short:'Accuracy trap',m:{th:'—',acc:'75%',r:'0%',p:'—'},
  b:'Imagine 400 card payments, 100 of them fraud. A model that always says “legit” is <b>75% accurate</b> and catches zero fraud.\n\nWhen one class is rare (fraud, disease, defects), accuracy is the wrong scoreboard.'},
 {k:'technique',t:'Scores and the confusion matrix',short:'Confusion matrix',m:{th:'0.5'},
  b:'Most classifiers output a <b>score</b> (a probability). We pick a <b>threshold</b>: above it, predict fraud.\n\nCounting the four outcomes gives the <b>confusion matrix</b>: true positives, false negatives (missed fraud), false positives (false alarms), true negatives.'},
 {k:'math',t:'Precision and recall',short:'Precision / recall',m:{},
  b:'<b>Precision</b>: of everything I flagged, how much really was fraud? <b>Recall</b>: of all the real fraud, how much did I catch?\n\n<b>F1</b> combines them with a harmonic mean, so it is only high when both are.',
  ch:['+ Spam filter: favour precision (don’t lose real mail)','+ Cancer screening: favour recall (don’t miss cases)']},
 {k:'tradeoff',t:'Moving the threshold',short:'Threshold',m:{},
  b:'Lower the threshold to 0.3 and we catch nearly every fraud (recall up) but also flag many legit payments (precision down).\n\nThe model is the same; only the business decision changed. Always pick the threshold for the cost of each kind of mistake.'},
 {k:'insight',t:'ROC curve & AUC',short:'ROC / AUC',m:{th:'1 → 0'},
  b:'Sweep the threshold from 1 to 0 and plot true-positive rate against false-positive rate: the <b>ROC curve</b>. The area under it (<b>AUC</b>) measures ranking quality independent of any threshold.\n\nFor heavily imbalanced data, the <b>precision-recall curve</b> is often more informative. For regression, use MAE, RMSE or R².'}
]});
})();
