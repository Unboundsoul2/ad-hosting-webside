import React, { useEffect } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MigrationManager from "@/components/migration/MigrationManager";
import { memoryService } from "@/services/MemoryService";
import { configService } from "@/services/ConfigService";

const Migration = () => {
  useEffect(() => {
    // Track page visit
    memoryService.trackActivity('migration_page_visited', {
      platform: configService.getConfig().platformInfo.type
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-12 px-4 pt-20">
        <h1 className="text-3xl font-bold mb-8 text-center">Platform Migration</h1>
        <MigrationManager />
      </main>
      <Footer />
    </div>
  );
};

export default Migration;
