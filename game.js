'use strict';
/* ΤΑΞΙΔΙ — walk, drive and sail across one continuous sprite-stacked map of Greece, learning 100 words. Needs sprites.js (WD = the 100 words + models). */
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
function mFlag(up){return bake(B(15,9,21,v=>{v.box(3,1,0,9,7,0,0xcfcabb);v.box(4,2,1,8,6,1,MARBLE);v.box(5,3,2,7,5,2,(x,y)=>((x+y)&1)?BLUE:MARBLE);v.box(6,4,3,6,4,19,0xe2e2e2);v.set(6,4,20,GD);
  if(up)for(let z=12;z<=18;z++)for(let x=7;x<=14;x++){let c=(z%2)?WH:BLUE;if(x<=10&&z>=15){c=BLUE;if(x===8||x===9&&false||z===17&&false)c=BLUE;if(x===9||z===16)c=WH;if(x===9&&z===16)c=WH}v.box(x,4,z,x,5,z,c)}
  else{v.box(7,4,3,8,5,5,BLUE);v.box(7,4,4,8,5,4,WH)}}))}
function mHouse(wall,trim,roof){return bake(B(14,11,roof?13:9,v=>{v.box(0,0,0,13,10,7,wall);v.box(1,1,7,12,9,7,0xdcd8cc);
  if(roof){for(let i=0;i<5;i++)v.box(0,i,8+i,13,10-i,8+i,roof)}else{v.box(0,0,8,13,0,8,wall);v.box(0,10,8,13,10,8,wall);v.box(0,0,8,0,10,8,wall);v.box(13,0,8,13,10,8,wall)}
  v.box(3,10,0,4,10,4,trim);v.box(9,10,3,10,10,5,trim);v.box(0,3,3,0,4,5,trim);v.box(13,6,3,13,7,5,trim);v.box(6,0,3,7,0,5,trim)}))}
/* one landmark per place */
const LM={
  knossos:()=>B(24,11,14,v=>{const cr=0xe8dcc0;v.box(0,0,0,23,10,1,0xd9c9a0);for(const x of[3,9,15])for(const y of[2,8]){v.cyl(x,y,2,9,z=>1.1+(z-2)*0.09,0xb8322a);v.cyl(x,y,10,10,2.2,BK)}v.box(1,0,11,17,10,12,0xe8c27a);v.box(1,0,13,17,10,13,0x2f6fa8);
    v.box(19,4,2,23,6,2,cr);v.box(19,4,3,19,6,7,cr);v.box(23,4,3,23,6,7,cr);v.box(20,4,3,22,6,3,cr)}),
  tower:()=>B(15,15,27,v=>{const c=pick([0xe9dfc8,0xddd2b8,0xf2ead6],31);v.cyl(7,7,0,16,6,(x,y,z)=>(z%5===3&&(x+y)%4===0)?0x4a4238:c(x,y,z));v.ring(7,7,17,17,5.2,6.4,(x,y,z)=>((x+y)&1)?c(x,y,z):null);v.cyl(7,7,17,22,3.5,c);v.ring(7,7,23,23,2.6,3.6,(x,y,z)=>((x+y)&1)?c(x,y,z):null);v.box(7,7,23,7,7,26,DB);v.box(8,7,24,10,7,26,(x,y,z)=>z===25?WH:BLUE);v.box(7,13,0,7,13,3,DB)}),
  mansion:()=>B(20,13,15,v=>{v.box(0,0,0,19,12,4,pick([0xb5aa98,0xa59a88,0xc5baa8],32));v.box(0,0,5,19,12,8,WH);for(let i=0;i<=5;i++)v.box(0,i,9+i,19,12-i,9+i,i%2?0x6a6a72:0x5c5c64);v.box(5,12,5,14,12,6,BR);v.box(5,12,5,14,12,5,DB);
    v.box(8,12,0,10,12,3,DB);for(const x of[3,15]){v.box(x,12,6,x+1,12,7,DB);v.box(x,0,6,x+1,0,7,DB)}v.box(0,5,6,0,7,7,DB);v.box(19,5,6,19,7,7,DB);v.box(15,3,11,16,4,15,0xa59a88)}),
  cabin:()=>B(15,12,14,v=>{v.box(1,1,0,13,10,5,(x,y,z)=>z%2?0x7a5a3a:0x6a4a2e);for(let i=0;i<=5;i++)v.box(0,i,6+i,14,11-i,6+i,i%2?0x4a5a4a:0x3e4e40);v.box(6,10,0,7,10,3,DB);v.box(10,10,2,11,10,3,0xffe36b);v.box(3,10,2,4,10,3,0xffe36b);v.box(11,3,8,12,4,13,GY);
    v.box(14,2,0,14,9,2,0x8a6a45)}),
  temple:()=>B(22,13,15,v=>{v.box(0,0,0,21,12,0,0xd4cfc0);v.box(1,1,1,20,11,1,MARBLE);for(const x of[3,7,11,15,19])for(const y of[2,10])v.box(x,y,2,x,y,9,pick([MARBLE,0xddd7c6,0xf2eee2],33));v.box(6,4,2,16,8,8,0xd9d2c0);v.box(2,1,10,20,11,10,MARBLE);
    for(let i=0;i<3;i++)v.box(2,1+i*2,11+i,20,11-i*2,11+i,i===0?0xe0d9c8:0xc9896a);v.box(10,5,14,12,7,14,GD)}),
  dome:()=>B(18,11,16,v=>{v.box(3,0,0,17,10,7,WH);v.box(4,1,8,16,9,8,WH);v.ell(11,5,8.5,4,4,4.6,pick([0x2a6fc9,0x2462b4,0x3079d6],8),9);v.set(11,5,14,WH);v.set(11,5,15,WH);v.box(0,3,0,3,7,11,WH);v.box(1,3,8,2,3,10,DBLUE);v.box(1,7,8,2,7,10,DBLUE);v.box(0,4,8,0,6,10,DBLUE);v.box(0,3,12,3,7,12,BLUE);v.box(1,4,13,2,6,13,BLUE);
    v.box(17,4,0,17,5,4,BLUE);v.box(8,10,3,9,10,5,BLUE);v.box(8,0,3,9,0,5,BLUE)}),
  parthenon:()=>B(28,16,16,v=>{v.box(0,0,0,27,15,0,0xd4cfc0);v.box(1,1,1,26,14,1,0xddd7c6);v.box(2,2,2,25,13,2,MARBLE);const col=pick([MARBLE,0xddd7c6,0xf2eee2],34);
    for(let x=3;x<=24;x+=3){v.box(x,3,3,x,3,10,col);v.box(x,12,3,x,12,10,col)}for(let y=6;y<=9;y+=3){v.box(3,y,3,3,y,10,col);v.box(24,y,3,24,y,10,col)}v.box(7,6,3,20,9,9,0xd9d2c0);
    v.ring(13.5,7.5,11,11,0,99,null);for(let x=2;x<=25;x++)for(let y=2;y<=13;y++)v.set(x,y,11,MARBLE);for(let i=0;i<3;i++)v.box(2,2+i*2,12+i,25,13-i*2,12+i,0xe0d9c8);v.box(2,7,14,25,8,14,0xcfc8b4)}),
  anchor:()=>B(15,7,19,v=>{const c=0x3a4a5a;v.box(2,0,0,12,6,1,0xb0a898);v.plate(2,4,(x,z)=>{if(z<2)return null;const d=Math.hypot(x-7,z-16);if(d<=2.6&&d>=1.2)return c;if(x===7&&z>=3&&z<=14)return c;if(z===12&&x>=3&&x<=11)return 0x8a5a34;const a=Math.hypot(x-7,z-9);if(a>=5&&a<=6.5&&z<=7)return c;return null});
    v.box(1,2,6,2,4,8,c);v.box(12,2,6,13,4,8,c)}),
  castle:()=>B(27,14,17,v=>{const st=pick([0xc9b48a,0xbda87e,0xd4c096],35);v.box(4,4,0,22,9,8,st);for(let x=4;x<=22;x+=2){v.box(x,4,9,x,4,9,st);v.box(x,9,9,x,9,9,st)}for(const cx of[4,22]){v.cyl(cx,6.5,0,12,3.6,st);v.ring(cx,6.5,13,13,2.6,3.8,(x,y,z)=>((x+y)&1)?st(x,y,z):null)}
    v.box(12,9,0,14,9,5,DB);v.set(13,9,6,DB);v.box(13,6,9,13,6,15,DB);v.box(14,6,13,16,6,15,RD);v.box(8,9,5,9,9,6,DB);v.box(17,9,5,18,9,6,DB)}),
  pythagoras:()=>B(21,7,19,v=>{v.box(0,0,0,20,6,1,0xcfcabb);v.plate(2,4,(x,z)=>{if(z<2)return null;if((x===3||x===4)&&z<=17)return MARBLE;if((z===2||z===3)&&x>=3&&x<=18)return MARBLE;const t=x+z;if((t===21||t===22)&&x>=4&&x<=18)return 0xe0d9c8;return null});
    v.box(9,3,4,10,3,8,0x4f8f7f);v.box(9,3,9,10,3,10,0x5a9a8a);v.box(11,3,7,12,3,7,0x4f8f7f)}),
  tholos:()=>B(21,21,14,v=>{v.cyl(10,10,0,0,10,0xd4cfc0);v.cyl(10,10,1,1,8.8,MARBLE);for(let k=0;k<12;k++){const a=k*TAU/12,x=10+Math.cos(a)*7,y=10+Math.sin(a)*7;v.cyl(x,y,2,k<3?10:2+(k*5)%3,1.1,pick([MARBLE,0xddd7c6,0xf2eee2],36))}
    for(let a=-0.15;a<=1.2;a+=0.04)for(const r of[6.4,7,7.6])v.box(10+Math.cos(a)*r,10+Math.sin(a)*r,11,10+Math.cos(a)*r,10+Math.sin(a)*r,12,MARBLE);v.cyl(10,10,2,2,3,0xcfcabb)})};

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
  flag:[mFlag(false),mFlag(true)],chest:[mChest(false),mChest(true)],tholos:bake(LM.tholos()),
  hWhite:mHouse(WH,BLUE,null),hBlue:mHouse(WH,0x2f6fa8,null),hStone:mHouse(0xd9cdb4,0x356a4a,0xb5532f),hOchre:mHouse(0xe8c27a,0x7a4a2a,0xb5532f),hSlate:mHouse(0xb5aa98,DB,0x6a6a72),
  hero:[0,1,2,3].map(t=>[mHero(0,t),mHero(1,t),mHero(2,t)])};
const ALPHA=[['Α','α','άλφα','álfa','a, as in “father”'],['Β','β','βήτα','víta','v'],['Γ','γ','γάμμα','gáma','a soft gh; y before e and i'],['Δ','δ','δέλτα','délta','th, as in “this”'],['Ε','ε','έψιλον','épsilon','e, as in “met”'],['Ζ','ζ','ζήτα','zíta','z'],
  ['Η','η','ήτα','íta','ee'],['Θ','θ','θήτα','thíta','th, as in “think”'],['Ι','ι','ιώτα','ióta','ee'],['Κ','κ','κάππα','kápa','k'],['Λ','λ','λάμδα','lámda','l'],['Μ','μ','μι','mi','m'],
  ['Ν','ν','νι','ni','n'],['Ξ','ξ','ξι','xi','x (ks)'],['Ο','ο','όμικρον','ómikron','o, as in “pot”'],['Π','π','πι','pi','p'],['Ρ','ρ','ρο','ro','a rolled r'],['Σ','σ','σίγμα','sígma','s'],
  ['Τ','τ','ταυ','taf','t'],['Υ','υ','ύψιλον','ípsilon','ee'],['Φ','φ','φι','fi','f'],['Χ','χ','χι','hi','h, as in “loch”'],['Ψ','ψ','ψι','psi','ps'],['Ω','ω','ωμέγα','oméga','o']];
ALPHA.forEach(a=>a.m=mLetter(a[0]));

/* vehicles, kiosk, townsfolk and mountains */
function mCar(body,o){o=o||{};return bake(B(18,9,9,v=>{const gl=0x9fd0f0,dk=0x2a2d33,ch=0xc9ccd2;
  v.box(0,1,1,17,7,1,dk);v.box(0,1,2,17,7,3,body);v.box(0,1,2,0,7,2,ch);v.box(17,1,2,17,7,2,ch);for(const x of[2,12])for(const y of[0,8])v.box(x,y,0,x+3,y,2,dk);
  v.set(17,2,3,0xfff2a8);v.set(17,6,3,0xfff2a8);v.set(0,2,3,RD);v.set(0,6,3,RD);
  if(o.truck){v.box(11,1,4,15,7,6,(x,y,z)=>z<6&&(x===15||y===1||y===7)?gl:body);v.box(11,1,7,15,7,7,body);const w=0x8a6a45;v.box(1,1,4,9,1,5,w);v.box(1,7,4,9,7,5,w);v.box(1,1,4,1,7,5,w);v.box(3,3,4,7,5,5,0xd9b98a)}
  else{v.box(4,1,4,12,7,5,(x,y,z)=>x===8?body:(x===4||x===12||y===1||y===7)?gl:dk);v.box(4,1,6,12,7,6,o.roof||body);if(o.sign)v.box(7,3,7,9,5,7,o.sign)}}))}
function mBoat(){return bake(B(21,9,6,v=>{for(let x=0;x<21;x++){const hw=x<13?4:Math.max(0,4*(20-x)/7);for(let y=Math.ceil(4-hw);y<=4+hw;y++){v.set(x,y,0,WH);const edge=y-1<4-hw||y+1>4+hw||x===0||x>=19;v.set(x,y,1,edge?WH:0xb89468);if(edge)v.set(x,y,2,BLUE)}}
  v.box(5,1,2,6,7,2,0x8a5a34);v.box(11,1,2,12,7,2,0x8a5a34);v.box(0,3,2,0,5,4,0x2a2d33);v.set(0,4,5,RD);v.box(16,4,2,16,4,5,0xe2e2e2);v.box(14,4,4,15,4,5,(x,y,z)=>z===5?BLUE:WH)}))}
