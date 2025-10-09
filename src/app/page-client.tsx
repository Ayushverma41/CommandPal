'use client';

import { useState, useRef, useEffect } from 'react';
import { getCommand, executeCommand } from './actions';
import { CommandForm } from '@/components/CommandForm';
import { ConversationHistory, type Message } from '@/components/ConversationHistory';
import { useChatHistory, type Conversation } from '@/hooks/use-chat-history';
import { HistorySidebar } from '@/components/HistorySidebar';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function ClientPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    startNewConversation,
    updateConversation,
    deleteConversation,
    clearAllConversations,
  } = useChatHistory();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleNewMessage = async (prompt: string) => {
    if (!prompt.trim() || isGenerating || !activeConversation) return;

    setIsGenerating(true);
    const userMessageId = Date.now().toString();
    const newUserMessage: Message = { id: userMessageId, role: 'user', text: prompt };

    const assistantMessageId = (Date.now() + 1).toString();
    const newAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      text: '',
      isGenerating: true,
    };

    const updatedMessages = [...(activeConversation.messages || []), newUserMessage, newAssistantMessage];
    updateConversation(activeConversation.id, { messages: updatedMessages });

    const commandHistory = (activeConversation.messages || [])
      .filter((m) => m.role === 'assistant' && !m.isGenerating && m.type === 'command')
      .map((m) => m.text);

    try {
      const result = await getCommand(prompt, commandHistory);
      const finalMessages = updatedMessages.map((m) =>
        m.id === assistantMessageId
          ? { ...m, text: result.response, type: result.type, isGenerating: false }
          : m
      );
      updateConversation(activeConversation.id, { messages: finalMessages });
    } catch (error) {
      console.error(error);
      const finalMessages = updatedMessages.map((m) =>
        m.id === assistantMessageId
          ? {
              ...m,
              text: 'Sorry, I had trouble generating a response. Please try again.',
              type: 'conversation',
              isGenerating: false,
            }
          : m
      );
      updateConversation(activeConversation.id, { messages: finalMessages });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExecuteCommand = async (command: string) => {
    if (!activeConversation) return;
    setIsExecuting(true);
    const assistantMessageId = Date.now().toString();
    const newAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      text: '',
      isGenerating: true,
    };
    
    const updatedMessages = [...(activeConversation.messages || []), newAssistantMessage];
    updateConversation(activeConversation.id, { messages: updatedMessages });

    try {
      const result = await executeCommand(command);
       const finalMessages = updatedMessages.map((m) =>
        m.id === assistantMessageId
          ? { ...m, text: result, type: 'execution', isGenerating: false }
          : m
      );
      updateConversation(activeConversation.id, { messages: finalMessages });
    } catch (error) {
      console.error(error);
      const finalMessages = updatedMessages.map((m) =>
        m.id === assistantMessageId
          ? {
              ...m,
              text: 'Sorry, I had trouble executing the command.',
              type: 'conversation',
              isGenerating: false,
            }
          : m
      );
      updateConversation(activeConversation.id, { messages: finalMessages });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <HistorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversation?.id}
        onSelectConversation={setActiveConversation}
        onNewConversation={startNewConversation}
        onDeleteConversation={deleteConversation}
        onClearAll={clearAllConversations}
      />
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between p-4 border-b shrink-0 md:justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden"
            aria-label="Open history"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold font-headline md:hidden">CommandPal</h1>
          <div className="w-9 h-9"></div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto w-full">
            <ConversationHistory
              messages={activeConversation?.messages || []}
              onExecuteCommand={handleExecuteCommand}
              isExecuting={isExecuting}
            />
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
    </div>
  );
}
