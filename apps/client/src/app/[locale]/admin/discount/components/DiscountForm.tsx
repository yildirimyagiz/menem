"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import type {
  CreateDiscountInput,
  Discount,
  UpdateDiscountInput,
} from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import { Calendar } from "@reservatior/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Switch } from "@reservatior/ui/switch";
import { Textarea } from "@reservatior/ui/textarea";
import {
  CreateDiscountSchema,
  DISCOUNT_TYPES,
  UpdateDiscountSchema,
} from "@reservatior/validators";

import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface DiscountFormProps {
  initialData?: Discount | null;
  isEditing?: boolean;
}

export function DiscountForm({
  initialData,
  isEditing = false,
}: DiscountFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const utils = api.useContext();

  const createDiscount = api.discount.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Discount created",
        description: "The discount has been created successfully.",
      });
      utils.discount.invalidate();
      router.push("/admin/discount");
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create discount.",
        variant: "destructive",
      });
    },
  });

  const updateDiscount = api.discount.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Discount updated",
        description: "The discount has been updated successfully.",
      });
      utils.discount.invalidate();
      router.push("/admin/discount");
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update discount.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<CreateDiscountInput | UpdateDiscountInput>({
    resolver: zodResolver(
      isEditing ? UpdateDiscountSchema : CreateDiscountSchema,
    ),
    defaultValues:
      isEditing && initialData
        ? {
            ...initialData,
            startDate: initialData?.startDate
              ? new Date(initialData.startDate)
              : undefined,
            endDate: initialData?.endDate
              ? new Date(initialData.endDate)
              : undefined,
          }
        : {
            name: "",
            description: "",
            code: "",
            value: 0,
            type: "PERCENTAGE",
            isActive: true,
          },
  });

  const onSubmit = (data: CreateDiscountInput | UpdateDiscountInput) => {
    if (isEditing && initialData) {
      updateDiscount.mutate(data as UpdateDiscountInput);
    } else {
      createDiscount.mutate(data as CreateDiscountInput);
    }
  };

  const isLoading = createDiscount.isPending || updateDiscount.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Summer Sale" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="SUMMER25"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description of the discount"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a discount type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DISCOUNT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type
                          .toLowerCase()
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {form.watch("type") === "PERCENTAGE"
                    ? "Percentage"
                    : "Amount"}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    {form.watch("type") === "PERCENTAGE" ? (
                      <Input
                        type="number"
                        min="0"
                        max={
                          form.watch("type") === "PERCENTAGE"
                            ? "100"
                            : undefined
                        }
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    ) : (
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">
                          $
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="pl-7"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </div>
                    )}
                    {form.watch("type") === "PERCENTAGE" && (
                      <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">
                        %
                      </span>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxUsage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Usage (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : null,
                      )
                    }
                  />
                </FormControl>
                <FormDescription>
                  Leave empty for unlimited usage
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date (optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a start date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date)}
                      disabled={(date) =>
                        form.getValues("endDate")
                          ? date >
                            new Date(
                              form.getValues("endDate") as unknown as string,
                            )
                          : false
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick an end date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date)}
                      disabled={(date) =>
                        form.getValues("startDate")
                          ? date <
                            new Date(
                              form.getValues("startDate") as unknown as string,
                            )
                          : date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active</FormLabel>
                <FormDescription>
                  {field.value
                    ? "This discount is currently active."
                    : "This discount is currently inactive."}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/discount")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : isEditing ? (
              "Update Discount"
            ) : (
              "Create Discount"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
