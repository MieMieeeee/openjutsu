import { useEffect, useLayoutEffect, useState } from "react";
import { detectLang, getLang, initLang, listeners, setLang, t, type Lang } from "./i18n-core.ts";

export { detectLang, getLang, initLang, setLang, t, type Lang };

// Subscribe the app root: on a language change it re-renders, and the whole tree follows.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useLangSync(): Lang {
  const [current, setCurrent] = useState(getLang());
  useIsoLayoutEffect(() => {
    setCurrent(initLang());
    const listener = () => setCurrent(getLang());
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);
  return current;
}
