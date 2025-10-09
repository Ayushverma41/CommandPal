'use server';
/**
 * @fileOverview A simple conversational flow.
 *
 * - conversational - A function that handles general conversation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ConversationalInput, ConversationalOutput } from '@/ai/types';
import { ConversationalInputSchema, ConversationalOutputSchema } from '@/ai/types';

export async function conversational(input: ConversationalInput): Promise<ConversationalOutput> {
  return conversationalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'conversationalPrompt',
  input: {schema: ConversationalInputSchema},
  output: {schema: ConversationalOutputSchema},
  prompt: `You are a helpful assistant. Respond to the user's input in a conversational way.

User Input: {{{userInput}}}
`,
});

const conversationalFlow = ai.defineFlow(
  {
    name: 'conversationalFlow',
    inputSchema: ConversationalInputSchema,
    outputSchema: ConversationalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
