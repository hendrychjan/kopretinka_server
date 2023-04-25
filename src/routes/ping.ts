// Test the server status and functionality
import express, { Request, Response } from "express";
import { adminAuth } from "../middleware/adminAuth";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send(`Running on ${process.env.NODE_ENV} environment`);
});

router.get("/auth", adminAuth, (req: Request, res: Response) => {
  res.send("Admin key authenticated!");
});

module.exports = router;