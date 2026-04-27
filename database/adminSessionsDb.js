const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/admin_sessions.db");

db.run(`
CREATE TABLE IF NOT EXISTS admin_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jti TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    revoked_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

module.exports = {
    createSession({ jti, username, exp }) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO admin_sessions (jti, username, expires_at) VALUES (?, ?, ?)`,
                [jti, username, exp],
                (err) => (err ? reject(err) : resolve(true))
            );
        });
    },

    revokeSession(jti) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE admin_sessions SET revoked_at = CURRENT_TIMESTAMP WHERE jti = ?`,
                [jti],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.changes > 0);
                }
            );
        });
    },

    isSessionRevoked(jti) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT revoked_at FROM admin_sessions WHERE jti = ?`,
                [jti],
                (err, row) => {
                    if (err) return reject(err);
                    if (!row) return resolve(true);
                    resolve(Boolean(row.revoked_at));
                }
            );
        });
    }
};
