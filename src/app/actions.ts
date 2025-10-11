'use server';

import { interpretUserInput } from '@/ai/flows/interpret-user-input-for-command';
import { z } from 'zod';
import { executeCommand as executeCommandFlow } from '@/ai/flows/execute-command-flow';
import fs from 'fs/promises';
import path from 'path';

const CommandOutputSchema = z.object({
  type: z.enum(['command', 'conversation']),
  response: z.string(),
});

export async function getCommand(userInput: string, commandHistory: string[]) {
  try {
    const result = await interpretUserInput({
      userInput,
      commandHistory,
    });
    
    // Validate the output from the AI model
    const validatedResult = CommandOutputSchema.parse(result);

    // If a command was generated, write it to the batch file
    if (validatedResult.type === 'command') {
      try {
        const filePath = path.join(process.cwd(), 'command.bat');
        await fs.writeFile(filePath, `@echo off\n${validatedResult.response}`);
      } catch (writeError) {
        console.error('Failed to write to command.bat:', writeError);
        // We don't throw here because the primary function (returning the command) succeeded.
      }
    }

    return validatedResult;
  } catch (error) {
    console.error('Error generating command:', error);
    throw new Error('Failed to generate command from AI model.');
  }
}

export async function executeCommand(command: string) {
  try {
    const result = await executeCommandFlow(command);
    return result;
  } catch (error) {
    console.error('Error executing command:', error);
    throw new Error('Failed to execute command via AI model.');
  }
}
