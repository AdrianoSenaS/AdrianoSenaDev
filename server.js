require('dotenv').config();
const express = require('express');
const DeviceDetector = require('device-detector-js');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const UAParser = require('ua-parser-js');

const { createPost, getPosts, getPostById, updatePost, deletePost } = require('./database/postsDB');
const { createContact, listContacts } = require('./database/contatosDb');
const {HtmlPost} = require('./views/post');

const app = express();
const PORT = 3000;

// --- Upload (TinyMCE + capa do post) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- Credenciais Admin ---
const adminUser = {
  email: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD
};

// --- Middlewares ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// ---------------------------------------------
// Configuração do Nodemailer
// ---------------------------------------------
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: true
    }
  });
};

// ---------------------------------------------
// Função para gerar slug
// ---------------------------------------------
function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ---------------------------------------------
// Função para obter informações do dispositivo
// ---------------------------------------------
function getDeviceInfo(userAgent, req) {
  const deviceDetector = new DeviceDetector();
  const device = deviceDetector.parse(userAgent);

  // Obter IP real (considerando proxies, Cloudflare, etc.)
  const getClientIP = (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip;
  };

  const ip = getClientIP(req);

  return {
    timestamp: new Date().toISOString(),
    ip: ip,
    device: {
      // Informações do dispositivo
      type: device.device?.type || 'desktop',
      brand: device.device?.brand || 'Unknown',
      model: device.device?.model || 'Unknown',

      // Informações do sistema operacional
      os_name: device.os?.name || 'Unknown',
      os_version: device.os?.version || 'Unknown',
      os_platform: device.os?.platform,

      // Informações do navegador
      browser_name: device.client?.name || 'Unknown',
      browser_version: device.client?.version || 'Unknown',
      browser_type: device.client?.type,
      browser_engine: device.client?.engine,

      // Informações adicionais
      is_bot: device.bot || false,
      bot_name: device.bot ? device.bot.name || 'Unknown' : null
    },
    user_agent: userAgent,
    url: req.originalUrl, // Alterado de req.url para req.originalUrl para capturar URL completa
    referer: req.headers.referer || 'Direct',
    language: req.headers['accept-language'] || 'Unknown',
    hostname: req.hostname,
    method: req.method,
    protocol: req.protocol
  };
}

