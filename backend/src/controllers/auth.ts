import bcrypt from "bcrypt";
import type { Request, Response } from "express";

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
    const token = generateToken(newUser.id);
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
    const token = generateToken(user.id);
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
  res.status(200).json({
    message: "Logged out successfully",
  });
};

const getCurrentUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if(!userId) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if(!user) {
      return res.status(401).json({ message: "Unauthorized: User no longer exists" });
    }

    return res.status(200).json({
      message: "Authenticated user successfully!",
      data: {
        user:{
          id: user?.id,
          emailAddress: user?.emailAddress,
          name: user?.name,
        },
      },
    });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ message: "Error getting the current user" });
  }
};

export {
  getCurrentUser,
  login,
  logout,
  register};
