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
        <div className="bg-gray-900 h-[350px] sm:h-96 md:h-[500px] w-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1577655197620-704858b270da" 
            alt="Modern living room setup" 
            className="w-full h-full object-cover opacity-70"
            loading="eager"
          />
          <div className="absolute inset-0 flex items-center bg-gradient-to-r from-gray-900/80 to-gray-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-lg">
                <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded-full mb-4">
                  New Arrival
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
                  Summer Collection 2023
                </h1>
                <p className="text-gray-200 text-base sm:text-lg mb-6 sm:mb-8 max-w-md">
                  Upgrade your home with our new furniture collection. Modern designs for contemporary living.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/category/home-decor">
                    <Button className="bg-white text-gray-900 px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-gray-100 transition shadow-lg">
                      Shop Now
                    </Button>
                  </Link>
                  <Button variant="outline" className="bg-transparent border border-white text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Banner Navigation Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3">
          <button className="h-2 w-6 rounded-full bg-white"></button>
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
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
                <div className="inline-flex items-center bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  <span className="mr-1.5">⏰</span> Limited Time Offer
                </div>
                <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mt-2 mb-3 sm:mb-4">
                  Save Up to <span className="text-secondary">50% Off</span>
                </h2>
                <p className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8 max-w-md">
                  Don't miss out on our biggest sale of the season. Shop now for incredible savings on all your favorite products.
                </p>
                <div className="flex gap-3">
                  <Link href="/category/sale">
                    <Button className="bg-secondary hover:bg-orange-600 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition shadow-lg">
                      Shop the Sale
                    </Button>
                  </Link>
                  <Link href="/category/all">
                    <Button variant="outline" className="border-gray-400 text-gray-200 hover:bg-white/10 hover:text-white px-4 py-2 sm:px-5 sm:py-3 rounded-lg">
                      View All Products
                    </Button>
                  </Link>
                </div>
                
                {/* Countdown Timer - Static for now */}
                <div className="hidden sm:flex mt-8 space-x-3">
                  <div className="bg-white/10 rounded-lg px-3 py-2 text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-white">05</div>
                    <div className="text-xs text-gray-300">Days</div>
                  </div>
                  <div className="bg-white/10 rounded-lg px-3 py-2 text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-white">12</div>
                    <div className="text-xs text-gray-300">Hours</div>
                  </div>
                  <div className="bg-white/10 rounded-lg px-3 py-2 text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-white">45</div>
                    <div className="text-xs text-gray-300">Minutes</div>
                  </div>
                  <div className="bg-white/10 rounded-lg px-3 py-2 text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-white">30</div>
                    <div className="text-xs text-gray-300">Seconds</div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 max-h-60 md:max-h-none relative order-1 md:order-2">
                <div className="absolute top-2 right-2 z-10 bg-red-500 text-white font-bold text-sm md:text-base px-3 py-1 rounded-full transform rotate-12 shadow-lg">
                  50% OFF
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1600080972464-8e5f35f63d08" 
                  alt="Sale promotional banner" 
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent md:bg-gradient-to-r md:from-transparent md:to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full mb-3">
              Customer Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Don't just take our word for it. Read what our satisfied customers have to say about our products and service.
            </p>
          </div>
          
          {/* Desktop testimonial grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex mb-1">
                <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                </svg>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-sm sm:text-base">
                "I absolutely love the premium smart watch. The battery life is incredible, and the fitness tracking features are spot on. It's been a game-changer for my workouts."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold mr-3">SM</div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">Sarah M.</h4>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">Verified Buyer</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">Electronics</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex mb-1">
                <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                </svg>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-sm sm:text-base">
                "Fast shipping and excellent customer service. The noise-cancelling headphones exceeded my expectations. Crystal clear sound and comfortable to wear for hours."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mr-3">JT</div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">James T.</h4>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">Verified Buyer</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">Electronics</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex mb-1">
                <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                </svg>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                <Star className="h-4 w-4 text-gray-300" />
              </div>
              <p className="text-gray-700 mb-6 text-sm sm:text-base">
                "The bluetooth speaker has amazing sound quality for its size. Perfect for outdoor gatherings. Easy to pair with my phone and the battery lasts for hours."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold mr-3">ER</div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">Emily R.</h4>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">Verified Buyer</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">Audio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile testimonial carousel (simplified) */}
          <div className="md:hidden">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-4">
              <div className="flex mb-1">
                <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                </svg>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "I absolutely love the premium smart watch. The battery life is incredible, and the fitness tracking features are spot on."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold mr-3">SM</div>
                <div>
                  <h4 className="font-semibold">Sarah M.</h4>
                  <span className="text-xs text-gray-500">Verified Buyer</span>
                </div>
              </div>
            </div>
            
            {/* Mobile pagination dots */}
            <div className="flex justify-center space-x-2 mt-4">
              <button className="h-2 w-6 rounded-full bg-primary"></button>
              <button className="h-2 w-2 rounded-full bg-gray-300"></button>
              <button className="h-2 w-2 rounded-full bg-gray-300"></button>
            </div>
          </div>
          
          {/* Testimonials call to action */}
          <div className="mt-8 sm:mt-12 text-center">
            <Link href="/reviews" className="inline-flex items-center text-primary font-medium hover:text-primary/80">
              See all customer reviews
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 sm:p-8 md:p-12 shadow-sm">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="md:flex-1 space-y-4">
                  <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded-full">
                    Stay Updated
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Subscribe to our newsletter
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base md:pr-12">
                    Be the first to know about new products, exclusive offers, and expert tips. 
                    Join our community of shoppers who save big.
                  </p>
                  
                  <div className="hidden md:block">
                    <div className="flex items-center gap-3 mt-6">
                      <div className="flex -space-x-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs ring-2 ring-white">JD</div>
                        <div className="h-8 w-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs ring-2 ring-white">AS</div>
                        <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs ring-2 ring-white">KT</div>
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs ring-2 ring-white">+5</div>
                      </div>
                      <p className="text-xs text-gray-500">Joined this week</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:flex-1">
                  <form className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                        <Input
                          id="newsletter-email"
                          type="email"
                          placeholder="youremail@example.com"
                          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="newsletter-privacy"
                            type="checkbox"
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            required
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="newsletter-privacy" className="text-gray-500">
                            I agree to receive marketing emails and can unsubscribe anytime.
                          </label>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition"
                      >
                        Subscribe
                      </Button>
                    </div>
                  </form>
                  
                  <p className="text-xs text-gray-500 mt-3 text-center md:text-left">
                    By subscribing, you agree to our <a href="#" className="underline hover:text-primary">Privacy Policy</a> and <a href="#" className="underline hover:text-primary">Terms of Service</a>.
                  </p>
                </div>
              </div>
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
