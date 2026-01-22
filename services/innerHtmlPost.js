const { HtmlPost } = require("../views/post");


module.exports = {

   async htmlInner(id, port, res) {
        // Busca dados da API
        try {
            const response = await fetch(`http://localhost:${port}/api/posts/${id}`);
            const post = await response.json();

            const html = HtmlPost(post, id);

            res.send(html);
        } catch (error) {
            console.error('Erro ao carregar post:', error);
            res.status(500).send('Erro ao carregar o post');
        }
    }
}