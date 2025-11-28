import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

// Context
import { AuthProvider } from './context/AuthContext'

// Components
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import AdminLayout from './components/Admin/AdminLayout'
import ProtectedRoute from './components/Admin/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Projects from './pages/Projects'
import About from './pages/About'
import Contact from './pages/Contact'

// Admin Pages
import AdminLogin from './pages/Admin/Login'
import AdminRegister from './pages/Admin/Register'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminProjects from './pages/Admin/Projects'
import ProjectForm from './pages/Admin/ProjectForm' // Add this import
import AdminMessages from './pages/Admin/Messages'

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#1e293b',
    },
    background: {
      default: '#f8fafc',
    },
  },
})

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* Public Routes with Navbar & Footer */}
            <Routes>
              <Route path="/admin/*" element={
                // Admin routes - no navbar/footer
                <AdminRoutes />
              } />
              <Route path="*" element={
                // All other routes - with navbar/footer
                <PublicRoutes />
              } />
            </Routes>
            
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

// Separate component for Public Routes (with Navbar/Footer)
function PublicRoutes() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

// Separate component for Admin Routes (no Navbar/Footer)
function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/register" element={<AdminRegister />} />
      
      {/* Protected Admin Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/projects" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminProjects />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/projects/new" element={
        <ProtectedRoute>
          <AdminLayout>
            <ProjectForm />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/projects/edit/:id" element={
        <ProtectedRoute>
          <AdminLayout>
            <ProjectForm />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/messages" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminMessages />
          </AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App