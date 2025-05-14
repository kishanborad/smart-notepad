// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
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
  category: string;
  tags: string[];
  color: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  userId?: string;
  status?: 'active' | 'archived' | 'deleted';
}

export type NoteCategory = 'personal' | 'work' | 'ideas' | 'tasks' | 'other';

export interface NotesState {
  items: Note[];
  currentNote: Note | null;
  loading: boolean;
  error: string | null;
}

// UI types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
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
  createNote: (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateNote: (id: string, data: Partial<Note>) => Promise<boolean>;
  deleteNote: (id: string) => Promise<boolean>;
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