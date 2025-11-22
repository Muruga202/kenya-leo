import { Link } from "react-router-dom";
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
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();

  const stats = [
    { label: "Total Articles", value: "1,234", icon: FileText, color: "text-primary" },
    { label: "Active Ads", value: "23", icon: DollarSign, color: "text-secondary" },
    { label: "Total Views", value: "450K", icon: Eye, color: "text-accent" },
    { label: "Subscribers", value: "12.5K", icon: Users, color: "text-trending" },
  ];

  const recentArticles = [
    { id: 1, title: "Parliament Passes Historic Climate Action Bill", status: "Published", views: "12.5K" },
    { id: 2, title: "National Team Eyes Continental Glory", status: "Published", views: "8.2K" },
    { id: 3, title: "Nairobi's Food Scene Revolution", status: "Draft", views: "-" },
    { id: 4, title: "Tech Innovation Hub Opens in Westlands", status: "Published", views: "5.1K" },
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
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <Eye className="mr-2 h-4 w-4" />
                View Site
              </Link>
            </Button>
            <Button variant="outline" size="sm">
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
                <div className="space-y-4">
                  {recentArticles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{article.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            article.status === 'Published' 
                              ? 'bg-secondary/20 text-secondary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {article.status}
                          </span>
                          {article.views !== '-' && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.views}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
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
