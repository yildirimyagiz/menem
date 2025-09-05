"use client";

import React, { useState } from "react";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Textarea } from "@reservatior/ui/textarea";

import { api } from "~/trpc/react";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ChannelCategory, ChannelType } from "./columns";

const CATEGORY_OPTIONS: { value: ChannelCategory; label: string }[] = [
  { value: "AGENT", label: "Admin.channels.categories.agent" },
  { value: "AGENCY", label: "Admin.channels.categories.agency" },
  { value: "TENANT", label: "Admin.channels.categories.tenant" },
  { value: "PROPERTY", label: "Admin.channels.categories.property" },
  { value: "PAYMENT", label: "Admin.channels.categories.payment" },
  { value: "SYSTEM", label: "Admin.channels.categories.system" },
  { value: "REPORT", label: "Admin.channels.categories.report" },
  { value: "RESERVATION", label: "Admin.channels.categories.reservation" },
  { value: "TASK", label: "Admin.channels.categories.task" },
  { value: "TICKET", label: "Admin.channels.categories.ticket" },
];

const TYPE_OPTIONS: { value: ChannelType; label: string }[] = [
  { value: "PUBLIC", label: "Admin.channels.types.public" },
  { value: "PRIVATE", label: "Admin.channels.types.private" },
  { value: "GROUP", label: "Admin.channels.types.group" },
];

interface ChannelCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ChannelCreateModal: React.FC<ChannelCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const t = useTranslations();
  
  if (!isOpen) return null;

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category: ChannelCategory;
    type: ChannelType;
  }>({
    name: "",
    description: "",
    category: "AGENT",
    type: "PUBLIC",
  });

  const createMutation = api.channel.create.useMutation({
    onSuccess: () => {
      onSuccess();
      setFormData({
        name: "",
        description: "",
        category: "AGENT",
        type: "PUBLIC",
      });
    },
    onError: (error: { message: any }) => {
      console.error("Error creating channel:", error);
      // TODO: Replace with toast for i18n error display
      alert("channels.form.error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("Admin.channels.createModal.title")}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {t("Admin.channels.createModal.description")}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Admin.channels.createModal.fields.name")}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t("Admin.channels.createModal.fields.namePlaceholder")}
                className="bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Admin.channels.createModal.fields.description")}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t("Admin.channels.createModal.fields.descriptionPlaceholder")}
                className="bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Admin.channels.createModal.fields.category")}
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as ChannelCategory })}
              >
                <SelectTrigger className="bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder={t("Admin.channels.createModal.fields.categoryPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Admin.channels.createModal.fields.type")}
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as ChannelType })}
              >
                <SelectTrigger className="bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder={t("Admin.channels.createModal.fields.typePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {t("Admin.channels.createModal.cancel")}
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {createMutation.isPending ? t("Admin.channels.createModal.creating") : t("Admin.channels.createModal.create")}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelCreateModal;
