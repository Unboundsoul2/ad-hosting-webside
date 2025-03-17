import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { openRouterService } from '@/services/OpenRouterService';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ChatProps {
  isAdmin: boolean;
  onUploadClick?: () => void;
}

const Chat: React.FC<ChatProps> = ({ isAdmin, onUploadClick }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Prevent duplicate messages
    if (lastMessageRef.current === inputMessage.trim()) {
      setError('Please do not send the same message twice.');
      return;
    }

    const userMessage: ChatMessageType = {
      id: uuidv4(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);
    lastMessageRef.current = inputMessage.trim();
    retryCountRef.current = 0;

    try {
      const response = await openRouterService.getChatCompletion([
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: inputMessage.trim() }
      ]);

      // Check if the response is similar to the last assistant message
      const lastAssistantMessage = messages
        .filter(msg => msg.role === 'assistant')
        .pop()?.content;

      if (lastAssistantMessage && response === lastAssistantMessage) {
        // If duplicate, try again with a different prompt
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          const retryResponse = await openRouterService.getChatCompletion([
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: inputMessage.trim() },
            { role: 'system', content: 'Please provide a different response than before.' }
          ]);
          
          const assistantMessage: ChatMessageType = {
            id: uuidv4(),
            role: 'assistant',
            content: retryResponse,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, assistantMessage]);
        } else {
          throw new Error('Unable to generate a unique response after multiple attempts');
        }
      } else {
        const assistantMessage: ChatMessageType = {
          id: uuidv4(),
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setError('Failed to get response. Please try again.');
      const errorMessage: ChatMessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          isAdmin={isAdmin}
          onUploadClick={onUploadClick}
        />
      </div>
    </Card>
  );
};

export default Chat; 