const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/contatos.db");

// Criar tabelas
db.run(`
CREATE TABLE IF NOT EXISTS contatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    project TEXT,
    message TEXT,
    status TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP

)
`);

module.exports = {

    createContact(data) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO contatos (name, email, date, status, project, message) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    data.name,
                    data.email,
                    data.date,
                    data.status,
                    data.project,
                    data.message
                ],
                function (err) {
                    if (err) return reject(err);
                    resolve({ id: this.lastID });
                }
            );
        });
    },

    listContacts() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM contatos ORDER BY id DESC`, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    getContactById(id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM contatos WHERE id = ?`, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    },

    listContactEmails() {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT DISTINCT email FROM contatos WHERE TRIM(IFNULL(email, '')) <> ''`,
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []);
                }
            );
        });
    },

    updateContactStatus(id, status) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE contatos SET status = ? WHERE id = ?`,
                [status, id],
                function (err) {
                    if (err) return reject(err);
                    resolve({ updated: this.changes > 0 });
                }
            );
        });
    },

    deleteContact(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM contatos WHERE id = ?`, [id], function (err) {
                if (err) return reject(err);
                resolve({ deleted: this.changes > 0 });
            });
        });
    }

}