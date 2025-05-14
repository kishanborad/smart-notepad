import React from 'react';
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';
import useLocalStorage from '../hooks/useLocalStorage';
import { Note, NoteCategory } from '../types';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<NoteCategory | 'all'>('all');
  const [sortBy, setSortBy] = React.useState<'date' | 'category'>('date');

  const handleAddNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map((note: Note) => 
      note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
    ));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note: Note) => note.id !== id));
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