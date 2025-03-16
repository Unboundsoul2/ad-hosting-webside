import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Migration from "./pages/Migration";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import Content from "./pages/admin/Content";
import Files from "./pages/admin/Files";
import Settings from "./pages/admin/Settings";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";
import { configService } from "./services/ConfigService";
import { memoryService } from "./services/MemoryService";
import { setupStorage } from "./supabase/storage-setup";
import { Analytics } from '@vercel/analytics/react';

const queryClient = new QueryClient();

const App = () => {
  // Initialize services and track app startup
  useEffect(() => {
    // Log app initialization
    console.log('App initializing...');
    
    // Load configuration
    configService.loadConfigState().then(loaded => {
      console.log(`Configuration ${loaded ? 'loaded' : 'initialized with defaults'}`);
      
      // Track app startup
      memoryService.trackActivity('app_started', {
        env: configService.getConfig().environment,
        platform: configService.getConfig().platformInfo.type
      });
    });

    // Initialize Supabase storage
    setupStorage().catch(err => {
      console.error('Failed to initialize storage:', err);
    });

    return () => {
      // Clean up services when app unmounts
      memoryService.trackActivity('app_closed');
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/migration" element={<Migration />} />
                
                {/* User Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<Admin />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="content" element={<Content />} />
                  <Route path="files" element={<Files />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Analytics />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
