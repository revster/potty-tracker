import { useState, useEffect, useCallback } from 'react';
import { logEntry, fetchTodayCounts, TodayCounts } from '../api';
import LogButton from '../components/LogButton';
import SettingsPanel from '../components/SettingsPanel';
import './Home.css';

const DEFAULT_NAMES = { kid1: 'Kid 1', kid2: 'Kid 2' };

function loadNames() {
  try {
    const stored = localStorage.getItem('kidNames');
    if (stored) return JSON.parse(stored) as { kid1: string; kid2: string };
  } catch {
    // ignore
  }
  return DEFAULT_NAMES;
}

export default function Home() {
  const [counts, setCounts] = useState<TodayCounts>({
    kid1: { poop: 0, pee: 0 },
    kid2: { poop: 0, pee: 0 },
  });
  const [names, setNames] = useState(loadNames);
  const [showSettings, setShowSettings] = useState(false);

  const refreshCounts = useCallback(async () => {
    try {
      const data = await fetchTodayCounts();
      setCounts(data);
    } catch {
      // silently ignore — counts will just stay stale
    }
  }, []);

  useEffect(() => {
    void refreshCounts();
  }, [refreshCounts]);

  const handleLog = async (kid: 1 | 2, type: 'poop' | 'pee') => {
    try {
      await logEntry(kid, type);
      await refreshCounts();
    } catch {
      // silently ignore on mobile
    }
  };

  const handleNameSave = (newNames: { kid1: string; kid2: string }) => {
    localStorage.setItem('kidNames', JSON.stringify(newNames));
    setNames(newNames);
    setShowSettings(false);
  };

  return (
    <div className="home">
      <header className="home-header">
        <h1 className="home-title">Potty Tracker</h1>
        <button className="settings-btn" onClick={() => setShowSettings(true)} aria-label="Settings">
          ⚙️
        </button>
      </header>

      <div className="grid">
        <div className="kid-section">
          <h2 className="kid-name">{names.kid1}</h2>
          <LogButton
            emoji="💩"
            label="Poop"
            count={counts.kid1.poop}
            color="poop"
            onTap={() => handleLog(1, 'poop')}
          />
          <LogButton
            emoji="💧"
            label="Pee"
            count={counts.kid1.pee}
            color="pee"
            onTap={() => handleLog(1, 'pee')}
          />
        </div>

        <div className="divider" />

        <div className="kid-section">
          <h2 className="kid-name">{names.kid2}</h2>
          <LogButton
            emoji="💩"
            label="Poop"
            count={counts.kid2.poop}
            color="poop"
            onTap={() => handleLog(2, 'poop')}
          />
          <LogButton
            emoji="💧"
            label="Pee"
            count={counts.kid2.pee}
            color="pee"
            onTap={() => handleLog(2, 'pee')}
          />
        </div>
      </div>

      {showSettings && (
        <SettingsPanel
          names={names}
          onSave={handleNameSave}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
