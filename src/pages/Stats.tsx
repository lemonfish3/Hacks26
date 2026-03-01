/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, BookOpen, RefreshCw, User } from 'lucide-react';
import { UserData } from '../types';

interface StatsProps {
  userData: UserData;
  sessionDuration: number;
  onReturnToLobby: () => void;
  onViewProfile: () => void;
}

export const Stats = ({ userData, sessionDuration, onReturnToLobby, onViewProfile }: StatsProps) => {
  return (
    <motion.div 
      key="stats"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="z-10 glass-card p-12 w-full max-w-2xl text-center"
    >
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      <h2 className="text-4xl font-bold mb-2">Session Complete!</h2>
      <p className="text-cloud-muted mb-12">Amazing focus. You're one step closer to your goals.</p>
      
      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="p-6 bg-white/50 rounded-3xl">
          <Clock className="w-8 h-8 text-cloud-deep mx-auto mb-3" />
          <div className="text-2xl font-bold text-cloud-deep">{sessionDuration}m</div>
          <div className="text-xs text-cloud-muted font-bold uppercase tracking-widest">Time Earned</div>
        </div>
        <div className="p-6 bg-white/50 rounded-3xl">
          <BookOpen className="w-8 h-8 text-cloud-deep mx-auto mb-3" />
          <div className="text-2xl font-bold text-cloud-deep">98%</div>
          <div className="text-xs text-cloud-muted font-bold uppercase tracking-widest">Focus Score</div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={onReturnToLobby}
          className="flex-1 py-4 bg-cloud-deep text-white rounded-2xl font-semibold hover:bg-cloud-deep/90 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" /> Return to Lobby
        </button>
        <button 
          onClick={onViewProfile}
          className="flex-1 py-4 bg-white text-cloud-deep border-2 border-cloud-blue rounded-2xl font-semibold hover:bg-cloud-blue/10 transition-all flex items-center justify-center gap-2"
        >
          <User className="w-5 h-5" /> View Profile
        </button>
      </div>
    </motion.div>
  );
};
