'use client';

import { useMouseFollow } from "@/hooks/use-mouse-follow";

export function MouseFollowProvider({ children }: { children: React.ReactNode }) {
  useMouseFollow();
  return <>{children}</>;
}
