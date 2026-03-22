const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const apiRoutes = require("./routes/api");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối DB
connectDB();

// Routes
app.use("/api", apiRoutes);

// Phục vụ Admin Web (sẽ implement sau)
app.use("/admin", express.static("public/admin"));

// Socket.io
io.on("connection", (socket) => {
  console.log("🟢 Một người dùng đã kết nối:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 Người dùng ${userId} đã join phòng`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, message } = data;
      
      // Lưu tin nhắn vào DB
      const newMessage = new Message({ senderId, receiverId, message });
      await newMessage.save();

      // Gửi tin nhắn đến người nhận nếu họ online
      io.to(receiverId).emit("receiveMessage", newMessage);
      // Gửi lại cho người gửi
      socket.emit("receiveMessage", newMessage);

    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Người dùng đã ngắt kết nối:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server Backend chạy tại port ${PORT}`));
