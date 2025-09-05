import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

import { cn } from "@reservatior/ui";

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  title?: string;
  className?: string;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  isOpen,
  onClose,
  children,
  size = "md",
  title,
  className,
}) => {
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
      modalRef.current?.focus();
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleClickOutside = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClickOutside}
      aria-modal="true"
      role="dialog"
      aria-label={title ?? "Property Modal"}
    >
      <div
        ref={modalRef}
        className={cn(
          "relative w-full rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800",
          sizeClasses[size],
          className,
        )}
        tabIndex={0}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="text-xl font-semibold text-gray-900 dark:text-white"
              id="property-modal-title"
            >
              {title}
            </h2>
          </div>
        )}
        <button
          ref={firstFocusableRef}
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mt-2">{children}</div>
        <button ref={lastFocusableRef} className="hidden">
          Last Focusable Element
        </button>
      </div>
    </div>
  );
};

export default PropertyModal;
