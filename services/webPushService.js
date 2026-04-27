const webpush = require('web-push');

let configured = false;

function configureWebPush() {
  if (configured) return true;

  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:suporte@adrianosena.dev.br';

  if (!publicKey || !privateKey) {
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
  return true;
}

function getPublicVapidKey() {
  return process.env.VAPID_PUBLIC_KEY || '';
}

async function sendWebPushNotification(subscription, payload) {
  if (!configureWebPush()) {
    throw new Error('VAPID não configurado no servidor.');
  }

  return webpush.sendNotification(subscription, JSON.stringify(payload));
}

module.exports = {
  configureWebPush,
  getPublicVapidKey,
  sendWebPushNotification
};
