import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (await getCurrentUser()) redirect("/");
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-4 py-10">
      <div className="text-center">
        <div className="text-5xl">⭐</div>
        <h1 className="mt-2 text-3xl font-black">ניחושי האלופות</h1>
        <p className="mt-1 text-muted">משחק הניחושים של החבר׳ה — ליגת האלופות</p>
      </div>
      {children}
    </main>
  );
}
