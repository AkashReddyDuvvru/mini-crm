# Walkthrough Video Script (5-6 Minutes)

## 0:00 - 1:00: Product Introduction
"Hi everyone! Today I'm going to walk you through the AI-Native Mini CRM we've built for D2C brands. This isn't just a standard database—it's a marketing assistant that uses AI to help you identify audiences, draft personalized messaging, and launch campaigns across channels like WhatsApp, SMS, and Email."

## 1:00 - 2:30: Functional Demo
*Show the Dashboard*
"Here we see the main dashboard with key metrics: Total Customers, Orders, Revenue, and Active Campaigns. You can see the revenue trends over time."

*Show Segments Page*
"Let's create a segment. Instead of manually clicking through complex filters, I just type 'Find active coffee buyers who spent over ₹1,000'. The AI instantly parses this natural language prompt into a structured query and filters our database."

*Show Campaigns Page*
"Next, let's launch a campaign. I'll use the AI Campaign Assistant. I type my goal: 'Reactivate inactive users'. The AI recommends the best segment, suggests SMS as the optimal channel, and drafts a compelling message. With one click, I approve and launch it."

*Show AI Chat Agent*
"Finally, we have the conversational agent. I can ask it 'What was the delivery rate of our last WhatsApp campaign?' and it queries the database to give me an immediate answer."

## 2:30 - 3:30: Architecture & Code Walkthrough
*Show Architecture Diagram*
"Under the hood, we use Next.js for the frontend and an Express Node.js backend. We use Prisma with PostgreSQL as our data store."
"A key architectural decision was splitting the Channel Service into its own microservice. When the CRM launches a campaign, it sends the payload to this service, which simulates the asynchronous nature of real messaging providers by firing webhooks back to the CRM with delivery, open, and click events."

## 3:30 - 4:30: AI-Native Workflow Deep Dive
*Show ai.ts code*
"Our AI workflow leverages OpenAI's structured JSON outputs. By passing our database schema as context, the LLM reliably returns a Prisma-compatible JSON filter. This means the marketer's natural language directly drives the database queries without brittle regex or manual mapping."

## 4:30 - 5:30: Trade-offs & Scalability
"While this architecture is robust, we made a few trade-offs for the scope of this project. For instance, scheduled campaigns are currently handled in memory. If we scale to 1 million customers, we would introduce a distributed task queue like BullMQ or AWS SQS to handle message batching and retry logic reliably. Additionally, database indexing on `customerId` and `campaignId` ensures our webhook receivers remain performant under high load."

"Thanks for watching!"
