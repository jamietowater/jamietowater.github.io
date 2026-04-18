/* ── SPHERE: 2D projection, no CSS preserve-3d ── */
const SPH_R=155, SPH_PERSP=750;
const sphWrap=document.getElementById('sph-wrap');
const sphCanvas=document.getElementById('sph-canvas');
const sphCtx=sphCanvas.getContext('2d');
const sphLabels=document.getElementById('sph-labels');
let sphW,sphH,sphCX,sphCY;
let sphScale=1;

function sphResize(){
  sphW=sphWrap.offsetWidth||480; sphH=sphWrap.offsetHeight||480;
  sphCanvas.width=sphW; sphCanvas.height=sphH;
  sphCX=sphW/2; sphCY=sphH/2;
  const targetR=Math.min(155,Math.min(sphW,sphH)*0.34);
  sphScale=Math.max(0.6,targetR/SPH_R);
}
sphResize();
window.addEventListener('resize',sphResize,{passive:true});

const TILE_INFO={
  'Jamie Towater': {desc:'Senior Developer, aspiring data engineer, inventor, and systems thinker based in Nashville, Tennessee.',tag:'Identity'},
  'Data Engineering': {desc:'The center of gravity in my career: reliable pipelines, scalable design, clean transformations, and practical delivery.',tag:'Career'},
  'SQL Server': {desc:'Core platform for most of my career — administration, tuning, automation, modeling, and production support across multiple versions.',tag:'Database'},
  'Snowflake': {desc:'Cloud analytics platform where I focused on performance-minded design and real cost reduction through smarter modeling.',tag:''},
  'dbt': {desc:'Transformation framework used to organize logic more cleanly, reduce waste, and make data work easier to reason about.',tag:'Transformation'},
  'AWS': {desc:'The cloud layer for my lakehouse thinking: S3, Glue, Athena, DMS, and the patterns needed to move data there well.',tag:'Cloud'},
  'Iceberg': {desc:'A strong fit for large analytical tables when you want open-table semantics, incremental loads, and ACID-friendly behavior on object storage.',tag:'Lakehouse'},
  'Python': {desc:'Used for automation, data processing, helper scripts, and turning ideas into working tools faster than boilerplate-heavy alternatives.',tag:'Dev'},
  'Parquet': {desc:'Columnar format I repeatedly come back to for moving SQL data efficiently into cloud storage and analytics workflows.',tag:'Data Format'},
  'S3': {desc:'Durable cloud storage layer for raw and curated data, prototypes, exports, and future-facing lakehouse patterns.',tag:'Cloud'},
  'Glue': {desc:'Serverless metadata and ETL layer that fits well when the goal is simple, scalable orchestration without overbuilding.',tag:'Cloud'},
  'Athena': {desc:'Query layer for exploring S3-backed datasets and validating lakehouse patterns without standing up more infrastructure than necessary.',tag:'Analytics'},
  'DMS': {desc:'Useful for incremental movement and CDC strategies when modernizing legacy data sources into AWS.',tag:'Migration'},
  'Power BI': {desc:'Operational reporting and visualization layer for turning data work into something people can actually consume.',tag:'BI'},
  'Documentation': {desc:'A real strength: markdown docs, architecture notes, POCs, and technical explanations that make complex work usable by others.',tag:'Delivery'},
  'VERA': {desc:'My most ambitious product concept: an accessibility-forward nail-care device designed around a nail-only interface, cleaner outcomes, and differentiated safety.',tag:'Inventor'},
  'Inclusive Design': {desc:'VERA is being shaped around independence, dignity, and safer self-care — especially for people with visual, dexterity, neuropathy, or age-related challenges.',tag:'Mission'},
  'Safety Layers': {desc:'The heart of VERA: multiple independent protections that reduce the chance of soft-tissue contact and unsafe user behavior.',tag:'Safety'},
  'Magnetic Cartridge': {desc:'A self-aligning cartridge idea that reduces pinch-force complexity, simplifies insertion, and can double as presence sensing.',tag:'Accessibility'},
  'Haptic Guidance': {desc:'Distinct vibration patterns can help a user find the right position, confirm alignment, and know when a pass is complete — even without looking.',tag:'Accessibility'},
  'Capacitive Auto-Stop': {desc:'A future sensing layer intended to distinguish nail from nearby skin and kill the motor when the wrong material reaches the wrong zone.',tag:'Safety'},
  'Self-Healing Membrane': {desc:'A forward-looking membrane concept: medical silicone now, but potentially self-healing elastomers later to extend cartridge life.',tag:'Materials'},
  'Infinity Drum': {desc:'A DLC-coated stainless drum concept — hard, biocompatible, and durable enough to become an “infinity” wear surface instead of a disposable abrasive.',tag:'Materials'},
  'Sealed Cartridge': {desc:'A strong differentiator for VERA — containment, serviceability, cleanliness, and replaceable working elements all in one directionally strong concept.',tag:'Product'},
  'Finished Edge Polish': {desc:'Potentially the most marketable part of VERA: not just trimming, but a repeatable polished finish people can see and feel immediately.',tag:'Experience'},
  'Copilot': {desc:'Used to accelerate SQL, code scaffolding, tests, and documentation while keeping human judgment in the driver’s seat.',tag:'Tooling'},
  'Cursor': {desc:'A strong complement to Copilot for broader codebase reasoning, rewriting, and moving faster through large technical tasks.',tag:'Tooling'},
  'VS Code': {desc:'My main working environment for SQL, Python, docs, architecture sketches, and modern development workflows.',tag:'Tooling'},
  'Architecture POCs': {desc:'I like turning abstract architecture debates into something concrete enough to evaluate with tradeoffs, diagrams, and implementation paths.',tag:'Strategy'},
  'VERA Lab VR': {desc:'A Unity-based virtual lab where people can inspect VERA, watch the mechanism, compare variants, and understand the idea spatially instead of through flat slides.',tag:'Spatial Demo'},
  'Career Direction': {desc:'I’m moving toward senior data engineering roles — Amazon-caliber if the fit is right — where scale, ownership, stability, and builder judgment matter.',tag:'Career'},
  'Healthcare Data': {desc:'The domain context behind most of my enterprise experience — high-stakes data where reliability and correctness matter.',tag:'Domain'},
  'Prototype Lab': {desc:'3D prints, fixtures, BOMs, magnets, O-rings, and fast iteration loops that turn abstract safety ideas into physical tradeoffs.',tag:'Prototype'},
  'Zen Bones': {desc:'My YouTube channel focused on Alan Watts, Taoism, Zen, consciousness, and the kinds of ideas that make people think more deeply.',tag:'Media'},
  'Alan Watts': {desc:'A recurring voice on Zen Bones and a major influence on how I think about ego, perspective, and the illusion of separateness.',tag:'Philosophy'},
  'Taoism': {desc:'A thread that balances striving with flow — useful not just philosophically, but in how I approach systems and life.',tag:'Philosophy'},
  'Zen': {desc:'Directness, clarity, and stripping away what is unnecessary. A surprisingly good lens for engineering too.',tag:'Philosophy'},
  'Consciousness': {desc:'One of the deeper themes behind Zen Bones: identity, awareness, selfhood, and what is actually going on underneath experience.',tag:'Ideas'},
  'Clarity': {desc:'The Zen Bones side of me shows up here too: strip away noise, keep what works, and let form follow understanding.',tag:'Philosophy'},
  'Nashville, TN': {desc:'Home base for both my enterprise technology work and the projects I’m building outside of it.',tag:'Location'},
};

