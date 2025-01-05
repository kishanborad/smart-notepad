// NoteForm.js

import React, { useState } from 'react';
import { createNote } from '../Api'; // API utility for creating notes

const NoteForm = ({ onAddNote }) => {
  // State for handling form input
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Text'); // Default category
  const [tags, setTags] = useState(''); // Tags will be a comma-separated string
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for title and content
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    try {
      // Convert tags string to an array (split by commas)
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      // Create the note object with category and tags
      const newNote = {
        title,
        content,
        is_Deleted: false,
        category,      // Include category
        tags: tagsArray, // Include tags as an array
      };

      // Send new note data to the backend
      const createdNote = await createNote(newNote);

      // Add the newly created note to the parent component
      onAddNote(createdNote);

      // Reset form
      setTitle('');
      setContent('');
      setCategory('Text'); // Reset to default category
      setTags(''); // Reset tags
      setError('');
    } catch (error) {
      setError('Error creating note');
      console.error('Error creating note:', error);
    }
  };

  return (
    <div className="note-form">
      <h3>Add New Note</h3>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title"
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter note content"
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Text">Text</option>
            <option value="To-Do List">To-Do List</option>
            <option value="Meeting Notes">Meeting Notes</option>
            <option value="Idea">Idea</option>
            <option value="Code Snippets">Code Snippets</option>
            <option value="Checklist">Checklist</option>
          </select>
        </div>
        <div>
          <label htmlFor="tags">Tags (comma separated):</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags (e.g., Work, Personal)"
          />
        </div>
        <button type="submit">Add Note</button>
      </form>
    </div>
  );
};

export default NoteForm;
