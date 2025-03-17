import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Moon, Sun, Menu, X, Server, LogIn, LayoutDashboard } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import AuthStatus from "@/components/auth/AuthStatus";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleAuthAction = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-3 bg-background/80 backdrop-blur-lg shadow-sm" : "py-5 bg-transparent"
      }`}
    >
      <Container className="flex items-center justify-between px-0 mx-0 max-w-none">
        <Link to="/" className="flex items-center ml-24">
          <img src="/A&D-Studios33.png" alt="A&D Studios Logo" className="h-64 w-auto" />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="/#services"
            className="text-sm font-medium transition-colors hover:text-accent"
          >
            Services
          </a>
          <a
            href="/#about"
            className="text-sm font-medium transition-colors hover:text-accent"
          >
            About
          </a>
          <a
            href="/#contact"
            className="text-sm font-medium transition-colors hover:text-accent"
          >
            Contact
          </a>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-foreground" />
            ) : (
              <Moon size={20} className="text-foreground" />
            )}
          </button>
          
          <AuthStatus />
        </nav>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-foreground" />
            ) : (
              <Moon size={20} className="text-foreground" />
            )}
          </button>
          
          <Button
            onClick={handleAuthAction}
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
          >
            {user ? (
              <>
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </>
            )}
          </Button>
          
          <button
            className="p-2 rounded-md hover:bg-secondary transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-md transition-transform duration-300 transform ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Container className="py-4">
          <div className="flex flex-col space-y-4">
            <a
              href="/#services"
              className="px-3 py-2 text-sm font-medium hover:bg-secondary rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="/#about"
              className="px-3 py-2 text-sm font-medium hover:bg-secondary rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="/#contact"
              className="px-3 py-2 text-sm font-medium hover:bg-secondary rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            
            <Button 
              onClick={handleAuthAction}
              className="w-full justify-start"
              variant="default"
            >
              {user ? (
                <>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Login</span>
                </>
              )}
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Header;
