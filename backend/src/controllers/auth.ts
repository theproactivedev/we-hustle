import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { generateToken } from "../utils/generateToken.js";

const register = async(req: Request, res: Response) => {
    try {
        const { emailAddress, password, name } = req.body;

        if(!emailAddress || !password || !name) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const userExists = await prisma.user.findUnique({
            where: { emailAddress }
        });
        if(userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
        const passwordHash = await bcrypt.hash(password, salt); // Hash the password before storing
        const newUser = await prisma.user.create({
            data: {
                emailAddress,
                password: passwordHash,
                name,
                userType: "user" // Default userType, can be changed later
            }
        });
        res.status(201).json({ message: 'User registered successfully', newUser });
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const login = async(req: Request, res: Response) => {
    try {
        const { emailAddress, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { emailAddress }
        });

        if(!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // create JWT
        const token = generateToken(res, user.id);
        res.status(200).json({ message: 'Login successful', data: {
            user:{
                id: user.id,
                emailAddress: user.emailAddress,
                name: user.name,
            },
            token
        } });
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const logout = (req: Request, res: Response) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0), // Set the cookie to expire in the past
    });
    res.status(200).json({
        message: "Logged out successfully",
    });
};

export {
    register,
    login,
    logout
}