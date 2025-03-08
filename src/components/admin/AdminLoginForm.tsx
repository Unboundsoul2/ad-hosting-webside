
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, Info } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminLoginFormProps {
  onLogin: (passphrase: string) => Promise<void>;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLogin }) => {
  const [passphrase, setPassphrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await onLogin(passphrase);
      // The parent component will handle the redirect if login is successful
    } catch (error) {
      setError('Invalid passphrase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Admin Login</CardTitle>
          </div>
          <CardDescription>
            Enter your admin passphrase to access the dashboard
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Admin passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full"
                autoFocus
                required
              />
              
              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}
            </div>
            
            <Alert variant="default" className="bg-muted">
              <Info className="h-4 w-4" />
              <AlertDescription>
                No admin account yet? Type "activate patriot mode" in the chat interface on the home page to create the first admin account.
              </AlertDescription>
            </Alert>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !passphrase.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : 'Access Dashboard'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Container>
  );
};
