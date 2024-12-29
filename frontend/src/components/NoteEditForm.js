// NoteEditForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // To navigate and get note ID from URL
import { getNoteById, updateNote } from '../Api'; // API utilities for fetching and updating notes

const NoteEditForm = () => {
  const { noteId } = useParams(); // Get the note ID from URL parameters
  const history = useNavigate(); // To redirect after the note is updated

  // State for handling form input and loading state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch the note details when the component mounts
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const note = await getNoteById(noteId);
        setTitle(note.title);
        setContent(note.content);
        setLoading(false);
      } catch (error) {
        setError('Error fetching note details');
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for title and content
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    try {
      const updatedNote = {
        title,
        content,
      };

      // Send updated note data to the backend
      await updateNote(noteId, updatedNote);

      // Redirect to the note list page after updating the note
      history.push('/');
    } catch (error) {
      setError('Error updating note');
      console.error('Error updating note:', error);
    }
  };

  return (
    <div className="note-edit-form">
      <h3>Edit Note</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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
            <button type="submit">Update Note</button>
          </form>
        </>
      )}
    </div>
  );
};

export default NoteEditForm;
