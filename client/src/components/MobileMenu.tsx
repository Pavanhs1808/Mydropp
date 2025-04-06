import { Link } from "wouter";
import { X, User, Heart, Clipboard } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="bg-white h-full w-4/5 max-w-xs p-5">
        <div className="flex justify-between items-center mb-5">
          <span className="text-xl font-semibold text-primary">Menu</span>
          <button onClick={onClose} className="text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="space-y-4">
          <Link href="/" className="block py-2 text-primary font-medium border-b border-gray-200">
            Home
          </Link>
          <Link href="/category/electronics" className="block py-2 text-gray-700 border-b border-gray-200">
            Electronics
          </Link>
          <Link href="/category/fashion" className="block py-2 text-gray-700 border-b border-gray-200">
            Fashion
          </Link>
          <Link href="/category/home-decor" className="block py-2 text-gray-700 border-b border-gray-200">
            Home & Garden
          </Link>
          <Link href="/category/beauty" className="block py-2 text-gray-700 border-b border-gray-200">
            Beauty
          </Link>
          <Link href="/category/sports" className="block py-2 text-gray-700 border-b border-gray-200">
            Sports
          </Link>
          <Link href="/category/sale" className="block py-2 text-secondary font-medium border-b border-gray-200">
            Sale
          </Link>
        </nav>
        <div className="mt-8 space-y-4">
          <Link href="/account" className="flex items-center py-2 text-gray-700">
            <User className="h-5 w-5 mr-2" />
            My Account
          </Link>
          <Link href="/account/wishlist" className="flex items-center py-2 text-gray-700">
            <Heart className="h-5 w-5 mr-2" />
            Wishlist
          </Link>
          <Link href="/account/orders" className="flex items-center py-2 text-gray-700">
            <Clipboard className="h-5 w-5 mr-2" />
            Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
