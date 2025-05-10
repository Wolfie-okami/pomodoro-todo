import React from 'react';
import { useSettingsContext, ThemeOption } from '../../context/SettingsContext';
import { X, Sun, Moon, Leaf } from 'lucide-react';
import './SettingsModal.css';

interface SettingsModalProps {
  onClose: () => void;
}

function SettingsModal({ onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettingsContext();
  
  const handleWorkDurationChange = (value: number) => {
    if (value >= 1 && value <= 60) {
      updateSettings({ workDuration: value });
    }
  };
  
  const handleBreakDurationChange = (value: number) => {
    if (value >= 1 && value <= 30) {
      updateSettings({ breakDuration: value });
    }
  };
  
  const handleThemeChange = (theme: ThemeOption) => {
    updateSettings({ theme });
  };
  
  const handleAutoStartBreakChange = (autoStartBreak: boolean) => {
    updateSettings({ autoStartBreak });
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal-content settings-modal">
        <div className="settings-header">
          <h2 className="settings-title">Settings</h2>
          <button 
            className="modal-close"
            onClick={onClose}
            aria-label="Close settings"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="settings-section">
          <h3 className="settings-section-title">Timer Duration</h3>
          
          <div className="settings-option">
            <label htmlFor="workDuration">Work Duration (minutes)</label>
            <div className="duration-control">
              <button 
                className="duration-button"
                onClick={() => handleWorkDurationChange(settings.workDuration - 1)}
                disabled={settings.workDuration <= 1}
                aria-label="Decrease work duration"
              >
                -
              </button>
              <input 
                id="workDuration"
                type="number" 
                min="1"
                max="60"
                value={settings.workDuration}
                onChange={(e) => handleWorkDurationChange(parseInt(e.target.value))}
                className="duration-input"
              />
              <button 
                className="duration-button"
                onClick={() => handleWorkDurationChange(settings.workDuration + 1)}
                disabled={settings.workDuration >= 60}
                aria-label="Increase work duration"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="settings-option">
            <label htmlFor="breakDuration">Break Duration (minutes)</label>
            <div className="duration-control">
              <button 
                className="duration-button"
                onClick={() => handleBreakDurationChange(settings.breakDuration - 1)}
                disabled={settings.breakDuration <= 1}
                aria-label="Decrease break duration"
              >
                -
              </button>
              <input 
                id="breakDuration"
                type="number" 
                min="1"
                max="30"
                value={settings.breakDuration}
                onChange={(e) => handleBreakDurationChange(parseInt(e.target.value))}
                className="duration-input"
              />
              <button 
                className="duration-button"
                onClick={() => handleBreakDurationChange(settings.breakDuration + 1)}
                disabled={settings.breakDuration >= 30}
                aria-label="Increase break duration"
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h3 className="settings-section-title">Theme</h3>
          
          <div className="theme-options">
            <button 
              className={`theme-option ${settings.theme === 'tomatoRed' ? 'active' : ''}`}
              onClick={() => handleThemeChange('tomatoRed')}
              aria-label="Tomato Red theme"
              aria-pressed={settings.theme === 'tomatoRed'}
            >
              <div className="theme-color tomato-red"></div>
              <div className="theme-label">
                <Sun size={16} />
                <span>Tomato Red</span>
              </div>
            </button>
            
            <button 
              className={`theme-option ${settings.theme === 'mintGreen' ? 'active' : ''}`}
              onClick={() => handleThemeChange('mintGreen')}
              aria-label="Mint Green theme"
              aria-pressed={settings.theme === 'mintGreen'}
            >
              <div className="theme-color mint-green"></div>
              <div className="theme-label">
                <Leaf size={16} />
                <span>Mint Green</span>
              </div>
            </button>
            
            <button 
              className={`theme-option ${settings.theme === 'midnightDark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('midnightDark')}
              aria-label="Midnight Dark theme"
              aria-pressed={settings.theme === 'midnightDark'}
            >
              <div className="theme-color midnight-dark"></div>
              <div className="theme-label">
                <Moon size={16} />
                <span>Midnight Dark</span>
              </div>
            </button>
          </div>
        </div>
        
        <div className="settings-section">
          <h3 className="settings-section-title">Behavior</h3>
          
          <div className="settings-option checkbox">
            <input 
              id="autoStartBreak"
              type="checkbox"
              checked={settings.autoStartBreak}
              onChange={(e) => handleAutoStartBreakChange(e.target.checked)}
              className="settings-checkbox"
            />
            <label htmlFor="autoStartBreak">Automatically start break timer</label>
          </div>
        </div>
        
        <div className="settings-footer">
          <p className="keyboard-shortcuts">
            <strong>Keyboard Shortcuts:</strong> Space (Start/Pause Timer), S (Settings)
          </p>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;