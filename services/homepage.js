const { getSection, getAllSections, saveSection } = require('../database/homepageDb');

/**
 * GET /api/homepage — público, usado pelo index.html
 */
async function getHomepage(req, res) {
  try {
    const data = await getAllSections();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * GET /api/homepage/:section — retorna uma seção específica
 */
async function getHomepageSection(req, res) {
  try {
    const data = await getSection(req.params.section);
    if (data === null) return res.status(404).json({ success: false, error: 'Seção não encontrada' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * PUT /api/homepage/:section — admin, salva uma seção
 * Body: o objeto/string com os dados da seção
 */
async function updateHomepageSection(req, res) {
  try {
    const { section } = req.params;
    const allowed = ['seo', 'hero', 'stats', 'contact', 'services_html', 'process_html', 'projects_html'];
    if (!allowed.includes(section)) {
      return res.status(400).json({ success: false, error: 'Seção inválida' });
    }
    await saveSection(section, req.body);
    res.json({ success: true, message: `Seção "${section}" salva com sucesso.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { getHomepage, getHomepageSection, updateHomepageSection };
