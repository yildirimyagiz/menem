import React, { useEffect, useState } from "react";

import type { User } from "@reservatior/validators";

import StartRating from "~/app/_components/StartRating";
import Avatar from "~/shared/Avatar";
import SocialsList from "~/shared/SocialsList";
import { api } from "~/trpc/react"; // Import the TRPC API

interface UserSidebarProps {
  userId: string; // Expecting userId as a prop to fetch user data
}

const UserSidebar: React.FC<UserSidebarProps> = ({ userId }) => {
  const {
    data: user,
    isLoading,
    isError,
  } = api.user.byId.useQuery({ id: userId });

  if (isLoading) return <p>Loading user data...</p>;
  if (isError) return <p>Error: Failed to load user data</p>;

  return (
    <div className="flex w-full flex-col items-center space-y-6 border-neutral-200 px-0 text-center dark:border-neutral-700 sm:space-y-7 sm:rounded-2xl sm:border sm:p-6 xl:p-8">
      <Avatar
        hasChecked={user?.role === "AGENCY" || user?.role === "AGENT"}
        hasCheckedClass="w-6 h-6 -top-0.5 right-2"
        sizeClass="w-28 h-28 text-3xl"
        imgUrl={user?.profilePicture || user?.image || ""}
      />

      <div className="flex flex-col items-center space-y-3 text-center">
        <h2 className="text-3xl font-semibold">
          {user?.displayName || user?.name || user?.firstName || "Anonymous"}
        </h2>
        <StartRating className="!text-base" rating={4.5} />
        {user?.role && (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {user.role.replace("_", " ")}
          </span>
        )}
      </div>

      <p className="text-neutral-500 dark:text-neutral-400">
        {user?.role ? `${user.role.replace("_", " ")}` : "User"}
      </p>

      <SocialsList
        className="!space-x-3"
        itemClass="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl"
      />

      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

      <div className="space-y-4">
        {user?.email && (
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-neutral-6000 dark:text-neutral-300">
              {user.email}
            </span>
          </div>
        )}

        {user?.phoneNumber && (
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="text-neutral-6000 dark:text-neutral-300">
              {user.phoneNumber}
            </span>
          </div>
        )}

        {user?.createdAt && (
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-neutral-6000 dark:text-neutral-300">
              Joined in{" "}
              {new Date(user.createdAt).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        {user?.lastLogin && (
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-neutral-6000 dark:text-neutral-300">
              Last active{" "}
              {new Date(user.lastLogin).toLocaleString("default", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSidebar;
