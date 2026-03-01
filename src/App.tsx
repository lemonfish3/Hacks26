/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';

// --- Types ---
import { AppState, UserData, UserProfile, Room } from './types';

// --- Components ---
import { CloudBackground } from './components/CloudBackground';

// --- Pages ---
import { Intro } from './pages/Intro';
import { Auth } from './pages/Auth';
import { SignUp } from './pages/SignUp';
import { Profile } from './pages/Profile';
import { Lobby } from './pages/Lobby';
import { Settings } from './pages/Settings';
import { Matching } from './pages/Matching';
import { StudyRoom } from './pages/StudyRoom';
import { Stats } from './pages/Stats';

const INITIAL_USER_DATA: UserData = {
  nickname: '',
  email: '',
  age: 20,
  gender: 'prefer_not_to_say',
  major: '',
  classes: [],
  buddyPreference: 'any',
  avatar: { base: 'blob', color: '#B9E5FB' },
  stats: {
    totalHours: 12.5,
    sessionsCompleted: 18,
    dailyStreak: 5,
    history: [
      { date: '2026-02-24', hours: 2.5 },
      { date: '2026-02-25', hours: 3.0 },
      { date: '2026-02-26', hours: 1.5 },
      { date: '2026-02-27', hours: 4.0 },
      { date: '2026-02-28', hours: 1.5 },
    ]
  },
  goals: [
    { id: '1', text: 'Study for 4 hours today', completed: false },
    { id: '2', text: 'Finish math assignment', completed: true },
  ],
  todos: [
    { id: '1', text: 'Read chapter 5', completed: false },
    { id: '2', text: 'Prepare for quiz', completed: false },
  ],
  currentSession: {
    type: 'public',
    duration: 30,
    startTime: null,
  }
};

export default function App() {
  const [state, setState] = useState<AppState>('intro');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);

  const [signupError, setSignupError] = useState('');
  const [profile, setProfile] = useState<UserProfile>({
    nickname: '',
    ageRange: '18-22',
    preference: 'silent',
    avatar: { base: 'blob', color: '#B9E5FB', accessory: 'none' }
  });
  const [sessionDuration, setSessionDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [reaction, setReaction] = useState('idle');
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Timer logic
  useEffect(() => {
    if (state === 'study' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (state === 'study' && timeLeft === 0) {
      setState('stats');
    }
  }, [state, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleJoinRoom = (room: Room) => {
    if (room.type === 'private') {
      alert('Request sent to join ' + room.name);
      return;
    }
    setCurrentRoom(room);
    setTimeLeft(room.timeLeft * 60);
    setState('study');
  };

  const handleHostRoom = () => {
    setState('settings');
  };

  const handleCreateRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: `${userData.nickname || 'Cloudy Student'}'s Space`,
      subject: 'Custom Subject',
      tags: ['General'],
      type: 'public',
      members: [],
      maxMembers: 5,
      duration: sessionDuration,
      timeLeft: sessionDuration,
      inviteCode: 'CLD-' + Math.floor(1000 + Math.random() * 9000)
    };
    setCurrentRoom(newRoom);
    setTimeLeft(sessionDuration * 60);
    setState('study');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages([...messages, { sender: 'me', text: inputText }]);
    setInputText('');
    // Mock partner response
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'SunnyStudy', text: 'Keep up the good work! ☁️' }]);
    }, 1500);
  };

  const toggleTodo = (id: string) => {
    setUserData(prev => ({
      ...prev,
      todos: prev.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const toggleGoal = (id: string) => {
    setUserData(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g)
    }));
  };

  const handleLogout = () => {
    setUserData(INITIAL_USER_DATA);
    setState('intro');
    setCurrentRoom(null);
    setMessages([]);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <CloudBackground />

      <AnimatePresence mode="wait">
        {state === 'intro' && (
          <Intro 
            onStart={() => setState('auth')} 
            onLogin={() => setState('auth')}
          />
        )}

        {state === 'auth' && (
          <Auth 
            email={userData.email}
            setEmail={(email) => setUserData({ ...userData, email })}
            onVerify={() => setState('signup')}
            onBack={() => setState('intro')}
          />
        )}
        
        {state === 'signup' && (
          <SignUp 
            userData={userData}
            setUserData={setUserData}
            signupError={signupError}
            setSignupError={setSignupError}
            isEditing={isEditingProfile}
            onSave={() => {
              if (!userData.nickname.trim() || !userData.major.trim() || !userData.email.trim()) {
                setSignupError('Please fill in all required fields.');
                return;
              }
              setState('profile');
              setIsEditingProfile(false);
            }}
            onBack={() => {
              if (isEditingProfile) {
                setState('profile');
                setIsEditingProfile(false);
              } else {
                setState('intro');
              }
            }}
          />
        )}

        {state === 'profile' && (
          <Profile 
            userData={userData} 
            onEnterLobby={() => setState('lobby')} 
            toggleGoal={toggleGoal}
            toggleTodo={toggleTodo}
            onEditProfile={() => {
              setIsEditingProfile(true);
              setState('signup');
            }}
            onLogout={handleLogout}
          />
        )}

        {state === 'lobby' && (
          <Lobby 
            userData={userData}
            onJoinRoom={handleJoinRoom}
            onHostRoom={handleHostRoom}
            onOpenProfile={() => setState('profile')}
          />
        )}

        {state === 'settings' && (
          <Settings 
            sessionDuration={sessionDuration}
            setSessionDuration={setSessionDuration}
            onCancel={() => setState('lobby')}
            onCreateRoom={handleCreateRoom}
          />
        )}

        {state === 'matching' && (
          <Matching userData={userData} profile={profile} />
        )}

        {state === 'study' && currentRoom && (
          <StudyRoom 
            userData={userData}
            room={currentRoom}
            timeLeft={timeLeft}
            formatTime={formatTime}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            reaction={reaction}
            setReaction={setReaction}
            messages={messages}
            inputText={inputText}
            setInputText={setInputText}
            onSendMessage={handleSendMessage}
            toggleTodo={toggleTodo}
            onSwitchPartner={() => setState('lobby')}
            onEndSession={() => setState('stats')}
          />
        )}

        {state === 'stats' && (
          <Stats 
            userData={userData}
            sessionDuration={sessionDuration}
            onReturnToLobby={() => setState('lobby')}
            onViewProfile={() => setState('profile')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
