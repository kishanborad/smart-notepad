import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Chip,
  Button,
  FormControlLabel,
  Switch,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useNotes } from '../hooks/useNotes';
import { useNotification } from '../hooks/useNotification';
import { Components } from 'react-markdown';
import { SyntaxHighlighterProps } from 'react-syntax-highlighter';

const NoteEditor: React.FC = () => {
  const { id = 'new' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, createNote, updateNote, deleteNote } = useNotes();
  const { showNotification } = useNotification();
  const [note, setNote] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    isPublic: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      const existingNote = notes.find((n) => n.id === id);
      if (existingNote) {
        setNote({
          title: existingNote.title,
          content: existingNote.content,
          tags: existingNote.tags,
          isPublic: existingNote.isPublic,
        });
      } else {
        showNotification('Note not found', 'error');
        navigate('/');
      }
    }
  }, [id, notes, navigate, showNotification]);

  const handleSave = async () => {
    try {
      if (id === 'new') {
        const success = await createNote(note);
        if (success) {
          showNotification('Note created successfully', 'success');
          navigate('/');
        }
      } else {
        const success = await updateNote(id, note);
        if (success) {
          showNotification('Note updated successfully', 'success');
        }
      }
    } catch (error) {
      showNotification('Failed to save note', 'error');
    }
  };

  const handleDelete = async () => {
    if (id && id !== 'new') {
      const success = await deleteNote(id);
      if (success) {
        showNotification('Note deleted successfully', 'success');
        navigate('/');
      }
    }
    setIsDeleteDialogOpen(false);
  };

  const handleAddTag = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      if (!note.tags.includes(tagInput.trim())) {
        setNote((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNote((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    setIsShareDialogOpen(false);
    setShareEmail('');
  };

  const markdownComponents: Components = {
    code({ className, children }) {
      const match = /language-(\w+)/.exec(className || '');
      const syntaxHighlighterProps: SyntaxHighlighterProps = {
        style: materialDark,
        language: match ? match[1] : 'text',
        PreTag: 'div',
        customStyle: { margin: 0 },
        children: String(children).replace(/\n$/, ''),
      };

      return match ? (
        <SyntaxHighlighter {...syntaxHighlighterProps} />
      ) : (
        <code className={className}>{children}</code>
      );
    },
  };

  return (
    <Box sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save
          </Button>
          {id !== 'new' && (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={() => setIsShareDialogOpen(true)}
              >
                Share
              </Button>
            </>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={note.isPublic}
                onChange={(e) =>
                  setNote((prev) => ({ ...prev, isPublic: e.target.checked }))
                }
              />
            }
            label="Public"
          />
          <IconButton onClick={() => setIsPreview(!isPreview)}>
            <PreviewIcon />
          </IconButton>
        </Box>
      </Box>

      <TextField
        fullWidth
        placeholder="Title"
        value={note.title}
        onChange={(e) =>
          setNote((prev) => ({ ...prev, title: e.target.value }))
        }
        sx={{ mb: 2 }}
      />

      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Add tags (press Enter)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          size="small"
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {note.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
              size="small"
            />
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isPreview ? '1fr 1fr' : '1fr',
          gap: 2,
          height: 'calc(100vh - 300px)',
        }}
      >
        <TextField
          fullWidth
          multiline
          placeholder="Write your note in Markdown..."
          value={note.content}
          onChange={(e) =>
            setNote((prev) => ({ ...prev, content: e.target.value }))
          }
          sx={{
            display: isPreview ? 'block' : 'block',
            '& .MuiInputBase-root': {
              height: '100%',
              '& textarea': {
                height: '100% !important',
              },
            },
          }}
        />
        {isPreview && (
          <Paper
            sx={{
              p: 2,
              overflow: 'auto',
              '& pre': {
                margin: 0,
                borderRadius: 1,
              },
            }}
          >
            <ReactMarkdown components={markdownComponents}>
              {note.content}
            </ReactMarkdown>
          </Paper>
        )}
      </Box>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Note</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this note? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
      >
        <DialogTitle>Share Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsShareDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleShare} variant="contained">
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NoteEditor; 