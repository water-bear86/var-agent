import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the VAR Agent monitoring console", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>VAR Agent/);
  assert.match(
    html,
    /Catch the market move before the score catches up\./,
  );
  assert.match(html, /MARKET SUSPENDED/);
  assert.match(html, /Signal packet/);
  assert.match(html, /GET \/api\/signal\/latest/);
  assert.match(html, /deterministic anomaly replay/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("keeps source secrets out of rendered HTML", async () => {
  const response = await render();
  const html = await response.text();
  assert.doesNotMatch(html, /TXODDS_API_TOKEN/);
  assert.doesNotMatch(html, /Bearer\s+[A-Za-z0-9._-]+/);
});
