import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import { CloudUpload, Delete, Image } from '@mui/icons-material';

const ImageUpload = ({ onImageChange, currentImage }) => {
  const [preview, setPreview] = useState(currentImage || '');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      // Pass file to parent
      onImageChange(file);
    }
  }, [onImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeImage = () => {
    setPreview('');
    onImageChange(null);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Project Image
      </Typography>
      
      {preview ? (
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Box
            component="img"
            src={preview}
            alt="Project preview"
            sx={{
              width: '100%',
              maxWidth: 300,
              height: 200,
              objectFit: 'cover',
              borderRadius: 1,
              border: '2px dashed #ddd'
            }}
          />
          <IconButton
            onClick={removeImage}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'error.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'error.dark'
              }
            }}
            size="small"
          >
            <Delete />
          </IconButton>
        </Box>
      ) : (
        <Paper
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover'
            }
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
          <Typography variant="body1" gutterBottom>
            {isDragActive ? 'Drop the image here...' : 'Drag & drop an image here'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to select a file
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Supports: JPG, PNG, GIF, WebP (Max 5MB)
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ImageUpload;