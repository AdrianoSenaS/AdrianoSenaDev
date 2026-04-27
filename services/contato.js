const { createContact, listContacts, updateContactStatus, deleteContact } = require("../database/contatosDb");


module.exports = {

    async sendContact(req, res) {
        const { name, email, status, project, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
        }

        await createContact({
            name,
            email,
            date: new Date().toISOString(),
            status: status || "new",
            project: project || "Outros",
            message
        });

        res.json({ success: true });
    },


    async getContacts(req, res) {
        try {
            const contacts = await listContacts();
            res.json(contacts);
        } catch (err) {
            console.error("Erro ao buscar contatos:", err);
            res.status(500).json({ error: "Erro ao buscar contatos:", err });
        }
    },

    async updateStatus(req, res) {
        try {
            const id = req.params.id;
            const { status } = req.body;

            if (!["new", "responded", "archived"].includes(status)) {
                return res.status(400).json({ error: "Status inválido" });
            }

            const result = await updateContactStatus(id, status);
            if (!result.updated) {
                return res.status(404).json({ error: "Contato não encontrado" });
            }

            return res.json({ success: true });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    },

    async deleteContactById(req, res) {
        try {
            const id = req.params.id;
            const result = await deleteContact(id);

            if (!result.deleted) {
                return res.status(404).json({ error: "Contato não encontrado" });
            }

            return res.json({ success: true });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }
}