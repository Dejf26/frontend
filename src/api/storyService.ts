// src/api/storyService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/stories';

export interface Story {
  _id?: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  project: string;
  createdAt: Date;
  status: 'todo' | 'doing' | 'done';
  owner: string;
}

export const getStories = async () => {
  try {
    const response = await axios.get<Story[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
};

export const createStory = async (story: Story) => {
  try {
    const response = await axios.post<Story>(API_URL, story);
    return response.data;
  } catch (error) {
    console.error('Error creating story:', error);
    throw error;
  }
};

export const updateStory = async (id: string, story: Story) => {
  try {
    const response = await axios.put<Story>(`${API_URL}/${id}`, story);
    return response.data;
  } catch (error) {
    console.error('Error updating story:', error);
    throw error;
  }
};

export const deleteStory = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting story:', error);
    throw error;
  }
};
