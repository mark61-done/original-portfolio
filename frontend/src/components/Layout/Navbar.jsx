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
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: 72 }}>
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
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              <CodeIcon sx={{ mr: 1 }} />
              Marko Portfolio
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
                    mx: 0.5,
                    px: 1.8,
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    borderRadius: 2,
                    bgcolor: location.pathname === item.path ? 'rgba(255,255,255,0.14)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.16)',
                    },
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