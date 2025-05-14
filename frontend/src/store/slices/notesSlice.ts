import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { notes } from '../../services/api';
import { Note } from '../../types';

interface NotesState {
  items: Note[];
  currentNote: Note | null;
  loading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  items: [],
  currentNote: null,
  loading: false,
  error: null,
};

export const fetchNotes = createAsyncThunk('notes/fetchAll', async () => {
  const response = await notes.getAll();
  return response.data;
});

export const fetchNoteById = createAsyncThunk(
  'notes/fetchById',
  async (id: string) => {
    const response = await notes.getById(id);
    return response.data;
  }
);

export const createNote = createAsyncThunk(
  'notes/create',
  async (data: {
    title: string;
    content: string;
    tags?: string[];
    isPublic?: boolean;
    category?: string;
    color?: string;
    isPinned?: boolean;
  }) => {
    const response = await notes.create(data);
    return response.data;
  }
);

export const updateNote = createAsyncThunk(
  'notes/update',
  async ({ id, data }: { id: string; data: Partial<Note> }) => {
    const response = await notes.update(id, data);
    return response.data;
  }
);

export const deleteNote = createAsyncThunk(
  'notes/delete',
  async (id: string) => {
    await notes.delete(id);
    return id;
  }
);

export const shareNote = createAsyncThunk(
  'notes/share',
  async ({ id, email }: { id: string; email: string }) => {
    const response = await notes.share(id, email);
    return response.data;
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setCurrentNote: (state, action: PayloadAction<Note | null>) => {
      state.currentNote = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all notes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notes';
      })
      // Fetch note by ID
      .addCase(fetchNoteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNote = action.payload;
      })
      .addCase(fetchNoteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch note';
      })
      // Create note
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.currentNote = action.payload;
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create note';
      })
      // Update note
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((note) => note.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentNote?.id === action.payload.id) {
          state.currentNote = action.payload;
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update note';
      })
      // Delete note
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((note) => note.id !== action.payload);
        if (state.currentNote?.id === action.payload) {
          state.currentNote = null;
        }
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete note';
      });
  },
});

export const { setCurrentNote, clearError } = notesSlice.actions;

export default notesSlice.reducer; 