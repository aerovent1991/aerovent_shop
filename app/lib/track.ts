"use client";

type TrackPayload = {
  eventType: string;
};

const getVisitorId = () => {
  if (typeof window === 'undefined') return null;
  const key = 'visitor_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
};

export const trackEvent = async (payload: TrackPayload) => {
  try {
    const visitorId = getVisitorId();
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: payload.eventType,
        visitorId,
      }),
    });
  } catch {
    // ignore tracking errors
  }
};
