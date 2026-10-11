"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, Gift, Trophy } from "lucide-react";

const ITEMS = [
  { href: "/", label: "משחקים", icon: CalendarDays },
  { href: "/table", label: "טבלה", icon: Trophy },
  { href: "/bonus", label: "בונוס", icon: Gift },
  { href: "/rules", label: "חוקים", icon: BookOpen },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-deep/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? path === "/" || path.startsWith("/match") : path.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-bold ${
                  active ? "text-cyan" : "text-muted"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
