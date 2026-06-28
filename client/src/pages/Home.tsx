import { useState, useEffect, useCallback } from 'react';
import { logEntry, fetchTodayCounts, fetchNames, TodayCounts, KidNames } from '../api';
import LogButton from '../components/LogButton';
import './Home.css';

const DEFAULT_NAMES: KidNames = { kid1: 'Kid 1', kid2: 'Kid 2' };

export default function Home() {
  const [counts, setCounts] = useState<TodayCounts>({
    kid1: { poop: 0, pee: 0 },
    kid2: { poop: 0, pee: 0 },
  });
  const [names, setNames] = useState<KidNames>(DEFAULT_NAMES);

  const refreshCounts = useCallback(async () => {
    try {
      const data = await fetchTodayCounts();
      setCounts(data);
    } catch {
      // silently ignore
    }
  }, []);

  useEffect(() => {
    void refreshCounts();
    fetchNames().then(setNames).catch(() => {});
  }, [refreshCounts]);

  const handleLog = async (kid: 1 | 2, type: 'poop' | 'pee') => {
    try {
      await logEntry(kid, type);
      await refreshCounts();
    } catch {
      // silently ignore on mobile
    }
  };

  return (
    <div className="home">
      <header className="home-header">
        <h1 className="home-title">Potty Tracker</h1>
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
    </div>
  );
}
