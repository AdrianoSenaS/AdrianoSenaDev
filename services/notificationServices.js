const { creatPushTokens, getPushTokens } = require('../database/notificationDb');
const { sendPush } = require('../services/sendPush');

module.exports = {
    registerPushToken: async (req, res) => {
        try {
            const data = req.body;
            const result = await creatPushTokens(data);
            res.json(result);
        } catch (error) {
            res.json({ success: false, error: error.message });
        }
    },

    fetchPushTokens: async (data) => {
        const tokens = await getPushTokens();

        for (const row of tokens) {
            if (!row.token) continue;

            await sendPush(
                row.token,
                'Notificação',
                data.body || 'Tem conteúdo novo no app',
                data.postId
            );
        }

        return {
            success: true,
            message: 'Notificações enviadas',
        };
    }

}