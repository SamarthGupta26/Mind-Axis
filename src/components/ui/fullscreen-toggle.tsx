import { Maximize2, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Tooltip } from "@/components/ui/tooltip";

export function FullScreenToggle() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  }

  return (
    <Tooltip content={isFullScreen ? "Exit Full Screen" : "Full Screen"}>
      <motion.button
        onClick={toggleFullScreen}
        className="rounded-full p-2 liquid-card shadow-lg border backdrop-blur-md transition-all"
        initial={{ scale: 0.95, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08, boxShadow: "0 0 24px 8px var(--primary)" }}
        whileTap={{ scale: 0.92 }}
        aria-label="Toggle Full Screen"
        type="button"
      >
        {isFullScreen ? (
          <Minimize2 className="w-6 h-6 text-primary" />
        ) : (
          <Maximize2 className="w-6 h-6 text-primary" />
        )}
      </motion.button>
    </Tooltip>
  );
}
