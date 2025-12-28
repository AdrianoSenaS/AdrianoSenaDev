const { createContact, listContacts} = require("../database/contatosDb");


module.exports = {

    async sendContact(req, res) {
        const { name, email, status, project, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
        }

        await createContact({ name, email, status, project, message });

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
    }
}