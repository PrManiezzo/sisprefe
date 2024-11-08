import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { db } from '../config/database.js';
import { z } from 'zod';

const router = express.Router();

const UserUpdateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'employee', 'user']),
});

router.get('/users', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const users = await db.all('SELECT id, name, email, role FROM users');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

router.get('/users/:id', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const user = await db.get('SELECT id, name, email, role FROM users WHERE id = ?', [req.params.id]);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

router.put('/users/:id', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const data = UserUpdateSchema.parse(req.body);
    const existingUser = await db.get('SELECT * FROM users WHERE id = ?', [req.params.id]);
    
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await db.run(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [data.name, data.email, data.role, req.params.id]
    );

    const updatedUser = await db.get('SELECT id, name, email, role FROM users WHERE id = ?', [req.params.id]);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    } else {
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  }
});

export default router;