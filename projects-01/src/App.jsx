import { useState } from 'react';
import Stopwatch from './components/Stopwatch';
import Timer from './components/Timer';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('stopwatch');

  return (
    <main className="app-shell">
      <section className="time-app">
        <header className="app-header">
          <p className="eyebrow">Focus clock</p>
          <h1>Time Master</h1>
          <p>Sharp stopwatch and timer controls for workouts, study blocks, and quick sessions.</p>
        </header>

        <div className="mode-switch" role="tablist" aria-label="Time tools">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'stopwatch'}
            onClick={() => setActiveTab('stopwatch')}
            className={activeTab === 'stopwatch' ? 'is-active' : ''}
          >
            Stopwatch
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'timer'}
            onClick={() => setActiveTab('timer')}
            className={activeTab === 'timer' ? 'is-active' : ''}
          >
            Timer
          </button>
        </div>

        <div className="panel">
          {activeTab === 'stopwatch' && <Stopwatch />}
          {activeTab === 'timer' && <Timer />}
        </div>

        <footer className="app-footer">Built with React + Vite</footer>
      </section>
    </main>
  );
}
