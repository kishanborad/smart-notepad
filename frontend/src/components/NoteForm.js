// NoteForm.js

import React, { useState } from 'react';
import { createNote } from '../Api'; // API utility for creating notes

const NoteForm = ({ onAddNote }) => {
  // State for handling form input
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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
      const newNote = {
        title,
        content,
      };

      // Send new note data to the backend
      const createdNote = await createNote(newNote);

      // Add the newly created note to the parent component
      onAddNote(createdNote);

      // Reset form
      setTitle('');
      setContent('');
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
        <button type="submit">Add Note</button>
      </form>
    </div>
  );
};

export default NoteForm;
