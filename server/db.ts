import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'potty.db');

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kid INTEGER NOT NULL CHECK (kid IN (1, 2)),
    type TEXT NOT NULL CHECK (type IN ('poop', 'pee')),
    timestamp TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export default db;
