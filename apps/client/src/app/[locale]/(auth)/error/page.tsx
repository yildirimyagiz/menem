"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

// Define valid error codes that we expect from NextAuth
type AuthErrorCode =
  | "OAuthAccountNotLinked"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "OAuthSignin"
  | string; // Allow for other string error codes

export default function AuthErrorPage() {
  const t = useTranslations("auth.error");
  const searchParams = useSearchParams();
  const error = searchParams?.get("error") as AuthErrorCode | null;

  // Get the error message from translations based on the error code
  const getErrorMessage = (errorCode: AuthErrorCode | null): string => {
    if (!errorCode) return t("default");

    // Safely access the translation with type assertion
    const translation = t(errorCode as any);
    return typeof translation === "string" ? translation : t("default");
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("title")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {errorMessage}
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/auth/login"
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
