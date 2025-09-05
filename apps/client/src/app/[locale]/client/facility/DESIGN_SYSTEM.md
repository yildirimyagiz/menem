# Facility Management Design System

## Overview

This document outlines the AceternityUI-inspired design system implemented for the facility management interface. The design emphasizes modern aesthetics, smooth animations, and excellent user experience.

## Design Principles

### 1. Modern Gradient Aesthetics

- **Primary Gradients**: Blue to Purple (`from-blue-500 to-purple-600`)
- **Background Gradients**: Neutral tones with subtle color overlays
- **Card Gradients**: Soft color variations for different content types

### 2. Animation Philosophy

- **Smooth Transitions**: 300ms duration for most interactions
- **Staggered Animations**: Sequential loading with 0.1s delays
- **Hover Effects**: Subtle scale and shadow changes
- **Loading States**: Rotating spinners and skeleton animations

### 3. Color Palette

#### Primary Colors

```css
/* Blue Gradient */
bg-gradient-to-r from-blue-500 to-purple-600

/* Green (Success/Active) */
bg-gradient-to-r from-green-500 to-emerald-600

/* Yellow (Warning) */
bg-gradient-to-r from-yellow-500 to-orange-500

/* Red (Error/Danger) */
bg-gradient-to-r from-red-500 to-pink-600
```

#### Background Colors

```css
/* Light Mode */
bg-gradient-to-br from-neutral-50 via-white to-neutral-100

/* Dark Mode */
bg-gradient-to-br from-neutral-950 dark:via-neutral-900 dark:to-neutral-800
```

#### Card Backgrounds

```css
/* Primary Cards */
bg-white border border-neutral-200 shadow-lg

/* Enhanced Cards */
bg-gradient-to-r from-white to-neutral-50 shadow-xl

/* Status Cards */
bg-gradient-to-r from-[color]-50 to-[color]-100
```

## Component Patterns

### 1. Stats Cards

```tsx
const StatsCard = ({ title, value, icon: Icon, trend, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={cn(
      "group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl",
      className,
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="relative flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
        </div>
      </div>
    </div>
  </motion.div>
);
```

### 2. Enhanced Cards

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ y: -5 }}
  transition={{ duration: 0.3 }}
  className="group relative"
>
  <Card className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-0 shadow-lg transition-all duration-300 hover:shadow-xl">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    {/* Card Content */}
  </Card>
</motion.div>
```

### 3. Form Elements

```tsx
<motion.div whileFocus={{ scale: 1.02 }} className="relative">
  <Input
    className="rounded-xl border-neutral-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
    placeholder="Enter text..."
  />
</motion.div>
```

### 4. Buttons

```tsx
// Primary Button
<Button className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-white shadow-lg hover:from-blue-700 hover:to-purple-700">
  Action
</Button>

// Secondary Button
<Button variant="outline" className="rounded-xl border-neutral-200 bg-white px-6 py-2 hover:bg-neutral-50">
  Cancel
</Button>
```

## Animation Guidelines

### 1. Page Transitions

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {/* Content */}
</motion.div>
```

### 2. Staggered Animations

```tsx
{
  items.map((item, index) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Item */}
    </motion.div>
  ));
}
```

### 3. Hover Animations

```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="transition-all duration-200"
>
  {/* Interactive Element */}
</motion.div>
```

## Typography

### Headings

```css
/* Hero Title */
text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl

/* Section Title */
text-2xl font-bold text-neutral-900

/* Card Title */
text-xl font-bold text-neutral-900
```

### Body Text

```css
/* Primary Text */
text-neutral-900 dark:text-neutral-100

/* Secondary Text */
text-neutral-600 dark:text-neutral-400

/* Muted Text */
text-neutral-500 dark:text-neutral-500
```

## Spacing System

### Container Spacing

```css
/* Page Container */
max-w-7xl px-4 sm:px-6 lg:px-8

/* Section Spacing */
py-8 lg:py-12

/* Card Spacing */
p-6
```

### Component Spacing

```css
/* Grid Gaps */
gap-6

/* Form Spacing */
space-y-6

/* Button Groups */
space-x-3
```

## Icon Usage

### Icon Sizes

```css
/* Small Icons */
h-4 w-4

/* Medium Icons */
h-5 w-5

/* Large Icons */
h-6 w-6

/* Extra Large Icons */
h-8 w-8
```

### Icon Colors

```css
/* Primary Icons */
text-neutral-900 dark:text-neutral-100

/* Secondary Icons */
text-neutral-600 dark:text-neutral-400

/* Accent Icons */
text-blue-500 dark:text-blue-400

/* Status Icons */
text-green-500 (success)
text-yellow-500 (warning)
text-red-500 (error)
```

## Responsive Design

### Breakpoints

```css
/* Mobile First */
sm: (640px and up)
md: (768px and up)
lg: (1024px and up)
xl: (1280px and up)
```

### Grid Systems

```css
/* Mobile */
grid-cols-1

/* Tablet */
sm:grid-cols-2

/* Desktop */
lg:grid-cols-3
xl:grid-cols-4
```

## Accessibility

### Focus States

```css
focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
```

### Color Contrast

- All text meets WCAG AA standards
- Interactive elements have sufficient contrast
- Dark mode support for all components

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Focus indicators are clearly visible
- Logical tab order maintained

## Implementation Notes

### 1. Consistent Import Pattern

```tsx
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "~/lib/utils";
```

### 2. Conditional Styling

```tsx
className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)}
```

### 3. Dark Mode Support

```tsx
className =
  "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100";
```

## Future Enhancements

### 1. Micro-interactions

- Add more subtle hover effects
- Implement loading skeletons
- Enhance form validation feedback

### 2. Advanced Animations

- Page transition animations
- Staggered list animations
- Parallax effects for hero sections

### 3. Component Library

- Create reusable component templates
- Standardize prop interfaces
- Implement design tokens

This design system ensures consistency across all facility management interfaces while providing a modern, engaging user experience inspired by AceternityUI principles.
