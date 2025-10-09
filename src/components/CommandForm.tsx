'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendHorizonal, LoaderCircle } from 'lucide-react';
import { useRef } from 'react';

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty.'),
});

type CommandFormProps = {
  onSubmit: (prompt: string) => Promise<void>;
  isGenerating: boolean;
};

export function CommandForm({ onSubmit, isGenerating }: CommandFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref: fieldRef, ...fieldRest } = form.register('prompt');

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values.prompt);
    form.reset();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !isGenerating) {
      event.preventDefault();
      form.handleSubmit(handleSubmit)();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex items-start gap-2">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Textarea
                  {...field}
                  ref={(e) => {
                    field.ref(e);
                    textareaRef.current = e;
                  }}
                  placeholder="e.g., list all files in the current directory, including hidden ones"
                  className="resize-none overflow-y-hidden"
                  rows={1}
                  onKeyDown={handleKeyDown}
                  onInput={(e) => {
                    const target = e.currentTarget;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" disabled={isGenerating}>
          {isGenerating ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <SendHorizonal className="h-5 w-5" />
          )}
          <span className="sr-only">Generate Command</span>
        </Button>
      </form>
    </Form>
  );
}
