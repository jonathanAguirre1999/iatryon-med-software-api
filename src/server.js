import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import { connectDatabase } from "./config/database.js";
import app from "./app.js";
import { registerSocketEvents } from "./sockets/socket.events.js";
import { setIO } from "./sockets/socket.instance.js";

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

setIO(io);
registerSocketEvents(io);

await connectDatabase();

httpServer.listen(PORT, async () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
