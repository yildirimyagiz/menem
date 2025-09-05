import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Textarea } from "@reservatior/ui/textarea";

import type { TaskPriority, TaskStatus, TaskType } from "~/utils/interfaces";

export interface TaskFormProps {
  title: string;
  description: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  type?: TaskType;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (e: React.FormEvent) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority) => void;
  onStatusChange: (value: TaskStatus) => void;
  onTypeChange: (value: TaskType) => void;
}

export function TaskForm({
  title,
  description,
  priority,
  status,
  type,
  isSubmitting,
  submitLabel,
  onSubmit,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onStatusChange,
  onTypeChange,
}: TaskFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Title"
        required
      />
      <Textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Description"
      />
      <Select
        value={priority}
        onValueChange={(value) => onPriorityChange(value as TaskPriority)}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="LOW">Low</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
          <SelectItem value="URGENT">Urgent</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={status}
        onValueChange={(value) => onStatusChange(value as TaskStatus)}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TODO">To Do</SelectItem>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={type}
        onValueChange={(value) => onTypeChange(value as TaskType)}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PROPERTY_MAINTENANCE">
            Property Maintenance
          </SelectItem>
          <SelectItem value="LISTING_REVIEW">Property Review</SelectItem>
          <SelectItem value="CLIENT_FOLLOW_UP">Client Follow Up</SelectItem>
          <SelectItem value="DOCUMENT_PROCESSING">
            Document Processing
          </SelectItem>
          <SelectItem value="MARKETING_TASK">Marketing Task</SelectItem>
          <SelectItem value="SALES_ACTIVITY">Sales Activity</SelectItem>
          <SelectItem value="COMPLIANCE_CHECK">Compliance Check</SelectItem>
          <SelectItem value="COMMUNICATION_FOLLOW_UP">
            Communication Follow Up
          </SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" disabled={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
