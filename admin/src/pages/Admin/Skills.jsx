import React, { useEffect, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, CircularProgress, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import { adminSkillsAPI } from '../../services/api'

const emptySkill = { name: '', category: 'frontend', proficiency: 50 }

function AdminSkills() {
  const [skills, setSkills] = useState([])
  const [form, setForm] = useState(emptySkill)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await adminSkillsAPI.getAll()
      setSkills(response?.data?.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load skills')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) return

    try {
      setSaving(true)
      setError('')
      await adminSkillsAPI.create({
        name: form.name.trim(),
        category: form.category,
        proficiency: Number(form.proficiency),
      })
      setForm(emptySkill)
      await fetchSkills()
      setSaving(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add skill')
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setError('')
      await adminSkillsAPI.delete(id)
      setSkills((prev) => prev.filter((skill) => skill._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete skill')
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Skills Management
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Add and maintain the skills shown on your portfolio.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3, borderRadius: '14px' }}>
        <CardContent>
          <form onSubmit={handleCreate}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Skill Name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
              <TextField
                fullWidth
                select
                label="Category"
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              >
                <MenuItem value="frontend">Frontend</MenuItem>
                <MenuItem value="backend">Backend</MenuItem>
                <MenuItem value="tools">Tools</MenuItem>
                <MenuItem value="database">Database</MenuItem>
                <MenuItem value="soft">Soft</MenuItem>
              </TextField>
              <TextField
                fullWidth
                type="number"
                label="Proficiency (%)"
                inputProps={{ min: 1, max: 100 }}
                value={form.proficiency}
                onChange={(event) => setForm((prev) => ({ ...prev, proficiency: event.target.value }))}
              />
              <Button type="submit" variant="contained" startIcon={<Add />} disabled={saving}>
                {saving ? 'Saving...' : 'Add Skill'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {skills.map((skill) => (
          <Grid key={skill._id} xs={12} md={6}>
            <Card sx={{ borderRadius: '12px' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">{skill.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {skill.category} - {skill.proficiency}%
                  </Typography>
                </Box>
                <Button
                  color="error"
                  variant="outlined"
                  size="small"
                  startIcon={<Delete />}
                  onClick={() => handleDelete(skill._id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default AdminSkills