/* Ring definitions — lat/lon grid */
const RING_DEFS=[
  {phi:0, labels:["Jamie Towater"]},
  {phi:Math.PI/6, labels:["Data Engineering", "SQL Server", "Snowflake", "dbt", "AWS", "Iceberg"]},
  {phi:Math.PI/3, labels:["Python", "Parquet", "S3", "Glue", "Athena", "DMS", "Power BI", "Documentation"]},
  {phi:Math.PI/2, labels:["VERA", "Inclusive Design", "Safety Layers", "Magnetic Cartridge", "Haptic Guidance", "Capacitive Auto-Stop", "Self-Healing Membrane", "Infinity Drum", "Sealed Cartridge", "Finished Edge Polish"]},
  {phi:Math.PI*2/3, labels:["Copilot", "Cursor", "VS Code", "Architecture POCs", "VERA Lab VR", "Career Direction", "Healthcare Data", "Prototype Lab"]},
  {phi:Math.PI*5/6, labels:["Zen Bones", "Alan Watts", "Taoism", "Zen", "Consciousness", "Clarity"]},
  {phi:Math.PI, labels:["Nashville, TN"]},
];

/* Build nodes and edge lists */
const sphNodes=[], sphEdges=[];
RING_DEFS.forEach(({phi,labels},ri)=>{
  const count=labels.length;
  const rStart=sphNodes.length;
  labels.forEach((txt,j)=>{
    const tOff=(ri%2===1&&count>1)?(Math.PI/count):0;
    const theta=count===1?0:(j/count)*Math.PI*2+tOff;
    const ox=SPH_R*Math.sin(phi)*Math.cos(theta);
    const oy=-SPH_R*Math.cos(phi);
    const oz=SPH_R*Math.sin(phi)*Math.sin(theta);
    /* Tile div */
    const div=document.createElement('div');
    div.className='sph-tile';
    div.textContent=txt;
    div.addEventListener('mousedown',e=>{
      e.stopPropagation();e.preventDefault();
      dragging=false;
      const {sx,sy}=sphProject(ox,oy,oz);
      const wr=sphWrap.getBoundingClientRect();
      showSphPopup(txt, wr.left+sx, wr.top+sy);
    });
    sphLabels.appendChild(div);
    sphNodes.push({ox,oy,oz,phi,theta,div,txt});
  });
  /* Latitude ring edges */
  if(count>1) for(let j=0;j<count;j++) sphEdges.push([rStart+j,rStart+(j+1)%count]);
  /* Meridian edges to previous ring */
  if(ri>0){
    const c1=RING_DEFS[ri-1].labels.length;
    const r1=rStart-c1;
    const used=new Set();
    const addE=(a,b)=>{const k=Math.min(a,b)+','+Math.max(a,b);if(!used.has(k)){used.add(k);sphEdges.push([a,b]);}};
    if(c1===1){for(let j=0;j<count;j++)addE(r1,rStart+j);}
    else if(count===1){for(let j=0;j<c1;j++)addE(r1+j,rStart);}
    else{
      for(let j=0;j<count;j++){
        const ta=sphNodes[rStart+j].theta;
        let best=0,bd=Infinity;
        for(let k=0;k<c1;k++){let d=Math.abs(ta-sphNodes[r1+k].theta);if(d>Math.PI)d=2*Math.PI-d;if(d<bd){bd=d;best=k;}}
        addE(rStart+j,r1+best);
      }
      for(let k=0;k<c1;k++){
        const ta=sphNodes[r1+k].theta;
        let best=0,bd=Infinity;
        for(let j=0;j<count;j++){let d=Math.abs(ta-sphNodes[rStart+j].theta);if(d>Math.PI)d=2*Math.PI-d;if(d<bd){bd=d;best=j;}}
        addE(r1+k,rStart+best);
      }
    }
  }
});

