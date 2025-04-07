import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Review } from "@shared/schema";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProductReviewProps {
  review: Review;
}

export function ProductReview({ review }: ProductReviewProps) {
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const { toast } = useToast();
  
  const helpfulMutation = useMutation({
    mutationFn: async (helpful: boolean) => {
      const res = await apiRequest("POST", `/api/reviews/${review.id}/helpful`, { helpful });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${review.productId}/reviews`] });
      toast({
        title: "Thank you for your feedback!",
        description: "Your opinion on this review has been recorded.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleHelpful = (helpful: boolean) => {
    if (isHelpful !== null) return; // Already voted
    
    setIsHelpful(helpful);
    helpfulMutation.mutate(helpful);
  };
  
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between mb-2">
        <div className="flex items-center">
          <div className="bg-primary rounded-full h-8 w-8 flex items-center justify-center text-primary-foreground font-semibold mr-2">
            {review.userId.toString().charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold">{review.title || "Customer Review"}</h4>
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                {review.createdAt && format(new Date(review.createdAt), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {review.helpfulCount} {review.helpfulCount === 1 ? "person" : "people"} found this helpful
        </div>
      </div>
      
      <p className="text-sm mb-4">{review.comment}</p>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleHelpful(true)}
          disabled={isHelpful !== null || helpfulMutation.isPending}
          className={isHelpful === true ? "bg-primary/10" : ""}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          Helpful
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleHelpful(false)}
          disabled={isHelpful !== null || helpfulMutation.isPending}
          className={isHelpful === false ? "bg-primary/10" : ""}
        >
          <ThumbsDown className="h-4 w-4 mr-1" />
          Not Helpful
        </Button>
      </div>
    </div>
  );
}