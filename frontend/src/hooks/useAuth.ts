import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutUser,
  updateUser,
  loginAsync,
  registerAsync,
} from '../store/slices/authSlice';
import { auth } from '../services/api';
import { RootState, UseAuthReturn } from '../types';
import { useNotification } from './useNotification';

export const useAuth = (): UseAuthReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { showNotification } = useNotification();
  const { user, loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        dispatch(loginStart());
        const result = await dispatch(loginAsync({ email, password })).unwrap();
        if (result) {
          dispatch(loginSuccess({ user: result.user, token: result.token }));
          showNotification('Login successful', 'success');
          return true;
        }
        throw new Error('Login failed');
      } catch (error: any) {
        dispatch(loginFailure(error.message || 'Login failed'));
        showNotification(error.message || 'Login failed', 'error');
        return false;
      }
    },
    [dispatch, showNotification]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        dispatch(loginStart());
        const result = await dispatch(registerAsync({ name, email, password })).unwrap();
        if (result) {
          dispatch(loginSuccess({ user: result.user, token: result.token }));
          showNotification('Registration successful', 'success');
          return true;
        }
        throw new Error('Registration failed');
      } catch (error: any) {
        dispatch(
          loginFailure(error.message || 'Registration failed')
        );
        showNotification(error.message || 'Registration failed', 'error');
        return false;
      }
    },
    [dispatch, showNotification]
  );

  const logout = useCallback(() => {
    dispatch(logoutUser());
    showNotification('Logged out successfully', 'success');
  }, [dispatch, showNotification]);

  const updateProfile = useCallback(
    async (data: { name?: string; avatar?: string }) => {
      try {
        const response = await auth.updateProfile(data);
        dispatch(updateUser(response.data));
        showNotification('Profile updated successfully', 'success');
        return true;
      } catch (error: any) {
        showNotification(
          error.response?.data?.message || 'Failed to update profile',
          'error'
        );
        return false;
      }
    },
    [dispatch, showNotification]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        await auth.changePassword(currentPassword, newPassword);
        showNotification('Password changed successfully', 'success');
        return true;
      } catch (error: any) {
        showNotification(
          error.response?.data?.message || 'Failed to change password',
          'error'
        );
        return false;
      }
    },
    [showNotification]
  );

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };
};

export default useAuth; 