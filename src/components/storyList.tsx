// src/components/StoryList.tsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Story, getStories, createStory, updateStory, deleteStory } from '../api/storyService';

Modal.setAppElement('#root');

const StoryList: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
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

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const data = await getStories();
      setStories(data);
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStory.name || !newStory.description || !newStory.project || !newStory.owner) return;
    try {
      await createStory({ ...newStory, createdAt: new Date() });
      setNewStory({
        name: '',
        description: '',
        priority: 'low',
        project: '',
        status: 'todo',
        owner: ''
      });
      loadStories();
    } catch (error) {
      console.error('Error creating story:', error);
    }
  };

  const handleUpdateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;
    try {
      await updateStory(editingStory._id!, editingStory);
      setEditingStory(null);
      setModalIsOpen(false);
      loadStories();
    } catch (error) {
      console.error('Error updating story:', error);
    }
  };

  const handleDeleteStory = async (id: string) => {
    try {
      await deleteStory(id);
      loadStories();
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
        <input
          type="text"
          placeholder="Project ID"
          value={newStory.project}
          onChange={(e) => setNewStory({ ...newStory, project: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <select
          value={newStory.status}
          onChange={(e) => setNewStory({ ...newStory, status: e.target.value as 'todo' | 'doing' | 'done' })}
          className="border p-2 mb-2 w-full"
        >
          <option value="todo">To Do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
        <input
          type="text"
          placeholder="Owner ID"
          value={newStory.owner}
          onChange={(e) => setNewStory({ ...newStory, owner: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Story</button>
      </form>

      <ul>
        {stories.map((story) => (
          <li key={story._id} className="border p-2 mb-2 bg-gray-200">
            <strong>{story.name}</strong>: {story.description} ({story.priority}) - {story.status}
            <button onClick={() => openModal(story)} className="bg-yellow-500 text-white p-2 ml-2 rounded">Edit</button>
            <button onClick={() => handleDeleteStory(story._id!)} className="bg-red-500 text-white p-2 ml-2 rounded">Delete</button>
          </li>
        ))}
      </ul>

      {editingStory && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Edit Story"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl mb-4">Edit Story</h2>
            <form onSubmit={handleUpdateStory} className="mb-4">
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
              <input
                type="text"
                placeholder="Project ID"
                value={editingStory.project}
                onChange={(e) => setEditingStory({ ...editingStory, project: e.target.value })}
                className="border p-2 mb-2 w-full"
              />
              <select
                value={editingStory.status}
                onChange={(e) => setEditingStory({ ...editingStory, status: e.target.value as 'todo' | 'doing' | 'done' })}
                className="border p-2 mb-2 w-full"
              >
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select>
              <input
                type="text"
                placeholder="Owner ID"
                value={editingStory.owner}
                onChange={(e) => setEditingStory({ ...editingStory, owner: e.target.value })}
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

export default StoryList;
