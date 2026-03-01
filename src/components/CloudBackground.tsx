/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

export const CloudBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <motion.div 
      animate={{ x: [0, 50, 0], y: [0, 20, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-10 -left-20 w-64 h-32 bg-white/60 rounded-full blur-3xl"
    />
    <motion.div 
      animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-20 -right-20 w-96 h-48 bg-cloud-blue/40 rounded-full blur-3xl"
    />
    <motion.div 
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cloud-blue/10 rounded-full blur-[120px]"
    />
  </div>
);
