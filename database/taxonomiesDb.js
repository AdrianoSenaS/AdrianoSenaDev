const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/posts.db");

function slugify(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

db.run(`
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

module.exports = {
    listCategories() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM categories ORDER BY name ASC`, (err, rows) => {
                if (err) return reject(err);
                resolve(rows || []);
            });
        });
    },

    createCategory({ name, description }) {
        return new Promise((resolve, reject) => {
            const slug = slugify(name);
            db.run(
                `INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)`,
                [name, slug, description || ""],
                function (err) {
                    if (err) return reject(err);
                    resolve({ id: this.lastID, name, slug, description: description || "" });
                }
            );
        });
    },

    updateCategory(id, { name, description }) {
        return new Promise((resolve, reject) => {
            const slug = slugify(name);
            db.run(
                `UPDATE categories SET name = ?, slug = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                [name, slug, description || "", id],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.changes > 0);
                }
            );
        });
    },

    deleteCategory(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM categories WHERE id = ?`, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes > 0);
            });
        });
    },

    createCategoryIfNotExists(name) {
        return new Promise((resolve, reject) => {
            const cleanName = String(name || "").trim();
            if (!cleanName) return resolve(null);
            const slug = slugify(cleanName);

            db.run(
                `INSERT OR IGNORE INTO categories (name, slug, description) VALUES (?, ?, '')`,
                [cleanName, slug],
                (err) => {
                    if (err) return reject(err);
                    resolve({ name: cleanName, slug });
                }
            );
        });
    },

    listTags() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM tags ORDER BY name ASC`, (err, rows) => {
                if (err) return reject(err);
                resolve(rows || []);
            });
        });
    },

    createTag({ name, description }) {
        return new Promise((resolve, reject) => {
            const slug = slugify(name);
            db.run(
                `INSERT INTO tags (name, slug, description) VALUES (?, ?, ?)`,
                [name, slug, description || ""],
                function (err) {
                    if (err) return reject(err);
                    resolve({ id: this.lastID, name, slug, description: description || "" });
                }
            );
        });
    },

    updateTag(id, { name, description }) {
        return new Promise((resolve, reject) => {
            const slug = slugify(name);
            db.run(
                `UPDATE tags SET name = ?, slug = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                [name, slug, description || "", id],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.changes > 0);
                }
            );
        });
    },

    deleteTag(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM tags WHERE id = ?`, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes > 0);
            });
        });
    },

    createTagsIfNotExists(tags) {
        const cleanTags = Array.isArray(tags)
            ? tags.map((tag) => String(tag || "").trim()).filter(Boolean)
            : [];

        if (!cleanTags.length) return Promise.resolve([]);

        const operations = cleanTags.map((tag) => {
            const slug = slugify(tag);
            return new Promise((resolve, reject) => {
                db.run(
                    `INSERT OR IGNORE INTO tags (name, slug, description) VALUES (?, ?, '')`,
                    [tag, slug],
                    (err) => (err ? reject(err) : resolve(true))
                );
            });
        });

        return Promise.all(operations);
    }
};
