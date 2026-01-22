const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/postViews.db");

// Criar tabelas
db.run(`
CREATE TABLE IF NOT EXISTS post_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postId INTEGER,
    view TEXT
)
`);

module.exports = {
    creatPostView(data) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO post_views (postId, view) 
                 VALUES (?, ?)`,
                [
                    data.postId,
                    data.view,
                ],
                function (err) {
                    if (err) return reject(err);
                    resolve({ id: this.lastID });
                }
            );
        });
    },

    getPostView(postId) {
        return new Promise((resolve, reject) => {
            db.get(`select count(pv.postId) from post_views pv where pv.postId  = ?`, [postId], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }
}