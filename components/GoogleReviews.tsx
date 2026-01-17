"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ExternalLink } from "lucide-react";

interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
  profile_photo_url?: string;
  author_url?: string;
}

interface GoogleReviewsProps {
  reviews?: GoogleReview[];
  placeId?: string;
  maxReviews?: number;
  className?: string;
}

export default function GoogleReviews({ 
  reviews: initialReviews, 
  placeId, 
  maxReviews = 5,
  className = "" 
}: GoogleReviewsProps) {
  const [reviews, setReviews] = useState<GoogleReview[]>(initialReviews || []);
  const [loading, setLoading] = useState(!initialReviews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // If reviews are provided as props, use them
    if (initialReviews && initialReviews.length > 0) {
      setReviews(initialReviews.slice(0, maxReviews));
      setLoading(false);
      return;
    }

    // Always try to fetch from API
    fetchReviews();
  }, [maxReviews]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/google-reviews?maxReviews=${maxReviews}`);
      const data = await response.json();
      
      if (data.success && data.reviews && data.reviews.length > 0) {
        setReviews(data.reviews);
        setShowFallback(false);
      } else {
        setShowFallback(true);
        setError(data.error || "No reviews available");
      }
    } catch (err) {
      console.error("Error fetching Google reviews:", err);
      setShowFallback(true);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reviews.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }, 6000); // Change review every 6 seconds

      return () => clearInterval(interval);
    }
  }, [reviews.length]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-champagne-gold text-champagne-gold"
                : "fill-gray-600 text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  // Show fallback badge if API fails or no reviews
  if (showFallback || (error && reviews.length === 0)) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="inline-flex items-center gap-3 px-6 py-4 bg-gray-900/50 backdrop-blur-sm border border-champagne-gold/30 rounded-lg">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-5 h-5 fill-champagne-gold text-champagne-gold"
              />
            ))}
          </div>
          <div>
            <p className="text-white font-semibold text-lg">Verified 5-Star Service</p>
            <p className="text-gray-400 text-sm">Trusted by 500+ happy clients</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-gray-400">Loading reviews...</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  const currentReview = reviews[currentIndex];

  return (
    <div className={`relative max-w-4xl mx-auto ${className}`}>
      {/* Google Reviews Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-champagne-gold/30">
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-300">Google Reviews</span>
        </div>
      </div>

      {/* Review Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`border-champagne-gold/40 backdrop-blur-lg transition-all duration-300 hover:border-champagne-gold/60 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] ${
            className?.includes('luxury-theme') ? 'bg-white/5' : 'bg-gray-800/50 backdrop-blur-sm'
          }`}>
            <CardContent className="p-8 sm:p-12">
              {/* Rating Stars */}
              <div className="flex justify-center mb-4">
                {renderStars(currentReview.rating)}
              </div>

              {/* Review Text */}
              <p className="text-lg sm:text-xl md:text-2xl text-white font-medium leading-relaxed text-center mb-8 italic">
                &quot;{currentReview.text}&quot;
              </p>

              {/* Author Info */}
              <div className="text-center border-t border-champagne-gold/30 pt-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  {currentReview.profile_photo_url && (
                    <img
                      src={currentReview.profile_photo_url}
                      alt={currentReview.author_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="text-champagne-gold font-bold text-lg sm:text-xl">
                      {currentReview.author_name}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {currentReview.relative_time_description}
                    </p>
                  </div>
                </div>
                
                {/* Link to Google Reviews */}
                {currentReview.author_url && (
                  <a
                    href={currentReview.author_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-champagne-gold hover:text-gold-light transition-colors mt-2"
                  >
                    View on Google
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Dots indicator */}
      {reviews.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-8 h-2 bg-champagne-gold"
                  : "w-2 h-2 bg-champagne-gold/30 hover:bg-champagne-gold/50"
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
