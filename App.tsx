
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Activity, NotificationPermission } from './types';
import WelcomeView from './components/WelcomeView';
import PlannerView from './components/PlannerView';
import { BellIcon } from './components/icons';

const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  const activitiesRef = useRef(activities);
  const permissionRef = useRef(permission);

  useEffect(() => {
    activitiesRef.current = activities;
  }, [activities]);
  
  useEffect(() => {
    permissionRef.current = permission;
  }, [permission]);

  const getTodayDateString = useCallback(() => new Date().toISOString().split('T')[0], []);

  const markAsNotified = useCallback((id: number) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === id ? { ...activity, notified: true } : activity
      )
    );
  }, []);

  // Effect for initialization on mount
  useEffect(() => {
    const today = getTodayDateString();
    const lastPlanDate = localStorage.getItem('lastPlanDate');
    const storedPermission = Notification.permission as NotificationPermission;
    setPermission(storedPermission);

    const now = new Date();
    const shouldShowWelcome =
      lastPlanDate !== today &&
      (now.getHours() > 7 || (now.getHours() === 7 && now.getMinutes() >= 30));

    if (shouldShowWelcome) {
      setShowWelcome(true);
      setActivities([]);
      localStorage.removeItem(`plan-${today}`);
    } else {
      setShowWelcome(false);
      const savedActivities = localStorage.getItem(`plan-${today}`);
      if (savedActivities) {
        setActivities(JSON.parse(savedActivities));
      }
    }
    
    setIsInitialized(true);
  }, [getTodayDateString]);

  // Effect for periodic checks (reminders and daily prompt)
  useEffect(() => {
    if (!isInitialized) return;

    const intervalId = setInterval(() => {
      const now = new Date();
      const today = getTodayDateString();

      // 1. Check for activity reminders
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      activitiesRef.current.forEach(activity => {
        if (activity.time === currentTime && !activity.notified) {
          if (permissionRef.current === 'granted') {
            new Notification('Activity Reminder!', {
              body: activity.text,
              icon: '/vite.svg', 
            });
          }
          markAsNotified(activity.id);
        }
      });
      
      // 2. Check for the daily 7:30 AM planning prompt notification
      const lastPromptNotificationDate = localStorage.getItem('lastDailyPromptNotificationDate');
      const is730AM = now.getHours() === 7 && now.getMinutes() === 30;

      if (is730AM && lastPromptNotificationDate !== today && permissionRef.current === 'granted') {
          new Notification('Time to plan your day!', {
              body: 'Good morning! What are your goals for today?',
              icon: '/vite.svg',
          });
          localStorage.setItem('lastDailyPromptNotificationDate', today);
      }

      // 3. Check if it's time to show the daily prompt UI
      setShowWelcome(currentShowWelcome => {
        if (currentShowWelcome) {
          return true; // Already showing, no change needed
        }

        const lastPlanDate = localStorage.getItem('lastPlanDate');
        const shouldShowWelcomeNow =
          lastPlanDate !== today &&
          (now.getHours() > 7 || (now.getHours() === 7 && now.getMinutes() >= 30));

        if (shouldShowWelcomeNow) {
          setActivities([]);
          localStorage.removeItem(`plan-${today}`);
          return true;
        }

        return false;
      });
    }, 15000); // Check every 15 seconds

    return () => clearInterval(intervalId);
  }, [isInitialized, markAsNotified, getTodayDateString]);


  useEffect(() => {
    if (isInitialized) {
      const today = getTodayDateString();
      localStorage.setItem(`plan-${today}`, JSON.stringify(activities));
    }
  }, [activities, isInitialized, getTodayDateString]);

  const requestNotificationPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result as NotificationPermission);
  };
  
  const handleStartDay = () => {
    setShowWelcome(false);
    localStorage.setItem('lastPlanDate', getTodayDateString());
  };

  const addActivity = (text: string, time: string) => {
    const newActivity: Activity = {
      id: Date.now(),
      text,
      time,
      notified: false,
    };
    setActivities(prev => [...prev, newActivity].sort((a,b) => a.time.localeCompare(b.time)));
  };

  const removeActivity = (id: number) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };
  
  if (!isInitialized) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="text-xl text-slate-400">Loading your day...</div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      {permission === 'default' && (
        <div className="bg-sky-800 text-white p-3 text-center shadow-lg">
          <div className="container mx-auto flex items-center justify-center gap-4">
            <BellIcon className="w-6 h-6"/>
            <span>Enable notifications to get reminders!</span>
            <button
              onClick={requestNotificationPermission}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-1 px-3 rounded-lg transition-colors"
            >
              Enable
            </button>
          </div>
        </div>
      )}
      <main className="container mx-auto p-4 md:p-6">
        {showWelcome ? (
          <WelcomeView onStart={handleStartDay} />
        ) : (
          <PlannerView 
            activities={activities}
            onAddActivity={addActivity}
            onRemoveActivity={removeActivity}
          />
        )}
      </main>
    </div>
  );
};

export default App;
