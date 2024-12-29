// NoteList.js

import React, { useState, useEffect } from 'react';
import { getNotes, deleteNote } from '../Api'; // API utility for fetching and deleting notes
import NoteItem from './NoteItem'; // Component to display each note
import NoteForm from './NoteForm'; // Form component for adding new notes

const NoteList = () => {
  // State to hold the notes, loading state, and error state
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Function to fetch notes from the backend
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Error fetching notes');
      console.error('Error fetching notes:', error);
    }
  };

  // Function to handle the deletion of a note
  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note._id !== id)); // Remove deleted note from state
    } catch (error) {
      setError('Error deleting note');
      console.error('Error deleting note:', error);
    }
  };

  // Handle adding new note
  const handleAddNote = (newNote) => {
    setNotes([...notes, newNote]);
  };

  return (
    <div className="note-list">
      <h2>Notes</h2>
      {loading && <p>Loading notes...</p>}
      {error && <p className="error">{error}</p>}
      
      <NoteForm onAddNote={handleAddNote} /> {/* Form to add new note */}
      
      {notes.length > 0 ? (
        notes.map((note) => (
          <NoteItem 
            key={note._id} 
            note={note} 
            onDelete={() => handleDeleteNote(note._id)} 
          />
        ))
      ) : (
        <p>No notes available. Add some!</p>
      )}
    </div>
  );
};

export default NoteList;
