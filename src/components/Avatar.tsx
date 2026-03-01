/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface AvatarProps {
  type: string;
  color: string;
  size?: "sm" | "md" | "lg" | "xl";
  emoji?: string;
}

export const Avatar = ({ type, color, size = "lg", emoji }: AvatarProps) => {
  const sizeClasses = {
    sm: "w-12 h-12 text-xl",
    md: "w-24 h-24 text-4xl",
    lg: "w-36 h-36 text-6xl",
    xl: "w-48 h-48 text-7xl"
  };

  return (
    <motion.div 
      animate={{ y: [0, -5, 0], scale: [1, 1.02, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className={`${sizeClasses[size]} relative flex items-center justify-center`}
    >
      {/* Glow Effect */}
      <div 
        className="absolute inset-0 rounded-[40%] opacity-30 blur-xl"
        style={{ background: `radial-gradient(circle, ${color}, transparent)` }}
      />

      {/* Base Shape */}
      <div 
        className="w-full h-full rounded-[40%] shadow-lg flex items-center justify-center relative overflow-hidden transition-colors duration-500"
        style={{ background: color }}
      >
        {emoji ? (
          <span className="relative z-10 select-none">{emoji}</span>
        ) : (
          <>
            {/* Eyes */}
            <div className="flex gap-4 mb-2">
              <div className="w-3 h-3 bg-cloud-deep rounded-full" />
              <div className="w-3 h-3 bg-cloud-deep rounded-full" />
            </div>
            
            {/* Mouth */}
            <div className="absolute bottom-1/3 w-6 h-3 border-b-2 border-cloud-deep rounded-full h-1" />
            
            {/* Blushing */}
            <div className="absolute top-1/2 left-4 w-4 h-2 bg-pink-400/30 rounded-full blur-sm" />
            <div className="absolute top-1/2 right-4 w-4 h-2 bg-pink-400/30 rounded-full blur-sm" />
          </>
        )}
      </div>

      {/* Accessories Placeholder */}
      {type === 'animal' && !emoji && (
        <>
          <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full" style={{ backgroundColor: color }} />
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full" style={{ backgroundColor: color }} />
        </>
      )}
    </motion.div>
  );
};
