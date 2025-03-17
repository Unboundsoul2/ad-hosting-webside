import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, Settings, FileText, Users, Database, 
  LogOut, Menu, X, ChevronRight, ChevronDown, Home, Server,
  Sun, Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NavItemProps {
  to?: string;
  href?: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  isExpanded?: boolean;
  hasChildren?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const NavItem = ({ 
  to, 
  href,
  icon: Icon, 
  label, 
  isActive, 
  hasChildren, 
  isExpanded,
  onClick,
  children 
}: NavItemProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    } else if (to) {
      e.preventDefault();
      navigate(to);
    }
  };

  const Component = href ? 'a' : 'button';
  const props = href ? { href } : { onClick: handleClick };

  return (
    <li>
      <div className="relative">
        <Component
          {...props}
          className={cn(
            "flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
          {hasChildren && (
            <span className="ml-auto">
              {isExpanded ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </span>
          )}
        </Component>
      </div>
      {hasChildren && isExpanded && (
        <ul className="ml-6 mt-1 space-y-1">
          {children}
        </ul>
      )}
    </li>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title = "Dashboard" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [contentExpanded, setContentExpanded] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleContentMenu = () => {
    setContentExpanded(!contentExpanded);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const userInitials = profile?.username?.substring(0, 2).toUpperCase() || 
                      user?.email?.substring(0, 2).toUpperCase() || "U";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center border-b px-4 py-4">
          <div className="flex items-center -ml-4">
            <img src="/A&D-Studios33.png" alt="A&D Studios Logo" className="h-56 w-auto" />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <NavItem 
              to="/dashboard" 
              icon={LayoutDashboard} 
              label="Dashboard" 
              isActive={true}
            />
            
            <NavItem 
              to="/dashboard/content" 
              icon={FileText} 
              label="Content Management" 
              hasChildren={true}
              isExpanded={contentExpanded}
              onClick={toggleContentMenu}
            >
              <NavItem 
                to="/dashboard/content/pages" 
                icon={FileText} 
                label="Pages" 
              />
              <NavItem 
                to="/dashboard/content/media" 
                icon={FileText} 
                label="Media" 
              />
            </NavItem>
            
            <NavItem 
              to="/dashboard/clients" 
              icon={Users} 
              label="Client Management" 
            />
            
            <NavItem 
              to="/dashboard/projects" 
              icon={Database} 
              label="Projects" 
            />
            
            <NavItem 
              to="/dashboard/settings" 
              icon={Settings} 
              label="Settings" 
            />
            
            <NavItem 
              href="/" 
              icon={Home} 
              label="Return to Website" 
            />
          </ul>
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url} alt={profile?.username || "User"} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{profile?.username || user?.email}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[160px]">{user?.email}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleTheme} className="flex-1 justify-start">
              {theme === "dark" ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" className="flex-1 justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className={cn(
        "flex-1 transition-all",
        isSidebarOpen ? "md:ml-64" : "ml-0"
      )}>
        <header className="sticky top-0 z-30 flex h-14 items-center bg-background border-b px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2 hidden md:flex"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold">{title}</h2>
        </header>
        
        <main className="container mx-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
