import { Router, Request, Response } from 'express';
import db from './db';

const router = Router();

router.post('/log', (req: Request, res: Response) => {
  const { kid, type } = req.body as { kid: unknown; type: unknown };

  if ((kid !== 1 && kid !== 2) || (type !== 'poop' && type !== 'pee')) {
    res.status(400).json({ error: 'kid must be 1 or 2, type must be poop or pee' });
    return;
  }

  const stmt = db.prepare(
    `INSERT INTO entries (kid, type, timestamp) VALUES (?, ?, datetime('now', 'localtime'))`
  );
  const result = stmt.run(kid, type);

  const entry = db.prepare('SELECT * FROM entries WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(entry);
});

router.get('/log', (_req: Request, res: Response) => {
  const entries = db.prepare(
    'SELECT * FROM entries ORDER BY timestamp DESC LIMIT 200'
  ).all();
  res.json(entries);
});

router.delete('/log/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM entries WHERE id = ?').run(id);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Entry not found' });
    return;
  }
  res.status(204).send();
});

router.get('/today-counts', (_req: Request, res: Response) => {
  const rows = db.prepare(`
    SELECT kid, type, COUNT(*) as count
    FROM entries
    WHERE date(timestamp) = date('now', 'localtime')
    GROUP BY kid, type
  `).all() as { kid: number; type: string; count: number }[];

  const counts = {
    kid1: { poop: 0, pee: 0 },
    kid2: { poop: 0, pee: 0 },
  };

  for (const row of rows) {
    const key = `kid${row.kid}` as 'kid1' | 'kid2';
    const t = row.type as 'poop' | 'pee';
    counts[key][t] = row.count;
  }

  res.json(counts);
});

export default router;
