'use strict';
/* ============ sprite-stacking core: voxel models sliced into flat layers ============ */
const TAU=Math.PI*2, K=0.72, ZS=1, QN=360;
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash2(x,y,s){let n=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(s|0,1442695041);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296}
function vnoise(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),fx=x-xi,fy=y-yi,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
  const a=hash2(xi,yi,s),b=hash2(xi+1,yi,s),c=hash2(xi,yi+1,s),d=hash2(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}

function V(w,d,h){const a=new Array(w*d*h).fill(null);const v={w,d,h,a,
  set(x,y,z,c){x=Math.round(x);y=Math.round(y);z=Math.round(z);if(x<0||y<0||z<0||x>=w||y>=d||z>=h)return;a[x+y*w+z*w*d]=typeof c==='function'?c(x,y,z):c},
  get(x,y,z){return x<0||y<0||z<0||x>=w||y>=d||z>=h?null:a[x+y*w+z*w*d]},
  box(x0,y0,z0,x1,y1,z1,c){for(let z=z0;z<=z1;z++)for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)v.set(x,y,z,c)},
  ell(cx,cy,cz,rx,ry,rz,c,zmin=0){for(let z=Math.max(zmin,Math.floor(cz-rz));z<=cz+rz;z++)for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){
    const q=((x-cx)/rx)**2+((y-cy)/ry)**2+((z-cz)/rz)**2;if(q<=1)v.set(x,y,z,c)}},
  cyl(cx,cy,z0,z1,r,c){for(let z=z0;z<=z1;z++){const rr=typeof r==='function'?r(z):r;for(let y=Math.floor(cy-rr);y<=cy+rr;y++)for(let x=Math.floor(cx-rr);x<=cx+rr;x++)if((x-cx)**2+(y-cy)**2<=rr*rr+0.3)v.set(x,y,z,c)}},
  ring(cx,cy,z0,z1,r0,r1,c){for(let z=z0;z<=z1;z++)for(let y=Math.floor(cy-r1);y<=cy+r1;y++)for(let x=Math.floor(cx-r1);x<=cx+r1;x++){const q=(x-cx)**2+(y-cy)**2;if(q<=r1*r1+0.3&&q>=r0*r0)v.set(x,y,z,c)}},
  plate(y0,y1,fn){for(let z=0;z<h;z++)for(let x=0;x<w;x++){const c=fn(x,z);if(c!=null)for(let y=y0;y<=y1;y++)v.set(x,y,z,c)}},
  line(x0,y0,z0,x1,y1,z1,c){const n=Math.max(1,Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0),Math.abs(z1-z0))));for(let i=0;i<=n;i++){const t=i/n;v.set(x0+(x1-x0)*t,y0+(y1-y0)*t,z0+(z1-z0)*t,c)}},
  paint(x,y,c){for(let z=h-1;z>=0;z--)if(v.get(x,y,z)!=null){v.set(x,y,z,c);return}}
};return v}
let MID=0;
function bake(v){const{w,d,h,a}=v,layers=[];let n=0,sig=w+'x'+d+'x'+h+':';
  for(let z=0;z<h;z++){let any=false;const cv=mk(w,d),c=cv.getContext('2d'),im=c.createImageData(w,d);
    for(let y=0;y<d;y++)for(let x=0;x<w;x++){const col=a[x+y*w+z*w*d];if(col==null)continue;any=true;n++;
      const top=z===h-1||a[x+y*w+(z+1)*w*d]==null;let k=(top?1.05:0.86)*(0.95+hash2(x+z*7,y-z*3,5)*0.1);
      const o=(x+y*w)*4;im.data[o]=Math.min(255,(col>>16&255)*k);im.data[o+1]=Math.min(255,(col>>8&255)*k);im.data[o+2]=Math.min(255,(col&255)*k);im.data[o+3]=255}
    if(any){c.putImageData(im,0,0);layers.push(cv)}else layers.push(null)}
  for(let i=0;i<a.length;i++)if(a[i]!=null)sig+=i.toString(36)+'.'+a[i].toString(36)+',';
  return{id:MID++,w,d,h,layers,cache:[],sr:Math.max(w,d)*0.42,n,sig}}
/* every slice is drawn flat, one pixel above the last */
function drawStack(ctx,m,sx,sy,rot,sc){sc=sc||1;const c=Math.cos(rot)*sc,s=Math.sin(rot)*sc,hw=-m.w/2,hd=-m.d/2;
  for(let i=0;i<m.h;i++){const L=m.layers[i];if(!L)continue;for(let p=sc-1;p>=0;p--){ctx.setTransform(c,s*K,-s,c*K,sx*sc,(sy-i*ZS)*sc-p);ctx.drawImage(L,hw,hd)}}}
let SPRN=0;
function sprite(m,rot,sc){sc=sc||1;let q=Math.round(rot/TAU*QN)%QN;if(q<0)q+=QN;const key=q*4+sc;let s=m.cache[key];if(!s){
  const diag=Math.ceil(Math.hypot(m.w,m.d))+2,chh=Math.ceil(diag*K)+m.h*ZS+2,cv=mk(diag*sc,chh*sc),c=cv.getContext('2d');c.imageSmoothingEnabled=false;
  const ox=diag/2,oy=chh-Math.ceil(diag*K/2)-1;drawStack(c,m,ox,oy,q*TAU/QN,sc);s=m.cache[key]={cv,ox:ox*sc,oy:oy*sc};SPRN++}return s}

/* ============ palette ============ */
const WH=0xf6f4ee,BK=0x26262b,RD=0xd23b2e,OR=0xf28c1e,YL=0xf2cf3a,GN=0x4c9a3f,DG=0x2f6b34,BLUE=0x1e5fb4,DBLUE=0x163f7a,LB=0x7fc4ee,PU=0x7b3fa0,PK=0xf2a0b5,
  BR=0x8a5a34,DB=0x5c3a22,TN=0xd9b98a,GY=0x9a958c,GD=0xe8b923,SL=0xb9c0c8,SK=0xf0c090,MARBLE=0xe9e4d6,TERRA=0xc4623a,CREAM=0xf3ecd8,WOOD=0x8a5a34,DWOOD=0x5c3a22,STONE=0x9a958c;
const pick=(arr,seed)=>(x,y,z)=>arr[Math.floor(hash2(x*3+z,y*5-z,seed)*arr.length)];
const B=(w,d,h,fn)=>{const v=V(w,d,h);fn(v);return v};

/* four-legged animal body; fn adds what makes each animal itself */
function beast(c,o,fn){const mb=o.mb||3,L=o.L,Wd=o.W,H=o.H,leg=o.leg,hl=o.hl,hw=o.hw,hh=o.hh,up=o.up||0,lt=o.lt||1,pad=3;
  const v=V(mb+L+hl+4,Wd+pad*2,leg+H+up+7),x0=mb,y0=pad,top=leg+H-1,X1=x0+L,yc=y0+(Wd-1)/2,hy0=Math.round(yc-(hw-1)/2),hy1=hy0+hw-1,hz1=top+up,hz0=hz1-hh+1,lc=o.legc==null?c:o.legc,hc=o.hc==null?c:o.hc;
  for(const[lx,ly]of[[x0,y0],[x0,y0+Wd-lt],[x0+L-lt,y0],[x0+L-lt,y0+Wd-lt]])v.box(lx,ly,0,lx+lt-1,ly+lt-1,leg-1,lc);
  v.box(x0,y0,leg,x0+L-1,y0+Wd-1,top,c);
  if(up>0)v.box(X1-2,hy0,top,X1-1,hy1,hz0,c);
  v.box(X1-1,hy0,hz0,X1+hl-1,hy1,hz1,hc);
  const A={x0,y0,L,W:Wd,leg,top,X1,yc:Math.round(yc),hy0,hy1,hz0,hz1,hx:X1+hl-1,c};
  const e=o.eye==null?BK:o.eye;v.set(A.hx,hy0,hz1-1,e);v.set(A.hx,hy1,hz1-1,e);
  if(fn)fn(v,A);return v}
