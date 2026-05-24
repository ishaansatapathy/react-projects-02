import { useEffect, useState } from 'react';

export default function Stopwatch() {
  const [milliseconds, setMilliseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lapTimes, setLapTimes] = useState([]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const interval = setInterval(() => {
      setMilliseconds((prev) => prev + 10);
    }, 10);

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(
      centiseconds,
    ).padStart(2, '0')}`;
  };

  const handleReset = () => {
    setMilliseconds(0);
    setIsRunning(false);
    setLapTimes([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLapTimes((prev) => [milliseconds, ...prev]);
    }
  };

  return (
    <div>
      <div className="display">
        <div className="time-readout">{formatTime(milliseconds)}</div>
        <div className="display-label">MM:SS.CS</div>
      </div>

      <div className="controls">
        {!isRunning ? (
          <button type="button" onClick={() => setIsRunning(true)} className="action-btn primary">
            Start
          </button>
        ) : (
          <button type="button" onClick={() => setIsRunning(false)} className="action-btn warning">
            Pause
          </button>
        )}

        <button type="button" onClick={handleReset} className="action-btn danger">
          Reset
        </button>

        <button
          type="button"
          onClick={handleLap}
          disabled={!isRunning}
          className="action-btn neutral"
        >
          Lap
        </button>
      </div>

      {lapTimes.length > 0 && (
        <section className="lap-section">
          <h2 className="section-title">Lap Times</h2>
          <div className="lap-list">
            {lapTimes.map((lap, index) => (
              <div key={`${lap}-${index}`} className="lap-row">
                <span>Lap {lapTimes.length - index}</span>
                <span className="lap-time">{formatTime(lap)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
