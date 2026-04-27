const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/homepage.db");

// ============================================================
// DADOS PADRÃO — aplicados na primeira execução (seed)
// ============================================================
const DEFAULT_SECTIONS = {
  seo: {
    title: "Adriano Sena Dev | Empresa de Desenvolvimento, Infraestrutura e Suporte Técnico",
    description: "A Adriano Sena Dev é uma empresa especializada em desenvolvimento de sites, aplicativos, sistemas e infraestrutura de TI com suporte técnico para notebooks, computadores e servidores.",
    ogTitle: "Adriano Sena Dev | Tecnologia para acelerar o seu negócio",
    ogDescription: "Desenvolvimento web e mobile, infraestrutura de servidores, redes corporativas, backup e assistência técnica com foco em resultado e continuidade do seu negócio.",
    twitterTitle: "Adriano Sena Dev | Soluções empresariais em tecnologia",
    twitterDescription: "Sites, aplicativos, sistemas, suporte técnico e infraestrutura completa para empresas que precisam de tecnologia confiável e crescimento sustentável.",
    canonical: "https://adrianosena.dev.br/"
  },

  hero: {
    badge: "Agenda comercial aberta • Últimas vagas para implantação neste mês",
    h1Part1: "Sites, apps e sistemas profissionais",
    h1Part2: "segurança e escala",
    subtitle: "O <strong>Adriano Sena Dev</strong> entrega solução completa: desenvolvimento, infraestrutura e suporte técnico. <strong>Você explica o objetivo e nós cuidamos do resto</strong> com plano, prazo, execução e acompanhamento até o resultado.",
    description: "Se você quer crescimento com risco controlado, aqui é simples: diagnóstico estratégico, proposta clara e execução validada em cada etapa.",
    cta1Text: "Quero Vender Mais com Tecnologia",
    cta1Link: "#contact",
    cta2Text: "Ver Como Podemos Ajudar",
    cta2Link: "#services",
    tags: ["Empresas que querem escalar operação", "Autônomos que precisam vender mais"],
    trustBadges: [
      { icon: "fa-shield-alt", text: "CNPJ ativo e atendimento profissional" },
      { icon: "fa-clock",      text: "Escopo e prazo definidos antes de iniciar" },
      { icon: "fa-headset",    text: "Suporte contínuo no pós-implantação" }
    ]
  },

  stats: [
    { number: "100%", label: "Implantações com Escopo Validado" },
    { number: "600+", label: "Empresas e Operações Atendidas" },
    { number: "24h",  label: "SLA Inicial de Retorno" },
    { number: "3M",   label: "Garantia de Entrega" }
  ],

  contact: {
    title: "Pronto para acelerar seu negócio com tecnologia que realmente funciona?",
    subtitle: "Receba um diagnóstico completo da sua necessidade e uma proposta comercial clara em até 24 horas úteis.",
    email: "dry@adrianosena.dev.br",
    phone: "+55 (64) 93300-4882",
    whatsapp: "5564933004882",
    location: "Goiás, Brasil - Trabalho Remoto Global",
    cnpj: "63.005.629/0001-44",
    instagram: "https://www.instagram.com/adrianosena.dev.br/"
  },

  // Seções de HTML livre — editadas com TinyMCE no admin
  services_html: null,
  process_html: null,
  projects_html: null
};

db.run(
  `CREATE TABLE IF NOT EXISTS homepage_sections (
    section   TEXT PRIMARY KEY,
    data      TEXT NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  () => {
    // Seed: insere apenas se ainda não existir
    Object.entries(DEFAULT_SECTIONS).forEach(([section, data]) => {
      if (data === null) return; // HTML livre — não tem seed, é gerado dinamicamente
      db.run(
        `INSERT OR IGNORE INTO homepage_sections (section, data) VALUES (?, ?)`,
        [section, JSON.stringify(data)]
      );
    });
  }
);

// ============================================================
// EXPORTS
// ============================================================
module.exports = {

  /** Retorna dados de uma seção específica */
  getSection(section) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT data FROM homepage_sections WHERE section = ?",
        [section],
        (err, row) => {
          if (err) return reject(err);
          if (!row) return resolve(DEFAULT_SECTIONS[section] ?? null);
          try { resolve(JSON.parse(row.data)); }
          catch { resolve(row.data); } // HTML puro (string)
        }
      );
    });
  },

  /** Retorna TODAS as seções em um único objeto */
  getAllSections() {
    return new Promise((resolve, reject) => {
      db.all("SELECT section, data FROM homepage_sections", [], (err, rows) => {
        if (err) return reject(err);
        const result = {};
        rows.forEach((r) => {
          try { result[r.section] = JSON.parse(r.data); }
          catch { result[r.section] = r.data; }
        });
        // Garante que seções com seed padrão apareçam mesmo sem row no banco
        Object.keys(DEFAULT_SECTIONS).forEach((k) => {
          if (!(k in result) && DEFAULT_SECTIONS[k] !== null) {
            result[k] = DEFAULT_SECTIONS[k];
          }
        });
        resolve(result);
      });
    });
  },

  /** Salva (upsert) uma seção */
  saveSection(section, data) {
    const serialized = typeof data === "string" ? data : JSON.stringify(data);
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO homepage_sections (section, data, updatedAt)
         VALUES (?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(section) DO UPDATE
           SET data = excluded.data, updatedAt = CURRENT_TIMESTAMP`,
        [section, serialized],
        (err) => {
          if (err) return reject(err);
          resolve(true);
        }
      );
    });
  }
};
