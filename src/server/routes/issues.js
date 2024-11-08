import express from 'express';
import { z } from 'zod';
import { authenticate, requireRole } from '../middleware/auth.js';
import { db } from '../config/database.js';

const router = express.Router();

const IssueSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  category: z.enum(['road', 'lighting', 'garbage', 'infrastructure', 'other']),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional(),
  }),
  images: z.array(z.string()),
});

router.post('/', authenticate, async (req, res) => {
  try {
    const data = IssueSchema.parse(req.body);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO issues (
        id, title, description, category, latitude, longitude, address, 
        images, user_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.title,
        data.description,
        data.category,
        data.location.latitude,
        data.location.longitude,
        data.location.address || null,
        JSON.stringify(data.images),
        req.user.id,
        now,
        now,
      ]
    );

    const issue = await db.get('SELECT * FROM issues WHERE id = ?', [id]);
    issue.images = JSON.parse(issue.images);
    issue.location = {
      latitude: issue.latitude,
      longitude: issue.longitude,
      address: issue.address,
    };

    res.status(201).json(issue);
  } catch (error) {
    console.error('Error creating issue:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    } else {
      res.status(500).json({ error: 'Erro ao criar relato' });
    }
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const issues = await db.all(
      'SELECT * FROM issues ORDER BY created_at DESC'
    );

    const formattedIssues = issues.map(issue => ({
      ...issue,
      images: JSON.parse(issue.images),
      location: {
        latitude: issue.latitude,
        longitude: issue.longitude,
        address: issue.address,
      },
    }));

    res.json(formattedIssues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ error: 'Erro ao buscar relatos' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const issue = await db.get('SELECT * FROM issues WHERE id = ?', [req.params.id]);
    
    if (!issue) {
      return res.status(404).json({ error: 'Relato não encontrado' });
    }

    issue.images = JSON.parse(issue.images);
    issue.location = {
      latitude: issue.latitude,
      longitude: issue.longitude,
      address: issue.address,
    };

    res.json(issue);
  } catch (error) {
    console.error('Error fetching issue:', error);
    res.status(500).json({ error: 'Erro ao buscar relato' });
  }
});

router.patch('/:id/status', authenticate, requireRole(['admin', 'employee']), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'analyzing', 'inProgress', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const now = new Date().toISOString();
    await db.run(
      'UPDATE issues SET status = ?, updated_at = ? WHERE id = ?',
      [status, now, req.params.id]
    );

    const issue = await db.get('SELECT * FROM issues WHERE id = ?', [req.params.id]);
    if (!issue) {
      return res.status(404).json({ error: 'Relato não encontrado' });
    }

    issue.images = JSON.parse(issue.images);
    issue.location = {
      latitude: issue.latitude,
      longitude: issue.longitude,
      address: issue.address,
    };

    res.json(issue);
  } catch (error) {
    console.error('Error updating issue status:', error);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

export default router;