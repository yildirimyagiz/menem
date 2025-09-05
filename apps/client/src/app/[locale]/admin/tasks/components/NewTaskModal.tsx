import React, { useEffect, useRef } from "react";

import NewTaskForm from "./newTask"; // Adjust the import path if necessary

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "Tab") {
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusableRef.current) {
            event.preventDefault();
            lastFocusableRef.current?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusableRef.current) {
            event.preventDefault();
            firstFocusableRef.current?.focus();
          }
        }
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      modalRef.current?.focus(); // Focus the modal when it opens
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleClickOutside = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        tabIndex={0}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-task-modal-title"
      >
        <button
          ref={firstFocusableRef}
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 id="new-task-modal-title" className="mb-4 text-lg font-bold">
          Add New Task
        </h2>
        <NewTaskForm onClose={onClose} onTaskAdded={onClose} />
        <button ref={lastFocusableRef} className="hidden">
          Last Focusable Element
        </button>
      </div>
    </div>
  );
};

export default NewTaskModal;
