# Parent-Teen Bridge AI Backend

Backend API for emotion analysis and empathetic response generation.

## Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and add your API keys:
```bash
cp .env.example .env.local
```

**Required:**
- `OPENAI_API_KEY` (from https://platform.openai.com/api-keys)
- OR `ANTHROPIC_API_KEY` (from https://console.anthropic.com)

**Optional:**
- `PORT` - Server port (default: 3001)
- `AI_PROVIDER` - 'openai' or 'anthropic' (default: openai)

### 3. Run Development Server
```bash
npm run dev
```

Server will start at `http://localhost:3001`

## API Endpoints

### POST `/api/analyze`
Analyze a single message for emotions and generate insights.

**Request:**
```json
{
  "message": "I'm so frustrated with everything",
  "role": "teen"
}
```

**Response:**
```json
{
  "analysis": {
    "primary_emotion": "anger",
    "secondary_emotions": ["overwhelm"],
    "sentiment_score": -0.7,
    "intensity": "high",
    "requires_support": true,
    "key_phrases": ["frustrated"],
    "confidence": 0.95
  },
  "insight": {
    "for_receiver": "Understanding the emotional context...",
    "context_note": "They need support",
    "suggested_response": "I hear you're frustrated...",
    "empathy_tip": "Give them space first...",
    "should_escalate": false
  }
}
```

### POST `/api/stream-insight`
Stream real-time insight generation (SSE).

**Request:**
```json
{
  "message": "I'm worried about the test tomorrow",
  "role": "teen"
}
```

### POST `/api/analyze-conversation`
Analyze a full conversation for patterns and connection score.

**Request:**
```json
{
  "messages": [
    {"sender": "teen", "content": "I'm stressed about school"},
    {"sender": "parent", "content": "Tell me what's wrong"},
    {"sender": "teen", "content": "Everything feels overwhelming"}
  ]
}
```

**Response:**
```json
{
  "summary": "3 messages exchanged with mixed tone...",
  "patterns": ["Teen expressing concerns"],
  "recommendations": ["Focus on validating feelings..."],
  "connection_score": 65
}
```

## Testing

### Health Check
```bash
curl http://localhost:3001/health
```

### Analyze Message
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"message":"I hate everything","role":"teen"}'
```

## Architecture

```
server/
├── src/
│   ├── server.ts              # Express app setup
│   ├── middleware/
│   │   └── errorHandler.ts    # Error handling
│   ├── services/
│   │   ├── emotionAnalyzer.ts # AI emotion detection
│   │   └── insightGenerator.ts# AI response generation
│   └── routes/
│       ├── emotionAnalysis.ts # Emotion API endpoints
│       └── conversation.ts     # Conversation analysis
├── package.json
├── tsconfig.json
└── .env.example
```

## AI Providers

### OpenAI (Recommended)
- Model: `gpt-4-turbo-preview`
- Get key: https://platform.openai.com/api-keys
- Costs: Pay-as-you-go (watch usage)

### Anthropic (Alternative)
- Model: `claude-3-5-sonnet-20241022`
- Get key: https://console.anthropic.com
- Costs: Competitive pricing

## Development

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Production
```bash
npm run build
npm start
```
