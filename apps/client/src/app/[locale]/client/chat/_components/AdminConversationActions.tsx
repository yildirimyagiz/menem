import React from "react";
import { MoreHorizontal, Trash2, Archive, VolumeX, CheckCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@reservatior/ui/dropdown-menu";
import { Button } from "@reservatior/ui/button";

export interface AdminConversationActionsProps {
  onDelete: () => void;
  onArchive: () => void;
  onMute: () => void;
  onResolve: () => void;
}

export function AdminConversationActions({ onDelete, onArchive, onMute, onResolve }: AdminConversationActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Admin actions">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onArchive}>
          <Archive className="mr-2 h-4 w-4 text-gray-500" /> Archive
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onMute}>
          <VolumeX className="mr-2 h-4 w-4 text-gray-500" /> Mute
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onResolve}>
          <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Resolve
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
