import assert from "node:assert/strict";
import { readFile, access, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFile(resolve(root, path), "utf8");

const html = await read("index.html");
const css = await read("styles.css");
const js = await read("app.js");
const sourceData = JSON.parse(await read("data/sources.json"));

for (const path of ["index.html", "styles.css", "app.js", "assets/wangchuk-awkward-cot.webp", "assets/dipke-arrest-plea.webp", "data/sources.json", ".nojekyll"]) {
  await access(resolve(root, path));
}

assert.match(html, /<title>Is Sonam Wangchuk Dead Yet\?/);
assert.match(html, /styles\.css\?v=4/);
assert.match(html, /app\.js\?v=4/);
assert.match(html, /This is not a fan page/);
assert.match(html, /Samosas eaten by Dipke\*/);
assert.match(html, /SATIRE ONLY/);
assert.match(html, /Entirely invented metric/);
assert.match(html, /The samosa number and the arrest count/);
assert.match(html, /EDITORIAL POSITION/);
assert.match(html, /assets\/wangchuk-awkward-cot\.webp/);
assert.match(html, /Editorial cartoon of Sonam Wangchuk lying stiffly/);
assert.match(html, /assets\/dipke-arrest-plea\.webp/);
assert.match(html, /Editorial cartoon of Abhijeet Dipke kneeling/);
assert.match(html, /अभिजीत दिपके ने पुलिस से/);
assert.match(html, /“X” बार/);
assert.match(html, /कैमरा एंगल एफ़आईआर नहीं होता/);
assert.match(html, /पूर्णतः काल्पनिक व्यंग्य/);
assert.match(html, /arrest count, dialogue, and scene are fabricated/);
assert.match(html, /does not predict or celebrate injury or death/i);
assert.doesNotMatch(html, /Accountability\.exe/i);
assert.doesNotMatch(html, /\bbauna\b/i);
assert.match(css, /grid-template-columns: repeat\(19/);
assert.match(css, /prefers-reduced-motion/);
assert.match(js, /samosaCount: 404/);
assert.match(js, /samosaCountIsSatire: true/);
assert.equal(sourceData.status.alive, true);
assert.equal(sourceData.status.fast_day_inclusive, 19);
assert.equal(sourceData.sources.length, 5);

const streakDays = [...html.matchAll(/data-day="(\d{2})"/g)].map((match) => match[1]);
assert.equal(streakDays.length, 19);
assert.equal(streakDays.at(0), "01");
assert.equal(streakDays.at(-1), "19");

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, "duplicate IDs found");
const idSet = new Set(ids);
for (const href of [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1])) {
  if (href.startsWith("#")) assert(idSet.has(href.slice(1)), `missing anchor target: ${href}`);
  if (!href.startsWith("http") && !href.startsWith("#")) await access(resolve(root, href.split("?")[0]));
}
for (const src of [...html.matchAll(/src="([^"]+)"/g)].map((match) => match[1])) {
  await access(resolve(root, src.split("?")[0]));
}

const imagePaths = ["assets/wangchuk-awkward-cot.webp", "assets/dipke-arrest-plea.webp"];
const imageSizes = [];
for (const imagePath of imagePaths) {
  const imageStat = await stat(resolve(root, imagePath));
  assert(imageStat.size > 100_000, `${imagePath} unexpectedly small or missing`);
  assert(imageStat.size < 800_000, `${imagePath} is not web-optimized`);
  imageSizes.push(imageStat.size);
}

const publicText = `${html}\n${css}\n${js}\n${JSON.stringify(sourceData)}`;
assert.doesNotMatch(publicText, /\/home\/hermes|\/mnt\/[a-z]\//i);
assert.doesNotMatch(publicText, /\b(?:OpenAI|ChatGPT|Hermes Agent|AI-generated)\b/i);

const utcDay = (dateLike) => {
  const date = new Date(dateLike);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};
const calculatedDay = Math.floor((utcDay(sourceData.status.checked_at) - utcDay(sourceData.status.fast_start_date)) / 86_400_000) + 1;
assert.equal(calculatedDay, sourceData.status.fast_day_inclusive);

console.log(`smoke-test: PASS (${ids.length} IDs, ${streakDays.length} chart days, ${sourceData.sources.length} sources, images ${imageSizes.join("+")} bytes)`);
