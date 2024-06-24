import axios from 'axios';

const API_URL = 'http://localhost:5000/users';

export interface User {
  _id: string;
  firstName: string;
}

export const getUsers = async () => {
  try {
    const response = await axios.get<User[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
