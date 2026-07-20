import type { ProbabilityPoint, SignalPacket } from "./types";

export const SHOCK_THRESHOLD_POINTS = 8;
export const SHOCK_WINDOW_SECONDS = 9;

type DetectionOptions = {
  fixtureId: number;
  market: string;
  observedAt: string;
  accessTransaction: string;
};

export function detectProbabilityShock(
  points: ProbabilityPoint[],
  options: DetectionOptions,
): SignalPacket | null {
  if (points.length < 2) return null;

  const current = points.at(-1)!;
  const earliestSecond = current.second - SHOCK_WINDOW_SECONDS;
  const baseline =
    points.find((point) => point.second >= earliestSecond) ?? points[0];
  const delta = roundOne(current.home - baseline.home);

  if (Math.abs(delta) < SHOCK_THRESHOLD_POINTS) return null;

  const scoreUnchanged = baseline.score === current.score;
  const trigger = current.suspended
    ? "market_suspended"
    : scoreUnchanged
      ? "score_feed_lag"
      : "probability_shock";
  const confidence = Math.min(
    99,
    Math.round(
      50 +
        Math.abs(delta) * 1.85 +
        (current.suspended ? 10 : 0) +
        (scoreUnchanged ? 5 : 0),
    ),
  );

  return {
    event_id: `evt_${options.fixtureId}_${current.second}`,
    fixture_id: options.fixtureId,
    market: options.market,
    trigger,
    probability_before: baseline.home,
    probability_after: current.home,
    probability_delta: delta,
    window_seconds: current.second - baseline.second,
    score_feed: current.score,
    confidence,
    observed_at: options.observedAt,
    source: "txodds_replay",
    access_proof: {
      network: "solana-devnet",
      program: "6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J",
      transaction: options.accessTransaction,
      kind: "txodds_subscription",
    },
  };
}

function roundOne(value: number): number {
  return Math.round(value * 10) / 10;
}
