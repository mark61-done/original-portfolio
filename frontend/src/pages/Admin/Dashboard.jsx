// Dashboard.jsx - Improved UI
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Button,
  CircularProgress,
  Divider
} from '@mui/material';
import { 
  Folder, 
  Email, 
  Code, 
  Person
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminProjectsAPI, messagesAPI, skillsAPI } from '../../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    projects: 0,
    unreadMessages: 0,
    skills: 0,
    visits: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, unreadMessagesRes, skillsRes] = await Promise.all([
        adminProjectsAPI.getAll(),
        messagesAPI.getUnreadCount(),
        skillsAPI.getAll()
      ]);

      setStats({
        projects: projectsRes.data.length || 0,
        unreadMessages: unreadMessagesRes.data.unreadCount || 0,
        skills: skillsRes.data.length || 0,
        visits: 0
      });

    } catch (error) {
      console.error(' Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    { label: 'Total Projects', value: stats.projects, icon: <Folder />, color: 'primary', action: () => navigate('/admin/projects') },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: <Email />, color: 'secondary', action: () => navigate('/admin/messages') },
    { label: 'Skills', value: stats.skills, icon: <Code />, color: 'success', action: () => navigate('/admin/skills') },
    { label: 'Website Visits', value: stats.visits, icon: <Person />, color: 'info' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.username} 
          </Typography>
        </Box>

        <Button 
          variant="outlined" 
          onClick={handleLogout}
          sx={{
            borderRadius: '10px',
            px: 3,
            py: 1
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Stats Cards */}
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
                  boxShadow: stat.action ? '0 6px 22px rgba(0,0,0,0.12)' : undefined
                }
              }}
            >
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 1
                }}>
                  <Box sx={{
                    color: `${stat.color}.main`,
                    bgcolor: `${stat.color}.light`,
                    p: 1.4,
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mr: 2
                  }}>
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

      {/* Quick Actions */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Quick Actions
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" size="large" onClick={() => navigate('/admin/projects')} sx={{ borderRadius: '10px', px: 4 }}>
            Manage Projects
          </Button>
          <Button variant="contained" size="large" onClick={() => navigate('/admin/messages')} sx={{ borderRadius: '10px', px: 4 }}>
            View Messages
          </Button>
          <Button variant="contained" size="large" onClick={() => navigate('/admin/skills')} sx={{ borderRadius: '10px', px: 4 }}>
            Manage Skills
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/')} sx={{ borderRadius: '10px', px: 4 }}>
            View Portfolio
          </Button>
        </Box>
      </Box>

    </Container>
  );
};

export default AdminDashboard;
