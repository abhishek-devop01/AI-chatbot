const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/services/ai.service");
const httpServer = createServer(app);
const io = new Server(httpServer, {

});

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on('ai-message', async (data)=>{
     const response = await generateResponse(data.prompt)
     console.log(response);
     socket.emit('ai-message-response',{response})
     
  })
});

httpServer.listen(3000, () => {
  console.log("server is running ....");
});
