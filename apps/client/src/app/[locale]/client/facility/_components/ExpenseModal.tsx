"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Loader2,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { Button } from "@reservatior/ui/button";
import { Calendar } from "@reservatior/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@reservatior/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Textarea } from "@reservatior/ui/textarea";
import {
  CreateExpenseSchema,
  ExpenseStatus,
  ExpenseType,
} from "@reservatior/validators";

import type { CreateExpenseInput, Expense, UpdateExpenseInput } from "../types";
import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const EXPENSE_TYPES = [
  ExpenseType.MAINTENANCE,
  ExpenseType.CLEANING,
  ExpenseType.UTILITIES,
  ExpenseType.MANAGEMENT_FEE,
  ExpenseType.TAX,
  ExpenseType.INSURANCE,
  ExpenseType.REPAIR,
  ExpenseType.SECURITY,
  ExpenseType.OTHER,
] as const;

const EXPENSE_STATUSES = [
  ExpenseStatus.PENDING,
  ExpenseStatus.PAID,
  ExpenseStatus.OVERDUE,
  ExpenseStatus.CANCELLED,
] as const;

// Enhanced status icons
const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case "PAID":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "OVERDUE":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case "CANCELLED":
      return <XCircle className="h-4 w-4 text-neutral-600" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-600" />;
  }
};

// Enhanced type icons
const getTypeIcon = (type: string) => {
  switch (type) {
    case "MAINTENANCE":
      return <TrendingUp className="h-4 w-4 text-blue-600" />;
    case "CLEANING":
      return <Sparkles className="h-4 w-4 text-purple-600" />;
    case "UTILITIES":
      return <CreditCard className="h-4 w-4 text-green-600" />;
    case "MANAGEMENT_FEE":
      return <DollarSign className="h-4 w-4 text-orange-600" />;
    case "TAX":
      return <FileText className="h-4 w-4 text-red-600" />;
    case "INSURANCE":
      return <AlertCircle className="h-4 w-4 text-indigo-600" />;
    case "REPAIR":
      return <TrendingUp className="h-4 w-4 text-yellow-600" />;
    case "SECURITY":
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
    case "OTHER":
      return <FileText className="h-4 w-4 text-neutral-600" />;
    default:
      return <DollarSign className="h-4 w-4 text-blue-600" />;
  }
};

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Expense | null;
  facilityId?: string;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  facilityId,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Get currencies for the form
  const { data: currenciesResponse } = api.currency.all.useQuery();

  // Form setup
  const form = useForm<CreateExpenseInput>({
    resolver: zodResolver(CreateExpenseSchema),
    defaultValues: {
      type: ExpenseType.MAINTENANCE,
      amount: 0,
      status: ExpenseStatus.PENDING,
      notes: "",
      facilityId: facilityId ?? "",
      currencyId: currenciesResponse?.data?.data?.[0]?.id ?? "",
    },
  });

  // Mutations
  const createMutation = api.expense.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Expense created successfully",
      });
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = api.expense.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Expense updated successfully",
      });
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          type: initialData.type,
          amount: initialData.amount,
          status: initialData.status,
          notes: initialData.notes ?? "",
          facilityId: facilityId ?? initialData.facilityId ?? "",
          currencyId: initialData.currencyId || "USD",
          dueDate: initialData.dueDate
            ? new Date(initialData.dueDate)
            : undefined,
          paidDate: initialData.paidDate
            ? new Date(initialData.paidDate)
            : undefined,
        });
      } else {
        form.reset({
          type: ExpenseType.MAINTENANCE,
          amount: 0,
          status: ExpenseStatus.PENDING,
          notes: "",
          facilityId: facilityId ?? "",
          currencyId: currenciesResponse?.data?.data?.[0]?.id ?? "",
        });
      }
    }
  }, [isOpen, initialData, facilityId, form]);

  const onSubmit = async (data: CreateExpenseInput) => {
    setIsLoading(true);
    try {
      if (initialData) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          ...data,
        } as UpdateExpenseInput);
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error("Error saving expense:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="max-w-2xl border-0 bg-gradient-to-br from-white to-neutral-50 shadow-2xl dark:from-neutral-900 dark:to-neutral-800">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  {initialData ? "Edit Expense" : "Add New Expense"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Expense Type */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                              Expense Type
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-xl border-neutral-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                                  <SelectValue placeholder="Select expense type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                                {EXPENSE_TYPES.map((type) => (
                                  <SelectItem
                                    key={type}
                                    value={type}
                                    className="flex items-center space-x-2"
                                  >
                                    <span className="flex items-center space-x-2">
                                      {getTypeIcon(type)}
                                      <span>{type.replace(/_/g, " ")}</span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    {/* Amount */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                              Amount
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                  <DollarSign className="h-4 w-4" />
                                </div>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="0.00"
                                  className="rounded-xl border-neutral-200 bg-white pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    {/* Status */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                              Status
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-xl border-neutral-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                                {EXPENSE_STATUSES.map((status) => (
                                  <SelectItem
                                    key={status}
                                    value={status}
                                    className="flex items-center space-x-2"
                                  >
                                    <span className="flex items-center space-x-2">
                                      {getStatusIcon(status)}
                                      <span>
                                        {status.charAt(0) +
                                          status.slice(1).toLowerCase()}
                                      </span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    {/* Currency */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <FormField
                        control={form.control}
                        name="currencyId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                              Currency
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-xl border-neutral-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                                {currenciesResponse?.data?.data?.map(
                                  (currency) => (
                                    <SelectItem
                                      key={currency.id}
                                      value={currency.id}
                                      className="flex items-center space-x-2"
                                    >
                                      <span className="flex items-center space-x-2">
                                        <span className="font-medium">
                                          {currency.symbol}
                                        </span>
                                        <span>
                                          {currency.code} - {currency.name}
                                        </span>
                                      </span>
                                    </SelectItem>
                                  ),
                                ) ?? []}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  {/* Due Date */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Due Date
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full rounded-xl border-neutral-200 bg-white pl-3 text-left font-normal hover:bg-neutral-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700",
                                    !field.value &&
                                      "text-neutral-500 dark:text-neutral-400",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span className="flex items-center">
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      Pick a date
                                    </span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto rounded-xl border-neutral-200 bg-white p-0 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date: Date) => date < new Date()}
                                initialFocus
                                className="rounded-xl"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Notes */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Notes
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add any additional notes..."
                              className="resize-none rounded-xl border-neutral-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    className="flex justify-end gap-3 pt-6"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="rounded-xl border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
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
                        className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700"
                      >
                        {isLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {initialData ? "Update" : "Create"}
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              </Form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ExpenseModal;
