# 🤖 AI Integration Guide - Parent-Teen Bridge

Complete guide to integrate and use the AI emotion analysis features in your app.

## 📚 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Frontend Setup](#frontend-setup)
4. [Backend Setup](#backend-setup)
5. [Integration Steps](#integration-steps)
6. [API Reference](#api-reference)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The AI integration adds sophisticated emotion detection and empathetic response generation to your Parent-Teen Bridge app. It uses:

- **Frontend**: React components for displaying emotions and insights
- **Backend**: Express API with OpenAI/Anthropic integration
- **Services**: Emotion analysis, insight generation, conversation analysis

### Key Features
✅ Emotion detection from messages  
✅ Sentiment analysis with intensity levels  
✅ Crisis detection & escalation  
✅ Empathetic response suggestions  
✅ Conversation pattern analysis  
✅ Connection scoring  

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│          React Frontend (Port 5173)                  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  MessageAnalyzer Component                   │  │
│  │  - Displays EmotionBadge                     │  │
│  │  - Shows InsightCard                         │  │
│  └──────────────────────────────────────────────┘  │
│                      ↓                               │
│  ┌──────────────────────────────────────────────┐  │
│  │  useEmotionAnalysis Hook                     │  │
│  │  - Manages state & analysis logic            │  │
│  └──────────────────────────────────────────────┘  │
│                      ↓                               │
│  ┌──────────────────────────────────────────────┐  │
│  │  API Service (api.ts)                        │  │
│  │  - HTTP requests to backend                  │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                      ↓ (HTTP/JSON)
┌─────────────────────────────────────────────────────┐
│      Express Backend API (Port 3001)                │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  Routes                                      │  │
│  │  - POST /api/analyze                         │  │
│  │  - POST /api/stream-insight                  │  │
│  │  - POST /api/analyze-conversation            │  │
│  └──────────────────────────────────────────────┘  │
│                      ↓                               │
│  ┌──────────────────────────────────────────────┐  │
│  │  Services                                    │  │
│  │  - emotionAnalyzer.ts (AI calls)             │  │
│  │  - insightGenerator.ts (AI response gen)     │  │
│  └──────────────────────────────────────────────┘  │
│                      ↓ (API calls)                  │
│  ┌──────────────────────────────────────────────┐  │
│  │  AI Providers                                │  │
│  │  - OpenAI (GPT-4 Turbo)                      │  │
│  │  - OR Anthropic (Claude 3.5 Sonnet)          │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Frontend Setup

### 1. Install Dependencies

Your frontend already has React 18.3.1 and required libraries installed. Just verify:

```bash
cd connect-my-fam-main
npm install
```

**Key packages already available:**
- `react` - UI framework
- `react-router-dom` - Routing
- `zod` - Schema validation
- `lucide-react` - Icons
- `tailwindcss` - Styling

### 2. Files Already Created

```
src/
├── components/
│   ├── EmotionBadge.tsx          # 🎨 Emotion display
│   ├── InsightCard.tsx            # 💡 AI insight display
│   └── MessageAnalyzer.tsx        # 🔍 Main analyzer component
├── hooks/
│   └── useEmotionAnalysis.ts      # 🪝 React hook
├── services/
│   ├── emotionAnalyzer.ts         # 📊 Local emotion detection
│   ├── aiInsights.ts              # ✨ Insight generation
│   └── api.ts                     # 🌐 Backend communication
└── ...
```

### 3. Environment Variables

Create `.env.local` in `connect-my-fam-main/`:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_ENVIRONMENT=development
```

---

## Backend Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

Create `.env.local` in `server/`:

```env
# Required: Choose ONE AI provider
OPENAI_API_KEY=sk-proj-your-key-here
# OR
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Server Config
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
AI_PROVIDER=openai
```

### 3. Get API Keys

**OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy and paste in `.env.local`

**Anthropic (Alternative):**
1. Go to https://console.anthropic.com
2. Create new API key
3. Copy and paste in `.env.local`
4. Set `AI_PROVIDER=anthropic`

### 4. Start Backend Server

```bash
cd server
npm run dev
```

Expected output:
```
🚀 AI Emotion Analysis Server running on http://localhost:3001
🔑 CORS enabled for http://localhost:5173
🤖 AI Provider: openai
```

---

## Integration Steps

### Step 1: Use MessageAnalyzer in Your Chat Component

```typescript
import { MessageAnalyzer } from '@/components/MessageAnalyzer';

export function ChatMessage({ message, role }) {
  return (
    <div className="p-4 bg-white rounded-lg">
      <p className="text-gray-800">{message.content}</p>
      
      {/* Add emotion analysis below message */}
      <MessageAnalyzer 
        message={message.content}
        role={role}
        onAnalysisComplete={(emotion) => {
          console.log(`Detected emotion: ${emotion}`);
        }}
      />
    </div>
  );
}
```

### Step 2: Use Hook Directly in Custom Components

```typescript
import { useEmotionAnalysis } from '@/hooks/useEmotionAnalysis';

export function CustomAnalyzer() {
  const { analysis, insight, loading, analyzeMessage } = useEmotionAnalysis();

  const handleAnalyze = async () => {
    await analyzeMessage("I'm really frustrated right now", 'teen');
  };

  return (
    <div>
      <button onClick={handleAnalyze}>Analyze</button>
      {loading && <p>Analyzing...</p>}
      {analysis && <p>Emotion: {analysis.primary_emotion}</p>}
      {insight && <p>Suggestion: {insight.suggested_response}</p>}
    </div>
  );
}
```

### Step 3: Add Conversation Analysis Page (Optional)

```typescript
import { analyzeConversation } from '@/services/api';

export function ConversationInsights({ messages }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyzeConversation = async () => {
    setLoading(true);
    try {
      const result = await analyzeConversation(messages);
      setAnalysis(result);
    } finally {
      setLoading(false);
    }
  };

  if (!analysis) {
    return (
      <button onClick={handleAnalyzeConversation}>
        Analyze Full Conversation
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded">
        <h3 className="font-bold">Summary</h3>
        <p>{analysis.summary}</p>
      </div>
      
      <div className="p-4 bg-green-50 rounded">
        <h3 className="font-bold">Connection Score</h3>
        <p className="text-2xl font-bold">{analysis.connection_score}/100</p>
      </div>

      <div className="p-4 bg-yellow-50 rounded">
        <h3 className="font-bold">Recommendations</h3>
        <ul className="list-disc pl-5">
          {analysis.recommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

---

## API Reference

### POST /api/analyze

Analyze a single message and get emotion + insight.

**Request:**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I hate everything about school",
    "role": "teen"
  }'
```

**Response:**
```json
{
  "analysis": {
    "primary_emotion": "anger",
    "secondary_emotions": ["overwhelm"],
    "sentiment_score": -0.8,
    "intensity": "high",
    "requires_support": true,
    "key_phrases": ["hate", "everything"],
    "confidence": 0.95
  },
  "insight": {
    "for_receiver": "They're feeling frustrated. This is important.",
    "context_note": "Your teen is experiencing high-intensity negative emotions.",
    "suggested_response": "I hear you hate school right now. That sounds really overwhelming. Let's talk about what's making you feel this way.",
    "empathy_tip": "Listen without judgment first. Try to understand their perspective.",
    "should_escalate": false
  }
}
```

### POST /api/stream-insight

Stream real-time insights using Server-Sent Events (SSE).

**Request:**
```bash
curl -X POST http://localhost:3001/api/stream-insight \
  -H "Content-Type: application/json" \
  -d '{"message": "I am worried", "role": "teen"}'
```

**Response (SSE):**
```
data: {"type":"analysis","data":{...}}

data: {"type":"insight","data":{...}}
```

### POST /api/analyze-conversation

Analyze full conversation for patterns and connection.

**Request:**
```bash
curl -X POST http://localhost:3001/api/analyze-conversation \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"sender": "teen", "content": "I am stressed"},
      {"sender": "parent", "content": "Tell me what's wrong"},
      {"sender": "teen", "content": "Everything feels too much"}
    ]
  }'
```

**Response:**
```json
{
  "summary": "3 messages exchanged with mixed tone. Primary emotion: overwhelm.",
  "patterns": ["Teen expressing concerns", "Emotional shift from worry to overwhelm"],
  "recommendations": [
    "Consider taking a break and revisiting this conversation later",
    "Focus on validating feelings before offering solutions"
  ],
  "connection_score": 72
}
```

---

## Testing

### Test Frontend Components

```typescript
// In your test file
import { render, screen, waitFor } from '@testing-library/react';
import { MessageAnalyzer } from '@/components/MessageAnalyzer';

describe('MessageAnalyzer', () => {
  it('displays emotion badge', async () => {
    render(<MessageAnalyzer message="I'm angry" role="teen" />);
    
    await waitFor(() => {
      expect(screen.getByText(/anger/i)).toBeInTheDocument();
    });
  });
});
```

### Test Backend Endpoints

```bash
# Health check
curl http://localhost:3001/health

# Analyze happy message
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"message":"I am so happy today!","role":"teen"}'

# Analyze sad message
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"message":"I feel really lonely and sad","role":"parent"}'

# Crisis detection
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"message":"I want to hurt myself","role":"teen"}'
```

### Manual Testing Checklist

- [ ] Frontend loads without errors
- [ ] Backend server starts successfully
- [ ] `/health` endpoint responds
- [ ] `/api/analyze` accepts requests and returns analysis
- [ ] Emotion badges display correctly
- [ ] Insight cards show suggestions
- [ ] Crisis keywords trigger escalation
- [ ] Console shows no errors

---

## Troubleshooting

### "Cannot POST /api/analyze" (404 Error)

**Issue:** Backend not running or wrong URL  
**Solution:**
```bash
# Make sure backend is running
cd server
npm run dev

# Check it's accessible
curl http://localhost:3001/health
```

### "CORS error" in browser console

**Issue:** Frontend can't reach backend  
**Solution:** Update `.env.local` in server:
```env
CLIENT_URL=http://localhost:5173
```

### "API key not found" error

**Issue:** Missing AI provider key  
**Solution:**
```bash
# Get OpenAI key from https://platform.openai.com/api-keys
# Add to server/.env.local
OPENAI_API_KEY=sk-proj-...
```

### "Invalid JSON response"

**Issue:** AI response parsing failed  
**Solution:**
- Check AI provider quotas/limits
- Verify API key is valid
- Check server logs for details

### "MessageAnalyzer component not showing"

**Issue:** Component not imported or backend down  
**Solution:**
```typescript
import { MessageAnalyzer } from '@/components/MessageAnalyzer';
// Make sure backend is running
// Check browser DevTools Network tab
```

---

## Next Steps

### 🎨 Customize UI
- Modify `EmotionBadge.tsx` colors and styles
- Update `InsightCard.tsx` layout
- Add animations with Tailwind

### 🔐 Add Authentication
- Secure API endpoints with tokens
- Store user preferences
- Track emotion history

### 📊 Add Analytics
- Log emotion trends
- Dashboard with insights
- Export conversation reports

### 🚀 Deploy
- Deploy backend to Vercel/Railway/Render
- Deploy frontend to Vercel/Netlify
- Set production API keys

---

## Support Resources

- **OpenAI Docs**: https://platform.openai.com/docs
- **Anthropic Docs**: https://docs.anthropic.com
- **Express.js**: https://expressjs.com
- **React**: https://react.dev
- **Zod**: https://zod.dev

---

**Happy coding! 🚀 Remember: Better understanding, not monitoring!**
