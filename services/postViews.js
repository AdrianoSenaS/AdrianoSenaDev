const { creatPostView, getPostView } = require('.././database/postViewsDb')


module.exports = {

    async postView(req, res) {

        try {
            const id = req.params.id;
            const data = {
                postId: id,
                view: ''
            };
            creatPostView(data)
            res.json(await getPostView(id));
        } catch (e) {
            console.error("Erro ao criar postView:", err);
            res.status(500).json({ success: false, error: err.message });
        }
    }
}