export type Lang = "en" | "zh";
export const LANG_KEY = "openjutsu.lang";

import { zh } from "./i18n-zh.ts";

let lang: Lang = "en";
export const listeners = new Set<() => void>();

// First visit follows the browser language; the choice is remembered in localStorage.
export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "zh" || saved === "en") return saved;
  } catch {}
  try {
    if ((navigator.language ?? "en").toLowerCase().startsWith("zh")) return "zh";
  } catch {}
  return "en";
}

function applyLang(next: Lang): Lang {
  lang = next;
  try { document.documentElement.lang = next === "zh" ? "zh-CN" : "en"; } catch {}
  return next;
}

// Called once from the app root after mount; a layout effect applies it before the first paint.
export function initLang(): Lang {
  return applyLang(detectLang());
}

export function getLang(): Lang {
  return lang;
}

export function setLang(next: Lang) {
  applyLang(next);
  try { localStorage.setItem(LANG_KEY, next); } catch {}
  for (const listener of listeners) listener();
}

// The English text is the key: a missing entry falls back to the text itself.
// {0}, {1}, … are replaced by the args; without args the text is left untouched.
export function t(key: string, args?: (string | number)[]): string {
  let text = lang === "zh" ? zh[key] ?? key : key;
  if (args) for (let i = 0; i < args.length; i++) text = text.replaceAll(`{${i}}`, String(args[i]));
  return text;
}
