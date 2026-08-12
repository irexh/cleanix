"use client";

import {useEffect} from "react";
import {usePathname} from "next/navigation";

function ensureStoredId(key: string) {
  const existing = window.localStorage.getItem(key);

  if (existing) return existing;

  const created = `${key}-${crypto.randomUUID()}`;
  window.localStorage.setItem(key, created);
  return created;
}

function getSessionId() {
  const key = "cleanix-session-id";
  const existing = window.sessionStorage.getItem(key);

  if (existing) return existing;

  const created = `session-${crypto.randomUUID()}`;
  window.sessionStorage.setItem(key, created);
  return created;
}

function track(payload: Record<string, unknown>) {
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

    const visitorId = ensureStoredId("cleanix-visitor-id");
    const sessionId = getSessionId();
    const referrer = document.referrer || null;

    track({
      visitorId,
      sessionId,
      path: pathname,
      eventType: "page_view",
      eventName: "Ogled strani",
      referrer
    });

    if (pathname.includes("/booking")) {
      const startedKey = `booking-started-${sessionId}`;

      if (!window.sessionStorage.getItem(startedKey)) {
        window.sessionStorage.setItem(startedKey, "1");
        track({
          visitorId,
          sessionId,
          path: pathname,
          eventType: "booking_started",
          eventName: "Začetek naročila",
          referrer
        });
      }
    }

    if (pathname.includes("/success")) {
      const completedKey = `booking-completed-${sessionId}`;

      if (!window.sessionStorage.getItem(completedKey)) {
        window.sessionStorage.setItem(completedKey, "1");
        track({
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
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const actionTarget = target?.closest("a,button");

      if (!actionTarget) return;

      const visitorId = ensureStoredId("cleanix-visitor-id");
      const sessionId = getSessionId();
      const label = actionTarget.textContent?.replace(/\s+/g, " ").trim();

      if (!label) return;

      track({
        visitorId,
        sessionId,
        path: window.location.pathname,
        eventType: "button_click",
        eventName: label,
        referrer: document.referrer || null,
        metadata: {
          href: actionTarget instanceof HTMLAnchorElement ? actionTarget.href : null,
          element: actionTarget.tagName.toLowerCase()
        }
      });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
