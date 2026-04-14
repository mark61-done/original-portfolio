import React, { useMemo, useState, useEffect } from 'react';
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
  Paper,
  Chip,
  Divider,
  Stack,
  Button
} from '@mui/material';
import { skillsAPI } from '../services/api';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DownloadIcon from '@mui/icons-material/Download';
import CodeIcon from '@mui/icons-material/Code';

const About = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await skillsAPI.getAll();
        setSkills(Array.isArray(response?.data?.data) ? response.data.data : []);
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

  const highlights = useMemo(() => {
    const core = ['React', 'Node.js', 'Express', 'MongoDB'];
    return [
      { label: 'Core Stack', value: core.join(' • ') },
      { label: 'Focus', value: 'Full‑stack web apps, dashboards, APIs' },
      { label: 'Strengths', value: 'Clean UI, performance, maintainable code' },
    ];
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Hero */}
      <Card
        sx={{
          mb: 5,
          borderRadius: '18px',
          overflow: 'hidden',
          boxShadow: '0 18px 48px rgba(2, 6, 23, 0.08)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="overline" sx={{ letterSpacing: 1.5, color: 'primary.main' }}>
                Full Stack Developer
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 1 }}>
                Marko Olando Oloo
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700 }}>
                I build modern, fast, and maintainable web applications — from polished UIs to secure APIs and databases.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
                <Button variant="contained" endIcon={<ArrowForwardIcon />} href="/projects">
                  View Projects
                </Button>
                <Button variant="outlined" startIcon={<DownloadIcon />} disabled>
                  Download CV
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: '16px',
                  bgcolor: 'background.default',
                  borderColor: 'rgba(37, 99, 235, 0.18)',
                }}
              >
                <CardContent>
                  <Stack spacing={1.2}>
                    {highlights.map((h) => (
                      <Box key={h.label}>
                        <Typography variant="caption" color="text.secondary">
                          {h.label}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {h.value}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Column - Personal Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3, borderRadius: '16px' }}>
            <CardContent>
              <Box textAlign="center" sx={{ py: 2 }}>
                <PersonIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  About
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Passionate about building professional products with great UX, clean architecture, and reliable APIs.
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Education */}
          <Card sx={{ mb: 3, borderRadius: '16px' }}>
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
          <Card sx={{ borderRadius: '16px' }}>
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
          <Card sx={{ borderRadius: '16px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    Technical Skills
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A snapshot of the tools I use to ship production-ready applications.
                  </Typography>
                </Box>
                <Chip icon={<CodeIcon />} label={`${skills.length} skills`} variant="outlined" />
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Frontend Skills */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
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
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
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
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
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
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
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