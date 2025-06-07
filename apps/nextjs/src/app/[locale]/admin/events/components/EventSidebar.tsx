import React, { useState } from "react";
import { Pencil, X } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { toast } from "@acme/ui/toast";

import type { Event } from "~/utils/types";
import { api } from "~/trpc/client/react";

interface EventSidebarProps {
  selectedEvent: Event | null;
  editMode: boolean;
  editedEvent: Event | null;
  handleEdit: () => void;
  handleCancel: () => void;
  handleInputChange: <K extends keyof Event>(
    field: K,
    value: Event[K],
  ) => Promise<void>;
  closeSidebar: () => void;
  handleCloseSidebar: () => void;
  handleUpdateEvent: (updatedEvent: Partial<Event>) => Promise<void>;
}

const EventSidebar: React.FC<EventSidebarProps> = ({
  selectedEvent,
  editMode,
  editedEvent,
  handleEdit,
  handleCancel,
  handleInputChange,
}) => {
  const utils = api.useUtils();

  const updateEventMutation = api.event.update.useMutation({
    onSuccess: async () => {
      await utils.event.all.invalidate();
      toast.success("Event updated successfully!");
      handleCancel();
    },
    onError: (error) => {
      console.error("Error updating event:", error);
      toast.error("Failed to update event. Please try again.");
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!selectedEvent?.id) {
      toast.error("Selected event or event ID is undefined");
      return;
    }

    if (!editedEvent?.title || !editedEvent.startTime || !editedEvent.endTime) {
      toast.error("Title, start time, and end time are required fields.");
      return;
    }

    setIsLoading(true);

    const updateData: Partial<Event> = {
      title: editedEvent.title,
      description: editedEvent.description,
      status: editedEvent.status,
      locationId: editedEvent.locationId,
      startTime: editedEvent.startTime,
      endTime: editedEvent.endTime,
      organizerAgencyId: editedEvent.organizerAgencyId,
      organizerAgentId: editedEvent.organizerAgentId,
      attendees: editedEvent.attendees,
    };

    try {
      await updateEventMutation.mutateAsync({
        params: { eventId: selectedEvent.id },
        body: updateData,
      });
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedEvent) return null;

  return (
    <aside
      className="w-96 overflow-y-auto rounded-l-3xl border-l bg-white p-6 shadow-lg"
      aria-label="Event details"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Event Details</h2>
        <div className="flex space-x-2">
          <Button onClick={handleEdit}>
            <Pencil size={16} />
            Edit
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            <X size={16} />
            Cancel
          </Button>
        </div>
      </div>

      <EditableField
        label="Title"
        value={editedEvent?.title ?? ""}
        editMode={editMode}
        onChange={(value) => handleInputChange("title", value)}
      />

      <EditableField
        label="Description"
        value={editedEvent?.description ?? ""}
        editMode={editMode}
        onChange={(value) => handleInputChange("description", value)}
      />

      <EditableField
        label="Status"
        value={editedEvent?.status ?? ""}
        editMode={editMode}
        onChange={(value) =>
          handleInputChange("status", value as Event["status"])
        }
      />

      <EditableField
        label="Location ID"
        value={editedEvent?.locationId ?? ""}
        editMode={editMode}
        onChange={(value) => handleInputChange("locationId", value)}
      />

      <EditableField
        label="Start Time"
        value={editedEvent?.startTime.toISOString().split("T")[0] ?? ""}
        editMode={editMode}
        onChange={(value) => handleInputChange("startTime", new Date(value))}
      />

      <EditableField
        label="End Time"
        value={editedEvent?.endTime.toISOString().split("T")[0] ?? ""}
        editMode={editMode}
        onChange={(value) => handleInputChange("endTime", new Date(value))}
      />

      <EditableField
        label="Organizer Agency ID"
        value={editedEvent?.organizerAgencyId ?? ""}
        editMode={editMode}
        onChange={(value) => handleInputChange("organizerAgencyId", value)}
      />

      <EditableField
        label="Organizer Agent ID"
        value={editedEvent?.organizerAgentId ?? ""}
        editMode={editMode}
        onChange={(value) => handleInputChange("organizerAgentId", value)}
      />

      <EditableField
        label="Attendees"
        value={editedEvent?.attendees?.toString() ?? "0"}
        editMode={editMode}
        onChange={(value) => handleInputChange("attendees", parseInt(value))}
      />

      <Button
        onClick={handleSave}
        disabled={isLoading || !editMode}
        className="mt-4"
        aria-label="Save Changes"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </aside>
  );
};

interface EditableFieldProps {
  label: string;
  value: string;
  editMode: boolean;
  onChange: (value: string) => void;
}

function EditableField({
  label,
  value,
  editMode,
  onChange,
}: EditableFieldProps) {
  return (
    <div className="mb-4">
      <h3 className="mb-1 font-medium text-gray-700">{label}</h3>
      {editMode ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 h-10 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-sm text-gray-900">{value || "N/A"}</p>
      )}
    </div>
  );
}

export default EventSidebar;
