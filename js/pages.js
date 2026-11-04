// Páginas: Rankings gerais e Aguardando confirmações
function rankings(){
  const by={},get=u=>by[u]||(by[u]={u,n:0,h:0,rs:[],l:0,d:0});
  games.filter(ok).forEach(g=>{const o=get(g.user_id);if(g.kind!=='milestone')o.n++;o.h+=+g.hours;if(g.rating!=null)o.rs.push(+g.rating)});
  reacts.forEach(r=>{const u=ownerOf(r.target_type,r.target_id);if(u){const o=get(u);o.l+=r.likes;o.d+=r.dislikes}});
  const P=Object.fromEntries(board(ok).map(x=>[x.u,x.p]));
  const list=(t,i,key,fmt)=>{
    const rows=Object.values(by).map(o=>({u:o.u,v:key(o)})).filter(r=>r.v>0).sort((a,b)=>b.v-a.v).slice(0,10);
    return `<div class="card rk"><h3>${t}</h3>${rows.map((r,k)=>`<div class="rkr" data-a="prof" data-id="${r.u}"><span class="rkp">${k+1}</span>${av(r.u,28)}<b>${esc(name(r.u))} ${topBadge(r.u)}</b><span class="rkv">${fmt(r.v)}</span></div>`).join('')||'<div class="empty">Sem dados ainda.</div>'}</div>`;
  };
  const avg=o=>o.rs.length?o.rs.reduce((a,b)=>a+b,0)/o.rs.length:0;
  $('pg-rankings').innerHTML=`<h2 class="sec"><span>Rankings gerais<small>todos os jogos confirmados</small></span></h2><div class="rkg">${list('Pontos totais','⭐',o=>P[o.u]||0,v=>v+' pts')}${list('Jogos zerados','🎮',o=>o.n,v=>v)}${list('Horas jogadas','⏱️',o=>o.h,v=>Math.round(v*10)/10+' h')}${list('Nota média dos jogos','📝',avg,v=>'⭐ '+Math.round(v*10)/10)}${list('Curtidas recebidas (saldo)','👍',o=>o.l-o.d,v=>'+'+v)}</div>`;
}
function aguardando(){
  const pend=g=>nconf(g)<CFG.confirms,mineC=g=>confs.some(c=>c.game_id===g.id&&c.user_id===me&&c.rev===g.rev);
  const forMe=games.filter(g=>pend(g)&&g.user_id!==me&&!mineC(g)),mine=games.filter(g=>pend(g)&&g.user_id===me);
  const sec=(i,t,s,l,e)=>`<h2 class="sec"><span>${t}<small>${s}</small></span></h2><div class="shelf">${l.map(card).join('')||`<div class="empty" style="grid-column:1/-1">${e}</div>`}</div>`;
  $('pg-aguardando').innerHTML=sec('✅','Para eu confirmar','jogos dos amigos esperando você',forMe,'Nada para confirmar agora. 🎉')+sec('⏳','Os meus aguardando','esperando a aprovação de um amigo',mine,'Nenhum jogo seu aguardando.');
}
