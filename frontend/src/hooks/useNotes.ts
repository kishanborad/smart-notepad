import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import {
  fetchNotes,
  fetchNoteById,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
} from '../store/slices/notesSlice';
import { useNotification } from './useNotification';
import { notes as notesApi } from '../services/api';
import { Note } from '../types';

type NoteInput = {
  title: string;
  content: string;
  tags?: string[];
  isPublic?: boolean;
  category?: string;
  color?: string;
  isPinned?: boolean;
};

type NoteUpdate = Partial<NoteInput>;

interface NotesHookReturn {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
  fetchAllNotes: () => Promise<void>;
  fetchNote: (id: string) => Promise<void>;
  createNote: (data: NoteInput) => Promise<boolean>;
  updateNote: (id: string, data: NoteUpdate) => Promise<boolean>;
  deleteNote: (id: string) => Promise<boolean>;
  shareNote: (id: string, email: string) => Promise<boolean>;
  unshareNote: (id: string, email: string) => Promise<boolean>;
}

export const useNotes = (): NotesHookReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { items: notes, currentNote, loading, error } = useSelector(
    (state: RootState) => state.notes
  );

  const handleError = useCallback(
    (err: any, defaultMessage: string) => {
      const errorMessage = err.message || defaultMessage;
      showNotification(errorMessage, 'error');
      return false;
    },
    [showNotification]
  );

  const fetchAllNotes = useCallback(async () => {
    try {
      await dispatch(fetchNotes()).unwrap();
    } catch (err) {
      handleError(err, 'Failed to fetch notes');
    }
  }, [dispatch, handleError]);

  const fetchNote = useCallback(
    async (id: string) => {
      try {
        await dispatch(fetchNoteById(id)).unwrap();
      } catch (err) {
        handleError(err, 'Failed to fetch note');
        navigate('/');
      }
    },
    [dispatch, navigate, handleError]
  );

  const createNoteHandler = useCallback(
    async (data: NoteInput) => {
      try {
        const result = await dispatch(createNote(data)).unwrap();
        showNotification('Note created successfully', 'success');
        navigate(`/notes/${result.id}`);
        return true;
      } catch (err) {
        return handleError(err, 'Failed to create note');
      }
    },
    [dispatch, navigate, showNotification, handleError]
  );

  const updateNoteHandler = useCallback(
    async (id: string, data: NoteUpdate) => {
      try {
        await dispatch(updateNote({ id, data })).unwrap();
        showNotification('Note updated successfully', 'success');
        return true;
      } catch (err) {
        return handleError(err, 'Failed to update note');
      }
    },
    [dispatch, showNotification, handleError]
  );

  const deleteNoteHandler = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteNote(id)).unwrap();
        showNotification('Note deleted successfully', 'success');
        navigate('/');
        return true;
      } catch (err) {
        return handleError(err, 'Failed to delete note');
      }
    },
    [dispatch, navigate, showNotification, handleError]
  );

  const shareNoteHandler = useCallback(
    async (id: string, email: string) => {
      try {
        await dispatch(shareNote({ id, email })).unwrap();
        showNotification('Note shared successfully', 'success');
        return true;
      } catch (err) {
        return handleError(err, 'Failed to share note');
      }
    },
    [dispatch, showNotification, handleError]
  );

  const unshareNote = useCallback(
    async (id: string, email: string) => {
      try {
        await notesApi.unshare(id, email);
        showNotification('Note unshared successfully', 'success');
        return true;
      } catch (err) {
        return handleError(err, 'Failed to unshare note');
      }
    },
    [showNotification, handleError]
  );

  useEffect(() => {
    fetchAllNotes();
  }, [fetchAllNotes]);

  return {
    notes,
    currentNote,
    isLoading: loading,
    error,
    fetchAllNotes,
    fetchNote,
    createNote: createNoteHandler,
    updateNote: updateNoteHandler,
    deleteNote: deleteNoteHandler,
    shareNote: shareNoteHandler,
    unshareNote,
  };
};

export default useNotes; 