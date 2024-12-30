// NoteItem.js

import React from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect to the edit page
import { deleteNote } from '../Api'; // API utility for deleting notes

const NoteItem = ({ note, onDelete }) => {
  const navigate = useNavigate(); // To navigate to the edit page

  // Handle the delete action
  const handleDeleteNote = async () => {
    try {
      await deleteNote(note._id);
      onDelete(); // Remove note from parent list after deletion
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Navigate to the edit page when clicking the Edit button
  const handleEdit = () => {
    navigate(`/edit/${note._id}`);
  };

  return (
    <div className="note-item">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <div className="note-actions">
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDeleteNote}>Delete</button>
      </div>
    </div>
  );
};

export default NoteItem;
