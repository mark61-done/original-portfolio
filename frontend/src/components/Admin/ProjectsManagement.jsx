import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  IconButton,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, Visibility, GitHub } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { adminProjectsAPI } from '../../services/api';

const ProjectsManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await adminProjectsAPI.getAll();
      setProjects(response.data.data || []);
    } catch (error) {
      setError('Error fetching projects');
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await adminProjectsAPI.delete(id);
        setProjects(projects.filter(project => project._id !== id));
      } catch (error) {
        setError('Error deleting project');
        console.error('Error deleting project:', error);
      }
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Manage Projects</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/projects/new')}
        >
          Add Project
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {projects.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Projects Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get started by creating your first project
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/admin/projects/new')}
            >
              Create First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid key={project._id} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                      {project.title}
                    </Typography>
                    {project.featured && (
                      <Chip label="Featured" color="primary" size="small" />
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ flexGrow: 1 }}>
                    {project.description.length > 150 
                      ? `${project.description.substring(0, 150)}...` 
                      : project.description
                    }
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    {project.technologies?.slice(0, 3).map((tech, index) => (
                      <Chip 
                        key={index} 
                        label={tech} 
                        size="small" 
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }} 
                      />
                    ))}
                    {project.technologies?.length > 3 && (
                      <Chip 
                        label={`+${project.technologies.length - 3} more`} 
                        size="small" 
                        variant="outlined"
                        color="default"
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/projects/edit/${project._id}`)}
                        title="Edit"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(project._id, project.title)}
                        title="Delete"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                      {project.githubUrl && (
                        <IconButton
                          size="small"
                          href={project.githubUrl}
                          target="_blank"
                          title="View Code"
                        >
                          <GitHub fontSize="small" />
                        </IconButton>
                      )}
                      {project.liveUrl && (
                        <IconButton
                          size="small"
                          href={project.liveUrl}
                          target="_blank"
                          title="Live Demo"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    
                    <Chip 
                      label={project.category} 
                      size="small" 
                      variant="outlined"
                      color="secondary"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProjectsManagement;