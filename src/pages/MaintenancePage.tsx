import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wrench } from 'lucide-react';

const MaintenancePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            Site Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>Under Maintenance</AlertTitle>
            <AlertDescription>
              We are currently performing scheduled maintenance to improve our services.
              Please check back later. We apologize for any inconvenience.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenancePage; 