import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/authContext';

const Navbar: React.FC = () => {
  const { token, logout } = useContext(AuthContext);

  return (
    <nav>
      <ul>
        {token ? (
          <>
            <li>
              <Link to="/">Project List</Link>
            </li>
            <li>
              <Link to="/active">Active Project</Link>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