const FONT=['111101101101111','010110010010111','111001111100111','111001111001111','101101111001001','111100111001111','111100111101111','111001001001001','111101111101111','111101111001111'];
const NCOL=[0,RD,OR,YL,0x5fc04a,0x2fc8c0,0x4a9af0,0xb070e0,0xf060b0,0xe0a060,WH];
function number(n){const v=V(15,15,14),P={1:[[7,5]],2:[[4,5],[10,5]],3:[[4,5],[7,5],[10,5]],4:[[4,2],[10,2],[4,8],[10,8]],5:[[4,2],[10,2],[4,8],[10,8],[7,5]],
  6:[[4,2],[7,2],[10,2],[4,8],[7,8],[10,8]],7:[[4,2],[7,2],[10,2],[4,8],[7,8],[10,8],[7,5]],8:[[1,2],[5,2],[9,2],[13,2],[1,8],[5,8],[9,8],[13,8]],
  9:[[4,2],[7,2],[10,2],[4,5],[7,5],[10,5],[4,8],[7,8],[10,8]],10:[[1,2],[4,2],[7,2],[10,2],[13,2],[1,8],[4,8],[7,8],[10,8],[13,8]]}[n];
  v.box(0,0,0,14,14,0,0x2b3a55);for(const[x,y]of P)v.ell(x,y,2,1.4,1.4,1.4,WH);
  v.box(7,12,1,7,13,1,BR);
  const ds=String(n).split('').map(Number),tw=ds.length*6+(ds.length-1)*2;let sx=Math.round(7.5-tw/2);
  for(const dg of ds){for(let r=0;r<5;r++)for(let c=0;c<3;c++)if(FONT[dg][r*3+c]==='1')v.box(sx+c*2,12,2+(4-r)*2,sx+c*2+1,14,3+(4-r)*2,NCOL[n]);sx+=8}
  return v}
function star(x,z,cx,cz,R,r){const dx=x-cx,dz=z-cz,d=Math.hypot(dx,dz);if(d<0.01)return true;let t=(Math.atan2(dz,dx)-Math.PI/2)%(TAU/5);if(t<0)t+=TAU/5;t=Math.abs(t-TAU/10);t=TAU/10-t;
  return d<=R*r*Math.sin(Math.PI/5)/(R*Math.sin(t)+r*Math.sin(Math.PI/5-t))}

/* ============ the hundred words, each with its own sprite ============ */
const WD=[];const W=(el,tr,en,v)=>WD.push({el,tr,en,m:bake(v)});
const GREY3=[0x9a958c,0x878279,0xaaa59c];

// ---- 0 Demeter: fruit & vegetables
W('το μήλο','to mílo','apple',B(9,9,11,v=>{v.ell(4,4,4,4,4,4,(x,y,z)=>x>5&&z>3?0xe8703a:[0x8fc93a,0x9fd44a,0x7fb92e][(x*3+y*5+z)%3]);v.box(4,4,8,4,4,10,DB);v.box(5,4,9,7,4,9,GN);v.box(5,3,9,6,5,9,GN)}));
W('το πορτοκάλι','to portokáli','orange',B(16,9,9,v=>{v.ell(4,4,4,4,4,4,pick([OR,0xe07c12],2));v.box(3,4,8,5,4,8,DG);v.box(4,3,8,4,5,8,DG);
  v.ell(11.5,4,0,3.6,3.6,3.2,0xe07c12);v.cyl(11.5,4,3,3,3.4,(x,y)=>{const d=Math.hypot(x-11.5,y-4),a=Math.atan2(y-4,x-11.5);return d>2.7?WH:(Math.abs(Math.sin(a*3))<0.3?WH:0xffa838)})}));
W('το λεμόνι','to lemóni','lemon',B(15,7,8,v=>{v.ell(7,3,3,5,3,3,pick([YL,0xf7dc4a],3));v.box(1,3,3,2,3,3,YL);v.box(12,3,3,13,3,3,YL);v.set(0,3,3,0xd9b82a);v.set(14,3,3,0xd9b82a);v.box(12,3,4,13,3,5,GN);v.box(12,2,5,13,4,5,GN)}));
W('το σταφύλι','to stafíli','grapes',B(9,9,14,v=>{for(let z=0;z<=9;z++)v.cyl(4,4,z,z,0.8+z*0.36,(x,y,zz)=>((x+y+zz)&1)?PU:0x5c2a80);v.box(4,4,10,4,4,12,DB);v.box(5,3,11,8,5,11,GN);v.box(1,4,11,3,4,11,GN)}));
W('το καρπούζι','to karpúzi','watermelon',B(23,11,10,v=>{v.ell(5.5,5,4.5,5.5,5,4.5,(x,y,z)=>x%3===0?DG:0x5fae4a);
  for(let z=0;z<=6;z++)for(let x=12;x<=22;x++){const d=Math.hypot(x-17,z);if(d>5.4)continue;for(let y=4;y<=6;y++)v.set(x,y,z,d>4.6?DG:d>3.9?WH:((x*3+z*5)%7===0?BK:0xe8384a))}}));
W('η ντομάτα','i domáta','tomato',B(10,10,9,v=>{v.ell(4.5,4.5,3,4.5,4.5,3.2,pick([0xe03a2a,0xd02e22],4));v.box(2,4,6,7,5,6,DG);v.box(4,2,6,5,7,6,DG);v.box(4,4,7,5,5,8,DG)}));
W('το καρότο','to karóto','carrot',B(9,9,16,v=>{v.cyl(4,4,0,8,z=>0.5+z*0.3,(x,y,z)=>z%3===2?0xd9700f:OR);v.box(4,4,9,4,4,14,DG);for(let k=0;k<5;k++){const a=k*TAU/5;v.line(4,4,9,4+Math.cos(a)*3.6,4+Math.sin(a)*3.6,14,GN)}}));
W('το κρεμμύδι','to kremídi','onion',B(9,9,13,v=>{v.ell(4,4,3.5,4,4,3.6,(x,y,z)=>(x+y)%3===0?0xa8463e:0xc86a5a);v.cyl(4,4,7,8,1.2,0xd9a070);v.box(4,4,9,4,4,12,GN);v.set(5,4,12,GN);v.set(3,4,11,GN);v.cyl(4,4,0,0,1.5,0xe8d9b0)}));
W('το κεράσι','to kerási','cherry',B(12,7,13,v=>{v.ell(2.5,3,2.5,2.5,2.5,2.5,RD);v.ell(8.5,3,2.5,2.5,2.5,2.5,0xb81e2a);v.line(2.5,3,5,5.5,3,11,DB);v.line(8.5,3,5,5.5,3,11,DB);v.box(6,3,11,9,3,11,GN);v.box(7,2,11,8,4,11,GN);v.set(1,2,4,0xf08070)}));
W('το σύκο','to síko','fig',B(18,9,11,v=>{v.cyl(4,4,0,9,z=>[2.5,3.5,4,4,3.8,3.3,2.6,1.9,1.3,0.8][z],pick([0x5a2d6e,0x6b3a80,0x4e2560],5));v.set(4,4,10,GN);
  v.cyl(13,4,0,1,3.5,0x5a2d6e);v.cyl(13,4,2,2,3.5,(x,y)=>{const d=Math.hypot(x-13,y-4);return d>2.8?0x5a2d6e:d>2.2?0xf3e6c8:((x+y)&1?0xd8486a:0xf0a0a8)})}));

// ---- 1 Dionysus: food & drink
W('το ψωμί','to psomí','bread',B(15,9,7,v=>{v.ell(7,4,2.5,7,4,3.5,pick([0xc98a3c,0xbd7e32,0xd4964a],6));for(const k of[3,7,11])for(let y=2;y<=6;y++)v.paint(k+Math.round((y-4)/2),y,0xf3deb0)}));
W('το τυρί','to tirí','cheese',B(13,11,7,v=>{for(let x=0;x<13;x++){const hw=x*0.42;for(let y=0;y<11;y++)if(Math.abs(y-5)<=hw)v.box(x,y,0,x,y,5,x===12?0xe0a030:0xf2c94c)}
  for(const[x,y,z]of[[6,5,5],[9,3,5],[10,7,5],[12,4,3],[12,7,2],[12,2,1],[8,5,5],[11,5,5]])v.set(x,y,z,0xc9981a);for(const[x,z]of[[5,2],[8,3],[10,1],[7,1]]){v.set(x,5-Math.floor(x*0.42),z,0xc9981a);v.set(x,5+Math.floor(x*0.42),z,0xc9981a)}}));
