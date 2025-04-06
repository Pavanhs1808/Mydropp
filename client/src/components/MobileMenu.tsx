import { Link, useLocation } from "wouter";
import { X, User, Heart, Clipboard, Search, ShoppingBag, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Close the menu when navigating to a new page
  useEffect(() => {
    if (isOpen) onClose();
  }, [location]);

  // Disable body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300">
      <div 
        className="bg-white h-full w-4/5 max-w-xs p-5 shadow-xl transform transition-transform duration-300 ease-in-out"
        style={{ 
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          opacity: isOpen ? 1 : 0
        }}
      >
        <div className="flex justify-between items-center mb-5">
          <Link href="/" onClick={onClose}>
            <span className="text-xl font-semibold text-primary">ShopEase</span>
          </Link>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Categories Navigation */}
        <nav className="space-y-1">
          <Link 
            href="/" 
            className={`block py-3 px-2 rounded-md transition-colors ${
              location === "/" 
                ? "text-primary font-medium bg-primary/10" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Home
          </Link>
          <Link 
            href="/category/electronics" 
            className={`block py-3 px-2 rounded-md transition-colors ${
              location === "/category/electronics" 
                ? "text-primary font-medium bg-primary/10" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Electronics
          </Link>
          <Link 
            href="/category/fashion" 
            className={`block py-3 px-2 rounded-md transition-colors ${
              location === "/category/fashion" 
                ? "text-primary font-medium bg-primary/10" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Fashion
          </Link>
          <Link 
            href="/category/home-decor" 
            className={`block py-3 px-2 rounded-md transition-colors ${
              location === "/category/home-decor" 
                ? "text-primary font-medium bg-primary/10" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Home & Garden
          </Link>
          <Link 
            href="/category/beauty" 
            className={`block py-3 px-2 rounded-md transition-colors ${
              location === "/category/beauty" 
                ? "text-primary font-medium bg-primary/10" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Beauty
          </Link>
          <Link 
            href="/category/sports" 
            className={`block py-3 px-2 rounded-md transition-colors ${
              location === "/category/sports" 
                ? "text-primary font-medium bg-primary/10" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Sports
          </Link>
          <Link 
            href="/category/sale" 
            className={`block py-3 px-2 rounded-md transition-colors ${
              location === "/category/sale" 
                ? "bg-secondary/10 text-secondary font-medium" 
                : "text-secondary hover:bg-secondary/10"
            }`}
          >
            Sale
          </Link>
        </nav>

        {/* Divider */}
        <div className="my-5 border-t border-gray-200"></div>

        {/* User Account Section */}
        <div className="space-y-3">
          {user ? (
            <>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Hello, {user.firstName || user.username}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              <Link href="/account" className="flex items-center py-3 px-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <User className="h-5 w-5 mr-3" />
                My Account
              </Link>
              <Link href="/account/orders" className="flex items-center py-3 px-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <Clipboard className="h-5 w-5 mr-3" />
                My Orders
              </Link>
              <Link href="/account/wishlist" className="flex items-center py-3 px-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <Heart className="h-5 w-5 mr-3" />
                Wishlist
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center w-full py-3 px-2 text-gray-700 hover:bg-gray-100 rounded-md text-left"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/auth" 
                className="flex items-center justify-center py-2 px-4 bg-primary text-white rounded-md w-full"
              >
                Sign In / Register
              </Link>
              <Link href="/track-order" className="flex items-center py-3 px-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <Clipboard className="h-5 w-5 mr-3" />
                Track Order
              </Link>
            </>
          )}
        </div>

        {/* Help Section */}
        <div className="absolute bottom-8 left-5 right-5">
          <div className="text-sm text-gray-500 mb-3">Need help?</div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-primary">Help Center</a>
            <a href="#" className="text-gray-600 hover:text-primary">Contact Us</a>
          </div>
        </div>
      </div>
      {/* Backdrop for closing menu with click */}
      <div className="absolute inset-0" onClick={onClose}></div>
    </div>
  );
}
