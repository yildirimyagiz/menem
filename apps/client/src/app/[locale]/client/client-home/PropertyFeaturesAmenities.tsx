import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Checkbox } from "@reservatior/ui/checkbox";
import { FormField, FormItem, FormMessage } from "@reservatior/ui/form";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@reservatior/ui/select";
import { useTranslations } from 'next-intl';
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "./propertySchema";

interface PropertyFeaturesAmenitiesProps {
  form: UseFormReturn<PropertyFormValues>;
}

const PropertyFeaturesAmenities: React.FC<PropertyFeaturesAmenitiesProps> = ({ form }) => {
  const t = useTranslations('clientHome.property');
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t('featuresAmenities.title', { defaultValue: 'Features & Amenities' })}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <Label>{t('featuresAmenities.features', { defaultValue: 'Property Features' })}</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={field.value?.includes('FURNISHED')} 
                    onCheckedChange={(checked) => {
                      const currentFeatures = field.value || [];
                      if (checked) {
                        field.onChange([...currentFeatures, 'FURNISHED']);
                      } else {
                        field.onChange(currentFeatures.filter(f => f !== 'FURNISHED'));
                      }
                    }} 
                    id="furnished" 
                  />
                  <Label htmlFor="furnished">{t('featuresAmenities.furnished', { defaultValue: 'Furnished' })}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={field.value?.includes('PET_FRIENDLY')} 
                    onCheckedChange={(checked) => {
                      const currentFeatures = field.value || [];
                      if (checked) {
                        field.onChange([...currentFeatures, 'PET_FRIENDLY']);
                      } else {
                        field.onChange(currentFeatures.filter(f => f !== 'PET_FRIENDLY'));
                      }
                    }} 
                    id="petFriendly" 
                  />
                  <Label htmlFor="petFriendly">{t('featuresAmenities.petFriendly', { defaultValue: 'Pet Friendly' })}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={field.value?.includes('SMART_HOME')} 
                    onCheckedChange={(checked) => {
                      const currentFeatures = field.value || [];
                      if (checked) {
                        field.onChange([...currentFeatures, 'SMART_HOME']);
                      } else {
                        field.onChange(currentFeatures.filter(f => f !== 'SMART_HOME'));
                      }
                    }} 
                    id="smartHome" 
                  />
                  <Label htmlFor="smartHome">{t('featuresAmenities.smartHome', { defaultValue: 'Smart Home' })}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={field.value?.includes('ENERGY_EFFICIENT')} 
                    onCheckedChange={(checked) => {
                      const currentFeatures = field.value || [];
                      if (checked) {
                        field.onChange([...currentFeatures, 'ENERGY_EFFICIENT']);
                      } else {
                        field.onChange(currentFeatures.filter(f => f !== 'ENERGY_EFFICIENT'));
                      }
                    }} 
                    id="energyEfficient" 
                  />
                  <Label htmlFor="energyEfficient">{t('featuresAmenities.energyEfficient', { defaultValue: 'Energy Efficient' })}</Label>
                </div>
              </div>
              <FormMessage>{form.formState.errors.features?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <Label>{t('featuresAmenities.amenities', { defaultValue: 'Amenities' })}</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={field.value?.includes('POOL')} 
                    onCheckedChange={(checked) => {
                      const currentAmenities = field.value || [];
                      if (checked) {
                        field.onChange([...currentAmenities, 'POOL']);
                      } else {
                        field.onChange(currentAmenities.filter(a => a !== 'POOL'));
                      }
                    }} 
                    id="pool" 
                  />
                  <Label htmlFor="pool">{t('featuresAmenities.pool', { defaultValue: 'Pool' })}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={field.value?.includes('GYM')} 
                    onCheckedChange={(checked) => {
                      const currentAmenities = field.value || [];
                      if (checked) {
                        field.onChange([...currentAmenities, 'GYM']);
                      } else {
                        field.onChange(currentAmenities.filter(a => a !== 'GYM'));
                      }
                    }} 
                    id="gym" 
                  />
                  <Label htmlFor="gym">{t('featuresAmenities.gym', { defaultValue: 'Gym' })}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={field.value?.includes('PARKING')} 
                    onCheckedChange={(checked) => {
                      const currentAmenities = field.value || [];
                      if (checked) {
                        field.onChange([...currentAmenities, 'PARKING']);
                      } else {
                        field.onChange(currentAmenities.filter(a => a !== 'PARKING'));
                      }
                    }} 
                    id="parking" 
                  />
                  <Label htmlFor="parking">{t('featuresAmenities.parking', { defaultValue: 'Parking' })}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={field.value?.includes('ELEVATOR')} 
                    onCheckedChange={(checked) => {
                      const currentAmenities = field.value || [];
                      if (checked) {
                        field.onChange([...currentAmenities, 'ELEVATOR']);
                      } else {
                        field.onChange(currentAmenities.filter(a => a !== 'ELEVATOR'));
                      }
                    }} 
                    id="elevator" 
                  />
                  <Label htmlFor="elevator">{t('featuresAmenities.elevator', { defaultValue: 'Elevator' })}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={field.value?.includes('AIR_CONDITIONING')} 
                    onCheckedChange={(checked) => {
                      const currentAmenities = field.value || [];
                      if (checked) {
                        field.onChange([...currentAmenities, 'AIR_CONDITIONING']);
                      } else {
                        field.onChange(currentAmenities.filter(a => a !== 'AIR_CONDITIONING'));
                      }
                    }} 
                    id="airConditioning" 
                  />
                  <Label htmlFor="airConditioning">{t('featuresAmenities.airConditioning', { defaultValue: 'Air Conditioning' })}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={field.value?.includes('WIFI')} 
                    onCheckedChange={(checked) => {
                      const currentAmenities = field.value || [];
                      if (checked) {
                        field.onChange([...currentAmenities, 'WIFI']);
                      } else {
                        field.onChange(currentAmenities.filter(a => a !== 'WIFI'));
                      }
                    }} 
                    id="wifi" 
                  />
                  <Label htmlFor="wifi">{t('featuresAmenities.wifi', { defaultValue: 'WiFi' })}</Label>
                </div>
              </div>
              <FormMessage>{form.formState.errors.amenities?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parkingSpaces"
          render={({ field }) => (
            <FormItem>
              <Label>{t('featuresAmenities.parkingSpaces', { defaultValue: 'Parking Spaces' })}</Label>
              <Input type="number" {...field} placeholder={t('featuresAmenities.parkingSpacesPlaceholder', { defaultValue: 'Number of parking spaces' })} />
              <FormMessage>{form.formState.errors.parkingSpaces?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="heatingType"
          render={({ field }) => (
            <FormItem>
              <Label>{t('featuresAmenities.heatingType', { defaultValue: 'Heating Type' })}</Label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={t('featuresAmenities.heatingTypePlaceholder', { defaultValue: 'Select heating type' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FORCED_AIR">{t('featuresAmenities.forcedAir', { defaultValue: 'Forced Air' })}</SelectItem>
                  <SelectItem value="RADIANT">{t('featuresAmenities.radiant', { defaultValue: 'Radiant' })}</SelectItem>
                  <SelectItem value="ELECTRIC">{t('featuresAmenities.electric', { defaultValue: 'Electric' })}</SelectItem>
                  <SelectItem value="GAS">{t('featuresAmenities.gas', { defaultValue: 'Gas' })}</SelectItem>
                  <SelectItem value="HEAT_PUMP">{t('featuresAmenities.heatPump', { defaultValue: 'Heat Pump' })}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage>{form.formState.errors.heatingType?.message}</FormMessage>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyFeaturesAmenities;
