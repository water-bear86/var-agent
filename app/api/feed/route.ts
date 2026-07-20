import { NextResponse } from "next/server";
import { getTxOddsFeedStatus } from "../../../lib/txodds";

export async function GET() {
  const status = await getTxOddsFeedStatus();
  return NextResponse.json(status, {
    headers: {
      "Cache-Control": "public, max-age=15, stale-while-revalidate=45",
    },
  });
}
