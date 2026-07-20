import assert from "node:assert/strict";
import test from "node:test";
import { replayPoints, TXODDS_ACCESS_TRANSACTION } from "../lib/replay";
import { detectProbabilityShock } from "../lib/signals";

const options = {
  fixtureId: 42,
  market: "Home win",
  observedAt: "2026-07-19T03:14:14.000Z",
  accessTransaction: TXODDS_ACCESS_TRANSACTION,
};

test("does not emit a signal below the configured threshold", () => {
  const signal = detectProbabilityShock(replayPoints.slice(0, 9), options);
  assert.equal(signal, null);
});

test("detects a suspended market shock without inventing a score", () => {
  const signal = detectProbabilityShock(replayPoints.slice(0, 10), options);
  assert.ok(signal);
  assert.equal(signal.trigger, "market_suspended");
  assert.equal(signal.probability_delta, 14.3);
  assert.equal(signal.window_seconds, 9);
  assert.equal(signal.score_feed, "0–0");
  assert.equal(signal.source, "txodds_replay");
  assert.equal(signal.access_proof.kind, "txodds_subscription");
});
