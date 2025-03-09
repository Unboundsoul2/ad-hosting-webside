import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";
import Testimonials from "@/components/sections/Testimonials";
import ChatInterface from "@/components/chat/ChatInterface";
import { Shield } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  // Redirect logged-in users to dashboard on direct landing page access
  useEffect(() => {
    if (user) {
      // Wait a brief moment to ensure user experience is smooth
      const redirectTimer = setTimeout(() => {
        navigate("/dashboard");
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-20">
        <Hero />
        <Services />
        <Testimonials />
        <About />
        <Contact />
        
        {user && (
          <Container className="my-8 flex justify-center">
            <Button asChild variant="default" size="lg" className="flex items-center gap-2 animate-pulse shadow-md">
              <Link to="/dashboard">
                <Shield className="h-5 w-5" />
                <span>Access Dashboard</span>
              </Link>
            </Button>
          </Container>
        )}
      </main>
      <Footer />
      
      {showChat ? (
        <ChatInterface />
      ) : (
        <div className="fixed bottom-8 right-8 z-50">
          <Button 
            onClick={() => setShowChat(true)} 
            className="rounded-full h-14 w-14 shadow-lg"
            variant="default"
          >
            Chat
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
