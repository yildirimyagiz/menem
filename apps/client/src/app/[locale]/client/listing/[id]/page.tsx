import { notFound } from "next/navigation";

import { api, HydrateClient } from "~/trpc/server";
import ListingDetails from "./components/ListingDetails";

interface ListingDetailPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const property = await api.property.byId({ id: params.id });

  if (!property || typeof property !== "object" || !("id" in property)) {
    notFound();
  }

  return (
    <HydrateClient>
      <ListingDetails property={property} />
    </HydrateClient>
  );
}
