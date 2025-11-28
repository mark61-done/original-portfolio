import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Box,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { projectsAPI } from '../services/api';
import CodeIcon from '@mui/icons-material/Code';
import LaunchIcon from '@mui/icons-material/Launch';
import FilterListIcon from '@mui/icons-material/FilterList';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectsAPI.getAll();
        setProjects(response.data.data);
        setFilteredProjects(response.data.data);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
      if (newFilter === 'all') {
        setFilteredProjects(projects);
      } else {
        setFilteredProjects(projects.filter(project => project.category === newFilter));
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
      {/* Header */}
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          My Projects
        </Typography>
        <Typography variant="h6" color="text.secondary">
          A collection of my recent work and personal projects
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Filter Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          aria-label="project filter"
          sx={{ mb: 3 }}
        >
          <ToggleButton value="all" aria-label="all projects">
            All Projects
          </ToggleButton>
          <ToggleButton value="web" aria-label="web projects">
            Web
          </ToggleButton>
          <ToggleButton value="mobile" aria-label="mobile projects">
            Mobile
          </ToggleButton>
          <ToggleButton value="fullstack" aria-label="fullstack projects">
            Full Stack
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Projects Grid */}
      <Grid container spacing={4}>
        {filteredProjects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project._id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {/* Category Badge */}
                <Chip 
                  label={project.category} 
                  color="primary" 
                  size="small"
                  sx={{ mb: 2, textTransform: 'capitalize' }}
                />
                
                {/* Featured Badge */}
                {project.featured && (
                  <Chip 
                    label="Featured" 
                    color="secondary" 
                    size="small"
                    sx={{ mb: 2, ml: 1 }}
                  />
                )}

                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {project.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                  {project.description}
                </Typography>
                
                {/* Technologies */}
                <Box sx={{ mb: 3 }}>
                  {project.technologies.slice(0, 4).map((tech, index) => (
                    <Chip 
                      key={index}
                      label={tech} 
                      size="small" 
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                  {project.technologies.length > 4 && (
                    <Chip 
                      label={`+${project.technologies.length - 4}`} 
                      size="small" 
                      variant="outlined"
                      sx={{ mb: 0.5 }}
                    />
                  )}
                </Box>
                
                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                  {project.githubUrl && (
                    <Button 
                      variant="outlined" 
                      size="small" 
                      href={project.githubUrl} 
                      target="_blank"
                      startIcon={<CodeIcon />}
                      fullWidth
                    >
                      Code
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button 
                      variant="contained" 
                      size="small" 
                      href={project.liveUrl} 
                      target="_blank"
                      startIcon={<LaunchIcon />}
                      fullWidth
                    >
                      Live Demo
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredProjects.length === 0 && !loading && (
        <Box textAlign="center" sx={{ py: 8 }}>
          <FilterListIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No projects found in this category.
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={() => setFilter('all')}
          >
            Show All Projects
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Projects;