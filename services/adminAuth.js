const jwt = require("jsonwebtoken");
const { isSessionRevoked } = require("../database/adminSessionsDb");

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_TOKEN || "change-me";

function getTokenFromRequest(req) {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) return null;
    return authHeader.slice(7);
}

async function parseAdminToken(req) {
    const token = getTokenFromRequest(req);
    if (!token) {
        return { ok: false, status: 401, message: "Token não informado." };
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const revoked = await isSessionRevoked(payload.jti);

        if (revoked) {
            return { ok: false, status: 401, message: "Sessão inválida ou revogada." };
        }

        return { ok: true, payload, token };
    } catch (error) {
        return { ok: false, status: 401, message: "Token inválido ou expirado.", error };
    }
}

async function requireAdminAuth(req, res, next) {
    const result = await parseAdminToken(req);

    if (!result.ok) {
        return res.status(result.status).json({ success: false, error: result.message });
    }

    req.admin = result.payload;
    req.adminToken = result.token;
    next();
}

module.exports = {
    getTokenFromRequest,
    parseAdminToken,
    requireAdminAuth
};
