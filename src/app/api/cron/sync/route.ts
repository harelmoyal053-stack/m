import { syncAll } from "@/lib/sync";

// לקריאה משירות cron חיצוני (או Vercel Cron), עם הכותרת Authorization: Bearer <CRON_SECRET>
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    return Response.json(await syncAll());
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
