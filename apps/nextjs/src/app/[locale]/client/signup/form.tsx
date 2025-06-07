"use client";

import type { FC } from "react";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

import ButtonPrimary from "../../../shared/ButtonPrimary";
import Input from "../../../shared/Input";
import googleSvg from "../../images/Google.svg";

// Translation constants for signup form
const SIGNUP_TRANSLATION_KEYS = {
  TITLE: "signup.title",
  SUBTITLE: "signup.subtitle",
  FORM: {
    USERNAME: "signup.form.username",
    USERNAME_PLACEHOLDER: "signup.form.usernamePlaceholder",
    EMAIL_PHONE: "signup.form.emailOrPhone",
    EMAIL_PHONE_PLACEHOLDER: "signup.form.emailOrPhonePlaceholder",
    PASSWORD: "signup.form.password",
    CONFIRM_PASSWORD: "signup.form.confirmPassword",
    SUBMIT_BUTTON: "signup.form.submitButton",
    SUBMITTING: "signup.form.submitting",
  },
  SOCIAL: {
    CONTINUE_WITH: "signup.social.continueWith",
  },
  LINKS: {
    ALREADY_HAVE_ACCOUNT: "signup.links.alreadyHaveAccount",
    SIGN_IN: "signup.links.signIn",
    FORGOT_PASSWORD: "signup.links.forgotPassword",
    RESET_PASSWORD: "signup.links.resetPassword",
    BACK_TO_SIGNUP: "signup.links.backToSignup",
  },
  FORGOT_PASSWORD: {
    TITLE: "signup.forgotPassword.title",
    SUBTITLE: "signup.forgotPassword.subtitle",
    SUBMIT_BUTTON: "signup.forgotPassword.submitButton",
    SUBMITTING: "signup.forgotPassword.submitting",
    SUCCESS_TITLE: "signup.forgotPassword.successTitle",
    SUCCESS_MESSAGE: "signup.forgotPassword.successMessage",
  },
  VALIDATION: {
    REQUIRED_FIELDS: "signup.validation.requiredFields",
    USERNAME_LENGTH: "signup.validation.usernameLength",
    INVALID_EMAIL_PHONE: "signup.validation.invalidEmailPhone",
    PASSWORD_LENGTH: "signup.validation.passwordLength",
    PASSWORDS_DONT_MATCH: "signup.validation.passwordsDontMatch",
  },
  ERRORS: {
    UNKNOWN: "signup.errors.unknown",
  },
};

const loginSocials = [
  { name: "Continue with Google", provider: "google", icon: googleSvg },
];

