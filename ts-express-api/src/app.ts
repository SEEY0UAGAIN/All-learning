import "reflect-metadata";
import express from "express";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/", authRoutes);
app.use(errorHandler);

export default app;
