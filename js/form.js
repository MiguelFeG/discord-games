// Formulário de registrar e editar jogos
function readForm(){return{title:$('t').value.trim(),hours:parseFloat($('hr').value)||0,start_date:$('ds').value,end_date:$('dt').value,difficulty:parseFloat($('df').value)||0,platinum:$('pl100').checked,platform:$('pf2').value||null,rating:$('nt').value===''?null:Math.min(10,Math.max(0,+$('nt').value)),comment:$('cm').value.trim()||null}}
function cnt(){$('cc').textContent=$('cm').value.length+' / 6000'}
function pv(){cnt();const g=readForm();const e=g.start_date&&g.end_date&&g.hours>0?dateErr(g):'';$('pv').textContent=e||(g.hours>0&&g.difficulty&&g.start_date&&g.end_date?`Este jogo vale ${pts(g)} pontos.`:'')}
['hr','df','pl100','ds','dt','cm'].forEach(i=>{$(i).addEventListener('input',pv);$(i).addEventListener('change',pv)});
$('prf').onchange=e=>{$('pl').firstChild.nodeValue=e.target.files[0]?'🧾 '+e.target.files[0].name:'🧾 Comprovante *'};
$('img').onchange=e=>{$('fl').firstChild.nodeValue=e.target.files[0]?'📷 '+e.target.files[0].name:'📷 Capa (opcional)'};

function openForm(id){
  editing=id||null;const g=id?games.find(x=>x.id===id):null;$('f').reset();
  $('fl').firstChild.nodeValue='📷 Capa (opcional)';$('pl').firstChild.nodeValue='🧾 Comprovante *';
  if(g){$('t').value=g.title;$('hr').value=g.hours;$('ds').value=g.start_date;$('dt').value=g.end_date;$('df').value=String(g.difficulty);$('pl100').checked=g.platinum;$('pf2').value=g.platform||'';$('nt').value=g.rating??'';$('cm').value=g.comment||''}
  else $('dt').value=today();
  $('mt').textContent=g?'Editar jogo':'Registrar jogo zerado';$('b').textContent=g?'Salvar alterações':'Adicionar';
  $('ov').hidden=false;document.body.style.overflow='hidden';pv();
}
function closeAll(){$('ov').hidden=true;$('lb').hidden=true;$('dp').hidden=true;document.body.style.overflow='';editing=null}

$('f').onsubmit=async e=>{
  e.preventDefault();const btn=$('b');btn.disabled=true;
  try{
    const g=readForm(),ed=editing?games.find(x=>x.id===editing):null,pfile=$('prf').files[0],cfile=$('img').files[0];
    if(!pfile&&!ed)return say('O comprovante é obrigatório.');
    if(!(g.hours>0)||!g.difficulty)return say('Informe as horas jogadas e a dificuldade.');
    const de=dateErr(g);if(de)return say(de);
    g.proof_url=pfile?await up(pfile,1000):ed.proof_url;
    g.cover_url=cfile?await up(cfile,360):(ed?ed.cover_url:null);
    const r=ed?await sb.from('games').update(g).eq('id',ed.id):await sb.from('games').insert(g);
    if(r.error)return say('Não foi possível salvar: '+r.error.message);
    closeAll();await load();
  }catch(err){say('Não consegui enviar a imagem. Tente de novo.')}
  finally{btn.disabled=false}
};
