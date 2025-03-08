
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';
import { FileList } from './components/FileList';
import { FileDetails } from './components/FileDetails';
import { FileUploader } from './components/FileUploader';
import { 
  FileObject, 
  fetchFilesFromStorage, 
  uploadFileToStorage, 
  deleteFileFromStorage,
  getFilePublicUrl
} from './components/FileUtils';

export const FileManager = ({ adminUsername }: { adminUsername: string }) => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileObject | null>(null);
  const { toast } = useToast();
  
  const fetchFiles = async () => {
    setIsLoading(true);
    const fetchedFiles = await fetchFilesFromStorage(adminUsername);
    setFiles(fetchedFiles);
    setIsLoading(false);
  };
  
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    
    const success = await uploadFileToStorage(
      file,
      adminUsername,
      () => {
        toast({
          title: 'File Uploaded',
          description: `${file.name} has been successfully uploaded.`
        });
        fetchFiles();
      },
      (errorMessage) => {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: errorMessage
        });
      }
    );
    
    setIsUploading(false);
  };
  
  const deleteFile = async (fileName: string) => {
    await deleteFileFromStorage(
      fileName,
      adminUsername,
      () => {
        toast({
          title: 'File Deleted',
          description: `${fileName} has been successfully deleted.`
        });
        setSelectedFile(null);
        fetchFiles();
      },
      (errorMessage) => {
        toast({
          variant: 'destructive',
          title: 'Deletion Failed',
          description: errorMessage
        });
      }
    );
  };
  
  const getFileUrl = (fileName: string) => {
    return getFilePublicUrl(fileName, adminUsername);
  };
  
  useEffect(() => {
    if (adminUsername) {
      fetchFiles();
    }
  }, [adminUsername]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">File Management</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchFiles}
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <FileUploader 
            isUploading={isUploading}
            onUpload={handleFileUpload}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FileList 
            files={files}
            isLoading={isLoading}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
          />
        </div>
        
        <div className="md:col-span-2">
          <FileDetails 
            selectedFile={selectedFile}
            getFileUrl={getFileUrl}
            onDeleteFile={deleteFile}
          />
        </div>
      </div>
    </div>
  );
};
