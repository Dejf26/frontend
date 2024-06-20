import axios from 'axios';

const API_URL = 'http://localhost:5000/projects';

export interface Project {
  _id?: string;
  name: string;
  description: string;
}

export const getProjects = async () => {
  try {
    const response = await axios.get<Project[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
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
