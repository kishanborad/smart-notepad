// backend/routes/noteRoutes.js

const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// POST: Create a new note
router.post('/', async (req, res) => {
  const { title, content } = req.body; // Extract title and content from the request body

  // Validate input: Ensure title and content are provided
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    // Create a new note with the provided title and content
    const newNote = new Note({ 
      title, 
      content, 
      is_Deleted: false, 
    });
    
    console.log('Before saving note:', newNote);
    // Save the new note to the database
    const savedNote = await newNote.save();

    console.log('Saved note:', savedNote); // Verify is_Deleted field
    // Respond with the saved note and status 201 (Created)
    res.status(201).json(savedNote);
  } catch (error) {
    // Log the error and respond with a 500 status (Internal Server Error)
    console.error('Error creating note:', error.message);
    res.status(500).json({ message: 'Error creating note' });
  }
});

// GET: Retrieve all notes
router.get('/', async (req, res) => {
  try {
    // Fetch all notes from the database
    const notes = await Note.find({ is_Deleted: false });

    // Respond with the list of notes
    res.json(notes);
  } catch (error) {
    // Log the error and respond with a 500 status
    console.error('Error fetching notes:', error.message);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// GET: Retrieve a single note by its ID
router.get('/:id', async (req, res) => {
  const noteId = req.params.id; // Extract the note ID from the route parameter

  // Validate the note ID: Check if it's undefined or invalid
  if (!noteId || noteId === 'undefined') {
    return res.status(400).json({ error: 'Invalid or undefined note ID' });
  }

  try {
    // Attempt to find the note by ID and ensure it is not marked as deleted
    const note = await Note.findOne({ _id: noteId, is_Deleted: false });

    // If the note is not found, return a 404 status
    if (!note) {
      return res.status(404).json({ error: 'Note not found or has been deleted' });
    }

    // Respond with the found note
    res.json(note);
  } catch (error) {
    // Log the error and respond with a 500 status
    console.error(`Error fetching note with ID ${noteId}:`, error.message);
    res.status(500).json({ error: `Error fetching note by ID: ${error.message}` });
  }
});

// PUT: Update a note by its ID
router.put('/:id', async (req, res) => {
  const { title, content, is_Deleted } = req.body; // Extract title and content from the request body
  const noteId = req.params.id; // Extract the note ID from the route parameter

  // Validate input: Ensure title and content are provided
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  // Validate the note ID
  if (!noteId || noteId === 'undefined') {
    return res.status(400).json({ error: 'Invalid or undefined note ID' });
  }

  try {
    // Attempt to find and update the note by its ID
    const updatedNote = await Note.findByIdAndUpdate(
      noteId, // Note ID to update
      { title, content, is_Deleted }, // New data to update
      { new: true } // Return the updated document
    );

    // If the note is not found, return a 404 status
    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Respond with the updated note
    res.status(200).json(updatedNote);
  } catch (error) {
    // Log the error and respond with a 500 status
    console.error(`Error updating note with ID ${noteId}:`, error.message);
    res.status(500).json({ error: 'Failed to update the note' });
  }
});

// DELETE: Delete a note by its ID
// DELETE: Mark note as deleted
router.delete('/:id', async (req, res) => {
  try {
      const noteId = req.params.id;
      console.log(`Received DELETE request for note ID: ${noteId}`);

      // Check if the note exists
      const note = await Note.findById(noteId);
      if (!note) {
          console.log(`Note with ID ${noteId} not found`);
          return res.status(404).json({ error: 'Note not found' });
      }

      // Mark the note as deleted
      note.is_Deleted = true;
      await note.save();

      console.log(`Note with ID ${noteId} successfully marked as deleted`);
      res.status(200).json({ message: 'Note marked as deleted' });
  } catch (err) {
      console.error(`Error during DELETE request for note ID ${req.params.id}:`, err.message);
      res.status(500).json({ error: 'Failed to delete the note' });
  }
});


module.exports = router;
