import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js', 'zustand', 'zod', 'tailwindcss', 'clsx', 'lucide-react']
              .some(dep => id.includes(dep))) {
              return 'vendor';
            }
            if (['@radix-ui/react-dialog', '@radix-ui/react-slot', '@radix-ui/react-label', '@radix-ui/react-tabs', 'class-variance-authority']
              .some(dep => id.includes(dep))) {
              return 'ui-core';
            }
            if (['tailwind-merge', '@hookform/resolvers', 'react-hook-form']
              .some(dep => id.includes(dep))) {
              return 'ui-utils';
            }
          }
        }
      }
    }
  }
}));
