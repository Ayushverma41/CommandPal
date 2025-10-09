'use server';

import { improveCommandGenerationBasedOnHistory } from '@/ai/flows/improve-command-generation-based-on-history';
import { z } from 'zod';

const CommandOutputSchema = z.object({
  terminalCommand: z.string(),
});

export async function getCommand(userInput: string, commandHistory: string[]) {
  try {
    const result = await improveCommandGenerationBasedOnHistory({
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
