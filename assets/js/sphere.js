/* ── SPHERE: 2D projection, no CSS preserve-3d ── */
const SPH_R=155, SPH_PERSP=750;
const SPH_SIZE={
  maxRadius:155,
  radiusFactor:0.3,
  minScale:0.42,
};
const sphWrap=document.getElementById('sph-wrap');
const sphCanvas=document.getElementById('sph-canvas');
const sphCtx=sphCanvas.getContext('2d');
const sphLabels=document.getElementById('sph-labels');
const sphExpandBtn=document.getElementById('sph-expand-btn');
const sphCloseBtn=document.getElementById('sph-close-btn');
const sphMobileBackdrop=document.getElementById('sph-mobile-backdrop');
const sphPresetRoot=document.getElementById('sph-presets');
const SPH_PRESET_STORAGE_KEY='sph-feel-preset';
let sphW,sphH,sphCX,sphCY;
let sphScale=1;

function sphComputeScale(width,height){
  const minSide=Math.min(width,height);
  const targetR=Math.min(SPH_SIZE.maxRadius,minSide*SPH_SIZE.radiusFactor);
  return Math.max(SPH_SIZE.minScale,targetR/SPH_R);
}

function sphRenderRadius(){
  return SPH_R*sphScale;
}

function sphResize(){
  sphW=sphWrap.offsetWidth||480; sphH=sphWrap.offsetHeight||480;
  sphCanvas.width=sphW; sphCanvas.height=sphH;
  sphCX=sphW/2; sphCY=sphH/2;
  sphScale=sphComputeScale(sphW,sphH);
}
sphResize();
window.addEventListener('resize',sphResize,{passive:true});

