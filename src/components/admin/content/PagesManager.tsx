
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentEditor } from './ContentEditor';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/schema';
import { Loader2, Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PagesManager = ({ adminUsername }: { adminUsername: string }) => {
  const [pages, setPages] = useState<{ section: string; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [newPageName, setNewPageName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  
  const fetchPages = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from(Tables.WEBSITE_CONTENT)
        .select('section')
        .like('section', 'page_%');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedPages = data.map(item => ({
          section: item.section,
          title: item.section.replace('page_', '').replace(/_/g, ' ')
        }));
        
        setPages(formattedPages);
        
        if (formattedPages.length > 0 && !selectedPage) {
          setSelectedPage(formattedPages[0].section);
        }
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load pages. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const createNewPage = async () => {
    if (!newPageName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Page name cannot be empty'
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      const pageName = newPageName.trim();
      const sectionKey = `page_${pageName.toLowerCase().replace(/\s+/g, '_')}`;
      
      // Check if page already exists
      const { data, error: checkError } = await supabase
        .from(Tables.WEBSITE_CONTENT)
        .select('id')
        .eq('section', sectionKey)
        .single();
      
      if (data) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'A page with this name already exists'
        });
        return;
      }
      
      // Create new page with initial content
      const { error } = await supabase
        .from(Tables.WEBSITE_CONTENT)
        .insert({
          section: sectionKey,
          content: `<h1>${pageName}</h1>\n<p>This is the content for the ${pageName} page.</p>`,
          created_by: adminUsername,
          updated_by: adminUsername,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Page Created',
        description: `The page "${pageName}" has been created successfully.`
      });
      
      setNewPageName('');
      fetchPages();
      setSelectedPage(sectionKey);
    } catch (error) {
      console.error('Error creating page:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create page. Please try again.'
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  useEffect(() => {
    fetchPages();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pages Management</h1>
        <Button
          variant="outline"
          onClick={fetchPages}
          disabled={isLoading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Pages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="new-page">New Page</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="new-page"
                      value={newPageName}
                      onChange={(e) => setNewPageName(e.target.value)}
                      placeholder="Page name"
                    />
                    <Button
                      size="icon"
                      disabled={isCreating || !newPageName.trim()}
                      onClick={createNewPage}
                    >
                      {isCreating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="border-t my-2"></div>
                
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : pages.length > 0 ? (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {pages.map((page) => (
                      <Button
                        key={page.section}
                        variant={selectedPage === page.section ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setSelectedPage(page.section)}
                      >
                        {page.title}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No pages found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          {selectedPage ? (
            <ContentEditor
              section={selectedPage}
              title={selectedPage.replace('page_', '').replace(/_/g, ' ')}
              adminUsername={adminUsername}
              description="Edit the content of this page"
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center min-h-[400px] text-muted-foreground">
                Select a page to edit or create a new one
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
