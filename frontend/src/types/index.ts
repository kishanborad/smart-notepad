import { AlertColor } from '@mui/material';

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  darkMode: boolean;
  emailNotifications: boolean;
  autoSave: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Note types
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  sharedWith?: string[];
  version?: number;
  versionHistory?: VersionHistory[];
  metadata?: NoteMetadata;
  attachments?: Attachment[];
  reminders?: Reminder[];
  status: 'active' | 'archived' | 'deleted';
}

export interface VersionHistory {
  content: string;
  timestamp: string;
  version: number;
}

export interface NoteMetadata {
  wordCount: number;
  readingTime: number;
  lastEdited: string;
}

export interface Attachment {
  type: string;
  url: string;
  name: string;
}

export interface Reminder {
  date: string;
  description: string;
}

export interface NotesState {
  items: Note[];
  currentNote: Note | null;
  loading: boolean;
  error: string | null;
}

// UI types
export interface Notification {
  id: string;
  message: string;
  type: AlertColor;
  duration?: number;
}

export interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
  notifications: Notification[];
}

// Hook types
export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export interface UseNotesReturn {
  notes: Note[];
  currentNote: Note | null;
  loading: boolean;
  error: string | null;
  fetchAllNotes: () => Promise<void>;
  fetchNote: (id: string) => Promise<void>;
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

export interface UseNotificationReturn {
  showNotification: (message: string, type: Notification['type']) => void;
  clearNotification: (id: string) => void;
}

// API types
export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface APIError {
  message: string;
  status: number;
}

// Redux types
export interface RootState {
  auth: AuthState;
  notes: NotesState;
  ui: UIState;
} 