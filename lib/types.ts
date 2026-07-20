export type ProbabilityPoint = {
  second: number;
  label: string;
  home: number;
  draw: number;
  away: number;
  score: string;
  suspended?: boolean;
};

export type SignalKind =
  | "market_suspended"
  | "probability_shock"
  | "score_feed_lag";

export type SignalPacket = {
  event_id: string;
  fixture_id: number;
  market: string;
  trigger: SignalKind;
  probability_before: number;
  probability_after: number;
  probability_delta: number;
  window_seconds: number;
  score_feed: string;
  confidence: number;
  observed_at: string;
  source: "txodds_replay";
  access_proof: {
    network: "solana-devnet";
    program: string;
    transaction: string;
    kind: "txodds_subscription";
  };
};

export type EvidenceRow = {
  time: string;
  signal: string;
  tone: "danger" | "warning" | "info";
  market: string;
  delta: string;
  score: string;
  confidence: number;
  proof: string;
};

export type FeedStatus = {
  connected: boolean;
  source: "txodds-devnet" | "replay";
  fixtureCount: number;
  checkedAt: string;
  fixtures: Array<{
    id: number;
    competition: string;
    home: string;
    away: string;
    startsAt: string;
  }>;
  message?: string;
};
