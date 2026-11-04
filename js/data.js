// Carregamento dos dados do Supabase
async function load(){
  const [g,p,c,s,a,cm,rx]=await Promise.all([
    sb.from('games').select('*').order('end_date',{ascending:false}),
    sb.from('profiles').select('*'),sb.from('confirmations').select('*'),
    sb.from('settings').select('deadline').eq('id',1).maybeSingle(),
    sb.from('admins').select('user_id').maybeSingle(),
    sb.from('comments').select('*').order('created_at'),sb.from('reactions').select('*')]);
  if(g.error){say('Erro ao carregar os dados: '+g.error.message);return}
  games=g.data||[];profs=Object.fromEntries((p.data||[]).map(x=>[x.id,x]));confs=c.data||[];cmts=cm.data||[];reacts=rx.data||[];
  deadline=s.data?.deadline||null;isAdmin=!!a.data;render();
}
