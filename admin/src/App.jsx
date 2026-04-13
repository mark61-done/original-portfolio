import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider } from '../../frontend/src/context/AuthContext'
import AdminLayout from '../../frontend/src/components/Admin/AdminLayout'
import ProtectedRoute from '../../frontend/src/components/Admin/ProtectedRoute'
import AdminLogin from '../../frontend/src/pages/Admin/Login'
import AdminRegister from '../../frontend/src/pages/Admin/Register'
import AdminDashboard from '../../frontend/src/pages/Admin/Dashboard'
import AdminProjects from '../../frontend/src/pages/Admin/Projects'
import ProjectForm from '../../frontend/src/pages/Admin/projectForm'
import AdminMessages from '../../frontend/src/pages/Admin/Messages'
import AdminSkills from '../../frontend/src/pages/Admin/Skills'

const theme = createTheme({
  palette: {
    primary: { main: '#2563eb' },
    secondary: { main: '#1e293b' },
    background: { default: '#f8fafc' },
  },
})

function App() {
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

export default App
