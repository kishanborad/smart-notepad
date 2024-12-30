// Api.js

import axios from 'axios';

// Base URL for the backend API
const BASE_URL = 'http://localhost:1020/api/notes'; // Adjust to your backend URL

// Get all notes
export const getNotes = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching notes: ' + error.message);
  }
};

// Get a single note by ID
export const getNoteById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching note by ID:', error.message);
    throw new Error(`Error fetching note by ID: ${error.message}`);
  }
};


// Create a new note
export const createNote = async (newNote) => {
  try {
    const response = await axios.post(BASE_URL, newNote);
    return response.data;
  } catch (error) {
    throw new Error('Error creating note: ' + error.message);
  }
};

// Update an existing note
export const updateNote = async (id, updatedNote) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, updatedNote);
    return response.data;
  } catch (error) {
    throw new Error('Error updating note: ' + error.message);
  }
};

// Delete a note
export const deleteNote = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    if (response.status === 200) {
      return response.data; // Return success message
    } else {
      throw new Error('Unexpected server response');
    }
  } catch (error) {
    console.error(`Failed to delete note with ID ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to delete the note');
  }
};



