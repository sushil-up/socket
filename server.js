const { createServer } = require("http");
const express = require("express");
const { Server } = require("socket.io");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const messages = []; // Store messages in-memory

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Send all previous messages to the new client
    socket.emit("previous messages", messages);

    // Listen for new chat messages
    socket.on("chat message", (msg) => {
      console.log("Message received:", msg);

      const messageData = {
        text: msg,
        timestamp: new Date().toISOString(),
      };

      messages.push(messageData); // Save in memory
      io.emit("chat message", messageData); // Broadcast to all clients
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  server.use((req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, () => {
    console.log("> Server running on http://localhost:3000");
  });
});
