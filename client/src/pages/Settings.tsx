import { useState, useEffect } from 'react';
import { fetchNames, saveNames, KidNames } from '../api';
import './Settings.css';

export default function Settings() {
  const [names, setNames] = useState<KidNames>({ kid1: 'Kid 1', kid2: 'Kid 2' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchNames().then(setNames).catch(() => {});
  }, []);

  const handleSave = async () => {
    try {
      const result = await saveNames({
        kid1: names.kid1.trim() || 'Kid 1',
        kid2: names.kid2.trim() || 'Kid 2',
      });
      setNames(result);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // silently ignore
    }
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1 className="settings-title">Settings</h1>
      </header>

      <div className="settings-body">
        <div className="settings-section">
          <div className="section-label">Kid Names</div>

          <div className="field">
            <label className="field-label" htmlFor="kid1-name">Kid 1</label>
            <input
              id="kid1-name"
              className="field-input"
              value={names.kid1}
              onChange={e => setNames(n => ({ ...n, kid1: e.target.value }))}
              placeholder="Kid 1"
              maxLength={20}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="kid2-name">Kid 2</label>
            <input
              id="kid2-name"
              className="field-input"
              value={names.kid2}
              onChange={e => setNames(n => ({ ...n, kid2: e.target.value }))}
              placeholder="Kid 2"
              maxLength={20}
            />
          </div>

          <button className="save-btn" onClick={handleSave}>
            {saved ? '✓ Saved' : 'Save Names'}
          </button>
        </div>
      </div>
    </div>
  );
}
