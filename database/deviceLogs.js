// Configuração do banco de dados SQLite
const db = new sqlite3.Database('device_logs.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados SQLite');
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
