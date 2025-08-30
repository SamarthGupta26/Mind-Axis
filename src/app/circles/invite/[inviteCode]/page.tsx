"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageTransition } from "@/components/ui/page-transition";

export default function InviteCodePage() {
  const params = useParams();
  const inviteCode = params?.inviteCode as string || "unknown";

  return (
    <PageTransition>
      <div className="relative min-h-screen flex flex-col items-center justify-start pt-24 pb-16 px-4 bg-transparent">
        <div className="w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="text-center space-y-4 mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <Link href="/circles">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Circles
                </Button>
              </Link>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 text-center text-black dark:text-white drop-shadow-lg"
            >
              Join Study Circle
            </motion.h1>
            
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto">
              Invite Code: {inviteCode}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 16 }}
            className="liquid-card rounded-3xl p-6 sm:p-8 text-center"
          >
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Circle Invitation
            </h2>
            <p className="text-muted-foreground mb-6">
              This study circle invitation feature is coming soon. You&apos;ll be able to join study groups using invite codes.
            </p>
            <div className="space-y-4">
              <div className="bg-primary/10 rounded-lg p-4">
                <h3 className="font-semibold text-primary mb-2">Coming Features:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Join study circles with invite codes</li>
                  <li>• Collaborative study sessions</li>
                  <li>• Shared resources and notes</li>
                  <li>• Group progress tracking</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
