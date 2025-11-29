import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, List, ListItem, ListItemText, Alert, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminMessages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  // Connect to Socket.io
  useEffect(() => {
    const socket = io('http://localhost:5000'); // update if using different backend URL

    // Listen for new messages
    socket.on('newMessage', (message) => {
      setMessages(prev => [message, ...prev]);
    });

    // Listen for deleted messages
    socket.on('deleteMessage', (id) => {
      setMessages(prev => prev.filter(msg => msg._id !== id));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch existing messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
       const res = await axios.get('/api/admin/messages', {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

        setMessages(res.data.data || []);
      } catch (err) {
        setError('Failed to load messages.');
        console.error(err);
      }
    };
    fetchMessages();
  }, [user]);

  useEffect(() => {
  console.log("USER OBJECT:", user);
  console.log("TOKEN SENT:", user?.token);
}, [user]);


  // Delete message function
 const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem('token'); // fetch token
    if (!token) throw new Error('No auth token found');

    await axios.delete(`/api/admin/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setMessages(prev => prev.filter(msg => msg._id !== id));
  } catch (err) {
    console.error(err);
    setError('Failed to delete message.');
  }
};


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Messages
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Welcome, {user?.username}! This is where you view contact messages.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="outlined" onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <List>
        {messages.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No messages yet.
          </Typography>
        )}
        {messages.map(msg => (
          <ListItem
            key={msg._id}
            sx={{
              borderBottom: '1px solid #ccc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <ListItemText
              primary={`${msg.name} (${msg.email})`}
              secondary={msg.message}
            />
            <IconButton color="error" onClick={() => handleDelete(msg._id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default AdminMessages;
