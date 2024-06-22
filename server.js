const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In-memory storage for images metadata
let images = [];

app.post('/upload', upload.single('image'), (req, res) => {
  const newImage = {
    url: `/uploads/${req.file.filename}`,
    link: req.body.link,
    alt: req.body.alt,
    name: req.body.name,
  };
  images.push(newImage);
  io.emit('newImage', newImage);
  res.status(200).send(newImage);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('initialImages', images);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
