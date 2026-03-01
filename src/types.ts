/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppState = 'intro' | 'auth' | 'signup' | 'profile' | 'lobby' | 'settings' | 'matching' | 'study' | 'stats';

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface UserData {
  nickname: string;
  email: string;
  age: number;
  gender: string;
  major: string;
  classes: string[];
  buddyPreference: string;
  avatar: {
    base: string;
    color: string;
    head?: 'head1' | 'head2' | 'head3';
    clothes?: 'clothes1' | 'clothes2' | 'clothes3';
  };
  stats: {
    totalHours: number;
    sessionsCompleted: number;
    dailyStreak: number;
    history: { date: string; hours: number }[];
  };
  goals: Goal[];
  todos: Todo[];
  currentSession: {
    type: 'private' | 'public';
    duration: number;
    startTime: number | null;
  };
}

export interface Room {
  id: string;
  name: string;
  subject: string;
  tags: string[];
  type: 'public' | 'private';
  members: { nickname: string; avatar: { base: string; color: string; head?: 'head1' | 'head2' | 'head3'; clothes?: 'clothes1' | 'clothes2' | 'clothes3' } }[];
  maxMembers: number;
  duration: number;
  timeLeft: number;
  inviteCode?: string;
}

export interface UserProfile {
  nickname: string;
  ageRange: string;
  preference: 'silent' | 'chat' | 'checkin';
  avatar: {
    base: string;
    color: string;
    accessory: string;
  };
}
