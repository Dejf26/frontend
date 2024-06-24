// src/components/NotificationIcon.tsx
import React, { useEffect, useState } from 'react';
import NotificationService from '../api/notificationService';
import { FaBell } from 'react-icons/fa';

const NotificationIcon: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const subscription = NotificationService.unreadCount().subscribe(setUnreadCount);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="relative">
      <FaBell />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationIcon;
