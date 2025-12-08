"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FileQuestion, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { handleExplainCommand } from '@/app/actions';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { CommandEntry } from '@/lib/types';

const formSchema = z.object({
  command: z.string().min(2, 'Please enter a command to explain.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CommandExplanationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [history, setHistory] = useLocalStorage<CommandEntry[]>('command-history', []);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      command: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult('');

    const response = await handleExplainCommand(values);
    setIsLoading(false);

    if (response.error || !response.data) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: response.error,
      });
      return;
    }

    setResult(response.data.explanation);

    const newHistoryEntry: CommandEntry = {
      id: crypto.randomUUID(),
      type: 'explain',
      input: values,
      output: response.data.explanation,
      timestamp: Date.now(),
    };
    setHistory([newHistoryEntry, ...history]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileQuestion className="text-primary" />
          Explain Command
        </CardTitle>
        <CardDescription>
          Enter a command, and we&apos;ll provide a detailed explanation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="command"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Command</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g., "tar -xvf archive.tar.gz"' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <FileQuestion />
              )}
              Explain Command
            </Button>
          </form>
        </Form>
        {result && (
          <div className="space-y-2">
            <h3 className="font-semibold">Explanation:</h3>
            <div className="prose prose-invert prose-sm max-w-none text-foreground p-4 bg-card rounded-md border">
              <p>{result}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
