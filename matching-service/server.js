import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { formatMessage } from "./utils/message.js";
import { userLeave, getRoomUsers, userJoin, getCurrentUser } from "./utils/users.js";
import { leaveRoom, locateRoom } from "./utils/rooms.js";

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
  // Join a room with username and specified room
  socket.on("joinRoom", ({ username, room }) => {
    // Find an empty/currently occupied room for user
    var assignedRoom = locateRoom(room);
    const user = userJoin(socket.id, username, assignedRoom);
    // console.log(user);
    socket.join(user.room);
    // Welcome current user
    socket.emit("message", formatMessage(username, "Welcome to PeerPrep Chat App"));
    // console.log(assignedRoom);
    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${username} has joined the chat`));

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chat messages
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    console.log("user left: " + socket.id);
    if (user) {
      io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`));
      leaveRoom(user.room);
      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

httpServer.listen(8000, () => {
  console.log("listening on *:8000");
});
