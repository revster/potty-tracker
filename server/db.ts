import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'potty.json');

export interface Entry {
  id: number;
  kid: 1 | 2;
  type: 'poop' | 'pee';
  timestamp: string;
}

export interface Names {
  kid1: string;
  kid2: string;
}

interface Store {
  entries: Entry[];
  nextId: number;
  names: Names;
}

function localTimestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function localDateString(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function load(): Store {
  if (!fs.existsSync(DB_PATH)) return { entries: [], nextId: 1, names: { kid1: 'Kid 1', kid2: 'Kid 2' } };
  const store = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) as Store;
  if (!store.names) store.names = { kid1: 'Kid 1', kid2: 'Kid 2' };
  return store;
}

function save(store: Store): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(store));
}

export function addEntry(kid: 1 | 2, type: 'poop' | 'pee'): Entry {
  const store = load();
  const entry: Entry = { id: store.nextId++, kid, type, timestamp: localTimestamp() };
  store.entries.push(entry);
  save(store);
  return entry;
}

export function getEntries(): Entry[] {
  return load().entries.slice().reverse().slice(0, 200);
}

export function removeEntry(id: number): boolean {
  const store = load();
  const before = store.entries.length;
  store.entries = store.entries.filter(e => e.id !== id);
  if (store.entries.length === before) return false;
  save(store);
  return true;
}

export function getTodayCounts() {
  const today = localDateString();
  const counts = { kid1: { poop: 0, pee: 0 }, kid2: { poop: 0, pee: 0 } };
  for (const e of load().entries) {
    if (e.timestamp.startsWith(today)) {
      counts[`kid${e.kid}` as 'kid1' | 'kid2'][e.type]++;
    }
  }
  return counts;
}

export function getNames(): Names {
  return load().names;
}

export function setNames(names: Names): void {
  const store = load();
  store.names = names;
  save(store);
}
