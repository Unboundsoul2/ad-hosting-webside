
import React from 'react';
import { Button } from '@/components/ui/button';
import { MinusCircle, X } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface ChatHeaderProps {
  isAdmin: boolean;
  username?: string;
  onMinimize: () => void;
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  isAdmin, 
  username, 
  onMinimize, 
  onClose 
}) => {
  return (
    <CardHeader className="p-4 bg-primary text-primary-foreground flex flex-row justify-between items-center">
      <CardTitle className="text-base font-medium">
        {isAdmin ? `Admin Chat - ${username}` : 'Chat Support'}
      </CardTitle>
      <div className="flex gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-primary-foreground hover:bg-primary/90" 
          onClick={onMinimize}
        >
          <MinusCircle size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-primary-foreground hover:bg-primary/90" 
          onClick={onClose}
        >
          <X size={16} />
        </Button>
      </div>
    </CardHeader>
  );
};

export default ChatHeader;
