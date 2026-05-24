import { useEffect, useState } from 'react';

export default function Timer() {
  const [inputMinutes, setInputMinutes] = useState('');
  const [inputSeconds, setInputSeconds] = useState('');
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [initialSeconds, setInitialSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timerSet, setTimerSet] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (!isRunning || totalSeconds <= 0) {
      return undefined;
    }

    const interval = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsTimeUp(true);
          playNotification();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, totalSeconds]);

  const playNotification = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      return;
    }

    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 820;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.24, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSetTimer = () => {
    const mins = Math.max(0, Number.parseInt(inputMinutes, 10) || 0);
    const secs = Math.min(59, Math.max(0, Number.parseInt(inputSeconds, 10) || 0));
    const total = mins * 60 + secs;

    if (total > 0) {
      setTotalSeconds(total);
      setInitialSeconds(total);
      setTimerSet(true);
      setIsTimeUp(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTotalSeconds(0);
    setInitialSeconds(0);
    setTimerSet(false);
    setInputMinutes('');
    setInputSeconds('');
    setIsTimeUp(false);
  };

  const progress = initialSeconds > 0 ? ((initialSeconds - totalSeconds) / initialSeconds) * 100 : 0;

  if (!timerSet) {
    return (
      <div className="timer-form">
        <h2>Set Your Timer</h2>

        <div className="input-grid">
          <div className="field">
            <label htmlFor="timer-minutes">Minutes</label>
            <input
              id="timer-minutes"
              type="number"
              min="0"
              value={inputMinutes}
              onChange={(event) => setInputMinutes(event.target.value)}
              placeholder="0"
            />
          </div>

          <div className="field">
            <label htmlFor="timer-seconds">Seconds</label>
            <input
              id="timer-seconds"
              type="number"
              min="0"
              max="59"
              value={inputSeconds}
              onChange={(event) => setInputSeconds(event.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <button type="button" onClick={handleSetTimer} className="action-btn primary">
          Set Timer
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="display">
        <div className={`time-readout ${isTimeUp ? 'time-up' : ''}`}>{formatTime(totalSeconds)}</div>
        <div className="display-label">Remaining</div>
        {isTimeUp && <div className="time-up-message">Time is up</div>}
      </div>

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="controls">
        {!isRunning ? (
          <button
            type="button"
            onClick={() => setIsRunning(true)}
            disabled={isTimeUp || totalSeconds === 0}
            className="action-btn primary"
          >
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
      </div>
    </div>
  );
}
