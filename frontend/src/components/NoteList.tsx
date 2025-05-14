import React from 'react';
import { Note } from '../types';
import NoteCard from './NoteCard';
import { Grid } from '@mui/material';

interface NoteListProps {
  notes: Note[];
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onUpdateNote, onDeleteNote }) => {
  const handleTogglePin = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      onUpdateNote(id, { isPinned: !note.isPinned });
    }
  };

  return (
    <Grid container spacing={2}>
      {notes.map((note) => (
        <Grid item xs={12} sm={6} md={4} key={note.id}>
          <NoteCard
            note={note}
            onEdit={(note) => onUpdateNote(note.id, note)}
            onDelete={onDeleteNote}
            onToggleFavorite={handleTogglePin}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default NoteList; 