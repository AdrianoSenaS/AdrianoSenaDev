const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/posts.db");

function slugify(text) {
    return String(text || '')
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

db.run(`
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    slug TEXT,
    author TEXT,
    category TEXT,
    content TEXT,
    tags TEXT,
    meta TEXT,
    status TEXT,
    image TEXT,
    featured INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 1,
    publishedAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// Garantir compatibilidade em bancos já existentes sem essas colunas.
[
    "ALTER TABLE posts ADD COLUMN slug TEXT",
    "ALTER TABLE posts ADD COLUMN author TEXT",
    "ALTER TABLE posts ADD COLUMN meta TEXT",
    "ALTER TABLE posts ADD COLUMN featured INTEGER DEFAULT 0",
    "ALTER TABLE posts ADD COLUMN comments INTEGER DEFAULT 1",
    "ALTER TABLE posts ADD COLUMN publishedAt DATETIME"
].forEach((query) => {
    db.run(query, () => {});
});

// Migração: gerar slug para posts que não têm slug
db.all("SELECT id, title, slug FROM posts WHERE slug IS NULL OR slug = ''", (err, rows) => {
    if (err || !rows || !rows.length) return;
    const stmt = db.prepare("UPDATE posts SET slug = ? WHERE id = ?");
    rows.forEach((row) => {
        const base = slugify(row.title || `post-${row.id}`);
        stmt.run(`${base}-${row.id}`, row.id);
    });
    stmt.finalize();
    console.log(`[postsDB] Slugs gerados para ${rows.length} post(s) sem slug.`);
});


module.exports = {

    // Criar Post
    createPost(data) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO posts (
                    title,
                    description,
                    category,
                    content,
                    tags,
                    slug,
                    author,
                    meta,
                    status,
                    image,
                    featured,
                    comments,
                    publishedAt
                ) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
                [
                    data.title,
                    data.excerpt || data.description || "",
                    data.category,
                    data.content,
                    JSON.stringify(data.tags || []), // <-- AQUI
                    data.slug || "",
                    data.author || "adriano",
                    data.meta || "",
                    data.status,
                    data.image,
                    data.featured ? 1 : 0,
                    data.comments === false ? 0 : 1,
                    data.date || null
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
                    slug: r.slug || slugify(r.title || '') + '-' + r.id,
                    tags: JSON.parse(r.tags || "[]"),
                    excerpt: r.description || "",
                    featured: Boolean(r.featured),
                    comments: Boolean(r.comments),
                    date: r.publishedAt || r.createdAt
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
                    row.slug = row.slug || slugify(row.title || '') + '-' + row.id;
                    row.tags = JSON.parse(row.tags || "[]");
                    row.excerpt = row.description || "";
                    row.featured = Boolean(row.featured);
                    row.comments = Boolean(row.comments);
                    row.date = row.publishedAt || row.createdAt;
                }

                resolve(row);
            });
        });
    },

    // Get Post by Slug
    getPostBySlug(slug) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM posts WHERE slug = ?`, [slug], (err, row) => {
                if (err) return reject(err);

                if (row) {
                    row.slug = row.slug || slugify(row.title || '') + '-' + row.id;
                    row.tags = JSON.parse(row.tags || "[]");
                    row.excerpt = row.description || "";
                    row.featured = Boolean(row.featured);
                    row.comments = Boolean(row.comments);
                    row.date = row.publishedAt || row.createdAt;
                }

                resolve(row);
            });
        });
    },

    // Update Post
    updatePost(id, data) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE posts SET title=?, description=?, category=?, content=?, tags=?, slug=?, author=?, meta=?, status=?, image=?, featured=?, comments=?, publishedAt=? WHERE id=?`,
                [
                    data.title,
                    data.excerpt || data.description || "",
                    data.category,
                    data.content,
                    JSON.stringify(data.tags || []), // <-- AQUI
                    data.slug || "",
                    data.author || "adriano",
                    data.meta || "",
                    data.status,
                    data.image,
                    data.featured ? 1 : 0,
                    data.comments === false ? 0 : 1,
                    data.date || null,
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
    },

    getPostsStatusSummary() {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT status, COUNT(*) AS total FROM posts GROUP BY status`,
                (err, rows) => {
                    if (err) return reject(err);

                    const summary = {
                        published: 0,
                        draft: 0,
                        scheduled: 0
                    };

                    (rows || []).forEach((row) => {
                        if (summary[row.status] !== undefined) {
                            summary[row.status] = row.total;
                        }
                    });

                    resolve(summary);
                }
            );
        });
    }
};
