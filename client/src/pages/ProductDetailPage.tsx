import { useParams } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StarRating from "@/components/StarRating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, Heart, ChevronRight, Share2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCartWithToast } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
  });
  
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  // In a real app, we'd have multiple images per product
  const productImages = product ? [product.imageUrl] : [];
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
          <div className="md:w-1/2">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-36 mb-4" />
            <Skeleton className="h-8 w-1/3 mb-6" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-8">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <Button>Back to Products</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-900">Home</a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <a href={`/category/${product.categoryId}`} className="hover:text-gray-900">
            Category
          </a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900">{product.name}</span>
        </nav>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images */}
          <div className="md:w-1/2">
            <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={productImages[activeImageIndex]} 
                alt={product.name} 
                className="w-full h-auto object-contain aspect-square"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                      idx === activeImageIndex ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <StarRating rating={product.rating} />
              <span className="ml-2 text-sm text-gray-500">
                {product.reviewCount} reviews
              </span>
            </div>
            
            <div className="mb-6">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-gray-500 line-through ml-2">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
              {product.isSale && (
                <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                  Sale
                </span>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <span className="text-gray-700 mr-4">Quantity</span>
                <div className="flex items-center border rounded-md">
                  <button 
                    className="px-3 py-2 border-r"
                    onClick={decreaseQuantity}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button 
                    className="px-3 py-2 border-l"
                    onClick={increaseQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  className="flex-1 px-6 py-3"
                  onClick={() => addToCartWithToast(product, quantity)}
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="outline"
                  className="px-3 py-3"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  className="px-3 py-3"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2" />
                <span className="text-sm text-gray-700">In Stock</span>
              </div>
              <p className="text-sm text-gray-500">
                Free shipping on orders over $50
              </p>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-6">
              <div className="prose max-w-none">
                <p>{product.description || "No description available for this product."}</p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Product Details</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-500">Brand</span>
                      <span>ShopEase</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Model</span>
                      <span>SE-{product.id}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">SKU</span>
                      <span>{product.slug.substring(0, 8).toUpperCase()}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Shipping Information</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span>Free over $50</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Delivery</span>
                      <span>3-5 business days</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Returns</span>
                      <span>30 days</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="py-6">
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="mr-4">
                    <div className="h-10 w-10 rounded-full bg-gray-300" />
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <h4 className="font-semibold mr-2">John D.</h4>
                      <span className="text-sm text-gray-500">1 month ago</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <StarRating rating={5} />
                    </div>
                    <p className="text-gray-700">
                      Great product! Exactly as described and arrived quickly. Would definitely buy again.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4">
                    <div className="h-10 w-10 rounded-full bg-gray-300" />
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <h4 className="font-semibold mr-2">Sarah M.</h4>
                      <span className="text-sm text-gray-500">2 weeks ago</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <StarRating rating={4} />
                    </div>
                    <p className="text-gray-700">
                      Very happy with my purchase. Good quality for the price. Shipping was fast too.
                    </p>
                  </div>
                </div>
                
                <Button variant="outline">Load More Reviews</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
