import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal, Mic, Upload, Square } from 'lucide-react';

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
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition is not supported in this browser.');
      return;
    }

    // Initialize recognition
    const recognitionInstance = new (window as any).webkitSpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      setIsRecording(true);
    };

    recognitionInstance.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage((prev) => prev + ' ' + transcript);
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
    };

    setRecognition(recognitionInstance);
  }, [setInputMessage]);

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream after permission check
      setHasPermission(true);
      return true;
    } catch (err) {
      console.error('Microphone permission error:', err);
      setHasPermission(false);
      return false;
    }
  };

  const startVoiceInput = async () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    // Check/request microphone permission first
    const permitted = await checkMicrophonePermission();
    if (!permitted) {
      alert('Microphone permission is required for voice input.');
      return;
    }

    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsRecording(false);
    }
  };

  const stopVoiceInput = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
    }
  };

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
        onClick={isRecording ? stopVoiceInput : startVoiceInput}
        disabled={isLoading}
        title={isRecording ? "Stop Recording" : "Voice Input"}
      >
        {isRecording ? <Square size={18} className="text-red-500" /> : <Mic size={18} />}
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
