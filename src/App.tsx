import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProjectList from './components/ProjectList';
import ActiveProject from './components/ActiveProject';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<ProjectList />} />
            <Route path="/active" element={<ActiveProject />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
