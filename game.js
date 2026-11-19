'use strict';
/* ΟΝΟΜΑΤΑ — a walking game on the sky-islands of Olympus. Needs sprites.js (WD = the 100 words + models). */
const TS=3,$=id=>document.getElementById(id);
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function angDiff(a,b){let d=(a-b)%TAU;if(d>Math.PI)d-=TAU;if(d<-Math.PI)d+=TAU;return d}

/* ---------- scenery + hero models ---------- */
const mBush=(c,s)=>bake(B(7,7,5,v=>v.ell(3,3,1.5,3.2,3.2,3,pick(c,s))));
function mHouse(wall,trim){return bake(B(14,11,9,v=>{v.box(0,0,0,13,10,7,wall);v.box(1,1,7,12,9,7,0xdcd8cc);v.box(0,0,8,13,0,8,wall);v.box(0,10,8,13,10,8,wall);v.box(0,0,8,0,10,8,wall);v.box(13,0,8,13,10,8,wall);
  v.box(3,10,0,4,10,4,trim);v.box(9,10,3,10,10,5,trim);v.box(0,3,3,0,4,5,trim);v.box(13,6,3,13,7,5,trim);v.box(6,0,3,7,0,5,trim)}))}
function mHero(f){return bake(B(7,7,15,v=>{const lx=3+(f===1?1:f===2?-1:0),rx=3+(f===1?-1:f===2?1:0);v.box(lx,2,0,lx,2,3,SK);v.set(lx,2,0,BR);v.box(rx,4,0,rx,4,3,SK);v.set(rx,4,0,BR);
  v.box(2,1,4,4,5,8,WH);v.box(2,1,5,4,5,5,GD);v.box(3+(f===1?-1:f===2?1:0),0,5,3+(f===1?-1:f===2?1:0),0,8,SK);v.box(3+(f===1?1:f===2?-1:0),6,5,3+(f===1?1:f===2?-1:0),6,8,SK);
  v.box(1,5,4,2,6,6,RD);v.box(2,2,9,4,4,11,SK);v.set(4,2,10,BK);v.set(4,4,10,BK);v.box(1,1,12,5,5,12,BLUE);v.box(2,2,13,4,4,13,BLUE);v.box(2,0,12,3,0,14,WH);v.box(2,6,12,3,6,14,WH)}))}
function mAltar(lit){return bake(B(11,11,6,v=>{v.box(0,0,0,10,10,0,0xcfcabb);v.box(2,2,1,8,8,3,(x,y,z)=>z===2&&((x+y)&1)?BLUE:MARBLE);v.ring(5,5,4,5,2,3.6,0x8a6a2a);v.cyl(5,5,4,4,2,lit?OR:0x33302e)}))}
function mFlame(s){return bake(B(9,9,11,v=>v.cyl(4,4,0,9,z=>[2.6,3,2.8,2.4,2,1.7,1.3,1,0.7,0.4][z]+(s?((z%2)?0.3:-0.2):0),(x,y,z)=>{const d=Math.hypot(x-4,y-4);return d<1.1&&z<6?0xfff0a0:z>6?RD:d<2?YL:OR})))}
function mCloud(s){const r=mulberry(s);return bake(B(30,18,7,v=>{for(let i=0;i<6;i++)v.ell(6+r()*18,5+r()*8,2+r()*2,4+r()*4,3+r()*3,2+r()*2,pick([0xffffff,0xf1f5f9,0xffffff],11))}))}
const M={
  olive:bake(B(11,11,13,v=>{v.box(5,5,0,6,6,5,0x6e5a44);v.ell(5.5,5.5,8.5,5,5,4,pick([0x7f9a6a,0x6b8a5a,0x8fa878,0x5f7d50],1))})),
  lemon:bake(B(11,11,12,v=>{v.box(5,5,0,5,5,4,0x6e4a2c);v.ell(5.5,5.5,7.5,5,5,3.6,pick([0x3f8a3c,0x4a9a44,0x3f8a3c,0x357a34,0xf2d53c],2))})),
  cypress:bake(B(7,7,21,v=>{v.box(3,3,0,3,3,1,0x5a4030);v.cyl(3,3,2,20,z=>3.1*(1-(z-2)/20)+0.5,pick([0x2f5d3a,0x285233,0x356843],3))})),
  pine:bake(B(13,13,15,v=>{v.box(6,6,0,6,6,9,0x6a4a30);v.ell(6,6,11,6,6,2.8,pick([0x3f7a45,0x35693c,0x4a8a50],4))})),
  bush:mBush([0xd6368f,0xc22a80,0xe24aa0,0x3f8a3c],6),shrub:mBush([0x6f8f4f,0x5f7f45,0x86a35c],7),wheat:mBush([0xe8c860,0xd9b040,0xf0d878],8),vine:mBush([0x7b3fa0,0x4c9a3f,0x3f8a3c,0x5c2a80],9),ember:mBush([0xd23b2e,0xf28c1e,0x4a4a50,0x3a3a40],10),
  rock:bake(B(9,8,5,v=>v.ell(4,3.5,1,4,3.4,3.4,pick([0x9a958c,0x878279,0xaaa59c],7)))),
  hWhite:mHouse(WH,BLUE),
  columns:bake(B(24,13,15,v=>{v.box(0,0,0,23,12,0,0xd4cfc0);v.box(1,1,1,22,11,1,MARBLE);const hs=[12,12,9,12,5,12,7,12,12,4];
    [2,7,12,17,20].forEach((x,i)=>[2,9].forEach((y,j)=>{const top=hs[i+j*5];v.box(x,y,2,x+1,y+1,top,pick([MARBLE,0xddd7c6,0xf2eee2],10));if(top===12)v.box(x-1,y,12,x+2,y+1,12,MARBLE)}));v.box(1,2,13,9,3,14,MARBLE);v.box(15,9,13,22,10,13,MARBLE)})),
  plank:bake(B(28,7,4,v=>{for(let x=0;x<28;x++)v.box(x,1,2,x,5,2,x%3?0xb89468:0xa07e54);for(let x=1;x<28;x+=6){v.box(x,0,0,x,0,3,DWOOD);v.box(x,6,0,x,6,3,DWOOD)}})),
  ped:bake(B(9,9,3,v=>{v.cyl(4,4,0,0,4.4,0xcfcabb);v.cyl(4,4,1,2,3.4,MARBLE)})),
  altar:[mAltar(false),mAltar(true)],flame:[mFlame(0),mFlame(1)],cloud:[mCloud(1),mCloud(2),mCloud(3)],hero:[mHero(0),mHero(1),mHero(2)]};

