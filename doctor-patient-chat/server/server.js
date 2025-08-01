require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');
const speechRoutes = require('./routes/speech');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/speech', speechRoutes);

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000} // 10MB limit
}).single('audio');

// @route   POST api/upload
// @desc    Upload an audio file and get translation
// @access  Private
app.post('/api/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ msg: 'Error uploading file', error: err });
    }
    if (req.file == undefined) {
      return res.status(400).json({ msg: 'No file selected!' });
    }

    const filePath = req.file.path;
    const language = req.body.language || 'en'; // Default to English
    const pythonScriptPath = path.join(__dirname, '..', '..', 'API', 'main.py');

    console.log(`Executing Python script: python3 ${pythonScriptPath} ${filePath} ${language}`);

    // Check if python script exists
    if (!fs.existsSync(pythonScriptPath)) {
      console.error('Python script not found at:', pythonScriptPath);
      return res.status(500).json({ msg: 'Audio processing script not found' });
    }

    // Check if the uploaded file exists
    if (!fs.existsSync(filePath)) {
        console.error('Uploaded file not found at:', filePath);
        return res.status(500).json({ msg: 'Uploaded audio file not found' });
    }

    console.log(`Starting Python process with command: python3 "${pythonScriptPath}" "${filePath}" "${language}"`);
    
    const pythonProcess = exec(
      `python3 "${pythonScriptPath}" "${filePath}" "${language}"`,
      { 
        maxBuffer: 1024 * 5000,
        env: { ...process.env, PYTHONUNBUFFERED: '1' } // Ensure Python output is not buffered
      },
      (error, stdout, stderr) => {
        console.log('Python script execution completed');
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
        console.log('error:', error);
        
        // If there was an error, log more details
        if (error) {
          console.error('Python execution error details:', {
            code: error.code,
            signal: error.signal,
            cmd: error.cmd,
            killed: error.killed,
            spawnargs: error.spawnargs
          });
        }
      
      if (error) {
        console.error(`Python execution error: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        return res.status(500).json({ 
          msg: 'Error processing audio file', 
          error: error.message, 
          stderr: stderr,
          stdout: stdout
        });
      }
      
      if (stderr && !stdout) {
        console.error(`Python stderr output: ${stderr}`);
        return res.status(500).json({ 
          msg: 'Error in audio processing script', 
          stderr: stderr,
          stdout: stdout
        });
      }

      res.json({
        msg: 'File uploaded and processed!',
        filePath: `/uploads/${req.file.filename}`,
        translation: stdout.trim(),
      });
    });
  });
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory at: ${uploadsDir}`);
} else {
  console.log(`Using uploads directory at: ${uploadsDir}`);
}

// Serve static files from the uploads directory with proper path resolution
app.use('/api/uploads', express.static(uploadsDir));

// Route to handle file download with proper content type
app.get('/api/uploads/:filename', (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    // Get the file extension
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    // Set appropriate content type based on file extension
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case '.xls':
        contentType = 'application/vnd.ms-excel';
        break;
      case '.xlsx':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case '.txt':
        contentType = 'text/plain';
        break;
    }
    
    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
    
    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    // Handle errors
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      res.status(500).send('Error downloading file');
    });
  } else {
    console.error(`File not found: ${filePath}`);
    res.status(404).send('File not found');
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join a conversation
  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation: ${conversationId}`);
  });

  // Handle new messages
  socket.on('sendMessage', (message) => {
    io.to(message.conversationId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
