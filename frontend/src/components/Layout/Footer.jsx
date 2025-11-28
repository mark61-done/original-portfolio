import React from 'react';
import { Box, Container, Typography, IconButton } from '@mui/material';
import { GitHub, LinkedIn, Email } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">
            © {new Date().getFullYear()} marko olando oloo. All rights reserved.
          </Typography>
          
          <Box>
            <IconButton color="inherit" href="https://github.com/mark61-done/mark61-done.git" target="_blank">
              <GitHub />
            </IconButton>
            <IconButton color="inherit" href="https://www.linkedin.com/in/marko-olando-898528389?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank">
              <LinkedIn />
            </IconButton>
            <IconButton color="inherit" href="./contact" >
              <Email />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;