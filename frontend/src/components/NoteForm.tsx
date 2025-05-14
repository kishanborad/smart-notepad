import React, { useState } from 'react';
import { Note, NoteCategory } from '../types';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

interface NoteFormProps {
  onAddNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onAddNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('personal');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !title.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddNote({
        title,
        content,
        category,
        tags,
        color: '#ffffff',
        isPinned: false,
      });

      // Reset form
      setTitle('');
      setContent('');
      setTags([]);
      setTagInput('');
    } catch (error) {
      console.error('Failed to create note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <TextField
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        sx={{ mb: 2 }}
        required
        disabled={isSubmitting}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={(e) => setCategory(e.target.value as NoteCategory)}
          disabled={isSubmitting}
        >
          <MenuItem value="personal">Personal</MenuItem>
          <MenuItem value="work">Work</MenuItem>
          <MenuItem value="ideas">Ideas</MenuItem>
          <MenuItem value="tasks">Tasks</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note here..."
        sx={{ mb: 2 }}
        required
        disabled={isSubmitting}
      />
      <TextField
        fullWidth
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleAddTag}
        placeholder="Add tags (press Enter)"
        sx={{ mb: 2 }}
        disabled={isSubmitting}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {tags.map((tag) => (
          <Button
            key={tag}
            size="small"
            variant="outlined"
            onClick={() => handleRemoveTag(tag)}
            disabled={isSubmitting}
          >
            {tag} ×
          </Button>
        ))}
      </Box>
      <Button 
        type="submit" 
        variant="contained" 
        fullWidth
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Add Note'}
      </Button>
    </Box>
  );
};

export default NoteForm; 