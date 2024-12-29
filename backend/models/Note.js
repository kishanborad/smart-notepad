// backend/models/Notes.js
const mongoose = require('mongoose');

// Define the schema for notes
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Title is required
    trim: true,
  },
  content: {
    type: String,
    required: true, // Content is required
    trim: true,
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Create the model based on the schema
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;  // Export the model for use in controllers
