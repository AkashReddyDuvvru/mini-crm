import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/receipts', async (req, res) => {
  const { communicationId, status, timestamp } = req.body;

  if (!communicationId || !status) {
    return res.status(400).json({ error: 'communicationId and status are required' });
  }

  try {
    // 1. Log the event
    await prisma.communicationEvent.create({
      data: {
        communicationId,
        status,
        rawPayload: req.body
      }
    });

    // 2. Update the communication's latest status
    await prisma.communication.update({
      where: { id: communicationId },
      data: { status }
    });

    res.status(200).json({ message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
