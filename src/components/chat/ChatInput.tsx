
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal, Mic, Upload } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  onUploadClick?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  isAdmin,
  onUploadClick
}) => {
  return (
    <div className="flex w-full items-center space-x-2">
      <Input
        placeholder="Type your message..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        className="flex-1"
        disabled={isLoading}
      />
      
      {isAdmin && (
        <Button 
          size="icon" 
          variant="ghost"
          onClick={onUploadClick}
          disabled={isLoading}
          title="Upload File"
        >
          <Upload size={18} />
        </Button>
      )}
      
      <Button 
        size="icon" 
        variant="ghost"
        disabled={isLoading}
        title="Voice Input"
      >
        <Mic size={18} />
      </Button>
      
      <Button 
        size="icon"
        onClick={handleSendMessage}
        disabled={isLoading || !inputMessage.trim()}
        title="Send Message"
      >
        <SendHorizontal size={18} />
      </Button>
    </div>
  );
};

export default ChatInput;
