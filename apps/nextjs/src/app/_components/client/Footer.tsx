import React from "react";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://linkedin.com/company/rentalproc",
    icon: <FaLinkedin className="h-5 w-5" />,
    description:
      "Connect with RentalProc on LinkedIn to stay updated on industry trends, property management insights, and company news.",
  },
  {
    name: "Facebook",
    url: "https://facebook.com/rentalproc",
    icon: <FaFacebook className="h-5 w-5" />,
    description:
      "Follow RentalProc on Facebook for community updates, property management tips, and tenant resources.",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/rentalproc",
    icon: <FaInstagram className="h-5 w-5" />,
    description:
      "Follow RentalProc on Instagram for visual inspiration on property management and maintenance tips.",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/rentalproc",
    icon: <FaTwitter className="h-5 w-5" />,
    description:
      "Follow RentalProc on Twitter for real-time updates and property management tips.",
  },
];

export const productLinks = [
  {
    name: "Features",
    url: "/features",
    description:
      "Discover RentalProc's comprehensive property management features.",
  },
  {
    name: "Pricing",
    url: "/pricing",
    description:
      "Flexible, transparent pricing plans for your property management needs.",
  },
  {
    name: "Testimonials",
    url: "/testimonials",
    description: "Success stories from property managers using RentalProc.",
  },
  {
    name: "FAQ",
    url: "/faq",
    description: "Find answers to frequently asked questions about RentalProc.",
  },
];

export const companyLinks = [
  {
    name: "About",
    url: "/about",
    description: "Learn about RentalProc's mission and team.",
  },
  {
    name: "Blog",
    url: "/blog",
    description: "Insights on property management and industry trends.",
  },
  {
    name: "Careers",
    url: "/careers",
    description: "Join our team and help transform property management.",
  },
  {
    name: "Contact",
    url: "/contact",
    description: "Get in touch with the RentalProc team.",
  },
];

export const legalLinks = [
  {
    name: "Terms",
    url: "/terms",
    description: "Terms of Service for using RentalProc.",
  },
  {
    name: "Privacy",
    url: "/privacy",
    description: "How we protect and handle your data.",
  },
  {
    name: "Cookies",
    url: "/cookies",
    description: "Our cookie policy and your choices.",
  },
  {
    name: "Licenses",
    url: "/licenses",
    description: "Open-source licenses and acknowledgments.",
  },
];

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-blue-600">Social</h4>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-blue-600"
                  >
                    {link.icon}
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-medium text-blue-600">Product</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.url}
                    className="text-sm text-muted-foreground transition-colors hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-medium text-blue-600">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.url}
                    className="text-sm text-muted-foreground transition-colors hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-medium text-blue-600">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.url}
                    className="text-sm text-muted-foreground transition-colors hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <h4 className="text-lg font-medium text-blue-600">RentalProc</h4>
            <p className="text-sm text-muted-foreground">
              Transforming property management with innovative technology and a
              focus on building positive relationships between property owners,
              managers, and tenants.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              © {new Date().getFullYear()} RentalProc, Inc. <br />
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
