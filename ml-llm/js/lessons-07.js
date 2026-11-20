/* 07 · How LLMs read: tokens, embeddings, attention */
(function(){const U=ML.U;

/* ======================================================= tokenization */
ML.add({id:'tokenization',title:'Tokens & Tokenisation',min:11,lvl:'Beginner',
sub:'LLMs never see letters or words. They see tokens: chunks of text learned by Byte-Pair Encoding.',
keys:'token tokenizer bpe byte pair encoding vocabulary subword tiktoken sentencepiece token id',
learn:['Why not characters or whole words','How Byte-Pair Encoding learns a vocabulary','Text → token IDs, and the quirks this causes','Why everything (price, context, speed) is counted in tokens'],
cheat:['Token = a frequent chunk of text (word, sub-word, punctuation, byte).','BPE: start from characters/bytes, repeatedly merge the most frequent adjacent pair.','English ≈ 4 characters ≈ ¾ word per token; other languages and code often need more.','Tokenisation explains odd failures: letter counting, arithmetic on long numbers, trailing spaces.'],
met:[['vocab','Vocab size','hash'],['toks','Tokens','list'],['ratio','Chars / token','scale']],
hero:1,
setup(){const corpus={low:5,lower:2,newest:6,widest:3,new:4};let words=Object.entries(corpus).map(([w,c])=>({t:[...w,'_'],c}));this.bpe=[{words:words.map(w=>({...w,t:[...w.t]})),merge:null}];
  for(let k=0;k<6;k++){const P=new Map();words.forEach(w=>{for(let i=0;i<w.t.length-1;i++){const key=w.t[i]+'\u0001'+w.t[i+1];P.set(key,(P.get(key)||0)+w.c)}});let best=null,bn=0;P.forEach((n,key)=>{if(n>bn){bn=n;best=key}});const [a,b]=best.split('\u0001');
    words=words.map(w=>{const o=[];for(let i=0;i<w.t.length;i++){if(i<w.t.length-1&&w.t[i]===a&&w.t[i+1]===b){o.push(a+b);i++}else o.push(w.t[i])}return {t:o,c:w.c}});this.bpe.push({words:words.map(w=>({...w,t:[...w.t]})),merge:[a,b,bn]})}},
draw(si,g){
  const s=[];
  if(si===0){s.push(g.T(60,50,'Three ways to chop "unbelievably fast"',{cls:'h'}));
    const rows=[['characters',[...'unbelievably fast'].map(c=>c===' '?' ':c),'gray','vocab ≈ 256, but sequences get very long'],['words',['unbelievably',' fast'],'red','short, but vocab explodes; "unbelievablyy" = unknown'],['sub-word tokens',['un','belie','vably',' fast'],'green','best of both: ~50k–200k vocab, any text works']];
    rows.forEach(([l,t,c,n],i)=>{const y=110+i*110;s.push(g.T(60,y,l,{cls:'b'}));const ch=g.chips(60,y+12,t.map(x=>({t:x,c})),{gap:4,minw:14});s.push(ch.svg,g.T(60,y+62,n,{cls:'m'}))})}
  else if(si===1){s.push(g.panel(560,40,'Byte-Pair Encoding',['1. start: every word split into','   characters (+ end marker _)','2. count every adjacent pair,','   weighted by word frequency','3. merge the most frequent pair','   into a new token','4. repeat until vocab is big enough'],'blue'))}
  else if(si===2){const toks=[['Token',5963],['ization',2065],[' isn',3302],['’t',247],[' magic',11204],['!',0],[' 🙂',95],['',0]].slice(0,7);
    s.push(g.T(60,60,'Input text',{cls:'b m'}),g.box(260,95,400,40,'Tokenization isn’t magic! 🙂','gray',{flat:1,fs:13}));s.push(g.A(260,120,260,160));
    const c=g.chips(60,175,toks.map(([t,id],i)=>({t,id:'#'+(id*7+13*i+101),c:['blue','orange','green','purple','red','pink','yellow'][i]})),{ids:1,gap:6});s.push(c.svg);
    s.push(g.T(60,240,'↑ each chip is one token · the number is its ID in the vocabulary (illustrative)',{cls:'m'}));
    const ids=toks.map(([t,id],i)=>id*7+13*i+101);s.push(g.panel(60,280,'What the model actually receives',['['+ids.join(', ')+']','leading spaces are part of tokens: " magic" ≠ "magic"','an emoji may be several byte-level tokens'],'yellow',{w:520}));}
  else if(si===3){s.push(g.T(60,50,'Tokenisation quirks you will meet',{cls:'h'}));
    const ex=[['"strawberry" →',['str','aw','berry'],'how many r’s? the model never sees single letters'],['"3141592" →',['314','159','2'],'digits grouped arbitrarily → arithmetic is hard'],['"こんにちは" →',['こん','に','ち','は'],'non-English text often costs 2–3× more tokens'],['"    return x" →',['   ',' return',' x'],'whitespace & code have their own tokens']];
    ex.forEach(([l,t,n],i)=>{const y=100+i*85;s.push(g.T(60,y+16,l,{cls:'b'}));const c=g.chips(250,y,t.map(x=>({t:x,c:'purple'})),{gap:4});s.push(c.svg,g.T(250,y+44,n,{cls:'m'}))})}
  else if(si===4){s.push(g.T(60,50,'Tokens are the unit of everything',{cls:'h'}));
    s.push(g.hbars(60,90,560,[['GPT-2 (2019)',50257],['GPT-4 (cl100k)',100256],['Llama 3',128256],['GPT-4o (o200k)',200019]],{c:'blue',lw:150,fmt:v=>v===50257||v===128256?v.toLocaleString():'≈ '+Math.round(v/1000)+'k',rh:30}),g.T(60,80,'vocabulary size',{cls:'m'}));
    s.push(g.panel(60,240,'Rules of thumb (English)',['1 token ≈ 4 characters ≈ ¾ of a word','100 tokens ≈ 75 words','a 300-page book ≈ 120,000 tokens'],'green'),g.panel(450,240,'Counted in tokens',['context window size','API price (per million tokens)','generation speed (tokens / second)'],'yellow'));}
  else{s.push(g.T(60,50,'Next: from IDs to meaning',{cls:'h'}));const c=g.chips(60,110,['The',' cat',' sat'].map((t,i)=>({t,id:['#464','#3797','#3332'][i],c:'blue'})),{ids:1});s.push(c.svg);
    c.pos.forEach((p,i)=>{s.push(g.A(p.cx,150,p.cx,210,{c:'gray'}),g.heat(p.cx-48,220,[U.range(6).map(j=>(Math.sin(i*3.1+j*1.7)+1)/2)],{cs:16,vals:false,c:'purple'}))});
    s.push(g.T(60,280,'an ID is just a row number → the embedding table turns it into a vector (next lesson)',{cls:'m'}))}
  return s.join('');
},
anim(si,t,g){if(si!==1)return '';const n=this.bpe.length,i=Math.min(n-1,Math.floor((t/1.8)%(n+1.5)));const st=this.bpe[i];let s=g.T(60,50,i?`merge ${i}: "${st.merge[0]}" + "${st.merge[1]}" → "${st.merge[0]+st.merge[1]}"  (seen ${st.merge[2]}×)`:'start: characters',{cls:'h'});
  st.words.forEach((w,j)=>{const y=90+j*62;s+=g.T(60,y+17,`×${w.c}`,{cls:'m'});const c=g.chips(100,y,w.t.map(x=>({t:x,c:i&&x===st.merge[0]+st.merge[1]?'orange':x.length>1?'green':'gray',hot:i&&x===st.merge[0]+st.merge[1]})),{gap:4,minw:20});s+=c.svg});
  return s+g.pill(380,420,`tokens in corpus: ${st.words.reduce((a,w)=>a+w.t.length*w.c,0)}`,'blue')},
steps:[
 {k:'problem',t:'How should text be chopped?',short:'Why tokens',m:{vocab:'?',toks:'?'},
  b:'A neural network needs numbers, so text must be split into units with IDs. <b>Characters</b> give a tiny vocabulary but very long sequences. <b>Whole words</b> give short sequences but a gigantic vocabulary and no way to handle typos or new words.\n\nModern LLMs use <b>sub-word tokens</b>: common words are one token, rare words are built from pieces.'},
 {k:'technique',t:'Byte-Pair Encoding',short:'BPE',m:{vocab:'grows by 1 per merge',toks:'shrinks'},
  n:['Count all adjacent pairs','Merge the most frequent pair','Add it to the vocabulary','Repeat'],
  b:'<b>BPE</b> learns the vocabulary from data. Start with single characters (in practice, raw bytes, so any text is representable). Count every adjacent pair across the corpus, merge the most frequent into a new token, and repeat tens of thousands of times.\n\nWatch “n”+“e” → “ne”, then “ne”+“w” → “new”, then “est”: frequent pieces become single tokens.'},
 {k:'solution',t:'Text in, integers out',short:'Token IDs',m:{toks:'7',ratio:'≈ 3.9'},
  b:'At run time the tokenizer applies the learned merges to your text and outputs a list of integer <b>token IDs</b>. That list is all the model sees.\n\nNote that spaces usually attach to the <b>following</b> word: “ magic” with a space is a different token from “magic” at the start of a line.'},
 {k:'tradeoff',t:'Quirks',short:'Quirks',
  b:'Because models see chunks, not letters, they can stumble on spelling and letter-counting (“how many r’s in strawberry?”), on long-number arithmetic, and on languages that were rare in the tokenizer’s training data, which also makes those languages more expensive.\n\nMany “weird” LLM failures are tokenisation artefacts.'},
 {k:'insight',t:'Everything is counted in tokens',short:'Units',m:{vocab:'50k – 200k',ratio:'≈ 4 (English)'},
  b:'Vocabulary sizes have grown from about 50k (GPT-2) to 100k–200k in recent models, which packs more text into each token, especially for code and non-English languages.\n\nContext windows, API pricing and generation speed are all measured in tokens.'},
 {k:'recap',t:'IDs are not meaning (yet)',short:'Next',
  b:'Token #3797 is just an index. The model’s first layer looks up a learned <b>vector</b> for each ID. Those vectors, the embeddings, are where meaning begins.'}
]});

/* ======================================================= embeddings */
const WV={king:[7.2,7.6],queen:[7.6,4.6],man:[3.4,7.2],woman:[3.8,4.2],prince:[6.2,8.4],princess:[6.6,5.4],Paris:[1.6,2.0],France:[1.2,0.9],Rome:[3.0,2.4],Italy:[2.6,1.3],apple:[8.8,1.6],banana:[9.3,0.9],cherry:[8.4,0.6]};
ML.add({id:'embeddings',title:'Embeddings',min:10,lvl:'Beginner',
sub:'Each token becomes a long list of numbers, a point in a space where direction and distance carry meaning.',
keys:'embedding vector word2vec cosine similarity semantic space king queen dimension d_model contextual',
learn:['The embedding table: ID → vector','Similar meanings land close together','Directions encode relationships (king − man + woman)','Static vs contextual embeddings'],
cheat:['Embedding matrix E has one row (length d_model) per vocabulary token; it is learned.','Cosine similarity = cos(angle) between vectors; 1 = same direction.','Relationships appear as consistent directions (word2vec, 2013).','Inside an LLM, each layer rewrites the vector using context: “bank” by a river ≠ “bank” with money.'],
met:[['d','Dimensions','layers'],['params','Table size','hash'],['sim','Similarity','target']],
hero:2,
draw(si,g){
  const s=[];
  if(si===0){s.push(g.T(60,50,'The embedding table (vocab × d)',{cls:'h'}));const rows=['#0  !','#1  "','…','#3797 " cat"','…','#5963 "Token"','…','#50256 <eos>'];
    const M=rows.map((r,i)=>r==='…'?null:U.range(10).map(j=>(Math.sin(i*2.3+j*1.1)+1)/2));
    rows.forEach((r,i)=>{s.push(g.T(220,110+i*34+4,r,{a:'end',cls:r.includes('cat')?'b':'m'}));if(M[i])s.push(g.heat(240,93+i*34,[M[i]],{cs:30,vals:false,c:r.includes('cat')?'orange':'purple'}));else s.push(g.T(390,112+i*34,'⋮',{cls:'m'}))});
    s.push(g.T(240,82,'d_model numbers per token →',{cls:'m'}),g.panel(580,100,'Lookup, not maths',['token ID 3797 → row 3797','the row IS the vector','','values start random and','are learned by backprop'],'orange'))}
  else if(si<=3){const P=g.plot({x:50,y:30,w:440,h:410,xr:[0,10],yr:[0,10],grid:false,xl:'(2D projection of a ~1000-dim space)'});this.P=P;s.push(P.svg);
    const grp=w=>['king','queen','man','woman','prince','princess'].includes(w)?'blue':['Paris','France','Rome','Italy'].includes(w)?'green':'red';
    Object.entries(WV).forEach(([w,[x,y]])=>s.push(g.C(P.sx(x),P.sy(y),6,grp(w)),g.T(P.sx(x)+9,P.sy(y)+4,w,{cls:'b'})));
    if(si===2){s.push(g.vec(P,3.4,7.2,7.2,7.6,'orange','',{dash:1}),g.vec(P,3.8,4.2,7.6,4.6,'orange','',{dash:1}),g.vec(P,3.4,7.2,3.8,4.2,'purple','',{dash:1}),g.vec(P,7.2,7.6,7.6,4.6,'purple','',{dash:1}));
      s.push(g.panel(530,50,'Directions mean things',['orange: man → king ≈ woman → queen','   ("royalty" direction)','purple: man → woman ≈ king → queen','   ("gender" direction)','','king − man + woman ≈ queen','Paris − France + Italy ≈ Rome'],'orange'))}
    if(si===1)s.push(g.panel(530,50,'Similar → nearby',['royalty, capitals, fruit','form their own regions','','nobody labelled these:','they emerge from predicting','words in context'],'blue'));
    if(si===3){const o=[5,5];[['king','queen'],['king','banana']].forEach(([a,b],i)=>{const A=WV[a],B=WV[b];s.push(g.vec(P,o[0],o[1],A[0],A[1],i?'gray':'blue','',{op:.7}),g.vec(P,o[0],o[1],B[0],B[1],i?'red':'blue','',{op:.7}))});
      s.push(g.panel(530,50,'Cosine similarity',['cos θ = (a · b) / (‖a‖ ‖b‖)','','1  = same direction','0  = unrelated (90°)','−1 = opposite','','powers semantic search & RAG'],'purple'));
      s.push(g.heat(560,270,[[1,.81,.12],[.81,1,.09],[.12,.09,1]],{cs:44,rows:['king','queen','banana'],cols:['king','queen','banana'],c:'purple'}))}}
  else if(si===4){s.push(g.T(60,50,'Same token, different meaning',{cls:'h'}));
    const a=g.chips(60,100,['I',' sat',' by',' the',' river',' bank'].map((t,i)=>({t,c:i===5?'green':'gray',hot:i===5}))),b=g.chips(60,250,['I',' paid',' at',' the',' bank',' today'].map((t,i)=>({t,c:i===4?'blue':'gray',hot:i===4})));s.push(a.svg,b.svg);
    s.push(g.A(a.pos[4].cx,96,a.pos[5].cx,96,{curve:-30,c:'green'}),g.A(b.pos[1].cx,246,b.pos[4].cx,246,{curve:-30,c:'blue'}));
    s.push(g.panel(470,80,'Layer 0 (static)',['both "bank" tokens start with','the SAME embedding row'],'gray'),g.panel(470,200,'After attention layers',['vector shifts toward "riverside"','or toward "finance" depending','on the surrounding words','= a contextual embedding'],'green'))}
  else{s.push(g.T(60,50,'How big are embeddings?',{cls:'h'}));s.push(g.hbars(60,90,640,[['word2vec',300],['BERT-base',768],['GPT-2 small',768],['Llama 3 8B',4096],['GPT-3 175B',12288]],{c:'purple',lw:130,fmt:v=>v.toLocaleString()+' dims',rh:34}));
    s.push(g.panel(60,290,'Table size = vocab × d',['GPT-3: 50,257 × 12,288 ≈ 617 M parameters','just for the input lookup'],'yellow'),g.panel(460,290,'Embedding models',['text-embedding models map a whole','sentence to one vector for search'],'blue'))}
  return s.join('');
},
anim(si,t,g){if(si!==2||!this.P)return '';const P=this.P,k=(t%4)/3;if(k>1)return g.C(P.sx(7.6),P.sy(4.6),11,'orange',{cls:'hollow'});const x=U.lerp(7.2,7.6,U.ease(k)),y=U.lerp(7.6,4.6,U.ease(k));return g.C(P.sx(x),P.sy(y),7,'yellow',{cls:'big'})},
steps:[
 {k:'setup',t:'The embedding table',short:'Lookup',m:{d:'d_model',params:'vocab × d'},
  b:'The first layer of an LLM is a big table with one row per token in the vocabulary. Each row is a vector of <b>d_model</b> numbers (768 in GPT-2 small, 12,288 in GPT-3).\n\nTurning token IDs into vectors is a plain lookup. The numbers start random and are learned during training like any other weight.'},
 {k:'insight',t:'Meaning becomes geometry',short:'Clusters',m:{d:'2 (projected)'},
  b:'After training, tokens used in similar contexts end up with similar vectors. Projected down to 2D, royalty words, places and fruit form their own neighbourhoods.\n\nNobody designed this: it falls out of the training objective. Words that predict similar neighbours get similar vectors (“you shall know a word by the company it keeps”).'},
 {k:'insight',t:'Directions encode relations',short:'Analogies',m:{sim:'king−man+woman ≈ queen'},
  b:'Even more striking: <b>directions</b> carry meaning. The step from “man” to “king” is roughly the same as from “woman” to “queen”, so <code>king − man + woman</code> lands near <b>queen</b>.\n\nThis was the famous word2vec result (2013). Inside LLMs, researchers find directions for concepts like sentiment, truthfulness and language.'},
 {k:'math',t:'Measuring similarity',short:'Cosine',m:{sim:'cos θ'},
  b:'We compare vectors by the <b>angle</b> between them: cosine similarity. “king” and “queen” point nearly the same way (≈ 0.8); “king” and “banana” are nearly perpendicular.\n\nThe dot product behind cosine similarity is also the core operation of attention, which is next.'},
 {k:'insight',t:'Context changes the vector',short:'Contextual',m:{sim:'context-dependent'},
  b:'A table gives “bank” one vector, whether by a river or with money. That is a <b>static</b> embedding.\n\nInside a transformer, each layer mixes information from surrounding tokens into every vector, so by the middle layers the two “bank”s point in different directions. These <b>contextual embeddings</b> are what attention builds.'},
 {k:'recap',t:'Sizes',short:'Sizes',m:{d:'768 – 12,288',params:'up to ~600M'},
  b:'Embedding widths have grown with model size. Separate <b>embedding models</b> produce one vector per sentence or document. They power semantic search and RAG (lesson 9.4).'}
]});

/* ======================================================= attention */
const ATT_T=['The',' animal',' didn’t',' cross',' the',' street',' because',' it',' was',' tired'];
ML.add({id:'attention',title:'Self-Attention',min:14,lvl:'Intermediate',
sub:'Every token asks a question, every token offers an answer, and each one gathers the information it needs.',
keys:'attention self-attention query key value qkv softmax scaled dot product causal mask attention matrix',
learn:['The problem attention solves','Queries, keys and values','Scores → softmax → weighted sum, with numbers','The attention matrix and causal masking'],
cheat:['q = xW_Q, k = xW_K, v = xW_V for every token.','Attention(Q,K,V) = softmax(QKᵀ / √d_k) · V.','Each output = weighted average of all value vectors; weights from query–key match.','Decoders mask future positions (causal mask). Cost grows with n² tokens.'],
met:[['tok','Focus token','target'],['top','Strongest link','link'],['n','Matrix size','grid']],
hero:3,
setup(){const sc=[0.3,4.1,0.2,0.6,0.1,1.9,0.5,1.2,-1,-1];this.sc=sc;const v=sc.slice(0,8);this.w=U.softmax(v.map(x=>x/1)).concat([0,0]);this.steps[3].m={top:`animal ≈ ${(this.w[1]*100).toFixed(0)}%`};
  const r=U.rng(5);this.M=ATT_T.map((_,i)=>{const row=ATT_T.map((_,j)=>j>i?null:(i===7?sc[j]:(j===i?2:j===i-1?1.4:j===0?1:0.2+r()*.8)));const vals=row.filter(x=>x!=null),sm=U.softmax(vals);let k=0;return row.map(x=>x==null?null:sm[k++])});},
draw(si,g){
  const s=[];const chips=(y,hot=7,o={})=>g.chips(40,y,ATT_T.map((t,i)=>({t,c:i===hot?'orange':i===1&&o.ani?'blue':'gray',hot:i===hot||(o.ani&&i===1),dim:o.dim&&o.dim(i)})),{gap:5});
  if(si===0){const c=chips(170);s.push(c.svg);s.push(g.A(c.pos[7].cx,165,c.pos[1].cx,165,{curve:70,c:'orange',l:'?',lt:'orange'}),g.A(c.pos[7].cx,200,c.pos[5].cx,200,{curve:-40,c:'gray',dash:1,l:'?',lt:'ink'}));
    s.push(g.panel(60,280,'What does "it" refer to?',['the animal (was tired) or the street?','to understand "it", the model must look','at OTHER tokens and pull in their meaning','','RNNs pass this through a long chain;','attention connects any two tokens directly'],'orange',{w:450}))}
  else if(si===1){s.push(g.box(100,240,110,60,'x (it)','orange',{sub:'embedding'}));[['W_Q','query q','"what am I','looking for?"',130,'red'],['W_K','key k','"what do I','contain?"',240,'blue'],['W_V','value v','"what do I','pass on?"',350,'green']].forEach(([w,n,a,b,y,c])=>{s.push(g.A(160,240,290,y,{c:'gray'}),g.box(330,y,80,40,w,'gray',{fs:12}),g.A(370,y,450,y),g.box(510,y,110,50,n,c),g.T(590,y-4,a,{cls:'m'}),g.T(590,y+12,b,{cls:'m'}))});
    s.push(g.T(60,440,'three learned matrices turn every token vector into a query, a key and a value',{cls:'m'}))}
  else if(si===2||si===3||si===4){const c=chips(si===3?120:60,7,{ani:si>=3});s.push(c.svg);
    if(si===2){s.push(g.T(40,130,'score = q(it) · k(j) / √dₖ   (illustrative numbers)',{cls:'b'}));const vals=this.sc.slice(0,8);c.pos.slice(0,8).forEach((p,i)=>{const h=Math.abs(vals[i])*40;s.push(g.R(p.x+4,320-h,p.w-8,h,{fill:'var(--red)',op:.55,stroke:'var(--edge)',rx:3}),g.T(p.cx,312-h,vals[i].toFixed(1),{a:'middle',cls:'b'}))});s.push(`<line x1="40" y1="320" x2="${c.pos[7].x+c.pos[7].w}" y2="320" style="stroke:var(--edge)"/>`);
      c.pos.slice(8).forEach(p=>s.push(g.T(p.cx,312,'later',{a:'middle',cls:'m'})));s.push(g.panel(40,350,'Dot product = match',['high when the query and key point the same way','√dₖ scaling keeps scores from exploding'],'red',{w:420}))}
    if(si===3){s.push(g.T(40,175,'weights = softmax(scores)  → they sum to 1',{cls:'b'}));c.pos.slice(0,7).forEach((p,i)=>{const w=this.w[i];s.push(g.A(c.pos[7].cx,116,p.cx,116,{curve:Math.min(95,(7-i)*15),c:'orange',w:.6+w*9,op:.25+w*.75,head:false}))});c.pos.slice(0,8).forEach((p,i)=>{const w=this.w[i];s.push(g.R(p.x+4,400-w*190,p.w-8,w*190,{fill:'var(--orange)',op:.75,stroke:'var(--edge)',rx:3}),g.T(p.cx,392-w*190,(w*100).toFixed(0)+'%',{a:'middle',cls:'b'}))});s.push(`<line x1="40" y1="400" x2="${c.pos[7].x+c.pos[7].w}" y2="400" style="stroke:var(--edge)"/>`)}
    if(si===4){s.push(g.T(40,130,'new "it" = Σ weightⱼ · vⱼ',{cls:'b'}));const top=[[1,'animal'],[5,'street'],[7,'it']];
      top.forEach(([j,n],i)=>{const w=this.w[j];s.push(g.T(60,180+i*44,`${(w*100).toFixed(0)}% ×`,{cls:'b'}),g.T(140,180+i*44,'v('+n+')',{cls:'b'}),g.heat(230,166+i*44,[U.range(8).map(q=>(Math.sin(j*2.1+q*1.3)+1)/2)],{cs:20,vals:false,c:['blue','gray','orange'][i]}))});
      s.push(g.T(60,320,'+ small shares of the rest',{cls:'m'}),g.A(420,230,500,230),g.T(520,190,'output for "it"',{cls:'b'}),g.heat(520,210,[U.range(8).map(q=>(Math.sin(1*2.1+q*1.3)+1)/2*.8+.1)],{cs:22,vals:false,c:'blue'}),g.T(520,260,'now mostly "animal"',{cls:'m'}),g.T(520,276,'→ "tired" makes sense',{cls:'m'}))}}
  else if(si===5){s.push(g.heat(150,90,this.M,{cs:34,rows:ATT_T.map(t=>t.trim()),cols:ATT_T.map(t=>t.trim()),crot:1,c:'orange',vals:false,hi:[7,1]}));
    for(let i=0;i<10;i++)for(let j=i+1;j<10;j++)s.push(g.R(150+j*34+1,90+i*34+1,32,32,{fill:'var(--gray-bg)',rx:4}));
    s.push(g.panel(540,90,'The attention matrix',['row = a token’s query','column = keys it looks at','each row sums to 1','','grey = masked future:','a token may only look','LEFT (causal / decoder)','','row "it" → column "animal"'],'orange'))}
  else{s.push(g.T(60,50,'One formula',{cls:'h'}),g.box(430,120,520,70,'Attention(Q, K, V) = softmax( QKᵀ / √dₖ ) · V','orange',{fs:16}));
    s.push(g.panel(60,200,'All tokens at once',['Q, K, V are matrices (n × dₖ)','QKᵀ is an n × n table of scores','one matrix multiply: GPUs love it','no sequential loop like an RNN'],'green'),g.panel(450,200,'The catch: n²',['1k tokens   → 1 M scores per head','100k tokens → 10 B scores per head','long context is expensive','(lesson 8.4: KV cache, FlashAttention)'],'red'))}
  return s.join('');
},
anim(si,t,g){if(si!==3)return '';return ''},
steps:[
 {k:'problem',t:'Words need context',short:'The problem',m:{tok:'it'},
  b:'In “The animal didn’t cross the street because it was too tired”, the word <b>it</b> only makes sense if we know it refers to the animal. Every token’s meaning depends on others, sometimes far away.\n\n<b>Attention</b> lets each token look directly at every other token and pull in what it needs.'},
 {k:'technique',t:'Queries, keys, values',short:'Q, K, V',m:{tok:'it'},
  b:'From each token’s vector the model computes three new vectors with learned matrices:\n\n<b>query</b> q: what this token is looking for. <b>key</b> k: what this token offers, used for matching. <b>value</b> v: the information it hands over if chosen.\n\nThink of a library: the query is your search, keys are the catalogue labels, values are the books.'},
 {k:'math',t:'Score every pair',short:'Scores',m:{top:'animal: 4.1'},
  b:'Compare the query of “it” with the key of every token using a dot product. A high score means a good match. Divide by √dₖ (the key length) so scores don’t grow too large as vectors get longer.\n\nHere “animal” scores highest and “street” comes second.'},
 {k:'solution',t:'Softmax into weights',short:'Softmax',m:{},
  b:'Apply <b>softmax</b> to the scores: they become positive weights that add up to 1. “it” now pays nearly 80% of its attention to “animal”.\n\nIn a trained model these patterns are learned entirely from next-token prediction. Nobody labels coreference.'},
 {k:'solution',t:'Blend the values',short:'Weighted sum',
  b:'The output for “it” is the <b>weighted average of all the value vectors</b>. Because the weight on “animal” dominates, the new vector for “it” now carries the animal’s meaning, so later layers can make sense of “was tired”.\n\nEvery token does this simultaneously.'},
 {k:'insight',t:'The attention matrix',short:'Matrix',m:{n:'10 × 10'},
  b:'Do it for every token and you get an n × n matrix of weights: rows are queries, columns are keys.\n\nIn a GPT-style model a token must not see the future it is trying to predict, so everything above the diagonal is <b>masked</b> (set to −∞ before softmax). That is <b>causal</b> self-attention.'},
 {k:'recap',t:'Scaled dot-product attention',short:'Formula',m:{n:'n × n'},
  b:'The whole lesson in one line: <code>softmax(QKᵀ/√dₖ)·V</code>. It is a few matrix multiplications, perfect for GPUs, and every token connects to every other in a single step.\n\nThe price is quadratic: doubling the context quadruples the score table. Keep that in mind for the context-window lesson.'}
]});

/* ======================================================= multi-head */
ML.add({id:'multi-head',title:'Multi-Head Attention',min:10,lvl:'Intermediate',
sub:'Run many attention patterns in parallel, each specialised: syntax, coreference, position, copying.',
keys:'multi-head attention heads concat output projection induction head gqa mqa grouped query',
learn:['Why one attention pattern is not enough','Splitting d_model into h heads','Head types found in real models','Grouped-query attention'],
cheat:['h heads, each with its own W_Q, W_K, W_V of width d_model/h.','Concatenate head outputs, mix with W_O.','Heads specialise: previous-token, syntax, coreference, induction (copying).','GQA/MQA share keys & values across heads to shrink the KV cache.'],
met:[['h','Heads','grid'],['dh','Head size','layers'],['kv','KV heads','db']],
hero:0,
setup(){const n=8,mk=f=>U.range(n).map(i=>{const raw=U.range(n).map(j=>j>i?null:f(i,j));const v=raw.filter(x=>x!=null),sm=U.softmax(v);let k=0;return raw.map(x=>x==null?null:sm[k++])});
  this.H=[mk((i,j)=>j===i-1?4:j===i?1:0),mk((i,j)=>(i===5&&j===1)||(i===6&&j===1)?4:j===i?1.5:0),mk((i,j)=>j===0?3:0)];
  this.toks=['The','cat','that','I','saw','was','very','cute'];},
draw(si,g){
  const s=[];
  if(si===0){[['head 1: previous token','blue'],['head 2: subject ↔ verb','orange'],['head 3: "sink" on first token','green']].forEach(([t,c],i)=>{const x=40+i*275;s.push(g.T(x,50,t,{cls:'b'}),g.heat(x+40,70,this.H[i],{cs:26,vals:false,c,rows:this.toks}))});
    s.push(g.T(60,440,'same sentence, three heads, three different patterns (illustrative)',{cls:'m'}))}
  else if(si===1){s.push(g.box(110,240,120,70,'x','orange',{sub:'d_model = 768'}));const hs=[0,1,2,3];hs.forEach(i=>{const y=110+i*80;s.push(g.A(170,240,280,y,{c:'gray'}),g.box(340,y,110,52,i===3?'head 12':'head '+(i+1),['blue','orange','green','purple'][i],{sub:'d = 64'}),g.A(395,y,520,240,{c:'gray'}));if(i===2)s.push(g.T(340,y+46,'⋮',{a:'middle',cls:'h'}))});
    s.push(g.box(580,240,100,60,'concat','gray',{sub:'12 × 64'}),g.A(630,240,690,240),g.box(740,240,80,60,'W_O','purple',{sub:'mix'}));
    s.push(g.T(60,440,'GPT-2 small: 768 = 12 heads × 64 · total compute ≈ one big head',{cls:'m'}))}
  else if(si===2){s.push(g.T(60,50,'Induction heads: copying patterns',{cls:'h'}));const tk=['Mr','Dursley','was','…','Mr','?'];const c=g.chips(60,120,tk.map((t,i)=>({t,c:i===5?'orange':i===1?'green':'gray',hot:i===1||i===5})),{gap:10,minw:40});s.push(c.svg);
    s.push(g.A(c.pos[4].cx,116,c.pos[0].cx,116,{curve:50,c:'blue',l:'1. same token before?',lt:'blue'}),g.A(c.pos[5].cx,152,c.pos[1].cx,152,{curve:-60,c:'orange',l:'2. copy what came next',lt:'orange'}));
    s.push(g.panel(60,280,'Why it matters',['"…A B … A" → predict B','a circuit of TWO heads in different layers','believed to drive much of in-context learning'],'orange',{w:420}))}
  else if(si===3){s.push(g.T(60,50,'Sharing keys & values',{cls:'h'}));[['Multi-head (MHA)',[0,1,2,3,4,5,6,7],8],['Grouped-query (GQA)',[0,0,1,1,2,2,3,3],4],['Multi-query (MQA)',[0,0,0,0,0,0,0,0],1]].forEach(([n,map,kv],r)=>{const y=110+r*110;s.push(g.T(60,y,n,{cls:'b'}),g.T(60,y+18,`${kv} KV head${kv>1?'s':''}`,{cls:'m'}));
      for(let i=0;i<8;i++)s.push(g.box(270+i*40,y-6,30,26,'Q','red',{fs:10,flat:1}));const seen=new Set();map.forEach((k,i)=>{if(!seen.has(k)){seen.add(k);const xs=map.map((m,j)=>m===k?j:-1).filter(j=>j>=0);const cx=270+(xs[0]+xs[xs.length-1])/2*40;s.push(g.box(cx,y+52,Math.max(30,xs.length*40-10),26,'K V','blue',{fs:10,flat:1}))}})});
    s.push(g.panel(620,110,'Why',['the KV cache stores K and V','for every past token','fewer KV heads → far less','memory, quality nearly same','','Llama 2 70B, Llama 3: GQA'],'blue'))}
  else{s.push(g.T(60,50,'Recap',{cls:'h'}),g.panel(60,90,'Multi-head attention',['MultiHead(X) = Concat(head₁ … head_h) · W_O','headᵢ = Attention(X W_Qᵢ, X W_Kᵢ, X W_Vᵢ)'],'orange',{w:520}),
      g.panel(60,220,'Typical numbers',['GPT-2 small: 12 heads × 64 dims, 12 layers = 144 heads','GPT-3: 96 heads × 128 dims, 96 layers = 9,216 heads'],'blue',{w:520}))}
  return s.join('');
},
steps:[
 {k:'problem',t:'One pattern is not enough',short:'Why many',m:{h:'3 shown',dh:'—',kv:'—'},
  b:'A single attention pattern averages everything into one blend. But a token needs several kinds of information at once: the previous word, its grammatical subject, what a pronoun refers to.\n\nSo transformers run several attention <b>heads</b> side by side, each with its own Q, K, V matrices and its own pattern.'},
 {k:'technique',t:'Split, attend, concatenate',short:'Mechanics',m:{h:'12',dh:'64'},
  b:'Rather than adding cost, the model width is <b>split</b>: GPT-2 small has d_model = 768 and 12 heads of 64 dimensions each. Every head attends independently, the outputs are concatenated back to 768, and an output matrix W_O mixes them.\n\nTotal compute is about the same as one full-width head.'},
 {k:'insight',t:'What heads learn',short:'Induction',m:{h:'12 × 12 layers'},
  b:'Interpretability research has found recognisable head types: previous-token heads, heads tracking syntax, heads resolving pronouns, and <b>induction heads</b>, which look for an earlier occurrence of the current token and copy what followed it.\n\nInduction heads are thought to be a key mechanism behind <b>in-context learning</b>: following patterns shown in the prompt.'},
 {k:'technique',t:'Grouped-query attention',short:'GQA',m:{kv:'8 → 4 → 1'},
  b:'During generation, each head’s keys and values for every past token are cached in GPU memory. With many heads and long contexts that cache gets huge.\n\n<b>Multi-query</b> (one shared K/V) and <b>grouped-query</b> attention (a few shared K/V groups) cut that memory several-fold with little quality loss. Most recent open models use GQA.'},
 {k:'recap',t:'Multi-head attention',short:'Recap',m:{h:'12 – 96+'},
  b:'Many heads, each a different way of looking at the sequence, combined into one update. Stack this across dozens of layers and the model has thousands of specialised attention patterns.'}
]});

/* ======================================================= positional encoding */
ML.add({id:'positional-encoding',title:'Positional Encoding & RoPE',min:10,lvl:'Advanced',
sub:'Attention ignores order. Positional encodings put it back, from sine waves to rotating vectors.',
keys:'positional encoding sinusoidal learned absolute relative rope rotary alibi length extrapolation',
learn:['Why attention alone is order-blind','Sinusoidal and learned position embeddings','RoPE: encode position as a rotation','Stretching context length'],
cheat:['Attention is a weighted set operation: shuffle the tokens and outputs just shuffle.','Original transformer: add sin/cos waves of different frequencies to embeddings.','RoPE rotates q and k by angle ∝ position, so q·k depends on the relative offset.','Context extension: position interpolation / NTK / YaRN rescale RoPE frequencies.'],
met:[['scheme','Scheme','hash'],['rel','Relative?','link']],
hero:3,
draw(si,g){
  const s=[];
  if(si===0){const a=g.chips(80,110,[' dog',' bites',' man'].map((t,i)=>({t,c:['blue','orange','green'][i]})),{gap:10,minw:70}),b=g.chips(80,250,[' man',' bites',' dog'].map((t,i)=>({t,c:['green','orange','blue'][i]})),{gap:10,minw:70});s.push(a.svg,b.svg,g.T(80,95,'sentence A',{cls:'m'}),g.T(80,235,'sentence B',{cls:'m'}));
    s.push(g.panel(420,100,'Same tokens, same attention',['without position info, attention','sees a SET of vectors','A and B get identical scores','(just reordered)','','very different meaning!'],'red'))}
  else if(si===1){const P=g.plot({x:60,y:40,w:380,h:300,xr:[0,50],yr:[-1.2,1.2*7],grid:false,xl:'position',title:'PE(pos, i) for a few dimensions'});s.push(P.svg);
    [0,1,2,3,4,5].forEach(i=>{const f=1/Math.pow(10000,(2*i)/12);s.push(P.fn(p=>Math.sin(p*f*2.2)+i*1.35,['red','orange','yellow','green','blue','purple'][i],{n:240}))});
    const M=U.range(24).map(p=>U.range(16).map(i=>{const f=1/Math.pow(10000,(2*Math.floor(i/2))/16);return (i%2?Math.cos(p*f):Math.sin(p*f))*.5+.5}));
    s.push(g.T(500,48,'position × dimension',{cls:'b'}),g.heat(500,60,M,{cs:15,vals:false,c:'purple'}),g.T(500,440,'fast waves ← → slow waves',{cls:'m'}))}
  else if(si===2){s.push(g.T(60,50,'Add position to the embedding',{cls:'h'}));['The',' cat',' sat'].forEach((t,i)=>{const x=110+i*240;s.push(g.chips(x-30,90,[{t,c:'blue'}]).svg,g.heat(x-60,140,[U.range(6).map(j=>(Math.sin(i*2.7+j*1.9)+1)/2)],{cs:20,vals:false,c:'blue'}),g.T(x,190,'+',{a:'middle',cls:'h'}),g.heat(x-60,200,[U.range(6).map(j=>(Math.sin(i/Math.pow(3,j))+1)/2)],{cs:20,vals:false,c:'purple'}),g.T(x,250,'=',{a:'middle',cls:'h'}),g.heat(x-60,260,[U.range(6).map(j=>((Math.sin(i*2.7+j*1.9)+1)/2+(Math.sin(i/Math.pow(3,j))+1)/2)/2)],{cs:20,vals:false,c:'green'}),g.T(x,310,'pos '+i,{a:'middle',cls:'m'}))});
    s.push(g.panel(60,340,'Absolute positions',['original transformer: fixed sinusoids · GPT-2/3: learned table (1 row per position)','limitation: never saw position 5,000 if trained on 2,048'],'yellow',{w:600}))}
  else if(si===3){this.cx=[230,620];s.push(g.T(60,50,'RoPE: rotate q and k by position',{cls:'h'}));[0,1].forEach(i=>{const cx=this.cx[i],cy=240;s.push(`<circle cx="${cx}" cy="${cy}" r="120" style="fill:none;stroke:var(--line2)"/><line x1="${cx-140}" y1="${cy}" x2="${cx+140}" y2="${cy}" style="stroke:var(--line2)"/><line x1="${cx}" y1="${cy-140}" x2="${cx}" y2="${cy+140}" style="stroke:var(--line2)"/>`)});
    s.push(g.T(230,410,'"cat" at positions 2 and 5',{a:'middle',cls:'b'}),g.T(620,410,'"cat" at positions 102 and 105',{a:'middle',cls:'b'}),g.T(430,440,'same gap (3) → same angle between them → same q·k score',{a:'middle',cls:'m'}))}
  else{s.push(g.T(60,50,'Stretching the context',{cls:'h'}));const P=g.plot({x:60,y:80,w:440,h:260,xr:[0,8192],yr:[-1.2,1.2],grid:false,xl:'position',title:'one RoPE frequency'});s.push(P.svg,P.fn(p=>Math.sin(p/650),'blue',{n:400,to:4096}),P.fn(p=>Math.sin(p/1300),'orange',{n:400,cls:'dash'}),`<line x1="${P.sx(4096)}" y1="${P.y}" x2="${P.sx(4096)}" y2="${P.y+P.h}" style="stroke:var(--red);stroke-dasharray:5 4"/>`,g.T(P.sx(4096)+6,P.y+16,'trained up to 4k',{c:'red',cls:'b'}));
    s.push(g.panel(540,80,'Position interpolation',['squeeze 8k positions into','the angle range seen in','training (orange)','','NTK-aware / YaRN scale','frequencies unevenly','+ a little fine-tuning','→ 4k model reads 32k–128k'],'orange'))}
  return s.join('');
},
anim(si,t,g){if(si!==3)return '';let s='';const th=.42,base=t*.35;[[2,5,0],[102,105,1]].forEach(([p1,p2,i])=>{const cx=this.cx[i],cy=240;[[p1,'blue','q'],[p2,'orange','k']].forEach(([p,c,l])=>{const a=-(base*0+p*th)%(2*Math.PI)-(i?0:0);const ang=-p*th+ (i?0:0);const x=cx+110*Math.cos(ang+base),y=cy+110*Math.sin(ang+base);s+=g.A(cx,cy,x,y,{c,w:3})+g.T(x+(x>cx?8:-26),y,l+` (pos ${p})`,{cls:'b',c})});
    const a1=-p1*th+base,a2=-p2*th+base;s+=`<path d="M${cx+40*Math.cos(a1)},${cy+40*Math.sin(a1)} A40,40 0 0 0 ${cx+40*Math.cos(a2)},${cy+40*Math.sin(a2)}" style="fill:none;stroke:var(--purple);stroke-width:2.5"/>`});return s},
steps:[
 {k:'problem',t:'Attention is order-blind',short:'Problem',m:{scheme:'none',rel:'—'},
  b:'Attention compares every token with every other via dot products. Nothing in that computation knows <b>where</b> a token sits. “dog bites man” and “man bites dog” produce the same set of vectors, just shuffled.\n\nWe have to inject position explicitly.'},
 {k:'technique',t:'Sinusoidal encodings',short:'Sinusoids',m:{scheme:'sinusoidal',rel:'implicitly'},
  b:'The original transformer gave each position a fixed vector built from sine and cosine waves of many frequencies, from fast to very slow, like the hands of a clock.\n\nEvery position gets a unique pattern, and nearby positions get similar ones.'},
 {k:'technique',t:'Add it to the embedding',short:'Add',m:{scheme:'absolute'},
  b:'The position vector is simply <b>added</b> to the token embedding before the first layer, so every vector carries both “what” and “where”.\n\nGPT-2 and GPT-3 learned the position table instead. Either way positions are <b>absolute</b>, and a model cannot handle positions beyond its training length.'},
 {k:'solution',t:'RoPE: rotary embeddings',short:'RoPE',m:{scheme:'RoPE',rel:'yes'},
  b:'<b>Rotary Position Embedding</b> (2021) rotates each query and key vector (pairs of dimensions) by an angle proportional to its position.\n\nThe dot product between two rotated vectors depends only on the <b>difference</b> of their angles, so attention scores depend on <b>relative</b> distance. Gap 3 at positions 2–5 or 102–105 gives the same score. Llama, Mistral, Qwen and most modern LLMs use RoPE.'},
 {k:'insight',t:'Stretching context',short:'Extension',m:{scheme:'scaled RoPE'},
  b:'Because RoPE is a smooth function of position, context can be extended after training: <b>position interpolation</b> squeezes longer sequences into the angle range the model knows, and refinements like NTK-aware scaling and <b>YaRN</b> adjust frequencies unevenly.\n\nWith brief fine-tuning, a 4k-context model can read 32k to 128k tokens. More in the context-window lesson.'}
]});
})();
