"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// The first page a visitor lands on renders immediately (no fade), so the
// server-rendered HTML is visible before JavaScript loads. Every page after
// that — client-side navigations — gets the fade-and-rise entrance.
let isFirstLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const [animateIn] = useState(() => !isFirstLoad);

  useEffect(() => {
    isFirstLoad = false;
  }, []);

  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
