const {getDeviceInfo} = require('../services/deviceInfo')
const {sendAccessEmail} = require('../services/email');
const { saveVisitLog } = require('../database/deviceLogs');

module.exports = {

    filtraRotas(req, res, next) {
        // Ignorar arquivos estáticos para reduzir logs
        const ignoredPaths = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.map'];
        const shouldIgnore = ignoredPaths.some(ext => req.path.endsWith(ext));

        if (shouldIgnore) {
            return next();
        }

        // Rotas que devem ser monitoradas e enviar email
        const monitoredRoutes = [
            '',
            '/',           // Página inicial
            '/blog',       // Página do blog
            '/privacidade' // Página de privacidade
        ];

        // Verificar se é a rota /post (com query string id)
        const isPostRoute = req.path === '/post' && req.query.id;

        // Verificar se a rota atual está na lista de rotas monitoradas ou é uma rota /post válida
        if (monitoredRoutes.includes(req.path) || isPostRoute) {
            const userAgent = req.headers['user-agent'] || '';
            const deviceInfo = getDeviceInfo(userAgent, req);

            // Log no console
            console.log('\n' + '='.repeat(60));
            console.log('📱 ACESSO MONITORADO DETECTADO');
            console.log('='.repeat(60));
            console.log(`📅 Data/Hora: ${new Date(deviceInfo.timestamp).toLocaleString('pt-BR')}`);
            console.log(`📍 IP: ${deviceInfo.ip}`);
            console.log(`🌐 URL: ${deviceInfo.protocol}://${deviceInfo.hostname}${deviceInfo.url}`);
            console.log(`🖥️  Dispositivo: ${deviceInfo.device.brand} ${deviceInfo.device.model}`);
            console.log(`📱 Tipo: ${deviceInfo.device.type}`);
            console.log(`💻 Sistema: ${deviceInfo.device.os_name} ${deviceInfo.device.os_version}`);
            console.log(`🌐 Navegador: ${deviceInfo.device.browser_name} ${deviceInfo.device.browser_version}`);
            console.log(`🤖 É Bot: ${deviceInfo.device.is_bot ? 'Sim' : 'Não'}`);
            console.log(`🔗 Referência: ${deviceInfo.referer}`);
            console.log('='.repeat(60));

            // Enviar e-mail APENAS para acessos humanos (não bots) nas rotas monitoradas
            if (!deviceInfo.device.is_bot) {
                sendAccessEmail(deviceInfo).catch(err => {
                    console.error('❌ Falha ao enviar e-mail:', err.message);
                });
            }

            saveVisitLog(deviceInfo).catch((err) => {
                console.error('Erro ao salvar log de visita:', err.message);
            });

        } else {
            // Para rotas não monitoradas, apenas log básico
            console.log(`🔍 Acesso não monitorado: ${req.method} ${req.originalUrl}`);
        }

        next();
    }

}