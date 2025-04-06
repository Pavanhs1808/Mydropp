import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Order } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Package, User, MapPin, CreditCard } from "lucide-react";

// Mock user data for display purposes
const mockUserData = {
  username: "johndoe",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  address: "123 Main St",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  country: "United States",
  phoneNumber: "(555) 123-4567",
};

export default function AccountPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Query for orders (in a real app, we'd pass the user ID)
  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/users/1/orders"],
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleSaveAddress = () => {
    toast({
      title: "Address Updated",
      description: "Your address information has been updated successfully.",
    });
  };

  const handleSavePassword = () => {
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-var(--header-height))] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      {mockUserData.firstName.charAt(0)}
                      {mockUserData.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {mockUserData.firstName} {mockUserData.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{mockUserData.email}</p>
                  </div>
                </div>

                <Tabs
                  defaultValue="profile"
                  orientation="vertical"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="space-y-1"
                >
                  <TabsList className="flex flex-col h-auto">
                    <TabsTrigger value="profile" className="justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Orders
                    </TabsTrigger>
                    <TabsTrigger value="addresses" className="justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Addresses
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="justify-start">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Methods
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Separator className="my-6" />

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/">Sign Out</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal details here
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          defaultValue={mockUserData.firstName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          defaultValue={mockUserData.lastName}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue={mockUserData.email} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        defaultValue={mockUserData.phoneNumber}
                      />
                    </div>

                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input id="confirmPassword" type="password" />
                    </div>

                    <Button onClick={handleSavePassword}>
                      Update Password
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      View and track your past orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : orders && orders.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">
                                #{order.id}
                              </TableCell>
                              <TableCell>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    order.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "processing"
                                      ? "bg-blue-100 text-blue-800"
                                      : order.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1)}
                                </span>
                              </TableCell>
                              <TableCell>
                                {formatCurrency(order.total)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                >
                                  <Link href={`/track-order?id=${order.id}`}>
                                    View Details
                                  </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No orders yet
                        </h3>
                        <p className="text-gray-500 mb-4">
                          You haven't placed any orders yet.
                        </p>
                        <Button asChild>
                          <Link href="/">Start Shopping</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Addresses</CardTitle>
                    <CardDescription>
                      Manage your shipping and billing addresses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">Default Address</h3>
                          <p className="text-sm text-gray-500">Shipping & Billing</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                      <div className="text-sm">
                        <p className="mb-1">
                          {mockUserData.firstName} {mockUserData.lastName}
                        </p>
                        <p className="mb-1">{mockUserData.address}</p>
                        <p className="mb-1">
                          {mockUserData.city}, {mockUserData.state}{" "}
                          {mockUserData.zipCode}
                        </p>
                        <p className="mb-1">{mockUserData.country}</p>
                        <p>{mockUserData.phoneNumber}</p>
                      </div>
                    </div>

                    <Button variant="outline">Add New Address</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      Manage your saved payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No payment methods
                      </h3>
                      <p className="text-gray-500 mb-4">
                        You haven't added any payment methods yet.
                      </p>
                      <Button>Add Payment Method</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
