import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import { connectDatabase } from "./config/database.js";
import app from "./app.js";
import { registerSocketEvents } from "./sockets/socket.events.js";
import { setIO } from "./sockets/socket.instance.js";

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

setIO(io);
registerSocketEvents(io);

await connectDatabase();

httpServer.listen(PORT, async () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
