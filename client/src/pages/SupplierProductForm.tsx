import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

import { Redirect, Link } from "wouter";
import { useState } from "react";

// Create a schema for product submission
const productSubmissionSchema = insertProductSchema
  .omit({ supplierId: true, id: true })
  .extend({
    imageFile: z.instanceof(FileList).optional()
      .refine(files => !files || files.length > 0, "Image is required")
      .transform(files => files && files[0]),
  });

type ProductSubmissionValues = z.infer<typeof productSubmissionSchema>;

function SupplierProductFormContent() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch categories for dropdown
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const form = useForm<ProductSubmissionValues>({
    resolver: zodResolver(productSubmissionSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      comparePrice: 0,
      categoryId: 0,
      inStock: true,
      isNew: true,
      isSale: false,
      rating: 0,
      reviewCount: 0,
      status: "pending",
    },
  });

  // Create a slug from the product name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    form.setValue("slug", slug);
  };

  // Handle image file upload
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit product mutation
  const submitProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all product data
      Object.keys(productData).forEach(key => {
        if (key !== 'imageFile') {
          formData.append(key, productData[key]);
        }
      });
      
      // Add supplierId
      formData.append('supplierId', user!.id.toString());
      
      // Add image file if exists
      if (productData.imageFile) {
        formData.append('image', productData.imageFile);
      }
      
      const res = await apiRequest("POST", "/api/supplier/products", formData, true);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Product submitted",
        description: "Your product has been submitted for review.",
      });
      form.reset();
      setImagePreview(null);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/supplier/products'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error submitting product",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (values: ProductSubmissionValues) => {
    submitProductMutation.mutate(values);
  };

  // Show message if user is not a supplier
  if (user && !user.supplierStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not a Supplier</CardTitle>
            <CardDescription>
              You need to register as a supplier to submit products.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/">Go Back Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Submit a New Product</CardTitle>
          <CardDescription>Fill in the details to submit your product for review</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    {...form.register("name")}
                    onChange={handleNameChange}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">Product Slug</Label>
                  <Input
                    id="slug"
                    placeholder="product-slug"
                    {...form.register("slug")}
                    disabled
                  />
                  {form.formState.errors.slug && (
                    <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product"
                    {...form.register("description")}
                    rows={4}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...form.register("price", { valueAsNumber: true })}
                  />
                  {form.formState.errors.price && (
                    <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Compare at Price ($)</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...form.register("comparePrice", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">To show a discount, set this higher than the price</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <Select 
                    onValueChange={(value) => form.setValue("categoryId", parseInt(value))}
                    defaultValue={form.getValues("categoryId").toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoryId && (
                    <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imageFile">Product Image</Label>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {form.formState.errors.imageFile && (
                    <p className="text-sm text-destructive">{form.formState.errors.imageFile.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="inStock"
                  checked={form.watch("inStock")}
                  onCheckedChange={(checked) => form.setValue("inStock", checked)}
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isNew"
                  checked={form.watch("isNew")}
                  onCheckedChange={(checked) => form.setValue("isNew", checked)}
                />
                <Label htmlFor="isNew">New Product</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isSale"
                  checked={form.watch("isSale")}
                  onCheckedChange={(checked) => form.setValue("isSale", checked)}
                />
                <Label htmlFor="isSale">On Sale</Label>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={submitProductMutation.isPending}
            >
              {submitProductMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                "Submit Product"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

// Export the form component directly as it's already protected in App.tsx
export default function SupplierProductForm() {
  return <SupplierProductFormContent />;
}