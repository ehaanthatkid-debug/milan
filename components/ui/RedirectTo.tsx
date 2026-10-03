"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RedirectTo({ href }: { href: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(href);
  }, [router, href]);
  return (
    <p className="mx-auto max-w-xl px-4 pt-20 text-center text-ink-soft">
      Taking you to your profile…{" "}
      <Link href={href} className="font-medium text-maroon underline">
        Continue
      </Link>
    </p>
  );
}
