'use strict';
/* ΟΝΟΜΑΤΑ — a walking game on the sky-islands of Olympus. Needs sprites.js (WD = the 100 words + models). */
const TS=3,$=id=>document.getElementById(id);
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function angDiff(a,b){let d=(a-b)%TAU;if(d>Math.PI)d-=TAU;if(d<-Math.PI)d+=TAU;return d}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/* ---------- scenery, hero and pickup models ---------- */
const mBush=(c,s)=>bake(B(7,7,5,v=>v.ell(3,3,1.5,3.2,3.2,3,pick(c,s))));
function mHero(f,tier){return bake(B(7,7,15,v=>{const a=f===1?1:f===2?-1:0,lx=3+a,rx=3-a,tunic=tier>=3?0xf6dc8a:WH,wing=tier>=1?GD:WH;
  v.box(lx,2,0,lx,2,3,SK);v.set(lx,2,0,BR);v.box(rx,4,0,rx,4,3,SK);v.set(rx,4,0,BR);
  v.box(2,1,4,4,5,8,tunic);v.box(2,1,5,4,5,5,GD);v.box(3-a,0,5,3-a,0,8,SK);v.box(3+a,6,5,3+a,6,8,SK);
  if(tier>=2)v.box(1,2,3,1,4,8,RD);else v.box(1,5,4,2,6,6,RD);
  v.box(2,2,9,4,4,11,SK);v.set(4,2,10,BK);v.set(4,4,10,BK);v.box(1,1,12,5,5,12,BLUE);v.box(2,2,13,4,4,13,BLUE);v.box(2,0,12,3,0,14,wing);v.box(2,6,12,3,6,14,wing);
  if(tier>=1){v.set(1,0,13,wing);v.set(1,6,13,wing)}}))}
function mAltar(lit){return bake(B(11,11,6,v=>{v.box(0,0,0,10,10,0,0xcfcabb);v.box(2,2,1,8,8,3,(x,y,z)=>z===2&&((x+y)&1)?BLUE:MARBLE);v.ring(5,5,4,5,2,3.6,0x8a6a2a);v.cyl(5,5,4,4,2,lit?OR:0x33302e)}))}
function mFlame(s){return bake(B(9,9,11,v=>v.cyl(4,4,0,9,z=>[2.6,3,2.8,2.4,2,1.7,1.3,1,0.7,0.4][z]+(s?((z%2)?0.3:-0.2):0),(x,y,z)=>{const d=Math.hypot(x-4,y-4);return d<1.1&&z<6?0xfff0a0:z>6?RD:d<2?YL:OR})))}
function mCloud(s){const r=mulberry(s);return bake(B(30,18,7,v=>{for(let i=0;i<6;i++)v.ell(6+r()*18,5+r()*8,2+r()*2,4+r()*4,3+r()*3,2+r()*2,pick([0xffffff,0xf1f5f9,0xffffff],11))}))}
function mChest(open){return bake(B(11,8,open?11:8,v=>{v.box(0,0,0,10,7,4,(x,y,z)=>x===2||x===8?GD:0x8a5a34);v.box(1,1,4,9,6,4,open?GD:0x6a4428);
  if(open){v.box(0,0,5,10,1,9,(x,y,z)=>x===2||x===8?GD:0x8a5a34);v.box(0,0,10,10,0,10,0x6a4428);for(const[x,y]of[[3,3],[5,4],[7,3],[4,5],[6,5]])v.set(x,y,5,x%2?0xfff0a0:GD);v.set(5,3,6,RD)}
  else{v.box(0,0,5,10,7,6,(x,y,z)=>x===2||x===8?GD:0x9a6a3a);v.box(1,1,7,9,6,7,(x,y,z)=>x===2||x===8?GD:0x9a6a3a);v.box(5,7,3,5,7,5,GD)}}))}
function mLetter(ch){const c=mk(13,15),x=c.getContext('2d',{willReadFrequently:true});x.font='bold 14px Georgia,"Times New Roman",serif';x.textAlign='center';x.fillStyle='#000';x.fillText(ch,6.5,12.5);const d=x.getImageData(0,0,13,15).data;let n=0;
  const m=bake(B(13,5,16,v=>{v.box(4,1,0,8,3,0,0xcfcabb);for(let py=0;py<15;py++)for(let px=0;px<13;px++)if(d[(px+py*13)*4+3]>100){n++;v.box(px,1,15-py,px,3,15-py,py>9?0x4a9af0:WH)}if(n<8)v.box(4,1,3,8,3,11,WH)}));m.glyph=n;return m}
const M={
  olive:bake(B(11,11,13,v=>{v.box(5,5,0,6,6,5,0x6e5a44);v.ell(5.5,5.5,8.5,5,5,4,pick([0x7f9a6a,0x6b8a5a,0x8fa878,0x5f7d50],1))})),
  lemon:bake(B(11,11,12,v=>{v.box(5,5,0,5,5,4,0x6e4a2c);v.ell(5.5,5.5,7.5,5,5,3.6,pick([0x3f8a3c,0x4a9a44,0x3f8a3c,0x357a34,0xf2d53c],2))})),
  cypress:bake(B(7,7,21,v=>{v.box(3,3,0,3,3,1,0x5a4030);v.cyl(3,3,2,20,z=>3.1*(1-(z-2)/20)+0.5,pick([0x2f5d3a,0x285233,0x356843],3))})),
  pine:bake(B(13,13,15,v=>{v.box(6,6,0,6,6,9,0x6a4a30);v.ell(6,6,11,6,6,2.8,pick([0x3f7a45,0x35693c,0x4a8a50],4))})),
  bush:mBush([0xd6368f,0xc22a80,0xe24aa0,0x3f8a3c],6),shrub:mBush([0x6f8f4f,0x5f7f45,0x86a35c],7),wheat:mBush([0xe8c860,0xd9b040,0xf0d878],8),vine:mBush([0x7b3fa0,0x4c9a3f,0x3f8a3c,0x5c2a80],9),ember:mBush([0xd23b2e,0xf28c1e,0x4a4a50,0x3a3a40],10),
  rock:bake(B(9,8,5,v=>v.ell(4,3.5,1,4,3.4,3.4,pick([0x9a958c,0x878279,0xaaa59c],7)))),
  columns:bake(B(24,13,15,v=>{v.box(0,0,0,23,12,0,0xd4cfc0);v.box(1,1,1,22,11,1,MARBLE);const hs=[12,12,9,12,5,12,7,12,12,4];
    [2,7,12,17,20].forEach((x,i)=>[2,9].forEach((y,j)=>{const top=hs[i+j*5];v.box(x,y,2,x+1,y+1,top,pick([MARBLE,0xddd7c6,0xf2eee2],10));if(top===12)v.box(x-1,y,12,x+2,y+1,12,MARBLE)}));v.box(1,2,13,9,3,14,MARBLE);v.box(15,9,13,22,10,13,MARBLE)})),
  plank:bake(B(28,7,4,v=>{for(let x=0;x<28;x++)v.box(x,1,2,x,5,2,x%3?0xb89468:0xa07e54);for(let x=1;x<28;x+=6){v.box(x,0,0,x,0,3,DWOOD);v.box(x,6,0,x,6,3,DWOOD)}})),
  ped:bake(B(9,9,3,v=>{v.cyl(4,4,0,0,4.4,0xcfcabb);v.cyl(4,4,1,2,3.4,MARBLE)})),
  feather:bake(B(5,3,10,v=>v.plate(0,2,(x,z)=>{if(x===2&&z<=2)return 0xfff6d8;const w=z<3?0:z<5?1.2:z<8?2.2:1.2;return z>=2&&z<=9&&Math.abs(x-2)<=w?(x===2?0xfff0a0:GD):null}))),
  bird:[bake(B(7,9,3,v=>{v.box(2,4,1,5,4,1,WH);v.set(6,4,1,OR);v.box(3,1,1,4,7,1,0xe8eef5)})),bake(B(7,9,3,v=>{v.box(2,4,1,5,4,1,WH);v.set(6,4,1,OR);v.box(3,3,1,4,5,1,0xe8eef5);v.box(3,1,2,4,2,2,0xe8eef5);v.box(3,6,2,4,7,2,0xe8eef5)}))],
  altar:[mAltar(false),mAltar(true)],flame:[mFlame(0),mFlame(1)],cloud:[mCloud(1),mCloud(2),mCloud(3)],chest:[mChest(false),mChest(true)],
  hero:[0,1,2,3].map(t=>[mHero(0,t),mHero(1,t),mHero(2,t)])};
