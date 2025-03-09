import { useEffect } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardWelcome from '@/components/dashboard/DashboardWelcome';
import ProfilePage from '@/pages/dashboard/Profile';

const DashboardIndex = () => {
  // Show nothing while checking authentication
  return (
    <DashboardLayout title="Dashboard">
      <DashboardWelcome />
    </DashboardLayout>
  );
};

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // Protected content only shown to authenticated users
  return (
    <Routes>
      <Route index element={<DashboardIndex />} />
      <Route path="profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default Dashboard;