W('η ελιά','i eliá','olive',B(11,11,10,v=>{v.cyl(5,5,0,3,z=>3+z*0.6,TERRA);v.cyl(5,5,4,4,4.2,(x,y)=>((x*7+y*3)%3===0)?0x2a2a22:0x6b7a2a);v.cyl(5,5,5,5,2.2,(x,y)=>((x+y)&1)?0x55661f:0x2a2a22);
  v.line(8,5,5,10,5,9,DB);v.box(9,4,7,9,6,7,0x8fa878);v.box(10,4,9,10,6,9,0x8fa878);v.set(8,7,6,0x8fa878)}));
W('το μέλι','to méli','honey',B(13,9,13,v=>{v.cyl(4,4,0,6,3.6,0xe0a020);v.box(3,7,2,5,7,4,WH);v.box(3,1,2,5,1,4,WH);v.cyl(4,4,7,7,4,(x,y)=>((x+y)&1)?RD:WH);v.cyl(4,4,8,8,3,RD);
  v.line(10,4,0,10,4,9,BR);v.cyl(10,4,7,11,z=>z%2?2:1.4,0xd9a030);v.set(10,4,6,0xf0b830);v.set(10,4,5,0xf0b830)}));
W('το κρασί','to krasí','wine',B(15,9,15,v=>{v.cyl(4,4,0,8,2.6,0x1f4a2a);v.box(3,6,3,5,6,6,0xf0e0c0);v.box(3,2,3,5,2,6,0xf0e0c0);v.cyl(4,4,9,10,1.6,0x1f4a2a);v.cyl(4,4,11,13,1,0x1f4a2a);v.set(4,4,14,0xc9a070);
  v.cyl(11,4,0,0,2,0xcfe8f5);v.box(11,4,1,11,4,4,0xcfe8f5);v.cyl(11,4,5,7,z=>1.6+(z-5)*0.4,0x8a1a2e);v.ring(11,4,8,8,1.8,2.7,0xcfe8f5)}));
W('το νερό','to neró','water',B(9,9,13,v=>{v.cyl(4,4,0,11,z=>[2.6,3.6,4,4,3.8,3.4,2.9,2.4,1.9,1.4,0.9,0.5][z],pick([0x3d9be0,0x4aa8ea,0x3590d8],7));v.set(2,1,3,0xdff2ff);v.set(1,2,4,0xdff2ff);v.set(2,2,5,0xdff2ff)}));
W('ο καφές','o kafés','coffee',B(12,11,9,v=>{v.cyl(5,5,0,0,5,WH);v.cyl(5,5,1,4,3,(x,y,z)=>z===2?BLUE:WH);v.cyl(5,5,4,4,2.2,0x4a2c1a);v.box(9,5,2,9,5,3,WH);v.box(10,5,2,10,5,3,WH);v.set(5,5,6,0xe8e8e8);v.set(6,5,7,0xe8e8e8);v.set(5,4,8,0xe8e8e8)}));
W('το ψάρι','to psári','fish',B(17,7,10,v=>{v.ell(7,3,5,6,1.8,3.4,(x,y,z)=>z<4?0xd5dde5:(x%2?0x5f8fb0:0x4f7fa0));for(let x=12;x<=16;x++){const hf=(x-12)*0.9+0.6;for(let z=Math.ceil(5-hf);z<=5+hf;z++)v.box(x,2,z,x,4,z,0x3a6a8a)}
  v.set(3,1,6,BK);v.set(3,5,6,BK);v.box(6,3,9,9,3,9,0x3a6a8a);v.box(6,3,1,8,3,1,0x3a6a8a)}));
W('το αυγό','to avgó','egg',B(17,11,4,v=>{v.cyl(5,5,0,0,5,0x2a2a2e);v.ring(5,5,1,1,4.2,5.2,0x3a3a40);v.cyl(5,5,1,1,3.4,WH);v.set(8,6,1,WH);v.set(2,3,1,WH);v.cyl(5,5,2,2,1.6,0xf5b921);v.box(10,5,1,16,5,1,DB);v.box(10,4,1,11,6,1,0x2a2a2e)}));
W('το λάδι','to ládi','oil',B(9,7,13,v=>{v.box(1,1,0,7,5,8,0xd8b62a);v.box(2,5,2,6,5,6,0x4c7a2a);v.box(2,1,2,6,1,6,0x4c7a2a);v.set(4,5,4,BK);v.set(4,1,4,BK);v.box(1,1,9,7,5,9,0xb89a20);v.box(6,3,10,6,3,11,0x888888);v.set(6,3,12,RD);v.box(2,3,10,4,3,10,0x888888);v.set(2,3,9,0x888888);v.set(4,3,9,0x888888)}));

// ---- 2 Pan: farm animals
W('η γάτα','i gáta','cat',beast(0xe89a3c,{L:7,W:3,H:3,leg:2,hl:2,hw:3,hh:3,up:1,eye:0x2f8a3c},(v,A)=>{v.set(A.X1,A.hy0,A.hz1+1,A.c);v.set(A.X1,A.hy1,A.hz1+1,A.c);v.line(A.x0-1,A.yc,A.top,A.x0-2,A.yc,A.top+4,A.c);
  v.box(A.x0+1,A.y0,A.top,A.x0+1,A.y0+2,A.top,0xb86e1e);v.box(A.x0+3,A.y0,A.top,A.x0+3,A.y0+2,A.top,0xb86e1e);v.set(A.hx+1,A.yc,A.hz0+1,PK)}));
W('ο σκύλος','o skílos','dog',beast(0x9a6a3a,{L:9,W:4,H:4,leg:3,hl:2,hw:4,hh:4,up:1},(v,A)=>{v.box(A.hx+1,A.hy0+1,A.hz0,A.hx+2,A.hy1-1,A.hz0+1,0xd9b98a);v.box(A.hx+3,A.hy0+1,A.hz0+1,A.hx+3,A.hy1-1,A.hz0+1,BK);
  v.box(A.X1,A.hy0-1,A.hz1-2,A.X1+1,A.hy0-1,A.hz1,DB);v.box(A.X1,A.hy1+1,A.hz1-2,A.X1+1,A.hy1+1,A.hz1,DB);v.line(A.x0-1,A.yc,A.top,A.x0-2,A.yc,A.top+3,A.c);v.box(A.X1-2,A.hy0,A.top+1,A.X1-2,A.hy1,A.top+1,RD)}));
W('το άλογο','to álogo','horse',beast(0x8a5230,{L:11,W:5,H:4,leg:6,hl:3,hw:3,hh:3,up:5,legc:0x6a3a1e,lt:2},(v,A)=>{for(const y of[A.hy0,A.hy1])v.line(A.X1-3,y,A.top+1,A.X1-2,y,A.hz1+1,BK);v.box(A.x0-1,A.hy0,A.top-4,A.x0-1,A.hy1,A.top,BK);
  v.box(A.hx,A.hy0,A.hz0,A.hx,A.hy1,A.hz0,WH);for(const x of[A.x0,A.x0+9])for(const y of[A.y0,A.y0+3])v.box(x,y,0,x+1,y+1,0,BK);v.box(A.x0+4,A.y0,A.top+1,A.x0+6,A.y0+4,A.top+1,0xb8322a)}));
W('η κατσίκα','i katsíka','goat',beast(0xeeeae0,{L:8,W:3,H:4,leg:4,hl:2,hw:3,hh:3,up:2},(v,A)=>{for(const y of[A.hy0,A.hy1])v.line(A.X1,y,A.hz1+1,A.X1-2,y,A.hz1+3,0x7a7468);v.box(A.hx,A.yc,A.hz0-2,A.hx,A.yc,A.hz0-1,0xcfc8b8);v.set(A.x0-1,A.yc,A.top+1,A.c);
  v.box(A.x0+2,A.y0,A.top,A.x0+4,A.y0+2,A.top,0xb9a88a)}));
