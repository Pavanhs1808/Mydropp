import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
}

export default function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div className="flex text-yellow-400">
      {Array.from({ length: max }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < Math.floor(rating) 
              ? "fill-current" 
              : index < rating 
                ? "fill-current opacity-60" 
                : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
