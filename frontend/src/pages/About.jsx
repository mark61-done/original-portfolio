import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { skillsAPI } from '../services/api';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';

const About = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await skillsAPI.getAll();
       const list = response?.data?.list;

if (Array.isArray(list)) {
  setSkills(list);
} else if (Array.isArray(response?.data)) {
  setSkills(response.data);
} else {
  console.error(" Skills API returned unexpected format:", response.data);
  setSkills([]); 
}
 // Using the flat list for progress bars
      } catch (err) {
        setError('Failed to load skills. Please try again later.');
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const getSkillsByCategory = (category) => {
    return skills.filter(skill => skill.category === category);
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
          About Me
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Get to know more about my journey and skills
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Column - Personal Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box textAlign="center" sx={{ py: 2 }}>
                <PersonIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Marko Olando
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Full Stack Developer
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Passionate about creating amazing digital experiences
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Education */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Education</Typography>
              </Box>
              <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Your Degree
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Your University
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2020 - 2024
              </Typography>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Experience</Typography>
              </Box>
              <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Full Stack Developer
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Freelancer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2022 - Present
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Skills */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Technical Skills
              </Typography>

              {/* Frontend Skills */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  Frontend Development
                </Typography>
                {getSkillsByCategory('frontend').map((skill) => (
                  <Box key={skill._id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{skill.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {skill.proficiency}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={skill.proficiency}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Backend Skills */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  Backend Development
                </Typography>
                {getSkillsByCategory('backend').map((skill) => (
                  <Box key={skill._id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{skill.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {skill.proficiency}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={skill.proficiency}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Database Skills */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  Database & Tools
                </Typography>
                {getSkillsByCategory('database').concat(getSkillsByCategory('tools')).map((skill) => (
                  <Box key={skill._id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{skill.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {skill.proficiency}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={skill.proficiency}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Soft Skills */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  Soft Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {getSkillsByCategory('soft').map((skill) => (
                    <Paper
                      key={skill._id}
                      variant="outlined"
                      sx={{ px: 2, py: 1, borderRadius: 2 }}
                    >
                      <Typography variant="body2">{skill.name}</Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;