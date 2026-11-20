/* 08 · Inside the transformer */
(function(){const U=ML.U;

/* ======================================================= transformer block */
ML.add({id:'transformer-block',title:'The Transformer Block',min:13,lvl:'Intermediate',
sub:'Attention + a small MLP, wrapped in residual connections and normalisation, stacked dozens of times.',
keys:'transformer block layer feed-forward ffn mlp residual stream layernorm pre-norm encoder decoder bert gpt t5 attention is all you need',
learn:['The 2017 encoder–decoder architecture','Inside one block: attention, FFN, residuals, norms','The residual stream view','Encoder-only, decoder-only, encoder–decoder'],
cheat:['Block: x = x + Attn(Norm(x)); x = x + FFN(Norm(x)) (pre-norm).','Attention moves information between tokens; the FFN processes each token on its own.','The FFN (≈ 4× wider) holds about two-thirds of the parameters.','Encoder-only = BERT (understanding); decoder-only = GPT/Claude/Llama (generation); enc–dec = T5 (translation).'],
met:[['layers','Layers','layers'],['dmodel','d_model','hash'],['params','Parameters','cpu']],
hero:1,
draw(si,g){
  const s=[];
  if(si===0){s.push(g.T(60,40,'"Attention Is All You Need" (Vaswani et al., 2017)',{cls:'h'}));
    const col=(x,t,c,dec)=>{s.push(g.R(x-95,90,190,dec?290:220,{fill:'var(--soft)',stroke:'var(--edge)',sw:1.4,rx:12}),g.T(x,110,t,{a:'middle',cls:'b'}));let y=150;
      (dec?['masked self-attn','cross-attn','feed-forward']:['self-attention','feed-forward']).forEach((l,i)=>{s.push(g.box(x,y,160,40,l,i===1&&dec?'purple':l.includes('feed')?'blue':'orange',{fs:11}),g.T(x+86,y+4,'+ norm',{cls:'m',size:9}));y+=70});
      s.push(g.T(x-104,100,'×N',{a:'end',cls:'h'}))};
    col(250,'Encoder','orange',0);col(600,'Decoder','green',1);s.push(g.A(345,200,515,220,{c:'purple',l:'keys & values',lt:'purple'}),g.box(250,420,170,36,'source: "I love cats"','gray',{fs:10.5}),g.A(250,400,250,312),g.box(600,440,170,36,'target so far: "j’ aime"','gray',{fs:10.5}),g.A(600,420,600,382),g.A(600,90,600,50),g.T(615,60,'next word',{cls:'b'}))}
  else if(si===1||si===2){const X=230;s.push(g.R(X-110,70,220,330,{fill:'var(--soft)',stroke:'var(--edge)',sw:1.4,rx:12}),g.T(X-108,60,'one block (pre-norm)',{cls:'b m'}));
    s.push(g.A(X,450,X,40,{c:'yellow',w:5}),g.T(X-16,470,'x (one vector per token)',{a:'middle',cls:'b'}));
    [[340,'LayerNorm','gray'],[290,'Multi-head attention','orange'],[190,'LayerNorm','gray'],[140,'Feed-forward (MLP)','blue']].forEach(([y,l,c])=>s.push(g.box(X+60,y,150,34,l,c,{fs:10.5})));
    [[380,290,240],[230,140,90]].forEach(([y0,y1,y2])=>s.push(`<path d="M${X},${y0} H${X+60} V${y0-20}" style="fill:none;stroke:var(--edge);stroke-width:1.5"/>`,g.A(X+60,y1-17,X+60,y2+12,{head:false}),`<path d="M${X+60},${y2+12} V${y2} H${X+12}" style="fill:none;stroke:var(--edge);stroke-width:1.5"/>`,`<circle cx="${X}" cy="${y2}" r="11" style="fill:var(--green-bg);stroke:var(--edge);stroke-width:1.5"/>`,g.T(X,y2+4.5,'+',{a:'middle',cls:'h'})));
    if(si===1)s.push(g.panel(470,70,'Two sub-layers',['1. attention: tokens exchange','   information (mixing ACROSS)','2. feed-forward: each token','   thinks on its own (WITHIN)','','each wrapped in:','  norm → sublayer → add back'],'orange'));
    else s.push(g.panel(470,70,'The residual stream',['the yellow line is a running','sum: every sub-layer READS','the stream and ADDS a small','update to it','','nothing is overwritten;','gradients flow straight down'],'yellow'))}
  else if(si===3){s.push(g.T(60,50,'The feed-forward network (per token)',{cls:'h'}));const N=g.net(110,90,560,300,[4,10,4],{c:'blue',sp:28,r:9,titles:['d_model','4 × d_model  (GELU / SwiGLU)','d_model']});s.push(N.svg);
    s.push(g.panel(700,90,'Where knowledge lives',['FFN = 2 matrices','d × 4d and 4d × d','≈ 2/3 of all params','','acts like key → value','memories ("Eiffel','Tower" → "Paris")'],'blue'))}
  else if(si===4){s.push(g.T(60,50,'Stack N blocks',{cls:'h'}));for(let i=0;i<7;i++){const y=380-i*42;s.push(g.box(200,y,220,32,i===3?'⋮':`block ${i===6?'N':i+1}`,i===3?'gray':'purple',{flat:i===3,fs:11}))}
    s.push(g.A(200,430,200,402,{c:'gray'}),g.T(200,448,'embeddings + positions',{a:'middle',cls:'m'}),g.A(200,124,200,96,{c:'gray'}),g.T(200,86,'final norm → output head',{a:'middle',cls:'m'}));
    const rows=[['GPT-2 small','12','768','124 M'],['GPT-2 XL','48','1,600','1.5 B'],['GPT-3','96','12,288','175 B'],['Llama 3 8B','32','4,096','8 B'],['Llama 3 70B','80','8,192','70 B']];
    s.push(g.T(400,110,'model          layers  d_model  params',{cls:'b'}));rows.forEach((r,i)=>s.push(g.T(400,140+i*26,`${r[0].padEnd(15)}${r[1].padStart(6)}  ${r[2].padStart(7)}  ${r[3].padStart(7)}`,{cls:'m'})));
    s.push(g.T(400,300,'params ≈ 12 × layers × d_model²  (+ embeddings)',{cls:'b'}))}
  else{s.push(g.T(60,50,'Three families',{cls:'h'}));[['Encoder-only','BERT, RoBERTa','sees the whole text both ways','classification, search embeddings','orange'],['Decoder-only','GPT, Claude, Llama, Gemini','causal mask, predicts next token','chat, code, general generation','red'],['Encoder–decoder','T5, original transformer','encode input, decode output','translation, summarisation','purple']].forEach(([n,m,a,b,c],i)=>{const x=150+i*280;s.push(g.box(x,140,230,60,n,c,{sub:m,hot:i===1}),g.T(x,210,a,{a:'middle',cls:'m'}),g.T(x,230,b,{a:'middle',cls:'m'}))});
    s.push(g.T(60,330,'Today’s chat LLMs are almost all decoder-only: simplest to scale, one objective (next token).',{cls:'b'}))}
  return s.join('');
},
anim(si,t,g){if(si!==2)return '';const X=230,p=(t%3)/3,y=450-p*410;let s=g.C(X,y,7,'yellow',{cls:'big'});
  if(y<340&&y>290)s+=g.dot(X,380,X+60,357,(340-y)/50,'orange',{r:4});if(y<190&&y>140)s+=g.dot(X,230,X+60,207,(190-y)/50,'blue',{r:4});return s},
steps:[
 {k:'setup',t:'The original transformer',short:'2017',m:{layers:'6 + 6',dmodel:'512',params:'65 M'},
  b:'In 2017 a Google team replaced recurrence entirely with attention. Their translation model had an <b>encoder</b> stack that reads the source sentence and a <b>decoder</b> stack that writes the translation, attending to the encoder through <b>cross-attention</b>.\n\nTraining parallelised across the whole sequence, which made it far faster than RNNs. Every modern LLM descends from this design.'},
 {k:'technique',t:'Inside one block',short:'Block',m:{layers:'1'},
  b:'A block has two sub-layers. <b>Multi-head attention</b> lets tokens exchange information. The <b>feed-forward network</b> then processes each token’s vector independently.\n\nEach sub-layer is wrapped as <code>x = x + SubLayer(Norm(x))</code>: normalise, transform, and add the result back (a residual connection, as in ResNet).'},
 {k:'insight',t:'The residual stream',short:'Residual stream',
  n:['A token’s vector enters the stream','Attention reads it, writes an update','The FFN reads it, writes an update','The sum flows on to the next block'],
  b:'A useful mental model: each token has a vector that flows straight up through the network, the <b>residual stream</b>. Every sub-layer reads from it and <b>adds</b> its contribution.\n\nThat makes very deep stacks trainable (gradients flow down the same highway) and is the frame interpretability researchers use to trace what each layer contributes.'},
 {k:'technique',t:'The feed-forward network',short:'FFN',m:{params:'≈ ⅔ in FFNs'},
  b:'The FFN is a two-layer MLP applied to every token separately: widen to about 4× d_model, apply GELU or SwiGLU, then project back.\n\nIt holds most of the parameters. Research suggests FFNs act like large key–value memories that store factual associations, while attention routes information between positions.'},
 {k:'insight',t:'Stack it',short:'Depth',m:{layers:'12 – 96+',dmodel:'768 – 12,288',params:'124 M – 175 B+'},
  b:'An LLM is this block repeated N times with identical structure but separate weights. Parameter count grows roughly with layers × d_model², so width matters a lot.\n\nAt the top, a final normalisation and an output layer turn the last vector of each position into scores over the vocabulary (next lesson).'},
 {k:'recap',t:'Encoder, decoder, both',short:'Families',
  b:'Keep only the encoder (bidirectional attention) and you get <b>BERT</b>-style models, great for classification and search embeddings. Keep only the decoder (causal attention) and you get <b>GPT</b>-style generators. Keep both for sequence-to-sequence tasks like translation (<b>T5</b>).\n\nChat assistants, including GPT-4, Claude, Llama and Gemini, are decoder-only.'}
]});

/* ======================================================= GPT decoder end-to-end */
const NEXT=[[' Paris',4.2],[' a',2.1],[' the',1.9],[' located',1.5],[' known',1.2],[' Lyon',.6]];
ML.add({id:'gpt-decoder',title:'How a GPT Generates Text',min:12,lvl:'Intermediate',
sub:'End to end: tokens in, a probability for every possible next token out, one token at a time.',
keys:'gpt decoder-only autoregressive next token prediction logits unembedding lm head teacher forcing in-context learning prefill decode',
learn:['The full forward pass, start to finish','Logits and the probability of every next token','The autoregressive generation loop','How it is trained, and prefill vs decode'],
cheat:['tokens → embed (+pos) → N blocks → norm → unembed → logits → softmax.','Only the LAST position’s output is used to pick the next token at inference.','Generate: sample a token, append it, run again (autoregressive).','Training: predict every position’s next token in parallel with the causal mask (cross-entropy).'],
met:[['pos','Tokens so far','list'],['top','Top prediction','target'],['phase','Phase','play']],
hero:2,
setup(){this.p=U.softmax(NEXT.map(x=>x[1]));this.gen=['The',' capital',' of',' France',' is',' Paris','.',' It',' is',' famous',' for'];this.steps[1].m={top:`" Paris" ${(this.p[0]*100).toFixed(0)}%`};},
draw(si,g){
  const s=[];
  if(si===0){const st=[['"The capital of France is"','gray',''],['tokens','blue','[464, 3139, 286, 4881, 318]'],['embed + position','purple','5 × d_model'],['N transformer blocks','orange','attention + FFN'],['final norm + unembed','green','d_model → vocab'],['logits → softmax','red','P(next token)']];
    st.forEach(([l,c,sub],i)=>{const y=60+i*68;s.push(g.box(300,y,280,46,l,c,{sub,fs:12}));if(i<5)s.push(g.A(300,y+24,300,y+44))});
    s.push(g.panel(510,60,'One forward pass',['every position gets an output','vector, but at inference only','the LAST one is used to choose','what comes next','','unembedding = a big linear','layer: d_model → ~100k scores'],'blue'))}
  else if(si===1){const c=g.chips(60,60,['The',' capital',' of',' France',' is'].map(t=>({t,c:'blue'})));s.push(c.svg,g.A(c.pos[4].cx,90,c.pos[4].cx,130,{c:'orange'}),g.T(c.pos[4].cx+10,120,'last position →',{cls:'b'}));
    s.push(g.T(60,160,'probability of each next token (top 6 of ~100,000)',{cls:'b'}),g.hbars(60,175,620,NEXT.map((x,i)=>["'"+x[0]+"'",this.p[i]]),{c:NEXT.map((_,i)=>i?'gray':'green'),lw:110,max:this.p[0],fmt:v=>(v*100).toFixed(1)+'%',rh:30}),g.T(60,375,'(illustrative numbers)',{cls:'m'}))}
  else if(si===2){s.push(g.T(60,50,'The autoregressive loop',{cls:'h'}),g.panel(560,90,'Repeat until done',['1. run the model on all tokens','2. take P(next) at the end','3. pick one token (sampling)','4. append it to the input','5. stop at <end> or max length'],'green'))}
  else if(si===3){s.push(g.T(60,50,'Training: every position is a lesson',{cls:'h'}));const inp=['The',' cat',' sat',' on',' the'],tgt=[' cat',' sat',' on',' the',' mat'];
    const a=g.chips(80,110,inp.map(t=>({t,c:'blue'})),{gap:30,minw:60}),b=g.chips(80,280,tgt.map(t=>({t,c:'green'})),{gap:30,minw:60});s.push(g.T(80,100,'input',{cls:'m'}),a.svg,g.T(80,270,'target = input shifted left by one',{cls:'m'}),b.svg);
    a.pos.forEach((p,i)=>{s.push(g.A(p.cx,140,b.pos[i].cx,274,{c:'gray'}),g.pill(p.cx,205,'−log p',['red','orange','yellow','green','blue'][i]))});
    s.push(g.T(80,350,'loss = average cross-entropy over all positions · the causal mask stops position t from peeking at t+1',{cls:'m'}),g.T(80,370,'"teacher forcing": the model always sees the TRUE previous tokens during training',{cls:'m'}))}
  else if(si===4){s.push(g.T(60,50,'In-context learning: learning from the prompt',{cls:'h'}));
    s.push(g.box(330,170,540,150,'','gray',{flat:1}),g.TL(80,125,['Translate English to French:','sea otter  => loutre de mer','cheese     => fromage','peppermint => menthe poivrée','plush giraffe =>'],{cls:'b',lh:22}),g.T(400,233,'girafe en peluche',{cls:'b',c:'green'}));
    s.push(g.panel(60,280,'No weights change',['the examples sit in the context; attention (e.g. induction heads)','picks up the pattern and continues it. GPT-3 (2020) showed this','"few-shot" ability grows with model scale.'],'purple',{w:560}))}
  else{s.push(g.T(60,50,'Two phases of inference',{cls:'h'}));s.push(g.R(60,100,330,60,{fill:'var(--blue-bg)',stroke:'var(--edge)',rx:8}),g.T(225,135,'PREFILL: whole prompt at once',{a:'middle',cls:'b'}));
    for(let i=0;i<8;i++)s.push(g.R(410+i*52,100,44,60,{fill:'var(--orange-bg)',stroke:'var(--edge)',rx:8}),g.T(432+i*52,135,'t'+(i+1),{a:'middle',cls:'b'}));s.push(g.T(410,90,'DECODE: one token per step',{cls:'b'}));
    s.push(g.panel(60,200,'Prefill',['parallel over all prompt tokens','compute-bound · sets "time to first token"','fills the KV cache'],'blue'),g.panel(450,200,'Decode',['one token per forward pass','memory-bandwidth bound','sets "tokens per second"'],'orange'))}
  return s.join('');
},
anim(si,t,g){if(si!==2)return '';const n=this.gen.length,k=5+Math.floor((t/1.1)%(n-4));const c=g.chips(60,110,this.gen.slice(0,k).map((x,i)=>({t:x,c:i>=5?'green':'blue',hot:i===k-1&&k>5})),{gap:5});
  const last=c.pos[c.pos.length-1];return c.svg+g.A(last.cx,140,last.cx,210,{c:'orange'})+g.box(last.cx,240,120,44,'model','orange',{fs:12})+g.A(last.cx+60,240,last.cx+110,240,{c:'green',curve:-30})+g.T(60,330,k<n?`step ${k-4}: next token = "${(this.gen[k]||'').replace(' ','·')}"`:'',{cls:'b'})},
steps:[
 {k:'setup',t:'The full forward pass',short:'Pipeline',m:{pos:'5',phase:'forward'},
  b:'Putting the pieces together: the prompt is tokenised, each token is embedded (with its position), the vectors flow through N transformer blocks, then a final normalisation and an <b>unembedding</b> layer turn each output vector into one score (<b>logit</b>) per vocabulary token.\n\nOften the unembedding matrix is just the embedding matrix transposed (weight tying).'},
 {k:'solution',t:'A probability for every token',short:'Logits',m:{pos:'5'},
  b:'Softmax turns the logits at the last position into a probability distribution over the entire vocabulary. For “The capital of France is”, “ Paris” gets most of the mass, but “ a”, “ the” and others are possible continuations too.\n\nThe model does not output an answer; it outputs a distribution. Choosing from it is <b>sampling</b> (next lesson).'},
 {k:'solution',t:'One token at a time',short:'Generate',m:{phase:'decode loop'},
  b:'Pick a token, append it to the input, and run the model again. Each new token is conditioned on everything before it, including what the model itself just wrote. This is <b>autoregressive</b> generation.\n\nThat is why answers stream in word by word, and why a model cannot “go back” and edit earlier tokens.'},
 {k:'technique',t:'How it is trained',short:'Training',m:{pos:'all at once',phase:'training'},
  b:'Training uses the same network. Feed in a text, and at <b>every</b> position ask it to predict the next token. The target is the input shifted by one. The loss is cross-entropy averaged over all positions.\n\nThanks to the causal mask, a 4,000-token document gives 4,000 training examples in one parallel forward pass.'},
 {k:'insight',t:'In-context learning',short:'Few-shot',
  b:'A surprising consequence of scale: give a large model a few examples in the prompt and it continues the pattern, with no weight updates. GPT-3’s paper was titled <i>Language Models are Few-Shot Learners</i>.\n\nPrompting is programming the model through its context.'},
 {k:'insight',t:'Prefill and decode',short:'Prefill / decode',m:{phase:'prefill → decode'},
  b:'Serving has two phases. <b>Prefill</b> processes the whole prompt in parallel and determines time-to-first-token. <b>Decode</b> then generates one token per pass; it is limited by memory bandwidth (reading all weights and the KV cache each step) and determines tokens per second.'}
]});

/* ======================================================= sampling */
const LG=[['mat',3.1],['floor',2.5],['sofa',2.2],['bed',1.8],['roof',1.1],['moon',.2],['lava',-.4]];
ML.add({id:'sampling',title:'Temperature, Top-k & Top-p',min:9,lvl:'Beginner',
sub:'How a chatbot turns probabilities into words, and what the creativity dials really do.',
keys:'sampling decoding greedy temperature top-k top-p nucleus min-p beam search repetition penalty',
learn:['Greedy decoding and why it gets boring','Temperature reshapes the distribution','Top-k and top-p (nucleus) cut the tail','Other decoding knobs'],
cheat:['Greedy = always take the most likely token. Deterministic, but repetitive.','Temperature T: softmax(logits / T). T < 1 sharper, T > 1 flatter, T → 0 = greedy.','Top-k keeps the k best; top-p keeps the smallest set with cumulative probability ≥ p.','Typical chat: T ≈ 0.7–1.0, top-p ≈ 0.9–0.95. For code/maths use lower T.'],
met:[['T','Temperature','bolt'],['kept','Tokens kept','filter'],['pick','Sample','dice']],
hero:1,
draw(si,g){
  const s=[];const lab=LG.map(x=>x[0]),L=LG.map(x=>x[1]);
  const ctx=()=>{const c=g.chips(60,40,['The',' cat',' sat',' on',' the'].map(t=>({t,c:'blue'})));s.push(c.svg,g.T(c.w+80,57,'→ ?',{cls:'h'}))};
  if(si===0){ctx();const p=U.softmax(L);s.push(g.bars(80,110,560,250,p,{labels:lab,c:p.map((_,i)=>i?'gray':'green'),hi:0,fmt:v=>(v*100).toFixed(0)+'%',max:.6}));
    s.push(g.panel(660,110,'Greedy',['always pick #1: "mat"','same input → same output','','long texts loop:','"I think that I think','that I think…"'],'red'))}
  else if(si===1){ctx();s.push(g.panel(660,110,'softmax(z / T)',['T = 0.3 → near-greedy','T = 1.0 → model’s own','         distribution','T = 1.8 → flat, random,','         eventually nonsense'],'orange'))}
  else if(si===2||si===3){ctx();const p=U.softmax(L);let keep;if(si===2)keep=new Set([0,1,2]);else{let c=0;keep=new Set();p.forEach((v,i)=>{if(c<.9){keep.add(i);c+=v}})}
    const cum=[];let c=0;p.forEach(v=>{c+=v;cum.push(c)});
    s.push(g.bars(80,110,560,250,p,{labels:lab.map((l,i)=>si===3?`${l} (${(cum[i]*100).toFixed(0)}%)`:l),c:p.map((_,i)=>keep.has(i)?'green':'gray'),hi:keep,dim:1,fmt:v=>(v*100).toFixed(0)+'%',max:.6,rot:si===3?-20:0}));
    const kept=[...keep];const x=80+(560/7)*kept.length-4;s.push(`<line x1="${x}" y1="100" x2="${x}" y2="370" style="stroke:var(--red);stroke-width:2.5;stroke-dasharray:6 4"/>`);
    s.push(g.panel(660,110,si===2?'Top-k (k = 3)':'Top-p (p = 0.9)',si===2?['keep only the 3 best','renormalise, then sample','','fixed k is clumsy: some','steps have 1 good option,','others have 50']:['keep the smallest set whose','probabilities sum to ≥ 90%','','confident step → few kept','uncertain step → many kept','(the "nucleus")'],'green'))}
  else{s.push(g.T(60,50,'More decoding knobs',{cls:'h'}));[['Min-p','keep tokens with p ≥ min_p × p(top); adapts to confidence','blue'],['Repetition / frequency penalty','lower logits of tokens already used','orange'],['Beam search','track the k best whole sequences; good for translation, dull for chat','purple'],['Stop sequences & max tokens','where generation ends','gray'],['Seed','fix the random draws for repeatability','yellow']].forEach(([n,d,c],i)=>s.push(g.box(200,105+i*66,260,46,n,c,{fs:11}),g.T(350,109+i*66,d,{cls:'m'})));
    s.push(g.T(60,450,'Note: even at T = 0, outputs can vary slightly across runs (batching, floating-point order on GPUs).',{cls:'m'}))}
  return s.join('');
},
anim(si,t,g){if(si===1){const T=[.3,1,1.8][Math.floor(t/2.6)%3];const p=U.softmax(LG.map(x=>x[1]/T));return g.bars(80,110,560,250,p,{labels:LG.map(x=>x[0]),c:'orange',fmt:v=>(v*100).toFixed(0)+'%',max:1})+g.pill(360,96,`T = ${T}`,'orange')}
  if(si>=2&&si<=3){const r=U.rng(7+Math.floor(t*1.5));const p=U.softmax(LG.map(x=>x[1]));let keep=si===2?[0,1,2]:[];if(si===3){let c=0;p.forEach((v,i)=>{if(c<.9){keep.push(i);c+=v}})}const tot=keep.reduce((a,i)=>a+p[i],0);let u=r()*tot,pick=keep[0];for(const i of keep){u-=p[i];if(u<=0){pick=i;break}}return g.pill(380,420,`sampled: "${LG[pick][0]}"`,'green')}return ''},
steps:[
 {k:'problem',t:'Greedy decoding',short:'Greedy',m:{T:'0',kept:'1',pick:'mat'},
  b:'The model gives a probability for every possible next token. The simplest choice is <b>greedy</b>: always take the top one.\n\nIt is deterministic and fine for short factual answers, but long outputs become bland and can fall into repetitive loops. Usually we <b>sample</b> instead: draw a token at random according to the probabilities.'},
 {k:'technique',t:'Temperature',short:'Temperature',m:{T:'0.3 → 1.8',kept:'all'},
  b:'Before the softmax, divide the logits by a <b>temperature</b> T. Low T exaggerates differences (the top token dominates); high T flattens them (unlikely tokens get a real chance).\n\nT is the main “creativity” dial: lower for code and facts, higher for brainstorming.'},
 {k:'technique',t:'Top-k',short:'Top-k',m:{T:'1',kept:'3'},
  b:'Even at T = 1, the long tail of thousands of unlikely tokens adds up, and occasionally sampling one derails the text (“lava”). <b>Top-k</b> keeps only the k most likely tokens, renormalises, and samples from those.'},
 {k:'solution',t:'Top-p (nucleus sampling)',short:'Top-p',m:{kept:'adaptive'},
  b:'<b>Top-p</b> keeps the smallest set of tokens whose probabilities add up to p (say 0.9). When the model is confident the set is tiny; when many continuations are reasonable it grows.\n\nIt adapts to each step, so it is the common default alongside temperature.'},
 {k:'recap',t:'Other knobs',short:'Others',m:{T:'—',kept:'—',pick:'—'},
  b:'Min-p, repetition penalties, beam search, stop sequences and seeds round out the toolkit. None of them change what the model knows. They only change how a token is chosen from the same distribution.'}
]});

/* ======================================================= context window */
ML.add({id:'context-window',title:'Context Windows & the KV Cache',min:13,lvl:'Intermediate',
sub:'The model’s working memory: what fits in it, why long context is expensive, and the tricks that make it work.',
keys:'context window context length tokens kv cache memory quadratic flashattention sliding window lost in the middle long context',
learn:['What the context window is and what shares it','What happens when it overflows','Why cost grows with length: n² attention and the KV cache','Long-context tricks, and “lost in the middle”'],
cheat:['Context window = max tokens (prompt + history + documents + output) the model can attend to at once.','Beyond it, text must be truncated, summarised or retrieved (RAG).','KV cache bytes ≈ 2 × layers × kv_heads × head_dim × tokens × bytes/value.','Long-context tools: GQA, FlashAttention, sliding windows, RoPE scaling. Models still use the middle of long inputs less reliably.'],
met:[['used','Tokens used','list'],['limit','Window','layers'],['mem','KV cache','db']],
hero:3,
draw(si,g){
  const s=[];
  if(si===0||si===1){const W=720,X=70,Y=150;const parts=si===0?[['system',.06,'gray'],['chat history',.28,'blue'],['pasted document',.34,'purple'],['your question',.04,'orange'],['answer (room left)',.18,'green']]:[['system',.06,'gray'],['history (oldest dropped)',.3,'blue'],['document',.5,'purple'],['question',.04,'orange'],['answer',.1,'green']];
    s.push(g.T(60,60,'Everything shares one budget',{cls:'h'}),g.R(X,Y,W,70,{fill:'var(--bg)',stroke:'var(--edge)',sw:2,rx:8}));let x=X;parts.forEach(([l,w,c])=>{s.push(g.R(x+2,Y+2,w*W-4,66,{fill:`color-mix(in srgb,var(--${c}) 35%,var(--mixbase))`,rx:6}),g.T(x+w*W/2,Y+40,w>.05?l:'',{a:'middle',cls:'b',size:w<.1?9:11}));x+=w*W});
    s.push(g.T(X,Y+90,'0',{cls:'m'}),g.T(X+W,Y+90,'window limit (e.g. 128,000 tokens)',{a:'end',cls:'m'}));
    if(si===1){s.push(g.R(X-90,Y+2,92,66,{fill:'var(--red)',op:.2,stroke:'var(--red)',dash:'5 4',rx:6}),g.T(X-44,Y+40,'dropped',{a:'middle',cls:'b',c:'red'}));
      s.push(g.panel(70,290,'When it overflows',['the model literally cannot see what is outside the window','apps truncate old turns, summarise them, or retrieve only','the relevant pieces (RAG, lesson 9.4)'],'red',{w:540}))}
    else s.push(g.panel(70,290,'One window, many tenants',['instructions, conversation, documents, tool results and','the reply being written all count against the same limit'],'blue',{w:540}))}
  else if(si===2){[[4,'1k'],[8,'2k'],[16,'4k']].forEach(([n,l],i)=>{const cs=[22,12,6.2][i],x=70+i*250;s.push(g.T(x,60,`${l} tokens → ${n*n}× the cells`,{cls:'b'}));for(let a=0;a<n;a++)for(let b=0;b<=a;b++)s.push(g.R(x+b*cs,80+a*cs,cs-1,cs-1,{fill:'var(--orange)',op:.55,rx:1}))});
    s.push(g.panel(70,300,'Attention cost grows as n²',['double the context → 4× the attention compute (per layer, per head)','FlashAttention (2022): same maths, computed in tiles that fit in fast on-chip','memory, so the n × n matrix is never stored → much faster and leaner'],'orange',{w:600}))}
  else if(si===3){s.push(g.T(60,50,'The KV cache',{cls:'h'}),g.panel(560,80,'Why cache?',['past tokens’ keys & values','never change','store them once; each new','token computes only its','own q, k, v and attends','to the cache'],'blue'))}
  else if(si===4){s.push(g.T(60,50,'KV cache size, worked example',{cls:'h'}));
    s.push(g.panel(60,80,'Llama 2 7B (no GQA), fp16',['2 (K and V) × 32 layers × 32 heads × 128 dims × 2 bytes','= 524,288 bytes ≈ 0.5 MB per token','','4,096-token context → 2 GB for ONE sequence','(the weights themselves are ~13.5 GB)'],'red',{w:540}));
    const P=g.plot({x:80,y:270,w:500,h:150,xr:[0,128],yr:[0,64],xl:'context length (k tokens)',yl:'GB',ticks:1,nx:4,ny:2,grid:false});s.push(P.svg,P.fn(x=>x*.5,'red'),P.fn(x=>x*.125,'green'),g.T(P.sx(70),P.sy(42),'MHA, 32 KV heads',{c:'red',cls:'b'}),g.T(P.sx(80),P.sy(5)+16,'GQA, 8 KV heads',{c:'green',cls:'b'}))}
  else if(si===5){s.push(g.T(60,50,'Context lengths have exploded',{cls:'h'}),g.hbars(60,90,700,[['GPT-2 (2019)',1],['GPT-3 (2020)',2],['GPT-4 (2023)',32],['GPT-4 Turbo (2023)',128],['Claude 2.1 (2023)',200],['Gemini 1.5 (2024)',1000]],{c:['gray','gray','blue','blue','orange','green'],lw:170,fmt:v=>v>=1000?'1M+':v+'k',rh:34}));
    s.push(g.panel(60,320,'Enabled by',['RoPE scaling · GQA · FlashAttention · sliding-window / sparse attention','· ring attention across many GPUs · lots of long-document training data'],'purple',{w:640}))}
  else{const P=g.plot({x:70,y:50,w:450,h:320,xr:[0,100],yr:[40,80],xl:'position of the key fact in the context (%)',yl:'accuracy (%)',ticks:1,nx:4,ny:4});
    s.push(P.svg,P.fn(x=>75-28*Math.sin(Math.PI*x/100)**1.4,'red',{n:200}),g.T(P.sx(50),P.sy(50),'the middle sags',{a:'middle',cls:'b',c:'red'}));
    s.push(g.panel(560,60,'Lost in the middle (2023)',['models used facts at the','START or END of a long','context better than facts','buried in the middle','(shape illustrative)','','tip: put key instructions','and questions at the end'],'red'))}
  return s.join('');
},
anim(si,t,g){if(si!==3)return '';const n=8,k=Math.floor((t/1.1)%n)+1;let s='';for(let i=0;i<n;i++){const x=80+i*56;const on=i<k;s+=g.box(x,140,46,30,'t'+(i+1),i===k-1?'orange':on?'blue':'gray',{fs:10,dim:!on,flat:1});if(on&&i<k-1)s+=g.box(x,210,46,26,'K','blue',{fs:10,flat:1})+g.box(x,244,46,26,'V','green',{fs:10,flat:1})}
  const x=80+(k-1)*56;s+=g.box(x,210,46,26,'K','orange',{fs:10,hot:1})+g.box(x,244,46,26,'V','orange',{fs:10,hot:1})+g.T(80,300,`step ${k}: new token computes q,k,v once; reads ${k-1} cached K/V pairs`,{cls:'b'})+g.T(80,320,'without the cache, every step would recompute all previous tokens',{cls:'m'});
  for(let i=0;i<k-1;i++)s+=g.A(x,180,80+i*56,196,{c:'orange',curve:-8,op:.35,head:false});return s},
steps:[
 {k:'setup',t:'The model’s working memory',short:'Window',m:{used:'≈ 110k',limit:'128k'},
  b:'An LLM has no memory between calls. Everything it can use must be inside its <b>context window</b>: the maximum number of tokens it can attend to at once.\n\nSystem instructions, the conversation so far, pasted documents, tool results and the answer being generated all share that one budget.'},
 {k:'problem',t:'Overflow',short:'Overflow',m:{used:'> limit'},
  b:'If the total exceeds the window, something has to go. Chat apps typically drop or summarise the oldest turns, which is why a long conversation can “forget” early details.\n\nFor large knowledge bases, the answer is to retrieve only the relevant chunks (RAG).'},
 {k:'tradeoff',t:'Why long is expensive: n²',short:'n² cost',
  b:'Attention compares every token with every earlier token, so its cost grows with the <b>square</b> of the length. 4× the context means 16× the attention work.\n\n<b>FlashAttention</b> reorganises the computation so the giant n × n matrix never has to be written to slow GPU memory. It is the same maths, far faster, and is now standard.'},
 {k:'technique',t:'The KV cache',short:'KV cache',
  n:['New token arrives','Compute its q, k, v','Append k, v to the cache','Attend over all cached keys/values'],
  b:'When generating, earlier tokens’ keys and values never change, so they are computed once and stored: the <b>KV cache</b>. Each new token only computes its own q, k, v and attends over the cache.\n\nThis turns generation from quadratic recomputation into one cheap step per token, but the cache grows with every token and must live in GPU memory.'},
 {k:'math',t:'How big is the cache?',short:'Cache size',m:{mem:'≈ 0.5 MB / token',limit:'4k',used:'4k'},
  b:'Per token, the cache stores a key and a value for every layer and KV head. For Llama 2 7B that is about half a megabyte per token, around 2 GB for a 4k context, per conversation.\n\nThat is why <b>grouped-query attention</b>, cache quantisation and paged memory (vLLM’s PagedAttention) matter so much for serving long contexts to many users.'},
 {k:'insight',t:'From 1k to 1M tokens',short:'Growth',m:{limit:'1k → 1M+',used:'—',mem:'—'},
  b:'Context windows grew from about 1,000 tokens (GPT-2) to hundreds of thousands and even millions, thanks to RoPE scaling, GQA, FlashAttention, sparse and sliding-window attention, and training on long documents.\n\nCheck each model’s documentation for its current limit; these numbers keep changing.'},
 {k:'tradeoff',t:'Lost in the middle',short:'Middle',
  b:'Fitting text in the window is not the same as using it well. Studies found that models retrieve facts best when they appear near the <b>beginning or end</b> of a long context, and worse in the middle.\n\nPractical advice: keep prompts focused, put the question and key instructions at the end, and prefer retrieving relevant passages over pasting everything.'}
]});

/* ======================================================= scaling laws */
ML.add({id:'scaling-laws',title:'Scaling Laws',min:10,lvl:'Intermediate',
sub:'Loss falls as a smooth power law in parameters, data and compute. That predictability is why labs bet billions.',
keys:'scaling laws kaplan chinchilla compute optimal flops parameters tokens power law emergent abilities test-time compute',
learn:['Loss vs compute: a straight line on log–log axes','The three knobs: parameters, data, compute (C ≈ 6ND)','Chinchilla: ~20 tokens per parameter','Over-training small models, and test-time compute'],
cheat:['L(C) ≈ a·C^(−α): every 10× compute gives a predictable loss drop.','Training FLOPs ≈ 6 × parameters × tokens.','Chinchilla (2022): for fixed compute, scale params and tokens together (~20 tokens/param).','Inference cost favours smaller models trained on far more tokens; reasoning models also scale compute at answer time.'],
met:[['N','Parameters','cpu'],['D','Tokens','db'],['C','Compute','bolt']],
hero:0,
draw(si,g){
  const s=[];
  if(si===0){const P=g.plot({x:80,y:40,w:480,h:360,xr:[0,8],yr:[0,4],xl:'compute (log scale, 10× per tick)',yl:'test loss (log scale)',ticks:0,nx:8,ny:4});this.P=P;s.push(P.svg);
    const F=x=>3.6-.325*x,k=.16;[1.2,2.6,4,5.4,6.8].forEach(xi=>{const xf=xi+.325/(2*k);s.push(P.fn(x=>x<xf?F(x)+k*(x-xi)**2:F(xf)+k*(xf-xi)**2,'gray',{from:Math.max(0,xi-2.2),to:Math.min(8,xi+3),cls:'thin',op:.7}))});
    s.push(P.line([[0,3.6],[8,1.0]],'red',{w:3}),g.T(P.sx(5.4),P.sy(1.95),'frontier: L ∝ C^(−0.05)',{c:'red',cls:'b'}));
    s.push(g.panel(590,60,'Kaplan et al. (2020)',['each grey curve: one model','size trained longer','','the best loss at each','compute budget falls on','a straight line (log–log)','','→ predictable returns'],'red'))}
  else if(si===1){s.push(g.T(60,50,'Three knobs',{cls:'h'}));[['N','parameters','model size','blue'],['D','tokens','training data','green'],['C','FLOPs','compute','orange']].forEach(([a,b,c,col],i)=>s.push(g.box(150+i*250,150,180,90,a,col,{sub:b+' · '+c,fs:24})));
    s.push(g.box(430,300,420,56,'C ≈ 6 · N · D','gray',{fs:18}),g.T(430,350,'(2 FLOPs per param per token forward, ~4 backward)',{a:'middle',cls:'m'}));
    s.push(g.T(60,420,'GPT-3: 6 × 175 B × 300 B tokens ≈ 3.1 × 10²³ FLOPs',{cls:'b'}))}
  else if(si===2){s.push(g.T(60,50,'Chinchilla: data matters as much as size',{cls:'h'}));
    s.push(g.hbars(60,100,560,[['Gopher: 280B params',280],['Chinchilla: 70B params',70]],{c:['red','green'],lw:200,fmt:v=>v+' B params',rh:34}),g.hbars(60,190,560,[['Gopher tokens',300],['Chinchilla tokens',1400]],{c:['red','green'],lw:200,fmt:v=>v.toLocaleString()+' B tokens',rh:34}));
    s.push(g.panel(60,290,'Same compute, better model',['Chinchilla (4× smaller, 4.7× more data) beat Gopher on most benchmarks','rule of thumb: compute-optimal ≈ 20 training tokens per parameter','many earlier models were under-trained'],'green',{w:620}))}
  else if(si===3){s.push(g.T(60,50,'Beyond compute-optimal',{cls:'h'}));s.push(g.hbars(60,100,640,[['Chinchilla-optimal 8B',160],['Llama 3 8B (2024)',15000]],{c:['gray','purple'],lw:200,fmt:v=>v>=1000?(v/1000)+' T tokens':v+' B tokens',rh:36}));
    s.push(g.panel(60,210,'Why "over-train"?',['training is paid once; inference is paid for every user, forever','a smaller model trained on ~100× more tokens is cheaper to serve','and still keeps improving'],'purple',{w:600}),g.panel(60,330,'The data wall',['high-quality public text is finite → synthetic data, multimodal data,','better filtering, and RL on verifiable tasks'],'yellow',{w:600}))}
  else{const P=g.plot({x:80,y:50,w:440,h:320,xr:[0,6],yr:[0,100],xl:'thinking tokens at answer time (log scale)',yl:'accuracy on hard maths (%)',ticks:0,nx:6,ny:4});s.push(P.svg,P.fn(x=>15+70/(1+Math.exp(-1.3*(x-3))),'blue',{n:200}),g.T(P.sx(4.2),P.sy(70),'illustrative',{cls:'m'}));
    s.push(g.panel(560,60,'Test-time compute',['reasoning models (2024–)','generate long chains of','thought before answering','','accuracy rises with how long','they are allowed to think:','a second scaling axis'],'blue'))}
  return s.join('');
},
steps:[
 {k:'insight',t:'Smooth, predictable improvement',short:'Power laws',m:{C:'×10 per tick'},
  b:'Train many models of different sizes for different lengths and plot test loss against compute on log–log axes. The best achievable loss falls on an almost perfectly <b>straight line</b>: a power law, spanning many orders of magnitude.\n\nThis lets labs predict the loss of a huge model from small experiments, which is what justified building ever-larger systems.'},
 {k:'math',t:'Parameters, data, compute',short:'C ≈ 6ND',m:{N:'N',D:'D',C:'≈ 6ND'},
  b:'Three quantities trade off. Training compute in FLOPs is about <b>6 × parameters × tokens</b>: roughly 2 for the forward pass and 4 for the backward pass, per parameter per token.\n\nGiven a compute budget, how should you split it between a bigger model and more data?'},
 {k:'solution',t:'Chinchilla',short:'Chinchilla',m:{N:'70 B',D:'1.4 T',C:'= Gopher'},
  b:'DeepMind’s 2022 Chinchilla study found earlier models were too big for their data. For a fixed budget, parameters and tokens should grow together, roughly <b>20 tokens per parameter</b>.\n\nChinchilla (70B params, 1.4T tokens) outperformed the 4× larger Gopher trained with the same compute.'},
 {k:'tradeoff',t:'Train small, train long',short:'Over-training',m:{N:'8 B',D:'15 T'},
  b:'Compute-optimal is optimal for <b>training</b>. But a deployed model answers millions of requests, so a smaller model is cheaper forever. Recent open models are trained far beyond 20 tokens/param: Llama 3 8B saw about 15 trillion tokens.\n\nThe binding constraint is shifting toward the supply of high-quality data.'},
 {k:'insight',t:'Scaling at answer time',short:'Test-time',m:{C:'at inference'},
  b:'A newer axis: let the model spend more compute <b>while answering</b>, generating a long internal chain of reasoning, trying approaches and checking them. Models trained with reinforcement learning to do this improve steadily on maths and coding as they are allowed to think longer.\n\nScale now means bigger models, more data, and more thinking.'}
]});
})();
