"use client";

import React, { useState } from "react";

import { FacilityStatus, FacilityType } from "@reservatior/validators";

interface FacilityCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const FacilityCreateModal: React.FC<FacilityCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: FacilityType.options[0] as string,
    status: FacilityStatus.options[0] as string,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    onSuccess();
    setFormData({
      name: "",
      description: "",
      type: FacilityType.options[0] as string,
      status: FacilityStatus.options[0] as string,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Create Facility</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((f) => ({ ...f, name: e.target.value }))
            }
          />
          <input
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData((f) => ({ ...f, description: e.target.value }))
            }
          />
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData((f) => ({ ...f, type: e.target.value }))
            }
          >
            {FacilityType.options.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((f) => ({ ...f, status: e.target.value }))
            }
          >
            {FacilityStatus.options.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button type="submit">Create</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FacilityCreateModal;
