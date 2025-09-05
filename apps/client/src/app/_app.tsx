import type { AppProps } from "next/app";
import Script from "next/script";

import { ChatProvider } from "~/context/ChatContext";

import "~/app/global.css"; // Consolidated global stylesheet

import { ChatBalloon } from "~/components/ChatBalloon";
import { env } from "~/env";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive"
      />
      <ChatProvider>
        <Component {...pageProps} />
        <ChatBalloon />
      </ChatProvider>
    </>
  );
}

export default MyApp;
