import React from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

import ButtonPrimary from "~/shared/ButtonPrimary";

// Translation constants for login buttons
const LOGIN_BUTTON_TRANSLATION_KEYS = {
  SIGN_IN_WITH_GOOGLE: "loginButton.signInWithGoogle",
  SIGN_IN_WITH_EMAIL: "loginButton.signInWithEmail",
};

const LoginButton: React.FC = () => {
  const t = useTranslations("loginButton");

  function signInWithGoogle(): void {
    void signIn("google");
  }

  return (
    <div className="mt-4 flex flex-col justify-center">
      <ButtonPrimary
        onClick={signInWithGoogle}
        className="mb-4"
        type={"button"}
        loading={false}
      >
        {t("signInWithGoogle")}
      </ButtonPrimary>
      <ButtonPrimary
        onClick={() => signIn("credentials")}
        className="mb-4"
        type={"button"}
        loading={false}
      >
        {t("signInWithEmail")}
      </ButtonPrimary>
    </div>
  );
};

export default LoginButton;
