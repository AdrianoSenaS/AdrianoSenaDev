function escHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeExcerpt(post) {
  const raw = post.description || post.excerpt || "";
  const plain = String(raw).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.slice(0, 180) || "Conteudo tecnico sobre sistemas, apps, servidores e boas praticas para empresas.";
}

module.exports = {
  HtmlPost(post) {
    const slug = post.slug || "";
    const title = escHtml(post.title || "Post");
    const excerpt = escHtml(safeExcerpt(post));
    const imagePath = post.image || "/logoWeb.png";
    const fullImage = imagePath.startsWith("http") ? imagePath : `https://adrianosena.dev.br${imagePath}`;
    const facebookAppId = process.env.FACEBOOK_APP_ID || "";

    const html = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Adriano Sena Dev</title>

  <link rel="canonical" href="https://adrianosena.dev.br/post?slug=${encodeURIComponent(slug)}" />
  <meta name="description" content="${excerpt}" />

  <meta property="og:title" content="${title} | Adriano Sena Dev" />
  <meta property="og:description" content="${excerpt}" />
  <meta property="og:image" content="${fullImage}" />
  <meta property="og:url" content="https://adrianosena.dev.br/post?slug=${encodeURIComponent(slug)}" />
  <meta property="og:type" content="article" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@adrianosenas" />
  <meta name="twitter:title" content="${title} | Adriano Sena Dev" />
  <meta name="twitter:description" content="${excerpt}" />
  <meta name="twitter:image" content="${fullImage}" />

  <link rel="shortcut icon" href="https://adrianosena.dev.br/logo.png" type="image/x-icon" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1602165210298822" crossorigin="anonymous"></script>

  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --secondary: #10b981;
      --secondary-dark: #059669;
      --dark: #0f172a;
      --light: #ffffff;
      --gray-50: #f8fafc;
      --gray-100: #f1f5f9;
      --gray-200: #e2e8f0;
      --gray-300: #cbd5e1;
      --gray-400: #94a3b8;
      --gray-500: #64748b;
      --gray-600: #475569;
      --gray-700: #334155;
      --gray-800: #1e293b;
      --gray-900: #0f172a;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --gradient: linear-gradient(135deg, #2563eb 0%, #10b981 100%);
      --gradient-hover: linear-gradient(135deg, #1d4ed8 0%, #059669 100%);
      --card-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      --card-shadow-hover: 0 20px 40px rgba(37, 99, 235, 0.1);
      --neon-glow: 0 0 30px rgba(37, 99, 235, 0.12);
    }

    [data-theme="dark"] {
      --primary: #60a5fa;
      --primary-dark: #3b82f6;
      --secondary: #34d399;
      --secondary-dark: #10b981;
      --light: #0f172a;
      --gray-50: #1e293b;
      --gray-100: #334155;
      --gray-200: #475569;
      --gray-300: #64748b;
      --gray-400: #94a3b8;
      --gray-500: #cbd5e1;
      --gray-600: #e2e8f0;
      --gray-700: #f1f5f9;
      --gray-800: #f8fafc;
      --gray-900: #ffffff;
      --text-primary: #f1f5f9;
      --text-secondary: #94a3b8;
      --gradient: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
      --gradient-hover: linear-gradient(135deg, #2563eb 0%, #059669 100%);
      --card-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      --card-shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.4);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: "Inter", sans-serif;
      background-color: var(--light);
      color: var(--text-primary);
      overflow-x: hidden;
      transition: all 0.3s ease;
    }

    img,
    iframe,
    video,
    table {
      max-width: 100%;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: "Poppins", sans-serif;
      font-weight: 700;
      line-height: 1.2;
    }

    .gradient-text {
      background: var(--gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .glass-effect {
      background: rgba(255, 255, 255, 0.84);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    }

    [data-theme="dark"] .glass-effect {
      background: rgba(15, 23, 42, 0.84);
    }

    .nav-link {
      position: relative;
      padding: 8px 0;
      color: var(--text-primary);
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .nav-link::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--gradient);
      transition: width 0.3s ease;
    }

    .nav-link:hover::after { width: 100%; }
    .nav-link:hover { color: var(--primary); }

    .btn-primary {
      background: var(--gradient);
      color: white;
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: var(--neon-glow);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px rgba(37, 99, 235, 0.2);
    }

    .btn-secondary {
      background: transparent;
      color: var(--primary);
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 600;
      border: 2px solid var(--primary);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: rgba(37, 99, 235, 0.1);
      transform: translateY(-2px);
    }

    .card {
      background: var(--light);
      border-radius: 16px;
      padding: 1.4rem;
      box-shadow: var(--card-shadow);
      transition: all 0.35s ease;
      border: 1px solid var(--gray-200);
    }

    .card:hover {
      transform: translateY(-6px);
      box-shadow: var(--card-shadow-hover);
      border-color: var(--primary);
    }

    .hero-post {
      padding-top: 120px;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      position: relative;
      overflow: hidden;
    }

    [data-theme="dark"] .hero-post {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    }

    .hero-pattern {
      position: absolute;
      inset: 0;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    .tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(37, 99, 235, 0.08);
      color: var(--primary);
      border-radius: 999px;
      font-size: 0.85rem;
      border: 1px solid rgba(37, 99, 235, 0.16);
      margin: 0 8px 8px 0;
      font-weight: 500;
    }

    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--text-secondary);
      margin-right: 18px;
      margin-bottom: 8px;
      font-size: 0.94rem;
    }

    .post-content {
      line-height: 1.84;
      color: var(--text-primary);
      word-break: break-word;
    }

    .post-content h2,
    .post-content h3,
    .post-content h4 {
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: var(--primary);
    }

    .post-content p { margin-bottom: 1.2rem; }
    .post-content ul,
    .post-content ol {
      padding-left: 1.2rem;
      margin-bottom: 1.2rem;
    }

    .post-content a {
      color: var(--primary);
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    .post-content img {
      display: block;
      border-radius: 12px;
      max-width: 100%;
      height: auto;
      margin: 1.3rem auto;
    }

    .post-content table {
      display: block;
      width: 100%;
      overflow-x: auto;
      border-collapse: collapse;
      margin: 1.2rem 0;
    }

    .post-content iframe {
      width: 100%;
      border: 0;
      border-radius: 12px;
    }

    .post-content pre {
      overflow-x: auto;
      background: #0b1220;
      color: #dbeafe;
      border-radius: 12px;
      padding: 1rem;
      margin: 1.2rem 0;
    }

    .post-content code {
      background: rgba(37, 99, 235, 0.1);
      color: var(--primary);
      border-radius: 6px;
      padding: 2px 6px;
      font-family: "Fira Code", monospace;
      font-size: 0.9em;
    }

    .stats-mini {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 14px;
    }

    .stats-mini .stat {
      background: rgba(37, 99, 235, 0.06);
      border: 1px solid rgba(37, 99, 235, 0.12);
      border-radius: 10px;
      padding: 10px;
      text-align: center;
    }

    .stats-mini .value {
      display: block;
      font-weight: 800;
      font-size: 1.2rem;
      color: var(--primary);
      line-height: 1;
      margin-bottom: 4px;
    }

    .stats-mini .label {
      color: var(--text-secondary);
      font-size: 0.76rem;
      font-weight: 600;
    }

    .related-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .related-item {
      background: rgba(37, 99, 235, 0.05);
      border: 1px solid rgba(37, 99, 235, 0.12);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.25s ease;
    }

    .related-item:hover {
      transform: translateY(-4px);
      border-color: var(--primary);
    }

    .related-item img {
      width: 100%;
      height: 120px;
      object-fit: cover;
    }

    .related-body {
      padding: 10px;
    }

    .interaction-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
    }

    .comment-item {
      border-top: 1px solid var(--gray-200);
      padding: 12px 0;
    }

    .comment-meta {
      font-size: 0.82rem;
      color: var(--text-secondary);
      margin-bottom: 6px;
    }

    .scroll-top {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: var(--gradient);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: var(--neon-glow);
    }

    .scroll-top.show {
      opacity: 1;
      transform: translateY(0);
    }

    footer {
      background: var(--dark);
      color: #e2e8f0;
    }

    @media (max-width: 1024px) {
      .layout { grid-template-columns: 1fr; }
      .sidebar { position: static; }
    }

    @media (max-width: 768px) {
      .hero-post { padding-top: 102px; }
      .stats-mini { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .related-grid { grid-template-columns: 1fr; }
      .meta-item {
        margin-right: 0;
      }
      .card {
        padding: 1.1rem;
      }
      .post-content {
        font-size: 0.98rem;
        line-height: 1.72;
      }
      .post-content h2,
      .post-content h3,
      .post-content h4 {
        margin-top: 1.6rem;
      }
    }

    @media (max-width: 640px) {
      .hero-post {
        padding-top: 96px;
      }
      .stats-mini {
        grid-template-columns: 1fr;
      }
      .interaction-row {
        flex-direction: column;
        align-items: stretch;
      }
      .interaction-row .btn-secondary,
      .interaction-row .btn-primary {
        width: 100%;
        text-align: center;
        justify-content: center;
      }
    }
  </style>
</head>
<body>
  <header class="fixed w-full z-50 glass-effect transition-all duration-300">
    <div class="container mx-auto px-4 sm:px-6 py-4">
      <div class="flex justify-between items-center">
        <a href="/" class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <img src="https://adrianosena.dev.br/logo.png" alt="Adriano Sena Dev" class="w-10 h-10" />
          </div>
          <div>
            <div class="text-lg font-bold">Adriano Sena Dev</div>
            <div class="text-xs" style="color: var(--text-secondary)">Solucoes em Tecnologia para Empresas</div>
          </div>
        </a>

        <nav class="hidden md:flex items-center space-x-8">
          <a href="/" class="nav-link">Inicio</a>
          <a href="/#services" class="nav-link">Servicos</a>
          <a href="/#projects" class="nav-link">Cases</a>
          <a href="/#skills" class="nav-link">Tecnologias</a>
          <a href="/blog" class="nav-link" style="color: var(--primary)">Blog</a>
          <a href="/#contact" class="nav-link">Contato</a>
          <a href="/privacidade" class="nav-link">Privacidade</a>
        </nav>

        <div class="flex items-center gap-4">
          <button id="theme-toggle" class="p-2 rounded-lg transition" style="border:1px solid var(--gray-200)">
            <i id="theme-icon" class="fas fa-moon" style="color:var(--text-secondary)"></i>
          </button>
          <button id="menu-toggle" class="md:hidden"><i class="fas fa-bars text-xl"></i></button>
        </div>
      </div>

      <div id="mobile-menu" class="hidden md:hidden mt-4 pb-4">
        <div class="flex flex-col space-y-4">
          <a href="/" class="nav-link">Inicio</a>
          <a href="/#services" class="nav-link">Servicos</a>
          <a href="/#projects" class="nav-link">Cases</a>
          <a href="/#skills" class="nav-link">Tecnologias</a>
          <a href="/blog" class="nav-link" style="color: var(--primary)">Blog</a>
          <a href="/#contact" class="nav-link">Contato</a>
          <a href="/privacidade" class="nav-link">Privacidade</a>
        </div>
      </div>
    </div>
  </header>

  <section class="hero-post">
    <div class="hero-pattern"></div>
    <div class="container mx-auto px-4 sm:px-6 relative z-10 pb-10">
      <nav class="mb-6 text-sm" style="color: var(--text-secondary)">
        <ol class="flex items-center flex-wrap gap-2">
          <li><a href="/" class="hover:text-primary">Inicio</a></li>
          <li><i class="fas fa-chevron-right text-xs"></i></li>
          <li><a href="/blog" class="hover:text-primary">Blog</a></li>
          <li><i class="fas fa-chevron-right text-xs"></i></li>
          <li id="breadcrumb-current" style="color: var(--primary)">${title}</li>
        </ol>
      </nav>

      <div class="max-w-4xl">
        <div id="post-tags" class="mb-4"></div>
        <h1 id="post-title" class="text-3xl md:text-5xl font-bold leading-tight mb-5">${title}</h1>
        <div class="mb-2">
          <span class="meta-item"><i class="far fa-calendar"></i><span id="post-date"></span></span>
          <span class="meta-item"><i class="far fa-user"></i><span id="post-author">Equipe Adriano Sena Dev</span></span>
          <span class="meta-item"><i class="far fa-clock"></i><span id="read-time">0</span> min de leitura</span>
          <span class="meta-item"><i class="far fa-eye"></i><span id="view-count">0</span> visualizacoes</span>
        </div>
      </div>
    </div>
  </section>

  <main class="py-10">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="layout grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <article class="lg:col-span-2 min-w-0">
          <div class="card mb-8">
            <img id="post-image" src="${escHtml(imagePath)}" alt="${title}" class="w-full max-h-[460px] object-cover rounded-xl" />
          </div>

          <div class="card">
            <div id="post-content" class="post-content"></div>
          </div>

          <div class="card mt-8">
            <h3 class="text-xl mb-3">Autor responsavel pelo post</h3>
            <div class="flex flex-col sm:flex-row items-start gap-4">
              <img src="https://adrianosena.dev.br/logo-white.png" alt="Autor" class="w-16 h-16 rounded-full border-2" style="border-color:var(--primary)" />
              <div class="flex-1">
                <div id="author-name" class="font-bold text-lg mb-1">Equipe Adriano Sena Dev</div>
                <p id="author-bio" style="color: var(--text-secondary)">Conteudo revisado para decisao tecnica e operacional de empresas.</p>
                <div class="stats-mini">
                  <div class="stat"><span id="author-post-count" class="value">0</span><span class="label">Posts deste autor</span></div>
                  <div class="stat"><span id="total-post-count" class="value">0</span><span class="label">Posts publicados</span></div>
                  <div class="stat"><span id="total-category-count" class="value">0</span><span class="label">Categorias ativas</span></div>
                </div>
              </div>
            </div>
          </div>

          <div class="card mt-8">
            <h3 class="text-xl mb-3">Interacao do artigo</h3>
            <div class="interaction-row mb-4">
              <button id="like-btn" class="btn-secondary" type="button"><i class="far fa-thumbs-up mr-2"></i>Curtir</button>
              <span style="color: var(--text-secondary)"><strong id="like-count">0</strong> curtidas</span>
              <a class="btn-secondary" href="/rss.xml" target="_blank" rel="noopener noreferrer"><i class="fas fa-rss mr-2"></i>Assinar RSS</a>
            </div>

            <div class="mb-5 p-3 rounded-lg" style="background: rgba(37, 99, 235, 0.04); border: 1px solid rgba(37, 99, 235, 0.12)">
              <h4 class="font-semibold mb-2">Login com Facebook (para comentar)</h4>
              <p class="text-sm mb-3" style="color: var(--text-secondary)">Conecte-se para comentar com seu nome social.</p>
              <button id="fb-login-btn" type="button" class="btn-secondary"><i class="fab fa-facebook mr-2"></i>Entrar com Facebook</button>
              <div id="fb-user" class="text-sm mt-3" style="color: var(--text-secondary)"></div>
            </div>

            <h4 class="font-semibold mb-2">Comentarios</h4>
            <form id="comment-form" class="space-y-3 mb-3">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input id="comment-name" type="text" required placeholder="Seu nome" class="w-full px-4 py-3 rounded-lg" style="border:1px solid var(--gray-300); background: var(--light); color: var(--text-primary);" />
                <input id="comment-email" type="email" placeholder="Seu email (opcional)" class="w-full px-4 py-3 rounded-lg" style="border:1px solid var(--gray-300); background: var(--light); color: var(--text-primary);" />
              </div>
              <textarea id="comment-message" required minlength="6" placeholder="Escreva seu comentário" rows="4" class="w-full px-4 py-3 rounded-lg" style="border:1px solid var(--gray-300); background: var(--light); color: var(--text-primary);"></textarea>
              <button type="submit" class="btn-primary w-full sm:w-auto"><i class="fas fa-comment-dots mr-2"></i>Publicar comentario</button>
            </form>
            <div id="comment-feedback" class="text-sm mb-2" style="color: var(--text-secondary)"></div>
            <div id="comments-list"></div>
          </div>

          <div class="card mt-8">
            <h3 class="text-xl mb-3">Posts relacionados </h3>
            <div id="related-posts" class="related-grid"></div>
          </div>
        </article>

        <aside class="sidebar lg:col-span-1 min-w-0" style="position: sticky; top: 110px; align-self: start;">
          <div class="card mb-6">
            <h3 class="text-xl mb-2">Receba Conteudo Tecnico no Email</h3>
            <p class="mb-4" style="color: var(--text-secondary)">
              Receba materiais sobre sistemas, apps, servidores, redes e boas praticas para manter a operacao da sua empresa segura e escalavel.
            </p>
            <form id="newsletter-form" class="space-y-3">
              <input id="newsletter-name" type="text" placeholder="Seu nome" class="w-full px-4 py-3 rounded-lg" style="border:1px solid var(--gray-300); background: var(--light); color: var(--text-primary);" />
              <input id="newsletter-email" type="email" placeholder="Seu melhor email" required class="w-full px-4 py-3 rounded-lg" style="border:1px solid var(--gray-300); background: var(--light); color: var(--text-primary);" />
              <label class="inline-flex items-center gap-2 text-sm" style="color: var(--text-secondary)">
                <input id="newsletter-push" type="checkbox" />
                Quero receber notificacoes de novos posts
              </label>
              <button type="submit" class="btn-primary w-full"><i class="fas fa-envelope mr-2"></i>Quero receber</button>
            </form>
            <p id="newsletter-feedback" class="text-sm mt-3" style="color: var(--text-secondary)"></p>
          </div>

          <div class="card mb-6">
            <h3 class="text-xl mb-3">Categorias</h3>
            <ul id="category-list" class="space-y-2"></ul>
          </div>

          <div class="card">
            <h3 class="text-xl mb-2">Precisa de ajuda com seu projeto?</h3>
            <p class="mb-4" style="color: var(--text-secondary)">Fale com a equipe para desenhar a melhor estrategia de software e infraestrutura.</p>
            <a href="/#contact" class="btn-secondary w-full text-center block">Solicitar diagnostico</a>
          </div>
        </aside>
      </div>
    </div>
  </main>

  <footer class="py-10 px-6 mt-10">
    <div class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <div class="font-bold">Adriano Sena Dev</div>
        <div class="text-sm" style="color:#94a3b8">Tecnologia para crescimento com estabilidade</div>
      </div>
      <div class="flex gap-4 text-xl">
        <a href="https://www.instagram.com/adrianosena.dev.br/" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>
        <a href="https://wa.me/5564933004882" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp"></i></a>
      </div>
    </div>
  </footer>

  <div class="scroll-top" id="scrollTop"><i class="fas fa-arrow-up"></i></div>

  <script>
    (function initTheme() {
      const toggle = document.getElementById("theme-toggle");
      const icon = document.getElementById("theme-icon");
      const saved = localStorage.getItem("theme");
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      function apply(theme) {
        if (theme === "dark") {
          document.documentElement.setAttribute("data-theme", "dark");
          icon.className = "fas fa-sun";
        } else {
          document.documentElement.removeAttribute("data-theme");
          icon.className = "fas fa-moon";
        }
      }

      apply(saved || (systemDark ? "dark" : "light"));
      toggle.addEventListener("click", () => {
        const dark = document.documentElement.getAttribute("data-theme") === "dark";
        const next = dark ? "light" : "dark";
        localStorage.setItem("theme", next);
        apply(next);
      });
    })();

    (function mobileMenu() {
      const btn = document.getElementById("menu-toggle");
      const menu = document.getElementById("mobile-menu");
      btn.addEventListener("click", () => {
        menu.classList.toggle("hidden");
      });
    })();

    const scrollTop = document.getElementById("scrollTop");
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 320) scrollTop.classList.add("show");
      else scrollTop.classList.remove("show");
    });
    scrollTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    function formatDate(d) {
      return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    }

    function stripHtml(html) {
      return String(html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    }

    function escHtmlClient(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function normalizeCategory(c) {
      return String(c || "Sem categoria").trim();
    }

    function renderCategoriesWithCount(posts) {
      const list = document.getElementById("category-list");
      list.innerHTML = "";
      const published = (posts || []).filter(p => p.status === "published");
      const counts = published.reduce((acc, p) => {
        const c = normalizeCategory(p.category);
        acc[c] = (acc[c] || 0) + 1;
        return acc;
      }, {});

      Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([name, total]) => {
          const li = document.createElement("li");
          li.innerHTML = '<a href="/blog?category=' + encodeURIComponent(name) + '" class="flex items-center justify-between hover:opacity-80" style="color: var(--text-primary)"><span>' + name + '</span><span style="color: var(--text-secondary)">' + total + '</span></a>';
          list.appendChild(li);
        });

      document.getElementById("total-post-count").textContent = String(published.length);
      document.getElementById("total-category-count").textContent = String(Object.keys(counts).length);
    }

    async function submitNewsletter(email) {
      const name = document.getElementById("newsletter-name").value.trim();
      const wantsPush = document.getElementById("newsletter-push").checked;

      if (wantsPush && "Notification" in window && Notification.permission === "default") {
        try { await Notification.requestPermission(); } catch (_) {}
      }

      const payload = {
        name: name || "Inscricao Newsletter Blog",
        email,
        source: "post",
        wantsEmail: true,
        wantsPush,
        provider: (window.__fbUser && window.__fbUser.id) ? "facebook" : "local",
        providerId: window.__fbUser?.id || ""
      };

      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      // Mantem também registro no funil de contatos já existente
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          email,
          status: "new",
          project: "newsletter",
          message: "Lead originado na newsletter da pagina de post"
        })
      }).catch(() => {});

      return res.ok;
    }

    function getVisitorKey() {
      const keyName = "visitorLikeKey";
      let key = localStorage.getItem(keyName);
      if (!key) {
        key = Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem(keyName, key);
      }
      return key;
    }

    async function loadLikes(postId) {
      const res = await fetch('/api/posts/' + postId + '/likes');
      const data = await res.json();
      document.getElementById('like-count').textContent = data.total || 0;
    }

    async function submitLike(postId) {
      const btn = document.getElementById('like-btn');
      btn.disabled = true;
      const res = await fetch('/api/posts/' + postId + '/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorKey: getVisitorKey() })
      });
      const data = await res.json();
      if (data?.success) {
        document.getElementById('like-count').textContent = data.total || 0;
        btn.innerHTML = data.added
          ? '<i class="fas fa-thumbs-up mr-2"></i>Obrigado!'
          : '<i class="fas fa-check mr-2"></i>Ja curtido';
      }
      btn.disabled = false;
    }

    function renderComments(comments) {
      const container = document.getElementById('comments-list');
      container.innerHTML = '';
      if (!comments || !comments.length) {
        container.innerHTML = '<p style="color: var(--text-secondary)">Seja o primeiro a comentar.</p>';
        return;
      }

      comments.forEach((c) => {
        const div = document.createElement('div');
        div.className = 'comment-item';
        const providerBadge = c.provider === 'facebook' ? ' • Facebook' : '';
        div.innerHTML =
          '<div class="comment-meta"><strong>' +
          escHtmlClient(c.name) +
          '</strong>' +
          providerBadge +
          ' • ' +
          formatDate(c.createdAt) +
          '</div>' +
          '<div>' + escHtmlClient(c.message) + '</div>';
        container.appendChild(div);
      });
    }

    async function loadComments(postId) {
      const res = await fetch('/api/posts/' + postId + '/comments');
      const data = await res.json();
      renderComments(data.comments || []);
    }

    async function postComment(postId) {
      const nameInput = document.getElementById('comment-name');
      const emailInput = document.getElementById('comment-email');
      const messageInput = document.getElementById('comment-message');
      const feedback = document.getElementById('comment-feedback');

      const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
        provider: window.__fbUser?.id ? 'facebook' : 'local',
        providerId: window.__fbUser?.id || ''
      };

      feedback.textContent = 'Publicando...';
      const res = await fetch('/api/posts/' + postId + '/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        feedback.textContent = 'Comentario publicado com sucesso.';
        messageInput.value = '';
        renderComments(data.comments || []);
      } else {
        feedback.textContent = data.error || 'Nao foi possivel publicar o comentario.';
      }
    }

    function renderRelatedPosts(allPosts, currentPost) {
      const container = document.getElementById('related-posts');
      const category = normalizeCategory(currentPost.category);
      const related = (allPosts || [])
        .filter(p => p.status === 'published' && p.id !== currentPost.id && normalizeCategory(p.category) === category)
        .slice(0, 4);

      if (!related.length) {
        container.innerHTML = '<p style="color: var(--text-secondary)">Ainda nao ha posts relacionados nesta categoria.</p>';
        return;
      }

      container.innerHTML = related.map((p) => {
        const image = p.image || '/logoWeb.png';
        const date = formatDate(p.createdAt || p.date || new Date());
        const link = '/post?slug=' + encodeURIComponent(p.slug || '');
        return '<a class="related-item" href="' + link + '">' +
          '<img src="' + image + '" alt="' + escHtmlClient(p.title || '') + '">' +
          '<div class="related-body">' +
          '<div class="text-xs mb-1" style="color: var(--text-secondary)">' + date + '</div>' +
          '<div class="font-semibold">' + escHtmlClient((p.title || '').slice(0, 90)) + '</div>' +
          '</div></a>';
      }).join('');
    }

    async function loginWithFacebook() {
      const info = document.getElementById('fb-user');
      const loginBtn = document.getElementById('fb-login-btn');

      function applyFbUser(user) {
        window.__fbUser = user;
        document.getElementById('comment-name').value = user.name || '';
        if (user.email) document.getElementById('comment-email').value = user.email;

        const safeName = escHtmlClient(user.name || 'Usuario Facebook');
        const safeAvatar = escHtmlClient(user.avatar || '');
        if (safeAvatar) {
          info.innerHTML =
            '<div class="flex items-center gap-3 p-2 rounded-lg" style="background: rgba(37, 99, 235, 0.08); border: 1px solid rgba(37, 99, 235, 0.16)">' +
            '<img src="' + safeAvatar + '" alt="Avatar Facebook" class="w-10 h-10 rounded-full" referrerpolicy="no-referrer">' +
            '<div><div class="font-semibold" style="color: var(--text-primary)">' + safeName + '</div><div class="text-xs">Conectado com Facebook</div></div>' +
            '</div>';
        } else {
          info.textContent = 'Conectado como ' + (user.name || 'Usuario Facebook');
        }
      }

      const sdkReady = await bootstrapFacebookSdk();
      if (!sdkReady || !window.FB) {
        info.textContent = '${facebookAppId}'
          ? 'Nao foi possivel carregar o login do Facebook agora. Tente novamente em instantes.'
          : 'Login com Facebook indisponivel no momento.';
        return;
      }

      loginBtn.disabled = true;

      window.FB.login(async function(response) {
        if (!response || !response.authResponse || !response.authResponse.accessToken) {
          info.textContent = 'Login cancelado.';
          loginBtn.disabled = false;
          return;
        }

        info.textContent = 'Validando login...';
        const apiRes = await fetch('/api/auth/facebook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: response.authResponse.accessToken })
        });
        const data = await apiRes.json();

        if (apiRes.ok && data.success) {
          applyFbUser(data.user || {});
          loginBtn.disabled = false;
          return;
        }

        // Fallback client-side quando o backend não está com APP_ID/SECRET configurados.
        window.FB.api('/me', { fields: 'id,name,email,picture.width(128).height(128)' }, function(me) {
          if (!me || me.error || !me.id) {
            info.textContent = data.error || 'Falha ao conectar com Facebook.';
            loginBtn.disabled = false;
            return;
          }

          applyFbUser({
            id: me.id,
            name: me.name || 'Usuario Facebook',
            email: me.email || '',
            avatar: me.picture && me.picture.data ? me.picture.data.url : ''
          });
          loginBtn.disabled = false;
        });
      }, { scope: 'public_profile,email' });
    }

    let fbSdkReadyPromise = null;
    function bootstrapFacebookSdk() {
      if (window.FB) return Promise.resolve(true);
      if (fbSdkReadyPromise) return fbSdkReadyPromise;

      const info = document.getElementById('fb-user');
      const loginBtn = document.getElementById('fb-login-btn');
      const appId = '${facebookAppId}';

      if (!appId) {
        info.textContent = 'Login com Facebook indisponivel no momento.';
        loginBtn.disabled = true;
        return Promise.resolve(false);
      }

      loginBtn.disabled = true;
      info.textContent = 'Carregando login do Facebook...';

      fbSdkReadyPromise = new Promise((resolve) => {
        window.fbAsyncInit = function() {
          try {
            window.FB.init({
              appId,
              cookie: true,
              xfbml: false,
              version: 'v19.0'
            });
            loginBtn.disabled = false;
            info.textContent = '';
            resolve(true);
          } catch (_) {
            info.textContent = 'Falha ao inicializar login do Facebook.';
            loginBtn.disabled = true;
            resolve(false);
          }
        };

        const id = 'facebook-jssdk';
        const existing = document.getElementById(id);
        if (existing) return;

        const js = document.createElement('script');
        js.id = id;
        js.src = 'https://connect.facebook.net/pt_BR/sdk.js';
        js.async = true;
        js.defer = true;
        js.onerror = function() {
          info.textContent = 'Nao foi possivel carregar a SDK do Facebook.';
          loginBtn.disabled = true;
          resolve(false);
        };
        document.body.appendChild(js);
      });

      return fbSdkReadyPromise;
    }

    async function loadPostData() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get("slug") || "${slug}";
        if (!slug) throw new Error("Slug ausente");

        const [postRes, allRes] = await Promise.all([
          fetch('/api/posts/slug/' + encodeURIComponent(slug)),
          fetch("/api/posts")
        ]);

        if (!postRes.ok) throw new Error("Post nao encontrado");

        const post = await postRes.json();
        const allPostsRaw = allRes.ok ? await allRes.json() : [];
        const allPosts = Array.isArray(allPostsRaw)
          ? allPostsRaw
          : (Array.isArray(allPostsRaw?.posts) ? allPostsRaw.posts : []);

        // Views reais
        const viewsRes = await fetch('/api/post/views/' + post.id);
        const viewsData = viewsRes.ok ? await viewsRes.json() : { totalViews: 0 };

        // Header/meta
        document.getElementById("breadcrumb-current").textContent = post.title || "Post";
        document.getElementById("post-title").textContent = post.title || "Post";
        document.getElementById("post-date").textContent = formatDate(post.createdAt || post.date || new Date());
        document.getElementById("post-author").textContent = post.author || "Equipe Adriano Sena Dev";
        document.getElementById("author-name").textContent = post.author || "Equipe Adriano Sena Dev";
        document.getElementById("view-count").textContent = viewsData.totalViews || 0;

        // SEO dinamico real
        const seoTitle = (post.title || "Post") + ' | Adriano Sena Dev';
        const seoDesc = stripHtml(post.description || post.excerpt || post.content || "").slice(0, 170);
        document.title = seoTitle;

        const mDesc = document.querySelector("meta[name='description']");
        if (mDesc) mDesc.setAttribute("content", seoDesc);
        const ogTitle = document.querySelector("meta[property='og:title']");
        if (ogTitle) ogTitle.setAttribute("content", seoTitle);
        const ogDesc = document.querySelector("meta[property='og:description']");
        if (ogDesc) ogDesc.setAttribute("content", seoDesc);
        const twTitle = document.querySelector("meta[name='twitter:title']");
        if (twTitle) twTitle.setAttribute("content", seoTitle);
        const twDesc = document.querySelector("meta[name='twitter:description']");
        if (twDesc) twDesc.setAttribute("content", seoDesc);

        // Imagem e conteudo
        const img = document.getElementById("post-image");
        img.src = post.image || "/logoWeb.png";
        img.alt = post.title || "Imagem do post";
        document.getElementById("post-content").innerHTML = post.content || "";

        // Tempo leitura real
        const words = stripHtml(post.content).split(/\s+/).filter(Boolean).length;
        document.getElementById("read-time").textContent = Math.max(1, Math.ceil(words / 220));

        // Tags reais
        const tagWrap = document.getElementById("post-tags");
        tagWrap.innerHTML = "";
        const tags = Array.isArray(post.tags) ? post.tags : [];
        if (post.category) {
          const cat = document.createElement("span");
          cat.className = "tag";
          cat.innerHTML = '<i class="fas fa-folder"></i>' + post.category;
          tagWrap.appendChild(cat);
        }
        tags.forEach(t => {
          const el = document.createElement("span");
          el.className = "tag";
          el.innerHTML = '<i class="fas fa-tag"></i>' + t;
          tagWrap.appendChild(el);
        });

        // Contadores reais de autor/categoria/post
        const published = allPosts.filter(p => p.status === "published");
        const author = (post.author || "").trim().toLowerCase();
        const authorCount = published.filter(p => (p.author || "").trim().toLowerCase() === author).length;
        document.getElementById("author-post-count").textContent = String(authorCount || 1);

        renderCategoriesWithCount(allPosts);
        renderRelatedPosts(allPosts, post);
        await loadLikes(post.id);
        await loadComments(post.id);

        document.getElementById('like-btn').addEventListener('click', () => submitLike(post.id));
        document.getElementById('comment-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          await postComment(post.id);
        });
        document.getElementById('fb-login-btn').addEventListener('click', loginWithFacebook);

        // JSON-LD Article
        const jsonLd = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": seoDesc,
          "image": [post.image || "/logoWeb.png"],
          "datePublished": post.createdAt || post.date,
          "author": {
            "@type": "Person",
            "name": post.author || "Equipe Adriano Sena Dev"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Adriano Sena Dev",
            "logo": {
              "@type": "ImageObject",
              "url": "https://adrianosena.dev.br/logo.png"
            }
          },
          "mainEntityOfPage": 'https://adrianosena.dev.br/post?slug=' + encodeURIComponent(post.slug || slug)
        };
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(jsonLd);
        document.head.appendChild(script);
      } catch (err) {
        document.getElementById("post-title").textContent = "Post nao encontrado";
        document.getElementById("post-content").innerHTML = "<p>O conteudo nao foi encontrado ou esta indisponivel no momento.</p>";
      }
    }

    document.getElementById("newsletter-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("newsletter-email").value.trim();
      const feedback = document.getElementById("newsletter-feedback");
      if (!email) return;

      feedback.textContent = "Enviando...";
      const ok = await submitNewsletter(email);
      if (ok) {
        feedback.textContent = "Inscricao confirmada! Voce recebera novos conteudos por email e notificacoes quando habilitadas.";
        e.target.reset();
      } else {
        feedback.textContent = "Nao foi possivel concluir agora. Tente novamente em instantes.";
      }
    });

    bootstrapFacebookSdk();
    loadPostData();
  </script>
</body>
</html>`;

    return html;
  }
};
