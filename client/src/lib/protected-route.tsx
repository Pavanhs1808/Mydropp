import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  // Create a route that matches the given path
  return (
    <Route path={path}>
      {isLoading ? (
        // Show loading spinner while checking authentication
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : user ? (
        // If authenticated, render the component
        <Component />
      ) : (
        // If not authenticated, redirect to login
        <Redirect to="/auth" />
      )}
    </Route>
  );
}