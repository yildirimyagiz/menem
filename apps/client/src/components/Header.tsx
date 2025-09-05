import { BellIcon } from "@radix-ui/react-icons";
import { Button } from "@reservatior/ui/button";

import { useAuth } from "~/hooks/use-auth";
import { UserAvatarMenu } from "./UserAvatarMenu";

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">Property Manager</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <BellIcon className="h-4 w-4" />
        </Button>
        <UserAvatarMenu />
      </div>
    </header>
  );
}
