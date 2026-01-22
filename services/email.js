require('dotenv').config();
const nodemailer = require('nodemailer');
// ---------------------------------------------
// Configuração do Nodemailer
// ---------------------------------------------
const createTransporter = () => {
    const config = {
        host: process.env.SMTP_HOST || 'smtp.titan.email',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_PORT === '465' ? true : false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false,
            minVersion: 'TLSv1.2'
        },
        debug: true, // Ver logs detalhados
        logger: true
    };

    console.log('Configuração SMTP:', {
        host: config.host,
        port: config.port,
        secure: config.secure
    });

    return nodemailer.createTransport(config);
};

module.exports = {
    // ---------------------------------------------
    // Função para enviar e-mail com detalhes do acesso
    // ---------------------------------------------
    async sendAccessEmail(deviceInfo) {
        try {
            // Não enviar e-mail para bots
            if (deviceInfo.device.is_bot) {
                console.log('🤖 Bot detectado, e-mail não enviado');
                return false;
            }

            const transporter = createTransporter();

            const mailOptions = {
                from: `"Analytics do Site" <${process.env.SMTP_USER}>`,
                to: process.env.REPORT_EMAIL,
                subject: `📱 Novo acesso - ${deviceInfo.device.brand} ${deviceInfo.device.model} | ${deviceInfo.url}`,
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
                        .info-box { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #4CAF50; }
                        .highlight { color: #4CAF50; font-weight: bold; }
                        .device-icon { font-size: 24px; margin-right: 10px; }
                        .url-box { background: #f0f0f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📊 Novo Acesso Detectado</h1>
                            <p>${new Date(deviceInfo.timestamp).toLocaleString('pt-BR')}</p>
                        </div>
                        <div class="content">
                            <div class="info-box">
                                <h2>📍 Informações do Acesso</h2>
                                <p><strong>Data/Hora:</strong> ${new Date(deviceInfo.timestamp).toLocaleString('pt-BR')}</p>
                                <p><strong>URL Completa:</strong> ${deviceInfo.protocol}://${deviceInfo.hostname}${deviceInfo.url}</p>
                                <p><strong>Método:</strong> ${deviceInfo.method}</p>
                                <p><strong>Referência:</strong> ${deviceInfo.referer}</p>
                                <p><strong>Idioma:</strong> ${deviceInfo.language}</p>
                                <div class="url-box">
                                    <strong>IP:</strong> ${deviceInfo.ip}
                                </div>
                            </div>
                            
                            <div class="info-box">
                                <h2>📱 Informações do Dispositivo</h2>
                                <p><strong>Dispositivo:</strong> ${deviceInfo.device.brand} ${deviceInfo.device.model}</p>
                                <p><strong>Tipo:</strong> ${deviceInfo.device.type}</p>
                                <p><strong>Sistema Operacional:</strong> ${deviceInfo.device.os_name} ${deviceInfo.device.os_version}</p>
                                <p><strong>Navegador:</strong> ${deviceInfo.device.browser_name} ${deviceInfo.device.browser_version}</p>
                                <p><strong>É Bot?:</strong> ${deviceInfo.device.is_bot ? 'Sim' : 'Não'}</p>
                                ${deviceInfo.device.bot_name ? `<p><strong>Nome do Bot:</strong> ${deviceInfo.device.bot_name}</p>` : ''}
                            </div>
                            
                            <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 5px;">
                                <p><strong>🔍 Detalhes Técnicos:</strong></p>
                                <p><strong>User Agent:</strong></p>
                                <p style="word-break: break-all; font-size: 12px; background: #f0f0f0; padding: 10px; border-radius: 5px;">
                                    ${deviceInfo.user_agent}
                                </p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
                text: `📊 NOVO ACESSO DETECTADO

Data/Hora: ${new Date(deviceInfo.timestamp).toLocaleString('pt-BR')}
URL: ${deviceInfo.protocol}://${deviceInfo.hostname}${deviceInfo.url}
Método: ${deviceInfo.method}
Referência: ${deviceInfo.referer}
Idioma: ${deviceInfo.language}
IP: ${deviceInfo.ip}

--- DISPOSITIVO ---
Marca/Modelo: ${deviceInfo.device.brand} ${deviceInfo.device.model}
Tipo: ${deviceInfo.device.type}
Sistema: ${deviceInfo.device.os_name} ${deviceInfo.device.os_version}
Navegador: ${deviceInfo.device.browser_name} ${deviceInfo.device.browser_version}
É Bot: ${deviceInfo.device.is_bot ? 'Sim' : 'Não'}
${deviceInfo.device.bot_name ? `Nome do Bot: ${deviceInfo.device.bot_name}` : ''}

--- DETALHES TÉCNICOS ---
User Agent: ${deviceInfo.user_agent}`
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('📧 E-mail enviado com sucesso:', info.messageId);
            return true;
        } catch (error) {
            console.error('❌ Erro ao enviar e-mail:', error.message);
            return false;
        }
    }
}