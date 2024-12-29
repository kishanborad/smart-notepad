// backend/models/Notes.js

const mongoose = require('mongoose');

// Define the schema for notes
const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Title is required
  },
  content: {
    type: String,
    required: true, // Content is required
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Create the model based on the schema
module.exports = mongoose.model('Note', NoteSchema);  // Export the model for use in controllers