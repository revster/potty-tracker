export interface Entry {
  id: number;
  kid: 1 | 2;
  type: 'poop' | 'pee';
  timestamp: string;
}

export interface TodayCounts {
  kid1: { poop: number; pee: number };
  kid2: { poop: number; pee: number };
}

export async function logEntry(kid: 1 | 2, type: 'poop' | 'pee'): Promise<Entry> {
  const res = await fetch('/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kid, type }),
  });
  if (!res.ok) throw new Error('Failed to log entry');
  return res.json() as Promise<Entry>;
}

export async function fetchLog(): Promise<Entry[]> {
  const res = await fetch('/api/log');
  if (!res.ok) throw new Error('Failed to fetch log');
  return res.json() as Promise<Entry[]>;
}

export async function deleteEntry(id: number): Promise<void> {
  const res = await fetch(`/api/log/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete entry');
}

export async function fetchTodayCounts(): Promise<TodayCounts> {
  const res = await fetch('/api/today-counts');
  if (!res.ok) throw new Error('Failed to fetch counts');
  return res.json() as Promise<TodayCounts>;
}

export interface KidNames {
  kid1: string;
  kid2: string;
}

export async function fetchNames(): Promise<KidNames> {
  const res = await fetch('/api/names');
  if (!res.ok) throw new Error('Failed to fetch names');
  return res.json() as Promise<KidNames>;
}

export async function saveNames(names: KidNames): Promise<KidNames> {
  const res = await fetch('/api/names', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(names),
  });
  if (!res.ok) throw new Error('Failed to save names');
  return res.json() as Promise<KidNames>;
}
