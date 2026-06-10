require('dotenv').config();
const express = require('express');
const { filtraRotas } = require('./services/filtroRotas');
const { addPost, getAllPosts, getPostId, updatePostId, deletePostId, uploadPost } = require('./services/posts');
const { uploadPostFile } = require('./services/upload');
const { htmlInner } = require('./services/innerHtmlPost');
const { loginAdmin, tokemAdmin, logoutAdmin } = require('./services/login');
const { requireAdminAuth } = require('./services/adminAuth');
const { sendContact, getContacts, updateStatus, replyToContact, deleteContactById } = require('./services/contato');
const { testEmail } = require('./services/testeEmail');
const { postView } = require('./services/postViews')
const { registerPushToken, getPublicVapidKeyHandler } = require('./services/notificationServices');
const { getCampaignAudience, getCampaignHistory, sendCampaign, testPostBroadcast } = require('./services/emailCampaign');
const { getVisitStats, listRecentVisits, getVisitsByDay, getDetailedStats, listDeviceLogs } = require('./database/deviceLogs');
const { getPostsStatusSummary, getPosts, getPostBySlug } = require('./database/postsDB');
const { listTopViewedPosts } = require('./database/postViewsDb');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getTags,
  createTag,
  updateTag,
  deleteTag
} = require('./services/taxonomies');
const { getUsers, getUser, addUser, editUser, changePassword, removeUser, getAuthorProfile } = require('./services/users');
const { getHomepage, getHomepageSection, updateHomepageSection } = require('./services/homepage');
const {
  getComments,
  createComment,
  getLikes,
  likePost,
  subscribe,
  facebookLogin,
  listCommentsAdmin,
  listCommentPostsAdmin,
  updateCommentStatusAdmin,
  deleteCommentAdmin,
  bulkUpdateCommentsStatusAdmin,
  bulkDeleteCommentsAdmin,
  getEngagementDashboard
} = require('./services/postEngagement');


const app = express();
const PORT = 3000;
const SITE_BASE_URL = 'https://www.adrianosena.dev.br';

upload = uploadPostFile();

function extractFirstImageFromHtml(html) {
  const content = String(html || '');
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match && match[1] ? String(match[1]).trim() : '';
}

function resolveShareImagePath(post) {
  const candidate = (post && (post.image || extractFirstImageFromHtml(post.content))) || '/logoWeb.png';
  const value = String(candidate || '').trim();
  if (!value) return '/logoWeb.png';
  if (/^https?:\/\//i.test(value)) return value;
  return value.startsWith('/') ? value : `/${value}`;
}

function toAbsoluteSiteUrl(pathOrUrl) {
  const value = String(pathOrUrl || '').trim();
  if (!value) return `${SITE_BASE_URL}/logoWeb.png`;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_BASE_URL}${value.startsWith('/') ? value : `/${value}`}`;
}

function getIncomingSlug(req) {
  const raw = req.params?.slug || req.params?.[0] || req.query?.slug || '';
  try {
    return decodeURIComponent(String(raw).trim());
  } catch (_) {
    return String(raw || '').trim();
  }
}


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
app.get('/post/:slug', async (req, res) => {
  const slug = String(req.params.slug || '').trim();
  htmlInner(slug, PORT, res);
});
app.get("/post", async (req, res) => {
  const querySlug = String(req.query.slug || '').trim();
  const pathSlug = req.path.startsWith('/post/') ? String(req.path.slice('/post/'.length)).trim() : '';
  const slug = querySlug || pathSlug;
  htmlInner(slug, PORT, res);
});

app.get('/rss.xml', async (req, res) => {
  try {
    const posts = await getPosts();
    const published = (posts || []).filter((p) => p.status === 'published').slice(0, 30);

    const esc = (v) => String(v || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&apos;');

    const items = published.map((p) => {
      const link = `https://adrianosena.dev.br/post?slug=${encodeURIComponent(p.slug || '')}`;
      const desc = p.description || p.excerpt || '';
      const date = new Date(p.createdAt || p.date || Date.now()).toUTCString();
      return `\n        <item>\n          <title>${esc(p.title)}</title>\n          <link>${esc(link)}</link>\n          <guid>${esc(link)}</guid>\n          <pubDate>${esc(date)}</pubDate>\n          <description><![CDATA[${desc}]]></description>\n        </item>`;
    }).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Adriano Sena Dev - Blog</title>\n    <link>https://adrianosena.dev.br/blog</link>\n    <description>Artigos sobre sistemas, apps, servidores, redes e tecnologia empresarial</description>\n    <language>pt-BR</language>${items}\n  </channel>\n</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.send(xml);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------------------
