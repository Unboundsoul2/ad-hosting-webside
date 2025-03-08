
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/schema';
import { logAdminAction } from '@/utils/adminAudit';
import { useToast } from '@/hooks/use-toast';

interface ContentEditorProps {
  section: string;
  title: string;
  adminUsername: string;
  description?: string;
  initialContent?: string;
  onSave?: (content: string) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  section,
  title,
  adminUsername,
  description,
  initialContent = '',
  onSave
}) => {
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const fetchContent = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from(Tables.WEBSITE_CONTENT)
        .select('content')
        .eq('section', section)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching content:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load content. Please try again.'
        });
      } else if (data) {
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveContent = async () => {
    setIsSaving(true);
    
    try {
      // Check if content already exists
      const { data: existingData, error: fetchError } = await supabase
        .from(Tables.WEBSITE_CONTENT)
        .select('id')
        .eq('section', section)
        .single();
      
      let operation;
      if (existingData) {
        // Update existing content
        operation = supabase
          .from(Tables.WEBSITE_CONTENT)
          .update({
            content,
            updated_by: adminUsername,
            updated_at: new Date().toISOString()
          })
          .eq('section', section);
      } else {
        // Insert new content
        operation = supabase
          .from(Tables.WEBSITE_CONTENT)
          .insert({
            section,
            content,
            created_by: adminUsername,
            updated_by: adminUsername,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
      
      const { error } = await operation;
      
      if (error) {
        throw error;
      }
      
      await logAdminAction(
        adminUsername,
        `Content Updated: ${section}`,
        { contentLength: content.length }
      );
      
      toast({
        title: 'Content Saved',
        description: 'The content has been successfully updated.',
      });
      
      if (onSave) {
        onSave(content);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save content. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  useEffect(() => {
    if (!initialContent) {
      fetchContent();
    } else {
      setContent(initialContent);
    }
  }, [initialContent, section]);
  
  const isTextContent = !content.startsWith('{') && !content.startsWith('[');
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isTextContent ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter content here..."
            className="min-h-[200px] font-mono"
          />
        ) : (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter JSON content here..."
            className="min-h-[200px] font-mono"
            spellCheck="false"
          />
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={fetchContent}
          disabled={isLoading || isSaving}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        
        <Button
          onClick={saveContent}
          disabled={isLoading || isSaving}
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save
        </Button>
      </CardFooter>
    </Card>
  );
};
