import { Request, Response } from "express";

export function productCode(req: Request, res: Response, next: Function) {
  if (!req.headers["product-code"]) {
    res.status(400).send("Invalid product code");
    return;
  }

  next();
};