"use client";

import React from "react";

interface FacilityDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  facilityId: string;
}

const FacilityDeleteModal: React.FC<FacilityDeleteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  facilityId,
}) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    // Simulate API call
    onSuccess();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Delete Facility</h2>
        <p>Are you sure you want to delete facility with ID: {facilityId}?</p>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default FacilityDeleteModal;
