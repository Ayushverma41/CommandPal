"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Wand2, Loader2, Copy, Save, Play, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleNaturalLanguageToCommand, handleExecuteCommand } from '@/app/actions';
import CodeBlock from '@/components/common/code-block';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { CommandEntry } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  naturalLanguageQuery: z.string().min(10, 'Please enter a more descriptive query.'),
  operatingSystem: z.enum(['Linux', 'macOS', 'Windows']),
});

type FormValues = z.infer<typeof formSchema>;

export default function NaturalLanguageForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState('');
  const [executionResult, setExecutionResult] = useState<{ stdout: string; stderr: string } | null>(null);
  const [history, setHistory] = useLocalStorage<CommandEntry[]>('command-history', []);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      naturalLanguageQuery: '',
      operatingSystem: 'Linux',
    },
  });

  const onCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const onSaveToFile = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain' });
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

  const onExecute = async () => {
    if (!result) return;
    setIsExecuting(true);
    setExecutionResult(null);
    const response = await handleExecuteCommand({ command: result });
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

    const response = await handleNaturalLanguageToCommand(values);
    setIsLoading(false);

    if (response.error || !response.data) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: response.error,
      });
      return;
    }

    setResult(response.data.command);
    
    const newHistoryEntry: CommandEntry = {
      id: crypto.randomUUID(),
      type: 'nl-to-command',
      input: values,
      output: response.data.command,
      timestamp: Date.now(),
    };
    setHistory([newHistoryEntry, ...history]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-primary" />
          Natural Language to Command
        </CardTitle>
        <CardDescription>
          Describe what you want to do, and we&apos;ll generate the command for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="naturalLanguageQuery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your query</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='e.g., "list all files in the current directory larger than 10MB"'
                      {...field}
                      rows={4}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="operatingSystem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operating System</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an OS" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Linux">Linux</SelectItem>
                      <SelectItem value="macOS">macOS</SelectItem>
                      <SelectItem value="Windows">Windows</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Wand2 />
              )}
              Generate Command
            </Button>
          </form>
        </Form>
        {(isLoading || result) && (
            <div className="mt-6 space-y-4 border-t pt-6">
                {isLoading && (
                    <div className='flex items-center gap-2 text-muted-foreground'>
                        <Loader2 className='animate-spin' />
                        <span>Generating your command...</span>
                    </div>
                )}
                {result && (
                <div className="space-y-4">
                    <div>
                    <h3 className="font-semibold mb-2">Generated Command:</h3>
                    <CodeBlock code={result} />
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={onCopy}>
                        <Copy />
                        Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={onSaveToFile}>
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
                        {executionResult?.stdout && <p className="text-green-400">$ {result}</p>}
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
