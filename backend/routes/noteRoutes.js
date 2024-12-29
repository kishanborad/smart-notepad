// backend/routes/noteRoutes.js
const express = require('express');
const Note = require('../models/Note');

const router = express.Router();

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
router.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// GET: Get a single note by ID
router.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the note' });
  }
});

// PUT: Update a note by ID
router.put('/notes/:id', async (req, res) => {
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
router.delete('/notes/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ error: 'Note not found' });
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the note' });
  }
});

module.exports = router;
