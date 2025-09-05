// Utility to select a city image from /images/cities for a given city name
// Usage: getCityImage(cityName: string): string

const cityImageMap: Record<string, string> = {
  "san francisco": "/images/cities/San-Francisco-Cityscape-Aerial-Photo.jpg",
  "cologne": "/images/cities/Kolner-Dom-in-Cologne-Germany.webp",
  "los angeles": "/images/cities/Los-Angeles-Instagrammable-Best-Photo-Spots-Away-Lands-096.jpg",
  "paris": "/images/cities/Photospots-paris-photographer-flytographer-5.jpeg",
  "new york": "/images/cities/newyork/header.jpg",
};

const defaultCityImages = [
  "/images/cities/San-Francisco-Cityscape-Aerial-Photo.jpg",
  "/images/cities/Kolner-Dom-in-Cologne-Germany.webp",
  "/images/cities/Los-Angeles-Instagrammable-Best-Photo-Spots-Away-Lands-096.jpg",
  "/images/cities/Photospots-paris-photographer-flytographer-5.jpeg",
];

export function getCityImage(city?: string): string {
  if (!city) return defaultCityImages[0];
  const key = city.trim().toLowerCase();
  if (cityImageMap[key]) return cityImageMap[key];
  // Try partial match
  const found = Object.keys(cityImageMap).find((k) => key.includes(k));
  if (found) return cityImageMap[found];
  // Fallback to random city image
  return defaultCityImages[Math.floor(Math.random() * defaultCityImages.length)];
}
