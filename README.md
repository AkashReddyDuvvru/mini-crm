# AI-Native Mini CRM

A complete marketing CRM for consumer brands that leverages AI for natural language audience segmentation, campaign generation, and a conversational chat interface.

## Features
- **Visual & AI Segmentation**: Create audience segments manually or by typing a natural language prompt (e.g., "Inactive beauty customers").
- **Multi-channel Campaigns**: Schedule and launch campaigns across WhatsApp, SMS, Email, and RCS.
- **AI Campaign Assistant**: Get channel, message, and timing recommendations for your target goals.
- **AI Chat Agent**: Conversational interface to query metrics and generate campaigns.
- **Webhook Integration**: Robust tracking of delivery, open, and click receipts from a simulated channel service.

## Tech Stack
- Frontend: Next.js App Router, Tailwind, shadcn/ui, Recharts
- Backend: Node.js, Express, Prisma, PostgreSQL
- AI: OpenAI (`gpt-4o`)
- Infrastructure: Docker (local dev), Vercel (Frontend), Render/Railway (Backend)

## Local Setup
1. Clone the repository.
2. Run `npm install` at the root.
3. Start local Postgres using Docker: `docker compose up -d` (If you have Docker) or provide a `DATABASE_URL` in `.env`.
4. Run `npx prisma generate` and `npx prisma db push` inside `packages/database`.
5. Start services:
   - Backend: `cd apps/backend && npm run dev`
   - Channel Service: `cd apps/channel-service && npm run dev`
   - Frontend: `cd apps/frontend && npm run dev`

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string.
- `OPENAI_API_KEY`: OpenAI API key.
- `CRM_WEBHOOK_URL`: (Channel Service) URL of the CRM webhook endpoint.

## Architecture & Trade-offs
- **Microservices**: The Channel service is split to simulate decoupled architectures where third-party APIs handle message delivery asynchronously.
- **Polling vs Webhooks**: Webhooks were preferred to simulate real-world integrations.
- **Trade-offs**: For simplicity in this demo, cron jobs for "Scheduled" campaigns are simulated via `setTimeout`, and actual message queues (like Redis/BullMQ) are omitted. At 1 million customers, we would need to implement SQS or BullMQ to handle the batch processing of communications rather than an in-memory loop.
