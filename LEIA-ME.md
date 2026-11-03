# DISCORD GAMES · como colocar no ar

Você já rodou o `setup.sql` no Supabase. Faltam 5 passos.

## 1. Pegar os dados do Supabase e colar no index.html
No painel do Supabase, abra **Project Settings → API** (o nome do menu pode variar um pouco).
Copie a **Project URL** e a **chave pública** (anon / publishable) e cole no topo do script do `index.html`:

    const SUPABASE_URL='https://xxxx.supabase.co';
    const SUPABASE_KEY='sua-chave-publica';

Essa chave é pública de propósito. Quem protege os dados são as regras do `setup.sql`.
Nunca use a chave `service_role` no site.

## 2. Criar o login com Google (Google Cloud)
1. Entre em console.cloud.google.com e crie um projeto.
2. Em **APIs e serviços → Tela de permissão OAuth**, configure o app (tipo **Externo**) com nome DISCORD GAMES e seu e-mail.
3. Em **Credenciais → Criar credenciais → ID do cliente OAuth → Aplicativo da Web**.
4. Em **URIs de redirecionamento autorizados**, cole a *Callback URL* que aparece no Supabase em **Authentication → Providers → Google**. Ela tem este formato: `https://SEU-PROJETO.supabase.co/auth/v1/callback`
5. Copie o **ID do cliente** e a **Chave secreta**.

## 3. Ligar o Google no Supabase
Em **Authentication → Providers → Google**: ative, cole o ID do cliente e a chave secreta e salve.

## 4. Subir o site no GitHub Pages
1. Crie uma conta no github.com e um repositório **público** (ex.: `discord-games`).
2. Envie o arquivo `index.html` (Add file → Upload files).
3. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
4. Em alguns minutos o site fica em `https://SEU-USUARIO.github.io/discord-games/`.

## 5. Avisar o Supabase e o Google do endereço do site
- Supabase → **Authentication → URL Configuration**: em **Site URL** coloque o endereço do GitHub Pages e adicione o mesmo endereço em **Redirect URLs**.
- Google Cloud → no cliente OAuth, em **Origens JavaScript autorizadas**, adicione `https://SEU-USUARIO.github.io`.

## Seu usuário administrador (define o prazo)
Entre uma vez no site com o Google. Depois, no SQL Editor do Supabase, rode (trocando o e-mail):

    insert into admins select id from auth.users where email='seu@gmail.com';

## Atenção
- **Amigos não conseguem entrar?** Se a tela de permissão do Google estiver em modo de teste, só entram os e-mails cadastrados como usuários de teste. Adicione os e-mails dos amigos ali, ou publique o app.
- **Projeto pausado:** no plano gratuito do Supabase, o projeto pode ser pausado depois de cerca de uma semana sem uso. Se o site parar, reative no painel.
- A foto de perfil é a da conta Google de cada pessoa.

## Estrutura de arquivos
    index.html       página principal
    css/style.css    base e componentes
    css/theme.css    fontes, tamanhos padronizados e efeitos
    js/config.js     chaves do Supabase (é o único que você edita)
    js/utils.js      regras de pontos e validações
    js/data.js       carregamento dos dados
    js/render.js     Home, Estante, Perfil, cards e pop-up
    js/upload.js     imagens e foto de perfil
    js/form.js       formulário de jogos
    js/actions.js    cliques e navegação
    js/fx.js         partículas e confete
    js/main.js       login e inicialização
Suba a pasta inteira no GitHub, mantendo as subpastas `css` e `js`.
