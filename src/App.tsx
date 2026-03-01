/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';

// --- Types ---
import { AppState, UserData, UserProfile, Room } from './types';

// --- API ---
import { getToken, getMe, logout, updateMe } from './lib/api';
import type { ApiUser } from './lib/api';

// --- Components ---
import { CloudBackground } from './components/CloudBackground';
import logoImg from './data/logo.PNG';

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

function apiUserToUserData(u: ApiUser): UserData {
  return {
    ...INITIAL_USER_DATA,
    nickname: u.nickname ?? '',
    email: u.email ?? '',
    age: u.age ?? 20,
    gender: u.gender ?? 'prefer_not_to_say',
    major: u.major ?? '',
    buddyPreference: u.buddyPreference ?? 'any',
    avatar: {
      base: u.avatar?.base ?? 'blob',
      color: u.avatar?.color ?? '#B9E5FB',
      emoji: u.avatar?.emoji,
    },
  };
}

const INITIAL_USER_DATA: UserData = {
  nickname: '',
  email: '',
  age: 20,
  gender: 'prefer_not_to_say',
  major: '',
  classes: [],
  buddyPreference: 'any',
  avatar: { base: 'animal', color: '#B9E5FB', head: 'head1', clothes: 'clothes1' },
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
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);
  const [sessionChecked, setSessionChecked] = useState(false);

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
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Restore session on load
  useEffect(() => {
    if (getToken()) {
      getMe()
        .then(({ user }) => {
          setUserData(apiUserToUserData(user));
          setProfile((p) => ({
            ...p,
            nickname: user.nickname ?? '',
            preference: (user.preference as UserProfile['preference']) ?? 'silent',
            avatar: {
              ...p.avatar,
              ...user.avatar,
              accessory: (p.avatar as { accessory?: string }).accessory ?? 'none',
            },
          }));
          setState('profile');
        })
        .catch(() => {
          setState('intro');
        })
        .finally(() => setSessionChecked(true));
    } else {
      setSessionChecked(true);
    }
  }, []);

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
    logout().catch(() => {});
    setUserData(INITIAL_USER_DATA);
    setProfile({ nickname: '', ageRange: '18-22', preference: 'silent', avatar: { base: 'blob', color: '#B9E5FB', accessory: 'none' } });
    setState('intro');
    setCurrentRoom(null);
    setMessages([]);
  };

  const isLoggedIn = !['intro', 'auth', 'signup'].includes(state);

  if (!sessionChecked) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-cloud-deep/5">
        <div className="text-cloud-muted font-bold">Loading...</div>
      </div>
    );
  }

  const goHome = () => {
    if (isLoggedIn) setState('profile');
    else setState('intro');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 relative overflow-x-hidden">
      <CloudBackground />

      {/* Shared nav: logo = home; Log in / Log out */}
      <nav className="fixed top-0 left-0 right-0 w-full px-6 py-4 md:px-10 md:py-5 flex justify-between items-center z-50 bg-cloud-deep/5 backdrop-blur-sm border-b border-cloud-blue/10">
        <button
          type="button"
          onClick={goHome}
          className="flex items-center gap-2 hover:opacity-90 active:scale-95 transition-opacity"
          aria-label="Go to home"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
            <img src={logoImg} alt="Cloudy" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-cloud-deep tracking-tighter text-2xl hidden sm:block">Cloudy</span>
        </button>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-white/80 backdrop-blur-md text-cloud-deep border-2 border-cloud-blue/20 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:border-cloud-blue hover:shadow-xl transition-all active:scale-95"
          >
            Log out
          </button>
        ) : (
          <button
            onClick={() => { setAuthMode('signin'); setState('auth'); }}
            className="px-8 py-3 bg-white/80 backdrop-blur-md text-cloud-deep border-2 border-cloud-blue/20 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:border-cloud-blue hover:shadow-xl transition-all active:scale-95"
          >
            Log in
          </button>
        )}
      </nav>

      {/* Main content: padding so it sits below fixed nav */}
      <main className="flex-1 w-full pt-20 md:pt-24 pb-8 flex flex-col items-center overflow-y-auto">
        <AnimatePresence mode="wait">
        {state === 'intro' && (
          <Intro 
            onStart={() => { setAuthMode('signup'); setState('auth'); }} 
            onLogin={() => { setAuthMode('signin'); setState('auth'); }}
          />
        )}

        {state === 'auth' && (
          <Auth 
            key={authMode}
            mode={authMode}
            email={userData.email}
            setEmail={(email) => setUserData({ ...userData, email })}
            onVerify={(user) => {
              setUserData(apiUserToUserData(user));
              setProfile((p) => ({
                ...p,
                nickname: user.nickname ?? '',
                preference: (user.preference as UserProfile['preference']) ?? 'silent',
                avatar: { ...p.avatar, ...user.avatar, accessory: (p.avatar as { accessory?: string }).accessory ?? 'none' },
              }));
              setState(user.nickname?.trim() ? 'profile' : 'signup');
            }}
            onBack={goHome}
          />
        )}
        
        {state === 'signup' && (
          <SignUp 
            userData={userData}
            setUserData={setUserData}
            signupError={signupError}
            setSignupError={setSignupError}
            isEditing={isEditingProfile}
            onSave={async () => {
              if (!userData.nickname.trim() || !userData.major.trim() || !userData.email.trim()) {
                setSignupError('Please fill in all required fields.');
                return;
              }
              setSignupError('');
              try {
                const { user } = await updateMe({
                  nickname: userData.nickname,
                  major: userData.major,
                  email: userData.email,
                  age: userData.age,
                  gender: userData.gender,
                  avatar: userData.avatar,
                  buddyPreference: userData.buddyPreference,
                  preference: profile.preference,
                });
                setUserData(apiUserToUserData(user));
                setProfile((p) => ({ ...p, nickname: user.nickname ?? '', preference: (user.preference as UserProfile['preference']) ?? 'silent' }));
                setState('profile');
                setIsEditingProfile(false);
              } catch (err) {
                setSignupError(err instanceof Error ? err.message : 'Failed to save profile');
              }
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
      </main>
    </div>
  );
}
