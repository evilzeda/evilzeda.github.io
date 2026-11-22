/* 06 · Beyond labels: RL, autoencoders, generative models */
(function(){const U=ML.U;

/* ======================================================= reinforcement learning */
ML.add({id:'reinforcement-learning',title:'Reinforcement Learning',min:12,lvl:'Intermediate',
sub:'Learn by trial and error: states, actions, rewards, and the value of the future.',
keys:'rl mdp q-learning value iteration bellman reward discount epsilon greedy policy dqn alphago ppo',
learn:['States, actions, rewards and policies (MDPs)','Discounting: why future reward is worth less','Value iteration and the Bellman equation','Exploration vs exploitation, Q-learning and deep RL'],
cheat:['Goal: maximise expected discounted return Σ γᵗ rₜ.','Bellman: V(s) = maxₐ [ r + γ·V(s′) ].','Q-learning: Q(s,a) ← Q + α[r + γ maxQ(s′,·) − Q(s,a)].','ε-greedy: explore with probability ε, otherwise act greedily.'],
met:[['iter','Sweep','repeat'],['gamma','Discount γ','timer'],['eps','Exploration ε','dice']],
hero:2,
setup(){const W=6,H=4,goal=[5,0],pit=[5,1],wall=[[2,1],[2,2]];this.W=W;this.H=H;this.goal=goal;this.pit=pit;this.wall=wall;const g=.9;
  const isW=(x,y)=>wall.some(w=>w[0]===x&&w[1]===y);this.isW=isW;const term=(x,y)=>(x===goal[0]&&y===goal[1])||(x===pit[0]&&y===pit[1]);
  let V=U.range(H).map(()=>Array(W).fill(0));const hist=[V];const A=[[0,-1],[1,0],[0,1],[-1,0]];this.A=A;
  const nxt=(x,y,a)=>{const nx=x+A[a][0],ny=y+A[a][1];return (nx<0||ny<0||nx>=W||ny>=H||isW(nx,ny))?[x,y]:[nx,ny]};
  const R=(x,y)=>x===goal[0]&&y===goal[1]?1:x===pit[0]&&y===pit[1]?-1:-0.04;
  for(let it=0;it<14;it++){const N=V.map(r=>r.slice());for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(isW(x,y))continue;if(term(x,y)){N[y][x]=R(x,y);continue}N[y][x]=Math.max(...A.map((_,a)=>{const [nx,ny]=nxt(x,y,a);return -0.04+g*V[ny][nx]}))}V=N;hist.push(V)}
  this.hist=hist;this.pol=(x,y)=>{let b=0,bv=-1e9;A.forEach((_,a)=>{const [nx,ny]=nxt(x,y,a);const v=V[ny][nx];if(v>bv){bv=v;b=a}});return b};this.term=term;},
grid(g,V,o={}){const s=[];const cs=78,X=60,Y=70;
  for(let y=0;y<this.H;y++)for(let x=0;x<this.W;x++){const px=X+x*cs,py=Y+y*cs;
    if(this.isW(x,y)){s.push(g.R(px,py,cs-4,cs-4,{fill:'var(--edge)',rx:6}));continue}
    const v=V?V[y][x]:0,c=v>=0?'green':'red',k=Math.min(1,Math.abs(v));
    s.push(g.R(px,py,cs-4,cs-4,{fill:`color-mix(in srgb,var(--${c}) ${V?Math.round(8+k*60):0}%,var(--bg))`,stroke:'var(--edge)',sw:1.3,rx:6}));
    if(x===this.goal[0]&&y===this.goal[1])s.push(g.T(px+cs/2-2,py+30,'+1',{a:'middle',cls:'h',c:'green'}),g.T(px+cs/2-2,py+50,'goal',{a:'middle',cls:'m'}));
    else if(x===this.pit[0]&&y===this.pit[1])s.push(g.T(px+cs/2-2,py+30,'−1',{a:'middle',cls:'h',c:'red'}),g.T(px+cs/2-2,py+50,'pit',{a:'middle',cls:'m'}));
    else{if(V&&o.vals!==false)s.push(g.T(px+cs/2-2,py+(o.pol?62:42),v.toFixed(2),{a:'middle',cls:'b'}));
      if(o.pol){const a=this.pol(x,y),[dx,dy]=this.A[a];const cx=px+cs/2-2,cy=py+30;s.push(g.A(cx-dx*14,cy-dy*14,cx+dx*16,cy+dy*16,{c:'blue',w:2.6}))}}}
  if(o.robot){const [x,y]=o.robot;s.push(`<circle cx="${X+x*cs+cs/2-2}" cy="${Y+y*cs+cs/2-2}" r="15" style="fill:var(--orange);stroke:var(--edge);stroke-width:1.6"/>`,g.icon('cpu',X+x*cs+cs/2-2,Y+y*cs+cs/2-2,16))}
  return s.join('')},
draw(si,g){
  const s=[];const last=this.hist[this.hist.length-1];
  if(si===0){s.push(this.grid(g,null,{robot:[0,3]}),g.panel(560,70,'A tiny world (an MDP)',['state  = which square','actions = ↑ → ↓ ←','reward: +1 goal, −1 pit,','        −0.04 per move','','policy π: state → action','goal: max total reward'],'orange'))}
  else if(si===1){s.push(this.grid(g,null,{robot:[0,3]}));const P=g.plot({x:560,y:80,w:260,h:160,xr:[0,20],yr:[0,1],grid:false,title:'weight of reward t steps ahead'});
    s.push(P.svg,P.line(U.range(21).map(t=>[t,Math.pow(.9,t)]),'purple'),P.line(U.range(21).map(t=>[t,Math.pow(.5,t)]),'red'),g.T(760,140,'γ = 0.9',{c:'purple',cls:'b'}),g.T(600,215,'γ = 0.5',{c:'red',cls:'b'}));
    s.push(g.panel(560,280,'Return',['G = r₀ + γr₁ + γ²r₂ + …','γ < 1: sooner is better,','and infinite sums stay finite'],'purple'))}
  else if(si===2){s.push(g.panel(560,70,'Value iteration',['V(s) = best total future','reward from s','','repeat for every square:','V(s) ← maxₐ [ r + γ·V(s′) ]','(the Bellman equation)','','values spread out from +1'],'green'))}
  else if(si===3){s.push(this.grid(g,last,{pol:1}),g.panel(560,70,'Policy = follow the values',['π(s) = action toward the','neighbour with highest V','','note: it detours around','the pit, and the wall'],'blue'))}
  else if(si===4){s.push(this.grid(g,last,{pol:1,vals:false,robot:[1,3]}),g.panel(560,40,'Q-learning (unknown world)',['no map of the world given','try actions, observe r and s′:','Q(s,a) ← Q(s,a) + α·[ r','   + γ·maxQ(s′,·) − Q(s,a) ]','','ε-greedy:','  ε = 0.1 → 10% random move','  explore vs exploit'],'yellow'))}
  else{s.push(g.T(60,50,'Deep reinforcement learning',{cls:'h'}));
    [['DQN','2013','Q-function = a CNN on raw pixels; learned Atari games','blue'],['AlphaGo','2016','policy & value nets + tree search; beat Lee Sedol at Go','green'],['PPO','2017','stable policy-gradient method; workhorse of robotics & RLHF','purple'],['RLHF','2022','reward = a model of human preferences; makes ChatGPT helpful','red']].forEach(([n,y,d,c],i)=>s.push(g.box(140,110+i*80,140,56,n,c,{sub:y}),g.T(230,114+i*80,d,{cls:'m'})));
    s.push(g.T(60,440,'RLHF returns in lesson 9.2: the "environment" is a conversation, the reward a learned judge.',{cls:'b'}))}
  return s.join('');
},
anim(si,t,g){if(si!==2)return '';const n=this.hist.length,i=Math.min(n-1,Math.floor((t*2)%(n+4)));return this.grid(g,this.hist[i])+g.pill(400,40,`sweep ${i}`,'green')},
steps:[
 {k:'setup',t:'Agent, world, reward',short:'MDP',m:{iter:'—',gamma:'—',eps:'—'},
  b:'An agent (the robot) moves around a grid. Reaching the goal pays +1, falling into the pit −1, and every move costs a little. Nobody tells it the right moves.\n\nFormally this is a <b>Markov decision process</b>: states, actions, transitions and rewards. The agent wants a <b>policy</b> (a rule for choosing actions) that maximises total reward.'},
 {k:'math',t:'Discounting the future',short:'Discount γ',m:{gamma:'0.9'},
  b:'Rewards further in the future count less: multiply a reward t steps ahead by γᵗ. The sum is the <b>return</b>.\n\nWith γ = 0.9 the agent is patient; with γ = 0.5 it barely cares beyond a few steps.'},
 {k:'solution',t:'Value iteration',short:'Values',m:{iter:'0 → 14'},
  n:['Every square looks at its neighbours','Takes the best: reward + γ × neighbour value','Values ripple outward from the goal'],
  b:'Define <b>V(s)</b> as the best return achievable from state s. It satisfies the <b>Bellman equation</b>: the value of a square is the reward plus the discounted value of the best next square.\n\nStart all values at zero and apply the equation to every square repeatedly. Good values spread out from the goal, bad ones from the pit.'},
 {k:'insight',t:'The optimal policy',short:'Policy',
  b:'Once the values settle, acting is easy: from each square, step toward the neighbour with the highest value. The arrows form the optimal policy. They route around the wall and keep away from the pit.'},
 {k:'technique',t:'Q-learning & exploration',short:'Q-learning',m:{eps:'0.1'},
  b:'Usually the agent has no map. <b>Q-learning</b> learns Q(s, a), the value of taking action a in state s, purely from experience, nudging each estimate toward reward + γ × the best next Q.\n\nIt must balance <b>exploring</b> (trying random moves to discover rewards) and <b>exploiting</b> (using what it knows). ε-greedy does both.'},
 {k:'recap',t:'Deep RL to RLHF',short:'Deep RL',m:{iter:'—',gamma:'0.99',eps:'—'},
  b:'Replace the Q table with a neural network and RL scales to raw pixels (DQN on Atari) and to Go (AlphaGo). Policy-gradient methods like <b>PPO</b> optimise the policy directly.\n\nThe same machinery fine-tunes chatbots: in <b>RLHF</b>, the policy is the language model and the reward comes from a model of human preferences.'}
]});

/* ======================================================= autoencoders & VAE */
ML.add({id:'autoencoders-vae',title:'Autoencoders & VAEs',min:10,lvl:'Intermediate',
sub:'Squeeze data through a bottleneck and rebuild it. The bottleneck becomes a meaningful map, and a VAE lets you sample from it.',
keys:'autoencoder encoder decoder latent space bottleneck vae variational reparameterization kl divergence',
learn:['Encoder → latent code → decoder','Latent spaces as learned coordinates','Why plain autoencoders are bad generators','VAEs: distributions, KL, and smooth sampling'],
cheat:['Train to reconstruct the input through a narrow bottleneck.','The latent code is a learned, compressed representation.','VAE: encoder outputs μ, σ; sample z = μ + σ·ε; loss = reconstruction + KL(q(z|x) ‖ N(0, I)).','Latent diffusion (Stable Diffusion) runs diffusion inside a VAE’s latent space.'],
met:[['dim','Latent size','layers'],['loss','Loss','chart'],['gen','Can generate?','sparkle']],
hero:3,
setup(){const r=U.rng(61);const cs=[[2.5,7.5],[7,7.8],[5,5],[2.8,2.6],[7.4,2.8]];this.lat=[];cs.forEach(([x,y],k)=>{for(let i=0;i<18;i++)this.lat.push({x:x+U.gauss(r)*.55,y:y+U.gauss(r)*.55,c:['blue','orange','green','purple','red'][k]})});
  this.vae=[];cs.forEach(([x,y],k)=>{for(let i=0;i<18;i++)this.vae.push({x:5+(x-5)*.55+U.gauss(r)*.75,y:5+(y-5)*.55+U.gauss(r)*.75,c:['blue','orange','green','purple','red'][k]})});},
glyph(g,cx,cy,t,sz=26){/* morph circle (t=0) → star (t=1) */const n=40,pts=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2-Math.PI/2,star=(i%8<4?1:.45),r=sz*(1-t+t*(.55+.45*Math.cos(5*a+Math.PI/2)));pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)])}return g.poly(pts,'purple',.55,{stroke:1})},
draw(si,g){
  const s=[];
  if(si===0){s.push(g.box(100,240,110,110,'input','gray',{sub:'784 pixels'}),g.poly([[180,170],[330,215],[330,265],[180,310]],'blue',.3,{stroke:1}),g.T(255,245,'encoder',{a:'middle',cls:'b'}),
      g.box(400,240,60,90,'z','purple',{sub:'2–64 nums',hot:1}),g.poly([[470,215],[620,170],[620,310],[470,265]],'green',.3,{stroke:1}),g.T(545,245,'decoder',{a:'middle',cls:'b'}),g.box(700,240,110,110,'output','gray',{sub:'≈ input'}));
    s.push(g.panel(200,360,'Train: output should equal input',['loss = ‖x − decoder(encoder(x))‖²','no labels needed (self-supervised)'],'blue'))}
  else if(si===1||si===2){const P=g.plot({x:50,y:30,w:410,h:410,xr:[0,10],yr:[0,10],xl:'z₁',yl:'z₂'});this.P=P;s.push(P.svg,P.pts(this.lat,4.5));
    if(si===1)s.push(g.panel(500,60,'The latent space',['each image → a 2D point','similar images land close','colours = digit class','(never shown to the model!)'],'purple'));
    else{[[5.2,9.4],[8.9,5.2],[1,5]].forEach(([x,y])=>s.push(`<circle cx="${P.sx(x)}" cy="${P.sy(y)}" r="9" style="fill:none;stroke:var(--red);stroke-width:2.5"/>`,g.T(P.sx(x)+12,P.sy(y)+4,'?',{cls:'h',c:'red'})));
      s.push(g.panel(500,60,'Bad generator',['decode a random z from the','gaps between clusters','→ garbage, never trained there','','also: denoising AEs, anomaly','detection (high recon. error)'],'red'))}}
  else if(si===3){s.push(g.box(100,240,100,90,'x','gray'),g.A(150,240,230,240),g.box(290,190,90,44,'μ','purple'),g.box(290,290,90,44,'σ','purple'),
      g.A(335,190,430,232,{c:'purple'}),g.A(335,290,430,248,{c:'purple'}),`<circle cx="470" cy="240" r="40" style="fill:var(--yellow-bg);stroke:var(--edge);stroke-width:1.5"/>`,g.T(470,236,'z = μ+σ·ε',{a:'middle',cls:'b',size:10}),g.T(470,252,'ε ~ N(0,1)',{a:'middle',cls:'m',size:9.5}),
      g.A(510,240,590,240),g.box(650,240,100,90,'x̂','gray'));
    s.push(g.panel(110,360,'VAE loss',['reconstruction  +  KL( N(μ,σ) ‖ N(0,1) )','KL pulls every code toward one shared bell curve → no gaps'],'purple'))}
  else if(si===4){const P=g.plot({x:50,y:30,w:410,h:410,xr:[0,10],yr:[0,10],xl:'z₁',yl:'z₂'});this.P=P;s.push(P.svg,`<circle cx="${P.sx(5)}" cy="${P.sy(5)}" r="${3.2/10*410}" style="fill:var(--purple);opacity:.07"/>`,P.pts(this.vae,4.5));
    s.push(g.panel(500,60,'Smooth, filled latent space',['codes packed around N(0, I)','any random z decodes to','something plausible','','walk in a straight line →','smooth morph'],'green'));this.L=[[2.5,6],[6.9,4]];s.push(P.line(this.L,'ink',{cls:'dash'}))}
  else{s.push(g.T(60,50,'Where autoencoders live today',{cls:'h'}));
    s.push(g.panel(60,90,'Latent diffusion',['Stable Diffusion: a VAE compresses','512×512×3 images to 64×64×4 latents','diffusion runs there: 48× cheaper'],'purple'),g.panel(450,90,'Representation learning',['masked autoencoders (MAE) for vision','BERT = a "denoising" text autoencoder','sparse AEs to interpret LLM features'],'blue'));
    s.push(g.panel(60,260,'Tokenisers for images & audio',['VQ-VAE turns images/sound into','discrete codes an LLM can read','(how multimodal models "see")'],'yellow'))}
  return s.join('');
},
anim(si,t,g){if(si===4&&this.P){const P=this.P,k=(Math.sin(t*1.2)+1)/2,[a,b]=this.L,x=U.lerp(a[0],b[0],k),y=U.lerp(a[1],b[1],k);return g.C(P.sx(x),P.sy(y),8,'yellow',{cls:'big'})+this.glyph(g,640,330,k,40)+g.T(640,395,'decoded sample',{a:'middle',cls:'m'})}
  if(si===0){const p=(t%2.5)/2.5;return g.dot(160,240,370,240,Math.min(1,p*2),'blue')+(p>.5?g.dot(430,240,640,240,(p-.5)*2,'green'):'')}return ''},
