/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, RefreshCw, LogOut, User, Mic, MicOff, 
  MessageCircle, Smile, Send, BookOpen, Settings,
  Copy, Check, Share2, Plus
} from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { UserData, Room } from '../types';

interface StudyRoomProps {
  userData: UserData;
  room: Room;
  timeLeft: number;
  formatTime: (s: number) => string;
  isMuted: boolean;
  setIsMuted: (m: boolean) => void;
  messages: { sender: string, text: string }[];
  inputText: string;
  setInputText: (t: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  toggleTodo: (id: string) => void;
  onSwitchPartner: () => void;
  onEndSession: () => void;
}

export const StudyRoom = ({
  userData,
  room,
  timeLeft,
  formatTime,
  isMuted,
  setIsMuted,
  messages,
  inputText,
  setInputText,
  onSendMessage,
  toggleTodo,
  onSwitchPartner,
  onEndSession
}: StudyRoomProps) => {
  const [copied, setCopied] = useState(false);
  const [roomColor, setRoomColor] = useState('#f8fafc'); // Default bg color
  const [showSettings, setShowSettings] = useState(false);

  const copyInviteCode = () => {
    const code = room.inviteCode || 'CLD-5521';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colors = ['#f8fafc', '#f0f9ff', '#f5f3ff', '#fff7ed', '#f0fdf4'];

  return (
    <motion.div 
      key="study"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="z-10 w-full h-full max-w-7xl flex flex-col md:flex-row gap-6 items-stretch p-4"
      style={{ backgroundColor: roomColor + '80' }} // Semi-transparent overlay
    >
      {/* Main Study Space */}
      <div className="flex-1 glass-card p-8 flex flex-col relative overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8 z-10">
          <div className="flex items-center gap-4">
            <div className="bg-white/80 px-6 py-3 rounded-full shadow-sm flex items-center gap-3">
              <Clock className="w-5 h-5 text-cloud-deep" />
              <span className="text-2xl font-display font-bold tabular-nums">{formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full text-xs font-bold text-cloud-deep shadow-sm">
              <Share2 className="w-3 h-3" />
              <span>Invite: {room.inviteCode || 'CLD-5521'}</span>
              <button onClick={copyInviteCode} className="hover:text-cloud-blue transition-colors">
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 bg-white/80 rounded-full hover:bg-white transition-colors shadow-sm"
              title="Room Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={onEndSession}
              className="p-3 bg-cloud-deep text-white rounded-full hover:bg-cloud-deep/90 transition-colors shadow-sm"
              title="End Session"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Room Settings Overlay */}
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-24 right-8 z-20 glass-card p-4 shadow-xl border border-cloud-blue/20"
          >
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-cloud-deep">Room Background</h4>
            <div className="flex gap-2">
              {colors.map(c => (
                <button 
                  key={c}
                  onClick={() => setRoomColor(c)}
                  className={`w-6 h-6 rounded-full border-2 ${roomColor === c ? 'border-cloud-deep' : 'border-white'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Avatars Area - Grid for up to 5 users */}
        <div className="flex-1 flex flex-wrap items-center justify-center gap-12 relative p-8">
          {/* Current User */}
          <div className="text-center">
            <Avatar 
              type={userData.avatar.base} 
              color={userData.avatar.color} 
              emoji={userData.avatar.emoji}
              size="md" 
            />
            <p className="mt-4 font-bold text-sm">{userData.nickname || 'You'}</p>
            <span className="text-[10px] bg-cloud-blue/30 px-2 py-1 rounded-full text-cloud-deep font-bold">Host</span>
          </div>

          {/* Other Members */}
          {room.members.map((member, i) => (
            <div key={i} className="text-center">
              <Avatar 
                type={member.avatar.base} 
                color={member.avatar.color} 
                emoji={member.avatar.emoji}
                size="md" 
              />
              <p className="mt-4 font-bold text-sm">{member.nickname}</p>
              <span className="text-[10px] bg-cloud-blue/30 px-2 py-1 rounded-full text-cloud-deep font-bold">Studying</span>
            </div>
          ))}

          {/* Empty Slots */}
          {Array.from({ length: Math.max(0, 4 - room.members.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="text-center opacity-20">
              <div className="w-24 h-24 border-2 border-dashed border-cloud-blue rounded-[40%] flex items-center justify-center">
                <Plus className="w-6 h-6 text-cloud-blue" />
              </div>
              <p className="mt-4 font-bold text-sm text-cloud-muted">Empty Slot</p>
            </div>
          ))}
        </div>

        {/* Bottom Controls */}
        <div className="mt-8 flex items-center justify-between z-10">
          <div className="flex gap-4">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-2xl transition-all flex items-center gap-2 ${isMuted ? 'bg-cloud-muted/20 text-cloud-muted' : 'bg-cloud-deep text-white shadow-lg'}`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              <span className="font-bold">{isMuted ? 'Muted' : 'Speaking'}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-cloud-muted text-sm font-bold">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              {room.members.length + 1} Users Online
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel (Tasks & Chat) */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        {/* Tasks Panel */}
        <div className="glass-card p-6 flex-1 flex flex-col">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Session Tasks
          </h3>
          <div className="space-y-3 overflow-y-auto flex-1 pr-2">
            {userData.todos.map(todo => (
              <button 
                key={todo.id}
                onClick={() => toggleTodo(todo.id)}
                className="w-full p-3 rounded-xl bg-white/30 flex items-center gap-3 text-left hover:bg-white/50 transition-all group"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${todo.completed ? 'bg-cloud-deep border-cloud-deep' : 'border-cloud-blue'}`}>
                  {todo.completed && <Send className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm ${todo.completed ? 'line-through text-cloud-muted' : 'font-medium'}`}>{todo.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="glass-card p-6 h-80 flex flex-col">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Group Chat
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                <div className="text-[10px] text-cloud-muted mb-1 px-1">{msg.sender === 'me' ? 'You' : msg.sender}</div>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'me' ? 'bg-cloud-deep text-white rounded-tr-none' : 'bg-white text-cloud-deep rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={onSendMessage} className="relative">
            <input 
              type="text" 
              placeholder="Message group..."
              className="w-full pl-4 pr-12 py-3 rounded-xl bg-white/50 border-2 border-transparent focus:border-cloud-blue focus:outline-none text-sm"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cloud-deep hover:bg-cloud-blue/20 rounded-lg transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};
