'use server';
/**
 * @fileOverview This file defines a Genkit flow that interprets user input in natural language and generates the corresponding terminal command or a conversational response.
 *
 * - interpretUserInput - A function that takes user input and returns either a terminal command or a conversational response.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { improveCommandGenerationBasedOnHistory } from './improve-command-generation-based-on-history';
import { conversational } from './conversational-flow';
import type { InterpretUserInputForCommandInput, InterpretUserInputOutput } from '@/ai/types';
import { InterpretUserInputForCommandInputSchema, InterpretUserInputOutputSchema } from '@/ai/types';

const InterpretUserInputSchema = z.object({
  isCommand: z.boolean().describe('Whether the user input is a command or a conversational topic.'),
});

export async function interpretUserInput(input: InterpretUserInputForCommandInput): Promise<InterpretUserInputOutput> {
  return interpretUserInputFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretUserInputPrompt',
  input: {schema: z.object({userInput: z.string()})},
  output: {schema: InterpretUserInputSchema},
  prompt: `You are an expert at understanding user intent. The user is interacting with a tool that can generate terminal commands. Your task is to determine if the user is asking for a terminal command or just making small talk.

  If the user is asking for a command (e.g., "list all files", "create a new directory"), respond with '{"isCommand": true}'.
  If the user is just making small talk (e.g., "hello", "how are you?", "what's your name?"), respond with '{"isCommand": false}'.
  
  User Input: {{{userInput}}}`,
});

const interpretUserInputFlow = ai.defineFlow(
  {
    name: 'interpretUserInputFlow',
    inputSchema: InterpretUserInputForCommandInputSchema,
    outputSchema: InterpretUserInputOutputSchema,
  },
  async (input) => {
    const { output: intent } = await prompt({ userInput: input.userInput });

    if (intent?.isCommand) {
      const commandResult = await improveCommandGenerationBasedOnHistory({
        userInput: input.userInput,
        commandHistory: input.commandHistory,
      });
      return {
        type: 'command',
        response: commandResult.terminalCommand,
      };
    } else {
      const conversationalResult = await conversational({
        userInput: input.userInput,
      });
      return {
        type: 'conversation',
        response: conversationalResult.response,
      };
    }
  }
);
