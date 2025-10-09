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
  intent: z.enum(['command', 'explanation', 'conversation']).describe('The intent of the user input.'),
});

export async function interpretUserInput(input: InterpretUserInputForCommandInput): Promise<InterpretUserInputOutput> {
  return interpretUserInputFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretUserInputPrompt',
  input: {schema: z.object({userInput: z.string()})},
  output: {schema: InterpretUserInputSchema},
  prompt: `You are an expert at understanding user intent. The user is interacting with a tool that can generate and explain terminal commands. Your task is to determine the user's intent.

- If the user is asking for a command to be generated (e.g., "list all files", "create a new directory"), respond with '{"intent": "command"}'.
- If the user is asking for an explanation of what a command does (e.g., "what does 'ls -la' do?", "explain the 'grep' command"), respond with '{"intent": "explanation"}'.
- If the user is just making small talk or asking a general question (e.g., "hello", "how are you?", "what's your name?"), respond with '{"intent": "conversation"}'.
  
User Input: {{{userInput}}}`,
});

const interpretUserInputFlow = ai.defineFlow(
  {
    name: 'interpretUserInputFlow',
    inputSchema: InterpretUserInputForCommandInputSchema,
    outputSchema: InterpretUserInputOutputSchema,
  },
  async (input) => {
    const { output: intentResult } = await prompt({ userInput: input.userInput });

    if (intentResult?.intent === 'command') {
      const commandResult = await improveCommandGenerationBasedOnHistory({
        userInput: input.userInput,
        commandHistory: input.commandHistory,
      });
      return {
        type: 'command',
        response: commandResult.terminalCommand,
      };
    } else { // Handles 'explanation' and 'conversation'
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
