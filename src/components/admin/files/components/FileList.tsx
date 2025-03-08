
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, File, FileText, FileArchive, Film, Music, Image } from 'lucide-react';

interface FileObject {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
}

interface FileListProps {
  files: FileObject[];
  isLoading: boolean;
  selectedFile: FileObject | null;
  onSelectFile: (file: FileObject) => void;
}

export const FileList = ({ files, isLoading, selectedFile, onSelectFile }: FileListProps) => {
  
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <Image className="h-6 w-6 text-blue-500" />;
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'zip':
      case 'rar':
      case '7z':
        return <FileArchive className="h-6 w-6 text-yellow-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Film className="h-6 w-6 text-purple-500" />;
      case 'mp3':
      case 'wav':
        return <Music className="h-6 w-6 text-green-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Files</CardTitle>
        <CardDescription>
          {files.length} files in storage
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : files.length > 0 ? (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {files.map((file) => (
              <Button
                key={file.id}
                variant="ghost"
                className={`w-full justify-start ${selectedFile?.id === file.id ? 'bg-accent' : ''}`}
                onClick={() => onSelectFile(file)}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {getFileIcon(file.name)}
                  <span className="truncate">{file.name}</span>
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No files uploaded yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};
