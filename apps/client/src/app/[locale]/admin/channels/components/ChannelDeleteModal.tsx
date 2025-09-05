import React from "react";

interface ChannelDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  onSuccess: () => void;
}

const ChannelDeleteModal: React.FC<ChannelDeleteModalProps> = ({
  isOpen,
  onClose,
  channelId,
  onSuccess,
}) => {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Delete Channel</h2>
        <p>Are you sure you want to delete channel: {channelId}?</p>
        <button onClick={onSuccess}>Confirm Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ChannelDeleteModal;
