import React from "react";
import { NextIntlClientProvider } from "next-intl";

import DropdownTravelers from "~/app/[locale]/(client-components)/(Header)/DropdownTravelers";
import { NAVIGATION_DEMO } from "~/data/navigation";
import NavigationItem from "./NavigationItem";

interface NavigationProps {
  locale: string;
  messages: any;
}

function Navigation({ locale, messages }: NavigationProps) {
  console.log("Navigation Items:", NAVIGATION_DEMO);

  return (
    <ul className="nc-Navigation relative hidden lg:flex lg:flex-wrap lg:space-x-1">
      <NextIntlClientProvider locale={locale} messages={messages}>
        <DropdownTravelers />
      </NextIntlClientProvider>
      {NAVIGATION_DEMO.map((item) => (
        <NavigationItem key={item.id} menuItem={item} />
      ))}
    </ul>
  );
}

export default Navigation;
