import React from 'react';

export const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Welcome to <img src="/A&D-Studios33.png" alt="A&D Studios Logo" className="h-64 w-auto inline-block mx-2" />
      </h1>

      <p className="text-muted-foreground mt-4">
        <img src="/A&D-Studios33.png" alt="A&D Studios Logo" className="h-32 w-auto inline-block mr-2" />
        provides reliable hosting solutions for your websites and applications.
      </p>
    </div>
  );
}; 