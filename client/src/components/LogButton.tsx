import { useState } from 'react';
import './LogButton.css';

interface Props {
  emoji: string;
  label: string;
  count: number;
  color: 'poop' | 'pee';
  onTap: () => Promise<void>;
}

export default function LogButton({ emoji, label, count, color, onTap }: Props) {
  const [pressed, setPressed] = useState(false);

  const handlePress = async () => {
    if (pressed) return;
    setPressed(true);
    await onTap();
    setTimeout(() => setPressed(false), 300);
  };

  return (
    <button
      className={`log-btn log-btn--${color} ${pressed ? 'log-btn--pressed' : ''}`}
      onClick={handlePress}
    >
      <span className="log-btn__emoji">{emoji}</span>
      <span className="log-btn__label">{label}</span>
      <span className="log-btn__count">
        {count > 0 ? `${count}x today` : '–'}
      </span>
    </button>
  );
}
