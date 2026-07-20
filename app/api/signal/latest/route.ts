import { HTTPFacilitatorClient } from "@x402/core/server";
import { withX402, x402ResourceServer } from "@x402/next";
import { registerExactSvmScheme } from "@x402/svm/exact/server";
import { NextRequest, NextResponse } from "next/server";
import { replaySignal } from "../../../../lib/replay";

const facilitator = new HTTPFacilitatorClient({
  url: "https://x402.org/facilitator",
});
const server = new x402ResourceServer(facilitator);
registerExactSvmScheme(server);
let initialization: Promise<void> | null = null;

async function latestSignal() {
  return NextResponse.json(
    {
      signal: replaySignal,
      disclosure:
        "Deterministic replay signal generated from the TxODDS schema. The attached Solana transaction proves live TxODDS devnet access, not the hypothetical match event.",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=5",
      },
    },
  );
}

const protectedLatestSignal = withX402(
  latestSignal,
  {
    accepts: {
      scheme: "exact",
      price: "$0.005",
      network: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
      payTo:
        process.env.X402_PAY_TO ??
        "FFCA1gAiNetensrmWbTVUhWXyh3u3KERgpH4sNUbChhw",
    },
    description:
      "Latest deterministic VAR Agent market anomaly packet with probability delta, score lag, confidence, and TxODDS Solana access proof.",
    mimeType: "application/json",
  },
  server,
  undefined,
  undefined,
  false,
);

export async function GET(request: NextRequest) {
  // Cloudflare workers forbid network I/O during module initialization. Fetch
  // facilitator capabilities lazily on the first request, then reuse them.
  initialization ??= server.initialize();
  try {
    await initialization;
  } catch (error) {
    initialization = null;
    throw error;
  }
  return protectedLatestSignal(request);
}
