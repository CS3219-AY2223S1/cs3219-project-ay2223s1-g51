import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { formatMessage } from "./utils/message.js";
import { userLeave, getRoomUsers, userJoin, getCurrentUser } from "./utils/users.js";
import { leaveRoom, locateRoom } from "./utils/rooms.js";
import axios from "axios";

import "dotenv/config";

const PORT = process.env.PORT || 8000;

const __dirname = path.resolve(path.dirname(""));
const app = express();
const httpServer = createServer(app);

// Set static folder
app.use(express.static(path.join(__dirname, "user")));
const botName = "Admin";

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("socket_id connected: " + socket.id);

  // If code changes, broadcast to sockets
  socket.on("code-change", (msg) => {
    socket.broadcast.to(socket.room).emit("code-update", msg);
  });

  // Join a room with username and specified room
  socket.on("join-room", ({ username, room }) => {
    // Find an empty/currently occupied room for user
    var assignedRoom = locateRoom(room);
    const user = userJoin(socket.id, username, assignedRoom);
    // console.log(user);
    socket.join(user.room);
    socket.room = user.room;

    // Welcome current user
    socket.emit("receive-message", formatMessage(username, "Welcome to PeerPrep Chat App"));
    // console.log(assignedRoom);
    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit("receive-message", formatMessage(botName, `${username} has joined the chat`));

    // Send users and room info
    io.to(user.room).emit("joined-users", { room: user.room, users: getRoomUsers(user.room) });
  });

  // Listen for chat messages
  socket.on("sendMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("receive-message", formatMessage(user.username, msg));
  });

  // If language changes, broadcast to sockets
  socket.on("language-change", (msg) => {
    io.sockets.in(socket.room).emit("language-update", msg);
  });

  // If title changes, broadcast to sockets
  socket.on("title-change", (msg) => {
    io.sockets.in(socket.room).emit("title-update", msg);
  });

  // If input box changes, broadcast to sockets
  socket.on("input-change", (msg) => {
    io.sockets.in(socket.room).emit("input-update", msg);
  });

  // If input box changes, broadcast to sockets
  socket.on("output-change", (msg) => {
    io.sockets.in(socket.room).emit("output-update", msg);
  });

  // If input box changes, broadcast to sockets
  socket.on("stats-change", (msg) => {
    io.sockets.in(socket.room).emit("stats-update", msg);
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    console.log("user left: " + socket.id);
    if (user) {
      io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`));
      leaveRoom(user.room);
      // Send users and room info
      io.to(user.room).emit("joined-users", { room: user.room, users: getRoomUsers(user.room) });
    }
  });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

app.post("/execute", async (req, res) => {
  console.log(req.body);
  const { script, language, stdin, versionIndex } = req.body;

  const response = await axios({
    method: "POST",
    url: process.env.JDOODLE_URL,
    data: {
      script: script,
      stdin: stdin,
      language: language,
      versionIndex: versionIndex,
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    },
    responseType: "json",
  });

  console.log("RESPONSE from jdoodle--->" + response.data);
  res.json(response.data);
});
httpServer.listen(PORT, () => {
  console.log("listening on *:8000");
});
