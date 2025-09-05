import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Edit, ExternalLink } from "lucide-react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Separator } from "@reservatior/ui/separator";

import { api } from "~/trpc/server";

export default async function DiscountDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const discount = await api.discount.byId.query({ id: params.id });

  if (!discount) {
    notFound();
  }

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Not set";
    return format(new Date(date), "PPP");
  };

  const formatValue = (value: number, type: string) => {
    return type === "PERCENTAGE" ? `${value}%` : `$${value.toFixed(2)}`;
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{discount.name}</h1>
          <p className="text-muted-foreground">
            {discount.code && (
              <>
                Code:{" "}
                <code className="rounded bg-muted px-2 py-1">
                  {discount.code}
                </code>
              </>
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <a href={`/admin/discount/${discount.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Discount Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Type</dt>
                <dd className="text-sm font-medium">
                  <Badge variant="outline" className="capitalize">
                    {discount.type.toLowerCase().replace(/_/g, " ")}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Value</dt>
                <dd className="text-sm font-medium">
                  {formatValue(discount.value, discount.type)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Status</dt>
                <dd className="text-sm font-medium">
                  <Badge variant={discount.isActive ? "default" : "secondary"}>
                    {discount.isActive ? "Active" : "Inactive"}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Current Usage</dt>
                <dd className="text-sm font-medium">
                  {discount.currentUsage}
                  {discount.maxUsage ? ` / ${discount.maxUsage}` : ""}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Usage Limit</dt>
                <dd className="text-sm font-medium">
                  {discount.maxUsage || "Unlimited"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Validity Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Start Date</dt>
                <dd className="flex items-center text-sm font-medium">
                  <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                  {formatDate(discount.startDate)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">End Date</dt>
                <dd className="flex items-center text-sm font-medium">
                  <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                  {formatDate(discount.endDate)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {discount.description && (
          <Card className="md:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {discount.description}
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Created At</dt>
                <dd className="text-sm font-medium">
                  {formatDate(discount.createdAt)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Last Updated</dt>
                <dd className="text-sm font-medium">
                  {formatDate(discount.updatedAt)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
