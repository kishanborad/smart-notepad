import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { Note } from '../types';
import { Box, TextField, Button, Typography, Container } from '@mui/material';
import ColorPicker from '../components/ColorPicker';

const NoteEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const foundNote = notes.find((n: Note) => n.id === id);
    if (foundNote) {
      setNote(foundNote);
      setContent(foundNote.content);
    } else {
      navigate('/');
    }
  }, [id, notes, navigate]);

  const handleSave = () => {
    if (!note) return;

    const updatedNote: Note = {
      ...note,
      content,
      updatedAt: new Date().toISOString(),
    };

    setNotes(notes.map((n: Note) => n.id === id ? updatedNote : n));
    navigate('/');
  };

  const handleColorChange = (color: string) => {
    if (!note) return;

    const updatedNote: Note = {
      ...note,
      color,
      updatedAt: new Date().toISOString(),
    };

    setNotes(notes.map((n: Note) => n.id === id ? updatedNote : n));
    setShowColorPicker(false);
  };

  if (!note) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Note
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setShowColorPicker(!showColorPicker)}
            sx={{ mr: 2 }}
          >
            Change Color
          </Button>
          {showColorPicker && (
            <ColorPicker
              selectedColor={note.color}
              onColorChange={handleColorChange}
            />
          )}
        </Box>
        <TextField
          fullWidth
          multiline
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NoteEditor; 