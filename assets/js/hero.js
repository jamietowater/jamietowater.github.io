/* PARTICLES */
const heroCanvas=document.getElementById('hero-canvas');
const heroCtx=heroCanvas.getContext('2d');

let heroW=0,heroH=0,heroDpr=1;
let heroRotY=0,heroRotX=0,heroLastTs=0;
let printHeadY=-100;
let modelMinY=-100,modelMaxY=100;

const heroPts=[];
const heroStars=[];

function heroRand(min,max){return min+Math.random()*(max-min);}

function heroColor(){
  const c=[
    [102,231,255],
    [122,184,255],
    [155,242,255],
    [103,240,212]
  ][Math.floor(Math.random()*4)];
  const drift=heroRand(-18,18);
  return `rgb(${Math.max(0,Math.min(255,Math.round(c[0]+drift)))},${Math.max(0,Math.min(255,Math.round(c[1]+drift)))},${Math.max(0,Math.min(255,Math.round(c[2]+drift)))})`;
}

function addEllipsoid(cx,cy,cz,rx,ry,rz,count){
  for(let i=0;i<count;i++){
    const u=Math.random()*Math.PI*2;
    const v=Math.acos(2*Math.random()-1)-Math.PI/2;
    heroPts.push({
      x:cx+rx*Math.cos(v)*Math.cos(u),
      y:cy+ry*Math.sin(v),
      z:cz+rz*Math.cos(v)*Math.sin(u),
      color:heroColor(),
      size:heroRand(0.9,1.9),
      drop:heroRand(20,65),
      a:0,
      printed:false,
    });
  }
}

function addCylinder(cx,cy,cz,rx,rz,h,count){
  for(let i=0;i<count;i++){
    const a=Math.random()*Math.PI*2;
    const y=cy+heroRand(-h/2,h/2);
    heroPts.push({
      x:cx+Math.cos(a)*rx,
      y,
      z:cz+Math.sin(a)*rz,
      color:heroColor(),
      size:heroRand(0.85,1.75),
      drop:heroRand(18,58),
      a:0,
      printed:false,
    });
  }
}

function buildHeroModel(){
  heroPts.length=0;

  // Companion-bot silhouette: body, head, ears, paws, harness, tail.
  addEllipsoid(0,18,0,74,42,44,760);
  addEllipsoid(0,-36,14,44,34,34,560);
  addEllipsoid(0,-28,46,16,12,14,140);
  addEllipsoid(-39,-48,7,11,26,9,190);
  addEllipsoid(39,-48,7,11,26,9,190);

  addCylinder(-34,53,24,12,11,34,210);
  addCylinder(34,53,24,12,11,34,210);
  addCylinder(-34,53,-20,11,10,32,190);
  addCylinder(34,53,-20,11,10,32,190);

  addEllipsoid(-34,70,25,14,8,14,120);
  addEllipsoid(34,70,25,14,8,14,120);

  addCylinder(0,24,43,20,7,22,190);
  addCylinder(0,26,50,12,5,18,120);
  addCylinder(57,28,-31,7,7,34,120);

  modelMinY=Infinity;
  modelMaxY=-Infinity;
  heroPts.forEach(p=>{
    if(p.y<modelMinY)modelMinY=p.y;
    if(p.y>modelMaxY)modelMaxY=p.y;
  });
  printHeadY=modelMinY-16;
}

function resetHeroPrint(){
  printHeadY=modelMinY-16;
  heroPts.forEach(p=>{p.printed=false;p.a=0;});
}

