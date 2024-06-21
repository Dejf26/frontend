import React, { useState, useEffect } from 'react';
import { Project, getActiveProject } from '../api/projectService';

const ActiveProject: React.FC = () => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    loadActiveProject();
  }, []);

  const loadActiveProject = async () => {
    try {
      const project = await getActiveProject();
      setActiveProject(project);
    } catch (error) {
      console.error('Error loading active project:', error);
    }
  };

  if (!activeProject) {
    return <div className="text-center text-gray-500">No active project selected</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-500">Active Project</h2>
      <p className="mb-2"><strong>ID:</strong> {activeProject._id}</p>
      <p className="mb-2"><strong>Name:</strong> {activeProject.name}</p>
      <p className="mb-2"><strong>Description:</strong> {activeProject.description}</p>
    </div>
  );
};

export default ActiveProject;
