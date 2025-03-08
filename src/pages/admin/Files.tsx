
import { FileManager } from '@/components/admin/files/FileManager';
import { useEffect, useState } from 'react';

const Files = () => {
  const [adminUsername, setAdminUsername] = useState<string>('');
  
  useEffect(() => {
    const username = sessionStorage.getItem('adminUsername');
    if (username) {
      setAdminUsername(username);
    }
  }, []);
  
  return <FileManager adminUsername={adminUsername} />;
};

export default Files;
