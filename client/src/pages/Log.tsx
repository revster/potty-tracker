import { useState, useEffect, useCallback } from 'react';
import { fetchLog, deleteEntry, fetchNames, Entry, KidNames } from '../api';
import './Log.css';

function formatTime(timestamp: string): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(timestamp: string): string {
  const d = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function Log() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [names, setNames] = useState<KidNames>({ kid1: 'Kid 1', kid2: 'Kid 2' });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [data, n] = await Promise.all([fetchLog(), fetchNames()]);
      setEntries(data);
      setNames(n);
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleDelete = async (id: number) => {
    try {
      await deleteEntry(id);
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch {
      // silently ignore
    }
  };

  const grouped: { date: string; items: Entry[] }[] = [];
  for (const entry of entries) {
    const date = formatDate(entry.timestamp);
    const last = grouped[grouped.length - 1];
    if (last && last.date === date) {
      last.items.push(entry);
    } else {
      grouped.push({ date, items: [entry] });
    }
  }

  return (
    <div className="log-page">
      <header className="log-header">
        <h1 className="log-title">History</h1>
      </header>
      {loading ? (
        <div className="log-empty">Loading…</div>
      ) : entries.length === 0 ? (
        <div className="log-empty">No entries yet.</div>
      ) : (
        <div className="log-list">
          {grouped.map(group => (
            <div key={group.date} className="log-group">
              <div className="log-date-header">{group.date}</div>
              {group.items.map(entry => (
                <div key={entry.id} className="log-entry">
                  <span className="log-emoji">
                    {entry.type === 'poop' ? '💩' : '💧'}
                  </span>
                  <div className="log-info">
                    <span className="log-kid">
                      {entry.kid === 1 ? names.kid1 : names.kid2}
                    </span>
                    <span className="log-time">{formatTime(entry.timestamp)}</span>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(entry.id)}
                    aria-label="Delete"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
