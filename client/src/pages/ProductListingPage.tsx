import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Product, Category } from "@shared/schema";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

type SortOption = "featured" | "price-low" | "price-high" | "newest";

export default function ProductListingPage() {
  const { slug } = useParams();
  const [location] = useLocation();
  
  // Get search parameters
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const searchQuery = searchParams.get("search");
  
  // State for filters and sorting
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Fetch category data
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: [`/api/categories/${slug}`],
    enabled: !searchQuery && !!slug && slug !== "all",
  });
  
  // Fetch products
  const queryParams = searchQuery ? 
    { search: searchQuery } : 
    slug && slug !== "all" ? 
      { category: slug } : 
      undefined;
      
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", queryParams],
  });
  
  // Apply sorting and filtering
  useEffect(() => {
    if (!products) return;
    
    let sorted = [...products];
    
    // Apply sorting
    switch (sortOption) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // In a real app, we'd sort by date
        sorted.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      default:
        // "featured" - no specific sort
        break;
    }
    
    // Apply price filter
    sorted = sorted.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setFilteredProducts(sorted);
  }, [products, sortOption, priceRange]);
  
  const pageTitle = searchQuery
    ? `Search results for "${searchQuery}"`
    : category
    ? category.name
    : "All Products";
    
  const isLoading = categoryLoading || productsLoading;
  
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{pageTitle}</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters (sidebar) */}
          <div className="w-full lg:w-64 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              
              <Accordion type="single" collapsible defaultValue="category">
                <AccordionItem value="category">
                  <AccordionTrigger>Category</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="all" checked={slug === "all"} />
                        <Label htmlFor="all" className="cursor-pointer">All Products</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="electronics" checked={slug === "electronics"} />
                        <Label htmlFor="electronics" className="cursor-pointer">Electronics</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="fashion" checked={slug === "fashion"} />
                        <Label htmlFor="fashion" className="cursor-pointer">Fashion</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="home-decor" checked={slug === "home-decor"} />
                        <Label htmlFor="home-decor" className="cursor-pointer">Home & Garden</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="price">
                  <AccordionTrigger>Price Range</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <Slider 
                        defaultValue={[0, 1000]} 
                        max={1000} 
                        step={10}
                        onValueChange={setPriceRange}
                      />
                      <div className="flex justify-between text-sm">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="availability">
                  <AccordionTrigger>Availability</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="in-stock" defaultChecked />
                        <Label htmlFor="in-stock" className="cursor-pointer">In Stock</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="out-of-stock" />
                        <Label htmlFor="out-of-stock" className="cursor-pointer">Out of Stock</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => {
                  setPriceRange([0, 1000]);
                  setSortOption("featured");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500">
                Showing {filteredProducts.length} products
              </p>
              <div className="flex items-center">
                <span className="mr-2 text-sm">Sort by:</span>
                <Select
                  value={sortOption}
                  onValueChange={(value) => setSortOption(value as SortOption)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <Skeleton className="w-full h-56" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
