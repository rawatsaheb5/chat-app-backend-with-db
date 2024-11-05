const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectDB } = require("./config/db");
const authRoute = require("./routes/user");
dotenv.config();
const port = process.env.PORT || 8000;

const io = new Server(server, {
  cors: {
    origin: process.env.DOMAIN_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);


app.get("/", (req, res) => {
  res.send("server is running fine ");
});

io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    socket.on("message-from-client", (message) => {
      console.log(message);
      io.emit("message-from-server", message);
    });
    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
    });
});

server.listen(port, () => {
  console.log(`The server is listening at port ${port}`);
});
