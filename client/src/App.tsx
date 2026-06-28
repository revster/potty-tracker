import { useState } from 'react';
import Home from './pages/Home';
import Log from './pages/Log';
import Settings from './pages/Settings';
import './App.css';

type Tab = 'home' | 'log' | 'settings';

export default function App() {
  const [tab, setTab] = useState<Tab>('home');

  return (
    <div className="app">
      <div className="page-area">
        {tab === 'home' && <Home />}
        {tab === 'log' && <Log />}
        {tab === 'settings' && <Settings />}
      </div>
      <nav className="bottom-nav">
        <button
          className={`nav-btn ${tab === 'home' ? 'active' : ''}`}
          onClick={() => setTab('home')}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </button>
        <button
          className={`nav-btn ${tab === 'log' ? 'active' : ''}`}
          onClick={() => setTab('log')}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-label">Log</span>
        </button>
        <button
          className={`nav-btn ${tab === 'settings' ? 'active' : ''}`}
          onClick={() => setTab('settings')}
        >
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Settings</span>
        </button>
      </nav>
    </div>
  );
}
