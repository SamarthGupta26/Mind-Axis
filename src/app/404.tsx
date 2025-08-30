"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 16 }}
        className="max-w-md w-full text-center space-y-8 bg-background/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-border p-8"
      >
        <h1 className="text-6xl font-extrabold mb-2 text-primary drop-shadow-lg" style={{ fontFamily: 'var(--font-geist), Inter, sans-serif' }}>
          404
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <Button size="lg" asChild className="rounded-full">
          <Link href="/">
            Go Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
