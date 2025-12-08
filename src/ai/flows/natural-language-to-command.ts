'use server';
/**
 * @fileOverview Converts natural language queries into command-line commands.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fs from 'fs/promises';
import path from 'path';

const ConvertNaturalLanguageToCommandInputSchema = z.object({
  naturalLanguageQuery: z.string(),
  operatingSystem: z.string(),
});
export type ConvertNaturalLanguageToCommandInput =
  z.infer<typeof ConvertNaturalLanguageToCommandInputSchema>;

const ConvertNaturalLanguageToCommandOutputSchema = z.object({
  command: z.string(),
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
  input: { schema: ConvertNaturalLanguageToCommandInputSchema },
  output: { schema: ConvertNaturalLanguageToCommandOutputSchema },
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
    const { output } = await prompt(input);
    const command = output!.command;

    try {
      // Build .bat file content
      const batContent =
        `@echo off\r\n` +
        `${command}\r\n\r\n` +
        `echo.\r\npause`;

      const filePath = path.join(process.cwd(), 'Command.bat');

      await fs.writeFile(filePath, batContent, 'utf8');

      console.log(`Command.bat created successfully at ${filePath}`);
    } catch (err) {
      console.error("Failed to write Command.bat:", err);
    }

    return output!;
  }
);
