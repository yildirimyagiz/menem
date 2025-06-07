"use client";

import type { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Download,
  FileText,
  Home,
  Info,
  Lock,
  Printer,
  Share2,
  Shield,
  Star,
} from "lucide-react";

import type { ContractSchema } from "@acme/validators";
import { Button } from "@acme/ui/button";

import ClientLayout from "~/app/_components/layouts/client-layout"; // Adjusted import path
import { useLanguage } from "~/context/LanguageContext";
import { useAuth } from "~/hooks/use-auth";

export type Contract = z.infer<typeof ContractSchema>;

// Define an interface for the expected data from the API
interface LeaseTemplateData {
  template: {
    // Define the properties of your template object here
    // For example: name: string; content: string; etc.
  };
}
const LeaseAgreementTemplateClient = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const params = useParams();
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const state = params?.state as string | undefined;
  const templateType = params?.templateType as string | undefined;

  const { data, isLoading } = useQuery<LeaseTemplateData, Error>({
    queryKey: ["/api/client/resources/lease-templates", state, templateType],
    queryFn: () => {
      // TODO: Replace with real API call
      // For now, ensure the mock data matches the LeaseTemplateData interface
      return Promise.resolve({
        template: { name: "Sample Lease", content: "..." },
      });
    },
    enabled: !!user,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

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

  const { template } = data;

  return (
    <ClientLayout children={undefined}>
      {/* ...rest of your UI, unchanged... */}
    </ClientLayout>
  );
};

export default LeaseAgreementTemplateClient;
