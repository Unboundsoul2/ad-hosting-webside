export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatCompletionMessage {
  role: ChatRole;
  content: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
  isError?: boolean;
} 