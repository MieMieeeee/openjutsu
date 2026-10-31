import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { setLang, t } from "../lib/i18n-core.ts";
import { zh } from "../lib/i18n-zh.ts";

const UI_FILES = [
  "../components/openjutsu.tsx",
  "../components/welcome.tsx",
  "../components/from-picture.tsx",
  "../components/object-placement.tsx",
  "../components/lang-switch.tsx",
];

// Non-translatable strings that appear inside t(...) calls: enum values compared there, join separators.
const ALLOWED = new Set([
  "object", "simple", "advanced", "post", "face", "color", "change", "add", "remove", "background", "picture",
  "montage", "advanced_maxq", "mask", "fit", "people", "canceled", "succeeded", "expired", "solar", "h3",
  "width", "height", "h3_oneclick_edit", "h3_oneclick_swap", "openjutsu_face", "openjutsu_color", ", ",
]);

// Collects every double-quoted string literal inside t(...) calls, tracking bracket depth and skipping template literals.
function stringsInsideTCalls(source: string): string[] {
  const out: string[] = [];
  for (const m of source.matchAll(/(?<![A-Za-z$.])t\(/g)) {
    let depth = 1;
    let i = m.index + m[0].length;
    while (i < source.length && depth > 0) {
      const c = source[i];
      if (c === "(") depth++;
      else if (c === ")") depth--;
      else if (c === "`") { i = source.indexOf("`", i + 1); if (i < 0) break; }
      else if (c === '"') {
        let j = i + 1;
        let key = "";
        while (j < source.length && source[j] !== '"') {
          if (source[j] === "\\") { key += source[j] + source[j + 1]; j += 2; }
          else key += source[j++];
        }
        if (key) out.push(key);
        i = j;
      }
      i++;
    }
  }
  return out;
}

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

test("every string shown through t() has a Chinese entry", () => {
  const missing: string[] = [];
  for (const file of UI_FILES) {
    for (const key of stringsInsideTCalls(read(file))) {
      if (!ALLOWED.has(key) && !Object.hasOwn(zh, key)) missing.push(`${file}: ${key}`);
    }
  }
  assert.deepEqual(missing, []);
});

test("zh entries are non-empty and keep the {n} placeholders", () => {
  const placeholders = (text: string) => new Set([...text.matchAll(/\{(\d+)\}/g)].map((m) => m[1]));
  for (const [key, value] of Object.entries(zh)) {
    assert.ok(value.length > 0, `empty zh entry for: ${key}`);
    assert.deepEqual(placeholders(value), placeholders(key), `placeholder mismatch for: ${key}`);
  }
});

test("t() falls back to English and interpolates in both languages", () => {
  setLang("en");
  assert.equal(t("Not in the dictionary"), "Not in the dictionary");
  assert.equal(t("Add a video and {0}.", ["a character photo"]), "Add a video and a character photo.");
  setLang("zh");
  assert.equal(t("Generate"), "生成");
  assert.equal(t("Add a video and {0}.", ["a character photo"]), "请添加视频并a character photo。");
  assert.equal(t("Still not translated"), "Still not translated");
  assert.equal(t(" · step {0}/{1}", [2, 6]), " · 步数 2/6");
  setLang("en");
});
