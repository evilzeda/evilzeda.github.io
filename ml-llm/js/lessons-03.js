/* 03 · Trees & ensembles */
(function(){const U=ML.U;

/* ---------- tiny CART for 2D points {x,y,c} ---------- */
function gini(a){if(!a.length)return 0;const n={};a.forEach(p=>n[p.c]=(n[p.c]||0)+1);return 1-Object.values(n).reduce((s,v)=>s+(v/a.length)**2,0)}
function major(a){const n={};a.forEach(p=>n[p.c]=(n[p.c]||0)+1);return Object.entries(n).sort((x,y)=>y[1]-x[1])[0]?.[0]||'gray'}
function best(a,feats=['x','y']){let b=null;feats.forEach(f=>{const vs=[...new Set(a.map(p=>p[f]))].sort((x,y)=>x-y);for(let i=1;i<vs.length;i++){const t=(vs[i-1]+vs[i])/2,L=a.filter(p=>p[f]<t),R=a.filter(p=>p[f]>=t);const sc=(L.length*gini(L)+R.length*gini(R))/a.length;if(!b||sc<b.sc)b={f,t,sc,L,R}}});return b}
function grow(a,depth,box,o={},d=0){const node={n:a.length,c:major(a),g:gini(a),box,d};if(d>=depth||node.g===0||a.length<(o.min||2))return node;
  const feats=o.mtry?(o.r()<.5?['x']:['y']):['x','y'];const b=best(a,feats);if(!b||!b.L.length||!b.R.length)return node;
  node.f=b.f;node.t=b.t;const [x0,y0,x1,y1]=box;
  node.l=grow(b.L,depth,b.f==='x'?[x0,y0,b.t,y1]:[x0,y0,x1,b.t],o,d+1);node.r=grow(b.R,depth,b.f==='x'?[b.t,y0,x1,y1]:[x0,b.t,x1,y1],o,d+1);return node}
function predict(n,x,y){while(n.f){n=(n.f==='x'?x:y)<n.t?n.l:n.r}return n.c}
function leaves(n,a=[]){if(!n.f)a.push(n);else{leaves(n.l,a);leaves(n.r,a)}return a}
function splits(n,a=[]){if(n.f){a.push(n);splits(n.l,a);splits(n.r,a)}return a}
ML.tree={grow,predict,leaves,splits,gini};

function data2(seed){const r=U.rng(seed);const a=[];for(let i=0;i<90;i++){const x=r()*10,y=r()*10;let c=(x<4.2&&y>3)?'blue':(x>=4.2&&y<6.3)?'orange':'green';if(r()<.07)c=['blue','orange','green'][Math.floor(r()*3)];a.push({x,y,c})}return a}

/* ======================================================= decision trees */
ML.add({id:'decision-trees',title:'Decision Trees',min:11,lvl:'Beginner',
sub:'Ask a sequence of yes/no questions, each chosen to make the groups as pure as possible.',
keys:'cart gini entropy information gain split depth pruning',
learn:['How a tree splits the feature space','Gini impurity and information gain','Reading the tree as if/else rules','Why deep trees overfit, and pruning'],
cheat:['Each split asks “feature ≤ threshold?” and picks the one that most reduces impurity.','Gini = 1 − Σpₖ²; entropy = −Σpₖ log pₖ.','Trees need no feature scaling and handle mixed data types.','Limit depth / min samples per leaf, or prune, to avoid overfitting.'],
met:[['depth','Depth','tree'],['leaves','Leaves','grid'],['acc','Train accuracy','check']],
hero:3,
setup(){this.d=data2(31);this.trees=[0,1,2,3,12].map(dp=>grow(this.d,dp,[0,0,10,10]));
  this.trees.forEach((T,i)=>{const acc=this.d.filter(p=>predict(T,p.x,p.y)===p.c).length/this.d.length;this.steps[i].m={depth:String([0,1,2,3,'12 (no limit)'][i]),leaves:String(leaves(T).length),acc:(acc*100).toFixed(0)+'%'}});
  this.steps[5].m=this.steps[3].m;},
draw(si,g){
  const s=[];const T=this.trees[Math.min(si,4)];if(si===5)return this.drawGini(g);
  const P=g.plot({x:50,y:30,w:400,h:410,xr:[0,10],yr:[0,10],xl:'x₁ (e.g. income)',yl:'x₂ (e.g. age)'});s.push(P.svg);
  leaves(T).forEach(L=>{const [x0,y0,x1,y1]=L.box;s.push(g.R(P.sx(x0),P.sy(y1),P.sx(x1)-P.sx(x0),P.sy(y0)-P.sy(y1),{fill:`var(--${L.c})`,op:.16}))});
  splits(T).forEach(n=>{const [x0,y0,x1,y1]=n.box;s.push(n.f==='x'?P.line([[n.t,y0],[n.t,y1]],'ink',{w:n.d===0?3:2}):P.line([[x0,n.t],[x1,n.t]],'ink',{w:n.d===0?3:2}))});
  s.push(P.pts(this.d,4.5));
  // tree diagram on the right (depth ≤ 3)
  if(si>=1&&si<=3){const draw=(n,x,y,dx)=>{if(n.f){[[n.l,-1],[n.r,1]].forEach(([c,sg])=>{s.push(`<line x1="${x}" y1="${y}" x2="${x+sg*dx}" y2="${y+70}" style="stroke:var(--edge);stroke-width:1.3"/>`);draw(c,x+sg*dx,y+70,dx/2)});s.push(g.box(x,y,108,34,`${n.f==='x'?'x₁':'x₂'} < ${n.t.toFixed(1)}?`,'gray',{fs:10.5}))}else s.push(g.box(x,y,46,30,String(n.n),n.c,{fs:10.5}))};
    draw(T,660,70,si===1?90:si===2?100:95);s.push(g.T(660,440,'left = yes · right = no · leaf shows # points',{cls:'m',a:'middle'}))}
  if(si===0)s.push(g.panel(500,60,'Before any split',['one node with every point','majority class: '+T.c,`gini impurity = ${T.g.toFixed(2)}`,'','find the question that','splits it into purer groups'],'gray'));
  if(si===4)s.push(g.panel(500,60,'No depth limit',['keeps splitting until each','leaf is pure','100% training accuracy','','tiny boxes around noise','= overfitting'],'red'));
  return s.join('');
},
drawGini(g){const s=[];s.push(g.T(60,50,'Choosing a split: impurity',{cls:'h'}));
  s.push(g.panel(60,80,'Gini impurity',['G = 1 − Σ pₖ²','pure node (all one class) → 0','50/50 two classes        → 0.5','','chance two random picks','disagree'],'yellow'));
  s.push(g.panel(60,260,'Information gain',['entropy H = −Σ pₖ log₂ pₖ','gain = H(parent)','     − weighted H(children)','pick the split with max gain'],'blue'));
  const P=g.plot({x:460,y:80,w:340,h:280,xr:[0,1],yr:[0,1],xl:'share of class A in node',yl:'impurity',ticks:1,nx:4,ny:2});
  s.push(P.svg,P.fn(p=>2*p*(1-p),'orange'),P.fn(p=>p<=0||p>=1?0:-(p*Math.log2(p)+(1-p)*Math.log2(1-p)),'blue'),g.T(700,120,'entropy',{c:'blue',cls:'b'}),g.T(700,240,'gini ×2',{c:'orange',cls:'b'}));return s.join('')},
steps:[
 {k:'setup',t:'One big group',short:'Start',
  b:'A decision tree classifies by asking questions like “is income below 4.2?”. Start with all points in a single node, which is very mixed (<b>impure</b>).\n\nThe goal of each question: split the node into children that are as pure as possible.'},
 {k:'solution',t:'The first split',short:'Split 1',
  b:'Try every feature and every threshold; keep the one that reduces impurity most. Here the best first question is about x₁, giving a mostly-blue left side.\n\nThe search is greedy: it never looks ahead, it just picks the best split now.'},
 {k:'solution',t:'Split again',short:'Split 2',
  b:'Repeat inside each child. Every split is a straight cut parallel to an axis, so the space becomes a set of <b>rectangles</b>, each labelled with its majority class.'},
 {k:'insight',t:'A readable model',short:'Rules',
  b:'Depth 3 already captures the structure. The tree on the right is a set of human-readable <b>if/else rules</b>: follow the questions from the root to a leaf.\n\nTrees need no feature scaling, handle categorical data, and are easy to explain. That is why they are popular in finance and healthcare.'},
 {k:'problem',t:'Unlimited depth overfits',short:'Too deep',
  b:'Let the tree grow until every leaf is pure and it reaches 100% training accuracy by drawing tiny boxes around noisy points.\n\nSingle deep trees have very <b>high variance</b>: change a few training points and the tree changes completely. Control it with max depth, min samples per leaf, or pruning. Or use many trees (next lesson).'},
 {k:'math',t:'Measuring impurity',short:'Gini / entropy',
  b:'<b>Gini impurity</b> is the chance that two randomly drawn points from the node have different classes. <b>Entropy</b> comes from information theory. Both are 0 for a pure node and peak at a 50/50 mix.\n\nFor regression trees, the impurity is just the variance of the targets in the node.'}
]});

/* ======================================================= random forest */
ML.add({id:'random-forest',title:'Random Forests',min:9,lvl:'Intermediate',
sub:'Grow hundreds of different, noisy trees and let them vote. The noise cancels out.',
keys:'bagging bootstrap ensemble feature subsampling out-of-bag feature importance',
learn:['Bootstrap sampling (bagging)','Random feature subsets decorrelate trees','Why averaging cuts variance','Out-of-bag error and feature importance'],
cheat:['Each tree sees a bootstrap sample (draw n rows with replacement).','Each split considers only a random subset of features.','Average / vote across trees → much lower variance than one tree.','~37% of rows are out-of-bag per tree: a free validation set.'],
met:[['trees','Trees','tree'],['acc','Test accuracy','check'],['var','Variance','chart']],
hero:2,
setup(){this.d=data2(31);const test=data2(77);const r=U.rng(5);
  this.forest=U.range(60).map(()=>{const bs=U.range(this.d.length).map(()=>this.d[Math.floor(r()*this.d.length)]);return grow(bs,12,[0,0,10,10],{mtry:1,r})});
  this.vote=(x,y,n)=>{const c={};this.forest.slice(0,n).forEach(T=>{const k=predict(T,x,y);c[k]=(c[k]||0)+1});return Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0]};
  const single=grow(this.d,12,[0,0,10,10]);const acc=f=>(test.filter(p=>f(p.x,p.y)===p.c).length/test.length*100).toFixed(0)+'%';
  this.steps[0].m={trees:'1',acc:acc((x,y)=>predict(single,x,y)),var:'high'};this.steps[2].m={trees:'60',acc:acc((x,y)=>this.vote(x,y,60)),var:'low'};this.steps[1].m={trees:'3'};this.single=single;},
draw(si,g){
  const s=[];
  if(si===0||si===2){const P=g.plot({x:50,y:30,w:400,h:410,xr:[0,10],yr:[0,10],xl:'x₁',yl:'x₂'});s.push(P.svg);
    s.push(P.clip(P.field(si===0?(x,y)=>predict(this.single,x,y):(x,y)=>this.vote(x,y,60),50,.22)),P.pts(this.d,4.5));
    s.push(g.panel(500,60,si===0?'One deep tree':'Vote of 60 trees',si===0?['jagged, noisy boundary','memorises outliers','test accuracy: '+this.steps[0].m.acc]:['smooth, stable boundary','outlier islands mostly gone','test accuracy: '+this.steps[2].m.acc],si===0?'red':'green'));}
  else if(si===1){[0,1,2].forEach(i=>{const P=g.plot({x:30+i*280,y:60,w:240,h:240,xr:[0,10],yr:[0,10],grid:false,title:`tree ${i+1} (own bootstrap sample)`});s.push(P.svg,P.clip(P.field((x,y)=>predict(this.forest[i],x,y),30,.3)))});
    s.push(g.panel(60,340,'Two sources of randomness',['1. bootstrap: each tree trains on n rows drawn WITH replacement','2. each split may only look at a random subset of features','→ trees make DIFFERENT mistakes, so the mistakes cancel when they vote'],'yellow'));}
  else if(si===3){s.push(g.T(60,50,'Why averaging works',{cls:'h'}));
    s.push(g.panel(60,80,'Variance of an average',['B trees, each with variance σ²,','pairwise correlation ρ:','','Var(avg) = ρσ² + (1−ρ)σ² / B','','more trees → second term → 0','less correlation → first term ↓'],'blue'));
    const Q=g.plot({x:470,y:80,w:340,h:280,xr:[1,100],yr:[0,1],xl:'number of trees B',yl:'variance (σ² = 1)',ticks:1,nx:4,ny:2});
    s.push(Q.svg,Q.fn(B=>.6+.4/B,'red'),Q.fn(B=>.15+.85/B,'green'),g.T(700,150,'ρ = 0.6',{c:'red',cls:'b'}),g.T(700,300,'ρ = 0.15',{c:'green',cls:'b'}));}
  else{s.push(g.T(60,50,'Free extras',{cls:'h'}),g.panel(60,80,'Out-of-bag (OOB) error',['each bootstrap misses ~37% of rows','(1 − 1/n)ⁿ → 1/e ≈ 0.37','score each row with only the','trees that never saw it','→ validation for free'],'purple'));
    s.push(g.T(470,95,'Feature importance (impurity decrease)',{cls:'b'}),g.hbars(460,110,360,[['income',.46],['age',.31],['tenure',.12],['region',.07],['noise',.04]],{c:'green',lw:80}));
    s.push(g.T(470,260,'Tip: permutation importance is less biased',{cls:'m'}),g.T(470,276,'toward features with many unique values.',{cls:'m'}))}
  return s.join('');
},
steps:[
 {k:'problem',t:'Trees are unstable',short:'One tree',
  b:'A single deep tree overfits: its boundary is jagged and it changes a lot if the training data changes slightly. Low bias, very <b>high variance</b>.\n\nWhat if we trained many trees and averaged them?'},
 {k:'technique',t:'Bagging + random features',short:'Bagging',
  b:'Training many trees on the same data gives identical trees. So each tree gets a <b>bootstrap sample</b> (rows drawn with replacement) and, at each split, only a <b>random subset of features</b>.\n\nThe trees now disagree in different places.'},
 {k:'solution',t:'The forest votes',short:'Vote',
  b:'For classification each tree votes; for regression, average. The ensemble keeps the trees’ low bias but most of the variance cancels out. The boundary becomes smooth, and test accuracy goes up.\n\nRandom forests work well out of the box with almost no tuning.'},
 {k:'math',t:'Why it works',short:'The math',m:{var:'ρσ² + (1−ρ)σ²/B'},
  b:'Averaging B models with correlation ρ leaves variance <code>ρσ² + (1−ρ)σ²/B</code>. More trees shrinks the second term; feature randomness lowers ρ and shrinks the first.\n\nMore trees never causes overfitting; it just costs compute.'},
 {k:'insight',t:'OOB error & importance',short:'Extras',
  b:'Each tree never sees about a third of the rows, so those <b>out-of-bag</b> rows give a built-in validation score.\n\nSumming how much each feature reduces impurity across all splits gives <b>feature importance</b>, a quick way to see what the model relies on.'}
]});

/* ======================================================= gradient boosting */
ML.add({id:'gradient-boosting',title:'Gradient Boosting',min:12,lvl:'Intermediate',
sub:'Add small trees one at a time, each fixing the mistakes of the ones before. XGBoost, LightGBM, CatBoost.',
keys:'boosting xgboost lightgbm catboost residuals weak learner stumps shrinkage adaboost',
learn:['Boosting vs bagging','Fitting each tree to the residuals','Learning rate (shrinkage) and number of trees','What XGBoost / LightGBM add'],
cheat:['Sequential: each new tree fits the residuals (negative gradient) of the current model.','F ← F + η·tree. Small η + many trees generalises best.','Bagging cuts variance; boosting cuts bias.','Gradient-boosted trees are the default winner on tabular data.'],
met:[['round','Round','repeat'],['eta','η','gear'],['mse','Train MSE','chart']],
hero:3,
setup(){const r=U.rng(19);const f=x=>Math.sin(x)*2+x*.3;this.d=U.range(40).map(i=>{const x=i/39*10;return {x,y:f(x)+U.gauss(r)*.45}});
  const stump=(res)=>{let b=null;for(let i=1;i<this.d.length;i++){const t=(this.d[i-1].x+this.d[i].x)/2;let sl=0,nl=0,sr=0,nr=0;this.d.forEach((p,j)=>{if(p.x<t){sl+=res[j];nl++}else{sr+=res[j];nr++}});const ml=sl/nl,mr=sr/nr;const e=this.d.reduce((s,p,j)=>s+(res[j]-(p.x<t?ml:mr))**2,0);if(!b||e<b.e)b={t,ml,mr,e}}return x=>x<b.t?b.ml:b.mr};
  const mean=this.d.reduce((s,p)=>s+p.y,0)/this.d.length;const eta=.3;let F=[x=>mean];this.hist=[];
  for(let k=0;k<=80;k++){const Fk=F;const pred=x=>Fk.reduce((s,h)=>s+h(x),0);const res=this.d.map(p=>p.y-pred(p.x));const mse=res.reduce((s,v)=>s+v*v,0)/res.length;const h=stump(res);this.hist.push({pred,res,h,mse});const hh=x=>eta*h(x);F=[...F,hh]}
  [0,0,0,1,5,80].forEach((k,i)=>{this.steps[i].m={round:String(k),eta:'0.3',mse:this.hist[k].mse.toFixed(2)}});this.steps[2].m.round='0 → 1';},
draw(si,g){
  const s=[];const k=[0,0,0,1,5,80][si]??80;const H=this.hist[k];
  if(si<=5){const P=g.plot({x:50,y:30,w:460,h:si===1||si===2?250:400,xr:[0,10],yr:[-3.5,5],xl:'x',yl:'y'});s.push(P.svg,P.pts(this.d.map(p=>({...p,c:'blue'})),4.5),P.fn(H.pred,'orange',{n:400}));
    if(si===1||si===2){this.d.forEach((p,j)=>s.push(`<line x1="${P.sx(p.x)}" y1="${P.sy(p.y)}" x2="${P.sx(p.x)}" y2="${P.sy(H.pred(p.x))}" style="stroke:var(--red);stroke-dasharray:2 3"/>`));
      const Q=g.plot({x:50,y:320,w:460,h:120,xr:[0,10],yr:[-3,3],grid:false,title:'residuals  r = y − F(x)'});s.push(Q.svg,`<line x1="${Q.x}" y1="${Q.sy(0)}" x2="${Q.x+Q.w}" y2="${Q.sy(0)}" style="stroke:var(--faint)"/>`,Q.pts(this.d.map((p,j)=>({x:p.x,y:H.res[j],c:'red'})),3.5));
      if(si===2)s.push(Q.fn(H.h,'green',{n:400,w:3}))}
    const txt=[['Round 0: a constant','predict the mean for everyone','  F₀(x) = ȳ','big errors everywhere'],['Look at the mistakes','residual = what is still wrong','these become the NEW targets'],['Fit a stump to residuals','a depth-1 tree (green)','captures the biggest pattern','left in the errors'],['Add it, scaled by η','F₁ = F₀ + η · tree₁','η = 0.3 → take a cautious step'],['After 5 rounds','each tree fixed what the','previous ones missed'],['After 80 rounds','80 tiny trees summed','smooth, accurate fit','(watch validation for overfit)']][si];
    s.push(g.panel(550,40,txt[0],txt.slice(1),['gray','red','green','orange','orange','green'][si]));
    if(si>=3){const Q=g.plot({x:560,y:250,w:250,h:150,xr:[0,80],yr:[0,this.hist[0].mse],title:'training MSE by round',grid:false});s.push(Q.svg,Q.line(this.hist.map((h,i)=>[i,h.mse]),'orange'),g.C(Q.sx(k),Q.sy(H.mse),5,'red'))}
  }
  if(si===6){s.length=0;s.push(g.T(60,50,'Modern gradient boosting libraries',{cls:'h'}));
    [['XGBoost','2016','2nd-order gradients, L1/L2 on leaf weights, sparse-aware splits','red'],['LightGBM','2017','histogram bins, leaf-wise growth, GOSS sampling: very fast','green'],['CatBoost','2018','ordered boosting, native categorical features','yellow']].forEach(([n,y,d,c],i)=>{s.push(g.box(150,120+i*90,160,60,n,c,{sub:y}),g.T(250,124+i*90,d,{cls:'m'}))});
    s.push(g.panel(60,390,'Bagging vs boosting',['bagging (forest): parallel, independent trees, cuts variance','boosting: sequential, each tree fixes the last, cuts bias'],'blue'))}
  return s.join('');
},
steps:[
 {k:'setup',t:'Start with a constant',short:'F₀',
  b:'Boosting builds a model as a <b>sum of many weak models</b>, added one at a time. Start with the simplest prediction possible: the average of y.'},
 {k:'technique',t:'Residuals are the new target',short:'Residuals',
  b:'Compute what the current model gets wrong: the <b>residuals</b> y − F(x). For squared error these are exactly the negative gradient of the loss, hence “gradient” boosting.\n\nInstead of predicting y, the next tree will predict these mistakes.'},
 {k:'solution',t:'Fit a small tree to the residuals',short:'Weak learner',
  b:'Fit a deliberately weak model (here a depth-1 <b>stump</b>, in practice depth 3 to 8) to the residuals. It finds the single biggest pattern left in the errors.'},
 {k:'solution',t:'Add it with a learning rate',short:'Add (η)',
  b:'Add the tree to the model, multiplied by a small <b>learning rate</b> η: <code>F ← F + η·tree</code>. Taking small steps and using more trees almost always generalises better.\n\nThen recompute residuals and repeat.'},
 {k:'insight',t:'Errors shrink round by round',short:'5 rounds',
  b:'Each round removes some of the remaining error. Unlike a random forest, the trees are not independent: each one specialises in what the others missed. That attacks <b>bias</b>.'},
 {k:'tradeoff',t:'Many rounds',short:'80 rounds',
  b:'After many rounds the sum of tiny step functions traces the curve closely. Too many rounds will fit noise, so use <b>early stopping</b>: stop when validation error stops improving.'},
 {k:'recap',t:'XGBoost, LightGBM, CatBoost',short:'Libraries',m:{round:'—',eta:'~0.05',mse:'—'},
  b:'Industrial libraries add second-order gradients, regularised leaf weights, histogram-based splits, and clever handling of missing and categorical values.\n\nOn <b>tabular</b> data (spreadsheets, databases) gradient-boosted trees still routinely beat deep learning. They are the first thing to try.'}
]});
})();
