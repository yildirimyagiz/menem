# Avatar Dropdown Components

This directory contains specialized avatar dropdown components for different user roles in the real estate application.

## Components Overview

### 1. UserAvatarDropdown

- **File**: `UserAvatarDropdown.tsx`
- **Purpose**: Generic user dropdown with basic functionality
- **Features**: Profile, messages, favorites, notifications, settings, help, logout
- **Color**: Gray badge

### 2. AdminAvatarDropdown

- **File**: `dropdowns/AdminAvatarDropdown.tsx`
- **Purpose**: Administrator-specific dropdown with admin tools
- **Features**: Admin dashboard, user management, agency management, reports, system logs, database management
- **Color**: Purple badge

### 3. AgencyAvatarDropdown

- **File**: `dropdowns/AgencyAvatarDropdown.tsx`
- **Purpose**: Real estate agency-specific dropdown
- **Features**: Agency dashboard, properties, agents, appointments, messages, documents, billing
- **Color**: Cyan badge

### 4. AgentAvatarDropdown

- **File**: `dropdowns/AgentAvatarDropdown.tsx`
- **Purpose**: Real estate agent-specific dropdown
- **Features**: Agent dashboard, properties, appointments, clients, messages, showings, documents, calls
- **Color**: Teal badge

### 5. ClientAvatarDropdown

- **File**: `dropdowns/ClientAvatarDropdown.tsx`
- **Purpose**: General client/user dropdown
- **Features**: Search properties, favorites, appointments, messages, saved searches, reviews, documents, billing
- **Color**: Gray badge

### 6. BuyerAvatarDropdown

- **File**: `dropdowns/BuyerAvatarDropdown.tsx`
- **Purpose**: Property buyer-specific dropdown
- **Features**: Search properties, favorites, recently viewed, saved searches, appointments, messages, reviews, purchase history
- **Color**: Emerald badge

### 7. SellerAvatarDropdown

- **File**: `SellerAvatarDropdown.tsx`
- **Purpose**: Property seller-specific dropdown
- **Features**: Seller dashboard, properties, property views, appointments, messages, interested buyers, documents, earnings
- **Color**: Yellow badge

### 8. DynamicAvatarDropdown

- **File**: `dropdowns/DynamicAvatarDropdown.tsx`
- **Purpose**: Automatically selects the appropriate dropdown based on user role
- **Usage**: Recommended for most cases as it handles role-based rendering automatically

## User Roles Supported

The components support the following user roles from the schema:

- `USER` - General user
- `ADMIN` - Administrator
- `SUPER_ADMIN` - Super Administrator
- `AGENCY` - Real Estate Agency
- `AGENCY_ADMIN` - Agency Administrator
- `AGENT_ADMIN` - Agent Administrator
- `AGENT` - Real Estate Agent
- `SELLER` - Property Seller
- `BUYER` - Property Buyer
- `GUEST` - Guest user
- `TENANT` - Property Tenant
- `MODERATOR` - Content Moderator
- `FACILITY_MANAGER` - Facility Manager

## Usage

### Basic Usage

```tsx
import { DynamicAvatarDropdown } from "~/app/_components";

function Header() {
  return (
    <header>
      <DynamicAvatarDropdown />
    </header>
  );
}
```

### Specific Role Usage

```tsx
import { AdminAvatarDropdown, AgencyAvatarDropdown } from "~/app/_components";

function Header({ userRole }) {
  if (userRole === "ADMIN") {
    return <AdminAvatarDropdown />;
  }
  if (userRole === "AGENCY") {
    return <AgencyAvatarDropdown />;
  }
  // ... other roles
}
```

### Role Enum Usage

```tsx
import { Role } from "~/app/_components";

// Use the Role enum for type safety
const userRole: Role = Role.ADMIN;
```

## Features

### Common Features Across All Components

- **Responsive Design**: Works on mobile and desktop
- **Accessibility**: Full keyboard navigation and ARIA labels
- **Animations**: Smooth Framer Motion animations
- **Loading States**: Shows loading indicators during logout
- **Error Handling**: Graceful error handling for logout failures
- **Badge Support**: Notification badges for menu items
- **Role-based Styling**: Different colors for different roles

### Role-Specific Features

Each component includes role-appropriate menu items:

- **Admin**: System management tools
- **Agency**: Property and agent management
- **Agent**: Client and property management
- **Client/Buyer**: Property search and favorites
- **Seller**: Property listing and buyer management

## Styling

All components use Tailwind CSS classes and follow the design system:

- Consistent spacing and typography
- Role-based color schemes
- Hover and focus states
- Dark mode support
- Responsive breakpoints

## Dependencies

- `framer-motion` - For animations
- `lucide-react` - For icons
- `@reservatior/ui` - For UI components
- `~/hooks/use-auth` - For authentication

## Customization

To customize a component:

1. Copy the component file
2. Modify the `menuItems` array to add/remove menu items
3. Update the badge colors in the `getRoleColor` function
4. Customize the routing paths as needed

## Best Practices

1. **Use DynamicAvatarDropdown**: For most cases, use the dynamic component that automatically selects the right dropdown
2. **Role-based Routing**: Ensure menu items route to role-appropriate pages
3. **Consistent Styling**: Maintain consistent badge colors and styling across components
4. **Accessibility**: Always include proper ARIA labels and keyboard navigation
5. **Error Handling**: Handle logout errors gracefully
6. **Performance**: Components are optimized with proper React patterns
