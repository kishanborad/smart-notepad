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
  const handleDelete = async (id) => {
    try {
      console.log(`Attempting to delete note with ID: ${id}`); // Debugging log
      await deleteNote(id); // Call the API to delete the note
      console.log(`Note with ID ${id} deleted successfully`); // Debugging log
  
      // Refetch the notes list to ensure UI synchronization
      fetchNotes(); 
    } catch (error) {
      console.error('Error deleting note:', error.response?.data?.error || error.message);
      alert(error.response?.data?.error || 'An unexpected error occurred while deleting the note.');
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
