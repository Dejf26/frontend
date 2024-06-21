import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';

const Login: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authLogin(login, password);
    navigate('/'); // Przekierowanie po zalogowaniu
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
