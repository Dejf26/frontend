import React from 'react';
import { Link } from 'react-router-dom';
import '../style/navbar.css';


const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-500 p-4 text-white">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="hover:underline">
            Project List
          </Link>
        </li>
        <li>
          <Link to="/active" className="hover:underline">
            Active Project
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