/* ---------- world: a hub and ten shrine islets floating above the clouds ---------- */
const ZONES=[
 {el:'Δήμητρα',en:'Demeter',theme:'Fruit & vegetables',grass:0x9cc46a,decor:{lemon:6,wheat:12,shrub:6}},
 {el:'Διόνυσος',en:'Dionysus',theme:'Food & drink',grass:0xa9b866,decor:{olive:7,vine:12,shrub:4}},
 {el:'Πάνας',en:'Pan',theme:'Farm animals',grass:0x8fbf6a,decor:{pine:6,shrub:12,rock:4}},
 {el:'Άρτεμις',en:'Artemis',theme:'Wild animals',grass:0x6f9a55,decor:{pine:9,cypress:7,shrub:6}},
 {el:'Απόλλων',en:'Apollo',theme:'Sky & nature',grass:0xc9c070,decor:{cypress:8,bush:12,shrub:5}},
 {el:'Εστία',en:'Hestia',theme:'The home',grass:0xb5c078,decor:{olive:7,bush:10,lemon:3}},
 {el:'Αθηνά',en:'Athena',theme:'The town',grass:0xb8b890,decor:{olive:8,cypress:6,shrub:6}},
 {el:'Ερμής',en:'Hermes',theme:'Travel & clothes',grass:0xa5c080,decor:{cypress:6,rock:6,shrub:10}},
 {el:'Ήφαιστος',en:'Hephaestus',theme:'Crafted things',grass:0x8a8072,decor:{rock:12,ember:12}},
 {el:'Πυθαγόρας',en:'Pythagoras',theme:'Numbers',grass:0xa8c8a0,decor:{cypress:6,bush:8,olive:4}},
];
const RING=360;
ZONES.forEach((z,i)=>{const a=-Math.PI/2+i*TAU/10;z.x=Math.cos(a)*RING;z.y=Math.sin(a)*RING;z.r=80;z.seed=101+i*17;z.i=i});
const HUB={el:'Όλυμπος',en:'Olympus',theme:'',grass:0xa9c47a,decor:{columns:2,cypress:8,bush:8},x:0,y:0,r:66,seed:7,i:-1,hub:true};
const ISLETS=[HUB,...ZONES],props=[],OBJ=[],BRIDGES=[];

function buildTerrain(d){
  const R=d.r,half=Math.ceil(R*1.25),S=half*2,rnd=mulberry(d.seed),p=[rnd()*TAU,rnd()*TAU,rnd()*TAU];
  const F=(u,v)=>{const a=Math.atan2(v,u);return 1-Math.hypot(u,v)/R*(1+0.07*Math.sin(a*2+p[0])+0.05*Math.sin(a*3+p[1])+0.03*Math.sin(a*5+p[2]))};
  const lv=new Int8Array(S*S),ff=new Float32Array(S*S);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const f=F(x-half,y-half);ff[x+y*S]=f;lv[x+y*S]=f<=0?-1:f<0.09?0:f>=0.8?2:1}
  const at=(x,y)=>x<0||y<0||x>=S||y>=S?-1:lv[x+y*S];
  const paint=fn=>{const cv=mk(S,S),c=cv.getContext('2d'),im=c.createImageData(S,S);for(let y=0;y<S;y++)for(let x=0;x<S;x++){const col=fn(x,y);if(col==null)continue;const o=(x+y*S)*4;im.data[o]=col[0];im.data[o+1]=col[1];im.data[o+2]=col[2];im.data[o+3]=255}c.putImageData(im,0,0);return cv};
  const rgb=(c,k)=>[Math.min(255,(c>>16&255)*k),Math.min(255,(c>>8&255)*k),Math.min(255,(c&255)*k)];
  d.under=paint((x,y)=>lv[x+y*S]<0?null:rgb(0x6a5f55,0.8+hash2(x,y*3,d.seed)*0.3));
  d.tops=[paint((x,y)=>lv[x+y*S]<0?null:rgb(0xb9ad98,0.9+hash2(x,y,d.seed)*0.16)),
    paint((x,y)=>{if(lv[x+y*S]<1)return null;const f=ff[x+y*S],n=0.93+hash2(x,y,d.seed+1)*0.1+(vnoise(x*0.14,y*0.14,d.seed+9)-0.5)*0.14;
      if(Math.abs(f-0.42)<0.045&&hash2(x,y,d.seed+5)>0.22)return rgb(0xdcd3be,n);if(hash2(x,y,d.seed+77)>0.985)return rgb(d.grass,n*0.8);
      const edge=at(x-1,y)<1||at(x+1,y)<1||at(x,y-1)<1||at(x,y+1)<1;return rgb(d.grass,edge?n*1.12:n)}),
    paint((x,y)=>lv[x+y*S]<2?null:rgb(((x>>2)+(y>>2))&1?0xe9e4d6:0xd6d0c0,0.95+hash2(x,y,d.seed+2)*0.08))];
  d.sides=[null,paint((x,y)=>lv[x+y*S]<1?null:rgb(0x8a7458,0.85+hash2(x,y*3,d.seed+3)*0.25)),paint((x,y)=>lv[x+y*S]<2?null:rgb(0xbfb9a8,0.9+hash2(x,y*3,d.seed+4)*0.15))];
  d.half=half;d.F=(wx,wy)=>F(wx-d.x,wy-d.y);
  d.level=(wx,wy)=>at(Math.round(wx-d.x)+half,Math.round(wy-d.y)+half);
  d.coast=a=>{let r=4;while(r<half-1&&d.level(d.x+Math.cos(a)*r,d.y+Math.sin(a)*r)>=0)r++;return r-1};
  d.ringR=(a,f)=>{let r=4;while(r<half&&d.F(d.x+Math.cos(a)*r,d.y+Math.sin(a)*r)>f)r+=0.5;return r};
}
ISLETS.forEach(buildTerrain);
function addBridge(A,Bz){const a=Math.atan2(Bz.y-A.y,Bz.x-A.x),ra=A.coast(a)-5,rb=Bz.coast(a+Math.PI)-5;
  const b={x0:A.x+Math.cos(a)*ra,y0:A.y+Math.sin(a)*ra,x1:Bz.x-Math.cos(a)*rb,y1:Bz.y-Math.sin(a)*rb,a};b.len=Math.hypot(b.x1-b.x0,b.y1-b.y0);BRIDGES.push(b);
  const n=Math.ceil(b.len/26);b.segs=[];for(let i=0;i<n;i++){const t=n===1?0.5:(14+(b.len-28)*i/(n-1))/b.len;b.segs.push({m:M.plank,x:b.x0+(b.x1-b.x0)*t,y:b.y0+(b.y1-b.y0)*t,z:0,rot:a})}}
