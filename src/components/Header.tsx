import { Link } from "react-router-dom";
import { Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const categories = [
  { name: "Breaking News", path: "/category/breaking" },
  { name: "Politics", path: "/category/politics" },
  { name: "Sports", path: "/category/sports" },
  { name: "Entertainment", path: "/category/entertainment" },
  { name: "Lifestyle", path: "/category/lifestyle" },
  { name: "Business", path: "/category/business" },
];

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-card shadow-sm">
      {/* Top Bar - Breaking News Ticker */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2 flex items-center gap-4">
          <span className="font-bold text-sm uppercase tracking-wider whitespace-nowrap">Breaking:</span>
          <div className="overflow-hidden flex-1">
            <p className="text-sm animate-marquee whitespace-nowrap">
              Kenya's Economy Shows Strong Recovery • New Infrastructure Projects Announced • Sports: Harambee Stars Win Regional Championship
            </p>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">KL</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary">Kenya Leo</h1>
                <p className="text-xs text-muted-foreground hidden md:block">Your Trusted News Source</p>
              </div>
            </Link>

            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search news..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="sm" asChild className="hidden md:flex">
                <Link to="/admin/login">
                  <User className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <nav className="flex flex-col gap-4 mt-8">
                    {categories.map((category) => (
                      <Link
                        key={category.path}
                        to={category.path}
                        className="text-lg font-medium hover:text-primary transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                    <Link
                      to="/admin/login"
                      className="text-lg font-medium hover:text-primary transition-colors mt-4 pt-4 border-t"
                    >
                      Admin Login
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Desktop */}
      <nav className="hidden lg:block border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-1">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="px-4 py-3 text-sm font-medium hover:bg-primary/5 hover:text-primary transition-all relative group"
              >
                {category.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};
