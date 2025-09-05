"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Textarea } from "@reservatior/ui/textarea";
import type {
  CreateComplianceRecordInput,
  UpdateComplianceRecordInput,
} from "@reservatior/validators";
import { CreateComplianceRecordSchema } from "@reservatior/validators";

import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface ComplianceRecordFormProps {
  record?: UpdateComplianceRecordInput;
  entityId?: string;
  entityType?: string;
  propertyId?: string;
  agentId?: string;
  agencyId?: string;
  onSuccess?: () => void;
}

const complianceTypes = [
  "DATA_PROTECTION",
  "FINANCIAL_REGULATION",
  "PROPERTY_LAW",
  "TAX_COMPLIANCE",
  "LICENSE_VERIFICATION",
  "INSURANCE",
  "PROFESSIONAL_STANDARDS",
] as const;

const statusTypes = ["PENDING", "APPROVED", "REJECTED"] as const;

export default function ComplianceRecordForm({
  record,
  entityId,
  entityType,
  propertyId,
  agentId,
  agencyId,
  onSuccess,
}: ComplianceRecordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateComplianceRecordInput>({
    resolver: zodResolver(CreateComplianceRecordSchema),
    defaultValues: {
      entityId: entityId ?? record?.id ?? "",
      entityType: entityType ?? "",
      type: "DATA_PROTECTION",
      status: "PENDING",
      isVerified: false,
      propertyId,
      agentId,
      agencyId,
      documentUrl: record?.documentUrl ?? "",
      expiryDate: record?.expiryDate ? new Date(record.expiryDate) : undefined,
      notes: record?.notes ?? "",
    },
  });

  const createMutation = api.complianceRecord.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Compliance record created successfully",
      });
      onSuccess?.();
    },
    onError: (error: { message: any; }) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = api.complianceRecord.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Compliance record updated successfully",
      });
      onSuccess?.();
    },
    onError: (error: { message: any; }) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CreateComplianceRecordInput) => {
    try {
      setIsSubmitting(true);
      if (record?.id) {
        await updateMutation.mutateAsync({
          id: record.id,
          ...data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error("Failed to save compliance record:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select compliance type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {complianceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase(),
                        )
                        .join(" ")}
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusTypes.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
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
          name="documentUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://example.com/document.pdf"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
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
                    disabled={(date) => date < new Date()}
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
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter any additional notes..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : record ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
