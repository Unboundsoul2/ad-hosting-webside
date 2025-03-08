
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, Trash2, Image, File, FileText, FileArchive, Film, Music } from 'lucide-react';
import { bytesToSize } from '@/lib/utils';

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

interface FileDetailsProps {
  selectedFile: FileObject | null;
  getFileUrl: (fileName: string) => string;
  onDeleteFile: (fileName: string) => void;
}

export const FileDetails = ({ selectedFile, getFileUrl, onDeleteFile }: FileDetailsProps) => {
  
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
  
  const isImageFile = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
  };
  
  if (!selectedFile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[400px] text-muted-foreground">
          Select a file to view details
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="truncate">{selectedFile.name}</CardTitle>
            <CardDescription>
              {bytesToSize(selectedFile.metadata.size || 0)}
            </CardDescription>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeleteFile(selectedFile.name)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isImageFile(selectedFile.name) ? (
          <div className="border rounded-md overflow-hidden">
            <img
              src={getFileUrl(selectedFile.name)}
              alt={selectedFile.name}
              className="w-full h-auto max-h-[400px] object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center border rounded-md p-12">
            {getFileIcon(selectedFile.name)}
            <span className="ml-2">{selectedFile.name}</span>
          </div>
        )}
        
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Created</Label>
              <p className="text-sm">
                {new Date(selectedFile.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Last Updated</Label>
              <p className="text-sm">
                {new Date(selectedFile.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div>
            <Label className="text-muted-foreground">File Type</Label>
            <p className="text-sm">{selectedFile.metadata.mimetype}</p>
          </div>
          
          <div>
            <Label className="text-muted-foreground">File Path</Label>
            <p className="text-sm font-mono truncate">
              {`admin_uploads/${selectedFile.name}`}
            </p>
          </div>
        </div>
      
        <div className="pt-6">
          <Button 
            className="w-full"
            variant="outline"
            onClick={() => window.open(getFileUrl(selectedFile.name), '_blank')}
          >
            <Download className="mr-2 h-4 w-4" />
            Download File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
