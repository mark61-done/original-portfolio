import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminMessages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Messages
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Welcome, {user?.username}! This is where you view contact messages.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default AdminMessages;