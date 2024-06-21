import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Project, getProjects, createProject, updateProject, deleteProject, setActiveProject, getActiveProject } from '../api/projectService';

Modal.setAppElement('#root');

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({ name: '', description: '' });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
    loadActiveProject();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadActiveProject = async () => {
    try {
      const activeProject = await getActiveProject();
      setActiveProjectId(activeProject._id!);
    } catch (error) {
      console.error('Error loading active project:', error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.description) return;
    try {
      await createProject(newProject);
      setNewProject({ name: '', description: '' });
      loadProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      await updateProject(editingProject._id!, editingProject);
      setEditingProject(null);
      setModalIsOpen(false);
      loadProjects();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleSetActiveProject = async (id: string) => {
    try {
      await setActiveProject(id);
      setActiveProjectId(id);
    } catch (error) {
      console.error('Error setting active project:', error);
    }
  };

  const openModal = (project: Project) => {
    setEditingProject(project);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleCreateProject} className="mb-4 bg-gray-200 p-4 border border-black rounded">
        <input
          type="text"
          placeholder="Project Name"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Project Description"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Project</button>
      </form>

      <ul>
        {projects.map((project) => (
          <li key={project._id} className="border p-2 mb-2 bg-gray-200">
            <strong>{project.name}</strong>: {project.description}
            <button onClick={() => openModal(project)} className="bg-yellow-500 text-white p-2 ml-2 rounded">Edit</button>
            <button onClick={() => handleDeleteProject(project._id!)} className="bg-red-500 text-white p-2 ml-2 rounded">Delete</button>
            <button onClick={() => handleSetActiveProject(project._id!)} className={`p-2 ml-2 rounded ${activeProjectId === project._id ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
              {activeProjectId === project._id ? 'Selected' : 'Select'}
            </button>
          </li>
        ))}
      </ul>

      {editingProject && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Edit Project"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl mb-4">Edit Project</h2>
            <form onSubmit={handleUpdateProject} className="mb-4">
              <input
                type="text"
                placeholder="Project Name"
                value={editingProject.name}
                onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                className="border p-2 mb-2 w-full"
              />
              <input
                type="text"
                placeholder="Project Description"
                value={editingProject.description}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                className="border p-2 mb-2 w-full"
              />
              <button type="submit" className="bg-green-500 text-white p-2 rounded">Save Changes</button>
              <button type="button" onClick={closeModal} className="bg-gray-500 text-white p-2 ml-2 rounded">Cancel</button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProjectList;
