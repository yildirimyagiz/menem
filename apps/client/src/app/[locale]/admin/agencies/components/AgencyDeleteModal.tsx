"use client";

import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "~/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";

import { api } from "~/trpc/react";

interface AgencyDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyId: string;
  onSuccess: () => void;
}

export default function AgencyDeleteModal({
  isOpen,
  onClose,
  agencyId,
  onSuccess,
}: AgencyDeleteModalProps) {
  const t = useTranslations();
  
  const deleteMutation = api.agency.delete.useMutation({
    onSuccess: () => {
      toast({
        title: t("Admin.agencies.deleteModal.success.title", { defaultValue: "Agency Deleted" }),
        description: t("Admin.agencies.deleteModal.success.description", { defaultValue: "The agency was deleted successfully." }),
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: t("Admin.agencies.deleteModal.error.title", { defaultValue: "Error" }),
        description: error.message || t("Admin.agencies.deleteModal.error.description", { defaultValue: "Failed to delete agency." }),
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(agencyId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl shadow-gray-200/20 rounded-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="space-y-3">
                <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  {t("Admin.agencies.deleteModal.title", { defaultValue: "Delete Agency" })}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  {t("Admin.agencies.deleteModal.description", { defaultValue: "Are you sure you want to delete this agency? This action cannot be undone." })}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        {t("Admin.agencies.deleteModal.warning.title", { defaultValue: "This action is irreversible" })}
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {t("Admin.agencies.deleteModal.warning.description", { defaultValue: "This will permanently remove the agency from the system. All associated data will be marked as deleted but may be retained for audit purposes." })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="h-10 px-4"
                  disabled={deleteMutation.isPending}
                >
                  {t("Admin.agencies.deleteModal.cancel", { defaultValue: "Cancel" })}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="h-10 px-6 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                >
                  {deleteMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      {t("Admin.agencies.deleteModal.deleting", { defaultValue: "Deleting..." })}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      {t("Admin.agencies.deleteModal.delete", { defaultValue: "Delete Agency" })}
                    </div>
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
