// backend/controller/noteController.js
const Note = require('../models/Note');

// Get all notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find(); // Retrieve all notes from the database
    res.status(200).json(notes); // Send the notes as JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving notes' }); // Handle errors
  }
};

// Get a single note by ID
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id); // Find note by ID
    if (!note) {
      return res.status(404).json({ message: 'Note not found' }); // Return 404 if note is not found
    }
    res.status(200).json(note); // Send the note as JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving note' }); // Handle errors
  }
};

// Create a new note
const createNote = async (req, res) => {
  try {
    const newNote = new Note({
      title: req.body.title, // Set title from the request body
      content: req.body.content, // Set content from the request body
    });
    const savedNote = await newNote.save(); // Save the new note to the database
    res.status(201).json(savedNote); // Send the saved note as JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error creating note' }); // Handle errors
  }
};

// Update an existing note
const updateNote = async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content }, // Update title and content
      { new: true } // Return the updated note
    );
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' }); // Return 404 if note is not found
    }
    res.status(200).json(updatedNote); // Send the updated note as JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error updating note' }); // Handle errors
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id); // Delete the note by ID
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' }); // Return 404 if note is not found
    }
    res.status(200).json({ message: 'Note deleted successfully' }); // Confirm deletion
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note' }); // Handle errors
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
