import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdSpace } from "@/components/AdSpace";
import { Button } from "@/components/ui/button";
import { Share2, Facebook, Twitter, Linkedin, Clock, User } from "lucide-react";
import politicsFeature from "@/assets/politics-feature.jpg";

const ArticleDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/category/politics" className="hover:text-primary transition-colors">Politics</Link>
            <span>/</span>
            <span>Article</span>
          </div>

          {/* Category Badge */}
          <span className="inline-block bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-sm font-bold uppercase tracking-wider mb-4">
            Politics
          </span>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Parliament Passes Historic Climate Action Bill
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>By <strong className="text-foreground">John Kamau</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>1 hour ago</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="mr-2">Share:</span>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          <img
            src={politicsFeature}
            alt="Parliament session"
            className="w-full rounded-lg shadow-featured mb-8"
          />

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              In a landmark decision that marks a turning point for environmental policy, 
              Parliament has unanimously passed the Climate Action Bill, setting ambitious 
              targets for renewable energy adoption and carbon emission reductions.
            </p>

            <p className="mb-4">
              The legislation, which has been in development for over two years, establishes 
              a comprehensive framework for addressing climate change while promoting sustainable 
              economic growth. It includes provisions for transitioning to renewable energy sources, 
              protecting natural ecosystems, and supporting communities affected by climate-related challenges.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Key Provisions</h2>
            
            <p className="mb-4">
              The bill outlines several critical measures that will reshape the nation's approach 
              to environmental protection. Among the most significant provisions is the commitment 
              to achieve 70% renewable energy generation by 2030, a target that experts say is 
              ambitious yet achievable with proper implementation.
            </p>

            {/* Mid-article Ad */}
            <div className="my-8">
              <AdSpace type="sponsored" />
            </div>

            <p className="mb-4">
              Additionally, the legislation establishes a Climate Action Fund that will provide 
              financial support for green technology adoption, reforestation projects, and climate 
              adaptation initiatives in vulnerable regions. The fund will be capitalized through 
              a combination of government allocations and private sector contributions.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Industry Response</h2>

            <p className="mb-4">
              Business leaders and environmental organizations have largely welcomed the new law, 
              though some have expressed concerns about implementation timelines and regulatory 
              compliance costs. Industry representatives emphasize the need for clear guidelines 
              and adequate transition periods to ensure smooth adaptation.
            </p>

            <p className="mb-4">
              "This is a historic moment for our country," said Dr. Margaret Njeri, Director of 
              the Environmental Policy Institute. "The bill demonstrates genuine commitment to 
              addressing climate change while recognizing the importance of economic development. 
              Success will depend on effective implementation and sustained political will."
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Next Steps</h2>

            <p className="mb-4">
              The legislation now moves to the President for signing, after which implementing 
              regulations will be developed by relevant ministries. Government officials have 
              indicated that initial programs under the new law could begin within six months, 
              with full implementation expected over the next three years.
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
            <span className="text-sm font-medium text-muted-foreground">Tags:</span>
            <Button variant="outline" size="sm" className="h-7 text-xs">Climate</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">Parliament</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">Environment</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">Policy</Button>
          </div>
        </article>

        {/* Related Articles */}
        <section className="container mx-auto px-4 py-12 max-w-6xl border-t">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Link key={i} to={`/article/related-${i}`} className="group">
                <div className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-featured transition-all">
                  <img
                    src="https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=400&h=250&fit=crop"
                    alt="Related article"
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      Related news article headline goes here
                    </h3>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetail;
