/* 04 · Unsupervised learning */
(function(){const U=ML.U;

function kmeans(pts,cents,iters=10){const hist=[];let C=cents.map(c=>({...c}));for(let it=0;it<iters;it++){const lab=pts.map(p=>{let b=0,bd=1e9;C.forEach((c,i)=>{const d=(p.x-c.x)**2+(p.y-c.y)**2;if(d<bd){bd=d;b=i}});return b});
  const inertia=pts.reduce((s,p,i)=>s+(p.x-C[lab[i]].x)**2+(p.y-C[lab[i]].y)**2,0);hist.push({C:C.map(c=>({...c})),lab,inertia});
  const N=C.map((c,i)=>{const m=pts.filter((p,j)=>lab[j]===i);return m.length?{x:m.reduce((s,p)=>s+p.x,0)/m.length,y:m.reduce((s,p)=>s+p.y,0)/m.length}:c});if(N.every((c,i)=>Math.abs(c.x-C[i].x)+Math.abs(c.y-C[i].y)<1e-6)){hist.push({...hist[hist.length-1],done:1});break}C=N}return hist}
const KC=['blue','orange','green','purple','red','pink'];
function moons(r,n=110){const a=[];for(let i=0;i<n;i++){const t=r()*Math.PI;if(i%2)a.push({x:3+2.4*Math.cos(t)+U.gauss(r)*.18,y:5.2+2.4*Math.sin(t)+U.gauss(r)*.18,k:0});else a.push({x:5.4-2.4*Math.cos(t)+U.gauss(r)*.18,y:5.9-2.4*Math.sin(t)+U.gauss(r)*.18,k:1})}for(let i=0;i<7;i++)a.push({x:r()*10,y:r()*10,k:-1});return a}
ML.moons=moons;

/* ======================================================= k-means */
ML.add({id:'k-means',title:'k-Means Clustering',min:10,lvl:'Beginner',
sub:'Find k groups by alternating two simple steps: assign points, move centres.',
keys:'kmeans clustering centroid inertia elbow lloyd k-means++',
learn:['The assign / update loop','Why it always converges (to something)','Choosing k with the elbow method','Where k-means fails'],
cheat:['1) assign each point to the nearest centroid; 2) move each centroid to its points’ mean; repeat.','Minimises inertia (within-cluster sum of squares).','Use k-means++ initialisation and several restarts.','Assumes round, similar-size clusters; fails on moons/rings.'],
met:[['k','k','grid'],['iter','Iteration','repeat'],['inertia','Inertia','chart']],
hero:3,
setup(){const r=U.rng(23);this.d=[...U.blob(r,35,2.6,7,.9),...U.blob(r,35,7.2,7.2,1),...U.blob(r,35,5,2.6,1)];
  this.h=kmeans(this.d,[{x:1,y:1.5},{x:2,y:2.2},{x:9,y:3}],12);const last=this.h[this.h.length-1];
  this.elbow=U.range(7).map(i=>{const k=i+1,rr=U.rng(40+k);const init=U.range(k).map(()=>this.d[Math.floor(rr()*this.d.length)]);const h=kmeans(this.d,init,30);return h[h.length-1].inertia});
  this.steps[1].m={k:'3',iter:'0',inertia:this.h[0].inertia.toFixed(0)};this.steps[2].m={iter:'1'};this.steps[3].m={iter:`1 → ${this.h.length-1}`,inertia:last.inertia.toFixed(0)};
  const r2=U.rng(3);this.mo=moons(r2).filter(p=>p.k>=0);this.mh=kmeans(this.mo,[{x:3,y:6},{x:5,y:5}],20);},
draw(si,g){
  const s=[];
  if(si<=3){const P=g.plot({x:50,y:30,w:420,h:410,xr:[0,10],yr:[0,10],xl:'x₁',yl:'x₂'});this.P=P;s.push(P.svg);
    if(si===0){s.push(P.pts(this.d.map(p=>({...p,c:'gray'}))),g.panel(510,60,'Unlabelled data',['no classes given','we only ask for k = 3 groups','','goal: each point close to','its group’s centre'],'gray'))}
    else if(si<3){const H=this.h[si===1?0:0],lab=si===1?null:H.lab;
      if(si===2)this.d.forEach((p,i)=>{const c=H.C[lab[i]];s.push(`<line x1="${P.sx(p.x)}" y1="${P.sy(p.y)}" x2="${P.sx(c.x)}" y2="${P.sy(c.y)}" style="stroke:var(--${KC[lab[i]]});opacity:.35"/>`)});
      s.push(P.pts(this.d.map((p,i)=>({...p,c:lab?KC[lab[i]]:'gray'}))));H.C.forEach((c,i)=>s.push(this.cent(g,P,c,i)));
      s.push(g.panel(510,60,si===1?'Drop 3 centroids':'Step 1: assign',si===1?['pick k starting centres','(random here, deliberately bad)','','k-means++ picks spread-out','starts in practice']:['every point joins its','NEAREST centroid','','colour = assignment'],si===1?'gray':'blue'))}
    else s.push(g.panel(510,60,'Step 2: update, then repeat',['move each centroid to the','mean of its points','re-assign, move, re-assign…','stops when nothing changes'],'green'),g.T(510,210,'inertia = Σ ‖x − centroid‖²',{cls:'b'}),g.T(510,228,'never increases → always converges',{cls:'m'}));
  }else if(si===4){const Q=g.plot({x:70,y:40,w:420,h:360,xr:[1,7],yr:[0,this.elbow[0]*1.05],xl:'k',yl:'inertia',ticks:1,nx:6,ny:3});s.push(Q.svg,Q.line(this.elbow.map((v,i)=>[i+1,v]),'purple'));
    this.elbow.forEach((v,i)=>s.push(g.C(Q.sx(i+1),Q.sy(v),i===2?8:5,i===2?'red':'purple')));s.push(g.T(Q.sx(3)+12,Q.sy(this.elbow[2])-12,'elbow: k = 3',{cls:'b',c:'red'}));
    s.push(g.panel(530,60,'Choosing k',['inertia always drops as k grows','(k = n gives 0)','look for the bend where extra','clusters stop helping much','','also: silhouette score'],'yellow'))}
  else{const P=g.plot({x:50,y:30,w:420,h:410,xr:[0,10],yr:[0,10],xl:'x₁',yl:'x₂'});const H=this.mh[this.mh.length-1];s.push(P.svg,P.pts(this.mo.map((p,i)=>({...p,c:KC[H.lab[i]]}))));H.C.forEach((c,i)=>s.push(this.cent(g,P,c,i)));
    s.push(g.panel(510,60,'Where k-means fails',['two interleaved moons','k-means cuts them in half','because it only knows','"distance to a centre"','','→ DBSCAN / spectral (next)'],'red'))}
  return s.join('');
},
cent(g,P,c,i){const x=P.sx(c.x),y=P.sy(c.y);return `<g style="--c:var(--${KC[i]})"><path d="M${x-9},${y-9}L${x+9},${y+9}M${x+9},${y-9}L${x-9},${y+9}" style="stroke:var(--edge);stroke-width:6;stroke-linecap:round"/><path d="M${x-9},${y-9}L${x+9},${y+9}M${x+9},${y-9}L${x-9},${y+9}" style="stroke:var(--c);stroke-width:3.4;stroke-linecap:round"/></g>`},
anim(si,t,g){if(si!==3)return '';const P=this.P,n=this.h.length,f=(t*1.1)%(n+1.5),i=Math.min(n-1,Math.floor(f)),k=U.ease(Math.min(1,(f-i)*1.6));const H=this.h[i],N=this.h[Math.min(n-1,i+1)];
  let s=P.pts(this.d.map((p,j)=>({...p,c:KC[H.lab[j]]})));H.C.forEach((c,j)=>{const c2={x:U.lerp(c.x,N.C[j].x,k),y:U.lerp(c.y,N.C[j].y,k)};s+=this.cent(g,P,c2,j)});return s+g.pill(P.x+P.w-80,P.y+18,`iteration ${i}`,'green')},
steps:[
 {k:'setup',t:'Points with no labels',short:'Data',m:{k:'3'},
  b:'We have points but no classes. Clustering asks: which points belong together? <b>k-means</b> is the classic answer. You choose the number of groups <b>k</b>, and it finds k centres.'},
 {k:'technique',t:'Initialise centroids',short:'Init',
  b:'Place k <b>centroids</b> somewhere. We put them in a bad spot on purpose to show the algorithm recovering.\n\nIn practice <b>k-means++</b> picks starting points far apart, and you run several restarts and keep the best.'},
 {k:'technique',t:'Assign to nearest',short:'Assign',
  b:'Every point is assigned to its <b>closest</b> centroid. The space is now carved into k regions (a Voronoi diagram).'},
 {k:'solution',t:'Move, repeat, converge',short:'Iterate',
  n:['Move each centroid to the mean of its points','Re-assign points to the nearest centroid','Repeat until assignments stop changing'],
  b:'Move each centroid to the average of the points assigned to it, then re-assign. Each step can only lower the total squared distance (<b>inertia</b>), so the loop always converges, usually in a handful of iterations.\n\nIt converges to a <b>local</b> optimum, which is why restarts matter.'},
 {k:'tradeoff',t:'How many clusters?',short:'Choose k',m:{k:'1 … 7',iter:'—'},
  b:'Run k-means for several k and plot the inertia. It always falls, but the curve usually bends at a natural k: the <b>elbow</b>.\n\nThe <b>silhouette score</b> (how much closer each point is to its own cluster than to the next) gives a second opinion.'},
 {k:'problem',t:'Non-round clusters',short:'Failure mode',m:{k:'2',iter:'—',inertia:'—'},
  b:'k-means assumes clusters are round blobs of similar size. On two interleaved half-moons it draws a straight cut through both.\n\nFor arbitrary shapes, use density-based methods. That is the next lesson.'}
]});

/* ======================================================= DBSCAN & hierarchical */
ML.add({id:'dbscan-hierarchical',title:'DBSCAN & Hierarchical',min:10,lvl:'Intermediate',
sub:'Clusters of any shape by following density, and a family tree of clusters with dendrograms.',
keys:'dbscan density eps minpts core point noise agglomerative linkage dendrogram hdbscan',
learn:['DBSCAN core, border and noise points','How eps and minPts set the density','Agglomerative clustering, bottom-up','Reading a dendrogram'],
cheat:['DBSCAN: core point = ≥ minPts neighbours within eps; clusters grow through connected cores.','No k needed; finds odd shapes; labels outliers as noise.','Agglomerative: start with every point alone, repeatedly merge the closest pair.','Cut the dendrogram at a height to get clusters.'],
met:[['eps','eps','target'],['minpts','minPts','users'],['clusters','Clusters','grid'],['noise','Noise points','alert']],
hero:2,
setup(){const r=U.rng(3);this.d=moons(r);const eps=.75,mp=4;this.eps=eps;
  const nb=this.d.map(p=>this.d.filter(q=>U.dist(p,q)<=eps));const core=nb.map(a=>a.length>=mp);const lab=Array(this.d.length).fill(-1);let c=0;
  this.d.forEach((p,i)=>{if(lab[i]!==-1||!core[i])return;const st=[i];lab[i]=c;while(st.length){const j=st.pop();if(!core[j])continue;this.d.forEach((q,k)=>{if(lab[k]===-1&&U.dist(this.d[j],q)<=eps){lab[k]=c;st.push(k)}})}c++});
  this.core=core;this.lab=lab;const bi=this.d.findIndex((p,j)=>!core[j]&&lab[j]>=0);let ce=0,cb=-1;this.d.forEach((p,j)=>{if(core[j]&&lab[j]>=0){const d=U.dist(p,this.d[bi]);if(d>2.5&&d<4&&nb[j].length>cb){cb=nb[j].length;ce=j}}});this.coreEx=ce;const noise=lab.filter(v=>v<0).length;this.steps[2].m={clusters:String(c),noise:String(noise)};
  // small set for dendrogram (single linkage)
  const r3=U.rng(12);this.sm=[...U.blob(r3,4,2,7,.6),...U.blob(r3,4,7,7.5,.6),...U.blob(r3,4,5,2.5,.7)].map((p,i)=>({...p,id:i}));
  let cl=this.sm.map((p,i)=>({m:[i],x:null,h:0,id:i}));const merges=[];let nid=this.sm.length;
  while(cl.length>1){let b=null;for(let i=0;i<cl.length;i++)for(let j=i+1;j<cl.length;j++){let d=1e9;cl[i].m.forEach(a=>cl[j].m.forEach(q=>{d=Math.min(d,U.dist(this.sm[a],this.sm[q]))}));if(!b||d<b.d)b={i,j,d}}
    const A=cl[b.i],B=cl[b.j],N={m:[...A.m,...B.m],h:b.d,id:nid++,a:A,b:B};merges.push(N);cl=cl.filter((_,k)=>k!==b.i&&k!==b.j);cl.push(N)}
  this.root=cl[0];this.merges=merges;},
draw(si,g){
  const s=[];
  if(si<=2){const P=g.plot({x:50,y:30,w:420,h:410,xr:[0,10],yr:[0,10],xl:'x₁',yl:'x₂'});s.push(P.svg);
    if(si===0){s.push(P.pts(this.d.map(p=>({...p,c:'gray'}))),g.panel(510,60,'Density, not centres',['a cluster = a region where','points are packed densely','','sparse points in between','are noise'],'gray'))}
    else if(si===1){const ex=[0,3,1].map(i=>this.d.find((p,j)=>this.core[j]&&j%3===i)||this.d[i]);const bor=this.d.findIndex((p,j)=>!this.core[j]&&this.lab[j]>=0),noi=this.d.findIndex((p,j)=>this.lab[j]<0);
      s.push(P.pts(this.d.map((p,j)=>({...p,c:this.core[j]?'blue':this.lab[j]>=0?'yellow':'red'})),4.5));
      [[this.d[this.coreEx],'core'],[this.d[bor],'border'],[this.d[noi],'noise']].forEach(([p,l])=>{if(!p)return;s.push(`<circle cx="${P.sx(p.x)}" cy="${P.sy(p.y)}" r="${this.eps/10*420}" style="fill:none;stroke:var(--edge);stroke-width:1.5;stroke-dasharray:4 4"/>`,g.pill(P.sx(p.x),P.sy(p.y)-this.eps/10*420-12,l,'ink'))});
      s.push(g.panel(510,60,'Three kinds of point',['eps = 0.75, minPts = 4','blue   core: ≥ 4 points within eps','yellow border: near a core point','red    noise: neither'],'blue'))}
    else{s.push(P.pts(this.d.map((p,j)=>({...p,c:this.lab[j]<0?'gray':KC[this.lab[j]]})),4.5));this.d.forEach((p,j)=>{if(this.lab[j]<0)s.push(g.T(P.sx(p.x)-4,P.sy(p.y)+4,'×',{cls:'b',c:'red'}))});
      s.push(g.panel(510,60,'DBSCAN result',['both moons found exactly','no k given','outliers marked as noise (×)','','HDBSCAN: varies eps','automatically'],'green'))}
  }else{const P=g.plot({x:40,y:40,w:300,h:300,xr:[0,10],yr:[0,10],grid:false,title:'12 points'});s.push(P.svg,P.pts(this.sm.map(p=>({...p,c:'gray'})),6));
    this.sm.forEach((p,i)=>s.push(g.T(P.sx(p.x)+8,P.sy(p.y)-6,String(i),{cls:'m'})));
    // dendrogram
    const order=[];const walk=n=>{if(n.a){walk(n.a);walk(n.b)}else order.push(n.id)};walk(this.root);
    const X0=400,W=420,Y0=400,Hh=330,hmax=this.root.h*1.08;const xs={};order.forEach((id,i)=>xs[id]=X0+i*W/(order.length-1));
    const pos=n=>{if(!n.a)return [xs[n.id],Y0];const a=pos(n.a),b=pos(n.b),y=Y0-n.h/hmax*Hh;s.push(`<path d="M${a[0]},${a[1]}V${y}H${b[0]}V${b[1]}" style="fill:none;stroke:var(--edge);stroke-width:1.6"/>`);return [(a[0]+b[0])/2,y]};pos(this.root);
    order.forEach(id=>s.push(g.T(xs[id],Y0+16,String(id),{a:'middle',cls:'m'})));
    if(si===4){const cut=Y0-(this.merges[this.merges.length-3].h+this.merges[this.merges.length-2].h)/2/hmax*Hh;s.push(`<line x1="${X0-20}" y1="${cut}" x2="${X0+W+20}" y2="${cut}" style="stroke:var(--red);stroke-width:2.2;stroke-dasharray:7 5"/>`,g.pill(X0+W-40,cut-14,'cut → 3 clusters','red'))}
    s.push(g.T(400,60,'dendrogram: height = distance when merged',{cls:'b'}))}
  return s.join('');
},
steps:[
 {k:'setup',t:'Clusters as dense regions',short:'Density',m:{eps:'—',minpts:'—'},
  b:'k-means failed on these moons. <b>DBSCAN</b> (Density-Based Spatial Clustering of Applications with Noise) defines a cluster differently: a connected region where points are packed tightly.'},
 {k:'technique',t:'Core, border, noise',short:'Core points',m:{eps:'0.75',minpts:'4'},
  b:'Draw a circle of radius <b>eps</b> around each point. If it holds at least <b>minPts</b> points, it is a <b>core</b> point. Points near a core point but not core themselves are <b>border</b> points. Everything else is <b>noise</b>.'},
 {k:'solution',t:'Grow clusters through cores',short:'Result',
  b:'Start at any core point and keep adding every point within eps of a core point in the cluster. Chains of core points can snake around any shape.\n\nNo k required, arbitrary shapes, and outliers are flagged automatically. The cost: eps is hard to choose when density varies (HDBSCAN fixes that).'},
 {k:'technique',t:'Agglomerative clustering',short:'Hierarchical',m:{eps:'—',minpts:'—',clusters:'12 → 1',noise:'—'},
  b:'A different idea: start with every point as its own cluster and repeatedly <b>merge the two closest clusters</b>, recording the distance at each merge.\n\nThe result is a tree, the <b>dendrogram</b>. “Closest” is set by the <b>linkage</b>: single (nearest points), complete (farthest), average, or Ward (smallest variance increase).'},
 {k:'solution',t:'Cut the tree',short:'Cut',m:{clusters:'3'},
  b:'Pick a height and cut: every branch below the line becomes a cluster. One tree gives you every possible number of clusters at once, and the long vertical gaps show where the natural groups are.\n\nGood for small and medium data and for taxonomies; quadratic memory makes it slow for huge datasets.'}
]});

/* ======================================================= GMM / EM */
ML.add({id:'gmm-em',title:'Gaussian Mixtures & EM',min:11,lvl:'Intermediate',
sub:'Soft clustering: each point belongs partly to every cluster, learned with Expectation-Maximisation.',
keys:'gmm gaussian mixture model em expectation maximization soft clustering responsibilities likelihood',
learn:['Data as a mix of bell curves','E-step: soft responsibilities','M-step: refit each Gaussian','EM vs k-means'],
cheat:['p(x) = Σₖ πₖ · N(x | μₖ, σₖ²).','E-step: rₙₖ = how much point n belongs to component k.','M-step: update π, μ, σ using the r-weighted points.','k-means is the “hard”, equal-variance limit of a GMM.'],
met:[['iter','EM iteration','repeat'],['mu','Means μ','target'],['ll','Log-likelihood','chart']],
hero:3,
setup(){const r=U.rng(29);this.x=[...U.range(140).map(()=>3.2+U.gauss(r)*.9),...U.range(90).map(()=>6.6+U.gauss(r)*.7)];
  const N=(x,m,s)=>Math.exp(-((x-m)**2)/(2*s*s))/(s*Math.sqrt(2*Math.PI));this.N=N;
  let th={pi:[.5,.5],mu:[4.6,5.4],sd:[1.5,1.5]};const hist=[];
  for(let it=0;it<25;it++){const R=this.x.map(x=>{const a=th.pi[0]*N(x,th.mu[0],th.sd[0]),b=th.pi[1]*N(x,th.mu[1],th.sd[1]);return a/(a+b)});const ll=this.x.reduce((s,x)=>s+Math.log(th.pi[0]*N(x,th.mu[0],th.sd[0])+th.pi[1]*N(x,th.mu[1],th.sd[1])),0);hist.push({th:JSON.parse(JSON.stringify(th)),R,ll});
    const n0=R.reduce((s,v)=>s+v,0),n1=R.length-n0;const m0=this.x.reduce((s,x,i)=>s+R[i]*x,0)/n0,m1=this.x.reduce((s,x,i)=>s+(1-R[i])*x,0)/n1;
    th={pi:[n0/R.length,n1/R.length],mu:[m0,m1],sd:[Math.sqrt(this.x.reduce((s,x,i)=>s+R[i]*(x-m0)**2,0)/n0),Math.sqrt(this.x.reduce((s,x,i)=>s+(1-R[i])*(x-m1)**2,0)/n1)]}}
  this.hist=hist;const f=h=>`${h.th.mu[0].toFixed(2)} · ${h.th.mu[1].toFixed(2)}`;
  this.steps[1].m={iter:'0',mu:f(hist[0]),ll:hist[0].ll.toFixed(0)};this.steps[2].m={iter:'0 (E)'};this.steps[3].m={iter:'1 → 24',mu:f(hist[24]),ll:hist[24].ll.toFixed(0)};},
draw(si,g){
  const s=[];if(si===4)return this.cmp(g);
  const P=g.plot({x:50,y:40,w:480,h:360,xr:[0,10],yr:[0,.5],xl:'x',yl:'density'});this.P=P;s.push(P.svg);
  const bins=40,cnt=Array(bins).fill(0);this.x.forEach(x=>{const b=Math.floor(x/10*bins);if(b>=0&&b<bins)cnt[b]++});cnt.forEach((n,i)=>{const h=n/this.x.length/(10/bins);s.push(g.R(P.sx(i*10/bins)+1,P.sy(h),480/bins-2,P.y+360-P.sy(h),{fill:'var(--gray-bg)',stroke:'var(--line2)'}))});
  if(si>=1&&si<3){const H=this.hist[0];this.comp(s,g,P,H);if(si===2)this.rug(s,g,P,H)}
  if(si===0)s.push(g.panel(560,60,'Two overlapping humps',['a histogram of one feature','looks like two bell curves','mixed together','','which hump made each point?'],'gray'));
  if(si===1)s.push(g.panel(560,60,'Model: a mixture',['p(x) = π₁·N(μ₁,σ₁) + π₂·N(μ₂,σ₂)','start with a rough guess','','unknowns: π, μ, σ'],'purple'));
  if(si===2)s.push(g.panel(560,60,'E-step',['for each point: how much','did each Gaussian explain it?','r = π₁N₁ / (π₁N₁ + π₂N₂)','','colour mix = responsibility'],'blue'));
  if(si===3)s.push(g.panel(560,60,'M-step, then repeat',['refit each Gaussian to the','points, weighted by r','μₖ = Σ rₙₖ xₙ / Σ rₙₖ','','likelihood rises every round'],'green'));
  return s.join('');
},
comp(s,g,P,H){[0,1].forEach(k=>s.push(P.fn(x=>H.th.pi[k]*this.N(x,H.th.mu[k],H.th.sd[k]),k?'orange':'blue',{n:200})));s.push(P.fn(x=>H.th.pi[0]*this.N(x,H.th.mu[0],H.th.sd[0])+H.th.pi[1]*this.N(x,H.th.mu[1],H.th.sd[1]),'ink',{cls:'dash thin',n:200}))},
rug(s,g,P,H){this.x.forEach((x,i)=>{if(i%2)return;const r=H.R[i];s.push(`<rect x="${P.sx(x)-1.5}" y="${P.y+P.h-16}" width="3" height="14" style="fill:color-mix(in srgb,var(--blue) ${Math.round(r*100)}%,var(--orange))"/>`)})},
cmp(g){const s=[];s.push(g.T(60,50,'k-means vs Gaussian mixture',{cls:'h'}));
  s.push(g.panel(60,90,'k-means (hard)',['each point → exactly one cluster','clusters assumed round & equal','distance to centre only'],'blue'),g.panel(450,90,'GMM (soft)',['each point → probabilities','each cluster has its own','size, shape (covariance), weight','gives a density p(x): can sample'],'purple'));
  s.push(g.panel(60,250,'EM is everywhere',['any model with hidden variables:','HMMs (speech), topic models,','missing data, mixtures of experts'],'yellow'),g.panel(450,250,'Choosing k',['BIC / AIC penalise extra','components; pick the lowest'],'green'));return s.join('')},
anim(si,t,g){if(si!==3)return '';const P=this.P,n=this.hist.length,i=Math.min(n-1,Math.floor((t*3)%(n+6)));const s=[];this.comp(s,g,P,this.hist[i]);this.rug(s,g,P,this.hist[i]);return s.join('')+g.pill(P.x+P.w-110,P.y+18,`iter ${i} · logL ${this.hist[i].ll.toFixed(0)}`,'green')},
steps:[
 {k:'setup',t:'Data from overlapping groups',short:'Data',m:{iter:'—'},
  b:'Suppose a measurement (say, height) comes from two hidden groups whose ranges overlap. Points in the middle could belong to either. Forcing a hard choice, like k-means does, throws that uncertainty away.'},
 {k:'technique',t:'A mixture of Gaussians',short:'Model',
  b:'Model the data as a weighted sum of bell curves: each <b>component</b> k has a weight πₖ, mean μₖ and spread σₖ. We start with a deliberately poor guess: two wide curves in the middle.'},
 {k:'technique',t:'E-step: soft assignments',short:'E-step',
  b:'<b>Expectation</b>: for every point, compute the probability that each component generated it, its <b>responsibility</b>. The strip at the bottom shows each point’s blue/orange mix.'},
 {k:'solution',t:'M-step and convergence',short:'M-step',
  n:['E: compute responsibilities','M: refit π, μ, σ with weighted points','Repeat: likelihood rises each round'],
  b:'<b>Maximisation</b>: refit each Gaussian using all the points, weighted by their responsibilities. Alternate E and M. The log-likelihood is guaranteed not to decrease, and the curves lock onto the two humps.\n\nLike k-means, EM finds a local optimum, so initialisation matters.'},
 {k:'insight',t:'Soft vs hard clustering',short:'vs k-means',m:{iter:'—'},
  b:'k-means is a special case of a GMM: hard assignments and identical round clusters. GMMs give calibrated uncertainty and model elongated clusters with full covariance matrices.\n\nThe EM recipe (guess hidden variables, then refit parameters) is a general tool used far beyond clustering.'}
]});

/* ======================================================= PCA */
ML.add({id:'pca',title:'Principal Component Analysis',min:10,lvl:'Intermediate',
sub:'Rotate the data to the directions of greatest spread, then drop the boring ones.',
keys:'pca dimensionality reduction eigenvector eigenvalue variance explained svd projection',
learn:['Why fewer dimensions help','Principal components = directions of max variance','Projecting and reconstructing','Choosing how many components to keep'],
cheat:['Centre the data, compute the covariance matrix, take its eigenvectors.','PC1 = direction of max variance; PC2 ⟂ PC1 = next most, …','Keep enough PCs for ~90–95% of variance.','Linear only; standardise features first. Computed via SVD in practice.'],
met:[['dims','Dimensions','layers'],['var','Variance kept','chart'],['err','Reconstruction error','alert']],
hero:2,
setup(){const r=U.rng(37);const a=.62;this.d=U.range(70).map(()=>{const u=U.gauss(r)*1.75,v=U.gauss(r)*.5;return {x:5+u*Math.cos(a)-v*Math.sin(a),y:5+u*Math.sin(a)+v*Math.cos(a),c:'blue'}});
  const n=this.d.length,mx=this.d.reduce((s,p)=>s+p.x,0)/n,my=this.d.reduce((s,p)=>s+p.y,0)/n;const sxx=this.d.reduce((s,p)=>s+(p.x-mx)**2,0)/n,syy=this.d.reduce((s,p)=>s+(p.y-my)**2,0)/n,sxy=this.d.reduce((s,p)=>s+(p.x-mx)*(p.y-my),0)/n;
  const tr=sxx+syy,det=sxx*syy-sxy*sxy,l1=tr/2+Math.sqrt(tr*tr/4-det),l2=tr/2-Math.sqrt(tr*tr/4-det);const v1=[sxy,l1-sxx],nv=Math.hypot(...v1);this.v1=[v1[0]/nv,v1[1]/nv];this.v2=[-this.v1[1],this.v1[0]];this.m=[mx,my];this.l=[l1,l2];
  this.cov=[sxx,sxy,syy];const pct=(l1/(l1+l2)*100).toFixed(1);this.steps[2].m={dims:'2 → 1',var:pct+'%',err:(l2/(l1+l2)*100).toFixed(1)+'%'};this.steps[3].m=this.steps[2].m;},
draw(si,g){
  const s=[];if(si===4)return this.scree(g);
  const P=g.plot({x:50,y:30,w:420,h:410,xr:[0,10],yr:[0,10],xl:'feature 1 (e.g. height)',yl:'feature 2 (e.g. weight)'});this.P=P;s.push(P.svg);
  const [mx,my]=this.m,[a,b]=this.v1,[c,d]=this.v2;
  if(si>=1){const L1=Math.sqrt(this.l[0])*2,L2=Math.sqrt(this.l[1])*2;s.push(g.vec(P,mx,my,mx+a*L1,my+b*L1,'red','PC1'),g.vec(P,mx,my,mx+c*L2,my+d*L2,'green','PC2'));
    if(si>=2)s.push(P.line([[mx-a*6,my-b*6],[mx+a*6,my+b*6]],'red',{cls:'dash thin'}))}
  if(si===2)this.d.forEach(p=>{const t=(p.x-mx)*a+(p.y-my)*b;s.push(`<line x1="${P.sx(p.x)}" y1="${P.sy(p.y)}" x2="${P.sx(mx+a*t)}" y2="${P.sy(my+b*t)}" style="stroke:var(--faint);stroke-width:1"/>`)});
  if(si!==3)s.push(P.pts(this.d,4.5));
  if(si===0)s.push(g.panel(510,60,'Correlated features',['two measurements that move','together: mostly ONE','underlying direction','','can we describe each point','with a single number?'],'gray'));
  if(si===1)s.push(g.panel(510,60,'Principal components',['covariance matrix Σ:',`  [${this.cov[0].toFixed(2)}  ${this.cov[1].toFixed(2)}]`,`  [${this.cov[1].toFixed(2)}  ${this.cov[2].toFixed(2)}]`,'eigenvectors = PC directions',`eigenvalues λ = ${this.l[0].toFixed(2)}, ${this.l[1].toFixed(2)}`],'red'));
  if(si===2)s.push(g.panel(510,60,'Project onto PC1',['each point → one number:','  z = (x − mean) · PC1','grey lines = information lost',`variance kept: ${this.steps[2].m.var}`],'red'));
  if(si===3)s.push(g.panel(510,60,'Reconstruct',['x̂ = mean + z · PC1','points collapse onto the line','tiny loss, half the numbers','','= lossy compression'],'green'));
  return s.join('');
},
scree(g){const s=[];s.push(g.T(60,50,'Real data: 784 pixels per digit image',{cls:'h'}));const v=U.range(15).map(i=>9.8*Math.exp(-i*.28)+.5);const tot=v.reduce((a,b)=>a+b,0)*1.6;let cum=0;
  s.push(g.T(70,90,'variance explained per component (illustrative)',{cls:'m'}),g.bars(70,110,420,250,v.map(x=>x/tot),{c:'purple',fmt:false,labels:v.map((_,i)=>'PC'+(i+1)),rot:-45}));
  s.push(g.panel(540,90,'Keep the top few',['first ~50 PCs of MNIST hold','most of the variance','','uses: compression, denoising,','faster training, 2D plots','','limits: linear only; use','t-SNE / UMAP for 2D maps'],'purple'));return s.join('')},
anim(si,t,g){if(si!==3)return '';const P=this.P,[mx,my]=this.m,[a,b]=this.v1,k=U.ease(Math.min(1,(t%4)/2));return this.d.map(p=>{const tt=(p.x-mx)*a+(p.y-my)*b;return g.C(P.sx(U.lerp(p.x,mx+a*tt,k)),P.sy(U.lerp(p.y,my+b*tt,k)),4.5,'blue')}).join('')},
steps:[
 {k:'setup',t:'Too many correlated features',short:'Data',m:{dims:'2'},
  b:'Real datasets have hundreds of features, and many move together. Here two features are strongly correlated: the points lie along a tilted line. Most of the information is in one direction.'},
 {k:'math',t:'Find the directions of spread',short:'Components',
  b:'PCA centres the data and finds the direction along which it varies most: <b>PC1</b>. PC2 is perpendicular and captures what is left.\n\nMathematically, they are the <b>eigenvectors</b> of the covariance matrix, and each <b>eigenvalue</b> is the variance along that direction. In practice it is computed with the SVD.'},
 {k:'solution',t:'Project to fewer dimensions',short:'Project',
  b:'Describe each point by its position along PC1 only: one number instead of two. The grey lines are the part we discard, and they are short.\n\nWith 1,000 features you might keep 50 components and lose very little.'},
 {k:'insight',t:'Reconstruct',short:'Reconstruct',
  b:'Going back from 1 number to 2 puts every point on the PC1 line. The reconstruction error equals the variance in the dropped components.\n\nThis is <b>lossy compression</b>, and it also removes noise, which mostly lives in the small components.'},
 {k:'tradeoff',t:'How many to keep?',short:'Scree plot',m:{dims:'784 → ~50',var:'~90%',err:'small'},
  b:'Sort components by variance (a <b>scree plot</b>) and keep enough to explain about 90–95%.\n\nPCA is linear: it can rotate and drop axes, not bend space. For curved structure and for 2D visual maps, use t-SNE or UMAP (next).'}
]});

/* ======================================================= t-SNE / UMAP */
ML.add({id:'tsne-umap',title:'t-SNE & UMAP',min:9,lvl:'Intermediate',
sub:'Draw a 2D map of high-dimensional data that keeps neighbours next to each other.',
keys:'tsne umap manifold embedding visualization perplexity nonlinear dimensionality reduction',
learn:['Why a linear projection overlaps clusters','t-SNE: match neighbour probabilities','Heavy-tailed t-distribution in 2D','How to read (and misread) the maps'],
cheat:['Preserves local neighbourhoods, not global distances.','Perplexity ≈ how many neighbours each point cares about (5–50).','Cluster sizes and gaps between clusters are NOT meaningful.','UMAP: faster, keeps a bit more global structure, can embed new points.'],
met:[['dims','Dimensions','layers'],['perp','Perplexity','users'],['kl','KL divergence','chart']],
hero:3,
setup(){const r=U.rng(41);const cs=[[2,7.5],[5,8.3],[8,7.4],[2.5,4],[7.6,4.2],[3.3,1.5],[6.5,1.6],[5,5]];
  this.pts=[];cs.forEach(([x,y],k)=>{for(let i=0;i<14;i++){const tgt={x:x+U.gauss(r)*.42,y:y+U.gauss(r)*.42};const pca={x:5+(x-5)*.35+U.gauss(r)*1.1,y:5+(y-5)*.3+U.gauss(r)*1.1};const rnd={x:4.5+U.gauss(r)*.4,y:5+U.gauss(r)*.4};this.pts.push({k,tgt,pca,rnd})}});},
draw(si,g){
  const s=[];const col=k=>KC[k%6]||['brown','yellow'][k-6];
  if(si<=3){const P=g.plot({x:50,y:30,w:420,h:410,xr:[0,10],yr:[0,10],grid:false,xl:si===0?'PC1':'t-SNE 1',yl:si===0?'PC2':'t-SNE 2'});this.P=P;s.push(P.svg);
    if(si===0)s.push(P.pts(this.pts.map(p=>({...p.pca,c:col(p.k)})),4.5),g.panel(510,60,'PCA of 8 digit classes',['784-dim images → 2 PCs','classes overlap heavily','a linear view hides','the curved structure'],'gray'));
    if(si===1){const c=this.pts[20];s.push(P.pts(this.pts.map(p=>({...p.tgt,c:'gray'})),4));[.5,1,1.5].forEach(R=>s.push(`<circle cx="${P.sx(c.tgt.x)}" cy="${P.sy(c.tgt.y)}" r="${R*42}" style="fill:var(--blue);opacity:.08;stroke:var(--blue)"/>`));s.push(g.C(P.sx(c.tgt.x),P.sy(c.tgt.y),7,'blue',{cls:'big'}));
      s.push(g.panel(510,60,'Step 1: high-dim similarities',['put a Gaussian on each point','pⱼ|ᵢ ∝ exp(−‖xᵢ − xⱼ‖² / 2σᵢ²)','σᵢ tuned so each point has','~perplexity effective neighbours','near = high p, far ≈ 0'],'blue'))}
    if(si===2){s.push(P.pts(this.pts.map(p=>({...p.rnd,c:col(p.k)})),4.5));const Q=g.plot({x:510,y:250,w:300,h:160,xr:[-4,4],yr:[0,.42],grid:false,title:'Gaussian vs Student-t (1 dof)'});s.push(Q.svg,Q.fn(x=>Math.exp(-x*x/2)/2.507,'blue'),Q.fn(x=>1/(Math.PI*(1+x*x)),'red'),g.T(520,225,'blue: Gaussian (high-dim)',{c:'blue',cls:'b'}),g.T(520,241,'red: Student-t (2D)',{c:'red',cls:'b'}));
      s.push(g.panel(510,40,'Step 2: random 2D start',['qᵢⱼ ∝ (1 + ‖yᵢ − yⱼ‖²)⁻¹','heavy tails let far points sit','far apart without penalty','(fixes the "crowding problem")'],'red'))}
    if(si===3)s.push(g.panel(510,60,'Step 3: gradient descent',['move 2D points to minimise','KL(P ‖ Q)','neighbours attract,','everyone else repels','clusters emerge'],'green'));
  }else{s.push(g.T(60,50,'Reading the map correctly',{cls:'h'}));
    s.push(g.panel(60,90,'✓ Trustworthy',['which points are neighbours','that there ARE separate groups'],'green'),g.panel(450,90,'✗ Not trustworthy',['cluster sizes (densities are equalised)','distances BETWEEN clusters','apparent shapes at one perplexity'],'red'));
    s.push(g.panel(60,250,'UMAP (2018)',['builds a fuzzy k-NN graph, then lays it out','much faster than t-SNE on millions of points','keeps somewhat more global structure','can transform new points'],'purple'),g.panel(450,250,'Where you see these',['visualising word / image embeddings','single-cell biology','sanity-checking learned features'],'yellow'))}
  return s.join('');
},
anim(si,t,g){if(si!==3)return '';const P=this.P,k=U.ease(Math.min(1,(t%6)/4.2));const col=k2=>KC[k2%6]||['brown','yellow'][k2-6];
  return this.pts.map(p=>g.C(P.sx(U.lerp(p.rnd.x,p.tgt.x,k)),P.sy(U.lerp(p.rnd.y,p.tgt.y,k)),4.5,col(p.k))).join('')+g.pill(P.x+P.w-80,P.y+18,`iteration ${Math.round(k*1000)}`,'green')},
steps:[
 {k:'problem',t:'Linear maps overlap',short:'Problem',m:{dims:'784 → 2',perp:'—',kl:'—'},
  b:'You want to <b>see</b> high-dimensional data, such as 784-pixel digit images or 768-number text embeddings. PCA onto 2 axes keeps the most variance, but classes pile on top of each other because the real structure is curved.'},
 {k:'math',t:'Neighbour probabilities',short:'High-dim P',m:{perp:'30'},
  b:'<b>t-SNE</b> (t-distributed Stochastic Neighbour Embedding) turns distances into probabilities: for each point, how likely is it to pick each other point as its neighbour? Close points get high probability, distant ones nearly zero.\n\n<b>Perplexity</b> sets the neighbourhood size.'},
 {k:'technique',t:'A heavy-tailed 2D layout',short:'Low-dim Q',
  b:'Scatter the points randomly in 2D and define similar probabilities there, but with a <b>Student-t</b> curve. Its heavy tails give moderately distant points room to spread out instead of crowding the centre.'},
 {k:'solution',t:'Optimise the layout',short:'Optimise',m:{kl:'falling'},
  b:'Gradient descent moves the 2D points to make the two probability tables match (minimising <b>KL divergence</b>). Neighbours pull together, non-neighbours push apart, and the classes separate cleanly.\n\nThe animation here is illustrative; a real run takes about 1,000 iterations.'},
 {k:'tradeoff',t:'Read it carefully',short:'Caveats',m:{dims:'—',perp:'—',kl:'—'},
  b:'t-SNE keeps <b>local</b> structure only: cluster sizes and gaps between clusters can mislead. Try several perplexities before trusting a shape.\n\n<b>UMAP</b> is the popular modern alternative: faster and better at global layout. Both are for visualisation, not for feeding distances into other models.'}
]});
})();
