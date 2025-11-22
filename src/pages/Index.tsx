import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdSpace } from "@/components/AdSpace";
import { ArticleCard } from "@/components/ArticleCard";
import { TrendingCarousel } from "@/components/TrendingCarousel";
import { supabase } from "@/integrations/supabase/client";
import heroBanner from "@/assets/hero-banner.jpg";
import politicsFeature from "@/assets/politics-feature.jpg";

const Index = () => {
  const [featuredArticles, setFeaturedArticles] = useState<any[]>([]);
  const [latestArticles, setLatestArticles] = useState<any[]>([]);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      // Load featured articles
      const { data: featured } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      // Load latest articles
      const { data: latest } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      setFeaturedArticles(featured || []);
      setLatestArticles(latest || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Default featured content if no articles in database
  const defaultFeatured = [
    {
      id: "default-1",
      title: "AI-Powered News Generation Now Live",
      excerpt: "Kenya Leo Media introduces cutting-edge AI technology to deliver faster, more accurate news coverage.",
      image_url: politicsFeature,
      category: "technology",
      created_at: new Date().toISOString(),
    }
  ];

  const displayFeatured = featuredArticles.length > 0 ? featuredArticles : defaultFeatured;
  const displayLatest = latestArticles.length > 0 ? latestArticles : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[500px] md:h-[600px] overflow-hidden">
          <img
            src={heroBanner}
            alt="Kenya Leo Media Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto">
              <span className="inline-block bg-breaking text-white px-4 py-1.5 rounded-md text-sm font-bold uppercase tracking-wider mb-4">
                Breaking News
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl leading-tight">
                Kenya Leads East African Economic Integration Efforts
              </h2>
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl mb-6">
                Regional leaders gather in Nairobi for historic summit on trade, infrastructure, and shared prosperity.
              </p>
            </div>
          </div>
        </section>

        {/* Top Banner Ad */}
        <div className="container mx-auto px-4 py-6">
          <AdSpace type="banner" />
        </div>

        {/* Featured Articles */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-3xl font-bold">Featured Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayFeatured.map((article) => (
              <ArticleCard 
                key={article.id} 
                id={article.id}
                title={article.title}
                excerpt={article.excerpt}
                image={article.image_url || politicsFeature}
                category={article.category}
                date={formatDate(article.created_at)}
                featured 
              />
            ))}
          </div>
        </section>

        {/* Trending Carousel */}
        <TrendingCarousel />

        {/* Latest News with Sidebar */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-secondary rounded-full" />
                <h2 className="text-3xl font-bold">Latest News</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayLatest.length > 0 ? (
                  displayLatest.map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      id={article.id}
                      title={article.title}
                      excerpt={article.excerpt}
                      image={article.image_url || "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=800&h=600&fit=crop"}
                      category={article.category}
                      date={formatDate(article.created_at)}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">
                    <p>No articles published yet. Check back soon!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <AdSpace type="sidebar" />
              
              <div className="bg-card rounded-lg shadow-card p-6">
                <h3 className="text-xl font-bold mb-4">Most Read</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                      <span className="text-2xl font-bold text-primary/20">{i}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm leading-tight mb-1 hover:text-primary cursor-pointer transition-colors">
                          Breaking story headline goes here for article number {i}
                        </h4>
                        <span className="text-xs text-muted-foreground">{i} hours ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
