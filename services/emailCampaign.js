const { listSubscribersForEmail } = require('../database/postEngagementDb');
const { listUsers } = require('../database/usersDb');
const { listContactEmails } = require('../database/contatosDb');
const { createEmailCampaignLog, listEmailCampaignLogs } = require('../database/notificationDb');
const { sendAnnouncementEmail } = require('./email');
const { sendNewPostBroadcast } = require('./notificationServices');
const { getPostById } = require('../database/postsDB');

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

async function collectAudience() {
  const [subscribers, users, contacts] = await Promise.all([
    listSubscribersForEmail(),
    listUsers(),
    listContactEmails()
  ]);

  const unique = new Set();
  const counts = {
    subscribers: 0,
    users: 0,
    contacts: 0
  };

  for (const row of subscribers || []) {
    const email = normalizeEmail(row?.email);
    if (email && isValidEmail(email)) {
      unique.add(email);
      counts.subscribers += 1;
    }
  }

  for (const row of users || []) {
    const email = normalizeEmail(row?.email);
    if (email && isValidEmail(email)) {
      unique.add(email);
      counts.users += 1;
    }
  }

  for (const row of contacts || []) {
    const email = normalizeEmail(row?.email);
    if (email && isValidEmail(email)) {
      unique.add(email);
      counts.contacts += 1;
    }
  }

  return {
    recipients: Array.from(unique),
    counts,
    totalUnique: unique.size
  };
}

async function getCampaignAudience(req, res) {
  try {
    const audience = await collectAudience();
    return res.json({
      success: true,
      totals: {
        ...audience.counts,
        unique: audience.totalUnique
      },
      sample: audience.recipients.slice(0, 30)
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function sendCampaign(req, res) {
  try {
    const {
      targetMode,
      recipientEmail,
      subject,
      message,
      category,
      ctaText,
      ctaUrl
    } = req.body || {};

    const mode = String(targetMode || 'all').trim().toLowerCase();
    const cleanSubject = String(subject || '').trim();
    const cleanMessage = String(message || '').trim();

    if (!cleanSubject || !cleanMessage) {
      return res.status(400).json({ success: false, error: 'Assunto e mensagem são obrigatórios.' });
    }

    let recipients = [];
    if (mode === 'single') {
      const email = normalizeEmail(recipientEmail);
      if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, error: 'E-mail de destino inválido.' });
      }
      recipients = [email];
    } else {
      const audience = await collectAudience();
      recipients = audience.recipients;
    }

    if (!recipients.length) {
      return res.status(400).json({ success: false, error: 'Nenhum destinatário encontrado.' });
    }

    let sent = 0;
    let failed = 0;

    for (const email of recipients) {
      const ok = await sendAnnouncementEmail(email, {
        subject: cleanSubject,
        message: cleanMessage,
        category,
        ctaText,
        ctaUrl
      });
      if (ok) sent += 1;
      else failed += 1;
    }

    const messagePreview = cleanMessage.length > 200
      ? cleanMessage.slice(0, 200) + '...'
      : cleanMessage;

    await createEmailCampaignLog({
      createdBy: String(req.admin?.sub || 'admin').trim(),
      targetMode: mode,
      recipientEmail: mode === 'single' ? normalizeEmail(recipientEmail) : '',
      category: category || 'geral',
      subject: cleanSubject,
      messagePreview,
      totalRecipients: recipients.length,
      sentCount: sent,
      failedCount: failed
    });

    return res.json({
      success: true,
      total: recipients.length,
      sent,
      failed
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function getCampaignHistory(req, res) {
  try {
    const limit = Number(req.query.limit || 50);
    const rows = await listEmailCampaignLogs(limit);
    return res.json({ success: true, rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function testPostBroadcast(req, res) {
  try {
    const postId = Number(req.params.id);
    if (!postId) {
      return res.status(400).json({ success: false, error: 'ID de post inválido.' });
    }

    const post = await getPostById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post não encontrado.' });
    }

    const result = await sendNewPostBroadcast({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || post.description || '',
      slug: post.slug,
      image: post.image,
      author: post.author
    });

    return res.json({ success: true, postId: post.id, postTitle: post.title, result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  getCampaignAudience,
  getCampaignHistory,
  sendCampaign,
  testPostBroadcast
};
