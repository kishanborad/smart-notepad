// backend/models/Note.js

const mongoose = require('mongoose');  // Import mongoose to interact with MongoDB

// Define the schema for notes
const NoteSchema = new mongoose.Schema({
  title: {
    type: String,     // Define the field type as String
    required: true,   // Title is required when creating a new note
  },
  content: {
    type: String,     // Define the field type as String
    required: true,   // Content is required when creating a new note
  },
}, { timestamps: true });  // Automatically add 'createdAt' and 'updatedAt' fields

// Create the model based on the schema
module.exports = mongoose.model('Note', NoteSchema);  // Export the model so it can be used in controllers