function mPed(f,shirt,hair){return bake(B(7,7,14,v=>{const a=f===1?1:f===2?-1:0;v.box(3+a,2,0,3+a,2,3,0x3a4a6a);v.box(3-a,4,0,3-a,4,3,0x3a4a6a);v.box(2,1,4,4,5,8,shirt);v.box(3-a,0,5,3-a,0,8,SK);v.box(3+a,6,5,3+a,6,8,SK);
  v.box(2,2,9,4,4,11,SK);v.set(4,2,10,BK);v.set(4,4,10,BK);v.box(2,2,12,4,4,12,hair);v.box(2,2,11,2,4,11,hair)}))}
function mMount(s,h,snow,seed){return bake(B(s,s,h,v=>{const c=s/2-0.5,lo=pick([0x6f8f55,0x7f9a60,0x86866f],seed),hi=pick([0x8f8a80,0x9a958c,0x7f7a72],seed+1);for(let z=0;z<h;z++){const r0=(s/2-1)*Math.pow(1-z/h,0.8);
  for(let y=0;y<s;y++)for(let x=0;x<s;x++){const a=Math.atan2(y-c,x-c),r=r0*(0.8+0.14*Math.sin(a*3+seed)+0.08*Math.sin(a*7+seed*2));if(Math.hypot(x-c,y-c)<=r)v.set(x,y,z,z>=h*snow?WH:z<h*0.3?lo:hi)}}}))}
Object.assign(M,{cars:[0xd23b2e,0x2f6fa8,0xf6f4ee,0x3f8a5c,0x8a8f98].map(c=>mCar(c)),taxi:mCar(0xf2cf3a,{sign:0x26262b}),truck:mCar(0x4a7fb5,{truck:1}),boat:mBoat(),
  moped:bake(B(11,5,8,v=>{const dk=0x2a2d33;v.box(0,2,0,2,2,2,dk);v.box(8,2,0,10,2,2,dk);v.box(2,1,2,8,3,3,0x38b0a0);v.box(2,1,4,5,3,4,BK);v.box(8,2,3,8,2,6,GY);v.box(8,0,7,8,4,7,dk);v.set(9,2,5,0xfff2a8)})),
  kiosk:bake(B(9,9,13,v=>{v.box(1,1,0,7,7,8,(x,y,z)=>z>=4&&z<=6&&(y===7||x===7)&&x>1&&y>1?0x3a2f2a:YL);v.box(0,0,9,8,8,9,x=>x%2?WH:BLUE);v.box(1,1,10,7,7,10,0xdcd8cc);v.box(2,4,11,6,4,12,RD)})),
  peds:[[0xd23b2e,0x3a2a1a],[0x2f6fa8,0x1a1a1a],[0xf2cf3a,0x6a4a2a],[0x4c9a3f,0x8a8a8a],[0xf6f4ee,0x2a1a10],[0x7b3fa0,0x3a2a1a]].map(([s,h])=>[0,1,2].map(f=>mPed(f,s,h))),
  mount:[mMount(46,30,0.72,1),mMount(34,20,2,2),mMount(40,24,2,3),mMount(28,15,2,4)]});

/* ---------- world: one continuous map of Greece — the mainland, the Peloponnese and the islands. No bridges: roads on land, boats at sea ---------- */
const WS=1.3,GX0=200,GY0=90,GW=3000,GH=2932,RR=63,PLZ=56; // WS stretches the layout below, which is written at 1:1
const ZONES=[
 {el:'Κρήτη',en:'Crete',theme:'Fruit & vegetables',x:1200,y:2140,pa:-1.57,grass:0xa9c060,decor:{lemon:8,wheat:12,olive:6,hOchre:3},lm:'knossos',sight:['Κνωσός','Knosós','Knossos — the palace of the Minoans, Europe’s oldest city, with its red columns that taper downward.']},
 {el:'Θεσσαλονίκη',en:'Thessaloniki',theme:'Food & drink',x:1150,y:260,grass:0xa9b866,decor:{olive:6,vine:10,hStone:4,shrub:5},lm:'tower',sight:['Λευκός Πύργος','Lefkós Pírgos','The White Tower — the seafront landmark of Thessaloniki, Greece’s second city and its food capital.']},
 {el:'Μέτσοβο',en:'Metsovo',theme:'Farm animals',x:480,y:480,grass:0x8fbf6a,decor:{pine:9,shrub:12,rock:5,hSlate:3},lm:'mansion',sight:['το αρχοντικό','to arhondikó','A stone mansion — Metsovo is a mountain town of shepherds, slate roofs and smoked cheese.']},
 {el:'Πίνδος',en:'Pindos',theme:'Wild animals',x:380,y:800,grass:0x6f9a55,decor:{pine:14,cypress:8,shrub:7,rock:5},lm:'cabin',sight:['το καταφύγιο','to katafíyio','A mountain refuge — the Pindos range is home to bears, wolves and deer, and to the deep Vikos gorge.']},
 {el:'Όλυμπος',en:'Olympus',theme:'Sky & nature',x:900,y:520,grass:0xb9c080,decor:{cypress:10,bush:12,shrub:7,pine:5},lm:'temple',sight:['ο ναός του Δία','o naós tu Día','A temple of Zeus — Olympus, the highest mountain in Greece, was the home of the twelve gods.']},
 {el:'Σαντορίνη',en:'Santorini',theme:'The home',x:1500,y:1790,pa:-2.4,grass:0xb5a890,decor:{hWhite:4,hBlue:3,bush:12,olive:4},lm:'dome',sight:['ο γαλάζιος τρούλος','o galázios trúlos','A blue-domed church — Santorini’s white villages sit on the rim of a sunken volcano.']},
 {el:'Αθήνα',en:'Athens',theme:'The town',x:1250,y:1180,grass:0xb8b890,decor:{olive:8,cypress:6,hWhite:3,hOchre:2,shrub:5},lm:'parthenon',sight:['ο Παρθενώνας','o Parthenónas','The Parthenon — Athena’s temple on the Acropolis, 2,400 years old, above the capital of Greece.']},
 {el:'Πειραιάς',en:'Piraeus',theme:'Travel & clothes',x:1060,y:1350,pa:1.2,grass:0xa5c080,decor:{cypress:5,rock:5,shrub:9,hBlue:3,hWhite:2},lm:'anchor',sight:['η άγκυρα','i ángira','The anchor — Piraeus has been the port of Athens since ancient times; boats leave here for the islands.']},
 {el:'Ρόδος',en:'Rhodes',theme:'Crafted things',x:2100,y:1800,pa:3.14,grass:0xb0a878,decor:{rock:6,ember:7,cypress:6,hStone:3},lm:'castle',sight:['το κάστρο','to kástro','The castle of the Knights — the medieval old town of Rhodes is one of the best preserved in Europe.']},
 {el:'Σάμος',en:'Samos',theme:'Numbers',x:1950,y:1100,pa:2.7,grass:0xa8c8a0,decor:{cypress:7,bush:9,olive:6,hWhite:3},lm:'pythagoras',sight:['ο Πυθαγόρας','o Pithagóras','Pythagoras — the mathematician was born on Samos; his monument is a right-angled triangle.']},
];
const HUB={el:'Δελφοί',en:'Delphi',theme:'',grass:0xa9c47a,decor:{cypress:11,bush:9,olive:7},x:800,y:980,seed:7,i:-1,hub:true,kind:'hub',sight:['η Θόλος','i Thólos','The Tholos of Delphi — the ancient Greeks called Delphi the navel of the world.']};
ZONES.forEach((z,i)=>{z.seed=101+i*17;z.i=i;z.kind='zone'});
const SECRETS=[[840,1830,'Μονεμβασιά','Monemvasia'],[800,2200,'Ελαφονήσι','Elafonisi'],[2350,2050,'Καστελλόριζο','Kastellorizo'],[1500,430,'Χαλκιδική','Halkidiki']].map(([x,y,el,en],k)=>({el,en,x,y,r:36,seed:900+k*13,k,kind:'secret'}));
const PLACES=[HUB,...ZONES],ISLETS=[HUB,...ZONES,...SECRETS],props=[],OBJ=[],FEATHERS=[],LETTERS=[],SOLIDS=[],CSOL=[],SIGHTS=[],ROADS=[],PIERS=[],VEH=[],PEDS=[];
PLACES.forEach(p=>{p.r=92;p.plaza=true;p.exits=[]});ISLETS.forEach(d=>{d.x=Math.round(d.x*WS);d.y=Math.round(d.y*WS)});const ws=(x,y,o)=>Object.assign({x:x*WS,y:y*WS},o);
/* land is the union of these capsules [x0,y0,x1,y1,r], plus a disc under every town and a strip under every road, roughened with noise */
const LAND=[[520,330,1250,300,170],[430,420,400,880,185],[800,520,830,960,210],[880,1010,1260,1180,125],[1000,1360,830,1440,50],[640,1580,640,1600,225],[700,1700,840,1830,62],[560,1760,520,1890,40],[660,1800,650,1910,36],
  [1300,340,1500,430,62],[1500,430,1570,540,22],[1470,450,1500,570,22],[1425,440,1440,560,22],[860,2180,1480,2130,95],[800,2200,860,2190,48],[2060,1740,2160,1900,95],[1900,1090,2030,1110,90]].map(c=>c.map(v=>v*WS));
function spline(P){const out=[];for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)],n=Math.ceil(Math.hypot(p2[0]-p1[0],p2[1]-p1[1])/2);
  for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t,f=j=>0.5*(2*p1[j]+(p2[j]-p0[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(3*p1[j]-p0[j]-3*p2[j]+p3[j])*t3);out.push([f(0),f(1)])}}out.push(P[P.length-1]);return out}
function addRoad(A,Bp,via,pier){const P=[[A.x,A.y],...(via||[]),[Bp.x,Bp.y]];if(!via){const dx=Bp.x-A.x,dy=Bp.y-A.y,o=(hash2(A.x,Bp.y,5)-0.5)*0.2;P.splice(1,0,[A.x+dx/2-dy*o,A.y+dy/2+dx*o])}
  const pts=spline(P).filter(p=>(!A.plaza||Math.hypot(p[0]-A.x,p[1]-A.y)>=RR)&&(!Bp.plaza||Math.hypot(p[0]-Bp.x,p[1]-Bp.y)>=RR)),r={A,B:Bp,pts,pier};ROADS.push(r);
  if(A.plaza)A.exits.push({a:Math.atan2(pts[0][1]-A.y,pts[0][0]-A.x),to:Bp,r,end:0});if(Bp.plaza){const q=pts[pts.length-1];Bp.exits.push({a:Math.atan2(q[1]-Bp.y,q[0]-Bp.x),to:A,r,end:1})}return r}
for(const[a,b]of[[-1,4],[-1,3],[-1,6],[6,7],[4,1],[4,2],[2,3],[1,2]])addRoad(a<0?HUB:ZONES[a],ZONES[b]);
addRoad(ZONES[7],ws(650,1570,{el:'Σπάρτη',en:'Sparta'}),[[915*WS,1400*WS],[760*WS,1500*WS]]);addRoad(ZONES[0],ws(900,2182,{el:'Χανιά',en:'Chania'}),[[1050*WS,2175*WS]]);addRoad(ZONES[0],ws(1440,2126,{el:'Σητεία',en:'Sitia'}),[[1330*WS,2120*WS]]);
const TY=new Int8Array(GW*GH),DQ=new Int8Array(GW*GH); // TY: -1 sea, 0 sand, 1 grass, 2 road, 3 road paint, 4 plaza, 5 pier
{const D=new Float32Array(GW*GH).fill(200);
  const cap=(x0,y0,x1,y1,r)=>{const m=r+54,ax=Math.max(0,Math.floor(Math.min(x0,x1)-m-GX0)),bx=Math.min(GW-1,Math.ceil(Math.max(x0,x1)+m-GX0)),ay=Math.max(0,Math.floor(Math.min(y0,y1)-m-GY0)),by=Math.min(GH-1,Math.ceil(Math.max(y0,y1)+m-GY0)),dx=x1-x0,dy=y1-y0,l2=dx*dx+dy*dy||1;
    for(let y=ay;y<=by;y++)for(let x=ax;x<=bx;x++){const px=x+GX0-x0,py=y+GY0-y0,t=clamp((px*dx+py*dy)/l2,0,1),ex=px-dx*t,ey=py-dy*t,d=Math.sqrt(ex*ex+ey*ey)-r,i=x+y*GW;if(d<D[i])D[i]=d}};
  for(const c of LAND)cap(...c);for(const p of PLACES)cap(p.x,p.y,p.x,p.y,132);for(const q of SECRETS)cap(q.x,q.y,q.x,q.y,62);
  for(const r of ROADS)for(let i=0;i<r.pts.length-1;i+=20){const a=r.pts[i],b=r.pts[Math.min(r.pts.length-1,i+20)];cap(a[0],a[1],b[0],b[1],42)}
  for(let y=0,i=0;y<GH;y++)for(let x=0;x<GW;x++,i++){let d=D[i];if(d<54)d+=(vnoise((x+GX0)*0.011,(y+GY0)*0.011,71)-0.5)*40+(vnoise((x+GX0)*0.045,(y+GY0)*0.045,72)-0.5)*12;TY[i]=d<=-5?1:d<0?0:-1;DQ[i]=clamp(Math.round(d),-127,127)}}
