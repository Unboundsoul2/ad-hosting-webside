import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Settings, FileText, Users, BarChart3, Upload, 
  LogOut, Menu, X, ChevronRight, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { logAdminAction } from '@/utils/adminAudit';

interface AdminDashboardProps {
  username: string;
  onLogout: () => void;
  children: React.ReactNode;
}

interface NavItemProps {
  to: string;
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
  icon: Icon, 
  label, 
  isActive, 
  hasChildren, 
  isExpanded,
  onClick,
  children 
}: NavItemProps) => {
  return (
    <li>
      <div className="relative">
        <NavLink
          to={to}
          onClick={onClick}
          className={({ isActive: routeActive }) => cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            routeActive || isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
          )}
          end={to === "/admin/dashboard"}
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
        </NavLink>
      </div>
      {hasChildren && isExpanded && (
        <ul className="ml-6 mt-1 space-y-1">
          {children}
        </ul>
      )}
    </li>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  username, 
  onLogout,
  children 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [contentExpanded, setContentExpanded] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logAdminAction(username, 'Admin Logout', { 
        timestamp: new Date().toISOString() 
      });
      onLogout();
      navigate('/admin');
    } catch (error) {
      console.error('Error logging out:', error);
      onLogout();
      navigate('/admin');
    }
  };

  const toggleContentMenu = () => {
    setContentExpanded(!contentExpanded);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
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

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center border-b px-4 py-4">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <NavItem 
              to="/admin/dashboard" 
              icon={LayoutDashboard} 
              label="Dashboard" 
            />
            
            <NavItem 
              to="/admin/content" 
              icon={FileText} 
              label="Content Management" 
              hasChildren={true}
              isExpanded={contentExpanded}
              onClick={toggleContentMenu}
            >
              <NavItem 
                to="/admin/content/pages" 
                icon={FileText} 
                label="Pages" 
              />
              <NavItem 
                to="/admin/content/banner" 
                icon={FileText} 
                label="Banner" 
              />
            </NavItem>
            
            <NavItem 
              to="/admin/users" 
              icon={Users} 
              label="User Management" 
            />
            
            <NavItem 
              to="/admin/analytics" 
              icon={BarChart3} 
              label="Analytics" 
            />
            
            <NavItem 
              to="/admin/files" 
              icon={Upload} 
              label="File Management" 
            />
            
            <NavItem 
              to="/admin/settings" 
              icon={Settings} 
              label="Settings" 
            />
          </ul>
        </nav>

        <div className="border-t p-4">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Logged in as: <span className="font-semibold text-foreground">{username}</span>
          </div>
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
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
          <h2 className="text-lg font-semibold">Admin Portal</h2>
        </header>
        
        <main className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};
