"use client";

import React from "react";
import { motion } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface ProgressStatsProps {
  correctCount: number;
  wrongCount: number;
}

export default function ProgressStats({
  correctCount,
  wrongCount,
}: ProgressStatsProps) {
  const total = correctCount + wrongCount;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <motion.div
      className="flex items-center gap-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex flex-col items-center gap-2"
        whileHover={{ scale: 1.05 }}
      >
        <Badge className="text-xl font-bold px-6 py-3 text-green-700 bg-green-100/90 shadow-lg ring-2 ring-green-200/50">
          <CheckCircle className="w-5 h-5 mr-1" />
          {correctCount}
        </Badge>
        <span className="text-sm text-slate-300 font-medium">Correct</span>
      </motion.div>

      <motion.div
        className="flex flex-col items-center gap-2"
        whileHover={{ scale: 1.05 }}
      >
        <Badge className="text-xl font-bold px-6 py-3 text-red-700 bg-red-100/90 shadow-lg ring-2 ring-red-200/50">
          <XCircle className="w-5 h-5 mr-1" />
          {wrongCount}
        </Badge>
        <span className="text-sm text-slate-300 font-medium">Wrong</span>
      </motion.div>

      <motion.div
        className="text-2xl font-black bg-gradient-to-r from-slate-200 to-indigo-200 bg-clip-text text-transparent drop-shadow-lg"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {accuracy}%
      </motion.div>
    </motion.div>
  );
}
