// NoteList.js

import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom'; // This helps for navigation between pages
import { getNotes, deleteNote } from '../Api'; // These are your API functions for fetching and deleting notes
import NoteItem from './NoteItem'; // Component to display each note
import NoteForm from './NoteForm'; // Component to handle adding new notes

// Main NoteList component
const NoteList = () => {
  // State hooks to manage notes, loading, error, and deleting status
  const [notes, setNotes] = useState([]); // Stores the list of notes
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(null); // Stores error message if any
  const [deletingIds, setDeletingIds] = useState(new Set()); // Tracks the IDs of notes currently being deleted

  // Fetch notes when the component mounts
  useEffect(() => {
    fetchNotes(); // Call function to fetch notes on initial render
  }, []); // Empty dependency array means this runs once after the first render

  // Function to fetch notes from the API
  const fetchNotes = async () => {
    try {
      setLoading(true); // Set loading state to true while fetching
      const fetchedNotes = await getNotes(); // Get the notes from your API
      setNotes(fetchedNotes); // Set the fetched notes to the state
    } catch (error) {
      setError('Error fetching notes'); // Show error message if fetching fails
      console.error('Error fetching notes:', error); // Log the error to console
    } finally {
      setLoading(false); // Set loading state to false after fetching is complete
    }
  };

  // Function to handle note deletion (soft delete)
  const handleDelete = async (id) => {
    // Prevent duplicate deletion requests for the same note
    if (deletingIds.has(id)) return;

    try {
      setDeletingIds((prev) => new Set(prev).add(id)); // Mark the note as being deleted
      await deleteNote(id); // Call the backend API to delete the note (soft delete)
      
      // Fetch the updated notes to show the remaining notes after deletion
      const updatedNotes = await getNotes();
      setNotes(updatedNotes); // Update the notes state with the new notes

      alert('Note deleted successfully'); // Show a success message
    } catch (error) {
      console.error('Error deleting note:', error); // Log the error if deletion fails
      setError('Failed to delete the note'); // Set error message for the UI
    } finally {
      // Remove the note from the deleting set after the deletion is complete
      setDeletingIds((prev) => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    }
  };

  return (
    <div className="note-list">
      <h2>Notes</h2>
      {/* Show loading message while notes are being fetched */}
      {loading && <p>Loading notes...</p>}
      
      {/* Show error message if there was an issue fetching notes */}
      {error && <p className="error">{error}</p>}
      
      {/* Component to handle adding a new note */}
      <NoteForm onAddNote={(newNote) => setNotes([...notes, newNote])} />
      
      {/* Display the list of notes */}
      {notes.length > 0 ? (
        notes.map((note) => (
          <NoteItem 
            key={note._id} // Unique key for each note
            note={note} // Pass the note data to the NoteItem component
            onDelete={() => handleDelete(note._id)} // Pass the delete function to NoteItem
          />
        ))
      ) : (
        <p>No notes available. Add some!</p> // Message if there are no notes
      )}
    </div>
  );
};

export default NoteList;
