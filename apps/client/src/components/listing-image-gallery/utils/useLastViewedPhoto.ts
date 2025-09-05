import { useState } from "react";

// Lightweight local hook to remember the last viewed photo within the gallery lifecycle.
// This replaces the previous dependency on 'react-hooks-global-state'.
export const useLastViewedPhoto = () => {
  return useState<string | null>(null);
};
