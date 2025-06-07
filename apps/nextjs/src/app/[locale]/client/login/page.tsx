"use client";

import type { FC } from "react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import facebookSvg from "~/images/Facebook.svg";
import googleSvg from "~/images/Google.svg";
import twitterSvg from "~/images/Twitter.svg";
import ButtonPrimary from "~/shared/ButtonPrimary";
import Input from "~/shared/Input";
import Spinner from "~/shared/Spinner";

// Translation constants for login page
const LOGIN_PAGE_TRANSLATION_KEYS = {
  PAGE_TITLE: "loginPage.pageTitle",
  FORM: {
    EMAIL: "loginPage.form.email",
    EMAIL_PLACEHOLDER: "loginPage.form.emailPlaceholder",
    PASSWORD: "loginPage.form.password",
    PASSWORD_PLACEHOLDER: "loginPage.form.passwordPlaceholder",
    FORGOT_PASSWORD: "loginPage.form.forgotPassword",
    REMEMBER_ME: "loginPage.form.rememberMe",
    SUBMIT_BUTTON: "loginPage.form.submitButton",
  },
  SOCIAL: {
    FACEBOOK: "loginPage.social.facebook",
    TWITTER: "loginPage.social.twitter",
    GOOGLE: "loginPage.social.google",
  },
  NEW_USER: "loginPage.newUser",
  CREATE_ACCOUNT: "loginPage.createAccount",
  ERRORS: {
    FAILED_LOGIN: "loginPage.errors.failedLogin",
    SOCIAL_LOGIN_FAILED: "loginPage.errors.socialLoginFailed",
  },
  SUCCESS: {
    LOGIN_SUCCESSFUL: "loginPage.success.loginSuccessful",
  },
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type PageLoginProps = object;

const loginSocials = [
  { name: "Continue with Facebook", provider: "facebook", icon: facebookSvg },
  { name: "Continue with Twitter", provider: "twitter", icon: twitterSvg },
  { name: "Continue with Google", provider: "google", icon: googleSvg },
];

const PageLogin: FC<PageLoginProps> = () => {
  const t = useTranslations("loginPage");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    showPassword: false,
  });
  const [uiState, setUiState] = useState({
    error: null as string | null,
    isLoading: false,
    successMessage: null as string | null,
  });

  const callbackUrl = searchParams.get("callbackUrl") ?? "/management";

  useEffect(() => {
    if (status === "authenticated" && session) {
      console.log("Session authenticated, redirecting to:", callbackUrl);
      void router.replace(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUiState((prev) => ({ ...prev, error: null, isLoading: true }));

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) {
        setUiState((prev) => ({ ...prev, error: result.error ?? null }));
        return;
      }

      if (result?.ok) {
        setUiState((prev) => ({
          ...prev,
          successMessage: t("success.loginSuccessful"),
        }));
        await router.replace(callbackUrl);
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setUiState((prev) => ({
        ...prev,
        error: t("errors.failedLogin"),
      }));
    } finally {
      setUiState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    setUiState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await signIn(provider, {
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setUiState((prev) => ({
          ...prev,
          error: `${t("errors.socialLoginFailed", { provider })}: ${result.error}`,
          isLoading: false,
        }));
        return;
      }

      if (result?.url) {
        await router.replace(result.url);
      }
    } catch (err) {
      console.error(`${provider} sign-in error:`, err);
      setUiState((prev) => ({
        ...prev,
        error: t("errors.socialLoginFailed", { provider }),
      }));
    } finally {
      setUiState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="md" color="text-blue-600" />
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="nc-PageLogin">
      <div className="mb-8 text-center text-lg font-semibold text-red-600">
        Please log in to view the dashboard.
      </div>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
          {t("pageTitle")}
        </h2>
        <div className="mx-auto max-w-md space-y-6">
          {uiState.isLoading && <Spinner size="md" color="text-blue-600" />}
          {uiState.successMessage && (
            <div className="text-sm text-green-500" role="status">
              {uiState.successMessage}
            </div>
          )}
          {uiState.error && (
            <div className="text-sm text-red-500" role="alert">
              {uiState.error}
            </div>
          )}

          <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSocialSignIn(item.provider)}
                disabled={uiState.isLoading}
                className="bg-primary-50 flex w-full transform rounded-lg px-4 py-3 transition-transform hover:translate-y-[-2px] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 sm:px-6"
              >
                <Image
                  className="flex-shrink-0"
                  src={item.icon}
                  alt={item.name}
                  width={24}
                  height={24}
                />
                <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                  {t(`social.${item.provider}`)}
                </h3>
              </button>
            ))}
          </div>

          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                {t("form.email")}
              </span>
              <Input
                type="email"
                placeholder={t("form.emailPlaceholder")}
                className="mt-1"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                disabled={uiState.isLoading}
              />
            </label>
            <label className="block">
              <span className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
                {t("form.password")}
                <Link
                  href="/signup/password-rec"
                  className="text-sm font-medium underline"
                >
                  {t("form.forgotPassword")}
                </Link>
              </span>
              <div className="relative">
                <Input
                  type={formData.showPassword ? "text" : "password"}
                  className="mt-1"
                  placeholder={t("form.passwordPlaceholder")}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                  disabled={uiState.isLoading}
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      showPassword: !prev.showPassword,
                    }))
                  }
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {formData.showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rememberMe: e.target.checked,
                  }))
                }
                className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
              />
              <label
                htmlFor="rememberMe"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                {t("form.rememberMe")}
              </label>
            </div>
            <ButtonPrimary
              type="submit"
              className="w-full"
              loading={uiState.isLoading}
            >
              {t("form.submitButton")}
            </ButtonPrimary>
          </form>
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            {t("newUser")}{" "}
            <Link href="/signup" className="text-green-600">
              {t("createAccount")}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