// ---------------------------------------------
// Função para enviar e-mail com detalhes do acesso
// ---------------------------------------------
async function sendAccessEmail(deviceInfo) {
  try {
    // Não enviar e-mail para bots
    if (deviceInfo.device.is_bot) {
      console.log('🤖 Bot detectado, e-mail não enviado');
      return false;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"Analytics do Site" <${process.env.SMTP_USER}>`,
      to: process.env.REPORT_EMAIL,
      subject: `📱 Novo acesso - ${deviceInfo.device.brand} ${deviceInfo.device.model} | ${deviceInfo.url}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
                        .info-box { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #4CAF50; }
                        .highlight { color: #4CAF50; font-weight: bold; }
                        .device-icon { font-size: 24px; margin-right: 10px; }
                        .url-box { background: #f0f0f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📊 Novo Acesso Detectado</h1>
                            <p>${new Date(deviceInfo.timestamp).toLocaleString('pt-BR')}</p>
                        </div>
                        <div class="content">
                            <div class="info-box">
                                <h2>📍 Informações do Acesso</h2>
                                <p><strong>Data/Hora:</strong> ${new Date(deviceInfo.timestamp).toLocaleString('pt-BR')}</p>
                                <p><strong>URL Completa:</strong> ${deviceInfo.protocol}://${deviceInfo.hostname}${deviceInfo.url}</p>
                                <p><strong>Método:</strong> ${deviceInfo.method}</p>
                                <p><strong>Referência:</strong> ${deviceInfo.referer}</p>
                                <p><strong>Idioma:</strong> ${deviceInfo.language}</p>
                                <div class="url-box">
                                    <strong>IP:</strong> ${deviceInfo.ip}
                                </div>
                            </div>
                            
                            <div class="info-box">
                                <h2>📱 Informações do Dispositivo</h2>
                                <p><strong>Dispositivo:</strong> ${deviceInfo.device.brand} ${deviceInfo.device.model}</p>
                                <p><strong>Tipo:</strong> ${deviceInfo.device.type}</p>
                                <p><strong>Sistema Operacional:</strong> ${deviceInfo.device.os_name} ${deviceInfo.device.os_version}</p>
                                <p><strong>Navegador:</strong> ${deviceInfo.device.browser_name} ${deviceInfo.device.browser_version}</p>
                                <p><strong>É Bot?:</strong> ${deviceInfo.device.is_bot ? 'Sim' : 'Não'}</p>
                                ${deviceInfo.device.bot_name ? `<p><strong>Nome do Bot:</strong> ${deviceInfo.device.bot_name}</p>` : ''}
                            </div>
                            
                            <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 5px;">
                                <p><strong>🔍 Detalhes Técnicos:</strong></p>
                                <p><strong>User Agent:</strong></p>
                                <p style="word-break: break-all; font-size: 12px; background: #f0f0f0; padding: 10px; border-radius: 5px;">
                                    ${deviceInfo.user_agent}
                                </p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
      text: `📊 NOVO ACESSO DETECTADO

Data/Hora: ${new Date(deviceInfo.timestamp).toLocaleString('pt-BR')}
URL: ${deviceInfo.protocol}://${deviceInfo.hostname}${deviceInfo.url}
Método: ${deviceInfo.method}
Referência: ${deviceInfo.referer}
Idioma: ${deviceInfo.language}
IP: ${deviceInfo.ip}

--- DISPOSITIVO ---
Marca/Modelo: ${deviceInfo.device.brand} ${deviceInfo.device.model}
Tipo: ${deviceInfo.device.type}
Sistema: ${deviceInfo.device.os_name} ${deviceInfo.device.os_version}
Navegador: ${deviceInfo.device.browser_name} ${deviceInfo.device.browser_version}
É Bot: ${deviceInfo.device.is_bot ? 'Sim' : 'Não'}
${deviceInfo.device.bot_name ? `Nome do Bot: ${deviceInfo.device.bot_name}` : ''}

--- DETALHES TÉCNICOS ---
User Agent: ${deviceInfo.user_agent}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 E-mail enviado com sucesso:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error.message);
    return false;
  }
}

// ================================================================
// MIDDLEWARE DE TRACKING - DEVE VIR ANTES DE TODAS AS ROTAS!
// ================================================================

// Middleware para capturar TODOS os acessos

// Middleware para capturar apenas as rotas especificadas
app.use((req, res, next) => {
  // Ignorar arquivos estáticos para reduzir logs
  const ignoredPaths = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.map'];
  const shouldIgnore = ignoredPaths.some(ext => req.path.endsWith(ext));

  if (shouldIgnore) {
    return next();
  }

  // Rotas que devem ser monitoradas e enviar email
  const monitoredRoutes = [
    '',
    '/',           // Página inicial
    '/blog',       // Página do blog
    '/privacidade' // Página de privacidade
  ];

  // Verificar se é a rota /post (com query string id)
  const isPostRoute = req.path === '/post' && req.query.id;

  // Verificar se a rota atual está na lista de rotas monitoradas ou é uma rota /post válida
  if (monitoredRoutes.includes(req.path) || isPostRoute) {
    const userAgent = req.headers['user-agent'] || '';
    const deviceInfo = getDeviceInfo(userAgent, req);

    // Log no console
    console.log('\n' + '='.repeat(60));
    console.log('📱 ACESSO MONITORADO DETECTADO');
    console.log('='.repeat(60));
    console.log(`📅 Data/Hora: ${new Date(deviceInfo.timestamp).toLocaleString('pt-BR')}`);
    console.log(`📍 IP: ${deviceInfo.ip}`);
    console.log(`🌐 URL: ${deviceInfo.protocol}://${deviceInfo.hostname}${deviceInfo.url}`);
    console.log(`🖥️  Dispositivo: ${deviceInfo.device.brand} ${deviceInfo.device.model}`);
    console.log(`📱 Tipo: ${deviceInfo.device.type}`);
    console.log(`💻 Sistema: ${deviceInfo.device.os_name} ${deviceInfo.device.os_version}`);
    console.log(`🌐 Navegador: ${deviceInfo.device.browser_name} ${deviceInfo.device.browser_version}`);
    console.log(`🤖 É Bot: ${deviceInfo.device.is_bot ? 'Sim' : 'Não'}`);
    console.log(`🔗 Referência: ${deviceInfo.referer}`);
    console.log('='.repeat(60));

    // Enviar e-mail APENAS para acessos humanos (não bots) nas rotas monitoradas
    if (!deviceInfo.device.is_bot) {
      sendAccessEmail(deviceInfo).catch(err => {
        console.error('❌ Falha ao enviar e-mail:', err.message);
      });
    }

    // Salvar no banco de dados (se necessário)

  } else {
    // Para rotas não monitoradas, apenas log básico
    console.log(`🔍 Acesso não monitorado: ${req.method} ${req.originalUrl}`);
  }

  next();
});
// ================================================================
// ROTAS PÚBLICAS (AGORA O MIDDLEWARE CAPTURA TODAS)
// ================================================================

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.get('/blog', (req, res) => res.sendFile(__dirname + '/public/blog.html'));
app.get('/privacidade', (req, res) => res.sendFile(__dirname + '/public/privacidade.html'));

app.get("/post", async (req, res) => {
  const id = req.query.id;

  // Busca dados da API
  try {
    const response = await fetch(`http://localhost:${PORT}/api/posts/${id}`);
    const post = await response.json();

    const html = HtmlPost(post, id);

    res.send(html);
  } catch (error) {
    console.error('Erro ao carregar post:', error);
    res.status(500).send('Erro ao carregar o post');
  }
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
  if (username === adminUser.email && password === adminUser.password) {
    res.send(process.env.ADMIN_TOKEN);
    return;
  }
  return res.redirect("/login");
});

app.post('/token', (req, res) => {
  const authHeader = req.headers.authorization;
  authHeader === `Bearer ${process.env.ADMIN_TOKEN}` ?
    res.send({ valid: true }) :
    res.status(401).send({ valid: false });
});

// ----------------------------------------------------------------
// API BLOG (CRUD)
// ----------------------------------------------------------------

// Criar Post
app.post('/api/posts', upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : data.image || "";

    const post = {
      title: data.title || "",
      excerpt: data.excerpt || "",
      image: imageUrl,
      category: data.category || "",
      status: data.status || "draft",
      author: data.author || "adriano",
      comments: data.comments === "false" ? false : true,
      content: data.content || "",
      date: data.date || new Date().toISOString(),
      featured: data.featured === "true",
      meta: data.meta || "",
      slug: data.slug || generateSlug(data.title || Date.now().toString()),
      tags: data.tags ? data.tags.split(",").map(t => t.trim()) : []
    };

    const result = await createPost(post);
    res.json({
      success: true,
      id: result.id,
      post
    });

  } catch (err) {
    console.error("Erro ao criar post:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Listar posts
app.get('/api/posts', async (req, res) => {
  const data = await getPosts();
  res.json(data);
});

// Buscar único
app.get('/api/posts/:id', async (req, res) => {
  const data = await getPostById(req.params.id);
  res.json(data);
});

// Atualizar post
app.put('/api/posts/:id', upload.single('image'), async (req, res) => {
  const data = req.body;
  let imageUrl = data.oldImage;
  if (req.file) imageUrl = `/uploads/${req.file.filename}`;

  const post = {
    title: data.title || "",
    excerpt: data.excerpt || "",
    image: imageUrl,
    category: data.category || "",
    status: data.status || "draft",
    author: data.author || "adriano",
    comments: data.comments === "false" ? false : true,
    content: data.content || "",
    date: data.date || new Date().toISOString(),
    featured: data.featured === "true",
    meta: data.meta || "",
    slug: data.slug || generateSlug(data.title || Date.now().toString()),
    tags: data.tags ? data.tags.split(",").map(t => t.trim()) : []
  };

  await updatePost(req.params.id, post);
  res.json({ success: true, post });
});

// Deletar post
app.delete('/api/posts/:id', async (req, res) => {
  await deletePost(req.params.id);
  res.json({ success: true });
});

// ----------------------------------------------------------------
// UPLOAD DO TINYMCE
// ----------------------------------------------------------------
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({
    location: `/uploads/${req.file.filename}`
  });
});


// ----------------------------------------------------------------
// FUNÇÃO PARA ENVIO DE CONTATO
// ----------------------------------------------------------------
app.post('/api/contact', async (req, res) => {
  console.log("REQUISIÇÃO DE CONTATO RECEBIDA:", req.body);

  const { name, email, status, project, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  await createContact({ name, email, status, project, message });

  res.json({ success: true });
});


// ----------------------------------------------------------------
// FUNÇÃO PARA PEGAR  CONTATO
// ----------------------------------------------------------------
app.get('/api/contact', async (req, res) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (err) {
    console.error("Erro ao buscar contatos:", err);
    res.status(500).json({ error: "Erro ao buscar contatos:", err });
  }
});
// ----------------------------------------------------------------
// ROTA PARA TESTAR O ENVIO DE E-MAIL
// ----------------------------------------------------------------
app.get('/test-email', async (req, res) => {
  const testDeviceInfo = {
    timestamp: new Date().toISOString(),
    ip: '192.168.1.1',
    device: {
      brand: 'Apple',
      model: 'iPhone 12',
      type: 'smartphone',
      os_name: 'iOS',
      os_version: '16.5',
      browser_name: 'Safari',
      browser_version: '16.5',
      is_bot: false,
      bot_name: null
    },
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
    url: '/test-email',
    referer: 'https://google.com',
    language: 'pt-BR,pt;q=0.9',
    hostname: 'localhost',
    method: 'GET',
    protocol: 'http'
  };

  try {
    const result = await sendAccessEmail(testDeviceInfo);
    if (result) {
      res.json({ success: true, message: 'E-mail de teste enviado com sucesso!' });
    } else {
      res.json({ success: false, message: 'Falha ao enviar e-mail de teste' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------------------
// ROTA PARA VISUALIZAR ACESSOS RECENTES (ADMIN)
// ----------------------------------------------------------------
app.get('/admin/access-logs', async (req, res) => {
  // Verificar autenticação
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${process.env.ADMIN_TOKEN || 'admin123'}`) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    // Aqui você implementaria a lógica para buscar logs do banco de dados
    // Por enquanto, retornamos uma mensagem
    res.json({
      message: 'Endpoint de logs de acesso. Implemente a lógica para buscar do banco de dados.',
      note: 'Os logs estão sendo exibidos no console e enviados por e-mail.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// ---------------------------------------------------------------
// ROTAS DE ERRO
//-----------------------------------------------------------------
// Middleware para rotas não encontradas (404)
app.use((req, res, next) => res.status(404).sendFile(__dirname + '/public/error.html'));

// Middleware para erros gerais (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Erro no servidor</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #ff6b6b; }
        p { color: #666; }
      </style>
    </head>
    <body>
      <h1>500 - Erro no servidor</h1>
      <p>Ocorreu um erro interno no servidor.</p>
      <a href="/">Voltar para a página inicial</a>
    </body>
    </html>
  `);
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