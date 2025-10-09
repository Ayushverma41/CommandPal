'use server';

import { interpretUserInput } from '@/ai/flows/interpret-user-input-for-command';
import { z } from 'zod';

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
