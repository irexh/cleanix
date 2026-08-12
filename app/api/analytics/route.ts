import {NextRequest, NextResponse} from "next/server";

import {
  createAnalyticsEvent,
  detectDeviceType,
  detectSource,
  shouldTrackPath,
  type AnalyticsEventInput
} from "@/lib/web-analytics";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<AnalyticsEventInput>;
    const path = String(body.path ?? "").trim();

    if (!path || !shouldTrackPath(path)) {
      return NextResponse.json({success: true});
    }

    const userAgent = request.headers.get("user-agent") ?? body.userAgent ?? "";
    const referrer = String(body.referrer ?? "").trim() || request.headers.get("referer") || null;

    await createAnalyticsEvent({
      visitorId: String(body.visitorId ?? "").trim(),
      sessionId: String(body.sessionId ?? "").trim(),
      path,
      eventType: (body.eventType as AnalyticsEventInput["eventType"]) ?? "page_view",
      eventName: String(body.eventName ?? "Ogled strani").trim(),
      referrer,
      source: body.source ?? detectSource(referrer),
      deviceType: body.deviceType ?? detectDeviceType(userAgent),
      country: request.headers.get("x-vercel-ip-country") ?? body.country ?? null,
      city: request.headers.get("x-vercel-ip-city") ?? body.city ?? null,
      userAgent,
      metadata: body.metadata ?? null
    });

    return NextResponse.json({success: true});
  } catch (error) {
    console.error("Analytics route failed:", error);
    return NextResponse.json({success: false}, {status: 500});
  }
}
