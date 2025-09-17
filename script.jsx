// server.js
import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer, {
    path: '/socket.io',  // Ensure the path matches the client config
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (msg) => {
      console.log('Message received:', msg);
      io.emit('chat message', msg);  // Broadcast to all clients
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  // Let Next.js handle page routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, () => {
    console.log('> Server running on http://localhost:3000');
  });
});
