const { HtmlPost } = require("../views/post");
const { getPostBySlug } = require("../database/postsDB");


module.exports = {

   async htmlInner(slug, port, res) {
        try {
            const safeSlug = String(slug || '').trim();
            if (!safeSlug) {
                return res.status(404).sendFile(require('path').join(__dirname, '../public/error.html'));
            }

            const post = await getPostBySlug(safeSlug);
            if (!post) {
                return res.status(404).sendFile(require('path').join(__dirname, '../public/error.html'));
            }

            const html = HtmlPost(post, post.slug);
            res.send(html);
        } catch (error) {
            console.error('Erro ao carregar post:', error);
            res.status(500).send('Erro ao carregar o post');
        }
    }
}