W('ο γάιδαρος','o gáidaros','donkey',beast(0x8f8f96,{L:9,W:4,H:4,leg:4,hl:3,hw:3,hh:3,up:2},(v,A)=>{v.box(A.X1,A.hy0,A.hz1+1,A.X1,A.hy0,A.hz1+4,0x6f6f78);v.box(A.X1,A.hy1,A.hz1+1,A.X1,A.hy1,A.hz1+4,0x6f6f78);v.box(A.hx,A.hy0,A.hz0,A.hx,A.hy1,A.hz0+1,WH);
  v.box(A.x0+3,A.y0,A.top+1,A.x0+5,A.y0+3,A.top+1,BLUE);v.box(A.x0+3,A.y0-2,A.top-2,A.x0+5,A.y0-1,A.top,0xc9a060);v.box(A.x0+3,A.y0+4,A.top-2,A.x0+5,A.y0+5,A.top,0xc9a060);v.box(A.x0-1,A.yc,A.top-3,A.x0-1,A.yc,A.top,0x5a5a60)}));
W('το πρόβατο','to próvato','sheep',beast(WH,{L:8,W:4,H:4,leg:3,hl:2,hw:2,hh:3,up:0,legc:0x33302e,hc:0x33302e,eye:WH},(v,A)=>{v.ell(A.x0+3.5,A.y0+1.5,A.leg+2,5,3.4,3,pick([WH,0xe8e4da,0xf8f6f0],8));v.box(A.X1,A.hy0,A.hz0,A.hx,A.hy1,A.hz1,0x33302e);
  v.set(A.hx,A.hy0,A.hz1-1,WH);v.set(A.hx,A.hy1,A.hz1-1,WH);v.set(A.X1,A.hy0-1,A.hz1,0x33302e);v.set(A.X1,A.hy1+1,A.hz1,0x33302e)}));
W('η κότα','i kóta','chicken',B(11,7,12,v=>{v.ell(4.5,3,4.5,3.5,2.6,2.6,WH);v.line(1,3,5,0,3,9,WH);v.set(1,3,7,WH);v.set(1,3,8,WH);v.box(7,2,6,8,4,9,WH);v.box(7,3,10,8,3,10,RD);v.set(7,3,11,RD);v.set(9,3,8,OR);v.set(10,3,8,OR);v.set(9,3,7,RD);
  v.set(8,1,9,BK);v.set(8,5,9,BK);v.box(4,2,0,4,2,1,OR);v.box(4,4,0,4,4,1,OR);v.set(5,2,0,OR);v.set(5,4,0,OR);v.box(3,0,4,5,0,5,0xe0dcd0);v.box(3,6,4,5,6,5,0xe0dcd0)}));
W('η αγελάδα','i ayeláda','cow',beast(WH,{L:11,W:5,H:5,leg:4,hl:3,hw:4,hh:4,up:1,lt:2},(v,A)=>{v.box(A.x0+1,A.y0,A.leg+2,A.x0+3,A.y0+2,A.top,BK);v.box(A.x0+6,A.y0+3,A.leg+1,A.x0+8,A.y0+4,A.top,BK);v.box(A.x0+7,A.y0,A.leg,A.x0+9,A.y0,A.leg+2,BK);
  v.box(A.hx,A.hy0,A.hz0,A.hx,A.hy1,A.hz0+1,PK);v.set(A.X1,A.hy0-1,A.hz1+1,0xe8dcc0);v.set(A.X1,A.hy1+1,A.hz1+1,0xe8dcc0);v.box(A.x0+2,A.yc,A.leg-1,A.x0+3,A.yc+1,A.leg-1,PK);v.box(A.x0-1,A.yc,A.leg,A.x0-1,A.yc,A.top,WH);v.set(A.x0-1,A.yc,A.leg-1,BK)}));
W('το γουρούνι','to gurúni','pig',beast(0xf2a0b5,{L:8,W:5,H:5,leg:2,hl:2,hw:5,hh:4,up:0},(v,A)=>{v.box(A.hx+1,A.hy0+1,A.hz0+1,A.hx+1,A.hy1-1,A.hz0+2,0xe07a95);v.set(A.hx+2,A.hy0+1,A.hz0+1,0xb85a75);v.set(A.hx+2,A.hy1-1,A.hz0+1,0xb85a75);
  v.set(A.X1,A.hy0,A.hz1+1,0xe07a95);v.set(A.X1,A.hy1,A.hz1+1,0xe07a95);v.set(A.x0-1,A.yc,A.top-1,0xe07a95);v.set(A.x0-2,A.yc,A.top,0xe07a95);v.set(A.x0-1,A.yc,A.top+1,0xe07a95)}));
W('η μέλισσα','i mélisa','bee',B(14,13,13,v=>{v.ell(6,6,6,5,3,3,(x,y,z)=>(x%4<2)?YL:BK);v.ell(5,2.5,9.6,2.6,3,0.7,0xdff2ff);v.ell(5,9.5,9.6,2.6,3,0.7,0xdff2ff);v.set(0,6,6,BK);v.set(11,5,7,WH);v.set(11,7,7,WH);v.line(10,5,9,12,4,11,BK);v.line(10,7,9,12,8,11,BK)}));

// ---- 3 Artemis: wild animals
W('το λιοντάρι','to liondári','lion',beast(0xd9a441,{L:10,W:4,H:4,leg:3,hl:3,hw:4,hh:4,up:2,mb:5},(v,A)=>{v.ell(A.X1,A.y0+1.5,A.hz0+1.5,2.4,3.8,3.8,pick([0x8a4a1e,0x7a3e16,0x9a5a28],9));v.box(A.X1+1,A.hy0,A.hz0,A.hx,A.hy1,A.hz1,0xd9a441);
  v.set(A.hx,A.hy0,A.hz1-1,BK);v.set(A.hx,A.hy1,A.hz1-1,BK);v.box(A.hx,A.hy0+1,A.hz0,A.hx,A.hy1-1,A.hz0,0x5a3a22);v.line(A.x0-1,A.yc,A.top,A.x0-4,A.yc,A.top+2,0xd9a441);v.set(A.x0-4,A.yc,A.top+3,0x7a3e16);v.set(A.x0-5,A.yc,A.top+2,0x7a3e16)}));
W('η αλεπού','i alepú','fox',beast(0xe2702a,{L:8,W:3,H:3,leg:3,hl:2,hw:3,hh:3,up:1,legc:BK,mb:8},(v,A)=>{v.box(A.hx+1,A.yc,A.hz0,A.hx+2,A.yc,A.hz0,WH);v.set(A.hx+3,A.yc,A.hz0,BK);v.box(A.X1,A.hy0,A.hz1+1,A.X1,A.hy0,A.hz1+2,BK);v.box(A.X1,A.hy1,A.hz1+1,A.X1,A.hy1,A.hz1+2,BK);
  v.ell(A.x0-3,A.yc,A.top,3,1.7,1.7,0xe2702a);v.ell(A.x0-6,A.yc,A.top,1.6,1.4,1.4,WH);v.box(A.X1-1,A.hy0,A.leg,A.X1-1,A.hy1,A.leg,WH)}));
W('το κουνέλι','to kunéli','rabbit',B(11,7,13,v=>{const c=0xd9d4cc;v.ell(4.5,3,3,3.5,3,3,c);v.ell(8,3,6,2.2,2.2,2.2,c);v.box(8,2,8,8,2,12,c);v.box(8,4,8,8,4,12,c);v.set(9,2,10,PK);v.set(9,4,10,PK);v.ell(1,3,3,1.3,1.3,1.3,WH);v.set(9,1,7,BK);v.set(9,5,7,BK);v.set(10,3,6,PK);v.box(6,1,0,8,1,0,c);v.box(6,5,0,8,5,0,c)}));
W('η χελώνα','i helóna','turtle',B(15,11,7,v=>{const c=0x6faa4a;v.box(2,0,0,4,1,0,c);v.box(2,9,0,4,10,0,c);v.box(8,0,0,10,1,0,c);v.box(8,9,0,10,10,0,c);v.ell(6,5,1,5,4,4.4,(x,y,z)=>(((x>>1)+(y>>1))&1)?0x6b5a2a:0x8a7a3a,1);v.box(11,4,1,13,6,2,c);v.set(13,4,2,BK);v.set(13,6,2,BK);v.set(0,5,1,c)}));
W('το φίδι','to fídi','snake',B(11,11,13,v=>{const c=(x,y,z)=>((x+y+z)%3===0)?0xd9c93a:0x3f9a4a;for(let z=0;z<=5;z++)v.ring(5,5,z,z,3.4-z*0.5,4.9-z*0.5,c);v.box(5,5,6,5,5,9,0x3f9a4a);v.box(5,4,10,7,6,11,0x3f9a4a);v.set(7,4,11,YL);v.set(7,6,11,YL);v.box(8,5,10,9,5,10,RD);v.set(10,4,10,RD);v.set(10,6,10,RD)}));
W('η κουκουβάγια','i kukuváya','owl',B(9,9,14,v=>{v.cyl(4,4,0,2,3,DB);v.ell(4,4,7,3.4,3,4.2,pick([0x8a6a45,0x7a5c3a,0x9a7850],10));v.box(7,3,4,7,5,7,0xd9c9a0);v.box(7,2,9,7,3,10,YL);v.box(7,5,9,7,6,10,YL);v.set(8,3,9,BK);v.set(8,5,9,BK);v.set(8,4,8,OR);
  v.box(4,2,12,5,2,12,DB);v.box(4,6,12,5,6,12,DB);v.box(3,0,5,5,0,8,0x6a4e30);v.box(3,8,5,5,8,8,0x6a4e30)}));
