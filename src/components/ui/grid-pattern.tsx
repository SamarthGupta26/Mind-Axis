'use client';

import { cn } from "@/lib/utils";

interface GridPatternProps {
  className?: string;
  yOffset?: number;
  patternColor?: string;
}

export function GridPattern({
  className,
  yOffset = 0,
  patternColor = "white/[0.1]",
}: GridPatternProps) {
  return (
    <div className={cn("absolute inset-0 z-0", className)}>
      <div
        className="absolute h-full w-full stroke-gray-400/10"
        style={{
          maskImage: "radial-gradient(50% 50% at 50% 50%, white 85%, transparent 100%)",
        }}
      >
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
              x={0}
              y={yOffset}
            >
              <path
                d="M.5.5h23v23H.5z"
                fill="none"
                className={`stroke-${patternColor}`}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
}
