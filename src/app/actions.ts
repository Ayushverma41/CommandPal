'use server';

import {
  convertNaturalLanguageToCommand,
  ConvertNaturalLanguageToCommandInput,
} from '@/ai/flows/natural-language-to-command';
import { explainCommand, ExplainCommandInput } from '@/ai/flows/explain-command';
import { executeCommand, ExecuteCommandInput } from '@/ai/flows/execute-command';
import * as fs from 'fs/promises';
import path from 'path';

type ActionResult<T> = {
  data?: T;
  error?: string;
};

export async function handleNaturalLanguageToCommand(
  input: ConvertNaturalLanguageToCommandInput
): Promise<ActionResult<{ command: string }>> {
  try {
    const result = await convertNaturalLanguageToCommand(input);
    const commandBatPath = path.join(process.cwd(), 'Command.bat');
    const formattedCommand = `@echo off\n${result.command}\n\necho.\npause`;
    await fs.writeFile(commandBatPath, formattedCommand);
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
    const commandBatPath = path.join(process.cwd(), 'Command.bat');
    const formattedCommand = `@echo off\n${input.command}\n\necho.\npause`;
    await fs.writeFile(commandBatPath, formattedCommand);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}

export async function handleExecuteCommand(
  input: ExecuteCommandInput
): Promise<ActionResult<{ stdout: string; stderr: string }>> {
  try {
    const commandBatPath = path.join(process.cwd(), 'Command.bat');
    const commandToRun = await fs.readFile(commandBatPath, 'utf-8');
    const result = await executeCommand({ command: commandToRun });
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}