ZONES.forEach((z,i)=>{addBridge(HUB,z);addBridge(z,ZONES[(i+1)%10])});
function bridgeDist(x,y){let best=1e9;for(const b of BRIDGES){const dx=b.x1-b.x0,dy=b.y1-b.y0;let t=((x-b.x0)*dx+(y-b.y0)*dy)/(b.len*b.len);t=Math.max(0,Math.min(1,t));const q=Math.hypot(x-b.x0-dx*t,y-b.y0-dy*t);if(q<best)best=q}return best}
function bridgePoint(x,y){let best=1e9,r=[x,y];for(const b of BRIDGES){const dx=b.x1-b.x0,dy=b.y1-b.y0;let t=((x-b.x0)*dx+(y-b.y0)*dy)/(b.len*b.len);t=Math.max(0,Math.min(1,t));const px=b.x0+dx*t,py=b.y0+dy*t,q=Math.hypot(x-px,y-py);if(q<best){best=q;r=[px,py]}}return r}
function nearestBridge(x,y){let r={dist:1e9};for(const b of BRIDGES){const dx=b.x1-b.x0,dy=b.y1-b.y0;let t=((x-b.x0)*dx+(y-b.y0)*dy)/(b.len*b.len);t=Math.max(0,Math.min(1,t));const q=Math.hypot(x-b.x0-dx*t,y-b.y0-dy*t);if(q<r.dist)r={dist:q,b,t:t*b.len}}return r}
function proj(b,x,y){const ax=Math.cos(b.a),ay=Math.sin(b.a),t=Math.max(0,Math.min(b.len,(x-b.x0)*ax+(y-b.y0)*ay));return{t,dist:Math.hypot(x-b.x0-ax*t,y-b.y0-ay*t)}}
function isletOf(x,y){for(const d of ISLETS)if(Math.abs(x-d.x)<d.half&&Math.abs(y-d.y)<d.half&&d.level(x,y)>=0)return d;return null}
function mouths(d){if(!d.mouths){d.mouths=[];for(const b of BRIDGES){if(Math.hypot(b.x0-d.x,b.y0-d.y)<d.half)d.mouths.push([b.x0,b.y0,Math.cos(b.a),Math.sin(b.a),b]);if(Math.hypot(b.x1-d.x,b.y1-d.y)<d.half)d.mouths.push([b.x1,b.y1,-Math.cos(b.a),-Math.sin(b.a),b])}}return d.mouths}
function isletAt(x,y){for(const d of ISLETS)if(Math.abs(x-d.x)<d.half&&Math.abs(y-d.y)<d.half){const l=d.level(x,y);if(l>=0)return l}return -1}
const walkable=(x,y)=>isletAt(x,y)>=0||bridgeDist(x,y)<=3.6;
function groundZ(x,y){const l=isletAt(x,y);if(l>=1)return l*TS;return bridgeDist(x,y)<=3.6?3:Math.max(0,l)*TS}
function populate(d){
  const rnd=mulberry(d.seed+3),placed=[],W2=(a,r)=>[d.x+Math.cos(a)*r,d.y+Math.sin(a)*r];
  const free=(x,y,g)=>placed.every(q=>Math.hypot(q[0]-x,q[1]-y)>=(g+q[2])/2)&&bridgeDist(x,y)>g/2+5;
  d.altar={m:M.altar[0],x:d.x,y:d.y,z:2*TS,rot:0,altar:d};props.push(d.altar);placed.push([d.x,d.y,20]);
  if(!d.hub){const a0=rnd()*TAU;for(let k=0;k<10;k++){const a=a0+k*TAU/10,[x,y]=W2(a,d.ringR(a,0.42));OBJ.push({w:d.i*10+k,x,y,z:TS,isl:d.i,ph:rnd()*TAU,m:WD[d.i*10+k].m});placed.push([x,y,22])}}
  for(const k in d.decor)for(let n=0;n<d.decor[k];n++)for(let t=0;t<80;t++){const a=rnd()*TAU,inner=d.hub||rnd()<0.35,f=inner?0.53+rnd()*0.2:0.12+rnd()*0.2,[x,y]=W2(a,d.ringR(a,f));
    const g=k==='columns'?30:k==='hWhite'?20:(k==='bush'||k==='shrub'||k==='wheat'||k==='vine'||k==='ember')?6:10;if(d.level(x,y)!==1||!free(x,y,g))continue;
    if(g>=20){const e=g/2;if(d.level(x+e,y)!==1||d.level(x-e,y)!==1||d.level(x,y+e)!==1||d.level(x,y-e)!==1)continue}
    props.push({m:M[k],x,y,z:TS,rot:g>=20?a+Math.PI/2:rnd()*TAU});placed.push([x,y,g]);break}
}
ISLETS.forEach(populate);
const zoneObjs=i=>OBJ.slice(i*10,i*10+10);

/* ---------- state ---------- */
const SAVE='onomata-v1';
let S={found:{},lit:Array(10).fill(false)};
try{const s=JSON.parse(localStorage.getItem(SAVE));if(s&&s.lit&&s.lit.length===10)S=s}catch(e){}
const save=()=>{try{localStorage.setItem(SAVE,JSON.stringify(S))}catch(e){}};
const DEBUG=/[?&]debug/.test(location.search);
let state='title',muted=false,T=0;
const player={x:0,y:22,z:TS,dir:Math.PI/2,moving:false},cam={x:0,y:0,r:0},keys={},ptr={down:false,x:0,y:0};
const foundOn=i=>{let n=0;for(let k=0;k<10;k++)if(S.found[i*10+k])n++;return n};
const litN=()=>S.lit.filter(Boolean).length;
function syncLights(){ZONES.forEach((d,i)=>d.altar.m=M.altar[S.lit[i]?1:0]);HUB.altar.m=M.altar[litN()===10?1:0]}
syncLights();

