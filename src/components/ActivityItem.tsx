import React from 'react';
import type { Activity } from '../types';
import { ClockIcon, CheckCircleIcon, TrashIcon } from './icons';

interface ActivityItemProps {
  activity: Activity;
  onRemove: (id: number) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onRemove }) => {
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = hourNum % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  return (
    <li className={`flex items-center justify-between bg-slate-800 p-4 rounded-xl shadow-md transition-all duration-300 ${activity.notified ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-4">
        {activity.notified ? (
            <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
        ) : (
            <ClockIcon className="w-6 h-6 text-sky-400 flex-shrink-0" />
        )}
        <div>
          <p className={`font-medium text-slate-100 ${activity.notified ? 'line-through' : ''}`}>
            {activity.text}
          </p>
          <p className="text-sm text-slate-400">{formatTime(activity.time)}</p>
        </div>
      </div>
      <button
        onClick={() => onRemove(activity.id)}
        className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-full"
        aria-label="Remove activity"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </li>
  );
};

export default ActivityItem;