function heroResize(){
  heroW=window.innerWidth;
  heroH=window.innerHeight;
  heroDpr=Math.max(1,window.devicePixelRatio||1);

  heroCanvas.width=Math.floor(heroW*heroDpr);
  heroCanvas.height=Math.floor(heroH*heroDpr);
  heroCanvas.style.width=heroW+'px';
  heroCanvas.style.height=heroH+'px';
  heroCtx.setTransform(heroDpr,0,0,heroDpr,0,0);

  heroStars.length=0;
  const starN=Math.floor(heroW*heroH/23000);
  for(let i=0;i<starN;i++){
    heroStars.push({
      x:Math.random()*heroW,
      y:Math.random()*heroH,
      r:heroRand(0.35,1.2),
      o:heroRand(0.06,0.24),
      p:Math.random()*Math.PI*2,
    });
  }

  buildHeroModel();
}

function heroProject(x,y,z,cx,cy){
  const cyaw=Math.cos(heroRotY),syaw=Math.sin(heroRotY);
  const x1=x*cyaw+z*syaw;
  const z1=-x*syaw+z*cyaw;
  const cp=Math.cos(heroRotX),sp=Math.sin(heroRotX);
  const y2=y*cp-z1*sp;
  const z2=y*sp+z1*cp;
  const persp=620;
  const s=persp/(persp-z2);
  return{sx:cx+x1*s,sy:cy+y2*s,z:z2,s};
}

function heroFrame(ts){
  if(!heroLastTs)heroLastTs=ts;
  const dt=Math.min(ts-heroLastTs,50);
  heroLastTs=ts;

  heroCtx.clearRect(0,0,heroW,heroH);

  heroRotY+=dt*0.0005;
  heroRotX=0.17+Math.sin(ts*0.00042)*0.07;

  heroStars.forEach(s=>{
    const pulse=0.82+0.18*Math.sin(ts*0.0012+s.p);
    heroCtx.beginPath();
    heroCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
    heroCtx.fillStyle=`rgba(122,184,255,${(s.o*pulse).toFixed(3)})`;
    heroCtx.fill();
  });

  if(printHeadY<modelMaxY+18)printHeadY+=dt*0.055;

  const anchorX=heroW<960?heroW*0.5:heroW*0.74;
  const anchorY=heroH*0.58;

  const rendered=[];
  for(let i=0;i<heroPts.length;i++){
    const p=heroPts[i];
    if(!p.printed&&p.y<=printHeadY)p.printed=true;
    if(!p.printed)continue;

    p.a=Math.min(1,p.a+0.055);
    const py=p.y-(1-p.a)*p.drop;
    const q=heroProject(p.x,py,p.z,anchorX,anchorY);
    rendered.push({q,p});
  }

  rendered.sort((a,b)=>a.q.z-b.q.z);

  for(let i=0;i<rendered.length;i++){
    const{q,p}=rendered[i];
    const depth=Math.max(0.22,Math.min(1,(q.z+180)/360));
    heroCtx.beginPath();
    heroCtx.arc(q.sx,q.sy,p.size*q.s*(0.74+0.36*depth),0,Math.PI*2);
    heroCtx.fillStyle=p.color.replace('rgb','rgba').replace(')',`,`+((0.2+0.75*depth)*p.a).toFixed(3)+`)`);
    heroCtx.fill();
  }

  // Scan line glow for the print-head pass.
  if(printHeadY<modelMaxY+22){
    const ph=heroProject(0,printHeadY,0,anchorX,anchorY);
    const g=heroCtx.createLinearGradient(anchorX-200,ph.sy,anchorX+200,ph.sy);
    g.addColorStop(0,'rgba(102,231,255,0)');
    g.addColorStop(0.5,'rgba(102,231,255,0.26)');
    g.addColorStop(1,'rgba(102,231,255,0)');
    heroCtx.strokeStyle=g;
    heroCtx.lineWidth=2;
    heroCtx.beginPath();
    heroCtx.moveTo(anchorX-200,ph.sy);
    heroCtx.lineTo(anchorX+200,ph.sy);
    heroCtx.stroke();
  }

  requestAnimationFrame(heroFrame);
}

window.addEventListener('resize',()=>{heroResize();resetHeroPrint();},{passive:true});
heroResize();
resetHeroPrint();
requestAnimationFrame(heroFrame);
