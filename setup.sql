-- DISCORD GAMES · cole tudo isto no SQL Editor do Supabase e clique em Run

create table profiles(id uuid primary key references auth.users on delete cascade, name text not null check(char_length(name) between 1 and 24), avatar_url text);
create table admins(user_id uuid primary key references auth.users on delete cascade);
create table settings(id int primary key default 1 check(id=1), deadline date);
insert into settings(id) values(1);

create table games(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  title text not null check(char_length(title) between 1 and 80),
  hours numeric not null check(hours>0),
  start_date date not null,
  end_date date not null,
  difficulty numeric not null check(difficulty in (1,1.25,1.5,2)),
  platinum boolean not null default false,
  platform text,
  rating numeric check(rating between 0 and 10),
  comment text check(char_length(comment)<=6000),
  cover_url text,
  proof_url text not null,
  rev int not null default 1,
  created_at timestamptz default now(),
  check(end_date>=start_date),
  check(hours<=((end_date-start_date)+1)*16)
);

create table confirmations(
  game_id uuid references games on delete cascade,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  rev int not null,
  primary key(game_id,user_id)
);

-- confirmações antigas deixam de valer quando horas, datas, dificuldade, platina ou comprovante mudam
create function bump_rev() returns trigger language plpgsql as $$
begin
  if (new.hours,new.start_date,new.end_date,new.difficulty,new.platinum,new.proof_url)
     is distinct from (old.hours,old.start_date,old.end_date,old.difficulty,old.platinum,old.proof_url)
  then new.rev:=old.rev+1; else new.rev:=old.rev; end if;
  new.user_id:=old.user_id;
  return new;
end $$;
create trigger t_rev before update on games for each row execute function bump_rev();

alter table profiles enable row level security;
alter table admins enable row level security;
alter table settings enable row level security;
alter table games enable row level security;
alter table confirmations enable row level security;

create policy "ver perfis" on profiles for select to authenticated using(true);
create policy "criar meu perfil" on profiles for insert to authenticated with check(id=auth.uid());
create policy "editar meu perfil" on profiles for update to authenticated using(id=auth.uid());

create policy "ver jogos" on games for select to authenticated using(true);
create policy "criar meus jogos" on games for insert to authenticated with check(user_id=auth.uid());
create policy "editar meus jogos" on games for update to authenticated using(user_id=auth.uid());
create policy "apagar meus jogos" on games for delete to authenticated using(user_id=auth.uid());

create policy "ver confirmacoes" on confirmations for select to authenticated using(true);
create policy "confirmar jogo de outro" on confirmations for insert to authenticated
  with check(user_id=auth.uid() and exists(select 1 from games g where g.id=game_id and g.user_id<>auth.uid()));
create policy "atualizar minha confirmacao" on confirmations for update to authenticated using(user_id=auth.uid());
create policy "apagar minha confirmacao" on confirmations for delete to authenticated using(user_id=auth.uid());

create policy "ver prazo" on settings for select to authenticated using(true);
create policy "admin define prazo" on settings for update to authenticated using(exists(select 1 from admins where user_id=auth.uid()));
create policy "ver se sou admin" on admins for select to authenticated using(user_id=auth.uid());

insert into storage.buckets(id,name,public) values('imagens','imagens',true);
create policy "enviar minhas imagens" on storage.objects for insert to authenticated
  with check(bucket_id='imagens' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "apagar minhas imagens" on storage.objects for delete to authenticated
  using(bucket_id='imagens' and (storage.foldername(name))[1]=auth.uid()::text);

-- Aprovações com data e hora (rode se o seu banco foi criado antes desta versão)
alter table confirmations add column if not exists created_at timestamptz not null default now();
create or replace function stamp_conf() returns trigger language plpgsql as $$
begin new.created_at:=now(); return new; end $$;
drop trigger if exists t_stamp on confirmations;
create trigger t_stamp before insert or update on confirmations for each row execute function stamp_conf();
-- DISCORD GAMES · atualização 2 · cole no SQL Editor do Supabase e clique em Run

-- 1) título do jogo não pode ser só espaços (vale para jogos novos e editados)
alter table games add constraint games_title_nonblank check(char_length(btrim(title))>=1) not valid;

-- 2) perfil: sobre mim e links das plataformas
alter table profiles add column if not exists about text check(char_length(about)<=500);
alter table profiles add column if not exists steam text check(char_length(steam)<=120);
alter table profiles add column if not exists xbox text check(char_length(xbox)<=120);
alter table profiles add column if not exists playstation text check(char_length(playstation)<=120);
alter table profiles add column if not exists nintendo text check(char_length(nintendo)<=120);

-- 3) comentários nos jogos
create table comments(
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games on delete cascade,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  body text not null check(char_length(btrim(body)) between 1 and 500),
  created_at timestamptz not null default now()
);
alter table comments enable row level security;
create policy "ver comentarios" on comments for select to authenticated using(true);
create policy "comentar" on comments for insert to authenticated with check(user_id=auth.uid());
create policy "apagar comentario meu ou do meu jogo" on comments for delete to authenticated
  using(user_id=auth.uid() or exists(select 1 from games g where g.id=game_id and g.user_id=auth.uid()));

-- 4) likes e deslikes (uma rodada por pessoa em cada jogo ou comentário; não dá para avaliar o próprio)
create table reactions(
  target_type text not null check(target_type in ('game','comment')),
  target_id uuid not null,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  likes int not null default 0 check(likes between 0 and 500),
  dislikes int not null default 0 check(dislikes between 0 and 500),
  created_at timestamptz not null default now(),
  primary key(target_type,target_id,user_id)
);
alter table reactions enable row level security;
create policy "ver reacoes" on reactions for select to authenticated using(true);
create policy "reagir ao conteudo de outro" on reactions for insert to authenticated with check(
  user_id=auth.uid() and (
    (target_type='game' and exists(select 1 from games g where g.id=target_id and g.user_id<>auth.uid()))
    or (target_type='comment' and exists(select 1 from comments c where c.id=target_id and c.user_id<>auth.uid()))
  ));
