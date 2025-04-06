import { useCart as useCartContext } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";

export function useCart() {
  const cart = useCartContext();
  const { toast } = useToast();

  const addToCartWithToast = (product: Product, quantity = 1) => {
    cart.addToCart(product, quantity);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  const removeFromCartWithToast = (productId: number, productName: string) => {
    cart.removeFromCart(productId);
    
    toast({
      title: "Removed from cart",
      description: `${productName} has been removed from your cart.`,
      duration: 2000,
    });
  };

  return {
    ...cart,
    addToCartWithToast,
    removeFromCartWithToast,
  };
}
