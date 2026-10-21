import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma.js";
import { generateToken } from "../utils/generateToken.js";

const register = async(req: Request, res: Response) => {
  try {
    const { emailAddress, password, name } = req.body;

    if(!emailAddress || !password || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userExists = await prisma.user.findUnique({
      where: { emailAddress },
    });
    if(userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
    const passwordHash = await bcrypt.hash(password, salt); // Hash the password before storing
    const newUser = await prisma.user.create({
      data: {
        emailAddress,
        password: passwordHash,
        name,
        userType: "user", // Default userType, can be changed later
      },
    });

    // create JWT
    const token = generateToken(res, newUser.id);
    res.status(201).json(
      {
        message: "Login successful",
        data: {
          user:{
            id: newUser.id,
            emailAddress: newUser.emailAddress,
            name: newUser.name,
          },
          token,
        },
      },
    );
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async(req: Request, res: Response) => {
  try {
    const { emailAddress, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { emailAddress },
    });

    if(!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // create JWT
    const token = generateToken(res, user.id);
    res.status(200).json({ message: "Login successful", data: {
      user:{
        id: user.id,
        emailAddress: user.emailAddress,
        name: user.name,
      },
      token,
    } });
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Set the cookie to expire in the past
  });
  res.status(200).json({
    message: "Logged out successfully",
  });
};

const getCurrentUser = async (req: Request, res: Response) => {
  let token = null;
  const authHeader = req.headers.authorization;

  if(authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if(req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if(!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    const user = await prisma.user.findUnique({
      where: { id: (decoded as { id: string }).id },
    });

    if(!user) {
      res.status(401).json({ message: "Unauthorized: User no longer exists" });
    }

    res.status(200).json({
      message: "Authenticated user successfully!",
      data: {
        user:{
          id: user?.id,
          emailAddress: user?.emailAddress,
          name: user?.name,
        },
      },
    });
  } catch(error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Internal Server Error" });
  }
};

export {
  getCurrentUser,
  login,
  logout,
  register};
