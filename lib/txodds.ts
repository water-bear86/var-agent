import type { FeedStatus } from "./types";

let guestJwt: { value: string; expiresAt: number } | null = null;

export async function getTxOddsFeedStatus(): Promise<FeedStatus> {
  const origin =
    process.env.TXODDS_API_ORIGIN ?? "https://txline-dev.txodds.com";
  const apiToken = process.env.TXODDS_API_TOKEN;
  const checkedAt = new Date().toISOString();

  if (!apiToken) {
    return {
      connected: false,
      source: "replay",
      fixtureCount: 0,
      checkedAt,
      fixtures: [],
      message: "Live token unavailable; deterministic replay remains active.",
    };
  }

  try {
    const jwt = await getGuestJwt(origin);
    const response = await fetch(`${origin}/api/fixtures/snapshot`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "X-Api-Token": apiToken,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`TxODDS returned ${response.status}`);
    }

    const payload = (await response.json()) as Array<Record<string, unknown>>;
    const fixtures = payload.slice(0, 8).map((fixture) => ({
      id: Number(fixture.FixtureId),
      competition: String(fixture.Competition ?? "World Cup"),
      home: String(fixture.Participant1),
      away: String(fixture.Participant2),
      startsAt: new Date(Number(fixture.StartTime)).toISOString(),
    }));

    return {
      connected: true,
      source: "txodds-devnet",
      fixtureCount: payload.length,
      checkedAt,
      fixtures,
      message:
        payload.length > 0
          ? "TxODDS devnet connected; replaying the anomaly sequence while fixtures await live odds."
          : "TxODDS devnet connected; no current fixtures were returned.",
    };
  } catch (error) {
    return {
      connected: false,
      source: "replay",
      fixtureCount: 0,
      checkedAt,
      fixtures: [],
      message:
        error instanceof Error
          ? error.message
          : "TxODDS connectivity check failed.",
    };
  }
}

async function getGuestJwt(origin: string): Promise<string> {
  if (guestJwt && guestJwt.expiresAt > Date.now()) return guestJwt.value;

  const response = await fetch(`${origin}/auth/guest/start`, {
    method: "POST",
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to start a TxODDS guest session.");

  const payload = (await response.json()) as { token?: string };
  if (!payload.token) throw new Error("TxODDS guest session returned no token.");

  guestJwt = {
    value: payload.token,
    expiresAt: Date.now() + 20 * 60 * 1000,
  };
  return payload.token;
}
