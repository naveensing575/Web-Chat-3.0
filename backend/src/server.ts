import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/dbConfig";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import messageRoutes from "./routes/message.route";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// Error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    res.status(status).json({ success: false, status, message });
  }
);

// Start the server
const port = process.env.PORT ?? 4000;

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  await connectDB();
});
