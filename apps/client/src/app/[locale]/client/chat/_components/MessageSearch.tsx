import React, { useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { useTranslations } from 'next-intl';

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";



interface MessageSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onClear: () => void;
}

interface SearchFilters {
  dateFrom?: Date;
  dateTo?: Date;
  senderId?: string;
  messageType?: "all" | "text" | "media" | "file";
}

export function MessageSearch({ onSearch, onClear }: MessageSearchProps) {
  const t = useTranslations('Chat');
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    messageType: "all",
  });

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim(), filters);
    }
  };

  const handleClear = () => {
    setQuery("");
    setFilters({ messageType: "all" });
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="border-b bg-white p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('messageSearch.placeholder', { defaultValue: 'Search messages...' })}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>

        {query && (
          <Button variant="outline" size="sm" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        )}

        <Button size="sm" onClick={handleSearch} disabled={!query.trim()}>
          {t('messageSearch.searchButton', { defaultValue: 'Search' })}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 space-y-3 rounded-lg border bg-gray-50 p-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">{t('messageSearch.dateFrom', { defaultValue: 'Date From' })}</label>
              <Input
                type="date"
                value={filters.dateFrom?.toISOString().split("T")[0] ?? ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    dateFrom: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t('messageSearch.dateTo', { defaultValue: 'Date To' })}</label>
              <Input
                type="date"
                value={filters.dateTo?.toISOString().split("T")[0] ?? ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    dateTo: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  }))
                }
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">{t('messageSearch.messageType', { defaultValue: 'Message Type' })}</label>
            <div className="mt-1 flex gap-2">
              {(["all", "text", "media", "file"] as const).map((type) => (
                <Badge
                  key={type}
                  variant={filters.messageType === type ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, messageType: type }))
                  }
                >
                  {t(`messageSearch.type.${type}`, { defaultValue: type.charAt(0).toUpperCase() + type.slice(1) })}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
