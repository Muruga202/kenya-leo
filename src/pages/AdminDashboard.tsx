import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Image, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Eye,
  Plus,
  LogOut,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setArticles(data || []);
    } catch (error: any) {
      console.error('Error loading articles:', error);
      toast({
        title: "Error loading articles",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishToggle = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentStatus ? "Article unpublished" : "Article published",
      });
      loadArticles();
    } catch (error: any) {
      toast({
        title: "Error updating article",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Article deleted",
      });
      loadArticles();
    } catch (error: any) {
      toast({
        title: "Error deleting article",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const stats = [
    { label: "Total Articles", value: articles.length.toString(), icon: FileText, color: "text-primary" },
    { label: "Published", value: articles.filter(a => a.published).length.toString(), icon: Eye, color: "text-secondary" },
    { label: "Drafts", value: articles.filter(a => !a.published).length.toString(), icon: FileText, color: "text-muted-foreground" },
    { label: "Active Ads", value: "23", icon: DollarSign, color: "text-accent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">KL</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Kenya Leo Admin</h1>
              <p className="text-xs text-muted-foreground">Content Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm" asChild>
              <Link to="/admin/news-generator">
                <Sparkles className="mr-2 h-4 w-4" />
                AI News Generator
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <Eye className="mr-2 h-4 w-4" />
                View Site
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              supabase.auth.signOut();
              toast({ title: "Logged out successfully" });
              navigate('/admin/login');
            }}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-12 w-12 ${stat.color} opacity-20`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="ads">Advertisements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Manage Articles</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Article
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Articles</CardTitle>
                <CardDescription>Manage and monitor your published content</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading articles...</div>
                ) : articles.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">No articles yet</p>
                    <Button asChild>
                      <Link to="/admin/news-generator">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Your First Article
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {articles.map((article) => (
                      <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{article.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              article.published 
                                ? 'bg-secondary/20 text-secondary-foreground' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {article.published ? 'Published' : 'Draft'}
                            </span>
                            <span className="capitalize">{article.category}</span>
                            <span>{new Date(article.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePublishToggle(article.id, article.published)}
                          >
                            {article.published ? 'Unpublish' : 'Publish'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(article.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Media Library</CardTitle>
                <CardDescription>Upload and manage images for articles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No media files yet</h3>
                  <p className="text-muted-foreground mb-4">Upload images to get started</p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Media
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ads">
            <Card>
              <CardHeader>
                <CardTitle>Advertisement Management</CardTitle>
                <CardDescription>Manage banner ads, sidebar ads, and sponsored content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <DollarSign className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ad Management</h3>
                  <p className="text-muted-foreground mb-4">Create and manage advertisements</p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Ad Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>Monitor your site performance and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">Detailed analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
