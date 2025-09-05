import React from "react";
import { useTranslations } from "next-intl";

import type { User } from "@reservatior/validators";

interface UserSidebarProps {
  selectedUser: User | null;
  editMode: boolean;
  editedUser: Partial<User> | null;
  handleEdit: () => void;
  handleCancel: () => void;
  handleInputChange: (field: keyof User, value: string) => void;
  closeSidebar: () => void;
  handleUpdateUser: (user: Partial<User>) => void;
}

export default function UserSidebar({
  selectedUser,
  editMode,
  editedUser,
  handleEdit,
  handleCancel,
  handleInputChange,
  closeSidebar,
  handleUpdateUser,
}: UserSidebarProps) {
  const t = useTranslations("Admin");
  if (!selectedUser) return null;
  return (
    <aside className="fixed right-0 top-0 z-50 h-full w-96 bg-white p-6 shadow-lg">
      <button
        onClick={closeSidebar}
        className="mb-4 text-gray-500"
        aria-label={t("sidebar.closeAria", { defaultValue: "Close sidebar" })}
      >
        {t("sidebar.close", { defaultValue: "Close" })}
      </button>
      {editMode ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editedUser) {
              handleUpdateUser(editedUser);
            }
          }}
        >
          <div className="mb-4">
            <label htmlFor="user-name" className="block text-sm font-medium">
              {t("sidebar.form.name", { defaultValue: "Name" })}
            </label>
            <input
              id="user-name"
              name="name"
              type="text"
              className="mt-1 block w-full border px-3 py-2"
              value={editedUser?.name ?? ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="user-email" className="block text-sm font-medium">
              {t("sidebar.form.email", { defaultValue: "Email" })}
            </label>
            <input
              id="user-email"
              name="email"
              type="email"
              className="mt-1 block w-full border px-3 py-2"
              value={editedUser?.email ?? ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              {t("sidebar.actions.save", { defaultValue: "Save" })}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded bg-gray-300 px-4 py-2"
            >
              {t("sidebar.actions.cancel", { defaultValue: "Cancel" })}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="mb-4">
            <div className="font-bold">{t("sidebar.view.name", { defaultValue: "Name:" })}</div>
            <div>{selectedUser.name}</div>
          </div>
          <div className="mb-4">
            <div className="font-bold">{t("sidebar.view.email", { defaultValue: "Email:" })}</div>
            <div>{selectedUser.email}</div>
          </div>
          <button
            onClick={handleEdit}
            className="rounded bg-yellow-500 px-4 py-2 text-white"
          >
            {t("sidebar.actions.edit", { defaultValue: "Edit" })}
          </button>
        </div>
      )}
    </aside>
  );
}
