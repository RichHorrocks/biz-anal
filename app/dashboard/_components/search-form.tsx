"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface Props {
  onSearch: (location: string, category: string) => void;
  loading: boolean;
}

export function SearchForm({ onSearch, loading }: Props) {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (location.trim() && category.trim()) {
      onSearch(location.trim(), category.trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
      <input
        type="text"
        placeholder="Category (e.g. dentist, gym, solicitor)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={loading}
        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
      />
      <input
        type="text"
        placeholder="Location (e.g. Manchester)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        disabled={loading}
        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
      />
      <Button type="submit" disabled={loading || !location || !category}>
        <Search className="w-4 h-4 mr-2" />
        {loading ? "Searching…" : "Search"}
      </Button>
    </form>
  );
}
