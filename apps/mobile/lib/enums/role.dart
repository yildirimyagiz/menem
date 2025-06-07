enum Role {
  user,
  admin,
  superAdmin,
  agency,
  agencyAdmin,
  agentAdmin,
  agent,
  seller,
  buyer,
  guest, // Important for non-authenticated users
  tenant,
  moderator,
  facilityManager,
  // Add any other roles from your Next.js UserRole type
  propertyManager, // From Next.js: PROPERTY_MANAGER
  owner, // From Next.js: OWNER
  support, // From Next.js: SUPPORT
}
