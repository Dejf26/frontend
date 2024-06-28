import React, { useEffect, useState } from 'react';
import NotificationService, { Notification } from '../api/notificationService';

const NotificationPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const subscription = NotificationService.list().subscribe(setNotifications);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-lg">
      <ul>
        {notifications.map((notification, index) => (
          <li key={index} className="border-b p-2 dark:border-gray-700">
            <div className="font-bold">{notification.title}</div>
            <div>{notification.message}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(notification.date).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPanel;
