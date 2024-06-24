import axios from 'axios';

const API_URL = 'http://localhost:5000/tasks';

export interface Task {
  _id?: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  story: string;
  estimatedHours: string;
  status: 'todo' | 'doing' | 'done';
  createdAt: Date;
  startDate?: Date;
  endDate?: Date;
  assignedUser?: string;
}

export const getTasks = async () => {
  try {
    const response = await axios.get<Task[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (task: Task) => {
  try {
    const response = await axios.post<Task>(API_URL, task);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (id: string, task: Partial<Task>) => {
  try {
    const response = await axios.put<Task>(`${API_URL}/${id}`, task);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
