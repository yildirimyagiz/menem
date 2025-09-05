import React from "react";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/favorites", label: "Favorites" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
  { href: "/logout", label: "Logout" },
];

const NavMobile = ({ onClickClose }: { onClickClose?: () => void }) => (
  <nav className="flex flex-col space-y-4 p-4">
    {navItems.map((item) => (
      <Link key={item.href} href={item.href} legacyBehavior>
        <a
          className="text-lg font-medium transition-colors hover:text-blue-600"
          onClick={onClickClose}
        >
          {item.label}
        </a>
      </Link>
    ))}
  </nav>
);

export default NavMobile;
