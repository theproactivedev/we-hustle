import type { Request, Response } from "express";

import { prisma } from '../lib/prisma.js';

const getJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await prisma.job.findMany();
        return res.status(200).json({ message: 'Jobs retrieved successfully', jobs });
    } catch (error) {
        console.error('Error retrieving jobs:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const createJob = async (req: Request, res: Response) => {
    try {
        const { title, description, company, location, jobType, salary, postedById } = req.body;
        
        if(!title || !description || !company || !location || !jobType || !postedById) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newJob = await prisma.job.create({
            data: {
                title,
                description,
                company,
                location,
                jobType,
                salary,
                postedById
            },
            include: {
                postedBy: true
            }
        });

        return res.status(201).json({ message: 'Job created successfully', job: newJob });

    } catch(error) {
        console.error('Error creating job:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export {
    getJobs,
    createJob
}