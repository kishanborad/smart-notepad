// NoteList.js

// NoteList.js
import React, { useState, useEffect } from 'react';
import { getNotes, deleteNote } from '../Api';
import NoteItem from './NoteItem';
import NoteForm from './NoteForm';

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      setError('Error fetching notes');
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (deletingIds.has(id)) return; // Prevent duplicate calls for the same ID

    try {
      setDeletingIds((prev) => new Set(prev).add(id)); // Mark as being deleted
      await deleteNote(id); // Backend call
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id)); // Update UI state
      alert('Note deleted successfully'); // Confirmation message
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete the note');
    } finally {
      setDeletingIds((prev) => {
        const updated = new Set(prev);
        updated.delete(id); // Remove from deleting list
        return updated;
      });
    }
  };

  return (
    <div className="note-list">
      <h2>Notes</h2>
      {loading && <p>Loading notes...</p>}
      {error && <p className="error">{error}</p>}
      <NoteForm onAddNote={(newNote) => setNotes([...notes, newNote])} />
      {notes.length > 0 ? (
        notes.map((note) => (
          <NoteItem 
            key={note._id} 
            note={note} 
            onDelete={() => handleDelete(note._id)} 
          />
        ))
      ) : (
        <p>No notes available. Add some!</p>
      )}
    </div>
  );
};

export default NoteList;
