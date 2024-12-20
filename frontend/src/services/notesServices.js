import axios from 'axios';

const API_URL = 'http://localhost:1020';

export const fetchWelcomeMessage = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};
