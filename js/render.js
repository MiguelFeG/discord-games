// Telas: Home, Estante, Perfil, cards e pop-up do jogo
function board(f){const c={};games.filter(f).forEach(g=>{const o=c[g.user_id]||(c[g.user_id]={u:g.user_id,n:0,h:0,p:0});o.n++;o.h+=+g.hours;o.p+=pts(g)});return Object.values(c).sort((a,b)=>b.p-a.p||a.h-b.h)}
function route(){const h=location.hash.replace(/^#\/?/,'').split('/');return{pg:['home','estante','perfil'].includes(h[0])?h[0]:'home',id:h[1]||me}}
const tile=(l,v)=>`<div class="stat"><small>${l}</small><b>${v}</b></div>`;
function render(){
  if(!me)return;
  const {pg,id}=route(),all=board(ok);
  document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.p===pg));
  ['home','estante','perfil'].forEach(p=>$('pg-'+p).hidden=p!==pg);
  let h='';
  if(deadline){
    const left=Math.ceil((new Date(deadline+'T23:59:59')-new Date())/864e5);
    h=left>=0?`<span class="dl">⏳ ${left===0?'Último dia!':`Faltam <b>${left}</b> ${left===1?'dia':'dias'}`} · encerra em ${fd(deadline)}</span>`:`<span class="dl end">🏁 Competição encerrada em ${fd(deadline)}${all[0]?` · Campeão: <b>${esc(name(all[0].u))}</b> (${all[0].p} pts)`:''}</span>`;
  }
  if(isAdmin)h+=`<input type="date" id="dli" value="${deadline||''}"><button class="chip" data-a="dls">salvar prazo</button>${deadline?'<button class="chip" data-a="dlc">remover prazo</button>':''}`;
  $('dl').innerHTML=h;
  if(pg==='home')home(board(counts),all);else if(pg==='estante')estante();else perfil(id);
}
function home(arr,all){
  const okg=games.filter(ok),hrs=okg.reduce((s,g)=>s+ +g.hours,0);
  $('sum').innerHTML=tile('👑 Líder',all[0]?`${esc(name(all[0].u))} · ${all[0].p} pts`:'—')+tile('✅ Jogos confirmados',okg.length)+tile('⏱️ Horas jogadas',Math.round(hrs*10)/10+' h')+tile('🎮 Jogadores',Object.keys(profs).length);
  const sig=arr.slice(0,3).map(p=>p.u+':'+p.p).join('|'),anim=sig!==podSig;podSig=sig;
  if(all[0]&&lastLead!==all[0].u){lastLead=all[0].u;setTimeout(confetti,700)}
  const top=arr.slice(0,3),ord=top.length===3?[1,0,2]:top.length===2?[1,0]:[0];
  $('pod').innerHTML=arr.length?`<div class="podium${anim?' anim':''}">${ord.map(i=>{const p=top[i];return `<div class="pd p${i+1}"><div class="crown">${i?'':'👑'}</div><div class="nm" data-a="prof" data-id="${p.u}" style="cursor:pointer">${av(p.u,i?46:56)}<div>${esc(name(p.u))}</div></div><div class="blk"><b>${p.p}</b><span>pts · ${p.n} ${p.n===1?'jogo':'jogos'}</span><span>${Math.round(p.h*10)/10}h</span></div></div>`}).join('')}</div>${arr.length>3?`<p class="cap">Também jogando: ${arr.slice(3).map(p=>`${esc(name(p.u))} (${p.p} pts)`).join(', ')}</p>`:''}`:'<div class="empty">Nenhum jogo confirmado ainda. Registre um jogo e peça para um amigo confirmar o comprovante!</div>';
  const ms=[...new Set(games.map(g=>g.end_date.slice(0,7)))].sort().reverse();
  if(mo&&!ms.includes(mo))mo='';
  $('mc').innerHTML=ms.length?`<button class="chip${mo?'':' on'}" data-m="">Geral</button>`+ms.map(m=>`<button class="chip${mo===m?' on':''}" data-m="${m}">${mlab(m)}</button>`).join(''):'';
  $('rec').innerHTML=games.slice(0,8).map(card).join('')||'<div class="empty">Nenhum jogo ainda.</div>';
}
function estante(){
  const owners=[...new Set(games.map(g=>g.user_id))];
  $('pc').innerHTML=owners.length?`<button class="chip${pf?'':' on'}" data-f="">Todos (${games.length})</button>`+owners.map(u=>`<button class="chip${pf===u?' on':''}" data-f="${u}">${esc(name(u))} (${games.filter(g=>g.user_id===u).length})</button>`).join(''):'';
  $('shelf').innerHTML=games.filter(g=>!pf||g.user_id===pf).map(card).join('')||'<div class="empty" style="grid-column:1/-1">Nada por aqui ainda.</div>';
}
function perfil(id){
  const p=profs[id];
  if(!p){$('pg-perfil').innerHTML='<div class="empty">Perfil não encontrado.</div>';return}
  const own=id===me,mine=games.filter(g=>g.user_id===id),okm=mine.filter(ok),pt=okm.reduce((s,g)=>s+pts(g),0),hrs=okm.reduce((s,g)=>s+ +g.hours,0),rs=mine.filter(g=>g.rating!=null),avg=rs.length?Math.round(rs.reduce((s,g)=>s+ +g.rating,0)/rs.length*10)/10:'—';
  $('pg-perfil').innerHTML=`<div class="card prof">${av(id,96)}<div><h2 style="margin:0">${esc(p.name)}</h2><div class="bs">${okm.length} ${okm.length===1?'jogo confirmado':'jogos confirmados'}</div>${own?`<div class="chips" style="margin:10px 0 0"><label class="chip" style="cursor:pointer">📷 Trocar foto<input type="file" id="avf" accept="image/*" hidden></label><button class="chip" data-a="nick">✏️ Trocar apelido</button>${gAvatar?'<button class="chip" data-a="gphoto">↩ Usar foto do Google</button>':''}</div>`:''}</div></div>
  <div class="stats">${tile('⭐ Pontos',pt)}${tile('✅ Confirmados',okm.length)}${tile('📝 Registrados',mine.length)}${tile('⏱️ Horas totais',Math.round(hrs*10)/10+' h')}${tile('🎯 Nota média',avg)}</div>
  <h2 class="sec"><i>🎮</i><span>${own?'Meus jogos':'Jogos de '+esc(p.name)}<small>pontos e comprovantes</small></span></h2>
  <div class="shelf">${mine.map(card).join('')||'<div class="empty" style="grid-column:1/-1">Nenhum jogo registrado.</div>'}</div>`;
}

