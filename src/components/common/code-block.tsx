"use client";

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CodeBlockProps {
  code: string;
  className?: string;
}

export default function CodeBlock({ code, className }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const onCopy = () => {
    if (hasCopied) return;
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <div className={cn("relative rounded-lg bg-card border font-code text-sm p-4", className)}>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-7 w-7 text-card-foreground/70 hover:text-card-foreground"
        onClick={onCopy}
      >
        {hasCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
        <span className="sr-only">Copy code</span>
      </Button>
      <pre className="whitespace-pre-wrap break-words">
        <code>{code}</code>
      </pre>
    </div>
  );
}
