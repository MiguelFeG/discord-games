// Utilitários, regras de pontos e validação de datas
const $=i=>document.getElementById(i);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CFG={base:5,cap:150,plat:1.5,maxDay:16,confirms:1};
let gAvatar=null,me=null,games=[],profs={},confs=[],deadline=null,isAdmin=false,mo='',pf='',editing=null;
const say=m=>{$('st').textContent=m;clearTimeout(say.t);say.t=setTimeout(()=>$('st').textContent='',6000)};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const days=g=>Math.round((new Date(g.end_date+'T00:00')-new Date(g.start_date+'T00:00'))/864e5)+1;
const fd=s=>s?s.split('-').reverse().join('/'):'';
const fdt=s=>s?new Date(s).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}):'';
let podSig='',lastLead=null;
const name=u=>profs[u]?.name||'Jogador';
const hue=s=>[...String(s)].reduce((h,c)=>(h*31+c.charCodeAt(0))%360,0);
const grad=s=>{const h=hue(s);return `linear-gradient(145deg,hsl(${h} 70% 48%),hsl(${(h+55)%360} 70% 28%))`};
const av=(u,s)=>profs[u]?.avatar_url?`<img class="av" data-a="prof" data-id="${u}" referrerpolicy="no-referrer" style="width:${s}px;height:${s}px" src="${esc(profs[u].avatar_url)}" alt="">`:`<span class="av" data-a="prof" data-id="${u}" style="width:${s}px;height:${s}px;font-size:${s*.4|0}px;background:${grad(u)}">${esc(name(u).slice(0,2).toUpperCase())}</span>`;
const nconf=g=>confs.filter(c=>c.game_id===g.id&&c.rev===g.rev&&c.user_id!==g.user_id).length;
const pts=g=>{const p=CFG.base+Math.min(g.hours,CFG.cap)*g.difficulty;return Math.round(g.platinum?p*CFG.plat:p)};
const ok=g=>nconf(g)>=CFG.confirms&&(!deadline||g.end_date<=deadline);const counts=g=>ok(g)&&(!mo||g.end_date.slice(0,7)===mo);
const mlab=m=>['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][+m.slice(5)-1]+'/'+m.slice(0,4);

function dateErr(g){
  if(!g.start_date||!g.end_date)return 'Informe as datas de início e fim.';
  if(g.end_date<g.start_date)return 'A data de fim não pode ser antes do início.';
  if(g.end_date>today())return 'A data de fim não pode ser no futuro.';
  const d=days(g);
  if(g.hours>d*CFG.maxDay)return `Em ${d} ${d===1?'dia':'dias'} dá no máximo ${d*CFG.maxDay} h (${CFG.maxDay} h/dia). Confira as horas ou as datas.`;
  return '';
}
