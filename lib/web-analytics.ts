import {prisma} from "@/lib/prisma";

export type AnalyticsPayload = {
  visitorId: string;
  sessionId: string;
  path: string;
  eventType: "page_view" | "button_click" | "booking_started" | "booking_completed";
  eventName: string;
  referrer?: string | null;
  source?: string | null;
  deviceType?: string | null;
  country?: string | null;
  city?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
};

type WebAnalyticsEventRecord = AnalyticsPayload & {
  id: string;
  createdAt: Date;
};

type WebAnalyticsEventDelegate = {
  create(args: {data: AnalyticsPayload}): Promise<WebAnalyticsEventRecord>;
  findMany(args?: unknown): Promise<WebAnalyticsEventRecord[]>;
};

const analyticsPrisma = prisma as typeof prisma & {
  webAnalyticsEvent: WebAnalyticsEventDelegate;
};

export function detectDeviceType(userAgent: string) {
  const agent = userAgent.toLowerCase();

  if (/ipad|tablet/.test(agent)) return "Tablični računalnik";
  if (/mobi|android|iphone/.test(agent)) return "Mobilni telefon";
  return "Namizni računalnik";
}

export function detectSource(referrer: string | null | undefined) {
  if (!referrer) return "Direktno";

  const value = referrer.toLowerCase();

  if (value.includes("google")) return "Google";
  if (value.includes("facebook") || value.includes("fb.")) return "Facebook";
  if (value.includes("instagram")) return "Instagram";
  if (value.includes("tiktok")) return "TikTok";
  if (value.includes("linkedin")) return "LinkedIn";
  if (value.includes("bing")) return "Bing";
  return "Drugo";
}

export function isTrackedPath(path: string) {
  return !(
    path.includes("/admin") ||
    path.includes("/employee") ||
    path.includes("/profile") ||
    path.includes("/login") ||
    path.includes("/register")
  );
}

export async function createAnalyticsEvent(data: AnalyticsPayload) {
  return analyticsPrisma.webAnalyticsEvent.create({data});
}

export async function getAnalyticsEvents(from: Date) {
  return analyticsPrisma.webAnalyticsEvent.findMany({
    where: {
      createdAt: {
        gte: from
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}