const SignUpForm: FC = () => {
  const t = useTranslations("signup");

  const [formData, setFormData] = useState({
    userName: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (
      !formData.userName ||
      !formData.emailOrPhone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError(t("validation.requiredFields"));
      return false;
    }
    if (formData.userName.length < 3) {
      setError(t("validation.usernameLength"));
      return false;
    }
    if (
      !emailRegex.test(formData.emailOrPhone) &&
      !phoneRegex.test(formData.emailOrPhone)
    ) {
      setError(t("validation.invalidEmailPhone"));
      return false;
    }
    if (formData.password.length < 8) {
      setError(t("validation.passwordLength"));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t("validation.passwordsDontMatch"));
      return false;
    }
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.emailOrPhone,
          password: formData.password,
          name: formData.userName,
        }),
      });

      if (response.ok) {
        const result = await signIn("credentials", {
          redirect: false,
          email: formData.emailOrPhone,
          password: formData.password,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        router.push("/account");
      } else {
        const data = await response.json();
        throw new Error(data.error || t("errors.unknown"));
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(error instanceof Error ? error.message : t("errors.unknown"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: formData.emailOrPhone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t("forgotPassword.error"));
      }

      setResetEmailSent(true);
    } catch (error) {
      console.error("Password reset error:", error);
      setError(error instanceof Error ? error.message : t("errors.unknown"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    setIsSocialLoading(true);
    setError(null);
    try {
      const result = await signIn(provider, { callbackUrl: "/dashboard" });
      if (result?.error) {
        throw new Error(result.error);
      }
      // The redirection will be handled by NextAuth.js
    } catch (error) {
      console.error("Social sign-in error:", error);
      setError(error instanceof Error ? error.message : t("errors.unknown"));
      setIsSocialLoading(false);
    }
  };

  return (
    <div className="nc-SignUpForm">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          {forgotPasswordMode ? t("forgotPassword.title") : t("title")}
        </h2>
        <span className="mt-1 block text-sm text-neutral-700 dark:text-neutral-300">
          {forgotPasswordMode ? t("forgotPassword.subtitle") : t("subtitle")}
        </span>
      </div>

      {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

      {!forgotPasswordMode ? (
        <>
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSignUp}>
            <div className="grid grid-cols-1 gap-3">
              {loginSocials.map((social, index) => (
                <button
                  key={index}
                  className="nc-will-change-transform flex w-full transform items-center justify-center rounded-xl border-2 border-neutral-100 bg-white px-4 py-3 text-sm font-medium text-neutral-600 transition-transform hover:border-neutral-200 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-1 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  type="button"
                  onClick={() => handleSocialSignIn(social.provider)}
                  disabled={isSocialLoading}
                >
                  <Image
                    sizes="40px"
                    className="flex-shrink-0"
                    src={social.icon}
                    alt={social.provider}
                    width={24}
                    height={24}
                  />
                  <span className="flex-grow text-center">
                    {t("social.continueWith", { provider: social.provider })}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative text-center">
              <span className="relative z-10 inline-block bg-white px-4 text-sm font-medium dark:bg-neutral-900 dark:text-neutral-400">
                {t("or")}
              </span>
              <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
            </div>

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                {t("form.username")}
              </span>
              <Input
                type="text"
                name="userName"
                placeholder={t("form.usernamePlaceholder")}
                className="mt-1"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                {t("form.emailOrPhone")}
              </span>
              <Input
                type="text"
                name="emailOrPhone"
                placeholder={t("form.emailOrPhonePlaceholder")}
                className="mt-1"
                value={formData.emailOrPhone}
                onChange={handleChange}
                required
              />
            </label>
            <label className="relative block">
              <span className="text-neutral-800 dark:text-neutral-200">
                {t("form.password")}
              </span>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                className="mt-1 pr-10"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 mt-6 flex items-center pr-3 text-sm leading-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </label>
            <label className="relative block">
              <span className="text-neutral-800 dark:text-neutral-200">
                {t("form.confirmPassword")}
              </span>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="mt-1 pr-10"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 mt-6 flex items-center pr-3 text-sm leading-5"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </label>
            <ButtonPrimary
              type="submit"
              disabled={isLoading}
              className={""}
              loading={isLoading}
            >
              {isLoading ? t("form.submitting") : t("form.submitButton")}
            </ButtonPrimary>
          </form>

          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            {t("links.alreadyHaveAccount")}{" "}
            <Link href="/login" className="font-semibold underline">
              {t("links.signIn")}
            </Link>
          </span>
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            {t("links.forgotPassword")}{" "}
            <button
              onClick={() => setForgotPasswordMode(true)}
              className="font-semibold underline"
            >
              {t("links.resetPassword")}
            </button>
          </span>
        </>
      ) : (
        <form
          className="grid grid-cols-1 gap-6"
          onSubmit={handleForgotPassword}
        >
          {error && <div className="text-sm text-red-500">{error}</div>}
          {resetEmailSent ? (
            <div className="text-center">
              <p className="mb-4 text-xl font-semibold">
                {t("forgotPassword.successTitle")}
              </p>
              <p>{t("forgotPassword.successMessage")}</p>
            </div>
          ) : (
            <>
              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                  {t("form.emailOrPhone")}
                </span>
                <Input
                  type="text"
                  name="emailOrPhone"
                  placeholder={t("form.emailOrPhonePlaceholder")}
                  className="mt-1"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  required
                />
              </label>
              <ButtonPrimary
                type="submit"
                disabled={isLoading}
                className={""}
                loading={false}
              >
                {isLoading
                  ? t("forgotPassword.submitting")
                  : t("forgotPassword.submitButton")}
              </ButtonPrimary>
            </>
          )}
        </form>
      )}
      {forgotPasswordMode && (
        <span className="block text-center text-neutral-700 dark:text-neutral-300">
          <button
            onClick={() => setForgotPasswordMode(false)}
            className="font-semibold underline"
          >
            {t("links.backToSignup")}
          </button>
        </span>
      )}
    </div>
  );
};

export default SignUpForm;
