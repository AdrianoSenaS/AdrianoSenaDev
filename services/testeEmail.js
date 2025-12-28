const {sendAccessEmail} = require('../services/email');

module.exports = {
    async testEmail(req, res) {

        const testDeviceInfo = {
            timestamp: new Date().toISOString(),
            ip: '192.168.1.1',
            device: {
                brand: 'Apple',
                model: 'iPhone 12',
                type: 'smartphone',
                os_name: 'iOS',
                os_version: '16.5',
                browser_name: 'Safari',
                browser_version: '16.5',
                is_bot: false,
                bot_name: null
            },
            user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
            url: '/test-email',
            referer: 'https://google.com',
            language: 'pt-BR,pt;q=0.9',
            hostname: 'localhost',
            method: 'GET',
            protocol: 'http'
        };

        try {
            const result = await sendAccessEmail(testDeviceInfo);
            if (result) {
                res.json({ success: true, message: 'E-mail de teste enviado com sucesso!' });
            } else {
                res.json({ success: false, message: 'Falha ao enviar e-mail de teste' });
            }
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}