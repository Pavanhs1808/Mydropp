import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Redirect, Link } from "wouter";
import { useState } from "react";

// Login schema only requires username and password
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Register schema extends the insertUserSchema
const registerSchema = insertUserSchema
  .omit({ id: true }) // ID is auto-generated
  .extend({
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Redirect to home if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Left column - Form */}
      <div className="w-full md:w-1/2 flex items-start justify-center p-6 py-10">
        <Tabs defaultValue="login" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Right column - Hero section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-primary-900 to-primary-700 text-white p-12 flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to our E-Commerce Store!</h1>
        <p className="text-lg mb-6">
          Shop the latest trends, find great deals, and enjoy a seamless shopping experience.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
            <span className="text-2xl font-bold">Fast Shipping</span>
            <span className="text-sm mt-2">Get your items quickly</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
            <span className="text-2xl font-bold">Secure Checkout</span>
            <span className="text-sm mt-2">Shop with confidence</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
            <span className="text-2xl font-bold">Quality Products</span>
            <span className="text-sm mt-2">Trusted suppliers</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
            <span className="text-2xl font-bold">24/7 Support</span>
            <span className="text-sm mt-2">Always here to help</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const { loginMutation } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              {...form.register("username")}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function RegisterForm() {
  const { registerMutation } = useAuth();
  const [isSupplier, setIsSupplier] = useState(false); // Used for UI toggle, mapped to supplierStatus in DB
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      supplierStatus: null,
      companyName: "",
      companyDescription: "",
      businessLicense: "",
    },
  });

  function onSubmit(values: RegisterFormValues) {
    // Omit confirmPassword as it's not part of the user schema
    const { confirmPassword, ...userData } = values;
    registerMutation.mutate({
      ...userData,
      supplierStatus: isSupplier ? "active" : null
    });
  }
  
  function toggleSupplierForm() {
    setIsSupplier(!isSupplier);
    form.setValue("supplierStatus", !isSupplier ? "active" : null);
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Sign up for a new account</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...form.register("firstName")}
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...form.register("lastName")}
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="johndoe"
              {...form.register("username")}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
        </CardContent>
        {isSupplier && (
          <CardContent className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-lg">Supplier Information</h3>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Your Company Name"
                {...form.register("companyName")}
              />
              {form.formState.errors.companyName && (
                <p className="text-sm text-destructive">{form.formState.errors.companyName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyDescription">Company Description</Label>
              <Input
                id="companyDescription"
                placeholder="Brief description of your company"
                {...form.register("companyDescription")}
              />
              {form.formState.errors.companyDescription && (
                <p className="text-sm text-destructive">{form.formState.errors.companyDescription.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessLicense">Business License Number</Label>
              <Input
                id="businessLicense"
                placeholder="Your business license number"
                {...form.register("businessLicense")}
              />
              {form.formState.errors.businessLicense && (
                <p className="text-sm text-destructive">{form.formState.errors.businessLicense.message}</p>
              )}
            </div>
          </CardContent>
        )}
        <CardFooter className="flex-col gap-3">
          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
              </>
            ) : (
              "Register"
            )}
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            className="opacity-50 hover:opacity-100 transition-opacity text-xs"
            onClick={toggleSupplierForm}
          >
            {isSupplier ? "Register as Regular Customer" : "Register as Supplier"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}