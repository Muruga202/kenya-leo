import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdSpace } from "@/components/AdSpace";
import { ArticleCard } from "@/components/ArticleCard";
import { TrendingCarousel } from "@/components/TrendingCarousel";
import NewsChatbot from "@/components/NewsChatbot";
import heroBanner from "@/assets/hero-banner.jpg";
import politicsFeature from "@/assets/politics-feature.jpg";
import sportsFeature from "@/assets/sports-feature.jpg";
import lifestyleFeature from "@/assets/lifestyle-feature.jpg";

const featuredArticles = [
  {
    id: "featured-1",
    title: "Parliament Passes Historic Climate Action Bill",
    excerpt: "Landmark legislation sets ambitious targets for renewable energy and environmental protection across the nation.",
    image: politicsFeature,
    category: "Politics",
    date: "1 hour ago",
  },
  {
    id: "featured-2",
    title: "National Team Eyes Continental Glory",
    excerpt: "Coach reveals winning strategy as squad prepares for crucial championship matches.",
    image: sportsFeature,
    category: "Sports",
    date: "3 hours ago",
  },
  {
    id: "featured-3",
    title: "Nairobi's Food Scene Revolution",
    excerpt: "Young chefs blend traditional flavors with modern techniques, creating unique culinary experiences.",
    image: lifestyleFeature,
    category: "Lifestyle",
    date: "5 hours ago",
  },
];

const latestArticles = [
  {
    id: "latest-1",
    title: "County Governments Launch Digital Services Platform",
    excerpt: "New initiative aims to improve service delivery and transparency at local government level.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
    category: "Technology",
    date: "30 minutes ago",
  },
  {
    id: "latest-2",
    title: "Education Reforms Show Promising Results",
    excerpt: "Latest assessment data reveals improvements in student performance across key subjects.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    category: "Education",
    date: "1 hour ago",
  },
  {
    id: "latest-3",
    title: "Tourism Sector Reports Record Growth",
    excerpt: "International visitor numbers surge as Kenya's attractions gain global recognition.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop",
    category: "Business",
    date: "2 hours ago",
  },
  {
    id: "latest-4",
    title: "Healthcare Initiative Reaches Milestone",
    excerpt: "Universal health coverage program expands to cover additional counties this month.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    category: "Health",
    date: "3 hours ago",
  },
  {
    id: "latest-5",
    title: "Local Artists Shine at International Festival",
    excerpt: "Kenyan performers receive standing ovations at prestigious cultural event.",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
    category: "Entertainment",
    date: "4 hours ago",
  },
  {
    id: "latest-6",
    title: "Agriculture Sector Embraces Smart Farming",
    excerpt: "Technology adoption helps farmers increase yields and reduce environmental impact.",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
    category: "Agriculture",
    date: "5 hours ago",
  },
];

const Index = () => {
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
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} {...article} featured />
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
                {latestArticles.map((article) => (
                  <ArticleCard key={article.id} {...article} />
                ))}
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
      <NewsChatbot />
    </div>
  );
};

export default Index;
