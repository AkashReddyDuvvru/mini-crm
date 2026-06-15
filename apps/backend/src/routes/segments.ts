import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all segments
router.get('/', async (req, res) => {
  try {
    const segments = await prisma.segment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(segments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch segments' });
  }
});

// Create a new segment manually (visual builder)
router.post('/', async (req, res) => {
  try {
    const { name, description, queryFilter } = req.body;
    const segment = await prisma.segment.create({
      data: {
        name,
        description,
        queryFilter
      }
    });
    res.status(201).json(segment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create segment' });
  }
});

export default router;