const ALPHA=[['Α','α','άλφα','álfa','a, as in “father”'],['Β','β','βήτα','víta','v'],['Γ','γ','γάμμα','gáma','a soft gh; y before e and i'],['Δ','δ','δέλτα','délta','th, as in “this”'],['Ε','ε','έψιλον','épsilon','e, as in “met”'],['Ζ','ζ','ζήτα','zíta','z'],
  ['Η','η','ήτα','íta','ee'],['Θ','θ','θήτα','thíta','th, as in “think”'],['Ι','ι','ιώτα','ióta','ee'],['Κ','κ','κάππα','kápa','k'],['Λ','λ','λάμδα','lámda','l'],['Μ','μ','μι','mi','m'],
  ['Ν','ν','νι','ni','n'],['Ξ','ξ','ξι','xi','x (ks)'],['Ο','ο','όμικρον','ómikron','o, as in “pot”'],['Π','π','πι','pi','p'],['Ρ','ρ','ρο','ro','a rolled r'],['Σ','σ','σίγμα','sígma','s'],
  ['Τ','τ','ταυ','taf','t'],['Υ','υ','ύψιλον','ípsilon','ee'],['Φ','φ','φι','fi','f'],['Χ','χ','χι','hi','h, as in “loch”'],['Ψ','ψ','ψι','psi','ps'],['Ω','ω','ωμέγα','oméga','o']];
ALPHA.forEach(a=>a.m=mLetter(a[0]));

/* ---------- world: a hub, ten shrine islets and four hidden islets, floating above the clouds ---------- */
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
ZONES.forEach((z,i)=>{const a=-Math.PI/2+i*TAU/10;z.a=a;z.x=Math.cos(a)*RING;z.y=Math.sin(a)*RING;z.r=80;z.seed=101+i*17;z.i=i;z.kind='zone'});
const HUB={el:'Όλυμπος',en:'Olympus',theme:'',grass:0xa9c47a,decor:{columns:2,cypress:8,bush:8},x:0,y:0,r:66,seed:7,i:-1,hub:true,kind:'hub'};
const SECRETS=[1,3,6,8].map((zi,k)=>{const z=ZONES[zi],f=(RING+178)/RING;return{en:['the Hidden Garden','the Lost Terrace','the Quiet Rock','the Far Ledge'][k],grass:[0x8fd0a0,0xd0c890,0xa0b8d0,0xc8a8c8][k],decor:{cypress:2,bush:4,shrub:3},x:z.x*f,y:z.y*f,r:36,seed:900+k*13,k,zi,kind:'secret'}});
const ISLETS=[HUB,...ZONES,...SECRETS],props=[],OBJ=[],BRIDGES=[],FEATHERS=[],LETTERS=[],SOLIDS=[];

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
      if(d.kind==='zone'&&Math.abs(f-0.42)<0.045&&hash2(x,y,d.seed+5)>0.22)return rgb(0xdcd3be,n);if(hash2(x,y,d.seed+77)>0.985)return rgb(d.grass,n*0.8);
      const edge=at(x-1,y)<1||at(x+1,y)<1||at(x,y-1)<1||at(x,y+1)<1;return rgb(d.grass,edge?n*1.12:n)}),
    paint((x,y)=>lv[x+y*S]<2?null:rgb(((x>>2)+(y>>2))&1?0xe9e4d6:0xd6d0c0,0.95+hash2(x,y,d.seed+2)*0.08))];
  d.sides=[null,paint((x,y)=>lv[x+y*S]<1?null:rgb(0x8a7458,0.85+hash2(x,y*3,d.seed+3)*0.25)),paint((x,y)=>lv[x+y*S]<2?null:rgb(0xbfb9a8,0.9+hash2(x,y*3,d.seed+4)*0.15))];
  d.half=half;d.F=(wx,wy)=>F(wx-d.x,wy-d.y);
  d.level=(wx,wy)=>at(Math.round(wx-d.x)+half,Math.round(wy-d.y)+half);
  d.coast=a=>{let r=4;while(r<half-1&&d.level(d.x+Math.cos(a)*r,d.y+Math.sin(a)*r)>=0)r++;return r-1};
  d.ringR=(a,f)=>{let r=2;while(r<half&&d.F(d.x+Math.cos(a)*r,d.y+Math.sin(a)*r)>f)r+=0.5;return r};
}
ISLETS.forEach(buildTerrain);
function addBridge(A,Bz){const a=Math.atan2(Bz.y-A.y,Bz.x-A.x),ra=A.coast(a)-5,rb=Bz.coast(a+Math.PI)-5;
  const b={x0:A.x+Math.cos(a)*ra,y0:A.y+Math.sin(a)*ra,x1:Bz.x-Math.cos(a)*rb,y1:Bz.y-Math.sin(a)*rb,a,A,Bz};b.len=Math.hypot(b.x1-b.x0,b.y1-b.y0);BRIDGES.push(b);
  const n=Math.ceil(b.len/26);b.segs=[];for(let i=0;i<n;i++){const t=n===1?0.5:(14+(b.len-28)*i/(n-1))/b.len;b.segs.push({m:M.plank,x:b.x0+(b.x1-b.x0)*t,y:b.y0+(b.y1-b.y0)*t,z:0,rot:a})}return b}
ZONES.forEach((z,i)=>{const b=addBridge(HUB,z);z.sign=[b.x0+Math.cos(b.a)*4,b.y0+Math.sin(b.a)*4];addBridge(z,ZONES[(i+1)%10])});
SECRETS.forEach(s=>addBridge(ZONES[s.zi],s));
function proj(b,x,y){const ax=Math.cos(b.a),ay=Math.sin(b.a),t=clamp((x-b.x0)*ax+(y-b.y0)*ay,0,b.len);return{t,dist:Math.hypot(x-b.x0-ax*t,y-b.y0-ay*t)}}
function nearestBridge(x,y){let r={dist:1e9};for(const b of BRIDGES){const q=proj(b,x,y);if(q.dist<r.dist)r={dist:q.dist,b,t:q.t}}return r}
const bridgeDist=(x,y)=>nearestBridge(x,y).dist;
function isletOf(x,y){for(const d of ISLETS)if(Math.abs(x-d.x)<d.half&&Math.abs(y-d.y)<d.half&&d.level(x,y)>=0)return d;return null}
function mouths(d){if(!d.mouths){d.mouths=[];for(const b of BRIDGES){if(b.A===d)d.mouths.push([b.x0,b.y0,Math.cos(b.a),Math.sin(b.a),b]);if(b.Bz===d)d.mouths.push([b.x1,b.y1,-Math.cos(b.a),-Math.sin(b.a),b])}}return d.mouths}
function isletAt(x,y){const d=isletOf(x,y);return d?d.level(x,y):-1}
const walkable=(x,y)=>isletAt(x,y)>=0||bridgeDist(x,y)<=3.6;
function groundZ(x,y){const l=isletAt(x,y);if(l>=1)return l*TS;return bridgeDist(x,y)<=3.8?3:Math.max(0,l)*TS}
function populate(d){
  const rnd=mulberry(d.seed+3),placed=[],W2=(a,r)=>[d.x+Math.cos(a)*r,d.y+Math.sin(a)*r];
  const free=(x,y,g)=>placed.every(q=>Math.hypot(q[0]-x,q[1]-y)>=(g+q[2])/2)&&bridgeDist(x,y)>g/2+5;
  placed.push([d.x,d.y,20]);
  if(d.kind==='secret'){d.chest={m:M.chest[0],x:d.x,y:d.y,z:2*TS,rot:d.seed,chest:d};props.push(d.chest);SOLIDS.push({x:d.x,y:d.y,r:6.5});
    const a=rnd()*TAU,[x,y]=W2(a,d.ringR(a,0.55));LETTERS.push({i:20+d.k,x,y,z:TS,ph:rnd()*TAU});placed.push([x,y,12])}
  else{d.altar={m:M.altar[0],x:d.x,y:d.y,z:2*TS,rot:0,altar:d};props.push(d.altar);SOLIDS.push({x:d.x,y:d.y,r:6.5})}
  if(d.kind==='zone'){const a0=rnd()*TAU;for(let k=0;k<10;k++){const a=a0+k*TAU/10,[x,y]=W2(a,d.ringR(a,0.42));OBJ.push({w:d.i*10+k,x,y,z:TS,isl:d.i,ph:rnd()*TAU,m:WD[d.i*10+k].m});placed.push([x,y,22]);SOLIDS.push({x,y,r:5})}
    for(let k=0;k<6;k++){const a=a0+(k+0.5)*TAU/6+0.3,[x,y]=W2(a,d.ringR(a,k%2?0.2:0.63));FEATHERS.push({x,y,z:TS,ph:rnd()*TAU});placed.push([x,y,8])}
    {const a=d.a+Math.PI+(rnd()-0.5)*1.2,[x,y]=W2(a,d.ringR(a,0.66));LETTERS.push({i:d.i*2,x,y,z:TS,ph:rnd()*TAU});placed.push([x,y,12])}
    {let a=d.a+(rnd()<0.5?0.75:-0.75),x,y;for(let t=0;t<30;t++){[x,y]=W2(a,d.ringR(a,0.13));if(bridgeDist(x,y)>12)break;a+=0.17}LETTERS.push({i:d.i*2+1,x,y,z:TS,ph:rnd()*TAU});placed.push([x,y,12])}}
  if(d.hub)for(let k=0;k<5;k++){const a=k*TAU/5+0.4,[x,y]=W2(a,d.ringR(a,0.36));FEATHERS.push({x,y,z:TS,ph:k});placed.push([x,y,8])}
  for(const k in d.decor)for(let n=0;n<d.decor[k];n++)for(let t=0;t<80;t++){const a=rnd()*TAU,inner=d.kind!=='zone'||rnd()<0.35,f=inner?0.5+rnd()*0.24:0.12+rnd()*0.2,[x,y]=W2(a,d.ringR(a,f));
    const g=k==='columns'?30:(k==='bush'||k==='shrub'||k==='wheat'||k==='vine'||k==='ember')?6:10;if(d.level(x,y)!==1||!free(x,y,g))continue;
    if(g>=20){const e=g/2;if(d.level(x+e,y)!==1||d.level(x-e,y)!==1||d.level(x,y+e)!==1||d.level(x,y-e)!==1)continue}
    props.push({m:M[k],x,y,z:TS,rot:g>=20?a+Math.PI/2:rnd()*TAU});placed.push([x,y,g]);break}
}
ISLETS.forEach(populate);
for(const b of BRIDGES){const n=b.len>120?2:1;for(let i=1;i<=n;i++){const t=i/(n+1);FEATHERS.push({x:b.x0+(b.x1-b.x0)*t,y:b.y0+(b.y1-b.y0)*t,z:3,ph:i+b.a})}}
FEATHERS.forEach((f,i)=>f.id=i);
const zoneObjs=i=>OBJ.slice(i*10,i*10+10),TIERS=[0,25,60,FEATHERS.length+40];

