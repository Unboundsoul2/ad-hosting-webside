import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import FileUploader from './FileUploader';
import { Message } from './ChatMessage';
import { 
  AdminState, 
  PatriotData, 
  checkForAdminCommands, 
  verifyAdminLogin,
  createAdminUser,
  uploadAdminFile
} from './AdminService';
import {
  generateBotResponse,
  handleAdminCommands
} from './chatResponseGenerator';

const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [adminState, setAdminState] = useState<AdminState>({ isAdmin: false });
  const [patriotMode, setPatriotMode] = useState<boolean>(false);
  const [patriotStep, setPatriotStep] = useState<number>(0);
  const [patriotData, setPatriotData] = useState<PatriotData>({
    username: '',
    passphrase: '',
    twoFactor: false,
    recoveryEmail: '',
    sections: ''
  });
  const [uploadMode, setUploadMode] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: 'Hello! How can I help you today?',
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  const addBotMessage = (content: string) => {
    setMessages(prev => [
      ...prev, 
      {
        id: Date.now().toString(),
        content: content,
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  const handlePatriotModeInput = async (input: string) => {
    switch (patriotStep) {
      case 1:
        setPatriotData({ ...patriotData, username: input });
        setPatriotStep(2);
        addBotMessage("Set an admin passphrase for future logins.");
        break;
      case 2:
        setPatriotData({ ...patriotData, passphrase: input });
        setPatriotStep(3);
        addBotMessage("Would you like to enable two-factor authentication (Y/N)?");
        break;
      case 3:
        setPatriotData({ 
          ...patriotData, 
          twoFactor: input.toLowerCase().startsWith('y') 
        });
        setPatriotStep(4);
        addBotMessage("Enter an emergency recovery email for security purposes.");
        break;
      case 4:
        setPatriotData({ ...patriotData, recoveryEmail: input });
        setPatriotStep(5);
        addBotMessage("Final step: Define website sections the admin should manage (comma-separated).");
        break;
      case 5:
        setPatriotData({ ...patriotData, sections: input });
        const success = await createAdminUser({
          ...patriotData,
          sections: input
        });
        
        if (!success) {
          addBotMessage("Error creating admin account. Please try again later.");
        } else {
          addBotMessage("Admin account created successfully! Patriot Mode is now locked. You can log in anytime using your passphrase.");
          setAdminState({ 
            isAdmin: true, 
            username: patriotData.username 
          });
        }
        
        setPatriotMode(false);
        setPatriotStep(0);
        break;
    }
    return true;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !adminState.username) return;
    
    const file = files[0];
    setIsLoading(true);
    
    try {
      const result = await uploadAdminFile(file, adminState.username);
      
      if (result.success) {
        addBotMessage(`File uploaded successfully! Path: ${result.path}`);
        toast({
          title: "File Upload Successful",
          description: `${file.name} has been uploaded.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      addBotMessage("There was an error uploading your file. Please try again.");
    } finally {
      setIsLoading(false);
      setUploadMode(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const newUserMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      if (patriotMode) {
        await handlePatriotModeInput(inputMessage);
      } else {
        // Check for admin login attempt
        if (!adminState.isAdmin) {
          const isPatriotMode = await checkForAdminCommands(inputMessage);
          if (isPatriotMode) {
            setPatriotMode(true);
            setPatriotStep(1);
            addBotMessage("Welcome to Patriot Mode! Please enter a secure admin username.");
          } else {
            const { verified, username } = await verifyAdminLogin(inputMessage);
            if (verified && username) {
              setAdminState({ isAdmin: true, username });
              addBotMessage(`Admin mode activated. Welcome, ${username}!`);
            } else {
              // Not an admin, generate regular response
              try {
                const botResponse = await generateBotResponse(inputMessage);
                addBotMessage(botResponse);
              } catch (error) {
                console.error('Error getting bot response:', error);
                addBotMessage("I'm sorry, I'm having trouble processing your request. Please try again later.");
              }
            }
          }
        } else {
          // Admin is already logged in
          const { handled, response } = await handleAdminCommands(inputMessage, adminState.username!);
          if (handled) {
            if (inputMessage.toLowerCase().includes('upload') || inputMessage.toLowerCase().includes('file')) {
              setUploadMode(true);
            }
            if (response) {
              addBotMessage(response);
            }
          } else {
            try {
              // Process as a potential structured admin command or generate a regular response
              const botResponse = await generateBotResponse(inputMessage, adminState.username);
              addBotMessage(botResponse);
            } catch (error) {
              console.error('Error getting bot response:', error);
              addBotMessage("I'm sorry, I'm having trouble processing your request. Please try again later.");
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      addBotMessage("I'm sorry, I encountered an error processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileUpload}
        aria-label="Upload file"
        title="Upload file"
      />

      <div className="fixed bottom-8 right-8 z-50">
        {!isOpen ? (
          <Button 
            onClick={() => setIsOpen(true)} 
            className="rounded-full h-14 w-14 shadow-lg"
          >
            <ChevronUp size={24} />
          </Button>
        ) : null}
      </div>

      {isOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-80 sm:w-96 shadow-xl animate-in fade-in slide-in-from-bottom-10 duration-300">
          <Card className="border-2">
            <ChatHeader 
              isAdmin={adminState.isAdmin}
              username={adminState.username}
              onMinimize={() => setIsOpen(false)}
              onClose={() => setIsOpen(false)}
            />
            
            <ChatMessages messages={messages} />
            
            <CardFooter className="p-3 border-t">
              {uploadMode && adminState.isAdmin ? (
                <FileUploader 
                  onSelectFile={() => fileInputRef.current?.click()}
                  onCancel={() => setUploadMode(false)}
                  isLoading={isLoading}
                />
              ) : (
                <ChatInput 
                  inputMessage={inputMessage}
                  setInputMessage={setInputMessage}
                  handleSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  isAdmin={adminState.isAdmin}
                  onUploadClick={() => setUploadMode(true)}
                />
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatInterface;
