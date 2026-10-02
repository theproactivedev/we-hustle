import express from 'express';

const router = express.Router();

router.get('/jobs', (req, res) => {
  return res.json({ message: 'Hello from the jobs route!' });
});

export default router;