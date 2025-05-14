import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async (credentials: { email: string; password: string }) => {
    console.log('Login async thunk - Attempting login for:', credentials.email);
    const response = await auth.login(credentials.email, credentials.password);
    console.log('Login async thunk - Response:', response.data);
    
    const { token, user } = response.data.data;
    console.log('Login async thunk - Token:', token);
    console.log('Login async thunk - User:', user);
    
    if (!token) {
      throw new Error('No token received from server');
    }
    
    localStorage.setItem('token', token);
    return { token, user };
  }
);

export const registerAsync = createAsyncThunk(
  'auth/registerAsync',
  async (userData: { name: string; email: string; password: string }) => {
    console.log('Register async thunk - Attempting registration for:', userData.email);
    const response = await auth.register(userData.name, userData.email, userData.password);
    console.log('Register async thunk - Response:', response.data);
    
    const { token, user } = response.data.data;
    console.log('Register async thunk - Token:', token);
    console.log('Register async thunk - User:', user);
    
    if (!token) {
      throw new Error('No token received from server');
    }
    
    localStorage.setItem('token', token);
    return { token, user };
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logoutAsync',
  async () => {
    console.log('Logout async thunk - Removing token');
    localStorage.removeItem('token');
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      console.log('Login start reducer');
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      console.log('Login success reducer:', action.payload);
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      console.log('Login failure reducer:', action.payload);
      state.loading = false;
      state.error = action.payload;
    },
    logoutUser: (state) => {
      console.log('Logout user reducer');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    updateUser: (state, action: PayloadAction<User>) => {
      console.log('Update user reducer:', action.payload);
      state.user = action.payload;
    },
    clearError: (state) => {
      console.log('Clear error reducer');
      state.error = null;
    },
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      console.log('Set user reducer:', action.payload);
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      console.log('Logout reducer');
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        console.log('Login async pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        console.log('Login async fulfilled:', action.payload);
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        console.log('Login async rejected:', action.error);
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register
      .addCase(registerAsync.pending, (state) => {
        console.log('Register async pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        console.log('Register async fulfilled:', action.payload);
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        console.log('Register async rejected:', action.error);
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Logout
      .addCase(logoutAsync.fulfilled, (state) => {
        console.log('Logout async fulfilled');
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutUser,
  updateUser,
  clearError,
  setUser,
  logout,
} = authSlice.actions;

export default authSlice.reducer; 