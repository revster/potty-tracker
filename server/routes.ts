import { Router, Request, Response } from 'express';
import { addEntry, getEntries, removeEntry, getTodayCounts, getNames, setNames } from './db';

const router = Router();

router.post('/log', (req: Request, res: Response) => {
  const { kid, type } = req.body as { kid: unknown; type: unknown };
  if ((kid !== 1 && kid !== 2) || (type !== 'poop' && type !== 'pee')) {
    res.status(400).json({ error: 'kid must be 1 or 2, type must be poop or pee' });
    return;
  }
  res.status(201).json(addEntry(kid, type));
});

router.get('/log', (_req: Request, res: Response) => {
  res.json(getEntries());
});

router.delete('/log/:id', (req: Request, res: Response) => {
  if (!removeEntry(Number(req.params.id))) {
    res.status(404).json({ error: 'Entry not found' });
    return;
  }
  res.status(204).send();
});

router.get('/today-counts', (_req: Request, res: Response) => {
  res.json(getTodayCounts());
});

router.get('/names', (_req: Request, res: Response) => {
  res.json(getNames());
});

router.put('/names', (req: Request, res: Response) => {
  const { kid1, kid2 } = req.body as { kid1: unknown; kid2: unknown };
  if (typeof kid1 !== 'string' || typeof kid2 !== 'string') {
    res.status(400).json({ error: 'kid1 and kid2 must be strings' });
    return;
  }
  const names = { kid1: kid1.trim() || 'Kid 1', kid2: kid2.trim() || 'Kid 2' };
  setNames(names);
  res.json(names);
});

export default router;
