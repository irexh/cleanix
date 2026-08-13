import {prisma} from "@/lib/prisma";

export type AnalyticsEventType =
  | "page_view"
  | "button_click"
  | "booking_started"
  | "booking_completed";

export type AnalyticsEventInput = {
  visitorId: string;
  sessionId: string;
  path: string;
  eventType: AnalyticsEventType;
  eventName: string;
  referrer?: string | null;
  source?: string | null;
  deviceType?: string | null;
  country?: string | null;
  city?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
};

type AnalyticsEventRecord = AnalyticsEventInput & {
  id: string;
  createdAt: Date;
};

type WebAnalyticsEventDelegate = {
  create(args: {data: AnalyticsEventInput}): Promise<AnalyticsEventRecord>;
  findMany(args?: unknown): Promise<AnalyticsEventRecord[]>;
};

const analyticsPrisma = prisma as typeof prisma & {
  webAnalyticsEvent: WebAnalyticsEventDelegate;
};

export async function createAnalyticsEvent(data: AnalyticsEventInput) {
  return analyticsPrisma.webAnalyticsEvent.create({data});
}

export async function getAnalyticsEventsSince(date: Date) {
  return analyticsPrisma.webAnalyticsEvent.findMany({
    where: {
      createdAt: {
        gte: date
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export function detectSource(referrer: string | null | undefined) {
  if (!referrer) return "Direktno na spletno stran";

  const value = referrer.toLowerCase();

  if (value.includes("google")) return "Google";
  if (value.includes("facebook") || value.includes("fb.")) return "Facebook";
  if (value.includes("instagram")) return "Instagram";
  if (value.includes("linkedin")) return "LinkedIn";
  if (value.includes("tiktok")) return "TikTok";
  if (value.includes("bing")) return "Bing";
  return "Drugo";
}

export function detectDeviceType(userAgent: string) {
  const value = userAgent.toLowerCase();

  if (/ipad|tablet/.test(value)) return "Tablični računalnik";
  if (/iphone|android|mobi/.test(value)) return "Mobilni telefon";
  return "Namizni računalnik";
}

export function shouldTrackPath(path: string) {
  return !(
    path.includes("/admin") ||
    path.includes("/employee") ||
    path.includes("/profile") ||
    path.includes("/login") ||
    path.includes("/register")
  );
}
