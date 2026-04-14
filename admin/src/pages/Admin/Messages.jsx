import React, { useEffect, useState } from 'react'
import { Container, Typography, Box, Button, List, ListItem, ListItemText, Alert, IconButton, Chip, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAuth } from '../../context/AuthContext'
import { messagesAPI } from '../../services/api'

const AdminMessages = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const apiOrigin = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')
    const socket = io(apiOrigin)

    socket.on('newMessage', (message) => setMessages((prev) => [message, ...prev]))
    socket.on('deleteMessage', (id) => setMessages((prev) => prev.filter((msg) => msg._id !== id)))

    return () => socket.disconnect()
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await messagesAPI.getAll()
        setMessages(res?.data?.data || [])
      } catch (err) {
        setError('Failed to load messages.')
      }
    }
    fetchMessages()
  }, [user])

  const handleDelete = async (id) => {
    try {
      await messagesAPI.delete(id)
      setMessages((prev) => prev.filter((msg) => msg._id !== id))
    } catch {
      setError('Failed to delete message.')
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await messagesAPI.markAsRead(id)
      setMessages((prev) => prev.map((msg) => (msg._id === id ? { ...msg, read: true } : msg)))
    } catch {
      setError('Failed to mark message as read.')
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <List sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
        {messages.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No messages yet.
          </Typography>
        )}
        {messages.map((msg) => (
          <ListItem
            key={msg._id}
            sx={{ borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <ListItemText
              primary={`${msg.name} (${msg.email})`}
              secondary={`${msg.subject ? `Subject: ${msg.subject} • ` : ''}${msg.service ? `Service: ${msg.service} • ` : ''}${msg.message}`}
              sx={{ mr: 2 }}
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" label={msg.read ? 'Read' : 'Unread'} color={msg.read ? 'default' : 'secondary'} />
              {!msg.read && (
                <Button size="small" variant="outlined" onClick={() => handleMarkRead(msg._id)}>
                  Mark Read
                </Button>
              )}
              <IconButton color="error" onClick={() => handleDelete(msg._id)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          </ListItem>
        ))}
      </List>
    </Container>
  )
}

export default AdminMessages

