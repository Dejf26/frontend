// src/components/StoryList.tsx
import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import { Story, getStories, createStory, updateStory, deleteStory } from '../api/storyService';
import { Project, getProjects } from '../api/projectService';
import { User, getUsers } from '../api/userService';
import NotificationService from '../api/notificationService';
import AuthContext from '../context/authContext';

Modal.setAppElement('#root');

const StoryList: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [stories, setStories] = useState<Story[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newStory, setNewStory] = useState<Omit<Story, '_id' | 'createdAt'>>({
    name: '',
    description: '',
    priority: 'low',
    project: '',
    status: 'todo',
    owner: ''
  });
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false);
  const [storyDetails, setStoryDetails] = useState<Story | null>(null);

  useEffect(() => {
    loadStories();
    loadProjects();
    loadUsers();
  }, []);

  const loadStories = async () => {
    try {
      const data = await getStories();
      setStories(data);
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStory.name || !newStory.description || !newStory.project || !newStory.owner) return;
    try {
      const createdStory = await createStory({ ...newStory, createdAt: new Date() });
      setStories([...stories, createdStory]);
      setNewStory({
        name: '',
        description: '',
        priority: 'low',
        project: '',
        status: 'todo',
        owner: ''
      });
      if (user && user._id === newStory.owner) {
        NotificationService.send({
          title: 'New Story Assigned',
          message: `A new story "${newStory.name}" has been assigned to you.`,
          date: new Date().toISOString(),
          priority: 'medium',
          read: false
        });
      }
    } catch (error) {
      console.error('Error creating story:', error);
    }
  };

  const handleUpdateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;
    try {
      const updatedStory = await updateStory(editingStory._id!, editingStory);
      const updatedStories = stories.map(story => (story._id === updatedStory._id ? updatedStory : story));
      setStories(updatedStories);
      setEditingStory(null);
      setModalIsOpen(false);
      if (user && user._id === editingStory.owner) {
        NotificationService.send({
          title: 'Story Updated',
          message: `The story "${editingStory.name}" assigned to you has been updated.`,
          date: new Date().toISOString(),
          priority: 'medium',
          read: false
        });
      }
    } catch (error) {
      console.error('Error updating story:', error);
    }
  };

  const handleDeleteStory = async (id: string) => {
    try {
      await deleteStory(id);
      const filteredStories = stories.filter(story => story._id !== id);
      setStories(filteredStories);
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  const openModal = (story: Story) => {
    setEditingStory(story);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingStory(null);
  };

  const openDetailsModal = (story: Story) => {
    setStoryDetails(story);
    setDetailsModalIsOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalIsOpen(false);
    setStoryDetails(null);
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleCreateStory} className="mb-4 bg-gray-200 p-4 border border-black rounded">
        <input
          type="text"
          placeholder="Story Name"
          value={newStory.name}
          onChange={(e) => setNewStory({ ...newStory, name: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Story Description"
          value={newStory.description}
          onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <select
          value={newStory.priority}
          onChange={(e) => setNewStory({ ...newStory, priority: e.target.value as 'low' | 'medium' | 'high' })}
          className="border p-2 mb-2 w-full"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={newStory.project}
          onChange={(e) => setNewStory({ ...newStory, project: e.target.value })}
          className="border p-2 mb-2 w-full"
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>{project.name}</option>
          ))}
        </select>
        <select
          value={newStory.status}
          onChange={(e) => setNewStory({ ...newStory, status: e.target.value as 'todo' | 'doing' | 'done' })}
          className="border p-2 mb-2 w-full"
        >
          <option value="todo">To Do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
        <select
          value={newStory.owner}
          onChange={(e) => setNewStory({ ...newStory, owner: e.target.value })}
          className="border p-2 mb-2 w-full"
        >
          <option value="">Select Owner</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>{user.firstName}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Story</button>
      </form>

      <div className="kanban-board grid grid-cols-3 gap-4">
        {['todo', 'doing', 'done'].map(status => (
          <div key={status} className="kanban-column bg-gray-300 p-4 rounded">
            <h2 className="text-xl mb-4">{status.toUpperCase()}</h2>
            {stories.filter(story => story.status === status).map((story) => (
              <div key={story._id} className="border p-2 mb-2 bg-gray-200">
                <strong>{story.name}</strong>: {story.description} ({story.priority})
                <button onClick={() => openModal(story)} className="bg-yellow-500 text-white p-2 ml-2 rounded">Edit</button>
                <button onClick={() => openDetailsModal(story)} className="bg-blue-500 text-white p-2 ml-2 rounded">Details</button>
                <button onClick={() => story._id && handleDeleteStory(story._id)} className="bg-red-500 text-white p-2 ml-2 rounded">Delete</button>
                </div>
            ))}
          </div>
        ))}
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        {editingStory && (
          <form onSubmit={handleUpdateStory} className="bg-gray-200 p-4 border border-black rounded">
            <input
              type="text"
              placeholder="Story Name"
              value={editingStory.name}
              onChange={(e) => setEditingStory({ ...editingStory, name: e.target.value })}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Story Description"
              value={editingStory.description}
              onChange={(e) => setEditingStory({ ...editingStory, description: e.target.value })}
              className="border p-2 mb-2 w-full"
            />
            <select
              value={editingStory.priority}
              onChange={(e) => setEditingStory({ ...editingStory, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="border p-2 mb-2 w-full"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              value={editingStory.project}
              onChange={(e) => setEditingStory({ ...editingStory, project: e.target.value })}
              className="border p-2 mb-2 w-full"
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))}
            </select>
            <select
              value={editingStory.status}
              onChange={(e) => setEditingStory({ ...editingStory, status: e.target.value as 'todo' | 'doing' | 'done' })}
              className="border p-2 mb-2 w-full"
            >
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
            <select
              value={editingStory.owner}
              onChange={(e) => setEditingStory({ ...editingStory, owner: e.target.value })}
              className="border p-2 mb-2 w-full"
            >
              <option value="">Select Owner</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>{user.firstName}</option>
              ))}
            </select>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Update Story</button>
          </form>
        )}
      </Modal>

      <Modal isOpen={detailsModalIsOpen} onRequestClose={closeDetailsModal} className="modal">
        {storyDetails && (
          <div className="bg-gray-200 p-4 border border-black rounded">
            <h2 className="text-xl mb-4">Story Details</h2>
            <p><strong>Name:</strong> {storyDetails.name}</p>
            <p><strong>Description:</strong> {storyDetails.description}</p>
            <p><strong>Priority:</strong> {storyDetails.priority}</p>
            <p><strong>Project:</strong> {projects.find(project => project._id === storyDetails.project)?.name}</p>
            <p><strong>Status:</strong> {storyDetails.status}</p>
            <p><strong>Owner:</strong> {users.find(user => user._id === storyDetails.owner)?.firstName}</p>
            <p><strong>Created At:</strong> {new Date(storyDetails.createdAt).toLocaleString()}</p>
            <button onClick={closeDetailsModal} className="bg-blue-500 text-white p-2 rounded mt-4">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StoryList;
