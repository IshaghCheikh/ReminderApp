
import React, { useState } from 'react';
import type { Activity } from '../types';
import ActivityItem from './ActivityItem';
import { PlusIcon } from './icons';

interface PlannerViewProps {
  activities: Activity[];
  onAddActivity: (text: string, time: string) => void;
  onRemoveActivity: (id: number) => void;
}

const PlannerView: React.FC<PlannerViewProps> = ({ activities, onAddActivity, onRemoveActivity }) => {
  const [newActivityText, setNewActivityText] = useState('');
  const [newActivityTime, setNewActivityTime] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivityText.trim() && newActivityTime) {
      onAddActivity(newActivityText.trim(), newActivityTime);
      setNewActivityText('');
      setNewActivityTime('');
    }
  };

  const today = new Date();
  const dateString = today.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
        <header className="mb-6 text-center">
            <h1 className="text-4xl font-bold text-slate-100">Today's Plan</h1>
            <p className="text-slate-400 mt-1">{dateString}</p>
        </header>

        <div className="flex-grow overflow-y-auto pb-32">
            {activities.length > 0 ? (
                <ul className="space-y-3">
                    {activities.map(activity => (
                        <ActivityItem key={activity.id} activity={activity} onRemove={onRemoveActivity} />
                    ))}
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center text-center text-slate-500 pt-16">
                    <p className="text-lg">Your schedule is clear.</p>
                    <p>Add your first activity below to get started!</p>
                </div>
            )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm p-4 border-t border-slate-700">
             <form onSubmit={handleAdd} className="container mx-auto flex flex-col sm:flex-row gap-2 items-center">
                <input
                    type="text"
                    value={newActivityText}
                    onChange={(e) => setNewActivityText(e.target.value)}
                    placeholder="What's the plan?"
                    className="w-full sm:flex-grow bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
                <input
                    type="time"
                    value={newActivityTime}
                    onChange={(e) => setNewActivityTime(e.target.value)}
                    className="w-full sm:w-auto bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                    required
                />
                <button type="submit" className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg p-3 flex items-center justify-center gap-2 transition-colors">
                    <PlusIcon className="w-6 h-6" />
                    <span className="sm:hidden">Add Activity</span>
                </button>
            </form>
        </div>
    </div>
  );
};

export default PlannerView;
