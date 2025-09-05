import { useTranslations } from 'next-intl';
import React from "react";
import type { UseFormReturn } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { FormField, FormItem, FormMessage } from "@reservatior/ui/form";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";

import type { PropertyFormValues } from "./propertySchema";

interface PropertyLocationProps {
  form: UseFormReturn<PropertyFormValues>;
  coordinates: { lat: number; lng: number } | null;
  setCoordinates: (coords: { lat: number; lng: number }) => void;
}

const PropertyLocation: React.FC<PropertyLocationProps> = ({
  form,
  coordinates,
  setCoordinates,
}) => {
  const t = useTranslations('clientHome.property');
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t('location.title', { defaultValue: 'Property Location' })}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="Location.address"
          render={({ field }) => (
            <FormItem>
              <Label>{t('location.address', { defaultValue: 'Address' })}</Label>
              <Input {...field} placeholder={t('location.addressPlaceholder', { defaultValue: 'Street Address' })} />
              <FormMessage>{form.formState.errors.Location?.address?.message}</FormMessage>
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="Location.city"
            render={({ field }) => (
              <FormItem>
                <Label>{t('location.city', { defaultValue: 'City' })}</Label>
                <Input {...field} placeholder={t('location.cityPlaceholder', { defaultValue: 'City' })} />
                <FormMessage>{form.formState.errors.Location?.city?.message}</FormMessage>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="Location.country"
            render={({ field }) => (
              <FormItem>
                <Label>{t('location.country', { defaultValue: 'Country' })}</Label>
                <Input {...field} placeholder={t('location.countryPlaceholder', { defaultValue: 'Country' })} />
                <FormMessage>{form.formState.errors.Location?.country?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="Location.postalCode"
          render={({ field }) => (
            <FormItem>
              <Label>{t('location.postalCode', { defaultValue: 'Postal Code' })}</Label>
              <Input {...field} placeholder={t('location.postalCodePlaceholder', { defaultValue: 'Postal Code' })} />
              <FormMessage>{form.formState.errors.Location?.postalCode?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Location.district"
          render={({ field }) => (
            <FormItem>
              <Label>{t('location.district', { defaultValue: 'District' })}</Label>
              <Input {...field} placeholder={t('location.districtPlaceholder', { defaultValue: 'District (Optional)' })} />
              <FormMessage>{form.formState.errors.Location?.district?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* Map integration can be added here */}
        <div>
          <Label>{t('location.coordinates', { defaultValue: 'Coordinates' })}</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={t('location.latitudePlaceholder', { defaultValue: 'Latitude' })}
              value={coordinates?.lat ?? ""}
              onChange={(e) =>
                setCoordinates({
                  lat: Number(e.target.value),
                  lng: coordinates?.lng ?? 0,
                })
              }
            />
            <Input
              type="number"
              placeholder={t('location.longitudePlaceholder', { defaultValue: 'Longitude' })}
              value={coordinates?.lng ?? ""}
              onChange={(e) =>
                setCoordinates({
                  lat: coordinates?.lat ?? 0,
                  lng: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyLocation;
