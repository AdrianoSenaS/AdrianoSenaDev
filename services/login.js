require('dotenv').config();
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');
const { createSession, revokeSession } = require('../database/adminSessionsDb');
const { parseAdminToken } = require('./adminAuth');
const { getUserByEmail } = require('../database/usersDb');

// --- Credenciais Admin ---
const adminUser = {
    email: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
};

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_TOKEN || 'change-me';
const JWT_EXPIRES_IN = process.env.ADMIN_JWT_EXPIRES || '2h';

module.exports = {

    async loginAdmin(username, password, res) {
        try {
            let canLogin = false;
            let role = 'admin';

            // 1) Compatibilidade com admin por .env
            if (username === adminUser.email && password === adminUser.password) {
                canLogin = true;
                role = 'admin';
            }

            // 2) Login por usuário do sistema
            if (!canLogin) {
                const user = await getUserByEmail(String(username || '').trim().toLowerCase());
                if (user) {
                    const ok = await bcrypt.compare(password || '', user.password_hash || '');
                    if (ok) {
                        canLogin = true;
                        role = user.role || 'editor';
                    }
                }
            }

            if (!canLogin) {
                return res.status(401).json({ success: false, error: 'Credenciais inválidas.' });
            }

            const jti = randomUUID();
            const token = jwt.sign(
                {
                    sub: username,
                    role,
                    jti
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            const decoded = jwt.decode(token);
            await createSession({
                jti,
                username,
                exp: decoded?.exp || 0
            });

            res.send(token);
            return;
        } catch (err) {
            return res.status(500).json({ success: false, error: 'Erro ao iniciar sessão.' });
        }
    },

    async tokemAdmin(req, res) {
        const result = await parseAdminToken(req);

        if (!result.ok) {
            return res.status(result.status).send({ valid: false });
        }

        return res.send({
            valid: true,
            exp: result.payload.exp,
            sub: result.payload.sub
        });
    },

    async logoutAdmin(req, res) {
        const result = await parseAdminToken(req);

        if (!result.ok) {
            return res.status(result.status).json({ success: false, error: result.message });
        }

        await revokeSession(result.payload.jti);
        return res.json({ success: true });
    }
}