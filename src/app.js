import express from "express";
import "dotenv/config";
import { connectDatabase } from "./config/database.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//routes
app.use("/api/users", userRoutes);

app.use(errorHandler);

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server up at: http://localhost:${PORT}`);
  });
}

startServer();
