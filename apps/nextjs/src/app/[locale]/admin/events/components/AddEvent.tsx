"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

import type { CreateEventInput } from "@acme/validators";
import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { EventType } from "@acme/validators";

import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const AddEvent: React.FC<{
  onClose: () => void;
  onEventAdded: () => void;
}> = ({ onClose, onEventAdded }) => {
  const [formData, setFormData] = useState<CreateEventInput>({
    propertyId: "",
    title: "",
    description: "",
    eventType: EventType.options[0],
    scheduledAt: new Date(),
    duration: 60, // Default duration in minutes
    createdById: "",
    attendees: [],
    isActive: true,
  });

  const utils = api.useUtils();

  const createEvent = api.event.create.useMutation({
    onSuccess: async () => {
      await utils.event.all.invalidate();
      toast.success("Event created successfully!");
      onEventAdded();
      resetForm();
      setTimeout(onClose, 2000);
    },
    onError: (err: unknown) => {
      console.error("Error creating event:", err);
      toast.error("Failed to create event");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      propertyId: "",
      description: "",
      eventType: EventType.options[0],
      scheduledAt: new Date(),
      duration: 60,
      createdById: "",
      attendees: [],
      isActive: true,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const key = name as keyof CreateEventInput;

    setFormData((prev) => {
      let processedValue: any = value;

      if (type === "number") {
        processedValue = value === "" ? undefined : Number(value);
      } else if (type === "checkbox") {
        processedValue = (e.target as HTMLInputElement).checked;
      } else if (key === "scheduledAt") {
        processedValue = new Date(value);
      } else if (
        value === "" &&
        (key === "description" || key === "createdById")
      ) {
        // For optional string fields, set to undefined if empty.
        // Duration is handled by type="number". Attendees by its own handler.
        processedValue = undefined;
      }

      return { ...prev, [key]: processedValue };
    });
  };

  // For simplicity, if 'attendees' is meant to be a comma-separated string of IDs:
  const handleAttendeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      attendees: value
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id !== ""),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEvent.mutate(formData);
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Add New Event</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close form"
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="rounded-md border p-2"
        />

        <Input
          name="propertyId"
          placeholder="Property ID"
          value={formData.propertyId}
          onChange={handleInputChange}
          required
          className="rounded-md border p-2"
        />

        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description ?? ""}
          onChange={handleInputChange}
          className="w-full rounded-md border p-2"
          rows={3}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Type
          </label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleInputChange}
            className="w-full rounded-md border p-2"
          >
            {EventType.options.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Scheduled At
            </label>
            <Input
              name="scheduledAt"
              type="datetime-local"
              value={formData.scheduledAt.toISOString().slice(0, 16)}
              onChange={handleInputChange}
              required
              className="rounded-md border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <Input
              name="duration"
              type="number"
              placeholder="e.g., 60"
              value={formData.duration ?? ""}
              onChange={handleInputChange}
              className="rounded-md border p-2"
            />
          </div>
        </div>

        <Input
          name="createdById"
          placeholder="Creator User ID (Optional)"
          value={formData.createdById ?? ""}
          onChange={handleInputChange}
          className="rounded-md border p-2"
        />

        <Input
          name="attendees"
          placeholder="Attendee User IDs (comma-separated)"
          value={formData.attendees?.join(", ") ?? ""}
          onChange={handleAttendeesChange}
          className="rounded-md border p-2"
        />

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive ?? true} // Default to true if undefined
              onChange={handleInputChange}
            />
            Is Active
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
          disabled={createEvent.isPending}
        >
          {createEvent.isPending ? "Adding..." : "Add Event"}
        </Button>
      </form>
    </div>
  );
};

export default AddEvent;
