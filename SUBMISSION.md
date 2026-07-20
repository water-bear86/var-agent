# VAR Agent — submission copy

**Live MVP:** https://var-agent-live.basedfox.chatgpt.site  
**Public source:** https://github.com/water-bear86/var-agent

## One-line pitch

VAR Agent catches the market move before the score catches up, then sells a
verifiable anomaly packet to other agents for 0.005 USDC over x402.

## Product description

Sports markets often react before the official score feed. VAR Agent monitors
TxODDS exchange probabilities for sudden repricing, market suspension, and
score lag. When a threshold is crossed it produces a compact JSON packet with
the probability delta, observed score, confidence, timestamp, and Solana access
proof.

The public dashboard proves three parts of the loop: live TxODDS devnet fixture
connectivity, deterministic anomaly detection, and a genuinely payment-gated
API. An unpaid call to `/api/signal/latest` receives HTTP 402 and a request for
0.005 USDC on Solana devnet. This turns a time-sensitive data edge into a
machine-buyable product with no subscription checkout and no human in the
loop.

## Demo script (60 seconds)

1. Open the dashboard and point out the green TxODDS devnet connection.
2. Click **Replay shock**. The probability lines advance while the score stays
   0–0.
3. At 78:14, show the red suspension alert and the +14.3-point/9-second signal.
4. Open the Solana proof from the evidence ledger.
5. Call `/api/signal/latest` without payment and show the HTTP 402 plus x402
   payment requirement.
6. Close on the buyer: autonomous bots pay 0.005 USDC only when they need the
   latest packet.

## Honesty note

The anomaly sequence is a disclosed deterministic replay because live odds were
not available in the current snapshot. The TxODDS fixture connection and
Solana subscription transaction are live and independently verifiable.
