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
    return <div>No active project selected</div>;
  }

  return (
    <div className="border p-4 mb-4">
      <h2>Active Project</h2>
      <p><strong>ID:</strong> {activeProject._id}</p>
      <p><strong>Name:</strong> {activeProject.name}</p>
      <p><strong>Description:</strong> {activeProject.description}</p>
    </div>
  );
};

export default ActiveProject;
