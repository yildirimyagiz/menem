"use client";

import React, { useState } from "react";

interface FacilityEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  facilityId: string;
}

const FacilityEditModal: React.FC<FacilityEditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  facilityId,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    onSuccess();
    setFormData({ name: "", description: "" });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Edit Facility (ID: {facilityId})</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={formData.name}
            onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
          />
          <input
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
          />
          <button type="submit">Save</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FacilityEditModal; 