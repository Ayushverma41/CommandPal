
'use client';

import { useToast } from '@/hooks/use-toast';
import type { Message } from '@/app/page-client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bot, User, Copy, Check, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type ConversationHistoryProps = {
  messages: Message[];
  onExecuteCommand: (command: string) => void;
  isExecuting: boolean;
};

function CopyButton({ command }: { command: string }) {
  const { toast } = useToast();
  const [hasCopied, setHasCopied] = useState(false);

  if (!command) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    setHasCopied(true);
    toast({
      description: 'Command copied to clipboard!',
    });
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-muted-foreground hover:text-foreground">
      {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      <span className="ml-2">{hasCopied ? 'Copied!' : 'Copy'}</span>
    </Button>
  );
}

function ExecuteButton({ command, onExecute, isExecuting }: { command: string, onExecute: (command: string) => void, isExecuting: boolean }) {
  if (!command) return null;

  return (
    <Button variant="outline" size="sm" onClick={() => onExecute(command)} disabled={isExecuting}>
      <Play className="h-4 w-4" />
      <span className="ml-2">Execute</span>
    </Button>
  );
}

function AssistantMessage({ text, isGenerating, type, onExecuteCommand, isExecuting }: { text: string; isGenerating?: boolean, type?: 'command' | 'conversation' | 'execution', onExecuteCommand: (command: string) => void, isExecuting: boolean }) {
  if (isGenerating) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
      </div>
    );
  }

  if (type === 'command') {
    return (
      <div className="bg-accent/10 rounded-lg border border-accent/20">
        <div className="p-4">
            <pre className="text-sm font-code whitespace-pre-wrap text-accent-foreground/90">
            <code className="language-bash">{text}</code>
            </pre>
        </div>
        <div className="border-t border-accent/20 px-4 py-2 flex items-center justify-end gap-2">
          <CopyButton command={text} />
          <ExecuteButton command={text} onExecute={onExecuteCommand} isExecuting={isExecuting} />
        </div>
      </div>
    );
  }

  if (type === 'execution') {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <pre className="text-sm font-code whitespace-pre-wrap text-gray-300">
          <code>{text}</code>
        </pre>
      </div>
    );
  }

  return (
    <p className="leading-relaxed">{text}</p>
  );
}

export function ConversationHistory({ messages, onExecuteCommand, isExecuting }: ConversationHistoryProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center pt-10">
        <div className="p-5 bg-primary/10 rounded-full mb-6">
            <Bot className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold font-headline">Welcome to CommandPal</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Describe the task you want to accomplish, and I'll generate the terminal command for you. You can also just chat with me!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9 border shadow-sm">
            <AvatarFallback className={cn(message.role === 'user' ? 'bg-background' : 'bg-primary text-primary-foreground')}>
              {message.role === 'user' ? <User className="h-5 w-5 text-foreground/80" /> : <Bot className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1 pt-0.5">
            <p className="font-semibold text-sm">
              {message.role === 'user' ? 'You' : 'CommandPal'}
            </p>
            <div className="text-foreground">
              {message.role === 'user' ? (
                <p className="leading-relaxed">{message.text}</p>
              ) : (
                <AssistantMessage text={message.text} isGenerating={message.isGenerating} type={message.type} onExecuteCommand={onExecuteCommand} isExecuting={isExecuting}/>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
