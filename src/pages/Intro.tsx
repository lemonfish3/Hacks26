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
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-cloud-blue rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-xl">☁️</span>
          </div>
          <span className="font-black text-cloud-deep tracking-tighter text-2xl hidden sm:block">Cloudy</span>
        </div>
        <button 
          onClick={onLogin}
          className="px-8 py-3 bg-white/80 backdrop-blur-md text-cloud-deep border-2 border-cloud-blue/20 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:border-cloud-blue hover:shadow-xl transition-all active:scale-95"
        >
          Log In
        </button>
      </nav>

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
              Join thousands of students in a cozy, cloud-like space. Recreate the social accountability of a library from the comfort of your home.
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
        <div className="relative">
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="glass-card p-8 relative z-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-cloud-blue rounded-full" />
              <div>
                <div className="h-3 w-24 bg-cloud-blue/30 rounded-full mb-2" />
                <div className="h-2 w-16 bg-cloud-blue/10 rounded-full" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-cloud-blue/5 rounded-full" />
              <div className="h-4 w-full bg-cloud-blue/5 rounded-full" />
              <div className="h-4 w-2/3 bg-cloud-blue/5 rounded-full" />
            </div>
            <div className="mt-8 flex justify-center">
              <Avatar type="blob" color="#B9E5FB" size="md" />
            </div>
          </motion.div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cloud-blue/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cloud-blue/20 rounded-full blur-3xl" />
        </div>
      </div>
    </motion.div>
    </div>
  );
};
