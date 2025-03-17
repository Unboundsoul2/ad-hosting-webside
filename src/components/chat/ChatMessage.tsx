import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const timestamp = new Date(message.timestamp).toLocaleTimeString();

  return (
    <div
      className={cn(
        'flex items-start space-x-3 p-3 rounded-lg',
        isUser ? 'bg-primary/10' : 'bg-muted'
      )}
    >
      <div className="flex-shrink-0">
        {isUser ? (
          <User className="h-6 w-6 text-primary" />
        ) : (
          <Bot className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {isUser ? 'You' : 'Assistant'}
          </p>
          <p className="text-xs text-muted-foreground">{timestamp}</p>
        </div>
        <p className={cn(
          'text-sm',
          message.isError && 'text-destructive'
        )}>
          {message.content}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