/* Rotation state */
let sphRotX=0.22,sphRotY=0,sphVX=0,sphVY=0;
let dragging=false,lastMx=0,lastMy=0;
let hovering=false,sphLastT=null,sphElapsed=0;
const SPH_AUTO=0.00062;

function sphRotPt(ox,oy,oz){
  const cy=Math.cos(sphRotY),sy=Math.sin(sphRotY);
  const x1=ox*cy+oz*sy,z1=-ox*sy+oz*cy;
  const cx=Math.cos(sphRotX),sx=Math.sin(sphRotX);
  return{x:x1,y:oy*cx-z1*sx,z:oy*sx+z1*cx};
}

function sphProject(ox,oy,oz){
  const{x,y,z}=sphRotPt(ox*sphScale,oy*sphScale,oz*sphScale);
  const s=SPH_PERSP/(SPH_PERSP-z);
  return{sx:sphCX+x*s,sy:sphCY+y*s,z,s};
}

function sphFrame(ts){
  if(!sphLastT)sphLastT=ts;
  const dt=Math.min(ts-sphLastT,50);
  sphLastT=ts;sphElapsed+=dt;
  if(!dragging){
    if(!hovering){
      sphRotY+=SPH_AUTO*dt*(1+0.18*Math.sin(sphElapsed*0.00027));
      sphRotX=0.22+0.11*Math.sin(sphElapsed*0.00041);
    }
    sphVX*=0.96;sphVY*=0.96;
    sphRotX+=sphVX;sphRotY+=sphVY;
    sphRotX=Math.max(-Math.PI/2.2,Math.min(Math.PI/2.2,sphRotX));
  }

  /* Project all nodes */
  const proj=sphNodes.map((n,i)=>({i,...sphProject(n.ox,n.oy,n.oz),n}));

  /* Draw mesh on canvas */
  sphCtx.clearRect(0,0,sphW,sphH);
  sphEdges.forEach(([a,b])=>{
    const pa=proj[a],pb=proj[b];
    const t=((pa.z+pb.z)/2+SPH_R)/(2*SPH_R);
    sphCtx.beginPath();
    sphCtx.moveTo(pa.sx,pa.sy);
    sphCtx.lineTo(pb.sx,pb.sy);
    sphCtx.strokeStyle=`rgba(102,231,255,${(0.1+0.2*t).toFixed(2)})`;
    sphCtx.lineWidth=0.8;
    sphCtx.stroke();
  });

  /* Position tile divs */
  proj.forEach(({sx,sy,z,s,n})=>{
    const depth=(z+SPH_R)/(2*SPH_R); // 0=back, 1=front
    /* Tangent rotation — makes tiles appear to lie on sphere surface */
    const{x:tx,y:ty}=sphRotPt(
      -Math.sin(n.theta)*Math.sin(n.phi),
      0,
      Math.cos(n.theta)*Math.sin(n.phi)
    );
    /* Normalize so text never renders upside-down */
    let angle=Math.atan2(ty,tx);
    if(angle>Math.PI/2)angle-=Math.PI;
    else if(angle<-Math.PI/2)angle+=Math.PI;
    const fs=Math.round(7.5+3.5*depth);
    const op=depth<0.06?0:(0.28+0.72*depth);
    n.div.style.left=sx+'px';
    n.div.style.top=sy+'px';
    n.div.style.transform=`translate(-50%,-50%) rotate(${angle.toFixed(3)}rad)`;
    n.div.style.fontSize=fs+'px';
    n.div.style.opacity=op.toFixed(2);
    n.div.style.zIndex=Math.round(depth*100);
    n.div.style.pointerEvents=depth<0.08?'none':'auto';
  });

  requestAnimationFrame(sphFrame);
}
requestAnimationFrame(sphFrame);