/* ---------- audio ---------- */
let AC=null;
function beep(f,d=0.14,type='sine',vol=0.07,when=0){if(muted)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+when;o.type=type;o.frequency.value=f;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d)}catch(e){}}
const chime=()=>{beep(660,.15);beep(880,.2,'sine',.07,.1)},good=()=>{beep(784,.1);beep(1047,.18,'sine',.07,.09)},bad=()=>beep(196,.25,'triangle',.08),fanfare=()=>[523,659,784,1047,1319].forEach((f,i)=>beep(f,.3,'triangle',.07,i*.13));
function speak(t){if(muted||!('speechSynthesis'in window))return;try{const u=new SpeechSynthesisUtterance(t);u.lang='el-GR';const v=speechSynthesis.getVoices().find(v=>v.lang&&v.lang.toLowerCase().startsWith('el'));if(v)u.voice=v;u.rate=0.85;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
if('speechSynthesis'in window)try{speechSynthesis.getVoices()}catch(e){}

/* ---------- UI ---------- */
const show=(id,on)=>$(id).classList.toggle('on',on);
function hud(){$('hLit').textContent=litN();$('hFound').textContent=Object.keys(S.found).length;$('hLearn').textContent=litN()*10}
hud();
let cardW=-1;
function openCard(w){cardW=w;state='card';const i=Math.floor(w/10),d=ZONES[i];S.found[w]=1;save();hud();
  $('cKick').textContent=`Shrine of ${d.en} · ${d.theme} · ${foundOn(i)} of 10`;$('cEl').textContent=WD[w].el;$('cTr').textContent=WD[w].tr;$('cEn').textContent=WD[w].en;show('card',true);chime();setTimeout(()=>speak(WD[w].el),250)}
function closeCard(){if(state!=='card')return;show('card',false);state='play'}
$('cOk').onclick=closeCard;$('cHear').onclick=()=>speak(WD[cardW].el);

/* the trial, part 1: the god names a thing in Greek and you run to it */
let trial=null;
function startTrial(i,practice){trial={i,practice,q:shuffle([...Array(10)].map((_,k)=>({w:i*10+k}))),done:0,miss:0,last:null};state='fetch';show('ask',true);ask('')}
function ask(fb,ok){const w=WD[trial.q[0].w];$('aN').textContent=`${trial.done+1} / ${trial.done+trial.q.length}`;$('aEl').textContent=w.el;$('aTr').textContent=w.tr;$('aFb').textContent=fb||'Walk to the right thing.';$('aFb').style.color=fb?(ok?'#2c9a4b':'#d04a3a'):'#5a6f8f';if(!fb||ok)speak(w.el)}
function fetchHit(o){if(state!=='fetch'||!trial)return;const cur=trial.q[0];
  if(o.w===cur.w){good();trial.q.shift();trial.done++;if(!trial.q.length){show('ask',false);return startQuiz()}ask('Σωστά! Correct — next:',true)}
  else{bad();trial.miss++;if(!cur.missed){cur.missed=true;trial.q.push({w:cur.w,missed:true})}ask(`That one is ${WD[o.w].el} — “${WD[o.w].en}”. Keep looking.`,false)}}
function cancelTrial(){show('ask',false);trial=null;state='play'}
/* part 2: you are shown each sprite and must give its Greek name */
let quiz=null;
function startQuiz(){const i=trial.i,q=shuffle([...Array(10)].map((_,k)=>({w:i*10+k}))),others=[];S.lit.forEach((l,j)=>{if(l&&j!==i)for(let k=0;k<10;k++)others.push(j*10+k)});
  shuffle(others).slice(0,3).forEach(w=>q.push({w,review:true}));quiz={i,q,total:q.length,done:0,miss:trial.miss,practice:trial.practice,locked:false};trial=null;state='quiz';show('quiz',true);nextQ()}
function nextQ(){if(!quiz.q.length)return finishQuiz();const it=quiz.cur=quiz.q[0],isl=Math.floor(it.w/10);
  quiz.opts=shuffle(shuffle([...Array(10)].map((_,k)=>isl*10+k).filter(x=>x!==it.w)).slice(0,3).concat(it.w));
  $('qBar').style.width=(quiz.done/quiz.total*100)+'%';$('qFb').textContent='';$('qRow').innerHTML='';$('qSpr').style.display='';$('qBig').textContent='';$('qTr').textContent='';
  $('qKick').textContent=(it.review?`Review from ${ZONES[isl].en} · `:'')+'What is this called in Greek?';
  $('qOpts').innerHTML=quiz.opts.map((o,k)=>`<button class="opt gr" data-k="${k}"><i>${k+1}</i>${WD[o].el}<small>${WD[o].tr}</small></button>`).join('');
  $('qOpts').style.display='';[...$('qOpts').children].forEach(b=>b.onclick=()=>answer(+b.dataset.k))}
function answer(k){if(!quiz||quiz.locked||state!=='quiz'||!quiz.cur||k<0||k>=quiz.opts.length)return;quiz.locked=true;const it=quiz.cur,ok=quiz.opts[k]===it.w,w=WD[it.w],bs=[...$('qOpts').children];
  bs[quiz.opts.indexOf(it.w)].classList.add('ok');if(!ok)bs[k].classList.add('bad');speak(w.el);
  if(ok){quiz.q.shift();quiz.done++;good();$('qFb').style.color='#2c9a4b';$('qFb').textContent=`Σωστά! ${w.el} = ${w.en}`}
  else{quiz.miss++;quiz.q.push(quiz.q.shift());bad();$('qFb').style.color='#d04a3a';$('qFb').textContent=`${w.el} (${w.tr}) = ${w.en} — it will come back`}
  setTimeout(()=>{if(!quiz)return;quiz.locked=false;nextQ()},ok?(DEBUG?60:900):2400)}
function finishQuiz(){const d=ZONES[quiz.i],first=!quiz.practice&&!S.lit[quiz.i];quiz.cur=null;
  if(first){S.lit[quiz.i]=true;save();syncLights();hud()}
  const all=litN()===10;fanfare();$('qBar').style.width='100%';$('qOpts').style.display='none';$('qSpr').style.display='none';
  if(first&&all){$('qKick').textContent='All ten shrines burn again';$('qBig').textContent='Ο Όλυμπος θυμάται!';$('qTr').textContent='o Ólimbos thimáte — “Olympus remembers”';$('qFb').style.color='#0b2a55';$('qFb').textContent='You have learned 100 Greek words. Συγχαρητήρια — congratulations!'}
  else{$('qKick').textContent=first?`The shrine of ${d.en} is lit`:`${d.en} · practice complete`;$('qBig').textContent=first?'Η φλόγα άναψε!':'Μπράβο!';$('qTr').textContent=first?'i flóga ánapse — “the flame is lit”':'brávo — “well done”';
    $('qFb').style.color='#0b2a55';$('qFb').textContent=`${quiz.miss?quiz.miss+' slip'+(quiz.miss>1?'s':'')+', all corrected.':'A perfect run.'}${first?' Ten more words learned — cross a bridge to the next dark shrine.':''}`}
  $('qRow').innerHTML='<button class="pb" id="qDone">Walk on (Space)</button>';$('qDone').onclick=closeQuiz}
function closeQuiz(){show('quiz',false);quiz=null;state='play'}

function icon(w,s){const c=mk(26,30),x=c.getContext('2d');x.imageSmoothingEnabled=false;drawStack(x,WD[w].m,13,23,0.6);c.style.width=26*s+'px';c.className='ic';return c}
let resetArm=false;
function openLex(){if(state!=='play'&&state!=='lex')return;state='lex';const body=$('lexBody');body.innerHTML='';
  ZONES.forEach((d,i)=>{body.insertAdjacentHTML('beforeend',`<h3>${S.lit[i]?'★':'☆'} <span class="gr">${d.el}</span> · ${d.en} — ${d.theme} (${foundOn(i)}/10)</h3>`);const g=document.createElement('div');g.className='lw';
    for(let k=0;k<10;k++){const w=i*10+k,e=document.createElement('div');if(S.found[w]){e.appendChild(icon(w,1.5));e.insertAdjacentHTML('beforeend',`<span><b class="gr">${WD[w].el}</b> <em>${WD[w].tr}</em><br>${WD[w].en}</span>`);e.onclick=()=>speak(WD[w].el)}else{e.className='no';e.textContent='· · ·'}g.appendChild(e)}body.appendChild(g)});
  $('lexReset').textContent='Reset progress';resetArm=false;show('lex',true)}
function closeLex(){show('lex',false);state='play'}
$('lexClose').onclick=closeLex;$('bLex').onclick=openLex;
$('lexReset').onclick=()=>{if(!resetArm){resetArm=true;$('lexReset').textContent='Click again to erase everything';return}S={found:{},lit:Array(10).fill(false)};GAME.S=S;save();syncLights();hud();closeLex()};
$('bMute').onclick=()=>{muted=!muted;$('bMute').textContent=muted?'Sound off':'Sound on';if(muted&&'speechSynthesis'in window)speechSynthesis.cancel()};
$('bStart').onclick=()=>{show('title',false);state='play';beep(440,.01,'sine',.001)};
let curZone=-1,atAltar=-1;
function act(){if(state==='fetch'&&trial)return speak(WD[trial.q[0].w].el);if(state!=='play'||atAltar<0)return;if(S.lit[atAltar])startTrial(atAltar,true);else if(foundOn(atAltar)===10)startTrial(atAltar,false)}
$('act').onclick=act;$('aQuit').onclick=cancelTrial;$('aHear').onclick=act;

addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=true;
  if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();
  if(state==='title'&&(k==='enter'||k===' '))return $('bStart').onclick();
  if(state==='card'&&(k==='enter'||k===' '))return closeCard();
  if(state==='quiz'){if(k>='1'&&k<='4'&&quiz.cur)answer(+k-1);else if((k==='enter'||k===' ')&&$('qDone'))closeQuiz();else if(k==='escape')closeQuiz();else if(DEBUG&&k==='p'&&quiz.cur)answer(quiz.opts.indexOf(quiz.cur.w));return}
  if(state==='lex'){if(k==='escape'||k==='l')closeLex();return}
  if(state==='fetch'){if(k==='escape')cancelTrial();else if(k===' '||k==='enter')act();else if(DEBUG&&k==='f')fetchHit(OBJ[trial.q[0].w]);return}
  if(state==='play'){if(k==='l')openLex();else if(k===' '||k==='enter')act();
    else if(DEBUG&&k==='g'&&curZone>=0){for(let j=0;j<10;j++)S.found[curZone*10+j]=1;save();hud()}
    else if(DEBUG&&k==='t'){const i=S.lit.indexOf(false);if(i>=0){player.x=ZONES[i].x;player.y=ZONES[i].y+12}}}
});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;ptr.down=false});

