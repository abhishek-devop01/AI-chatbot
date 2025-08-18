const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/services/ai.service");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

const chatHistory = [];

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("ai-message", async (data) => {
    chatHistory.push({
      role: "user",
      parts: [
        {
          text: data,
        },
      ],
    });
    const response = await generateResponse(chatHistory);
    chatHistory.push({
      role: "model",
      parts: [
        {
          text: response,
        },
      ],
    });
    console.log(response);
    socket.emit("ai-message-response", response); 
  });
});

httpServer.listen(3000, () => {
  console.log("server is running ....");
});