steps:[
 {k:'setup',t:'Compress, then rebuild',short:'Autoencoder',m:{dim:'2',loss:'reconstruction',gen:'no'},
  b:'An <b>autoencoder</b> is two networks back to back. The <b>encoder</b> squeezes an input into a short <b>latent code</b> z; the <b>decoder</b> rebuilds the input from z. Training simply minimises the reconstruction error.\n\nBecause z is small, the network must keep only what matters.'},
 {k:'insight',t:'A learned map',short:'Latent space',
  b:'Plot the 2D codes for thousands of digit images: the classes form clusters, though the model never saw a label. The latent space is a <b>learned coordinate system</b> where distance means similarity.\n\nThat is the same idea as word embeddings, coming up in module 07.'},
 {k:'problem',t:'Gaps in the map',short:'Gaps',m:{gen:'badly'},
  b:'Could we generate new digits by decoding random points? Mostly no: the codes are scattered with big empty gaps, and the decoder never learned what lives there.'},
 {k:'solution',t:'Variational autoencoder',short:'VAE',m:{loss:'recon + KL'},
  b:'A <b>VAE</b> encoder outputs a distribution (mean μ and spread σ) instead of a point. We sample z from it (using the <b>reparameterisation trick</b> so gradients still flow) and decode.\n\nA <b>KL divergence</b> term pulls every distribution toward a standard bell curve, packing the latent space tightly with no holes.'},
 {k:'solution',t:'Sample and morph',short:'Generate',m:{gen:'yes'},
  b:'Now any point near the centre decodes to something plausible, and walking in a straight line between two codes produces a smooth morph.\n\nVAE samples tend to be blurry, which is why GANs and diffusion models took over image generation, often working <b>inside</b> a VAE’s latent space.'},
 {k:'recap',t:'Autoencoders today',short:'Today',m:{dim:'—',loss:'—',gen:'—'},
  b:'Stable Diffusion runs diffusion in a VAE latent space; BERT is trained as a denoising autoencoder for text; VQ-VAEs turn images and audio into tokens; and sparse autoencoders are a key tool for peeking inside LLMs.'}
]});

