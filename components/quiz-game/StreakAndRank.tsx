"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

interface StreakAndRankProps {
  streak: number;
}

export default function StreakAndRank({ streak }: StreakAndRankProps) {
  const flames = Array.from({ length: Math.min(streak, 5) }, (_, i) => i + 1);

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ scale: 1 }}
      animate={{
        scale: 1.1,
        x: streak > 0 ? [0, -3, 3, 0] : 0,
      }}
      transition={{
        scale: { duration: 0.4 },
        x: { duration: 0.6, repeat: 1 },
      }}
      whileHover={{ scale: 1.15, rotate: 2 }}
    >
      <motion.div
        className="flex items-center gap-1 p-3 rounded-full bg-gradient-to-r from-orange-500/30 to-red-500/30 border-2 border-orange-400 shadow-lg"
        whileHover={{ scale: 1.1 }}
      >
        {flames.map((flameNum) => (
          <motion.div
            key={flameNum}
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 10, -10, 0],
              boxShadow: "0 0 15px rgba(255, 165, 0, 0.6)",
            }}
            transition={{
              duration: 1.5 + flameNum * 0.2,
              repeat: Infinity,
              delay: flameNum * 0.1,
            }}
          >
            <Flame className="w-6 h-6 text-orange-400 drop-shadow-lg" />
          </motion.div>
        ))}
      </motion.div>
      <Badge className="font-bold text-lg px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-orange-500/50 ring-2 ring-orange-400/30 transition-all">
        x{streak}
      </Badge>
    </motion.div>
  );
}
