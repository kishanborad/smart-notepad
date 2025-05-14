import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { toggleDarkMode } from '../store/slices/uiSlice';

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: RootState) => state.ui);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Smart Notepad
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => dispatch(toggleDarkMode())}
            edge="end"
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 