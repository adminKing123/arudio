import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function Home() {
  return (
    <div className="neo-surface flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <Logo size="lg" priority />
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-[var(--text)]">Arudio</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Music streaming and discovery platform.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/login" className="neo-btn neo-btn-primary px-6">
          Login
        </Link>
        <Link href="/signup" className="neo-btn neo-btn-soft px-6">
          Sign up
        </Link>
      </div>
    </div>
  );
}
