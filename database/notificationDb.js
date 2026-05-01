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

db.run(`
CREATE TABLE IF NOT EXISTS web_push_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT UNIQUE NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_email TEXT,
    source TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS email_campaign_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    target_mode TEXT,
    recipient_email TEXT,
    category TEXT,
    subject TEXT,
    message_preview TEXT,
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0
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
    },

    upsertWebPushSubscription({ endpoint, p256dh, auth, userEmail, source, userAgent }) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO web_push_subscriptions (endpoint, p256dh, auth, user_email, source, user_agent)
                 VALUES (?, ?, ?, ?, ?, ?)
                 ON CONFLICT(endpoint) DO UPDATE SET
                   p256dh = excluded.p256dh,
                   auth = excluded.auth,
                   user_email = excluded.user_email,
                   source = excluded.source,
                   user_agent = excluded.user_agent,
                   updated_at = CURRENT_TIMESTAMP`,
                [
                    endpoint,
                    p256dh,
                    auth,
                    userEmail || '',
                    source || 'blog',
                    userAgent || ''
                ],
                function (err) {
                    if (err) return reject(err);
                    resolve({ success: true, id: this.lastID || null });
                }
            );
        });
    },

    getWebPushSubscriptions() {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT endpoint, p256dh, auth, user_email, source, user_agent FROM web_push_subscriptions',
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []);
                }
            );
        });
    },

    deleteWebPushSubscription(endpoint) {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM web_push_subscriptions WHERE endpoint = ?',
                [endpoint],
                function (err) {
                    if (err) return reject(err);
                    resolve({ deleted: this.changes > 0 });
                }
            );
        });
    },

    createEmailCampaignLog(data) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO email_campaign_logs (
                    created_by,
                    target_mode,
                    recipient_email,
                    category,
                    subject,
                    message_preview,
                    total_recipients,
                    sent_count,
                    failed_count
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.createdBy || '',
                    data.targetMode || 'all',
                    data.recipientEmail || '',
                    data.category || 'geral',
                    data.subject || '',
                    data.messagePreview || '',
                    Number(data.totalRecipients || 0),
                    Number(data.sentCount || 0),
                    Number(data.failedCount || 0)
                ],
                function (err) {
                    if (err) return reject(err);
                    resolve({ id: this.lastID });
                }
            );
        });
    },

    listEmailCampaignLogs(limit = 50) {
        return new Promise((resolve, reject) => {
            const safeLimit = Math.max(1, Math.min(Number(limit || 50), 200));
            db.all(
                `SELECT id, created_at, created_by, target_mode, recipient_email, category, subject,
                        message_preview, total_recipients, sent_count, failed_count
                 FROM email_campaign_logs
                 ORDER BY id DESC
                 LIMIT ?`,
                [safeLimit],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []);
                }
            );
        });
    }
}