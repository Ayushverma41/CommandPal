"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Wand2, Loader2, Copy, Play, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleNaturalLanguageToCommand } from '@/app/actions';
import CodeBlock from '@/components/common/code-block';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { CommandEntry } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  naturalLanguageQuery: z.string().min(10, 'Please enter a more descriptive query.'),
  operatingSystem: z.enum(['Linux', 'macOS', 'Windows']),
});

type FormValues = z.infer<typeof formSchema>;

export function CommandGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [showExecution, setShowExecution] = useState(false);
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
  
  const onExecute = () => {
    setShowExecution(true);
    toast({ title: 'Simulating command execution' });
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult('');
    setShowExecution(false);

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
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="naturalLanguageQuery"
              render={({ field }) => (
                <FormItem>
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
            <div className="flex flex-col sm:flex-row gap-4">
                <FormField
                control={form.control}
                name="operatingSystem"
                render={({ field }) => (
                    <FormItem className='w-full sm:w-48'>
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
                <Button type="submit" disabled={isLoading} className='w-full sm:w-auto'>
                {isLoading ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    <Wand2 />
                )}
                Generate
                </Button>
            </div>
          </form>
        </Form>
        {(isLoading || result) && (
            <div className="mt-6 space-y-4">
                <div className='border-t pt-6'>
                {isLoading && (
                    <div className='flex items-center gap-2 text-muted-foreground'>
                        <Loader2 className='animate-spin' />
                        <span>Generating your command...</span>
                    </div>
                )}
                {result && (
                <div className="space-y-4">
                    <div>
                    <h3 className="font-semibold mb-2 text-foreground">Generated Command:</h3>
                    <CodeBlock code={result} />
                    <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={onCopy}>
                        <Copy />
                        Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={onExecute}>
                        <Play />
                        Execute
                        </Button>
                    </div>
                    </div>

                    {showExecution && (
                    <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Execution Environment</AlertTitle>
                        <AlertDescription>
                            <p className="font-semibold mb-2 mt-4">Simulated Execution:</p>
                            <div className="p-4 bg-background rounded-md font-code text-sm">
                            <p className='text-green-400'>$ {result}</p>
                            <p>Command execution simulation is not yet implemented.</p>
                            <p>Directly executing commands from a web browser is a security risk. This feature will simulate command output in a safe, sandboxed environment.</p>
                            </div>
                        </AlertDescription>
                        </Alert>
                    )}
                </div>
                )}
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
