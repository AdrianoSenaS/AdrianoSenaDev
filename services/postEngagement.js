const {
  listCommentsByPost,
  createComment,
  getLikesCount,
  addLike,
  addSubscriber,
  listAllComments,
  updateCommentStatus,
  deleteComment,
  getEngagementSummary,
  listCommentPostsForFilter,
  updateCommentsStatusBulk,
  deleteCommentsBulk
} = require('../database/postEngagementDb');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

module.exports = {
  async getComments(req, res) {
    try {
      const postId = Number(req.params.id);
      if (!postId) return res.status(400).json({ success: false, error: 'Post inválido' });
      const comments = await listCommentsByPost(postId);
      res.json({ success: true, comments });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async createComment(req, res) {
    try {
      const postId = Number(req.params.id);
      const { name, email, message, provider, providerId } = req.body || {};
      if (!postId) return res.status(400).json({ success: false, error: 'Post inválido' });
      if (!name || String(name).trim().length < 2) {
        return res.status(400).json({ success: false, error: 'Nome é obrigatório' });
      }
      if (!message || String(message).trim().length < 6) {
        return res.status(400).json({ success: false, error: 'Comentário muito curto' });
      }
      if (email && !isValidEmail(email)) {
        return res.status(400).json({ success: false, error: 'E-mail inválido' });
      }

      await createComment({
        postId,
        name: String(name).trim(),
        email: String(email || '').trim(),
        provider: provider || 'local',
        providerId: providerId || '',
        message: String(message).trim()
      });

      const comments = await listCommentsByPost(postId);
      res.status(201).json({ success: true, comments });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getLikes(req, res) {
    try {
      const postId = Number(req.params.id);
      if (!postId) return res.status(400).json({ success: false, error: 'Post inválido' });
      const total = await getLikesCount(postId);
      res.json({ success: true, total });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async likePost(req, res) {
    try {
      const postId = Number(req.params.id);
      const visitorKey = String(req.body?.visitorKey || '').trim();
      if (!postId) return res.status(400).json({ success: false, error: 'Post inválido' });
      if (!visitorKey) return res.status(400).json({ success: false, error: 'Identificação inválida' });

      const result = await addLike(postId, visitorKey);
      const total = await getLikesCount(postId);
      res.json({ success: true, total, added: result.changed });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async subscribe(req, res) {
    try {
      const { email, name, source, provider, providerId, wantsEmail, wantsPush } = req.body || {};
      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ success: false, error: 'E-mail inválido' });
      }

      await addSubscriber({
        email: String(email).trim().toLowerCase(),
        name: String(name || '').trim(),
        source: source || 'blog',
        provider: provider || 'local',
        providerId: providerId || '',
        wantsEmail: wantsEmail !== false,
        wantsPush: Boolean(wantsPush)
      });

      res.json({ success: true, message: 'Inscrição salva com sucesso' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async facebookLogin(req, res) {
    try {
      const accessToken = String(req.body?.accessToken || '').trim();
      const appId = process.env.FACEBOOK_APP_ID;
      const appSecret = process.env.FACEBOOK_APP_SECRET;

      if (!appId || !appSecret) {
        return res.status(503).json({
          success: false,
          error: 'Login Facebook não configurado no servidor (FACEBOOK_APP_ID/SECRET)'
        });
      }

      if (!accessToken) {
        return res.status(400).json({ success: false, error: 'Token do Facebook ausente' });
      }

      const appAccessToken = `${appId}|${appSecret}`;
      const debugUrl = `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(appAccessToken)}`;
      const debugRes = await fetch(debugUrl);
      const debugData = await debugRes.json();

      if (!debugData?.data?.is_valid) {
        return res.status(401).json({ success: false, error: 'Token Facebook inválido' });
      }

      const meRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.width(128).height(128)&access_token=${encodeURIComponent(accessToken)}`);
      const me = await meRes.json();

      if (!me?.id) {
        return res.status(401).json({ success: false, error: 'Não foi possível obter perfil do Facebook' });
      }

      res.json({
        success: true,
        user: {
          id: me.id,
          name: me.name || 'Usuário Facebook',
          email: me.email || '',
          avatar: me.picture?.data?.url || ''
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async listCommentsAdmin(req, res) {
    try {
      const { status, postId, search, limit, offset, sort, order } = req.query || {};
      const result = await listAllComments({ status, postId, search, limit, offset, sort, order });
      res.json({
        success: true,
        comments: result.rows || [],
        total: result.total || 0,
        limit: result.limit || Number(limit || 50),
        offset: result.offset || Number(offset || 0)
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async listCommentPostsAdmin(req, res) {
    try {
      const posts = await listCommentPostsForFilter();
      res.json({ success: true, posts });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async updateCommentStatusAdmin(req, res) {
    try {
      const commentId = Number(req.params.id);
      const status = String(req.body?.status || '').trim();
      const allowed = ['approved', 'pending', 'rejected'];
      if (!commentId) return res.status(400).json({ success: false, error: 'Comentário inválido' });
      if (!allowed.includes(status)) return res.status(400).json({ success: false, error: 'Status inválido' });

      const result = await updateCommentStatus(commentId, status);
      if (!result.updated) return res.status(404).json({ success: false, error: 'Comentário não encontrado' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async deleteCommentAdmin(req, res) {
    try {
      const commentId = Number(req.params.id);
      if (!commentId) return res.status(400).json({ success: false, error: 'Comentário inválido' });
      const result = await deleteComment(commentId);
      if (!result.deleted) return res.status(404).json({ success: false, error: 'Comentário não encontrado' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async bulkUpdateCommentsStatusAdmin(req, res) {
    try {
      const status = String(req.body?.status || '').trim();
      const commentIds = Array.isArray(req.body?.commentIds) ? req.body.commentIds : [];
      const allowed = ['approved', 'pending', 'rejected'];

      if (!allowed.includes(status)) {
        return res.status(400).json({ success: false, error: 'Status inválido' });
      }

      const result = await updateCommentsStatusBulk(commentIds, status);
      res.json({ success: true, updated: result.updated || 0 });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async bulkDeleteCommentsAdmin(req, res) {
    try {
      const commentIds = Array.isArray(req.body?.commentIds) ? req.body.commentIds : [];
      const result = await deleteCommentsBulk(commentIds);
      res.json({ success: true, deleted: result.deleted || 0 });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getEngagementDashboard(req, res) {
    try {
      const data = await getEngagementSummary();
      res.json({ success: true, ...data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
};
