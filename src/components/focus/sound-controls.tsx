'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useFocusStore } from '@/store/focus-store';

export function SoundControls() {
  const { hasSound, volume, toggleSound, setVolume } = useFocusStore();

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center space-x-4 p-3 rounded-full bg-background/50 backdrop-blur-sm border shadow-lg"
    >
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSound}
          className="rounded-full"
        >
          {hasSound ? (
            <Volume2 className="h-4 w-4 text-primary" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
      </motion.div>
      <Slider
        defaultValue={[volume * 100]}
        max={100}
        step={1}
        className="w-[100px]"
        onValueChange={([value]) => setVolume(value / 100)}
        disabled={!hasSound}
      />
    </motion.div>
  );
}
