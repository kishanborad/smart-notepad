// backend/models/Note.js

const mongoose = require('mongoose');  // Import mongoose to interact with MongoDB

// Define the schema for notes
const noteSchema = new mongoose.Schema({
  title: {
    type: String,     // Define the field type as String
    required: true,   // Title is required when creating a new note
  },
  content: {
    type: String,     // Define the field type as String
    required: true,   // Content is required when creating a new note
  },
  is_Deleted: { 
    type: Boolean, 
    default: false,
  }, // Add the soft delete flag
  category: {
    type: String,     // Category of the note (e.g., To-Do, Idea, etc.)
    enum: ['Text', 'To-Do List', 'Meeting Notes', 'Idea', 'Code Snippets', 'Checklist'], // Limit to specific categories
    default: 'Text',  // Default category if not specified
  },
  tags: { 
    type: [String],   // Tags for classification (array of strings)
    default: [],      // Default to an empty array if no tags are provided
  },
}, { timestamps: true });  // Automatically add 'createdAt' and 'updatedAt' fields

// Create the model based on the schema
module.exports = mongoose.model('Note', noteSchema);  // Export the model so it can be used in controllers
