import { notFound } from "next/navigation";

import { api } from "~/trpc/react";
import { DiscountForm } from "../../components/DiscountForm";

export default async function EditDiscountPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    // Use the correct method name from your tRPC router
    const discount = await api.discount.byId.query({ id: params.id });

    if (!discount) {
      notFound();
    }

    return (
      <div className="container mx-auto py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Discount</h1>
          <p className="text-muted-foreground">
            Update the discount details below
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <DiscountForm initialData={discount} isEditing />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading discount:", error);
    notFound();
  }
}
