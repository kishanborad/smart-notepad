// backend/routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// POST: Create a new note
router.post('/', async (req, res) => {
    const { title, content } = req.body;
  
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
  
    try {
      const newNote = new Note({
        title,
        content,
      });
  
      const savedNote = await newNote.save();
      res.status(201).json(savedNote);
    } catch (error) {
      res.status(500).json({ message: 'Error creating note' });
    }
  });

// GET: Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// GET: Get a single note by ID
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    console.error('Error fetching note:', err.message);
    res.status(500).json({ error: `Error fetching note by ID: ${err.message}` });
  }
});


// PUT: Update a note by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updatedNote) return res.status(404).json({ error: 'Note not found' });
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the note' });
  }
});

// DELETE: Delete a note by ID
router.delete('/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    console.log(`Received DELETE request for note ID: ${noteId}`); // Debugging log

    // Check if the note exists
    const note = await Note.findById(noteId);
    if (!note) {
      console.log(`Note with ID ${noteId} not found`); // Debugging log
      return res.status(404).json({ error: 'Note not found' });
    }

    // Delete the note
    console.log(`Deleting note with ID: ${noteId}`); // Debugging log
    await Note.findByIdAndDelete(noteId);

    console.log(`Note with ID ${noteId} successfully deleted`); // Debugging log
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error(`Error during DELETE request for note ID ${req.params.id}:`, err.message); // Debugging log
    res.status(500).json({ error: 'Failed to delete the note' });
  }
});

module.exports = router;
