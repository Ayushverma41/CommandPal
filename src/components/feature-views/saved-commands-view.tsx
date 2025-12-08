"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bookmark, Plus, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { SavedCommand } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CodeBlock from '../common/code-block';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  command: z.string().min(2, 'Please enter a command.'),
  description: z.string().min(5, 'Please enter a short description.'),
});

type FormValues = z.infer<typeof formSchema>;

function SavedCommandItem({ item, onDelete }: { item: SavedCommand; onDelete: (id: string) => void }) {
  const { toast } = useToast();
  return (
    <div className="p-4 border rounded-lg bg-card/50 transition-colors hover:bg-card">
      <div className="flex justify-between items-start">
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={() => onDelete(item.id)}>
          <Trash2 className="size-4 text-destructive/80 hover:text-destructive" />
        </Button>
      </div>
      <CodeBlock code={item.command} className="mt-2" />
      <p className="text-xs text-muted-foreground mt-2">
        Saved {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
      </p>
    </div>
  );
}

export default function SavedCommandsView() {
  const [saved, setSaved] = useLocalStorage<SavedCommand[]>('saved-commands', []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { command: '', description: '' },
  });

  const onSubmit = (values: FormValues) => {
    const newSavedCommand: SavedCommand = {
      id: crypto.randomUUID(),
      ...values,
      timestamp: Date.now(),
    };
    setSaved([newSavedCommand, ...saved]);
    form.reset();
    setIsDialogOpen(false);
    toast({ title: 'Command saved!' });
  };

  const handleDelete = (id: string) => {
    setSaved(saved.filter((item) => item.id !== id));
    toast({ title: 'Command deleted.', variant: 'destructive' });
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="text-primary" />
            Saved Commands
          </CardTitle>
          <CardDescription>
            Your personal library of frequently used commands.
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="size-4" />
              Add Command
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save a New Command</DialogTitle>
              <DialogDescription>Add a command to your personal library for quick access.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="command"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Command</FormLabel>
                      <FormControl>
                        <Textarea placeholder="ls -la" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="List all files including hidden ones" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                  <Button type="submit">Save Command</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {saved.length > 0 ? (
          <div className="space-y-4">
            {saved.map((item) => (
              <SavedCommandItem key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Bookmark className="mx-auto size-12 mb-4" />
            <h3 className="text-lg font-semibold">No saved commands</h3>
            <p>Add your first command to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
