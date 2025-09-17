# My App - Socket.IO Implementation

## Overview

This project is a Socket.IO implementation built using Next.js, Express, React, and TailwindCSS.
It serves as a solid foundation for adding real-time communication features to your web application, such as chat functionality, notifications, or live updates.

## 🚀 Features

- Real-time communication using **Socket.IO**.
- Built on **Next.js** and **Express**.
- Form handling with **React Hook Form**.
- TailwindCSS for styling.
- Data management with **Mongoose** and MongoDB.
- Type-safe validation using **Zod**.

## ⚡ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sushil-up/socket
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🚧 Available Scripts

- **Development mode**:

  ```bash
  npm run dev
  ```

  Runs the server in development mode using `server.js`.

- **Build for production**:

  ```bash
  npm run build
  ```

- **Start in production mode**:
  ```bash
  npm run start
  ```

## ⚙️ Configuration

Ensure you have a running MongoDB instance for the database connection.  
Update environment variables as needed in a `.env` file (example not provided here).

## 📚 Dependencies

Key dependencies used in the project:

- `express`, `socket.io`, `mongoose`, `next`, `react`, `react-dom`, `react-hook-form`, `zod`, `tailwindcss`

## 💡 Notes

This project is a starter template for adding **Socket.IO functionality** in a Next.js + Express environment.

---

This project is designed as a starter template to help you quickly integrate Socket.IO functionality into a Next.js + Express application.

## ⚡ Example server.js

```bash

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


```

### Environment Variables

Create a .env.local file in the project root:

```bash
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

```

NEXT_PUBLIC_SOCKET_URL: URL used by the client to connect to Socket.IO server.
PORT: Port where Express and Next.js serve the application.

This structure ensures clarity, correctness, and easier onboarding for other developers.
Add any additional environment variables and instructions depending on your specific needs.
