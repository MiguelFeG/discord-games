// Efeitos: partículas de fundo e confete
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
(function(){
  if(reduce)return;
  const cv=$('bg'),cx=cv.getContext('2d'),cols=['#5865f2','#b44bff','#3ba5ff','#ffc83d'];let W,H;
  const size=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};size();addEventListener('resize',size);
  const ps=Array.from({length:42},(_,i)=>({x:Math.random()*W,y:Math.random()*H,s:3+(Math.random()*5|0),v:.15+Math.random()*.5,c:cols[i%4],a:.15+Math.random()*.35}));
  (function tick(){cx.clearRect(0,0,W,H);for(const p of ps){p.y-=p.v;if(p.y<-10){p.y=H+10;p.x=Math.random()*W}cx.globalAlpha=p.a;cx.fillStyle=p.c;cx.fillRect(p.x,p.y,p.s,p.s)}requestAnimationFrame(tick)})();
})();
function confetti(){
  if(reduce)return;
  const cv=document.createElement('canvas');cv.className='cf';document.body.appendChild(cv);
  const cx=cv.getContext('2d'),cols=['#5865f2','#b44bff','#ffc83d','#3ba55d','#ff5d8f','#3ba5ff'];cv.width=innerWidth;cv.height=innerHeight;
  const ps=Array.from({length:110},()=>({x:innerWidth/2,y:innerHeight*.35,vx:(Math.random()-.5)*14,vy:-Math.random()*13-3,s:5+(Math.random()*6|0),c:cols[Math.random()*6|0]}));
  let t=0;(function tick(){cx.clearRect(0,0,cv.width,cv.height);t++;for(const p of ps){p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.vx*=.99;cx.fillStyle=p.c;cx.fillRect(p.x,p.y,p.s,p.s)}if(t<150)requestAnimationFrame(tick);else cv.remove()})();
}
