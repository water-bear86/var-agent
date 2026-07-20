"use client";

import {
  Activity,
  AlertTriangle,
  Check,
  Code2,
  Copy,
  ExternalLink,
  Play,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  evidenceRows,
  replayPoints,
  replaySignal,
  TXODDS_ACCESS_TRANSACTION,
} from "../../lib/replay";
import type { FeedStatus } from "../../lib/types";
import { ProbabilityChart } from "./ProbabilityChart";

const solscanUrl = `https://solscan.io/tx/${TXODDS_ACCESS_TRANSACTION}?cluster=devnet`;

export function VarDashboard() {
  const shockIndex = replayPoints.findIndex((point) => point.suspended);
  const [activeIndex, setActiveIndex] = useState(shockIndex);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<"live" | "replay">("replay");
  const [feed, setFeed] = useState<FeedStatus | null>(null);
  const [copied, setCopied] = useState(false);
  const current = replayPoints[activeIndex];
  const showShock = activeIndex >= shockIndex;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/feed")
      .then((response) => response.json())
      .then((status: FeedStatus) => {
        if (!cancelled) setFeed(status);
      })
      .catch(() => {
        if (!cancelled) {
          setFeed({
            connected: false,
            source: "replay",
            fixtureCount: 0,
            checkedAt: new Date().toISOString(),
            fixtures: [],
            message: "Replay mode active.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (activeIndex >= replayPoints.length - 1) {
        setPlaying(false);
      } else {
        setActiveIndex((index) => index + 1);
      }
    }, activeIndex >= replayPoints.length - 1 ? 0 : 480);
    return () => window.clearTimeout(timer);
  }, [activeIndex, playing]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const packetJson = useMemo(
    () =>
      JSON.stringify(
        {
          event_id: replaySignal.event_id,
          market: replaySignal.market,
          trigger: replaySignal.trigger,
          probability_delta: replaySignal.probability_delta,
          observed_at: replaySignal.observed_at,
          score_feed: replaySignal.score_feed,
          confidence: replaySignal.confidence,
          proof: shortProof(TXODDS_ACCESS_TRANSACTION),
        },
        null,
        2,
      ),
    [],
  );

  function beginReplay() {
    setMode("replay");
    setActiveIndex(0);
    setPlaying(true);
  }

  async function copyPacket() {
    await navigator.clipboard.writeText(packetJson);
    setCopied(true);
  }

  return (
    <main className="dashboard">
      <div className="shell">
        <header className="topbar">
          <div className="brand-nav">
            <a className="brand" href="#monitor" aria-label="VAR Agent home">
              <strong>VAR</strong> Agent
            </a>
            <nav className="nav" aria-label="Primary navigation">
              <a href="#monitor">Monitor</a>
              <a href="#evidence">Evidence</a>
              <a href="#api">API</a>
            </nav>
          </div>

          <div className="mode-switch" aria-label="Signal mode">
            <button
              className={mode === "live" ? "active" : ""}
              onClick={() => setMode("live")}
              type="button"
            >
              LIVE
            </button>
            <button
              className={mode === "replay" ? "active" : ""}
              onClick={() => setMode("replay")}
              type="button"
            >
              REPLAY
            </button>
          </div>

          <div className="stream-status" aria-live="polite">
            <span
              className={`status-dot ${feed === null ? "loading" : ""}`}
            />
            <div className="stream-copy">
              <strong>
                {feed?.connected
                  ? "TxODDS devnet connected"
                  : feed
                    ? "Replay engine connected"
                    : "Connecting to TxODDS"}
              </strong>
              <span>
                {feed
                  ? `${feed.fixtureCount} fixtures indexed · ${new Date(
                      feed.checkedAt,
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}`
                  : "Checking feed status"}
              </span>
            </div>
          </div>
        </header>

        <section id="monitor" aria-labelledby="main-heading">
          <h1 className="hero-title" id="main-heading">
            Catch the market move before the score catches up.
          </h1>

          <div className="workspace">
            <div className="main-column">
              {mode === "live" ? (
                <div className="live-note" role="status">
                  <Radio size={13} />
                  <strong>LIVE CONNECTIVITY</strong>
                  <span>
                    {feed?.fixtureCount ?? 0} fixtures indexed; TxODDS has not
                    returned a live odds snapshot, so the anomaly view below
                    remains an explicit replay.
                  </span>
                </div>
              ) : null}
              <div className="alert-strip" aria-live="assertive">
                <AlertTriangle className="alert-icon" size={25} />
                <span className="alert-label">LATEST ALERT</span>
                <strong className="alert-kind">
                  {showShock ? "MARKET SUSPENDED" : "MONITORING"}
                </strong>
                <span className="alert-market">
                  Argentina v France · 1X2 Home
                </span>
                <span className="match-clock">
                  <strong>{current.label}</strong>
                  <span>match time</span>
                </span>
              </div>

              <section className="chart-panel" aria-labelledby="chart-heading">
                <div className="chart-header">
                  <h2 id="chart-heading">Home win probability (%)</h2>
                  <div className="legend" aria-label="Chart legend">
                    <span>
                      <i style={{ background: "var(--green)" }} /> Home
                      (Argentina)
                    </span>
                    <span>
                      <i style={{ background: "#b9c0c2" }} /> Draw
                    </span>
                    <span>
                      <i style={{ background: "#27aaff" }} /> Away (France)
                    </span>
                  </div>
                </div>

                <div className="chart-body">
                  <div className="chart-wrap">
                    <ProbabilityChart
                      activeIndex={activeIndex}
                      points={replayPoints}
                    />
                    <div className="replay-controls">
                      <button onClick={beginReplay} type="button">
                        <Play size={11} /> Replay shock
                      </button>
                      <div className="replay-track" aria-hidden="true">
                        <span
                          className="replay-progress"
                          style={{
                            width: `${(activeIndex / (replayPoints.length - 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="replay-time">{current.label}</span>
                    </div>
                  </div>

                  <div className="chart-stat-rail">
                    <div className="chart-stat">
                      <label>Home win probability</label>
                      <div className="probability-shift">
                        42.8% → <strong>{current.home.toFixed(1)}%</strong>
                      </div>
                      <div className="delta">
                        {showShock ? "+14.3 pts in 9 sec" : "baseline stable"}
                      </div>
                    </div>
                    <div className="chart-stat">
                      <label>Score feed</label>
                      <div className="score-value">{current.score}</div>
                    </div>
                    <div className="chart-stat">
                      <label>Confidence</label>
                      <div className="confidence">
                        {showShock ? replaySignal.confidence : 38}%
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <EvidenceLedger />
            </div>

            <aside className="inspector" aria-labelledby="packet-heading">
              <div className="panel-title">
                <h2 id="packet-heading">Signal packet</h2>
                <span>Replay packet</span>
              </div>
              <dl className="packet-fields">
                <dt>event_id</dt>
                <dd>{replaySignal.event_id}</dd>
                <dt>market</dt>
                <dd>{replaySignal.market}</dd>
                <dt>trigger</dt>
                <dd className="danger">{replaySignal.trigger}</dd>
                <dt>probability_delta</dt>
                <dd className="positive">
                  +{replaySignal.probability_delta}
                </dd>
                <dt>observed_at</dt>
                <dd>{replaySignal.observed_at}</dd>
                <dt>access_proof</dt>
                <dd>
                  <a href={solscanUrl} rel="noreferrer" target="_blank">
                    {shortProof(TXODDS_ACCESS_TRANSACTION)}
                  </a>
                </dd>
              </dl>
              <pre className="code-block">{packetJson}</pre>
              <div className="button-row">
                <button
                  className="action-button"
                  onClick={copyPacket}
                  type="button"
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Copied" : "Copy JSON"}
                </button>
                <a
                  className="action-button"
                  href={solscanUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ShieldCheck size={15} />
                  Verify access on Solana
                </a>
              </div>
            </aside>
          </div>
        </section>

        <EndpointRail connected={Boolean(feed?.connected)} />
      </div>
      {copied ? <div className="toast">Signal packet copied</div> : null}
    </main>
  );
}

function EvidenceLedger() {
  return (
    <section className="ledger" id="evidence" aria-labelledby="evidence-heading">
      <h2 id="evidence-heading">Evidence ledger · replay</h2>
      <div className="ledger-scroll">
        <table>
          <thead>
            <tr>
              <th>Time (UTC)</th>
              <th>Signal</th>
              <th>Market</th>
              <th>Delta (pts)</th>
              <th>Score feed</th>
              <th>Confidence</th>
              <th>Access proof</th>
            </tr>
          </thead>
          <tbody>
            {evidenceRows.map((row) => (
              <tr key={`${row.time}-${row.signal}`}>
                <td>{row.time}</td>
                <td className={`signal-${row.tone}`}>{row.signal}</td>
                <td>{row.market}</td>
                <td className={row.delta.startsWith("+") ? "positive" : ""}>
                  {row.delta}
                </td>
                <td>{row.score}</td>
                <td className="confidence-cell">{row.confidence}%</td>
                <td>
                  <a href={solscanUrl} rel="noreferrer" target="_blank">
                    {shortProof(row.proof)} <ExternalLink size={9} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="source-note">
        <span>
          <strong>Disclosure:</strong> deterministic anomaly replay using the
          TxODDS schema; no wager is executed.
        </span>
        <span>Live fixture connectivity is reported separately.</span>
      </div>
    </section>
  );
}

function EndpointRail({ connected }: { connected: boolean }) {
  return (
    <section className="endpoint-row" id="api" aria-label="Signal API status">
      <div className="endpoint-cell">
        <span className="endpoint-icon">
          <Code2 size={21} />
        </span>
        <div className="endpoint-copy">
          <label>Signal endpoint</label>
          <strong>GET /api/signal/latest · 0.005 USDC · x402</strong>
        </div>
      </div>
      <div className="endpoint-cell">
        <Activity color="var(--cyan)" size={17} />
        <div className="endpoint-copy">
          <label>Response</label>
          <span className="cyan">application/json</span>
        </div>
      </div>
      <div className="endpoint-cell">
        <Radio color="var(--cyan)" size={17} />
        <div className="endpoint-copy">
          <label>Settlement</label>
          <span>Solana devnet · exact</span>
        </div>
      </div>
      <div className="endpoint-cell">
        <span
          className={`status-dot ${connected ? "" : "loading"}`}
          aria-hidden="true"
        />
        <div className="endpoint-copy">
          <label>Status</label>
          <span className={connected ? "ok" : ""}>
            {connected ? "402 PAYWALL ACTIVE" : "REPLAY READY"}
          </span>
        </div>
      </div>
    </section>
  );
}

function shortProof(value: string): string {
  return `${value.slice(0, 5)}…${value.slice(-5)}`;
}
