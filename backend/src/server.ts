import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import "tsconfig-paths/register";
import connectDB from "@/config/dbConfig";
import authRoutes from "@/routes/auth.route";
import userRoutes from "@/routes/user.route";
import messageRoutes from "@/routes/message.route";
import authMiddleware from "@/middlewares/authMiddleware";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Security Middleware
app.use(helmet());

// Logging Middleware
app.use(morgan("combined"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/messages", authMiddleware, messageRoutes);

// Secure route
app.get("/api/secure", authMiddleware, (req, res) => {
  res.status(200).json({ success: true, message: "Secure route accessed" });
});

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
