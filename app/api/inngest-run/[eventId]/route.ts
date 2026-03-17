import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  // dev: http://localhost:8288, prod: INNGEST_BASE_URL 환경변수로 주입
  const base = process.env.INNGEST_BASE_URL ?? "http://localhost:8288";

  let res: Response;
  try {
    res = await fetch(`${base}/v1/events/${eventId}/runs`, {
      headers: {
        ...(process.env.INNGEST_SIGNING_KEY && {
          Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
        }),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Inngest 서버에 연결할 수 없습니다." },
      { status: 502 }
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: `Inngest 서버 오류: ${res.status}` },
      { status: res.status }
    );
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return NextResponse.json(
      { error: "Inngest 응답 파싱에 실패했습니다." },
      { status: 502 }
    );
  }

  return NextResponse.json(data);
}
