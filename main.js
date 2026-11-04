// Login com Google e inicialização
$('gl').onclick=()=>sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});

async function boot(s){
  if(!s){me=null;$('app').hidden=true;$('login').hidden=false;return}
  if(me===s.user.id)return;
  me=s.user.id;$('login').hidden=true;$('app').hidden=false;{const m0=s.user.user_metadata||{};gAvatar=m0.avatar_url||m0.picture||null}
  await load();
  if(!profs[me]){
    const m=s.user.user_metadata||{},n=((m.name||m.full_name||'Jogador').split(' ')[0]).slice(0,24);
    await sb.from('profiles').insert({id:me,name:n,avatar_url:m.avatar_url||m.picture||null});
    await load();
  }
}
sb.auth.onAuthStateChange((_ev,s)=>{setTimeout(()=>boot(s),0)});
