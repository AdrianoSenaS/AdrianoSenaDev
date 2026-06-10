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
            db.get(`SELECT COUNT(pv.postId) AS totalViews FROM post_views pv WHERE pv.postId = ?`, [postId], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },

    listTopViewedPosts(limit = 5) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT postId, COUNT(*) AS totalViews
                 FROM post_views
                 GROUP BY postId
                 ORDER BY totalViews DESC
                 LIMIT ?`,
                [Number(limit) || 5],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []);
                }
            );
        });
    }
}