
import { AdminState } from './AdminService';
import { logAdminAction } from '@/utils/adminAudit';
import { 
  handleUpdateHomepageBanner,
  handleModifySiteSettings,
  handleEnableMaintenanceMode,
  handleFileUploadCommand,
  handleUpdatePageContent,
  handleDeletePageContent,
  handleModifyStyles,
  handleSystemConfiguration,
  executeAdminCommand
} from '@/utils/adminCommands';

// OpenRouter configuration
const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const generateBotResponse = async (userMessage: string, adminUsername?: string): Promise<string> => {
  try {
    // If this is an admin with a specific command, try to process it first
    if (adminUsername) {
      // Extract potential command and parameters
      const commandMatch = userMessage.match(/^(update|modify|enable|upload|delete|configure)\s+([^:]+)(?::\s*(.+))?$/i);
      if (commandMatch) {
        const action = commandMatch[1].toLowerCase();
        const target = commandMatch[2].toLowerCase();
        const params = commandMatch[3] ? parseCommandParams(commandMatch[3]) : {};
        
        const fullCommand = `${action} ${target}`;
        const response = await executeAdminCommand(adminUsername, fullCommand, params);
        if (response) return response;
      }
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin, // OpenRouter requires this for API usage
        'X-Title': 'Chat Interface' // Optional - a title for your application
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo', // Using a free model available on OpenRouter
        messages: [
          { 
            role: 'system', 
            content: 'You are a highly knowledgeable assistant for this website, with access to internet information. Use website data, service details, and internet resources to provide comprehensive support. Always guide users towards the website\'s services and functionality, helping them understand and make the most of what we offer. Prioritize accurate information about our pricing, support options, and available services.' 
          },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 150,
        search: true // Enable internet search capability
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      return "I'm having trouble connecting to my knowledge base right now. Please try again later.";
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating response:', error);
    
    // Fallback responses if the API fails
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('pricing') || lowerMessage.includes('cost')) {
      return "Our pricing starts at $9.99/month for the basic plan. Would you like to see a detailed breakdown of our plans?";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
      return "You can reach our support team at support@example.com or call us at (555) 123-4567 during business hours.";
    }
    
    if (lowerMessage.includes('hours') || lowerMessage.includes('open')) {
      return "Our support team is available Monday through Friday, 9 AM to 6 PM Eastern Time.";
    }
    
    return "I'm here to help! If you have questions about our services or need technical assistance, feel free to ask.";
  }
};

// Helper function to parse command parameters
const parseCommandParams = (paramsString: string): Record<string, any> => {
  const params: Record<string, any> = {};
  
  // Handle JSON-like params
  if (paramsString.startsWith('{') && paramsString.endsWith('}')) {
    try {
      return JSON.parse(paramsString);
    } catch (e) {
      console.error('Error parsing JSON params:', e);
    }
  }
  
  // Handle key-value pairs (key=value, key="value with spaces")
  const keyValueRegex = /(\w+)=(?:"([^"]*)"|([^\s,]*))/g;
  let match;
  while ((match = keyValueRegex.exec(paramsString)) !== null) {
    const key = match[1];
    const value = match[2] || match[3];
    params[key] = value;
  }
  
  // If no structured format is detected, store as content
  if (Object.keys(params).length === 0) {
    params.content = paramsString.trim();
  }
  
  return params;
};

export const generateAdminHelpText = (): string => {
  return "As an admin, you can use commands like:\n\n" +
    "- Update homepage banner\n" +
    "- Modify site settings\n" +
    "- Enable maintenance mode\n" +
    "- Upload a file\n" +
    "- Update page content\n" +
    "- Delete page content\n" +
    "- Modify website styles\n" +
    "- Configure system settings\n\n" +
    "What would you like to do?";
};

export const handleAdminCommands = async (command: string, adminUsername: string): Promise<{ handled: boolean; response?: string }> => {
  if (!adminUsername) return { handled: false };
  
  const trimmedCommand = command.toLowerCase().trim();
  
  if (trimmedCommand.includes('upload') || trimmedCommand.includes('file')) {
    const response = await handleFileUploadCommand(adminUsername);
    return { handled: true, response };
  }
  
  if (trimmedCommand.includes('update homepage banner')) {
    const response = await handleUpdateHomepageBanner(adminUsername);
    return { handled: true, response };
  }
  
  if (trimmedCommand.includes('modify site settings')) {
    const response = await handleModifySiteSettings(adminUsername);
    return { handled: true, response };
  }
  
  if (trimmedCommand.includes('enable maintenance mode')) {
    const response = await handleEnableMaintenanceMode(adminUsername);
    return { handled: true, response };
  }

  if (trimmedCommand.includes('update page content') || trimmedCommand.includes('change page')) {
    const response = await handleUpdatePageContent(adminUsername);
    return { handled: true, response };
  }
  
  if (trimmedCommand.includes('delete page') || trimmedCommand.includes('remove content')) {
    const response = await handleDeletePageContent(adminUsername);
    return { handled: true, response };
  }
  
  if (trimmedCommand.includes('modify style') || trimmedCommand.includes('change css')) {
    const response = await handleModifyStyles(adminUsername);
    return { handled: true, response };
  }
  
  if (trimmedCommand.includes('configure system') || trimmedCommand.includes('system config')) {
    const response = await handleSystemConfiguration(adminUsername);
    return { handled: true, response };
  }
  
  if (trimmedCommand.includes('help') || trimmedCommand.includes('command')) {
    return { handled: true, response: generateAdminHelpText() };
  }
  
  return { handled: false };
};
