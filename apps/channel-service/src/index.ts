import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL || 'http://localhost:4000/api/webhooks/receipts';

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'channel-service-ok' });
});

app.post('/simulate-send', (req, res) => {
  const { recipient, message, channel, communicationId } = req.body;
  
  if (!communicationId) {
    return res.status(400).json({ error: 'communicationId is required' });
  }

  // Respond immediately acknowledging receipt
  res.status(202).json({ status: 'Accepted for delivery' });

  // Simulate delivery process asynchronously
  setTimeout(async () => {
    // Random probabilities for events
    const isDelivered = Math.random() > 0.1; // 90% delivery rate
    if (!isDelivered) {
      await sendWebhook(communicationId, 'Failed');
      return;
    }
    
    await sendWebhook(communicationId, 'Delivered');

    // Simulate opening (if applicable, e.g. Email/WhatsApp)
    if (channel !== 'SMS' && Math.random() > 0.4) {
      setTimeout(async () => {
        await sendWebhook(communicationId, 'Opened');
        
        // Simulate clicking
        if (Math.random() > 0.6) {
          setTimeout(async () => {
            await sendWebhook(communicationId, 'Clicked');
            
            // Simulate conversion
            if (Math.random() > 0.8) {
              setTimeout(async () => {
                await sendWebhook(communicationId, 'Converted');
              }, 1000 + Math.random() * 2000);
            }
          }, 1000 + Math.random() * 2000);
        }
      }, 1000 + Math.random() * 3000);
    }
  }, 1000 + Math.random() * 2000);
});

async function sendWebhook(communicationId: string, status: string) {
  try {
    await axios.post(CRM_WEBHOOK_URL, {
      communicationId,
      status,
      timestamp: new Date().toISOString()
    });
    console.log(`Webhook sent: ${communicationId} -> ${status}`);
  } catch (error) {
    console.error(`Failed to send webhook for ${communicationId}: ${error}`);
  }
}

app.listen(port, () => {
  console.log(`Channel Service running on port ${port}`);
});
