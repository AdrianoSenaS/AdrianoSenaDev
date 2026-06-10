const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/device_logs.db", (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados de visitas:", err);
    } else {
        createTables();
    }
});

// Criar tabelas
function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS device_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            ip TEXT,
            device_model TEXT,
            device_brand TEXT,
            device_type TEXT,
            os_name TEXT,
            os_version TEXT,
            browser_name TEXT,
            browser_version TEXT,
            user_agent TEXT,
            url TEXT,
            referer TEXT,
            language TEXT,
            is_bot BOOLEAN,
            bot_name TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS email_reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            period_start DATETIME,
            period_end DATETIME,
            total_visits INTEGER,
            unique_devices INTEGER,
            email_status TEXT
        )
    `);
}

module.exports = {
    saveVisitLog(data) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO device_logs (
                    ip,
                    device_model,
                    device_brand,
                    device_type,
                    os_name,
                    os_version,
                    browser_name,
                    browser_version,
                    user_agent,
                    url,
                    referer,
                    language,
                    is_bot,
                    bot_name
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.ip,
                    data.device?.model || null,
                    data.device?.brand || null,
                    data.device?.type || null,
                    data.device?.os_name || null,
                    data.device?.os_version || null,
                    data.device?.browser_name || null,
                    data.device?.browser_version || null,
                    data.user_agent || null,
                    data.url || null,
                    data.referer || null,
                    data.language || null,
                    data.device?.is_bot ? 1 : 0,
                    data.device?.bot_name || null
                ],
                function (err) {
                    if (err) return reject(err);
                    resolve({ id: this.lastID });
                }
            );
        });
    },

    getVisitStats() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT
                    COUNT(*) AS total_visits,
                    COUNT(DISTINCT ip) AS unique_visitors,
                    SUM(CASE WHEN LOWER(device_type) = 'desktop' THEN 1 ELSE 0 END) AS desktop_visits,
                    SUM(CASE WHEN LOWER(device_type) = 'smartphone' OR LOWER(device_type) = 'mobile' THEN 1 ELSE 0 END) AS mobile_visits,
                    SUM(CASE WHEN LOWER(device_type) = 'tablet' THEN 1 ELSE 0 END) AS tablet_visits
                FROM device_logs
                WHERE is_bot = 0
            `;

            db.get(sql, (err, row) => {
                if (err) return reject(err);
                resolve({
                    total_visits: row?.total_visits || 0,
                    unique_visitors: row?.unique_visitors || 0,
                    desktop_visits: row?.desktop_visits || 0,
                    mobile_visits: row?.mobile_visits || 0,
                    tablet_visits: row?.tablet_visits || 0
                });
            });
        });
    },

    listRecentVisits(limit = 50) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT
                    id,
                    timestamp,
                    ip AS ip_address,
                    device_type,
                    browser_name AS browser,
                    os_name AS operating_system,
                    '-' AS city,
                    '-' AS region,
                    '-' AS country,
                    url
                 FROM device_logs
                 WHERE is_bot = 0
                 ORDER BY id DESC
                 LIMIT ?`,
                [Number(limit) || 50],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []);
                }
            );
        });
    },

    getVisitsByDay(days = 7) {
        return new Promise((resolve, reject) => {
            const safeDays = Number(days) > 0 ? Number(days) : 7;
            db.all(
                `SELECT DATE(timestamp) AS day, COUNT(*) AS total
                 FROM device_logs
                 WHERE is_bot = 0
                   AND DATE(timestamp) >= DATE('now', ?)
                 GROUP BY DATE(timestamp)
                 ORDER BY day ASC`,
                [`-${safeDays - 1} day`],
                (err, rows) => {
                    if (err) return reject(err);

                    const rowMap = new Map((rows || []).map((row) => [row.day, row.total]));
                    const result = [];

                    for (let i = safeDays - 1; i >= 0; i -= 1) {
                        const current = new Date();
                        current.setDate(current.getDate() - i);
                        const key = current.toISOString().slice(0, 10);

                        result.push({
                            day: key,
                            total: rowMap.get(key) || 0
                        });
                    }

                    resolve(result);
                }
            );
        });
    },

    getDetailedStats() {
        return new Promise((resolve, reject) => {
            const queries = {
                totals: `SELECT
                    COUNT(*) AS total_visits,
                    COUNT(DISTINCT ip) AS unique_ips,
                    SUM(CASE WHEN is_bot = 1 THEN 1 ELSE 0 END) AS total_bots,
                    SUM(CASE WHEN is_bot = 0 THEN 1 ELSE 0 END) AS human_visits
                FROM device_logs`,

                byOS: `SELECT os_name AS label, COUNT(*) AS total
                FROM device_logs WHERE is_bot = 0 AND os_name IS NOT NULL
                GROUP BY os_name ORDER BY total DESC LIMIT 10`,

                byBrowser: `SELECT browser_name AS label, COUNT(*) AS total
                FROM device_logs WHERE is_bot = 0 AND browser_name IS NOT NULL
                GROUP BY browser_name ORDER BY total DESC LIMIT 10`,

                byDeviceType: `SELECT
                    COALESCE(NULLIF(device_type,''), 'Desconhecido') AS label,
                    COUNT(*) AS total
                FROM device_logs WHERE is_bot = 0
                GROUP BY label ORDER BY total DESC`,

                topUrls: `SELECT url AS label, COUNT(*) AS total
                FROM device_logs WHERE is_bot = 0 AND url IS NOT NULL
                GROUP BY url ORDER BY total DESC LIMIT 10`,

                topIPs: `SELECT ip AS label, COUNT(*) AS total
                FROM device_logs WHERE is_bot = 0 AND ip IS NOT NULL
                GROUP BY ip ORDER BY total DESC LIMIT 10`,

                topLanguages: `SELECT
                    SUBSTR(COALESCE(language,'Desconhecido'), 1, 5) AS label,
                    COUNT(*) AS total
                FROM device_logs WHERE is_bot = 0
                GROUP BY label ORDER BY total DESC LIMIT 8`,

                topBots: `SELECT COALESCE(bot_name,'Desconhecido') AS label, COUNT(*) AS total
                FROM device_logs WHERE is_bot = 1
                GROUP BY label ORDER BY total DESC LIMIT 8`
            };

            const run = (sql) => new Promise((res2, rej2) => {
                const method = sql.trim().toUpperCase().startsWith('SELECT COUNT') ||
                               sql.includes('total_visits') ? db.get.bind(db) : db.all.bind(db);
                method(sql, (err, rows) => err ? rej2(err) : res2(rows || []));
            });

            Promise.all([
                run(queries.totals),
                run(queries.byOS),
                run(queries.byBrowser),
                run(queries.byDeviceType),
                run(queries.topUrls),
                run(queries.topIPs),
                run(queries.topLanguages),
                run(queries.topBots)
            ]).then(([totals, byOS, byBrowser, byDeviceType, topUrls, topIPs, topLanguages, topBots]) => {
                resolve({ totals, byOS, byBrowser, byDeviceType, topUrls, topIPs, topLanguages, topBots });
            }).catch(reject);
        });
    },

    listDeviceLogs({ limit = 100, offset = 0, device_type = '', browser_name = '', os_name = '', show_bots = false, search = '' } = {}) {
        return new Promise((resolve, reject) => {
            const conditions = [];
            const params = [];

            if (!show_bots) { conditions.push('is_bot = 0'); }
            if (device_type) { conditions.push('LOWER(device_type) = LOWER(?)'); params.push(device_type); }
            if (browser_name) { conditions.push('LOWER(browser_name) = LOWER(?)'); params.push(browser_name); }
            if (os_name) { conditions.push('LOWER(os_name) = LOWER(?)'); params.push(os_name); }
            if (search) {
                conditions.push('(ip LIKE ? OR url LIKE ? OR os_name LIKE ? OR browser_name LIKE ?)');
                params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
            }

            const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
            const safeLimit = Math.min(Number(limit) || 100, 500);
            const safeOffset = Number(offset) || 0;

            db.get(`SELECT COUNT(*) AS total FROM device_logs ${where}`, params, (err, countRow) => {
                if (err) return reject(err);
                db.all(
                    `SELECT id, timestamp, ip, device_type, device_brand, device_model,
                            os_name, os_version, browser_name, browser_version,
                            url, referer, language, is_bot, bot_name, user_agent
                     FROM device_logs ${where}
                     ORDER BY id DESC
                     LIMIT ? OFFSET ?`,
                    [...params, safeLimit, safeOffset],
                    (err2, rows) => {
                        if (err2) return reject(err2);
                        resolve({ total: countRow.total, rows: rows || [] });
                    }
                );
            });
        });
    }
};
