'use server';
/**
 * @fileOverview Executes a command and returns its output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const ExecuteCommandInputSchema = z.object({
  command: z.string().describe('The command to execute.'),
});
export type ExecuteCommandInput = z.infer<typeof ExecuteCommandInputSchema>;

const ExecuteCommandOutputSchema = z.object({
  stdout: z.string().describe('The standard output of the command.'),
  stderr: z.string().describe('The standard error of the command.'),
});
export type ExecuteCommandOutput = z.infer<typeof ExecuteCommandOutputSchema>;

export async function executeCommand(input: ExecuteCommandInput): Promise<ExecuteCommandOutput> {
  return executeCommandFlow(input);
}

const executeCommandFlow = ai.defineFlow(
  {
    name: 'executeCommandFlow',
    inputSchema: ExecuteCommandInputSchema,
    outputSchema: ExecuteCommandOutputSchema,
  },
  async ({ command }) => {
    try {
      // Security Note: In a real-world production app, executing arbitrary commands
      // from user input is extremely dangerous. This is implemented this way based on
      // explicit user requirements for a local-only development environment.
      const { stdout, stderr } = await execAsync(command);
      return { stdout, stderr };
    } catch (error: any) {
      return {
        stdout: '',
        stderr: error.message,
      };
    }
  }
);
