'use server';

/**
 * @fileOverview Explains a given command-line command.
 *
 * - explainCommand - A function that takes a command and returns an explanation.
 * - ExplainCommandInput - The input type for the explainCommand function.
 * - ExplainCommandOutput - The return type for the explainCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCommandInputSchema = z.object({
  command: z.string().describe('The command to explain.'),
});
export type ExplainCommandInput = z.infer<typeof ExplainCommandInputSchema>;

const ExplainCommandOutputSchema = z.object({
  explanation: z.string().describe('A clear, concise explanation of the command.'),
});
export type ExplainCommandOutput = z.infer<typeof ExplainCommandOutputSchema>;

export async function explainCommand(input: ExplainCommandInput): Promise<ExplainCommandOutput> {
  return explainCommandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCommandPrompt',
  input: {schema: ExplainCommandInputSchema},
  output: {schema: ExplainCommandOutputSchema},
  prompt: `You are an expert in command-line tools. Explain the following command in a clear, concise manner, outlining its functionality, parameters, and potential impact:

Command: {{{command}}}`,
});

const explainCommandFlow = ai.defineFlow(
  {
    name: 'explainCommandFlow',
    inputSchema: ExplainCommandInputSchema,
    outputSchema: ExplainCommandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
