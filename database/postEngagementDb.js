const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/engagement.db');

db.serialize(() => {
  db.run(`ATTACH DATABASE './database/posts.db' AS postsDb`);

  db.run(`
    CREATE TABLE IF NOT EXISTS post_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      provider TEXT,
      providerId TEXT,
      message TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'approved'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS post_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER NOT NULL,
      visitorKey TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(postId, visitorKey)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      source TEXT,
      provider TEXT,
      providerId TEXT,
      wantsEmail INTEGER DEFAULT 1,
      wantsPush INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = {
  listCommentsByPost(postId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id, postId, name, message, provider, createdAt
         FROM post_comments
         WHERE postId = ? AND status = 'approved'
         ORDER BY id DESC`,
        [postId],
        (err, rows) => (err ? reject(err) : resolve(rows || []))
      );
    });
  },

  createComment({ postId, name, email, provider, providerId, message }) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO post_comments (postId, name, email, provider, providerId, message)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [postId, name, email || '', provider || 'local', providerId || '', message],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  },

  getLikesCount(postId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) AS total FROM post_likes WHERE postId = ?`,
        [postId],
        (err, row) => (err ? reject(err) : resolve(Number(row?.total || 0)))
      );
    });
  },

  addLike(postId, visitorKey) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO post_likes (postId, visitorKey) VALUES (?, ?)`,
        [postId, visitorKey],
        function (err) {
          if (err) return reject(err);
          resolve({ changed: this.changes > 0 });
        }
      );
    });
  },

  addSubscriber({ email, name, source, provider, providerId, wantsEmail, wantsPush }) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO subscribers (email, name, source, provider, providerId, wantsEmail, wantsPush)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(email) DO UPDATE SET
           name = excluded.name,
           source = excluded.source,
           provider = excluded.provider,
           providerId = excluded.providerId,
           wantsEmail = excluded.wantsEmail,
           wantsPush = excluded.wantsPush`,
        [
          email,
          name || '',
          source || 'blog',
          provider || 'local',
          providerId || '',
          wantsEmail ? 1 : 0,
          wantsPush ? 1 : 0
        ],
        function (err) {
          if (err) return reject(err);
          resolve({ success: true });
        }
      );
    });
  },

  listSubscribersForEmail() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT email
         FROM subscribers
         WHERE wantsEmail = 1
           AND TRIM(IFNULL(email, '')) <> ''`,
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  },

  listAllComments({ status, postId, search, limit, offset, sort, order }) {
    return new Promise((resolve, reject) => {
      const useStatus = String(status || '').trim();
      const usePostId = Number(postId || 0);
      const useSearch = String(search || '').trim();
      const safeLimit = Math.max(1, Math.min(Number(limit || 50), 200));
      const safeOffset = Math.max(0, Number(offset || 0));
      const safeSort = String(sort || 'createdAt').trim();
      const safeOrder = String(order || 'desc').trim().toLowerCase() === 'asc' ? 'ASC' : 'DESC';

      const whereParts = [];
      const params = [];

      if (useStatus) {
        whereParts.push('c.status = ?');
        params.push(useStatus);
      }

      if (usePostId > 0) {
        whereParts.push('c.postId = ?');
        params.push(usePostId);
      }

      if (useSearch) {
        whereParts.push('(LOWER(c.name) LIKE ? OR LOWER(c.message) LIKE ? OR LOWER(IFNULL(p.title, "")) LIKE ?)');
        const q = `%${useSearch.toLowerCase()}%`;
        params.push(q, q, q);
      }

      const where = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';
      const sortColumn = safeSort === 'name' ? 'c.name' : 'c.createdAt';

      const countSql = `
        SELECT COUNT(*) AS total
        FROM post_comments c
        LEFT JOIN postsDb.posts p ON p.id = c.postId
        ${where}
      `;

      const listSql = `
        SELECT c.id, c.postId, c.name, c.email, c.provider, c.message, c.createdAt, c.status,
                p.title AS postTitle, p.slug AS postSlug
         FROM post_comments c
         LEFT JOIN postsDb.posts p ON p.id = c.postId
         ${where}
         ORDER BY ${sortColumn} ${safeOrder}, c.id ${safeOrder}
         LIMIT ? OFFSET ?
      `;

      db.get(countSql, params, (errCount, rowCount) => {
        if (errCount) return reject(errCount);

        const listParams = [...params, safeLimit, safeOffset];
        db.all(listSql, listParams, (err, rows) => {
          if (err) return reject(err);
          resolve({
            rows: rows || [],
            total: Number(rowCount?.total || 0),
            limit: safeLimit,
            offset: safeOffset
          });
        });
      });
    });
  },

  listCommentPostsForFilter() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id, title, slug
         FROM postsDb.posts
         WHERE status = 'published'
         ORDER BY id DESC
         LIMIT 300`,
        [],
        (err, rows) => (err ? reject(err) : resolve(rows || []))
      );
    });
  },

  updateCommentsStatusBulk(commentIds, status) {
    return new Promise((resolve, reject) => {
      const ids = (commentIds || []).map((v) => Number(v)).filter((n) => n > 0);
      if (!ids.length) return resolve({ updated: 0 });

      const placeholders = ids.map(() => '?').join(',');
      db.run(
        `UPDATE post_comments SET status = ? WHERE id IN (${placeholders})`,
        [status, ...ids],
        function (err) {
          if (err) return reject(err);
          resolve({ updated: this.changes || 0 });
        }
      );
    });
  },

  deleteCommentsBulk(commentIds) {
    return new Promise((resolve, reject) => {
      const ids = (commentIds || []).map((v) => Number(v)).filter((n) => n > 0);
      if (!ids.length) return resolve({ deleted: 0 });

      const placeholders = ids.map(() => '?').join(',');
      db.run(
        `DELETE FROM post_comments WHERE id IN (${placeholders})`,
        ids,
        function (err) {
          if (err) return reject(err);
          resolve({ deleted: this.changes || 0 });
        }
      );
    });
  },

  getSubscribersSummary() {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN wantsEmail = 1 THEN 1 ELSE 0 END) AS email,
          SUM(CASE WHEN wantsPush = 1 THEN 1 ELSE 0 END) AS push
         FROM subscribers`,
        [],
        (err, row) => {
          if (err) return reject(err);
          resolve({
            total: Number(row?.total || 0),
            email: Number(row?.email || 0),
            push: Number(row?.push || 0)
          });
        }
      );
    });
  },

  updateCommentStatus(commentId, status) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE post_comments SET status = ? WHERE id = ?`,
        [status, commentId],
        function (err) {
          if (err) return reject(err);
          resolve({ updated: this.changes > 0 });
        }
      );
    });
  },

  deleteComment(commentId) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM post_comments WHERE id = ?`,
        [commentId],
        function (err) {
          if (err) return reject(err);
          resolve({ deleted: this.changes > 0 });
        }
      );
    });
  },

  getEngagementSummary() {
    return new Promise((resolve, reject) => {
      const queryTotals = `
        SELECT
          (SELECT COUNT(*) FROM post_comments WHERE status = 'approved') AS approvedComments,
          (SELECT COUNT(*) FROM post_comments WHERE status = 'pending') AS pendingComments,
          (SELECT COUNT(*) FROM post_comments WHERE status = 'rejected') AS rejectedComments,
          (SELECT COUNT(*) FROM post_likes) AS likesTotal,
          (SELECT COUNT(*) FROM subscribers WHERE wantsEmail = 1) AS emailSubscribers,
          (SELECT COUNT(*) FROM subscribers WHERE wantsPush = 1) AS pushSubscribers
      `;

      db.get(queryTotals, [], (err, totals) => {
        if (err) return reject(err);

        db.all(
          `SELECT p.id AS postId, p.title, p.slug,
                  COUNT(DISTINCT c.id) AS comments,
                  COUNT(DISTINCT l.id) AS likes,
                  (COUNT(DISTINCT c.id) + COUNT(DISTINCT l.id)) AS engagement
           FROM postsDb.posts p
           LEFT JOIN post_comments c ON c.postId = p.id AND c.status = 'approved'
           LEFT JOIN post_likes l ON l.postId = p.id
           WHERE p.status = 'published'
           GROUP BY p.id
           ORDER BY engagement DESC, p.id DESC
           LIMIT 8`,
          [],
          (errTop, topPosts) => {
            if (errTop) return reject(errTop);

            db.all(
              `SELECT c.id, c.postId, c.name, c.message, c.createdAt, c.status,
                      p.title AS postTitle, p.slug AS postSlug
               FROM post_comments c
               LEFT JOIN postsDb.posts p ON p.id = c.postId
               ORDER BY c.id DESC
               LIMIT 8`,
              [],
              (errRecent, recentComments) => {
                if (errRecent) return reject(errRecent);
                resolve({ totals: totals || {}, topPosts: topPosts || [], recentComments: recentComments || [] });
              }
            );
          }
        );
      });
    });
  }
};
