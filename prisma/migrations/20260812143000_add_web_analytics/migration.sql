CREATE TABLE "WebAnalyticsEvent" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "referrer" TEXT,
    "source" TEXT,
    "deviceType" TEXT,
    "country" TEXT,
    "city" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebAnalyticsEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "WebAnalyticsEvent_createdAt_idx" ON "WebAnalyticsEvent"("createdAt");
CREATE INDEX "WebAnalyticsEvent_eventType_createdAt_idx" ON "WebAnalyticsEvent"("eventType", "createdAt");
CREATE INDEX "WebAnalyticsEvent_path_createdAt_idx" ON "WebAnalyticsEvent"("path", "createdAt");
