import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Category, Product } from "@shared/schema";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

export default function HomePage() {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  return (
    <>
      {/* Hero Banner */}
      <section className="relative">
        <div className="bg-gray-900 h-96 md:h-[500px] w-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1577655197620-704858b270da" 
            alt="Modern living room setup" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-lg">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Summer Collection 2023
                </h1>
                <p className="text-gray-200 text-lg mb-8">
                  Upgrade your home with our new furniture collection. Modern designs for contemporary living.
                </p>
                <div className="flex space-x-4">
                  <Link href="/category/home-decor">
                    <Button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
                      Shop Now
                    </Button>
                  </Link>
                  <Button variant="outline" className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Banner Navigation Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          <button className="h-2 w-2 rounded-full bg-white"></button>
          <button className="h-2 w-2 rounded-full bg-white bg-opacity-50"></button>
          <button className="h-2 w-2 rounded-full bg-white bg-opacity-50"></button>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="aspect-square">
                  <Skeleton className="w-full h-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories?.map((category: Category) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <div className="group">
                    <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square relative">
                      <img 
                        src={category.imageUrl} 
                        alt={category.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                        <h3 className="text-white font-medium">{category.name}</h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link href="/category/all" className="text-primary hover:text-blue-700 font-medium">
              View All
            </Link>
          </div>
          
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.slice(0, 4).map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Promo Banner */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <span className="text-secondary uppercase font-semibold tracking-wide">
                  Limited Time Offer
                </span>
                <h2 className="text-white text-3xl md:text-4xl font-bold mt-2 mb-4">
                  Save Up to 50% Off
                </h2>
                <p className="text-gray-300 mb-8">
                  Don't miss out on our biggest sale of the season. Shop now for incredible savings on all your favorite products.
                </p>
                <div>
                  <Link href="/category/sale">
                    <Button className="bg-secondary hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition">
                      Shop the Sale
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1600080972464-8e5f35f63d08" 
                  alt="Sale promotional banner" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Read what our satisfied customers have to say about our products and service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "I absolutely love the premium smart watch. The battery life is incredible, and the fitness tracking features are spot on. It's been a game-changer for my workouts."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                <div>
                  <h4 className="font-semibold">Sarah M.</h4>
                  <p className="text-sm text-gray-500">Verified Buyer</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Fast shipping and excellent customer service. The noise-cancelling headphones exceeded my expectations. Crystal clear sound and comfortable to wear for hours."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                <div>
                  <h4 className="font-semibold">James T.</h4>
                  <p className="text-sm text-gray-500">Verified Buyer</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
                <Star className="h-5 w-5 text-gray-300" />
              </div>
              <p className="text-gray-600 mb-6">
                "The bluetooth speaker has amazing sound quality for its size. Perfect for outdoor gatherings. Easy to pair with my phone and the battery lasts for hours."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                <div>
                  <h4 className="font-semibold">Emily R.</h4>
                  <p className="text-sm text-gray-500">Verified Buyer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary bg-opacity-10 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Subscribe to our newsletter
              </h2>
              <p className="text-gray-600 mb-8">
                Be the first to know about new products, exclusive offers, and expert tips.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-4">
                By subscribing, you agree to our Privacy Policy. You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
