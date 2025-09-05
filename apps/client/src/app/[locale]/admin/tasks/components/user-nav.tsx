import { useState } from "react";
import { Plus, Settings2, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@reservatior/ui/avatar";
import { Button } from "@reservatior/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";

interface UserNavProps {
  followers: { name: string; image?: string }[];
}

export function UserNav({ followers }: UserNavProps) {
  const maxVisible = 4;
  const visibleFollowers = followers.slice(0, maxVisible);
  const extraCount = followers.length - maxVisible;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-1 rounded-full px-2 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/30"
        >
          <div className="flex items-center -space-x-3">
            {visibleFollowers.map((follower, idx) => (
              <Avatar
                key={follower.name + idx}
                className="h-8 w-8 border-2 border-white bg-gradient-to-br from-blue-200 to-blue-400 text-xs font-bold shadow-md dark:border-slate-900"
              >
                {follower.image ? (
                  <AvatarImage src={follower.image} alt={follower.name} />
                ) : (
                  <AvatarFallback>
                    {follower.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                )}
              </Avatar>
            ))}
            {extraCount > 0 && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/60 dark:text-blue-200">
                +{extraCount}
              </span>
            )}
          </div>
          <Users className="ml-2 h-4 w-4 text-blue-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="flex items-start gap-3 p-3">
          <Users className="mt-0.5 h-4 w-4 text-blue-500" />
          <div className="flex flex-col">
            <span className="font-medium">View all team members</span>
            <span className="text-xs text-muted-foreground">
              See complete team list
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-start gap-3 p-3">
          <Plus className="mt-0.5 h-4 w-4 text-green-500" />
          <div className="flex flex-col">
            <span className="font-medium">Add team member</span>
            <span className="text-xs text-muted-foreground">
              Invite new member to team
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-start gap-3 p-3">
          <Settings2 className="mt-0.5 h-4 w-4 text-gray-500" />
          <div className="flex flex-col">
            <span className="font-medium">Manage team</span>
            <span className="text-xs text-muted-foreground">
              Edit roles and permissions
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
