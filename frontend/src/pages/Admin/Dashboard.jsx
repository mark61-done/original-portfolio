// Dashboard.jsx - Updated with real data fetching
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Button,
  CircularProgress
} from '@mui/material';
import { 
  Folder, 
  Email, 
  Code, 
  Person
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminProjectsAPI, messagesAPI } from '../../services/api';

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
      const [projectsRes, messagesRes] = await Promise.all([
        adminProjectsAPI.getAll(),
        messagesAPI.getUnreadCount()
      ]);
      
      setStats({
        projects: projectsRes.data.count || projectsRes.data.data?.length || 0,
        unreadMessages: messagesRes.data.count || 0,
        skills: 0, // You can add skills API later
        visits: 0  // You can add analytics later
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    { 
      label: 'Total Projects', 
      value: stats.projects, 
      icon: <Folder />, 
      color: 'primary',
      action: () => navigate('/admin/projects')
    },
    { 
      label: 'Unread Messages', 
      value: stats.unreadMessages, 
      icon: <Email />, 
      color: 'secondary',
      action: () => navigate('/admin/messages')
    },
    { 
      label: 'Skills', 
      value: stats.skills, 
      icon: <Code />, 
      color: 'success' 
    },
    { 
      label: 'Website Visits', 
      value: stats.visits, 
      icon: <Person />, 
      color: 'info' 
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Box>
          <Typography variant="body1" display="inline" sx={{ mr: 2 }}>
            Welcome, {user?.username}!
          </Typography>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
      
      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardStats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card 
              sx={{ 
                cursor: stat.action ? 'pointer' : 'default',
                transition: 'transform 0.2s',
                '&:hover': stat.action ? { transform: 'translateY(-4px)' } : {}
              }}
              onClick={stat.action}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ color: `${stat.color}.main`, mr: 2 }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6">{stat.value}</Typography>
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
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/admin/projects')}
          size="large"
        >
          Manage Projects
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate('/admin/messages')}
          size="large"
        >
          View Messages
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate('/admin/skills')}
          size="large"
        >
          Manage Skills
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          size="large"
        >
          View Portfolio
        </Button>
      </Box>
    </Container>
  );
};

export default AdminDashboard;