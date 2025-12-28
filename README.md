 Visão Geral
API RESTful desenvolvida em Node.js para gerenciamento completo de blog com autenticação JWT, CRUD de posts, sistema de contatos e analytics em tempo real.

✨ Funcionalidades Principais
🔐 Autenticação
Sistema JWT para área administrativa

Login protegido com credenciais

Validação de token automática

📝 Posts
CRUD completo de posts

Upload de imagens (até 5MB)

Categorias e tags

Status (publicado/rascunho)

Conteúdo HTML formatado

📧 Contatos
Envio de mensagens via formulário

Armazenamento em banco de dados

Notificação por e-mail

Gerenciamento administrativo

📊 Analytics
Monitoramento automático de acessos

Detecção de dispositivo (tipo, navegador, SO)

Envio de relatórios por e-mail

Rastreamento de IP e referência

🛠 Tecnologias
Backend
Node.js (>= 16.0.0)

Express.js - Framework web

SQLite3 - Banco de dados

JWT - Autenticação

Nodemailer - Envio de e-mails

Multer - Upload de arquivos

Frontend (Documentação)
Tailwind CSS - Estilização

AOS - Animações

Highlight.js - Syntax highlighting

Font Awesome - Ícones

Google Fonts - Tipografia

Outras Dependências
express-rate-limit - Limitação de requisições

helmet - Segurança HTTP

cors - Compartilhamento de recursos

dotenv - Variáveis de ambiente

📁 Estrutura do Projeto
text
blog-api/
├── database/
│   ├── contatos.db          # Banco de dados de contatos
│   ├── posts.db             # Banco de dados de posts
│   ├── contatosDb.js        # Modelo de contatos
│   └── postsDb.js           # Modelo de posts
├── public/
│   ├── uploads/             # Imagens e arquivos
│   ├── index.html           # Página inicial
│   ├── blog.html            # Lista de posts
│   ├── login.html           # Página de login
│   ├── admin.html           # Painel administrativo
│   └── error.html           # Erro 404
├── services/
│   ├── contato.js           # Serviço de contatos
│   ├── deviceInfo.js        # Detecção de dispositivos
│   ├── email.js             # Envio de e-mails
│   ├── filtroRotas.js       # Middleware de analytics
│   ├── innerHtmlPost.js     # Renderização de posts
│   ├── login.js             # Autenticação
│   ├── posts.js             # CRUD de posts
│   ├── testeEmail.js        # Teste de e-mail
│   └── upload.js            # Upload de arquivos
├── views/
│   └── post.js              # Template de post
├── server.js                # Arquivo principal
├── package.json             # Dependências
├── .env.example             # Modelo de configuração
└── README.md                # Documentação
⚙️ Instalação
Pré-requisitos
Node.js >= 16.0.0

npm >= 8.0.0

SQLite3 >= 3.0.0

512MB RAM mínimo

100MB espaço em disco

Passos
Clone o repositório

bash
git clone https://github.com/AdrianoSenaS/blog-api.git
cd blog-api
Instale as dependências

bash
npm install
Configure o ambiente

bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
Inicie o servidor

bash
# Produção
npm start

# Desenvolvimento
npm run dev
🔧 Configuração do Ambiente
Arquivo .env
env
# Servidor
PORT=3000
NODE_ENV=development

# Autenticação
ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=senha_segura_123
ADMIN_TOKEN=seu_token_jwt_super_secreto_aqui

# E-mail (SMTP)
SMTP_HOST=smtp.seuprovedor.com
SMTP_PORT=587
SMTP_USER=seu_email@dominio.com
SMTP_PASS=sua_senha_segura
REPORT_EMAIL=destino@dominio.com

# Banco de Dados
DB_PATH=./database

# Upload
UPLOAD_PATH=./public/uploads
MAX_FILE_SIZE=5242880  # 5MB
📡 Endpoints da API
Autenticação
POST /login - Obter token JWT

POST /token - Verificar token

Posts
GET /api/posts - Listar posts

GET /api/posts/:id - Buscar post específico

POST /api/posts - Criar post (autenticado)

PUT /api/posts/:id - Atualizar post (autenticado)

DELETE /api/posts/:id - Deletar post (autenticado)

Contatos
POST /api/contact - Enviar mensagem

GET /api/contact - Listar mensagens (autenticado)

Analytics
Monitoramento automático das rotas principais

E-mail com informações detalhadas de cada acesso

🚀 Deploy em Produção
Usando PM2 (Recomendado)
bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicação
pm2 start server.js --name "blog-api"

# Configurar inicialização automática
pm2 startup
pm2 save

# Monitorar
pm2 monit
pm2 logs blog-api
Configurações de Produção
env
NODE_ENV=production
PORT=80  # ou 443 para HTTPS
ADMIN_TOKEN=token_muito_longo_e_aleatorio_aqui
# Configurar SMTP real
🔒 Segurança
JWT Tokens para autenticação

Rate Limiting para prevenção de ataques

Helmet.js para headers de segurança

Validação de entrada em todos os endpoints

Upload seguro com validação de tipos e tamanhos

CORS configurado para origens específicas

📊 Analytics
O sistema coleta automaticamente:

Informações do dispositivo (tipo, marca, modelo)

Sistema operacional e versão

Navegador e versão

Localização via IP

Referência (de onde veio o acesso)

Hora exata do acesso

🤝 Contribuindo
Faça um fork do projeto

Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)

Commit suas mudanças (git commit -m 'Add: AmazingFeature')

Push para a branch (git push origin feature/AmazingFeature)

Abra um Pull Request

Padrões de Código
Use ESLint para manter padrão

Escreva comentários em português

Mantenha a estrutura de pastas

Teste suas mudanças localmente

📄 Licença
Este projeto é open source sob a licença MIT.

📞 Suporte e Contato
GitHub: AdrianoSenaS

LinkedIn: Adriano Sena Silva

WhatsApp: +55 64 93300-4882

Instagram: @adriano.sena.silva

⚠️ Troubleshooting
Problemas Comuns
Erro de porta já em uso

bash
# Encontre o processo usando a porta
sudo lsof -i :3000
# Mate o processo
kill -9 PID
Erro de permissão no upload

bash
sudo chmod -R 755 public/uploads
E-mail não está sendo enviado

Verifique configurações SMTP no .env

Teste com node services/testeEmail.js

Token JWT inválido

Gere novo token seguro:

bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
🔄 Changelog
Versão 1.0.0
API RESTful completa

Sistema de autenticação JWT

CRUD de posts com upload de imagens

Sistema de contatos com envio de e-mail

Analytics em tempo real

Documentação completa