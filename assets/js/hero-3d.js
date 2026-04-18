/* ── 3D Text & UFO Renderers ── */

const H3D_PERSP=900;
let h3dRotX=0.15,h3dRotY=0.3;
let h3dDragging=false,h3dLastX=0,h3dLastY=0;
let h3dVX=0,h3dVY=0;

function h3dRotPt(ox,oy,oz){
  const cy=Math.cos(h3dRotY),sy=Math.sin(h3dRotY);
  const x1=ox*cy+oz*sy,z1=-ox*sy+oz*cy;
  const cx=Math.cos(h3dRotX),sx=Math.sin(h3dRotX);
  return{x:x1,y:oy*cx-z1*sx,z:oy*sx+z1*cx};
}

function h3dProject(ox,oy,oz,cw,ch){
  const{x,y,z}=h3dRotPt(ox,oy,oz);
  const s=H3D_PERSP/(H3D_PERSP+z);
  return{sx:cw/2+x*s,sy:ch/2+y*s,z,s};
}

function h3dDepthFade(z){
  const maxZ=600;
  return Math.max(0.3,Math.min(1,(z+maxZ)/(2*maxZ)));
}

/* ── 3D TEXT: TOWATER ── */
const h3dTextMeta={
  T:{x:0,y:0,z:0},
  o:{x:80,y:0,z:0},
  w:{x:160,y:0,z:0},
  a:{x:240,y:0,z:0},
  t:{x:320,y:0,z:0},
  e:{x:400,y:0,z:0},
  r:{x:480,y:0,z:0},
};

function h3dRenderText(){
  const wrap=document.getElementById('hero-3d-towater');
  if(!wrap)return;
  wrap.innerHTML='';
  const cw=wrap.offsetWidth||340,ch=wrap.offsetHeight||160;
  
  Object.entries(h3dTextMeta).forEach(([char,pos])=>{
    const proj=h3dProject(pos.x-240,pos.y,pos.z,cw,ch);
    const depth=h3dDepthFade(proj.z);
    const fontSize=Math.max(48,Math.min(96,cw*0.22));
    const div=document.createElement('div');
    div.style.position='absolute';
    div.style.left=proj.sx+'px';
    div.style.top=proj.sy+'px';
    div.style.transform=`translate(-50%,-50%) scale(${depth})`;
    div.style.fontFamily='var(--font-d)';
    div.style.fontSize=fontSize+'px';
    div.style.fontWeight='800';
    div.style.lineHeight='0.9';
    div.style.color='transparent';
    div.style.webkitTextStroke='1.5px rgba(102,231,255,'+(0.5+0.5*depth).toFixed(2)+')';
    div.style.opacity=depth.toFixed(2);
    div.style.letterSpacing='-0.02em';
    div.style.userSelect='none';
    div.textContent=char;
    wrap.appendChild(div);
  });
}

function h3dInitText(){
  const wrap=document.getElementById('hero-3d-towater');
  if(!wrap)return;
  wrap.style.position='relative';
  wrap.style.cursor='grab';
  wrap.addEventListener('mousedown',e=>{
    h3dDragging=true;
    h3dLastX=e.clientX;
    h3dLastY=e.clientY;
    h3dVX=0;h3dVY=0;
    wrap.style.cursor='grabbing';
  });
  window.addEventListener('mousemove',e=>{
    if(!h3dDragging)return;
    const dx=(e.clientX-h3dLastX)*0.006;
    const dy=(e.clientY-h3dLastY)*0.006;
    h3dRotY+=dx;h3dRotX+=dy;
    h3dRotX=Math.max(-Math.PI/2.5,Math.min(Math.PI/2.5,h3dRotX));
    h3dVX=dx;h3dVY=dy;
    h3dLastX=e.clientX;h3dLastY=e.clientY;
    h3dRenderText();
  });
  window.addEventListener('mouseup',()=>{h3dDragging=false;wrap.style.cursor='grab'});
  
  function h3dTextFrame(){
    if(!h3dDragging){
      h3dVX*=0.92;h3dVY*=0.92;
      h3dRotY+=h3dVX;h3dRotX+=h3dVY;
      if(Math.abs(h3dVX)>0.0001||Math.abs(h3dVY)>0.0001)h3dRenderText();
    }
    requestAnimationFrame(h3dTextFrame);
  }
  h3dRenderText();
  h3dTextFrame();
}

