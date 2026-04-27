const { HtmlPost } = require("../views/post");


module.exports = {

   async htmlInner(slug, port, res) {
        try {
            const response = await fetch(`http://localhost:${port}/api/posts/slug/${encodeURIComponent(slug)}`);
            if (!response.ok) {
                return res.status(404).sendFile(require('path').join(__dirname, '../public/error.html'));
            }
            const post = await response.json();
            const html = HtmlPost(post, post.slug);
            res.send(html);
        } catch (error) {
            console.error('Erro ao carregar post:', error);
            res.status(500).send('Erro ao carregar o post');
        }
    }
}