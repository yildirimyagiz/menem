"use client";

import type { FC } from "react";
import React, { useState } from "react";
import Link from "next/link";

import ButtonPrimary from "../../../../shared/ButtonPrimary";
import Input from "../../../../shared/Input";

const ForgotPassword: FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrPhone }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error ?? "An error occurred. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mb-24 lg:mb-32">
      <h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
        Forgot Password
      </h2>
      <div className="mx-auto max-w-md space-y-6">
        {!success ? (
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            {error && <div className="text-sm text-red-500">{error}</div>}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address or Phone number
              </span>
              <Input
                type="text"
                placeholder="example@example.com or +1234567890"
                className="mt-1"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
              />
            </label>
            <ButtonPrimary
              sizeClass="px-6 py-3 lg:px-8 lg:py-4 rounded-xl"
              fontSize="text-sm sm:text-base lg:text-lg font-medium"
              type="submit"
              className="rounded-xl px-6 py-3 lg:px-8 lg:py-4"
              loading={isLoading}
            >
              {isLoading ? "Sending..." : "Reset Password"}
            </ButtonPrimary>
          </form>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-xl font-semibold">
              Check your email or phone
            </p>
            <p>
              If an account exists, we have sent password reset instructions.
            </p>
          </div>
        )}
        <div className="text-center text-neutral-700 dark:text-neutral-300">
          <Link href="/login" className="font-semibold underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
