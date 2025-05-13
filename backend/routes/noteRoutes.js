const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote,
    searchNotes,
    getRelatedNotes,
    shareNote,
    addCollaborator,
    removeCollaborator,
    getVersionHistory
} = require('../controllers/noteController');

// All routes require authentication
router.use(auth);

// Create a new note
router.post('/', createNote);

// Get all notes
router.get('/', getNotes);

// Search notes
router.get('/search', searchNotes);

// Get a single note
router.get('/:id', getNote);

// Update a note
router.patch('/:id', updateNote);

// Delete a note
router.delete('/:id', deleteNote);

// AI-enhanced features
router.get('/:id/related', getRelatedNotes);
router.get('/:id/history', getVersionHistory);

// Collaboration features
router.post('/:id/share', shareNote);
router.post('/:id/collaborators', addCollaborator);
router.delete('/:id/collaborators/:userId', removeCollaborator);

module.exports = router; 