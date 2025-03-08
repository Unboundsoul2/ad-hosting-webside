
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import UserProfile from "./UserProfile";
import { Link } from "react-router-dom";
import { LogIn, LayoutDashboard } from "lucide-react";

const AuthStatus = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="w-24 h-9 animate-pulse bg-secondary/50 rounded-md"></div>;
  }

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm" className="flex items-center gap-2">
        <Link to="/auth">
          <LogIn className="h-4 w-4" />
          <span>Login</span>
        </Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button asChild variant="outline" size="sm" className="flex items-center gap-2 bg-accent/10 border-accent/20">
        <Link to="/dashboard">
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
      </Button>
      <UserProfile />
    </div>
  );
};

export default AuthStatus;