/* Drag handlers */
sphWrap.addEventListener('mousedown',e=>{dragging=true;lastMx=e.clientX;lastMy=e.clientY;sphVX=0;sphVY=0;e.preventDefault();});
window.addEventListener('mousemove',e=>{
  if(!dragging)return;
  const dx=e.clientX-lastMx,dy=e.clientY-lastMy;
  sphVY=dx*0.009;sphVX=dy*0.009;
  sphRotY+=sphVY;sphRotX+=sphVX;
  sphRotX=Math.max(-Math.PI/2.2,Math.min(Math.PI/2.2,sphRotX));
  lastMx=e.clientX;lastMy=e.clientY;
});
sphWrap.addEventListener('mouseenter',()=>{hovering=true;});
sphWrap.addEventListener('mouseleave',()=>{hovering=false;sphLastT=null;});

/* ── POPUP: position:fixed, rAF-animated SVG lines ── */
let _praf=null;
function showSphPopup(txt,dotVX,dotVY){
  if(_praf){cancelAnimationFrame(_praf);_praf=null;}
  const info=TILE_INFO[txt]||{desc:'No description yet.'};
  const popup=document.getElementById('sph-popup');
  const svg=document.getElementById('sph-svg');
  document.getElementById('sph-popup-title').textContent=txt;
  document.getElementById('sph-popup-desc').textContent=info.desc;
  document.getElementById('sph-popup-tag').textContent=info.tag||'';
  const imgWrap=document.getElementById('sph-popup-img');
  const placeholder=document.getElementById('sph-popup-placeholder');
  if(info.img){
    placeholder.textContent='Loading…';placeholder.style.display='flex';
    const im=new Image();
    im.onload=()=>{imgWrap.innerHTML=`<img src="${info.img}" alt="${txt}">`;};
    im.onerror=()=>{placeholder.textContent='';placeholder.style.display='none';};
    im.src=info.img;
  } else {placeholder.textContent='';placeholder.style.display='none';}
  /* Measure */
  popup.classList.remove('vis');
  popup.style.visibility='hidden';popup.style.display='block';
  const PW=popup.offsetWidth,PH=popup.offsetHeight;
  popup.style.display='';popup.style.visibility='';
  const VW=window.innerWidth,VH=window.innerHeight;
  const wrapR=sphWrap.getBoundingClientRect().right;
  const GAP=52;
  let lpx=wrapR+GAP,side='right';
  if(lpx+PW>VW-12){lpx=sphWrap.getBoundingClientRect().left-PW-GAP;side='left';}
  lpx=Math.max(12,Math.min(lpx,VW-PW-12));
  let lpy=dotVY-PH/2;
  lpy=Math.max(12,Math.min(lpy,VH-PH-12));
  popup.style.left=lpx+'px';popup.style.top=lpy+'px';
  popup.classList.add('vis');
  /* Animate SVG */
  const ex=side==='right'?lpx:lpx+PW;
  const topY=lpy+16,botY=lpy+PH-16;
  const l1=Math.hypot(ex-dotVX,topY-dotVY);
  const l2=Math.hypot(ex-dotVX,botY-dotVY);
  const perim=2*(PW+PH);
  svg.innerHTML=`
    <circle id="pp-ping" cx="${dotVX.toFixed(1)}" cy="${dotVY.toFixed(1)}" r="4" fill="rgba(102,231,255,.2)" stroke="rgba(102,231,255,.9)" stroke-width="1.5"/>
    <line id="pp-l1" x1="${dotVX.toFixed(1)}" y1="${dotVY.toFixed(1)}" x2="${dotVX.toFixed(1)}" y2="${dotVY.toFixed(1)}" stroke="rgba(102,231,255,.7)" stroke-width="1.3"/>
    <line id="pp-l2" x1="${dotVX.toFixed(1)}" y1="${dotVY.toFixed(1)}" x2="${dotVX.toFixed(1)}" y2="${dotVY.toFixed(1)}" stroke="rgba(102,231,255,.7)" stroke-width="1.3"/>
    <rect id="pp-rect" x="${lpx.toFixed(1)}" y="${lpy.toFixed(1)}" width="${PW}" height="${PH}" rx="10" fill="none" stroke="rgba(102,231,255,.6)" stroke-width="1.2" stroke-dasharray="${perim}" stroke-dashoffset="${perim}"/>`;
  const ping=svg.getElementById('pp-ping');
  const ln1=svg.getElementById('pp-l1');
  const ln2=svg.getElementById('pp-l2');
  const rect=svg.getElementById('pp-rect');
  const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
  const T0=performance.now();
  const TP=700,TL=600,TR=750,DL=200,DR=450;
  function step(now){
    const e=now-T0;
    const tp=Math.min(e/TP,1);
    ping.setAttribute('r',(4+20*ease(tp)).toFixed(1));
    ping.setAttribute('stroke-width',(1.8*(1-ease(tp))).toFixed(2));
    ping.setAttribute('stroke',`rgba(102,231,255,${(1-ease(tp)).toFixed(2)})`);
    const tl=Math.min(Math.max(e-DL,0)/TL,1);
    const el=ease(tl);
    ln1.setAttribute('x2',(dotVX+(ex-dotVX)*el).toFixed(1));
    ln1.setAttribute('y2',(dotVY+(topY-dotVY)*el).toFixed(1));
    ln2.setAttribute('x2',(dotVX+(ex-dotVX)*el).toFixed(1));
    ln2.setAttribute('y2',(dotVY+(botY-dotVY)*el).toFixed(1));
    const tr=Math.min(Math.max(e-DR,0)/TR,1);
    rect.setAttribute('stroke-dashoffset',(perim*(1-ease(tr))).toFixed(1));
    if(tp<1||tl<1||tr<1){_praf=requestAnimationFrame(step);}else{_praf=null;}
  }
  _praf=requestAnimationFrame(step);
}
function hideSphPopup(){
  if(_praf){cancelAnimationFrame(_praf);_praf=null;}
  document.getElementById('sph-popup').classList.remove('vis');
  document.getElementById('sph-svg').innerHTML='';
}
window.addEventListener('mouseup',()=>{dragging=false;hideSphPopup();});
