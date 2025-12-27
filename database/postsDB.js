const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/posts.db");

// Criar tabelas
db.run(`
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    category TEXT,
    content TEXT,
    tags TEXT,
    status TEXT,
    image TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);


module.exports = {

    // Criar Post
    createPost(data) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO posts (title, description,  category, content, tags, status, image) 
                 VALUES (?, ?, ?,?, ?, ?, ?)`,
                [
                    data.title,
                    data.excerpt,
                    data.category,
                    data.content,
                    JSON.stringify(data.tags || []), // <-- AQUI
                    data.status,
                    data.image
                ],
                function (err) {
                    if (err) return reject(err);
                    resolve({ id: this.lastID });
                }
            );
        });
    },

    // Listar Posts
    getPosts() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM posts ORDER BY id DESC`, (err, rows) => {
                if (err) return reject(err);

                // ✔ Converter tags para array
                rows = rows.map(r => ({
                    ...r,
                    tags: JSON.parse(r.tags || "[]")
                }));

                resolve(rows);
            });
        });
    },

    // Get Post by ID
    getPostById(id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM posts WHERE id = ?`, [id], (err, row) => {
                if (err) return reject(err);

                if (row) {
                    row.tags = JSON.parse(row.tags || "[]"); // ✔ Convertendo aqui também
                }

                resolve(row);
            });
        });
    },

    // Update Post
    updatePost(id, data) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE posts SET title=?, description=?, content=?, tags=?, status=?, image=? WHERE id=?`,
                [
                    data.title,
                    data.description,
                    data.content,
                    JSON.stringify(data.tags || []), // <-- AQUI
                    data.status,
                    data.image,
                    id
                ],
                err => err ? reject(err) : resolve(true)
            );
        });
    },

    deletePost(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM posts WHERE id=?`, [id], err =>
                err ? reject(err) : resolve(true)
            );
        });
    }
};
