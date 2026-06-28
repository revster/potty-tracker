import { useState } from 'react';
import './SettingsPanel.css';

interface Props {
  names: { kid1: string; kid2: string };
  onSave: (names: { kid1: string; kid2: string }) => void;
  onClose: () => void;
}

export default function SettingsPanel({ names, onSave, onClose }: Props) {
  const [kid1, setKid1] = useState(names.kid1);
  const [kid2, setKid2] = useState(names.kid2);

  const handleSave = () => {
    onSave({
      kid1: kid1.trim() || 'Kid 1',
      kid2: kid2.trim() || 'Kid 2',
    });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h2 className="sheet-title">Settings</h2>

        <div className="field">
          <label className="field-label" htmlFor="kid1-name">Kid 1 name</label>
          <input
            id="kid1-name"
            className="field-input"
            value={kid1}
            onChange={e => setKid1(e.target.value)}
            placeholder="Kid 1"
            maxLength={20}
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="kid2-name">Kid 2 name</label>
          <input
            id="kid2-name"
            className="field-input"
            value={kid2}
            onChange={e => setKid2(e.target.value)}
            placeholder="Kid 2"
            maxLength={20}
          />
        </div>

        <div className="sheet-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
