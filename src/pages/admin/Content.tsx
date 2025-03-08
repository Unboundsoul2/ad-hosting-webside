
import { PagesManager } from '@/components/admin/content/PagesManager';
import { useEffect, useState } from 'react';

const Content = () => {
  const [adminUsername, setAdminUsername] = useState<string>('');
  
  useEffect(() => {
    const username = sessionStorage.getItem('adminUsername');
    if (username) {
      setAdminUsername(username);
    }
  }, []);
  
  return <PagesManager adminUsername={adminUsername} />;
};

export default Content;
