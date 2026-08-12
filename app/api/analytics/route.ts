import {NextRequest, NextResponse} from "next/server";

import {
  createAnalyticsEvent,
  detectDeviceType,
  detectSource,
  isTrackedPath,
  type AnalyticsPayload
} from "@/lib/web-analytics";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<AnalyticsPayload>;
    const path = String(body.path ?? "").trim();

    if (!path || !isTrackedPath(path)) {
      return NextResponse.json({ok: true});
    }

    const userAgent = request.headers.get("user-agent") ?? body.userAgent ?? "";
    const referrer = String(body.referrer ?? "").trim() || request.headers.get("referer") || null;
    const source = body.source ?? detectSource(referrer);
    const country = request.headers.get("x-vercel-ip-country") ?? body.country ?? null;
    const city = request.headers.get("x-vercel-ip-city") ?? body.city ?? null;

    await createAnalyticsEvent({
      visitorId: String(body.visitorId ?? "").trim(),
      sessionId: String(body.sessionId ?? "").trim(),
      path,
      eventType: (body.eventType as AnalyticsPayload["eventType"]) ?? "page_view",
      eventName: String(body.eventName ?? "Ogled strani").trim(),
      referrer,
      source,
      deviceType: body.deviceType ?? detectDeviceType(userAgent),
      country,
      city,
      userAgent,
      metadata: body.metadata ?? null
    });

    return NextResponse.json({ok: true});
  } catch (error) {
    console.error("Analytics tracking failed:", error);
    return NextResponse.json({ok: false}, {status: 500});
  }
}
