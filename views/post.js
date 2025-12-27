
module.exports = {
  HtmlPost(post, id) {
  const html = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${post.title} | Adriano Sena</title>

  <!-- Open Graph -->
  <meta property="og:title" content="${post.title} | Adriano Sena" />
  <meta property="og:description" content="${post.description}" />
  <meta property="og:image" content="${post.image}" />
  <meta property="og:url" content="https://adrianosena.dev.br/blog/post?id=${id}" />
  <meta property="og:type" content="article" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@adrianosenas" />
  <meta name="twitter:title" content="${post.title} | Adriano Sena" />
  <meta name="twitter:description" content="${post.description}" />
  <meta name="twitter:image" content="${post.image}" />
  
  <link rel="shortcut icon" href="https://adrianosena.dev.br/logo.png" type="image/x-icon">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=Fira+Code:wght@400;500&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
  
  <style>
    /* Variáveis CSS */
    :root {
      --primary: #2563eb;
      --secondary: #10B981;
      --dark: #1F2937;
      --light: #F8FAFC;
      --black: #111827;
      --text-primary: #1F2937;
      --text-secondary: #6B7280;
      --text-light: #F8FAFC;
      --bg-light: #F8FAFC;
      --bg-card: #FFFFFF;
      --border-color: rgba(37, 99, 235, 0.1);
      --gradient: linear-gradient(135deg, #2563eb 0%, #10B981 100%);
      --neon-glow: 0 0 10px rgba(37, 99, 235, 0.4), 0 0 20px rgba(16, 185, 129, 0.3);
    }

    [data-theme="dark"] {
      --primary: #3b82f6;
      --secondary: #10B981;
      --dark: #0f172a;
      --light: #0057e4;
      --black: #f8fafc;
      --text-primary: #F8FAFC;
      --text-secondary: #D1D5DB;
      --text-light: #F8FAFC;
      --bg-light: #1e293b;
      --bg-card: #334155;
      --border-color: rgba(59, 130, 246, 0.2);
      --gradient: linear-gradient(135deg, #3b82f6 0%, #10B981 100%);
      --neon-glow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(16, 185, 129, 0.4);
    }

    /* Base Styles */
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-light);
      color: var(--text-primary);
      overflow-x: hidden;
      transition: background-color 0.3s ease, color 0.3s ease;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      color: var(--text-primary);
    }

    .code-font {
      font-family: 'Fira Code', monospace;
    }

    /* Layout Improvements */
    main {
      flex: 1;
    }

    /* Navigation */
    .nav-link {
      position: relative;
      font-weight: 500;
      color: var(--text-primary);
      transition: color 0.3s ease;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--primary);
      transition: width 0.3s ease;
    }

    .nav-link:hover {
      color: var(--primary);
    }

    .nav-link:hover::after {
      width: 100%;
    }

    /* Post Content Styling */
    .blog-content {
      line-height: 1.8;
      font-size: 1.1rem;
      color: var(--text-primary);
    }

    .blog-content h2 {
      margin-top: 2.5rem;
      margin-bottom: 1.2rem;
      color: var(--primary);
      font-size: 1.8rem;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 0.5rem;
    }

    .blog-content h3 {
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: var(--primary);
      font-size: 1.5rem;
    }

    .blog-content p {
      margin-bottom: 1.5rem;
      color: var(--text-primary);
    }

    .blog-content a {
      color: var(--primary);
      text-decoration: underline;
      text-decoration-thickness: 1.5px;
      text-underline-offset: 3px;
      transition: all 0.3s ease;
    }

    .blog-content a:hover {
      color: var(--secondary);
      text-decoration-thickness: 2px;
    }

    .blog-content ul, .blog-content ol {
      margin-bottom: 1.5rem;
      padding-left: 2rem;
      color: var(--text-primary);
    }

    .blog-content li {
      margin-bottom: 0.5rem;
    }

    .blog-content blockquote {
      border-left: 4px solid var(--primary);
      padding: 1rem 1.5rem;
      margin: 2rem 0;
      background: var(--bg-card);
      border-radius: 0 8px 8px 0;
      font-style: italic;
      color: var(--text-secondary);
    }

    .blog-content pre {
      background: var(--dark);
      color: var(--text-light);
      padding: 1.5rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 2rem 0;
      border: 1px solid var(--border-color);
    }

    .blog-content code {
      background: rgba(37, 99, 235, 0.1);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-family: 'Fira Code', monospace;
      font-size: 0.9em;
      color: var(--primary);
    }

    .blog-content img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1.5rem 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* Card Styling */
    .card {
      background: var(--bg-card);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      color: var(--text-primary);
    }

    .card:hover {
      border-color: var(--primary);
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    /* Buttons */
    .btn-primary {
      background: var(--gradient);
      border: none;
      color: white;
      box-shadow: var(--neon-glow);
      transition: all 0.3s ease;
      font-weight: 600;
      border-radius: 8px;
      padding: 0.75rem 1.5rem;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 15px rgba(37, 99, 235, 0.6), 0 0 30px rgba(16, 185, 129, 0.4);
    }

    /* Post Meta */
    .post-meta {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
      flex-wrap: wrap;
    }

    .post-meta i {
      color: var(--primary);
      margin-right: 0.5rem;
    }

    .tag {
      display: inline-block;
      background: rgba(96, 165, 250, 0.2);
      color: var(--primary);
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
      transition: all 0.3s ease;
    }

    .tag:hover {
      background: rgba(96, 165, 250, 0.3);
      transform: translateY(-2px);
    }

    /* Featured Image */
    .featured-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 12px;
      margin: 2rem 0;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    /* Sidebar */
    .sidebar-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .sidebar-title {
      font-size: 1.2rem;
      margin-bottom: 1rem;
      color: var(--primary);
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.75rem;
    }

    /* Author Card */
    .author-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 2rem;
      margin: 3rem 0;
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .author-image {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 3px solid var(--primary);
      padding: 3px;
      object-fit: cover;
    }

    .author-info h4 {
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    .author-info p {
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }

    .author-social {
      display: flex;
      gap: 1rem;
    }

    .author-social a {
      color: var(--text-secondary);
      font-size: 1.2rem;
      transition: all 0.3s ease;
    }

    .author-social a:hover {
      color: var(--primary);
      transform: translateY(-3px);
    }

    /* Scroll to Top */
    .scroll-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--gradient);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: var(--neon-glow);
    }

    .scroll-top.show {
      opacity: 1;
      visibility: visible;
    }

    .scroll-top:hover {
      transform: translateY(-3px) scale(1.1);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .author-card {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
      
      .blog-content h2 {
        font-size: 1.5rem;
      }
      
      .blog-content h3 {
        font-size: 1.3rem;
      }
      
      .featured-image {
        height: 250px;
      }
      
      .post-meta {
        gap: 1rem;
      }
    }

    /* Animation */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fadeIn 0.6s ease-out;
    }

    /* Loading States */
    .loading {
      opacity: 0.5;
      pointer-events: none;
    }

    /* Table Styling */
    .blog-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 2rem 0;
      background: var(--bg-card);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border-color);
    }

    .blog-content th, .blog-content td {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      text-align: left;
    }

    .blog-content th {
      background: rgba(37, 99, 235, 0.1);
      color: var(--primary);
      font-weight: 600;
    }

    .blog-content tr:hover {
      background: rgba(37, 99, 235, 0.05);
    }
  </style>
