import React, { useState } from "react";
import { Info } from "lucide-react";

import type { Provider } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";

import { api } from "~/trpc/react";

interface ProviderPriceComparisonProps {
  propertyId: string;
  dates: [Date, Date];
  ourPrice: number;
}

// Mock function to simulate fetching price from a provider
async function fetchProviderPrice(
  provider: Provider,
  propertyId: string,
  dates: [Date, Date],
): Promise<number> {
  // In real implementation, call provider API or your backend
  // Here, return a random price for demo
  const base = 100 + Math.random() * 200;
  const commission = provider.commission || 0;
  return Math.round(base * (1 + commission / 100));
}

const ProviderPriceComparison: React.FC<ProviderPriceComparisonProps> = ({
  propertyId,
  dates,
  ourPrice,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState<{ provider: Provider; price: number }[]>(
    [],
  );
  const [error, setError] = useState<string | null>(null);

  const { data: providers, isLoading: isProvidersLoading } =
    api.providerService.all.useQuery({ isActive: true });

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);
    setError(null);
    try {
      const providerList = Array.isArray(providers?.data) ? providers.data : [];
      if (!providerList.length) throw new Error("No providers found");
      const results = await Promise.all(
        providerList.map(async (provider: Provider) => ({
          provider,
          price: await fetchProviderPrice(provider, propertyId, dates),
        })),
      );
      setPrices(results);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch provider prices");
    } finally {
      setLoading(false);
    }
  };

  const bestPrice = Math.min(ourPrice, ...prices.map((p) => p.price));

  return (
    <>
      <Button
        variant="outline"
        onClick={handleOpen}
        disabled={isProvidersLoading}
        aria-label="Compare Prices with Providers"
      >
        Compare Prices with Providers
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Price Comparison</DialogTitle>
          </DialogHeader>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-pulse space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="mx-auto h-6 w-3/4 rounded bg-gray-200"
                  />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Provider</th>
                    <th className="px-4 py-2 text-left">Source</th>
                    <th className="px-4 py-2 text-left">
                      Commission{" "}
                      <span title="Commission rate">
                        <Info className="inline h-4 w-4 align-text-bottom text-gray-400" />
                      </span>
                    </th>
                    <th className="px-4 py-2 text-left">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={ourPrice === bestPrice ? "bg-green-100" : ""}>
                    <td className="flex items-center gap-2 px-4 py-2 font-bold">
                      <span className="inline-block h-6 w-6 rounded-full bg-blue-200 text-center font-bold">
                        🏠
                      </span>
                      <span>Our Price</span>
                      {ourPrice === bestPrice && (
                        <span className="ml-2 rounded bg-green-500 px-2 py-0.5 text-xs text-white">
                          Best Price
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">Direct</td>
                    <td className="px-4 py-2">0%</td>
                    <td className="px-4 py-2 font-bold">${ourPrice}</td>
                  </tr>
                  {prices.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-4 text-center text-gray-400"
                      >
                        No provider prices found.
                      </td>
                    </tr>
                  )}
                  {prices.map(({ provider, price }) => (
                    <tr
                      key={provider.id}
                      className={price === bestPrice ? "bg-green-100" : ""}
                    >
                      <td className="flex items-center gap-2 px-4 py-2">
                        {typeof provider.logo === "string" && provider.logo ? (
                          <img
                            src={provider.logo}
                            alt={provider.name}
                            className="h-6 w-6 rounded-full"
                          />
                        ) : (
                          <span className="inline-block h-6 w-6 rounded-full bg-gray-200 text-center">
                            🏢
                          </span>
                        )}
                        {provider.baseUrl ? (
                          <a
                            href={provider.baseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                            aria-label={`Visit ${provider.name}`}
                          >
                            {provider.name}
                          </a>
                        ) : (
                          <span>{provider.name}</span>
                        )}
                        {price === bestPrice && (
                          <span className="ml-2 rounded bg-green-500 px-2 py-0.5 text-xs text-white">
                            Best Price
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">{provider.source}</td>
                      <td
                        className="px-4 py-2"
                        title={`Commission: ${provider.commission}%`}
                      >
                        {provider.commission}%
                      </td>
                      <td className="px-4 py-2">${price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 text-xs text-gray-500">
                Best price highlighted. Prices are for selected dates.
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProviderPriceComparison;
