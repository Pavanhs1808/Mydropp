import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/HomePage";
import ProductListingPage from "@/pages/ProductListingPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CheckoutPage from "@/pages/CheckoutPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AccountPage from "@/pages/AccountPage";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileMenu from "@/components/MobileMenu";
import CartSidebar from "@/components/CartSidebar";
import { useState } from "react";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
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
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/account" component={AccountPage} />
          <Route path="/track-order" component={OrderTrackingPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
