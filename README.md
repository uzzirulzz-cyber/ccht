# OmniChat

All AI models in one place. Access GPT-4o, Claude 3.5, Gemini 1.5 Pro, and more from a single unified interface.

## Features

- **13 AI Models** — GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo, Claude 3.5 Sonnet, Claude 3 Opus, Gemini 1.5 Pro, Gemini 1.5 Flash, Llama 3.1, Mistral, Groq, Perplexity, DeepSeek, Command R+
- **Real API Integration** — Connects to OpenAI, Anthropic, and Google APIs (server-side, keys hidden)
- **Demo Mode** — Models without API keys show realistic demo responses
- **One-Click Switch** — Instantly switch between models mid-conversation
- **Markdown & Code** — Full syntax highlighting, tables, lists, blockquotes
- **Quick Prompts** — Pre-built starters on the welcome screen
- **Export Chat** — Download conversations as `.txt` files
- **Mobile Responsive** — Collapsible sidebar, touch-friendly

## Deploy to Vercel

### 1. Clone & Setup

```bash
git clone https://github.com/yourusername/omnichat.git
cd omnichat
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
OPENAI_API_KEY=sk-your-key
ANTHROPIC_API_KEY=sk-ant-your-key
GOOGLE_API_KEY=your-google-key
```

### 3. Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

### 4. Deploy to Vercel

```bash
vercel --prod
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for auto-deploys.

### 5. Add Environment Variables on Vercel

Go to your Vercel project → **Settings** → **Environment Variables** and add:

| Name | Value |
|------|-------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `GOOGLE_API_KEY` | Your Google AI Studio key |

## Supported Models

### Real API Models (requires API key)
| Model | Provider | ID |
|-------|----------|-----|
| GPT-4o | OpenAI | `gpt4o` |
| GPT-4 Turbo | OpenAI | `gpt4` |
| GPT-3.5 Turbo | OpenAI | `gpt35` |
| Claude 3.5 Sonnet | Anthropic | `claude3` |
| Claude 3 Opus | Anthropic | `claude3opus` |
| Gemini 1.5 Pro | Google | `gemini` |
| Gemini 1.5 Flash | Google | `geminiFlash` |

### Demo Models (simulated responses)
| Model | Provider | ID |
|-------|----------|-----|
| Llama 3.1 405B | Meta | `llama` |
| Mistral Large | Mistral AI | `mistral` |
| Mixtral 8x22B | Groq | `groq` |
| Perplexity Online | Perplexity | `perplexity` |
| DeepSeek Coder | DeepSeek | `deepseek` |
| Command R+ | Cohere | `command` |

## Architecture

```
app/
├── api/chat/route.ts     # API route - handles model routing & provider calls
├── page.tsx              # Main chat UI (React Client Component)
├── layout.tsx            # Root layout with fonts
└── globals.css           # CSS variables & base styles
```

## Tech Stack

- **Next.js 14** — App Router, API Routes
- **React 18** — Client-side interactivity
- **TypeScript** — Type safety
- **OpenAI SDK** — GPT models
- **Anthropic SDK** — Claude models
- **Google Generative AI SDK** — Gemini models
- **Marked** — Markdown rendering
- **Highlight.js** — Code syntax highlighting

## License

MIT
