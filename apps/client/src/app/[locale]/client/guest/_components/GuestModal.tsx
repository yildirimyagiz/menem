"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarIcon,
  CheckIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Button } from "@reservatior/ui/button";
import { Calendar } from "@reservatior/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@reservatior/ui/dialog";
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
import { Textarea } from "@reservatior/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@reservatior/ui/tooltip";

import type { Guest } from "~/utils/interfaces";
import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  guest?: Guest | null;
}

const GuestModal: React.FC<GuestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  guest,
}) => {
  const t = useTranslations();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    guest?.birthDate ? new Date(guest.birthDate) : undefined,
  );
  const [imagePreview, setImagePreview] = useState<string>("");

  // Enhanced API connection with optimistic updates
  const utils = api.useUtils();

  const createGuestMutation = api.guest.create.useMutation({
    onSuccess: () => {
      toast({
        title: t("guestCreatedTitle"),
        description: t("guestCreatedDescription"),
      });
      onSuccess();
      onClose();
      // Invalidate and refetch guest list
      utils.guest.all.invalidate();
    },
    onError: (error) => {
      toast({
        title: t("creationFailedTitle"),
        description: error.message || t("creationFailedDescription"),
        variant: "destructive",
      });
    },
  });

  const updateGuestMutation = api.guest.update.useMutation({
    onSuccess: () => {
      toast({
        title: t("guestUpdatedTitle"),
        description: t("guestUpdatedDescription"),
      });
      onSuccess();
      onClose();
      // Invalidate and refetch guest list
      utils.guest.all.invalidate();
    },
    onError: (error) => {
      toast({
        title: t("updateFailedTitle"),
        description: error.message || t("updateFailedDescription"),
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    defaultValues: {
      name: guest?.name ?? "",
      email: guest?.email ?? "",
      phone: guest?.phone ?? "",
      nationality: guest?.nationality ?? "",
      passportNumber: guest?.passportNumber ?? "",
      gender: guest?.gender ?? "MALE",
      birthDate: guest?.birthDate ? new Date(guest.birthDate) : undefined,
      address: guest?.address ?? "",
      city: guest?.city ?? "",
      country: guest?.country ?? "",
      zipCode: guest?.zipCode ?? "",
      image: guest?.image ?? "",
    },
  });

  useEffect(() => {
    if (guest) {
      form.reset({
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        nationality: guest.nationality,
        passportNumber: guest.passportNumber,
        gender: guest.gender,
        birthDate: new Date(guest.birthDate),
        address: guest.address,
        city: guest.city,
        country: guest.country,
        zipCode: guest.zipCode,
        image: guest.image ?? "",
      });
      setDate(new Date(guest.birthDate));
      setImagePreview(guest.image ?? "");
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        nationality: "",
        passportNumber: "",
        gender: "MALE",
        birthDate: undefined,
        address: "",
        city: "",
        country: "",
        zipCode: "",
        image: "",
      });
      setDate(undefined);
      setImagePreview("");
    }
  }, [guest, form]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageChange = (url: string) => {
    setImagePreview(url);
    form.setValue("image", url);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const guestData = {
        ...data,
        birthDate: date ?? new Date(),
      };

      if (guest) {
        await updateGuestMutation.mutateAsync({
          id: guest.id,
          ...guestData,
        });
      } else {
        await createGuestMutation.mutateAsync(guestData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      setImagePreview("");
      onClose();
    }
  };

  const currentName = form.watch("name");

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {guest ? t("editGuestTitle") : t("addNewGuestTitle")}
                </DialogTitle>
                <DialogDescription>
                  {guest
                    ? t("editGuestDescription")
                    : t("addNewGuestDescription")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Profile Image Preview */}
              {imagePreview && (
                <div className="flex justify-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24 shadow-lg ring-4 ring-white dark:ring-gray-800">
                      <AvatarImage src={imagePreview} alt="Profile preview" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-semibold text-white">
                        {getInitials(currentName || t("guest"))}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleImageChange("")}
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 p-0 text-white hover:bg-red-600"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t("basicInformation")}
                  </h3>
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: t("nameRequired") }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("fullName")} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("enterFullName")}
                            {...field}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    rules={{
                      required: t("emailRequired"),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t("invalidEmailAddress"),
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("email")} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t("enterEmailAddress")}
                            {...field}
                            className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    rules={{ required: t("phoneRequired") }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("phoneNumber")} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("enterPhoneNumber")}
                            {...field}
                            className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("gender")} *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-pink-500">
                              <SelectValue placeholder={t("selectGender")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">{t("male")}</SelectItem>
                            <SelectItem value="FEMALE">{t("female")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-sm font-medium">
                          {t("birthDate")} *
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-teal-500",
                                  !date && "text-muted-foreground",
                                )}
                              >
                                {date ? (
                                  format(date, "PPP")
                                ) : (
                                  <span>{t("pickADate")}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(newDate) => {
                                setDate(newDate);
                                field.onChange(newDate);
                              }}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
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
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("profileImageUrl")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            {...field}
                            onChange={(e) => handleImageChange(e.target.value)}
                            className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                          />
                        </FormControl>
                        <FormDescription>
                          {t("profileImageUrlDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Travel Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-orange-500 to-red-600"></div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t("travelInformation")}
                  </h3>
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-orange-500 to-red-600"></div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="nationality"
                    rules={{ required: t("nationalityRequired") }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("nationality")} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("enterNationality")}
                            {...field}
                            className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="passportNumber"
                    rules={{ required: t("passportRequired") }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("passportNumber")} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("enterPassportNumber")}
                            {...field}
                            className="font-mono transition-all duration-200 focus:ring-2 focus:ring-red-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t("addressInformation")}
                  </h3>
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  rules={{ required: t("addressRequired") }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        {t("address")} *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("enterFullAddress")}
                          className="resize-none transition-all duration-200 focus:ring-2 focus:ring-green-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="city"
                    rules={{ required: t("cityRequired") }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("city")} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("enterCity")}
                            {...field}
                            className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    rules={{ required: t("countryRequired") }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("country")} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("enterCountry")}
                            {...field}
                            className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zipCode"
                    rules={{ required: t("zipCodeRequired") }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t("zipCode")} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("enterZipCode")}
                            {...field}
                            className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 border-t pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="transition-all duration-200 hover:bg-gray-50"
                >
                  <XMarkIcon className="mr-2 h-4 w-4" />
                  {t("cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-200 hover:from-blue-600 hover:to-purple-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      {guest ? t("updating") : t("creating")}
                    </>
                  ) : (
                    <>
                      <CheckIcon className="mr-2 h-4 w-4" />
                      {guest ? t("updateGuest") : t("createGuest")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default GuestModal;
