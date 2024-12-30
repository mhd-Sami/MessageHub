const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const chats = require("./data");
const connectDB = require("./config/db");
const color = require("colors");
const PORT = process.env.PORT || 5000;
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const generateToken = require("./config/generateToken");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const cors = require("cors");
const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`.blue.bold.underline)
);
connectDB();

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Api is listening");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server2 = require("http").createServer(app);
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    // origin: "http://localhost:3000",
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log("conncted to socket.io".blue.bold.underline);
  socket.on("setup", (userData) => {
    // console.log("in setup");
    socket.join(userData._id);
    socket.emit("connected");
    // console.log(userData._id);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    console.log("in new message 1");

    if (!chat.users) return console.log("chat.users not defined");
    console.log("in new message 2");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      console.log("in new message 3");

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
