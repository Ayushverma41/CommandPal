import { config } from 'dotenv';
config();

import '@/ai/flows/interpret-user-input-for-command.ts';
import '@/ai/flows/improve-command-generation-based-on-history.ts';
import '@/ai/flows/conversational-flow.ts';
