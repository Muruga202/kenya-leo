import { Link } from "react-router-dom";
import { Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  featured?: boolean;
  trending?: boolean;
}

export const ArticleCard = ({
  id,
  title,
  excerpt,
  image,
  category,
  date,
  featured = false,
  trending = false,
}: ArticleCardProps) => {
  return (
    <Link to={`/article/${id}`} className="group">
      <article
        className={cn(
          "bg-card rounded-lg overflow-hidden transition-all duration-300",
          featured
            ? "shadow-featured hover:shadow-hover"
            : "shadow-card hover:shadow-featured"
        )}
      >
        <div className="relative overflow-hidden">
          {trending && (
            <div className="absolute top-3 right-3 z-10 bg-trending text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Trending
            </div>
          )}
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
              {category}
            </span>
          </div>
          <img
            src={image}
            alt={title}
            className="w-full h-48 md:h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-5">
          <h3
            className={cn(
              "font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors",
              featured ? "text-xl md:text-2xl" : "text-lg"
            )}
          >
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{date}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};
