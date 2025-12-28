require('dotenv').config();
const express = require('express');
const {filtraRotas} = require('./services/filtroRotas');
const {addPost, getAllPosts, getPostId, updatePostId, deletePostId, uploadPost} = require('./services/posts');
const {uploadPostFile} = require('./services/upload');
const { htmlInner } = require('./services/innerHtmlPost');
const { loginAdmin, tokemAdmin } = require('./services/login');
const { sendContact, getContacts} = require('./services/contato');
const { testEmail } = require('./services/testeEmail');

const app = express();
const PORT = 3000;

upload = uploadPostFile();


// --- Middlewares ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// ================================================================
// MIDDLEWARE DE TRACKING - DEVE VIR ANTES DE TODAS AS ROTAS!
// ================================================================

app.use((req, res, next) => {
  filtraRotas(req, res, next);
});


// ================================================================
// ROTAS PÚBLICAS (AGORA O MIDDLEWARE CAPTURA TODAS)
// ================================================================

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.get('/blog', (req, res) => res.sendFile(__dirname + '/public/blog.html'));
app.get('/privacidade', (req, res) => res.sendFile(__dirname + '/public/privacidade.html'));
app.get("/post", async (req, res) => {
  const id = req.query.id;
  htmlInner(id, PORT, res);
});

// ----------------------------------------------------------------
// ÁREA ADMIN
// ----------------------------------------------------------------
app.get('/login', (req, res) => res.sendFile(__dirname + '/public/login.html'));
app.get('/admin', (req, res) => res.sendFile(__dirname + '/public/admin.html'));
app.get('/admin/cadastrar', (req, res) => res.sendFile(__dirname + '/public/post-cadastro.html'));

// ----------------------------------------------------------------
// LOGIN
// ----------------------------------------------------------------
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  loginAdmin(username, password, res);
});

app.post('/token', (req, res) => {
  tokemAdmin(req, res);
});

// ----------------------------------------------------------------
// API BLOG (CRUD)
// ----------------------------------------------------------------

// Criar Post
app.post('/api/posts', upload.single('image'), async (req, res) => {
  await addPost(req, res);
});

// Listar posts
app.get('/api/posts', async (req, res) => {
  await getAllPosts(req, res);
});

// Buscar único
app.get('/api/posts/:id', async (req, res) => {
  await getPostId(req, res);
});

// Atualizar post
app.put('/api/posts/:id', upload.single('image'), async (req, res) => {
 await updatePostId(req, res);
});

// Deletar post
app.delete('/api/posts/:id', async (req, res) => {
  await deletePostId(req, res);
});

// ----------------------------------------------------------------
// UPLOAD DO TINYMCE
// ----------------------------------------------------------------
app.post('/api/upload', upload.single('file'), (req, res) => {
  uploadPost(req, res);
});


// ----------------------------------------------------------------
// FUNÇÃO PARA ENVIO DE CONTATO
// ----------------------------------------------------------------
app.post('/api/contact', async (req, res) => {
  sendContact(req, res);
});


// ----------------------------------------------------------------
// FUNÇÃO PARA PEGAR  CONTATO
// ----------------------------------------------------------------
app.get('/api/contact', async (req, res) => {
  getContacts(req, res);
});
// ----------------------------------------------------------------
// ROTA PARA TESTAR O ENVIO DE E-MAIL
// ----------------------------------------------------------------
app.get('/test-email', async (req, res) => {
 testEmail(req, res);
});

// ---------------------------------------------------------------
// ROTAS DE ERRO
//-----------------------------------------------------------------
// Middleware para rotas não encontradas (404)
app.use((req, res, next) => res.status(404).sendFile(__dirname + '/public/error.html'));

// Middleware para erros gerais (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(__dirname + '/public/error500.html')
});

// ----------------------------------------------------------------
// SERVER ON
// ----------------------------------------------------------------
app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 Servidor rodando em http://localhost:" + PORT);
  console.log("📧 E-mails serão enviados para: " + (process.env.REPORT_EMAIL || 'dry@adrianosena.dev.br'));
  console.log("🔗 Teste o envio de e-mail: http://localhost:" + PORT + "/test-email");
  console.log("=".repeat(60) + "\n");

  // Verificar configuração do e-mail
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️  AVISO: Variáveis de e-mail não configuradas no .env");
    console.warn("   Configure SMTP_USER e SMTP_PASS para enviar e-mails\n");
  }

});