/* ======================================================= GANs & diffusion */
ML.add({id:'gans-diffusion',title:'GANs & Diffusion Models',min:12,lvl:'Advanced',
sub:'Two ways to generate images from noise: an adversarial game, or learning to undo noise step by step.',
keys:'gan generator discriminator adversarial mode collapse diffusion ddpm denoising noise schedule stable diffusion classifier-free guidance',
learn:['The generator vs discriminator game','Why GANs are unstable (mode collapse)','Diffusion: add noise forward, learn to remove it','Text-conditioned generation and guidance'],
cheat:['GAN: G turns noise into fakes; D tells real from fake; they train against each other.','GAN issues: unstable training, mode collapse.','Diffusion: gradually add Gaussian noise; train a net to predict the noise; sample by denoising from pure noise.','Text conditioning + classifier-free guidance = DALL·E 2/3, Stable Diffusion, Midjourney, Sora-style video.'],
met:[['model','Model','sparkle'],['step','Step','repeat'],['note','Note','alert']],
hero:4,
setup(){const r=U.rng(71);this.sp=U.range(150).map(i=>{const t=(i/150)*3.2*Math.PI+.6,R=.32*t;return {x:5+R*Math.cos(t)+U.gauss(r)*.12,y:5+R*Math.sin(t)+U.gauss(r)*.12}});this.nz=this.sp.map(()=>({x:5+U.gauss(r)*1.7,y:5+U.gauss(r)*1.7}));},
draw(si,g){
  const s=[];
  if(si===0){s.push(g.box(90,150,90,50,'noise z','gray'),g.A(135,150,215,150),g.box(290,150,130,60,'Generator','orange'),g.A(355,150,440,190),g.box(90,330,90,50,'real image','blue'),g.A(135,330,440,270,{c:'blue'}),
      g.box(530,230,150,70,'Discriminator','purple'),g.A(605,230,690,230),g.box(750,230,90,56,'real / fake?','gray',{fs:11}));
    s.push(g.A(530,270,290,185,{c:'red',dash:1,curve:-80,l:'fool me',lt:'red'}));
    s.push(g.panel(260,370,'A two-player game (2014)',['D learns to spot fakes; G learns to fool D','at equilibrium G’s fakes are indistinguishable'],'orange'))}
  else if(si===1){const P=g.plot({x:60,y:40,w:480,h:330,xr:[-4,8],yr:[0,.55],xl:'data value',yl:'density'});this.P=P;s.push(P.svg,P.fn(x=>.5*Math.exp(-((x-3)**2)/.8)/Math.sqrt(.8*Math.PI)*1.6+.5*Math.exp(-((x-5.5)**2)/.6)/Math.sqrt(.6*Math.PI)*1.2,'blue',{n:300}),g.T(P.sx(5.6),P.sy(.5),'real data',{c:'blue',cls:'b'}));
    s.push(g.panel(580,60,'Training dynamics',['orange = what G produces','D’s feedback pushes it','toward the real data'],'orange'))}
  else if(si===2){const P=g.plot({x:60,y:40,w:480,h:330,xr:[-4,8],yr:[0,.9],xl:'data value',yl:'density'});s.push(P.svg,P.fn(x=>.5*Math.exp(-((x-3)**2)/.8)/Math.sqrt(.8*Math.PI)*1.6+.5*Math.exp(-((x-5.5)**2)/.6)/Math.sqrt(.6*Math.PI)*1.2,'blue',{n:300}),P.fn(x=>Math.exp(-((x-5.5)**2)/.18)/Math.sqrt(.18*Math.PI),'orange',{n:300}));
    s.push(g.panel(580,60,'Mode collapse',['G finds ONE output that','fools D and repeats it','the left mode is never made','','also: training can oscillate','or diverge: hard to tune'],'red'))}
  else{const P=g.plot({x:40,y:40,w:400,h:400,xr:[0,10],yr:[0,10],grid:false});this.P=P;s.push(P.svg);
    if(si===3){const ts=[0,.3,.6,1];ts.forEach((tt,i)=>{const Q=g.plot({x:470+(i%2)*190,y:40+Math.floor(i/2)*200,w:170,h:170,xr:[0,10],yr:[0,10],grid:false,title:`t = ${Math.round(tt*1000)}`});const a=Math.sqrt(1-tt*.98);s.push(Q.svg,Q.clip(Q.pts(this.sp.map((p,j)=>({x:5+(p.x-5)*a+(this.nz[j].x-5)*Math.sqrt(tt),y:5+(p.y-5)*a+(this.nz[j].y-5)*Math.sqrt(tt),c:'blue'})),2.6)))});s.push(P.pts(this.sp.map(p=>({...p,c:'blue'})),3.5),g.T(60,470,'forward process: x_t = √ᾱ·x₀ + √(1−ᾱ)·ε',{cls:'b'}))}
    if(si===4)s.push(g.panel(470,60,'Reverse: learn to denoise',['a network ε_θ(x_t, t) predicts','the noise that was added','loss = ‖ε − ε_θ(x_t, t)‖²','','sampling: start from pure','noise, subtract predicted','noise a little at a time','(~20–1000 steps)'],'green'));
    if(si===5)s.push(P.pts(this.sp.map(p=>({...p,c:'purple'})),3.5),g.panel(470,60,'Steering with text',['condition ε_θ on a text','embedding (CLIP / T5 / an LLM)','','classifier-free guidance:','ε = ε_uncond + w·(ε_text − ε_uncond)','w ≈ 7: follow the prompt harder'],'purple'),g.box(620,330,300,46,'"a spiral galaxy, watercolour"','yellow',{fs:11}),g.A(470,330,445,300,{c:'purple'}))}
  return s.join('');
},
anim(si,t,g){
  if(si===1&&this.P){const P=this.P,k=(t%7)/5.5,mu=U.lerp(-2,3.4,U.ease(Math.min(1,k))),sd=U.lerp(.6,1.4,Math.min(1,k));return P.fn(x=>Math.exp(-((x-mu)**2)/(2*sd*sd))/(sd*2.5066)*.9,'orange',{n:200})}
  if(si===4&&this.P){const P=this.P,k=1-U.ease(Math.min(1,(t%6)/4.5));const a=Math.sqrt(1-k*.98);return P.pts(this.sp.map((p,j)=>({x:5+(p.x-5)*a+(this.nz[j].x-5)*Math.sqrt(k),y:5+(p.y-5)*a+(this.nz[j].y-5)*Math.sqrt(k),c:'green'})),3.5)+g.pill(P.x+P.w-70,P.y+18,`t = ${Math.round(k*1000)}`,'green')}
  return '';
},
steps:[
 {k:'setup',t:'Generator vs discriminator',short:'GAN',m:{model:'GAN',step:'—',note:'adversarial'},
  b:'A <b>Generative Adversarial Network</b> pits two networks against each other. The <b>generator</b> turns random noise into fake samples. The <b>discriminator</b> sees real and fake samples and tries to tell them apart.\n\nEach improves by exploiting the other’s weaknesses, like a forger and a detective.'},
 {k:'solution',t:'Matching the data distribution',short:'Training',m:{step:'D ↔ G'},
  b:'Every round, D gets better at spotting fakes, and G uses D’s gradients to make its fakes more realistic. Over time the generator’s output distribution is pushed onto the real data distribution.\n\nGANs produced the first photorealistic faces (StyleGAN, 2019) and are still used where speed matters.'},
 {k:'problem',t:'Mode collapse',short:'Collapse',m:{note:'unstable'},
  b:'GAN training is a balancing act. If G finds one kind of output that reliably fools D, it may produce only that (<b>mode collapse</b>), ignoring the variety in the data. Training can also oscillate or diverge.\n\nThis instability is a big reason diffusion models took over.'},
 {k:'technique',t:'Diffusion: destroy with noise',short:'Forward',m:{model:'Diffusion',step:'0 → 1000'},
  b:'A <b>diffusion model</b> starts from a simple, fixed process: take a real sample and add a little Gaussian noise, over and over, until after ~1,000 steps it is pure noise.\n\nThis forward process needs no learning. The spiral here dissolves into a blob.'},
 {k:'solution',t:'Learn to undo it',short:'Reverse',m:{step:'1000 → 0'},
  b:'Train a network to look at a noisy sample and its step number, and <b>predict the noise</b> that was added. That is a plain regression loss, so training is stable.\n\nTo generate, start from pure random noise and repeatedly subtract a bit of predicted noise. Structure emerges step by step: here, the spiral reassembles.'},
 {k:'insight',t:'Text-to-image',short:'Guidance',m:{note:'text-conditioned'},
  b:'Feed a text embedding into the denoiser so it removes noise “toward” the prompt. <b>Classifier-free guidance</b> amplifies the difference between the prompted and unprompted predictions to follow the prompt more closely.\n\nRun it in a VAE latent space and you have Stable Diffusion. The same recipe drives today’s video generators.'}
]});