// ÁREA ADMIN
// ----------------------------------------------------------------
app.get('/login', (req, res) => res.sendFile(__dirname + '/public/login.html'));
app.get('/admin', (req, res) => res.sendFile(__dirname + '/public/dashboard.html'));
app.get('/admin/dashboard', (req, res) => res.sendFile(__dirname + '/public/dashboard.html'));
app.get('/admin/contatos', (req, res) => res.sendFile(__dirname + '/public/admin.html'));
app.get('/admin/posts', (req, res) => res.sendFile(__dirname + '/public/admin-posts.html'));
app.get('/admin/cadastrar', (req, res) => res.sendFile(__dirname + '/public/post-cadastro.html'));
app.get('/admin/usuarios', (req, res) => res.sendFile(__dirname + '/public/admin-users.html'));
app.get('/admin/dispositivos', (req, res) => res.sendFile(__dirname + '/public/admin-devices.html'));
app.get('/admin/homepage', (req, res) => res.sendFile(__dirname + '/public/admin-homepage.html'));
app.get('/admin/comentarios', (req, res) => res.sendFile(__dirname + '/public/admin-comments.html'));
app.get('/admin/emails', (req, res) => res.sendFile(__dirname + '/public/admin-emails.html'));

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

app.post('/logout', async (req, res) => {
  await logoutAdmin(req, res);
});

// ----------------------------------------------------------------
// API BLOG (CRUD)
// ----------------------------------------------------------------

// Criar Post
app.post('/api/posts', upload.single('image'), async (req, res) => {
  await requireAdminAuth(req, res, async () => {
  await addPost(req, res);
  });
});

// Listar posts
app.get('/api/posts', async (req, res) => {
  await getAllPosts(req, res);
});

// Buscar post por slug (público)
app.get('/api/posts/slug/:slug', async (req, res) => {
  try {
    const post = await getPostBySlug(req.params.slug);
    if (!post) return res.status(404).json({ success: false, error: 'Post não encontrado' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/og/post/:slug', async (req, res) => {
  try {
    const post = await getPostBySlug(req.params.slug);
    const imagePath = resolveShareImagePath(post);
    const imageUrl = toAbsoluteSiteUrl(imagePath);

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.redirect(302, imageUrl);
  } catch (err) {
    return res.redirect(302, `${SITE_BASE_URL}/logoWeb.png`);
  }
});

// Buscar post por ID (admin)
app.get('/api/posts/:id', async (req, res) => {
  await getPostId(req, res);
});

// Atualizar post
app.put('/api/posts/:id', upload.single('image'), async (req, res) => {
  await requireAdminAuth(req, res, async () => {
  await updatePostId(req, res);
  });
});

// Deletar post
app.delete('/api/posts/:id', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
  await deletePostId(req, res);
  });
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
  await requireAdminAuth(req, res, async () => {
  getContacts(req, res);
  });
});

app.patch('/api/contact/:id/status', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
  updateStatus(req, res);
  });
});

app.post('/api/contact/:id/reply', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
  replyToContact(req, res);
  });
});

app.delete('/api/contact/:id', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
  deleteContactById(req, res);
  });
});
// ----------------------------------------------------------------
// ROTA PARA TESTAR O ENVIO DE E-MAIL
// ----------------------------------------------------------------
app.get('/test-email', async (req, res) => {
  testEmail(req, res);
});

// ----------------------------------------------------------------
// ROTA PARA Views de posts
// ----------------------------------------------------------------
// HOMEPAGE CMS
// ----------------------------------------------------------------
app.get('/api/homepage', getHomepage);
app.get('/api/homepage/:section', getHomepageSection);
app.put('/api/homepage/:section', async (req, res) => {
  await requireAdminAuth(req, res, () => updateHomepageSection(req, res));
});

// ----------------------------------------------------------------
app.get('/api/post/views/:id', async (req, res) => {
  await postView(req, res);
});

// ----------------------------------------------------------------
// DASHBOARD (ANALYTICS)
// ----------------------------------------------------------------
app.get('/api/stats', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
  try {
    const stats = await getVisitStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
  });
});

app.get('/api/visits', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
  try {
    const limit = Number(req.query.limit || 50);
    const visits = await listRecentVisits(limit);
    res.json(visits);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
  });
});

