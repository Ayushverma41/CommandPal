// src/ai/flows/improve-command-generation-based-on-history.ts
'use server';
/**
 * @fileOverview Flow to improve command generation based on command history.
 *
 * - improveCommandGenerationBasedOnHistory - A function that takes user input and command history to improve command generation.
 * - ImproveCommandGenerationBasedOnHistoryInput - The input type for the improveCommandGenerationBasedOnHistory function.
 * - ImproveCommandGenerationBasedOnHistoryOutput - The return type for the improveCommandGenerationBasedOnHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveCommandGenerationBasedOnHistoryInputSchema = z.object({
  userInput: z.string().describe('The user input in natural language.'),
  commandHistory: z.array(z.string()).describe('The history of previously executed commands.'),
});
export type ImproveCommandGenerationBasedOnHistoryInput = z.infer<typeof ImproveCommandGenerationBasedOnHistoryInputSchema>;

const ImproveCommandGenerationBasedOnHistoryOutputSchema = z.object({
  terminalCommand: z.string().describe('The generated terminal command based on user input and command history.'),
});
export type ImproveCommandGenerationBasedOnHistoryOutput = z.infer<typeof ImproveCommandGenerationBasedOnHistoryOutputSchema>;

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
