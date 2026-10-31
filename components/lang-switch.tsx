"use client";

import { getLang, setLang, t, type Lang } from "../lib/i18n.ts";

const LANGS: { id: Lang; label: string }[] = [{ id: "en", label: "English" }, { id: "zh", label: "中文" }];

export function LangSwitch() {
  const current = getLang();
  return (
    <div className="segmented lang-switch" role="group" aria-label={t("Language")}>
      {LANGS.map((l) => (
        <button key={l.id} className={l.id === current ? "on" : ""} aria-pressed={l.id === current} onClick={() => setLang(l.id)}>{l.label}</button>
      ))}
    </div>
  );
}
