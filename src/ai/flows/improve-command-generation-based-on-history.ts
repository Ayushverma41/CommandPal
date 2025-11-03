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
  prompt: `You are an expert at generating terminal commands for the Windows Command Prompt (cmd.exe). You take natural language input from the user and generate the most appropriate command to execute in a Windows environment. You should intelligently use flags or additional tools available in Windows to fulfill the user's intent.

  IMPORTANT: The generated command MUST be compatible with the Windows Command Prompt (cmd.exe). Do NOT use commands from other shells like PowerShell, bash, or zsh unless they are also valid in cmd.exe. For example, use 'dir' instead of 'ls' and 'findstr' instead of 'grep'.

  Consider the user's past command history to improve command generation accuracy and personalization.

  User Input: {{{userInput}}}
  Command History: {{#each commandHistory}}{{{this}}}\n{{/each}}
  
  Generate Windows Command Prompt Command:`, 
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
