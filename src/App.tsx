import React from 'react';
import ProjectList from './components/ProjectList';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>ManagMe App</h1>
      <ProjectList />
    </div>
  );
};

export default App;
