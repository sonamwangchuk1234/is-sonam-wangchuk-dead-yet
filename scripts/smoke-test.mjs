import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFile(resolve(root, path), "utf8");

const html = await read("index.html");
const css = await read("styles.css");
const js = await read("app.js");
const sourceData = JSON.parse(await read("data/sources.json"));

for (const path of ["index.html", "styles.css", "app.js", "data/sources.json", ".nojekyll"]) {
  await access(resolve(root, path));
}

assert.match(html, /<title>Is Sonam Wangchuk Dead Yet\?/);
assert.match(html, /PARODY \/ SATIRE/);
assert.match(html, /does not predict, wish for, or celebrate injury or death/i);
assert.match(html, /Calling it “LARPing” is this page’s satirical opinion/i);
assert.match(html, /id="receipts"/);
assert.match(html, /id="fine-print"/);
assert.match(html, /github\.com\/sonamwangchuk1234/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /@media \(max-width: 700px\)/);
assert.match(js, /const FAST_START = "2026-06-28"/);
assert.match(js, /const STATUS_DATE = "2026-07-16T03:13:57Z"/);
assert.equal(sourceData.status.alive, true);
assert.equal(sourceData.status.fast_day_inclusive, 19);
assert.equal(sourceData.sources.length, 5);

const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
const duplicateIds = [...ids].filter((id) => html.match(new RegExp(`\\bid="${id}"`, "g")).length > 1);
assert.deepEqual(duplicateIds, [], `duplicate IDs: ${duplicateIds.join(", ")}`);

for (const href of [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1])) {
  if (href.startsWith("#")) assert(ids.has(href.slice(1)), `missing anchor target: ${href}`);
  if (!href.startsWith("http") && !href.startsWith("#")) {
    const relative = href.split("?")[0];
    await access(resolve(root, relative));
  }
}

for (const src of [...html.matchAll(/src="([^"]+)"/g)].map((match) => match[1])) {
  const relative = src.split("?")[0];
  await access(resolve(root, relative));
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

console.log(`smoke-test: PASS (${ids.size} IDs, ${sourceData.sources.length} sources, fast day ${calculatedDay})`);
