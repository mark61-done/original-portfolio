import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider } from './context/AuthContext'
import AdminLayout from './components/Admin/AdminLayout'
import ProtectedRoute from './components/Admin/ProtectedRoute'
import AdminLogin from './pages/Admin/Login'
import AdminRegister from './pages/Admin/Register'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminProjects from './pages/Admin/Projects'
import ProjectForm from './pages/Admin/projectForm'
import AdminMessages from './pages/Admin/Messages'
import AdminSkills from './pages/Admin/Skills'

const theme = createTheme({
  palette: {
    primary: { main: '#2563eb' },
    secondary: { main: '#1e293b' },
    background: { default: '#f8fafc' },
  },
})

function AppAdmin() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/projects"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminProjects />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/projects/new"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ProjectForm />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/projects/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ProjectForm />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/messages"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminMessages />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/skills"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminSkills />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default AppAdmin
