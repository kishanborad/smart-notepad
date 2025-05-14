import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchNotes, createNote, updateNote, deleteNote } from '../store/slices/notesSlice';
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';
import { Note, NoteCategory } from '../types';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import type { AppDispatch } from '../store';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: notes, loading, error } = useSelector((state: RootState) => state.notes);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<NoteCategory | 'all'>('all');
  const [sortBy, setSortBy] = React.useState<'date' | 'category'>('date');

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleAddNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await dispatch(createNote(note)).unwrap();
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleUpdateNote = async (id: string, updates: Partial<Note>) => {
    try {
      await dispatch(updateNote({ id, data: updates })).unwrap();
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await dispatch(deleteNote(id)).unwrap();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const filteredNotes = notes
    .filter((note: Note) => {
      const matchesSearch = note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a: Note, b: Note) => {
      if (sortBy === 'date') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return a.category.localeCompare(b.category);
    });

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Notes
      </Typography>
      <NoteForm onAddNote={handleAddNote} />
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes..."
          sx={{ mb: 2 }}
          variant="outlined"
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value as NoteCategory | 'all')}
              variant="outlined"
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="work">Work</MenuItem>
              <MenuItem value="ideas">Ideas</MenuItem>
              <MenuItem value="tasks">Tasks</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value as 'date' | 'category')}
              variant="outlined"
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="category">Category</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <NoteList
        notes={filteredNotes}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
      />
    </Box>
  );
};

export default Dashboard; 