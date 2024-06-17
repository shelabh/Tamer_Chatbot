// Chatbot.tsx
'use client';

import { ChangeEvent, useState, FormEvent } from "react";
import { type Message,  LoadingChatLine } from './ChatLine';
import ChatLine from "./ChatLine"
export const initialMessages: Message[] = [
  {
    who: 'bot',
    message: 'Hi! What can I help you with?',
  },
];

const InputMessage = ({ input, setInput, sendMessage, handleFileChange }: any) => (
  <div className="mt-6 flex clear-both">
    <input
      type="text"
      aria-label="chat input"
      required
      className="flex-auto appearance-none rounded-md border border-gray-200 bg-white px-3 py-[calc(theme(spacing.2)-1px)] placeholder:text-white focus:outline-none"
      value={input}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          sendMessage(input);
          setInput('');
        }
      }}
      onChange={(e) => {
        setInput(e.target.value);
      }}
    />
    <input
      type="file"
      className="ml-4"
      onChange={handleFileChange}
    />
    <button
      type="submit"
      className="ml-4 border-2 cursor-pointer rounded-lg w-32 flex flex-row items-center justify-center pt-1.5 pb-1.5"
      onClick={() => {
        sendMessage(input);
        setInput('');
      }}
    >
      Send
    </button>
  </div>
);

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    setLoading(true);
    const newMessages = [...messages, { message, who: 'user' } as Message];
    setMessages(newMessages);
    const last10Messages = newMessages.slice(-10);

    try {
      const response = await fetch('/api/chat/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: last10Messages, image }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      const botNewMessage = data.text.trim();

      setMessages([...newMessages, { message: botNewMessage, who: 'bot' } as Message]);
    } catch (error) {
      console.error('Error while sending message:', error);
    } finally {
      setLoading(false);
      setImage(''); // Clear the image after sending
    }
  };

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files === null) {
      window.alert("No file selected. Choose a file.");
      return;
    }
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };

    reader.onerror = (error) => {
      console.log("error: " + error);
    };
  }

  return (
    <div className="rounded h-[42rem] bg-white overflow-auto flex flex-col justify-between border-zinc-200 border px-2 pt-2">
      <div>
        <div className='flex justify-between pb-2 mb-4 bg-white border-b'>
          <div className='flex items-center'></div>
          <button className='text-sm hover:text-zinc-600 text-zinc-700'>
            <img src="/images/reset.svg" draggable="false" alt="reset" />
          </button>
        </div>
        <div>
          {messages.map(({ message, who }, index) => (
            <ChatLine key={index} who={who} message={message} />
          ))}

          {loading && <LoadingChatLine />}
        </div>
      </div>
      <div className="pb-4">
        <InputMessage
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          handleFileChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default Chat;
