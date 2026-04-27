const {
    listCategories,
    createCategory: dbCreateCategory,
    updateCategory: dbUpdateCategory,
    deleteCategory: dbDeleteCategory,
    listTags,
    createTag: dbCreateTag,
    updateTag: dbUpdateTag,
    deleteTag: dbDeleteTag
} = require("../database/taxonomiesDb");

module.exports = {
    async getCategories(req, res) {
        try {
            const items = await listCategories();
            res.json(items);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    async createCategory(req, res) {
        try {
            const name = String(req.body.name || "").trim();
            const description = String(req.body.description || "").trim();

            if (!name) {
                return res.status(400).json({ success: false, error: "Nome da categoria é obrigatório." });
            }

            const item = await dbCreateCategory({ name, description });
            res.status(201).json({ success: true, item });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    async updateCategory(req, res) {
        try {
            const id = Number(req.params.id);
            const name = String(req.body.name || "").trim();
            const description = String(req.body.description || "").trim();

            if (!id || !name) {
                return res.status(400).json({ success: false, error: "ID e nome são obrigatórios." });
            }

            const updated = await dbUpdateCategory(id, { name, description });
            if (!updated) {
                return res.status(404).json({ success: false, error: "Categoria não encontrada." });
            }

            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    async deleteCategory(req, res) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return res.status(400).json({ success: false, error: "ID inválido." });
            }

            const removed = await dbDeleteCategory(id);
            if (!removed) {
                return res.status(404).json({ success: false, error: "Categoria não encontrada." });
            }

            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    async getTags(req, res) {
        try {
            const items = await listTags();
            res.json(items);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    async createTag(req, res) {
        try {
            const name = String(req.body.name || "").trim();
            const description = String(req.body.description || "").trim();

            if (!name) {
                return res.status(400).json({ success: false, error: "Nome da tag é obrigatório." });
            }

            const item = await dbCreateTag({ name, description });
            res.status(201).json({ success: true, item });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    async updateTag(req, res) {
        try {
            const id = Number(req.params.id);
            const name = String(req.body.name || "").trim();
            const description = String(req.body.description || "").trim();

            if (!id || !name) {
                return res.status(400).json({ success: false, error: "ID e nome são obrigatórios." });
            }

            const updated = await dbUpdateTag(id, { name, description });
            if (!updated) {
                return res.status(404).json({ success: false, error: "Tag não encontrada." });
            }

            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    async deleteTag(req, res) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return res.status(400).json({ success: false, error: "ID inválido." });
            }

            const removed = await dbDeleteTag(id);
            if (!removed) {
                return res.status(404).json({ success: false, error: "Tag não encontrada." });
            }

            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
};
