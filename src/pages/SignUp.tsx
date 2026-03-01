/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Avatar } from '../components/Avatar';
import { UserData } from '../types';
import { ChevronLeft, Save } from 'lucide-react';

interface SignUpProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  signupError: string;
  setSignupError: (error: string) => void;
  onSave: () => void;
  onBack: () => void;
  isEditing?: boolean;
}

const animals = ["🐱", "🦊", "🐨", "🐸", "🦋", "🐙", "🦁", "🐼", "🦄", "🐺"];
const colors = ['#B9E5FB', '#FDE68A', '#A7F3D0', '#F9A8D4', '#C4B5FD', '#E2E8F0'];
const focusAreas = ["💻 CS / Tech", "🧬 Bio / Med", "📐 Math", "📚 Humanities", "🎨 Arts"];

export const SignUp = ({ userData, setUserData, signupError, setSignupError, onSave, onBack, isEditing }: SignUpProps) => {
  return (
    <motion.div 
      key="signup"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="z-10 w-full max-w-5xl px-4 py-8"
    >
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-cloud-muted hover:text-cloud-deep font-bold transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> {isEditing ? 'Back to Profile' : 'Back to Home'}
        </button>
        <h2 className="text-2xl font-black text-cloud-deep uppercase tracking-widest">
          {isEditing ? 'Edit Profile' : 'Avatar Creation'}
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Avatar Preview & Name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-12 flex flex-col items-center shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-cloud-blue/30" />
          
          <Avatar 
            type={userData.avatar.base} 
            color={userData.avatar.color} 
            emoji={userData.avatar.emoji}
            size="xl"
          />

          <div className="mt-12 w-full text-center">
            <input
              type="text"
              value={userData.nickname}
              onChange={(e) => setUserData({...userData, nickname: e.target.value})}
              placeholder="Your Nickname"
              className="text-3xl font-black text-center border-b-4 bg-transparent outline-none mb-2 w-full border-cloud-blue text-cloud-deep placeholder:text-cloud-blue/30"
            />
            <div className="text-xs font-bold text-cloud-muted uppercase tracking-widest">
              Tap to rename
            </div>
          </div>

          <div className="mt-8 w-full space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-cloud-muted mb-1 ml-1">Age</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 rounded-xl border-2 border-cloud-blue/20 bg-white/50 focus:border-cloud-blue focus:outline-none transition-all text-sm font-bold"
                  value={userData.age}
                  onChange={(e) => setUserData({...userData, age: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-cloud-muted mb-1 ml-1">Gender</label>
                <select 
                  className="w-full px-4 py-2 rounded-xl border-2 border-cloud-blue/20 bg-white/50 focus:border-cloud-blue focus:outline-none transition-all text-sm font-bold"
                  value={userData.gender}
                  onChange={(e) => setUserData({...userData, gender: e.target.value})}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non_binary">Non-binary</option>
                  <option value="prefer_not_to_say">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-cloud-muted mb-1 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="you@university.edu"
                className="w-full px-4 py-2 rounded-xl border-2 border-cloud-blue/20 bg-white/50 focus:border-cloud-blue focus:outline-none transition-all text-sm font-bold"
                value={userData.email}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-cloud-muted mb-1 ml-1">Major / Field</label>
              <input 
                type="text" 
                placeholder="e.g. Computer Science"
                className="w-full px-4 py-2 rounded-xl border-2 border-cloud-blue/20 bg-white/50 focus:border-cloud-blue focus:outline-none transition-all text-sm font-bold"
                value={userData.major}
                onChange={(e) => setUserData({...userData, major: e.target.value})}
              />
            </div>
          </div>
        </motion.div>

        {/* Right Column: Customization Controls */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-4xl font-black text-cloud-deep leading-tight mb-2">
              Be an animal.<br />Study better.
            </h3>
            <p className="text-cloud-muted font-medium">Customize your digital presence for the library.</p>
          </div>

          {/* Animal Selection */}
          <div>
            <label className="uppercase tracking-widest text-[10px] font-black block mb-4 text-cloud-muted">
              Choose your animal
            </label>
            <div className="grid grid-cols-5 gap-3">
              {animals.map((animal) => (
                <button
                  key={animal}
                  onClick={() => setUserData({...userData, avatar: {...userData.avatar, emoji: animal, base: 'animal'}})}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 border-4 ${userData.avatar.emoji === animal ? 'bg-cloud-blue border-cloud-deep scale-110 shadow-lg' : 'bg-white/50 border-transparent hover:bg-white'}`}
                >
                  {animal}
                </button>
              ))}
              <button
                onClick={() => setUserData({...userData, avatar: {...userData.avatar, emoji: undefined, base: 'blob'}})}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 border-4 ${!userData.avatar.emoji ? 'bg-cloud-blue border-cloud-deep scale-110 shadow-lg' : 'bg-white/50 border-transparent hover:bg-white'}`}
              >
                ☁️
              </button>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="uppercase tracking-widest text-[10px] font-black block mb-4 text-cloud-muted">
              Avatar color
            </label>
            <div className="grid grid-cols-6 gap-4">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setUserData({...userData, avatar: {...userData.avatar, color}})}
                  className={`w-10 h-10 rounded-full transition-all duration-200 border-4 ${userData.avatar.color === color ? 'border-cloud-deep scale-125 shadow-md' : 'border-white hover:scale-110'}`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>

          {/* Focus Area */}
          <div>
            <label className="uppercase tracking-widest text-[10px] font-black block mb-4 text-cloud-muted">
              Your focus area
            </label>
            <div className="flex flex-wrap gap-2">
              {focusAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setUserData({...userData, major: area.split(' ').slice(1).join(' ')})}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border-2 ${userData.major.includes(area.split(' ').slice(1).join(' ')) ? 'bg-cloud-deep text-white border-cloud-deep shadow-md' : 'bg-white/50 text-cloud-muted border-transparent hover:bg-white'}`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            {signupError && <p className="text-xs text-red-500 mb-4 font-bold">{signupError}</p>}
            <button 
              onClick={onSave}
              className="w-full py-5 bg-cloud-deep text-white rounded-2xl font-black text-lg hover:bg-cloud-deep/90 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <Save className="w-6 h-6" /> {isEditing ? 'Save Changes' : 'Save & Enter Lobby'}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
