// Insígnias por jogos zerados (só jogos confirmados, sem contar marcos de jogos infinitos)
const BADGES=[[1,'Primeira Zerada','🎮'],[5,'Persistente','🥉'],[10,'Veterano','🥈'],[25,'Lenda','🥇'],[50,'Imortal','💎'],[100,'Divindade Gamer','👑']];
const zeradas=u=>games.filter(g=>g.user_id===u&&g.kind!=='milestone'&&ok(g)).length;
function topBadge(u){const n=zeradas(u),b=BADGES.filter(x=>n>=x[0]).pop();return b?`<span class="bdg" title="${esc(b[1])}">${b[2]}</span>`:''}
function badgesHtml(u){
  const n=zeradas(u),nx=BADGES.find(x=>n<x[0]),prev=BADGES.filter(x=>n>=x[0]).pop(),from=prev?prev[0]:0;
  const bar=nx?`<div class="bprog"><i style="width:${Math.round((n-from)/(nx[0]-from)*100)}%"></i></div><small>${n}/${nx[0]} jogos para <b>${esc(nx[1])}</b></small>`:'<small>Todas as insígnias conquistadas! 👑</small>';
  return `<h2 class="sec"><span>Insígnias<small>por jogos zerados</small></span></h2><div class="card"><div class="badges">${BADGES.map(([k,l,i])=>`<div class="bd${n>=k?' on':''}"><span>${i}</span><b>${esc(l)}</b><small>${k} ${k===1?'jogo':'jogos'}</small></div>`).join('')}</div>${bar}</div>`;
}