const ty=(x,y)=>{x=Math.round(x)-GX0;y=Math.round(y)-GY0;return x<0||y<0||x>=GW||y>=GH?-1:TY[x+y*GW]};
const walkable=(x,y)=>ty(x,y)>=0,groundZ=(x,y)=>ty(x,y)>=1?TS:0;
function disc(cx,cy,r,fn){const x0=Math.max(0,Math.floor(cx-r-GX0)),x1=Math.min(GW-1,Math.ceil(cx+r-GX0)),y0=Math.max(0,Math.floor(cy-r-GY0)),y1=Math.min(GH-1,Math.ceil(cy+r-GY0));
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const dx=x+GX0-cx,dy=y+GY0-cy,q=dx*dx+dy*dy;if(q<=r*r){const i=x+y*GW,t=fn(TY[i],Math.sqrt(q),dx,dy);if(t!=null)TY[i]=t}}}
function addPier(P,ang,len){const c=Math.cos(ang),s=Math.sin(ang);let r=12;while(r<500&&ty(P.x+c*r,P.y+s*r)>=0)r++;const pier={x:P.x+c*(r+len),y:P.y+s*(r+len),bx:P.x+c*(r-10),by:P.y+s*(r-10),a:ang,r0:r-10,r1:r+len,P,boats:[]};PIERS.push(pier);
  if(P.plaza)addRoad(P,{x:pier.bx,y:pier.by,el:'λιμάνι',en:'port',port:true},[],true);return pier}
ZONES.forEach(z=>{if(z.pa!=null)z.pier=addPier(z,z.pa,46)});SECRETS[2].pier=addPier(SECRETS[2],-2.6,40);
for(const p of PLACES)disc(p.x,p.y,RR+7,(t,q,dx,dy)=>t<0?null:q<PLZ?4:Math.abs(q-RR)<0.7&&((Math.atan2(dy,dx)+Math.PI)*RR%14)<7?3:2);
for(const r of ROADS)for(const p of r.pts)disc(p[0],p[1],6.5,t=>t===0||t===1?2:null);
for(const r of ROADS){let s=0;r.pts.forEach((p,i)=>{if(i)s+=Math.hypot(p[0]-r.pts[i-1][0],p[1]-r.pts[i-1][1]);if(s%14<7)disc(p[0],p[1],0.8,t=>t===2?3:null)});r.len=s}
for(const p of PIERS)for(let t=p.r0;t<=p.r1;t++)disc(p.P.x+Math.cos(p.a)*t,p.P.y+Math.sin(p.a)*t,4,t=>t<2?5:null);
/* which landmass is this? (flood fill on a coarse grid) */
const LS=6,LW=Math.ceil(GW/LS),LAB=new Int16Array(LW*Math.ceil(GH/LS));
{let id=0;const H=Math.ceil(GH/LS),q=new Int32Array(LAB.length),ok=i=>TY[Math.min(GW-1,(i%LW)*LS+3)+Math.min(GH-1,Math.floor(i/LW)*LS+3)*GW]>=0;
  for(let s=0;s<LAB.length;s++){if(LAB[s]||!ok(s))continue;id++;let h=0,t=0;q[t++]=s;LAB[s]=id;while(h<t){const i=q[h++],x=i%LW,y=Math.floor(i/LW);for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,j=nx+ny*LW;if(nx<0||ny<0||nx>=LW||ny>=H||LAB[j]||!ok(j))continue;LAB[j]=id;q[t++]=j}}}}
function landOf(x,y){const cx=Math.floor((x-GX0)/LS),cy=Math.floor((y-GY0)/LS);for(let r=0;r<3;r++)for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){const X=cx+i,Y=cy+j;if(X<0||Y<0||X>=LW||Y*LW>=LAB.length)continue;const l=LAB[X+Y*LW];if(l)return l}return 0}
ISLETS.forEach(d=>d.land=landOf(d.x,d.y));PIERS.forEach(p=>p.land=landOf(p.bx,p.by));
/* placing things */
const OW=GW>>2,OH=GH>>2,OC=new Uint8Array(OW*OH);
function occ(x,y,r,set){const x0=Math.max(0,Math.floor((x-r-GX0)/4)),x1=Math.min(OW-1,Math.floor((x+r-GX0)/4)),y0=Math.max(0,Math.floor((y-r-GY0)/4)),y1=Math.min(OH-1,Math.floor((y+r-GY0)/4));for(let j=y0;j<=y1;j++)for(let i=x0;i<=x1;i++){if(set)OC[i+j*OW]=1;else if(OC[i+j*OW])return false}return true}
const grassy=(x,y,r)=>ty(x,y)===1&&ty(x+r,y)===1&&ty(x-r,y)===1&&ty(x,y+r)===1&&ty(x,y-r)===1,spot=(x,y,r)=>grassy(x,y,r)&&occ(x,y,r,false);
const VT={car:{top:150,acc:110,turn:2.5,r:6.5},taxi:{top:160,acc:120,turn:2.5,r:6.5},truck:{top:125,acc:85,turn:2.2,r:7},moped:{top:135,acc:150,turn:3.2,r:4},boat:{top:118,acc:75,turn:1.9,r:7}};
const VN={car:['το αυτοκίνητο','to aftokínito','car'],taxi:['το ταξί','to taxí','taxi'],truck:['το φορτηγάκι','to fortigáki','pickup truck'],moped:['το μηχανάκι','to mihanáki','moped'],boat:['η βάρκα','i várka','boat']};
function addVeh(t,x,y,a){const v={veh:true,t,kind:t==='boat'?'boat':'car',m:t==='car'?M.cars[VEH.length%M.cars.length]:M[t],x,y,a,v:0,hx:x,hy:y,ha:a,z:t==='boat'?0:groundZ(x,y),...VT[t]};VEH.push(v);return v}
const isSmall=k=>k==='bush'||k==='shrub'||k==='wheat'||k==='vine'||k==='ember';
function decor(k,x,y,rot){const house=k[0]==='h'&&M[k].w===14;props.push({m:M[k],x,y,z:TS,rot});occ(x,y,house?10:isSmall(k)?3:5,true);if(house){SOLIDS.push({x,y,r:6.5});CSOL.push({x,y,r:7.5})}else if(!isSmall(k))CSOL.push({x,y,r:k==='rock'?3.2:2.2})}
function populate(d){const rnd=mulberry(d.seed+3),W2=(a,r)=>[d.x+Math.cos(a)*r,d.y+Math.sin(a)*r];
  if(d.kind==='secret'){d.chest={m:M.chest[0],x:d.x,y:d.y,z:groundZ(d.x,d.y),rot:d.seed,chest:d};props.push(d.chest);SOLIDS.push({x:d.x,y:d.y,r:6.5});occ(d.x,d.y,9,true);
    const a=rnd()*TAU,[x,y]=W2(a,15);LETTERS.push({i:20+d.k,x,y,z:groundZ(x,y),ph:rnd()*TAU});occ(x,y,5,true);
    for(let k=1;k<=3;k++){const[fx,fy]=W2(a+k*TAU/4,17);FEATHERS.push({x:fx,y:fy,z:groundZ(fx,fy),ph:k});occ(fx,fy,4,true)}
    for(let n=0;n<7;n++)for(let t=0;t<30;t++){const[x2,y2]=W2(rnd()*TAU,22+rnd()*26);if(spot(x2,y2,4)){decor(n<2?'cypress':n<5?'bush':'shrub',x2,y2,rnd()*TAU);break}}return}
  occ(d.x,d.y,RR+9,true);
  if(d.hub){d.flag={m:M.tholos,x:d.x,y:d.y,z:TS,rot:0.4,flag:d};props.push(d.flag);SOLIDS.push({x:d.x,y:d.y,r:10});SIGHTS.push({x:d.x,y:d.y,d,r:24});for(let k=0;k<5;k++){const[x,y]=W2(k*TAU/5+0.4,40);FEATHERS.push({x,y,z:TS,ph:k})}}
  else{d.flag={m:M.flag[0],x:d.x,y:d.y,z:TS,rot:0,flag:d};props.push(d.flag);SOLIDS.push({x:d.x,y:d.y,r:4.5})}
  let la=0,bs=-1;for(let k=0;k<36;k++){const a=k*TAU/36;let s=9;for(const e of d.exits)s=Math.min(s,Math.abs(angDiff(a,e.a)));if(s>bs){bs=s;la=a}}d.la=la;
  if(d.lm){const m=bake(LM[d.lm]()),[x,y]=W2(la,92);props.push({m,x,y,z:TS,rot:la+Math.PI/2});occ(x,y,m.w/2+3,true);SOLIDS.push({x,y,r:m.d/2+1});SIGHTS.push({x,y,d,r:26})}
  if(d.kind==='zone'){const a0=rnd()*TAU;for(let k=0;k<10;k++){const a=a0+k*TAU/10,[x,y]=W2(a,38);OBJ.push({w:d.i*10+k,x,y,z:TS,isl:d.i,ph:rnd()*TAU,m:WD[d.i*10+k].m});SOLIDS.push({x,y,r:5})}
    {const a=a0+TAU/20,[x,y]=W2(a,49);d.kiosk={m:M.kiosk,x,y,z:TS,rot:a+Math.PI/2,kiosk:d};props.push(d.kiosk);SOLIDS.push({x,y,r:4.5})}
    for(let k=0;k<3;k++){const[x,y]=W2(a0+(k*3+2.5)*TAU/10,48);FEATHERS.push({x,y,z:TS,ph:rnd()*TAU})}
    for(let k=0;k<3;k++){let a=la+Math.PI+(k-1)*1.1,x,y;for(let t=0;t<40;t++){[x,y]=W2(a,84);if(spot(x,y,4))break;a+=0.21}FEATHERS.push({x,y,z:TS,ph:rnd()*TAU});occ(x,y,4,true)}
    for(let k=0;k<2;k++){let a=la+(k?1.25:-1.25),x,y;for(let t=0;t<40;t++){[x,y]=W2(a,104);if(spot(x,y,6))break;a+=k?0.2:-0.2}LETTERS.push({i:d.i*2+k,x,y,z:TS,ph:rnd()*TAU});occ(x,y,6,true)}}
  for(let k=0;k<2;k++){let a=la+(k?2.2:-2.2);for(let t=0;t<40;t++){if(d.exits.every(e=>Math.abs(angDiff(a,e.a))>0.32))break;a+=0.15}const[x,y]=W2(a,76.5);addVeh(k&&!d.hub?['moped','truck','taxi'][d.i%3]:'car',x,y,a+Math.PI/2);occ(x,y,10,true);CSOL.length}
  for(const k in d.decor)for(let n=0;n<d.decor[k];n++)for(let t=0;t<60;t++){const a=rnd()*TAU,[x,y]=W2(a,78+rnd()*46),house=k[0]==='h'&&M[k].w===14;if(!spot(x,y,house?11:isSmall(k)?3:5))continue;decor(k,x,y,house?a+Math.PI/2:rnd()*TAU);break}
  for(let k=0;k<(d.hub?2:3);k++){const a=rnd()*TAU,[x,y]=W2(a,46+rnd()*6);PEDS.push({x,y,tx:x,ty:y,d,dir:a,wait:rnd()*3,m:M.peds[(d.seed+k)%M.peds.length],say:'',sayT:0,cool:0})}
}
ISLETS.forEach(populate);
/* mountains, countryside, boats, road pickups and traffic */
{const rnd=mulberry(4242);
  for(const[x0,y0,mi]of[[770,430,0],[300,620,1],[335,555,3],[285,700,2],[540,650,2],[700,760,1],[960,770,3],[560,1650,2],[700,1510,1],[1000,2195,0],[2110,1900,3],[1010,330,3]]){let done=false;const m=M.mount[mi],r=m.w*0.42;
    for(let q=0;q<60&&!done;q+=6)for(let k=0;k<8&&!done;k++){const x=x0*WS+Math.cos(k*TAU/8)*q,y=y0*WS+Math.sin(k*TAU/8)*q;if(spot(x,y,r)&&grassy(x,y,r*0.7)){props.push({m,x,y,z:TS,rot:rnd()*TAU});occ(x,y,r+2,true);SOLIDS.push({x,y,r:r*0.8});done=true}}}
  for(let gy=GY0;gy<GY0+GH;gy+=24)for(let gx=GX0;gx<GX0+GW;gx+=24){if(rnd()>0.25)continue;const x=gx+rnd()*20,y=gy+rnd()*20;if(!spot(x,y,5)||PLACES.some(p=>Math.hypot(p.x-x,p.y-y)<128))continue;
    const n=vnoise(x*0.01,y*0.01,5),q=rnd(),k=y<900*WS&&x<1350*WS?(n>0.5?'pine':q<0.25?'rock':q<0.6?'cypress':'shrub'):y>1700*WS||x>1700*WS?(q<0.4?'olive':q<0.6?'lemon':q<0.8?'bush':'wheat'):(q<0.45?'olive':q<0.7?'cypress':q<0.85?'shrub':'pine');decor(k,x,y,rnd()*TAU)}
  for(const p of PIERS)for(const sd of[1,-1]){const c=Math.cos(p.a),s=Math.sin(p.a),b=addVeh('boat',p.x-c*9-s*11*sd,p.y-s*9+c*11*sd,p.a);b.pier=p;p.boats.push(b)}
  ROADS.forEach((r,ri)=>{if(r.pier)return;const n=r.pts.length;for(const f of r.len>260?[0.3,0.7]:[0.5]){const p=r.pts[Math.floor(n*f)];FEATHERS.push({x:p[0],y:p[1],z:TS,ph:f*9})}
    if(!r.B.plaza){const p=r.pts[n-1],q=r.pts[n-8],a=Math.atan2(p[1]-q[1],p[0]-q[0]);addVeh(ri%2?'moped':'truck',p[0]-Math.sin(a)*11,p[1]+Math.cos(a)*11,a+Math.PI)}
    else if(ri!==3){const c=addVeh('car',r.pts[n>>1][0],r.pts[n>>1][1],0);c.ai={road:r,i:n>>1,dir:ri%2?1:-1,ring:null,stuck:0};c.top=58}});
  {const r=ROADS.find(r=>r.B.en==='Chania'),c=addVeh('taxi',r.pts[40][0],r.pts[40][1],0);c.ai={road:r,i:40,dir:1,ring:null,stuck:0};c.top=58}
}
FEATHERS.forEach((f,i)=>f.id=i);
const zoneObjs=i=>OBJ.slice(i*10,i*10+10),TIERS=[0,25,60,FEATHERS.length+40];SIGHTS.forEach((q,i)=>q.id=i);
/* the whole country at a quarter scale, for the radar and the map */
const MAPC=mk(GW>>2,GH>>2);{const c=MAPC.getContext('2d'),im=c.createImageData(GW>>2,GH>>2),col={0:[234,217,166],1:[166,196,122],2:[84,88,98],3:[84,88,98],4:[233,228,214],5:[150,110,70]};
  for(let y=0;y<GH>>2;y++)for(let x=0;x<GW>>2;x++){let t=-1;for(const[dx,dy]of[[1,1],[3,1],[1,3],[3,3]]){const q=TY[x*4+dx+(y*4+dy)*GW];if(q>t)t=q;if(q===2||q===3){t=2;break}}const o=(x+y*(GW>>2))*4;
    if(t<0){const d=DQ[x*4+2+(y*4+2)*GW];if(d<14){im.data[o]=120;im.data[o+1]=200;im.data[o+2]=225;im.data[o+3]=150}continue}const k=col[t],n=t===1?0.94+hash2(x,y,3)*0.1:1;im.data[o]=k[0]*n;im.data[o+1]=k[1]*n;im.data[o+2]=k[2]*n;im.data[o+3]=255}c.putImageData(im,0,0)}

