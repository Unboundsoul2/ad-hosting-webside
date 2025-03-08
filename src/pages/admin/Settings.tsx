
import { AdminSettings } from '@/components/admin/settings/AdminSettings';
import { useEffect, useState } from 'react';

const Settings = () => {
  const [adminUsername, setAdminUsername] = useState<string>('');
  
  useEffect(() => {
    const username = sessionStorage.getItem('adminUsername');
    if (username) {
      setAdminUsername(username);
    }
  }, []);
  
  return <AdminSettings adminUsername={adminUsername} />;
};

export default Settings;
