"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { UpdateMLConfigurationInput } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import { Switch } from "@reservatior/ui/switch";
import { UpdateMLConfigurationSchema } from "@reservatior/validators";

import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface MLSettingsFormProps {
  defaultValues: UpdateMLConfigurationInput;
  t: ReturnType<typeof import('next-intl').useTranslations>;
}

export function MLSettingsForm({ defaultValues, t }: MLSettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<UpdateMLConfigurationInput>({
    resolver: zodResolver(UpdateMLConfigurationSchema),
    defaultValues,
  });

  const utils = api.useUtils();
  const { mutate: updateMLConfig, isPending } = api.mlConfig.update.useMutation(
    {
      onSuccess: () => {
        toast.success("ML settings updated!");
        void utils.mlConfig.byId.invalidate();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update ML settings.");
      },
    },
  );

  const onSubmit = (values: UpdateMLConfigurationInput) => {
    updateMLConfig(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Feature Toggles */}
      <div className="grid grid-cols-1 gap-4 p-4 border rounded-md mb-4">
        <label className="flex items-center gap-2">
          <span>{t('enableMLFeatures.label', { defaultValue: 'Enable ML Features' })}</span>
          <Switch
            {...register("enableMLFeatures")}
            defaultChecked={defaultValues.enableMLFeatures}
          />
        </label>
        {errors.enableMLFeatures && (
          <p className="text-red-500">{errors.enableMLFeatures.message as string}</p>
        )}
        <label className="flex items-center gap-2">
          <span>{t('enableAutoTagging.label', { defaultValue: 'Enable Auto Tagging' })}</span>
          <Switch
            {...register("enableAutoTagging")}
            defaultChecked={defaultValues.enableAutoTagging}
          />
        </label>
        {errors.enableAutoTagging && (
          <p className="text-red-500">{errors.enableAutoTagging.message}</p>
        )}
      </div>

      {/* Numeric Settings */}
      <div className="grid grid-cols-1 gap-4 p-4 border rounded-md mb-4">
        <label>
          <span>{t('qualityThreshold.label', { defaultValue: 'Quality Threshold (0-1)' })}</span>
          <Input
            type="number"
            step="0.01"
            min={0}
            max={1}
            {...register("qualityThreshold", { valueAsNumber: true })}
            defaultValue={defaultValues.qualityThreshold}
            placeholder={t('qualityThreshold.placeholder', { defaultValue: 'e.g., 0.8' })}
          />
        </label>
        {errors.qualityThreshold && (
          <p className="text-red-500">{errors.qualityThreshold.message}</p>
        )}
        <label>
          <span>{t('maxTagsPerImage.label', { defaultValue: 'Max Tags Per Image' })}</span>
          <Input
            type="number"
            min={1}
            {...register("maxTagsPerImage", { valueAsNumber: true })}
            defaultValue={defaultValues.maxTagsPerImage}
            placeholder={t('maxTagsPerImage.placeholder', { defaultValue: 'e.g., 5' })}
          />
        </label>
        {errors.maxTagsPerImage && (
          <p className="text-red-500">{errors.maxTagsPerImage.message as string}</p>
        )}
      </div>

      {/* Mode & Models */}
      <div className="grid grid-cols-1 gap-4 p-4 border rounded-md mb-4">
        <label>
          <span>{t('analysisMode.label', { defaultValue: 'Analysis Mode' })}</span>
          <Input
            type="text"
            {...register("analysisMode")}
            defaultValue={defaultValues.analysisMode}
            placeholder={t('analysisMode.placeholder', { defaultValue: 'e.g., standard' })}
          />
        </label>
        {errors.analysisMode && (
          <p className="text-red-500">{errors.analysisMode.message as string}</p>
        )}
        <label>
          <span>{t('allowedModels.label', { defaultValue: 'Allowed Models (comma separated)' })}</span>
          <Input
            type="text"
            {...register("allowedModels", {
              setValueAs: (v: string) => v.split(',').map((m: string) => m.trim()).filter(Boolean),
            })}
            defaultValue={defaultValues.allowedModels?.join(', ')}
            placeholder={t('allowedModels.placeholder', { defaultValue: 'e.g., default, advanced' })}
          />
        </label>
        {errors.allowedModels && (
          <p className="text-red-500">{errors.allowedModels.message as string}</p>
        )}
      </div>

      {/* Custom Settings */}
      <div className="grid grid-cols-1 gap-4 p-4 border rounded-md mb-4">
        <label>
          <span>{t('customSettings.label', { defaultValue: 'Custom Settings (JSON)' })}</span>
          <textarea
            className="w-full border rounded p-2 min-h-[70px] font-mono"
            {...register("customSettings")}
            defaultValue={defaultValues.customSettings ? JSON.stringify(defaultValues.customSettings, null, 2) : ''}
            placeholder={t('customSettings.placeholder', { defaultValue: '{ "key": "value" }' })}
          />
        </label>
        {errors.customSettings && (
          <p className="text-red-500">{errors.customSettings.message as string}</p>
        )}
      </div>

      {/* Audit Fields (read-only) */}
      <div className="grid grid-cols-2 gap-4 p-4 border rounded-md mb-4 bg-gray-50">
        <label>
          <span>{t('updatedBy.label', { defaultValue: 'Updated By' })}</span>
          <Input
            type="text"
            value={defaultValues.updatedBy ?? ''}
            readOnly
            disabled
          />
        </label>
        <label>
          <span>{t('version.label', { defaultValue: 'Version' })}</span>
          <Input
            type="number"
            value={defaultValues.version}
            readOnly
            disabled
          />
        </label>
      </div>

      <Button type="submit" disabled={isSubmitting || isPending}>
        {isSubmitting || isPending
          ? t('saving', { defaultValue: 'Saving...' })
          : t('save', { defaultValue: 'Save Settings' })}
      </Button>
    </form>
  );
}