/* ---------- state ---------- */
const SAVE='onomata-v1';
let S={found:{},lit:Array(10).fill(false)};
try{const s=JSON.parse(localStorage.getItem(SAVE));if(s&&s.lit&&s.lit.length===10&&s.found)S=s}catch(e){}
for(const k of['feathers','letters','chests','seen','sights','rides'])if(!S[k]||typeof S[k]!=='object')S[k]={};
S.cash=+S.cash||0;S.jobs=+S.jobs||0;
const save=()=>{try{localStorage.setItem(SAVE,JSON.stringify(S))}catch(e){}};
const FPS=/[?&]fps/.test(location.search)?document.body.appendChild(Object.assign(document.createElement('div'),{id:'fps'})):null;
const DEBUG=/[?&]debug/.test(location.search),NOAUTO=/[?&]noauto/.test(location.search);
let state='title',muted=false,musOn=true,T=0,SC=/[?&]sc=1/.test(location.search)?1:2;
const SP=S.px&&walkable(S.px,S.py)&&SOLIDS.every(o=>Math.hypot(o.x-S.px,o.y-S.py)>o.r+1)?[S.px,S.py]:[HUB.x,HUB.y+46];
const player={x:SP[0],y:SP[1],z:groundZ(SP[0],SP[1]),dir:Math.PI/2,vx:0,vy:0,moving:false,sprint:false,veh:null},cam={x:0,y:0,r:0,vr:0},keys={},ptr={down:false,x:0,y:0},joy={id:null,ox:0,oy:0,dx:0,dy:0};
let rotHeld=0;
const foundOn=i=>{let n=0;for(let k=0;k<10;k++)if(S.found[i*10+k])n++;return n};
const litN=()=>S.lit.filter(Boolean).length,count=o=>Object.keys(o).length;
const featherN=()=>count(S.feathers)+10*count(S.chests);
const tier=()=>{const n=featherN();return n>=TIERS[3]?3:n>=TIERS[2]?2:n>=TIERS[1]?1:0};
function syncLights(){ZONES.forEach((d,i)=>d.flag.m=M.flag[S.lit[i]?1:0]);SECRETS.forEach(s=>s.chest.m=M.chest[S.chests[s.k]?1:0])}
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
function hud(){$('hLit').textContent=litN();$('hFound').textContent=count(S.found);$('hFeather').textContent=featherN();$('hLet').textContent=count(S.letters);$('hCash').textContent=S.cash}
hud();
function toast(html,ms=3600){const e=document.createElement('div');e.className='toast';e.innerHTML=html;$('toasts').appendChild(e);while($('toasts').children.length>3)$('toasts').firstChild.remove();setTimeout(()=>{e.classList.add('out');setTimeout(()=>e.remove(),400)},ms)}
let cardW=-1;
function openCard(w){cardW=w;state='card';const i=Math.floor(w/10),d=ZONES[i];S.found[w]=1;save();hud();
  $('cKick').textContent=`${d.en} · ${d.theme} · ${foundOn(i)} of 10`;$('cEl').textContent=WD[w].el;$('cTr').textContent=WD[w].tr;$('cEn').textContent=WD[w].en;show('card',true);chime();vib(15);setTimeout(()=>speak(WD[w].el),250)}
function closeCard(){if(state!=='card')return;show('card',false);state='play'}
$('cOk').onclick=closeCard;$('cHear').onclick=()=>speak(WD[cardW].el);

