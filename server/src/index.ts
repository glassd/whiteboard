import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { setupSocketHandlers } from "./socket/index.js";
import { RoomManager } from "./rooms/manager.js";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types.js";

const app = express();
const httpServer = createServer(app);

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : ["http://localhost:5173"];

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  object,
  SocketData
>(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Room manager instance
const roomManager = new RoomManager();

// Setup socket handlers
setupSocketHandlers(io, roomManager);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Whiteboard server running on http://localhost:${PORT}`);
});
