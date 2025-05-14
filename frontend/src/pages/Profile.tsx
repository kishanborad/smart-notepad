import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logoutAsync } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Avatar } from '@mui/material';
import type { AppDispatch } from '../store';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutAsync()).unwrap();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            mb: 2,
            bgcolor: 'primary.main',
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
        <Typography component="h1" variant="h4" gutterBottom>
          {user.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {user.email}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          sx={{ mt: 3 }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Profile; 