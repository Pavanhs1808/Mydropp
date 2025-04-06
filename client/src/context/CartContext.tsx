import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem, Cart } from "@shared/schema";

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const defaultCart: Cart = {
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : defaultCart;
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Calculate totals whenever cart items change
  useEffect(() => {
    const subtotal = cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08; // 8% tax rate
    const shipping = subtotal > 0 ? 0 : 0; // Free shipping
    const total = subtotal + tax + shipping;

    setCart(prev => ({
      ...prev,
      subtotal,
      tax,
      shipping,
      total
    }));
  }, [cart.items]);

  const itemCount = cart.items.reduce(
    (count, item) => count + item.quantity,
    0
  );

  function addToCart(product: Product, quantity = 1) {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.productId === product.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return { ...prevCart, items: updatedItems };
      } else {
        // Add new item
        return {
          ...prevCart,
          items: [
            ...prevCart.items,
            { productId: product.id, quantity, product }
          ]
        };
      }
    });
  }

  function removeFromCart(productId: number) {
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.filter(item => item.productId !== productId)
    }));
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    }));
  }

  function clearCart() {
    setCart(defaultCart);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
