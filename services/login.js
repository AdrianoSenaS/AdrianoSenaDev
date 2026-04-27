require('dotenv').config();
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const { createSession, revokeSession } = require('../database/adminSessionsDb');
const { parseAdminToken } = require('./adminAuth');

// --- Credenciais Admin ---
const adminUser = {
    email: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
};

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_TOKEN || 'change-me';
const JWT_EXPIRES_IN = process.env.ADMIN_JWT_EXPIRES || '2h';

module.exports = {

    async loginAdmin(username, password, res) {
        if (username === adminUser.email && password === adminUser.password) {
            try {
                const jti = randomUUID();
                const token = jwt.sign(
                    {
                        sub: username,
                        role: 'admin',
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
        }

        return res.status(401).json({ success: false, error: 'Credenciais inválidas.' });
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