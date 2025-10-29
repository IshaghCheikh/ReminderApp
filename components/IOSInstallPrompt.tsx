
import React, { useState, useEffect } from 'react';
import { IosShareIcon } from './icons';

const IOSInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Basic check for iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // Check if the app is running in standalone mode (i.e., added to home screen)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const hasBeenDismissed = localStorage.getItem('iosInstallPromptDismissed') === 'true';

    if (isIOS && !isInStandaloneMode && !hasBeenDismissed) {
      setShowPrompt(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('iosInstallPromptDismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 text-slate-100 p-4 rounded-lg shadow-2xl z-50 animate-fade-in max-w-sm border border-slate-600">
      <div className="flex items-start gap-4">
        <IosShareIcon className="w-8 h-8 text-sky-400 flex-shrink-0 mt-1" />
        <div>
            <h3 className="font-bold text-lg">Enable Notifications on iOS</h3>
            <p className="text-sm text-slate-300 mt-1">
              To get reminders, you must add this app to your Home Screen.
            </p>
            <p className="text-xs text-slate-400 mt-2">
                Tap the Share button in your browser, then find and tap 'Add to Home Screen'.
            </p>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute top-1 right-1 text-slate-500 hover:text-slate-300 p-1"
        aria-label="Dismiss"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default IOSInstallPrompt;
