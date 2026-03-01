import { useState, useEffect } from 'react';

export type AppMode = 'general' | 'baby' | 'elderly';

export function useMode() {
  const [mode, setMode] = useState<AppMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('barcode_baba_mode');
      if (saved === 'general' || saved === 'baby' || saved === 'elderly') {
        return saved;
      }
    }
    return 'general';
  });

  useEffect(() => {
    localStorage.setItem('barcode_baba_mode', mode);
    
    // Apply global classes for mode-based theme overrides
    if (mode === 'elderly') {
      document.body.classList.add('elderly-mode');
    } else {
      document.body.classList.remove('elderly-mode');
    }

    if (mode === 'baby') {
      document.body.classList.add('baby-mode');
    } else {
      document.body.classList.remove('baby-mode');
    }
  }, [mode]);

  return { mode, setMode };
}
