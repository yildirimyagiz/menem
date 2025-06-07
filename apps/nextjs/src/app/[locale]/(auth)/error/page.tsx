import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const t = useTranslations("auth.error");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = t("somethingWentWrong");
  
  if (error === "OAuthAccountNotLinked") {
    errorMessage = t("oauthAccountNotLinked");
  } else if (error === "OAuthCallback") {
    errorMessage = t("oauthCallbackError");
  } else if (error === "OAuthCreateAccount") {
    errorMessage = t("oauthCreateAccountError");
  } else if (error === "OAuthSignin") {
    errorMessage = t("oauthSignInError");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("title")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {errorMessage}
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/login"
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
