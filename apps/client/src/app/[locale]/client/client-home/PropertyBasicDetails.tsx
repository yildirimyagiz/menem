import { useTranslations } from 'next-intl';
import React from "react";
import type { UseFormReturn } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { FormField, FormItem, FormMessage } from "@reservatior/ui/form";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@reservatior/ui/select";
import { Textarea } from "@reservatior/ui/textarea";

import type { PropertyFormValues } from "./propertySchema";

interface PropertyBasicDetailsProps {
  form: UseFormReturn<PropertyFormValues>;
}

const PropertyBasicDetails: React.FC<PropertyBasicDetailsProps> = ({
  form,
}) => {
  const t = useTranslations('clientHome.property');
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t('basicDetails.title', { defaultValue: 'Property Basic Details' })}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <Label>{t('basicDetails.propertyTitle', { defaultValue: 'Property Title' })}</Label>
              <Input
                {...field}
                placeholder={t('basicDetails.titlePlaceholder', { defaultValue: 'e.g. Modern Downtown Apartment with City Views' })}
              />
              <FormMessage>{form.formState.errors.title?.message}</FormMessage>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <Label>{t('basicDetails.propertyType', { defaultValue: 'Property Type' })}</Label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={t('basicDetails.typePlaceholder', { defaultValue: 'Select property type' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APARTMENT">{t('basicDetails.apartment', { defaultValue: 'Apartment' })}</SelectItem>
                  <SelectItem value="HOUSE">{t('basicDetails.house', { defaultValue: 'House' })}</SelectItem>
                  <SelectItem value="VILLA">{t('basicDetails.villa', { defaultValue: 'Villa' })}</SelectItem>
                  <SelectItem value="CONDO">{t('basicDetails.condo', { defaultValue: 'Condo' })}</SelectItem>
                  <SelectItem value="TOWNHOUSE">{t('basicDetails.townhouse', { defaultValue: 'Townhouse' })}</SelectItem>
                  <SelectItem value="PENTHOUSE">{t('basicDetails.penthouse', { defaultValue: 'Penthouse' })}</SelectItem>
                  <SelectItem value="STUDIO">{t('basicDetails.studio', { defaultValue: 'Studio' })}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage>
                {form.formState.errors.propertyType?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <Label>{t('basicDetails.category', { defaultValue: 'Category' })}</Label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={t('basicDetails.categoryPlaceholder', { defaultValue: 'Select category' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESIDENTIAL">{t('basicDetails.residential', { defaultValue: 'Residential' })}</SelectItem>
                  <SelectItem value="COMMERCIAL">{t('basicDetails.commercial', { defaultValue: 'Commercial' })}</SelectItem>
                  <SelectItem value="LAND">{t('basicDetails.land', { defaultValue: 'Land' })}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage>
                {form.formState.errors.category?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <Label>{t('basicDetails.size', { defaultValue: 'Size (sq ft)' })}</Label>
              <Input type="number" {...field} />
              <FormMessage>
                {form.formState.errors.size?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem>
              <Label>{t('basicDetails.bedrooms', { defaultValue: 'Bedrooms' })}</Label>
              <Input type="number" {...field} />
              <FormMessage>{form.formState.errors.bedrooms?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <FormItem>
              <Label>{t('basicDetails.bathrooms', { defaultValue: 'Bathrooms' })}</Label>
              <Input type="number" {...field} />
              <FormMessage>
                {form.formState.errors.bathrooms?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yearBuilt"
          render={({ field }) => (
            <FormItem>
              <Label>{t('basicDetails.yearBuilt', { defaultValue: 'Year Built' })}</Label>
              <Input type="number" {...field} />
              <FormMessage>
                {form.formState.errors.yearBuilt?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Label>{t('basicDetails.propertyDescription', { defaultValue: 'Property Description' })}</Label>
              <Textarea
                {...field}
                placeholder={t('basicDetails.descriptionPlaceholder', { defaultValue: 'Describe your property in detail...' })}
              />
              <FormMessage>
                {form.formState.errors.description?.message}
              </FormMessage>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyBasicDetails;