/* ---------- canvas ---------- */
const cv=$('c'),ctx=cv.getContext('2d');let BW=356,BH=200,CX=178,CY=112;
function resize(){BH=innerWidth<innerHeight?270:200;BW=Math.max(150,Math.min(520,Math.round(BH*innerWidth/innerHeight)));cv.width=BW;cv.height=BH;CX=BW/2;CY=Math.round(BH*0.56);ctx.imageSmoothingEnabled=false}
addEventListener('resize',resize);resize();
const setPtr=e=>{ptr.x=e.clientX/innerWidth*BW;ptr.y=e.clientY/innerHeight*BH};
cv.addEventListener('pointerdown',e=>{ptr.down=true;setPtr(e);try{cv.setPointerCapture(e.pointerId)}catch(_){}});
cv.addEventListener('pointermove',setPtr);cv.addEventListener('pointerup',()=>ptr.down=false);cv.addEventListener('pointercancel',()=>ptr.down=false);
function toScreen(wx,wy){const dx=wx-cam.x,dy=wy-cam.y,c=Math.cos(cam.r),s=Math.sin(cam.r);return[CX+dx*c-dy*s,CY+(dx*s+dy*c)*K]}
function worldT(z){ctx.setTransform(1,0,0,K,CX,CY-(z||0));ctx.rotate(cam.r);ctx.translate(-cam.x,-cam.y)}

