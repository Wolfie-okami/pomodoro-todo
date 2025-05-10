import { useEffect } from 'react';

interface ShortcutHandlers {
  onSpacePress?: () => void;
  onNPress?: () => void;
  onSPress?: () => void;
}

export function useKeyboardShortcuts({ onSpacePress, onNPress, onSPress }: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if we're in an input, textarea, or other form element
      if (event.target instanceof HTMLElement && 
          (event.target.tagName === 'INPUT' || 
           event.target.tagName === 'TEXTAREA' || 
           event.target.isContentEditable)) {
        return;
      }
      
      switch (event.key) {
        case ' ':
          if (onSpacePress) {
            event.preventDefault();
            onSpacePress();
          }
          break;
        case 'n':
        case 'N':
          if (onNPress) {
            event.preventDefault();
            onNPress();
          }
          break;
        case 's':
        case 'S':
          if (onSPress) {
            event.preventDefault();
            onSPress();
          }
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSpacePress, onNPress, onSPress]);
}