/* ---------- state ---------- */
const SAVE='onomata-v1';
let S={found:{},lit:Array(10).fill(false)};
try{const s=JSON.parse(localStorage.getItem(SAVE));if(s&&s.lit&&s.lit.length===10&&s.found)S=s}catch(e){}
for(const k of['feathers','letters','chests','seen'])if(!S[k]||typeof S[k]!=='object')S[k]={};
const save=()=>{try{localStorage.setItem(SAVE,JSON.stringify(S))}catch(e){}};
const FPS=/[?&]fps/.test(location.search)?document.body.appendChild(Object.assign(document.createElement('div'),{id:'fps'})):null;
const DEBUG=/[?&]debug/.test(location.search),NOAUTO=/[?&]noauto/.test(location.search);
let state='title',muted=false,musOn=true,T=0,SC=/[?&]sc=1/.test(location.search)?1:2;
const player={x:0,y:22,z:TS,dir:Math.PI/2,vx:0,vy:0,moving:false,sprint:false},cam={x:0,y:0,r:0,vr:0},keys={},ptr={down:false,x:0,y:0},joy={id:null,ox:0,oy:0,dx:0,dy:0};
let rotHeld=0;
const foundOn=i=>{let n=0;for(let k=0;k<10;k++)if(S.found[i*10+k])n++;return n};
const litN=()=>S.lit.filter(Boolean).length,count=o=>Object.keys(o).length;
const featherN=()=>count(S.feathers)+10*count(S.chests);
const tier=()=>{const n=featherN();return n>=TIERS[3]?3:n>=TIERS[2]?2:n>=TIERS[1]?1:0};
function syncLights(){ZONES.forEach((d,i)=>d.altar.m=M.altar[S.lit[i]?1:0]);HUB.altar.m=M.altar[litN()===10?1:0];SECRETS.forEach(s=>s.chest.m=M.chest[S.chests[s.k]?1:0])}
syncLights();

/* ---------- audio ---------- */
let AC=null;
function unlock(){if(AC){if(AC.state==='suspended')AC.resume();return}try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
function beep(f,d=0.14,type='sine',vol=0.07,when=0){if(muted||!AC)return;try{const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+when;o.type=type;o.frequency.value=f;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+0.02)}catch(e){}}
const chime=()=>{beep(660,.15);beep(880,.2,'sine',.07,.1)},good=()=>{beep(784,.1);beep(1047,.18,'sine',.07,.09)},bad=()=>beep(196,.25,'triangle',.08),fanfare=()=>[523,659,784,1047,1319].forEach((f,i)=>beep(f,.3,'triangle',.07,i*.13)),
  pluck=()=>{beep(1175,.09,'sine',.05);beep(1568,.14,'sine',.045,.06)},vib=ms=>{try{const ua=navigator.userActivation;if(navigator.vibrate&&(!ua||ua.hasBeenActive))navigator.vibrate(ms)}catch(e){}};
