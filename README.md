Blog API — Node.js RESTful

API RESTful desenvolvida em Node.js para gerenciamento completo de blogs, com autenticação JWT, CRUD de posts, sistema de contatos e analytics em tempo real.

Visão Geral

Esta API fornece uma solução completa para blogs modernos, incluindo:

Área administrativa protegida por JWT

Gerenciamento de posts com upload de imagens

Sistema de contatos com notificação por e-mail

Coleta automática de dados de acesso (analytics)

Ideal para blogs pessoais, institucionais ou projetos profissionais.

Funcionalidades Principais
Autenticação

Autenticação via JWT

Login administrativo protegido

Validação automática de token

Posts

CRUD completo de posts

Upload de imagens (até 5MB)

Suporte a categorias e tags

Status de publicação (publicado / rascunho)

Conteúdo em HTML formatado

Contatos

Envio de mensagens via formulário

Armazenamento em banco de dados

Notificação automática por e-mail

Gerenciamento administrativo

Analytics

Monitoramento automático de acessos

Detecção de dispositivo (tipo, navegador e SO)

Rastreamento de IP e referência

Relatórios enviados por e-mail

Tecnologias Utilizadas
Backend

Node.js (>= 16.0.0)

Express.js

SQLite3

JWT (JSON Web Token)

Nodemailer

Multer

Frontend (Documentação)

Tailwind CSS

AOS

Highlight.js

Font Awesome

Google Fonts

Outras Dependências

express-rate-limit — Limitação de requisições

helmet — Segurança HTTP

cors — Compartilhamento de recursos

dotenv — Variáveis de ambiente

Estrutura do Projeto
blog-api/
├── database/
│   ├── contatos.db
│   ├── posts.db
│   ├── contatosDb.js
│   └── postsDb.js
├── public/
│   ├── uploads/
│   ├── index.html
│   ├── blog.html
│   ├── login.html
│   ├── admin.html
│   └── error.html
├── services/
│   ├── contato.js
│   ├── deviceInfo.js
│   ├── email.js
│   ├── filtroRotas.js
│   ├── innerHtmlPost.js
│   ├── login.js
│   ├── posts.js
│   ├── testeEmail.js
│   └── upload.js
├── views/
│   └── post.js
├── server.js
├── package.json
├── .env.example
└── README.md

Instalação
Pré-requisitos

Node.js >= 16.0.0

npm >= 8.0.0

SQLite3 >= 3.0.0

512MB de RAM

100MB de espaço em disco

Passos

Clone o repositório:

git clone https://github.com/AdrianoSenaS/blog-api.git
cd blog-api


Instale as dependências:

npm install


Configure o ambiente:

cp .env.example .env


Inicie o servidor:

# Produção
npm start

# Desenvolvimento
npm run dev

Configuração do Ambiente
.env
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
MAX_FILE_SIZE=5242880

Endpoints da API
Autenticação

POST /login — Obter token JWT

POST /token — Validar token

Posts

GET /api/posts

GET /api/posts/:id

POST /api/posts 

PUT /api/posts/:id 

DELETE /api/posts/:id 

Contatos

POST /api/contact

GET /api/contact 

Analytics

Monitoramento automático das rotas

Envio de relatórios por e-mail

Deploy em Produção
Usando PM2 (Recomendado)
npm install -g pm2
pm2 start server.js --name "blog-api"
pm2 startup
pm2 save


Monitoramento:

pm2 monit
pm2 logs blog-api

Segurança

Autenticação JWT

Rate Limiting

Helmet.js

Validação de dados

Upload seguro (tipo e tamanho)

CORS configurado

Dados Coletados (Analytics)

Dispositivo

Sistema operacional

Navegador

Localização via IP

Referência de acesso

Data e hora exata

Contribuindo

Fork o projeto

Crie sua branch:

git checkout -b feature/NovaFeature


Commit:

git commit -m "Add: NovaFeature"


Push:

git push origin feature/NovaFeature


Abra um Pull Request

Licença

Este projeto é open source sob a licença MIT.

Contato

GitHub: AdrianoSenaS

LinkedIn: Adriano Sena Silva

WhatsApp: +55 64 93300-4882

Instagram: @adriano.sena.silva

Troubleshooting
Porta em uso
sudo lsof -i :3000
kill -9 PID

Erro de permissão no upload
sudo chmod -R 755 public/uploads

Token JWT inválido
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Changelog
v1.0.0

API RESTful completa

Autenticação JWT

CRUD de posts

Sistema de contatos

Analytics em tempo real

Documentação completa
