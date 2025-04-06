import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { 
  Package, 
  Truck, 
  Home, 
  CheckCircle2, 
  Loader2, 
  ClipboardList 
} from "lucide-react";

export default function OrderTrackingPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialOrderId = searchParams.get("id");
  
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId || "");
  const [trackingOrderId, setTrackingOrderId] = useState(initialOrderId || "");
  
  const { data: order, isLoading } = useQuery<Order>({
    queryKey: [`/api/orders/${trackingOrderId}`],
    enabled: !!trackingOrderId,
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderIdInput) {
      setTrackingOrderId(orderIdInput);
    }
  };
  
  // Get tracking status - in a real app, this would come from the API
  // For this mock, we're generating a random status
  const getRandomStatus = () => {
    const statuses = ["processing", "shipped", "out_for_delivery", "delivered"];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
  };
  
  const trackingStatus = order ? getRandomStatus() : null;
  
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-var(--header-height))] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Track Your Order</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Order ID</CardTitle>
            <CardDescription>
              Enter your order ID to track the status of your shipment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="orderId" className="sr-only">
                  Order ID
                </Label>
                <Input
                  id="orderId"
                  type="text"
                  placeholder="e.g. 12345"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={!orderIdInput}>
                Track Order
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-gray-500">Fetching your order details...</p>
          </div>
        )}
        
        {!isLoading && trackingOrderId && !order && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ClipboardList className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
              <p className="text-gray-500 text-center mb-6">
                We couldn't find an order with ID #{trackingOrderId}. Please check the order number and try again.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setOrderIdInput("");
                  setTrackingOrderId("");
                }}
              >
                Try Another Order ID
              </Button>
            </CardContent>
          </Card>
        )}
        
        {!isLoading && order && (
          <div className="space-y-8">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order #{order.id}</CardTitle>
                <CardDescription>
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between mb-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Order Status</p>
                    <div className="flex items-center">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === "completed" || order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Expected Delivery</p>
                    <p className="font-medium">
                      {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Total Amount</p>
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                  </div>
                </div>
                
                {/* Tracking Progress */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-6">Shipment Progress</h3>
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute left-6 top-0 transform -translate-x-1/2 h-full w-0.5 bg-gray-200"></div>
                    
                    {/* Tracking Steps */}
                    <div className="space-y-8">
                      <div className="flex items-start relative">
                        <div className={`rounded-full h-12 w-12 flex items-center justify-center ${
                          ["processing", "shipped", "out_for_delivery", "delivered"].includes(trackingStatus || "")
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          <Package className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium">Order Processed</h4>
                          <p className="text-sm text-gray-500">
                            Your order has been processed and is being prepared
                          </p>
                          {["processing", "shipped", "out_for_delivery", "delivered"].includes(trackingStatus || "") && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-start relative">
                        <div className={`rounded-full h-12 w-12 flex items-center justify-center ${
                          ["shipped", "out_for_delivery", "delivered"].includes(trackingStatus || "")
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          <Truck className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium">Order Shipped</h4>
                          <p className="text-sm text-gray-500">
                            Your order has been shipped and is on its way
                          </p>
                          {["shipped", "out_for_delivery", "delivered"].includes(trackingStatus || "") && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-start relative">
                        <div className={`rounded-full h-12 w-12 flex items-center justify-center ${
                          ["out_for_delivery", "delivered"].includes(trackingStatus || "")
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          <Truck className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium">Out for Delivery</h4>
                          <p className="text-sm text-gray-500">
                            Your order is out for delivery and will arrive soon
                          </p>
                          {["out_for_delivery", "delivered"].includes(trackingStatus || "") && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-start relative">
                        <div className={`rounded-full h-12 w-12 flex items-center justify-center ${
                          trackingStatus === "delivered"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          <Home className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium">Delivered</h4>
                          <p className="text-sm text-gray-500">
                            Your order has been delivered successfully
                          </p>
                          {trackingStatus === "delivered" && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date().toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-4">Order Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items && order.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div className="bg-gray-100 rounded w-12 h-12 mr-3 overflow-hidden">
                                {item.product && (
                                  <img 
                                    src={item.product.imageUrl} 
                                    alt={item.product.name} 
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <span>{item.product ? item.product.name : `Product #${item.productId}`}</span>
                            </div>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Separator className="mb-4" />
                <div className="flex justify-between w-full">
                  <div>
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <p className="text-sm text-gray-500 mt-1">Shipping</p>
                    <p className="text-sm text-gray-500 mt-1">Tax</p>
                    <p className="font-semibold mt-2">Total</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{formatCurrency(order.total - (order.tax || 0) - (order.shipping || 0))}</p>
                    <p className="text-sm mt-1">{formatCurrency(order.shipping || 0)}</p>
                    <p className="text-sm mt-1">{formatCurrency(order.tax || 0)}</p>
                    <p className="font-semibold mt-2">{formatCurrency(order.total)}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
            
            {/* Need Help */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                  We're here to assist you with any questions about your order
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between flex-wrap gap-4">
                <Button variant="outline">Contact Support</Button>
                <Button variant="outline">Request Return</Button>
                <Button variant="outline">Cancel Order</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
