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
  return plain.slice(0, 180) || "Conteúdo técnico sobre sistemas, apps, servidores e boas práticas para empresas.";
}

function extractFirstImageFromHtml(html) {
  const content = String(html || "");
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match && match[1] ? String(match[1]).trim() : "";
}

function toAbsoluteImageUrl(urlPath, baseUrl) {
  const value = String(urlPath || "").trim();
  if (!value) return `${baseUrl}/logoWeb.png`;
  if (/^https?:\/\//i.test(value)) return value;
  return value.startsWith("/") ? `${baseUrl}${value}` : `${baseUrl}/${value}`;
}

module.exports = {
  HtmlPost(post) {
    const baseUrl = "https://www.adrianosena.dev.br";
    const slug = post.slug || "";
    const title = escHtml(post.title || "Post");
    const excerpt = escHtml(safeExcerpt(post));
    const imageCandidate = post.image || extractFirstImageFromHtml(post.content) || "/logoWeb.png";
    const fullImage = toAbsoluteImageUrl(imageCandidate, baseUrl);
    const fullImageSocial = fullImage; // sem cache buster para redes sociais
    const canonicalUrl = `${baseUrl}/post?slug=${encodeURIComponent(slug)}`;
    const facebookAppId = process.env.FACEBOOK_APP_ID || "";

    const publishedISO = post.createdAt ? new Date(post.createdAt).toISOString() : "";
    const modifiedISO = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishedISO;

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": excerpt,
      "image": fullImageSocial,
      "author": {
        "@type": "Person",
        "name": "Adriano Sena",
        "url": "https://adrianosena.dev.br",
        "sameAs": [
          "https://twitter.com/adrianosenas",
          "https://github.com/adrianosena",
          "https://linkedin.com/in/adrianosena"
        ]
      },
      "publisher": {
        "@type": "Organization",
        "name": "Adriano Sena Dev",
        "logo": {
          "@type": "ImageObject",
          "url": "https://adrianosena.dev.br/logoWeb.png"
        }
      },
      "datePublished": publishedISO,
      "dateModified": modifiedISO,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      }
    };

    const html = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="index, follow" />
  <meta name="author" content="Adriano Sena" />
  <meta name="theme-color" content="#0A0A0F" />

  <title>${title} | Adriano Sena Dev</title>
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="description" content="${excerpt}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:locale" content="pt_BR" />
  <meta property="og:site_name" content="Adriano Sena Dev" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${excerpt}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="${fullImageSocial}" />
  <meta property="og:image:secure_url" content="${fullImageSocial}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Imagem de capa do post: ${title}" />
  ${facebookAppId ? `<meta property="fb:app_id" content="${facebookAppId}" />` : ""}
  <meta property="article:published_time" content="${publishedISO}" />
  <meta property="article:modified_time" content="${modifiedISO}" />
  <meta property="article:author" content="https://adrianosena.dev.br" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@adrianosenas" />
  <meta name="twitter:creator" content="@adrianosenas" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${excerpt}" />
  <meta name="twitter:image" content="${fullImageSocial}" />
  <meta name="twitter:image:alt" content="Imagem de capa do post: ${title}" />

  <!-- Dados Estruturados -->
  <script type="application/ld+json">
    ${JSON.stringify(articleSchema, null, 2)}
  </script>

  <!-- Conexões sociais e feeds -->
  <link rel="me" href="https://twitter.com/adrianosenas" />
  <link rel="alternate" type="application/rss+xml" title="RSS Adriano Sena Dev" href="https://www.adrianosena.dev.br/rss.xml" />

  <!-- Favicons -->
  <link rel="icon" type="image/png" sizes="32x32" href="https://adrianosena.dev.br/logo.png" />
  <link rel="apple-touch-icon" href="https://adrianosena.dev.br/logo.png" />

  <script>
    tailwind.config = { darkMode: 'class' }
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1602165210298822" crossorigin="anonymous"></script>

  <style>
    :root {
      --primary: #00E5FF;
      --primary-glow: rgba(0, 229, 255, 0.25);
      --secondary: #00E5FF;
      --accent: #7C3AED;
      --text-primary: #EAEAEF;
      --text-secondary: #B0B0C0;
      --text-muted: #6B7280;
      --border-subtle: rgba(255, 255, 255, 0.06);
      --border-medium: rgba(255, 255, 255, 0.10);
      --card-bg: rgba(10, 10, 20, 0.50);
      --card-bg-hover: rgba(10, 10, 20, 0.70);
      --bg-dark: #0A0A0F;
      --bg-section: rgba(5, 11, 31, 0.60);
      --glass-bg: rgba(10, 10, 20, 0.55);
      --glass-border: rgba(255, 255, 255, 0.07);
      --gradient-accent: linear-gradient(135deg, #00E5FF 0%, #7C3AED 100%);
      --gradient-text: linear-gradient(135deg, #00E5FF 0%, #60A5FA 100%);
      --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.3);
      --shadow-card-hover: 0 8px 40px rgba(0, 229, 255, 0.08);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-primary);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      line-height: 1.25;
      color: var(--text-primary);
    }
    a { color: var(--secondary); text-decoration: none; transition: color 0.3s ease; }
    a:hover { color: #fff; }

    /* Loading */
    #loading-screen {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: #0A0A0F;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: opacity 0.6s ease, visibility 0.6s ease;
    }
    #loading-screen.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
    .loader { width: 48px; height: 48px; border: 3px solid rgba(0,229,255,0.15); border-radius: 50%; border-top-color: #00E5FF; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loader-text { color: #8892A0; font-size: 12px; letter-spacing: 0.3em; margin-top: 24px; font-family: 'Inter', sans-serif; text-transform: uppercase; }
    .loader-logo { margin-bottom: 32px; width: 56px; height: 56px; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .loader-logo img { width: 32px; height: 32px; object-fit: contain; }

    /* Header */
    .glass-header {
      background: rgba(10,10,20,0.75);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-subtle);
      transition: all 0.4s ease;
    }
    .nav-link {
      position: relative;
      padding: 6px 0;
      color: var(--text-muted);
      font-weight: 500;
      font-size: 0.8125rem;
      letter-spacing: 0.04em;
      transition: color 0.3s ease;
      font-family: 'Inter', sans-serif;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 0;
      width: 0; height: 1.5px;
      background: var(--gradient-accent);
      transition: width 0.3s ease;
    }
    .nav-link:hover, .nav-link.active { color: var(--text-primary); }
    .nav-link:hover::after, .nav-link.active::after { width: 100%; }

    /* Cards */
    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      box-shadow: var(--shadow-card);
      transition: all 0.4s ease;
    }
    .glass-card:hover {
      box-shadow: var(--shadow-card-hover);
      border-color: rgba(255,255,255,0.12);
      background: var(--card-bg-hover);
    }

    /* Buttons */
    .btn-accent {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      background: var(--gradient-accent);
      color: #fff; padding: 12px 28px; border-radius: 8px;
      font-weight: 600; font-size: 0.8125rem; letter-spacing: 0.03em;
      border: none; cursor: pointer; transition: all 0.35s ease;
      position: relative; overflow: hidden; z-index: 1;
      text-decoration: none; font-family: 'Inter', sans-serif;
    }
    .btn-accent::before {
      content: '';
      position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
      background: linear-gradient(135deg, #38F0FF 0%, #9D6BFF 100%);
      transition: left 0.45s ease; z-index: -1;
    }
    .btn-accent:hover::before { left: 0; }
    .btn-accent:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,229,255,0.2); color: #fff; }

    .btn-outline {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      background: transparent; color: var(--text-primary); padding: 12px 28px;
      border-radius: 8px; font-weight: 500; font-size: 0.8125rem; letter-spacing: 0.03em;
      border: 1px solid var(--border-medium); cursor: pointer;
      transition: all 0.35s ease; text-decoration: none; font-family: 'Inter', sans-serif;
    }
    .btn-outline:hover {
      border-color: var(--secondary); color: var(--secondary);
      transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,229,255,0.08);
    }

    .gradient-text {
      background: var(--gradient-text);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .section-kicker {
      display: inline-flex; align-items: center; gap: 8px;
      color: var(--secondary); font-size: 0.65rem; letter-spacing: 0.3em;
      font-weight: 700; text-transform: uppercase; font-family: 'Inter', sans-serif;
    }

    .scroll-top {
      position: fixed; bottom: 30px; right: 30px; width: 44px; height: 44px;
      background: var(--gradient-accent); border-radius: 50%;
      display: flex; align-items: center; justify-content: center; color: #fff;
      cursor: pointer; opacity: 0; transform: translateY(20px);
      transition: all 0.35s ease; z-index: 1000; border: none;
      box-shadow: 0 4px 20px rgba(0,229,255,0.15);
    }
    .scroll-top.show { opacity: 1; transform: translateY(0); }
    .scroll-top:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,229,255,0.25); }

    /* Post specific */
    .post-section {
      position: relative; overflow: hidden;
      padding-top: 8rem; padding-bottom: 5rem;
    }
    .post-bg {
      position: absolute; inset: 0; z-index: 0;
    }
    .post-bg .bg-image {
      width: 100%; height: 100%;
      background-image: url('https://adrianosena.dev.br/public/hero-tech.png');
      background-size: cover; background-position: center center;
      background-attachment: fixed; filter: blur(10px); transform: scale(1.05);
    }
    .post-bg .bg-overlay {
      position: absolute; inset: 0; background: rgba(5,11,31,0.65);
    }
    .post-content-wrapper { position: relative; z-index: 20; }

    .post-cover {
      width: 100%; max-height: 520px; min-height: 240px;
      object-fit: cover; border-radius: 12px;
    }

    .post-content {
      max-width: 72ch; margin: 0 auto;
      font-size: 1.06rem; line-height: 1.9; color: var(--text-primary);
      word-break: break-word;
    }
    .post-content > p:first-child {
      font-size: 1.14rem; line-height: 1.95; color: var(--text-secondary);
    }
    .post-content h2, .post-content h3, .post-content h4 {
      margin-top: 2rem; margin-bottom: 1rem; color: var(--primary);
    }
    .post-content p { margin-bottom: 1.24rem; }
    .post-content ul, .post-content ol { padding-left: 1.2rem; margin-bottom: 1.2rem; }
    .post-content a { color: var(--primary); text-decoration: underline; text-underline-offset: 3px; }
    .post-content img { display: block; border-radius: 12px; max-width: 100%; height: auto; margin: 1.3rem auto; }
    .post-content table { display: block; width: 100%; overflow-x: auto; border-collapse: collapse; margin: 1.2rem 0; }
    .post-content iframe { width: 100%; border: 0; border-radius: 12px; }
    .post-content blockquote {
      margin: 1.4rem 0; padding: 0.9rem 1rem; border-left: 4px solid var(--primary);
      background: rgba(0,229,255,0.06); border-radius: 0 10px 10px 0; color: var(--text-primary);
    }
    .post-content pre {
      overflow-x: auto; background: #0b1220; color: #dbeafe; border-radius: 12px;
      padding: 1rem; margin: 1.2rem 0;
    }
    .post-content code {
      background: rgba(0,229,255,0.1); color: var(--primary); border-radius: 6px;
      padding: 2px 6px; font-family: "Fira Code", monospace; font-size: 0.9em;
    }

    .tag {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; background: rgba(0,229,255,0.08); color: var(--secondary);
      border-radius: 999px; font-size: 0.85rem; border: 1px solid rgba(0,229,255,0.16);
      margin: 0 8px 8px 0; font-weight: 500;
    }

    .meta-item {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 0.35rem 0.6rem; border-radius: 999px;
      background: rgba(255,255,255,0.04); border: 1px solid var(--border-medium);
      color: var(--text-secondary); margin-right: 10px; margin-bottom: 8px;
      font-size: 0.86rem; font-weight: 500;
    }

    .related-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px;
    }
    .related-item {
      background: var(--glass-bg); border: 1px solid var(--glass-border);
      border-radius: 12px; overflow: hidden; transition: all 0.3s ease;
      box-shadow: var(--shadow-card); display: block; color: var(--text-primary);
    }
    .related-item:hover {
      transform: translateY(-4px); border-color: var(--secondary);
      box-shadow: 0 12px 36px rgba(0,229,255,0.08);
    }
    .related-item img { width: 100%; height: 160px; object-fit: cover; }
    .related-body { padding: 14px; }
    .related-meta { display: flex; align-items: center; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted); margin-bottom: 6px; }
    .related-meta span:last-child { background: rgba(0,229,255,0.08); padding: 2px 8px; border-radius: 999px; color: var(--secondary); font-weight: 600; }
    .related-title { font-weight: 700; line-height: 1.35; margin-bottom: 6px; font-size: 0.95rem; }
    .related-excerpt { font-size: 0.82rem; line-height: 1.45; color: var(--text-secondary); }

    .comment-item {
      border: 1px solid var(--glass-border); border-radius: 12px; padding: 14px;
      background: var(--glass-bg); margin-bottom: 10px;
    }
    .comment-meta { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
    .comment-message { font-size: 0.96rem; line-height: 1.55; }

    .share-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      min-height: 38px; padding: 0.45rem 0.72rem; border-radius: 999px;
      border: 1px solid var(--border-medium); background: var(--glass-bg);
      color: var(--text-primary); font-size: 0.82rem; font-weight: 600;
      transition: all 0.2s ease;
    }
    .share-btn:hover { border-color: var(--secondary); color: var(--secondary); transform: translateY(-1px); }

    /* Cookie consent bar */
    .cookie-consent-bar {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
      background: rgba(10,10,20,0.95); backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px); border-top: 1px solid var(--border-medium);
      padding: 1rem 2rem; display: flex; flex-wrap: wrap; align-items: center;
      justify-content: space-between; gap: 1rem; font-size: 0.875rem;
      color: var(--text-secondary); box-shadow: 0 -4px 24px rgba(0,0,0,0.4);
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    .cookie-consent-bar.hidden-bar { transform: translateY(100%); opacity: 0; pointer-events: none; }
    .consent-text { flex: 1 1 300px; line-height: 1.5; font-weight: 300; }
    .consent-actions { display: flex; gap: 12px; flex-shrink: 0; }

    .modal-overlay { background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); }
    .toggle-wrapper { position: relative; display: inline-block; width: 44px; height: 24px; }
    .toggle-wrapper input { opacity: 0; width: 0; height: 0; }
    .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #374151; transition: 0.3s; border-radius: 24px; border: 1px solid var(--border-subtle); }
    .toggle-slider::before { content: ""; position: absolute; height: 18px; width: 18px; left: 2px; bottom: 2px; background-color: #EAEAEF; transition: 0.3s; border-radius: 50%; }
    .toggle-wrapper input:checked+.toggle-slider { background-color: #00E5FF; border-color: #00E5FF; }
    .toggle-wrapper input:checked+.toggle-slider::before { transform: translateX(20px); background-color: #0A0A0F; }
    .toggle-wrapper input:disabled+.toggle-slider { opacity: 0.5; cursor: not-allowed; }

    @media (max-width: 1024px) {
      .post-layout { grid-template-columns: 1fr; }
      .post-sidebar { position: static; }
    }
    @media (max-width: 768px) {
      .post-section { padding-top: 6rem; }
      .post-cover { min-height: 210px; }
      .cookie-consent-bar { flex-direction: column; align-items: flex-start; }
      .consent-actions { width: 100%; justify-content: flex-end; }
    }
  </style>
</head>
<body>

  <!-- LOADING -->
  <div id="loading-screen">
    <div class="loader-logo">
      <img src="https://adrianosena.dev.br/logo.png" alt="Logo" />
    </div>
    <div class="loader"></div>
    <div class="loader-text">Carregando</div>
  </div>

  <!-- HEADER -->
  <header class="fixed w-full z-50 glass-header transition-all duration-500">
    <div class="container mx-auto px-6 py-3.5">
      <div class="flex justify-between items-center">
        <a href="/" class="flex items-center space-x-3">
          <div class="w-10 h-10 flex items-center justify-center border border-[var(--border-medium)] rounded-md">
            <img src="https://adrianosena.dev.br/logo.png" alt="Logo" class="w-6 h-6 object-contain">
          </div>
          <div>
            <span class="text-sm font-semibold text-[var(--text-primary)] tracking-[0.12em] uppercase" style="font-family:'Inter',sans-serif;">Adriano Sena</span>
            <span class="text-[10px] text-[var(--secondary)] tracking-[0.2em] uppercase block" style="font-family:'Inter',sans-serif;">Dev Solutions</span>
          </div>
        </a>
        <nav class="hidden md:flex items-center space-x-7">
          <a href="/" class="nav-link">Início</a>
          <a href="/#solucoes" class="nav-link">Soluções</a>
          <a href="/#demonstracoes" class="nav-link">Demonstrações</a>
          <a href="/#loja" class="nav-link">Loja</a>
          <a href="/#precos" class="nav-link">Planos</a>
          <a href="/#contato" class="nav-link">Contato</a>
          <a href="/blog" class="nav-link active" style="color: var(--secondary);">Blog</a>
        </nav>
        <div class="flex items-center space-x-3">
          <a href="/#contato" class="btn-accent hidden md:inline-flex text-xs py-2.5 px-5">
            Solicitar Orçamento <i class="fas fa-arrow-right ml-1.5 text-[9px]"></i>
          </a>
          <button id="menu-toggle" class="md:hidden text-[var(--text-primary)] text-xl">
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </div>
      <div id="mobile-menu" class="hidden md:hidden mt-5 pb-4 border-t border-[var(--border-subtle)] pt-5">
        <div class="flex flex-col space-y-4">
          <a href="/" class="nav-link text-sm">Início</a>
          <a href="/#solucoes" class="nav-link text-sm">Soluções</a>
          <a href="/#demonstracoes" class="nav-link text-sm">Demonstrações</a>
          <a href="/#loja" class="nav-link text-sm">Loja de Soluções</a>
          <a href="/#precos" class="nav-link text-sm">Planos</a>
          <a href="/#contato" class="nav-link text-sm">Contato</a>
          <a href="/blog" class="nav-link text-sm" style="color: var(--secondary);">Blog</a>
          <a href="/#contato" class="btn-accent w-full text-center py-3 text-sm">Solicitar Orçamento</a>
        </div>
      </div>
    </div>
  </header>

  <!-- POST SECTION -->
  <section class="post-section">
    <div class="post-bg">
      <div class="bg-image"></div>
      <div class="bg-overlay"></div>
    </div>
    <div class="hero-glow glow-primary absolute z-10" style="top:30%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;opacity:0.05;"></div>

    <div class="container mx-auto px-6 post-content-wrapper">
      <!-- Breadcrumb -->
      <nav class="mb-6 text-sm" style="color: var(--text-muted)">
        <ol class="flex items-center flex-wrap gap-2">
          <li><a href="/" class="hover:text-[var(--secondary)]">Início</a></li>
          <li><i class="fas fa-chevron-right text-xs"></i></li>
          <li><a href="/blog" class="hover:text-[var(--secondary)]">Blog</a></li>
          <li><i class="fas fa-chevron-right text-xs"></i></li>
          <li id="breadcrumb-current" style="color: var(--secondary)">${title}</li>
        </ol>
      </nav>

      <div class="max-w-4xl mb-10" data-aos="fade-up">
        <div id="post-tags" class="mb-4"></div>
        <h1 id="post-title" class="text-3xl md:text-5xl font-bold leading-tight mb-5">${title}</h1>
        <div class="mb-2 flex flex-wrap gap-2">
          <span class="meta-item"><i class="far fa-calendar"></i><span id="post-date"></span></span>
          <span class="meta-item"><i class="far fa-user"></i><span id="post-author">Equipe Adriano Sena Dev</span></span>
          <span class="meta-item"><i class="far fa-clock"></i><span id="read-time">0</span> min de leitura</span>
          <span class="meta-item"><i class="far fa-eye"></i><span id="view-count">0</span> visualizações</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <article class="lg:col-span-2">
          <div class="glass-card mb-8 overflow-hidden" data-aos="fade-up">
            <img id="post-image" src="${escHtml(fullImage)}" alt="${title}" class="post-cover" />
          </div>

          <div class="glass-card p-6 md:p-8 mb-8" data-aos="fade-up">
            <div id="post-content" class="post-content"></div>
          </div>

          <!-- Author Card -->
          <div class="glass-card p-6 mb-8" data-aos="fade-up">
            <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
              <i class="fas fa-user-edit text-[var(--secondary)]"></i> Autor
            </h3>
            <div class="flex flex-col sm:flex-row items-start gap-4">
              <img id="author-avatar" src="https://adrianosena.dev.br/logo.png" alt="Autor" class="w-16 h-16 rounded-full border-2 object-cover" style="border-color: var(--secondary)" />
              <div class="flex-1">
                <div id="author-name" class="font-bold text-lg mb-1">Equipe Adriano Sena Dev</div>
                <p id="author-bio" class="text-[var(--text-secondary)] text-sm mb-4">Conteúdo revisado para decisão técnica e operacional de empresas.</p>
                <div class="grid grid-cols-3 gap-4 text-center">
                  <div class="glass-card p-3">
                    <span id="author-post-count" class="block text-2xl font-bold gradient-text">0</span>
                    <span class="text-xs text-[var(--text-muted)]">Posts do autor</span>
                  </div>
                  <div class="glass-card p-3">
                    <span id="total-post-count" class="block text-2xl font-bold gradient-text">0</span>
                    <span class="text-xs text-[var(--text-muted)]">Total de posts</span>
                  </div>
                  <div class="glass-card p-3">
                    <span id="total-category-count" class="block text-2xl font-bold gradient-text">0</span>
                    <span class="text-xs text-[var(--text-muted)]">Categorias</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Likes & Comments -->
          <div class="glass-card p-6 mb-8" data-aos="fade-up">
            <div class="flex flex-wrap items-center gap-4 mb-6">
              <button id="like-btn" class="btn-outline text-sm py-2.5 px-5">
                <i class="far fa-thumbs-up mr-2"></i>Curtir
              </button>
              <span class="text-[var(--text-secondary)]"><strong id="like-count">0</strong> curtidas</span>
              <div id="share-actions" class="flex flex-wrap gap-2"></div>
              <span id="share-feedback" class="text-sm text-[var(--text-muted)]"></span>
            </div>

            <h4 class="font-semibold mb-4 text-lg flex items-center gap-2">
              <i class="fas fa-comments text-[var(--secondary)]"></i> Comentários
            </h4>
            <form id="comment-form" class="space-y-3 mb-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input id="comment-name" type="text" required placeholder="Seu nome" class="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[var(--border-medium)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary)] transition">
                <input id="comment-email" type="email" placeholder="Seu email (opcional)" class="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[var(--border-medium)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary)] transition">
              </div>
              <textarea id="comment-message" required minlength="6" placeholder="Escreva seu comentário" rows="4" class="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[var(--border-medium)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary)] transition"></textarea>
              <button type="submit" class="btn-accent w-full sm:w-auto text-sm py-2.5 px-6">
                <i class="fas fa-comment-dots mr-2"></i>Publicar comentário
              </button>
            </form>
            <div id="comment-feedback" class="text-sm mb-3 text-[var(--text-muted)]"></div>
            <div id="comments-list"></div>
          </div>

          <!-- Related Posts -->
          <div class="glass-card p-6" data-aos="fade-up">
            <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
              <i class="fas fa-link text-[var(--secondary)]"></i> Posts Relacionados
            </h3>
            <div id="related-posts" class="related-grid"></div>
          </div>
        </article>

        <!-- Sidebar -->
        <aside class="lg:col-span-1" style="position: sticky; top: 110px; align-self: start;">
          <div class="glass-card p-6 mb-6" data-aos="fade-left">
            <h3 class="text-xl font-semibold mb-3 flex items-center gap-2">
              <i class="fas fa-envelope text-[var(--secondary)]"></i> Newsletter
            </h3>
            <p class="text-[var(--text-secondary)] text-sm mb-4">Receba materiais sobre sistemas, apps, servidores e boas práticas.</p>
            <form id="newsletter-form" class="space-y-3">
              <input id="newsletter-name" type="text" placeholder="Seu nome" class="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[var(--border-medium)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary)] transition">
              <input id="newsletter-email" type="email" placeholder="Seu melhor email" required class="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[var(--border-medium)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary)] transition">
              <label class="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input id="newsletter-push" type="checkbox" class="rounded border-[var(--border-medium)] bg-transparent">
                Quero receber notificações de novos posts
              </label>
              <button type="submit" class="btn-accent w-full text-sm py-3">
                <i class="fas fa-paper-plane mr-2"></i>Quero receber
              </button>
            </form>
            <p id="newsletter-feedback" class="text-sm mt-3 text-[var(--text-muted)]"></p>
          </div>

          <div class="glass-card p-6 mb-6" data-aos="fade-left">
            <h3 class="text-xl font-semibold mb-3 flex items-center gap-2">
              <i class="fas fa-rss text-[var(--secondary)]"></i> RSS & Chrome
            </h3>
            <p class="text-[var(--text-secondary)] text-sm mb-4">Assine o feed RSS e ative notificações no Chrome.</p>
            <div class="flex flex-col gap-3">
              <a href="/rss.xml" target="_blank" rel="noopener" class="btn-outline text-center text-sm py-3">
                <i class="fas fa-rss mr-2"></i>Assinar RSS
              </a>
              <button id="enable-chrome-notifications" type="button" class="btn-accent text-sm py-3">
                <i class="fab fa-chrome mr-2"></i>Ativar no Chrome
              </button>
            </div>
            <p id="chrome-notify-feedback" class="text-sm mt-3 text-[var(--text-muted)]"></p>
          </div>

          <div class="glass-card p-6 mb-6" data-aos="fade-left">
            <h3 class="text-xl font-semibold mb-3 flex items-center gap-2">
              <i class="fas fa-folder text-[var(--secondary)]"></i> Categorias
            </h3>
            <ul id="category-list" class="space-y-2 text-sm"></ul>
          </div>

          <div class="glass-card p-6" data-aos="fade-left">
            <h3 class="text-xl font-semibold mb-3">Precisa de ajuda?</h3>
            <p class="text-[var(--text-secondary)] text-sm mb-4">Fale com a equipe para desenhar a melhor estratégia de software e infraestrutura.</p>
            <a href="/#contato" class="btn-outline w-full text-center block text-sm py-3">
              Solicitar diagnóstico <i class="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="bg-[#050510] text-white py-14 px-6 border-t border-[var(--border-subtle)]">
    <div class="container mx-auto">
      <div class="grid md:grid-cols-4 gap-10">
        <div>
          <div class="flex items-center space-x-3 mb-5">
            <div class="w-10 h-10 flex items-center justify-center border border-[var(--border-medium)] rounded-md">
              <img src="https://adrianosena.dev.br/logo.png" alt="Logo" class="w-6 h-6 object-contain">
            </div>
            <div>
              <div class="font-semibold text-white tracking-wider text-sm" style="font-family:'Inter',sans-serif;">Adriano Sena</div>
              <div class="text-[var(--secondary)] text-[10px] tracking-[0.2em] uppercase">Dev Solutions</div>
            </div>
          </div>
          <p class="text-[var(--text-muted)] text-sm font-light">Transformamos ideias em Sites, Aplicativos e Sistemas que geram resultados reais para o seu negócio.</p>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4 text-xs tracking-[0.2em] uppercase">Especialidades</h4>
          <ul class="space-y-2.5 text-sm text-[var(--text-muted)] font-light">
            <li><a href="/#solucoes" class="hover:text-[var(--secondary)] transition">Sites</a></li>
            <li><a href="/#solucoes" class="hover:text-[var(--secondary)] transition">Lojas Virtuais</a></li>
            <li><a href="/#solucoes" class="hover:text-[var(--secondary)] transition">Aplicativos</a></li>
            <li><a href="/#loja" class="hover:text-[var(--secondary)] transition">Soluções Prontas</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4 text-xs tracking-[0.2em] uppercase">Links</h4>
          <ul class="space-y-2.5 text-sm text-[var(--text-muted)] font-light">
            <li><a href="/" class="hover:text-[var(--secondary)] transition">Início</a></li>
            <li><a href="/#demonstracoes" class="hover:text-[var(--secondary)] transition">Demonstrações</a></li>
            <li><a href="/#precos" class="hover:text-[var(--secondary)] transition">Planos</a></li>
            <li><a href="/#contato" class="hover:text-[var(--secondary)] transition">Contato</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4 text-xs tracking-[0.2em] uppercase">Redes Sociais</h4>
          <div class="flex space-x-3 mb-5">
            <a href="https://www.instagram.com/adrianosena.dev.br/" target="_blank" class="w-10 h-10 border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--secondary)] hover:border-[var(--secondary)] transition rounded-md">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="https://wa.me/5564933004882" target="_blank" class="w-10 h-10 border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--secondary)] hover:border-[var(--secondary)] transition rounded-md">
              <i class="fab fa-whatsapp"></i>
            </a>
          </div>
          <p class="text-[var(--text-muted)] text-xs font-light">&copy; <span id="current-year">2024</span> Adriano Sena Dev.<br>CNPJ: 63.005.629/0001-44.<br>Todos os direitos reservados.</p>
          <a href="/privacidade" class="text-[var(--secondary)] text-xs font-medium hover:text-white transition mt-2 inline-block">Política de Privacidade</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- SCROLL TO TOP -->
  <button class="scroll-top" id="scrollTop" aria-label="Voltar ao topo">
    <i class="fas fa-arrow-up text-xs"></i>
  </button>

  <!-- COOKIE CONSENT BAR -->
  <div id="cookie-consent-bar" class="cookie-consent-bar hidden-bar">
    <div class="consent-text">
      🍪 Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdos. Ao continuar navegando, você concorda com nossa <a href="/privacidade" class="underline hover:text-white">Política de Privacidade</a>.
    </div>
    <div class="consent-actions">
      <button id="btn-configurar" class="btn-outline text-xs py-2.5 px-5">
        <i class="fas fa-sliders-h mr-1.5"></i> Configurar
      </button>
      <button id="btn-aceitar-todos" class="btn-accent text-xs py-2.5 px-5">
        <i class="fas fa-check mr-1.5"></i> Aceitar Todos
      </button>
    </div>
  </div>

  <!-- COOKIE SETTINGS MODAL -->
  <div id="cookie-settings-modal" class="fixed inset-0 z-[60] flex items-center justify-center modal-overlay hidden transition-opacity duration-300">
    <div class="glass-card max-w-lg mx-4 p-7 animate__animated animate__fadeInUp h-auto w-full shadow-2xl border-[var(--border-medium)]">
      <div class="flex justify-between items-center mb-5">
        <h3 class="text-lg font-semibold text-[var(--text-primary)]" style="font-family:'Inter',sans-serif;">
          <i class="fas fa-sliders-h mr-2 text-[var(--secondary)]"></i> Configurações de Cookies
        </h3>
        <button id="close-settings" class="text-[var(--text-muted)] hover:text-[var(--secondary)] transition-colors duration-300">
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>
      <p class="text-[var(--text-secondary)] text-sm mb-6 font-light leading-relaxed">
        Selecione quais tipos de cookies você permite que utilizemos:
      </p>
      <div class="space-y-5 mb-7">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-semibold text-sm text-[var(--text-primary)]">Cookies Essenciais</h4>
            <p class="text-xs text-[var(--text-muted)] font-light">Necessários para o funcionamento básico do site</p>
          </div>
          <label class="toggle-wrapper">
            <input type="checkbox" id="essential-cookies" checked disabled>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-semibold text-sm text-[var(--text-primary)]">Cookies de Desempenho</h4>
            <p class="text-xs text-[var(--text-muted)] font-light">Nos ajudam a entender como os visitantes usam o site</p>
          </div>
          <label class="toggle-wrapper">
            <input type="checkbox" id="performance-cookies">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-semibold text-sm text-[var(--text-primary)]">Cookies de Marketing</h4>
            <p class="text-xs text-[var(--text-muted)] font-light">Usados para rastrear visitantes entre sites</p>
          </div>
          <label class="toggle-wrapper">
            <input type="checkbox" id="marketing-cookies">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
      <div class="flex justify-end">
        <button id="save-settings" class="btn-accent px-6 py-3 rounded-lg font-semibold text-xs">
          <i class="fas fa-check mr-2"></i> Salvar Preferências
        </button>
      </div>
    </div>
  </div>

  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
  <script>
    // ===== LOADING =====
    window.addEventListener('load', () => {
      const loading = document.getElementById('loading-screen');
      loading.classList.add('hidden');
      setTimeout(() => { loading.style.display = 'none'; }, 600);
    });

    // ===== AOS =====
    AOS.init({ duration: 800, once: true, offset: 80 });

    // ===== MOBILE MENU =====
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
      menuToggle.querySelector('i').className = mobileMenu.classList.contains('hidden') ? 'fas fa-bars' : 'fas fa-times';
    });
    document.querySelectorAll('#mobile-menu a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuToggle.querySelector('i').className = 'fas fa-bars';
      });
    });
    document.addEventListener('click', (e) => {
      if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        menuToggle.querySelector('i').className = 'fas fa-bars';
      }
    });

    // ===== SCROLL TO TOP =====
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => scrollTopBtn.classList.toggle('show', window.pageYOffset > 500));
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ===== COOKIE CONSENT =====
    const consentBar = document.getElementById('cookie-consent-bar');
    const cookieModal = document.getElementById('cookie-settings-modal');
    const btnConfigurar = document.getElementById('btn-configurar');
    const btnAceitarTodos = document.getElementById('btn-aceitar-todos');
    const closeSettingsBtn = document.getElementById('close-settings');
    const saveSettingsBtn = document.getElementById('save-settings');

    function hideConsentBar() { consentBar.classList.add('hidden-bar'); }
    function showConsentBar() { consentBar.classList.remove('hidden-bar'); }
    function hideModal() { cookieModal.classList.add('hidden'); }
    function showModal() { cookieModal.classList.remove('hidden'); }

    function savePreferences(performance, marketing, essential = true) {
      localStorage.setItem('cookiePreferences', JSON.stringify({ performance, marketing, essential }));
      hideConsentBar();
      hideModal();
    }

    const savedPrefs = localStorage.getItem('cookiePreferences');
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs);
        document.getElementById('performance-cookies').checked = prefs.performance || false;
        document.getElementById('marketing-cookies').checked = prefs.marketing || false;
        hideConsentBar();
      } catch (e) { showConsentBar(); }
    } else {
      showConsentBar();
    }

    btnAceitarTodos.addEventListener('click', () => savePreferences(true, true, true));
    btnConfigurar.addEventListener('click', showModal);
    closeSettingsBtn.addEventListener('click', hideModal);
    cookieModal.addEventListener('click', (e) => { if (e.target === cookieModal) hideModal(); });
    saveSettingsBtn.addEventListener('click', () => {
      const performance = document.getElementById('performance-cookies').checked;
      const marketing = document.getElementById('marketing-cookies').checked;
      savePreferences(performance, marketing, true);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !cookieModal.classList.contains('hidden')) hideModal(); });

    // ===== POST FUNCTIONALITY =====
    function formatDate(d) {
      return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    }

    function stripHtml(html) {
      return String(html || "").replace(/<[^>]*>/g, " ").replace(/\\s+/g, " ").trim();
    }

    function escHtmlClient(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function normalizeCategory(c) {
      return String(c || "Sem categoria").trim();
    }

    function toAbsoluteUrl(urlPath) {
      const base = "https://www.adrianosena.dev.br";
      const value = String(urlPath || "").trim() || "/logoWeb.png";
      if (/^https?:\\/\\//i.test(value)) return value;
      return value.startsWith("/") ? base + value : base + "/" + value;
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

    function isSupportedWebPushBrowser() {
      const ua = navigator.userAgent || "";
      return /Chrome/.test(ua) && !/OPR|Brave|SamsungBrowser/.test(ua) || /Edg/.test(ua);
    }

    function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
      return outputArray;
    }

    async function ensureChromeNotifications(emailForRegistration) {
      const feedback = document.getElementById("chrome-notify-feedback");
      if (!isSupportedWebPushBrowser()) {
        feedback.textContent = "Use Google Chrome ou Microsoft Edge para ativar notificações.";
        return false;
      }
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        feedback.textContent = "Seu navegador não oferece suporte completo a Web Push.";
        return false;
      }
      let permission = Notification.permission;
      if (permission === "default") {
        try { permission = await Notification.requestPermission(); } catch (_) {
          feedback.textContent = "Não foi possível solicitar permissão de notificação.";
          return false;
        }
      }
      if (permission !== "granted") {
        feedback.textContent = "Permissão não concedida. Você pode liberar nas configurações do Chrome.";
        return false;
      }
      feedback.textContent = "Ativando notificações em background...";
      const keyRes = await fetch('/api/push/vapid-public-key');
      const keyData = await keyRes.json();
      if (!keyRes.ok || !keyData?.publicKey) {
        feedback.textContent = "Não foi possível obter a chave de notificações no servidor.";
        return false;
      }
      const registration = await navigator.serviceWorker.register('/sw.js');
      const existingSub = await registration.pushManager.getSubscription();
      const subscription = existingSub || await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(keyData.publicKey)
      });
      try {
        const subscribeRes = await fetch('/api/push/subscribe', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription, email: emailForRegistration || "", source: "post", userAgent: navigator.userAgent || "" })
        });
        if (!subscribeRes.ok) { feedback.textContent = "Falha ao concluir assinatura no servidor."; return false; }
      } catch (_) {}
      feedback.textContent = "Notificações ativadas com sucesso para novos posts.";
      return true;
    }

    async function submitNewsletter(email) {
      const name = document.getElementById("newsletter-name").value.trim();
      const wantsPush = document.getElementById("newsletter-push").checked;
      if (wantsPush && "Notification" in window && Notification.permission === "default") {
        try { await Notification.requestPermission(); } catch (_) {}
      }
      const payload = { name: name || "Inscrição Newsletter Blog", email, source: "post", wantsEmail: true, wantsPush };
      const res = await fetch("/api/subscribers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: payload.name, email, status: "new", project: "newsletter", message: "Lead originado na newsletter da página de post" }) }).catch(() => {});
      return res.ok;
    }

    function renderShareActions(post) {
      const container = document.getElementById("share-actions");
      const feedback = document.getElementById("share-feedback");
      if (!container) return;
      const title = String(post?.title || "Confira este artigo");
      const slugValue = String(post?.slug || "");
      const postUrl = 'https://www.adrianosena.dev.br/post?slug=' + encodeURIComponent(slugValue);
      const text = title + ' - ' + postUrl;

      const links = [
        { label: "WhatsApp", icon: "fab fa-whatsapp", href: 'https://wa.me/?text=' + encodeURIComponent(text) },
        { label: "X", icon: "fab fa-twitter", href: 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(postUrl) },
        { label: "Facebook", icon: "fab fa-facebook-f", href: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(postUrl) },
        { label: "LinkedIn", icon: "fab fa-linkedin-in", href: 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(postUrl) },
        { label: "Telegram", icon: "fab fa-telegram-plane", href: 'https://t.me/share/url?url=' + encodeURIComponent(postUrl) + '&text=' + encodeURIComponent(title) }
      ];

      container.innerHTML = links.map(item =>
        '<a class="share-btn" href="' + item.href + '" target="_blank" rel="noopener noreferrer"><i class="' + item.icon + '"></i><span>' + item.label + '</span></a>'
      ).join('') +
      '<button type="button" class="share-btn" id="share-instagram"><i class="fab fa-instagram"></i><span>Instagram</span></button>' +
      '<button type="button" class="share-btn" id="share-copy-link"><i class="fas fa-link"></i><span>Copiar link</span></button>' +
      '<button type="button" class="share-btn" id="share-native"><i class="fas fa-share-nodes"></i><span>Compartilhar</span></button>';

      if (!navigator.share) document.getElementById("share-native").style.display = "none";

      function writeFeedback(message) {
        if (!feedback) return;
        feedback.textContent = message;
        setTimeout(() => { if (feedback.textContent === message) feedback.textContent = ""; }, 2400);
      }

      async function copyLink(message) {
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(postUrl);
            writeFeedback(message);
            return true;
          }
          const textarea = document.createElement("textarea");
          textarea.value = postUrl;
          textarea.style.position = "fixed"; textarea.style.top = "-1000px";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          writeFeedback(message);
          return true;
        } catch (_) {
          window.prompt("Copie manualmente o link abaixo:", postUrl);
          writeFeedback("Copie o link manualmente na janela exibida.");
          return false;
        }
      }

      document.getElementById("share-copy-link")?.addEventListener("click", () => copyLink("Link copiado com sucesso."));
      document.getElementById("share-instagram")?.addEventListener("click", async () => {
        await copyLink("Link copiado. Agora cole no Instagram.");
        window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
      });
      document.getElementById("share-native")?.addEventListener("click", async () => {
        if (!navigator.share) return;
        try { await navigator.share({ title, text: title, url: postUrl }); } catch (_) {}
      });
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
      Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([name, total]) => {
        const li = document.createElement("li");
        li.innerHTML = '<a href="/blog?category=' + encodeURIComponent(name) + '" class="flex items-center justify-between hover:text-[var(--secondary)] transition" style="color: var(--text-primary)"><span>' + name + '</span><span style="color: var(--text-muted)">' + total + '</span></a>';
        list.appendChild(li);
      });
      document.getElementById("total-post-count").textContent = String(published.length);
      document.getElementById("total-category-count").textContent = String(Object.keys(counts).length);
    }

    function renderComments(comments) {
      const container = document.getElementById('comments-list');
      container.innerHTML = '';
      if (!comments || !comments.length) {
        container.innerHTML = '<p class="text-[var(--text-muted)] text-sm">Seja o primeiro a comentar.</p>';
        return;
      }
      comments.forEach((c) => {
        const div = document.createElement('div');
        div.className = 'comment-item';
        div.innerHTML = '<div class="comment-meta"><strong>' + escHtmlClient(c.name) + '</strong> • ' + formatDate(c.createdAt) + '</div><div class="comment-message">' + escHtmlClient(c.message) + '</div>';
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
      const payload = { name: nameInput.value.trim(), email: emailInput.value.trim(), message: messageInput.value.trim() };
      feedback.textContent = 'Publicando...';
      const res = await fetch('/api/posts/' + postId + '/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok && data.success) {
        feedback.textContent = 'Comentário publicado com sucesso.';
        messageInput.value = '';
        renderComments(data.comments || []);
      } else {
        feedback.textContent = data.error || 'Não foi possível publicar o comentário.';
      }
    }

    async function loadLikes(postId) {
      const res = await fetch('/api/posts/' + postId + '/likes');
      const data = await res.json();
      document.getElementById('like-count').textContent = data.total || 0;
    }

    async function submitLike(postId) {
      const btn = document.getElementById('like-btn');
      btn.disabled = true;
      const res = await fetch('/api/posts/' + postId + '/likes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visitorKey: getVisitorKey() }) });
      const data = await res.json();
      if (data?.success) {
        document.getElementById('like-count').textContent = data.total || 0;
        btn.innerHTML = data.added ? '<i class="fas fa-thumbs-up mr-2"></i>Obrigado!' : '<i class="fas fa-check mr-2"></i>Já curtido';
      }
      btn.disabled = false;
    }

    function renderRelatedPosts(allPosts, currentPost) {
      const container = document.getElementById('related-posts');
      const category = normalizeCategory(currentPost.category);
      const related = (allPosts || []).filter(p => p.status === 'published' && p.id !== currentPost.id && normalizeCategory(p.category) === category).slice(0, 4);
      if (!related.length) {
        container.innerHTML = '<p class="text-[var(--text-muted)] text-sm">Ainda não há posts relacionados nesta categoria.</p>';
        return;
      }
      container.innerHTML = related.map((p) => {
        const image = p.image || '/logoWeb.png';
        const date = formatDate(p.createdAt || p.date || new Date());
        const link = '/post?slug=' + encodeURIComponent(p.slug || '');
        const excerpt = stripHtml(p.description || p.excerpt || '').slice(0, 90);
        return '<a class="related-item" href="' + link + '"><img src="' + image + '" alt="' + escHtmlClient(p.title || '') + '"><div class="related-body"><div class="related-meta"><span>' + date + '</span><span>' + escHtmlClient(normalizeCategory(p.category)) + '</span></div><div class="related-title">' + escHtmlClient((p.title || '').slice(0, 90)) + '</div><div class="related-excerpt">' + escHtmlClient(excerpt || 'Leia este conteúdo relacionado para aprofundar o tema.') + '</div></div></a>';
      }).join('');
    }

    async function loadPostData() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const slugFromPath = pathParts[0] === 'post' ? decodeURIComponent(pathParts[1] || '') : '';
        const slug = (urlParams.get("slug") || slugFromPath || "${slug}").trim();
        if (!slug) throw new Error("Slug ausente");

        const [postRes, allRes] = await Promise.all([
          fetch('/api/posts/slug/' + encodeURIComponent(slug)),
          fetch("/api/posts")
        ]);

        if (!postRes.ok) throw new Error("Post não encontrado");

        const post = await postRes.json();
        const allPostsRaw = allRes.ok ? await allRes.json() : [];
        const allPosts = Array.isArray(allPostsRaw) ? allPostsRaw : (Array.isArray(allPostsRaw?.posts) ? allPostsRaw.posts : []);

        const viewsRes = await fetch('/api/post/views/' + post.id);
        const viewsData = viewsRes.ok ? await viewsRes.json() : { totalViews: 0 };

        document.getElementById("breadcrumb-current").textContent = post.title || "Post";
        document.getElementById("post-title").textContent = post.title || "Post";
        document.getElementById("post-date").textContent = formatDate(post.createdAt || post.date || new Date());
        document.getElementById("post-author").textContent = post.author || "Equipe Adriano Sena Dev";
        document.getElementById("author-name").textContent = post.author || "Equipe Adriano Sena Dev";
        document.getElementById("view-count").textContent = viewsData.totalViews || 0;

        try {
          const authorQuery = encodeURIComponent(post.author || '');
          if (authorQuery) {
            const authorRes = await fetch('/api/public/author-profile?author=' + authorQuery);
            if (authorRes.ok) {
              const authorData = await authorRes.json();
              const profile = authorData?.profile;
              if (profile) {
                document.getElementById("author-name").textContent = profile.name || post.author || "Equipe Adriano Sena Dev";
                document.getElementById("post-author").textContent = profile.name || post.author || "Equipe Adriano Sena Dev";
                document.getElementById("author-bio").textContent = profile.bio || "Conteúdo revisado para decisão técnica e operacional de empresas.";
                if (profile.photo) document.getElementById("author-avatar").src = profile.photo;
              }
            }
          }
        } catch (_) {}

        // SEO dinâmico
        const seoTitle = (post.title || "Post") + ' | Adriano Sena Dev';
        const seoDesc = stripHtml(post.description || post.excerpt || post.content || "").slice(0, 170);
        const seoImage = post.image || "/logoWeb.png";
        const seoUrl = 'https://www.adrianosena.dev.br/post?slug=' + encodeURIComponent(post.slug || slug);
        document.title = seoTitle;
        document.querySelector("meta[name='description']")?.setAttribute("content", seoDesc);
        document.querySelector("meta[property='og:title']")?.setAttribute("content", seoTitle);
        document.querySelector("meta[property='og:description']")?.setAttribute("content", seoDesc);
        document.querySelector("meta[name='twitter:title']")?.setAttribute("content", seoTitle);
        document.querySelector("meta[name='twitter:description']")?.setAttribute("content", seoDesc);
        document.querySelector("meta[property='og:image']")?.setAttribute("content", seoImage);
        document.querySelector("meta[name='twitter:image']")?.setAttribute("content", seoImage);
        document.querySelector("meta[property='og:url']")?.setAttribute("content", seoUrl);
        document.querySelector("link[rel='canonical']")?.setAttribute("href", seoUrl);

        document.getElementById("post-image").src = seoImage;
        document.getElementById("post-image").alt = post.title || "Imagem do post";
        document.getElementById("post-content").innerHTML = post.content || "";

        const words = stripHtml(post.content).split(/\\s+/).filter(Boolean).length;
        document.getElementById("read-time").textContent = Math.max(1, Math.ceil(words / 220));

        const tagWrap = document.getElementById("post-tags");
        tagWrap.innerHTML = "";
        if (post.category) {
          const cat = document.createElement("span");
          cat.className = "tag";
          cat.innerHTML = '<i class="fas fa-folder"></i>' + post.category;
          tagWrap.appendChild(cat);
        }
        (Array.isArray(post.tags) ? post.tags : []).forEach(t => {
          const el = document.createElement("span");
          el.className = "tag";
          el.innerHTML = '<i class="fas fa-tag"></i>' + t;
          tagWrap.appendChild(el);
        });

        const published = allPosts.filter(p => p.status === "published");
        const author = (post.author || "").trim().toLowerCase();
        document.getElementById("author-post-count").textContent = String(published.filter(p => (p.author || "").trim().toLowerCase() === author).length || 1);

        renderCategoriesWithCount(allPosts);
        renderRelatedPosts(allPosts, post);
        renderShareActions(post);
        await loadLikes(post.id);
        await loadComments(post.id);

        document.getElementById('like-btn').addEventListener('click', () => submitLike(post.id));
        document.getElementById('comment-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          await postComment(post.id);
        });

        // JSON-LD Article adicional
        const jsonLd = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": seoDesc,
          "image": [seoImage],
          "datePublished": post.createdAt || post.date,
          "author": { "@type": "Person", "name": post.author || "Equipe Adriano Sena Dev" },
          "publisher": { "@type": "Organization", "name": "Adriano Sena Dev", "logo": { "@type": "ImageObject", "url": "https://www.adrianosena.dev.br/logo.png" } },
          "mainEntityOfPage": 'https://www.adrianosena.dev.br/post?slug=' + encodeURIComponent(post.slug || slug)
        };
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(jsonLd);
        document.head.appendChild(script);
      } catch (err) {
        console.error(err);
        document.getElementById("post-title").textContent = "Post não encontrado";
        document.getElementById("post-content").innerHTML = "<p>O conteúdo não foi encontrado ou está indisponível no momento.</p>";
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
        feedback.textContent = "Inscrição confirmada! Você receberá novos conteúdos por email.";
        e.target.reset();
      } else {
        feedback.textContent = "Não foi possível concluir agora. Tente novamente em instantes.";
      }
    });

    document.getElementById("enable-chrome-notifications").addEventListener("click", async () => {
      const email = document.getElementById("newsletter-email").value.trim();
      await ensureChromeNotifications(email);
    });

    document.getElementById("current-year").textContent = new Date().getFullYear();
    loadPostData();
  </script>
</body>
</html>`;

    return html;
  }
};