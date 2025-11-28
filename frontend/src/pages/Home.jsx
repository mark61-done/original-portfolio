import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material'
import { Link } from 'react-router-dom'
import { projectsAPI, skillsAPI } from '../services/api'
import CodeIcon from '@mui/icons-material/Code'
import LaunchIcon from '@mui/icons-material/Launch'

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [skills, setSkills] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

 useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      const [projectsResponse, skillsResponse] = await Promise.all([
        projectsAPI.getFeatured(),
        skillsAPI.getAll()
      ]);

      setFeaturedProjects(projectsResponse.data.data);

      // FIX SKILLS HERE
      const grouped = skillsResponse.data.data.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
      }, {});

      setSkills(grouped);

    } catch (err) {
      setError('Failed to load data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box textAlign="center" sx={{ mb: 8, py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Hi, I'm <span style={{ color: '#2563eb' }}>Marko Olando Oloo</span>
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
          Full Stack Developer passionate about creating amazing web experiences with modern technologies.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            to="/projects"
            sx={{ mr: 2 }}
          >
            View My Work
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            component={Link} 
            to="/contact"
          >
            Get In Touch
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Featured Projects Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <CodeIcon sx={{ mr: 2 }} />
          Featured Projects
        </Typography>
        
        <Grid container spacing={4}>
          {featuredProjects.map((project) => (
            <Grid item xs={12} md={6} key={project._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                {/* Project Image */}
                {project.image && (
                  <Box
                    component="img"
                    src={project.image}
                    alt={project.title}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover'
                    }}
                  />
                )}
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {project.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    {project.technologies && project.technologies.map((tech, index) => (
                      <Chip 
                        key={index}
                        label={tech} 
                        size="small" 
                        sx={{ mr: 0.5, mb: 0.5 }}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {project.githubUrl && (
                      <Button 
                        size="small" 
                        href={project.githubUrl} 
                        target="_blank"
                        startIcon={<CodeIcon />}
                      >
                        Code
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button 
                        size="small" 
                        href={project.liveUrl} 
                        target="_blank"
                        startIcon={<LaunchIcon />}
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

        <Box textAlign="center" sx={{ mt: 4 }}>
          <Button variant="outlined" component={Link} to="/projects">
            View All Projects
          </Button>
        </Box>
      </Box>

      {/* Skills Preview */}
      <Box>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
          Technologies I Use
        </Typography>
        
        <Grid container spacing={2}>
          {Object.entries(skills).map(([category, categorySkills]) => (
            <Grid item xs={12} sm={6} md={3} key={category}>
              <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                {category}
              </Typography>
              <Box>
                {(Array.isArray(categorySkills) ? categorySkills : []).slice(0, 4).map(skill => (

                  <Chip
                    key={skill._id}
                    label={skill.name}
                    sx={{ m: 0.5 }}
                    color="primary"
                    variant="outlined"
                  />
                ))}
                {categorySkills.length > 4 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    +{categorySkills.length - 4} more
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}

export default Home