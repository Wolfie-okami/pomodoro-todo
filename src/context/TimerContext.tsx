import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { useSettingsContext } from './SettingsContext';
import { useTaskContext } from './TaskContext';

// Types
export type TimerMode = 'work' | 'break';

interface TimerState {
  mode: TimerMode;
  timeRemaining: number;
  isRunning: boolean;
  isComplete: boolean;
  currentTaskId: string | null;
  pomodorosCompleted: number;
  dailyStreak: number;
}

type TimerAction = 
  | { type: 'START_TIMER'; payload?: { taskId?: string } }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'TICK' }
  | { type: 'COMPLETE_TIMER' }
  | { type: 'SWITCH_MODE'; payload: { mode: TimerMode } }
  | { type: 'SET_TIME'; payload: { timeRemaining: number } }
  | { type: 'INCREMENT_POMODORO' };

interface TimerContextType {
  state: TimerState;
  startTimer: (taskId?: string) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTime: (minutes: number) => void;
  switchMode: (mode: TimerMode) => void;
}

// Context
const TimerContext = createContext<TimerContextType | undefined>(undefined);

// Reducer
function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        isRunning: true,
        currentTaskId: action.payload?.taskId || state.currentTaskId
      };
    
    case 'PAUSE_TIMER':
      return {
        ...state,
        isRunning: false
      };
    
    case 'RESET_TIMER':
      return {
        ...state,
        isRunning: false,
        isComplete: false,
        timeRemaining: state.mode === 'work' ? 25 * 60 : 5 * 60
      };
    
    case 'TICK':
      return {
        ...state,
        timeRemaining: Math.max(0, state.timeRemaining - 1),
        isComplete: state.timeRemaining <= 1
      };
    
    case 'COMPLETE_TIMER':
      return {
        ...state,
        isRunning: false,
        isComplete: true
      };
    
    case 'SWITCH_MODE':
      return {
        ...state,
        mode: action.payload.mode,
        isRunning: false,
        isComplete: false,
        timeRemaining: action.payload.mode === 'work' ? 25 * 60 : 5 * 60
      };
    
    case 'SET_TIME':
      return {
        ...state,
        timeRemaining: action.payload.timeRemaining
      };
    
    case 'INCREMENT_POMODORO':
      return {
        ...state,
        pomodorosCompleted: state.pomodorosCompleted + 1,
        dailyStreak: state.dailyStreak + 1
      };
      
    default:
      return state;
  }
}

// Provider
export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettingsContext();
  const { incrementPomodoroCount } = useTaskContext();
  const soundRef = useRef<HTMLAudioElement | null>(null);
  
  const initialState: TimerState = {
    mode: 'work',
    timeRemaining: settings.workDuration * 60,
    isRunning: false,
    isComplete: false,
    currentTaskId: null,
    pomodorosCompleted: 0,
    dailyStreak: 0
  };
  
  const [state, dispatch] = useReducer(timerReducer, initialState);
  
  // Create timer interval
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (state.isRunning && !state.isComplete) {
      intervalId = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [state.isRunning, state.isComplete]);
  
  // Handle timer completion
  useEffect(() => {
    if (state.timeRemaining === 0 && !state.isComplete) {
      // Play sound
      if (soundRef.current) {
        soundRef.current.play().catch(error => console.error('Error playing sound:', error));
      }
      
      dispatch({ type: 'COMPLETE_TIMER' });
      
      // If work mode is complete
      if (state.mode === 'work') {
        // Increment pomodoro count for the current task
        if (state.currentTaskId) {
          incrementPomodoroCount(state.currentTaskId);
        }
        
        // Increment overall pomodoro count
        dispatch({ type: 'INCREMENT_POMODORO' });
        
        // Switch to break mode
        if (settings.autoStartBreak) {
          setTimeout(() => {
            dispatch({ type: 'SWITCH_MODE', payload: { mode: 'break' } });
            dispatch({ type: 'START_TIMER' });
          }, 1000);
        } else {
          dispatch({ type: 'SWITCH_MODE', payload: { mode: 'break' } });
        }
      } else {
        // If break mode is complete, switch back to work mode
        dispatch({ type: 'SWITCH_MODE', payload: { mode: 'work' } });
      }
    }
  }, [state.timeRemaining, state.isComplete, state.mode, state.currentTaskId, settings.autoStartBreak, incrementPomodoroCount]);
  
  // Update timer when settings change
  useEffect(() => {
    if (!state.isRunning) {
      if (state.mode === 'work') {
        dispatch({ 
          type: 'SET_TIME', 
          payload: { timeRemaining: settings.workDuration * 60 } 
        });
      } else {
        dispatch({ 
          type: 'SET_TIME', 
          payload: { timeRemaining: settings.breakDuration * 60 } 
        });
      }
    }
  }, [settings.workDuration, settings.breakDuration, state.mode, state.isRunning]);
  
  // Actions
  const startTimer = (taskId?: string) => {
    dispatch({ type: 'START_TIMER', payload: { taskId } });
  };
  
  const pauseTimer = () => {
    dispatch({ type: 'PAUSE_TIMER' });
  };
  
  const resetTimer = () => {
    dispatch({ type: 'RESET_TIMER' });
  };
  
  const setTime = (minutes: number) => {
    dispatch({ 
      type: 'SET_TIME', 
      payload: { timeRemaining: minutes * 60 } 
    });
  };
  
  const switchMode = (mode: TimerMode) => {
    dispatch({ type: 'SWITCH_MODE', payload: { mode } });
  };
  
  return (
    <TimerContext.Provider
      value={{
        state,
        startTimer,
        pauseTimer,
        resetTimer,
        setTime,
        switchMode
      }}
    >
      {/* Sound element for timer completion */}
      <audio ref={soundRef} preload="auto">
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-software-interface-alert-217.mp3" type="audio/mpeg" />
      </audio>
      {children}
    </TimerContext.Provider>
  );
}

// Hook
export function useTimerContext() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
}