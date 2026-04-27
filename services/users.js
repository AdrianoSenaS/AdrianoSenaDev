const bcrypt = require('bcryptjs');
const {
  listUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser
} = require('../database/usersDb');

const SALT_ROUNDS = 10;

async function getUsers(req, res) {
  try {
    const users = listUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function getUser(req, res) {
  try {
    const user = getUserById(Number(req.params.id));
    if (!user) return res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function addUser(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Nome, e-mail e senha são obrigatórios.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, error: 'Já existe um usuário com esse e-mail.' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await createUser({ name, email, password_hash, role });
    res.status(201).json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function editUser(req, res) {
  try {
    const id = Number(req.params.id);
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Nome e e-mail são obrigatórios.' });
    }

    const existing = await getUserById(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Usuário não encontrado.' });

    // Verifica duplicidade de email para outro usuário
    const byEmail = await getUserByEmail(email);
    if (byEmail && byEmail.id !== id) {
      return res.status(409).json({ success: false, error: 'Esse e-mail já está em uso por outro usuário.' });
    }

    await updateUser(id, { name, email, role: role || existing.role });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function changePassword(req, res) {
  try {
    const id = Number(req.params.id);
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    const existing = await getUserById(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Usuário não encontrado.' });

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    await updateUserPassword(id, password_hash);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function removeUser(req, res) {
  try {
    const id = Number(req.params.id);
    const existing = await getUserById(id);
    if (!existing) return res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
    await deleteUser(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { getUsers, getUser, addUser, editUser, changePassword, removeUser };
