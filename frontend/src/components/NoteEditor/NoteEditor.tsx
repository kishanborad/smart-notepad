import React from 'react';
import { Box, TextField, Paper } from '@mui/material';
import { Note } from '../../types';

interface NoteEditorProps {
  note: Note;
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onTitleChange,
  onContentChange,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Title"
          value={note.title}
          onChange={(e) => onTitleChange?.(e.target.value)}
          InputProps={{
            sx: { fontSize: '1.5rem', fontWeight: 'bold' },
          }}
        />
        <TextField
          fullWidth
          multiline
          minRows={10}
          variant="outlined"
          label="Content"
          value={note.content}
          onChange={(e) => onContentChange?.(e.target.value)}
          InputProps={{
            sx: { fontSize: '1rem' },
          }}
        />
      </Box>
    </Paper>
  );
}; 