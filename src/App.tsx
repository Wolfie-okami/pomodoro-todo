import React from 'react';
import { TaskProvider } from './context/TaskContext';
import { TimerProvider } from './context/TimerContext';
import { SettingsProvider } from './context/SettingsContext';
import Dashboard from './components/Dashboard/Dashboard';
import TaskList from './components/TaskList/TaskList';
import TimerModal from './components/Timer/TimerModal';
import SettingsModal from './components/Settings/SettingsModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Clock, Settings } from 'lucide-react';
import './styles/global.css';

function App() {
  const [timerOpen, setTimerOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  
  // Register keyboard shortcuts
  useKeyboardShortcuts({
    onSpacePress: () => setTimerOpen(prev => !prev),
    onSPress: () => setSettingsOpen(prev => !prev),
  });

  return (
    <SettingsProvider>
      <TaskProvider>
        <TimerProvider>
          <div className="app-container">
            <header className="app-header">
              <div className="logo-container">
                <Clock className="logo-icon" />
                <h1 className="app-title">PomodoroTodo</h1>
              </div>
              <button 
                className="icon-button settings-button" 
                onClick={() => setSettingsOpen(true)}
                aria-label="Open Settings"
              >
                <Settings />
              </button>
            </header>
            
            <main className="app-content">
              <Dashboard />
              <TaskList onStartTimer={(taskId) => setTimerOpen(true)} />
            </main>
            
            {timerOpen && (
              <TimerModal onClose={() => setTimerOpen(false)} />
            )}
            
            {settingsOpen && (
              <SettingsModal onClose={() => setSettingsOpen(false)} />
            )}
          </div>
        </TimerProvider>
      </TaskProvider>
    </SettingsProvider>
  );
}

export default App;