import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import {
  fetchNotes,
  fetchNoteById,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  fetchNotesStart,
  fetchNotesSuccess,
  fetchNotesFailure,
  setCurrentNote,
  createNoteStart,
  createNoteSuccess,
  createNoteFailure,
  updateNoteStart,
  updateNoteSuccess,
  updateNoteFailure,
  deleteNoteStart,
  deleteNoteSuccess,
  deleteNoteFailure,
} from '../store/slices/notesSlice';
import { useNotification } from './useNotification';
import { notes as notesApi } from '../services/api';
import { Note } from '../types';

interface NotesHookReturn {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
  fetchAllNotes: () => Promise<void>;
  fetchNote: (id: string) => Promise<void>;
  createNewNote: (title: string, content: string) => Promise<void>;
  updateExistingNote: (id: string, title: string, content: string) => Promise<void>;
  deleteExistingNote: (id: string) => Promise<void>;
  shareExistingNote: (id: string, email: string) => Promise<void>;
  createNote: (data: {
    title: string;
    content: string;
    tags?: string[];
    isPublic?: boolean;
  }) => Promise<boolean>;
  updateNote: (
    id: string,
    data: {
      title?: string;
      content?: string;
      tags?: string[];
      isPublic?: boolean;
    }
  ) => Promise<boolean>;
  deleteNote: (id: string) => Promise<boolean>;
  shareNote: (id: string, email: string) => Promise<boolean>;
  unshareNote: (id: string, email: string) => Promise<boolean>;
}

const ensureNoteStatus = (note: Partial<Note>): Note => {
  const status = note.status || 'active';
  if (status !== 'active' && status !== 'archived' && status !== 'deleted') {
    throw new Error(`Invalid note status: ${status}`);
  }
  
  return {
    ...note,
    status,
    tags: note.tags || [],
    createdAt: note.createdAt || new Date().toISOString(),
    updatedAt: note.updatedAt || new Date().toISOString(),
    isPublic: note.isPublic ?? false,
    userId: note.userId || '',
  } as Note;
};

export const useNotes = (): NotesHookReturn => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { notes, currentNote, loading, error } = useSelector(
    (state: RootState) => state.notes
  );

  const fetchAllNotes = useCallback(async () => {
    try {
      dispatch(fetchNotesStart());
      const response = await notesApi.getAll();
      const notesWithStatus = response.data.map(ensureNoteStatus);
      dispatch(fetchNotesSuccess(notesWithStatus));
    } catch (err) {
      dispatch(fetchNotesFailure('Failed to fetch notes'));
      showNotification('Failed to fetch notes', 'error');
    }
  }, [dispatch, showNotification]);

  const fetchNote = useCallback(
    async (id: string) => {
      try {
        const response = await notesApi.getById(id);
        const noteWithStatus = ensureNoteStatus(response.data);
        dispatch(setCurrentNote(noteWithStatus));
      } catch (err) {
        showNotification('Failed to fetch note', 'error');
        navigate('/');
      }
    },
    [dispatch, navigate, showNotification]
  );

  const createNewNote = useCallback(
    async (title: string, content: string) => {
      try {
        dispatch(createNoteStart());
        const response = await notesApi.create({ title, content });
        const noteWithStatus = ensureNoteStatus(response.data);
        dispatch(createNoteSuccess(noteWithStatus));
        showNotification('Note created successfully', 'success');
        navigate(`/notes/${noteWithStatus.id}`);
      } catch (err) {
        dispatch(createNoteFailure('Failed to create note'));
        showNotification('Failed to create note', 'error');
      }
    },
    [dispatch, navigate, showNotification]
  );

  const updateExistingNote = useCallback(
    async (id: string, title: string, content: string) => {
      try {
        dispatch(updateNoteStart());
        const response = await notesApi.update(id, { title, content });
        const noteWithStatus = ensureNoteStatus(response.data);
        dispatch(updateNoteSuccess(noteWithStatus));
        showNotification('Note updated successfully', 'success');
      } catch (err) {
        dispatch(updateNoteFailure('Failed to update note'));
        showNotification('Failed to update note', 'error');
      }
    },
    [dispatch, showNotification]
  );

  const deleteExistingNote = useCallback(
    async (id: string) => {
      try {
        dispatch(deleteNoteStart());
        await notesApi.delete(id);
        dispatch(deleteNoteSuccess(id));
        showNotification('Note deleted successfully', 'success');
        navigate('/');
      } catch (err) {
        dispatch(deleteNoteFailure('Failed to delete note'));
        showNotification('Failed to delete note', 'error');
      }
    },
    [dispatch, navigate, showNotification]
  );

  const shareExistingNote = useCallback(
    async (id: string, email: string) => {
      try {
        await notesApi.share(id, email);
        showNotification('Note shared successfully', 'success');
      } catch (err) {
        showNotification('Failed to share note', 'error');
      }
    },
    [showNotification]
  );

  const createNote = useCallback(
    async (data: {
      title: string;
      content: string;
      tags?: string[];
      isPublic?: boolean;
    }) => {
      try {
        dispatch(createNoteStart());
        const response = await notesApi.create(data);
        const noteWithStatus = ensureNoteStatus(response.data);
        dispatch(createNoteSuccess(noteWithStatus));
        return true;
      } catch (error: any) {
        dispatch(
          createNoteFailure(
            error.response?.data?.message || 'Failed to create note'
          )
        );
        return false;
      }
    },
    [dispatch]
  );

  const updateNote = useCallback(
    async (
      id: string,
      data: {
        title?: string;
        content?: string;
        tags?: string[];
        isPublic?: boolean;
      }
    ) => {
      try {
        dispatch(updateNoteStart());
        const response = await notesApi.update(id, data);
        const noteWithStatus = ensureNoteStatus(response.data);
        dispatch(updateNoteSuccess(noteWithStatus));
        return true;
      } catch (error: any) {
        dispatch(
          updateNoteFailure(
            error.response?.data?.message || 'Failed to update note'
          )
        );
        return false;
      }
    },
    [dispatch]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      try {
        dispatch(deleteNoteStart());
        await notesApi.delete(id);
        dispatch(deleteNoteSuccess(id));
        return true;
      } catch (error: any) {
        dispatch(
          deleteNoteFailure(
            error.response?.data?.message || 'Failed to delete note'
          )
        );
        return false;
      }
    },
    [dispatch]
  );

  const shareNote = useCallback(
    async (id: string, email: string) => {
      try {
        await notesApi.share(id, email);
        showNotification('Note shared successfully', 'success');
        return true;
      } catch (error: any) {
        showNotification(
          error.response?.data?.message || 'Failed to share note',
          'error'
        );
        return false;
      }
    },
    [showNotification]
  );

  const unshareNote = useCallback(
    async (id: string, email: string) => {
      try {
        await notesApi.unshare(id, email);
        showNotification('Note unshared successfully', 'success');
        return true;
      } catch (error: any) {
        showNotification(
          error.response?.data?.message || 'Failed to unshare note',
          'error'
        );
        return false;
      }
    },
    [showNotification]
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
    createNewNote,
    updateExistingNote,
    deleteExistingNote,
    shareExistingNote,
    createNote,
    updateNote,
    deleteNote,
    shareNote,
    unshareNote,
  };
};

export default useNotes; 