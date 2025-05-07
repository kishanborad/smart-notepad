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
    enum: ['Text', 'To-Do List', 'Meeting Notes', 'Idea', 'Code Snippets', 'Checklist', 'Sketch'], // Limit to specific categories
    default: 'Text',  // Default category if not specified
  },
  tags: { 
    type: [String],   // Tags for classification (array of strings)
    default: [],      // Default to an empty array if no tags are provided
  },
  // New fields for smart features
  format: {
    type: String,
    enum: ['plain', 'rich', 'markdown'],
    default: 'plain',
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  metadata: {
    wordCount: Number,
    readingTime: Number,
    lastEditedBy: String,
    version: {
      type: Number,
      default: 1,
    },
  },
  linkedNotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }],
  reminders: [{
    date: Date,
    description: String,
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'audio', 'file', 'link']
    },
    url: String,
    name: String,
    size: Number
  }],
  aiMetadata: {
    autoTags: [String],
    sentiment: String,
    summary: String,
    keyPoints: [String],
    language: String
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted content
noteSchema.virtual('formattedContent').get(function() {
  if (this.format === 'markdown') {
    // Add markdown processing logic here
    return this.content;
  }
  return this.content;
});

// Pre-save middleware for smart features
noteSchema.pre('save', function(next) {
  // Calculate word count
  this.metadata.wordCount = this.content.split(/\s+/).length;
  
  // Calculate reading time (assuming 200 words per minute)
  this.metadata.readingTime = Math.ceil(this.metadata.wordCount / 200);
  
  // Auto-detect language (can be enhanced with NLP libraries)
  this.aiMetadata.language = 'en'; // Default to English
  
  // Increment version on content change
  if (this.isModified('content')) {
    this.metadata.version += 1;
  }
  
  next();
});

// Index for better search performance
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Create the model based on the schema
module.exports = mongoose.model('Note', noteSchema);  // Export the model so it can be used in controllers
