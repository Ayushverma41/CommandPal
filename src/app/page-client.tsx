'use client';

import { useState, useRef, useEffect } from 'react';
import { getCommand } from './actions';
import { CommandForm } from '@/components/CommandForm';
import { ConversationHistory } from '@/components/ConversationHistory';
import { Button } from '@/components/ui/button';
import { Trash2, Terminal } from 'lucide-react';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isGenerating?: boolean;
  type?: 'command' | 'conversation';
};

export default function ClientPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewMessage = async (prompt: string) => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    const userMessageId = Date.now().toString();
    const newUserMessage: Message = { id: userMessageId, role: 'user', text: prompt };
    
    const assistantMessageId = (Date.now() + 1).toString();
    const newAssistantMessage: Message = { id: assistantMessageId, role: 'assistant', text: '', isGenerating: true };

    setMessages(prev => [...prev, newUserMessage, newAssistantMessage]);

    const commandHistory = messages
      .filter(m => m.role === 'assistant' && !m.isGenerating && m.type === 'command')
      .map(m => m.text);

    try {
      const result = await getCommand(prompt, commandHistory);
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMessageId ? { ...m, text: result.response, type: result.type, isGenerating: false } : m
        )
      );
    } catch (error) {
      console.error(error);
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMessageId ? { ...m, text: 'Sorry, I had trouble generating a response. Please try again.', type: 'conversation', isGenerating: false } : m
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b shrink-0">
        <div className="flex items-center gap-3">
          <Terminal className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold font-headline">CommandPal</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={clearHistory} aria-label="Clear history" disabled={messages.length === 0}>
            <Trash2 className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto w-full">
            <ConversationHistory messages={messages} />
            <div ref={conversationEndRef} />
        </div>
      </main>

      <footer className="p-4 border-t bg-background shrink-0">
        <div className="max-w-3xl mx-auto">
          <CommandForm onSubmit={handleNewMessage} isGenerating={isGenerating} />
          <p className="text-xs text-center text-muted-foreground mt-2">
            CommandPal can make mistakes. Consider checking important commands.
          </p>
        </div>
      </footer>
    </div>
  );
}
