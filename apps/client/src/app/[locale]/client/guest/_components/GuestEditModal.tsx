import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@reservatior/ui/dialog";

import { api } from "~/trpc/react";

export default function GuestEditModal({
  isOpen,
  onClose,
  onSuccess,
  guestId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  guestId: string;
}) {
  const t = useTranslations();
  const { data: guest, isLoading } = api.guest.byId.useQuery(
    { id: guestId },
    { enabled: isOpen },
  );
  const updateMutation = api.guest.update.useMutation({
    onSuccess: () => {
      onSuccess();
    },
  });

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      nationality: "",
      passportNumber: "",
    },
  });

  useEffect(() => {
    if (guest) {
      reset({
        name: guest.name || "",
        email: guest.email || "",
        phone: guest.phone || "",
        nationality: guest.nationality || "",
        passportNumber: guest.passportNumber || "",
      });
    }
  }, [guest, reset]);

  const onSubmit = (values: any) => {
    updateMutation.mutate({ ...values, id: guestId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{t("editGuestTitle")}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("name", { required: true })}
            placeholder={t("namePlaceholder")}
            className="w-full rounded border p-2"
          />
          <input
            {...register("email", { required: true })}
            placeholder={t("emailPlaceholder")}
            className="w-full rounded border p-2"
          />
          <input
            {...register("phone", { required: true })}
            placeholder={t("phonePlaceholder")}
            className="w-full rounded border p-2"
          />
          <input
            {...register("nationality", { required: true })}
            placeholder={t("nationalityPlaceholder")}
            className="w-full rounded border p-2"
          />
          <input
            {...register("passportNumber", { required: true })}
            placeholder={t("passportNumberPlaceholder")}
            className="w-full rounded border p-2"
          />
          <DialogFooter>
            <Button variant="outline" onClick={onClose} type="button">
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending || isLoading}
            >
              {updateMutation.isPending ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
          {updateMutation.isError && (
            <div className="mt-2 text-sm text-red-500">
              {updateMutation.error?.message || t("updateGuestError")}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
