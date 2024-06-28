import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import { Task, getTasks, createTask, updateTask, deleteTask } from '../api/taskService';
import { User, getUsers } from '../api/userService';
import { Story, getStories } from '../api/storyService';
import AuthContext from '../context/authContext';
import NotificationService from '../api/notificationService';

Modal.setAppElement('#root');

const TaskList: React.FC = () => {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [newTask, setNewTask] = useState<Omit<Task, '_id' | 'createdAt' | 'status' | 'startDate'>>({
    name: '',
    description: '',
    priority: 'low',
    estimatedHours: '',
    assignedUser: '',
    story: ''
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
    loadUsers();
    loadStories();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
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

  const loadStories = async () => {
    try {
      const data = await getStories();
      setStories(data);
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.name || !newTask.description || !newTask.estimatedHours) return;
    try {
      const createdTask = await createTask({ ...newTask, createdAt: new Date(), status: 'todo' });
      setTasks([...tasks, createdTask]);
      setNewTask({
        name: '',
        description: '',
        priority: 'low',
        estimatedHours: '',
        assignedUser: '',
        story: ''
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      const updatedTask = await updateTask(editingTask._id!, editingTask);
      const updatedTasks = tasks.map(task => (task._id === updatedTask._id ? updatedTask : task));
      setTasks(updatedTasks);
      setEditingTask(null);
      setModalIsOpen(false);
  
      if (user && user._id === editingTask.assignedUser) {
        NotificationService.send({
          title: 'Task Updated',
          message: `The task "${editingTask.name}" has been assigned to you.`,
          date: new Date().toISOString(),
          priority: 'medium',
          read: false
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      const filteredTasks = tasks.filter(task => task._id !== id);
      setTasks(filteredTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const openModal = (task: Task) => {
    setEditingTask(task);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingTask(null);
  };

  const openDetailsModal = (task: Task) => {
    setTaskDetails(task);
    setDetailsModalIsOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalIsOpen(false);
    setTaskDetails(null);
  };

  const markAsDone = () => {
    if (editingTask) {
      const updatedTask: Task = {
        ...editingTask,
        status: 'done',
        endDate: new Date()
      };
      setEditingTask(updatedTask);
      handleUpdateTask(new Event('') as unknown as React.FormEvent);
    }
  };

  const handleAssignedUserChange = (userId: string) => {
    if (editingTask) {
      const updatedTask: Task = {
        ...editingTask,
        assignedUser: userId,
        status: 'doing',
        startDate: new Date()
      };
      setEditingTask(updatedTask);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleCreateTask} className="mb-4 bg-gray-200 p-4 border border-black rounded">
        <input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
          className="border p-2 mb-2 w-full"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="number"
          placeholder="Estimated Hours"
          value={newTask.estimatedHours}
          onChange={(e) => setNewTask({ ...newTask, estimatedHours: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <select
          value={newTask.story}
          onChange={(e) => setNewTask({ ...newTask, story: e.target.value })}
          className="border p-2 mb-2 w-full"
        >
          <option value="">Select Story</option>
          {stories.map((story) => (
            <option key={story._id} value={story._id}>{story.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Task</button>
      </form>

      <div className="kanban-board grid grid-cols-3 gap-4">
        {['todo', 'doing', 'done'].map(status => (
          <div key={status} className="kanban-column bg-gray-300 p-4 rounded">
            <h2 className="text-xl mb-4">{status.toUpperCase()}</h2>
            {tasks.filter(task => task.status === status).map((task) => (
              <div key={task._id} className="border p-2 mb-2 bg-gray-200">
                <strong>{task.name}</strong>: {task.description} ({task.priority})
                <button onClick={() => openModal(task)} className="bg-yellow-500 text-white p-2 ml-2 rounded">Edit</button>
                <button onClick={() => openDetailsModal(task)} className="bg-blue-500 text-white p-2 ml-2 rounded">Details</button>
                <button onClick={() => handleDeleteTask(task._id!)} className="bg-red-500 text-white p-2 ml-2 rounded">Delete</button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {editingTask && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Edit Task"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 relative">
            <h2 className="text-2xl mb-4">Edit Task</h2>
            <form onSubmit={handleUpdateTask}>
              <input
                type="text"
                value={editingTask.name}
                onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                className="border p-2 mb-2 w-full"
              />
              <input
                type="text"
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                className="border p-2 mb-2 w-full"
              />
              <select
                value={editingTask.priority}
                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="border p-2 mb-2 w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input
                type="number"
                value={editingTask.estimatedHours}
                onChange={(e) => setEditingTask({ ...editingTask, estimatedHours: e.target.value })}
                className="border p-2 mb-2 w-full"
              />
              <select
                value={editingTask.assignedUser}
                onChange={(e) => handleAssignedUserChange(e.target.value)}
                className="border p-2 mb-2 w-full"
              >
                <option value="">Assign User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>{user.firstName}</option>
                ))}
              </select>
              <select
                value={editingTask.story}
                onChange={(e) => setEditingTask({ ...editingTask, story: e.target.value })}
                className="border p-2 mb-2 w-full"
              >
                <option value="">Select Story</option>
                {stories.map((story) => (
                  <option key={story._id} value={story._id}>{story.name}</option>
                ))}
              </select>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">Update Task</button>
              <button onClick={markAsDone} className="bg-green-500 text-white p-2 ml-2 rounded">Mark as Done</button>
            </form>
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">X</button>
          </div>
        </Modal>
      )}

      {taskDetails && (
        <Modal
          isOpen={detailsModalIsOpen}
          onRequestClose={closeDetailsModal}
          contentLabel="Task Details"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 relative">
            <h2 className="text-2xl mb-4">{taskDetails.name} Details</h2>
            <p><strong>Description:</strong> {taskDetails.description}</p>
            <p><strong>Priority:</strong> {taskDetails.priority}</p>
            <p><strong>Estimated Hours:</strong> {taskDetails.estimatedHours}</p>
            <p><strong>Assigned User:</strong> {users.find(user => user._id === taskDetails.assignedUser)?.firstName || 'Unassigned'}</p>
            <p><strong>Story:</strong> {stories.find(story => story._id === taskDetails.story)?.name || 'No Story'}</p>
            <p><strong>Created At:</strong> {new Date(taskDetails.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> {taskDetails.status}</p>
            <p><strong>Start Date:</strong> {taskDetails.startDate ? new Date(taskDetails.startDate).toLocaleString() : 'Not Started'}</p>
            <p><strong>End Date:</strong> {taskDetails.endDate ? new Date(taskDetails.endDate).toLocaleString() : 'Not Finished'}</p>
            <button onClick={closeDetailsModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">X</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TaskList;
