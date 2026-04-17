/* CURSOR */
const cdot=document.getElementById('cdot'),cring=document.getElementById('cring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cdot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;});
(function loop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;cring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(loop);})();
document.querySelectorAll('a,button,.pcard,.int-card,.con-link,.sph-tile').forEach(el=>{
  el.addEventListener('mouseenter',()=>cring.classList.add('hovered'));
  el.addEventListener('mouseleave',()=>cring.classList.remove('hovered'));
});

/* NAV */
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40),{passive:true});

/* TYPEWRITER — your phrases kept */
const phrases=[
  'Senior developer. Data engineer in practice.',
  'Make it boring, stable, and correct.',
  'SQL Server → Parquet → S3 → Iceberg.',
  'Building VERA around safety, dignity, and access.',
  'Step inside the VERA Lab in Unity VR.',
  'Modern tools should serve the work.',
  'Zen Bones: Alan Watts, Taoism, and consciousness.',
  'Clarity is a design principle.',
];
let pi=0,ci=0,del=false;
const tw=document.getElementById('typewriter');
function typeStep(){
  const p=phrases[pi];
  if(!del){tw.textContent=p.slice(0,++ci);if(ci===p.length){del=true;setTimeout(typeStep,2200);return;}setTimeout(typeStep,52);}
  else{tw.textContent=p.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%phrases.length;setTimeout(typeStep,400);return;}setTimeout(typeStep,28);}
}
setTimeout(typeStep,1400);

/* CARD TOGGLE */
function toggleCard(btn){const exp=btn.nextElementSibling;const open=exp.classList.toggle('open');btn.setAttribute('aria-expanded',open);}

/* SCROLL REVEALS */
const ro=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis');}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));
/* CLOCK */
const clk=document.getElementById('clock-si');
setInterval(()=>{const n=new Date();clk.textContent=`⏱ ${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`;},1000);

/* HERO TILT */
document.getElementById('hero').addEventListener('mousemove',e=>{
  const cx=window.innerWidth/2,cy=window.innerHeight/2;
  document.querySelector('.hero-content').style.transform=`translate(${(e.clientX-cx)/cx*6}px,${(e.clientY-cy)/cy*4}px)`;
},{passive:true});