const TILE_INFO={
  'Jamie Towater': {desc:'Senior Developer,data engineer, inventor, and systems thinker based in Nashville, Tennessee.',tag:'Identity'},
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

/* Build nodes and edge lists (Fibonacci distribution + nearest-neighbor mesh) */
const sphNodes=[], sphEdges=[];
const SPH_GOLDEN=Math.PI*(3-Math.sqrt(5));
const SPH_FEEL={
  neighbors:3,
  dragGain:1.08,
  spinMax:0.012,
  spinDecay:0.978,
  spinCutoff:0.000006,
  autoYaw:0.00052,
  autoWobble:0.16,
  autoPitchAmp:0.00012,
  arcballRadius:0.5,
};
const SPH_PRESETS={
  calm:{
    neighbors:2,
    dragGain:0.92,
    spinMax:0.008,
    spinDecay:0.982,
    spinCutoff:0.000004,
    autoYaw:0.00036,
    autoWobble:0.12,
    autoPitchAmp:0.00008,
    arcballRadius:0.52,
  },
  balanced:{
    neighbors:3,
    dragGain:1.08,
    spinMax:0.012,
    spinDecay:0.978,
    spinCutoff:0.000006,
    autoYaw:0.00052,
    autoWobble:0.16,
    autoPitchAmp:0.00012,
    arcballRadius:0.5,
  },
  dynamic:{
    neighbors:4,
    dragGain:1.2,
    spinMax:0.016,
    spinDecay:0.972,
    spinCutoff:0.000008,
    autoYaw:0.00068,
    autoWobble:0.2,
    autoPitchAmp:0.00016,
    arcballRadius:0.48,
  },
};
let sphPresetName='balanced';
const SPH_LABELS=RING_DEFS.flatMap(r=>r.labels);

function sphSyncPresetUI(){
  if(!sphPresetRoot)return;
  sphPresetRoot.querySelectorAll('[data-sph-preset]').forEach(btn=>{
    const active=btn.dataset.sphPreset===sphPresetName;
    btn.classList.toggle('is-active',active);
    btn.setAttribute('aria-pressed',active?'true':'false');
  });
}

function sphApplyPreset(name){
  const preset=SPH_PRESETS[name];
  if(!preset)return;
  sphPresetName=name;
  Object.assign(SPH_FEEL,preset);
  sphBuildEdges(SPH_FEEL.neighbors);
  sphSyncPresetUI();
  sphPersistPreset(name);
}

function sphPersistPreset(name){
  try{window.localStorage.setItem(SPH_PRESET_STORAGE_KEY,name);}catch(_){/* no-op */}
}

function sphLoadPreset(){
  try{
    const saved=window.localStorage.getItem(SPH_PRESET_STORAGE_KEY);
    if(saved&&SPH_PRESETS[saved])return saved;
  }catch(_){/* no-op */}
  return sphPresetName;
}

function sphBindPresetUI(){
  if(!sphPresetRoot)return;
  sphPresetRoot.addEventListener('click',e=>{
    const btn=e.target.closest('[data-sph-preset]');
    if(!btn)return;
    sphApplyPreset(btn.dataset.sphPreset);
  });
}

function sphNorm(v){
  const m=Math.hypot(v.x,v.y,v.z)||1;
  return{x:v.x/m,y:v.y/m,z:v.z/m};
}

SPH_LABELS.forEach((txt,i)=>{
  const n=SPH_LABELS.length;
  const t=n===1?0.5:i/(n-1);
  const y=1-2*t;
  const r=Math.sqrt(Math.max(0,1-y*y));
  const theta=SPH_GOLDEN*i;
  const nx=Math.cos(theta)*r;
  const ny=y;
  const nz=Math.sin(theta)*r;
  const ox=SPH_R*nx;
  const oy=-SPH_R*ny;
  const oz=SPH_R*nz;
  const normal=sphNorm({x:ox,y:oy,z:oz});
  let tangent=sphNorm({x:-normal.z,y:0,z:normal.x});
  if(Math.hypot(tangent.x,tangent.y,tangent.z)<0.01){
    tangent=sphNorm({x:0,y:-normal.z,z:normal.y});
  }

  /* Tile div */
  const div=document.createElement('div');
  div.className='sph-tile';
  div.textContent=txt;
  const node={ox,oy,oz,div,txt,tangent};
  div.addEventListener('mousedown',e=>{
    e.stopPropagation();e.preventDefault();
    dragging=false;
    const {sx,sy}=sphProject(node.ox,node.oy,node.oz);
    const wr=sphWrap.getBoundingClientRect();
    showSphPopup(txt, wr.left+sx, wr.top+sy);
  });
  sphLabels.appendChild(div);
  sphNodes.push(node);
});

function sphBuildEdges(neighbors){
  sphEdges.length=0;
  const edgeSet=new Set();
  const addEdge=(a,b)=>{
    if(a===b)return;
    const lo=Math.min(a,b),hi=Math.max(a,b);
    const key=lo+','+hi;
    if(edgeSet.has(key))return;
    edgeSet.add(key);
    sphEdges.push([lo,hi]);
  };

  for(let i=0;i<sphNodes.length;i++){
    if(i<sphNodes.length-1)addEdge(i,i+1);
    const near=[];
    for(let j=0;j<sphNodes.length;j++){
      if(i===j)continue;
      const dx=sphNodes[i].ox-sphNodes[j].ox;
      const dy=sphNodes[i].oy-sphNodes[j].oy;
      const dz=sphNodes[i].oz-sphNodes[j].oz;
      near.push({j,d:dx*dx+dy*dy+dz*dz});
    }
    near.sort((a,b)=>a.d-b.d);
    const nCount=Math.min(neighbors,near.length);
    for(let k=0;k<nCount;k++)addEdge(i,near[k].j);
  }
}
sphBuildEdges(SPH_FEEL.neighbors);

/* Rotation state */
let dragging=false;
let hovering=false,sphLastT=null,sphElapsed=0;
let sphRotM=[1,0,0,0,1,0,0,0,1];
let sphQ={w:1,x:0,y:0,z:0};
let sphDragVec=null;
let sphDragT=0;
let sphSpinAxis={x:0,y:1,z:0};
let sphSpinVel=0;

function sphQuatNorm(q){
  const m=Math.hypot(q.w,q.x,q.y,q.z)||1;
  return{w:q.w/m,x:q.x/m,y:q.y/m,z:q.z/m};
}

function sphQuatMul(a,b){
  return{
    w:a.w*b.w-a.x*b.x-a.y*b.y-a.z*b.z,
    x:a.w*b.x+a.x*b.w+a.y*b.z-a.z*b.y,
    y:a.w*b.y-a.x*b.z+a.y*b.w+a.z*b.x,
    z:a.w*b.z+a.x*b.y-a.y*b.x+a.z*b.w,
  };
}

function sphQuatFromAxisAngle(axis,ang){
  const m=Math.hypot(axis.x,axis.y,axis.z)||1;
  const s=Math.sin(ang/2)/m;
  return{w:Math.cos(ang/2),x:axis.x*s,y:axis.y*s,z:axis.z*s};
}

function sphQuatApply(axis,ang){
  if(Math.abs(ang)<1e-6)return;
  const dq=sphQuatFromAxisAngle(axis,ang);
  sphQ=sphQuatNorm(sphQuatMul(dq,sphQ));
}

function sphArcballVec(clientX,clientY){
  const r=sphWrap.getBoundingClientRect();
  const cx=r.left+r.width/2;
  const cy=r.top+r.height/2;
  const radius=Math.max(1,Math.min(r.width,r.height)*SPH_FEEL.arcballRadius);
  const x=(clientX-cx)/radius;
  const y=(cy-clientY)/radius;
  const d=x*x+y*y;
  if(d>1){
    const m=Math.sqrt(d);
    return{x:x/m,y:y/m,z:0};
  }
  return{x,y,z:Math.sqrt(1-d)};
}

function sphUpdateRotMatrix(){
  const q=sphQ;
  const xx=q.x*q.x,yy=q.y*q.y,zz=q.z*q.z;
  const xy=q.x*q.y,xz=q.x*q.z,yz=q.y*q.z;
  const wx=q.w*q.x,wy=q.w*q.y,wz=q.w*q.z;
  sphRotM=[
    1-2*(yy+zz),2*(xy-wz),2*(xz+wy),
    2*(xy+wz),1-2*(xx+zz),2*(yz-wx),
    2*(xz-wy),2*(yz+wx),1-2*(xx+yy),
  ];
}

function sphApplyRot(ox,oy,oz){
  const m=sphRotM;
  return{
    x:m[0]*ox+m[1]*oy+m[2]*oz,
    y:m[3]*ox+m[4]*oy+m[5]*oz,
    z:m[6]*ox+m[7]*oy+m[8]*oz,
  };
}

function sphProject(ox,oy,oz){
  const{x,y,z}=sphApplyRot(ox*sphScale,oy*sphScale,oz*sphScale);
  const s=SPH_PERSP/(SPH_PERSP-z);
  return{sx:sphCX+x*s,sy:sphCY+y*s,z,s};
}

function sphFrame(ts){
  if(!sphLastT)sphLastT=ts;
  const dt=Math.min(ts-sphLastT,50);
  sphLastT=ts;sphElapsed+=dt;
  if(!dragging){
    if(!hovering){
      sphQuatApply({x:0,y:1,z:0},SPH_FEEL.autoYaw*dt*(1+SPH_FEEL.autoWobble*Math.sin(sphElapsed*0.00027)));
      sphQuatApply({x:1,y:0,z:0},SPH_FEEL.autoPitchAmp*dt*Math.sin(sphElapsed*0.00041));
    }
    if(sphSpinVel>SPH_FEEL.spinCutoff){
      sphQuatApply(sphSpinAxis,sphSpinVel*dt);
      sphSpinVel*=Math.pow(SPH_FEEL.spinDecay,dt/16);
    }
  }

  sphUpdateRotMatrix();

  /* Project all nodes */
  const proj=sphNodes.map((n,i)=>({i,...sphProject(n.ox,n.oy,n.oz),n}));

  /* Draw mesh on canvas */
  sphCtx.clearRect(0,0,sphW,sphH);
  const renderR=sphRenderRadius();
  sphEdges.forEach(([a,b])=>{
    const pa=proj[a],pb=proj[b];
    const t=((pa.z+pb.z)/2+renderR)/(2*renderR);
    sphCtx.beginPath();
    sphCtx.moveTo(pa.sx,pa.sy);
    sphCtx.lineTo(pb.sx,pb.sy);
    sphCtx.strokeStyle=`rgba(102,231,255,${(0.08+0.24*t).toFixed(2)})`;
    sphCtx.lineWidth=0.55+0.75*t;
    sphCtx.stroke();
  });

  /* Position tile divs */
  proj.forEach(({sx,sy,z,n})=>{
    const depth=(z+renderR)/(2*renderR); // 0=back, 1=front
    /* Tangent rotation — makes tiles appear to lie on sphere surface */
    const{x:tx,y:ty}=sphApplyRot(
      n.tangent.x,
      n.tangent.y,
      n.tangent.z
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
sphQuatApply({x:1,y:0,z:0},0.22);
sphQuatApply({x:0,y:1,z:0},-0.12);
sphApplyPreset(sphLoadPreset());
sphBindPresetUI();
requestAnimationFrame(sphFrame);

/* Drag handlers */
sphWrap.addEventListener('mousedown',e=>{
  dragging=true;
  sphDragVec=sphArcballVec(e.clientX,e.clientY);
  sphDragT=performance.now();
  sphSpinVel=0;
  e.preventDefault();
});
window.addEventListener('mousemove',e=>{
  if(!dragging)return;
  const now=performance.now();
  const curr=sphArcballVec(e.clientX,e.clientY);
  if(!sphDragVec){
    sphDragVec=curr;
    sphDragT=now;
    return;
  }
  const axis={
    x:sphDragVec.y*curr.z-sphDragVec.z*curr.y,
    y:sphDragVec.z*curr.x-sphDragVec.x*curr.z,
    z:sphDragVec.x*curr.y-sphDragVec.y*curr.x,
  };
  const axisMag=Math.hypot(axis.x,axis.y,axis.z);
  if(axisMag>1e-6){
    const dot=Math.max(-1,Math.min(1,sphDragVec.x*curr.x+sphDragVec.y*curr.y+sphDragVec.z*curr.z));
    const angle=Math.acos(dot)*SPH_FEEL.dragGain;
    const normAxis={x:axis.x/axisMag,y:axis.y/axisMag,z:axis.z/axisMag};
    sphQuatApply(normAxis,angle);
    const dragDt=Math.max(now-sphDragT,1);
    sphSpinAxis=normAxis;
    sphSpinVel=Math.min(SPH_FEEL.spinMax,angle/dragDt);
  }
  sphDragVec=curr;
  sphDragT=now;
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

function sphSetMobileOpen(open){
  const next=Boolean(open);
  document.body.classList.toggle('sph-mobile-open',next);
  if(sphExpandBtn)sphExpandBtn.setAttribute('aria-expanded',next?'true':'false');
  if(sphMobileBackdrop)sphMobileBackdrop.setAttribute('aria-hidden',next?'false':'true');
  hideSphPopup();
  requestAnimationFrame(()=>{
    sphResize();
  });
}

if(sphExpandBtn){
  sphExpandBtn.addEventListener('click',()=>{
    sphSetMobileOpen(true);
  });
}

if(sphCloseBtn){
  sphCloseBtn.addEventListener('click',()=>{
    sphSetMobileOpen(false);
  });
}

if(sphMobileBackdrop){
  sphMobileBackdrop.addEventListener('click',()=>{
    sphSetMobileOpen(false);
  });
}

window.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&document.body.classList.contains('sph-mobile-open')){
    sphSetMobileOpen(false);
  }
});

window.addEventListener('resize',()=>{
  if(window.innerWidth>960&&document.body.classList.contains('sph-mobile-open')){
    sphSetMobileOpen(false);
  }
},{passive:true});

window.addEventListener('pointerup',()=>{hideSphPopup();});
  document.body.classList.toggle('sph-mobile-open',next);
  if(sphExpandBtn)sphExpandBtn.setAttribute('aria-expanded',next?'true':'false');
  if(sphMobileBackdrop)sphMobileBackdrop.setAttribute('aria-hidden',next?'false':'true');
  hideSphPopup();
  requestAnimationFrame(()=>{
    sphResize();
  });
}

if(sphExpandBtn){
  sphExpandBtn.addEventListener('click',()=>{
    sphSetMobileOpen(true);
  });
}

if(sphCloseBtn){
  sphCloseBtn.addEventListener('click',()=>{
    sphSetMobileOpen(false);
  });
}

if(sphMobileBackdrop){
  sphMobileBackdrop.addEventListener('click',()=>{
    sphSetMobileOpen(false);
  });
}

window.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&document.body.classList.contains('sph-mobile-open')){
    sphSetMobileOpen(false);
  }
});

window.addEventListener('resize',()=>{
  if(window.innerWidth>960&&document.body.classList.contains('sph-mobile-open')){
    sphSetMobileOpen(false);
  }
},{passive:true});

window.addEventListener('mouseup',()=>{dragging=false;sphDragVec=null;hideSphPopup();});
