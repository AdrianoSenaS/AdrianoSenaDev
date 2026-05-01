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
    },

    async sendContactReplyEmail(contact, replyMessage) {
        try {
            const transporter = createTransporter();

            const cleanName = String(contact.name || 'Cliente').trim();
            const cleanProject = String(contact.project || 'Não informado').trim();
            const cleanOriginalMessage = String(contact.message || '').trim();
            const cleanReplyMessage = String(replyMessage || '').trim();

            const mailOptions = {
                from: `"Adriano Sena" <${process.env.SMTP_USER}>`,
                to: contact.email,
                subject: 'Resposta ao seu contato',
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 640px; margin: 0 auto; padding: 20px; }
                        .header { background: #2563eb; color: #fff; padding: 20px; border-radius: 8px 8px 0 0; }
                        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
                        .box { background: #fff; border-left: 4px solid #10b981; padding: 14px; border-radius: 6px; margin-bottom: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2 style="margin:0;">Olá, ${cleanName}!</h2>
                        </div>
                        <div class="content">
                            <p>Recebemos sua mensagem e segue abaixo a resposta:</p>
                            <div class="box">
                                <strong>Resposta:</strong>
                                <p style="white-space: pre-line; margin-bottom: 0;">${cleanReplyMessage}</p>
                            </div>
                            <div class="box">
                                <strong>Sua mensagem original:</strong>
                                <p style="white-space: pre-line; margin-bottom: 0;">${cleanOriginalMessage}</p>
                            </div>
                            <p><strong>Projeto:</strong> ${cleanProject}</p>
                            <p>Atenciosamente,<br>Adriano Sena</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
                text: `Olá, ${cleanName}!

Recebemos sua mensagem e segue abaixo a resposta:

${cleanReplyMessage}

--- Sua mensagem original ---
${cleanOriginalMessage}

Projeto: ${cleanProject}

Atenciosamente,
Adriano Sena`
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('📧 Resposta ao contato enviada com sucesso:', info.messageId);
            return true;
        } catch (error) {
            console.error('❌ Erro ao enviar resposta ao contato:', error.message);
            return false;
        }
    },

    async sendNewPostEmail(recipientEmail, post) {
        try {
            const transporter = createTransporter();

            const postTitle = String(post?.title || 'Novo post publicado').trim();
            const postExcerpt = String(post?.excerpt || '').trim();
            const postSlug = String(post?.slug || '').trim();
            const postUrl = postSlug
                ? `https://adrianosena.dev.br/post?slug=${encodeURIComponent(postSlug)}`
                : 'https://adrianosena.dev.br/blog';

            const mailOptions = {
                from: `"Adriano Sena Blog" <${process.env.SMTP_USER}>`,
                to: recipientEmail,
                subject: `Novo post: ${postTitle}`,
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 640px; margin: 0 auto; padding: 20px; }
                        .header { background: #2563eb; color: #fff; padding: 20px; border-radius: 8px 8px 0 0; }
                        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
                        .btn { display: inline-block; padding: 12px 18px; border-radius: 8px; background: #2563eb; color: #fff !important; text-decoration: none; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2 style="margin:0;">Novo artigo no blog</h2>
                        </div>
                        <div class="content">
                            <h3 style="margin-top:0;">${postTitle}</h3>
                            ${postExcerpt ? `<p>${postExcerpt}</p>` : '<p>Acabamos de publicar um novo conteúdo no blog.</p>'}
                            <p>
                                <a href="${postUrl}" class="btn">Ler artigo agora</a>
                            </p>
                            <p style="font-size:12px;color:#666;">Se o botão não abrir, acesse: ${postUrl}</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
                text: `Novo artigo no blog\n\n${postTitle}\n\n${postExcerpt || 'Acabamos de publicar um novo conteúdo no blog.'}\n\nLeia em: ${postUrl}`
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('📧 E-mail de novo post enviado:', info.messageId, '->', recipientEmail);
            return true;
        } catch (error) {
            console.error('❌ Erro ao enviar e-mail de novo post para', recipientEmail, '-', error.message);
            return false;
        }
    },

    async sendAnnouncementEmail(recipientEmail, campaign) {
        try {
            const transporter = createTransporter();

            const subject = String(campaign?.subject || 'Comunicado').trim();
            const category = String(campaign?.category || 'geral').trim();
            const message = String(campaign?.message || '').trim();
            const ctaText = String(campaign?.ctaText || '').trim();
            const ctaUrl = String(campaign?.ctaUrl || '').trim();

            const categoryLabelMap = {
                promocoes: 'Promocoes',
                servicos: 'Servicos',
                novidades: 'Novidades',
                conteudo: 'Conteudo',
                geral: 'Geral'
            };

            const categoryLabel = categoryLabelMap[category] || 'Geral';

            const htmlMessage = message
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br>');

            const mailOptions = {
                from: `"Adriano Sena" <${process.env.SMTP_USER}>`,
                to: recipientEmail,
                subject,
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 640px; margin: 0 auto; padding: 20px; }
                        .header { background: #2563eb; color: #fff; padding: 20px; border-radius: 8px 8px 0 0; }
                        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
                        .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: bold; margin-bottom: 10px; }
                        .btn { display: inline-block; padding: 12px 18px; border-radius: 8px; background: #2563eb; color: #fff !important; text-decoration: none; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2 style="margin:0;">${subject}</h2>
                        </div>
                        <div class="content">
                            <div class="badge">${categoryLabel}</div>
                            <p style="white-space: pre-line;">${htmlMessage}</p>
                            ${ctaText && ctaUrl ? `<p><a class="btn" href="${ctaUrl}">${ctaText}</a></p>` : ''}
                        </div>
                    </div>
                </body>
                </html>
            `,
                text: `${subject}\n\nCategoria: ${categoryLabel}\n\n${message}${ctaText && ctaUrl ? `\n\n${ctaText}: ${ctaUrl}` : ''}`
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('📧 Anuncio enviado:', info.messageId, '->', recipientEmail);
            return true;
        } catch (error) {
            console.error('❌ Erro ao enviar anuncio para', recipientEmail, '-', error.message);
            return false;
        }
    }
}