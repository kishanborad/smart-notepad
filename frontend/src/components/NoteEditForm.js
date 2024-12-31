import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // To navigate and get note ID from URL
import { getNoteById, updateNote } from '../Api'; // API utilities for fetching and updating notes

const NoteEditForm = ({ onNoteUpdated }) => {
  const { id } = useParams(); // Get the note ID from URL parameters
  const navigate = useNavigate(); // To redirect after the note is updated

  // State for handling form input and loading state
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the note details when the component mounts
  useEffect(() => {
    const fetchNote = async () => {
      if (!id) {
        console.error('Note ID is undefined. Aborting fetch.');
        setError('Invalid note ID');
        setLoading(false);
        return;
      }

      try {
        const note = await getNoteById(id); // Fetch the note by ID
        setTitle(note.title);
        setContent(note.content);
      } catch (error) {
        setError('Error fetching note details');
        console.error('Error fetching note:', error);
      } finally {
        setLoading(false); // Set loading to false after attempting to fetch the data
      }
    };

    fetchNote(); // Call the fetchNote function
  }, [id]); // Re-fetch note if the noteId changes

  const handleSave = async () => {
    if (isSaving) return; // Prevent multiple submissions
    setIsSaving(true);

    try {
      const updatedNote = {
        title,
        content,
      };

      // Send updated note data to the backend
      const response = await updateNote(id, updatedNote);

      if (response.status === 200) {
        onNoteUpdated(response.data); // Update the parent UI after successful update
        alert('Note updated successfully!');
        navigate(`/note/${id}`); // Redirect to the note's detail page after saving
      }
    } catch (err) {
      setError('Failed to update note.');
      console.error('Error updating note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation for title and content
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    handleSave(); // Call the save function
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
            <button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Update Note'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default NoteEditForm;
