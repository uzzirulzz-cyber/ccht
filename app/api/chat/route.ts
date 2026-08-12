import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_CONFIG: Record<string, { provider: string; modelId: string }> = {
  gpt4o: { provider: 'openai', modelId: 'gpt-4o' },
  gpt4: { provider: 'openai', modelId: 'gpt-4-turbo' },
  gpt35: { provider: 'openai', modelId: 'gpt-3.5-turbo' },
  claude3: { provider: 'anthropic', modelId: 'claude-3-5-sonnet-20241022' },
  claude3opus: { provider: 'anthropic', modelId: 'claude-3-opus-20240229' },
  gemini: { provider: 'google', modelId: 'gemini-1.5-pro' },
  geminiFlash: { provider: 'google', modelId: 'gemini-1.5-flash' },
};

function getApiKey(provider: string): string | undefined {
  switch (provider) {
    case 'openai':
      return process.env.OPENAI_API_KEY;
    case 'anthropic':
      return process.env.ANTHROPIC_API_KEY;
    case 'google':
      return process.env.GOOGLE_API_KEY;
    default:
      return undefined;
  }
}

async function callOpenAI(modelId: string, messages: any[], apiKey: string) {
  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: modelId,
    messages: messages.map((m: any) => ({
      role: m.role === 'ai' ? 'assistant' : m.role,
      content: m.content,
    })),
    temperature: 0.7,
    max_tokens: 4096,
  });
  return response.choices[0]?.message?.content || 'No response';
}

async function callAnthropic(modelId: string, messages: any[], apiKey: string) {
  const anthropic = new Anthropic({ apiKey });
  const systemMsg = messages.find((m: any) => m.role === 'system');
  const chatMessages = messages
    .filter((m: any) => m.role !== 'system')
    .map((m: any) => ({
      role: m.role === 'ai' ? 'assistant' : m.role,
      content: m.content,
    }));

  const response = await anthropic.messages.create({
    model: modelId,
    max_tokens: 4096,
    system: systemMsg?.content,
    messages: chatMessages,
  });
  
  const content = response.content[0];
  return content.type === 'text' ? content.text : 'No response';
}

async function callGoogle(modelId: string, messages: any[], apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelId });
  
  const chatMessages = messages
    .filter((m: any) => m.role !== 'system')
    .map((m: any) => ({
      role: m.role === 'ai' ? 'model' : m.role,
      parts: [{ text: m.content }],
    }));

  const chat = model.startChat({ history: chatMessages.slice(0, -1) });
  const lastMessage = chatMessages[chatMessages.length - 1];
  const result = await chat.sendMessage(lastMessage.parts[0].text);
  return result.response.text();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { modelId, messages } = body;

    if (!modelId || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Missing modelId or messages' },
        { status: 400 }
      );
    }

    const config = MODEL_CONFIG[modelId];
    if (!config) {
      return NextResponse.json(
        { error: `Unsupported model: ${modelId}` },
        { status: 400 }
      );
    }

    const apiKey = getApiKey(config.provider);
    if (!apiKey) {
      return NextResponse.json(
        { error: `API key not configured for ${config.provider}` },
        { status: 500 }
      );
    }

    let content: string;
    switch (config.provider) {
      case 'openai':
        content = await callOpenAI(config.modelId, messages, apiKey);
        break;
      case 'anthropic':
        content = await callAnthropic(config.modelId, messages, apiKey);
        break;
      case 'google':
        content = await callGoogle(config.modelId, messages, apiKey);
        break;
      default:
        return NextResponse.json(
          { error: 'Provider not implemented' },
          { status: 500 }
        );
    }

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