W('ο βάτραχος','o vátrahos','frog',B(12,12,7,v=>{v.cyl(5.5,5.5,0,0,5.5,0x3f8a3c);v.box(9,5,0,11,6,0,null);v.ell(5.5,5.5,2.5,3.2,3,2.2,0x7ed04a,1);v.set(7,4,5,WH);v.set(7,7,5,WH);v.set(8,4,5,BK);v.set(8,7,5,BK);v.box(2,2,1,4,2,2,0x5aa83a);v.box(2,9,1,4,9,2,0x5aa83a);v.box(8,4,2,8,7,2,0xe0f0a8);v.set(2,1,1,0x5aa83a);v.set(2,10,1,0x5aa83a)}));
W('η πεταλούδα','i petalúda','butterfly',B(15,15,10,v=>{v.box(7,7,0,7,7,4,GN);v.ell(7,7,5,1.6,1.6,1,PK);const w1=(x,y)=>((x+y)%4===0)?BK:OR,w2=(x,y)=>((x+y)%3===0)?BK:YL;
  v.ell(8.5,3,7.5,3.6,3.2,0.9,w1);v.ell(8.5,11,7.5,3.6,3.2,0.9,w1);v.ell(4.5,3.8,7.5,2.6,2.5,0.9,w2);v.ell(4.5,10.2,7.5,2.6,2.5,0.9,w2);v.box(4,7,7,10,7,8,BK);v.line(10,7,8,12,6,9,BK);v.line(10,7,8,12,8,9,BK)}));
W('το ελάφι','to eláfi','deer',beast(0xb5773a,{L:9,W:3,H:4,leg:5,hl:2,hw:3,hh:3,up:3},(v,A)=>{for(const[y,s]of[[A.hy0,-1],[A.hy1,1]]){v.line(A.X1,y,A.hz1+1,A.X1-1,y+s,A.hz1+5,0xe8dcc0);v.set(A.X1+1,y+s,A.hz1+3,0xe8dcc0);v.set(A.X1-2,y+s,A.hz1+4,0xe8dcc0);v.set(A.X1+1,y+s,A.hz1+4,0xe8dcc0)}
  for(const[x,y]of[[2,0],[4,2],[6,0],[5,1],[1,2]])v.set(A.x0+x,A.y0+y,A.top,WH);v.set(A.x0-1,A.yc,A.top,WH);v.set(A.hx+1,A.yc,A.hz0+1,BK)}));
W('η αρκούδα','i arkúda','bear',beast(0x5a3a22,{L:9,W:6,H:6,leg:3,hl:3,hw:4,hh:4,up:0,lt:2,eye:WH},(v,A)=>{v.box(A.X1,A.hy0,A.hz1+1,A.X1,A.hy0,A.hz1+1,0x3e2616);v.box(A.X1,A.hy1,A.hz1+1,A.X1,A.hy1,A.hz1+1,0x3e2616);v.box(A.hx+1,A.hy0+1,A.hz0,A.hx+1,A.hy1-1,A.hz0+1,0xc9a070);v.set(A.hx+2,A.hy0+1,A.hz0+1,BK);
  v.ell(A.x0+4,A.y0+2.5,A.leg+3,5,3.4,3.6,pick([0x5a3a22,0x4e3018,0x66442a],11))}));

// ---- 4 Apollo: sky & nature
W('ο ήλιος','o ílios','sun',B(15,15,16,v=>{v.ell(7,7,8,4,4,4,pick([YL,0xf7dc5a],12));for(let k=0;k<8;k++){const a=k*TAU/8;v.set(7+Math.cos(a)*5.4,7+Math.sin(a)*5.4,8,OR);v.set(7+Math.cos(a)*6.5,7+Math.sin(a)*6.5,8,OR)}
  v.box(7,7,13,7,7,14,OR);v.box(7,7,1,7,7,3,OR);for(const[dx,dy]of[[4,0],[-4,0],[0,4],[0,-4]]){v.set(7+dx,7+dy,12,OR);v.set(7+dx,7+dy,4,OR)}}));
W('το φεγγάρι','to fengári','moon',B(13,5,15,v=>v.plate(1,3,(x,z)=>(x-5.5)**2+(z-7.5)**2<=40&&(x-9)**2+(z-8.5)**2>27?((x+z)%5===0?0xd9cf90:0xf2e9b0):null)));
W('το αστέρι','to astéri','star',B(15,5,15,v=>v.plate(1,3,(x,z)=>star(x,z,7,7.5,7,3)?(Math.hypot(x-7,z-7.5)<2.2?0xfff0a0:GD):null)));
W('το σύννεφο','to sínefo','cloud',B(17,11,11,v=>{v.ell(5,5,6,4,3.5,2.6,WH);v.ell(9,5,7,4.5,4,3.2,WH);v.ell(13,5.5,5.8,3,3,2.2,0xf1f5f9)}));
W('η βροχή','i vrohí','rain',B(15,10,14,v=>{v.ell(4.5,4.5,10.5,4,3.5,2.2,0x8f9aa8);v.ell(9.5,5,10.8,4.4,3.8,2.5,0x7f8a98);[[3,3],[6,6],[9,3],[11,6],[5,4],[8,7],[2,6],[12,4]].forEach(([x,y],k)=>{for(const z0 of[k%3,4+k%3])v.box(x,y,z0,x,y,z0+1,0x4aa8ea)})}));
W('το βουνό','to vunó','mountain',B(17,17,15,v=>v.cyl(8,8,0,13,z=>8.2*(1-z/15),(x,y,z)=>z>=10?WH:(z===9&&((x+y)&1))?WH:z<2?0x6f8f4f:((x*3+y*5+z)%4===0?0x7a6a58:0x8f7f6a))));
W('το δέντρο','to déndro','tree',B(13,13,17,v=>{v.box(5,5,0,6,6,7,BR);v.set(4,5,0,BR);v.set(7,6,0,BR);v.ell(5.5,5.5,10.5,5.5,5.5,4.8,pick([0x3f8a3c,0x4a9a44,0x357a34],13))}));
W('το λουλούδι','to lulúdi','flower',B(11,11,13,v=>{v.box(5,5,0,5,5,8,GN);v.box(6,5,3,7,5,3,GN);v.box(3,5,5,4,5,5,GN);for(let k=0;k<6;k++){const a=k*TAU/6;v.ell(5+Math.cos(a)*3,5+Math.sin(a)*3,9.5,1.7,1.7,0.8,k%2?0xe8457a:0xf06a98)}v.ell(5,5,10,1.6,1.6,1,YL)}));
W('η φωτιά','i fotiá','fire',B(11,11,13,v=>{v.box(1,4,0,9,5,1,DB);v.box(4,1,0,5,9,1,BR);v.cyl(5,5,2,11,z=>[3.4,3.6,3.2,2.8,2.4,2,1.6,1.2,0.8,0.5][z-2],(x,y,z)=>{const d=Math.hypot(x-5,y-5);return d<1.3&&z<8?YL:z>8?RD:d<2.3?OR:RD})}));
W('η πέτρα','i pétra','stone',B(14,11,8,v=>{v.ell(5,5,2,5,4.5,4,pick(GREY3,14));v.ell(10,6,1.5,3.5,3.5,3,pick(GREY3,15));for(const[x,y]of[[4,4],[5,3],[4,5],[3,4]])v.paint(x,y,0x6f8f4f)}));

