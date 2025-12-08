'use server';

import {
  convertNaturalLanguageToCommand,
  ConvertNaturalLanguageToCommandInput,
} from '@/ai/flows/natural-language-to-command';
import { explainCommand, ExplainCommandInput } from '@/ai/flows/explain-command';
import { executeCommand } from '@/ai/flows/execute-command';

type ActionResult<T> = {
  data?: T;
  error?: string;
};

export async function handleNaturalLanguageToCommand(
  input: ConvertNaturalLanguageToCommandInput
): Promise<ActionResult<{ command: string }>> {
  try {
    const result = await convertNaturalLanguageToCommand(input);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}

export async function handleExplainCommand(
  input: ExplainCommandInput
): Promise<ActionResult<{ explanation: string }>> {
  try {
    const result = await explainCommand(input);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}

export async function handleExecuteCommand(): Promise<ActionResult<{ stdout: string; stderr: string }>> {
    try {
        const result = await executeCommand();
        return { data: result };
    } catch (error) {
        console.error(error);
        return { error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
}
