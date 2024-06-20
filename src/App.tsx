import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProjectList from './components/ProjectList';
import ActiveProject from './components/ActiveProject';
import Login from './components/Login';
import { AuthProvider } from './context/authContext';
import AuthContext from './context/authContext';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { token } = useContext(AuthContext);
  return token ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <div className="p-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<PrivateRoute element={<ProjectList />} />} />
              <Route path="/active" element={<PrivateRoute element={<ActiveProject />} />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
