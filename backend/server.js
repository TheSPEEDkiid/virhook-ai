const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory');
}

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('📁 Created data directory');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Keep original filename with timestamp to avoid conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept audio files only
    const allowedTypes = /mp3|wav|m4a|flac|aac|ogg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only audio files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: fileFilter
});

// Routes
app.use('/api/audio', require('./routes/audio'));

// Upload endpoint
app.post('/api/upload', upload.single('audio'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: 'No audio file uploaded',
                supportedFormats: ['MP3', 'WAV', 'M4A', 'FLAC', 'AAC', 'OGG']
            });
        }

        console.log('📁 File uploaded successfully:', req.file.filename);
        
        res.json({
            success: true,
            message: 'Audio file uploaded successfully! 🎵',
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            uploadedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Upload error:', error);
        res.status(500).json({ 
            error: 'Failed to upload file',
            message: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: '🚀 ViralHook AI Server is running!',
        timestamp: new Date().toISOString(),
        version: '3.0.0-enterprise',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🎵 Welcome to ViralHook AI Enterprise!',
        version: '3.0.0',
        endpoints: {
            health: '/api/health',
            upload: '/api/upload',
            analyze: '/api/audio/analyze',
            intelligence: '/api/audio/viral-intelligence'
        }
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large',
                message: 'Audio file must be under 50MB',
                maxSize: '50MB'
            });
        }
    }
    
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n🚀 ViralHook AI Enterprise Server Started!');
    console.log('📡 Server:', `http://localhost:${PORT}`);
    console.log('💚 Health Check:', `http://localhost:${PORT}/api/health`);
    console.log('📁 Upload Endpoint:', `http://localhost:${PORT}/api/upload`);
    console.log('🎯 Analysis Endpoint:', `http://localhost:${PORT}/api/audio/analyze`);
    console.log('🧠 Intelligence Endpoint:', `http://localhost:${PORT}/api/audio/viral-intelligence`);
    console.log('\nReady to analyze music and predict viral potential! 🎵✨\n');
});

module.exports = app;