import type { AppProps } from "next/app";

import { ChatProvider } from "~/context/ChatContext";

import "@/styles/globals.css"; // Adjust if your global styles are elsewhere

import { ChatBalloon } from "~/components/ChatBalloon";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChatProvider>
      <Component {...pageProps} />
      <ChatBalloon />
    </ChatProvider>
  );
}

export default MyApp;
