import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SellerRatingDisplayProps {
  rating: number;
  totalRatings: number;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
  className?: string;
}

const SellerRatingDisplay = ({
  rating,
  totalRatings,
  size = "md",
  showBadge = false,
  className = "",
}: SellerRatingDisplayProps) => {
  const { t } = useTranslation();
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            className={`${iconSizes[size]} fill-yellow-400 text-yellow-400`}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className={`${iconSizes[size]} fill-yellow-400/50 text-yellow-400`}
          />
        );
      } else {
        stars.push(
          <Star key={i} className={`${iconSizes[size]} text-gray-300`} />
        );
      }
    }
    return stars;
  };

  const isTopRated = rating >= 4.5 && totalRatings >= 10;

  if (totalRatings === 0) {
    return (
      <div
        className={`flex items-center gap-1 ${sizeClasses[size]} text-gray-500 ${className}`}
      >
        <span>{t("ratings.noRatings", "No ratings yet")}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <div className="flex">{renderStars()}</div>
        <span className={`${sizeClasses[size]} text-gray-600 font-medium`}>
          {rating.toFixed(1)}
        </span>
        <span className={`${sizeClasses[size]} text-gray-500`}>
          {t("ratings.reviewCount", {
            count: totalRatings,
            defaultValue: `(${totalRatings} review${
              totalRatings !== 1 ? "s" : ""
            })`,
          })}
        </span>
      </div>
      {showBadge && isTopRated && (
        <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200 text-xs px-2 py-1">
          {t("ratings.topRated", "Top Rated")}
        </Badge>
      )}
    </div>
  );
};

export default SellerRatingDisplay;
