"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Phone, MapPin, Star, Users, Image, Clock } from "lucide-react";

type CompetitorContext = {
  avgRating: number | null;
  avgReviewCount: number | null;
  pctWithWebsite: number | null;
};

type Business = {
  id: string;
  name: string;
  primaryType: string | null;
  rating: number | null;
  reviewCount: number | null;
  websiteUri: string | null;
  phone: string | null;
  address: string | null;
  photosCount: number | null;
  hoursJson: unknown;
  competitorContext: CompetitorContext | null;
};

function delta(value: number | null, avg: number | null): "above" | "below" | "equal" | null {
  if (value == null || avg == null) return null;
  if (value > avg * 1.05) return "above";
  if (value < avg * 0.95) return "below";
  return "equal";
}

export function BusinessCard({ business }: { business: Business }) {
  const cc = business.competitorContext;
  const ratingDelta = delta(business.rating, cc?.avgRating ?? null);
  const reviewDelta = delta(business.reviewCount, cc?.avgReviewCount ?? null);

  return (
    <Card className="flex flex-col gap-0 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base leading-tight">{business.name}</CardTitle>
            {business.primaryType && (
              <p className="text-xs text-gray-500 mt-0.5 capitalize">
                {business.primaryType.replace(/_/g, " ")}
              </p>
            )}
          </div>
          {business.websiteUri ? (
            <Badge variant="secondary" className="shrink-0 text-xs">Has website</Badge>
          ) : (
            <Badge variant="destructive" className="shrink-0 text-xs">No website</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {/* Rating + reviews */}
        <div className="flex items-center gap-4 text-sm">
          {business.rating != null ? (
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{business.rating.toFixed(1)}</span>
              {ratingDelta === "below" && (
                <span className="text-red-500 text-xs">(below avg {cc?.avgRating?.toFixed(1)})</span>
              )}
              {ratingDelta === "above" && (
                <span className="text-green-600 text-xs">(above avg {cc?.avgRating?.toFixed(1)})</span>
              )}
            </span>
          ) : (
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <Star className="w-3.5 h-3.5" /> No rating
            </span>
          )}

          {business.reviewCount != null ? (
            <span className="flex items-center gap-1 text-gray-600">
              <Users className="w-3.5 h-3.5" />
              {business.reviewCount} reviews
              {reviewDelta === "below" && cc?.avgReviewCount && (
                <span className="text-red-500 text-xs">
                  (avg {Math.round(cc.avgReviewCount)})
                </span>
              )}
            </span>
          ) : (
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> No reviews
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-1 text-xs text-gray-500">
          {business.address && (
            <span className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              {business.address}
            </span>
          )}
          {business.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              {business.phone}
            </span>
          )}
          {business.websiteUri && (
            <a
              href={business.websiteUri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-600 hover:underline truncate"
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              {business.websiteUri.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          )}
        </div>

        {/* Signals row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Image className="w-3.5 h-3.5" />
            {business.photosCount ?? 0} photos
          </span>
          {business.hoursJson ? (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <Clock className="w-3.5 h-3.5" /> Hours listed
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-red-500">
              <Clock className="w-3.5 h-3.5" /> No hours
            </span>
          )}
        </div>

        {/* Competitor gap callout */}
        {cc && cc.avgReviewCount != null && business.reviewCount != null &&
          business.reviewCount < cc.avgReviewCount * 0.5 && (
          <div className="rounded-md bg-orange-50 border border-orange-200 px-3 py-2 text-xs text-orange-800">
            Competitors average <strong>{Math.round(cc.avgReviewCount)}</strong> reviews — this business has only <strong>{business.reviewCount}</strong>.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
