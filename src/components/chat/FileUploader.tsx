
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onSelectFile: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onSelectFile,
  onCancel,
  isLoading
}) => {
  return (
    <div className="flex w-full items-center space-x-2">
      <Button 
        className="flex-1 justify-center"
        onClick={onSelectFile}
        disabled={isLoading}
      >
        <Upload size={18} className="mr-2" />
        Select File
      </Button>
      <Button 
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
    </div>
  );
};

export default FileUploader;
