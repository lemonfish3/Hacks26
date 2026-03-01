/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Avatar } from '../components/Avatar';

interface IntroProps {
  onStart: () => void;
  onLogin: () => void;
}

export const Intro = ({ onStart, onLogin }: IntroProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <motion.div 
        key="intro"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="z-10 text-center max-w-4xl w-full"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-6xl font-bold mb-6 text-cloud-deep leading-tight">
              Your Virtual <br /> <span className="text-cloud-muted">Study Sanctuary</span>
            </h1>
            <p className="text-xl text-cloud-muted mb-8 leading-relaxed">
              Mass Study Spaces and Communities in the Cloud.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onStart}
                className="px-8 py-4 bg-cloud-deep text-white rounded-full font-semibold text-lg hover:bg-cloud-deep/90 transition-all shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        <div className="relative min-h-[280px] w-full max-w-sm">
          {/* Floating avatar icons with different combinations */}
          <motion.div
            className="absolute top-0 left-1/4"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Avatar type="animal" color="#B9E5FB" size="md" head="head1" clothes="clothes1" />
          </motion.div>
          <motion.div
            className="absolute top-16 right-0"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Avatar type="animal" color="#A8D8EA" size="md" head="head2" clothes="clothes2" />
          </motion.div>
          <motion.div
            className="absolute bottom-8 left-0"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Avatar type="animal" color="#C9E4DE" size="md" head="head3" clothes="clothes3" />
          </motion.div>
          <motion.div
            className="absolute bottom-0 right-1/4"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            <Avatar type="animal" color="#F5E6D3" size="sm" head="head1" clothes="clothes2" />
          </motion.div>
          <motion.div
            className="absolute top-8 right-1/3"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          >
            <Avatar type="animal" color="#E8D5E7" size="sm" head="head2" clothes="clothes1" />
          </motion.div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cloud-blue/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cloud-blue/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </motion.div>
    </div>
  );
};
