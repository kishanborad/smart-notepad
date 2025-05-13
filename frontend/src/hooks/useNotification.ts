import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AlertColor } from '@mui/material';
import { addNotification, removeNotification } from '../store/slices/uiSlice';
import { UseNotificationReturn, Notification } from '../types';

export const useNotification = (): UseNotificationReturn => {
  const dispatch = useDispatch();

  const showNotification = useCallback(
    (message: string, type: Notification['type']) => {
      dispatch(
        addNotification({
          message,
          type,
          duration: 3000, // Default duration
        })
      );
    },
    [dispatch]
  );

  const clearNotification = useCallback(
    (id: string) => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  return {
    showNotification,
    clearNotification,
  };
};

export default useNotification; 