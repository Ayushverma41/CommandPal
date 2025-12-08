import { config } from 'dotenv';
config();

import '@/ai/flows/explain-command.ts';
import '@/ai/flows/natural-language-to-command.ts';
import '@/ai/flows/execute-command.ts';
