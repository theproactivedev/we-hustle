import express from 'express';
import { createJob, getJobs } from '../controllers/jobs.js';

const router = express.Router();

router.post('/new', createJob);

router.get('/', getJobs);
  
export default router;