app.get('/api/dashboard/charts', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    try {
      const [visitsByDay, postsByStatus, posts, topViews] = await Promise.all([
        getVisitsByDay(14),
        getPostsStatusSummary(),
        getPosts(),
        listTopViewedPosts(5)
      ]);

      const postById = new Map((posts || []).map((post) => [post.id, post]));
      const topPosts = (topViews || []).map((row) => ({
        postId: row.postId,
        title: postById.get(row.postId)?.title || `Post #${row.postId}`,
        totalViews: row.totalViews
      }));

      res.json({
        visitsByDay,
        postsByStatus,
        topPosts
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
});

app.get('/api/categories', async (req, res) => {
  await getCategories(req, res);
});

app.post('/api/categories', requireAdminAuth, async (req, res) => {
  await createCategory(req, res);
});

app.put('/api/categories/:id', requireAdminAuth, async (req, res) => {
  await updateCategory(req, res);
});

app.delete('/api/categories/:id', requireAdminAuth, async (req, res) => {
  await deleteCategory(req, res);
});

app.get('/api/tags', async (req, res) => {
  await getTags(req, res);
});

app.post('/api/tags', requireAdminAuth, async (req, res) => {
  await createTag(req, res);
});

app.put('/api/tags/:id', requireAdminAuth, async (req, res) => {
  await updateTag(req, res);
});

app.delete('/api/tags/:id', requireAdminAuth, async (req, res) => {
  await deleteTag(req, res);
});

// ----------------------------------------------------------------
// USUÁRIOS
// ----------------------------------------------------------------
app.get('/api/users', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await getUsers(req, res);
  });
});

app.get('/api/public/author-profile', async (req, res) => {
  await getAuthorProfile(req, res);
});

app.get('/api/users/:id', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await getUser(req, res);
  });
});

app.post('/api/users', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await addUser(req, res);
  });
});

app.put('/api/users/:id', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await editUser(req, res);
  });
});

app.patch('/api/users/:id/password', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await changePassword(req, res);
  });
});

app.delete('/api/users/:id', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await removeUser(req, res);
  });
});

// ----------------------------------------------------------------
// DISPOSITIVOS / ANALYTICS DETALHADO
// ----------------------------------------------------------------
app.get('/api/devices', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    try {
      const { limit, offset, device_type, browser_name, os_name, show_bots, search } = req.query;
      const result = await listDeviceLogs({
        limit, offset, device_type, browser_name, os_name,
        show_bots: show_bots === 'true',
        search
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
});

app.get('/api/devices/stats', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    try {
      const stats = await getDetailedStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
});

// ---------------------------------------------------------------
// ROTAS De notificalção
//-----------------------------------------------------------------
app.post('/api/push/public-token', async (req, res) => {
  await registerPushToken(req, res);
});

app.get('/api/push/vapid-public-key', async (req, res) => {
  await getPublicVapidKeyHandler(req, res);
});

app.post('/api/push/subscribe', async (req, res) => {
  await registerPushToken(req, res);
});

// Interações de posts (comentários e curtidas)
app.get('/api/posts/:id/comments', getComments);
app.post('/api/posts/:id/comments', createComment);
app.get('/api/posts/:id/likes', getLikes);
app.post('/api/posts/:id/likes', likePost);

// Assinaturas e login social
app.post('/api/subscribers', subscribe);
app.post('/api/auth/facebook', facebookLogin);

// Admin - moderação de comentários e métricas de engajamento
app.get('/api/admin/comments', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await listCommentsAdmin(req, res);
  });
});

app.get('/api/admin/comments/posts', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await listCommentPostsAdmin(req, res);
  });
});

app.patch('/api/admin/comments/:id/status', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await updateCommentStatusAdmin(req, res);
  });
});

app.delete('/api/admin/comments/:id', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await deleteCommentAdmin(req, res);
  });
});

app.patch('/api/admin/comments/bulk/status', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await bulkUpdateCommentsStatusAdmin(req, res);
  });
});

// ----------------------------------------------------------------
// CAMPANHAS DE E-MAIL (ADMIN)
// ----------------------------------------------------------------
app.get('/api/admin/email-campaign/audience', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await getCampaignAudience(req, res);
  });
});

app.get('/api/admin/email-campaign/history', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await getCampaignHistory(req, res);
  });
});

app.post('/api/admin/email-campaign/send', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await sendCampaign(req, res);
  });
});

app.post('/api/admin/posts/:id/broadcast-test', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await testPostBroadcast(req, res);
  });
});

app.delete('/api/admin/comments/bulk/delete', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await bulkDeleteCommentsAdmin(req, res);
  });
});

app.get('/api/dashboard/engagement', async (req, res) => {
  await requireAdminAuth(req, res, async () => {
    await getEngagementDashboard(req, res);
  });
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

  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    console.warn("⚠️  AVISO: Login Facebook não configurado no .env");
    console.warn("   Configure FACEBOOK_APP_ID e FACEBOOK_APP_SECRET para habilitar o login social\n");
  }

});