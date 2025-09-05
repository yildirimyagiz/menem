"use client";

import type { FC } from "react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

import facebookSvg from "~/images/Facebook.svg";
import googleSvg from "~/images/Google.svg";
import twitterSvg from "~/images/Twitter.svg";
import ButtonPrimary from "~/shared/ButtonPrimary";
import Input from "~/shared/Input";
import { api } from "~/trpc/react";

export interface PageSignUpProps {}

const loginSocials = [
  { name: "Continue with Facebook", provider: "facebook", icon: facebookSvg },
  { name: "Continue with Twitter", provider: "twitter", icon: twitterSvg },
  { name: "Continue with Google", provider: "google", icon: googleSvg },
];

const PageSignUp: FC<PageSignUpProps> = () => {
  const router = useRouter();
  const t = useTranslations("signupPage");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isEmailSignup, setIsEmailSignup] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const signUpMutation = api.auth.signUp.useMutation({
    onSuccess: () => {
      setSuccess(t("success.signupSuccessful"));
      setTimeout(() => router.push("/auth/login"), 1500);
    },
    onError: (err: { message: string }) => {
      const errorMessage = err.message || t("error.signupFailed");
      setError(errorMessage);
      console.error("Signup error:", err);
    },
  });

  useEffect(() => {
    // Sync state with localStorage if necessary
    setEmail(localStorage.getItem("email") || "");
    setUserName(localStorage.getItem("userName") || "");
    setPhoneNumber(localStorage.getItem("phoneNumber") || "");
    setIsEmailSignup(localStorage.getItem("isEmailSignup") === "true");
    setShowPassword(localStorage.getItem("showPassword") === "true");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (isEmailSignup && !email) {
        setError(t("error.emailRequired"));
        setIsLoading(false);
        return;
      }

      // Create signup data with proper types
      const signUpData = {
        email: isEmailSignup ? email : "", // Provide empty string as fallback
        password,
        phone: !isEmailSignup ? phoneNumber : undefined,
        userName, // Note: if userName is required by the API, make sure it's included
      };

      console.log("Attempting to sign up with:", signUpData);
      await signUpMutation.mutateAsync(signUpData);
    } catch (err) {
      console.error("Signup error:", err);
      // Error handling is done in the mutation's onError callback
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await signIn(provider, {
        callbackUrl: "/management",
        redirect: false,
      });

      if (result?.error) {
        setError(
          t("error.socialSignupFailed", { provider, error: result.error }),
        );
        console.error(`${provider} sign-up error:`, result.error);
        return;
      }

      // Success case - handle the redirect
      if (result?.url) {
        await router.replace(result.url);
      }
    } catch (err) {
      console.error(`${provider} sign-up error:`, err);
      setError(t("error.signupFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`nc-PageSignUp`}>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
          {t("pageTitle")}
        </h2>
        <div className="mx-auto max-w-md space-y-6">
          {error && <div className="text-center text-red-500">{error}</div>}
          {success && (
            <div className="text-center text-green-500">{success}</div>
          )}
          <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSocialSignIn(item.provider)}
                disabled={isLoading}
                className="nc-will-change-transform bg-primary-50 flex w-full transform rounded-lg px-4 py-3 transition-transform hover:translate-y-[-2px] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 sm:px-6"
              >
                {isLoading ? (
                  <div className="flex-grow text-center">{t("loading")}</div>
                ) : (
                  <>
                    <Image
                      className="flex-shrink-0"
                      src={item.icon}
                      alt={t(`social.${item.provider}`)}
                      width={24}
                      height={24}
                    />
                    <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                      {t(`social.${item.provider}`)}
                    </h3>
                  </>
                )}
              </button>
            ))}
          </div>
          <div className="relative text-center">
            <span className="relative z-10 inline-block bg-white px-4 text-sm font-medium dark:bg-neutral-900 dark:text-neutral-400">
              {t("or")}
            </span>
            <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 transform border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          <div className="mb-4 flex justify-center space-x-4">
            <button
              className={`rounded px-4 py-2 ${isEmailSignup ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setIsEmailSignup(true)}
            >
              {t("emailTab")}
            </button>
            <button
              className={`rounded px-4 py-2 ${!isEmailSignup ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setIsEmailSignup(false)}
            >
              {t("phoneTab")}
            </button>
          </div>
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                {t("username")}
              </span>
              <Input
                type="text"
                placeholder={t("usernamePlaceholder")}
                className="mt-1"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </label>
            {isEmailSignup ? (
              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                  {t("email")}
                </span>
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            ) : (
              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                  {t("phone")}
                </span>
                <Input
                  type="text"
                  placeholder={t("phonePlaceholder")}
                  className="mt-1"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </label>
            )}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                {t("password")}
              </span>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("passwordPlaceholder")}
                  className="mt-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 transform"
                  aria-label={
                    showPassword ? t("hidePassword") : t("showPassword")
                  }
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </label>
            <ButtonPrimary type="submit" className="w-full" loading={isLoading}>
              {t("submitButton")}
            </ButtonPrimary>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