// ---- 5 Hestia: the home
W('το σπίτι','to spíti','house',B(13,11,14,v=>{v.box(1,1,0,11,9,6,WH);for(let i=0;i<=5;i++)v.box(0,i,7+i,12,10-i,7+i,0xb5532f);v.box(5,9,0,6,9,3,BLUE);v.box(2,9,3,3,9,4,LB);v.box(9,9,3,10,9,4,LB);v.box(11,4,3,11,5,4,LB);v.box(1,4,3,1,5,4,LB);v.box(9,3,9,10,4,13,0xd9cdb4)}));
W('η πόρτα','i pórta','door',B(11,5,15,v=>{v.box(0,0,0,10,4,0,GY);v.plate(1,3,(x,z)=>z<1||z>13?null:(x<2||x>8||z>11)?WH:(z===6||x===5)?DBLUE:BLUE);v.set(7,0,6,GD);v.set(7,4,6,GD)}));
W('το παράθυρο','to paráthiro','window',B(13,6,13,v=>{v.plate(2,4,(x,z)=>z>11?null:(x>=4&&x<=8&&z>=4&&z<=9)?((x===6||z===7)?WH:LB):WH);v.box(1,1,4,3,1,9,BLUE);v.box(9,1,4,11,1,9,BLUE);v.box(1,5,4,3,5,9,BLUE);v.box(9,5,4,11,5,9,BLUE);
  v.box(4,0,3,8,1,3,TERRA);v.set(4,0,4,RD);v.set(6,0,4,PK);v.set(8,0,4,RD);v.set(5,1,4,GN);v.set(7,1,4,GN)}));
W('το τραπέζι','to trapézi','table',B(13,10,8,v=>{for(const[x,y]of[[1,1],[11,1],[1,8],[11,8]])v.box(x,y,0,x,y,5,BR);v.box(0,0,6,12,9,6,(x,y)=>(((x>>1)+(y>>1))&1)?BLUE:WH);v.ring(6,4.5,5,5,5.6,9,(x,y)=>(((x>>1)+(y>>1))&1)?BLUE:WH);v.cyl(6,4.5,7,7,2,WH)}));
W('η καρέκλα','i karékla','chair',B(8,8,13,v=>{for(const[x,y]of[[1,1],[6,1],[1,6],[6,6]])v.box(x,y,0,x,y,4,BR);v.box(1,1,5,6,6,5,(x,y)=>((x+y)&1)?0xe8c860:0xd9b040);v.box(1,1,6,1,1,12,BR);v.box(1,6,6,1,6,12,BR);v.box(1,2,8,1,5,8,BR);v.box(1,2,11,1,5,11,BR)}));
W('το κλειδί','to klidí','key',B(9,5,16,v=>{v.box(2,0,0,6,4,0,GY);v.plate(1,3,(x,z)=>{const d=Math.hypot(x-4,z-11.5);if(d<=3.7&&d>=1.7)return GD;if(z>=1&&z<=8&&x===4)return GD;if((z===2||z===4)&&x>=5&&x<=6)return GD;return null})}));
W('το κρεβάτι','to kreváti','bed',B(16,10,8,v=>{for(const[x,y]of[[0,0],[15,0],[0,9],[15,9]])v.box(x,y,0,x,y,1,BR);v.box(0,0,2,15,9,3,BR);v.box(1,1,4,14,8,4,WH);v.box(1,1,5,10,8,5,(x,y)=>x===9?WH:BLUE);v.box(12,2,5,14,7,5,WH);v.box(15,0,2,15,9,7,BR);v.box(0,0,2,0,9,5,BR)}));
W('η λάμπα','i lámba','lamp',B(7,7,13,v=>{const c=0x8a6a2a;v.cyl(3,3,0,1,3,c);v.cyl(3,3,2,2,1.5,c);v.cyl(3,3,3,8,z=>[2,2.6,2.8,2.6,2,1.4][z-3],(x,y)=>Math.hypot(x-3,y-3)<1.2?0xfff8c0:0xffd95e);v.cyl(3,3,9,9,1.8,c);v.cyl(3,3,10,10,1,c);v.box(3,2,11,3,4,11,0x6a4a1a);v.set(3,3,12,0x6a4a1a)}));
W('το βιβλίο','to vivlío','book',B(11,8,7,v=>{v.box(0,0,0,10,7,0,RD);v.box(1,1,1,10,6,2,CREAM);v.box(0,0,3,10,7,3,RD);v.box(0,0,0,0,7,3,0xa82a20);v.box(3,2,3,7,2,3,GD);v.box(4,4,3,6,4,3,GD);v.box(2,1,4,9,6,4,BLUE);v.box(3,2,5,9,5,5,CREAM);v.box(2,1,6,9,6,6,BLUE);v.box(2,1,4,2,6,6,DBLUE)}));
W('το ρολόι','to rolói','clock',B(11,5,15,v=>{v.box(3,0,0,7,4,0,BR);v.box(5,1,1,5,3,2,BR);v.plate(1,3,(x,z)=>{const d=Math.hypot(x-5,z-8.5);if(d>5.3)return null;if(d>4.2)return DB;if((x===5&&(z===12||z===5))||((z===8||z===9)&&(x===2||x===8)))return BK;return WH});
  for(const y of[0,4]){v.box(5,y,8,5,y,11,BK);v.box(6,y,8,7,y,8,BK)}}));

// ---- 6 Athena: the town
W('η εκκλησία','i eklisía','church',B(16,10,14,v=>{v.box(2,1,0,12,8,5,WH);v.ell(7,4.5,5.5,3.6,3.6,4,pick([0x2a6fc9,0x2462b4,0x3079d6],16),6);v.box(7,4,10,7,4,12,WH);v.box(6,4,11,8,4,11,WH);v.box(13,3,0,15,6,8,WH);v.box(13,4,5,15,5,6,DBLUE);v.box(13,3,9,15,6,9,BLUE);v.box(2,4,0,2,5,3,BLUE);v.box(5,8,2,6,8,3,BLUE);v.box(9,8,2,10,8,3,BLUE);v.box(5,1,2,6,1,3,BLUE)}));
W('ο ανεμόμυλος','o anemómilos','windmill',B(15,15,17,v=>{v.cyl(6,7,0,9,z=>4-z*0.08,WH);v.cyl(6,7,10,13,z=>3.8*(1-(z-10)/4.5),pick([0x8a6a45,0x7a5c3a,0x9a7850],17));v.box(2,7,0,2,7,2,BLUE);v.box(9,7,9,11,7,9,DWOOD);
  for(let r=1;r<=6;r++){v.set(11,7+r,9,DWOOD);v.set(11,7-r,9,DWOOD);v.set(11,7,9+r,DWOOD);v.set(11,7,9-r,DWOOD);if(r>2){v.set(11,7+r,10,CREAM);v.set(11,7-r,8,CREAM);v.set(11,6,9+r,CREAM);v.set(11,8,9-r,CREAM)}}}));
