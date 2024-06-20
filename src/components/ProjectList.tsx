import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Project, getProjects, createProject, updateProject, deleteProject } from '../api/projectService';
import '../style/projects.css';


Modal.setAppElement('#root');

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({ name: '', description: '' });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
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

  const openModal = (project: Project) => {
    setEditingProject(project);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingProject(null);
  };

  return (
    <div>
      <form onSubmit={handleCreateProject} className="mb-4">
        <input
          type="text"
          placeholder="Project Name"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Project Description"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Add Project</button>
      </form>

      <ul>
        {projects.map((project) => (
          <li key={project._id} className="border p-2 mb-2">
            <strong>{project.name}</strong>: {project.description}
            <button onClick={() => openModal(project)} className="bg-yellow-500 text-white p-2 ml-2">Edit</button>
            <button onClick={() => handleDeleteProject(project._id!)} className="bg-red-500 text-white p-2 ml-2">Delete</button>
          </li>
        ))}
      </ul>

      {editingProject && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Edit Project"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <h2>Edit Project</h2>
          <form onSubmit={handleUpdateProject} className="mb-4">
            <input
              type="text"
              placeholder="Project Name"
              value={editingProject.name}
              onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
              className="border p-2 mr-2"
            />
            <input
              type="text"
              placeholder="Project Description"
              value={editingProject.description}
              onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
              className="border p-2 mr-2"
            />
            <button type="submit" className="bg-green-500 text-white p-2">Save Changes</button>
            <button type="button" onClick={closeModal} className="bg-gray-500 text-white p-2 ml-2">Cancel</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ProjectList;
