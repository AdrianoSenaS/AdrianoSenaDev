const {
    creatPushTokens,
    getPushTokens,
    upsertWebPushSubscription,
    getWebPushSubscriptions,
    deleteWebPushSubscription
} = require('../database/notificationDb');
const { sendPush } = require('../services/sendPush');
const { sendWebPushNotification, getPublicVapidKey } = require('../services/webPushService');

function normalizeWebSubscription(data) {
    const subscription = data?.subscription || data;
    const endpoint = subscription?.endpoint;
    const p256dh = subscription?.keys?.p256dh;
    const auth = subscription?.keys?.auth;

    if (!endpoint || !p256dh || !auth) {
        return null;
    }

    return {
        endpoint,
        p256dh,
        auth,
        userEmail: data?.email || data?.userEmail || '',
        source: data?.source || 'blog',
        userAgent: data?.userAgent || ''
    };
}

module.exports = {
    registerPushToken: async (req, res) => {
        try {
            const data = req.body;

            const normalizedWebSub = normalizeWebSubscription(data);
            if (normalizedWebSub) {
                const result = await upsertWebPushSubscription(normalizedWebSub);
                return res.json({ success: true, type: 'web', ...result });
            }

            if (!data?.token) {
                return res.status(400).json({ success: false, error: 'Token ou subscription inválido.' });
            }

            const result = await creatPushTokens({
                token: data.token,
                platform: data.platform || data.channel || 'legacy'
            });

            res.json({ success: true, type: 'legacy', ...result });
        } catch (error) {
            res.json({ success: false, error: error.message });
        }
    },

    getPublicVapidKeyHandler: async (req, res) => {
        const key = getPublicVapidKey();
        if (!key) {
            return res.status(503).json({ success: false, error: 'VAPID_PUBLIC_KEY não configurada.' });
        }

        return res.json({ success: true, publicKey: key });
    },

    fetchPushTokens: async (data) => {
        const tokens = await getPushTokens();
        const webSubs = await getWebPushSubscriptions();

        for (const row of tokens) {
            if (!row.token) continue;

            await sendPush(
                row.token,
                'Notificação',
                data.body || 'Tem conteúdo novo no app',
                data.postId
            );
        }

        for (const row of webSubs) {
            const subscription = {
                endpoint: row.endpoint,
                keys: {
                    p256dh: row.p256dh,
                    auth: row.auth
                }
            };

            try {
                await sendWebPushNotification(subscription, {
                    title: data.title || 'Adriano Sena Dev',
                    body: data.body || 'Novo conteúdo publicado no blog.',
                    url: data.url || (data.slug ? '/post?slug=' + encodeURIComponent(data.slug) : '/blog'),
                    icon: '/logo.png',
                    badge: '/logo.png'
                });
            } catch (err) {
                const statusCode = Number(err?.statusCode || 0);
                if (statusCode === 404 || statusCode === 410) {
                    await deleteWebPushSubscription(row.endpoint);
                }
            }
        }

        return {
            success: true,
            message: 'Notificações enviadas',
        };
    }

}