import React from "react";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import {
  HiOutlineChatAlt2,
  HiOutlineMail,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";

export default function SupportHome() {
  // Dummy data for avatars and recent message
  const avatars = [
    "/avatar1.png", // Replace with your avatar images or use initials
    "/avatar2.png",
    "/avatar3.png",
  ];
  const agent = {
    name: "Rizza",
    avatar: "/avatar1.png", // Replace with actual avatar or use initials
    message: "okay, may be I can set it up for myse...",
    timeAgo: "2m ago",
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FFE7D0]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-primary">
            Reservatior
          </span>
        </div>
        {/* Avatars */}
        <div className="flex -space-x-2">
          {avatars.map((src, i) => (
            <div
              key={i}
              className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-gray-200"
            >
              <img
                src={src}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Greeting */}
      <div className="px-6 pb-2 pt-8">
        <h1 className="mb-1 flex items-center gap-2 text-3xl font-bold text-gray-900">
          Hi <span className="text-2xl">👋</span>
        </h1>
        <h2 className="text-3xl font-bold text-gray-900">How can we help?</h2>
      </div>

      {/* Recent message card */}
      <div className="mt-6 px-4">
        <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
            <img
              src={agent.avatar}
              alt={agent.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 text-base font-semibold text-gray-900">
              Recent message
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm text-gray-700">
                {agent.message}
              </span>
            </div>
            <div className="mt-0.5 text-xs text-gray-400">
              {agent.name} • {agent.timeAgo}
            </div>
          </div>
          <FiArrowRight className="text-xl text-gray-400" />
        </div>
      </div>

      {/* Action cards */}
      <div className="mt-4 flex flex-col gap-3 px-4">
        <button className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm">
          <span className="text-base font-medium text-gray-900">
            Send us a message
          </span>
          <FiArrowRight className="text-xl text-gray-400" />
        </button>
        <button className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm">
          <span className="text-base font-medium text-gray-900">
            Search for help
          </span>
          <FiSearch className="text-xl text-gray-400" />
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 z-10 flex h-16 w-full items-center justify-around border-t bg-white">
        <div className="flex flex-col items-center text-primary">
          <HiOutlineMail className="text-2xl" />
          <span className="mt-1 text-xs font-semibold">Home</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <HiOutlineChatAlt2 className="text-2xl" />
          <span className="mt-1 text-xs">Messages</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <HiOutlineQuestionMarkCircle className="text-2xl" />
          <span className="mt-1 text-xs">Help</span>
        </div>
      </nav>
    </div>
  );
}
