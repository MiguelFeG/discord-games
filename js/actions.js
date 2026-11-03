// Cliques, atalhos e navegação
document.addEventListener('click',async e=>{
  const t=e.target.closest('[data-a],[data-m],[data-f]');
  if(e.target.id==='lb'){$('lb').hidden=true;return}
  if(e.target.id==='dp'){$('dp').hidden=true;return}
  if(!t)return;
  if(t.hasAttribute('data-m')){mo=t.dataset.m;render();return}
  if(t.hasAttribute('data-f')){pf=t.dataset.f;render();return}
  const a=t.dataset.a,id=t.dataset.id,g=games.find(x=>x.id===id);
  if(a==='add')openForm();
  else if(a==='close')closeAll();
  else if(a==='det')det(id);
  else if(a==='closedp')$('dp').hidden=true;
  else if(a==='closelb')$('lb').hidden=true;
  else if(a==='prof'){location.hash='#/perfil/'+id}
  else if(a==='gphoto'){try{await setAvatar(gAvatar);say('Foto do Google restaurada.')}catch(err){say('Não foi possível trocar a foto.')}}
  else if(a==='edit')openForm(id);
  else if(a==='out'){await sb.auth.signOut()}
  else if(a==='del'){if(confirm('Remover este jogo?')){const r=await sb.from('games').delete().eq('id',id);if(r.error)say('Não foi possível remover.');else{closeAll();load()}}}
  else if(a==='nick'){const n=(prompt('Novo apelido:',name(me))||'').trim().slice(0,24);if(n){const r=await sb.from('profiles').update({name:n}).eq('id',me);if(r.error)say('Não foi possível salvar o apelido.');else load()}}
  else if(a==='dls'||a==='dlc'){const r=await sb.from('settings').update({deadline:a==='dls'?($('dli').value||null):null}).eq('id',1);if(r.error)say('Só o administrador pode definir o prazo.');else load()}
  else if(a==='proof'&&g){
    const nc=nconf(g);let ex='';
    if(g.user_id!==me)ex=confs.some(c=>c.game_id===g.id&&c.user_id===me&&c.rev===g.rev)?'<div>✅ Você já confirmou este comprovante</div>':`<button data-a="conf" data-id="${g.id}">✅ Confirmar comprovante</button>`;
    $('lb').innerHTML=`<div class="lbc"><img src="${esc(g.proof_url)}" alt="Comprovante"><div>${nc} ${nc===1?'confirmação':'confirmações'}</div>${ex}<button class="ghost" data-a="closelb">Fechar</button></div>`;$('lb').hidden=false;
  }
  else if(a==='conf'&&g){const r=await sb.from('confirmations').upsert({game_id:g.id,user_id:me,rev:g.rev},{onConflict:'game_id,user_id'});if(r.error)say('Não foi possível confirmar.');else{closeAll();say('Comprovante confirmado!');confetti();load()}}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('lb').hidden)$('lb').hidden=true;else closeAll()}});
window.addEventListener('hashchange',()=>{closeAll();render();window.scrollTo(0,0)});
document.addEventListener('change',async e=>{
  if(e.target.id!=='avf')return;const f=e.target.files[0];if(!f)return;
  try{await setAvatar(await upBlob(await square(f,240)));say('Foto atualizada!')}catch(err){say('Não foi possível enviar a foto.')}
});
