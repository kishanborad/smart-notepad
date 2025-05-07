// backend/controllers/noteController.js
const Note = require('../models/Note');
const smartNoteService = require('../services/smartNoteService');

// Get all notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ is_Deleted: false })
      .sort({ isPinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single note by ID
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new note
const createNote = async (req, res) => {
  try {
    let note = new Note(req.body);
    
    // Apply smart features
    note = await smartNoteService.analyzeNote(note);
    
    // Format content based on type
    note.content = smartNoteService.formatContent(note.content, note.category);
    
    // Save the note
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing note
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Update note fields
    Object.assign(note, req.body);
    
    // Re-analyze with smart features
    note = await smartNoteService.analyzeNote(note);
    
    // Re-format content
    note.content = smartNoteService.formatContent(note.content, note.category);
    
    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    note.is_Deleted = true;
    await note.save();
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search notes
const searchNotes = async (req, res) => {
  try {
    const { query, category, tags, startDate, endDate } = req.query;
    
    let searchQuery = { is_Deleted: false };
    
    // Text search
    if (query) {
      searchQuery.$text = { $search: query };
    }
    
    // Category filter
    if (category) {
      searchQuery.category = category;
    }
    
    // Tags filter
    if (tags) {
      const tagArray = tags.split(',');
      searchQuery.tags = { $in: tagArray };
    }
    
    // Date range filter
    if (startDate || endDate) {
      searchQuery.createdAt = {};
      if (startDate) searchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) searchQuery.createdAt.$lte = new Date(endDate);
    }
    
    const notes = await Note.find(searchQuery)
      .sort({ score: { $meta: "textScore" } })
      .sort({ isPinned: -1, createdAt: -1 });
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get note analytics
const getNoteAnalytics = async (req, res) => {
  try {
    const analytics = await Note.aggregate([
      { $match: { is_Deleted: false } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgWordCount: { $avg: '$metadata.wordCount' }
        }
      }
    ]);
    
    const tagStats = await Note.aggregate([
      { $match: { is_Deleted: false } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      categoryStats: analytics,
      popularTags: tagStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  getNoteAnalytics,
};
