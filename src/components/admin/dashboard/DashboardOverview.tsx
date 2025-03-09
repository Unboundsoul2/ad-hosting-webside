import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { getAdminAuditLogs } from '@/utils/adminAudit';
import { supabase } from '@/integrations/supabase/client';
import { Tables, WebsiteContent, AdminStat } from '@/integrations/supabase/schema';
import { Loader2, RefreshCw, Users, FileText, ActivitySquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const DashboardOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [contentCount, setContentCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [stats, setStats] = useState<AdminStat[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  const fetchDashboardData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch recent activity
      const auditLogs = await getAdminAuditLogs(10);
      setRecentActivity(auditLogs);
      
      // Count website content entries
      const { count: contentTotal, error: contentError } = await supabase
        .from(Tables.WEBSITE_CONTENT)
        .select('*', { count: 'exact', head: true });
      
      if (!contentError) {
        setContentCount(contentTotal || 0);
      }
      
      // Count users
      const { count: userTotal, error: userError } = await supabase
        .from(Tables.PROFILES)
        .select('*', { count: 'exact', head: true });
      
      if (!userError) {
        setUserCount(userTotal || 0);
      }
      
      // For admin_stats, we'll use a workaround since it might not be in the types yet
      // Using 'as any' to bypass TypeScript error until Supabase types are regenerated
      const { data: statsData, error: statsError } = await (supabase as any)
        .from(Tables.ADMIN_STATS)
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(10);
      
      if (!statsError && statsData) {
        // Ensure we're casting to the correct type
        setStats(statsData as AdminStat[]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchDashboardData} 
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Website Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{contentCount}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total content entries</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">User Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-6 w-6 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{userCount}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Registered users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admin Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ActivitySquare className="h-6 w-6 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{recentActivity.length}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Recent admin actions</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest admin actions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((log) => (
                  <div key={log.id} className="border-b pb-2 last:border-0">
                    <div className="flex justify-between">
                      <span className="font-medium">{log.action}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">by {log.admin_username}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
            <CardDescription>Summary of website content</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-3">
                    <div className="text-muted-foreground text-sm">Pages</div>
                    <div className="text-2xl font-bold mt-1">
                      {contentCount > 0 ? Math.floor(contentCount * 0.6) : 0}
                    </div>
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="text-muted-foreground text-sm">Banners</div>
                    <div className="text-2xl font-bold mt-1">
                      {contentCount > 0 ? Math.floor(contentCount * 0.4) : 0}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => console.log('View content')}>
              View All Content
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
