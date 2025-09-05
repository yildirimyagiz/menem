"use client";
// Header component is now a semantic wrapper only. Remove Navbar to avoid duplicate navbars.
export function Header({ children }: { children?: React.ReactNode }) {
  return <header>{children}</header>;
}
