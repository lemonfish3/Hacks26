/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Users, Clock, ChevronRight, Lock, RefreshCw, User } from 'lucide-react';
import { Room, UserData } from '../types';
import { Avatar } from '../components/Avatar';

interface LobbyProps {
  userData: UserData;
  onJoinRoom: (room: Room) => void;
  onHostRoom: () => void;
  onOpenProfile: () => void;
}

const MOCK_ROOMS: Room[] = [
  {
    id: '1',
    name: 'Late Night CS 😴',
    subject: '💻 Data Structures • Algorithms',
    tags: ['CS'],
    type: 'public',
    members: [
      { nickname: 'User1', avatar: { base: 'blob', color: '#B9E5FB' } },
      { nickname: 'User2', avatar: { base: 'animal', color: '#FDE68A' } },
      { nickname: 'User3', avatar: { base: 'blob', color: '#A7F3D0' } },
    ],
    maxMembers: 5,
    duration: 45,
    timeLeft: 45,
  },
  {
    id: '2',
    name: 'Bio Midterm Prep',
    subject: '🧬 Cell Biology • Genetics',
    tags: ['Bio'],
    type: 'public',
    members: [
      { nickname: 'User4', avatar: { base: 'animal', color: '#F9A8D4' } },
      { nickname: 'User5', avatar: { base: 'blob', color: '#C4B5FD' } },
    ],
    maxMembers: 5,
    duration: 30,
    timeLeft: 15,
  },
  {
    id: '3',
    name: 'Quiet Writing Hour',
    subject: '📚 English Lit • Essay Writing',
    tags: ['Humanities'],
    type: 'private',
    members: [
      { nickname: 'User6', avatar: { base: 'blob', color: '#B9E5FB' } },
    ],
    maxMembers: 5,
    duration: 60,
    timeLeft: 60,
    inviteCode: 'CLOUD123',
  },
  {
    id: '4',
    name: 'Calc Final Grind 💀',
    subject: '📐 Calculus III • Linear Algebra',
    tags: ['Math'],
    type: 'public',
    members: [
      { nickname: 'User7', avatar: { base: 'blob', color: '#B9E5FB' } },
      { nickname: 'User8', avatar: { base: 'animal', color: '#FDE68A' } },
      { nickname: 'User9', avatar: { base: 'blob', color: '#A7F3D0' } },
      { nickname: 'User10', avatar: { base: 'animal', color: '#F9A8D4' } },
    ],
    maxMembers: 5,
    duration: 25,
    timeLeft: 10,
  }
];

export const Lobby = ({ userData, onJoinRoom, onHostRoom, onOpenProfile }: LobbyProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', '💻 CS', '🧬 Bio', '📐 Math', '📚 Humanities'];

  const filteredRooms = MOCK_ROOMS.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          room.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || room.tags.some(tag => activeFilter.includes(tag));
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div 
      key="lobby"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="z-10 w-full max-w-5xl px-4"
    >
      <div className="relative mb-12 flex items-center justify-center">
        <div className="text-center">
          <span className="text-cloud-deep font-bold tracking-widest uppercase text-xs mb-2 block">Study Lobby</span>
          <h2 className="text-4xl font-bold text-cloud-deep">Find your room</h2>
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <button 
            onClick={onOpenProfile}
            className="flex items-center gap-3 bg-white/50 hover:bg-white p-2 pr-4 rounded-full transition-all shadow-sm group"
          >
            <Avatar 
              type={userData.avatar.base} 
              color={userData.avatar.color} 
              emoji={userData.avatar.emoji}
              size="sm" 
            />
            <div className="text-left hidden sm:block">
              <div className="text-[10px] font-black uppercase tracking-widest text-cloud-muted">My Profile</div>
              <div className="text-xs font-bold text-cloud-deep leading-tight">{userData.nickname || 'Student'}</div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cloud-muted w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by subject, room name..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 border-2 border-transparent focus:border-cloud-blue focus:outline-none transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeFilter === f ? 'bg-cloud-deep text-white shadow-md' : 'bg-white/50 text-cloud-muted hover:bg-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <button 
          onClick={onHostRoom}
          className="px-6 py-3 bg-cloud-deep text-white rounded-2xl font-bold hover:bg-cloud-deep/90 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" /> Host Room
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <motion.div 
            key={room.id}
            whileHover={{ y: -5 }}
            className="glass-card p-6 flex flex-col h-full group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-cloud-deep group-hover:text-cloud-blue transition-colors">{room.name}</h3>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${room.type === 'public' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {room.type}
              </span>
            </div>
            
            <p className="text-xs text-cloud-muted font-medium mb-4">{room.subject}</p>
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex -space-x-2">
                {room.members.map((m, i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs shadow-sm"
                    style={{ backgroundColor: m.avatar.color }}
                  >
                    {m.avatar.emoji || (m.avatar.base === 'blob' ? '☁️' : '🦊')}
                  </div>
                ))}
                {room.members.length < room.maxMembers && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-cloud-blue/10 flex items-center justify-center text-[10px] text-cloud-muted font-bold">
                    +
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold text-cloud-muted uppercase">{room.members.length}/{room.maxMembers} members</span>
            </div>

            <div className="mt-auto pt-4 border-t border-cloud-blue/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-cloud-muted font-bold">
                <Clock className="w-4 h-4" /> {room.timeLeft} min {room.timeLeft === room.duration ? 'session' : 'left'}
              </div>
              <button 
                onClick={() => onJoinRoom(room)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${room.type === 'private' ? 'bg-cloud-muted text-white' : 'bg-cloud-deep text-white hover:bg-cloud-deep/90 shadow-sm'}`}
              >
                {room.type === 'private' ? 'Request' : 'Join'}
              </button>
            </div>
          </motion.div>
        ))}

        <motion.button 
          whileHover={{ y: -5 }}
          onClick={onHostRoom}
          className="glass-card p-6 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-cloud-blue/30 bg-transparent hover:bg-white/20 transition-all min-h-[220px]"
        >
          <div className="text-4xl">☁️</div>
          <div className="text-center">
            <h3 className="font-bold text-cloud-deep">Host a new room</h3>
            <p className="text-xs text-cloud-muted">Private or public</p>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};
