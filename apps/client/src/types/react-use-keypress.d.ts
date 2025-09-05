declare module "react-use-keypress" {
  import { useEffect } from "react";

  type KeyHandler = (event: KeyboardEvent) => void;
  type KeyFilter = string | string[] | ((event: KeyboardEvent) => boolean);

  function useKeypress(
    keyFilter: KeyFilter,
    callback: KeyHandler,
    options?: {
      targetKey?: string;
      event?: "keydown" | "keyup" | "keypress";
      target?: EventTarget | null;
    },
  ): void;

  export = useKeypress;
}
