// Api.js

import axios from 'axios';

// Base URL for the backend API
const BASE_URL = 'http://localhost:1020/api/notes'; // Adjust to match your backend URL

/**
 * Fetch all notes from the backend API
 * @returns {Promise<Array>} List of all notes
 * @throws {Error} Throws an error if fetching fails
 */
export const getNotes = async () => {
  try {
    const response = await axios.get(BASE_URL); // Send a GET request to fetch all notes
    return response.data; // Return the notes data
  } catch (error) {
    throw new Error('Error fetching notes: ' + error.message); // Handle any errors during the request
  }
};

/**
 * Fetch a single note by its ID
 * @param {string} id - The ID of the note to fetch
 * @returns {Promise<Object>} The note object
 * @throws {Error} Throws an error if fetching fails
 */
export const getNoteById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`); // Send a GET request to fetch a note by ID
    return response.data; // Return the note data
  } catch (error) {
    console.error('Error fetching note by ID:', error.message); // Log the error for debugging
    throw new Error(`Error fetching note by ID: ${error.message}`); // Handle any errors during the request
  }
};

/**
 * Create a new note
 * @param {Object} newNote - The new note data (title, content, category, tags)
 * @returns {Promise<Object>} The created note object
 * @throws {Error} Throws an error if creation fails
 */
export const createNote = async (newNote) => {
  try {
    const response = await axios.post(BASE_URL, {...newNote, is_Deleted: false}); // Send a POST request to create a new note
    return response.data; // Return the created note data
  } catch (error) {
    throw new Error('Error creating note: ' + error.message); // Handle any errors during the request
  }
};

/**
 * Update an existing note by its ID
 * @param {string} id - The ID of the note to update
 * @param {Object} updatedNote - The updated note data (title, content, category, tags)
 * @returns {Promise<Object>} The updated note object
 * @throws {Error} Throws an error if the update fails
 */
export const updateNote = async (id, updatedNote) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, updatedNote); // Send a PUT request to update the note
    return response.data; // Return the updated note data
  } catch (error) {
    throw new Error('Error updating note: ' + error.message); // Handle any errors during the request
  }
};

/**
 * Delete a note by its ID (soft delete by marking is_Deleted as true)
 * @param {string} id - The ID of the note to delete
 * @returns {Promise<Object>} Success message from the backend
 * @throws {Error} Throws an error if deletion fails
 */
export const deleteNote = async (id) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, { is_Deleted: true }); // Send a PUT request to soft delete the note
    if (response.status === 200) {
      return response.data; // Return success message if the deletion is successful
    } else {
      throw new Error('Unexpected server response'); // Handle unexpected server responses
    }
  } catch (error) {
    console.error(`Failed to delete note with ID ${id}:`, error.response?.data || error.message); // Log the error for debugging
    throw new Error(error.response?.data?.error || 'Failed to delete the note'); // Provide a detailed error message
  }
};
