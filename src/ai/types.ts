import {z} from 'genkit';

export const ConversationalInputSchema = z.object({
  userInput: z.string().describe('The user input in natural language.'),
});
export type ConversationalInput = z.infer<typeof ConversationalInputSchema>;

export const ConversationalOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
});
export type ConversationalOutput = z.infer<typeof ConversationalOutputSchema>;


export const ImproveCommandGenerationBasedOnHistoryInputSchema = z.object({
    userInput: z.string().describe('The user input in natural language.'),
    commandHistory: z.array(z.string()).describe('The history of previously executed commands.'),
});
export type ImproveCommandGenerationBasedOnHistoryInput = z.infer<typeof ImproveCommandGenerationBasedOnHistoryInputSchema>;

export const ImproveCommandGenerationBasedOnHistoryOutputSchema = z.object({
    terminalCommand: z.string().describe('The generated terminal command based on user input and command history.'),
});
export type ImproveCommandGenerationBasedOnHistoryOutput = z.infer<typeof ImproveCommandGenerationBasedOnHistoryOutputSchema>;


export const InterpretUserInputForCommandInputSchema = z.object({
  userInput: z.string().describe('The user input in natural language.'),
  commandHistory: z.array(z.string()).describe('The history of previously executed commands.'),
});
export type InterpretUserInputForCommandInput = z.infer<typeof InterpretUserInputForCommandInputSchema>;


export const InterpretUserInputOutputSchema = z.object({
  type: z.enum(['command', 'conversation']),
  response: z.string(),
});
export type InterpretUserInputOutput = z.infer<typeof InterpretUserInputOutputSchema>;

export const ExecuteCommandFlowInputSchema = z.string().describe('The terminal command to execute.');
export type ExecuteCommandFlowInput = z.infer<typeof ExecuteCommandFlowInputSchema>;

export const ExecuteCommandFlowOutputSchema = z.string().describe('The simulated output of the executed command.');
export type ExecuteCommandFlowOutput = z.infer<typeof ExecuteCommandFlowOutputSchema>;
