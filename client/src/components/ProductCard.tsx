import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import StarRating from "./StarRating";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCartWithToast } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden product-card hover:shadow-md transition">
      <div className="relative">
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-secondary text-white text-xs px-2 py-1 rounded">
            New
          </span>
        )}
        {product.isSale && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Sale
          </span>
        )}
        <Link href={`/product/${product.slug}`}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-56 object-cover"
          />
        </Link>
        <div className="quick-view absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 transition-opacity">
          <Link href={`/product/${product.slug}`}>
            <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium">
              Quick View
            </span>
          </Link>
        </div>
      </div>
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-gray-900 font-semibold mb-1">{product.name}</h3>
        </Link>
        <div className="flex items-center mb-2">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-500 ml-2">({product.reviewCount})</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-gray-900 font-bold">{formatCurrency(product.price)}</span>
            {product.comparePrice && (
              <span className="text-gray-500 line-through text-sm ml-2">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>
          <Button
            onClick={() => addToCartWithToast(product)}
            className="add-to-cart bg-primary hover:bg-blue-600 text-white rounded-full p-2"
            size="icon"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
