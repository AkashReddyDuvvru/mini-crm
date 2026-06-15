# Architecture

```mermaid
graph TD
    User([Marketer]) --> Frontend[Next.js Frontend (Vercel)]
    Frontend --> Backend[Express API (Render/Railway)]
    Frontend --> AI[OpenAI API]
    
    Backend --> DB[(PostgreSQL)]
    Backend --> OpenAI[OpenAI API]
    
    Backend -- "Dispatch Messages" --> ChannelService[Channel Service (Microservice)]
    ChannelService -- "Async Webhooks" --> Backend
```

## ER Diagram

```mermaid
erDiagram
    Customer ||--o{ Order : places
    Customer ||--o{ Communication : receives
    Segment ||--o{ Campaign : "used by"
    Campaign ||--o{ Communication : "sends"
    Communication ||--o{ CommunicationEvent : "generates"

    Customer {
        string id PK
        string email UK
        string name
        float totalSpend
    }
    Segment {
        string id PK
        json queryFilter
    }
    Campaign {
        string id PK
        string status
        string channel
    }
    Communication {
        string id PK
        string status
    }
    CommunicationEvent {
        string id PK
        string status
    }
```

## Sequence Diagram: Campaign Lifecycle

```mermaid
sequenceDiagram
    participant Marketer
    participant CRM_Backend
    participant Channel_Service
    
    Marketer->>CRM_Backend: POST /campaigns (Create & Run)
    CRM_Backend->>CRM_Backend: Query Segment Customers
    CRM_Backend->>CRM_Backend: Create Communications (Pending)
    
    loop For each customer
        CRM_Backend->>Channel_Service: POST /simulate-send (recipient, message, commId)
        Channel_Service-->>CRM_Backend: 202 Accepted
    end
    
    CRM_Backend-->>Marketer: 201 Campaign Running
    
    Note over Channel_Service: Simulates delay...
    Channel_Service->>CRM_Backend: POST /webhooks/receipts (Delivered)
    CRM_Backend->>CRM_Backend: Update Communication status
    
    Note over Channel_Service: Simulates delay...
    Channel_Service->>CRM_Backend: POST /webhooks/receipts (Opened)
    CRM_Backend->>CRM_Backend: Update Communication status
```
