import { detectProbabilityShock } from "./signals";
import type { EvidenceRow, ProbabilityPoint } from "./types";

export const TXODDS_ACCESS_TRANSACTION =
  "28vVQhFjPGiC8xx2a5tmBeJdyFSMcZ28XAVXAq8LinpTbbqkqjdDubfrjN5ZgLiTkm2qaG9RYbkvbA2hYDGC5SiJ";

export const replayPoints: ProbabilityPoint[] = [
  { second: 4650, label: "77:30", home: 34.2, draw: 25.8, away: 40, score: "0–0" },
  { second: 4655, label: "77:35", home: 35.1, draw: 25.5, away: 39.4, score: "0–0" },
  { second: 4660, label: "77:40", home: 34.8, draw: 25.2, away: 40, score: "0–0" },
  { second: 4665, label: "77:45", home: 36.3, draw: 25.1, away: 38.6, score: "0–0" },
  { second: 4670, label: "77:50", home: 37.2, draw: 24.9, away: 37.9, score: "0–0" },
  { second: 4675, label: "77:55", home: 39.4, draw: 24.2, away: 36.4, score: "0–0" },
  { second: 4680, label: "78:00", home: 41.8, draw: 23.1, away: 35.1, score: "0–0" },
  { second: 4685, label: "78:05", home: 42.8, draw: 23.8, away: 33.4, score: "0–0" },
  { second: 4690, label: "78:10", home: 42.8, draw: 24.3, away: 32.9, score: "0–0" },
  {
    second: 4694,
    label: "78:14",
    home: 57.1,
    draw: 24.8,
    away: 18.1,
    score: "0–0",
    suspended: true,
  },
  { second: 4700, label: "78:20", home: 58.4, draw: 23.9, away: 17.7, score: "1–0" },
  { second: 4710, label: "78:30", home: 59.1, draw: 23.5, away: 17.4, score: "1–0" },
  { second: 4720, label: "78:40", home: 58.7, draw: 23.8, away: 17.5, score: "1–0" },
  { second: 4730, label: "78:50", home: 58.2, draw: 24, away: 17.8, score: "1–0" },
];

export const replaySignal = detectProbabilityShock(replayPoints.slice(0, 10), {
  fixtureId: 20260719,
  market: "Argentina v France · 1X2 Home",
  observedAt: "2026-07-19T03:14:14.000Z",
  accessTransaction: TXODDS_ACCESS_TRANSACTION,
})!;

export const evidenceRows: EvidenceRow[] = [
  {
    time: "03:14:14",
    signal: "MARKET SUSPENDED",
    tone: "danger",
    market: "Argentina v France · 1X2 Home",
    delta: "+14.3",
    score: "0–0",
    confidence: replaySignal.confidence,
    proof: TXODDS_ACCESS_TRANSACTION,
  },
  {
    time: "03:12:10",
    signal: "PROBABILITY SHOCK",
    tone: "warning",
    market: "Brazil v Germany · 1X2 Home",
    delta: "+8.7",
    score: "1–1",
    confidence: 86,
    proof: TXODDS_ACCESS_TRANSACTION,
  },
  {
    time: "03:08:44",
    signal: "SCORE FEED LAG",
    tone: "info",
    market: "Spain v England · Match state",
    delta: "—",
    score: "1–0 · lag 18s",
    confidence: 71,
    proof: TXODDS_ACCESS_TRANSACTION,
  },
  {
    time: "03:05:31",
    signal: "PROBABILITY SHOCK",
    tone: "warning",
    market: "Netherlands v Portugal · 1X2 Home",
    delta: "+6.2",
    score: "0–0",
    confidence: 78,
    proof: TXODDS_ACCESS_TRANSACTION,
  },
];
