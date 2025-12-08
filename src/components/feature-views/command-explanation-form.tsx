"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FileQuestion, Loader2, Copy, Save, Play, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { handleExplainCommand, handleExecuteCommand } from '@/app/actions';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { CommandEntry } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  command: z.string().min(2, 'Please enter a command to explain.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CommandExplanationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState('');
  const [executionResult, setExecutionResult] = useState<{ stdout: string; stderr: string } | null>(null);
  const [history, setHistory] = useLocalStorage<CommandEntry[]>('command-history', []);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      command: '',
    },
  });

  const onCopyExplanation = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast({ title: 'Explanation copied to clipboard!' });
  };

  const onSaveCommandToFile = () => {
    const command = form.getValues().command;
    if (!command) return;
    const blob = new Blob([command], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Command.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: 'Command saved to Command.bat' });
  };

  const onCopyCommand = () => {
    const command = form.getValues().command;
    if (!command) return;
    navigator.clipboard.writeText(command);
    toast({ title: 'Command copied to clipboard!' });
  }

  const onExecute = async () => {
    const command = form.getValues().command;
    if (!command) return;
    setIsExecuting(true);
    setExecutionResult(null);
    const response = await handleExecuteCommand({ command });
    setIsExecuting(false);
    if (response.error || !response.data) {
      toast({
        variant: 'destructive',
        title: 'Execution failed',
        description: response.error,
      });
      return;
    }
    setExecutionResult(response.data);
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult('');
    setExecutionResult(null);

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
             <div className="flex items-center gap-2">
                <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    <FileQuestion />
                )}
                Explain Command
                </Button>
            </div>
          </form>
        </Form>

        {(isLoading || result) && (
          <div className="space-y-4 border-t pt-6 mt-6">
            {isLoading && (
              <div className='flex items-center gap-2 text-muted-foreground'>
                  <Loader2 className='animate-spin' />
                  <span>Generating your explanation...</span>
              </div>
            )}
            {result && (
              <div className="space-y-4">
                <div>
                    <h3 className="font-semibold mb-2">Explanation:</h3>
                    <div className="prose prose-sm max-w-none text-foreground p-4 bg-background rounded-md border whitespace-pre-wrap">
                      {result}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Button variant="outline" size="sm" onClick={onCopyExplanation}>
                          <Copy />
                          Copy Explanation
                      </Button>
                      <Button variant="outline" size="sm" onClick={onCopyCommand}>
                        <Copy />
                        Copy Command
                      </Button>
                      <Button variant="outline" size="sm" onClick={onSaveCommandToFile}>
                        <Save />
                        Save to file
                      </Button>
                      <Button variant="outline" size="sm" onClick={onExecute} disabled={isExecuting}>
                        {isExecuting ? <Loader2 className="animate-spin" /> : <Play />}
                        Execute
                      </Button>
                    </div>
                </div>
              </div>
            )}
             {(isExecuting || executionResult) && (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Execution Environment</AlertTitle>
                <AlertDescription>
                  <div className="p-4 bg-background rounded-md font-code text-sm mt-2 whitespace-pre-wrap">
                    {isExecuting && (
                      <div className='flex items-center gap-2 text-muted-foreground'>
                        <Loader2 className='animate-spin' />
                        <span>Executing...</span>
                      </div>
                    )}
                    {executionResult?.stdout && <p className="text-green-400">$ {form.getValues().command}</p>}
                    {executionResult?.stdout && <p>{executionResult.stdout}</p>}
                    {executionResult?.stderr && <p className="text-red-400">{executionResult.stderr}</p>}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
