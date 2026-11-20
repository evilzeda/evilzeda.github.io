/* 05 · Neural networks */
(function(){const U=ML.U;

/* ======================================================= perceptron & MLP */
ML.add({id:'perceptron-mlp',title:'Neurons & Multi-Layer Perceptrons',min:11,lvl:'Beginner',
sub:'A neuron is a weighted sum plus a bend. Stack layers of them and you can approximate anything.',
keys:'neuron perceptron activation relu sigmoid tanh gelu xor hidden layer universal approximation mlp feedforward',
learn:['What one artificial neuron computes','Why non-linear activations are essential','Why one neuron cannot solve XOR','How hidden layers build complex functions'],
cheat:['Neuron: a = φ(w·x + b).','Without non-linear φ, any stack of layers collapses to one linear layer.','ReLU(z) = max(0, z) is the default; transformers use GELU / SwiGLU.','A hidden layer bends space so the classes become linearly separable.'],
met:[['layers','Layers','layers'],['params','Parameters','hash'],['act','Activation','bolt']],
hero:4,
setup(){const r=U.rng(51);this.xor=[];[[2.5,2.5,'blue'],[7.5,7.5,'blue'],[2.5,7.5,'orange'],[7.5,2.5,'orange']].forEach(([x,y,c])=>this.xor.push(...U.blob(r,16,x,y,.9,.9,c)));},
draw(si,g){
  const s=[];
  if(si===0){const xs=[[120,140,'x₁','0.8'],[120,240,'x₂','−0.5'],[120,340,'x₃','1.2']];
    xs.forEach(([x,y,l,w])=>{s.push(g.box(x,y,60,44,l,'blue'),g.A(150,y,380,240,{c:'gray'}),g.pill(265,y+(240-y)*.5-8,'w = '+w,w[0]==='−'?'red':'green'))});
    s.push(`<circle cx="430" cy="240" r="48" style="fill:var(--orange-bg);stroke:var(--edge);stroke-width:1.6"/>`,g.T(430,236,'Σ + b',{a:'middle',cls:'h'}),g.T(430,256,'z',{a:'middle',cls:'m'}));
    s.push(g.A(478,240,560,240),g.box(610,240,90,56,'φ(z)','purple',{sub:'activation'}),g.A(655,240,730,240),g.box(770,240,70,44,'a','green'));
    s.push(g.T(60,440,'a = φ(w·x + b)   ·   loosely inspired by a biological neuron: inputs → weighted → fire or not',{cls:'m'}));}
  else if(si===1){const fns=[['step',z=>z>0?1:0,'gray'],['sigmoid',z=>U.sigmoid(z),'blue'],['tanh',z=>Math.tanh(z),'green'],['ReLU',z=>Math.max(0,z),'orange'],['GELU',z=>0.5*z*(1+Math.tanh(0.7978845608*(z+0.044715*z**3))),'red']];
    fns.forEach(([n,f,c],i)=>{const P=g.plot({x:30+(i%3)*280,y:40+Math.floor(i/3)*220,w:230,h:160,xr:[-4,4],yr:[-1.2,3],grid:false,title:n});s.push(P.svg,`<line x1="${P.x}" y1="${P.sy(0)}" x2="${P.x+P.w}" y2="${P.sy(0)}" style="stroke:var(--line2)"/><line x1="${P.sx(0)}" y1="${P.y}" x2="${P.sx(0)}" y2="${P.y+P.h}" style="stroke:var(--line2)"/>`,P.fn(f,c,{n:200}))});
    s.push(g.panel(590,270,'Why bend at all?',['two linear layers =','W₂(W₁x) = (W₂W₁)x','= still ONE linear layer','the bend is what adds power'],'yellow'));}
  else if(si===2||si===3){const P=g.plot({x:50,y:30,w:410,h:410,xr:[0,10],yr:[0,10],xl:'x₁',yl:'x₂'});this.P=P;s.push(P.svg);
    if(si===3)s.push(P.clip(P.field((x,y)=>((x-5)*(y-5)>0)?'blue':'orange',40,.2)));
    s.push(P.pts(this.xor,4.5));
    if(si===2){s.push(P.line([[0,3],[10,8]],'red',{cls:'dash'}),g.panel(500,60,'XOR: one neuron fails',['blue when x₁, x₂ both low or both high','orange otherwise','','a single neuron = one straight line','no line separates these'],'red'))}
    else{const N=g.net(540,180,260,170,[2,4,1],{c:'blue',titles:['input','hidden (ReLU)','output']});s.push(N.svg,g.panel(500,40,'Add a hidden layer',['hidden neurons each draw a line','the output combines them','→ curved, multi-part boundary'],'green'))}}
  else{const N=g.net(80,70,600,320,[4,6,6,6,3],{c:'blue',titles:['input x','hidden 1','hidden 2','hidden 3','output'],sp:48});this.N=N;s.push(N.svg);
    s.push(g.panel(700,70,'Deep network',['each layer:','h = φ(W·h_prev + b)','','4·6+6·6+6·6+6·3','+ biases = 135 params','','GPT-3: 175 billion'],'blue'))}
  return s.join('');
},
anim(si,t,g){
  if(si===0){const p=(t%2.4)/2.4;return g.dot(150,140,380,240,p,'blue')+g.dot(150,240,380,240,p,'blue')+g.dot(150,340,380,240,p,'blue')+(p>.6?g.dot(478,240,560,240,(p-.6)/.4,'orange'):'')}
  if(si===4&&this.N){const L=this.N.nodes,ph=(t*1.2)%(L.length);const li=Math.floor(ph),k=ph-li;if(li>=L.length-1)return '';let s='';L[li].forEach(a=>L[li+1].forEach((b,j)=>{if((j+li)%2===0)s+=g.dot(a.x,a.y,b.x,b.y,k,'orange',{r:3.5})}));return s}
  return '';
},
steps:[
 {k:'setup',t:'One artificial neuron',short:'Neuron',m:{layers:'1',params:'4',act:'φ'},
  b:'A neuron multiplies each input by a <b>weight</b>, adds them up with a <b>bias</b>, and passes the result through an <b>activation function</b> φ.\n\nThat is logistic regression when φ is the sigmoid. All the power of deep learning comes from wiring many of these together.'},
 {k:'insight',t:'Activation functions',short:'Activations',m:{act:'ReLU'},
  b:'The activation adds a <b>bend</b>. Without it, stacking layers is pointless: a chain of linear maps is just another linear map.\n\n<b>ReLU</b> (max(0, z)) is cheap and trains well, so it became the default. Transformers use smooth cousins like <b>GELU</b> and SwiGLU.'},
 {k:'problem',t:'XOR: the classic failure',short:'XOR',m:{layers:'1',params:'3'},
  b:'In 1969 Minsky and Papert pointed out that a single perceptron cannot learn XOR: the classes sit on opposite corners and no single straight line separates them.\n\nThis result helped trigger the first “AI winter”.'},
 {k:'solution',t:'A hidden layer',short:'Hidden layer',m:{layers:'2',params:'17'},
  b:'Add a <b>hidden layer</b> between input and output. Each hidden neuron draws its own line; the output neuron combines them into a boundary with several pieces.\n\nAnother view: the hidden layer <b>re-maps the input space</b> so the classes become linearly separable for the last neuron.'},
 {k:'insight',t:'Going deep',short:'Deep nets',m:{layers:'4',params:'135'},
  n:['Input vector enters','Each layer: weighted sums + activation','Features get more abstract with depth','Output layer gives scores / probabilities'],
  b:'The <b>universal approximation theorem</b> says one wide hidden layer can approximate any continuous function. In practice, <b>deep</b> networks (many layers) learn the same functions with far fewer neurons, building features layer on layer.\n\nThis forward flow is called a <b>forward pass</b>. Next: how the weights are learned.'}
]});

/* ======================================================= backpropagation */
ML.add({id:'backpropagation',title:'Backpropagation',min:12,lvl:'Intermediate',
sub:'The chain rule, applied backwards through the network, gives every weight its gradient in one pass.',
keys:'backprop chain rule computational graph autograd vanishing gradient derivative',
learn:['Networks as computational graphs','Forward pass computes values; backward pass computes gradients','The chain rule, with real numbers','Vanishing gradients and autograd'],
cheat:['∂L/∂w = ∂L/∂a · ∂a/∂z · ∂z/∂w (chain rule).','One backward pass costs about the same as one forward pass.','Frameworks (PyTorch, JAX) do it automatically: autograd.','Many small derivatives multiplied → vanishing gradients; fixed by ReLU, residuals, normalisation.'],
met:[['pass','Pass','repeat'],['loss','Loss','chart'],['grad','∂L/∂w','hash']],
hero:2,
draw(si,g){
  const s=[];
  // graph: x=2, w=0.5, b=-0.4 → z=w*x+b=0.6 → a=relu=0.6 → L=(a-y)^2 with y=1 → 0.16
  const N={x:[90,130],w:[90,250],b:[90,370],m:[260,190],z:[400,280],a:[560,280],L:[730,280]};
  if(si<=2){
    const ed=[['x','m'],['w','m'],['m','z'],['b','z'],['z','a'],['a','L']];
    ed.forEach(([p,q])=>s.push(g.A(N[p][0]+38,N[p][1],N[q][0]-42,N[q][1],{c:'gray'})));
    const lab={x:'x',w:'w',b:'b',m:'×',z:'+',a:'ReLU',L:'(a − y)²'},val={x:'2.0',w:'0.5',b:'−0.4',m:'1.0',z:'0.6',a:'0.6',L:'0.16'},grd={x:'',w:'−1.6',b:'−0.8',m:'−0.8',z:'−0.8',a:'−0.8',L:'1'};
    Object.entries(N).forEach(([k,[x,y]])=>{s.push(g.box(x,y,k==='L'?110:76,48,lab[k],['x','w','b'].includes(k)?'blue':k==='L'?'red':'purple',{hot:si===2&&k==='w'}));
      if(si>=1)s.push(g.pill(x,y-38,'= '+val[k],'green'));
      if(si>=2&&grd[k])s.push(g.pill(x,y+40,'∂L = '+grd[k],'red'))});
    s.push(g.T(730,360,'target y = 1',{a:'middle',cls:'m'}));
    if(si===0)s.push(g.panel(470,40,'A computational graph',['every operation is a node','z = w·x + b,  a = ReLU(z)','L = (a − y)²'],'purple'));
    if(si===2)s.push(g.panel(190,400,'Chain rule for w',['∂L/∂w = ∂L/∂a · ∂a/∂z · ∂z/∂w','      = 2(a−y) ·  1   ·  x   = (−0.8)(1)(2) = −1.6'],'red',{w:470}));
  }else if(si===3){const Nn=g.net(70,70,560,300,[3,5,5,2],{c:'blue',titles:['input','hidden','hidden','output → loss']});this.N=Nn;s.push(Nn.svg);
    s.push(g.panel(660,70,'Whole network',['forward: left → right','  (orange) values','backward: right → left','  (red) gradients','','then update every weight:','w ← w − η·∂L/∂w'],'red'))}
  else if(si===4){const P=g.plot({x:60,y:50,w:440,h:340,xr:[1,10],yr:[0,1],xl:'layer (from output back to input)',yl:'gradient size',ticks:1,nx:9,ny:2});
    s.push(P.svg,P.line(U.range(10).map(i=>[i+1,Math.pow(.25,i)]),'red'),P.line(U.range(10).map(i=>[i+1,Math.pow(.92,i)]),'green'));
    s.push(g.T(P.sx(3),P.sy(.3),'sigmoid: ×0.25 per layer',{c:'red',cls:'b'}),g.T(P.sx(5),P.sy(.78),'ReLU + residuals',{c:'green',cls:'b'}));
    s.push(g.panel(540,60,'Vanishing gradients',['sigmoid slope ≤ 0.25','10 layers: 0.25¹⁰ ≈ 0.000001','early layers stop learning','','fixes: ReLU, careful init,','residual connections,','normalisation layers'],'yellow'))}
  else{s.push(g.T(60,50,'You rarely write backprop by hand',{cls:'h'}));
    s.push(g.panel(60,90,'PyTorch',['w = torch.tensor(0.5, requires_grad=True)','loss = (relu(w*x + b) - y)**2','loss.backward()','w.grad   # tensor(-1.6)'],'blue'));
    s.push(g.panel(60,250,'Autograd',['records every op in the forward pass','replays the graph backwards','applying each op’s local derivative'],'purple'),g.panel(470,250,'Cost',['backward ≈ 2× forward compute','must keep activations in memory','(why training needs more GPU RAM','than inference)'],'yellow'))}
  return s.join('');
},
anim(si,t,g){if(si!==3||!this.N)return '';const L=this.N.nodes,n=L.length-1,ph=(t*1.1)%(2*n+1);let s='';
  if(ph<n){const li=Math.floor(ph),k=ph-li;L[li].forEach(a=>L[li+1].forEach((b,j)=>{if(j%2===0)s+=g.dot(a.x,a.y,b.x,b.y,k,'orange',{r:3.5})}))}
  else if(ph>=n+1){const q=ph-n-1,li=n-Math.floor(q),k=q-Math.floor(q);if(li>0)L[li].forEach(a=>L[li-1].forEach((b,j)=>{if(j%2===0)s+=g.dot(a.x,a.y,b.x,b.y,k,'red',{r:3.5})}))}
  return s},
steps:[
 {k:'setup',t:'A network is a graph',short:'Graph',m:{pass:'—'},
  b:'Training needs ∂L/∂w for <b>every</b> weight. Write the network as a <b>computational graph</b>: each node is a simple operation (multiply, add, ReLU, square) whose derivative we know.'},
 {k:'technique',t:'Forward pass',short:'Forward',m:{pass:'forward',loss:'0.16'},
  b:'Feed numbers through from left to right and store every intermediate value (green). With x = 2, w = 0.5, b = −0.4 we get z = 0.6, a = 0.6 and, against target y = 1, a loss of 0.16.'},
 {k:'math',t:'Backward pass: the chain rule',short:'Backward',m:{pass:'backward',grad:'−1.6'},
  b:'Start at the loss with ∂L/∂L = 1 and walk backwards. At each node, multiply the incoming gradient by that node’s <b>local derivative</b>. That is the <b>chain rule</b>.\n\nFor w the result is −1.6: increasing w would reduce the loss, so gradient descent pushes w up. One backward sweep yields every gradient at once.'},
 {k:'solution',t:'Whole networks',short:'Network',m:{pass:'fwd + bwd'},
  n:['Forward: compute and cache activations','Loss compares output with target','Backward: gradients flow right → left','Optimizer updates all weights'],
  b:'For a full network the same process runs layer by layer: a forward pass caches activations, a backward pass sends gradients from the loss back to the first layer, and an optimizer updates every weight.\n\nThat is one <b>training step</b>. GPT-class models repeat it hundreds of thousands of times.'},
 {k:'problem',t:'Vanishing gradients',short:'Vanishing',
  b:'Gradients are products of many local derivatives. If each is small (the sigmoid’s is at most 0.25) the product shrinks exponentially, and early layers barely learn. If each is large, gradients <b>explode</b>.\n\nThis stalled deep learning for years, until ReLU, better initialisation, normalisation and <b>residual connections</b> fixed it.'},
 {k:'recap',t:'Autograd does it for you',short:'Autograd',m:{pass:'automatic'},
  b:'Modern frameworks record the graph as your code runs and differentiate it automatically (<b>reverse-mode automatic differentiation</b>). You write the forward pass; <code>loss.backward()</code> does the rest.\n\nThe memory cost of caching activations is why training needs far more GPU memory than inference.'}
]});

/* ======================================================= training tricks */
ML.add({id:'training-tricks',title:'Optimizers & Regularisers',min:11,lvl:'Intermediate',
sub:'Momentum, Adam, learning-rate schedules, dropout and normalisation: what makes deep nets actually train.',
keys:'adam momentum adamw learning rate schedule warmup cosine dropout batch norm layer norm early stopping',
learn:['Momentum and Adam vs plain SGD','Warm-up and cosine learning-rate schedules','Dropout as built-in ensembling','Batch / layer normalisation and early stopping'],
cheat:['Momentum: keep a running average of gradients, roll through ravines.','Adam: per-weight step sizes from gradient mean and variance. AdamW = Adam + decoupled weight decay (LLM default).','Warm-up then cosine decay is the standard LLM schedule.','Dropout randomly zeroes activations in training; LayerNorm stabilises every transformer block.'],
met:[['opt','Optimizer','gear'],['lr','Learning rate','timer'],['trick','Regulariser','filter']],
hero:0,
setup(){const f=(x,y)=>[0.1*x,4*y];// gradient of 0.05x²+2y²
  const run=(kind)=>{let x=-9,y=1.6,vx=0,vy=0,mx=0,my=0,sx=0,sy=0;const p=[[x,y]];for(let t=1;t<=60;t++){const [gx,gy]=f(x,y);
    if(kind==='sgd'){x-=.42*gx;y-=.42*gy}
    else if(kind==='mom'){vx=.85*vx+gx;vy=.85*vy+gy;x-=.07*vx;y-=.07*vy}
    else{mx=.9*mx+.1*gx;my=.9*my+.1*gy;sx=.999*sx+.001*gx*gx;sy=.999*sy+.001*gy*gy;const mh=1-Math.pow(.9,t),vh=1-Math.pow(.999,t);x-=.35*(mx/mh)/(Math.sqrt(sx/vh)+1e-8);y-=.35*(my/mh)/(Math.sqrt(sy/vh)+1e-8)}p.push([x,y])}return p};
  this.paths={sgd:run('sgd'),mom:run('mom'),adam:run('adam')};},
draw(si,g){
  const s=[];
  if(si===0){const P=g.plot({x:50,y:40,w:480,h:300,xr:[-10,2],yr:[-2,2],grid:false,xl:'w₁',yl:'w₂'});this.P=P;s.push(P.svg);
    const el=[];[0.2,.8,1.8,3.2,5].forEach(v=>el.push(`<ellipse cx="${P.sx(0)}" cy="${P.sy(0)}" rx="${Math.sqrt(v/.05)/12*480}" ry="${Math.sqrt(v/2)/4*300}" style="fill:none;stroke:var(--blue);opacity:.45"/>`));
    s.push(P.clip(el.join('')+P.line(this.paths.sgd,'red',{cls:'thin'})+P.line(this.paths.mom,'yellow',{cls:'thin'})+P.line(this.paths.adam,'green',{cls:'thin'})));
    s.push(g.T(60,380,'red: SGD zig-zags across the steep direction, crawls along the shallow one',{c:'red',cls:'b'}),g.T(60,400,'yellow: momentum builds speed along the valley',{c:'yellow',cls:'b'}),g.T(60,420,'green: Adam rescales each weight’s step by its gradient history',{c:'green',cls:'b'}));
    s.push(g.panel(570,40,'Adam update',['m = β₁m + (1−β₁)g   mean','v = β₂v + (1−β₂)g²  variance','w ← w − η · m̂ / (√v̂ + ε)','','β₁=0.9  β₂=0.999 (or 0.95)'],'green'));}
  else if(si===1){const P=g.plot({x:60,y:40,w:480,h:340,xr:[0,100],yr:[0,1.1],xl:'training progress (%)',yl:'learning rate (× peak)',ticks:1,nx:5,ny:2});
    const lr=t=>t<5?t/5:.1+.9*.5*(1+Math.cos(Math.PI*(t-5)/95));s.push(P.svg,P.fn(lr,'purple',{n:300}),P.fn(()=>1,'gray',{cls:'dash thin'}));
    s.push(g.T(P.sx(1),P.sy(1.05),'warm-up',{cls:'b',c:'orange'}),g.T(P.sx(45),P.sy(.75),'cosine decay',{cls:'b',c:'purple'}));
    s.push(g.panel(580,60,'Why a schedule?',['start: weights random, Adam’s','statistics empty → warm up','middle: big steps explore','end: small steps settle into','a good minimum'],'purple'));}
  else if(si===2){const N=g.net(70,60,520,330,[4,7,7,3],{c:'blue',titles:['input','hidden','hidden','output']});this.N=N;s.push(N.svg);
    s.push(g.panel(620,60,'Dropout (p = 0.5)',['each training step, zero a','random half of the neurons','','no neuron can rely on','any single partner','','test time: use all,','scaled to match'],'red'));}
  else if(si===3){const r=U.rng(4);const h=(x0,y0,data,c,t)=>{const b=Array(32).fill(0);data.forEach(v=>{const i=Math.floor((v+6)/16*32);if(i>=0&&i<32)b[i]++});const P=g.plot({x:x0,y:y0,w:300,h:160,xr:[-6,10],yr:[0,Math.max(...b)*1.1],grid:false,title:t});s.push(P.svg);b.forEach((n,i)=>s.push(g.R(P.sx(-6+i*.5)+1,P.sy(n),300/32-2,P.y+160-P.sy(n),{fill:`var(--${c})`,op:.55,rx:1})))};
    const raw=U.range(300).map(()=>4+U.gauss(r)*2.4);const m=raw.reduce((a,b)=>a+b,0)/300,sd=Math.sqrt(raw.reduce((a,b)=>a+(b-m)**2,0)/300);
    h(60,60,raw,'red','activations before: drifting mean, wide');h(60,290,raw.map(v=>(v-m)/sd),'green','after normalisation: mean 0, std 1');
    s.push(g.A(210,226,210,262,{c:'gray'}));
    s.push(g.panel(430,60,'Normalisation layers',['x̂ = (x − μ) / σ, then ×γ + β','','BatchNorm: μ, σ over the batch','  (CNNs)','LayerNorm: μ, σ over features','  of ONE token (transformers)','RMSNorm: skip the mean','  (Llama and most new LLMs)'],'green'));}
  else{const P=g.plot({x:60,y:40,w:480,h:340,xr:[0,100],yr:[0,1.2],xl:'epochs',yl:'loss',ny:3});const tr=e=>1.05*Math.exp(-e/18)+.08,va=e=>1.05*Math.exp(-e/18)+.18+.0035*Math.max(0,e-30)**1.3/6;
    s.push(P.svg,P.fn(tr,'blue'),P.fn(va,'orange'),`<line x1="${P.sx(34)}" y1="${P.y}" x2="${P.sx(34)}" y2="${P.y+P.h}" style="stroke:var(--green);stroke-width:2;stroke-dasharray:6 4"/>`,g.pill(P.sx(34),P.y+18,'stop here','green'));
    s.push(g.T(P.sx(80),P.sy(tr(80))+16,'train',{c:'blue',cls:'b'}),g.T(P.sx(80),P.sy(va(80))-10,'validation',{c:'orange',cls:'b'}));
    s.push(g.panel(580,60,'Early stopping',['watch validation loss','stop (keep best checkpoint)','when it stops improving','','LLM pretraining rarely','overfits: data is huge'],'green'))}
  return s.join('');
},
anim(si,t,g){
  if(si===0&&this.P){const P=this.P,i=Math.min(60,Math.floor((t*10)%75));return ['sgd','mom','adam'].map((k,j)=>{const p=this.paths[k][i];return g.C(U.clamp(P.sx(p[0]),P.x,P.x+P.w),U.clamp(P.sy(p[1]),P.y,P.y+P.h),6,['red','yellow','green'][j])}).join('')}
  if(si===2&&this.N){const r=U.rng(1+Math.floor(t*1.2));let s='';this.N.nodes.forEach((L,li)=>{if(li===0||li===3)return;L.forEach(p=>{if(r()<.5)s+=`<circle cx="${p.x}" cy="${p.y}" r="12" style="fill:var(--bg);stroke:var(--faint);stroke-dasharray:3 3"/>`+g.icon('x',p.x,p.y,14,'var(--red)')})});return s}
  return '';
},
steps:[
 {k:'technique',t:'Momentum and Adam',short:'Optimizers',m:{opt:'SGD · momentum · Adam'},
  b:'Loss surfaces are often long, narrow valleys. Plain SGD zig-zags across the steep walls and crawls along the floor.\n\n<b>Momentum</b> keeps a running average of gradients so it builds speed in consistent directions. <b>Adam</b> also divides each weight’s step by the size of its recent gradients, giving every weight its own effective learning rate. <b>AdamW</b> is the default for training LLMs.'},
 {k:'technique',t:'Learning-rate schedules',short:'Schedules',m:{lr:'warm-up → cosine'},
  b:'A fixed learning rate is rarely best. LLMs use <b>linear warm-up</b> for the first few thousand steps (to avoid early instability) followed by <b>cosine decay</b> to a small fraction of the peak.\n\nLarge steps early explore; small steps late refine.'},
 {k:'solution',t:'Dropout',short:'Dropout',m:{trick:'dropout'},
  b:'During training, randomly switch off a fraction of neurons at every step. The network cannot depend on any one path, so it learns redundant, robust features.\n\nIt behaves like training a huge ensemble of thinned networks that share weights. Turned off at inference time.'},
 {k:'solution',t:'Normalisation',short:'Norm layers',m:{trick:'LayerNorm'},
  b:'As weights change, the distribution of each layer’s inputs drifts, which makes training unstable. <b>Normalisation</b> layers re-centre and re-scale activations to mean 0 and variance 1, then let the network learn its own scale and shift.\n\nTransformers apply <b>LayerNorm</b> (or RMSNorm) inside every block.'},
 {k:'solution',t:'Early stopping',short:'Early stop',m:{trick:'early stopping'},
  b:'The simplest regulariser: keep checkpoints and stop when validation loss turns up. Combined with weight decay (L2), dropout and data augmentation, it keeps deep nets from memorising.\n\nRule of thumb for debugging: first get the model to overfit a tiny batch, then add regularisation.'}
]});

/* ======================================================= CNN */
ML.add({id:'cnn',title:'Convolutional Neural Networks',min:12,lvl:'Intermediate',
sub:'Slide small learned filters over an image to find edges, then shapes, then objects.',
keys:'cnn convolution kernel filter feature map pooling stride padding resnet vision',
learn:['Why fully-connected layers waste parameters on images','How a convolution filter slides and responds','Pooling and the feature hierarchy','Residual connections (ResNet)'],
cheat:['A conv layer = small filters (e.g. 3×3) shared across every position.','Weight sharing → far fewer parameters + translation equivariance.','Stack conv → ReLU → pool; deeper layers see larger regions.','ResNet’s skip connections (x + F(x)) made 100+ layer nets trainable; transformers reuse the idea.'],
met:[['in','Input','img'],['k','Kernel','grid'],['out','Output','layers']],
hero:1,
setup(){const img=U.range(8).map(()=>Array(8).fill(0));for(let i=1;i<7;i++){img[i][2]=1;img[i][5]=1}for(let j=2;j<6;j++){img[1][j]=1;img[6][j]=1}img[3][3]=.2;this.img=img;
  const K=[[-1,0,1],[-2,0,2],[-1,0,1]];this.K=K;this.fm=U.range(6).map(i=>U.range(6).map(j=>{let s=0;for(let a=0;a<3;a++)for(let b=0;b<3;b++)s+=K[a][b]*img[i+a][j+b];return s}));},
draw(si,g){
  const s=[];const cs=34;
  const grid=(x,y,M,c,o={})=>g.heat(x,y,M,{cs:o.cs||cs,c,min:o.min!=null?o.min:0,max:o.max||1,vals:o.vals||false,fmt:v=>(+v).toFixed(0),cf:o.cf});
  if(si===0){s.push(grid(60,80,this.img,'gray'),g.T(60,70,'8×8 image (a "0")',{cls:'b'}));
    s.push(g.panel(400,80,'Why not a plain MLP?',['a 224×224×3 photo = 150,528 inputs','one dense layer of 1,000 neurons','= 150 million weights','','and it must re-learn "edge" for','every position separately'],'red'));}
  else if(si===1){s.push(grid(60,80,this.img,'gray'),g.T(60,70,'input',{cls:'b'}));
    s.push(g.heat(390,110,this.K,{cs:34,min:-2,max:2,c:'purple',fmt:v=>v,cf:v=>v<0?'red':'green'}),g.T(390,100,'3×3 kernel',{cls:'b'}),g.T(390,232,'detects vertical',{cls:'m'}),g.T(390,248,'edges',{cls:'m'}));
    s.push(grid(560,80,this.fm,'blue',{min:-4,max:4,vals:true,cf:v=>v<0?'red':'blue',cs:40}),g.T(560,70,'feature map 6×6',{cls:'b'}));this.L1={x:60,y:80};}
  else if(si===2){const fm=this.fm.map(r=>r.map(v=>Math.max(0,v)));s.push(grid(60,100,fm,'blue',{max:4,vals:true,cs:40}),g.T(60,90,'after ReLU (6×6)',{cls:'b'}));
    const pool=U.range(3).map(i=>U.range(3).map(j=>Math.max(fm[2*i][2*j],fm[2*i][2*j+1],fm[2*i+1][2*j],fm[2*i+1][2*j+1])));
    s.push(g.A(320,220,400,220,{l:'2×2 max-pool',lt:'yellow',ly:-16}),grid(430,140,pool,'blue',{max:4,vals:true,cs:48}),g.T(430,130,'pooled (3×3)',{cls:'b'}));
    s.push(g.panel(620,100,'Pooling',['keep the strongest response','in each 2×2 patch','','halves width & height','small shifts → same output'],'yellow'));}
  else if(si===3){const st=[['image','gray',150,150],['edges','blue',120,130],['textures','green',96,110],['parts','purple',72,90],['objects','orange',50,70]];
    st.forEach(([l,c,w,h],i)=>{const x=90+i*165;for(let k=2;k>=0;k--)s.push(g.R(x-w/2+k*6,240-h/2-k*6,w,h,{fill:`color-mix(in srgb,var(--${c}) ${20+k*10}%,var(--mixbase))`,stroke:'var(--edge)',sw:1.3,rx:4}));s.push(g.T(x+6,240+h/2+26,l,{a:'middle',cls:'b'}));if(i<4)s.push(g.A(x+w/2+12,240,x+165-st[i+1][2]/2-6,240,{c:'gray'}))});
    s.push(g.T(60,420,'deeper layers combine earlier features and see a larger part of the image (receptive field)',{cls:'m'}));}
  else{s.push(g.box(200,90,180,50,'x','blue'),g.A(200,115,200,165),g.box(200,190,180,46,'conv → norm → ReLU','purple',{fs:11}),g.A(200,213,200,255),g.box(200,280,180,46,'conv → norm','purple',{fs:11}),g.A(200,303,200,355),
      `<circle cx="200" cy="375" r="18" style="fill:var(--green-bg);stroke:var(--edge);stroke-width:1.5"/>`,g.T(200,381,'+',{a:'middle',cls:'h'}),g.A(200,393,200,440),g.T(215,450,'x + F(x)',{cls:'b'}));
    s.push(`<path d="M290,90 C380,90 380,375 222,375" style="fill:none;stroke:var(--green);stroke-width:2.4"/>`,g.T(370,230,'skip',{cls:'b',c:'green'}));
    s.push(g.panel(470,80,'ResNet (2015)',['each block learns a CORRECTION','F(x) added to its input','gradients flow straight through','the skip path','','152 layers trained fine','every transformer block uses','the same residual trick'],'green'))}
  return s.join('');
},
anim(si,t,g){if(si!==1)return '';const n=36,i=Math.floor((t*2.5)%n),r=Math.floor(i/6),c=i%6,cs=34;
  return g.R(60+c*cs,80+r*cs,cs*3,cs*3,{stroke:'var(--red)',sw:3,rx:5})+g.R(560+c*40,80+r*40,40,40,{stroke:'var(--red)',sw:3,rx:5})+g.A(60+c*cs+cs*3+4,80+r*cs+cs*1.5,560+c*40-4,80+r*40+20,{c:'red',curve:30,op:.6})},
steps:[
 {k:'problem',t:'Images are huge',short:'The problem',m:{in:'224×224×3',k:'—',out:'—'},
  b:'Treating every pixel as a separate input to a dense layer explodes the parameter count and ignores the fact that an edge is an edge wherever it appears.\n\nWe want a layer that reuses the same pattern detector everywhere.'},
 {k:'technique',t:'Convolution',short:'Convolve',m:{in:'8×8',k:'3×3',out:'6×6'},
  n:['Place the 3×3 kernel on a patch','Multiply element-wise and sum','Write one number to the feature map','Slide one pixel and repeat'],
  b:'A <b>kernel</b> (filter) is a small grid of weights. Slide it across the image; at each position multiply and sum. The output, a <b>feature map</b>, lights up wherever the pattern appears.\n\nThis kernel detects vertical edges: positive on the left edge of the “0”, negative on the right. In a CNN the kernel values are <b>learned</b>, and each layer has dozens to hundreds of them.'},
 {k:'technique',t:'ReLU and pooling',short:'Pooling',m:{in:'6×6',k:'2×2 max',out:'3×3'},
  b:'Apply ReLU, then <b>pool</b>: keep only the maximum of each 2×2 patch. The map shrinks, computation drops, and small shifts in the image barely change the result.\n\nModern nets often use strided convolutions instead of pooling.'},
 {k:'insight',t:'A hierarchy of features',short:'Hierarchy',m:{in:'image',k:'many',out:'class'},
  b:'Stack conv–ReLU–pool many times. Early filters find edges and colours, middle layers find textures and parts (eyes, wheels), and deep layers respond to whole objects.\n\nThis is why CNNs (AlexNet, 2012) transformed computer vision. Vision Transformers now rival them by applying attention to image patches.'},
 {k:'solution',t:'Residual connections',short:'ResNet',m:{in:'x',k:'—',out:'x + F(x)'},
  b:'Very deep CNNs got <i>worse</i>, even on training data. <b>ResNet</b> added skip connections: each block outputs its input plus a learned correction, x + F(x).\n\nGradients can flow straight back through the skips, so networks with 100+ layers train easily. Every transformer layer you will meet later is built around this residual stream.'}
]});

/* ======================================================= RNN / LSTM */
ML.add({id:'rnn-lstm',title:'RNNs & LSTMs',min:11,lvl:'Intermediate',
sub:'Read a sequence one step at a time, carrying a memory forward. And why that memory fades.',
keys:'rnn lstm gru recurrent hidden state sequence seq2seq vanishing gradient gates encoder decoder',
learn:['How a recurrent network processes sequences','The hidden state as a running memory','LSTM gates that protect long-term memory','The seq2seq bottleneck that led to attention'],
cheat:['hₜ = tanh(W·hₜ₋₁ + U·xₜ + b): same weights at every step.','Backprop through time multiplies many Jacobians → vanishing gradients.','LSTM: forget / input / output gates control a cell state c; GRU is a lighter variant.','Sequential = slow to train; fixed-size summary = bottleneck. Transformers fix both.'],
met:[['t','Time step','clock'],['mem','Memory','db'],['issue','Issue','alert']],
hero:1,
draw(si,g){
  const s=[];const words=['the','cat','sat','on','the','mat'];
  if(si<=2){const n=6;const xs=U.range(n).map(i=>100+i*130);
    xs.forEach((x,i)=>{s.push(g.box(x,250,84,60,si===2?'LSTM':'RNN',si===2?'purple':'blue'),g.box(x,370,70,34,words[i],'gray',{flat:1}),g.A(x,353,x,281));
      if(i<n-1)s.push(g.A(x+42,250,xs[i+1]-42,250,{c:si===2?'purple':'blue',l:'h'+(i+1),lt:'ink',ly:-18}));
      s.push(g.A(x,220,x,150,{c:'green'}),g.T(x,140,'y'+(i+1),{a:'middle',cls:'b'}))});
    if(si===2)xs.forEach((x,i)=>{if(i<n-1)s.push(g.A(x+42,232,xs[i+1]-42,232,{c:'yellow',w:3,head:false}))});
    if(si===0)s.push(g.panel(60,40,'Unrolled in time',['one cell, reused at every step','hₜ = tanh(W·hₜ₋₁ + U·xₜ + b)','hidden state h = running memory'],'blue'));
    if(si===1){const P=g.plot({x:500,y:30,w:320,h:80,xr:[1,6],yr:[0,1],grid:false,title:'how much of word 1 is left in h'});s.push(P.svg,P.line(U.range(6).map(i=>[i+1,Math.pow(.45,i)]),'red'))}
    if(si===2)s.push(g.panel(60,30,'LSTM: a protected cell state (yellow)',['information flows along c with only small,','gated edits: it can survive many steps'],'purple'));
  }else if(si===3){s.push(g.T(60,50,'Inside an LSTM cell',{cls:'h'}));s.push(g.R(150,110,560,260,{fill:'var(--purple-bg)',stroke:'var(--edge)',sw:1.5,rx:14}));
    s.push(g.A(80,150,780,150,{c:'yellow',w:3.5}),g.T(80,140,'cₜ₋₁',{cls:'b'}),g.T(760,140,'cₜ',{cls:'b'}));
    [[250,'forget f','×','red'],[420,'input i','+','green'],[600,'output o','×','blue']].forEach(([x,l,op,c])=>{s.push(`<circle cx="${x}" cy="150" r="17" style="fill:var(--bg);stroke:var(--edge);stroke-width:1.5"/>`,g.T(x,155,op,{a:'middle',cls:'b'}),g.box(x,290,110,44,l,c,{sub:'σ(W·[h,x])'}),g.A(x,268,x,169,{c}))});
    s.push(g.A(80,330,195,330,{c:'gray'}),g.T(80,320,'hₜ₋₁, xₜ',{cls:'b'}),g.A(600,169,600,230,{c:'blue',head:false}),g.A(600,230,780,230,{c:'blue'}),g.T(760,250,'hₜ',{cls:'b'}));
    s.push(g.T(60,410,'f: what to erase · i: what to write · o: what to reveal  (each gate is 0…1 per dimension)',{cls:'m'}));}
  else{s.push(g.T(60,50,'Seq2seq translation (2014)',{cls:'h'}));const en=['I','love','cats'],fr=['j’','aime','les','chats'];
    en.forEach((w,i)=>{s.push(g.box(110+i*110,250,84,50,'enc','blue'),g.box(110+i*110,340,60,30,w,'gray',{flat:1}),g.A(110+i*110,325,110+i*110,276));if(i<2)s.push(g.A(152+i*110,250,178+i*110,250,{c:'blue'}))});
    s.push(g.box(470,250,70,70,'h','red',{sub:'one vector',hot:1}),g.A(372,250,434,250,{c:'red'}),g.A(506,250,560,250,{c:'red'}));
    fr.forEach((w,i)=>{s.push(g.box(600+i*72,250,62,50,'dec','green'),g.box(600+i*72,160,62,30,w,'gray',{flat:1}),g.A(600+i*72,224,600+i*72,176))});
    s.push(g.panel(60,390,'The bottleneck',['the whole sentence must squeeze through ONE vector h','long sentences lose detail · and every step waits for the previous one'],'red',{w:520}),
      g.panel(620,370,'The fix (2014–2017)',['let the decoder LOOK BACK','at every encoder state:','→ attention → transformers'],'green'))}
  return s.join('');
},
anim(si,t,g){if(si>2)return '';const xs=U.range(6).map(i=>100+i*130),ph=(t*1.3)%7,i=Math.floor(ph),k=ph-i;if(i>=5)return '';return g.dot(xs[i]+42,250,xs[i+1]-42,250,k,si===2?'yellow':'orange')},
steps:[
 {k:'setup',t:'Reading one step at a time',short:'RNN',m:{t:'1 → 6',mem:'hidden state h'},
  b:'Text, audio and time series are <b>sequences</b>. A <b>recurrent neural network</b> reads one element at a time and updates a hidden state h that summarises everything so far, reusing the same weights at every step.\n\nUntil 2017 this was how language models worked.',
  n:['Read word t','Combine it with the previous hidden state','Pass the new hidden state on','Optionally output a prediction']},
 {k:'problem',t:'Memory fades',short:'Vanishing',m:{issue:'vanishing gradient'},
  b:'Each step squashes the state through tanh and multiplies by W. Information from early words shrinks exponentially, and so do the gradients flowing back through time.\n\nPlain RNNs struggle to connect words more than about 10 to 20 steps apart.'},
 {k:'solution',t:'LSTM: a memory highway',short:'LSTM',m:{mem:'cell state c'},
  b:'The <b>Long Short-Term Memory</b> cell (1997) adds a separate <b>cell state</b> that flows along with only gated additions and erasures. Information (and gradient) can travel across hundreds of steps.\n\nLSTMs powered speech recognition, Google Translate and early text generators in the 2010s.'},
 {k:'math',t:'The three gates',short:'Gates',
  b:'Each gate is a small sigmoid layer that outputs values between 0 and 1. The <b>forget</b> gate decides what to erase from c, the <b>input</b> gate what new information to write, and the <b>output</b> gate what part of c to expose as h.\n\nThe <b>GRU</b> merges these into two gates with similar results.'},
 {k:'insight',t:'The seq2seq bottleneck',short:'Bottleneck',m:{issue:'bottleneck + sequential'},
  b:'For translation, an encoder RNN compresses the source sentence into one vector, and a decoder RNN generates the output from it. Long sentences lose detail in that single vector.\n\nAnd because step t needs step t−1, training cannot be parallelised across the sequence. <b>Attention</b> (module 07) solves the first problem; the <b>transformer</b> solves both.'}
]});
})();
