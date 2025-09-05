"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@reservatior/ui";
import { Button } from "@reservatior/ui/button";
import { Calendar } from "@reservatior/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@reservatior/ui/form";
import { Input } from "@reservatior/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@reservatior/ui/popover";

import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const formSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  amount: z.number().positive().min(0.01),
  percentage: z.number().min(0).max(100).multipleOf(0.01),
  dueDate: z.date().optional(),
  notes: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TaxRecordFormProps {
  record?: {
    id: string;
    year: number;
    amount: number;
    percentage: number;
    dueDate: Date | null;
    notes: string | null;
  };
  propertyId?: string;
  onSuccess?: () => void;
}

export default function TaxRecordForm({
  record,
  propertyId,
  onSuccess,
}: TaxRecordFormProps) {
  const t = useTranslations("taxRecords");
  const { toast } = useToast();
  const isEditing = !!record;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: record?.year ?? new Date().getFullYear(),
      amount: record?.amount ?? 0,
      percentage: record?.percentage ?? 0,
      dueDate: record?.dueDate ?? undefined,
      notes: record?.notes ?? "",
    },
  });

  const createMutation = api.taxRecord.create.useMutation({
    onSuccess: () => {
      form.reset();
      onSuccess?.();
      toast({
        title: t("success.create"),
        description: t("success.createDescription"),
      });
    },
    onError: (error) => {
      toast({
        title: t("error.create"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = api.taxRecord.update.useMutation({
    onSuccess: () => {
      onSuccess?.();
      toast({
        title: t("success.update"),
        description: t("success.updateDescription"),
      });
    },
    onError: (error) => {
      toast({
        title: t("error.update"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    if (isEditing) {
      updateMutation.mutate({
        id: record.id,
        ...values,
      });
    } else {
      if (!propertyId) {
        toast({
          title: t("error.missingProperty"),
          description: t("error.missingPropertyDescription"),
          variant: "destructive",
        });
        return;
      }
      createMutation.mutate({
        ...values,
        propertyId,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("year")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={2000}
                  max={2100}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("amount")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("percentage")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("dueDate")}</FormLabel>
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
                        format(field.value, "PPP")
                      ) : (
                        <span>{t("pickDate")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("notes")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {isEditing ? t("update") : t("create")}
        </Button>
      </form>
    </Form>
  );
}
