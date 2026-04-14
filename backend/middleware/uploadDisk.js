const multer = require('multer');
const path = require('path');
const fs = require('fs');

const projectsDir = path.join(__dirname, '..', 'uploads', 'projects');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(projectsDir)) fs.mkdirSync(projectsDir, { recursive: true });
    cb(null, projectsDir);
  },
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname || '');
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const uploadProjectImage = multer({ storage });

module.exports = { uploadProjectImage, projectsDir };
