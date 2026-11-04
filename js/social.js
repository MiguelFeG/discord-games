// Comentários e reações (estilo Death Stranding): 10 s, uma única rodada por item
const RX={secs:10};let round=null,curDet=null;
const ownerOf=(t,id)=>t==='game'?games.find(x=>x.id===id)?.user_id:cmts.find(x=>x.id===id)?.user_id;
const rxTot=(t,id)=>reacts.filter(r=>r.target_type===t&&r.target_id===id).reduce((o,r)=>({l:o.l+r.likes,d:o.d+r.dislikes}),{l:0,d:0});
const rxMine=(t,id)=>reacts.find(r=>r.target_type===t&&r.target_id===id&&r.user_id===me);
function rxHtml(t,id,owner){
  const tot=rxTot(t,id),mine=rxMine(t,id),act=round&&round.t===t&&round.id===id;
  const l=tot.l+(act?round.l:0),d=tot.d+(act?round.d:0),can=owner!==me&&!mine&&(!round||act);
  let ctl;
  if(owner===me)ctl='<span class="rxn">Você não avalia o próprio conteúdo.</span>';
  else if(mine)ctl=`<span class="rxn">Sua rodada: 👍 ${mine.likes} · 👎 ${mine.dislikes}</span>`;
  else if(act)ctl=`<div class="rxt"><i style="animation-duration:${RX.secs}s;animation-delay:-${((Date.now()-round.t0)/1000).toFixed(2)}s"></i></div><span class="rxn">Toque à vontade! ${round.left}s</span>`;
  else ctl=`<span class="rxn">${round?'Termine a rodada atual primeiro.':'Toque para começar: você tem 10 s, uma única vez.'}</span>`;
  const b=(k,ic,v)=>`<button class="ghost rxb ${k==='l'?'up':'dn'}" ${can?'':'disabled'} data-a="rx" data-t="${t}" data-id="${id}" data-k="${k}">${ic} <b>${v}</b></button>`;
  return `<div class="rx" data-rx="${t}:${id}">${b('l','👍',l)}${b('d','👎',d)}${ctl}</div>`;
}
function rxPaint(t,id){const el=document.querySelector(`.rx[data-rx="${t}:${id}"]`);if(el)el.outerHTML=rxHtml(t,id,ownerOf(t,id))}
function rxTap(t,id,k){
  if(ownerOf(t,id)===me||rxMine(t,id)||(round&&!(round.t===t&&round.id===id)))return;
  if(!round){round={t,id,l:0,d:0,left:RX.secs,t0:Date.now()};round.iv=setInterval(()=>{round.left--;if(round.left<=0)rxEnd();else rxPaint(round.t,round.id)},1000)}
  round[k]++;rxPaint(t,id);
}
async function rxEnd(){
  const r=round;if(!r)return;clearInterval(r.iv);round=null;
  const res=await sb.from('reactions').insert({target_type:r.t,target_id:r.id,likes:Math.min(r.l,500),dislikes:Math.min(r.d,500)});
  say(res.error?'Não foi possível enviar suas reações.':`Rodada enviada: 👍 ${r.l} · 👎 ${r.d}`);
  await load();if(curDet&&!$('dp').hidden)det(curDet);
}
function cmtHtml(gid,gOwner){
  const list=cmts.filter(c=>c.game_id===gid);
  return `<h4>Comentários (${list.length})</h4><div class="cmts">${list.map(c=>`<div class="cm1"><div class="cmh"><span class="by" data-a="prof" data-id="${c.user_id}">${av(c.user_id,26)}<b>${esc(name(c.user_id))}</b></span><small>${esc(fdt(c.created_at))}</small>${c.user_id===me||gOwner===me?`<button class="ghost sm" data-a="cdel" data-id="${c.id}" title="Apagar">✕</button>`:''}</div><div class="rv">${esc(c.body)}</div>${rxHtml('comment',c.id,c.user_id)}</div>`).join('')||'<div class="empty">Seja o primeiro a comentar.</div>'}</div><form id="cf" data-g="${gid}"><textarea id="cb" maxlength="500" rows="2" placeholder="Escreva um comentário…"></textarea><button>Comentar</button></form>`;
}
document.addEventListener('submit',async e=>{
  if(e.target.id!=='cf')return;e.preventDefault();
  const body=$('cb').value.trim();if(!body)return say('Escreva algo no comentário.');
  const r=await sb.from('comments').insert({game_id:e.target.dataset.g,body});
  if(r.error)return say('Não foi possível comentar: '+r.error.message);
  await load();if(curDet)det(curDet);
});