/* ---------- update ---------- */
let hintTxt='',banTxt='',target=null,touched=null,seek=null;
function update(dt){
  T+=dt;
  if(state==='title'){cam.r+=dt*0.1;cam.x=ZONES[0].x*0.5;cam.y=ZONES[0].y*0.62;return}
  player.moving=false;
  if(state==='play'||state==='fetch'){
    let ix=0,iy=0;if(keys['a']||keys['arrowleft'])ix-=1;if(keys['d']||keys['arrowright'])ix+=1;if(keys['w']||keys['arrowup'])iy-=1;if(keys['s']||keys['arrowdown'])iy+=1;
    if(ptr.down){const[px,py]=toScreen(player.x,player.y),vx=ptr.x-px,vy=(ptr.y-(py-player.z))/K,l=Math.hypot(vx,vy);if(l>6){ix=vx/l;iy=vy/l}}
    const l=Math.hypot(ix,iy);
    if(l<=0.01)seek=null;
    if(l>0.01){ix/=l;iy/=l;const c=Math.cos(cam.r),s=Math.sin(cam.r),wx=ix*c+iy*s,wy=-ix*s+iy*c,sp=66*dt,nx=player.x+wx*sp,ny=player.y+wy*sp;
      let mv=false;const step=(tx,ty)=>{const l2=Math.hypot(tx-player.x,ty-player.y);if(l2<0.05)return false;const ux=(tx-player.x)/l2,uy=(ty-player.y)/l2,m=Math.min(sp,l2),qx=player.x+ux*m,qy=player.y+uy*m;
        if(!walkable(qx,qy))return false;player.x=qx;player.y=qy;player.dir=Math.atan2(uy,ux);return true};
      if(seek&&(T>seek.t||wx*seek.wx+wy*seek.wy<0.6||Math.hypot(seek.m[0]-player.x,seek.m[1]-player.y)<1.5))seek=null;
      if(seek){mv=step(seek.m[0],seek.m[1]);if(!mv)seek=null}
      if(mv){}else if(walkable(nx,ny)){player.x=nx;player.y=ny;player.dir=Math.atan2(wy,wx);mv=true}
      else{ // blocked by an edge: ride the bridge you are on, or head for the bridge that leads where you are pushing
        const d=isletOf(player.x,player.y);let rb=null;
        if(!d){const nb=nearestBridge(player.x,player.y);if(nb.dist<4.4)rb=nb.b}
        else{let best=null,bd=0.3;for(const m of mouths(d)){const dt2=m[2]*wx+m[3]*wy;if(dt2>bd){bd=dt2;best=m}}
          if(best){if(proj(best[4],player.x,player.y).dist<4.4)rb=best[4];else{seek={m:best,wx,wy,t:T+4};mv=step(best[0],best[1])}}}
        if(rb&&!mv){const ax=Math.cos(rb.a),ay=Math.sin(rb.a),dp=wx*ax+wy*ay;if(Math.abs(dp)>0.15){const t2=Math.max(0,Math.min(rb.len,proj(rb,player.x,player.y).t+Math.sign(dp)*sp*1.5));mv=step(rb.x0+ax*t2,rb.y0+ay*t2)}}
        if(!mv)for(const da of[0.5,-0.5,1,-1,1.45,-1.45]){const ca=Math.cos(da),sa=Math.sin(da);if(step(player.x+(wx*ca-wy*sa)*sp,player.y+(wx*sa+wy*ca)*sp)){mv=true;break}}
      }
      if(!mv)player.dir=Math.atan2(wy,wx);player.moving=mv;cam.r-=ix*0.28*dt}
    if(keys['q'])cam.r+=dt*1.5;if(keys['e'])cam.r-=dt*1.5;
    const list=curZone>=0?zoneObjs(curZone):[];
    if(touched&&Math.hypot(touched.x-player.x,touched.y-player.y)>15)touched=null;
    for(const o of list){if(o===touched||Math.hypot(o.x-player.x,o.y-player.y)>9.5)continue;touched=o;
      if(state==='fetch'){if(trial.i===o.isl)fetchHit(o)}else if(!S.found[o.w])openCard(o.w);else speak(WD[o.w].el);break}
  }
  player.z+=(groundZ(player.x,player.y)-player.z)*Math.min(1,dt*14);
  cam.x+=(player.x-cam.x)*Math.min(1,dt*5);cam.y+=(player.y-cam.y)*Math.min(1,dt*5);
  // where am I, what next
  curZone=-1;atAltar=-1;for(const d of ZONES){const q=Math.hypot(d.x-player.x,d.y-player.y);if(q<d.r*1.2)curZone=d.i;if(q<15)atAltar=d.i}
  let h='',b='';target=null;
  if(curZone>=0){const d=ZONES[curZone],n=foundOn(curZone);b=`${d.el}|Shrine of ${d.en} · ${d.theme} · ${S.lit[curZone]?'flame lit ★':'named '+n+'/10'}`;
    if(!S.lit[curZone]){if(n<10){let bd=1e9;for(const o of zoneObjs(curZone))if(!S.found[o.w]){const q=Math.hypot(o.x-player.x,o.y-player.y);if(q<bd){bd=q;target=o}}h=`Walk up to each thing on a pedestal to learn its name — ${10-n} left here`}
      else{target=d;h=`You know all ten. Step up to ${d.en}'s altar for the trial`}}}
  if(!target&&state==='play'){let bd=1e9,ti=-1;S.lit.forEach((l,i)=>{if(!l&&i!==curZone){const q=Math.hypot(ZONES[i].x-player.x,ZONES[i].y-player.y);if(q<bd){bd=q;ti=i}}});
    if(ti>=0&&(curZone<0||S.lit[curZone])){target=ZONES[ti];h=`Cross the bridges to the shrine of ${ZONES[ti].en} — its flame is out`}else if(litN()===10)h='Every shrine burns. Wander freely, or step up to any altar to practise.'}
  const A=$('act');
  if(state==='play'&&atAltar>=0){const dn=foundOn(atAltar);if(S.lit[atAltar]){A.textContent='Practise this shrine (Space)';A.style.display='block'}else if(dn===10){A.textContent='Begin the trial (Space)';A.style.display='block'}else{A.style.display='none';h=`${ZONES[atAltar].en} wants you to learn all ten names first — ${10-dn} to go`}}
  else A.style.display='none';
  if(state!=='play')h='';
  if(h!==hintTxt){hintTxt=h;$('hint').textContent=h;$('hint').style.display=h?'block':'none'}
  if(state==='fetch')b='';
  if(b!==banTxt){banTxt=b;const p=b.split('|');$('bn').textContent=p[0]||'';$('bs').textContent=p[1]||'';$('banner').style.opacity=b?1:0}
}

