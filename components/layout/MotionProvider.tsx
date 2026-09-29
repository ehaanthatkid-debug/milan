"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Respects the visitor's "reduce motion" OS setting across every animation. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
