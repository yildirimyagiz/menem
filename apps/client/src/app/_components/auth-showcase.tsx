import type { Session } from "next-auth";
import { getTranslations } from "next-intl/server";

import { auth as rawAuth, signIn, signOut } from "@reservatior/auth";
import { Button } from "@reservatior/ui/button";

// Typecast auth to the correct type
const auth = rawAuth as () => Promise<Session | null>;

export async function AuthShowcase() {
  const t = await getTranslations("Auth");
  const session = await auth();

  if (!session) {
    return (
      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await signIn("google");
          }}
        >
          {t("signIn")}
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>
          {t("welcomeBack", {
            name: session.user.name ?? session.user.image ?? "Guest",
          })}
        </span>
      </p>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await signOut();
          }}
        >
          {t("signOut")}
        </Button>
      </form>
    </div>
  );
}
