"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import type { CreateUserInput } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import { AccountTypeEnum, RoleEnum, UserStatusEnum } from "@reservatior/validators";
import { useTranslations } from "next-intl";

import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const AddUser: React.FC<{
  onClose: () => void;
  onUserAdded: () => void;
}> = ({ onClose, onUserAdded }) => {
  const t = useTranslations("Admin");
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<CreateUserInput>({
    email: "",
    name: "",
    role: RoleEnum.enum.USER,
    type: AccountTypeEnum.enum.EMAIL,
    status: UserStatusEnum.enum.ACTIVE,
    isActive: true,
    phoneNumber: "",
    username: "",
    displayName: "",
    firstName: "",
    lastName: "",
    profilePicture: "",
    image: "",
    locale: "",
    timezone: "",
    preferences: {},
    agencyId: "",
  });

  // @ts-expect-error Suppress tRPC router collision typing for this accessor; runtime is correct
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      toast.success(t("addUser.success", { defaultValue: "User created successfully!" }));
      onUserAdded();
      resetForm();
      setTimeout(onClose, 2000);
    },
    onError: (err: unknown) => {
      console.error("Error creating user:", err);
      toast.error(t("addUser.error", { defaultValue: "Failed to create user" }));
    },
  });

  // Trap focus and close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Trap focus within modal
      if (e.key === "Tab" && modalRef.current) {
        const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl?.focus();
        } else if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Focus modal on mount
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const resetForm = () => {
    setFormData({
      email: "",
      name: "",
      role: RoleEnum.enum.USER,
      type: AccountTypeEnum.enum.EMAIL,
      status: UserStatusEnum.enum.ACTIVE,
      isActive: true,
      phoneNumber: "",
      username: "",
      displayName: "",
      firstName: "",
      lastName: "",
      profilePicture: "",
      image: "",
      locale: "",
      timezone: "",
      preferences: {},
      agencyId: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const key = name as keyof CreateUserInput;

    setFormData((prev) => {
      let processedValue: string | boolean | Date | Record<string, unknown> =
        value;

      if (type === "checkbox") {
        processedValue = (e.target as HTMLInputElement).checked;
      } else if (type === "date") {
        processedValue = new Date(value);
      } else if (value === "" && key !== "email" && key !== "name") {
        return { ...prev, [key]: undefined };
      }

      return { ...prev, [key]: processedValue };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // basic client-side validation
    if (!String(formData.name).trim()) {
      toast.error(t("addUser.validation.nameRequired", { defaultValue: "Name is required" }));
      return;
    }
    if (!String(formData.email).trim()) {
      toast.error(t("addUser.validation.emailRequired", { defaultValue: "Email is required" }));
      return;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(String(formData.email))) {
      toast.error(t("addUser.validation.emailInvalid", { defaultValue: "Please enter a valid email" }));
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    createUser.mutate(formData);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t("addUser.title", { defaultValue: "Add a New User" })}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-8 shadow-2xl focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2
              className="text-2xl font-bold text-blue-800"
              id="add-user-title-heading"
            >
              {t("addUser.title", { defaultValue: "Add a New User" })}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {t("addUser.description", { defaultValue: "Fill out the form below to add a new user to your system. All required fields are marked with *." })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label={t("addUser.closeAria", { defaultValue: "Close add user form" })}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-user-name"
              >
                {t("addUser.fields.nameLabel", { defaultValue: "Name" })} <span className="text-red-500">*</span>
              </label>
              <Input
                id="add-user-name"
                name="name"
                placeholder={t("addUser.fields.namePlaceholder", { defaultValue: "Enter user's full name" })}
                value={formData.name}
                onChange={handleInputChange}
                required
                className="rounded-md border p-2"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-user-email"
              >
                {t("addUser.fields.emailLabel", { defaultValue: "Email" })} <span className="text-red-500">*</span>
              </label>
              <Input
                id="add-user-email"
                name="email"
                type="email"
                placeholder={t("addUser.fields.emailPlaceholder", { defaultValue: "Enter user's email address" })}
                value={formData.email}
                onChange={handleInputChange}
                required
                className="rounded-md border p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-user-role"
              >
                {t("addUser.fields.roleLabel", { defaultValue: "Role" })} <span className="text-red-500">*</span>
              </label>
              <select
                id="add-user-role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2"
                required
                title={t("addUser.fields.roleLabel", { defaultValue: "User Role" })}
              >
                <option value="" disabled>{t("addUser.fields.rolePlaceholder", { defaultValue: "Select role" })}</option>
                {RoleEnum.options.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-user-type"
              >
                {t("addUser.fields.typeLabel", { defaultValue: "Type" })} <span className="text-red-500">*</span>
              </label>
              <select
                id="add-user-type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2"
                required
                title={t("addUser.fields.typeLabel", { defaultValue: "User Type" })}
              >
                <option value="" disabled>{t("addUser.fields.typePlaceholder", { defaultValue: "Select type" })}</option>
                {AccountTypeEnum.options.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-user-status"
              >
                {t("addUser.fields.statusLabel", { defaultValue: "Status" })} <span className="text-red-500">*</span>
              </label>
              <select
                id="add-user-status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2"
                required
                title={t("addUser.fields.statusLabel", { defaultValue: "User Status" })}
              >
                <option value="" disabled>{t("addUser.fields.statusPlaceholder", { defaultValue: "Select status" })}</option>
                {UserStatusEnum.options.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-user-phoneNumber"
              >
                {t("addUser.fields.phoneLabel", { defaultValue: "Phone Number" })}
              </label>
              <Input
                id="add-user-phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder={t("addUser.fields.phonePlaceholder", { defaultValue: "Enter phone number" })}
                value={formData.phoneNumber ?? ""}
                onChange={handleInputChange}
                className="rounded-md border p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-user-firstName"
              >
                {t("addUser.fields.firstNameLabel", { defaultValue: "First Name" })}
              </label>
              <Input
                id="add-user-firstName"
                name="firstName"
                placeholder={t("addUser.fields.firstNamePlaceholder", { defaultValue: "Enter first name" })}
                value={formData.firstName ?? ""}
                onChange={handleInputChange}
                className="rounded-md border p-2"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="add-user-lastName"
              >
                {t("addUser.fields.lastNameLabel", { defaultValue: "Last Name" })}
              </label>
              <Input
                id="add-user-lastName"
                name="lastName"
                placeholder={t("addUser.fields.lastNamePlaceholder", { defaultValue: "Enter last name" })}
                value={formData.lastName ?? ""}
                onChange={handleInputChange}
                className="rounded-md border p-2"
              />
            </div>
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="add-user-displayName"
            >
              {t("addUser.fields.displayNameLabel", { defaultValue: "Display Name" })}
            </label>
            <Input
              id="add-user-displayName"
              name="displayName"
              placeholder={t("addUser.fields.displayNamePlaceholder", { defaultValue: "Enter display name" })}
              value={formData.displayName ?? ""}
              onChange={handleInputChange}
              className="rounded-md border p-2"
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="add-user-username"
            >
              {t("addUser.fields.usernameLabel", { defaultValue: "Username" })}
            </label>
            <Input
              id="add-user-username"
              name="username"
              placeholder={t("addUser.fields.usernamePlaceholder", { defaultValue: "Enter username" })}
              value={formData.username ?? ""}
              onChange={handleInputChange}
              className="rounded-md border p-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="add-user-isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label
              htmlFor="add-user-isActive"
              className="text-sm text-gray-700"
            >
              {t("addUser.fields.isActiveLabel", { defaultValue: "User is active" })}
            </label>
          </div>

          <Button
            type="submit"
            variant="link"
            size="sm"
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            disabled={createUser.isPending}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            aria-busy={createUser.isPending}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
            {createUser.isPending
              ? t("addUser.submitting", { defaultValue: "Adding User..." })
              : t("addUser.submit", { defaultValue: "Add User" })}
          </Button>
        </form>
      </div>
    </>
  );
};

export default AddUser;
