import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Eye, Plus, ShoppingCart } from "lucide-react";
import StarRating from "./StarRating";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCartWithToast } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  // Calculate discount percentage if there's a compare price
  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) 
    : 0;
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm overflow-hidden product-card group hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Product badges (stacked if needed) */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              New
            </span>
          )}
          {product.isSale && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Sale
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              {discountPercentage}% Off
            </span>
          )}
        </div>

        {/* Product Image with hover effect */}
        <Link href={`/product/${product.slug}`} className="block overflow-hidden">
          <div className="relative overflow-hidden aspect-square">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
            <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isHovered ? 'bg-opacity-10' : 'bg-opacity-0'}`}></div>
          </div>
        </Link>

        {/* Quick actions */}
        <div className={`absolute bottom-0 left-0 right-0 flex justify-center p-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center space-x-2">
            <Link href={`/product/${product.slug}`}>
              <Button variant="secondary" size="sm" className="rounded-full p-2 shadow-lg bg-white text-gray-800 hover:bg-gray-100">
                <Eye className="h-4 w-4" />
                <span className="sr-only">Quick view</span>
              </Button>
            </Link>
            <Button 
              onClick={() => addToCartWithToast(product)} 
              size="sm"
              className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Add to Cart</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-gray-900 font-medium text-sm sm:text-base line-clamp-2 hover:text-primary transition-colors mb-1 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Ratings */}
        <div className="flex items-center mb-2">
          <StarRating rating={product.rating || 0} />
          <span className="text-xs text-gray-500 ml-2">
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-gray-900 font-bold">
                {formatCurrency(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-gray-500 line-through text-xs">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
            </div>
            {/* Only show stock status if explicitly false */}
            {product.inStock === false && (
              <span className="text-red-500 text-xs mt-1">Out of stock</span>
            )}
          </div>
          
          {/* Mobile add to cart button */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCartWithToast(product);
            }}
            className="sm:hidden bg-primary hover:bg-blue-600 text-white rounded-full p-2"
            size="icon"
            aria-label={`Add ${product.name} to cart`}
            disabled={product.inStock === false}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