/* ---------- render ---------- */
const vis=[],tags=[...Array(10)].map(()=>{const e=document.createElement('div');e.className='tag gr';document.body.appendChild(e);return e});
function render(){
  const p=litN()/10;
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;const sky=ctx.createLinearGradient(0,0,0,BH);sky.addColorStop(0,'#6fb8ee');sky.addColorStop(1,'#a8dcf8');ctx.fillStyle=sky;ctx.fillRect(0,0,BW,BH);
  // the sea of clouds far below
  {const C=120,off=T*5,x0=Math.floor((cam.x-off-420)/C),y0=Math.floor((cam.y-420)/C);ctx.globalAlpha=0.8;
   for(let gy=y0;gy<y0+8;gy++)for(let gx=x0;gx<x0+8;gx++){const h=hash2(gx,gy,31);if(h>0.62)continue;const[sx,sy]=toScreen(gx*C+h*90+off,gy*C+hash2(gx,gy,57)*90);if(sx<-40||sx>BW+40||sy<-80||sy>BH+10)continue;
     const s=sprite(M.cloud[(h*30|0)%3],h*20+cam.r);ctx.drawImage(s.cv,Math.round(sx-s.ox),Math.round(sy+55-s.oy))}ctx.globalAlpha=1}
  const near=ISLETS.filter(d=>Math.hypot(d.x-cam.x,d.y-cam.y)<d.half*1.45+330);
  for(const d of near){for(let k=11;k>=1;k--){const s=1-k*0.06;ctx.setTransform(1,0,0,K,CX,CY+k*2.2);ctx.rotate(cam.r);ctx.translate(d.x-cam.x,d.y-cam.y);ctx.scale(s,s);ctx.drawImage(d.under,-d.half,-d.half)}
    worldT(0);ctx.drawImage(d.tops[0],d.x-d.half,d.y-d.half);
    for(let l=1;l<=2;l++){worldT(l*TS-2);ctx.drawImage(d.sides[l],d.x-d.half,d.y-d.half);worldT(l*TS-1);ctx.drawImage(d.sides[l],d.x-d.half,d.y-d.half);worldT(l*TS);ctx.drawImage(d.tops[l],d.x-d.half,d.y-d.half)}}
  const cr=Math.cos(cam.r),sr=Math.sin(cam.r);
  const scr=o=>{const dx=o.x-cam.x,dy=o.y-cam.y;if(dx*dx+dy*dy>380*380)return false;o.sx=CX+dx*cr-dy*sr;o.sy=CY+(dx*sr+dy*cr)*K;return o.sx>-40&&o.sx<BW+40&&o.sy>-30&&o.sy<BH+60};
  ctx.setTransform(1,0,0,1,0,0);
  for(const b of BRIDGES)for(const o of b.segs)if(scr(o)){const s=sprite(o.m,o.rot+cam.r);ctx.drawImage(s.cv,Math.round(o.sx-s.ox),Math.round(o.sy-s.oy))}
  // rings under things not yet named
  worldT(TS);ctx.lineWidth=1.5;for(const o of OBJ){if(S.found[o.w]||Math.hypot(o.x-cam.x,o.y-cam.y)>380)continue;ctx.strokeStyle='rgba(255,232,120,.9)';ctx.beginPath();ctx.arc(o.x,o.y,8+1.5*Math.sin(T*3+o.ph),0,TAU);ctx.stroke()}
  for(const d of ZONES){const ready=!S.lit[d.i]&&foundOn(d.i)===10;if(!ready||Math.hypot(d.x-cam.x,d.y-cam.y)>380)continue;worldT(2*TS);ctx.strokeStyle='rgba(255,217,94,.95)';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(d.x,d.y,12+2*Math.sin(T*4),0,TAU);ctx.stroke()}
  vis.length=0;for(const o of props)if(scr(o))vis.push(o);for(const o of OBJ)if(scr(o))vis.push(o);
  const hero={hero:true,x:player.x,y:player.y};scr(hero);vis.push(hero);vis.sort((a,b)=>a.sy-b.sy);
  ctx.setTransform(1,0,0,1,0,0);const shx=3*cr-2*sr,shy=(3*sr+2*cr)*K;ctx.fillStyle='rgba(8,25,45,.2)';
  for(const o of vis){if(o.hero)continue;const r=o.m.sr*(o.w!=null?0.8:1);ctx.beginPath();ctx.ellipse(o.sx+shx*r/5,o.sy-o.z+shy*r/5,r,r*K,0,0,TAU);ctx.fill()}
  for(const o of vis){
    if(o.hero){ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='rgba(8,25,45,.25)';ctx.beginPath();ctx.ellipse(o.sx,o.sy-player.z,4,3,0,0,TAU);ctx.fill();
      const f=player.moving?1+(Math.floor(T*9)&1):0;drawStack(ctx,M.hero[f],Math.round(o.sx),Math.round(o.sy-player.z-(player.moving?Math.abs(Math.sin(T*9))*1.2:0)),player.dir+cam.r);ctx.setTransform(1,0,0,1,0,0);continue}
    if(o.w!=null){const s=sprite(M.ped,cam.r);ctx.drawImage(s.cv,Math.round(o.sx-s.ox),Math.round(o.sy-o.z-s.oy));
      drawStack(ctx,o.m,Math.round(o.sx),Math.round(o.sy-o.z-3-1-Math.sin(T*2+o.ph)*0.8),T*0.7+o.ph+cam.r);ctx.setTransform(1,0,0,1,0,0);continue}
    const s=sprite(o.m,o.rot+cam.r);ctx.drawImage(s.cv,Math.round(o.sx-s.ox),Math.round(o.sy-o.z-s.oy));
    if(o.altar&&o.m===M.altar[1]){const fl=sprite(M.flame[Math.floor(T*8)&1],T*2);ctx.drawImage(fl.cv,Math.round(o.sx-fl.ox),Math.round(o.sy-o.z-5-fl.oy))}}
  // evening comes as the shrines are lit
  if(p>0){ctx.fillStyle=`rgba(255,120,50,${(Math.sin(Math.PI*p)*0.15).toFixed(3)})`;ctx.fillRect(0,0,BW,BH);ctx.fillStyle=`rgba(10,18,60,${(Math.pow(p,1.5)*0.42).toFixed(3)})`;ctx.fillRect(0,0,BW,BH)}
  ctx.globalCompositeOperation='lighter';
  for(const d of ISLETS){if(d.altar.m!==M.altar[1]||!scr(d.altar))continue;const sx=d.altar.sx,sy=d.altar.sy-d.altar.z-9,fl=1+0.15*Math.sin(T*9);
    const g=ctx.createRadialGradient(sx,sy,0,sx,sy,26*fl);g.addColorStop(0,'rgba(255,220,130,.75)');g.addColorStop(1,'rgba(255,200,100,0)');ctx.fillStyle=g;ctx.fillRect(sx-30,sy-30,60,60);
    const b=ctx.createLinearGradient(0,sy-90,0,sy);b.addColorStop(0,'rgba(255,230,150,0)');b.addColorStop(1,'rgba(255,230,150,.45)');ctx.fillStyle=b;ctx.fillRect(sx-3,sy-90,6,90)}
  ctx.globalCompositeOperation='source-over';
  if(state==='play'&&target){const dist=Math.hypot(target.x-player.x,target.y-player.y);if(dist>40){const[bx,by]=toScreen(player.x,player.y),[tx,ty]=toScreen(target.x,target.y),a=Math.atan2(ty-by,tx-bx),ax=bx+Math.cos(a)*24,ay=by-player.z-6+Math.sin(a)*24*0.85;
    ctx.setTransform(1,0,0,1,ax,ay);ctx.rotate(a);ctx.fillStyle='#ffd95e';ctx.strokeStyle='#0b2a55';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(-3,-4);ctx.lineTo(-1,0);ctx.lineTo(-3,4);ctx.closePath();ctx.fill();ctx.stroke();ctx.setTransform(1,0,0,1,0,0)}}
  // name tags over things you have already named (never during a trial)
  const objs=state==='play'&&curZone>=0?zoneObjs(curZone):[];
  for(let i=0;i<10;i++){const o=objs[i],e=tags[i];if(!o||!S.found[o.w]||!scr(o)){if(e.style.display!=='none')e.style.display='none';continue}
    if(e.textContent!==WD[o.w].el)e.textContent=WD[o.w].el;e.style.display='block';e.style.left=(o.sx/BW*innerWidth)+'px';e.style.top=((o.sy-o.z-o.m.h-10)/BH*innerHeight)+'px'}
}
const mc=$('mini').getContext('2d');
function minimap(){mc.clearRect(0,0,128,128);const s=128/960,o=64;mc.strokeStyle='rgba(255,255,255,.55)';mc.lineWidth=1.5;for(const b of BRIDGES){mc.beginPath();mc.moveTo(o+b.x0*s,o+b.y0*s);mc.lineTo(o+b.x1*s,o+b.y1*s);mc.stroke()}
  for(const d of ISLETS){mc.fillStyle=d.hub?'#cfe0b8':S.lit[d.i]?'#ffd95e':foundOn(d.i)===10?'#ffffff':'#8fb0d4';mc.beginPath();mc.arc(o+d.x*s,o+d.y*s,d.r*s,0,TAU);mc.fill()}
  mc.fillStyle='#ff5a4a';mc.strokeStyle='#fff';mc.lineWidth=1;mc.beginPath();mc.arc(o+player.x*s,o+player.y*s,3.5,0,TAU);mc.fill();mc.stroke()}
