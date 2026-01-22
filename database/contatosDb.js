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
    }

}