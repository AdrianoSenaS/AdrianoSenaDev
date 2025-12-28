const { createPost, getPosts, getPostById, updatePost, deletePost } = require('../database/postsDB');

module.exports = {


    // ---------------------------------------------
    // Função para gerar slug
    // ---------------------------------------------
     generateSlug(text) {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .trim()
        .replace(/\s+/g, "-");
    },

    async addPost(req, res) {
        try {
            const data = req.body;
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : data.image || "";

            const post = {
                title: data.title || "",
                excerpt: data.excerpt || "",
                image: imageUrl,
                category: data.category || "",
                status: data.status || "draft",
                author: data.author || "adriano",
                comments: data.comments === "false" ? false : true,
                content: data.content || "",
                date: data.date || new Date().toISOString(),
                featured: data.featured === "true",
                meta: data.meta || "",
                slug: data.slug || generateSlug(data.title || Date.now().toString()),
                tags: data.tags ? data.tags.split(",").map(t => t.trim()) : []
            };

            const result = await createPost(post);
            res.redirect("/admin/cadastrar")

        } catch (err) {
            console.error("Erro ao criar post:", err);
            res.status(500).json({ success: false, error: err.message });
        }
    },

    async getAllPosts(req, res) {
        const data = await getPosts();
        res.json(data);
    },

    async getPostId(req, res) {
        const data = await getPostById(req.params.id);
        res.json(data);
    },

    async updatePostId(req, res) {
        const data = req.body;
        let imageUrl = data.oldImage;
        if (req.file) imageUrl = `/uploads/${req.file.filename}`;

        const post = {
            title: data.title || "",
            excerpt: data.excerpt || "",
            image: imageUrl,
            category: data.category || "",
            status: data.status || "draft",
            author: data.author || "adriano",
            comments: data.comments === "false" ? false : true,
            content: data.content || "",
            date: data.date || new Date().toISOString(),
            featured: data.featured === "true",
            meta: data.meta || "",
            slug: data.slug || generateSlug(data.title || Date.now().toString()),
            tags: data.tags ? data.tags.split(",").map(t => t.trim()) : []
        };

        await updatePost(req.params.id, post);
        res.json({ success: true, post });
    },

    async deletePostId(req, res) {
        await deletePost(req.params.id);
        res.json({ success: true });
    },
    async uploadPost(req, res) {
         res.json({
            location: `/uploads/${req.file.filename}`
        });
    }
}