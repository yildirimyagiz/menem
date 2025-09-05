"use client";

import React from "react";

import { useAuth } from "~/hooks/use-auth";
import { UserAvatarDropdown } from "../UserAvatarDropdown";
import { AdminAvatarDropdown } from "./AdminAvatarDropdown";
import { AgencyAvatarDropdown } from "./AgencyAvatarDropdown";
import { AgentAvatarDropdown } from "./AgentAvatarDropdown";
import { BuyerAvatarDropdown } from "./BuyerAvatarDropdown";
import { ClientAvatarDropdown } from "./ClientAvatarDropdown";

// Role enum to match the user schema
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  AGENCY = "AGENCY",
  AGENCY_ADMIN = "AGENCY_ADMIN",
  AGENT_ADMIN = "AGENT_ADMIN",
  AGENT = "AGENT",
  SELLER = "SELLER",
  BUYER = "BUYER",
  GUEST = "GUEST",
  TENANT = "TENANT",
  MODERATOR = "MODERATOR",
  FACILITY_MANAGER = "FACILITY_MANAGER",
}

export function DynamicAvatarDropdown() {
  const { user, isLoading } = useAuth();

  if (!user || isLoading) return null;

  const userRole = user.role || "USER";

  // Render the appropriate dropdown based on user role
  switch (userRole) {
    case Role.ADMIN:
    case Role.SUPER_ADMIN:
    case Role.MODERATOR:
      return <AdminAvatarDropdown />;

    case Role.AGENCY:
    case Role.AGENCY_ADMIN:
      return <AgencyAvatarDropdown />;

    case Role.AGENT:
    case Role.AGENT_ADMIN:
      return <AgentAvatarDropdown />;

    case Role.SELLER:
      return <UserAvatarDropdown />; // Using generic for seller for now

    case Role.BUYER:
      return <BuyerAvatarDropdown />;

    case Role.TENANT:
    case Role.FACILITY_MANAGER:
      return <ClientAvatarDropdown />; // Using client dropdown for tenants/facility managers

    case Role.USER:
    case Role.GUEST:
    default:
      return <ClientAvatarDropdown />;
  }
}
