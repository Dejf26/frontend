import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import NotificationService from '../api/notificationService';
import AuthContext from '../context/authContext';
import NotificationList from './NotificationList';

const Navbar: React.FC = () => {
  const { token, logout, user } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isNotificationListOpen, setIsNotificationListOpen] = useState<boolean>(false);

  useEffect(() => {
    const subscription = NotificationService.unreadCount().subscribe(count => setUnreadCount(count));
    return () => subscription.unsubscribe();
  }, []);

  const handleBellClick = () => {
    NotificationService.markAllAsRead();
    setIsNotificationListOpen(true);
  };

  const handleNotificationListClose = () => {
    setIsNotificationListOpen(false);
    NotificationService.clearAll();
  };

  return (
    <nav className="bg-black text-white py-3 px-5 fixed top-0 w-full flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="text-cyan-400 font-bold text-xl">
          <Link to="/">ManageMe</Link>
        </div>
        {token && (
          <>
            <Link to="/" className="hover:bg-gray-700 py-2 px-4 rounded">Project List</Link>
            <Link to="/active" className="hover:bg-gray-700 py-2 px-4 rounded">Active Project</Link>
            <Link to="/stories" className="hover:bg-gray-700 py-2 px-4 rounded">Stories</Link>
            <Link to="/tasks" className="hover:bg-gray-700 py-2 px-4 rounded">Tasks</Link>
          </>
        )}
      </div>
      <ul className="flex items-center space-x-4">
        {token ? (
          <>
            <li className="relative">
              <button onClick={handleBellClick} className="relative focus:outline-none">
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {unreadCount}
                  </span>
                )}
              </button>
              {isNotificationListOpen && (
                <NotificationList onClose={handleNotificationListClose} />
              )}
            </li>
            <li>
              <span className="py-2 px-4 rounded">Logged in as {user?.firstName}</span>
            </li>
            <li>
              <button onClick={logout} className="hover:bg-gray-700 py-2 px-4 rounded">Logout</button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" className="hover:bg-gray-700 py-2 px-4 rounded">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
