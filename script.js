// Garden generative system

const canvas = document.getElementById('gardenCanvas');
const ctx = canvas.getContext('2d');
const bloomBtn = document.getElementById('bloom');
const unleashBtn = document.getElementById('unleash');
const stopBtn = document.getElementById('stop');
const densityEl = document.getElementById('density');

let W=0,H=0; function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight }
addEventListener('resize', resize); resize();

function rand(min,max){ return Math.random()*(max-min)+min }

class Bloom{
  constructor(x,y){ this.x=x; this.y=y; this.size=0; this.max=rand(14,120); this.h=rand(0,360); this.speed=rand(0.2,1.6); this.opacity=1 }
  update(){ this.size += this.speed; if(this.size>this.max) this.opacity -= 0.02; }
  draw(){ ctx.save(); ctx.translate(this.x,this.y);
    const petals = ~~(3+this.max/20);
    for(let i=0;i<petals;i++){
      const a = (i/petals)*Math.PI*2;
      const px = Math.cos(a)*(this.size*0.6);
      const py = Math.sin(a)*(this.size*0.6);
      ctx.fillStyle = `hsla(${this.h + i*8},80%,60%,${this.opacity})`;
      ctx.beginPath();
      ctx.ellipse(px,py,this.size*0.6,this.size*0.28,a,0,Math.PI*2);
      ctx.fill();
    }
    ctx.fillStyle = `hsla(${this.h},90%,30%,${this.opacity})`;
    ctx.beginPath();
    ctx.arc(0,0,this.size*0.22,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
  alive(){ return this.opacity>0 }
}

const blooms = [];
function seed(x,y,n=1){ for(let i=0;i<n;i++) blooms.push(new Bloom(x+rand(-24,24), y+rand(-24,24))) }

function clearGarden(){ blooms.length = 0; ctx.clearRect(0,0,W,H) }

let autoBloom = false;
let autoId = null;
function startAuto(){ autoBloom = true; autoId = setInterval(()=>{ for(let i=0;i<~~(densityEl.value/30);i++) seed(rand(0,W), rand(0,H), Math.max(1, ~~(densityEl.value/80))) }, 420) }
function stopAuto(){ autoBloom=false; clearInterval(autoId) }

function unleashStorm(mult=2.5){ // big chaos but not using forbidden words
  for(let i=0;i<~~(densityEl.value*mult);i++) seed(rand(0,W), rand(0,H), ~~rand(1,4));
  document.body.classList.add('shake'); setTimeout(()=>document.body.classList.remove('shake'),700);
  // shards
  for(let i=0;i<80;i++){ const t=document.createElement('div'); t.textContent = ['✦','✶','☼','♪'][~~rand(0,4)]; t.style.position='fixed'; t.style.left=rand(0,100)+'%'; t.style.top='-10%'; t.style.color=`hsl(${rand(0,360)},90%,60%)`; t.style.fontSize=rand(14,36)+'px'; t.style.zIndex=9999; t.style.pointerEvents='none'; document.body.appendChild(t); const dur=rand(700,2400); t.animate([{transform:'translateY(0)', opacity:1},{transform:`translateY(${H+200}px)`, opacity:0}], {duration:dur, easing:'ease-in'}); setTimeout(()=>t.remove(), dur+200) }
}

function step(){ ctx.clearRect(0,0,W,H);
  for(let i=blooms.length-1;i>=0;i--){ const b=blooms[i]; b.update(); b.draw(); if(!b.alive()) blooms.splice(i,1) }
  requestAnimationFrame(step)
}
step();

// interactions
canvas.style.pointerEvents = 'none';
window.addEventListener('pointerdown', e=>{ seed(e.clientX, e.clientY, Math.max(1, ~~(densityEl.value/30))) });
bloomBtn.addEventListener('click', ()=>{ if(autoBloom) stopAuto(); else startAuto() });
unleashBtn.addEventListener('click', ()=>{ unleashStorm() });
stopBtn.addEventListener('click', ()=>{ clearGarden(); stopAuto(); stopRampage(); });
const toggleBtn = document.getElementById('toggleControls');
const controlsPanel = document.getElementById('controlsPanel');
const brandPanel = document.getElementById('brandPanel');
const rampageBtn = document.getElementById('rampage');
let rampageActive = false;
let rampageId = null;
function startRampage(){ rampageActive = true; rampageBtn.textContent = 'RAMPAGE ON'; rampageId = setInterval(()=>{ unleashStorm(1.2) }, 3500) }
function stopRampage(){ rampageActive = false; rampageBtn.textContent = 'RAMPAGE'; clearInterval(rampageId) }
rampageBtn.addEventListener('click', ()=>{ if(rampageActive) stopRampage(); else startRampage() });
toggleBtn.addEventListener('click', ()=>{ controlsPanel.classList.toggle('hidden'); brandPanel.classList.toggle('hidden') });

window.addEventListener('keydown', e=>{
  if(e.code === 'Space'){ e.preventDefault(); if(autoBloom) stopAuto(); else startAuto() }
  if(e.key.toLowerCase()==='u') unleashStorm();
  if(e.key === 'Escape') { clearGarden(); stopAuto(); stopRampage() }
});

// subtle ambient seeds when auto is on
setInterval(()=>{ if(autoBloom) seed(rand(0,W), rand(0,H), ~~(densityEl.value/40)) }, 600);