W('ο φάρος','o fáros','lighthouse',B(9,9,18,v=>{v.cyl(4,4,0,1,4,GY);v.cyl(4,4,2,12,z=>3-(z-2)*0.08,(x,y,z)=>((z-2)%4<2)?RD:WH);v.cyl(4,4,13,13,3.4,0x2b3a55);v.cyl(4,4,14,15,1.6,0xffe36b);v.cyl(4,4,16,16,2,RD);v.set(4,4,17,RD)}));
W('η γέφυρα','i yéfira','bridge',B(19,7,8,v=>{for(let x=0;x<19;x++){const top=Math.round(5-((x-9)/9)**2*3);for(let z=0;z<=top;z++){if(((x-9)/6)**2+(z/3.5)**2<1){if(z===0)v.box(x,0,0,x,6,0,0x4aa8ea);continue}v.box(x,1,z,x,5,z,((x+z)&1)?0xb0a898:0x9a9288)}v.set(x,1,top+1,0x8a8278);v.set(x,5,top+1,0x8a8278)}}));
W('το πηγάδι','to pigádi','well',B(11,11,14,v=>{v.ring(5,5,0,3,3,4.6,pick(GREY3,18));v.cyl(5,5,2,2,3,0x3d9be0);v.box(1,5,4,1,5,9,BR);v.box(9,5,4,9,5,9,BR);for(let i=0;i<3;i++)v.box(0,2+i,10+i,10,8-i,10+i,0xb5532f);v.box(1,5,8,9,5,8,DB);v.box(5,5,5,5,5,7,0xd9c9a0);v.box(5,5,3,6,6,4,0x9a9aa2)}));
W('η κολόνα','i kolóna','column',B(9,9,17,v=>{v.box(1,1,0,7,7,0,MARBLE);v.cyl(4,4,1,1,3.2,MARBLE);v.cyl(4,4,2,12,2.4,(x,y)=>((x+y)&1)?0xe9e4d6:0xcfcabb);v.cyl(4,4,13,13,3,MARBLE);v.box(1,2,14,7,6,15,MARBLE);v.box(0,2,13,0,6,14,0xcfcabb);v.box(8,2,13,8,6,14,0xcfcabb)}));
W('το άγαλμα','to ágalma','statue',B(9,9,19,v=>{const c=pick([0x4f8f7f,0x5a9a8a,0x457f70],22);v.box(1,1,0,7,7,2,0xbfb9a8);v.box(2,2,3,6,6,3,MARBLE);v.box(4,3,4,4,3,8,c);v.box(4,5,4,4,5,8,c);v.box(3,2,9,5,6,12,c);v.box(4,1,8,4,1,12,c);v.box(4,7,11,4,7,16,c);v.box(3,3,13,5,5,15,c);v.box(3,3,16,5,5,16,GD);v.set(4,7,17,GD);v.set(4,7,18,OR)}));
W('το σιντριβάνι','to sindriváni','fountain',B(13,13,12,v=>{v.ring(6,6,0,2,4.6,6,0xcfcabb);v.cyl(6,6,1,1,4.6,0x4aa8ea);v.cyl(6,6,0,6,1.2,MARBLE);v.cyl(6,6,7,7,3.2,0xcfcabb);v.ring(6,6,8,8,2.4,3.2,0xcfcabb);v.cyl(6,6,8,8,2.2,0x4aa8ea);v.box(6,6,8,6,6,10,MARBLE);v.set(6,6,11,0x9fd4f5);
  for(const[x,y]of[[6,2],[6,10],[2,6],[10,6]])v.box(x,y,2,x,y,7,0x9fd4f5)}));
W('ο δρόμος','o drómos','road',B(17,10,10,v=>{v.box(0,1,0,16,7,0,(x,y)=>y===1||y===7?0x8a8a90:(y===4&&x%4<2)?WH:0x5a5a60);v.box(13,9,0,13,9,8,BR);v.box(9,9,6,14,9,8,YL);v.set(8,9,7,YL);v.box(2,9,0,3,9,2,WH);v.set(2,9,2,RD)}));
W('το θέατρο','to théatro','theatre',B(23,12,7,v=>{for(let y=0;y<12;y++)for(let x=0;x<23;x++){const d=Math.hypot(x-11,y-11);if(d>11.2)continue;if(d<3){v.set(x,y,0,0xe8d9a8);continue}const t=Math.min(4,Math.floor((d-3)/1.65));v.box(x,y,0,x,y,t+1,t%2?MARBLE:0xcfcabb)}v.box(6,11,0,16,11,1,0xbfb9a8)}));

// ---- 7 Hermes: travel & things to wear
W('το καράβι','to karávi','ship',B(18,9,17,v=>{for(let x=0;x<17;x++){const hw=3.5*Math.pow(Math.sin(Math.PI*(x+0.5)/17),0.6);for(let z=0;z<3;z++)for(let y=0;y<9;y++){const dy=Math.abs(y-4);if(dy>hw-(2-z)*0.4)continue;const edge=dy>hw-1.1||x<1||x>15;if(z<2)v.set(x,y,z,0x6a4428);else v.set(x,y,z,edge?0x8a5a34:0xc99a66)}}
  v.box(5,4,3,5,4,13,DWOOD);v.box(11,4,3,11,4,15,DWOOD);v.box(6,1,6,6,7,12,CREAM);v.box(7,2,7,7,6,11,CREAM);v.box(12,1,7,12,7,14,CREAM);v.box(13,2,8,13,6,13,CREAM);v.box(6,1,9,6,7,9,RD);v.box(12,1,10,12,7,10,RD);v.box(12,4,15,13,4,16,RD)}));
W('το αυτοκίνητο','to aftokínito','car',B(15,9,8,v=>{for(const cx of[3,11])for(const y of[0,8]){v.box(cx-1,y,0,cx+1,y,2,BK);v.set(cx,y,1,GY)}v.box(0,1,1,14,7,3,RD);v.box(3,1,4,10,7,6,RD);v.box(4,1,4,9,1,5,LB);v.box(4,7,4,9,7,5,LB);v.box(10,2,4,10,6,5,LB);v.box(3,2,4,3,6,5,LB);
  v.set(14,2,2,YL);v.set(14,6,2,YL);v.set(0,2,2,0x8a1a1a);v.set(0,6,2,0x8a1a1a);v.box(14,3,1,14,5,1,GY)}));
W('το ποδήλατο','to podílato','bicycle',B(17,5,12,v=>{v.plate(1,3,(x,z)=>{for(const cx of[3.5,12.5]){const d=Math.hypot(x-cx,z-3.5);if(d<=3.8&&d>=2.5)return BK;if(d<0.8)return GY}return null});
  for(const y of[1,2,3]){v.line(3.5,y,3.5,7,y,8,RD);v.line(7,y,8,11,y,8,RD);v.line(11,y,9,12.5,y,3.5,RD);v.line(3.5,y,3.5,7.5,y,3.5,RD);v.line(7.5,y,3.5,11,y,8,RD);v.line(7.5,y,3.5,7,y,8,RD)}
  v.box(6,1,9,8,3,9,BK);v.box(11,0,10,11,4,10,BK);v.box(11,2,9,11,2,9,BLUE)}));
W('το τρένο','to tréno','train',B(17,8,12,v=>{for(const x of[2,6,10,14])for(const y of[0,7]){v.box(x-1,y,0,x+1,y,1,BK);v.set(x,y,1,RD)}v.box(0,1,1,16,6,2,0x33363d);for(let x=5;x<=15;x++)for(let y=1;y<=6;y++)for(let z=3;z<=7;z++)if((y-3.5)**2+(z-5)**2<=6.6)v.set(x,y,z,x===15?0x33363d:0x2f7a4a);
  v.box(0,1,3,4,6,8,RD);v.box(0,0,9,5,7,9,0x33363d);v.box(1,1,5,3,1,7,LB);v.box(1,6,5,3,6,7,LB);v.box(13,3,8,14,4,10,0x33363d);v.box(12,2,11,15,5,11,0x33363d);v.box(9,3,8,10,4,8,GD);v.box(16,2,1,16,5,1,RD)}));
W('το αεροπλάνο','to aeropláno','airplane',B(17,17,10,v=>{for(let x=1;x<=15;x++){const r=x>12?1.3:x<3?1:1.9;for(let y=5;y<=11;y++)for(let z=2;z<=8;z++)if((y-8)**2+(z-5)**2<=r*r+0.3)v.set(x,y,z,z===5&&x>3?BLUE:WH)}
  v.box(6,0,5,9,16,5,(x,y)=>y<2||y>14?RD:WH);v.box(1,5,5,2,11,5,WH);v.box(1,8,6,2,8,9,BLUE);v.box(12,7,7,13,9,7,LB);v.box(16,8,3,16,8,7,BK);v.box(16,6,5,16,10,5,BK)}));
W('ο χάρτης','o hártis','map',B(15,11,4,v=>{v.box(0,0,0,2,10,2,0xd9b878);v.box(12,0,0,14,10,2,0xd9b878);v.set(1,0,1,BR);v.set(13,0,1,BR);v.set(1,10,1,BR);v.set(13,10,1,BR);v.box(3,0,1,11,10,1,0xf0deb0);v.box(4,1,1,6,4,1,0x8fbf6a);v.set(7,2,1,0x8fbf6a);v.box(8,6,1,10,8,1,0x8fbf6a);v.box(9,2,1,10,3,1,0x6fb4e0);
  for(const[x,y]of[[5,5],[6,6],[7,6],[8,5]])v.set(x,y,1,BK);v.set(9,7,1,RD);v.set(4,8,1,GD);v.set(4,9,1,GD);v.set(5,9,1,GD);v.set(3,9,1,GD)}));
