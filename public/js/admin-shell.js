(function () {
  function standardizeAdminNav() {
    const navs = document.querySelectorAll('.admin-nav');
    if (!navs.length) return;

    const items = [
      { href: '/admin/dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
      { href: '/admin/posts', icon: 'fa-file-alt', label: 'Posts' },
      { href: '/admin/cadastrar', icon: 'fa-plus-circle', label: 'Novo Post' },
      { href: '/admin/contatos', icon: 'fa-envelope', label: 'Contatos' },
      { href: '/admin/posts#categorias', icon: 'fa-folder', label: 'Categorias' },
      { href: '/admin/posts#tags', icon: 'fa-tags', label: 'Tags' },
      { href: '/admin/usuarios', icon: 'fa-users', label: 'Usuarios' },
      { href: '/admin/emails', icon: 'fa-bullhorn', label: 'Anuncios E-mail' },
      { href: '/admin/dispositivos', icon: 'fa-mobile-alt', label: 'Dispositivos' },
      { href: '/admin/comentarios', icon: 'fa-comments', label: 'Comentarios' },
      { href: '/admin/homepage', icon: 'fa-home', label: 'Pagina Inicial' }
    ];

    const currentPath = window.location.pathname || '';
    const currentHash = window.location.hash || '';

    function isActive(itemHref) {
      const [path, hash] = itemHref.split('#');
      if (hash) {
        return currentPath === path && currentHash === `#${hash}`;
      }
      return currentPath === path;
    }

    const html = items.map((item) => {
      const active = isActive(item.href) ? ' class="active"' : '';
      return `<li><a href="${item.href}"${active}><i class="fas ${item.icon}"></i>${item.label}</a></li>`;
    }).join('');

    navs.forEach((nav) => {
      nav.innerHTML = html;
    });
  }

  function setupAdminShell() {
    standardizeAdminNav();

    const sidebar = document.querySelector('.admin-sidebar');
    if (!sidebar) return;

    const sidebarColumn = sidebar.closest('.lg\\:col-span-1') || sidebar.closest('aside') || sidebar.parentElement;
    if (!sidebarColumn) return;

    const grid = sidebarColumn.parentElement;
    if (!grid) return;

    let mainColumn = null;
    for (const child of Array.from(grid.children)) {
      if (child === sidebarColumn) continue;
      const cls = child.className || '';
      if (cls.includes('lg:col-span-3') || child.tagName.toLowerCase() === 'main' || cls.includes('space-y-6') || cls.includes('space-y-5')) {
        mainColumn = child;
        break;
      }
    }

    if (!mainColumn) {
      mainColumn = Array.from(grid.children).find((el) => el !== sidebarColumn) || null;
    }

    sidebarColumn.classList.add('admin-sidebar-column');
    if (mainColumn) mainColumn.classList.add('admin-main-column');

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'admin-sidebar-toggle';
    toggle.setAttribute('aria-label', 'Alternar menu lateral');
    toggle.innerHTML = '<i class="fas fa-bars"></i>';

    const overlay = document.createElement('div');
    overlay.className = 'admin-sidebar-overlay';

    // Injeta o botão no navbar, logo após o botão de tema
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn && themeToggleBtn.parentElement) {
      themeToggleBtn.parentElement.insertBefore(toggle, themeToggleBtn.nextSibling);
    } else {
      const headerFlex = document.querySelector('header .flex.items-center.space-x-4')
        || document.querySelector('header .flex.items-center');
      if (headerFlex) {
        headerFlex.appendChild(toggle);
      } else {
        document.body.appendChild(toggle); // fallback
      }
    }
    document.body.appendChild(overlay);

    const desktopKey = 'adminSidebarDesktopCollapsed';

    function isMobile() {
      return window.matchMedia('(max-width: 1023px)').matches;
    }

    function setDesktopCollapsed(collapsed) {
      document.body.classList.toggle('admin-shell-collapsed', collapsed);
      localStorage.setItem(desktopKey, collapsed ? '1' : '0');
    }

    function openMobile() {
      sidebarColumn.classList.add('open');
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
      toggle.innerHTML = '<i class="fas fa-times"></i>';
    }

    function closeMobile() {
      sidebarColumn.classList.remove('open');
      overlay.classList.remove('visible');
      document.body.style.overflow = '';
      toggle.innerHTML = '<i class="fas fa-bars"></i>';
    }

    function applyByViewport() {
      if (isMobile()) {
        document.body.classList.remove('admin-shell-collapsed');
        closeMobile();
      } else {
        closeMobile();
        const collapsed = localStorage.getItem(desktopKey) === '1';
        setDesktopCollapsed(collapsed);
      }
    }

    toggle.addEventListener('click', () => {
      if (isMobile()) {
        if (sidebarColumn.classList.contains('open')) closeMobile();
        else openMobile();
        return;
      }

      const next = !document.body.classList.contains('admin-shell-collapsed');
      setDesktopCollapsed(next);
      toggle.innerHTML = next ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-angle-left"></i>';
      if (!next) {
        setTimeout(() => {
          toggle.innerHTML = '<i class="fas fa-bars"></i>';
        }, 180);
      }
    });

    overlay.addEventListener('click', closeMobile);

    window.addEventListener('resize', applyByViewport);

    applyByViewport();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAdminShell);
  } else {
    setupAdminShell();
  }
})();
