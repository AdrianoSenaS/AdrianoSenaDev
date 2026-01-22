const DeviceDetector = require('device-detector-js');


module.exports = {
    // ---------------------------------------------
    // Função para obter informações do dispositivo
    // ---------------------------------------------
    getDeviceInfo(userAgent, req) {
        const deviceDetector = new DeviceDetector();
        const device = deviceDetector.parse(userAgent);

        // Obter IP real (considerando proxies, Cloudflare, etc.)
        const getClientIP = (req) => {
            return req.headers['x-forwarded-for']?.split(',')[0] ||
                req.headers['x-real-ip'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.ip;
        };

        const ip = getClientIP(req);

        return {
            timestamp: new Date().toISOString(),
            ip: ip,
            device: {
                // Informações do dispositivo
                type: device.device?.type || 'desktop',
                brand: device.device?.brand || 'Desconhecido',
                model: device.device?.model || 'Desconhecido',

                // Informações do sistema operacional
                os_name: device.os?.name || 'Desconhecido',
                os_version: device.os?.version || 'Desconhecido',
                os_platform: device.os?.platform,

                // Informações do navegador
                browser_name: device.client?.name || 'Desconhecido',
                browser_version: device.client?.version || 'Desconhecido',
                browser_type: device.client?.type,
                browser_engine: device.client?.engine,

                // Informações adicionais
                is_bot: device.bot || false,
                bot_name: device.bot ? device.bot.name || 'Desconhecido' : null
            },
            user_agent: userAgent,
            url: req.originalUrl, // Alterado de req.url para req.originalUrl para capturar URL completa
            referer: req.headers.referer || 'Direct',
            language: req.headers['accept-language'] || 'Desconhecido',
            hostname: req.hostname,
            method: req.method,
            protocol: req.protocol
        };
    }


}