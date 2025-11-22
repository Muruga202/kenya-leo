import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArticleCard } from "./ArticleCard";

const trendingArticles = [
  {
    id: "1",
    title: "Kenya's Economic Recovery Gains Momentum in Q4",
    excerpt: "Latest data shows promising growth across key sectors including agriculture, technology, and tourism.",
    image: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=800&h=600&fit=crop",
    category: "Business",
    date: "2 hours ago",
  },
  {
    id: "2",
    title: "Harambee Stars Secure Historic Victory",
    excerpt: "National team's impressive performance sets new records in regional championship.",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop",
    category: "Sports",
    date: "4 hours ago",
  },
  {
    id: "3",
    title: "New Infrastructure Projects Transform Nairobi",
    excerpt: "Major developments in transportation and housing reshape the capital's landscape.",
    image: "https://images.unsplash.com/photo-1573167243872-43c6433b9d40?w=800&h=600&fit=crop",
    category: "Development",
    date: "6 hours ago",
  },
  {
    id: "4",
    title: "Tech Innovation Hub Opens in Westlands",
    excerpt: "New facility aims to support local startups and entrepreneurs with cutting-edge resources.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
    category: "Technology",
    date: "8 hours ago",
  },
];

export const TrendingCarousel = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-trending rounded-full" />
          <h2 className="text-3xl font-bold">Trending Now</h2>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {trendingArticles.map((article) => (
              <CarouselItem key={article.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <ArticleCard {...article} trending />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};
