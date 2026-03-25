import connectDb from "./db/index.js";
import { app } from "./app.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import { socketHandler } from "./utils/socketHandler.js";

dotenv.config({
  path: "./.env",
});

const startServer = async () => {
  try {
    await connectDb();
    console.log("MONGODB CONNECTED");

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    socketHandler(io);

    const PORT = process.env.PORT || 2000;
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Server Startup failed: ", error);
    process.exit(1);
  }
};

startServer();