/* ======================================================= Kalman filter */
/* 1D constant-velocity Kalman filter per axis: state [pos, vel], F=[[1,1],[0,1]], H=[1,0] */
function kf1(zs,q,r,x0,v0){let x=[x0,v0],P=[[.05,0],[0,.02]];const out=[];
  zs.forEach(z=>{// predict
    const xp=[x[0]+x[1],x[1]];const Pp=[[P[0][0]+2*P[0][1]+P[1][1]+q/4,P[0][1]+P[1][1]+q/2],[P[0][1]+P[1][1]+q/2,P[1][1]+q]];
    // update
    const S=Pp[0][0]+r,K=[Pp[0][0]/S,Pp[1][0]/S],y=z-xp[0];
    x=[xp[0]+K[0]*y,xp[1]+K[1]*y];P=[[(1-K[0])*Pp[0][0],(1-K[0])*Pp[0][1]],[Pp[1][0]-K[1]*Pp[0][0],Pp[1][1]-K[1]*Pp[0][1]]];
    out.push({pred:xp[0],pvar:Pp[0][0],est:x[0],var:P[0][0],K:K[0],z})});return out}
ML.add({id:'kalman-filter',title:'The Kalman Filter',min:13,lvl:'Intermediate',
sub:'Track something you can only measure noisily: predict, measure, blend, and repeat, trusting each source by how certain it is.',
keys:'kalman filter state estimation tracking sensor fusion gps predict update gain covariance noise ekf ukf particle filter time series',
learn:['Why raw measurements are not enough','Predict: move the estimate forward, uncertainty grows','Update: blend in a measurement, uncertainty shrinks','The Kalman gain, the full loop, and tuning Q and R'],
cheat:['State = best guess (mean) + uncertainty (covariance P).','Predict: x ← F x, P ← F P Fᵀ + Q (uncertainty grows).','Update: K = P Hᵀ (H P Hᵀ + R)⁻¹; x ← x + K (z − H x); P ← (I − K H) P (shrinks).','Q = how much you distrust the motion model, R = how much you distrust the sensor. Non-linear: EKF / UKF / particle filter.'],
met:[['step','Time step','clock'],['K','Kalman gain','scale'],['err','Error (RMSE)','target']],
hero:4,
setup(){const r=U.rng(83),N=40;this.N=N;let x=.6,y=1.6,vx=.24,vy=.03;const tr=[];
  for(let t=0;t<N;t++){vx+=U.gauss(r)*.02;vy+=U.gauss(r)*.025+(t>16&&t<26?.03:0);x+=vx;y+=vy;tr.push({x,y})}this.tr=tr;
  this.z=tr.map(p=>({x:p.x+U.gauss(r)*.5,y:p.y+U.gauss(r)*.5}));const all=[...tr,...this.z];this.bx=[Math.min(...all.map(p=>p.x))-.4,Math.max(...all.map(p=>p.x))+.4];this.by=[Math.min(...all.map(p=>p.y))-.4,Math.max(...all.map(p=>p.y))+.4];
  const run=(q,R)=>{const zx=this.z.map(p=>p.x),zy=this.z.map(p=>p.y);const a=kf1(zx,q,R,.6,.24),b=kf1(zy,q,R,1.6,.03);return a.map((u,i)=>({x:u.est,y:b[i].est,px:u.pred,py:b[i].pred,pv:(u.pvar+b[i].pvar)/2,v:(u.var+b[i].var)/2,K:u.K}))};
  this.f=run(.004,.3);this.fSmallQ=run(.00005,.3);this.fBigQ=run(.4,.3);
  const rm=a=>Math.sqrt(a.reduce((s,p,i)=>s+(p.x-tr[i].x)**2+(p.y-tr[i].y)**2,0)/a.length);
  this.rmse={raw:rm(this.z)};
  const rmT=a=>Math.sqrt(a.slice(3).reduce((s,p,i)=>s+(p.x-tr[i+3].x)**2+(p.y-tr[i+3].y)**2,0)/(a.length-3));
  this.steps[0].m={err:`raw ${this.rmse.raw.toFixed(2)}`};this.steps[2].m={K:this.f[14].K.toFixed(2)};this.steps[4].m={step:`1 → ${N}`,K:`→ ${this.f[N-1].K.toFixed(2)}`,err:`raw ${this.rmse.raw.toFixed(2)} → ${rmT(this.f).toFixed(2)}`};
  this.steps[5].m={err:`small Q ${rmT(this.fSmallQ).toFixed(2)} · large Q ${rmT(this.fBigQ).toFixed(2)}`};},
plotP(g,zoom){let xr=this.bx,yr=this.by;if(zoom){const c=this.f[zoom];xr=[c.x-2.6,c.x+2.6];yr=[c.y-2.1,c.y+2.1]}const w=500,h=410;return g.plot({x:50,y:30,w,h,xr,yr,grid:true,xl:zoom?'x (km) · zoomed in':'x (km)',yl:'y (km)'})},
ell(g,P,x,y,v,c,o={}){const r=Math.max(4,Math.sqrt(v)*P.w/(P.xr[1]-P.xr[0]));return `<circle cx="${P.sx(x)}" cy="${P.sy(y)}" r="${r}" style="fill:var(--${c});opacity:${o.op||.14};stroke:var(--${c});stroke-width:1.5${o.dash?';stroke-dasharray:4 4':''}"/>`},
draw(si,g){
  const s=[];const N=this.N;
  if(si===0){const P=this.plotP(g);s.push(P.svg,P.line(this.tr.map(p=>[p.x,p.y]),'green',{cls:'dash'}),P.line(this.z.map(p=>[p.x,p.y]),'red',{cls:'thin',op:.5}),P.pts(this.z.map(p=>({...p,c:'red'})),4));
    s.push(g.panel(580,50,'Noisy GPS',['green dashed = where the car','               really went','red = what the sensor says','','each reading is off by ~0.5 km','joining them gives a zig-zag'],'red'))}
  else if(si===1||si===2){const t=14,P=this.plotP(g,t),f=this.f,prev=f[t-1],cur=f[t];this.P=P;
    s.push(P.svg,P.clip(P.line(this.tr.slice(0,t+3).map(p=>[p.x,p.y]),'green',{cls:'dash thin'})+P.line(f.slice(0,t).map(p=>[p.x,p.y]),'blue')+P.pts(this.z.slice(0,t).map(p=>({...p,c:'red'})),3.5,{cls:'dim'})));
    s.push(this.ell(g,P,prev.x,prev.y,f[t-1].v,'blue'),g.C(P.sx(prev.x),P.sy(prev.y),6,'blue'),g.T(P.sx(prev.x)-10,P.sy(prev.y)+24,'estimate at t',{cls:'b',c:'blue',a:'end'}));
    s.push(g.A(P.sx(prev.x),P.sy(prev.y),P.sx(cur.px),P.sy(cur.py),{c:'purple',dash:1}),this.ell(g,P,cur.px,cur.py,cur.pv,'purple',{dash:1}),g.C(P.sx(cur.px),P.sy(cur.py),6,'purple',{cls:'hollow'}),g.T(P.sx(cur.px)+12,P.sy(cur.py)-30,'prediction t+1',{cls:'b',c:'purple'}));
    if(si===2){const z=this.z[t];s.push(this.ell(g,P,z.x,z.y,.3,'red'),g.C(P.sx(z.x),P.sy(z.y),6,'red'),g.T(P.sx(z.x)+12,P.sy(z.y)+16,'measurement',{cls:'b',c:'red'}),this.ell(g,P,cur.x,cur.y,cur.v,'green',{op:.3}),g.C(P.sx(cur.x),P.sy(cur.y),7,'green',{cls:'big'}),g.T(P.sx(cur.x)-12,P.sy(cur.y)+28,'new estimate',{cls:'b',c:'green',a:'end'}))}
    const Q=g.plot({x:590,y:250,w:240,h:150,xr:[-3,3],yr:[0,1.6],grid:false,title:si===1?'1D view: prediction spreads':'1D view: blend = product'});const N1=(x,m,sd)=>Math.exp(-((x-m)**2)/(2*sd*sd))/(sd*2.5066);
    s.push(Q.svg);if(si===1)s.push(Q.fn(x=>N1(x,-1.2,.35),'blue',{n:160}),Q.fn(x=>N1(x,-.4,.7),'purple',{n:160,cls:'dash'}));else s.push(Q.fn(x=>N1(x,-.4,.7),'purple',{n:160,cls:'dash'}),Q.fn(x=>N1(x,.8,.5),'red',{n:160}),Q.fn(x=>N1(x,.39,.41),'green',{n:160,w:3}));
    s.push(g.panel(590,40,si===1?'1. Predict':'2. Update',si===1?['move the estimate with the','motion model (velocity × time)','','uncertainty GROWS: the model','is not perfect (noise Q)']:['a measurement arrives (red),','with its own uncertainty R','','new estimate lies between them,','closer to the more certain one','uncertainty SHRINKS'],si===1?'purple':'green'))}
  else if(si===3){s.push(g.T(60,50,'The Kalman gain: who do we trust?',{cls:'h'}));this.K3=1;
    s.push(g.panel(560,90,'K = P / (P + R)',['P = prediction variance','R = measurement variance','','new = pred + K·(meas − pred)','','K → 0: ignore the sensor','K → 1: ignore the model','variance: (1 − K)·P'],'orange'))}
  else if(si===4){const P=this.plotP(g);this.P=P;s.push(P.svg,P.line(this.tr.map(p=>[p.x,p.y]),'green',{cls:'dash thin'}),P.pts(this.z.map(p=>({...p,c:'red'})),3.5,{cls:'dim'}));
    s.push(g.panel(580,40,'Predict → update, forever',['red dots   = raw GPS','blue line  = Kalman estimate','circle     = its uncertainty','','smooth, close to the truth,','and only needs the LAST','estimate: no history stored'],'blue'))}
  else if(si===5){[[this.fSmallQ,'Q too small: trusts the model','yellow','smooth but LAGS when the','car turns'],[this.fBigQ,'Q too large: trusts the sensor','red','follows every noisy','reading: jittery']].forEach(([f,t,c,a,b],i)=>{const P=g.plot({x:30+i*420,y:50,w:390,h:300,xr:this.bx,yr:this.by,grid:false,title:t});s.push(P.svg,P.line(this.tr.map(p=>[p.x,p.y]),'green',{cls:'dash thin'}),P.pts(this.z.map(p=>({...p,c:'red'})),3,{cls:'dim'}),P.line(f.map(p=>[p.x,p.y]),c,{w:2.6}),g.T(40+i*420,380,a,{cls:'m'}),g.T(40+i*420,396,b,{cls:'m'}))});
    s.push(g.T(30,440,'Q = process noise (model distrust) · R = measurement noise (sensor distrust) · tune the ratio, or estimate them from data',{cls:'b'}))}
  else{s.push(g.T(60,50,'Where it goes from here',{cls:'h'}));
    [['Everywhere','GPS + accelerometer fusion in phones, Apollo navigation (1960s), drones, robots, finance, weather','blue'],['Extended KF (EKF)','curved (non-linear) motion: linearise with a Jacobian at each step','purple'],['Unscented KF (UKF)','push a few "sigma points" through the true non-linear model instead','orange'],['Particle filter','thousands of weighted guesses; any shape of uncertainty','red'],['ML connections','a linear-Gaussian state-space model; cousin of HMMs; RNNs learn the update instead','green']].forEach(([n,d,c],i)=>s.push(g.box(160,100+i*70,210,48,n,c,{fs:11}),g.T(280,104+i*70,d,{cls:'m'})))}
  return s.join('');
},
anim(si,t,g){
  if(si===3){const k=(Math.sin(t*.9)+1)/2,K=.05+.9*k;const X0=100,X1=480,Y=250;let s=`<line x1="${X0}" y1="${Y}" x2="${X1}" y2="${Y}" style="stroke:var(--line2);stroke-width:3"/>`;
    s+=g.C(X0,Y,9,'purple')+g.T(X0,Y+30,'prediction',{a:'middle',cls:'b',c:'purple'})+g.C(X1,Y,9,'red')+g.T(X1,Y+30,'measurement',{a:'middle',cls:'b',c:'red'});
    const x=X0+(X1-X0)*K;s+=g.C(x,Y,11,'green',{cls:'big'})+g.pill(x,Y-30,`K = ${K.toFixed(2)}`,'green');
    s+=g.T(290,350,K<.35?'sensor is noisy (big R) → lean on the model':K>.65?'model is unsure (big P) → lean on the sensor':'about equally certain → meet in the middle',{a:'middle',cls:'b'});return s}
  if(si===4&&this.P){const P=this.P,n=this.N,i=Math.min(n-1,Math.floor((t*4)%(n+8)));const f=this.f.slice(0,i+1);let s=P.line(f.map(p=>[p.x,p.y]),'blue',{w:2.8});
    s+=this.ell(g,P,f[i].x,f[i].y,f[i].v,'blue',{op:.2})+g.C(P.sx(this.z[i].x),P.sy(this.z[i].y),6,'red')+g.C(P.sx(f[i].x),P.sy(f[i].y),6,'blue')+g.pill(P.x+P.w-70,P.y+18,`t = ${i+1} · K = ${f[i].K.toFixed(2)}`,'blue');return s}
  return '';
},
steps:[
 {k:'problem',t:'Noisy measurements',short:'The problem',m:{step:'—',K:'—'},
  b:'A car starts from a known spot and reports its GPS position every second, but each reading can be off by half a kilometre. Joining the raw dots gives a jagged path that jumps around the real one.\n\nAveraging the last few readings would smooth it but lag behind. The <b>Kalman filter</b> (1960) combines what we <b>expect</b> (the car keeps moving roughly as it was) with what we <b>measure</b>, in the statistically best way when noise is Gaussian.'},
 {k:'technique',t:'Step 1: predict',short:'Predict',m:{step:'t → t+1',K:'—'},
  b:'The filter keeps two things: a best guess of the <b>state</b> (position and velocity) and how <b>uncertain</b> that guess is (the covariance P, drawn as a circle).\n\nTo predict the next second, push the state through a motion model: new position = position + velocity. Because the model is imperfect (the driver might brake), we add process noise Q, so the uncertainty circle <b>grows</b>.'},
 {k:'technique',t:'Step 2: update',short:'Update',m:{},
  b:'Now a measurement arrives, with its own uncertainty R. We have two Gaussians: the prediction and the measurement. Multiplying them gives a new Gaussian that sits <b>between</b> the two, closer to the more certain one, and is <b>narrower than either</b>.\n\nCombining two imperfect sources gives a better estimate than either alone. That is the core of sensor fusion.'},
 {k:'math',t:'The Kalman gain',short:'Gain K',m:{K:'0 … 1'},
  b:'How far to move toward the measurement is set by the <b>Kalman gain</b> K = P / (P + R): prediction uncertainty divided by total uncertainty. The update is <code>new = prediction + K·(measurement − prediction)</code>.\n\nA noisy sensor (large R) gives small K, so trust the model. An unsure model (large P) gives K near 1, so trust the sensor. The gain is recomputed every step.'},
 {k:'solution',t:'The full loop',short:'Loop',
  n:['Predict the next state; uncertainty grows','Measure','Compute the gain from the two uncertainties','Blend; uncertainty shrinks','Repeat'],
  b:'Predict, update, repeat. The estimate (blue) stays close to the true path with a fraction of the raw error, and the uncertainty settles to a steady size.\n\nIt is <b>recursive</b>: it needs only the previous estimate and the new measurement, never the full history. That makes it cheap enough for 1960s spacecraft computers and for every phone today.'},
 {k:'tradeoff',t:'Tuning Q and R',short:'Tuning',
  b:'Performance depends on the noise settings. If Q is too small the filter over-trusts its motion model: smooth, but slow to react when the car turns. If Q is too large it over-trusts the sensor and passes the noise straight through.\n\nR usually comes from the sensor’s spec sheet; Q is tuned, or learned from data, much like a regularisation hyperparameter.'},
 {k:'recap',t:'Beyond the linear filter',short:'Variants',m:{step:'—',K:'—',err:'—'},
  b:'The classic filter assumes linear motion and Gaussian noise. The <b>Extended</b> KF linearises curved models, the <b>Unscented</b> KF propagates a few sample points, and <b>particle filters</b> use thousands of weighted guesses for any shape of uncertainty.\n\nIn ML terms it is exact inference in a linear-Gaussian state-space model, a continuous cousin of the hidden Markov model. An RNN can be seen as learning this kind of predict-and-update loop from data.'}
]});
})();
