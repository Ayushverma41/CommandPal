export type CommandEntry = {
  id: string;
  type: 'nl-to-command' | 'explain';
  input: Record<string, any>;
  output: string;
  timestamp: number;
};

export type SavedCommand = {
  id: string;
  command: string;
  description: string;
  timestamp: number;
};

export type ActiveView = 'natural-language' | 'explain' | 'history' | 'saved';
