import React, { useEffect, useState } from 'react'
import { Container, Grid, Card, CardContent, Typography, Box, Button, CircularProgress, Divider, Stack, Chip, Alert } from '@mui/material'
import { Folder, Email, Code, Refresh, ArrowForward } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { adminProjectsAPI, messagesAPI, adminSkillsAPI } from '../../services/api'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || 'http://localhost:3000'

  const [stats, setStats] = useState({
    projects: 0,
    unreadMessages: 0,
    skills: 0,
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [recentMessages, setRecentMessages] = useState([])

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      setError('')
      const [projectsRes, unreadMessagesRes, skillsRes, messagesRes] = await Promise.all([
        adminProjectsAPI.getCount(),
        messagesAPI.getUnreadCount(),
        adminSkillsAPI.getAll(),
        messagesAPI.getAll(),
      ])

      setStats({
        projects: projectsRes?.data?.count || 0,
        unreadMessages: unreadMessagesRes?.data?.unreadCount || 0,
        skills: skillsRes?.data?.count || 0,
      })
      setRecentMessages((messagesRes?.data?.data || []).slice(0, 5))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
      if (isRefresh) setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const dashboardStats = [
    { label: 'Total Projects', value: stats.projects, icon: <Folder />, color: 'primary', action: () => navigate('/admin/projects') },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: <Email />, color: 'secondary', action: () => navigate('/admin/messages') },
    { label: 'Skills', value: stats.skills, icon: <Code />, color: 'success', action: () => navigate('/admin/skills') },
  ]

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={50} />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.username}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            sx={{ borderRadius: '10px', px: 2.5 }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outlined" onClick={handleLogout} sx={{ borderRadius: '10px', px: 3, py: 1 }}>
            Logout
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {dashboardStats.map((stat, index) => (
          <Grid key={index} xs={12} sm={6} md={3}>
            <Card
              onClick={stat.action}
              sx={{
                cursor: stat.action ? 'pointer' : 'default',
                borderRadius: '16px',
                p: 1,
                boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
                transition: '0.25s',
                '&:hover': {
                  transform: stat.action ? 'translateY(-6px)' : 'none',
                  boxShadow: stat.action ? '0 6px 22px rgba(0,0,0,0.12)' : undefined,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      color: `${stat.color}.main`,
                      bgcolor: `${stat.color}.light`,
                      p: 1.4,
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>

                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid xs={12} md={7}>
          <Card sx={{ borderRadius: '16px' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Recent Messages
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {recentMessages.length === 0 ? (
                <Typography color="text.secondary">No messages yet.</Typography>
              ) : (
                <Stack spacing={1.5}>
                  {recentMessages.map((message) => (
                    <Box
                      key={message._id}
                      sx={{
                        p: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600 }}>{message.name}</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {message.message}
                        </Typography>
                      </Box>
                      <Chip label={message.read ? 'Read' : 'Unread'} color={message.read ? 'default' : 'secondary'} size="small" />
                    </Box>
                  ))}
                  <Button variant="text" endIcon={<ArrowForward />} onClick={() => navigate('/admin/messages')}>
                    Open messages
                  </Button>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={5}>
          <Card sx={{ borderRadius: '16px', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={1.5}>
                <Button variant="contained" size="large" onClick={() => navigate('/admin/projects')} sx={{ borderRadius: '10px', justifyContent: 'flex-start' }}>
                  Manage Projects
                </Button>
                <Button variant="contained" size="large" onClick={() => navigate('/admin/messages')} sx={{ borderRadius: '10px', justifyContent: 'flex-start' }}>
                  View Messages
                </Button>
                <Button variant="contained" size="large" onClick={() => navigate('/admin/skills')} sx={{ borderRadius: '10px', justifyContent: 'flex-start' }}>
                  Manage Skills
                </Button>
                <Button variant="outlined" size="large" onClick={() => (window.location.href = portfolioUrl)} sx={{ borderRadius: '10px', justifyContent: 'flex-start' }}>
                  View Portfolio
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </Container>
  )
}

export default AdminDashboard

