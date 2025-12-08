'use server';
/**
 * @fileOverview Converts natural language queries into command-line commands.
 *
 * - convertNaturalLanguageToCommand - A function that converts natural language queries into command-line commands.
 * - ConvertNaturalLanguageToCommandInput - The input type for the convertNaturalLanguageToCommand function.
 * - ConvertNaturalLanguageToCommandOutput - The return type for the convertNaturalLanguageToCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertNaturalLanguageToCommandInputSchema = z.object({
  naturalLanguageQuery: z
    .string()
    .describe('The natural language query to convert to a command.'),
  operatingSystem: z
    .string()
    .describe('The operating system for which to generate the command.'),
});
export type ConvertNaturalLanguageToCommandInput =
  z.infer<typeof ConvertNaturalLanguageToCommandInputSchema>;

const ConvertNaturalLanguageToCommandOutputSchema = z.object({
  command: z.string().describe('The generated command-line command.'),
});
export type ConvertNaturalLanguageToCommandOutput =
  z.infer<typeof ConvertNaturalLanguageToCommandOutputSchema>;

export async function convertNaturalLanguageToCommand(
  input: ConvertNaturalLanguageToCommandInput
): Promise<ConvertNaturalLanguageToCommandOutput> {
  return convertNaturalLanguageToCommandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertNaturalLanguageToCommandPrompt',
  input: {schema: ConvertNaturalLanguageToCommandInputSchema},
  output: {schema: ConvertNaturalLanguageToCommandOutputSchema},
  prompt: `You are a command-line expert. Convert the following natural language query into a command-line command for the specified operating system.

Natural Language Query: {{{naturalLanguageQuery}}}
Operating System: {{{operatingSystem}}}

Command:`,
});

const convertNaturalLanguageToCommandFlow = ai.defineFlow(
  {
    name: 'convertNaturalLanguageToCommandFlow',
    inputSchema: ConvertNaturalLanguageToCommandInputSchema,
    outputSchema: ConvertNaturalLanguageToCommandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
