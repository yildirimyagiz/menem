"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@reservatior/ui/dialog";

import TaxRecordForm from "./components/TaxRecordForm";
import TaxRecordList from "./components/TaxRecordList";

export default function TaxRecordsPage() {
  const t = useTranslations("taxRecords");
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("title", { defaultValue: "Tax Records" })}</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>{t("create", { defaultValue: "Add Tax Record" })}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("create", { defaultValue: "Add Tax Record" })}</DialogTitle>
            </DialogHeader>
            <TaxRecordForm
              onSuccess={() => {
                setIsFormOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <TaxRecordList />
    </div>
  );
}
