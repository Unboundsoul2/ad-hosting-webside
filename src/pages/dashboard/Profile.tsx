
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import UserProfileSettings from '@/components/dashboard/UserProfileSettings';

const ProfilePage = () => {
  return (
    <DashboardLayout title="Profile Settings">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        <UserProfileSettings />
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
