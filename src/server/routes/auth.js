import express from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import { JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['admin', 'employee', 'user']).default('user'),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/register', async (req, res) => {
  try {
    const data = UserSchema.parse(req.body);
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [data.email]);
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const id = crypto.randomUUID();

    await db.run(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [id, data.name, data.email, hashedPassword, data.role]
    );

    const user = await db.get('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Error registering user:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    } else {
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const data = LoginSchema.parse(req.body);
    const user = await db.get('SELECT * FROM users WHERE email = ?', [data.email]);

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    const { password, ...userWithoutPassword } = user;

    console.log('Login successful:', userWithoutPassword);
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Error logging in:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    } else {
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }
});

export default router;