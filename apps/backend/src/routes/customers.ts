import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        orders: true
      },
      take: 100
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

router.post('/', async (req, res) => {
  try {
    const customer = await prisma.customer.create({
      data: req.body
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

export default router;
