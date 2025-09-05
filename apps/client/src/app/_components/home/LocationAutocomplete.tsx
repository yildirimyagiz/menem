import { useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { useLanguage } from "~/context/LanguageContext";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  placeholder?: string;
}

export default function LocationAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Enter an address, neighborhood, city, or ZIP code",
}: LocationAutocompleteProps) {
  const { t } = useLanguage();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }
    let ignore = false;
    const fetchSuggestions = async () => {
      const res = await fetch(
        `/api/location-autocomplete?input=${encodeURIComponent(value)}`,
      );
      const data = await res.json();
      if (!ignore) setSuggestions(data);
    };
    fetchSuggestions();
    return () => {
      ignore = true;
    };
  }, [value]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
    setShowSuggestions(true);
  }

  function handleSelect(suggestion: any) {
    const selected = suggestion.formatted_address || suggestion.name || "";
    onChange(selected);
    setShowSuggestions(false);
    if (onSelect) onSelect(selected);
  }

  return (
    <div className="relative w-full max-w-2xl">
      <input
        type="text"
        ref={inputRef}
        className="w-full flex-1 rounded-2xl border-none bg-transparent px-6 py-5 text-xl text-gray-700 placeholder-gray-400 shadow-lg focus:outline-none"
        placeholder={
          placeholder ||
          t("home.search.placeholder", {
            default: "Enter an address, neighborhood, city, or ZIP code",
          })
        }
        value={value}
        onChange={handleInput}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        autoComplete="off"
      />
      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700">
        <MagnifyingGlassIcon className="h-7 w-7" />
      </span>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 top-full z-10 mt-2 max-h-72 w-full overflow-auto rounded-xl border bg-white shadow-lg">
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              className="cursor-pointer px-6 py-3 text-left text-gray-700 hover:bg-gray-100"
              onMouseDown={() => handleSelect(s)}
            >
              {s.formatted_address || s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
