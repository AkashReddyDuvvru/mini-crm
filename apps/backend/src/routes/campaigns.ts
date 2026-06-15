import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: { segment: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Create and launch campaign
router.post('/', async (req, res) => {
  const { name, segmentId, channel, message, schedule } = req.body;
  try {
    const campaign = await prisma.campaign.create({
      data: {
        name,
        segmentId,
        channel,
        message,
        schedule: schedule ? new Date(schedule) : null,
        status: schedule ? 'Scheduled' : 'Running'
      }
    });

    if (!schedule) {
      // Trigger campaign dispatch logic (for demo, we simulate it asynchronously)
      // Normally this would be a background job
      setTimeout(() => dispatchCampaign(campaign.id), 1000);
    }

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

async function dispatchCampaign(campaignId: string) {
  // 1. Fetch campaign and segment
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { segment: true }
  });

  if (!campaign) return;

  // 2. Fetch customers matching segment (simplified logic)
  const customers = await prisma.customer.findMany({ take: 50 }); // Demo limit

  // 3. Create communications
  for (const customer of customers) {
    const communication = await prisma.communication.create({
      data: {
        campaignId: campaign.id,
        customerId: customer.id,
        status: 'Pending'
      }
    });

    // 4. Send to Channel Service
    try {
      // Fire and forget to channel service
      fetch('http://localhost:4001/simulate-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: customer.phone || customer.email,
          message: campaign.message,
          channel: campaign.channel,
          communicationId: communication.id
        })
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Update campaign status
  await prisma.campaign.update({
    where: { id: campaign.id },
    data: { status: 'Completed' }
  });
}

export default router;
