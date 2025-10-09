'use server';
/**
 * @fileOverview Flow to improve command generation based on command history.
 *
 * - improveCommandGenerationBasedOnHistory - A function that takes user input and command history to improve command generation.
 */

import {ai} from '@/ai/genkit';
import type { ImproveCommandGenerationBasedOnHistoryInput, ImproveCommandGenerationBasedOnHistoryOutput } from '@/ai/types';
import { ImproveCommandGenerationBasedOnHistoryInputSchema, ImproveCommandGenerationBasedOnHistoryOutputSchema } from '@/ai/types';

export async function improveCommandGenerationBasedOnHistory(input: ImproveCommandGenerationBasedOnHistoryInput): Promise<ImproveCommandGenerationBasedOnHistoryOutput> {
  return improveCommandGenerationBasedOnHistoryFlow(input);
}

const improveCommandGenerationBasedOnHistoryPrompt = ai.definePrompt({
  name: 'improveCommandGenerationBasedOnHistoryPrompt',
  input: {schema: ImproveCommandGenerationBasedOnHistoryInputSchema},
  output: {schema: ImproveCommandGenerationBasedOnHistoryOutputSchema},
  prompt: `You are a terminal command generation expert. You take natural language input from the user and generate the most appropriate terminal command to execute. You should intelligently use flags or additional tools to fulfil intent.

  Consider the user's past command history to improve command generation accuracy and personalization.

  User Input: {{{userInput}}}
  Command History: {{#each commandHistory}}{{{this}}}\n{{/each}}
  
  Generate Terminal Command:`, 
});

const improveCommandGenerationBasedOnHistoryFlow = ai.defineFlow(
  {
    name: 'improveCommandGenerationBasedOnHistoryFlow',
    inputSchema: ImproveCommandGenerationBasedOnHistoryInputSchema,
    outputSchema: ImproveCommandGenerationBasedOnHistoryOutputSchema,
  },
  async input => {
    const {output} = await improveCommandGenerationBasedOnHistoryPrompt(input);
    return output!;
  }
);
