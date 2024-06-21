// src/components/Navbar.tsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/authContext';

const Navbar: React.FC = () => {
  const { token, logout } = useContext(AuthContext);

  return (
    <nav className="bg-black text-white py-3 px-5 fixed top-0 w-full flex justify-between items-center">
      <div className="text-cyan-400 font-bold text-xl">
        <Link to="/">ManageMe</Link>
      </div>
      <ul className="flex items-center space-x-4">
        {token ? (
          <>
            <li>
              <Link to="/" className="hover:bg-gray-700 py-2 px-4 rounded">Project List</Link>
            </li>
            <li>
              <Link to="/active" className="hover:bg-gray-700 py-2 px-4 rounded">Active Project</Link>
            </li>
            <li>
              <Link to="/stories" className="hover:bg-gray-700 py-2 px-4 rounded">Stories</Link>
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
