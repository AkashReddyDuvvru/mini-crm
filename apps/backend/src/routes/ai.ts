import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const router = Router();
const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Natural Language Segmentation
router.post('/segment', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that translates natural language into structured filters for a customer database. The fields are: age, gender, city, totalSpend, lastPurchaseDate. Return a JSON object with a queryFilter suitable for Prisma."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const queryFilter = JSON.parse(response.choices[0].message.content || "{}");

    // Save segment
    const segment = await prisma.segment.create({
      data: {
        name: `AI Segment: ${prompt.substring(0, 30)}`,
        queryFilter,
        prompt
      }
    });

    res.json({ segment, queryFilter });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to generate segment' });
  }
});

// Campaign Assistant
router.post('/campaign-assistant', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert marketing CRM assistant. Recommend an audience segment description, the best channel (WhatsApp, SMS, Email, RCS), timing, and draft a message for the campaign based on the prompt. Return JSON with keys: recommendedSegment, channel, message, timingSuggestion, explanation."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const recommendation = JSON.parse(response.choices[0].message.content || "{}");
    res.json(recommendation);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate campaign recommendation' });
  }
});

// Chat Agent
router.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI marketing assistant. You help the user manage their CRM. You can answer questions, generate segments, and recommend campaigns based on the data. For now, simply respond conversationally to their prompt and pretend you are executing actions in the background."
        },
        { role: "user", content: prompt }
      ]
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Chat failed' });
  }
});

export default router;
