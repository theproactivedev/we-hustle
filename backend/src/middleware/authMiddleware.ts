import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma.js";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];

  if(!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if(typeof decoded !== "object" || typeof decoded.id !== "string") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if(!user) {
      return res.status(401).json({ message: "Unauthorized: User no longer exists" });
    }

    req.user = { id: user.id };
    next();
  } catch(error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Internal Server Error" });
  }
};

export default authMiddleware;
