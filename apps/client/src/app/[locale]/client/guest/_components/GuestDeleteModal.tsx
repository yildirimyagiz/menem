import React from "react";
import { useTranslations } from "next-intl";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@reservatior/ui/dialog";

import { api } from "~/trpc/react";

export default function GuestDeleteModal({
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
  const deleteMutation = api.guest.delete.useMutation({
    onSuccess: () => {
      onSuccess();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{t("deleteGuestTitle")}</DialogTitle>
        <p>{t("deleteGuestDescription")}</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate(guestId)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? t("deleting") : t("delete")}
          </Button>
        </DialogFooter>
        {deleteMutation.isError && (
          <div className="mt-2 text-sm text-red-500">
            {deleteMutation.error?.message || t("deleteGuestError")}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
