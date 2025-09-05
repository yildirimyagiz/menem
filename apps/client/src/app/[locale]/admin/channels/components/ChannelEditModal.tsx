"use client";

import React from "react";
import type { ChannelCategory, ChannelType } from "./columns";

const CATEGORY_OPTIONS: { value: ChannelCategory; label: string }[] = [
  { value: "AGENT", label: "channels.category.AGENT" },
  { value: "AGENCY", label: "channels.category.AGENCY" },
  { value: "TENANT", label: "channels.category.TENANT" },
  { value: "PROPERTY", label: "channels.category.PROPERTY" },
  { value: "PAYMENT", label: "channels.category.PAYMENT" },
  { value: "SYSTEM", label: "channels.category.SYSTEM" },
  { value: "REPORT", label: "channels.category.REPORT" },
  { value: "RESERVATION", label: "channels.category.RESERVATION" },
  { value: "TASK", label: "channels.category.TASK" },
  { value: "TICKET", label: "channels.category.TICKET" },
];

const TYPE_OPTIONS: { value: ChannelType; label: string }[] = [
  { value: "PUBLIC", label: "channels.type.PUBLIC" },
  { value: "PRIVATE", label: "channels.type.PRIVATE" },
  { value: "GROUP", label: "channels.type.GROUP" },
];

interface ChannelEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  onSuccess: () => void;
}

const ChannelEditModal: React.FC<ChannelEditModalProps> = ({
  isOpen,
  onClose,
  channelId,
  onSuccess,
}) => {
  const [formData, setFormData] = React.useState<{
    name: string;
    description: string;
    category: ChannelCategory;
    type: ChannelType;
  }>({
    name: "",
    description: "",
    category: "AGENT",
    type: "PUBLIC",
  });
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <form onSubmit={(e) => { e.preventDefault(); onSuccess(); }}>
          <h2>{"channels.form.editTitle"}</h2>
          <p>{"channels.form.editDescription"}</p>
          <label htmlFor="name">{"channels.form.name"}</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <label htmlFor="description">{"channels.form.description"}</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
          <label htmlFor="category">{"channels.form.category"}</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value as ChannelCategory })}
          >
            {CATEGORY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <label htmlFor="type">{"channels.form.type"}</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value as ChannelType })}
          >
            {TYPE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button type="submit">{"channels.form.saveButton"}</button>
          <button type="button" onClick={onClose}>{"channels.form.cancelButton"}</button>
        </form>
      </div>
    </div>
  );
};

export default ChannelEditModal;