function card(g){
  const own=g.user_id===me,okc=nconf(g)>=CFG.confirms;
  const ini=g.title.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  const tag=[g.platform,g.platinum?'🏅':''].filter(Boolean).map(esc).join(' · ');
  return `<div class="g" data-a="det" data-id="${g.id}">${g.cover_url?`<div class="cv" style="background-image:url('${esc(g.cover_url)}')"></div>`:`<div class="cv" style="background:${grad(g.title)}">${esc(ini)}</div>`}${tag?`<span class="pfb">${tag}</span>`:''}<div class="cap"><b class="tt">${esc(g.title)}</b><span class="by" data-a="prof" data-id="${g.user_id}">${av(g.user_id,20)}${esc(name(g.user_id))}</span><div class="mt"><span>⏱ ${g.hours}h</span>${g.rating!=null?`<span>⭐ ${g.rating}</span>`:''}<span class="pt">${pts(g)} pts</span></div><span class="stt ${okc?'ok':'wait'}">${okc?'✅ Confirmado':'⏳ Aguardando'}</span></div>${own?`<button class="del" style="right:38px" data-a="edit" data-id="${g.id}" title="Editar">✎</button><button class="del" data-a="del" data-id="${g.id}" title="Remover">✕</button>`:''}</div>`;
}
const DIF={1:'Fácil',1.25:'Médio',1.5:'Difícil',2:'Muito difícil'};
function det(id){
  const g=games.find(x=>x.id===id);if(!g)return;
  const n=nconf(g),own=g.user_id===me,ini=g.title.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  const mine=confs.some(c=>c.game_id===g.id&&c.user_id===me&&c.rev===g.rev);
  const apv=confs.filter(c=>c.game_id===g.id&&c.rev===g.rev&&c.user_id!==g.user_id).sort((x,y)=>String(x.created_at||'').localeCompare(String(y.created_at||'')));
  const row=(l,v)=>`<div class="stat"><small>${l}</small><b>${v}</b></div>`;
  $('dp').innerHTML=`<div class="card dcard"><button class="x" data-a="closedp" aria-label="Fechar">✕</button>
  <div class="dhead">${g.cover_url?`<div class="dcv" style="background-image:url('${esc(g.cover_url)}')"></div>`:`<div class="dcv" style="background:${grad(g.title)}">${esc(ini)}</div>`}
  <div><h3>${esc(g.title)}</h3><div class="by" data-a="prof" data-id="${g.user_id}">${av(g.user_id,22)}${esc(name(g.user_id))}</div>
  <div class="tags">${g.platform?`<span class="tag">${esc(g.platform)}</span>`:''}${g.platinum?'<span class="tag">🏅 Platina</span>':''}<span class="tag">${n>=CFG.confirms?'✅ Confirmado':'⏳ Aguardando confirmação'}</span></div></div></div>
  <div class="stats dstats">${row('Pontos',pts(g))}${row('Horas',g.hours+' h')}${row('Início',fd(g.start_date))}${row('Fim',fd(g.end_date))}${row('Média',Math.round(g.hours/days(g)*10)/10+' h/dia')}${row('Dificuldade',DIF[g.difficulty]||g.difficulty)}${row('Nota',g.rating!=null?'⭐ '+g.rating:'—')}</div>
  <h4>Review</h4><div class="rv">${g.comment?esc(g.comment):'<span style="color:var(--mut)">Sem review ainda.</span>'}</div>
  <h4>Comprovante · enviado em ${esc(fdt(g.created_at)||'—')}</h4><img class="dpf" src="${esc(g.proof_url)}" alt="Comprovante" data-a="proof" data-id="${g.id}">
  <h4>Aprovações (${n})</h4><div class="appr">${apv.length?apv.map(c=>`<div class="ap" data-a="prof" data-id="${c.user_id}">${av(c.user_id,30)}<div><b>${esc(name(c.user_id))}</b><small>${esc(fdt(c.created_at)||'horário não registrado')}</small></div></div>`).join(''):'<span style="color:var(--mut)">Ninguém aprovou ainda.</span>'}</div><div class="dact">${!own?(mine?'<span>✅ Você já confirmou</span>':`<button data-a="conf" data-id="${g.id}">✅ Confirmar comprovante</button>`):`<button class="ghost" data-a="edit" data-id="${g.id}">✎ Editar</button><button class="ghost" data-a="del" data-id="${g.id}">✕ Remover</button>`}</div></div>`;
  $('dp').hidden=false;
}
