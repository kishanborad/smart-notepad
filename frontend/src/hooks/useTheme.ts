import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleDarkMode } from '../store/slices/uiSlice';

interface UseThemeReturn {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useTheme = (): UseThemeReturn => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.ui.darkMode);

  const handleToggleTheme = useCallback(() => {
    dispatch(toggleDarkMode());
  }, [dispatch]);

  return {
    isDarkMode,
    toggleTheme: handleToggleTheme,
  };
};

export default useTheme; 