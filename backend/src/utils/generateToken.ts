import type { Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";

const generateToken = (res: Response, userId: string) => {
  const payload = { id: userId };
  const expiresIn = (process.env.JWT_EXPIRES_IN || "1h") as NonNullable<SignOptions["expiresIn"]>;
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    { expiresIn },
  );
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Adjust based on your needs
    maxAge: 1000 * 60 * 60, // 1 hour
  });
  return token;
};

export {
  generateToken,
};