/* the trial, part 1: the god names a thing in Greek and you run to it */
let trial=null;
function startTrial(i,practice){document.body.classList.add('trial');trial={i,practice,q:shuffle([...Array(10)].map((_,k)=>({w:i*10+k}))),done:0,miss:0};state='fetch';$('ask').classList.add('on');ask('')}
function ask(fb,ok){const w=WD[trial.q[0].w];$('aN').textContent=`${trial.done+1} / ${trial.done+trial.q.length}`;$('aEl').textContent=w.el;$('aTr').textContent=w.tr;$('aFb').textContent=fb||'Go to the right thing.';$('aFb').style.color=fb?(ok?'#2c9a4b':'#d04a3a'):'#5a6f8f';
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
  if(first&&all){$('qKick').textContent='Ten flags fly over Greece';$('qBig').textContent='Γνώρισες την Ελλάδα!';$('qTr').textContent='gnórises tin Elláda — “you have got to know Greece”';$('qFb').style.color='#0b2a55';$('qFb').textContent='You have learned 100 Greek words. Συγχαρητήρια — congratulations!'}
  else{$('qKick').textContent=first?`${d.en} raises its flag for you`:`${d.en} · practice complete`;$('qBig').textContent=first?'Η σημαία υψώθηκε!':'Μπράβο!';$('qTr').textContent=first?'i siméa ipsóthike — “the flag is raised”':'brávo — “well done”';
    $('qFb').style.color='#0b2a55';$('qFb').textContent=`${quiz.miss?quiz.miss+' slip'+(quiz.miss>1?'s':'')+', all corrected.':'A perfect run.'}${first?' Ten more words learned — follow the road signs to the next place.':''}`}
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
function checkTier(before){for(let t=1;t<=3;t++)if(before<TIERS[t]&&featherN()>=TIERS[t]){fanfare();toast(['','<b>Golden wings!</b> Hermes lends you speed.','<b>A messenger’s red cloak!</b> You run faster still.','<b>The golden tunic!</b> Every feather in Greece is yours.'][t],5200)}}

let resetArm=false;
function openLex(){if(state!=='play'&&state!=='lex')return;state='lex';const body=$('lexBody');body.innerHTML=`<p class="stat">🇬🇷 ${litN()}/10 places · 📜 ${count(S.found)}/100 named · <b>${litN()*10}/100 words learned</b> · 🏛 ${count(S.sights)}/${SIGHTS.length} sights · 🪶 ${featherN()} feathers · 🗝 ${count(S.chests)}/4 chests · 💶 €${S.cash} from ${S.jobs} deliver${S.jobs===1?'y':'ies'}</p>`;
  ZONES.forEach((d,i)=>{body.insertAdjacentHTML('beforeend',`<h3>${S.lit[i]?'★':'☆'} <span class="gr">${d.el}</span> · ${d.en} — ${d.theme} (${foundOn(i)}/10)${S.sights[SIGHTS.findIndex(q=>q.d===d)]?' · <span class="gr">'+d.sight[0]+'</span> seen':''}</h3>`);const g=document.createElement('div');g.className='lw';
    for(let k=0;k<10;k++){const w=i*10+k,e=document.createElement('div');if(S.found[w]){e.appendChild(icon(w,1.5));e.insertAdjacentHTML('beforeend',`<span><b class="gr">${WD[w].el}</b> <em>${WD[w].tr}</em><br>${WD[w].en}</span>`);e.onclick=()=>speak(WD[w].el)}else{e.className='no';e.textContent='· · ·'}g.appendChild(e)}body.appendChild(g)});
  body.insertAdjacentHTML('beforeend',`<h3>Αλφάβητο · the alphabet (${count(S.letters)}/24 letters found)</h3>`);const g=document.createElement('div');g.className='lw ab';
  ALPHA.forEach((a,i)=>{const e=document.createElement('div');if(S.letters[i]){e.innerHTML=`<b class="gr L">${a[0]}${a[1]}</b><span><b class="gr">${a[2]}</b> <em>${a[3]}</em><br>${a[4]}</span>`;e.onclick=()=>speak(a[2])}else{e.className='no';e.innerHTML='<b class="gr L">?</b>'}g.appendChild(e)});body.appendChild(g);
  body.insertAdjacentHTML('beforeend',`<h3>Στον δρόμο · on the road (${count(S.rides)}/5 rides tried)</h3>`);const g2=document.createElement('div');g2.className='lw';for(const t in VN){const e=document.createElement('div'),n=VN[t];if(S.rides[t]){e.innerHTML=`<span><b class="gr">${n[0]}</b> <em>${n[1]}</em><br>${n[2]}</span>`;e.onclick=()=>speak(n[0])}else{e.className='no';e.textContent='· · ·'}g2.appendChild(e)}body.appendChild(g2);
  $('lexReset').textContent='Reset progress';resetArm=false;show('lex',true);$('lex').firstElementChild.scrollTop=0}
function closeLex(){show('lex',false);state='play'}
$('lexClose').onclick=closeLex;$('bLex').onclick=openLex;
$('lexReset').onclick=()=>{if(!resetArm){resetArm=true;$('lexReset').textContent='Tap again to erase everything';return}if(job)endJob();S={found:{},lit:Array(10).fill(false),feathers:{},letters:{},chests:{},seen:{},sights:{},rides:{},cash:0,jobs:0};GAME.S=S;save();syncLights();hud();closeLex()};
$('bMute').onclick=()=>{muted=!muted;$('bMute').textContent=muted?'🔇':'🔊';if(muted&&'speechSynthesis'in window)speechSynthesis.cancel()};
$('bMus').onclick=()=>{musOn=!musOn;$('bMus').classList.toggle('off',!musOn)};
$('bStart').onclick=()=>{unlock();show('title',false);state='play';if(!count(S.found)&&!count(S.feathers))toast(TOUCH?'Drag anywhere to walk. Walk up to a car or a boat and tap the blue button to take it.':'WASD or arrows to walk, Shift to run, Q / E to turn the view. Press F by a car or a boat to take it.',6200)};
function openMap(){if(state!=='play')return;state='map';drawMap();show('map',true)}
function closeMap(){show('map',false);state='play'}
$('mini').onclick=openMap;$('mapClose').onclick=closeMap;$('map').onclick=e=>{if(e.target.id==='map')closeMap()};
let curZone=-1,atAltar=-1,curIslet=null;
function act(){if(state==='fetch'&&trial)return speak(WD[trial.q[0].w].el);if(state!=='play'||job)return;if(atAltar>=0){if(S.lit[atAltar])startTrial(atAltar,true);else if(foundOn(atAltar)===10)startTrial(atAltar,false)}else if(atKiosk>=0)startJob(atKiosk)}
$('act').onclick=act;$('aQuit').onclick=cancelTrial;$('aHear').onclick=act;$('veh').onclick=vehAct;$('jQuit').onclick=()=>endJob('Delivery dropped.');$('jHear').onclick=()=>{if(job)speak(WD[job.w].el)};
for(const[id,dir]of[['rL',1],['rR',-1]]){const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();rotHeld=dir;try{b.setPointerCapture(e.pointerId)}catch(_){}});for(const ev of['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>{if(rotHeld===dir)rotHeld=0})}

addEventListener('keydown',e=>{unlock();const k=e.key.toLowerCase();keys[k]=true;
  if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();
  if(state==='title'&&(k==='enter'||k===' '))return $('bStart').onclick();
  if(state==='card'&&(k==='enter'||k===' '))return closeCard();
  if(state==='quiz'||state==='riddle'){if(k>='1'&&k<='4')answer(+k-1);else if((k==='enter'||k===' ')&&$('qDone')&&state==='quiz')closeQuiz();else if(k==='escape')closeQuiz();else if(DEBUG&&k==='p'&&quiz&&quiz.cur)answer(quiz.opts.indexOf(quiz.cur.w));return}
  if(state==='lex'){if(k==='escape'||k==='l')closeLex();return}
  if(state==='map'){if(k==='escape'||k==='m')closeMap();return}
  if(state==='fetch'){if(k==='escape')cancelTrial();else if(k==='f')vehAct();else if(k===' '||k==='enter')act();else if(DEBUG&&k==='h')fetchHit(OBJ[trial.q[0].w]);return}
  if(state==='play'){if(k==='l')openLex();else if(k==='m')openMap();else if(k==='f'||k==='enter'&&(player.veh||nearV))vehAct();else if(k===' '||k==='enter')act();
    else if(DEBUG&&k==='g'&&curZone>=0){for(let j=0;j<10;j++)S.found[curZone*10+j]=1;save();hud()}
    else if(DEBUG&&k==='t'){const i=S.lit.indexOf(false);if(i>=0){player.x=ZONES[i].x;player.y=ZONES[i].y+12}}}
});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
function dropInput(){for(const k in keys)keys[k]=false;ptr.down=false;joy.id=null;joy.dx=joy.dy=0;rotHeld=0;$('joy').style.display='none';engineOff()}
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
function freeCache(){for(const o of props)o.m.cache.length=0;for(const o of VEH)o.m.cache.length=0;M.ped.cache.length=0;SPRN=0}

/* ---------- particles ---------- */
const parts=[];
function burst(x,y,z,n,cols,pw=1){for(let i=0;i<n;i++){const a=Math.random()*TAU,s=(12+Math.random()*26)*pw;parts.push({x,y,z,vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:(20+Math.random()*34)*pw,t:0,life:0.7+Math.random()*0.7,c:cols[i%cols.length],g:80})}}
function puff(x,y,z){parts.push({x:x+(Math.random()-0.5)*3,y:y+(Math.random()-0.5)*3,z,vx:(Math.random()-0.5)*8,vy:(Math.random()-0.5)*8,vz:6+Math.random()*6,t:0,life:0.45,c:0xf2ead8,g:0})}
const hex=c=>'#'+c.toString(16).padStart(6,'0');

/* ---------- update ---------- */
let hintTxt='',banTxt='',target=null,touched=null,puffT=0,nearV=null,atKiosk=-1,myLand=0,saveT=0,vehTxt='';
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
  if(spd<1.5){player.moving=false;if(!mag){player.vx=player.vy=0}return 0}
  wx=player.vx/spd;wy=player.vy/spd;const sp=spd*dt;let mdir=Math.atan2(wy,wx),mv=false;
  for(const da of[0,0.5,-0.5,1,-1,1.45,-1.45]){if(da&&!mag)break;const ca=Math.cos(da),sa=Math.sin(da),qx=player.x+(wx*ca-wy*sa)*sp,qy=player.y+(wx*sa+wy*ca)*sp;if(walkable(qx,qy)){player.x=qx;player.y=qy;mv=true;break}}
  if(!mv){player.vx*=0.6;player.vy*=0.6}
  for(const o of SOLIDS){const dx=player.x-o.x,dy=player.y-o.y,d2=dx*dx+dy*dy;if(d2<o.r*o.r&&d2>0.0001){const d=Math.sqrt(d2),px=o.x+dx/d*o.r,py=o.y+dy/d*o.r;if(walkable(px,py)){player.x+=(px-player.x)*Math.min(1,dt*18);player.y+=(py-player.y)*Math.min(1,dt*18)}}}
  player.dir+=angDiff(mdir,player.dir)*Math.min(1,dt*13);player.moving=mv;
  if(mv&&player.sprint){puffT-=dt;if(puffT<0){puffT=0.07;puff(player.x,player.y,player.z)}}
  return ix*mag;
}
/* driving: cars keep to land, boats to the sea (and may run up a beach) */
function vehOk(v,x,y){const c=Math.cos(v.a)*v.r,s=Math.sin(v.a)*v.r,boat=v.kind==='boat';
  for(const[px,py]of[[x,y],[x+c,y+s],[x-c,y-s]]){const t=ty(px,py);if(boat?t>0:t<0)return false}
  if(!boat)for(const o of CSOL){const dx=x-o.x,dy=y-o.y,rr=o.r+v.r*0.7;if(dx*dx+dy*dy<rr*rr&&dx*dx+dy*dy<(v.x-o.x)**2+(v.y-o.y)**2)return false}
  for(const o of VEH){if(o===v)continue;const dx=x-o.x,dy=y-o.y,rr=o.r+v.r;if(dx*dx+dy*dy<rr*rr&&dx*dx+dy*dy<(v.x-o.x)**2+(v.y-o.y)**2)return false}return true}
function drive(dt){const v=player.veh,boat=v.kind==='boat';let thr=0,st=0;
  const up=keys['w']||keys['arrowup'],dn=keys['s']||keys['arrowdown'],lf=keys['a']||keys['arrowleft'],rt=keys['d']||keys['arrowright'];
  if(up||dn||lf||rt){thr=(up?1:0)-(dn?1:0);st=(rt?1:0)-(lf?1:0)}
  else{let ix=0,iy=0,mag=0;
    if(joy.id!==null){const l=Math.hypot(joy.dx,joy.dy);if(l>0.14){ix=joy.dx/l;iy=joy.dy/l;mag=clamp((l-0.14)/0.6,0,1)}}
    else if(ptr.down){const[px,py]=toScreen(v.x,v.y),vx=ptr.x-px,vy=(ptr.y-py)/K,l=Math.hypot(vx,vy);if(l>8){ix=vx/l;iy=vy/l;mag=clamp(l/40,0.4,1)}}
    if(mag){const c=Math.cos(cam.r),s=Math.sin(cam.r),want=Math.atan2(-ix*s+iy*c,ix*c+iy*s),df=angDiff(want,v.a);
      if(Math.abs(df)>2.3&&v.v<30){thr=-mag;st=clamp(-angDiff(want+Math.PI,v.a)*2,-1,1)}else{thr=mag*(Math.abs(df)>1.3?0.55:1);st=clamp(df*2.4,-1,1)}}}
  const t=ty(v.x,v.y),top=v.top*(boat?(t===0?0.3:1):t>=2?1:t===1?0.62:0.45);
  if(thr>0)v.v+=v.acc*thr*dt;else if(thr<0)v.v-=(v.v>0?260:v.acc*0.6)*-thr*dt;else v.v-=Math.sign(v.v)*Math.min(Math.abs(v.v),(boat?60:55)*dt);
  if(v.v>top)v.v=Math.max(top,v.v-220*dt);if(v.v<-top*0.35)v.v=-top*0.35;
  v.a+=st*v.turn*clamp(Math.abs(v.v)/45,0,1)*Math.sign(v.v)*dt;
  const dx=Math.cos(v.a)*v.v*dt,dy=Math.sin(v.a)*v.v*dt;
  if(vehOk(v,v.x+dx,v.y+dy)){v.x+=dx;v.y+=dy}else if(vehOk(v,v.x+dx,v.y)){v.x+=dx;v.v*=1-dt*3}else if(vehOk(v,v.x,v.y+dy)){v.y+=dy;v.v*=1-dt*3}
  else{if(Math.abs(v.v)>40){beep(90,.12,'square',.05);vib(20);burst(v.x+Math.cos(v.a)*v.r,v.y+Math.sin(v.a)*v.r,v.z+3,5,[0xcfcabb,0x9a958c],0.5)}v.v*=-0.3}
  v.z+=((boat?0:groundZ(v.x,v.y))-v.z)*Math.min(1,dt*14);
  puffT-=dt;if(puffT<0&&Math.abs(v.v)>30&&(boat||t<2||(Math.abs(st)>0.8&&v.v>110))){puffT=boat?0.05:0.09;const bx=v.x-Math.cos(v.a)*v.r,by=v.y-Math.sin(v.a)*v.r;if(boat)parts.push({x:bx+(Math.random()-0.5)*6,y:by+(Math.random()-0.5)*6,z:0.5,vx:0,vy:0,vz:0,t:0,life:0.9,c:0xffffff,g:0});else puff(bx,by,v.z)}
  player.x=v.x;player.y=v.y;player.dir=v.a;player.vx=Math.cos(v.a)*v.v;player.vy=Math.sin(v.a)*v.v;player.moving=false}
function enterVeh(v){if(!v||player.veh||state!=='play'&&state!=='fetch')return;player.veh=v;v.v=0;player.vx=player.vy=0;beep(180,.06,'square',.04);beep(260,.08,'square',.04,.07);vib(15);const n=VN[v.t];
  if(!S.rides[v.t]){S.rides[v.t]=1;save();toast(`<b class="gr big2" style="font-size:22px">${n[0]}</b> <span><em>${n[1]}</em> — ${n[2]}<br><small>${TOUCH?'Drag to steer; pull back to reverse.':'W / S to go and brake, A / D to steer, F to get out.'}</small></span>`,5200);setTimeout(()=>speak(n[0]),200)}}
function exitVeh(){const v=player.veh;if(!v)return;if(Math.abs(v.v)>45){toast('Slow down first — <b class="gr">σιγά σιγά!</b>',1800);return}
  let best=null;for(let r=v.r+3;r<=v.r+21&&!best;r+=3)for(let k=0;k<28&&!best;k++){const a=v.a-Math.PI/2+(k%2?-1:1)*Math.ceil(k/2)*TAU/28,x=v.x+Math.cos(a)*r,y=v.y+Math.sin(a)*r;if(walkable(x,y)&&SOLIDS.every(o=>Math.hypot(o.x-x,o.y-y)>o.r+1))best=[x,y]}
  if(!best){toast(v.kind==='boat'?'Bring the boat to a beach or alongside a pier to get out.':'There is no room to get out here.',2600);bad();return}
  player.veh=null;v.v=0;player.x=best[0];player.y=best[1];player.z=groundZ(best[0],best[1]);player.vx=player.vy=0;beep(260,.06,'square',.04);beep(180,.08,'square',.04,.07)}
function vehAct(){if(player.veh)exitVeh();else enterVeh(nearV)}
function aiCar(c,dt){const A=c.ai,lane=3.4;let tx,tY,ta;
  if(!A.ring){const P=A.road.pts,n=P.length-1;A.i+=A.dir*c.v*dt/2;
    if(A.i<=0||A.i>=n){const pl=A.i<=0?A.road.A:A.road.B;A.i=clamp(A.i,0,n);
      if(pl.plaza){const q=P[Math.round(A.i)],ex=pl.exits.filter(e=>e.r!==A.road&&!e.r.pier);A.ring=pl;A.ang=Math.atan2(q[1]-pl.y,q[0]-pl.x);A.ex=ex.length?ex[Math.floor(Math.random()*ex.length)]:pl.exits.find(e=>e.r===A.road);let da=(A.ang-A.ex.a)%TAU;if(da<0.25)da+=TAU;A.left=da}else A.dir=-A.dir}
    if(!A.ring){const k=clamp(Math.round(A.i),0,n),a=P[clamp(k-A.dir,0,n)],b=P[clamp(k+A.dir,0,n)];let dx=b[0]-a[0],dy=b[1]-a[1];const l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;tx=P[k][0]-dy*lane;tY=P[k][1]+dx*lane;ta=Math.atan2(dy,dx)}}
  if(A.ring){const w=c.v*dt/(RR+lane);A.ang-=w;A.left-=w;if(A.left<=0){const e=A.ex;A.ring=null;A.road=e.r;A.dir=e.end===0?1:-1;A.i=e.end===0?0:e.r.pts.length-1;return}
    tx=A.ring.x+Math.cos(A.ang)*(RR+lane);tY=A.ring.y+Math.sin(A.ang)*(RR+lane);ta=A.ang-Math.PI/2}
  c.x+=(tx-c.x)*Math.min(1,dt*8);c.y+=(tY-c.y)*Math.min(1,dt*8);c.a+=angDiff(ta,c.a)*Math.min(1,dt*6);
  let want=c.top;const ca=Math.cos(c.a),sa=Math.sin(c.a),ahead=(x,y,r)=>{const dx=x-c.x,dy=y-c.y,d=Math.hypot(dx,dy);return d<r&&d>0.1&&(dx*ca+dy*sa)/d>0.55};
  if(A.stuck<6&&ahead(player.x,player.y,player.veh?30:20))want=0;for(const o of VEH)if(o!==c&&o.ai&&Math.cos(o.a-c.a)>0.2&&ahead(o.x,o.y,26))want=0;
  if(want===0&&c.v<4){A.stuck+=dt;if(A.stuck>2.5&&!A.honk&&Math.hypot(player.x-c.x,player.y-c.y)<60){A.honk=1;beep(392,.18,'square',.03);beep(392,.25,'square',.03,.24)}}else if(want){if(A.stuck>=6)A.stuck+=dt;if(A.stuck<6||A.stuck>9){A.stuck=0;A.honk=0}}
  c.v+=(want-c.v)*Math.min(1,dt*3)}
let helloT=0;const HELLO=[['Γεια σου!','hello!'],['Καλημέρα!','good morning!'],['Τι κάνεις;','how are you?'],['Καλό ταξίδι!','have a good trip!'],['Ωραία μέρα!','lovely day!'],['Καλώς ήρθες!','welcome!']],WATCH=[['Πρόσεχε!','watch out!'],['Ώπα!','whoa!'],['Σιγά σιγά!','slowly, slowly!']];
function pedUpdate(p,dt){const dp=Math.hypot(player.x-p.x,player.y-p.y);p.cool-=dt;p.sayT-=dt;
  if(player.veh&&dp<15&&Math.abs(player.veh.v)>12){const dx=(p.x-player.x)/dp,dy=(p.y-player.y)/dp;p.x+=dx*70*dt;p.y+=dy*70*dt;p.dir=Math.atan2(dy,dx);p.moving=true;p.wait=0.6;if(p.cool<0){p.cool=4;p.sayT=2.2;p.say=WATCH[Math.floor(Math.random()*WATCH.length)]}return}
  if(!player.veh&&dp<16&&p.cool<0&&state==='play'&&T>helloT){helloT=T+9;p.cool=20+Math.random()*15;p.sayT=3;p.say=HELLO[Math.floor(Math.random()*HELLO.length)];p.wait=2.2;p.dir=Math.atan2(player.y-p.y,player.x-p.x);speak(p.say[0])}
  if(p.wait>0){p.wait-=dt;p.moving=false;return}
  const dx=p.tx-p.x,dy=p.ty-p.y,l=Math.hypot(dx,dy);if(l<2){p.wait=1+Math.random()*4;const a=Math.random()*TAU,r=44+Math.random()*9;p.tx=p.d.x+Math.cos(a)*r;p.ty=p.d.y+Math.sin(a)*r;return}
  p.x+=dx/l*16*dt;p.y+=dy/l*16*dt;p.dir+=angDiff(Math.atan2(dy,dx),p.dir)*Math.min(1,dt*8);p.moving=true}
/* delivery jobs from the kiosk: fetch the thing named in Greek, then run it to another town against the clock */
let job=null,jobSec=-1;
function jobUI(){const j=job,w=WD[j.w];$('jK').textContent=`Delivery · Παράδοση · €${j.pay}`;$('jEl').textContent=w.el;$('jTr').textContent=j.phase?`${w.tr} — “${w.en}”`:w.tr;
  $('jFb').textContent=j.msg||(j.phase?`Take it to the kiosk in ${j.dest.el} (${j.dest.en}).`:`${j.dest.en} wants this. Pick it up from its pedestal here in ${ZONES[j.i].en}.`);$('jFb').style.color=j.msg?(j.ok?'#2c9a4b':'#d04a3a'):'#5a6f8f'}
function startJob(i){if(job||state!=='play')return;const pool=[...Array(10)].map((_,k)=>i*10+k).filter(w=>S.found[w]);if(pool.length<4)return;const from=ZONES[i];
  let cand=ZONES.filter(z=>z!==from&&z.land===from.land);if(!cand.length)cand=ZONES.filter(z=>z!==from).sort((a,b)=>Math.hypot(a.x-from.x,a.y-from.y)-Math.hypot(b.x-from.x,b.y-from.y)).slice(0,2);
  const dest=cand[Math.floor(Math.random()*cand.length)],dist=Math.hypot(dest.x-from.x,dest.y-from.y);job={i,w:pool[Math.floor(Math.random()*pool.length)],dest,phase:0,t:50+dist/(dest.land===from.land?32:14),pay:10+Math.round(dist/30),msg:'',ok:false};
  document.body.classList.add('jobon');$('job').classList.add('on');jobUI();speak(WD[job.w].el);chime()}
function endJob(msg){document.body.classList.remove('jobon');$('job').classList.remove('on');job=null;jobSec=-1;if(msg)toast(msg,4200)}
function jobPick(o){const j=job;if(o.w===j.w){j.phase=1;j.ok=true;j.msg=`Σωστά! ${WD[o.w].el} = “${WD[o.w].en}”. Now take it to ${j.dest.el} (${j.dest.en}).`;good();vib(20);burst(o.x,o.y,o.z+8,14,[0xffe36b,0xffffff,0x7fe08a])}
  else{j.pay=Math.max(5,j.pay-5);j.ok=false;j.msg=`That one is ${WD[o.w].el} — “${WD[o.w].en}”. Keep looking.`;bad();vib([30,40,30])}jobUI()}
function jobDone(){const j=job,pay=j.pay+Math.round(j.t/4);S.cash+=pay;S.jobs++;save();hud();fanfare();vib([40,60,40]);burst(j.dest.kiosk.x,j.dest.kiosk.y,12,40,[0xffe36b,0xffffff,0x7fc4ee],1.6);
  endJob(`<b class="gr big2" style="font-size:22px">Ευχαριστώ!</b> <span><em>efharistó</em> — “thank you”<br>Delivered <b class="gr">${WD[j.w].el}</b> · <b>+€${pay}</b></span>`);setTimeout(()=>speak('Ευχαριστώ!'),300)}
const birds=[0,1,2,3].map(i=>({x:i*190+900,y:i*140+1200,a:0.4+i*1.3,ph:i*2}));
function update(dt){
  T+=dt;
  for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vz-=p.g*dt;if(p.t>p.life||p.z<-2)parts.splice(i,1)}
  for(const b of birds){b.x+=Math.cos(b.a)*26*dt;b.y+=Math.sin(b.a)*26*dt;const dx=b.x-cam.x,dy=b.y-cam.y;if(dx*dx+dy*dy>560*560){const a=Math.random()*TAU;b.x=cam.x+Math.cos(a)*540;b.y=cam.y+Math.sin(a)*540;b.a=a+Math.PI+(Math.random()-0.5)*1.2}}
  for(const c of VEH){if(c.ai){if(Math.hypot(c.x-cam.x,c.y-cam.y)<700||state==='title')aiCar(c,dt)}else if(c!==player.veh){c.v*=1-Math.min(1,dt*4);if(c.pier&&Math.hypot(c.x-c.hx,c.y-c.hy)>24&&Math.hypot(c.x-player.x,c.y-player.y)>280){c.x=c.hx;c.y=c.hy;c.a=c.ha}}}
  for(const p of PEDS)if(Math.abs(p.x-cam.x)<300&&Math.abs(p.y-cam.y)<300)pedUpdate(p,dt);
  if(state==='title'){cam.vr=0.1;cam.r+=dt*0.1;cam.x=ZONES[6].x-30;cam.y=ZONES[6].y+20;return}
  let turn=0;const V=player.veh,playing=state==='play'||state==='fetch';
  if(playing){
    if(V)drive(dt);else turn=moveHero(dt);
    const list=curZone>=0?zoneObjs(curZone):[];
    if(touched&&Math.hypot(touched.x-player.x,touched.y-player.y)>15)touched=null;
    for(const o of list){if(o===touched||Math.hypot(o.x-player.x,o.y-player.y)>(V?12:9.5))continue;touched=o;
      if(state==='fetch'){if(trial.i===o.isl)fetchHit(o)}else if(!S.found[o.w]){if(V)V.v=0;openCard(o.w)}else if(job&&!job.phase&&job.i===o.isl)jobPick(o);else speak(WD[o.w].el);break}
    if(state==='play'){
      for(const f of FEATHERS)if(!S.feathers[f.id]&&Math.abs(f.x-player.x)<8&&Math.hypot(f.x-player.x,f.y-player.y)<(V?9:7)){const before=featherN();S.feathers[f.id]=1;save();hud();pluck();vib(10);burst(f.x,f.y,f.z+6,8,[0xffe36b,0xfff6d8]);checkTier(before)}
      for(const L of LETTERS)if(!S.letters[L.i]&&Math.hypot(L.x-player.x,L.y-player.y)<8){S.letters[L.i]=1;save();hud();chime();vib(15);burst(L.x,L.y,L.z+8,16,[0xffffff,0x7fc4ee,0xffe36b]);const a=ALPHA[L.i];
        toast(`<b class="gr big2">${a[0]} ${a[1]}</b> <span><b class="gr">${a[2]}</b> <em>${a[3]}</em> — sounds like ${a[4]}<br><small>${count(S.letters)}/24 letters of the alphabet</small></span>`,5200);setTimeout(()=>speak(a[2]),200)}
      for(const q of SIGHTS)if(!S.sights[q.id]&&Math.hypot(q.x-player.x,q.y-player.y)<q.r){S.sights[q.id]=1;save();chime();vib(15);const t=q.d.sight;toast(`<span><b class="gr" style="font-size:18px">${t[0]}</b> <em>${t[1]}</em><br>${t[2]}<br><small>🏛 ${count(S.sights)}/${SIGHTS.length} sights of Greece</small></span>`,7500);setTimeout(()=>speak(t[0]),200)}
      for(const sec of SECRETS){const q=Math.hypot(sec.x-player.x,sec.y-player.y);if(q<120&&!S.seen[sec.k]){S.seen[sec.k]=1;save();toast(`You found <b class="gr">${sec.el}</b> · ${sec.en}. Something glints there…`,4000);chime()}
        if(q<11&&!V&&touched!==sec&&state==='play'){touched=sec;openChest(sec)}}
      if(job){job.t-=dt;if(job.phase&&Math.hypot(job.dest.kiosk.x-player.x,job.dest.kiosk.y-player.y)<15)jobDone();else if(job.t<=0){bad();endJob('<b class="gr big2" style="font-size:22px">Άργησες!</b> <span><em>áryises</em> — “you are late”<br>The delivery was cancelled. Try another one.</span>')}
        else{const s=Math.ceil(job.t);if(s!==jobSec){jobSec=s;$('jT').textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');$('jT').style.color=s<=10?'#d04a3a':''}}}
      saveT-=dt;if(saveT<0&&(!V||V.kind!=='boat')&&walkable(player.x,player.y)){saveT=3;if(Math.hypot((S.px||0)-player.x,(S.py||0)-player.y)>25){S.px=Math.round(player.x);S.py=Math.round(player.y);save()}}
    }
  }else{player.vx=player.vy=0;player.moving=false;if(V)V.v*=1-Math.min(1,dt*6)}
  if(V){let d=0;if(playing)d=angDiff(-Math.PI/2-V.a,cam.r)*Math.min(1,dt*2.6*clamp(Math.abs(V.v)/70,0.45,1));if(Math.abs(d)<0.00004)d=0;cam.r+=d;cam.vr=dt>0?d/dt:0}
  else{if(keys['q'])turn+=4;if(keys['e'])turn-=4;turn+=rotHeld*4;const tv=playing?clamp(turn,-4,4)*(Math.abs(turn)>1.5?0.42:-0.2):0;cam.vr+=(tv-cam.vr)*Math.min(1,dt*7);cam.r+=cam.vr*dt;
    player.z+=(groundZ(player.x,player.y)-player.z)*Math.min(1,dt*14)}
  const la=V?0.42:0.3;cam.x+=(player.x+player.vx*la-cam.x)*Math.min(1,dt*4.5);cam.y+=(player.y+player.vy*la-cam.y)*Math.min(1,dt*4.5);
  // where am I, what next
  curZone=-1;atAltar=-1;atKiosk=-1;for(const d of ZONES){const q=Math.hypot(d.x-player.x,d.y-player.y);if(q<d.r*1.2){curZone=d.i;if(Math.hypot(d.kiosk.x-player.x,d.kiosk.y-player.y)<13)atKiosk=d.i}if(q<15&&!V)atAltar=d.i}
  curIslet=curZone>=0?ZONES[curZone]:Math.hypot(player.x-HUB.x,player.y-HUB.y)<HUB.r*1.2?HUB:null;
  nearV=null;if(!V&&playing){let bd=14;for(const v of VEH){if(v.ai)continue;const q=Math.hypot(v.x-player.x,v.y-player.y);if(q<bd){bd=q;nearV=v}}}
  myLand=V&&V.kind==='boat'?-1:landOf(player.x,player.y);
  let h='',b='';target=null;
  if(curZone>=0){const d=ZONES[curZone],n=foundOn(curZone);b=`${d.el}|${d.en} · ${d.theme} · ${S.lit[curZone]?'flag raised ★':'named '+n+'/10'}`;
    if(!S.lit[curZone]&&!job){if(n<10){let bd=1e9;for(const o of zoneObjs(curZone))if(!S.found[o.w]){const q=Math.hypot(o.x-player.x,o.y-player.y);if(q<bd){bd=q;target=o}}h=`Go up to each thing on a pedestal to learn its name — ${10-n} left in ${d.en}`}
      else{target=d;h=`You know all ten. ${V?'Get out and walk':'Go'} to the flagpole in the square for the locals’ challenge`}}}
  else if(curIslet===HUB)b='Δελφοί|Delphi · the navel of the world';
  else for(const sec of SECRETS)if(Math.hypot(sec.x-player.x,sec.y-player.y)<sec.r*1.3)b=`${sec.el}|${sec.en} · a hidden corner of Greece`;
  let goal=null;
  if(job&&state==='play'){if(job.phase)goal=job.dest}
  else if(!target&&state==='play'){let bd=1e9,ti=-1;S.lit.forEach((l,i)=>{if(!l&&i!==curZone){const q=Math.hypot(ZONES[i].x-player.x,ZONES[i].y-player.y)*(ZONES[i].land===myLand?1:2.5);if(q<bd){bd=q;ti=i}}});
    if(ti>=0&&(curZone<0||S.lit[curZone])){goal=ZONES[ti];h=`${V?'Drive':'Follow the road signs'} to ${goal.en} — its flag is not raised yet`}else if(litN()===10)h='Every flag flies. Roam freely: deliveries at the kiosks, feathers, letters and sights — or practise at any flagpole.'}
  if(goal){target=job?goal.kiosk:goal;if(myLand>=0&&goal.land!==myLand){let bd=1e9,pb=null;for(const v of VEH)if(v.kind==='boat'){const q=Math.hypot(v.x-player.x,v.y-player.y);if(q<bd&&landOf(v.x,v.y)===myLand){bd=q;pb=v}}
      if(pb){target=pb;if(!job)h=`${goal.en} is across the sea — take a boat from the pier (⚓ on the map)`}}else if(myLand<0&&!job)h=`Sail to ${goal.en}, then land on a beach or at its pier`}
  if(!h&&!job&&nearV&&state==='play'&&!count(S.rides))h=TOUCH?'Tap the blue button to get in.':'Press F to get in.';
  const A=$('act');let as='';
  if(state==='play'&&atAltar>=0&&!job){const dn=foundOn(atAltar);if(S.lit[atAltar])as='Practise here';else if(dn===10)as='Take the challenge';else h=`The people of ${ZONES[atAltar].en} want you to learn all ten names first — ${10-dn} to go`}
  else if(state==='play'&&atKiosk>=0&&!job){if(foundOn(atKiosk)>=4)as='Take a delivery job';else h=`Περίπτερο — the kiosk has delivery jobs once you can name four things in ${ZONES[atKiosk].en}`}
  if(as!==A.dataset.s){A.dataset.s=as;if(as)$('actT').textContent=as;A.classList.toggle('on',!!as)}
  const vt=!playing?'':V?'Get out':nearV?(nearV.kind==='boat'?'⛵ Sail':nearV.t==='moped'?'🛵 Ride':'🚗 Drive'):'';
  if(vt!==vehTxt){vehTxt=vt;if(vt)$('vehT').textContent=vt;$('veh').classList.toggle('on',!!vt)}
  document.body.classList.toggle('driving',!!V);
  if(state!=='play'||job)h='';
  if(h!==hintTxt){hintTxt=h;if(h)$('hint').textContent=h;$('hint').classList.toggle('on',!!h)}
  if(state==='fetch'||job)b='';
  if(b!==banTxt){banTxt=b;const p=b.split('|');if(b){$('bn').textContent=p[0]||'';$('bs').textContent=p[1]||''}$('banner').classList.toggle('on',!!b)}
}

/* ---------- render ---------- */
/* terrain is painted in 256-unit tiles, built when first needed and dropped when long unseen */
const CH=256,chunks=new Map();let chunkBudget=12;
const rgb=(c,k)=>[Math.min(255,(c>>16&255)*k),Math.min(255,(c>>8&255)*k),Math.min(255,(c&255)*k)];
function buildChunk(cx,cy){const x0=GX0+cx*CH-1,y0=GY0+cy*CH-1,S2=CH+2,gx=x0-GX0,gy=y0-GY0;let any=false;
  const idx=(x,y)=>{const X=gx+x,Y=gy+y;return X<0||Y<0||X>=GW||Y>=GH?-1:X+Y*GW};
  for(let y=0;y<S2&&!any;y+=4)for(let x=0;x<S2;x+=4){const i=idx(x,y);if(i>=0&&DQ[i]<26){any=true;break}}if(!any)return null;
  const near=PLACES.filter(p=>Math.abs(p.x-x0-CH/2)<CH/2+190&&Math.abs(p.y-y0-CH/2)<CH/2+190);
  const paint=fn=>{const cv=mk(S2,S2),c=cv.getContext('2d'),im=c.createImageData(S2,S2),D=im.data;let n=0;for(let y=0;y<S2;y++)for(let x=0;x<S2;x++){const i=idx(x,y);if(i<0)continue;const col=fn(TY[i],DQ[i],x+x0,y+y0,i);if(!col)continue;n++;const o=(x+y*S2)*4;D[o]=col[0];D[o+1]=col[1];D[o+2]=col[2];D[o+3]=col[3]==null?255:col[3]}if(!n)return null;c.putImageData(im,0,0);return cv};
  const g=paint((t,d,x,y)=>t===5?[70,52,40]:t>=0?rgb(0xead9a6,0.92+hash2(x,y,11)*0.12):d<2?[255,255,255,215]:d<7?[90,210,215,150]:d<15?[70,180,215,95]:d<24?[60,150,210,50]:null);
  const s=paint((t,d,x,y)=>t<1?null:rgb(t===5?0x5c3a22:t===4?0xbfb9a8:t>=2?0x6a6258:0x8a7458,0.85+hash2(x,y*3,13)*0.25));
  const tp=paint((t,d,x,y,i)=>{if(t<1)return null;
    if(t===2)return rgb(0x565962,0.93+hash2(x,y,21)*0.1);if(t===3)return rgb(0xe8e2c8,0.95+hash2(x,y,22)*0.08);if(t===4){const q=((x>>2)+(y>>2))&1;return rgb(q?0xe9e4d6:0xd6d0c0,0.95+hash2(x,y,23)*0.08)}if(t===5)return rgb(((x>>1)+(y>>1))%3?0xb89468:0xa07e54,0.95+hash2(x,y,24)*0.08);
    let c=vnoise(x*0.006,y*0.006,31)>0.52?0xa6bd6e:0x97bd72,bd=150;for(const p of near){const q=Math.hypot(p.x-x,p.y-y)+hash2(x,y,25)*34;if(q<bd){bd=q;c=p.grass}}
    const n=0.93+hash2(x,y,26)*0.1+(vnoise(x*0.14,y*0.14,27)-0.5)*0.14;if(hash2(x,y,28)>0.986)return rgb(c,n*0.8);
    const X=i%GW,edge=X<1||X>=GW-1||i<GW||i>=GW*(GH-1)||TY[i-1]<1||TY[i+1]<1||TY[i-GW]<1||TY[i+GW]<1;return rgb(c,edge?n*1.12:n)});
  return{g,s,t:tp,x:x0,y:y0,u:0}}
function chunkAt(cx,cy){const key=cx+cy*1000;let c=chunks.get(key);if(c===undefined){if(chunkBudget<=0)return null;chunkBudget--;c=buildChunk(cx,cy);chunks.set(key,c)}if(c)c.u=fr;return c}
const mkTag=c=>()=>{const e=document.createElement('div');e.className=c;document.body.insertBefore(e,$('banner'));return e},vis=[],tiles=[],tags=[...Array(10)].map(mkTag('tag gr')),signs=[...Array(6)].map(mkTag('tag gr sign')),bubs=[...Array(3)].map(mkTag('tag gr bub'));
const place=(e,o,up)=>{e.style.display='block';e.style.transform=`translate(calc(${(o.sx/BW*innerWidth).toFixed(1)}px - 50%),calc(${((o.sy-up)/BH*innerHeight).toFixed(1)}px - 100%))`},hide=e=>{if(e.style.display!=='none')e.style.display='none'};
function render(){
  const p=litN()/10,rotating=Math.abs(cam.vr)>0.004,V=player.veh;
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;const sea=ctx.createLinearGradient(0,0,0,cv.height);sea.addColorStop(0,'#1a66ab');sea.addColorStop(1,'#2079c2');ctx.fillStyle=sea;ctx.fillRect(0,0,cv.width,cv.height);
  if(SPRN>1400)freeCache();
  const RV=Math.hypot(BW,BH/K)/2+24;
  // the Aegean: world-anchored glints, always level on screen
  {TI();const C=30,n=Math.ceil(RV*2/C)+1,x0=Math.floor((cam.x-RV)/C),y0=Math.floor((cam.y-RV)/C),c=Math.cos(cam.r),sn=Math.sin(cam.r);
   for(let gy=y0;gy<y0+n;gy++)for(let gx=x0;gx<x0+n;gx++){const h=hash2(gx,gy,91),dx=gx*C+h*C+Math.sin(T*0.5+h*9)*4-cam.x,dy=gy*C+hash2(gx,gy,17)*C-cam.y,sx=CX+dx*c-dy*sn,sy=CY+(dx*sn+dy*c)*K;if(sx<-10||sx>BW+10||sy<-4||sy>BH+4)continue;
     const ph=Math.sin(T*1.3+h*40),len=3+((h*97)%6|0);if(h<0.3){if(ph>-0.6){ctx.fillStyle='rgba(205,235,255,'+(0.25+0.3*ph).toFixed(2)+')';ctx.fillRect(sx,sy,len,1)}}else{ctx.fillStyle='rgba(12,62,125,.45)';ctx.fillRect(sx,sy,len+2,1);if(h>0.65)ctx.fillRect(sx+2,sy+1,len-1,1)}}}
  tiles.length=0;{const m=RV+70,a=Math.floor((cam.x-m-GX0)/CH),b=Math.floor((cam.x+m-GX0)/CH),c=Math.floor((cam.y-m-GY0)/CH),d=Math.floor((cam.y+m-GY0)/CH);
    for(let cy=c;cy<=d;cy++)for(let cx=a;cx<=b;cx++){if(cx<0||cy<0||cx*CH>=GW||cy*CH>=GH)continue;const t=chunkAt(cx,cy);if(t)tiles.push(t)}
    if(chunks.size>46)for(const[k,t]of chunks)if(!t||t.u<fr-900){chunks.delete(k);if(chunks.size<=36)break}}
  worldT(0);for(const t of tiles)if(t.g)ctx.drawImage(t.g,t.x,t.y);
  for(let o=TS-1;o>0;o-=1/SC){worldT(TS-o);for(const t of tiles)if(t.s)ctx.drawImage(t.s,t.x,t.y)}
  worldT(TS);for(const t of tiles)if(t.t)ctx.drawImage(t.t,t.x,t.y);
  const cr=Math.cos(cam.r),sr=Math.sin(cam.r),lim=(Math.hypot(BW,BH/K)/2+60)**2;
  const scr=o=>{const dx=o.x-cam.x,dy=o.y-cam.y;if(dx*dx+dy*dy>lim)return false;o.sx=CX+dx*cr-dy*sr;o.sy=CY+(dx*sr+dy*cr)*K;return o.sx>-40&&o.sx<BW+40&&o.sy>-30&&o.sy<BH+70};
  const put=(m,rot,sx,sy)=>{if(rotating)drawStack(ctx,m,sx,sy,rot,SC);else blit(m,rot,sx,sy)};
  // rings under things not yet named, flagpoles that are ready, kiosks and the delivery goal
  const trialOn=state==='fetch'||state==='quiz';
  worldT(TS);ctx.lineWidth=1.5;ctx.strokeStyle='rgba(255,232,120,.9)';for(const o of OBJ){if(S.found[o.w]||Math.abs(o.x-cam.x)>400||Math.abs(o.y-cam.y)>400)continue;ctx.beginPath();ctx.arc(o.x,o.y,8+1.5*Math.sin(T*3+o.ph),0,TAU);ctx.stroke()}
  for(const d of ZONES){if(Math.abs(d.x-cam.x)>420||Math.abs(d.y-cam.y)>420)continue;if(!S.lit[d.i]&&foundOn(d.i)===10){ctx.strokeStyle='rgba(255,217,94,.95)';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(d.x,d.y,12+2*Math.sin(T*4),0,TAU);ctx.stroke()}
    const goal=job&&job.phase&&job.dest===d;if(!trialOn&&(goal||!job&&foundOn(d.i)>=4)){ctx.strokeStyle=goal?'rgba(255,217,94,.95)':'rgba(120,200,255,.85)';ctx.lineWidth=goal?3:1.5;ctx.beginPath();ctx.arc(d.kiosk.x,d.kiosk.y,(goal?13:9)+1.5*Math.sin(T*4),0,TAU);ctx.stroke()}}
  vis.length=0;for(const o of props)if(scr(o))vis.push(o);for(const o of OBJ)if(scr(o))vis.push(o);for(const o of VEH)if(scr(o))vis.push(o);for(const o of PEDS)if(scr(o))vis.push(o);
  if(!trialOn){for(const f of FEATHERS)if(!S.feathers[f.id]&&scr(f)){f.kind=1;vis.push(f)}for(const L of LETTERS)if(!S.letters[L.i]&&scr(L)){L.kind=2;vis.push(L)}}
  const hero={hero:true,x:player.x,y:player.y};scr(hero);if(!V)vis.push(hero);vis.sort((a,b)=>a.sy-b.sy);
  TI();const shx=3*cr-2*sr,shy=(3*sr+2*cr)*K;ctx.fillStyle='rgba(8,25,45,.2)';
  for(const o of vis){if(o.hero)continue;const r=o.kind?2.6:o.say!==undefined?3:o.m.sr*(o.w!=null||o.veh?0.8:1);ctx.beginPath();ctx.ellipse(o.sx+shx*r/5,o.sy-o.z+shy*r/5,r,r*K,0,0,TAU);ctx.fill()}
  for(const o of vis){
    if(o.hero){TI();ctx.fillStyle='rgba(8,25,45,.25)';ctx.beginPath();ctx.ellipse(o.sx,o.sy-player.z,4,3,0,0,TAU);ctx.fill();
      const f=player.moving?1+(Math.floor(T*(player.sprint?13:9))&1):0;drawStack(ctx,M.hero[tier()][f],o.sx,o.sy-player.z-(player.moving?Math.abs(Math.sin(T*(player.sprint?13:9)))*1.3:0),player.dir+cam.r,SC);continue}
    if(o.kind===1){drawStack(ctx,M.feather,o.sx,o.sy-o.z-4-Math.sin(T*2.4+o.ph)*1.5,T*2.2+o.ph,SC);continue}
    if(o.kind===2){drawStack(ctx,ALPHA[o.i].m,o.sx,o.sy-o.z-3-Math.sin(T*1.8+o.ph)*1.2,T*0.9+o.ph,SC);continue}
    if(o.w!=null){put(M.ped,cam.r,o.sx,o.sy-o.z);drawStack(ctx,o.m,o.sx,o.sy-o.z-4-Math.sin(T*2+o.ph)*0.8,T*0.7+o.ph+cam.r,SC);continue}
    if(o.veh){if(o===V||o.ai)drawStack(ctx,o.m,o.sx,o.sy-o.z-(o.kind==='boat'?Math.sin(T*2+o.hx)*0.5:0),o.a+cam.r,SC);else put(o.m,o.a+cam.r,o.sx,o.sy-o.z-(o.kind==='boat'?Math.sin(T*2+o.hx)*0.5:0));continue}
    if(o.say!==undefined){drawStack(ctx,o.m[o.moving?1+(Math.floor(T*7+o.x)&1):0],o.sx,o.sy-TS,o.dir+cam.r,SC);continue}
    put(o.m,o.rot+cam.r,o.sx,o.sy-o.z);
  }
  // birds, pollen and particles
  for(const b of birds){const[sx,sy]=toScreen(b.x,b.y);if(sx<-20||sx>BW+20||sy<40||sy>BH+90)continue;TI();ctx.fillStyle='rgba(8,25,45,.12)';ctx.beginPath();ctx.ellipse(sx,sy,3,2,0,0,TAU);ctx.fill();drawStack(ctx,M.bird[Math.floor(T*6+b.ph)&1],sx,sy-70,b.a+cam.r,SC)}
  TI();
  if(curIslet&&!trialOn){ctx.fillStyle='rgba(255,255,240,.75)';const ps=Math.ceil(SC*0.6)/SC;for(let i=0;i<14;i++){const a=i*2.4+T*0.07*(1+i%3),r=curIslet.r*(0.25+0.6*hash2(i,7,3)),[sx,sy]=toScreen(curIslet.x+Math.cos(a)*r,curIslet.y+Math.sin(a*1.3)*r);ctx.fillRect(sx,sy-10-6*Math.sin(T*0.8+i*1.7),ps,ps)}}
  for(const q of parts){const[sx,sy]=toScreen(q.x,q.y);ctx.globalAlpha=clamp(1.3-q.t/q.life*1.3,0,1);ctx.fillStyle=hex(q.c);const s2=q.g?1.5:1+q.t*3;ctx.fillRect(sx-s2/2,sy-q.z-s2/2,s2,s2)}ctx.globalAlpha=1;
  // evening comes as the flags go up
  if(p>0){ctx.fillStyle=`rgba(255,120,50,${(Math.sin(Math.PI*p)*0.15).toFixed(3)})`;ctx.fillRect(0,0,BW,BH);ctx.fillStyle=`rgba(10,18,60,${(Math.pow(p,1.5)*0.42).toFixed(3)})`;ctx.fillRect(0,0,BW,BH)}
  ctx.globalCompositeOperation='lighter';
  if(p>0)for(const d of PLACES){if(!(d.hub?litN()===10:S.lit[d.i])||!scr(d.flag))continue;const sx=d.flag.sx,sy=d.flag.sy-d.flag.z-8,fl=1+0.12*Math.sin(T*5+d.seed);
    const g=ctx.createRadialGradient(sx,sy,0,sx,sy,30*fl);g.addColorStop(0,`rgba(255,225,150,${(0.25+p*0.45).toFixed(2)})`);g.addColorStop(1,'rgba(255,200,100,0)');ctx.fillStyle=g;ctx.fillRect(sx-34,sy-34,68,68)}
  if(V&&V.kind!=='boat'&&p>0.3){const[sx,sy]=toScreen(V.x+Math.cos(V.a)*22,V.y+Math.sin(V.a)*22),g=ctx.createRadialGradient(sx,sy-V.z,0,sx,sy-V.z,22);g.addColorStop(0,`rgba(255,240,170,${(p*0.4).toFixed(2)})`);g.addColorStop(1,'rgba(255,240,170,0)');ctx.fillStyle=g;ctx.fillRect(sx-24,sy-V.z-24,48,48)}
  ctx.globalCompositeOperation='source-over';
  if(state==='play'&&target){const dist=Math.hypot(target.x-player.x,target.y-player.y);if(dist>40){const[bx,by]=toScreen(player.x,player.y),[tx,tY]=toScreen(target.x,target.y),a=Math.atan2(tY-by,tx-bx),R=V?30:24,ax=bx+Math.cos(a)*R,ay=by-player.z-6+Math.sin(a)*R*0.85;
    ctx.setTransform(SC,0,0,SC,ax*SC,ay*SC);ctx.rotate(a);ctx.fillStyle='#ffd95e';ctx.strokeStyle='#0b2a55';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(-3,-4);ctx.lineTo(-1,0);ctx.lineTo(-3,4);ctx.closePath();ctx.fill();ctx.stroke()}}
  // name tags over things already named (never during a trial or a pickup), road signs at the edge of town, and what people say
  const objs=state==='play'&&curZone>=0&&!(job&&!job.phase)?zoneObjs(curZone):[];
  for(let i=0;i<10;i++){const e=tags[i],o=objs[i];if(!o||!S.found[o.w]||!scr(o)){hide(e);continue}const txt=WD[o.w].el;if(e.textContent!==txt)e.textContent=txt;place(e,o,o.z+o.m.h+10)}
  const ex=state==='play'&&curIslet?curIslet.exits:[];
  for(let i=0;i<6;i++){const e=signs[i],x=ex[i],o=x&&{x:curIslet.x+Math.cos(x.a)*(RR+16),y:curIslet.y+Math.sin(x.a)*(RR+16)};if(!x||!scr(o)){hide(e);continue}
    const d=x.to,txt=d.port?'⚓ λιμάνι':(d.kind==='zone'&&S.lit[d.i]?'★ ':'')+d.el;if(e.textContent!==txt)e.textContent=txt;place(e,o,14)}
  let nb=0;if(state==='play')for(const q of PEDS){if(q.sayT<=0||nb>=3||!scr(q))continue;const e=bubs[nb++],h=`${q.say[0]}<small>${q.say[1]}</small>`;if(e.dataset.h!==h){e.dataset.h=h;e.innerHTML=h}place(e,q,TS+18)}for(;nb<3;nb++)hide(bubs[nb]);
}
/* the radar turns with the view; the big map shows the whole country */
const mc=$('mini').getContext('2d');
function minimap(){const c=mc,z=0.2,R=62;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,128,128);c.save();c.beginPath();c.arc(64,64,R,0,TAU);c.clip();c.fillStyle='#17508f';c.fillRect(0,0,128,128);
  c.translate(64,64);c.rotate(cam.r);c.scale(z,z);c.drawImage(MAPC,GX0-player.x,GY0-player.y,GW,GH);c.restore();
  const cr=Math.cos(cam.r),sr=Math.sin(cam.r),blip=(o,col,r,sq)=>{const dx=o.x-player.x,dy=o.y-player.y;let x=(dx*cr-dy*sr)*z,y=(dx*sr+dy*cr)*z;const l=Math.hypot(x,y);if(l>R-4){if(!sq)return;x*=(R-4)/l;y*=(R-4)/l}c.fillStyle=col;c.strokeStyle='#0b2a55';c.lineWidth=1;c.beginPath();if(sq)c.rect(64+x-r,64+y-r,r*2,r*2);else c.arc(64+x,64+y,r,0,TAU);c.fill();c.stroke()};
  for(const d of ZONES)blip(d,S.lit[d.i]?'#ffd95e':'#ffffff',2.5);for(const p of PIERS)blip(p,'#7fd0ff',2);if(target)blip(target,'#ffd95e',3.5,true);
  c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=2;c.beginPath();c.arc(64,64,R,0,TAU);c.stroke();
  const na=-Math.PI/2+cam.r;c.fillStyle='#fff';c.font='bold 10px system-ui,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('N',64+Math.cos(na)*(R-8),64+Math.sin(na)*(R-8));
  c.translate(64,64);c.rotate(player.dir+cam.r);c.fillStyle='#ff5a4a';c.strokeStyle='#fff';c.lineWidth=1.2;c.beginPath();c.moveTo(6,0);c.lineTo(-4,-4);c.lineTo(-2,0);c.lineTo(-4,4);c.closePath();c.fill();c.stroke();c.setTransform(1,0,0,1,0,0)}
function drawMap(){const c=$('mapC').getContext('2d'),size=640,s=size/GW,X=x=>(x-GX0)*s,Y=y=>(y-GY0)*s;c.setTransform(1,0,0,1,0,0);c.fillStyle='#8fc8ea';c.fillRect(0,0,size,size);c.imageSmoothingEnabled=true;c.drawImage(MAPC,0,0,size,size);c.textAlign='center';c.textBaseline='alphabetic';
  for(const p of PIERS){c.font='13px system-ui,sans-serif';c.fillStyle='#0b2a55';c.fillText('⚓',X(p.x),Y(p.y)+4)}
  for(const r of ROADS){if(r.pier||r.B.plaza)continue;c.font='italic 11px Georgia,serif';c.fillStyle='#3a5278';c.fillText(r.B.el,X(r.B.x),Y(r.B.y)-6)}
  for(const d of ISLETS){if(d.kind==='secret'&&!S.seen[d.k])continue;const x=X(d.x),y=Y(d.y),col=d.hub?'#cfe0b8':d.kind==='secret'?(S.chests[d.k]?'#ffd95e':'#e8c8f0'):S.lit[d.i]?'#ffd95e':foundOn(d.i)===10?'#ffffff':'#bfe0a8';
    c.fillStyle=col;c.strokeStyle='#0b2a55';c.lineWidth=1.5;c.beginPath();c.arc(x,y,d.kind==='secret'?5:8,0,TAU);c.fill();c.stroke();
    c.font='bold 14px Georgia,serif';c.lineWidth=3;c.strokeStyle='rgba(255,255,255,.85)';c.strokeText(d.el,x,y-12);c.fillStyle='#0b2a55';c.fillText(d.el,x,y-12);
    if(d.kind==='zone'){c.font='11px system-ui,sans-serif';const t=S.lit[d.i]?'★ flag raised':foundOn(d.i)+'/10';c.strokeText(t,x,y+20);c.fillText(t,x,y+20)}}
  if(job&&job.phase){const k=job.dest.kiosk;c.strokeStyle='#d04a3a';c.lineWidth=3;c.beginPath();c.arc(X(k.x),Y(k.y),13,0,TAU);c.stroke()}
  c.fillStyle='#ff5a4a';c.strokeStyle='#fff';c.lineWidth=2.5;c.beginPath();c.arc(X(player.x),Y(player.y),7,0,TAU);c.fill();c.stroke()}
const spin={c:$('cSpr').getContext('2d'),q:$('qSpr').getContext('2d'),t:$('tSpr').getContext('2d')};
function drawSpin(x,w){const m=WD[w].m,c=x.canvas,dg=Math.ceil(Math.hypot(m.w,m.d))+4,ch=Math.ceil(dg*K)+m.h+4;if(c.width!==dg||c.height!==ch){c.width=dg;c.height=ch}
  x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,dg,ch);x.imageSmoothingEnabled=false;drawStack(x,m,dg/2,ch-Math.ceil(dg*K/2)-2,T*1.1);x.setTransform(1,0,0,1,0,0)}
const titleSet=shuffle([...Array(100)].map((_,i)=>i)).slice(0,7);
function drawTitle(){const x=spin.t;x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,210,36);x.imageSmoothingEnabled=false;titleSet.forEach((w,i)=>drawStack(x,WD[w].m,15+i*30,27+Math.sin(T*2+i)*1.5,T*0.9+i))}

