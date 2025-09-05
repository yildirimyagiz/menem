import React, { useState } from "react";

import type { Event } from "~/utils/types";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import EventEditSidebar from "./EventSidebar";
import EventTable from "./EventTable";

const EventList: React.FC = () => {
  const utils = api.useUtils();
  const {
    data: events,
    isLoading,
    error,
  } = api.event.all.useQuery({
    page: 1,
    limit: 10,
  });

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditSidebar, setShowEditSidebar] = useState(false);

  const deleteMutation = api.event.delete.useMutation({
    onSuccess: async () => {
      await utils.event.all.invalidate();
      toast.success("Event deleted successfully!");
    },
    onError: (error) => {
      toast.error(
        error.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to delete this event"
          : "Failed to delete event",
      );
    },
  });

  const updateMutation = api.event.update.useMutation({
    onSuccess: async () => {
      await utils.event.all.invalidate();
      toast.success("Event updated successfully!");
      setShowEditSidebar(false);
    },
    onError: () => {
      toast.error("Failed to update event");
    },
  });

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setShowEditSidebar(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(eventId);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleUpdateEvent = async (updatedEvent: Partial<Event>) => {
    if (!selectedEvent?.id) return;

    try {
      await updateMutation.mutateAsync({
        params: {
          eventId: selectedEvent.id,
        },
        body: {
          title: updatedEvent.title ?? undefined,
          description: updatedEvent.description ?? undefined,
          status: updatedEvent.status ?? undefined,
          locationId: updatedEvent.locationId ?? undefined,
          startTime: updatedEvent.startTime ?? undefined,
          endTime: updatedEvent.endTime ?? undefined,
          organizerAgencyId: updatedEvent.organizerAgencyId ?? undefined,
          organizerAgentId: updatedEvent.organizerAgentId ?? undefined,
          attendees: updatedEvent.attendees ?? undefined,
        },
      });
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setShowEditSidebar(false);
    setSelectedEvent(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div>Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading events: {error.message}
      </div>
    );
  }

  if (!events.length) {
    return <div className="p-4 text-gray-500">No events found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <EventTable
        events={events as unknown as Event[]}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showDetailsModal && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showEditSidebar && selectedEvent && (
        <EventEditSidebar
          selectedEvent={selectedEvent}
          editMode={true}
          editedEvent={selectedEvent}
          closeSidebar={handleCloseModals}
          handleEdit={handleCloseModals}
          handleCancel={handleCloseModals}
          handleInputChange={async <K extends keyof Event>(
            field: K,
            value: Event[K],
          ) => {
            await handleUpdateEvent({ [field]: value });
          }}
          handleCloseSidebar={function (): void {
            throw new Error("Function not implemented.");
          }}
          handleUpdateEvent={function (
            updatedEvent: Partial<Event>,
          ): Promise<void> {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </div>
  );
};

export default EventList;
