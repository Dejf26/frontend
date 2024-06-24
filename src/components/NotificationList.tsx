import React, { useEffect, useState } from 'react';
import NotificationService, { Notification } from '../api/notificationService';

interface NotificationListProps {
  onClose: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const subscription = NotificationService.list().subscribe(setNotifications);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white text-black shadow-lg rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <button onClick={onClose} className="text-red-500 hover:text-red-700">Close</button>
      </div>
      <ul className="max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <li className="p-4">No notifications</li>
        ) : (
          notifications.map((notification, index) => (
            <li key={index} className="p-4 border-b">
              <h4 className="font-semibold">{notification.title}</h4>
              <p>{notification.message}</p>
              <p className="text-sm text-gray-500">{new Date(notification.date).toLocaleString()}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificationList;