W('η βαλίτσα','i valítsa','suitcase',B(13,6,10,v=>{v.box(0,0,0,12,5,7,0x9a6a3a);v.box(3,0,0,3,5,7,DB);v.box(9,0,0,9,5,7,DB);for(const x of[0,12])for(const y of[0,5])for(const z of[0,7])v.set(x,y,z,GD);
  v.box(5,2,8,5,3,8,DB);v.box(7,2,8,7,3,8,DB);v.box(5,2,9,7,3,9,DB);v.box(1,0,4,2,0,5,RD);v.box(10,0,2,11,0,3,BLUE);v.box(5,0,2,6,0,3,YL);v.box(5,5,4,7,5,5,GN)}));
W('το καπέλο','to kapélo','hat',B(13,13,6,v=>{const c=pick([0xe8c860,0xd9b850,0xf0d070],19);v.cyl(6,6,0,0,6,c);v.cyl(6,6,1,1,3.5,BLUE);v.cyl(6,6,2,4,3.4,c);v.cyl(6,6,5,5,2.8,c)}));
W('το παπούτσι','to papútsi','shoe',B(12,6,7,v=>{v.box(0,0,0,11,5,0,WH);v.box(0,0,1,11,5,2,RD);v.box(10,0,2,11,5,2,null);v.box(9,0,1,11,5,1,WH);v.box(0,0,3,5,5,5,RD);v.box(1,1,4,4,4,5,0x5a1a1a);v.box(6,1,3,8,4,3,RD);v.box(6,1,3,6,4,3,WH);v.box(8,1,3,8,4,3,WH);v.box(2,0,2,4,0,2,WH);v.box(2,5,2,4,5,2,WH)}));
W('η ομπρέλα','i ombréla','umbrella',B(15,15,14,v=>{v.cyl(7,7,0,0,2,GY);v.box(7,7,0,7,7,11,BR);v.cyl(7,7,9,12,z=>[7,6,4.4,2][z-9],(x,y)=>(Math.floor((Math.atan2(y-7,x-7)+Math.PI)/(TAU/8))&1)?BLUE:WH);v.set(7,7,13,RD)}));

// ---- 8 Hephaestus: crafted things
W('το σφυρί','to sfirí','hammer',B(12,7,15,v=>{v.box(5,3,0,6,4,10,BR);v.box(4,2,0,7,5,0,DB);v.box(1,2,10,10,5,13,0x7a828c);v.box(9,2,10,10,5,11,null);v.box(1,2,10,1,5,13,0xaab2bc);v.box(5,3,14,6,4,14,BR)}));
W('το σπαθί','to spathí','sword',B(11,9,19,v=>{v.ell(5,4,0,5,4,3.4,pick(GREY3,20));v.box(4,4,3,6,5,13,(x,y,z)=>x===5?0xeef3f8:0xc5cdd5);v.box(2,3,14,8,6,14,GD);v.box(5,4,15,5,5,16,DB);v.box(4,4,15,6,5,16,DB);v.box(4,3,17,6,6,17,GD);v.set(5,4,18,RD)}));
W('η ασπίδα','i aspída','shield',B(13,5,14,v=>{v.box(4,0,0,8,4,0,BR);v.plate(1,3,(x,z)=>{const d=Math.hypot(x-6,z-7);if(d>6.2||z<1)return null;if(d>5)return 0xb07a2a;if(z>=4&&z<=10&&Math.abs(x-6)===Math.round((10-z)/2))return GD;return RD})}));
W('το στέμμα','to stéma','crown',B(9,9,8,v=>{v.ring(4,4,0,3,2.8,4.2,GD);v.cyl(4,4,1,3,2.6,0x8a1a2e);for(let k=0;k<8;k++){const a=k*TAU/8,x=4+Math.cos(a)*3.6,y=4+Math.sin(a)*3.6;v.set(x,y,4,GD);if(k%2===0){v.set(x,y,5,GD);v.set(x,y,6,k%4?BLUE:RD)}}
  v.set(8,4,1,RD);v.set(0,4,1,BLUE);v.set(4,8,1,GN);v.set(4,0,1,RD)}));
W('ο αμφορέας','o amforéas','amphora',B(11,9,15,v=>{v.cyl(5,4,0,13,z=>[1.6,2.4,3.2,3.8,4,4,3.7,3.2,2.5,1.8,1.4,1.4,1.8,2.3][z],(x,y,z)=>z===6||z===4?0x2b2420:(z===5?(((x+y)&1)?0x2b2420:TERRA):TERRA));
  v.box(2,4,9,2,4,12,TERRA);v.box(8,4,9,8,4,12,TERRA);v.set(3,4,12,TERRA);v.set(7,4,12,TERRA);v.set(3,4,9,TERRA);v.set(7,4,9,TERRA);v.set(5,4,13,BK)}));
W('η κιθάρα','i kithára','guitar',B(9,5,17,v=>{v.plate(1,3,(x,z)=>{if(Math.hypot(x-4,z-6.5)<1.1)return BK;if(Math.hypot(x-4,z-3.5)<=3.7||Math.hypot(x-4,z-8)<=2.8)return z===2&&x>=3&&x<=5?DB:0xc9843a;if(z>=10&&z<=14&&x===4)return DB;if(z>=15&&x>=3&&x<=5)return DB;return null});
  v.set(2,2,15,WH);v.set(6,2,15,WH);v.set(2,2,16,WH);v.set(6,2,16,WH)}));
W('το κουδούνι','to kudúni','bell',B(13,7,14,v=>{v.box(0,3,0,0,3,12,BR);v.box(12,3,0,12,3,12,BR);v.box(0,3,13,12,3,13,BR);v.box(0,2,0,0,4,0,DB);v.box(12,2,0,12,4,0,DB);v.cyl(6,3,4,10,z=>[3.4,3,2.6,2.4,2.2,1.8,1.2][z-4],pick([0xc9942a,0xb8841e,0xd9a43a],21));v.box(6,3,11,6,3,12,DB);v.set(6,3,3,0x555555)}));
W('το νόμισμα','to nómisma','coin',B(11,5,13,v=>{v.box(3,0,0,7,4,0,GY);v.plate(1,3,(x,z)=>{const d=Math.hypot(x-5,z-6.5);if(d>5.4||z<1)return null;if(d>4.3)return 0xc99a1a;if(Math.abs(x-5)+Math.abs(z-6.5)<=2)return 0xa87a10;return GD})}));
W('το κερί','to kerí','candle',B(9,9,13,v=>{const c=0x8a6a2a;v.cyl(4,4,0,0,4,c);v.ring(4,4,1,1,3,4,c);v.box(8,4,1,8,4,2,c);v.cyl(4,4,1,8,1.6,CREAM);v.set(6,4,6,CREAM);v.set(6,4,5,CREAM);v.set(4,4,9,BK);v.set(4,4,10,YL);for(const[x,y]of[[5,4],[3,4],[4,3],[4,5]])v.set(x,y,10,OR);v.set(4,4,11,OR);v.set(4,4,12,RD)}));
W('το δώρο','to dóro','gift',B(10,10,12,v=>{v.box(0,0,0,9,9,7,(x,y)=>(x===4||x===5||y===4||y===5)?GD:RD);v.ell(2.5,4.5,9,2.2,1.5,1.5,GD);v.ell(6.5,4.5,9,2.2,1.5,1.5,GD);v.box(4,4,8,5,5,9,0xc99a1a)}));

// ---- 9 Pythagoras: numbers
[['ένα','éna','one'],['δύο','dío','two'],['τρία','tría','three'],['τέσσερα','tésera','four'],['πέντε','pénde','five'],['έξι','éxi','six'],['επτά','eptá','seven'],['οκτώ','októ','eight'],['εννέα','enéa','nine'],['δέκα','déka','ten']].forEach((w,i)=>W(w[0],w[1],w[2],number(i+1)));

console.assert(WD.length===100,'need 100 words, have '+WD.length);
console.assert(new Set(WD.map(w=>w.el)).size===100&&new Set(WD.map(w=>w.en)).size===100,'words must be unique');
console.assert(new Set(WD.map(w=>w.m.sig)).size===100,'every word needs its own sprite');
console.assert(WD.every(w=>w.m.n>20),'empty sprite');
