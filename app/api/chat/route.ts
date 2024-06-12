// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const initialMessage = 'Hi! What can I help you with?';

const generatePromptFromMessages = (messages: { who: string; message: string }[]) => {
  let prompt = '';

  if (messages && messages.length > 1) {
    prompt += messages[1].message;
  }

  const messagesWithoutFirstConvo = messages.slice(2);

  if (messagesWithoutFirstConvo.length === 0) {
    return prompt;
  }

  messagesWithoutFirstConvo.forEach((message) => {
    const name = message.who === 'user' ? 'you' : 'bot';
    prompt += `\n${name}: ${message.message}`;
  });

  return prompt;
};

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages) {
      return NextResponse.json({ message: 'Messages are required' }, { status: 400 });
    }

    const messagesPrompt = generatePromptFromMessages(messages);
    const defaultPrompt = `I am Friendly AI Assistant. \n\nThis is the conversation between AI assistant and a user\n\nbot: ${initialMessage}\nyou: ${messagesPrompt}\nbot: `;
    const finalPrompt = process.env.AI_PROMPT ? `${process.env.AI_PROMPT}${messagesPrompt}\nbot: ` : defaultPrompt;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: finalPrompt }],
      max_tokens: 200,
      n: 1,
      stop: ['bot:', 'you:'],
      temperature: 0.8,
    });

    const botResponse = response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({ text: botResponse }, { status: 200 });
  } catch (error) {
    console.error('Error while calling OpenAI API:', error);
    return NextResponse.json({ message: 'Failed to send message', error: error }, { status: 500 });
  }
}
