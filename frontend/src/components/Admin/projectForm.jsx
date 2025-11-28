// // src/components/admin/ProjectForm.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Box,
//   FormControlLabel,
//   Checkbox,
//   Chip,
//   Alert
// } from '@mui/material';
// import { Save, ArrowBack } from '@mui/icons-material';
// import { useNavigate, useParams } from 'react-router-dom';
// import { adminProjectsAPI } from '../../services/api';

// const ProjectForm = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEdit = Boolean(id);
  
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     technologies: [],
//     githubUrl: '',
//     liveUrl: '',
//     featured: false,
//     category: 'web'
//   });
  
//   const [techInput, setTechInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     if (isEdit) {
//       fetchProject();
//     }
//   }, [id]);

//   const fetchProject = async () => {
//     try {
//       const response = await adminProjectsAPI.getById(id);
//       const project = response.data.data;
//       setFormData({
//         title: project.title || '',
//         description: project.description || '',
//         technologies: project.technologies || [],
//         githubUrl: project.githubUrl || '',
//         liveUrl: project.liveUrl || '',
//         featured: project.featured || false,
//         category: project.category || 'web'
//       });
//     } catch (error) {
//       setError('Error loading project');
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleAddTechnology = () => {
//     if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         technologies: [...prev.technologies, techInput.trim()]
//       }));
//       setTechInput('');
//     }
//   };

//   const handleRemoveTechnology = (techToRemove) => {
//     setFormData(prev => ({
//       ...prev,
//       technologies: prev.technologies.filter(tech => tech !== techToRemove)
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       if (isEdit) {
//         await adminProjectsAPI.update(id, formData);
//         setSuccess('Project updated successfully!');
//       } else {
//         await adminProjectsAPI.create(formData);
//         setSuccess('Project created successfully!');
//         setFormData({
//           title: '',
//           description: '',
//           technologies: [],
//           githubUrl: '',
//           liveUrl: '',
//           featured: false,
//           category: 'web'
//         });
//       }
      
//       setTimeout(() => {
//         navigate('/admin/projects');
//       }, 1500);
//     } catch (error) {
//       setError(error.response?.data?.message || 'Error saving project');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//         <Button
//           startIcon={<ArrowBack />}
//           onClick={() => navigate('/admin/projects')}
//           sx={{ mr: 2 }}
//         >
//           Back
//         </Button>
//         <Typography variant="h4">
//           {isEdit ? 'Edit Project' : 'Create New Project'}
//         </Typography>
//       </Box>

//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//       {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

//       <Card>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               label="Project Title"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//               margin="normal"
//             />
            
//             <TextField
//               fullWidth
//               label="Description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//               multiline
//               rows={4}
//               margin="normal"
//             />

//             <Box sx={{ mt: 2, mb: 2 }}>
//               <Typography variant="h6" gutterBottom>Technologies</Typography>
//               <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
//                 <TextField
//                   size="small"
//                   label="Add Technology"
//                   value={techInput}
//                   onChange={(e) => setTechInput(e.target.value)}
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter') {
//                       e.preventDefault();
//                       handleAddTechnology();
//                     }
//                   }}
//                 />
//                 <Button onClick={handleAddTechnology} variant="outlined">
//                   Add
//                 </Button>
//               </Box>
              
//               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                 {formData.technologies.map((tech, index) => (
//                   <Chip
//                     key={index}
//                     label={tech}
//                     onDelete={() => handleRemoveTechnology(tech)}
//                     color="primary"
//                     variant="outlined"
//                   />
//                 ))}
//               </Box>
//             </Box>

//             <TextField
//               fullWidth
//               label="GitHub URL"
//               name="githubUrl"
//               value={formData.githubUrl}
//               onChange={handleChange}
//               margin="normal"
//             />

//             <TextField
//               fullWidth
//               label="Live Demo URL"
//               name="liveUrl"
//               value={formData.liveUrl}
//               onChange={handleChange}
//               margin="normal"
//             />

//             <TextField
//               fullWidth
//               select
//               label="Category"
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               margin="normal"
//               SelectProps={{
//                 native: true,
//               }}
//             >
//               <option value="web">Web Development</option>
//               <option value="mobile">Mobile Development</option>
//               <option value="desktop">Desktop Applications</option>
//               <option value="other">Other</option>
//             </TextField>

//             <FormControlLabel
//               control={
//                 <Checkbox
//                   name="featured"
//                   checked={formData.featured}
//                   onChange={handleChange}
//                 />
//               }
//               label="Featured Project"
//               sx={{ mt: 2 }}
//             />

//             <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 startIcon={<Save />}
//                 disabled={loading}
//                 size="large"
//               >
//                 {loading ? 'Saving...' : (isEdit ? 'Update Project' : 'Create Project')}
//               </Button>
              
//               <Button
//                 variant="outlined"
//                 onClick={() => navigate('/admin/projects')}
//               >
//                 Cancel
//               </Button>
//             </Box>
//           </form>
//         </CardContent>
//       </Card>
//     </Container>
//   );
// };

// export default ProjectForm;