import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Footer Main */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-white">ShopEase</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your one-stop destination for quality electronics, fashion, and more. Shop with confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/category/electronics" className="text-gray-400 hover:text-white">Electronics</Link></li>
              <li><Link href="/category/fashion" className="text-gray-400 hover:text-white">Fashion</Link></li>
              <li><Link href="/category/home-decor" className="text-gray-400 hover:text-white">Home & Garden</Link></li>
              <li><Link href="/category/beauty" className="text-gray-400 hover:text-white">Beauty</Link></li>
              <li><Link href="/category/sports" className="text-gray-400 hover:text-white">Sports</Link></li>
              <li><Link href="/category/sale" className="text-gray-400 hover:text-white">Sale</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link href="/account" className="text-gray-400 hover:text-white">My Account</Link></li>
              <li><Link href="/account/orders" className="text-gray-400 hover:text-white">Orders</Link></li>
              <li><Link href="/account/wishlist" className="text-gray-400 hover:text-white">Wishlist</Link></li>
              <li><Link href="/track-order" className="text-gray-400 hover:text-white">Track Order</Link></li>
              <li><Link href="/account/returns" className="text-gray-400 hover:text-white">Returns</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Shipping Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Returns Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-4">
              <div className="bg-white h-6 w-10 rounded"></div>
              <div className="bg-white h-6 w-10 rounded"></div>
              <div className="bg-white h-6 w-10 rounded"></div>
              <div className="bg-white h-6 w-10 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
