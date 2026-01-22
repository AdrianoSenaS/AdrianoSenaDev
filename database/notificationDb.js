const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/Notification.db");

// Criar tabelas
db.run(`
CREATE TABLE IF NOT EXISTS push_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,  
  token TEXT UNIQUE NOT NULL,
  platform TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

module.exports = {
    creatPushTokens(data) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO push_tokens (token, platform) 
                 VALUES (?, ?)`,
                [
                    data.token,
                    data.platform,
                ],
                function (err) {
                    if (err) return reject(err);
                    resolve({ id: this.lastID });
                }
            );
        });
    },

    getPushTokens() {
        return new Promise((resolve, reject) => {
            db.all('SELECT token FROM push_tokens', (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
}