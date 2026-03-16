import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  // dev: http://localhost:8288, prod: INNGEST_BASE_URL 환경변수로 주입
  const base = process.env.INNGEST_BASE_URL ?? "http://localhost:8288";

  const res = await fetch(`${base}/v1/events/${eventId}/runs`, {
    headers: {
      ...(process.env.INNGEST_SIGNING_KEY && {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      }),
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
