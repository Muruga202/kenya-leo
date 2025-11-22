import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-charcoal text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent">Kenya Leo Media</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your trusted source for reliable news and information across Kenya and East Africa. 
              Delivering truth, transparency, and timely updates.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/category/politics" className="text-sm text-gray-300 hover:text-accent transition-colors">Politics</Link></li>
              <li><Link to="/category/sports" className="text-sm text-gray-300 hover:text-accent transition-colors">Sports</Link></li>
              <li><Link to="/category/entertainment" className="text-sm text-gray-300 hover:text-accent transition-colors">Entertainment</Link></li>
              <li><Link to="/category/business" className="text-sm text-gray-300 hover:text-accent transition-colors">Business</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-300 hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-300 hover:text-accent transition-colors">Contact</Link></li>
              <li><Link to="/advertise" className="text-sm text-gray-300 hover:text-accent transition-colors">Advertise</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-300 hover:text-accent transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Stay Connected</h3>
            <div className="flex gap-3 mb-4">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
            <a href="mailto:news@kenyaleo.com" className="flex items-center gap-2 text-sm text-gray-300 hover:text-accent transition-colors">
              <Mail className="h-4 w-4" />
              news@kenyaleo.com
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Kenya Leo Media. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
