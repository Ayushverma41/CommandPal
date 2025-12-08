'use server';
/**
 * @fileOverview Executes the Command.bat file.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { exec } from 'child_process';
import path from 'path';
import util from 'util';

const execAsync = util.promisify(exec);

const ExecuteCommandOutputSchema = z.object({
  stdout: z.string(),
  stderr: z.string(),
});
export type ExecuteCommandOutput = z.infer<typeof ExecuteCommandOutputSchema>;

export async function executeCommand(): Promise<ExecuteCommandOutput> {
  return executeCommandFlow();
}

const executeCommandFlow = ai.defineFlow(
  {
    name: 'executeCommandFlow',
    outputSchema: ExecuteCommandOutputSchema,
  },
  async () => {
    const filePath = path.join(process.cwd(), 'Command.bat');
    try {
      const { stdout, stderr } = await execAsync(`"${filePath}"`);
      return { stdout, stderr };
    } catch (error: any) {
      return { stdout: '', stderr: error.message };
    }
  }
);
