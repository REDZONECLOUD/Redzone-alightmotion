import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/bulk-status.js";

function response() {
  return {
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

async function statusFor(payload) {
  const originalFetch = globalThis.fetch;
  process.env.AM_TOKEN = "test-am-token";
  process.env.ZNN_ACCESS_TOKEN = "test-access-token";
  globalThis.fetch = async () => new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
  const res = response();
  try {
    await handler({ method: "GET" }, res);
    return res;
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("returns finite daily quota fields only", async () => {
  const res = await statusFor({ status: true, data: {
    bulk_max: 25,
    bulk_remaining_today: 7,
    unlimited_daily: false,
    token: "must-not-leak"
  }});
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    status: true,
    bulk_max: 25,
    bulk_remaining_today: 7,
    unlimited_daily: false
  });
});

test("supports unlimited daily quota", async () => {
  const res = await statusFor({ status: true, bulk_max: 40, unlimited_daily: true });
  assert.equal(res.body.bulk_max, 40);
  assert.equal(res.body.bulk_remaining_today, null);
  assert.equal(res.body.unlimited_daily, true);
});

test("preserves remaining zero", async () => {
  const res = await statusFor({ status: true, bulk_max: 10, bulk_remaining_today: 0, unlimited_daily: false });
  assert.equal(res.body.bulk_remaining_today, 0);
});
