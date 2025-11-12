// safetrack-api/src/index.ts
import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import tickets from "./tickets";


const app = express();

// middleware
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 60_000,
    max: 100,
  })
);

// mount routers
app.use("/api/tickets", tickets);

// health checks (add BOTH so either path works)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "SafeTrack API running ✅" });
});
app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "SafeTrack API running ✅" });
});

// start
const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
