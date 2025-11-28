import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  useScrollTrigger,
  Slide
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Projects', path: '/projects' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <HideOnScroll>
      <AppBar position="sticky" color="primary" elevation={2}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Typography 
              variant="h6" 
              component={Link} 
              to="/"
              sx={{ 
                textDecoration: 'none', 
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 'bold'
              }}
            >
              <CodeIcon sx={{ mr: 1 }} />
              Marko
            </Typography>

            {/* Navigation Items */}
            <div>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  sx={{ 
                    mx: 1,
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    borderBottom: location.pathname === item.path ? '2px solid white' : 'none'
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;