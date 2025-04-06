import { X, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCartWithToast, updateQuantity, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="bg-white h-full w-full md:w-96 absolute right-0 p-5 flex flex-col">
        <div className="flex justify-between items-center mb-5 pb-4 border-b">
          <span className="text-xl font-semibold">Shopping Cart ({itemCount})</span>
          <button onClick={onClose} className="text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-auto">
          {cart.items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
              <Button 
                className="mt-4" 
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.productId} className="flex items-center py-4 border-b">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name} 
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="ml-4 flex-1">
                  <h4 className="text-sm font-semibold">{item.product.name}</h4>
                  <p className="text-xs text-gray-500">
                    {/* Placeholder for variant info */}
                  </p>
                  <div className="flex items-center mt-2">
                    <button 
                      className="text-gray-500 border rounded-md px-2"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="mx-2 text-sm">{item.quantity}</span>
                    <button 
                      className="text-gray-500 border rounded-md px-2"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="font-semibold">{formatCurrency(item.product.price * item.quantity)}</p>
                  <button 
                    className="text-red-500 text-sm mt-2"
                    onClick={() => removeFromCartWithToast(item.productId, item.product.name)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Cart Summary */}
        {cart.items.length > 0 && (
          <div className="pt-4 border-t mt-4">
            <div className="flex justify-between py-2">
              <span>Subtotal</span>
              <span className="font-semibold">{formatCurrency(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Shipping</span>
              <span className="font-semibold">{formatCurrency(cart.shipping)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Tax</span>
              <span className="font-semibold">{formatCurrency(cart.tax)}</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(cart.total)}</span>
            </div>
            <Link href="/checkout">
              <Button 
                className="w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-lg mt-4"
                onClick={onClose}
              >
                Proceed to Checkout
              </Button>
            </Link>
            <Button 
              variant="outline"
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg mt-2"
              onClick={onClose}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
