import { ChatCompletionMessage } from '@/types/chat';

const OPENROUTER_API_KEY = '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';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export class OpenRouterService {
  private static instance: OpenRouterService;
  private lastResponse: string | null = null;
  private lastRequest: string | null = null;
  private messageHistory: ChatCompletionMessage[] = [];
  private retryCount: number = 0;
  private readonly MAX_RETRIES = 3;

  private constructor() {}

  public static getInstance(): OpenRouterService {
    if (!OpenRouterService.instance) {
      OpenRouterService.instance = new OpenRouterService();
    }
    return OpenRouterService.instance;
  }

  private isDuplicateMessage(message: string): boolean {
    return this.messageHistory.some(msg => 
      msg.role === 'assistant' && msg.content === message
    );
  }

  private async makeRequest(messages: ChatCompletionMessage[], temperature: number = 0.7) {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'A&D Studios Chat'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature,
        max_tokens: 1000,
        presence_penalty: 0.6,
        frequency_penalty: 0.6
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async getChatCompletion(messages: ChatCompletionMessage[]) {
    try {
      // Get the last user message
      const lastUserMessage = messages
        .filter(msg => msg.role === 'user')
        .pop()?.content;

      // Prevent duplicate requests
      if (lastUserMessage === this.lastRequest) {
        return this.lastResponse;
      }

      // Add system message to prevent repetition
      const messagesWithSystem = [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Provide clear, concise, and relevant responses. Avoid repeating yourself and maintain context from the conversation.'
        },
        ...messages
      ];

      let content = await this.makeRequest(messagesWithSystem);

      // Check for duplicate responses
      if (this.isDuplicateMessage(content)) {
        // If duplicate, try again with higher temperature
        if (this.retryCount < this.MAX_RETRIES) {
          this.retryCount++;
          content = await this.makeRequest(messagesWithSystem, 0.9);
        } else {
          throw new Error('Unable to generate a unique response after multiple attempts');
        }
      }

      // Reset retry count on success
      this.retryCount = 0;

      // Update history and last request/response
      this.messageHistory = messages;
      this.lastRequest = lastUserMessage || null;
      this.lastResponse = content;

      return content;
    } catch (error) {
      console.error('Error in OpenRouter chat completion:', error);
      throw error;
    }
  }
}

export const openRouterService = OpenRouterService.getInstance(); 