"use client";

import Image from "next/image";

import { Button } from "@acme/ui/button";

import { useCurrency } from "~/context/CurrencyContext";
import { useLanguage } from "~/context/LanguageContext";
import { api } from "~/trpc/react";

const PLACEHOLDER_IMAGE = "/images/property-placeholder.jpg";

interface Property {
  id: string;
  title?: string | null;
  Location?: { city?: string | null; address?: string | null } | null;
  beds?: number | null;
  baths?: number | null;
  size?: number | null;
  sqft?: number | null;
  price?: number | null;
  features?: string[];
  Photo?: { url: string }[];
  PricingRules?: { price?: number | null; amount?: number | null }[];
  featured?: boolean;
}

export default function FeaturedProperties() {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  // Fetch a small batch and filter for featured properties on the frontend
  const { data, isLoading, isError } = api.property.all.useQuery({
    pageSize: 12,
  });

  if (isLoading) {
    return (
      <section className="container mx-auto my-12 px-4">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">
          {t("home.featured.title", { default: "Featured Properties" })}
        </h2>
        <div className="py-12 text-center text-gray-400">
          {t("loading", { default: "Loading..." })}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="container mx-auto my-12 px-4">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">
          {t("home.featured.title", { default: "Featured Properties" })}
        </h2>
        <div className="py-12 text-center text-red-500">
          {t("error.generic", { default: "Failed to load properties." })}
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto my-12 px-4">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">
        {t("home.featured.title", { default: "Featured Properties" })}
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.isArray(data?.data)
          ? (data.data as Property[])
              .filter((property) => property.featured)
              .slice(0, 4)
              .map((property) => {
                const photoUrl = property.Photo?.[0]?.url ?? PLACEHOLDER_IMAGE;
                const location =
                  property.Location?.city ?? property.Location?.address ?? "-";
                const beds =
                  property.beds ??
                  property.features?.find((f) =>
                    f.toLowerCase().includes("bed"),
                  ) ??
                  "-";
                const baths =
                  property.baths ??
                  property.features?.find((f) =>
                    f.toLowerCase().includes("bath"),
                  ) ??
                  "-";
                const sqft = property.size ?? property.sqft ?? "-";
                const price =
                  property.PricingRules?.[0]?.price ??
                  property.price ??
                  property.PricingRules?.[0]?.amount ??
                  0;
                return (
                  <div
                    key={property.id}
                    className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <Image
                      src={photoUrl}
                      alt={property.title ?? "Property"}
                      className="h-44 w-full rounded-t-lg object-cover"
                      width={400}
                      height={176}
                      style={{ objectFit: "cover" }}
                      priority={false}
                    />
                    <div className="p-4">
                      <div className="mb-2 text-lg font-semibold text-gray-900">
                        {t(`home.featured.property.${property.id}.title`, {
                          default:
                            property.title ??
                            t("home.featured.noTitle", {
                              default: "Untitled Property",
                            }),
                        })}
                      </div>
                      <div className="mb-1 text-sm text-gray-500">
                        {t("home.featured.location", { default: location })}
                      </div>
                      <div className="mb-2 text-xs text-gray-400">
                        {beds} {t("home.featured.beds", { default: "Bed" })} ·{" "}
                        {baths} {t("home.featured.baths", { default: "Bath" })}{" "}
                        · {sqft} {t("home.featured.sqft", { default: "sqft" })}
                      </div>
                      <div className="mb-3 text-lg font-bold text-blue-600">
                        {formatCurrency(price)}{" "}
                        {t("home.featured.perMonth", { default: "/mo" })}
                      </div>
                      <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                        {t("home.featured.viewDetails", {
                          default: "View Details",
                        })}
                      </Button>
                    </div>
                  </div>
                );
              })
          : null}
      </div>
    </section>
  );
}
