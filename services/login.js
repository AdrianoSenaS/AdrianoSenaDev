require('dotenv').config();

// --- Credenciais Admin ---
const adminUser = {
    email: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
};

module.exports = {

    loginAdmin(username, password, res) {
        if (username === adminUser.email && password === adminUser.password) {
            res.send(process.env.ADMIN_TOKEN);
            return;
        }
        return res.redirect("/login");
    },

    tokemAdmin(req, res) {
        const authHeader = req.headers.authorization;
        authHeader === `Bearer ${process.env.ADMIN_TOKEN}` ?
            res.send({ valid: true }) :
            res.status(401).send({ valid: false });
    }
}