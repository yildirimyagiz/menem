import { useCallback, useState } from "react";

import type { User } from "@reservatior/validators";

export function useUserManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Placeholder handlers
  const handleViewDetails = useCallback((user: User) => {
    setSelectedUser(user);
    setEditedUser(user);
    setEditMode(false);
  }, []);

  const handleEdit = useCallback(() => {
    setEditMode(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    // Placeholder
    setError("Delete not implemented");
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSelectedUser(null);
    setEditMode(false);
    setEditedUser(null);
  }, []);

  const handleCancel = useCallback(() => {
    setEditMode(false);
    setEditedUser(null);
  }, []);

  const handleUserAdded = useCallback(() => {
    // Placeholder
  }, []);

  const handleInputChange = useCallback(async (field: string, value: any) => {
    setEditedUser((prev) => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
    return Promise.resolve();
  }, []);

  const handleUpdateUser = useCallback(async (updatedUser: User) => {
    // Placeholder
    setError("Update not implemented");
  }, []);

  return {
    selectedUser,
    setSelectedUser,
    editMode,
    editedUser,
    error,
    handleViewDetails,
    handleEdit,
    handleDelete,
    handleCloseSidebar,
    handleCancel,
    handleUserAdded,
    handleInputChange,
    handleUpdateUser,
  };
}