const spin={c:$('cSpr').getContext('2d'),q:$('qSpr').getContext('2d')};
function drawSpin(x,w){const m=WD[w].m,c=x.canvas,dg=Math.ceil(Math.hypot(m.w,m.d))+4,ch=Math.ceil(dg*K)+m.h+4;if(c.width!==dg||c.height!==ch){c.width=dg;c.height=ch}
  x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,dg,ch);x.imageSmoothingEnabled=false;drawStack(x,m,dg/2,ch-Math.ceil(dg*K/2)-2,T*1.1);x.setTransform(1,0,0,1,0,0)}

let last=performance.now(),fr=0;
function frame(now){const dt=Math.min(0.05,(now-last)/1000);last=now;update(dt);render();if(state==='card')drawSpin(spin.c,cardW);if(state==='quiz'&&quiz&&quiz.cur)drawSpin(spin.q,quiz.cur.w);if(fr++%6===0)minimap();requestAnimationFrame(frame)}
requestAnimationFrame(frame);
function selfTest(){const r={words:WD.length,objs:OBJ.length,objsOffGrass:0,altarsOff:0,bridgeGaps:0,bridges:BRIDGES.length,tooClose:0};
  for(const o of OBJ){if(ZONES[o.isl].level(o.x,o.y)!==1)r.objsOffGrass++;for(const q of OBJ)if(q!==o&&Math.hypot(q.x-o.x,q.y-o.y)<19)r.tooClose++}
  for(const d of ISLETS)if(d.level(d.x,d.y)!==2)r.altarsOff++;
  for(const b of BRIDGES)for(let t=-8;t<=b.len+8;t++){const x=b.x0+Math.cos(b.a)*t,y=b.y0+Math.sin(b.a)*t;if(!walkable(x,y))r.bridgeGaps++}return r}
window.GAME={S,player,cam,ZONES,OBJ,WD,get state(){return state},get trial(){return trial},get quiz(){return quiz},get curZone(){return curZone},startTrial,fetchHit,answer,openCard,closeCard,closeQuiz,selfTest};
