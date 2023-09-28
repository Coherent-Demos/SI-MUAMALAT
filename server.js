// server.js

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'broadcast.html'));
});

app.get('/broadcast', (req, res) => {
    res.sendFile(path.join(publicPath, 'broadcast.html'));
});

app.get('/backstage', (req, res) => {
    res.sendFile(path.join(publicPath, 'backstage.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('updateContent', (content) => {
        io.emit('updateContent', content);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`WebSocket server is at ${SERVER_URL}`);
});
