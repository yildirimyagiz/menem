"use client";

import type { z } from "zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";

import type { ContractSchema } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";

import ClientLayout from "~/app/_components/layouts/client-layout";
import { useAuth } from "~/hooks/use-auth";

export type Contract = z.infer<typeof ContractSchema>;

interface LeaseTemplateData {
  template: {
    name: string;
    content: string;
  };
}
const LeaseAgreementTemplateClient = () => {
  const { user } = useAuth();
  const params = useParams();

  const state = params?.state as string | undefined;
  const templateType = params?.templateType as string | undefined;

  const { data, isLoading } = useQuery<LeaseTemplateData, Error>({
    queryKey: ["/api/client/resources/lease-templates", state, templateType],
    queryFn: () => {
      return Promise.resolve({
        template: { name: "Sample Lease", content: "..." },
      });
    },
    enabled: !!user,
  });

  if (!user) return null;
  if (isLoading) {
    return (
      <ClientLayout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </ClientLayout>
    );
  }

  if (!data?.template) {
    return (
      <ClientLayout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <AlertTriangle className="mb-4 h-16 w-16 text-destructive" />
          <h2 className="mb-2 text-2xl font-bold">Template Not Found</h2>
          <p className="mb-6 text-muted-foreground">
            We couldn't find the lease template you're looking for.
          </p>
          <Button asChild>
            <Link href="/client/resources">Browse All Resources</Link>
          </Button>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout children={undefined}>
      {/* ...rest of your UI, unchanged... */}
    </ClientLayout>
  );
};

export default LeaseAgreementTemplateClient;