let eng=null;
function engine(){if(!AC)return;if(!eng){try{const o=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain();o.type='sawtooth';f.type='lowpass';f.frequency.value=380;g.gain.value=0;o.connect(f);f.connect(g);g.connect(AC.destination);o.start();eng={o,g}}catch(e){return}}
  const v=player.veh,on=v&&!muted&&(state==='play'||state==='fetch'),t=AC.currentTime;eng.g.gain.setTargetAtTime(on?0.014+0.02*Math.abs(v.v)/v.top:0,t,0.08);if(on)eng.o.frequency.setTargetAtTime((v.kind==='boat'?36:50)+Math.abs(v.v)*(v.t==='moped'?1.1:0.65),t,0.06)}
function engineOff(){if(eng&&AC)try{eng.g.gain.cancelScheduledValues(AC.currentTime);eng.g.gain.setValueAtTime(0,AC.currentTime)}catch(e){}}
let last=performance.now(),fr=0,ema=16,slow=0,auto=true,emaHi=0,chk=-1;const FT=[];
function frame(now){const raw=now-last,dt=Math.min(0.05,raw/1000);last=now;
  if(raw<200){ema+=(raw-ema)*0.05;FT.push(raw);if(FT.length>600)FT.shift()}
  if(!NOAUTO&&auto){if(SC===2&&fr>90){if(ema>27)slow++;else slow=Math.max(0,slow-1);if(slow>90){emaHi=ema;chk=fr+180;SC=1;freeCache();resize()}}
    else if(SC===1&&fr===chk){auto=false;if(ema>emaHi*0.8){SC=2;freeCache();resize()}}} // half resolution only if it actually helps
  if(FPS&&fr%30===0&&FT.length>20){const f=FT.slice(-300).sort((a,b)=>a-b),md=f[f.length>>1],el=('speechSynthesis'in window)?speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.toLowerCase().startsWith('el')).length:-1;
    FPS.textContent=`${(1000/md).toFixed(0)} fps · median ${md.toFixed(1)} ms · p95 ${f[Math.floor(f.length*0.95)].toFixed(1)} ms · worst ${f[f.length-1].toFixed(0)} ms · res x${SC} · ${cv.width}x${cv.height} · tiles ${chunks.size} · audio ${AC?AC.state:'off'} · greek voices ${el} · touch ${TOUCH} · joy ${joy.id!==null?joy.dx.toFixed(1)+','+joy.dy.toFixed(1):'-'} · ${state}${player.veh?' · '+player.veh.t:''}`}
  chunkBudget=fr<3?12:1;update(dt);render();engine();if(state==='card')drawSpin(spin.c,cardW);else if(state==='quiz'&&quiz&&quiz.cur)drawSpin(spin.q,quiz.cur.w);else if(state==='title')drawTitle();if(fr++%4===0)minimap();requestAnimationFrame(frame)}
