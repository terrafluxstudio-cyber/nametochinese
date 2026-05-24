"use client";

import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Props {
  onResults: (results: SearchResult[]) => void;
  onLoading: (loading: boolean) => void;
  type: string;
}

export interface SearchResult {
  english: string;
  nationality: string;
  chinese: string;
  has_note?: number;
  is_crossref?: number;
  type: "person" | "place";
}

export function SearchBox({ onResults, onLoading, type }: Props) {
  const [query, setQuery] = useState("");

  const fetchResults = useCallback(
    debounce(async (q: string, t: string) => {
      if (q.length < 2) {
        onResults([]);
        onLoading(false);
        return;
      }
      onLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=${t}&limit=30`);
        const data = await res.json();
        onResults(data);
      } catch {
        onResults([]);
      } finally {
        onLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchResults(query, type);
  }, [query, type]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="输入英文名或中文译名，如 Adams 或 亚当斯"
        className="pl-12 pr-4 h-14 text-lg rounded-2xl border-0 shadow-md bg-white focus-visible:ring-2 focus-visible:ring-[#2C5F8A]/30"
      />
    </div>
  );
}