</head>
<body class="bg-custom-light text-custom-primary">
  <!-- Header -->
  <header class="sticky top-0 z-50 w-full bg-custom-light/90 backdrop-blur-md border-b border-custom shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-3">
          <div class="logo-as">
             <img src="https://adrianosena.dev.br/logo.png" alt="Adriano Sena Logo" class="w-10 h-10">
          </div>
          <div>
            <div class="text-xl font-bold text-custom-primary">Adriano Sena</div>
            <div class="text-sm text-custom-secondary">dev.br</div>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <a href="/" class="nav-link">Início</a>
          <a href="/#sobre" class="nav-link">Sobre</a>
          <a href="/#servicos" class="nav-link">Serviços</a>
          <a href="/blog" class="nav-link text-primary font-semibold">Blog</a>
          <a href="/#contato" class="nav-link">Contato</a>
          <a href="/privacidade" class="nav-link">Privacidade</a>
          
          <!-- Theme Toggle -->
          <button id="theme-toggle" class="p-2 rounded-lg bg-custom-card border border-custom hover:border-primary transition-colors">
            <i id="sun-icon" class="fas fa-sun text-yellow-500"></i>
            <i id="moon-icon" class="fas fa-moon text-blue-500 hidden"></i>
          </button>
        </nav>

        <!-- Mobile Menu Button -->
        <button id="mobile-menu-button" class="md:hidden p-2">
          <i class="fas fa-bars text-xl text-custom-primary"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div id="mobile-menu" class="hidden md:hidden bg-custom-card border-t border-custom animate-fade-in">
      <div class="px-4 py-3 space-y-2">
        <a href="/" class="block py-2 px-3 rounded hover:bg-custom-light">Início</a>
        <a href="/#sobre" class="block py-2 px-3 rounded hover:bg-custom-light">Sobre</a>
        <a href="/#servicos" class="block py-2 px-3 rounded hover:bg-custom-light">Serviços</a>
        <a href="/blog" class="block py-2 px-3 rounded bg-primary/10 text-primary font-semibold">Blog</a>
        <a href="/#contato" class="block py-2 px-3 rounded hover:bg-custom-light">Contato</a>
        <a href="/privacidade" class="block py-2 px-3 rounded hover:bg-custom-light">Privacidade</a>
        <div class="pt-2 border-t border-custom">
          <button id="mobile-theme-toggle" class="flex items-center space-x-2 py-2 px-3">
            <i class="fas fa-palette text-primary"></i>
            <span>Tema</span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="flex-grow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-custom-secondary">
          <li><a href="/" class="hover:text-primary transition-colors">Início</a></li>
          <li><i class="fas fa-chevron-right text-xs"></i></li>
          <li><a href="/blog" class="hover:text-primary transition-colors">Blog</a></li>
          <li><i class="fas fa-chevron-right text-xs"></i></li>
          <li class="text-primary font-medium" id="breadcrumb-current"></li>
        </ol>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 animate-fade-in">
          <!-- Post Header -->
          <article>
            <div class="mb-6" id="post-tags"></div>
            
            <h1 id="post-title" class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-custom-primary leading-tight"></h1>
            
            <div class="post-meta">
              <span><i class="far fa-calendar"></i> <span id="post-date"></span></span>
              <span><i class="far fa-clock"></i> <span id="read-time"></span> min de leitura</span>
              <span><i class="far fa-eye"></i> <span id="view-count">0</span> visualizações</span>
            </div>

            <!-- Featured Image -->
            <div class="mb-8 rounded-xl overflow-hidden shadow-xl">
              <img id="post-image" alt="Imagem do post" class="w-full h-64 md:h-96 object-cover featured-image">
            </div>

            <!-- Content -->
            <div class="blog-content prose prose-lg max-w-none" id="post-content"></div>

            <!-- Author Bio -->
            <div class="author-card animate-fade-in">
              <img src="https://adrianosena.dev.br/logo-white.png" alt="Adriano Sena" class="author-image">
              <div class="flex-1">
                <h4 class="text-xl font-bold">Adriano Sena</h4>
                <p class="mb-4">Desenvolvedor Full-Stack com 5+ anos de experiência, apaixonado por criar soluções inovadoras e eficientes.</p>
                <div class="author-social">
                  <a href="https://github.com/AdrianoSenaS" target="_blank" aria-label="GitHub"><i class="fab fa-github"></i></a>
                  <a href="https://www.linkedin.com/in/adriano-sena-silva-a8605622a/" target="_blank" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                  <a href="https://www.instagram.com/adriano.sena.silva/" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                  <a href="https://twitter.com/adrianosenas" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 space-y-6">
            <!-- CTA Card -->
            <div class="sidebar-card">
              <h3 class="sidebar-title">✍️ Sobre o Blog</h3>
              <p class="text-custom-secondary mb-4">Compartilhando conhecimentos, experiências e insights sobre desenvolvimento e tecnologia.</p>
              <a href="/#contato" class="btn-primary w-full py-3 rounded-lg font-semibold text-center block">
                <i class="fas fa-paper-plane mr-2"></i>ENTRE EM CONTATO
              </a>
            </div>

            <!-- Categories -->
            <div class="sidebar-card">
              <h3 class="sidebar-title">📂 Categorias</h3>
              <ul class="space-y-2">
                <li><a href="/blog?category=desenvolvimento" class="flex justify-between items-center py-2 hover:text-primary transition-colors">Desenvolvimento <span class="category-count">12</span></a></li>
                <li><a href="/blog?category=tecnologia" class="flex justify-between items-center py-2 hover:text-primary transition-colors">Tecnologia <span class="category-count">8</span></a></li>
                <li><a href="/blog?category=mobile" class="flex justify-between items-center py-2 hover:text-primary transition-colors">Mobile <span class="category-count">5</span></a></li>
                <li><a href="/blog?category=web" class="flex justify-between items-center py-2 hover:text-primary transition-colors">Web <span class="category-count">10</span></a></li>
                <li><a href="/blog?category=jogos" class="flex justify-between items-center py-2 hover:text-primary transition-colors">Jogos <span class="category-count">3</span></a></li>
              </ul>
            </div>

            <!-- Newsletter -->
            <div class="sidebar-card bg-gradient-to-br from-primary/5 to-secondary/5">
              <h3 class="sidebar-title">📬 Newsletter</h3>
              <p class="text-custom-secondary mb-4">Receba os melhores conteúdos sobre tecnologia direto no seu e-mail.</p>
              <form id="newsletter-form" class="space-y-3">
                <input type="email" placeholder="Seu melhor e-mail" class="w-full px-4 py-3 rounded-lg border border-custom bg-custom-card focus:outline-none focus:border-primary">
                <button type="submit" class="btn-primary w-full py-3 rounded-lg font-semibold">
                  <i class="fas fa-envelope mr-2"></i>Inscrever-se
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-custom-card border-t border-custom py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="flex items-center space-x-3 mb-6 md:mb-0">
          <div class="logo-as">
            <img src="https://adrianosena.dev.br/logo.png" alt="Adriano Sena Logo" class="w-10 h-10">
          </div>
          <div>
            <div class="text-lg font-bold text-custom-primary">Adriano Sena</div>
            <div class="text-xs text-custom-secondary">dev.br</div>
          </div>
        </div>

        <div class="flex space-x-4">
          <a href="https://wa.me/+5564933004882" target="_blank" class="text-custom-secondary hover:text-green-500 transition-colors" aria-label="WhatsApp">
            <i class="fab fa-whatsapp text-xl"></i>
          </a>
          <a href="https://github.com/AdrianoSenaS" target="_blank" class="text-custom-secondary hover:text-gray-800 transition-colors" aria-label="GitHub">
            <i class="fab fa-github text-xl"></i>
          </a>
          <a href="https://www.instagram.com/adriano.sena.silva/" target="_blank" class="text-custom-secondary hover:text-pink-600 transition-colors" aria-label="Instagram">
            <i class="fab fa-instagram text-xl"></i>
          </a>
          <a href="https://www.linkedin.com/in/adriano-sena-silva-a8605622a/" target="_blank" class="text-custom-secondary hover:text-blue-700 transition-colors" aria-label="LinkedIn">
            <i class="fab fa-linkedin-in text-xl"></i>
          </a>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-custom text-center text-custom-secondary text-sm">
        <p>&copy; <span id="current-year"></span> Adriano Sena. Todos os direitos reservados.</p>
        <p class="mt-2">Transformando ideias em soluções digitais inovadoras.</p>
      </div>
    </div>
  </footer>

  <!-- Scroll to Top Button -->
  <button id="scroll-top" class="scroll-top" aria-label="Voltar ao topo">
    <i class="fas fa-arrow-up"></i>
  </button>

  <!-- Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-4KFFX809LT"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-4KFFX809LT');
  </script>

  <script>
    // DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
      // Set current year
      document.getElementById('current-year').textContent = new Date().getFullYear();
      
      // Mobile menu toggle
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      const mobileMenu = document.getElementById('mobile-menu');
      
      mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenuButton.innerHTML = mobileMenu.classList.contains('hidden') 
          ? '<i class="fas fa-bars text-xl text-custom-primary"></i>'
          : '<i class="fas fa-times text-xl text-custom-primary"></i>';
      });

      // Theme toggle
      const themeToggle = document.getElementById('theme-toggle');
      const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
      const sunIcon = document.getElementById('sun-icon');
      const moonIcon = document.getElementById('moon-icon');
      
      function toggleTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
          sunIcon.classList.remove('hidden');
          moonIcon.classList.add('hidden');
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
          sunIcon.classList.add('hidden');
          moonIcon.classList.remove('hidden');
        }
      }
      
      themeToggle?.addEventListener('click', toggleTheme);
      mobileThemeToggle?.addEventListener('click', toggleTheme);
      
      // Set initial theme
      const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      }

      // Scroll to top
      const scrollTop = document.getElementById('scroll-top');
      
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          scrollTop.classList.add('show');
        } else {
          scrollTop.classList.remove('show');
        }
      });
      
      scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      // Newsletter form
      const newsletterForm = document.getElementById('newsletter-form');
      newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        alert("Obrigado por se inscrever, " + email + "! Em breve você receberá nossas atualizações.");
        newsletterForm.reset();
      });

      // Load post data
      async function carregarPost() {
        try {
          // Get post ID from URL
          const urlParams = new URLSearchParams(window.location.search);
          const id = urlParams.get('id') || '${id}';
          
          // Fetch post data
          const response = await fetch("/api/posts/${id}");
          const post = await response.json();
          
          // Update page metadata
         
          document.getElementById('breadcrumb-current').textContent = post.title.substring(0, 30) + '...';
          
          // Update post content
          document.getElementById('post-title').textContent = post.title;
          document.getElementById('post-date').textContent = new Date(post.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          });
          document.getElementById('post-image').src = post.image;
          document.getElementById('post-image').alt = post.title;
          document.getElementById('post-content').innerHTML = post.content;
          
          // Calculate read time
          const wordCount = post.content.split(/\s+/).length;
          const readTime = Math.ceil(wordCount / 200);
          document.getElementById('read-time').textContent = readTime;
          
          // Add tags
          const tagsContainer = document.getElementById('post-tags');
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => {
              const tagElement = document.createElement('span');
              tagElement.className = 'tag';
              tagElement.textContent = tag;
              tagsContainer.appendChild(tagElement);
            });
          }
          
          // Add syntax highlighting
          document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
          });
          
        } catch (error) {
          console.error('Erro ao carregar post:', error);
          document.getElementById('post-content').innerHTML = '<h3 class="text-xl font-bold mb-2">Post não encontrado</h3>';
        }
      }
      
      // Initialize
      carregarPost();
    });
  </script>
  
  <!-- Syntax Highlighting -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/github-dark.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/highlight.min.js"></script>
</body>
</html>
  `;
  return html;
}
}