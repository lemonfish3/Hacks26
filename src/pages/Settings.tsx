/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { Goal } from '../types';

interface SettingsProps {
  sessionDuration: number;
  setSessionDuration: (d: number) => void;
  onCancel: () => void;
  onCreateRoom: () => void;
}

export const Settings = ({ sessionDuration, setSessionDuration, onCancel, onCreateRoom }: SettingsProps) => {
  return (
    <motion.div 
      key="settings"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="z-10 glass-card p-8 w-full max-w-2xl"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Host Study Session</h2>
        <button onClick={onCancel} className="text-cloud-muted hover:text-cloud-deep font-bold">Cancel</button>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Session Duration
          </h3>
          <p className="text-xs text-cloud-muted mb-4">Choose your Pomodoro focus time for this room.</p>
          <div className="flex gap-4">
            {[25, 30, 45, 60].map(d => (
              <button 
                key={d}
                onClick={() => setSessionDuration(d)}
                className={`flex-1 py-3 rounded-2xl border-2 font-bold transition-all ${sessionDuration === d ? 'border-cloud-deep bg-cloud-deep text-white shadow-md' : 'border-cloud-blue/30 bg-white/50 text-cloud-muted hover:bg-white'}`}
              >
                {d}m
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={onCreateRoom}
          className="w-full py-4 bg-cloud-deep text-white rounded-2xl font-semibold hover:bg-cloud-deep/90 transition-all shadow-lg"
        >
          Create Room & Start Studying
        </button>
      </div>
    </motion.div>
  );
};
