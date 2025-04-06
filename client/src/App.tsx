import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/HomePage";
import ProductListingPage from "@/pages/ProductListingPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AccountPage from "@/pages/AccountPage";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileMenu from "@/components/MobileMenu";
import CartSidebar from "@/components/CartSidebar";
import { useState } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header 
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
          onCartOpen={() => setCartOpen(true)}
        />
        
        <MobileMenu 
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)} 
        />
        
        <CartSidebar 
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
        />
        
        <main className="flex-grow">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/category/:slug" component={ProductListingPage} />
            <Route path="/product/:slug" component={ProductDetailPage} />
            <ProtectedRoute path="/checkout" component={CheckoutPage} />
            <Route path="/auth" component={AuthPage} />
            <ProtectedRoute path="/account" component={AccountPage} />
            <ProtectedRoute path="/track-order" component={OrderTrackingPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
        
        <Footer />
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
