"use client";

import { useState } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

import { Button } from "@reservatior/ui/button";

import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface TaskFollowButtonProps {
  taskId: string;
  isFollowing: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  showText?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function TaskFollowButton({
  taskId,
  isFollowing: initialIsFollowing,
  className = "",
  size = "default",
  variant = "outline",
  showText = false,
  onFollowChange,
}: TaskFollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const utils = api.useUtils();

  const followMutation = api.tasks.follow.useMutation({
    onSuccess: () => {
      setIsFollowing(true);
      onFollowChange?.(true);
      toast({
        title: "Task followed",
        description:
          "You are now following this task and will receive updates.",
        variant: "default",
      });
      // Invalidate all task-related queries to refresh the UI
      void utils.tasks.invalidate();
    },
    onError: (error: { message: string }) => {
      toast({
        title: "Failed to follow task",
        description:
          error.message || "An error occurred while following the task.",
        variant: "destructive",
      });
    },
  });

  const unfollowMutation = api.tasks.unfollow.useMutation({
    onSuccess: () => {
      setIsFollowing(false);
      onFollowChange?.(false);
      toast({
        title: "Task unfollowed",
        description: "You are no longer following this task.",
        variant: "default",
      });
      // Invalidate all task-related queries to refresh the UI
      void utils.tasks.invalidate();
    },
    onError: (error: { message: string }) => {
      toast({
        title: "Failed to unfollow task",
        description:
          error.message || "An error occurred while unfollowing the task.",
        variant: "destructive",
      });
    },
  });

  const handleToggleFollow = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isFollowing) {
        await unfollowMutation.mutateAsync({
          taskId,
          userId: "", // Will be set by the server from session
        });
      } else {
        await followMutation.mutateAsync({
          taskId,
          userId: "", // Will be set by the server from session
        });
      }
    } catch (error) {
      // Error handling is done in mutation callbacks
      console.error("Follow/Unfollow error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      return isFollowing ? "Unfollowing..." : "Following...";
    }
    return isFollowing ? "Unfollow" : "Follow";
  };

  const getIcon = () => {
    if (isLoading) {
      return (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      );
    }
    return isFollowing ? (
      <HeartSolidIcon className="h-4 w-4 text-red-500" />
    ) : (
      <HeartIcon className="h-4 w-4" />
    );
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFollow}
      disabled={isLoading}
      className={`transition-all duration-200 hover:scale-105 ${
        isFollowing
          ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
          : ""
      } ${className}`}
      aria-label={isFollowing ? "Unfollow task" : "Follow task"}
    >
      {getIcon()}
      {showText && <span className="ml-2">{getButtonText()}</span>}
    </Button>
  );
}

export default TaskFollowButton;
