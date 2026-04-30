import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import prisma, { connectDB } from "./config/database.js";

// Load env vars
dotenv.config({ path: "./.env" });

// Import routes
import authRoutes from "./routes/authRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import mentorshipRoutes from "./routes/mentorshipRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/ai", aiRoutes);

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Socket.io Middleware for Authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

// Socket.io Connection Logic
io.on("connection", (socket) => {
  console.log(`User connected to socket: ${socket.userId}`);

  // Join a personal room for notifications/direct messages
  socket.join(`user_${socket.userId}`);

  // Join a specific conversation room
  socket.on("join_conversation", (conversationId) => {
    socket.join(`conversation_${conversationId}`);
  });

  // Handle typing indicator
  socket.on("typing", ({ conversationId, isTyping }) => {
    socket.to(`conversation_${conversationId}`).emit("typing", {
      userId: socket.userId,
      isTyping
    });
  });

  // Handle sending a message
  socket.on("send_message", async (data) => {
    try {
      const { conversationId, content, receiverId } = data;

      // Save message to database
      const message = await prisma.message.create({
        data: {
          conversationId,
          senderId: socket.userId,
          content,
          isRead: false
        },
        include: {
          sender: { select: { id: true, name: true, avatar: true } }
        }
      });

      // Update conversation updatedAt timestamp
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
      });

      // Broadcast to the conversation room
      io.to(`conversation_${conversationId}`).emit("receive_message", message);

      // Also emit to the receiver's personal room for overall notifications if they aren't in the chat
      socket.to(`user_${receiverId}`).emit("new_message_notification", {
        conversationId,
        message
      });
    } catch (error) {
      console.error("Error sending message via socket:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected from socket: ${socket.userId}`);
  });
});

const PORT = process.env.PORT || 5000;

// Connect to DB then start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