requestAnimationFrame(frame);
/* checks the world is sound: everything stands on land, roads are unbroken, and every landmass you can be left on has a boat */
function selfTest(){const r={words:WD.length,objs:OBJ.length,objsOff:0,tooClose:0,feathers:FEATHERS.length,feathersOff:0,letters:LETTERS.length,lettersOff:0,letterIds:new Set(LETTERS.map(l=>l.i)).size,emptyGlyphs:ALPHA.filter(a=>a.m.glyph<8).length,pickupNearSolid:0,
    sights:SIGHTS.length,roads:ROADS.length,roadGaps:0,piers:PIERS.length,boats:VEH.filter(v=>v.kind==='boat').length,boatsAground:0,cars:VEH.filter(v=>v.kind==='car').length,carsOff:0,props:props.length,csol:CSOL.length,lands:0,strandable:[],unreachable:[],exitsMin:9};
  for(const o of OBJ){if(ty(o.x,o.y)!==4)r.objsOff++;for(const q of OBJ)if(q!==o&&Math.hypot(q.x-o.x,q.y-o.y)<19)r.tooClose++}
  for(const f of FEATHERS)if(!walkable(f.x,f.y))r.feathersOff++;for(const L of LETTERS)if(!walkable(L.x,L.y))r.lettersOff++;
  for(const f of[...FEATHERS,...LETTERS])for(const s of SOLIDS)if(Math.hypot(f.x-s.x,f.y-s.y)<s.r+1.5)r.pickupNearSolid++;
  for(const rd of ROADS)for(const p of rd.pts){const t=ty(p[0],p[1]);if(t<2)r.roadGaps++}
  for(const v of VEH){const t=ty(v.x,v.y);if(v.kind==='boat'){if(t>=0)r.boatsAground++}else if(t<0||!vehOk(v,v.x,v.y))r.carsOff++}
  for(const d of PLACES)r.exitsMin=Math.min(r.exitsMin,d.exits.length);
  const lands=new Set(),withBoat=new Set(PIERS.map(p=>p.land));for(const d of ISLETS){lands.add(d.land);if(!d.land)r.unreachable.push(d.en);if(!withBoat.has(d.land)&&d.land!==HUB.land)r.strandable.push(d.en)}if(!withBoat.has(HUB.land))r.strandable.push('mainland');r.lands=lands.size;
  for(const o of[...OBJ,...FEATHERS,...LETTERS,...SIGHTS])if(!withBoat.has(landOf(o.x,o.y)))r.unreachable.push('thing@'+Math.round(o.x)+','+Math.round(o.y));return r}
window.GAME={S,player,cam,ZONES,HUB,SECRETS,PLACES,OBJ,WD,FEATHERS,LETTERS,SIGHTS,ROADS,PIERS,VEH,PEDS,SOLIDS,CSOL,FT,chunks,ty,landOf,walkable,get state(){return state},get trial(){return trial},get quiz(){return quiz},get riddle(){return riddle},get job(){return job},get curZone(){return curZone},get nearV(){return nearV},get target(){return target},get SC(){return SC},set SC(v){SC=v;freeCache();resize()},
  startTrial,fetchHit,answer,openCard,closeCard,closeQuiz,openChest,selfTest,tier,featherN,update,enterVeh,exitVeh,startJob,jobPick,keys,joy,ptr,act,vehAct};
