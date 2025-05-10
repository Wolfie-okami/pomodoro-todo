import React from 'react';
import { useTimerContext, TimerMode } from '../../context/TimerContext';
import { useSettingsContext } from '../../context/SettingsContext';
import { X, Play, Pause, RotateCcw, Clock, Coffee } from 'lucide-react';
import './TimerModal.css';

interface TimerModalProps {
  onClose: () => void;
}

function TimerModal({ onClose }: TimerModalProps) {
  const { state, startTimer, pauseTimer, resetTimer, switchMode } = useTimerContext();
  const { settings } = useSettingsContext();
  
  // Format the remaining time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress for the circular timer (percentage from 0 to 1)
  const calculateProgress = () => {
    const totalSeconds = state.mode === 'work' 
      ? settings.workDuration * 60 
      : settings.breakDuration * 60;
    
    return state.timeRemaining / totalSeconds;
  };
  
  const progress = calculateProgress();
  const circumference = 2 * Math.PI * 120; // 120 is the radius of the circle
  const strokeDashoffset = circumference * (1 - progress);
  
  // Determine colors based on the current mode
  const getTimerColor = () => {
    return state.mode === 'work' 
      ? 'var(--color-primary-500)' 
      : 'var(--color-secondary-500)';
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal-content timer-modal">
        <button 
          className="modal-close"
          onClick={onClose}
          aria-label="Close timer"
        >
          <X size={24} />
        </button>
        
        <div className="timer-mode-tabs">
          <button 
            className={`timer-mode-tab ${state.mode === 'work' ? 'active' : ''}`}
            onClick={() => switchMode('work')}
          >
            <Clock size={18} />
            <span>Work</span>
          </button>
          <button 
            className={`timer-mode-tab ${state.mode === 'break' ? 'active' : ''}`}
            onClick={() => switchMode('break')}
          >
            <Coffee size={18} />
            <span>Break</span>
          </button>
        </div>
        
        <div className="timer-display">
          <svg className="timer-circle" width="280" height="280" viewBox="0 0 280 280">
            {/* Background circle */}
            <circle 
              cx="140" 
              cy="140" 
              r="120" 
              fill="none" 
              stroke={state.mode === 'work' ? 'var(--color-primary-100)' : 'var(--color-secondary-100)'} 
              strokeWidth="8"
            />
            
            {/* Progress circle */}
            <circle 
              cx="140" 
              cy="140" 
              r="120" 
              fill="none" 
              stroke={getTimerColor()} 
              strokeWidth="12" 
              strokeLinecap="round"
              strokeDasharray={circumference} 
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 140 140)"
              className="timer-progress"
            />
          </svg>
          
          <div className="timer-time">
            {formatTime(state.timeRemaining)}
          </div>
        </div>
        
        <div className="timer-controls">
          {state.isRunning ? (
            <button 
              className="timer-button pause"
              onClick={pauseTimer}
              aria-label="Pause timer"
            >
              <Pause size={24} />
              <span>Pause</span>
            </button>
          ) : (
            <button 
              className="timer-button start"
              onClick={() => startTimer()}
              aria-label="Start timer"
            >
              <Play size={24} />
              <span>Start</span>
            </button>
          )}
          
          <button 
            className="timer-button reset"
            onClick={resetTimer}
            aria-label="Reset timer"
          >
            <RotateCcw size={24} />
            <span>Reset</span>
          </button>
        </div>
        
        <div className="timer-status">
          {state.mode === 'work' ? (
            <p>Focus on your task!</p>
          ) : (
            <p>Take a short break.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TimerModal;