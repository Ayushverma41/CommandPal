'use server';

import { interpretUserInput } from '@/ai/flows/interpret-user-input-for-command';
import { z } from 'zod';
import { executeCommandFlow } from '@/ai/flows/execute-command-flow';

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
