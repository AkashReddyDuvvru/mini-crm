import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const prisma = new PrismaClient();

import customersRouter from './routes/customers';
import segmentsRouter from './routes/segments';
import campaignsRouter from './routes/campaigns';
import webhooksRouter from './routes/webhooks';
import aiRouter from './routes/ai';

app.use(cors());
app.use(express.json());

app.use('/api/customers', customersRouter);
app.use('/api/segments', segmentsRouter);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/webhooks', webhooksRouter);
app.use('/api/ai', aiRouter);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Seed Endpoint (to generate fake data)
app.post('/api/seed', async (req, res) => {
  try {
    // Generate some fake customers and orders
    const customers = [];
    for (let i = 0; i < 50; i++) {
      customers.push({
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        phone: `+1555${Math.floor(1000000 + Math.random() * 9000000)}`,
        age: 18 + Math.floor(Math.random() * 40),
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
        totalSpend: Math.random() * 1000,
      });
    }

    await prisma.customer.createMany({
      data: customers,
      skipDuplicates: true,
    });

    res.status(200).json({ message: 'Seeded 50 customers' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Seed failed' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
