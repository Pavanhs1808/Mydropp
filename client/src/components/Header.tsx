import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/use-auth";
import { Search, User, Heart, ShoppingBag, Menu, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMobileMenuOpen: () => void;
  onCartOpen: () => void;
}

export default function Header({ onMobileMenuOpen, onCartOpen }: HeaderProps) {
  const [location] = useLocation();
  const { itemCount } = useCart();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll event listener to make header more compact on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/category/all?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className={`bg-white shadow-sm sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className={`hidden md:flex justify-between items-center py-2 px-4 text-sm text-gray-600 border-b transition-all ${isScrolled ? 'py-1' : 'py-2'}`}>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-primary">Help</a>
            <Link href="/track-order" className="hover:text-primary">Track Order</Link>
            <a href="#" className="hover:text-primary">Shipping</a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-primary">USD</a>
            <a href="#" className="hover:text-primary">English</a>
          </div>
        </div>

        {/* Main Navigation */}
        <div className={`flex justify-between items-center px-4 transition-all ${isScrolled ? 'py-2' : 'py-4'}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className={`font-bold text-primary transition-all ${isScrolled ? 'text-xl' : 'text-2xl'}`}>ShopEase</span>
          </Link>

          {/* Search */}
          <div className="hidden md:block flex-1 max-w-xl mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit"
                variant="ghost" 
                size="icon"
                className="absolute right-2 top-2 text-gray-400 hover:text-primary"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/account" className="hidden md:block text-gray-700 hover:text-primary">
              <div className="flex flex-col items-center">
                <User className="h-5 w-5" />
                <span className="text-xs mt-1">Account</span>
              </div>
            </Link>
            <a href="#" className="hidden md:block text-gray-700 hover:text-primary">
              <div className="flex flex-col items-center">
                <Heart className="h-5 w-5" />
                <span className="text-xs mt-1">Wishlist</span>
              </div>
            </a>
            <button 
              onClick={onCartOpen}
              className="relative text-gray-700 hover:text-primary"
              aria-label="Shopping cart"
            >
              <div className="flex flex-col items-center">
                <ShoppingBag className="h-5 w-5" />
                <span className="text-xs mt-1">Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={onMobileMenuOpen}
              className="md:hidden text-gray-700"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Categories Navigation */}
        <nav className={`hidden md:block bg-gray-100 border-t overflow-x-auto ${isScrolled ? 'py-1' : ''}`}>
          <div className="flex justify-between px-4 min-w-max whitespace-nowrap">
            <div className="flex space-x-4 lg:space-x-8">
              <Link 
                href="/" 
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  location === "/" 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary"
                }`}
              >
                Home
              </Link>
              <Link 
                href="/category/electronics" 
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  location === "/category/electronics" 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary"
                }`}
              >
                Electronics
              </Link>
              <Link 
                href="/category/fashion" 
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  location === "/category/fashion" 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary"
                }`}
              >
                Fashion
              </Link>
              <Link 
                href="/category/home-decor" 
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  location === "/category/home-decor" 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary"
                }`}
              >
                Home & Garden
              </Link>
              <Link 
                href="/category/beauty" 
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  location === "/category/beauty" 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary"
                }`}
              >
                Beauty
              </Link>
              <Link 
                href="/category/sports" 
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  location === "/category/sports" 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary"
                }`}
              >
                Sports
              </Link>
            </div>
            <Link 
              href="/category/sale" 
              className="flex items-center px-3 py-2 text-sm font-medium text-secondary hover:text-secondary-dark"
            >
              Sale
            </Link>
            {user?.supplierStatus && (
              <Link 
                href="/supplier/product" 
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  location === "/supplier/product" 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary"
                }`}
              >
                <Package className="h-4 w-4 mr-1" />
                Supplier Portal
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit"
              variant="ghost" 
              size="icon"
              className="absolute right-2 top-2 text-gray-400 hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
