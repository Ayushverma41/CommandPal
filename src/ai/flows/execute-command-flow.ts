'use server';
/**
 * @fileOverview A flow to simulate the execution of a terminal command.
 *
 * - executeCommand - A function that takes a command and returns a simulated output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ExecuteCommandFlowInputSchema, ExecuteCommandFlowOutputSchema } from '@/ai/types';

export async function executeCommand(input: string): Promise<string> {
    return executeCommandFlow(input);
}

const executeCommandFlow = ai.defineFlow(
  {
    name: 'executeCommandFlow',
    inputSchema: ExecuteCommandFlowInputSchema,
    outputSchema: ExecuteCommandFlowOutputSchema,
  },
  async (command) => {
    const { output } = await ai.generate({
        prompt: `You are a terminal command simulator. Given a command, provide a realistic but simulated output. Do not execute any real commands.

Command: ${command}

Simulated Output:`,
        model: 'googleai/gemini-2.5-flash',
        output: {
            schema: z.string(),
        }
    });
    return output!;
  }
);
