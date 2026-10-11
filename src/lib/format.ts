const TZ = "Asia/Jerusalem";

export function formatTime(ms: number): string {
  return new Intl.DateTimeFormat("he-IL", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(ms);
}

export function formatDay(ms: number): string {
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(ms);
}

export function formatDateTime(ms: number): string {
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: TZ,
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(ms);
}

/** מפתח יום לפי שעון ישראל, לקיבוץ משחקים */
export function dayKey(ms: number): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(ms);
}

export function timeAgo(ms: number, now = Date.now()): string {
  const s = Math.round((now - ms) / 1000);
  if (s < 60) return "לפני רגע";
  const m = Math.round(s / 60);
  if (m < 60) return `לפני ${m} דק׳`;
  const h = Math.round(m / 60);
  if (h < 24) return `לפני ${h} שע׳`;
  return `לפני ${Math.round(h / 24)} ימים`;
}

/** הזמן הנוכחי. קומפוננטות שרת מרונדרות פעם אחת לכל בקשה, אז זה בטוח לשימוש ברינדור. */
export function requestTime(): number {
  return Date.now();
}
