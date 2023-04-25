import { Request, Response } from "express";

export function adminAuth(req: Request, res: Response, next: Function) {
  if (!req.headers["admin-key"]) {
    res.status(400).send("Invalid admin key");
    return;
  }

  if (req.headers["admin-key"] !== process.env.ADMIN_KEY) {
    res.status(400).send("Invalid admin key");
    return;
  }

  next();
};