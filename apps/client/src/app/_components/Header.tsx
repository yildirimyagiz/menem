"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Bars3Icon, XMarkIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: `/${locale}` });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg shadow-sm dark:bg-gray-900/95 pt-safe">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-xl">
              R
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Reservatior
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href={`/${locale}`} 
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              {t("home", { default: "Home" })}
            </Link>
            <Link 
              href={`/${locale}/properties`} 
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              {t("properties", { default: "Properties" })}
            </Link>
            <Link 
              href={`/${locale}/about`} 
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              {t("about", { default: "About" })}
            </Link>
            <Link 
              href={`/${locale}/contact`} 
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              {t("contact", { default: "Contact" })}
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === "authenticated" ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={`/${locale}/dashboard`}
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                >
                  {t("dashboard", { default: "Dashboard" })}
                </Link>
                <div className="relative group">
                  <button
                    className="flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                    aria-label={t("profile", { default: "Profile" })}
                  >
                    <UserCircleIcon className="h-6 w-6" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      href={`/${locale}/profile`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {t("profile", { default: "Profile" })}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {t("logout", { default: "Logout" })}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href={`/${locale}/auth/login`}
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                >
                  {t("login", { default: "Login" })}
                </Link>
                <Link
                  href={`/${locale}/auth/signup`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {t("signup", { default: "Sign up" })}
                </Link>
              </>
            )}
          </div>

          {/* Mobile right controls: compact user icon + menu */}
          <div className="flex items-center gap-2 md:hidden">
            {status === "authenticated" ? (
              <Link
                href={`/${locale}/dashboard`}
                aria-label={t("dashboard", { default: "Dashboard" })}
                className="p-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                <UserCircleIcon className="h-6 w-6" />
              </Link>
            ) : (
              <Link
                href={`/${locale}/auth/login`}
                aria-label={t("login", { default: "Login" })}
                className="p-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                <UserCircleIcon className="h-6 w-6" />
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link 
                href={`/${locale}`} 
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("home")}
              </Link>
              <Link 
                href={`/${locale}/properties`} 
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("properties")}
              </Link>
              <Link 
                href={`/${locale}/about`} 
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("about")}
              </Link>
              <Link 
                href={`/${locale}/contact`} 
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("contact")}
              </Link>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {status === "authenticated" ? (
                  <div className="flex flex-col space-y-2">
                    <Link
                      href={`/${locale}/dashboard`}
                      className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("dashboard")}
                    </Link>
                    <Link
                      href={`/${locale}/profile`}
                      className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("profile")}
                    </Link>
                    <button
                      onClick={() => {
                        void handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                    >
                      {t("logout")}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      href={`/${locale}/auth/login`}
                      className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("login")}
                    </Link>
                    <Link
                      href={`/${locale}/auth/signup`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("signup")}
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
 