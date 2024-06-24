import axios from 'axios';

const API_URL = 'http://localhost:5000/projects';
const ACTIVE_PROJECT_URL = 'http://localhost:5000/activeProject';

export interface Project {
  _id?: string;
  name: string;
  description: string;
  tags?: string[];
  status?: 'active' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export const getProjects = async (filter?: { tags?: string[], status?: 'active' | 'archived' }) => {
  try {
    const response = await axios.get<Project[]>(API_URL, { params: filter });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const getProjectById = async (id: string) => {
  try {
    const response = await axios.get<Project>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    throw error;
  }
};

export const createProject = async (project: Project) => {
  try {
    const response = await axios.post<Project>(API_URL, project);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (id: string, project: Project) => {
  try {
    const response = await axios.put<Project>(`${API_URL}/${id}`, project);
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

export const setActiveProject = async (id: string) => {
  try {
    const response = await axios.post(ACTIVE_PROJECT_URL, { id });
    return response.data;
  } catch (error) {
    console.error('Error setting active project:', error);
    throw error;
  }
};

export const getActiveProject = async () => {
  try {
    const response = await axios.get<Project>(ACTIVE_PROJECT_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching active project:', error);
    throw error;
  }
};

