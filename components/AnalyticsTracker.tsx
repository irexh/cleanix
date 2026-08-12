"use client";

import {useEffect} from "react";
import {usePathname} from "next/navigation";

function getOrCreateLocalId(key: string, storage: Storage, prefix: string) {
  const existing = storage.getItem(key);

  if (existing) return existing;

  const created = `${prefix}-${crypto.randomUUID()}`;
  storage.setItem(key, created);
  return created;
}

function sendEvent(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", body);
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body,
    keepalive: true
  });
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (
      pathname.includes("/admin") ||
      pathname.includes("/employee") ||
      pathname.includes("/profile") ||
      pathname.includes("/login") ||
      pathname.includes("/register")
    ) {
      return;
    }

    const visitorId = getOrCreateLocalId("cleanix-visitor-id", window.localStorage, "visitor");
    const sessionId = getOrCreateLocalId("cleanix-session-id", window.sessionStorage, "session");

    sendEvent({
      visitorId,
      sessionId,
      path: pathname,
      eventType: "page_view",
      eventName: "Ogled strani",
      referrer: document.referrer || null
    });

    if (pathname.includes("/booking")) {
      const key = `cleanix-booking-start-${sessionId}`;

      if (!window.sessionStorage.getItem(key)) {
        window.sessionStorage.setItem(key, "1");
        sendEvent({
          visitorId,
          sessionId,
          path: pathname,
          eventType: "booking_started",
          eventName: "Začetek naročila",
          referrer: document.referrer || null
        });
      }
    }

    if (pathname.includes("/success")) {
      const key = `cleanix-booking-complete-${sessionId}`;

      if (!window.sessionStorage.getItem(key)) {
        window.sessionStorage.setItem(key, "1");
        sendEvent({
          visitorId,
          sessionId,
          path: pathname,
          eventType: "booking_completed",
          eventName: "Uspešno naročilo"
        });
      }
    }
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const clickable = target?.closest("a,button");

      if (!clickable) return;

      const label = clickable.textContent?.replace(/\s+/g, " ").trim();

      if (!label) return;

      const visitorId = getOrCreateLocalId("cleanix-visitor-id", window.localStorage, "visitor");
      const sessionId = getOrCreateLocalId("cleanix-session-id", window.sessionStorage, "session");

      sendEvent({
        visitorId,
        sessionId,
        path: window.location.pathname,
        eventType: "button_click",
        eventName: label,
        referrer: document.referrer || null,
        metadata: {
          element: clickable.tagName.toLowerCase(),
          href: clickable instanceof HTMLAnchorElement ? clickable.getAttribute("href") : null
        }
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
