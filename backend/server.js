const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const audioRoutes = require('./routes/audio');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - these are like security guards and helpers for our app
app.use(cors()); // Allows different websites to talk to our app
app.use(express.json()); // Helps our app understand JSON data
app.use(express.static('public')); // Serves static files like images

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log('Created uploads directory');
}

// This sets up file uploading - where music files will be stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files go in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Gives each file a unique name
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB maximum file size
  }
});

// Health check - tells us if the app is working
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ViralHook AI Server is running! 🚀',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// This is what happens when someone uploads a music file
app.post('/api/upload', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file uploaded' });
  }

  console.log('🎵 File uploaded:', req.file.filename);
  
  res.json({
    message: 'File uploaded successfully! 🎉',
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    path: req.file.path
  });
});

// Use the audio analysis routes
app.use('/api/audio', audioRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ViralHook AI! 🎵',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      upload: '/api/upload (POST)'
    }
  });
});

// If something goes wrong, this handles it
app.use((error, req, res, next) => {
  console.error('❌ Error:', error.message);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: error.message 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ViralHook AI Server is running!');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Upload Endpoint: http://localhost:${PORT}/api/upload`);
  console.log('');
  console.log('Ready to analyze music and find viral hooks! 🎵✨');
  console.log('');
});