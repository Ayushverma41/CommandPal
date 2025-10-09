'use server';
/**
 * @fileOverview This file defines a Genkit flow that interprets user input in natural language and generates the corresponding terminal command.
 *
 * - interpretUserInputForCommand - A function that takes user input and returns a terminal command.
 * - InterpretUserInputForCommandInput - The input type for the interpretUserInputForCommand function.
 * - InterpretUserInputForCommandOutput - The return type for the interpretUserInputForCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretUserInputForCommandInputSchema = z.object({
  userInput: z.string().describe('The user input in natural language.'),
});
export type InterpretUserInputForCommandInput = z.infer<typeof InterpretUserInputForCommandInputSchema>;

const InterpretUserInputForCommandOutputSchema = z.object({
  terminalCommand: z.string().describe('The terminal command to execute based on the user input.'),
});
export type InterpretUserInputForCommandOutput = z.infer<typeof InterpretUserInputForCommandOutputSchema>;

export async function interpretUserInputForCommand(input: InterpretUserInputForCommandInput): Promise<InterpretUserInputForCommandOutput> {
  return interpretUserInputForCommandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretUserInputForCommandPrompt',
  input: {schema: InterpretUserInputForCommandInputSchema},
  output: {schema: InterpretUserInputForCommandOutputSchema},
  prompt: `You are a helpful assistant designed to translate natural language into terminal commands.\n\nGiven the following user input, generate the most appropriate terminal command to execute. Be intelligent and use flags or other installed tools if it will help fulfil the intent.\n\nUser Input: {{{userInput}}}`,
});

const interpretUserInputForCommandFlow = ai.defineFlow(
  {
    name: 'interpretUserInputForCommandFlow',
    inputSchema: InterpretUserInputForCommandInputSchema,
    outputSchema: InterpretUserInputForCommandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
