/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, CheckCircle2, BookOpen, Clock, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { UserData } from '../types';

interface ProfileProps {
  userData: UserData;
  onEnterLobby: () => void;
  toggleGoal: (id: string) => void;
  toggleTodo: (id: string) => void;
  onEditProfile: () => void;
  onLogout: () => void;
}

export const Profile = ({ userData, onEnterLobby, toggleGoal, toggleTodo, onEditProfile, onLogout }: ProfileProps) => {
  return (
    <motion.div 
      key="profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="z-10 w-full max-w-5xl px-4 py-8"
    >
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={onEditProfile}
            className="relative group transition-transform hover:scale-105 active:scale-95"
            title="Edit Profile & Avatar"
          >
            <Avatar 
              type="animal"
              color={userData.avatar.color} 
              head={userData.avatar.head ?? 'head1'}
              clothes={userData.avatar.clothes ?? 'clothes1'}
              size="md" 
            />
            <div className="absolute inset-0 bg-black/20 rounded-[40%] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-white text-[10px] font-bold uppercase tracking-widest">Edit</span>
            </div>
          </button>
          <div>
            <h2 className="text-4xl font-bold text-cloud-deep">{userData.nickname || 'Cloudy Student'}</h2>
            <p className="text-cloud-muted font-medium">{userData.email}</p>
            <div className="flex gap-2 mt-2">
              <span className="px-3 py-1 bg-cloud-blue/20 rounded-full text-[10px] font-bold text-cloud-deep uppercase tracking-wider">{userData.major}</span>
              <span className="px-3 py-1 bg-emerald-100 rounded-full text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Active Student</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-center md:justify-end">
          <button 
            onClick={onEnterLobby}
            className="px-8 py-3 bg-cloud-deep text-white rounded-full font-bold hover:bg-cloud-deep/90 transition-all shadow-lg flex items-center gap-2"
          >
            Enter Lobby <ChevronRight className="w-5 h-5" />
          </button>
          <button 
            onClick={onLogout}
            className="p-3 text-cloud-deep/60 rounded-full hover:text-cloud-deep hover:bg-cloud-deep/5 transition-all flex items-center justify-center"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-6 text-center">
          <div className="text-4xl font-bold text-cloud-deep mb-1">{userData.stats.totalHours}h</div>
          <div className="text-sm text-cloud-muted uppercase tracking-wider font-bold">Total Study Time</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-4xl font-bold text-cloud-deep mb-1">{userData.stats.sessionsCompleted}</div>
          <div className="text-sm text-cloud-muted uppercase tracking-wider font-bold">Sessions Done</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-4xl font-bold text-cloud-deep mb-1">{userData.stats.dailyStreak}</div>
          <div className="text-sm text-cloud-muted uppercase tracking-wider font-bold">Day Streak 🔥</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Stats & History */}
        <div className="space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-cloud-deep">
              <Clock className="w-5 h-5" /> Weekly Productivity
            </h3>
            <div className="flex items-end gap-4 h-48">
              {userData.stats.history.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(h.hours / 5) * 100}%` }}
                    className="w-full bg-cloud-blue rounded-t-xl relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-cloud-deep text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {h.hours}h
                    </div>
                  </motion.div>
                  <span className="text-[10px] text-cloud-muted font-bold">{h.date.split('-').slice(1).join('/')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Goals & Tasks */}
        <div className="space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-cloud-deep">
              <CheckCircle2 className="w-5 h-5" /> Today's Goals
            </h3>
            <div className="space-y-3">
              {userData.goals.map(g => (
                <button 
                  key={g.id}
                  onClick={() => toggleGoal(g.id)}
                  className="w-full p-4 rounded-2xl bg-white/30 flex items-center justify-between group hover:bg-white transition-all border-2 border-transparent hover:border-cloud-blue/20"
                >
                  <span className={g.completed ? 'line-through text-cloud-muted' : 'font-bold text-cloud-deep'}>{g.text}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${g.completed ? 'bg-cloud-deep border-cloud-deep' : 'border-cloud-blue'}`}>
                    {g.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </button>
              ))}
              <button className="w-full p-4 rounded-2xl border-2 border-dashed border-cloud-blue/30 text-cloud-muted text-sm font-bold hover:bg-white/50 transition-all">
                + Add New Goal
              </button>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-cloud-deep">
              <BookOpen className="w-5 h-5" /> Study Tasks
            </h3>
            <div className="space-y-3">
              {userData.todos.map(t => (
                <button 
                  key={t.id}
                  onClick={() => toggleTodo(t.id)}
                  className="w-full p-4 rounded-2xl bg-white/30 flex items-center justify-between group hover:bg-white transition-all border-2 border-transparent hover:border-cloud-blue/20"
                >
                  <span className={t.completed ? 'line-through text-cloud-muted' : 'font-bold text-cloud-deep'}>{t.text}</span>
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${t.completed ? 'bg-cloud-deep border-cloud-deep' : 'border-cloud-blue'}`}>
                    {t.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </button>
              ))}
              <button className="w-full p-4 rounded-2xl border-2 border-dashed border-cloud-blue/30 text-cloud-muted text-sm font-bold hover:bg-white/50 transition-all">
                + Add New Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
