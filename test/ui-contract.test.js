import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
const css = await readFile(new URL("../style.css", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("only daily-limit errors open the quota promo in bulk error handling", () => {
  const daily = app.indexOf('code === "BULK_DAILY_LIMIT_EXCEEDED"');
  const maximum = app.indexOf('code === "BULK_MAX_EXCEEDED"');
  assert.ok(daily > -1 && maximum > daily);
  assert.match(app.slice(daily, maximum), /openBotOnlyModal\(\)/);
  assert.doesNotMatch(app.slice(maximum, app.indexOf("} else {", maximum)), /openBotOnlyModal\(\)/);
});

test("permanent promo and quota copy are present", () => {
  assert.match(html, /Bulk tanpa batas di WhatsApp/);
  assert.match(html, /Kuota Bulk Web Habis/);
  assert.match(html, /https:\/\/h4yperbot\.site/);
});

test("long inbox URLs are constrained without changing their value", () => {
  assert.match(css, /\.message-link-copy\s*\{[^}]*(?:min-width:\s*0;[^}]*max-width:\s*100%|max-width:\s*100%;[^}]*min-width:\s*0)/s);
  assert.match(css, /\.message-link-copy span\s*\{[^}]*max-width:\s*100%;[^}]*overflow:\s*hidden/s);
  assert.match(app, /open\.href = link/);
  assert.match(app, /copyText\(link, copyButton\)/);
});
