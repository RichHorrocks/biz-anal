"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { SearchForm } from "./search-form";
import { BusinessCard } from "./business-card";
import { Skeleton } from "@/components/ui/skeleton";

type SearchResult = {
  searchId: string;
  businesses: Array<{
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
    competitorContext: {
      avgRating: number | null;
      avgReviewCount: number | null;
      pctWithWebsite: number | null;
    } | null;
  }>;
};

export function SearchSection() {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync, isPending } = trpc.search.run.useMutation();

  async function handleSearch(location: string, category: string) {
    setError(null);
    try {
      const data = await mutateAsync({ location, category });
      setResults(data as SearchResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed. Check your Google Places API key.");
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <SearchForm onSearch={handleSearch} loading={isPending} />

      {error && (
        <div className="w-full max-w-2xl rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isPending && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-white p-4 flex flex-col gap-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      )}

      {results && !isPending && (
        <div className="w-full">
          <p className="text-sm text-gray-500 mb-4">
            {results.businesses.length} businesses found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.businesses.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        </div>
      )}

      {!results && !isPending && !error && (
        <p className="text-gray-400 text-sm">
          Enter a category and location above to find opportunities.
        </p>
      )}
    </div>
  );
}
