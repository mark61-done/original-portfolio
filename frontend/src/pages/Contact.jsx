import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Snackbar,
  MenuItem,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import { contactAPI } from '../services/api';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    service: 'web-development',
    budget: '',
    timeline: '',
    message: '',
    website: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isMessageValid = formData.message.trim().length >= 15;
  const canSubmit = formData.name.trim() && isEmailValid && isMessageValid && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);

    try {
      await contactAPI.sendMessage(formData);
      setSnackbar({
        open: true,
        message: 'Message sent successfully! I\'ll get back to you soon.',
        severity: 'success'
      });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        service: 'web-development',
        budget: '',
        timeline: '',
        message: '',
        website: '',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again.',
        severity: 'error'
      });
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Get In Touch
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Have a project in mind? Let's work together!
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3, borderRadius: '16px' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Contact Information
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      markoolando558@gmail.com
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      +254 759-386-624
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1">
                      Nairobi, Kenya
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>
                Follow Me
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row', md: 'column' }} spacing={1.2}>
                <Button
                  variant="outlined"
                  href="https://github.com/mark61-done/mark61-done.git"
                  target="_blank"
                  startIcon={<GitHubIcon />}
                >
                  GitHub
                </Button>
                <Button
                  variant="outlined"
                  href="https://www.linkedin.com/in/marko-olando-898528389?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  target="_blank"
                  startIcon={<LinkedInIcon />}
                >
                  LinkedIn
                </Button>
                <Button
                  variant="outlined"
                  href="https://wa.me/254759386624"
                  target="_blank"
                  startIcon={<WhatsAppIcon />}
                >
                  WhatsApp
                </Button>
              </Stack>

              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Availability
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip color="success" label="Available for new projects" />
                <Chip variant="outlined" label="Average response: < 24h" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '16px' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Send Me a Message
              </Typography>
              {submitted && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Thank you for reaching out. I have received your message and will respond within 24 hours.
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      variant="outlined"
                      placeholder="e.g. Portfolio website project"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      label="Service Needed"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                    >
                      <MenuItem value="web-development">Web Development</MenuItem>
                      <MenuItem value="portfolio">Portfolio Website</MenuItem>
                      <MenuItem value="api-backend">API / Backend</MenuItem>
                      <MenuItem value="ui-ux">UI/UX Improvement</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Budget (optional)"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="e.g. $1,000 - $2,000"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Timeline (optional)"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      placeholder="e.g. 2-4 weeks"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      multiline
                      rows={6}
                      variant="outlined"
                      placeholder="Tell me about your project or just say hello..."
                      helperText={`${formData.message.trim().length}/15 minimum characters`}
                      error={Boolean(formData.message) && !isMessageValid}
                    />
                  </Grid>
                  {/* Honeypot field for basic bot prevention */}
                  <Grid item xs={12} sx={{ display: 'none' }}>
                    <TextField
                      label="Website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={!canSubmit}
                      sx={{ minWidth: 120 }}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
          <Card sx={{ mt: 3, borderRadius: '16px' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                How We Work
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">1. You send project details.</Typography>
                <Typography variant="body2">2. I reply with scope and timeline.</Typography>
                <Typography variant="body2">3. We start implementation immediately.</Typography>
              </Stack>
            </CardContent>
          </Card>
          <Card sx={{ mt: 3, borderRadius: '16px' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Quick FAQ
              </Typography>
              <Stack spacing={1.3}>
                <Typography variant="body2"><strong>Typical project start:</strong> 2-5 business days</Typography>
                <Typography variant="body2"><strong>Tech stack:</strong> React, Node.js, Express, MongoDB</Typography>
                <Typography variant="body2"><strong>Maintenance support:</strong> Available after delivery</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;