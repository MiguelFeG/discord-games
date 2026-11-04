// Perfil: sobre mim e links das plataformas
const NET=[['steam','Steam','🎮'],['xbox','Xbox','🟩'],['playstation','PlayStation','🔵'],['nintendo','Nintendo','🔴']];
const netTxt=v=>/^https?:\/\//i.test(v)?`<a href="${esc(v)}" target="_blank" rel="noopener noreferrer">${esc(v.replace(/^https?:\/\/(www\.)?/i,'').slice(0,40))}</a>`:esc(v);
function bioHtml(p,own){
  const view=`<div class="rv">${p.about?esc(p.about):'<span style="color:var(--mut)">Nada escrito ainda.</span>'}</div><div class="nets">${NET.filter(([k])=>p[k]).map(([k,l,i])=>`<span class="net">${i} <b>${l}</b> ${netTxt(p[k])}</span>`).join('')}</div>`;
  const form=`<form id="pfrm"><textarea id="ab" maxlength="500" rows="4" placeholder="Sobre mim: o que você joga, gêneros favoritos…">${esc(p.about||'')}</textarea><div class="netg">${NET.map(([k,l,i])=>`<label class="h">${i} ${l}<input id="n_${k}" maxlength="120" placeholder="usuário ou link" value="${esc(p[k]||'')}"></label>`).join('')}</div><button>Salvar perfil</button></form>`;
  return `<h2 class="sec"><i>📝</i><span>Sobre<small>quem é e onde jogar</small></span></h2><div class="card">${own?form:view}</div>`;
}
document.addEventListener('submit',async e=>{
  if(e.target.id!=='pfrm')return;e.preventDefault();
  const v=i=>$(i).value.trim()||null,o={about:v('ab')};NET.forEach(([k])=>o[k]=v('n_'+k));
  const r=await sb.from('profiles').update(o).eq('id',me);
  say(r.error?'Não foi possível salvar o perfil.':'Perfil salvo!');if(!r.error)load();
});
