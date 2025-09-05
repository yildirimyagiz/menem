import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@reservatior/ui/button";

import { api } from "~/trpc/server";
import { columns } from "./components/columns";
import { DataTable } from "./components/DataTable";

export default async function DiscountsPage() {
  const data = await api.discount.all.query({});

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Discounts</h1>
        <Button asChild>
          <Link href="/admin/discount/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Discount
          </Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading discounts...</div>}>
        <DataTable columns={columns} data={data} />
      </Suspense>
    </div>
  );
}
