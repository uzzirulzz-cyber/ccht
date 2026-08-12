'use client';

import { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';

interface Model {
  id: string;
  name: string;
  provider: string;
  icon: string;
  color: string;
  status: string;
  description: string;
  apiModelId: string;
}

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
  model: Model;
  timestamp: Date;
}

const models: Model[] = [
  { id: 'gpt4o', name: 'GPT-4o', provider: 'OpenAI', icon: '🤖', color: '#10b981', status: 'online', description: 'Most capable multimodal model', apiModelId: 'gpt4o' },
  { id: 'gpt4', name: 'GPT-4 Turbo', provider: 'OpenAI', icon: '🧠', color: '#059669', status: 'online', description: 'Advanced reasoning model', apiModelId: 'gpt4' },
  { id: 'gpt35', name: 'GPT-3.5 Turbo', provider: 'OpenAI', icon: '⚡', color: '#047857', status: 'online', description: 'Fast and cost-effective', apiModelId: 'gpt35' },
  { id: 'claude3', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', icon: '📚', color: '#f59e0b', status: 'online', description: 'Excellent for reasoning and analysis', apiModelId: 'claude3' },
  { id: 'claude3opus', name: 'Claude 3 Opus', provider: 'Anthropic', icon: '🎭', color: '#d97706', status: 'online', description: 'Most capable Claude model', apiModelId: 'claude3opus' },
  { id: 'gemini', name: 'Gemini 1.5 Pro', provider: 'Google', icon: '🔮', color: '#3b82f6', status: 'online', description: 'Long context window champion', apiModelId: 'gemini' },
  { id: 'geminiFlash', name: 'Gemini 1.5 Flash', provider: 'Google', icon: '⚡', color: '#2563eb', status: 'online', description: 'Fast Gemini variant', apiModelId: 'geminiFlash' },
  { id: 'llama', name: 'Llama 3.1 405B', provider: 'Meta', icon: '🦙', color: '#8b5cf6', status: 'demo', description: 'Open source powerhouse (demo)', apiModelId: 'llama' },
  { id: 'mistral', name: 'Mistral Large', provider: 'Mistral AI', icon: '🌪️', color: '#ec4899', status: 'demo', description: 'Efficient European model (demo)', apiModelId: 'mistral' },
  { id: 'groq', name: 'Mixtral 8x22B', provider: 'Groq', icon: '⚡', color: '#f97316', status: 'demo', description: 'Ultra-fast inference (demo)', apiModelId: 'groq' },
  { id: 'perplexity', name: 'Perplexity Online', provider: 'Perplexity', icon: '🔍', color: '#06b6d4', status: 'demo', description: 'Real-time web search (demo)', apiModelId: 'perplexity' },
  { id: 'deepseek', name: 'DeepSeek Coder', provider: 'DeepSeek', icon: '💻', color: '#14b8a6', status: 'demo', description: 'Specialized for coding (demo)', apiModelId: 'deepseek' },
  { id: 'command', name: 'Command R+', provider: 'Cohere', icon: '📋', color: '#6366f1', status: 'demo', description: 'Enterprise-grade RAG (demo)', apiModelId: 'command' },
];

const DEMO_MODELS = ['llama', 'mistral', 'groq', 'perplexity', 'deepseek', 'command'];

export default function Home() {
  const [currentModel, setCurrentModel] = useState<Model>(models[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hljs = require('highlight.js');
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 2500);
  };

  const selectModel = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (model) {
      setCurrentModel(model);
      showToast(`Switched to ${model.name}`);
      if (window.innerWidth <= 768) setSidebarOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const autoResize = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  const sendQuickPrompt = (text: string) => {
    setInputValue(text);
    setTimeout(() => {
      if (inputRef.current) {
        autoResize(inputRef.current);
        inputRef.current.focus();
      }
    }, 0);
  };

  const callRealAPI = async (modelId: string, chatMessages: any[]) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelId, messages: chatMessages }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    const data = await response.json();
    return data.content;
  };

  const getDemoResponse = (modelId: string, userText: string): string => {
    const responses: Record<string, string> = {
      llama: `As **Llama 3.1 405B**, the open-source model from Meta, I'm happy to help with "${userText.substring(0, 50)}..."!

## Open-Source Perspective

One of the advantages of open models like me is transparency and flexibility:

### Benefits
- ✅ **Fully open weights** - inspect and modify as needed
- ✅ **Local deployment** - run on your own infrastructure
- ✅ **No API costs** - unlimited usage after download
- ✅ **Customizable** - fine-tune for your specific domain

\`\`\`python
# Self-hosted inference
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Meta-Llama-3.1-405B"
)
# Run completely offline!
\`\`\`

The open-source community continues to push boundaries. What would you like to explore?`,

      mistral: `As **Mistral Large**, I bring a European perspective to your question about "${userText.substring(0, 50)}...".

## Efficient Analysis

Mistral models are designed for efficiency without sacrificing capability:

### Architecture Highlights
- **Sparse attention** for long sequences
- **Rolling buffer cache** for optimal memory usage
- **Sliding window** pattern for extended context

\`\`\`python
# Efficient inference example
from mistral_inference import generate

prompt = "${userText.substring(0, 30)}..."
response = generate(prompt, max_tokens=500)
print(response)
\`\`\`

Our models punch above their weight class. Let me know how I can assist further!`,

      groq: `As **Mixtral 8x22B** running on **Groq** hardware, I'm responding at lightning speed! ⚡

## Speed Demonstration

Your query "${userText.substring(0, 50)}..." was processed in mere milliseconds thanks to:

- **LPUs** (Language Processing Units) - purpose-built AI chips
- **Deterministic latency** - consistent response times
- **High throughput** - handle massive concurrent loads

### Performance Comparison

| Platform | Tokens/Second |
|----------|---------------|
| Traditional GPU | ~50-100 |
| Groq LPU | **~500+** |

This speed enables real-time applications that were previously impossible. What real-time use case are you building?`,

      perplexity: `As **Perplexity Online**, I've searched the web for the latest information on "${userText.substring(0, 50)}...".

## Search Results

Here are the most relevant and recent findings:

### Sources
1. [Wikipedia](https://wikipedia.org) - Comprehensive overview and background
2. [Recent Research Paper (2024)](https://arxiv.org) - Latest academic insights
3. [Industry Blog](https://example.com) - Practical implementation guide

### Key Findings
- The field has evolved significantly in the past 6 months
- New methodologies have emerged that improve efficiency by 40%
- Several open-source implementations are now available

> ⚠️ **Disclaimer**: Information is sourced from the web and may require verification for critical applications.

Would you like me to search for more specific aspects of this topic?`,

      deepseek: `As **DeepSeek Coder**, I'm specialized in programming tasks. Let me help with "${userText.substring(0, 50)}...".

## Code Solution

\`\`\`python
# Optimized implementation
def solve_problem(input_data):
    """
    Solve the given problem efficiently.
    Time Complexity: O(n log n)
    Space Complexity: O(n)
    """
    # Step 1: Parse and validate input
    validated = validate_input(input_data)

    # Step 2: Process with efficient algorithm
    result = optimized_algorithm(validated)

    # Step 3: Return formatted output
    return format_output(result)

# Example usage
if __name__ == "__main__":
    data = load_data("input.txt")
    print(solve_problem(data))
\`\`\`

### Explanation
- Uses efficient data structures for optimal performance
- Includes comprehensive error handling
- Follows PEP 8 style guidelines

Need me to explain any part or convert to another language?`,

      command: `As **Command R+** from Cohere, I excel at enterprise tasks and retrieval-augmented generation.

## Enterprise Analysis

For your query "${userText.substring(0, 50)}...", here's my structured response:

### Business Context
This appears relevant to enterprise workflows. Let me provide a professional analysis:

| Metric | Assessment |
|--------|-----------|
| Complexity | Medium |
| Implementation Time | 2-4 weeks |
| ROI Potential | High |

### Recommended Approach

1. **Discovery Phase** - Gather requirements and constraints
2. **Design Phase** - Architecture and planning
3. **Implementation** - Agile development cycles
4. **Deployment** - Staged rollout with monitoring

\`\`\`python
# Enterprise integration example
from cohere import Client

client = Client(api_key="your_key")
response = client.chat(
    message="${userText.substring(0, 30)}...",
    model="command-r-plus",
    connectors=[{"id": "web-search"}]  # RAG capability
)
\`\`\`

Shall I prepare a detailed implementation plan?`
    };
    return responses[modelId] || responses['llama'];
  };

  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
      model: currentModel,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    setIsTyping(true);

    try {
      let content: string;

      if (DEMO_MODELS.includes(currentModel.id)) {
        await new Promise(r => setTimeout(r, 1500 + Math.random() * 1500));
        content = getDemoResponse(currentModel.id, text);
      } else {
        const apiMessages = messages.concat(userMsg).map(m => ({
          role: m.role,
          content: m.content,
        }));
        content = await callRealAPI(currentModel.apiModelId, apiMessages);
      }

      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'ai',
        content,
        model: currentModel,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: Date.now() + 1,
        role: 'ai',
        content: `**Error:** ${error.message || 'Something went wrong. Please check your API key configuration.'}\n\nMake sure you've set the environment variable for ${currentModel.provider} in your Vercel project settings.`,
        model: currentModel,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const newChat = () => {
    setMessages([]);
    showToast('New chat started');
  };

  const clearChat = () => {
    if (messages.length === 0) return;
    if (confirm('Clear all messages?')) newChat();
  };

  const copyMessage = (id: number) => {
    const msg = messages.find(m => m.id === id);
    if (msg) {
      navigator.clipboard.writeText(msg.content.replace(/\*\*|\*|`|#|>/g, ''));
      showToast('Copied to clipboard');
    }
  };

  const regenerateMessage = async (id: number) => {
    const index = messages.findIndex(m => m.id === id);
    if (index > 0) {
      const prevMessages = messages.slice(0, index);
      setMessages(prevMessages);
      setIsTyping(true);

      try {
        let content: string;
        const lastUserMsg = prevMessages[prevMessages.length - 1];

        if (DEMO_MODELS.includes(currentModel.id)) {
          await new Promise(r => setTimeout(r, 1500 + Math.random() * 1500));
          content = getDemoResponse(currentModel.id, lastUserMsg.content);
        } else {
          const apiMessages = prevMessages.map(m => ({
            role: m.role,
            content: m.content,
          }));
          content = await callRealAPI(currentModel.apiModelId, apiMessages);
        }

        const aiMsg: Message = {
          id: Date.now() + 1,
          role: 'ai',
          content,
          model: currentModel,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMsg]);
      } catch (error: any) {
        showToast('Regeneration failed: ' + error.message);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const rateMessage = (id: number, direction: string) => {
    showToast(direction === 'up' ? 'Thanks for the feedback!' : "Thanks, we'll improve!");
  };

  const exportChat = () => {
    if (messages.length === 0) {
      showToast('No messages to export');
      return;
    }
    const text = messages.map(m =>
      `[${m.role.toUpperCase()} - ${m.model.name}]\n${m.content}\n---`
    ).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Chat exported');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  return (
    <div className="app-container">
      <style jsx global>{`
        .app-container {
          display: flex;
          height: 100vh;
        }
        .sidebar {
          width: 300px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
        }
        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid var(--border);
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, var(--accent), #a78bfa);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }
        .new-chat-btn {
          width: 100%;
          margin-top: 16px;
          padding: 12px;
          background: var(--accent);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .new-chat-btn:hover {
          background: var(--accent-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 20px var(--accent-glow);
        }
        .sidebar-section {
          padding: 16px 12px;
          flex: 1;
          overflow-y: auto;
        }
        .section-title {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          margin-bottom: 12px;
          padding-left: 8px;
          font-weight: 600;
        }
        .model-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .model-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid transparent;
          position: relative;
        }
        .model-item:hover {
          background: var(--bg-tertiary);
        }
        .model-item.active {
          background: rgba(139, 92, 246, 0.12);
          border-color: var(--accent);
        }
        .model-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: var(--accent);
          border-radius: 0 3px 3px 0;
        }
        .model-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          flex-shrink: 0;
        }
        .model-info {
          flex: 1;
          min-width: 0;
        }
        .model-name {
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .model-provider {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .model-status {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .status-online { background: var(--success); box-shadow: 0 0 8px rgba(34, 197, 94, 0.5); }
        .status-demo { background: var(--warning); box-shadow: 0 0 8px rgba(245, 158, 11, 0.4); }
        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--border);
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f472b6, #db2777);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .user-info { flex: 1; }
        .user-name { font-size: 0.85rem; font-weight: 600; }
        .user-plan { font-size: 0.75rem; color: var(--text-muted); }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          position: relative;
        }
        .chat-header {
          height: 64px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          background: var(--bg-secondary);
        }
        .chat-header-left { display: flex; align-items: center; gap: 12px; }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 1.25rem;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .mobile-menu-btn:hover { background: var(--bg-tertiary); }
        .current-model { display: flex; align-items: center; gap: 10px; }
        .current-model-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
        }
        .current-model-info h2 {
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .current-model-info span { font-size: 0.75rem; color: var(--text-muted); }
        .chat-header-actions { display: flex; gap: 8px; }
        .header-btn {
          padding: 8px 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text-secondary);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
        }
        .header-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
          border-color: var(--border-light);
        }

        .chat-container {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          scroll-behavior: smooth;
        }
        .welcome-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100%;
          text-align: center;
          gap: 24px;
          padding: 40px 20px;
        }
        .welcome-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--accent), #c084fc);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          animation: float 3s ease-in-out infinite;
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .welcome-title {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #fff, #c4b5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .welcome-subtitle {
          color: var(--text-secondary);
          max-width: 420px;
          line-height: 1.7;
          font-size: 0.95rem;
        }
        .quick-prompts {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          max-width: 520px;
          width: 100%;
          margin-top: 8px;
        }
        .quick-prompt {
          padding: 18px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 14px;
          text-align: left;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .quick-prompt:hover {
          border-color: var(--accent);
          background: rgba(139, 92, 246, 0.06);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1);
        }
        .quick-prompt-icon { font-size: 1.4rem; margin-bottom: 10px; }
        .quick-prompt-text { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }
        .message {
          display: flex;
          gap: 14px;
          animation: messageIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes messageIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .message.user .message-avatar { background: linear-gradient(135deg, #f472b6, #db2777); }
        .message.ai .message-avatar { background: var(--bg-tertiary); border: 1px solid var(--border); }
        .message-content { flex: 1; min-width: 0; }
        .message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .message-author { font-size: 0.85rem; font-weight: 600; }
        .message-time { font-size: 0.75rem; color: var(--text-muted); }
        .message-body {
          padding: 14px 18px;
          border-radius: 14px;
          font-size: 0.9rem;
          line-height: 1.75;
          word-wrap: break-word;
        }
        .message.user .message-body {
          background: var(--user-msg-bg);
          color: white;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);
        }
        .message.ai .message-body {
          background: var(--ai-msg-bg);
          border: 1px solid var(--border);
          border-bottom-left-radius: 4px;
        }
        .message.ai .message-body pre {
          background: var(--bg-primary);
          border-radius: 10px;
          padding: 16px;
          overflow-x: auto;
          margin: 14px 0;
          border: 1px solid var(--border);
        }
        .message.ai .message-body code {
          font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
          font-size: 0.82rem;
        }
        .message.ai .message-body p { margin-bottom: 12px; }
        .message.ai .message-body p:last-child { margin-bottom: 0; }
        .message.ai .message-body h1,
        .message.ai .message-body h2,
        .message.ai .message-body h3 { margin: 20px 0 12px; font-weight: 600; }
        .message.ai .message-body h2 {
          font-size: 1.15rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 8px;
        }
        .message.ai .message-body ul,
        .message.ai .message-body ol { margin: 12px 0; padding-left: 24px; }
        .message.ai .message-body li { margin: 6px 0; }
        .message.ai .message-body blockquote {
          border-left: 3px solid var(--accent);
          padding-left: 16px;
          margin: 14px 0;
          color: var(--text-secondary);
          font-style: italic;
        }
        .message.ai .message-body table {
          width: 100%;
          border-collapse: collapse;
          margin: 14px 0;
          font-size: 0.85rem;
        }
        .message.ai .message-body th,
        .message.ai .message-body td {
          padding: 10px 14px;
          border: 1px solid var(--border);
          text-align: left;
        }
        .message.ai .message-body th { background: var(--bg-secondary); font-weight: 600; }
        .message-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .message:hover .message-actions { opacity: 1; }
        .msg-action-btn {
          padding: 5px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-muted);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .msg-action-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
          border-color: var(--border-light);
        }

        .typing-indicator {
          display: none;
          align-items: center;
          gap: 14px;
          padding: 8px 0;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }
        .typing-indicator.active { display: flex; }
        .typing-dots {
          display: flex;
          gap: 5px;
          padding: 14px 18px;
          background: var(--ai-msg-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          border-bottom-left-radius: 4px;
        }
        .typing-dots span {
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
          animation: typingBounce 1.4s ease-in-out infinite;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }

        .input-container {
          padding: 16px 24px 20px;
          border-top: 1px solid var(--border);
          background: var(--bg-secondary);
        }
        .input-wrapper {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }
        .chat-input {
          width: 100%;
          padding: 16px 56px 16px 20px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 18px;
          color: var(--text-primary);
          font-size: 0.9rem;
          font-family: inherit;
          resize: none;
          outline: none;
          transition: all 0.2s ease;
          max-height: 200px;
          min-height: 56px;
          line-height: 1.5;
        }
        .chat-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }
        .chat-input::placeholder { color: var(--text-muted); }
        .send-btn {
          position: absolute;
          right: 8px;
          bottom: 8px;
          width: 40px;
          height: 40px;
          background: var(--accent);
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          font-size: 1rem;
        }
        .send-btn:hover { background: var(--accent-hover); transform: scale(1.05); }
        .send-btn:disabled { background: var(--bg-hover); cursor: not-allowed; transform: none; opacity: 0.5; }
        .input-hints {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 10px;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .input-hints kbd {
          background: var(--bg-tertiary);
          padding: 2px 7px;
          border-radius: 5px;
          border: 1px solid var(--border);
          font-family: inherit;
          font-size: 0.7rem;
        }

        .model-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 5px;
          font-size: 0.7rem;
          color: var(--accent);
          font-weight: 500;
        }

        .toast {
          position: fixed;
          bottom: 110px;
          left: 50%;
          transform: translateX(-50%) translateY(100px);
          padding: 12px 24px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 14px;
          color: var(--text-primary);
          font-size: 0.85rem;
          z-index: 2000;
          opacity: 0;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }
        .toast.show {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 99;
          backdrop-filter: blur(4px);
        }
        .sidebar-overlay.active { display: block; }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
          }
          .sidebar.open { transform: translateX(0); }
          .mobile-menu-btn { display: block; }
          .chat-header-actions { display: none; }
          .quick-prompts { grid-template-columns: 1fr; }
          .chat-container { padding: 16px; }
          .welcome-title { font-size: 1.5rem; }
        }
      `}</style>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">⚡</div>
            <span>OmniChat</span>
          </div>
          <button className="new-chat-btn" onClick={newChat}>
            <span>+</span> New Chat
          </button>
        </div>
        <div className="sidebar-section">
          <div className="section-title">AI Models</div>
          <div className="model-list">
            {models.map(model => (
              <div
                key={model.id}
                className={`model-item ${model.id === currentModel.id ? 'active' : ''}`}
                onClick={() => selectModel(model.id)}
                title={model.description}
              >
                <div className="model-icon" style={{ background: `${model.color}20`, color: model.color }}>
                  {model.icon}
                </div>
                <div className="model-info">
                  <div className="model-name">{model.name}</div>
                  <div className="model-provider">{model.provider}</div>
                </div>
                <div className={`model-status status-${model.status}`}></div>
              </div>
            ))}
          </div>
        </div>
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">U</div>
            <div className="user-info">
              <div className="user-name">User</div>
              <div className="user-plan">Pro Plan</div>
            </div>
          </div>
        </div>
      </aside>

      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>

      <main className="main-content">
        <header className="chat-header">
          <div className="chat-header-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <div className="current-model">
              <div className="current-model-icon" style={{ background: `${currentModel.color}20`, color: currentModel.color }}>
                {currentModel.icon}
              </div>
              <div className="current-model-info">
                <h2>{currentModel.name} <span className="model-tag">{currentModel.provider}</span></h2>
                <span>{currentModel.description}</span>
              </div>
            </div>
          </div>
          <div className="chat-header-actions">
            <button className="header-btn" onClick={clearChat}>🗑 Clear</button>
            <button className="header-btn" onClick={exportChat}>📥 Export</button>
            <button className="header-btn" onClick={() => showToast('Settings coming soon!')}>⚙ Settings</button>
          </div>
        </header>

        <div className="chat-container" ref={chatContainerRef}>
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="welcome-icon">⚡</div>
              <h1 className="welcome-title">OmniChat</h1>
              <p className="welcome-subtitle">Access all major AI models from one unified interface. Switch between models seamlessly for the best response.</p>
              <div className="quick-prompts">
                <div className="quick-prompt" onClick={() => sendQuickPrompt('Explain quantum computing in simple terms')}>
                  <div className="quick-prompt-icon">🔬</div>
                  <div className="quick-prompt-text">Explain quantum computing in simple terms</div>
                </div>
                <div className="quick-prompt" onClick={() => sendQuickPrompt('Write a Python function to sort a list')}>
                  <div className="quick-prompt-icon">💻</div>
                  <div className="quick-prompt-text">Write a Python function to sort a list</div>
                </div>
                <div className="quick-prompt" onClick={() => sendQuickPrompt('Create a marketing strategy for a coffee shop')}>
                  <div className="quick-prompt-icon">📈</div>
                  <div className="quick-prompt-text">Create a marketing strategy for a coffee shop</div>
                </div>
                <div className="quick-prompt" onClick={() => sendQuickPrompt('Translate Hello to Japanese, French, and Spanish')}>
                  <div className="quick-prompt-icon">🌍</div>
                  <div className="quick-prompt-text">Translate &quot;Hello&quot; to multiple languages</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map(msg => (
                <div key={msg.id} className={`message ${msg.role}`}>
                  <div className="message-avatar">
                    {msg.role === 'user' ? 'U' : msg.model.icon}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-author">{msg.role === 'user' ? 'You' : msg.model.name}</span>
                      <span className="model-tag">{msg.model.provider}</span>
                      <span className="message-time">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div
                      className="message-body"
                      dangerouslySetInnerHTML={{
                        __html: msg.role === 'ai' ? marked.parse(msg.content) : escapeHtml(msg.content)
                      }}
                    />
                    {msg.role === 'ai' && (
                      <div className="message-actions">
                        <button className="msg-action-btn" onClick={() => copyMessage(msg.id)}>📋 Copy</button>
                        <button className="msg-action-btn" onClick={() => regenerateMessage(msg.id)}>🔄 Regenerate</button>
                        <button className="msg-action-btn" onClick={() => rateMessage(msg.id, 'up')}>👍</button>
                        <button className="msg-action-btn" onClick={() => rateMessage(msg.id, 'down')}>👎</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className={`typing-indicator ${isTyping ? 'active' : ''}`}>
            <div className="message-avatar" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>🤖</div>
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Message any AI model..."
              rows={1}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                autoResize(e.target);
              }}
              onKeyDown={handleKeyDown}
            />
            <button className="send-btn" onClick={sendMessage} disabled={isTyping}>➤</button>
          </div>
          <div className="input-hints">
            <span><kbd>Enter</kbd> to send</span>
            <span><kbd>Shift</kbd> + <kbd>Enter</kbd> new line</span>
            <span><kbd>/</kbd> for commands</span>
          </div>
        </div>
      </main>

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  );
}
