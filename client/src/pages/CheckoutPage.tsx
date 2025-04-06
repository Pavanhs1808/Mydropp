import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/useCart";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";

enum CheckoutStep {
  SHIPPING = "shipping",
  PAYMENT = "payment",
  CONFIRMATION = "confirmation",
}

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const [step, setStep] = useState<CheckoutStep>(CheckoutStep.SHIPPING);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  // Handle shipping form submission
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation would go here in a real app
    setStep(CheckoutStep.PAYMENT);
  };

  // Handle payment form submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, we'd process the payment and then create the order
      const orderData = {
        total: cart.total,
        tax: cart.tax,
        shipping: cart.shipping,
        status: "pending",
      };

      const order = await apiRequest("POST", "/api/orders", orderData);
      const orderResponse = await order.json();

      // Add each item to the order
      for (const item of cart.items) {
        await apiRequest("POST", `/api/orders/${orderResponse.id}/items`, {
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        });
      }

      // Show success notification
      toast({
        title: "Order placed successfully!",
        description: `Order #${orderResponse.id} has been created.`,
      });

      // Clear the cart and navigate to confirmation
      clearCart();
      setStep(CheckoutStep.CONFIRMATION);
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error placing order",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If cart is empty, redirect to home
  if (cart.items.length === 0 && step !== CheckoutStep.CONFIRMATION) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold mb-6">Your cart is empty</h1>
        <p className="mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {step !== CheckoutStep.CONFIRMATION ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Checkout Steps */}
            <div className="lg:w-2/3">
              <Tabs value={step} className="w-full">
                <TabsList className="w-full mb-6 grid grid-cols-2">
                  <TabsTrigger
                    value={CheckoutStep.SHIPPING}
                    onClick={() => setStep(CheckoutStep.SHIPPING)}
                    disabled={step === CheckoutStep.PAYMENT}
                  >
                    1. Shipping
                  </TabsTrigger>
                  <TabsTrigger
                    value={CheckoutStep.PAYMENT}
                    onClick={() => setStep(CheckoutStep.PAYMENT)}
                    disabled={step === CheckoutStep.SHIPPING}
                  >
                    2. Payment
                  </TabsTrigger>
                </TabsList>

                {/* Shipping Tab */}
                <TabsContent value={CheckoutStep.SHIPPING}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Information</CardTitle>
                      <CardDescription>
                        Enter your shipping details to continue
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleShippingSubmit}>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={shippingInfo.firstName}
                              onChange={(e) =>
                                setShippingInfo({ ...shippingInfo, firstName: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={shippingInfo.lastName}
                              onChange={(e) =>
                                setShippingInfo({ ...shippingInfo, lastName: e.target.value })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={shippingInfo.email}
                              onChange={(e) =>
                                setShippingInfo({ ...shippingInfo, email: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={shippingInfo.phone}
                              onChange={(e) =>
                                setShippingInfo({ ...shippingInfo, phone: e.target.value })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={shippingInfo.address}
                            onChange={(e) =>
                              setShippingInfo({ ...shippingInfo, address: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={shippingInfo.city}
                              onChange={(e) =>
                                setShippingInfo({ ...shippingInfo, city: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={shippingInfo.state}
                              onChange={(e) =>
                                setShippingInfo({ ...shippingInfo, state: e.target.value })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                            <Input
                              id="zipCode"
                              value={shippingInfo.zipCode}
                              onChange={(e) =>
                                setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Select
                              value={shippingInfo.country}
                              onValueChange={(value) =>
                                setShippingInfo({ ...shippingInfo, country: value })
                              }
                            >
                              <SelectTrigger id="country">
                                <SelectValue placeholder="Select Country" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="US">United States</SelectItem>
                                <SelectItem value="CA">Canada</SelectItem>
                                <SelectItem value="UK">United Kingdom</SelectItem>
                                <SelectItem value="AU">Australia</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" className="w-full">
                          Continue to Payment
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>

                {/* Payment Tab */}
                <TabsContent value={CheckoutStep.PAYMENT}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Information</CardTitle>
                      <CardDescription>
                        Enter your payment details to complete your purchase
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handlePaymentSubmit}>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input id="cardName" placeholder="John Doe" required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" required />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="billingAddress">Billing Address</Label>
                          <Select defaultValue="shipping">
                            <SelectTrigger id="billingAddress">
                              <SelectValue placeholder="Select Address" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="shipping">Same as Shipping Address</SelectItem>
                              <SelectItem value="different">Use a Different Address</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col space-y-2">
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Processing..." : "Place Order"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => setStep(CheckoutStep.SHIPPING)}
                          disabled={isSubmitting}
                        >
                          Back to Shipping
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.productId} className="flex items-center">
                        <div className="relative w-16 h-16 overflow-hidden rounded">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute top-0 right-0 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="text-sm font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(item.product.price)} x {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Subtotal</span>
                      <span className="font-medium">{formatCurrency(cart.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Shipping</span>
                      <span className="font-medium">{formatCurrency(cart.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tax</span>
                      <span className="font-medium">{formatCurrency(cart.tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between pt-2">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">{formatCurrency(cart.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Order Confirmation
          <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-2xl mx-auto">
            <div className="mb-6 text-green-500 flex justify-center">
              <CheckCircle2 className="h-20 w-20" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. We've sent a confirmation email with all the details.
            </p>
            <div className="bg-gray-50 p-4 rounded mb-6">
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <p className="font-semibold">SE-{Math.floor(Math.random() * 10000)}</p>
            </div>
            <div className="flex justify-center space-x-4">
              <Link href="/account/orders">
                <Button variant="outline">View Order</Button>
              </Link>
              <Link href="/">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
