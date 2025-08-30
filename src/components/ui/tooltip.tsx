"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Tooltip({ children, content, side = "top" }: { children: React.ReactNode; content: React.ReactNode | string; side?: "top" | "right" | "left" | "bottom" }) {
  const [open, setOpen] = React.useState(false);

  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.14 }}
            className={cn(
              "pointer-events-none absolute z-50 max-w-xs",
              side === "top" && "-top-8 left-1/2 -translate-x-1/2",
              side === "right" && "left-full top-1/2 -translate-y-1/2 ml-3",
              side === "left" && "right-full top-1/2 -translate-y-1/2 mr-3",
              side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-3"
            )}
          >
            <span className="whitespace-nowrap rounded-md bg-background/95 backdrop-blur-md px-3 py-1 text-xs text-muted-foreground border border-border shadow-sm">
              {content}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
