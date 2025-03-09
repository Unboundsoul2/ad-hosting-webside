import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { Loader2 } from 'lucide-react';
import { verifyAdminLogin } from '@/components/chat/AdminService';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check for admin token in session storage
    const adminToken = sessionStorage.getItem('adminPassphrase');
    
    if (adminToken) {
      verifyAdmin(adminToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyAdmin = async (passphrase: string) => {
    setIsLoading(true);
    
    try {
      const { verified, username } = await verifyAdminLogin(passphrase);
      
      if (verified && username) {
        setIsAdmin(true);
        setUsername(username);
        sessionStorage.setItem('adminPassphrase', passphrase);
        sessionStorage.setItem('adminUsername', username);
        
        // If on the admin root path, navigate to dashboard
        if (location.pathname === '/admin') {
          navigate('/admin/dashboard');
        }
        
        toast({
          title: "Admin access granted",
          description: `Welcome back, ${username}!`,
        });
      } else {
        // Invalid token, clear storage
        sessionStorage.removeItem('adminPassphrase');
        sessionStorage.removeItem('adminUsername');
      }
    } catch (error) {
      console.error('Error verifying admin:', error);
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "There was a problem verifying your admin credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (passphrase: string) => {
    await verifyAdmin(passphrase);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setUsername('');
    sessionStorage.removeItem('adminPassphrase');
    sessionStorage.removeItem('adminUsername');
    navigate('/admin');
    
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {isAdmin ? (
        <AdminDashboard 
          username={username} 
          onLogout={handleLogout}
        >
          <Outlet />
        </AdminDashboard>
      ) : (
        <AdminLoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default Admin;
