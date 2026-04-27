const { createPost, getPosts, getPostById, updatePost, deletePost } = require('../database/postsDB');
const {fetchPushTokens} = require('../services/notificationServices');
const { createCategoryIfNotExists, createTagsIfNotExists } = require('../database/taxonomiesDb');

module.exports = {


    // ---------------------------------------------
    // Função para gerar slug
    // ---------------------------------------------
     generateSlug(text) {
      return String(text || '')
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
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
                slug: data.slug || this.generateSlug(data.title || Date.now().toString()),
                tags: data.tags ? data.tags.split(",").map(t => t.trim()) : []
            };

            const result = await createPost(post);
            await createCategoryIfNotExists(post.category);
            await createTagsIfNotExists(post.tags);

            if (post.status === 'published') {
                await fetchPushTokens({
                    title: 'Novo post no blog',
                    body: post.title,
                    postId: result.id,
                    slug: post.slug,
                    url: '/post?slug=' + encodeURIComponent(post.slug)
                });
            }

            res.json({
                success: true,
                id: result.id,
                post
            });

        } catch (err) {
            console.error("Erro ao criar post:", err);
            res.status(500).json({ success: false, error: err.message });
        }
    },

    async getAllPosts(req, res) {
        try {
            const data = await getPosts();
            res.json(data);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    async getPostId(req, res) {
        try {
            const data = await getPostById(req.params.id);
            if (!data) {
                return res.status(404).json({ success: false, error: "Post não encontrado" });
            }
            res.json(data);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    async updatePostId(req, res) {
        try {
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
                slug: data.slug || this.generateSlug(data.title || Date.now().toString()),
                tags: data.tags ? data.tags.split(",").map(t => t.trim()) : []
            };

            await updatePost(req.params.id, post);
            await createCategoryIfNotExists(post.category);
            await createTagsIfNotExists(post.tags);
            res.json({ success: true, post });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    async deletePostId(req, res) {
        try {
            await deletePost(req.params.id);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
    async uploadPost(req, res) {
         res.json({
            location: `/uploads/${req.file.filename}`
        });
    }
}