/* ── 3D UFO RENDERER ── */
let h3dUfoRotX=0.25,h3dUfoRotY=0,h3dUfoElapsed=0;

function h3dRenderUFO(){
  const wrap=document.getElementById('hero-ufo');
  if(!wrap)return;
  wrap.innerHTML='';
  const cw=wrap.offsetWidth||300,ch=wrap.offsetHeight||140;
  
  const ufoPoints=[
    {x:-140,y:-12,z:-20,r:9,c:'rgba(102,231,255,0.95)'},
    {x:-70,y:-16,z:-30,r:7,c:'rgba(102,231,255,0.9)'},
    {x:0,y:-20,z:-40,r:12,c:'rgba(200,255,255,1)'},
    {x:70,y:-16,z:-30,r:7,c:'rgba(102,231,255,0.9)'},
    {x:140,y:-12,z:-20,r:9,c:'rgba(102,231,255,0.95)'},
    {x:-120,y:0,z:-60,r:14,c:'rgba(255,150,80,0.8)'},
    {x:0,y:0,z:-100,r:18,c:'rgba(255,180,100,0.7)'},
    {x:120,y:0,z:-60,r:14,c:'rgba(255,150,80,0.8)'},
    {x:-100,y:16,z:0,r:11,c:'rgba(102,231,255,0.75)'},
    {x:0,y:18,z:0,r:13,c:'rgba(102,231,255,0.8)'},
    {x:100,y:16,z:0,r:11,c:'rgba(102,231,255,0.75)'},
  ];
  
  ufoPoints.forEach(pt=>{
    const proj=h3dProject(pt.x,pt.y,pt.z,cw,ch);
    const depth=h3dDepthFade(proj.z);
    const r=pt.r*depth;
    const div=document.createElement('div');
    div.style.position='absolute';
    div.style.left=proj.sx+'px';
    div.style.top=proj.sy+'px';
    div.style.width=r*2+'px';
    div.style.height=r*2+'px';
    div.style.borderRadius='50%';
    div.style.background=pt.c;
    div.style.transform=`translate(-50%,-50%)`;
    div.style.boxShadow=`0 0 ${Math.max(4,r*0.8)}px ${pt.c},inset 0 0 ${r*0.3}px rgba(255,255,255,0.4)`;
    div.style.opacity=depth.toFixed(2);
    wrap.appendChild(div);
  });
  
  const ufoOutline=document.createElement('svg');
  ufoOutline.style.position='absolute';
  ufoOutline.style.inset='0';
  ufoOutline.style.width='100%';
  ufoOutline.style.height='100%';
  ufoOutline.style.pointerEvents='none';
  
  const pts=[-120,-60,0,60,120].map(x=>{
    const proj=h3dProject(x,-8,0,cw,ch);
    return proj.sx+','+proj.sy;
  }).join(' ');
  
  ufoOutline.innerHTML=`<svg viewBox="0 0 ${cw} ${ch}" style="width:100%;height:100%;position:absolute;inset:0">
    <polyline points="${pts}" fill="none" stroke="rgba(102,231,255,0.4)" stroke-width="1" opacity="0.7"/>
  </svg>`;
  wrap.appendChild(ufoOutline);
}

function h3dInitUFO(){
  const wrap=document.getElementById('hero-ufo');
  if(!wrap)return;
  wrap.style.position='relative';
  
  function h3dUfoFrame(ts){
    h3dUfoElapsed+=ts*0.5;
    h3dUfoRotY+=0.008;
    h3dUfoRotX=0.2+0.08*Math.sin(h3dUfoElapsed*0.0012);
    h3dRenderUFO();
    requestAnimationFrame(h3dUfoFrame);
  }
  h3dRenderUFO();
  requestAnimationFrame(h3dUfoFrame);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>{h3dInitText();h3dInitUFO();});
}else{
  h3dInitText();
  h3dInitUFO();
}
