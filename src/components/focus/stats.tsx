'use client';

import { motion } from 'framer-motion';
import { Timer, Flame, Trophy } from 'lucide-react';
import { useFocusStore } from '@/store/focus-store';

const formatTime = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export function Stats() {
  const { totalFocusTime, currentStreak, bestStreak } = useFocusStore();

  const stats = [
    {
      icon: Timer,
      label: 'Total Focus Time',
      value: formatTime(Math.floor(totalFocusTime / 60)),
      color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${currentStreak}`,
      color: 'from-orange-500/20 to-red-500/20'
    },
    {
      icon: Trophy,
      label: 'Best Streak',
      value: `${bestStreak}`,
      color: 'from-yellow-500/20 to-amber-500/20'
    },
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.02, translateY: -5 }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.2
          }}
          className="relative overflow-hidden rounded-2xl bg-background/50 backdrop-blur-sm border shadow-lg"
        >
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-20`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
          />
          <div className="relative p-6 flex flex-col items-center text-center space-y-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-3 rounded-full bg-primary/10"
            >
              <stat.icon className="w-6 h-6 text-primary" />
            </motion.div>
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
