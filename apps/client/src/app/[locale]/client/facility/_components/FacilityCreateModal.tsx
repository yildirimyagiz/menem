"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Sparkles, X } from "lucide-react";

import { Button } from "@reservatior/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@reservatior/ui/form";
import { Input } from "@reservatior/ui/input";
import { CreateFacilitySchema, FacilityType } from "@reservatior/validators";

import type { FacilityFormValues } from "../types";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const FacilityCreateModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const createFacility = api.facility.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Facility created successfully",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(CreateFacilitySchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      type: initialData?.type ?? "RESIDENTIAL",
      status: initialData?.status ?? "ACTIVE",
      facilityAmenities: initialData?.facilityAmenities ?? [],
      locationAmenities: initialData?.locationAmenities ?? [],
    },
  });

  const onSubmit = async (data: FacilityFormValues) => {
    try {
      setIsLoading(true);
      await createFacility.mutateAsync(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create facility",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl border-0 bg-gradient-to-br from-white to-neutral-50 p-0 shadow-2xl dark:from-neutral-900 dark:to-neutral-800">
            {/* Enhanced Header */}
            <DialogHeader className="relative overflow-hidden rounded-t-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm"
                  >
                    <Building2 className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <DialogTitle className="text-xl font-bold">
                      {initialData ? "Edit Facility" : "Create New Facility"}
                    </DialogTitle>
                    <p className="text-sm text-blue-100">
                      {initialData
                        ? "Update facility information"
                        : "Add a new facility to your portfolio"}
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </DialogHeader>

            {/* Enhanced Form */}
            <div className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="grid gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Facility Name
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileFocus={{ scale: 1.02 }}
                              className="relative"
                            >
                              <Input
                                {...field}
                                className="rounded-xl border-neutral-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                placeholder="Enter facility name"
                              />
                              <Sparkles className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            </motion.div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Description
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileFocus={{ scale: 1.02 }}
                              className="relative"
                            >
                              <textarea
                                {...field}
                                rows={3}
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                placeholder="Describe your facility..."
                              />
                            </motion.div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Facility Type
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileFocus={{ scale: 1.02 }}
                              className="relative"
                            >
                              <select
                                {...field}
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                              >
                                {FacilityType.options.map((type) => (
                                  <option key={type} value={type}>
                                    {type.replace(/_/g, " ")}
                                  </option>
                                ))}
                              </select>
                            </motion.div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Status
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              whileFocus={{ scale: 1.02 }}
                              className="relative"
                            >
                              <select
                                {...field}
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                              >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                              </select>
                            </motion.div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Enhanced Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="flex items-center justify-end space-x-3 pt-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        onClick={onClose}
                        variant="outline"
                        className="rounded-xl border-neutral-200 bg-white px-6 py-2 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                      >
                        Cancel
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                          />
                        ) : (
                          <Building2 className="mr-2 h-4 w-4" />
                        )}
                        {isLoading
                          ? "Creating..."
                          : initialData
                            ? "Update Facility"
                            : "Create Facility"}
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default FacilityCreateModal;
