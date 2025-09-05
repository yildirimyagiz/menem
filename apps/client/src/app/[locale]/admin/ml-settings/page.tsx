"use client";

import { notFound } from "next/navigation";
import { api } from "~/trpc/react";
import { MLSettingsForm } from "./components/MLSettingsForm";
import { useTranslations } from 'next-intl';

export default function MLSettingsAdminPage() {
  const t = useTranslations('adminMLSettings');
  const { data, isLoading, error } = api.mlConfig.byId.useQuery({ id: "singleton" });

  if (isLoading) return <div>{t('loading', { defaultValue: 'Loading...' })}</div>;
  if (error || !data) return notFound();

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">{t('title', { defaultValue: 'ML Settings' })}</h1>
      <MLSettingsForm defaultValues={data} t={t} />
    </div>
  );
}
