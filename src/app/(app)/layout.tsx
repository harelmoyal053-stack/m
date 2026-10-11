import Link from "next/link";
import { Settings, UserRound } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { BottomNav } from "@/components/BottomNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="mx-auto min-h-dvh max-w-md pb-safe">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-night/85 px-4 py-3 backdrop-blur">
        <Link href="/" className="flex items-center gap-2 text-lg font-black">
          <span>⭐</span> ניחושי האלופות
        </Link>
        <div className="flex items-center gap-1">
          {user.isAdmin && (
            <Link href="/admin" aria-label="ניהול" className="rounded-full p-2 text-muted hover:text-ink">
              <Settings size={20} />
            </Link>
          )}
          <Link
            href="/me"
            className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-bold"
          >
            <UserRound size={16} /> {user.displayName}
          </Link>
        </div>
      </header>
      <main className="px-4">{children}</main>
      <BottomNav />
    </div>
  );
}
