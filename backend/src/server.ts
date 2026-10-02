import express from 'express';
import type { Request, Response } from 'express';
import { config } from 'dotenv';

// Import Routes
import jobsRouter from './routes/jobs';

config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5001;

// Middleware to parse JSON payloads
app.use(express.json());

// Basic Route with typed request and response parameters
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from TypeScript and Express!' });
});

// API Routes
app.use('/api/jobs', jobsRouter);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ message: 'Hello from TypeScript, Express, and React!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
