'use server';

import { interpretUserInput } from '@/ai/flows/interpret-user-input-for-command';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
    
    const validatedResult = CommandOutputSchema.parse(result);

    if (validatedResult.type === 'command') {
      try {
        const filePath = path.join(process.cwd(), 'command.bat');
        // For Windows, commands are separated by newlines.
        // We add @echo off to prevent the commands themselves from being printed.
        await fs.writeFile(filePath, `@echo off\n${validatedResult.response}`);
      } catch (writeError) {
        console.error('Failed to write to command.bat:', writeError);
      }
    }

    return validatedResult;
  } catch (error) {
    console.error('Error generating command:', error);
    throw new Error('Failed to generate command from AI model.');
  }
}

export async function executeCommand() {
  try {
    const filePath = path.join(process.cwd(), 'command.bat');
    const { stdout, stderr } = await execAsync(filePath);
    if (stderr) {
      // If there's an error, return the error message
      return stderr;
    }
    // Return the standard output of the command
    return stdout;
  } catch (error: any) {
    console.error('Error executing command.bat:', error);
    // Return the error message from the exception
    return error.stderr || error.stdout || error.message || 'Failed to execute command.';
  }
}
