// Perfil: sobre mim e plataformas (com logos)
let bioEdit=false;
const NET=[['steam','Steam','steam','#1b2838'],['xbox','Xbox','xbox','#107c10'],['playstation','PlayStation','playstation','#0070d1'],['nintendo','Nintendo','nintendoswitch','#e60012']];
const icon=(slug,bg,sz)=>`<span class="nic" style="background:${bg};width:${sz}px;height:${sz}px"><img src="https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/${slug}.svg" alt="" width="${sz*.6|0}" height="${sz*.6|0}" referrerpolicy="no-referrer"></span>`;
const netTxt=v=>/^https?:\/\//i.test(v)?`<a href="${esc(v)}" target="_blank" rel="noopener noreferrer">${esc(v.replace(/^https?:\/\/(www\.)?/i,'').slice(0,40))}</a>`:esc(v);
const titulo=(t,s)=>`<h2 class="sec"><span>${t}${s?`<small>${s}</small>`:''}</span></h2>`;
function bioHtml(p,own){
  if(own&&bioEdit)return `<form id="pfrm">${titulo('Sobre mim','conte um pouco sobre você')}<div class="card"><textarea id="ab" maxlength="500" rows="4" placeholder="Sobre mim: o que você joga, gêneros favoritos…">${esc(p.about||'')}</textarea></div>${titulo('Plataformas','seu usuário ou o link do perfil')}<div class="card"><div class="netg">${NET.map(([k,l,s,c])=>`<label class="h"><span class="nlab">${icon(s,c,28)}${l}</span><input id="n_${k}" maxlength="120" placeholder="usuário ou link" value="${esc(p[k]||'')}"></label>`).join('')}</div></div><div class="bact"><button>Salvar perfil</button><button type="button" class="ghost" data-a="biocancel">Cancelar</button></div></form>`;
  const about=p.about?`<div class="rv">${esc(p.about)}</div>`:`<span style="color:var(--mut)">Nada escrito ainda.${own?' Clique em Editar perfil para contar sobre você.':''}</span>`;
  return `<div class="sech">${titulo('Sobre mim','quem é e o que joga')}${own?'<button class="chip" data-a="bioedit">Editar perfil</button>':''}</div><div class="card">${about}</div>${titulo('Plataformas','onde jogar com a galera')}<div class="pgrid">${NET.map(([k,l,s,c])=>`<div class="plt${p[k]?'':' off'}">${icon(s,c,46)}<div><b>${l}</b><div class="pv">${p[k]?netTxt(p[k]):'Não informado'}</div></div></div>`).join('')}</div>`;
}
document.addEventListener('submit',async e=>{
  if(e.target.id!=='pfrm')return;e.preventDefault();
  const v=i=>$(i).value.trim()||null,o={about:v('ab')};NET.forEach(([k])=>o[k]=v('n_'+k));
  const r=await sb.from('profiles').update(o).eq('id',me);
  say(r.error?'Não foi possível salvar o perfil.':'Perfil salvo!');if(!r.error){bioEdit=false;load()}
});
