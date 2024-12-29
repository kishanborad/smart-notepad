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
export const getNoteById = async (noteId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${noteId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching note by ID: ' + error.message);
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
export const updateNote = async (noteId, updatedNote) => {
  try {
    const response = await axios.put(`${BASE_URL}/${noteId}`, updatedNote);
    return response.data;
  } catch (error) {
    throw new Error('Error updating note: ' + error.message);
  }
};

// Delete a note
export const deleteNote = async (noteId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${noteId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error deleting note: ' + error.message);
  }
};
