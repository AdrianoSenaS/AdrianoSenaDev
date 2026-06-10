# 📘 CMS Blog Platform — Node.js + JavaScript

Sistema completo de gerenciamento de conteúdo (CMS) desenvolvido com **Node.js**, **Express.js**, **HTML**, **CSS** e **JavaScript Vanilla**, oferecendo painel administrativo, gerenciamento de posts, analytics, comentários, RSS Feed, compartilhamento social e autenticação segura.

Ideal para blogs, portais de conteúdo, sites institucionais e projetos profissionais.

---

# 🚀 Principais Recursos

## 🔐 Autenticação

* Login administrativo protegido
* Autenticação JWT
* Validação automática de token
* Proteção de rotas administrativas

---

## 📝 Gerenciamento de Posts

* CRUD completo de publicações
* Editor HTML
* Upload de imagens
* Status de publicação
* Rascunhos
* URLs amigáveis (Slug)
* SEO otimizado
* Sistema de categorias
* Sistema de tags

### Exemplo de URL

Antes:

```url
/post/15
```

Agora:

```url
/post/como-criar-uma-loja-virtual
```

---

## 📡 RSS Feed

* Geração automática de RSS
* Compatível com agregadores de notícias
* Atualização automática conforme novos conteúdos

---

## ❤️ Engajamento

* Sistema de curtidas
* Compartilhamento em redes sociais
* Sistema de comentários
* Integração com plataformas sociais

---

## 📧 Sistema de Contato

* Formulário de contato
* Armazenamento de mensagens
* Notificações por e-mail
* Gerenciamento pelo painel administrativo

---

## 📊 Analytics Integrado

Monitoramento completo de acessos:

* Visitantes
* Visualizações de páginas
* Sistema operacional
* Navegador
* Dispositivo utilizado
* Endereço IP
* Origem do acesso
* Data e horário

Tudo acessível através do painel administrativo.

---

# 🎨 Painel Administrativo

O CMS possui uma área administrativa completa para gerenciamento do sistema.

### Recursos disponíveis

* Dashboard
* Gestão de Posts
* Categorias
* Tags
* Comentários
* Contatos
* Usuários
* Analytics
* Configurações
* Dispositivos monitorados

---

# ⚡ Performance

* Otimização de carregamento
* Cache de recursos estáticos
* Estrutura otimizada para SEO
* Melhor gerenciamento de rotas
* Redução de consultas desnecessárias

---

# 🛠 Tecnologias Utilizadas

## Backend

* Node.js
* Express.js
* SQLite3
* JWT
* Multer
* Nodemailer
* Helmet
* CORS
* Dotenv
* Express Rate Limit

## Frontend

* HTML5
* CSS3
* JavaScript Vanilla
* Font Awesome
* Highlight.js
* AOS Animation

---

# 📁 Estrutura do Projeto

```bash
blog-api/
│
├── database/
├── public/
│   ├── uploads/
│   ├── admin.html
│   ├── blog.html
│   ├── login.html
│   └── index.html
│
├── services/
├── views/
├── server.js
├── package.json
└── README.md
```

---

# ⚙️ Instalação

## Requisitos

* Node.js 16+
* NPM 8+
* SQLite3

## Clonar Projeto

```bash
git clone https://github.com/AdrianoSenaS/blog-api.git
cd blog-api
```

## Instalar Dependências

```bash
npm install
```

## Configurar Ambiente

```bash
cp .env.example .env
```

## Executar

Produção:

```bash
npm start
```

Desenvolvimento:

```bash
npm run dev
```

---

# 🔧 Variáveis de Ambiente

```env
PORT=3000

ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=password

ADMIN_TOKEN=token_super_secreto

SMTP_HOST=smtp.exemplo.com
SMTP_PORT=587
SMTP_USER=email@exemplo.com
SMTP_PASS=senha

REPORT_EMAIL=admin@exemplo.com

DB_PATH=./database

UPLOAD_PATH=./public/uploads
MAX_FILE_SIZE=5242880
```

---

# 📡 Principais Endpoints

## Autenticação

```http
POST /login
POST /token
```

## Posts

```http
GET /api/posts
GET /api/posts/:slug

POST /api/posts
PUT /api/posts/:slug
DELETE /api/posts/:slug
```

## Contatos

```http
POST /api/contact
GET /api/contact
```

---

# 🚀 Deploy com PM2

Instalação:

```bash
npm install -g pm2
```

Executar:

```bash
pm2 start server.js --name cms-blog
pm2 startup
pm2 save
```

Monitoramento:

```bash
pm2 monit
pm2 logs cms-blog
```

---

# 🔒 Segurança

* JWT Authentication
* Helmet
* Rate Limiting
* Upload Seguro
* Validação de Dados
* Proteção de Rotas
* Controle de Acesso

---

# 🗺 Roadmap

## Próximas versões

* [ ] MySQL
* [ ] PostgreSQL
* [ ] Editor Rich Text
* [ ] Multiusuários
* [ ] Permissões avançadas
* [ ] Dashboard avançado
* [ ] API pública
* [ ] Dark Mode

---

# 📄 Licença

MIT License

---

# 👨‍💻 Autor

**Adriano Sena**

Desenvolvedor Full Stack

* Node.js
* JavaScript
* TypeScript
* C#
* Linux
* VPS
* Infraestrutura

Website:
https://www.adrianosena.dev.br

GitHub:
https://github.com/AdrianoSenaS

LinkedIn:
https://www.linkedin.com

---

⭐ Se este projeto foi útil para você, deixe uma estrela no repositório.