function speak(t){if(muted||!('speechSynthesis'in window))return;try{const u=new SpeechSynthesisUtterance(t);u.lang='el-GR';const v=speechSynthesis.getVoices().find(v=>v.lang&&v.lang.toLowerCase().startsWith('el'));if(v)u.voice=v;u.rate=0.85;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
if('speechSynthesis'in window)try{speechSynthesis.getVoices()}catch(e){}
/* a quiet lyre that wanders up and down a Dorian scale */
const SCALE=[196,220,233.08,261.63,293.66,329.63,349.23,392,440,466.16,523.25];let musI=4;
setInterval(()=>{if(!musOn||muted||!AC||document.hidden||state==='title'||Math.random()<0.35)return;musI=clamp(musI+Math.round((Math.random()-0.5)*4),0,SCALE.length-1);const f=SCALE[musI];beep(f,1.6,'triangle',.022);beep(f*2,.5,'sine',.008);if(Math.random()<0.25)beep(SCALE[Math.max(0,musI-4)],2,'sine',.016,.02)},620);

/* ---------- UI ---------- */
const TOUCH=matchMedia('(pointer:coarse)').matches;if(TOUCH)document.body.classList.add('touch');
const show=(id,on)=>{$(id).classList.toggle('on',on);if(on){joy.id=null;joy.dx=joy.dy=0;ptr.down=false;rotHeld=0;$('joy').style.display='none'}};
function hud(){$('hLit').textContent=litN();$('hFound').textContent=count(S.found);$('hFeather').textContent=featherN();$('hLet').textContent=count(S.letters)}
hud();
function toast(html,ms=3600){const e=document.createElement('div');e.className='toast';e.innerHTML=html;$('toasts').appendChild(e);while($('toasts').children.length>3)$('toasts').firstChild.remove();setTimeout(()=>{e.classList.add('out');setTimeout(()=>e.remove(),400)},ms)}
let cardW=-1;
function openCard(w){cardW=w;state='card';const i=Math.floor(w/10),d=ZONES[i];S.found[w]=1;save();hud();
  $('cKick').textContent=`Shrine of ${d.en} · ${d.theme} · ${foundOn(i)} of 10`;$('cEl').textContent=WD[w].el;$('cTr').textContent=WD[w].tr;$('cEn').textContent=WD[w].en;show('card',true);chime();vib(15);setTimeout(()=>speak(WD[w].el),250)}
function closeCard(){if(state!=='card')return;show('card',false);state='play'}
$('cOk').onclick=closeCard;$('cHear').onclick=()=>speak(WD[cardW].el);

/* the trial, part 1: the god names a thing in Greek and you run to it */
let trial=null;
function startTrial(i,practice){document.body.classList.add('trial');trial={i,practice,q:shuffle([...Array(10)].map((_,k)=>({w:i*10+k}))),done:0,miss:0};state='fetch';$('ask').classList.add('on');ask('')}
function ask(fb,ok){const w=WD[trial.q[0].w];$('aN').textContent=`${trial.done+1} / ${trial.done+trial.q.length}`;$('aEl').textContent=w.el;$('aTr').textContent=w.tr;$('aFb').textContent=fb||'Walk to the right thing.';$('aFb').style.color=fb?(ok?'#2c9a4b':'#d04a3a'):'#5a6f8f';
  const e=$('aEl');e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop');if(!fb||ok)speak(w.el)}
function fetchHit(o){if(state!=='fetch'||!trial)return;const cur=trial.q[0];
  if(o.w===cur.w){good();vib(20);burst(o.x,o.y,o.z+8,14,[0xffe36b,0xffffff,0x7fe08a]);trial.q.shift();trial.done++;if(!trial.q.length){$('ask').classList.remove('on');document.body.classList.remove('trial');return startQuiz()}ask('Σωστά! Correct — next:',true)}
  else{bad();vib([30,40,30]);trial.miss++;if(!cur.missed){cur.missed=true;trial.q.push({w:cur.w,missed:true})}ask(`That one is ${WD[o.w].el} — “${WD[o.w].en}”. Keep looking.`,false)}}
function cancelTrial(){document.body.classList.remove('trial');$('ask').classList.remove('on');trial=null;state='play'}
/* part 2: you are shown each sprite and must give its Greek name */
let quiz=null;
function startQuiz(){const i=trial.i,q=shuffle([...Array(10)].map((_,k)=>({w:i*10+k}))),others=[];S.lit.forEach((l,j)=>{if(l&&j!==i)for(let k=0;k<10;k++)others.push(j*10+k)});
  shuffle(others).slice(0,3).forEach(w=>q.push({w,review:true}));quiz={i,q,total:q.length,done:0,miss:trial.miss,practice:trial.practice,locked:false};trial=null;state='quiz';show('quiz',true);nextQ()}
function nextQ(){if(!quiz.q.length)return finishQuiz();const it=quiz.cur=quiz.q[0],isl=Math.floor(it.w/10);
  quiz.opts=shuffle(shuffle([...Array(10)].map((_,k)=>isl*10+k).filter(x=>x!==it.w)).slice(0,3).concat(it.w));
  $('qBar').style.width=(quiz.done/quiz.total*100)+'%';$('qFb').textContent='';$('qRow').innerHTML='';$('qSpr').style.display='';$('qBig').textContent='';$('qTr').textContent='';
  $('qKick').textContent=(it.review?`Review from ${ZONES[isl].en} · `:'')+'What is this called in Greek?';
  $('qOpts').className='opts';$('qOpts').innerHTML=quiz.opts.map((o,k)=>`<button class="opt gr" data-k="${k}"><i class="kb">${k+1}</i>${WD[o].el}<small>${WD[o].tr}</small></button>`).join('');
  $('qOpts').style.display='';[...$('qOpts').children].forEach(b=>b.onclick=()=>answer(+b.dataset.k))}
function answer(k){if(state==='riddle')return riddleAnswer(k);if(!quiz||quiz.locked||state!=='quiz'||!quiz.cur||k<0||k>=quiz.opts.length)return;quiz.locked=true;const it=quiz.cur,ok=quiz.opts[k]===it.w,w=WD[it.w],bs=[...$('qOpts').children];
  bs[quiz.opts.indexOf(it.w)].classList.add('ok');if(!ok)bs[k].classList.add('bad');speak(w.el);
  if(ok){quiz.q.shift();quiz.done++;good();vib(20);$('qFb').style.color='#2c9a4b';$('qFb').textContent=`Σωστά! ${w.el} = ${w.en}`}
  else{quiz.miss++;quiz.q.push(quiz.q.shift());bad();vib([30,40,30]);$('qFb').style.color='#d04a3a';$('qFb').textContent=`${w.el} (${w.tr}) = ${w.en} — it will come back`}
  setTimeout(()=>{if(!quiz)return;quiz.locked=false;nextQ()},ok?(DEBUG?60:900):2400)}
function finishQuiz(){const d=ZONES[quiz.i],first=!quiz.practice&&!S.lit[quiz.i];quiz.cur=null;
  if(first){S.lit[quiz.i]=true;save();syncLights();hud();burst(d.x,d.y,16,70,[0xffe36b,0xff8a3a,0xffffff,0x7fc4ee,0xf06a98],2.2)}
  const all=litN()===10;fanfare();vib([40,60,40,60,120]);$('qBar').style.width='100%';$('qOpts').style.display='none';$('qSpr').style.display='none';
  if(first&&all){$('qKick').textContent='All ten shrines burn again';$('qBig').textContent='Ο Όλυμπος θυμάται!';$('qTr').textContent='o Ólimbos thimáte — “Olympus remembers”';$('qFb').style.color='#0b2a55';$('qFb').textContent='You have learned 100 Greek words. Συγχαρητήρια — congratulations!'}
  else{$('qKick').textContent=first?`The shrine of ${d.en} is lit`:`${d.en} · practice complete`;$('qBig').textContent=first?'Η φλόγα άναψε!':'Μπράβο!';$('qTr').textContent=first?'i flóga ánapse — “the flame is lit”':'brávo — “well done”';
    $('qFb').style.color='#0b2a55';$('qFb').textContent=`${quiz.miss?quiz.miss+' slip'+(quiz.miss>1?'s':'')+', all corrected.':'A perfect run.'}${first?' Ten more words learned — cross a bridge to the next dark shrine.':''}`}
  $('qRow').innerHTML='<button class="pb" id="qDone">Walk on<span class="kb"> (Space)</span></button>';$('qDone').onclick=closeQuiz}
function closeQuiz(){show('quiz',false);quiz=null;riddle=null;state='play'}
/* hidden chests: a riddle that shows four sprites and asks which one a word means (only words you have met) */
let riddle=null;
function icon(w,s){const c=mk(26,30),x=c.getContext('2d');x.imageSmoothingEnabled=false;drawStack(x,WD[w].m,13,23,0.6);c.style.width=26*s+'px';c.className='ic';return c}
function openChest(sec){if(S.chests[sec.k])return;const pool=Object.keys(S.found).map(Number);
  if(pool.length<4){toast('The chest is sealed with a riddle. <b>Learn the names of at least four things</b>, then come back.',4200);bad();return}
  riddle={sec,left:3,pool,locked:false};state='riddle';show('quiz',true);riddleNext()}
function riddleNext(){const r=riddle,o=shuffle(r.pool.slice()).slice(0,4);r.opts=o;r.cur=o[Math.floor(Math.random()*4)];const w=WD[r.cur];
  $('qBar').style.width=((3-r.left)/3*100)+'%';$('qKick').textContent='The chest asks: which one is this?';$('qSpr').style.display='none';$('qBig').textContent=w.el;$('qTr').textContent=w.tr;$('qFb').textContent='';$('qRow').innerHTML='<button class="pb alt sm" id="qDone">Leave it<span class="kb"> (Esc)</span></button>';$('qDone').onclick=closeQuiz;
  const box=$('qOpts');box.className='opts pics';box.style.display='';box.innerHTML='';o.forEach((wd,k)=>{const b=document.createElement('button');b.className='opt';b.appendChild(icon(wd,2.6));b.onclick=()=>riddleAnswer(k);box.appendChild(b)});speak(w.el)}
function riddleAnswer(k){const r=riddle;if(!r||r.locked||k<0||k>=4)return;r.locked=true;const ok=r.opts[k]===r.cur,bs=[...$('qOpts').children],w=WD[r.cur];bs[r.opts.indexOf(r.cur)].classList.add('ok');
  if(ok){good();vib(20);r.left--;$('qFb').style.color='#2c9a4b';$('qFb').textContent=`Σωστά! ${w.el} = ${w.en}`}else{bad();bs[k].classList.add('bad');$('qFb').style.color='#d04a3a';$('qFb').textContent=`${w.el} = ${w.en}. Try another.`}
  setTimeout(()=>{if(riddle!==r)return;r.locked=false;if(r.left>0)return riddleNext();S.chests[r.sec.k]=1;save();syncLights();hud();closeQuiz();fanfare();burst(r.sec.x,r.sec.y,12,60,[0xffe36b,0xfff0a0,0xffffff],2);
    toast(`<b>The chest opens!</b> Ten golden feathers — you now have ${featherN()}.`,4200);checkTier(featherN()-10)},ok?(DEBUG?60:900):1800)}
function checkTier(before){for(let t=1;t<=3;t++)if(before<TIERS[t]&&featherN()>=TIERS[t]){fanfare();toast(['','<b>Golden wings!</b> Hermes lends you speed.','<b>A messenger’s red cloak!</b> You run faster still.','<b>The golden tunic!</b> Every feather on Olympus is yours.'][t],5200)}}

let resetArm=false;
function openLex(){if(state!=='play'&&state!=='lex')return;state='lex';const body=$('lexBody');body.innerHTML=`<p class="stat">🔥 ${litN()}/10 shrines · 📜 ${count(S.found)}/100 named · <b>${litN()*10}/100 words learned</b> · 🪶 ${featherN()} feathers · 🗝 ${count(S.chests)}/4 chests</p>`;
  ZONES.forEach((d,i)=>{body.insertAdjacentHTML('beforeend',`<h3>${S.lit[i]?'★':'☆'} <span class="gr">${d.el}</span> · ${d.en} — ${d.theme} (${foundOn(i)}/10)</h3>`);const g=document.createElement('div');g.className='lw';
    for(let k=0;k<10;k++){const w=i*10+k,e=document.createElement('div');if(S.found[w]){e.appendChild(icon(w,1.5));e.insertAdjacentHTML('beforeend',`<span><b class="gr">${WD[w].el}</b> <em>${WD[w].tr}</em><br>${WD[w].en}</span>`);e.onclick=()=>speak(WD[w].el)}else{e.className='no';e.textContent='· · ·'}g.appendChild(e)}body.appendChild(g)});
  body.insertAdjacentHTML('beforeend',`<h3>Αλφάβητο · the alphabet (${count(S.letters)}/24 letters found)</h3>`);const g=document.createElement('div');g.className='lw ab';
  ALPHA.forEach((a,i)=>{const e=document.createElement('div');if(S.letters[i]){e.innerHTML=`<b class="gr L">${a[0]}${a[1]}</b><span><b class="gr">${a[2]}</b> <em>${a[3]}</em><br>${a[4]}</span>`;e.onclick=()=>speak(a[2])}else{e.className='no';e.innerHTML='<b class="gr L">?</b>'}g.appendChild(e)});body.appendChild(g);
  $('lexReset').textContent='Reset progress';resetArm=false;show('lex',true);$('lex').firstElementChild.scrollTop=0}
function closeLex(){show('lex',false);state='play'}
$('lexClose').onclick=closeLex;$('bLex').onclick=openLex;
$('lexReset').onclick=()=>{if(!resetArm){resetArm=true;$('lexReset').textContent='Tap again to erase everything';return}S={found:{},lit:Array(10).fill(false),feathers:{},letters:{},chests:{},seen:{}};GAME.S=S;save();syncLights();hud();closeLex()};
$('bMute').onclick=()=>{muted=!muted;$('bMute').textContent=muted?'🔇':'🔊';if(muted&&'speechSynthesis'in window)speechSynthesis.cancel()};
$('bMus').onclick=()=>{musOn=!musOn;$('bMus').classList.toggle('off',!musOn)};
$('bStart').onclick=()=>{unlock();show('title',false);state='play';if(!count(S.found)&&!count(S.feathers))toast(TOUCH?'Drag anywhere to walk. Use ⟲ ⟳ to turn the view.':'WASD or arrows to walk, Shift to run, Q / E to turn the view.',5200)};
function openMap(){if(state!=='play')return;state='map';drawMap();show('map',true)}
function closeMap(){show('map',false);state='play'}
$('mini').onclick=openMap;$('mapClose').onclick=closeMap;$('map').onclick=e=>{if(e.target.id==='map')closeMap()};
let curZone=-1,atAltar=-1,curIslet=null;
function act(){if(state==='fetch'&&trial)return speak(WD[trial.q[0].w].el);if(state!=='play'||atAltar<0)return;if(S.lit[atAltar])startTrial(atAltar,true);else if(foundOn(atAltar)===10)startTrial(atAltar,false)}
$('act').onclick=act;$('aQuit').onclick=cancelTrial;$('aHear').onclick=act;
for(const[id,dir]of[['rL',1],['rR',-1]]){const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();rotHeld=dir;try{b.setPointerCapture(e.pointerId)}catch(_){}});for(const ev of['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>{if(rotHeld===dir)rotHeld=0})}

addEventListener('keydown',e=>{unlock();const k=e.key.toLowerCase();keys[k]=true;
  if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();
  if(state==='title'&&(k==='enter'||k===' '))return $('bStart').onclick();
  if(state==='card'&&(k==='enter'||k===' '))return closeCard();
  if(state==='quiz'||state==='riddle'){if(k>='1'&&k<='4')answer(+k-1);else if((k==='enter'||k===' ')&&$('qDone')&&state==='quiz')closeQuiz();else if(k==='escape')closeQuiz();else if(DEBUG&&k==='p'&&quiz&&quiz.cur)answer(quiz.opts.indexOf(quiz.cur.w));return}
  if(state==='lex'){if(k==='escape'||k==='l')closeLex();return}
  if(state==='map'){if(k==='escape'||k==='m')closeMap();return}
  if(state==='fetch'){if(k==='escape')cancelTrial();else if(k===' '||k==='enter')act();else if(DEBUG&&k==='f')fetchHit(OBJ[trial.q[0].w]);return}
  if(state==='play'){if(k==='l')openLex();else if(k==='m')openMap();else if(k===' '||k==='enter')act();
    else if(DEBUG&&k==='g'&&curZone>=0){for(let j=0;j<10;j++)S.found[curZone*10+j]=1;save();hud()}
    else if(DEBUG&&k==='t'){const i=S.lit.indexOf(false);if(i>=0){player.x=ZONES[i].x;player.y=ZONES[i].y+12}}}
});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
function dropInput(){for(const k in keys)keys[k]=false;ptr.down=false;joy.id=null;joy.dx=joy.dy=0;rotHeld=0;$('joy').style.display='none'}
addEventListener('blur',dropInput);addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('visibilitychange',()=>{if(document.hidden)dropInput()});

/* ---------- canvas + input ---------- */
const cv=$('c'),ctx=cv.getContext('2d');let BW=356,BH=200,CX=178,CY=112;
function resize(){const w=innerWidth||800,h=innerHeight||600;if(w<h){BW=clamp(Math.round(w/1.9),176,230);BH=Math.round(BW*h/w)}else{BH=h<430?176:200;BW=clamp(Math.round(BH*w/h),200,560)}cv.width=BW*SC;cv.height=BH*SC;CX=BW/2;CY=Math.round(BH*(w<h?0.5:0.56));ctx.imageSmoothingEnabled=false}
addEventListener('resize',resize);addEventListener('orientationchange',()=>setTimeout(resize,200));resize();
const setPtr=e=>{ptr.x=e.clientX/innerWidth*BW;ptr.y=e.clientY/innerHeight*BH};
const JR=52,jb=$('joy'),jk=$('knob');
cv.addEventListener('pointerdown',e=>{unlock();if(e.pointerType==='mouse'){ptr.down=true;setPtr(e)}else if(joy.id===null){joy.id=e.pointerId;joy.ox=e.clientX;joy.oy=e.clientY;joy.dx=joy.dy=0;jb.style.display='block';jb.style.left=e.clientX+'px';jb.style.top=e.clientY+'px';jk.style.transform='translate(-50%,-50%)'}
  try{cv.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault()});
cv.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')return setPtr(e);if(e.pointerId!==joy.id)return;let dx=e.clientX-joy.ox,dy=e.clientY-joy.oy;const l=Math.hypot(dx,dy);if(l>JR){joy.ox+=dx*(l-JR)/l;joy.oy+=dy*(l-JR)/l;dx*=JR/l;dy*=JR/l;jb.style.left=joy.ox+'px';jb.style.top=joy.oy+'px'}
  joy.dx=dx/JR;joy.dy=dy/JR;jk.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`});
const endPtr=e=>{if(e.pointerType==='mouse'){ptr.down=false;return}if(e.pointerId===joy.id){joy.id=null;joy.dx=joy.dy=0;jb.style.display='none'}};
cv.addEventListener('pointerup',endPtr);cv.addEventListener('pointercancel',endPtr);
function toScreen(wx,wy){const dx=wx-cam.x,dy=wy-cam.y,c=Math.cos(cam.r),s=Math.sin(cam.r);return[CX+dx*c-dy*s,CY+(dx*s+dy*c)*K]}
function worldT(z){ctx.setTransform(SC,0,0,K*SC,CX*SC,(CY-(z||0))*SC);ctx.rotate(cam.r);ctx.translate(-cam.x,-cam.y)}
const TI=()=>ctx.setTransform(SC,0,0,SC,0,0);
function blit(m,rot,sx,sy){const s=sprite(m,rot,SC);ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(s.cv,Math.round(sx*SC-s.ox),Math.round(sy*SC-s.oy))}
function freeCache(){for(const o of props)o.m.cache.length=0;M.ped.cache.length=0;M.plank.cache.length=0;for(const c of M.cloud)c.cache.length=0;SPRN=0}

/* ---------- particles ---------- */
const parts=[];
function burst(x,y,z,n,cols,pw=1){for(let i=0;i<n;i++){const a=Math.random()*TAU,s=(12+Math.random()*26)*pw;parts.push({x,y,z,vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:(20+Math.random()*34)*pw,t:0,life:0.7+Math.random()*0.7,c:cols[i%cols.length],g:80})}}
function puff(x,y,z){parts.push({x:x+(Math.random()-0.5)*3,y:y+(Math.random()-0.5)*3,z,vx:(Math.random()-0.5)*8,vy:(Math.random()-0.5)*8,vz:6+Math.random()*6,t:0,life:0.45,c:0xf2ead8,g:0})}
const hex=c=>'#'+c.toString(16).padStart(6,'0');

/* ---------- update ---------- */
let hintTxt='',banTxt='',target=null,touched=null,seek=null,puffT=0;
function moveHero(dt){
  let ix=0,iy=0,mag=0;
  if(keys['a']||keys['arrowleft'])ix-=1;if(keys['d']||keys['arrowright'])ix+=1;if(keys['w']||keys['arrowup'])iy-=1;if(keys['s']||keys['arrowdown'])iy+=1;
  let sprint=!!keys['shift'];
  if(ix||iy){const l=Math.hypot(ix,iy);ix/=l;iy/=l;mag=1}
  else if(joy.id!==null){const l=Math.hypot(joy.dx,joy.dy);if(l>0.12){ix=joy.dx/l;iy=joy.dy/l;mag=clamp((l-0.12)/0.7,0,1);sprint=l>0.97}}
  else if(ptr.down){const[px,py]=toScreen(player.x,player.y),vx=ptr.x-px,vy=(ptr.y-(py-player.z))/K,l=Math.hypot(vx,vy);if(l>6){ix=vx/l;iy=vy/l;mag=clamp(l/30,0.35,1);sprint=l>BH*0.42}}
  const c=Math.cos(cam.r),s=Math.sin(cam.r),top=(70+tier()*5)*(sprint?1.42:1);
  let wx=ix*c+iy*s,wy=-ix*s+iy*c;
  const k=Math.min(1,dt*(mag?11:14));player.vx+=(wx*top*mag-player.vx)*k;player.vy+=(wy*top*mag-player.vy)*k;
  const spd=Math.hypot(player.vx,player.vy);player.sprint=sprint&&spd>80;
  if(!mag)seek=null;
  if(spd<1.5){player.moving=false;if(!mag){player.vx=player.vy=0}return 0}
  wx=player.vx/spd;wy=player.vy/spd;const sp=spd*dt,nx=player.x+wx*sp,ny=player.y+wy*sp;let mdir=null;
  const step=(tx,ty)=>{const l2=Math.hypot(tx-player.x,ty-player.y);if(l2<0.05)return false;const ux=(tx-player.x)/l2,uy=(ty-player.y)/l2,m=Math.min(sp,l2),qx=player.x+ux*m,qy=player.y+uy*m;
    if(!walkable(qx,qy))return false;player.x=qx;player.y=qy;mdir=Math.atan2(uy,ux);return true};
  let mv=false;
  if(seek&&(T>seek.t||wx*seek.wx+wy*seek.wy<0.6||Math.hypot(seek.m[0]-player.x,seek.m[1]-player.y)<1.5))seek=null;
  if(seek){mv=step(seek.m[0],seek.m[1]);if(!mv)seek=null}
  if(mv){}else if(walkable(nx,ny)){player.x=nx;player.y=ny;mdir=Math.atan2(wy,wx);mv=true}
  else if(mag){ // blocked by an edge: ride the bridge you are on, or head for the bridge that leads where you are pushing
    const d=isletOf(player.x,player.y);let rb=null;
    if(!d){const nb=nearestBridge(player.x,player.y);if(nb.dist<4.4)rb=nb.b}
    else{let best=null,bd=ptr.down?0.05:0.3;for(const m of mouths(d)){const dt2=m[2]*wx+m[3]*wy;if(dt2>bd){bd=dt2;best=m}}
      if(best){if(proj(best[4],player.x,player.y).dist<4.4)rb=best[4];else{seek={m:best,wx,wy,t:T+4};mv=step(best[0],best[1])}}}
    if(rb&&!mv){const ax=Math.cos(rb.a),ay=Math.sin(rb.a),dp=wx*ax+wy*ay;if(Math.abs(dp)>0.15){const t2=clamp(proj(rb,player.x,player.y).t+Math.sign(dp)*sp*1.5,0,rb.len);mv=step(rb.x0+ax*t2,rb.y0+ay*t2)}}
    if(!mv)for(const da of[0.5,-0.5,1,-1,1.45,-1.45]){const ca=Math.cos(da),sa=Math.sin(da);if(step(player.x+(wx*ca-wy*sa)*sp,player.y+(wx*sa+wy*ca)*sp)){mv=true;break}}
  }
  if(!mv){player.vx*=0.6;player.vy*=0.6;mdir=Math.atan2(wy,wx)}
  // pedestals, altars and chests are solid, but softly so
  for(const o of SOLIDS){const dx=player.x-o.x,dy=player.y-o.y,d2=dx*dx+dy*dy;if(d2<o.r*o.r&&d2>0.0001){const d=Math.sqrt(d2),px=o.x+dx/d*o.r,py=o.y+dy/d*o.r;if(walkable(px,py)){player.x+=(px-player.x)*Math.min(1,dt*18);player.y+=(py-player.y)*Math.min(1,dt*18)}}}
  if(mdir!=null)player.dir+=angDiff(mdir,player.dir)*Math.min(1,dt*13);
  player.moving=mv;
  if(mv&&player.sprint){puffT-=dt;if(puffT<0){puffT=0.07;puff(player.x,player.y,player.z)}}
  return ix*mag;
}
const birds=[0,1,2,3].map(i=>({x:i*190-300,y:i*140-200,a:0.4+i*1.3,ph:i*2}));
function update(dt){
  T+=dt;
  for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vz-=p.g*dt;if(p.t>p.life||p.z<-2)parts.splice(i,1)}
  for(const b of birds){b.x+=Math.cos(b.a)*26*dt;b.y+=Math.sin(b.a)*26*dt;const dx=b.x-cam.x,dy=b.y-cam.y;if(dx*dx+dy*dy>560*560){const a=Math.random()*TAU;b.x=cam.x+Math.cos(a)*540;b.y=cam.y+Math.sin(a)*540;b.a=a+Math.PI+(Math.random()-0.5)*1.2}}
  if(state==='title'){cam.vr=0.1;cam.r+=dt*0.1;cam.x=ZONES[0].x*0.5;cam.y=ZONES[0].y*0.62;return}
  let turn=0;
  if(state==='play'||state==='fetch'){
    turn=moveHero(dt);
    const list=curZone>=0?zoneObjs(curZone):[];
    if(touched&&Math.hypot(touched.x-player.x,touched.y-player.y)>15)touched=null;
    for(const o of list){if(o===touched||Math.hypot(o.x-player.x,o.y-player.y)>9.5)continue;touched=o;
      if(state==='fetch'){if(trial.i===o.isl)fetchHit(o)}else if(!S.found[o.w])openCard(o.w);else speak(WD[o.w].el);break}
    if(state==='play'){
      for(const f of FEATHERS)if(!S.feathers[f.id]&&Math.abs(f.x-player.x)<7&&Math.hypot(f.x-player.x,f.y-player.y)<7){const before=featherN();S.feathers[f.id]=1;save();hud();pluck();vib(10);burst(f.x,f.y,f.z+6,8,[0xffe36b,0xfff6d8]);checkTier(before)}
      for(const L of LETTERS)if(!S.letters[L.i]&&Math.hypot(L.x-player.x,L.y-player.y)<8){S.letters[L.i]=1;save();hud();chime();vib(15);burst(L.x,L.y,L.z+8,16,[0xffffff,0x7fc4ee,0xffe36b]);const a=ALPHA[L.i];
        toast(`<b class="gr big2">${a[0]} ${a[1]}</b> <span><b class="gr">${a[2]}</b> <em>${a[3]}</em> — sounds like ${a[4]}<br><small>${count(S.letters)}/24 letters of the alphabet</small></span>`,5200);setTimeout(()=>speak(a[2]),200)}
      for(const sec of SECRETS){const q=Math.hypot(sec.x-player.x,sec.y-player.y);if(q<140&&!S.seen[sec.k]){S.seen[sec.k]=1;save();toast(`You found <b>${sec.en}</b>. Something glints there…`,4000);chime()}
        if(q<11&&touched!==sec&&state==='play'){touched=sec;openChest(sec)}}
    }
  }else{player.vx=player.vy=0;player.moving=false}
  if(keys['q'])turn+=4;if(keys['e'])turn-=4;turn+=rotHeld*4;
  const tv=state==='play'||state==='fetch'?clamp(turn,-4,4)*(Math.abs(turn)>1.5?0.42:-0.2):0;cam.vr+=(tv-cam.vr)*Math.min(1,dt*7);cam.r+=cam.vr*dt;
  player.z+=(groundZ(player.x,player.y)-player.z)*Math.min(1,dt*14);
  const la=0.3;cam.x+=(player.x+player.vx*la-cam.x)*Math.min(1,dt*4.5);cam.y+=(player.y+player.vy*la-cam.y)*Math.min(1,dt*4.5);
  // where am I, what next
  curZone=-1;atAltar=-1;for(const d of ZONES){const q=Math.hypot(d.x-player.x,d.y-player.y);if(q<d.r*1.2)curZone=d.i;if(q<15)atAltar=d.i}
  curIslet=curZone>=0?ZONES[curZone]:Math.hypot(player.x,player.y)<HUB.r*1.2?HUB:null;
  let h='',b='';target=null;
  if(curZone>=0){const d=ZONES[curZone],n=foundOn(curZone);b=`${d.el}|Shrine of ${d.en} · ${d.theme} · ${S.lit[curZone]?'flame lit ★':'named '+n+'/10'}`;
    if(!S.lit[curZone]){if(n<10){let bd=1e9;for(const o of zoneObjs(curZone))if(!S.found[o.w]){const q=Math.hypot(o.x-player.x,o.y-player.y);if(q<bd){bd=q;target=o}}h=`Walk up to each thing on a pedestal to learn its name — ${10-n} left here`}
      else{target=d;h=`You know all ten. Step up to ${d.en}'s altar for the trial`}}}
  else if(curIslet===HUB)b='Όλυμπος|Olympus · ten bridges, ten shrines';
  else for(const sec of SECRETS)if(Math.hypot(sec.x-player.x,sec.y-player.y)<sec.r*1.3)b=`✦|${sec.en}`;
  if(!target&&state==='play'){let bd=1e9,ti=-1;S.lit.forEach((l,i)=>{if(!l&&i!==curZone){const q=Math.hypot(ZONES[i].x-player.x,ZONES[i].y-player.y);if(q<bd){bd=q;ti=i}}});
    if(ti>=0&&(curZone<0||S.lit[curZone])){target=ZONES[ti];h=`Cross the bridges to the shrine of ${ZONES[ti].en} — its flame is out`}else if(litN()===10)h='Every shrine burns. Wander freely, hunt for feathers and letters, or practise at any altar.'}
  const A=$('act');let as='';
  if(state==='play'&&atAltar>=0){const dn=foundOn(atAltar);if(S.lit[atAltar])as='Practise this shrine';else if(dn===10)as='Begin the trial';else h=`${ZONES[atAltar].en} wants you to learn all ten names first — ${10-dn} to go`}
  if(as!==A.dataset.s){A.dataset.s=as;if(as)$('actT').textContent=as;A.classList.toggle('on',!!as)}
  if(state!=='play')h='';
  if(h!==hintTxt){hintTxt=h;if(h)$('hint').textContent=h;$('hint').classList.toggle('on',!!h)}
  if(state==='fetch')b='';
  if(b!==banTxt){banTxt=b;const p=b.split('|');if(b){$('bn').textContent=p[0]||'';$('bs').textContent=p[1]||''}$('banner').classList.toggle('on',!!b)}
}

/* ---------- render ---------- */
const vis=[],tags=[...Array(10)].map(()=>{const e=document.createElement('div');e.className='tag gr';document.body.insertBefore(e,$('banner'));return e});
function render(){
  const p=litN()/10,rotating=Math.abs(cam.vr)>0.004;
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;const sky=ctx.createLinearGradient(0,0,0,cv.height);sky.addColorStop(0,'#6fb8ee');sky.addColorStop(1,'#a8dcf8');ctx.fillStyle=sky;ctx.fillRect(0,0,cv.width,cv.height);
  if(SPRN>1400)freeCache();
  // the sea of clouds far below
  {const C=120,off=T*5,x0=Math.floor((cam.x-off-420)/C),y0=Math.floor((cam.y-420)/C);ctx.globalAlpha=0.8;
   for(let gy=y0;gy<y0+8;gy++)for(let gx=x0;gx<x0+8;gx++){const h=hash2(gx,gy,31);if(h>0.62)continue;const[sx,sy]=toScreen(gx*C+h*90+off,gy*C+hash2(gx,gy,57)*90);if(sx<-40||sx>BW+40||sy<-80||sy>BH+10)continue;
     const m=M.cloud[(h*30|0)%3],rot=h*20+cam.r;if(rotating)drawStack(ctx,m,sx,sy+55,rot,SC);else blit(m,rot,sx,sy+55)}ctx.globalAlpha=1}
  const near=ISLETS.filter(d=>Math.hypot(d.x-cam.x,d.y-cam.y)<d.half*1.45+360);
  for(const d of near){for(let k=11;k>=1;k--){const s=1-k*0.06;ctx.setTransform(SC,0,0,K*SC,CX*SC,(CY+k*2.2)*SC);ctx.rotate(cam.r);ctx.translate(d.x-cam.x,d.y-cam.y);ctx.scale(s,s);ctx.drawImage(d.under,-d.half,-d.half)}
    worldT(0);ctx.drawImage(d.tops[0],d.x-d.half,d.y-d.half);
    for(let l=1;l<=2;l++){for(let o=TS-1;o>0;o-=1/SC){worldT(l*TS-o);ctx.drawImage(d.sides[l],d.x-d.half,d.y-d.half)}worldT(l*TS);ctx.drawImage(d.tops[l],d.x-d.half,d.y-d.half)}}
  const cr=Math.cos(cam.r),sr=Math.sin(cam.r),lim=(Math.hypot(BW,BH/K)/2+50)**2;
  const scr=o=>{const dx=o.x-cam.x,dy=o.y-cam.y;if(dx*dx+dy*dy>lim)return false;o.sx=CX+dx*cr-dy*sr;o.sy=CY+(dx*sr+dy*cr)*K;return o.sx>-40&&o.sx<BW+40&&o.sy>-30&&o.sy<BH+60};
  const put=(m,rot,sx,sy)=>{if(rotating)drawStack(ctx,m,sx,sy,rot,SC);else blit(m,rot,sx,sy)};
  for(const b of BRIDGES)for(const o of b.segs)if(scr(o))put(o.m,o.rot+cam.r,o.sx,o.sy);
  // rings under things not yet named
  const trialOn=state==='fetch'||state==='quiz';
  worldT(TS);ctx.lineWidth=1.5;for(const o of OBJ){if(S.found[o.w]||Math.hypot(o.x-cam.x,o.y-cam.y)>400)continue;ctx.strokeStyle='rgba(255,232,120,.9)';ctx.beginPath();ctx.arc(o.x,o.y,8+1.5*Math.sin(T*3+o.ph),0,TAU);ctx.stroke()}
  for(const d of ZONES){const ready=!S.lit[d.i]&&foundOn(d.i)===10;if(!ready||Math.hypot(d.x-cam.x,d.y-cam.y)>400)continue;worldT(2*TS);ctx.strokeStyle='rgba(255,217,94,.95)';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(d.x,d.y,12+2*Math.sin(T*4),0,TAU);ctx.stroke()}
  vis.length=0;for(const o of props)if(scr(o))vis.push(o);for(const o of OBJ)if(scr(o))vis.push(o);
  if(!trialOn){for(const f of FEATHERS)if(!S.feathers[f.id]&&scr(f)){f.kind=1;vis.push(f)}for(const L of LETTERS)if(!S.letters[L.i]&&scr(L)){L.kind=2;vis.push(L)}}
  const hero={hero:true,x:player.x,y:player.y};scr(hero);vis.push(hero);vis.sort((a,b)=>a.sy-b.sy);
  TI();const shx=3*cr-2*sr,shy=(3*sr+2*cr)*K;ctx.fillStyle='rgba(8,25,45,.2)';
  for(const o of vis){if(o.hero)continue;const r=o.kind?2.6:o.m.sr*(o.w!=null?0.8:1);ctx.beginPath();ctx.ellipse(o.sx+shx*r/5,o.sy-o.z+shy*r/5,r,r*K,0,0,TAU);ctx.fill()}
  for(const o of vis){
    if(o.hero){TI();ctx.fillStyle='rgba(8,25,45,.25)';ctx.beginPath();ctx.ellipse(o.sx,o.sy-player.z,4,3,0,0,TAU);ctx.fill();
      const f=player.moving?1+(Math.floor(T*(player.sprint?13:9))&1):0;drawStack(ctx,M.hero[tier()][f],o.sx,o.sy-player.z-(player.moving?Math.abs(Math.sin(T*(player.sprint?13:9)))*1.3:0),player.dir+cam.r,SC);continue}
    if(o.kind===1){drawStack(ctx,M.feather,o.sx,o.sy-o.z-4-Math.sin(T*2.4+o.ph)*1.5,T*2.2+o.ph,SC);continue}
    if(o.kind===2){drawStack(ctx,ALPHA[o.i].m,o.sx,o.sy-o.z-3-Math.sin(T*1.8+o.ph)*1.2,T*0.9+o.ph,SC);continue}
    if(o.w!=null){put(M.ped,cam.r,o.sx,o.sy-o.z);drawStack(ctx,o.m,o.sx,o.sy-o.z-4-Math.sin(T*2+o.ph)*0.8,T*0.7+o.ph+cam.r,SC);continue}
    put(o.m,o.rot+cam.r,o.sx,o.sy-o.z);
    if(o.altar&&o.m===M.altar[1])drawStack(ctx,M.flame[Math.floor(T*8)&1],o.sx,o.sy-o.z-5,T*2,SC)}
  // birds, pollen and particles
  for(const b of birds){const[sx,sy]=toScreen(b.x,b.y);if(sx<-20||sx>BW+20||sy<40||sy>BH+90)continue;TI();ctx.fillStyle='rgba(8,25,45,.12)';ctx.beginPath();ctx.ellipse(sx,sy,3,2,0,0,TAU);ctx.fill();drawStack(ctx,M.bird[Math.floor(T*6+b.ph)&1],sx,sy-70,b.a+cam.r,SC)}
  TI();
  if(curIslet&&!trialOn){ctx.fillStyle='rgba(255,255,240,.75)';const ps=Math.ceil(SC*0.6)/SC;for(let i=0;i<14;i++){const a=i*2.4+T*0.07*(1+i%3),r=curIslet.r*(0.25+0.6*hash2(i,7,3)),[sx,sy]=toScreen(curIslet.x+Math.cos(a)*r,curIslet.y+Math.sin(a*1.3)*r);ctx.fillRect(sx,sy-10-6*Math.sin(T*0.8+i*1.7),ps,ps)}}
  for(const q of parts){const[sx,sy]=toScreen(q.x,q.y);ctx.globalAlpha=clamp(1.3-q.t/q.life*1.3,0,1);ctx.fillStyle=hex(q.c);const s2=q.g?1.5:1+q.t*3;ctx.fillRect(sx-s2/2,sy-q.z-s2/2,s2,s2)}ctx.globalAlpha=1;
  // evening comes as the shrines are lit
  if(p>0){ctx.fillStyle=`rgba(255,120,50,${(Math.sin(Math.PI*p)*0.15).toFixed(3)})`;ctx.fillRect(0,0,BW,BH);ctx.fillStyle=`rgba(10,18,60,${(Math.pow(p,1.5)*0.42).toFixed(3)})`;ctx.fillRect(0,0,BW,BH)}
  ctx.globalCompositeOperation='lighter';
  for(const d of ISLETS){if(!d.altar||d.altar.m!==M.altar[1]||!scr(d.altar))continue;const sx=d.altar.sx,sy=d.altar.sy-d.altar.z-9,fl=1+0.15*Math.sin(T*9);
    const g=ctx.createRadialGradient(sx,sy,0,sx,sy,26*fl);g.addColorStop(0,'rgba(255,220,130,.75)');g.addColorStop(1,'rgba(255,200,100,0)');ctx.fillStyle=g;ctx.fillRect(sx-30,sy-30,60,60);
    const b=ctx.createLinearGradient(0,sy-90,0,sy);b.addColorStop(0,'rgba(255,230,150,0)');b.addColorStop(1,'rgba(255,230,150,.45)');ctx.fillStyle=b;ctx.fillRect(sx-3,sy-90,6,90)}
  ctx.globalCompositeOperation='source-over';
  if(state==='play'&&target){const dist=Math.hypot(target.x-player.x,target.y-player.y);if(dist>40){const[bx,by]=toScreen(player.x,player.y),[tx,ty]=toScreen(target.x,target.y),a=Math.atan2(ty-by,tx-bx),ax=bx+Math.cos(a)*24,ay=by-player.z-6+Math.sin(a)*24*0.85;
    ctx.setTransform(SC,0,0,SC,ax*SC,ay*SC);ctx.rotate(a);ctx.fillStyle='#ffd95e';ctx.strokeStyle='#0b2a55';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(-3,-4);ctx.lineTo(-1,0);ctx.lineTo(-3,4);ctx.closePath();ctx.fill();ctx.stroke()}}
  // name tags over things you have already named (never during a trial); signposts on the hub
  const onHub=state==='play'&&curIslet===HUB,objs=state==='play'&&curZone>=0?zoneObjs(curZone):[];
  for(let i=0;i<10;i++){const e=tags[i];let txt='',sx=0,sy=0;
    if(onHub){const z=ZONES[i],o={x:z.sign[0],y:z.sign[1]};if(scr(o)){txt=(S.lit[i]?'★ ':'')+z.el;sx=o.sx;sy=o.sy-12}}
    else{const o=objs[i];if(o&&S.found[o.w]&&scr(o)){txt=WD[o.w].el;sx=o.sx;sy=o.sy-o.z-o.m.h-10}}
    if(!txt){if(e.style.display!=='none')e.style.display='none';continue}
    if(e.textContent!==txt)e.textContent=txt;e.classList.toggle('sign',onHub);e.style.display='block';e.style.transform=`translate(calc(${(sx/BW*innerWidth).toFixed(1)}px - 50%),calc(${(sy/BH*innerHeight).toFixed(1)}px - 100%))`}
}
const mc=$('mini').getContext('2d');
function drawWorld(c,size,big){c.clearRect(0,0,size,size);const s=size/1300,o=size/2;c.lineCap='round';c.strokeStyle=big?'rgba(190,150,100,.95)':'rgba(255,255,255,.55)';c.lineWidth=big?5:1.5;
  for(const b of BRIDGES){if(b.Bz.kind==='secret'&&!S.seen[b.Bz.k])continue;c.beginPath();c.moveTo(o+b.x0*s,o+b.y0*s);c.lineTo(o+b.x1*s,o+b.y1*s);c.stroke()}
  for(const d of ISLETS){if(d.kind==='secret'&&!S.seen[d.k])continue;c.fillStyle=d.hub?'#cfe0b8':d.kind==='secret'?(S.chests[d.k]?'#ffd95e':'#c8a8e8'):S.lit[d.i]?'#ffd95e':foundOn(d.i)===10?'#ffffff':'#8fb0d4';c.beginPath();c.arc(o+d.x*s,o+d.y*s,d.r*s,0,TAU);c.fill();
    if(big){c.fillStyle='#0b2a55';c.textAlign='center';c.font='bold 17px Georgia,serif';c.fillText(d.kind==='secret'?'✦':d.el,o+d.x*s,o+d.y*s+(d.kind==='zone'?-2:6));if(d.kind==='zone'){c.font='12px system-ui,sans-serif';c.fillText(S.lit[d.i]?'★ lit':foundOn(d.i)+'/10',o+d.x*s,o+d.y*s+14)}}}
  c.fillStyle='#ff5a4a';c.strokeStyle='#fff';c.lineWidth=big?2.5:1;c.beginPath();c.arc(o+player.x*s,o+player.y*s,big?8:3.5,0,TAU);c.fill();c.stroke()}
const minimap=()=>drawWorld(mc,128,false),drawMap=()=>drawWorld($('mapC').getContext('2d'),640,true);
const spin={c:$('cSpr').getContext('2d'),q:$('qSpr').getContext('2d'),t:$('tSpr').getContext('2d')};
function drawSpin(x,w){const m=WD[w].m,c=x.canvas,dg=Math.ceil(Math.hypot(m.w,m.d))+4,ch=Math.ceil(dg*K)+m.h+4;if(c.width!==dg||c.height!==ch){c.width=dg;c.height=ch}
  x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,dg,ch);x.imageSmoothingEnabled=false;drawStack(x,m,dg/2,ch-Math.ceil(dg*K/2)-2,T*1.1);x.setTransform(1,0,0,1,0,0)}
const titleSet=shuffle([...Array(100)].map((_,i)=>i)).slice(0,7);
function drawTitle(){const x=spin.t;x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,210,36);x.imageSmoothingEnabled=false;titleSet.forEach((w,i)=>drawStack(x,WD[w].m,15+i*30,27+Math.sin(T*2+i)*1.5,T*0.9+i))}

let last=performance.now(),fr=0,ema=16,slow=0,auto=true,emaHi=0,chk=-1;const FT=[];
function frame(now){const raw=now-last,dt=Math.min(0.05,raw/1000);last=now;
  if(raw<200){ema+=(raw-ema)*0.05;FT.push(raw);if(FT.length>600)FT.shift()}
  if(!NOAUTO&&auto){if(SC===2&&fr>90){if(ema>27)slow++;else slow=Math.max(0,slow-1);if(slow>90){emaHi=ema;chk=fr+180;SC=1;freeCache();resize()}}
    else if(SC===1&&fr===chk){auto=false;if(ema>emaHi*0.8){SC=2;freeCache();resize()}}} // half resolution only if it actually helps
  if(FPS&&fr%30===0&&FT.length>20){const f=FT.slice(-300).sort((a,b)=>a-b),md=f[f.length>>1],el=('speechSynthesis'in window)?speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.toLowerCase().startsWith('el')).length:-1;
    FPS.textContent=`${(1000/md).toFixed(0)} fps · median ${md.toFixed(1)} ms · p95 ${f[Math.floor(f.length*0.95)].toFixed(1)} ms · worst ${f[f.length-1].toFixed(0)} ms · res x${SC} · ${cv.width}x${cv.height} · audio ${AC?AC.state:'off'} · greek voices ${el} · touch ${TOUCH} · joy ${joy.id!==null?joy.dx.toFixed(1)+','+joy.dy.toFixed(1):'-'} · ${state}`}
  update(dt);render();if(state==='card')drawSpin(spin.c,cardW);else if(state==='quiz'&&quiz&&quiz.cur)drawSpin(spin.q,quiz.cur.w);else if(state==='title')drawTitle();if(fr++%6===0)minimap();requestAnimationFrame(frame)}
requestAnimationFrame(frame);
function selfTest(){const r={words:WD.length,objs:OBJ.length,objsOffGrass:0,altarsOff:0,bridgeGaps:0,bridges:BRIDGES.length,tooClose:0,feathers:FEATHERS.length,feathersOff:0,letters:LETTERS.length,lettersOff:0,letterIds:new Set(LETTERS.map(l=>l.i)).size,emptyGlyphs:ALPHA.filter(a=>a.m.glyph<8).length,pickupNearPed:0};
  for(const o of OBJ){if(ZONES[o.isl].level(o.x,o.y)!==1)r.objsOffGrass++;for(const q of OBJ)if(q!==o&&Math.hypot(q.x-o.x,q.y-o.y)<19)r.tooClose++}
  for(const d of ISLETS)if(d.level(d.x,d.y)!==2)r.altarsOff++;
  for(const f of FEATHERS)if(!walkable(f.x,f.y))r.feathersOff++;for(const L of LETTERS)if(!walkable(L.x,L.y))r.lettersOff++;
  for(const f of[...FEATHERS,...LETTERS])for(const s of SOLIDS)if(Math.hypot(f.x-s.x,f.y-s.y)<s.r+1.5)r.pickupNearPed++;
  for(const b of BRIDGES)for(let t=-8;t<=b.len+8;t++){const x=b.x0+Math.cos(b.a)*t,y=b.y0+Math.sin(b.a)*t;if(!walkable(x,y))r.bridgeGaps++}return r}
window.GAME={S,player,cam,ZONES,SECRETS,OBJ,WD,FEATHERS,LETTERS,FT,get state(){return state},get trial(){return trial},get quiz(){return quiz},get riddle(){return riddle},get curZone(){return curZone},get SC(){return SC},set SC(v){SC=v;freeCache();resize()},
  startTrial,fetchHit,answer,openCard,closeCard,closeQuiz,openChest,selfTest,tier,featherN};
