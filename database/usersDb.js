const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/users.db');

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    photo TEXT,
    bio TEXT,
    role TEXT NOT NULL DEFAULT 'editor',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

db.run('ALTER TABLE users ADD COLUMN photo TEXT', () => {});
db.run('ALTER TABLE users ADD COLUMN bio TEXT', () => {});

function listUsers() {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT id, name, email, photo, bio, role, created_at FROM users ORDER BY created_at DESC',
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      }
    );
  });
}

function getUserById(id) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, name, email, photo, bio, role, created_at FROM users WHERE id = ?',
      [id],
      (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      }
    );
  });
}

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

function createUser({ name, email, password_hash, photo, bio, role }) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (name, email, password_hash, photo, bio, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, password_hash, photo || '', bio || '', role || 'editor'],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
}

function updateUser(id, { name, email, photo, bio, role }) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET name = ?, email = ?, photo = ?, bio = ?, role = ? WHERE id = ?',
      [name, email, photo || '', bio || '', role, id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      }
    );
  });
}

function updateUserPassword(id, password_hash) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [password_hash, id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      }
    );
  });
}

function deleteUser(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes > 0);
    });
  });
}

function getPublicAuthorProfile(author) {
  return new Promise((resolve, reject) => {
    const search = String(author || '').trim().toLowerCase();
    if (!search) return resolve(null);

    db.get(
      `SELECT name, email, photo, bio
       FROM users
       WHERE LOWER(email) = ?
          OR LOWER(name) = ?
          OR LOWER(name) LIKE ?
       LIMIT 1`,
      [search, search, `%${search}%`],
      (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      }
    );
  });
}

module.exports = {
  listUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  getPublicAuthorProfile
};

